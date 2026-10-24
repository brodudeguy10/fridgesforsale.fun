/* ============================================================
   FRIDGE PALACE: renderer, post, quality, resize, frame loop
============================================================ */
import * as THREE from '../lib/three.module.min.js';
import { EffectComposer } from '../lib/addons/postprocessing/EffectComposer.js';
import { RenderPass } from '../lib/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../lib/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from '../lib/addons/postprocessing/OutputPass.js';
import { ShaderPass } from '../lib/addons/postprocessing/ShaderPass.js';
import { RoomEnvironment } from '../lib/addons/environments/RoomEnvironment.js';

/* a last pass for the drunk wobble, the vignette and a touch of film grain */
const FinishShader = {
  uniforms: { tDiffuse:{ value:null }, uTime:{ value:0 }, uDrunk:{ value:0 }, uVig:{ value:0.9 }, uGrain:{ value:0.035 }, uFlash:{ value:0 }, uTint:{ value:new THREE.Vector3(1,1,1) }, uSat:{ value:1 }, uChroma:{ value:0 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uTime, uDrunk, uVig, uGrain, uFlash, uSat, uChroma; uniform vec3 uTint; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
    void main(){
      vec2 uv = vUv;
      float d = uDrunk;
      uv += vec2(sin(uTime*1.3 + uv.y*6.0), cos(uTime*1.1 + uv.x*5.0))*0.006*d;
      vec4 c = texture2D(tDiffuse, uv);
      if(d > 0.01){
        vec2 o = vec2(sin(uTime*0.7), cos(uTime*0.9))*0.012*d;
        vec4 g = texture2D(tDiffuse, uv + o);
        c = mix(c, g, 0.45*min(1.0, d));
        c.rgb *= 1.0 + 0.08*d*sin(uTime*2.0);
      }
      if(uChroma > 0.0){ c.r = texture2D(tDiffuse, uv + vec2(uChroma, 0.0)).r; c.b = texture2D(tDiffuse, uv - vec2(uChroma, 0.0)).b; }
      float l = dot(c.rgb, vec3(0.299, 0.587, 0.114)); c.rgb = mix(vec3(l), c.rgb, uSat);
      c.rgb *= uTint;
      vec2 q = vUv - 0.5;
      c.rgb *= mix(1.0, smoothstep(0.85, 0.2, length(q)*(1.0 + d*0.35)), uVig);
      c.rgb += (h(vUv*vec2(1920.0,1080.0) + fract(uTime)) - 0.5)*uGrain;
      c.rgb = mix(c.rgb, vec3(1.0), uFlash);
      gl_FragColor = c;
    }`
};

export class Engine {
  constructor(C, mount){
    this.C = C;
    this.mount = mount;
    this.quality = C.save.settings.quality || 'auto';
    const canvas = document.createElement('canvas');
    canvas.id = 'fp-canvas';
    mount.appendChild(canvas);
    this.canvas = canvas;
    let r = null;
    try{ r = new THREE.WebGLRenderer({ canvas, antialias:false, powerPreference:'high-performance', stencil:false }); }
    catch(e){ throw new Error('webgl'); }
    this.renderer = r;
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 0.95;
    r.shadowMap.enabled = false;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x07060a);
    this.scene.fog = new THREE.Fog(0x120a14, 26, 70);
    this.camera = new THREE.PerspectiveCamera(72, 1, 0.05, 160);
    this.scene.add(this.camera);
    /* the gun in your hands lives in its own little scene, drawn after the
       world with a cleared depth buffer, so it never clips into walls */
    this.vmScene = new THREE.Scene();
    this.vmCamera = new THREE.PerspectiveCamera(58, 1, 0.01, 10);
    this.vmScene.add(this.vmCamera);
    this.afterRender = [];
    /* reflections for the gold and the chrome come from a generated room */
    const pm = new THREE.PMREMGenerator(r);
    const env = new RoomEnvironment(r);
    this.envMap = pm.fromScene(env, 0.035).texture;
    this.scene.environment = this.envMap;
    this.vmScene.environment = this.envMap;
    this.scene.environmentIntensity = 0.55;
    env.dispose(); pm.dispose();
    this.clock = new THREE.Clock();
    this.updaters = [];
    this.t = 0;
    this.fpsAcc = 0; this.fpsN = 0; this.fps = 60; this.scale = 1;
    this.setupPost();
    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    this.resize();
  }
  isMobile(){ return (navigator.maxTouchPoints > 0 && Math.min(innerWidth, innerHeight) < 900) || innerWidth < 760; }
  preset(){
    let q = this.quality;
    if(q === 'auto') q = this.isMobile() ? 'low' : 'high';
    return q;
  }
  setupPost(){
    const r = this.renderer, q = this.preset();
    if(this.composer){ this.composer.dispose && this.composer.dispose(); }
    const rt = new THREE.WebGLRenderTarget(4, 4, { type:THREE.HalfFloatType, samples: q === 'low' ? 0 : 4 });
    this.composer = new EffectComposer(r, rt);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.vmPass = new RenderPass(this.vmScene, this.vmCamera); this.vmPass.clear = false; this.vmPass.clearDepth = true;
    this.vmPass.enabled = !!this.vmOn;
    this.composer.addPass(this.vmPass);
    this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.55, 0.5, 0.9);
    this.bloom.enabled = q !== 'low';
    this.composer.addPass(this.bloom);
    this.finish = new ShaderPass(FinishShader);
    this.composer.addPass(this.finish);
    this.composer.addPass(new OutputPass());
    this.finish.uniforms.uGrain.value = q === 'low' ? 0.02 : 0.035;
  }
  setQuality(q){ this.quality = q; this.C.save.settings.quality = q; this.C.save.write(); this.setupPost(); this.resize(); }
  resize(){
    const w = this.mount.clientWidth || innerWidth, h = this.mount.clientHeight || innerHeight;
    const q = this.preset();
    const base = q === 'low' ? Math.min(1.25, devicePixelRatio) : q === 'med' ? Math.min(1.5, devicePixelRatio) : Math.min(2, devicePixelRatio);
    this.pr = base*this.scale;
    this.renderer.setPixelRatio(this.pr);
    this.renderer.setSize(w, h, false);
    this.canvas.style.width = w + 'px'; this.canvas.style.height = h + 'px';
    this.composer.setPixelRatio(this.pr);
    this.composer.setSize(w, h);
    this.bloom.setSize(Math.round(w*this.pr/2), Math.round(h*this.pr/2));
    this.camera.aspect = w/h;
    this.camera.fov = w/h < 0.8 ? 82 : 72;
    this.camera.updateProjectionMatrix();
    this.vmCamera.aspect = w/h; this.vmCamera.fov = w/h < 0.8 ? 70 : 58; this.vmCamera.updateProjectionMatrix();
  }
  on(fn){ this.updaters.push(fn); return fn; }
  off(fn){ const i = this.updaters.indexOf(fn); if(i >= 0) this.updaters.splice(i, 1); }
  start(){
    if(this.running) return;
    this.running = true; this.clock.getDelta();
    const loop = ()=>{
      if(!this.running) return;
      this.raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, this.clock.getDelta());
      this.t += dt;
      for(let i=0;i<this.updaters.length;i++){ try{ this.updaters[i](dt, this.t); }catch(e){ console.error(e); } }
      this.finish.uniforms.uTime.value = this.t;
      this.vmPass.enabled = !!this.vmOn;
      this.composer.render(dt);
      /* anything that needs the finished frame (the heist's last screenshot) reads it here,
         before the browser clears the drawing buffer */
      if(this.afterRender.length){ const a = this.afterRender.splice(0); a.forEach(f=>{ try{ f(this.canvas); }catch(e){ console.error(e); } }); }
      this.adapt(dt);
    };
    loop();
  }
  stop(){ this.running = false; cancelAnimationFrame(this.raf); }
  /* advance the world without drawing (used by tests and by the blackout skip) */
  tick(dt, n){ for(let k=0;k<(n || 1);k++){ this.t += dt; for(let i=0;i<this.updaters.length;i++){ try{ this.updaters[i](dt, this.t); }catch(e){ console.error(e); } } } }
  /* dynamic resolution: if frames drag, render fewer pixels */
  adapt(dt){
    this.fpsAcc += dt; this.fpsN++;
    if(this.fpsAcc < 2) return;
    this.fps = this.fpsN/this.fpsAcc; this.fpsAcc = 0; this.fpsN = 0;
    const old = this.scale;
    if(this.fps < 40 && this.scale > 0.55) this.scale = Math.max(0.55, this.scale - 0.12);
    else if(this.fps > 57 && this.scale < 1) this.scale = Math.min(1, this.scale + 0.06);
    if(old !== this.scale) this.resize();
  }
  dispose(){
    this.stop();
    window.removeEventListener('resize', this.resize);
    try{ this.renderer.dispose(); this.renderer.forceContextLoss(); }catch(e){}
    this.canvas.remove();
  }
}
