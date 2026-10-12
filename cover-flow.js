// Local refraction in a fixed photograph, with softly fading pointer ripples.
window.startCoverFlow = function(cover) {
 const image=cover.querySelector('.cover-background');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 if(reduce.matches)return ()=>{};
 const canvas=document.createElement('canvas');
 canvas.className='cover-flow';canvas.setAttribute('aria-hidden','true');
 const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
 if(!gl)return ()=>{};
 const vertex=`attribute vec2 position;varying vec2 uv;void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
 const fragment=`precision mediump float;
 varying vec2 uv;uniform sampler2D photo;uniform vec2 crop;uniform float time;uniform float aspect;uniform vec3 ripples[8];
 void main(){
  vec2 p=uv;vec2 q=vec2(p.x*aspect,p.y);
  // Broad, slow, overlapping currents: no whole-frame panning or zoom animation.
  vec2 flow=vec2(sin(q.y*8.+sin(q.x*3.-time*.19)+time*.28),cos(q.x*6.+sin(q.y*5.+time*.15)-time*.23));
  flow+=.45*vec2(sin(q.y*15.-q.x*4.-time*.34),sin(q.x*11.+q.y*3.+time*.21));
  vec2 offset=flow*.008;
  for(int i=0;i<8;i++){
   float age=time-ripples[i].z;
   vec2 delta=(p-ripples[i].xy)*vec2(aspect,1.);
   float distance=length(delta);
   float radius=age*.19;
   float band=exp(-pow((distance-radius)*15.,2.));
   float fade=exp(-age*1.4)*smoothstep(0.,.12,age);
   float wave=sin((distance-radius)*42.);
   offset+=delta/(distance+.03)*vec2(1./aspect,1.)*wave*band*fade*.018;
  }
  vec2 sampleUV=(p+offset-.5)*crop+.5;
  gl_FragColor=texture2D(photo,clamp(sampleUV,vec2(.002),vec2(.998)));
 }`;
 const shaders=[];
 function compile(type,source){const s=gl.createShader(type);shaders.push(s);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Cover shader unavailable');return s}
 let program,buffer,texture;
 try{
  program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Cover shader unavailable');
  gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const pos=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
  texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 }catch(e){shaders.forEach(s=>gl.deleteShader(s));if(program)gl.deleteProgram(program);return ()=>{}}
 const u={};['crop','time','aspect','ripples[0]'].forEach(n=>u[n]=gl.getUniformLocation(program,n));
 const points=new Float32Array(24);for(let i=0;i<8;i++)points[i*3+2]=-100;
 let dead=false,ready=false,visible=true,frame=0,last=0,index=0,lastPointer=0;
 const start=performance.now();
 cover.insertBefore(canvas,image.nextSibling);
 function size(){const r=cover.getBoundingClientRect(),dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));gl.viewport(0,0,canvas.width,canvas.height);
  const a=r.width/r.height,b=image.naturalWidth/image.naturalHeight;
  gl.uniform2f(u.crop,(a<b?a/b:1)*.96,(a>b?b/a:1)*.96);gl.uniform1f(u.aspect,a);
 }
 function draw(now){frame=0;if(dead||!ready||!visible||document.hidden)return;
  if(now-last>30){last=now;gl.uniform1f(u.time,(now-start)/1000);gl.uniform3fv(u['ripples[0]'],points);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);canvas.classList.add('ready')}
  frame=requestAnimationFrame(draw);
 }
 function resume(){if(!frame&&ready&&visible&&!document.hidden&&!dead)frame=requestAnimationFrame(draw)}
 function load(){if(dead||!image.naturalWidth)return;gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);ready=true;size();resume()}
 function pointer(e){const now=performance.now();if(now-lastPointer<100||e.target.closest('a,button'))return;lastPointer=now;
  const r=cover.getBoundingClientRect(),i=(index++%8)*3;points[i]=(e.clientX-r.left)/r.width;points[i+1]=1-(e.clientY-r.top)/r.height;points[i+2]=(now-start)/1000;
 }
 const ro=new ResizeObserver(()=>{if(ready)size()});ro.observe(cover);
 const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;resume()});io.observe(cover);
 cover.addEventListener('pointermove',pointer,{passive:true});cover.addEventListener('pointerdown',pointer,{passive:true});
 document.addEventListener('visibilitychange',resume);
 image.addEventListener('load',load,{once:true});if(image.complete)load();
 function cleanup(){if(dead)return;dead=true;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();cover.removeEventListener('pointermove',pointer);cover.removeEventListener('pointerdown',pointer);document.removeEventListener('visibilitychange',resume);image.removeEventListener('load',load);reduce.removeEventListener('change',cleanup);canvas.remove();gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s))}
 reduce.addEventListener('change',cleanup);canvas.addEventListener('webglcontextlost',cleanup,{once:true});return cleanup;
};
