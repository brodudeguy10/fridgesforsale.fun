const jh=(function(){const e=typeof document<"u"&&document.createElement("link").relList;return e&&e.supports&&e.supports("modulepreload")?"modulepreload":"preload"})(),eu=function(r,e){return new URL(r,e).href},ol={},tu=function(e,t,n){let i=Promise.resolve();if(t&&t.length>0){let c=function(h){return Promise.all(h.map(u=>Promise.resolve(u).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const a=document.getElementsByTagName("link"),o=document.querySelector("meta[property=csp-nonce]"),l=o?.nonce||o?.getAttribute("nonce");i=c(t.map(h=>{if(h=eu(h,n),h in ol)return;ol[h]=!0;const u=h.endsWith(".css"),f=u?'[rel="stylesheet"]':"";if(n)for(let m=a.length-1;m>=0;m--){const _=a[m];if(_.href===h&&(!u||_.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${f}`))return;const d=document.createElement("link");if(d.rel=u?"stylesheet":jh,u||(d.as="script"),d.crossOrigin="",d.href=h,l&&d.setAttribute("nonce",l),document.head.appendChild(d),u)return new Promise((m,_)=>{d.addEventListener("load",m),d.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${h}`)))})}))}function s(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return i.then(a=>{for(const o of a||[])o.status==="rejected"&&s(o.reason);return e().catch(s)})};const Eo="187",nu=0,ll=1,iu=2,Tr=1,su=2,bs=3,ei=0,jt=1,pn=2,Zi=0,As=1,cl=2,hl=3,ul=4,ru=5,Yi=100,au=101,ou=102,lu=103,cu=104,hu=200,uu=201,fu=202,du=203,Fc=204,Oc=205,pu=206,mu=207,gu=208,vu=209,_u=210,xu=211,Mu=212,Su=213,yu=214,Ia=0,Da=1,Na=2,Ls=3,Ua=4,Fa=5,Oa=6,za=7,zc=0,bu=1,Tu=2,On=0,Bc=1,kc=2,Gc=3,Hc=4,Vc=5,Wc=6,Xc=7,fl="attached",Eu="detached",qc=300,ts=301,Is=302,Zr=303,$r=304,Ri=1e3,Yt=1001,Ir=1002,vt=1003,Yc=1004,Ts=1005,ut=1006,Er=1007,mn=1008,Qt=1009,Kc=1010,Zc=1011,Ds=1012,wo=1013,Bn=1014,gn=1015,rn=1016,Ao=1017,Ro=1018,ns=1020,$c=35902,Jc=35899,Qc=1021,jc=1022,sn=1023,mi=1026,di=1027,Co=1028,Po=1029,Ci=1030,Lo=1031,Io=1033,wr=33776,Ar=33777,Rr=33778,Cr=33779,Ba=35840,ka=35841,Ga=35842,Ha=35843,Va=36196,Wa=37492,Xa=37496,qa=37488,Ya=37489,Dr=37490,Ka=37491,Za=37808,$a=37809,Ja=37810,Qa=37811,ja=37812,eo=37813,to=37814,no=37815,io=37816,so=37817,ro=37818,ao=37819,oo=37820,lo=37821,co=36492,ho=36494,uo=36495,fo=36283,po=36284,Nr=36285,mo=36286,Ns=2300,Us=2301,Jr=2302,dl=2303,pl=2400,ml=2401,gl=2402,wu=2500,Au=0,eh=1,go=2,Ru=3200,vo=0,Cu=1,wn="",Ut="srgb",en="srgb-linear",Ur="linear",nt="srgb",Qr=7680,Pu=519,Lu=512,Iu=513,Du=514,th=515,Nu=516,Uu=517,nh=518,ih=519,sh=35044,vl="300 es",Rn=2e3,Fs=2001;function Fu(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function Ou(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function Os(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function zu(){const r=Os("canvas");return r.style.display="block",r}const _l={};function Fr(...r){const e="THREE."+r.shift();console.log(e,...r)}function rh(r){const e=r[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=r[1];t&&t.isStackTrace?r[0]+=" "+t.getLocation():r[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return r}function we(...r){r=rh(r);const e="THREE."+r.shift();{const t=r[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...r)}}function De(...r){r=rh(r);const e="THREE."+r.shift();{const t=r[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...r)}}function $i(...r){const e=r.join(" ");e in _l||(_l[e]=!0,we(...r))}function Bu(r,e,t){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}const ku={[Ia]:Ia,[Na]:Oa,[Ua]:Ua,[Ls]:Fa,[Da]:Da,[Oa]:Na,[za]:za,[Fa]:Ls};class Pi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let s=0,a=i.length;s<a;s++)i[s].call(this,e);e.target=null}}}const Gt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let xl=1234567;const Rs=Math.PI/180,is=180/Math.PI;function kn(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Gt[r&255]+Gt[r>>8&255]+Gt[r>>16&255]+Gt[r>>24&255]+"-"+Gt[e&255]+Gt[e>>8&255]+"-"+Gt[e>>16&15|64]+Gt[e>>24&255]+"-"+Gt[t&63|128]+Gt[t>>8&255]+"-"+Gt[t>>16&255]+Gt[t>>24&255]+Gt[n&255]+Gt[n>>8&255]+Gt[n>>16&255]+Gt[n>>24&255]).toLowerCase()}function We(r,e,t){return Math.max(e,Math.min(t,r))}function Do(r,e){return(r%e+e)%e}function Gu(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)}function Hu(r,e,t){return r!==e?(t-r)/(e-r):0}function Cs(r,e,t){return(1-t)*r+t*e}function Vu(r,e,t,n){return Cs(r,e,1-Math.exp(-t*n))}function Wu(r,e=1){return e-Math.abs(Do(r,e*2)-e)}function Xu(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function qu(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function Yu(r,e){return r+Math.floor(Math.random()*(e-r+1))}function Ku(r,e){return r+Math.random()*(e-r)}function Zu(r){return r*(.5-Math.random())}function $u(r){r!==void 0&&(xl=r);let e=xl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Ju(r){return r*Rs}function Qu(r){return r*is}function ju(r){return r>0&&Number.isInteger(r)&&2**Math.round(Math.log2(r))===r}function ef(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function ah(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function tf(r,e,t,n,i){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+n)/2),h=a((e+n)/2),u=s((e-n)/2),f=a((e-n)/2),d=s((n-e)/2),m=a((n-e)/2);switch(i){case"XYX":r.set(o*h,l*u,l*f,o*c);break;case"YZY":r.set(l*f,o*h,l*u,o*c);break;case"ZXZ":r.set(l*u,l*f,o*h,o*c);break;case"XZX":r.set(o*h,l*m,l*d,o*c);break;case"YXY":r.set(l*d,o*h,l*m,o*c);break;case"ZYZ":r.set(l*m,l*d,o*h,o*c);break;default:we("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Hr(r){switch(r.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function No(r,e){if(e.constructor===Float32Array)return r;const t=Hr(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(r/t,-1)}function Uo(r,e){if(e.constructor===Float32Array)return r;const t=Hr(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(r*t)}const nf={DEG2RAD:Rs,RAD2DEG:is,generateUUID:kn,clamp:We,euclideanModulo:Do,mapLinear:Gu,inverseLerp:Hu,lerp:Cs,damp:Vu,pingpong:Wu,smoothstep:Xu,smootherstep:qu,randInt:Yu,randFloat:Ku,randFloatSpread:Zu,seededRandom:$u,degToRad:Ju,radToDeg:Qu,isPowerOfTwo:ju,ceilPowerOfTwo:ef,floorPowerOfTwo:ah,setQuaternionFromProperEuler:tf,normalize:Uo,denormalize:No};class Ue{static{this.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(We(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*i+e.x,this.y=s*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ti{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],f=s[a+0],d=s[a+1],m=s[a+2],_=s[a+3];if(u!==_||l!==f||c!==d||h!==m){let g=l*f+c*d+h*m+u*_;g<0&&(f=-f,d=-d,m=-m,_=-_,g=-g);let p=1-o;if(g<.9995){const x=Math.acos(g),y=Math.sin(x);p=Math.sin(p*x)/y,o=Math.sin(o*x)/y,l=l*p+f*o,c=c*p+d*o,h=h*p+m*o,u=u*p+_*o}else{l=l*p+f*o,c=c*p+d*o,h=h*p+m*o,u=u*p+_*o;const x=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=x,c*=x,h*=x,u*=x}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,s,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=s[a],f=s[a+1],d=s[a+2],m=s[a+3];return e[t]=o*m+h*u+l*d-c*f,e[t+1]=l*m+h*f+c*u-o*d,e[t+2]=c*m+h*d+o*f-l*u,e[t+3]=h*m-o*u-l*f-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(s/2),f=l(n/2),d=l(i/2),m=l(s/2);switch(a){case"XYZ":this._x=f*h*u+c*d*m,this._y=c*d*u-f*h*m,this._z=c*h*m+f*d*u,this._w=c*h*u-f*d*m;break;case"YXZ":this._x=f*h*u+c*d*m,this._y=c*d*u-f*h*m,this._z=c*h*m-f*d*u,this._w=c*h*u+f*d*m;break;case"ZXY":this._x=f*h*u-c*d*m,this._y=c*d*u+f*h*m,this._z=c*h*m+f*d*u,this._w=c*h*u-f*d*m;break;case"ZYX":this._x=f*h*u-c*d*m,this._y=c*d*u+f*h*m,this._z=c*h*m-f*d*u,this._w=c*h*u+f*d*m;break;case"YZX":this._x=f*h*u+c*d*m,this._y=c*d*u+f*h*m,this._z=c*h*m-f*d*u,this._w=c*h*u-f*d*m;break;case"XZY":this._x=f*h*u-c*d*m,this._y=c*d*u-f*h*m,this._z=c*h*m+f*d*u,this._w=c*h*u+f*d*m;break;default:we("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=n+o+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(s-c)*d,this._z=(a-i)*d}else if(n>o&&n>u){const d=2*Math.sqrt(1+n-o-u);this._w=(h-l)/d,this._x=.25*d,this._y=(i+a)/d,this._z=(s+c)/d}else if(o>u){const d=2*Math.sqrt(1+o-n-u);this._w=(s-c)/d,this._x=(i+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+u-n-o);this._w=(a-i)/d,this._x=(s+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(We(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-s*l,this._y=i*h+a*l+s*o-n*c,this._z=s*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-s*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,s=-s,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class z{static{this.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ml.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ml.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),h=2*(o*t-s*i),u=2*(s*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-s*u,this.z=i+l*u+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-s*o,this.y=s*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return jr.copy(this).projectOnVector(e),this.sub(jr)}reflect(e){return this.sub(jr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(We(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const jr=new z,Ml=new ti;class Be{static{this.prototype.isMatrix3=!0}constructor(e,t,n,i,s,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c)}set(e,t,n,i,s,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],d=n[5],m=n[8],_=i[0],g=i[3],p=i[6],x=i[1],y=i[4],M=i[7],w=i[2],E=i[5],v=i[8];return s[0]=a*_+o*x+l*w,s[3]=a*g+o*y+l*E,s[6]=a*p+o*M+l*v,s[1]=c*_+h*x+u*w,s[4]=c*g+h*y+u*E,s[7]=c*p+h*M+u*v,s[2]=f*_+d*x+m*w,s[5]=f*g+d*y+m*E,s[8]=f*p+d*M+m*v,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*s*h+n*o*l+i*s*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,f=o*l-h*s,d=c*s-a*l,m=t*u+n*f+i*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/m;return e[0]=u*_,e[1]=(i*c-h*n)*_,e[2]=(o*n-i*a)*_,e[3]=f*_,e[4]=(h*t-i*l)*_,e[5]=(i*s-o*t)*_,e[6]=d*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return $i("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(ea.makeScale(e,t)),this}rotate(e){return $i("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(ea.makeRotation(-e)),this}translate(e,t){return $i("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(ea.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ea=new Be,Sl=new Be().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),yl=new Be().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function sf(){const r={enabled:!0,workingColorSpace:en,spaces:{},convert:function(i,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===nt&&(i.r=jn(i.r),i.g=jn(i.g),i.b=jn(i.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===nt&&(i.r=Ji(i.r),i.g=Ji(i.g),i.b=Ji(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===wn?Ur:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,a){return i.copy(this.spaces[a].fromXYZ).multiply(this.spaces[s].toXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[en]:{primaries:e,whitePoint:n,transfer:Ur,toXYZ:Sl,fromXYZ:yl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ut},outputColorSpaceConfig:{drawingBufferColorSpace:Ut}},[Ut]:{primaries:e,whitePoint:n,transfer:nt,toXYZ:Sl,fromXYZ:yl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ut}}}),r}const Xe=sf();function jn(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Ji(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Li;class rf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Li===void 0&&(Li=Os("canvas")),Li.width=e.width,Li.height=e.height;const i=Li.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Li}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Os("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let a=0;a<s.length;a++)s[a]=jn(s[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(jn(t[n]/255)*255):t[n]=jn(t[n]);return{data:t,width:e.width,height:e.height}}else return we("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let af=0;class Fo{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:af++}),this.uuid=kn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?s.push(ta(i[a].image)):s.push(ta(i[a]))}else s=ta(i);n.url=s}return t||(e.images[this.uuid]=n),n}}function ta(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?rf.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(we("Texture: Unable to serialize Texture."),{})}let of=0;const na=new z;class Mt extends Pi{constructor(e=Mt.DEFAULT_IMAGE,t=Mt.DEFAULT_MAPPING,n=Yt,i=Yt,s=ut,a=mn,o=sn,l=Qt,c=Mt.DEFAULT_ANISOTROPY,h=wn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:of++}),this.uuid=kn(),this.name="",this.source=new Fo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ue(0,0),this.repeat=new Ue(1,1),this.center=new Ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Be,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(na).x}get height(){return this.source.getSize(na).y}get depth(){return this.source.getSize(na).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){we(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){we(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==qc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ri:e.x=e.x-Math.floor(e.x);break;case Yt:e.x=e.x<0?0:1;break;case Ir:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ri:e.y=e.y-Math.floor(e.y);break;case Yt:e.y=e.y<0?0:1;break;case Ir:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Mt.DEFAULT_IMAGE=null;Mt.DEFAULT_MAPPING=qc;Mt.DEFAULT_ANISOTROPY=1;class Ze{static{this.prototype.isVector4=!0}constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s;const l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],m=l[9],_=l[2],g=l[6],p=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-_)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+_)<.1&&Math.abs(m+g)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(c+1)/2,M=(d+1)/2,w=(p+1)/2,E=(h+f)/4,v=(u+_)/4,T=(m+g)/4;return y>M&&y>w?y<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(y),i=E/n,s=v/n):M>w?M<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(M),n=E/i,s=T/i):w<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(w),n=v/s,i=T/s),this.set(n,i,s,t),this}let x=Math.sqrt((g-m)*(g-m)+(u-_)*(u-_)+(f-h)*(f-h));return Math.abs(x)<.001&&(x=1),this.x=(g-m)/x,this.y=(u-_)/x,this.z=(f-h)/x,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this.w=We(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this.w=We(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class lf extends Pi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ut,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Ze(0,0,e,t),this.scissorTest=!1,this.viewport=new Ze(0,0,e,t),this.textures=[];const i=n.count;for(let s=0;s<i;s++)this.textures[s]=new Mt({width:e,height:t,depth:n.depth}),this.textures[s].isRenderTargetTexture=!0,this.textures[s].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:ut,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new Fo(i)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class _n extends lf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class oh extends Mt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=vt,this.minFilter=vt,this.wrapR=Yt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class cf extends Mt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=vt,this.minFilter=vt,this.wrapR=Yt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}class Oe{static{this.prototype.isMatrix4=!0}constructor(e,t,n,i,s,a,o,l,c,h,u,f,d,m,_,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c,h,u,f,d,m,_,g)}set(e,t,n,i,s,a,o,l,c,h,u,f,d,m,_,g){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=s,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=m,p[11]=_,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Oe().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,i=1/Ii.setFromMatrixColumn(e,0).length(),s=1/Ii.setFromMatrixColumn(e,1).length(),a=1/Ii.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){const f=a*h,d=a*u,m=o*h,_=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=d+m*c,t[5]=f-_*c,t[9]=-o*l,t[2]=_-f*c,t[6]=m+d*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*h,d=l*u,m=c*h,_=c*u;t[0]=f+_*o,t[4]=m*o-d,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=d*o-m,t[6]=_+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*h,d=l*u,m=c*h,_=c*u;t[0]=f-_*o,t[4]=-a*u,t[8]=m+d*o,t[1]=d+m*o,t[5]=a*h,t[9]=_-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*h,d=a*u,m=o*h,_=o*u;t[0]=l*h,t[4]=m*c-d,t[8]=f*c+_,t[1]=l*u,t[5]=_*c+f,t[9]=d*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,d=a*c,m=o*l,_=o*c;t[0]=l*h,t[4]=_-f*u,t[8]=m*u+d,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=d*u+m,t[10]=f-_*u}else if(e.order==="XZY"){const f=a*l,d=a*c,m=o*l,_=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+_,t[5]=a*h,t[9]=d*u-m,t[2]=m*u-d,t[6]=o*h,t[10]=_*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(hf,e,uf)}lookAt(e,t,n){const i=this.elements;return tn.subVectors(e,t),tn.lengthSq()===0&&(tn.z=1),tn.normalize(),ri.crossVectors(n,tn),ri.lengthSq()===0&&(Math.abs(n.z)===1?tn.x+=1e-4:tn.z+=1e-4,tn.normalize(),ri.crossVectors(n,tn)),ri.normalize(),Ys.crossVectors(tn,ri),i[0]=ri.x,i[4]=Ys.x,i[8]=tn.x,i[1]=ri.y,i[5]=Ys.y,i[9]=tn.y,i[2]=ri.z,i[6]=Ys.z,i[10]=tn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],d=n[13],m=n[2],_=n[6],g=n[10],p=n[14],x=n[3],y=n[7],M=n[11],w=n[15],E=i[0],v=i[4],T=i[8],I=i[12],R=i[1],P=i[5],F=i[9],G=i[13],C=i[2],V=i[6],q=i[10],W=i[14],D=i[3],O=i[7],Y=i[11],te=i[15];return s[0]=a*E+o*R+l*C+c*D,s[4]=a*v+o*P+l*V+c*O,s[8]=a*T+o*F+l*q+c*Y,s[12]=a*I+o*G+l*W+c*te,s[1]=h*E+u*R+f*C+d*D,s[5]=h*v+u*P+f*V+d*O,s[9]=h*T+u*F+f*q+d*Y,s[13]=h*I+u*G+f*W+d*te,s[2]=m*E+_*R+g*C+p*D,s[6]=m*v+_*P+g*V+p*O,s[10]=m*T+_*F+g*q+p*Y,s[14]=m*I+_*G+g*W+p*te,s[3]=x*E+y*R+M*C+w*D,s[7]=x*v+y*P+M*V+w*O,s[11]=x*T+y*F+M*q+w*Y,s[15]=x*I+y*G+M*W+w*te,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],d=e[14],m=e[3],_=e[7],g=e[11],p=e[15],x=l*d-c*f,y=o*d-c*u,M=o*f-l*u,w=a*d-c*h,E=a*f-l*h,v=a*u-o*h;return t*(_*x-g*y+p*M)-n*(m*x-g*w+p*E)+i*(m*y-_*w+p*v)-s*(m*M-_*E+g*v)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(s*h-o*l)+i*(s*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],d=e[11],m=e[12],_=e[13],g=e[14],p=e[15],x=t*o-n*a,y=t*l-i*a,M=t*c-s*a,w=n*l-i*o,E=n*c-s*o,v=i*c-s*l,T=h*_-u*m,I=h*g-f*m,R=h*p-d*m,P=u*g-f*_,F=u*p-d*_,G=f*p-d*g,C=x*G-y*F+M*P+w*R-E*I+v*T;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const V=1/C;return e[0]=(o*G-l*F+c*P)*V,e[1]=(i*F-n*G-s*P)*V,e[2]=(_*v-g*E+p*w)*V,e[3]=(f*E-u*v-d*w)*V,e[4]=(l*R-a*G-c*I)*V,e[5]=(t*G-i*R+s*I)*V,e[6]=(g*M-m*v-p*y)*V,e[7]=(h*v-f*M+d*y)*V,e[8]=(a*F-o*R+c*T)*V,e[9]=(n*R-t*F-s*T)*V,e[10]=(m*E-_*M+p*x)*V,e[11]=(u*M-h*E-d*x)*V,e[12]=(o*I-a*P-l*T)*V,e[13]=(t*P-n*I+i*T)*V,e[14]=(_*y-m*w-g*x)*V,e[15]=(h*w-u*y+f*x)*V,this}scale(e){const t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,a){return this.set(1,n,s,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,u=o+o,f=s*c,d=s*h,m=s*u,_=a*h,g=a*u,p=o*u,x=l*c,y=l*h,M=l*u,w=n.x,E=n.y,v=n.z;return i[0]=(1-(_+p))*w,i[1]=(d+M)*w,i[2]=(m-y)*w,i[3]=0,i[4]=(d-M)*E,i[5]=(1-(f+p))*E,i[6]=(g+x)*E,i[7]=0,i[8]=(m+y)*v,i[9]=(g-x)*v,i[10]=(1-(f+_))*v,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];const s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let a=Ii.set(i[0],i[1],i[2]).length();const o=Ii.set(i[4],i[5],i[6]).length(),l=Ii.set(i[8],i[9],i[10]).length();s<0&&(a=-a),Sn.copy(this);const c=1/a,h=1/o,u=1/l;return Sn.elements[0]*=c,Sn.elements[1]*=c,Sn.elements[2]*=c,Sn.elements[4]*=h,Sn.elements[5]*=h,Sn.elements[6]*=h,Sn.elements[8]*=u,Sn.elements[9]*=u,Sn.elements[10]*=u,t.setFromRotationMatrix(Sn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,i,s,a,o=Rn,l=!1){const c=this.elements,h=2*s/(t-e),u=2*s/(n-i),f=(t+e)/(t-e),d=(n+i)/(n-i);let m,_;if(l)m=s/(a-s),_=a*s/(a-s);else if(o===Rn)m=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===Fs)m=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,s,a,o=Rn,l=!1){const c=this.elements,h=2/(t-e),u=2/(n-i),f=-(t+e)/(t-e),d=-(n+i)/(n-i);let m,_;if(l)m=1/(a-s),_=a/(a-s);else if(o===Rn)m=-2/(a-s),_=-(a+s)/(a-s);else if(o===Fs)m=-1/(a-s),_=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=m,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Ii=new z,Sn=new Oe,hf=new z(0,0,0),uf=new z(1,1,1),ri=new z,Ys=new z,tn=new z,bl=new Oe,Tl=new ti;class gi{constructor(e=0,t=0,n=0,i=gi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,s=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],f=i[6],d=i[10];switch(t){case"XYZ":this._y=Math.asin(We(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-We(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(We(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-We(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(We(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-We(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,d),this._y=0);break;default:we("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return bl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(bl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Tl.setFromEuler(this),this.setFromQuaternion(Tl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}gi.DEFAULT_ORDER="XYZ";class lh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let ff=0;const El=new z,Di=new ti,Hn=new Oe,Ks=new z,fs=new z,df=new z,pf=new ti,wl=new z(1,0,0),Al=new z(0,1,0),Rl=new z(0,0,1),Cl={type:"added"},mf={type:"removed"},Ni={type:"childadded",child:null},ia={type:"childremoved",child:null};class mt extends Pi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ff++}),this.uuid=kn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=mt.DEFAULT_UP.clone();const e=new z,t=new gi,n=new ti,i=new z(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Oe},normalMatrix:{value:new Be}}),this.matrix=new Oe,this.matrixWorld=new Oe,this.matrixAutoUpdate=mt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new lh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Di.setFromAxisAngle(e,t),this.quaternion.multiply(Di),this}rotateOnWorldAxis(e,t){return Di.setFromAxisAngle(e,t),this.quaternion.premultiply(Di),this}rotateX(e){return this.rotateOnAxis(wl,e)}rotateY(e){return this.rotateOnAxis(Al,e)}rotateZ(e){return this.rotateOnAxis(Rl,e)}translateOnAxis(e,t){return El.copy(e).applyQuaternion(this.quaternion),this.position.add(El.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(wl,e)}translateY(e){return this.translateOnAxis(Al,e)}translateZ(e){return this.translateOnAxis(Rl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Hn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ks.copy(e):Ks.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),fs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Hn.lookAt(fs,Ks,this.up):Hn.lookAt(Ks,fs,this.up),this.quaternion.setFromRotationMatrix(Hn),i&&(Hn.extractRotation(i.matrixWorld),Di.setFromRotationMatrix(Hn),this.quaternion.premultiply(Di.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(De("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Cl),Ni.child=e,this.dispatchEvent(Ni),Ni.child=null):De("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(mf),ia.child=e,this.dispatchEvent(ia),ia.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Hn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Hn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Hn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Cl),Ni.child=e,this.dispatchEvent(Ni),Ni.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fs,e,df),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fs,pf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,i=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*i,s[13]+=n-s[1]*t-s[5]*n-s[9]*i,s[14]+=i-s[2]*t-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));i.material=o}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),f=a(e.skeletons),d=a(e.animations),m=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),m.length>0&&(n.nodes=m)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}mt.DEFAULT_UP=new z(0,1,0);mt.DEFAULT_MATRIX_AUTO_UPDATE=!0;mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class vn extends mt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const gf={type:"move"};class sa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new vn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new vn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new vn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const g=t.getJointPose(_,n),p=this._getHandJoint(c,_);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.quaternion,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,m=.005;c.inputState.pinching&&f>d+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=d-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(gf)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new vn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const ch={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ai={h:0,s:0,l:0},Zs={h:0,s:0,l:0};function ra(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class Ne{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ut){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Xe.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=Xe.workingColorSpace){return this.r=e,this.g=t,this.b=n,Xe.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=Xe.workingColorSpace){if(e=Do(e,1),t=We(t,0,1),n=We(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=ra(a,s,e+1/3),this.g=ra(a,s,e),this.b=ra(a,s,e-1/3)}return Xe.colorSpaceToWorking(this,i),this}setStyle(e,t=Ut){function n(s){s!==void 0&&parseFloat(s)<1&&we("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseFloat(s[1]))/100,Math.min(100,parseFloat(s[2]))/100,Math.min(100,parseFloat(s[3]))/100,t);break;case"hsl":case"hsla":if(s=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:we("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=i[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);we("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ut){const n=ch[e.toLowerCase()];return n!==void 0?this.setHex(n,t):we("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=jn(e.r),this.g=jn(e.g),this.b=jn(e.b),this}copyLinearToSRGB(e){return this.r=Ji(e.r),this.g=Ji(e.g),this.b=Ji(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ut){return Xe.workingToColorSpace(Ht.copy(this),e),Math.round(We(Ht.r*255,0,255))*65536+Math.round(We(Ht.g*255,0,255))*256+Math.round(We(Ht.b*255,0,255))}getHexString(e=Ut){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Xe.workingColorSpace){Xe.workingToColorSpace(Ht.copy(this),t);const n=Ht.r,i=Ht.g,s=Ht.b,a=Math.max(n,i,s),o=Math.min(n,i,s);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(i-s)/u+(i<s?6:0);break;case i:l=(s-n)/u+2;break;case s:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Xe.workingColorSpace){return Xe.workingToColorSpace(Ht.copy(this),t),e.r=Ht.r,e.g=Ht.g,e.b=Ht.b,e}getStyle(e=Ut){Xe.workingToColorSpace(Ht.copy(this),e);const t=Ht.r,n=Ht.g,i=Ht.b;return e!==Ut?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(ai),this.setHSL(ai.h+e,ai.s+t,ai.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ai),e.getHSL(Zs);const n=Cs(ai.h,Zs.h,t),i=Cs(ai.s,Zs.s,t),s=Cs(ai.l,Zs.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ht=new Ne;Ne.NAMES=ch;class _o extends mt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new gi,this.environmentIntensity=1,this.environmentRotation=new gi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const yn=new z,Vn=new z,aa=new z,Wn=new z,Ui=new z,Fi=new z,Pl=new z,oa=new z,la=new z,ca=new z,ha=new Ze,ua=new Ze,fa=new Ze;class An{constructor(e=new z,t=new z,n=new z){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),yn.subVectors(e,t),i.cross(yn);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){yn.subVectors(i,t),Vn.subVectors(n,t),aa.subVectors(e,t);const a=yn.dot(yn),o=yn.dot(Vn),l=yn.dot(aa),c=Vn.dot(Vn),h=Vn.dot(aa),u=a*c-o*o;if(u===0)return s.set(0,0,0),null;const f=1/u,d=(c*l-o*h)*f,m=(a*h-o*l)*f;return s.set(1-d-m,m,d)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Wn)===null?!1:Wn.x>=0&&Wn.y>=0&&Wn.x+Wn.y<=1}static getInterpolation(e,t,n,i,s,a,o,l){return this.getBarycoord(e,t,n,i,Wn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Wn.x),l.addScaledVector(a,Wn.y),l.addScaledVector(o,Wn.z),l)}static getInterpolatedAttribute(e,t,n,i,s,a){return ha.setScalar(0),ua.setScalar(0),fa.setScalar(0),ha.fromBufferAttribute(e,t),ua.fromBufferAttribute(e,n),fa.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(ha,s.x),a.addScaledVector(ua,s.y),a.addScaledVector(fa,s.z),a}static isFrontFacing(e,t,n,i){return yn.subVectors(n,t),Vn.subVectors(e,t),yn.cross(Vn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return yn.subVectors(this.c,this.b),Vn.subVectors(this.a,this.b),yn.cross(Vn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return An.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return An.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return An.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return An.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return An.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,s=this.c;let a,o;Ui.subVectors(i,n),Fi.subVectors(s,n),oa.subVectors(e,n);const l=Ui.dot(oa),c=Fi.dot(oa);if(l<=0&&c<=0)return t.copy(n);la.subVectors(e,i);const h=Ui.dot(la),u=Fi.dot(la);if(h>=0&&u<=h)return t.copy(i);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0&&l-h>0)return a=l/(l-h),t.copy(n).addScaledVector(Ui,a);ca.subVectors(e,s);const d=Ui.dot(ca),m=Fi.dot(ca);if(m>=0&&d<=m)return t.copy(s);const _=d*c-l*m;if(_<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(n).addScaledVector(Fi,o);const g=h*m-d*u;if(g<=0&&u-h>=0&&d-m>=0)return Pl.subVectors(s,i),o=(u-h)/(u-h+(d-m)),t.copy(i).addScaledVector(Pl,o);const p=1/(g+_+f);return a=_*p,o=f*p,t.copy(n).addScaledVector(Ui,a).addScaledVector(Fi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class ni{constructor(e=new z(1/0,1/0,1/0),t=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(bn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(bn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=bn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,bn):bn.fromBufferAttribute(s,a),bn.applyMatrix4(e.matrixWorld),this.expandByPoint(bn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),$s.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),$s.copy(n.boundingBox)),$s.applyMatrix4(e.matrixWorld),this.union($s)}const i=e.children;for(let s=0,a=i.length;s<a;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,bn),bn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ds),Js.subVectors(this.max,ds),Oi.subVectors(e.a,ds),zi.subVectors(e.b,ds),Bi.subVectors(e.c,ds),oi.subVectors(zi,Oi),li.subVectors(Bi,zi),Si.subVectors(Oi,Bi);let t=[0,-oi.z,oi.y,0,-li.z,li.y,0,-Si.z,Si.y,oi.z,0,-oi.x,li.z,0,-li.x,Si.z,0,-Si.x,-oi.y,oi.x,0,-li.y,li.x,0,-Si.y,Si.x,0];return!da(t,Oi,zi,Bi,Js)||(t=[1,0,0,0,1,0,0,0,1],!da(t,Oi,zi,Bi,Js))?!1:(Qs.crossVectors(oi,li),t=[Qs.x,Qs.y,Qs.z],da(t,Oi,zi,Bi,Js))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,bn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(bn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Xn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Xn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Xn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Xn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Xn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Xn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Xn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Xn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Xn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Xn=[new z,new z,new z,new z,new z,new z,new z,new z],bn=new z,$s=new ni,Oi=new z,zi=new z,Bi=new z,oi=new z,li=new z,Si=new z,ds=new z,Js=new z,Qs=new z,yi=new z;function da(r,e,t,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){yi.fromArray(r,s);const o=i.x*Math.abs(yi.x)+i.y*Math.abs(yi.y)+i.z*Math.abs(yi.z),l=e.dot(yi),c=t.dot(yi),h=n.dot(yi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Zn=vf();function vf(){const r=new ArrayBuffer(4),e=new Float32Array(r),t=new Uint32Array(r),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,i[l]=24,i[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,i[l]=-c-1,i[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,i[l]=13,i[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,i[l]=24,i[l|256]=24):(n[l]=31744,n[l|256]=64512,i[l]=13,i[l|256]=13)}const s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,s[l]=c|h}for(let l=1024;l<2048;++l)s[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:s,exponentTable:a,offsetTable:o}}function _f(r){Math.abs(r)>65504&&we("DataUtils.toHalfFloat(): Value out of range."),r=We(r,-65504,65504),Zn.floatView[0]=r;const e=Zn.uint32View[0],t=e>>23&511;return Zn.baseTable[t]+((e&8388607)>>Zn.shiftTable[t])}function xf(r){const e=r>>10;return Zn.uint32View[0]=Zn.mantissaTable[Zn.offsetTable[e]+(r&1023)]+Zn.exponentTable[e],Zn.floatView[0]}class Ll{static toHalfFloat(e){return _f(e)}static fromHalfFloat(e){return xf(e)}}const xt=new z,js=new Ue;let Mf=0;class ht extends Pi{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Mf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=sh,this.updateRanges=[],this.gpuType=gn,this.version=0,this._normalizationScale=e!==void 0?Hr(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)js.fromBufferAttribute(this,t),js.applyMatrix3(e),this.setXY(t,js.x,js.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)xt.fromBufferAttribute(this,t),xt.applyMatrix3(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)xt.fromBufferAttribute(this,t),xt.applyMatrix4(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)xt.fromBufferAttribute(this,t),xt.applyNormalMatrix(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)xt.fromBufferAttribute(this,t),xt.transformDirection(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),i=this._normalize(i),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):No(e,this.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):Uo(e,this.array)}}class hh extends ht{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class uh extends ht{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class St extends ht{constructor(e,t,n){super(new Float32Array(e),t,n)}}const Sf=new ni,ps=new z,pa=new z;class xn{constructor(e=new z,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Sf.setFromPoints(e).getCenter(n);let i=0;for(let s=0,a=e.length;s<a;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ps.subVectors(e,this.center);const t=ps.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(ps,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(pa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ps.copy(e.center).add(pa)),this.expandByPoint(ps.copy(e.center).sub(pa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let yf=0;const hn=new Oe,ma=new mt,ki=new z,nn=new ni,ms=new ni,Dt=new z;class Ct extends Pi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:yf++}),this.uuid=kn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Fu(e)?uh:hh)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Be().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return hn.makeRotationFromQuaternion(e),this.applyMatrix4(hn),this}rotateX(e){return hn.makeRotationX(e),this.applyMatrix4(hn),this}rotateY(e){return hn.makeRotationY(e),this.applyMatrix4(hn),this}rotateZ(e){return hn.makeRotationZ(e),this.applyMatrix4(hn),this}translate(e,t,n){return hn.makeTranslation(e,t,n),this.applyMatrix4(hn),this}scale(e,t,n){return hn.makeScale(e,t,n),this.applyMatrix4(hn),this}lookAt(e){return ma.lookAt(e),ma.updateMatrix(),this.applyMatrix4(ma.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ki).negate(),this.translate(ki.x,ki.y,ki.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,s=e.length;i<s;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new St(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&we("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ni);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){De("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const s=t[n];nn.setFromBufferAttribute(s),this.morphTargetsRelative?(Dt.addVectors(this.boundingBox.min,nn.min),this.boundingBox.expandByPoint(Dt),Dt.addVectors(this.boundingBox.max,nn.max),this.boundingBox.expandByPoint(Dt)):(this.boundingBox.expandByPoint(nn.min),this.boundingBox.expandByPoint(nn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&De('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new xn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){De("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new z,1/0);return}if(e){const n=this.boundingSphere.center;if(nn.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];ms.setFromBufferAttribute(o),this.morphTargetsRelative?(Dt.addVectors(nn.min,ms.min),nn.expandByPoint(Dt),Dt.addVectors(nn.max,ms.max),nn.expandByPoint(Dt)):(nn.expandByPoint(ms.min),nn.expandByPoint(ms.max))}nn.getCenter(n);let i=0;for(let s=0,a=e.count;s<a;s++)Dt.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Dt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Dt.fromBufferAttribute(o,c),l&&(ki.fromBufferAttribute(e,c),Dt.add(ki)),i=Math.max(i,n.distanceToSquared(Dt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&De('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){De("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,s=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new ht(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[],c=new Uint8Array(n.count);for(let I=0;I<n.count;I++)o[I]=new z,l[I]=new z;const h=new z,u=new z,f=new z,d=new Ue,m=new Ue,_=new Ue,g=new z,p=new z;function x(I,R,P){c[I]=c[R]=c[P]=1,h.fromBufferAttribute(n,I),u.fromBufferAttribute(n,R),f.fromBufferAttribute(n,P),d.fromBufferAttribute(s,I),m.fromBufferAttribute(s,R),_.fromBufferAttribute(s,P),u.sub(h),f.sub(h),m.sub(d),_.sub(d);const F=1/(m.x*_.y-_.x*m.y);isFinite(F)&&(g.copy(u).multiplyScalar(_.y).addScaledVector(f,-m.y).multiplyScalar(F),p.copy(f).multiplyScalar(m.x).addScaledVector(u,-_.x).multiplyScalar(F),o[I].add(g),o[R].add(g),o[P].add(g),l[I].add(p),l[R].add(p),l[P].add(p))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let I=0,R=y.length;I<R;++I){const P=y[I],F=P.start,G=P.count;for(let C=F,V=F+G;C<V;C+=3)x(e.getX(C+0),e.getX(C+1),e.getX(C+2))}const M=new z,w=new z,E=new z,v=new z;function T(I){E.fromBufferAttribute(i,I),v.copy(E);const R=o[I];M.copy(R),M.sub(E.multiplyScalar(E.dot(R))).normalize(),w.crossVectors(v,R);const F=w.dot(l[I])<0?-1:1;a.setXYZW(I,M.x,M.y,M.z,F)}for(let I=0,R=n.count;I<R;++I)c[I]&&T(I);this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new ht(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const i=new z,s=new z,a=new z,o=new z,l=new z,c=new z,h=new z,u=new z;if(e)for(let f=0,d=e.count;f<d;f+=3){const m=e.getX(f+0),_=e.getX(f+1),g=e.getX(f+2);i.fromBufferAttribute(t,m),s.fromBufferAttribute(t,_),a.fromBufferAttribute(t,g),h.subVectors(a,s),u.subVectors(i,s),h.cross(u),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,g),o.add(h),l.add(h),c.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let f=0,d=t.count;f<d;f+=3)i.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),h.subVectors(a,s),u.subVectors(i,s),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Dt.fromBufferAttribute(e,t),Dt.normalize(),e.setXYZ(t,Dt.x,Dt.y,Dt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h);let d=0,m=0;for(let _=0,g=l.length;_<g;_++){o.isInterleavedBufferAttribute?d=l[_]*o.data.stride+o.offset:d=l[_]*h;for(let p=0;p<h;p++)f[m++]=c[d++]}return new ht(f,h,u)}if(this.index===null)return we("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ct,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let h=0,u=c.length;h<u;h++){const f=c[h],d=e(f,n);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const d=c[u];h.push(d.toJSON(e.data))}h.length>0&&(i[l]=h,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const s=e.morphAttributes;for(const c in s){const h=[],u=s[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class bf{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=sh,this.updateRanges=[],this.version=0,this.uuid=kn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});const t=Il(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);const n=new this.array.constructor(e.arrayBuffers[t]),i=new this.constructor(n,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});const t=Il(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));const n={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}}function Il(r){return r.buffer._uuid===void 0&&(r.buffer._uuid=kn()),r.byteOffset===0&&r.byteLength===r.buffer.byteLength?r.buffer._uuid:r.buffer._uuid+":"+r.byteOffset+":"+r.byteLength}const Xt=new z;class Oo{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i,this._normalizationScale=e!==void 0?Hr(e.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Xt.fromBufferAttribute(this,t),Xt.applyMatrix4(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Xt.fromBufferAttribute(this,t),Xt.applyNormalMatrix(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Xt.fromBufferAttribute(this,t),Xt.transformDirection(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),i=this._normalize(i)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),i=this._normalize(i),s=this._normalize(s)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){Fr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new ht(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Oo(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Fr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):No(e,this.data.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):Uo(e,this.data.array)}}const ga=new z,Tf=new z,Ef=new Be;class ui{constructor(e=new z(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=ga.subVectors(n,t).cross(Tf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const i=e.delta(ga),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Ef.getNormalMatrix(e),i=this.coplanarPoint(ga).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let wf=0;class zn extends Pi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:wf++}),this.uuid=kn(),this.name="",this.type="Material",this.blending=As,this.side=ei,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Fc,this.blendDst=Oc,this.blendEquation=Yi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ne(0,0,0),this.blendAlpha=0,this.depthFunc=Ls,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Pu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Qr,this.stencilZFail=Qr,this.stencilZPass=Qr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){we(`Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){we(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=i(e.textures),a=i(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ne().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new ui().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Ue().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ue().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const qn=new z,va=new z,er=new z,tr=new z;class Vr{constructor(e=new z,t=new z(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,qn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=qn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(qn.copy(this.origin).addScaledVector(this.direction,t),qn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){va.copy(e).add(t).multiplyScalar(.5),er.copy(t).sub(e).normalize(),tr.copy(this.origin).sub(va);const s=e.distanceTo(t)*.5,a=-this.direction.dot(er),o=tr.dot(this.direction),l=-tr.dot(er),c=tr.lengthSq(),h=Math.abs(1-a*a);let u,f,d,m;if(h>0)if(u=a*l-o,f=a*o-l,m=s*h,u>=0)if(f>=-m)if(f<=m){const _=1/h;u*=_,f*=_,d=u*(u+a*f+2*o)+f*(a*u+f+2*l)+c}else f=s,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;else f=-s,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;else f<=-m?(u=Math.max(0,-(-a*s+o)),f=u>0?-s:Math.min(Math.max(-s,-l),s),d=-u*u+f*(f+2*l)+c):f<=m?(u=0,f=Math.min(Math.max(-s,-l),s),d=f*(f+2*l)+c):(u=Math.max(0,-(a*s+o)),f=u>0?s:Math.min(Math.max(-s,-l),s),d=-u*u+f*(f+2*l)+c);else f=a>0?-s:s,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(va).addScaledVector(er,f),d}intersectSphere(e,t){if(e.radius<0)return null;qn.subVectors(e.center,this.origin);const n=qn.dot(this.direction),i=qn.dot(qn)-n*n,s=e.radius*e.radius;if(i>s)return null;const a=Math.sqrt(s-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,i=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,i=(e.min.x-f.x)*c),h>=0?(s=(e.min.y-f.y)*h,a=(e.max.y-f.y)*h):(s=(e.max.y-f.y)*h,a=(e.min.y-f.y)*h),n>a||s>i||((s>n||isNaN(n))&&(n=s),(a<i||isNaN(i))&&(i=a),u>=0?(o=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(o=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,qn)!==null}intersectTriangle(e,t,n,i,s){const a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,u=e.x-a.x,f=e.y-a.y,d=e.z-a.z,m=t.x-a.x,_=t.y-a.y,g=t.z-a.z,p=n.x-a.x,x=n.y-a.y,y=n.z-a.z,M=Math.abs(l),w=Math.abs(c),E=Math.abs(h);let v,T,I,R,P,F,G,C,V,q,W,D;if(M>=w&&M>=E?(I=l,F=u,V=m,D=p,l>=0?(v=c,T=h,R=f,P=d,G=_,C=g,q=x,W=y):(v=h,T=c,R=d,P=f,G=g,C=_,q=y,W=x)):w>=E?(I=c,F=f,V=_,D=x,c>=0?(v=h,T=l,R=d,P=u,G=g,C=m,q=y,W=p):(v=l,T=h,R=u,P=d,G=m,C=g,q=p,W=y)):(I=h,F=d,V=g,D=y,h>=0?(v=l,T=c,R=u,P=f,G=m,C=_,q=p,W=x):(v=c,T=l,R=f,P=u,G=_,C=m,q=x,W=p)),I===0)return null;const O=v/I,Y=T/I,te=1/I,xe=R-O*F,Pe=P-Y*F,$=G-O*V,de=C-Y*V,Me=q-O*D,Re=W-Y*D,me=Me*de-Re*$,Ie=xe*Re-Pe*Me,ft=$*Pe-de*xe;if(i){if(me<0||Ie<0||ft<0)return null}else if((me<0||Ie<0||ft<0)&&(me>0||Ie>0||ft>0))return null;const Te=me+Ie+ft;if(Te===0)return null;const Qe=te*(me*F+Ie*V+ft*D);return(Te>0?Qe<0:Qe>0)?null:this.at(Qe/Te,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ki extends zn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gi,this.combine=zc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Dl=new Oe,bi=new Vr,nr=new xn,Nl=new z,ir=new z,sr=new z,rr=new z,_a=new z,ar=new z,Ul=new z,or=new z;class wt extends mt{constructor(e=new Ct,t=new Ki){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(s&&o){ar.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=o[l],u=s[l];h!==0&&(_a.fromBufferAttribute(u,e),a?ar.addScaledVector(_a,h):ar.addScaledVector(_a.sub(t),h))}t.add(ar)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),nr.copy(n.boundingSphere),nr.applyMatrix4(s),bi.copy(e.ray).recast(e.near),!(nr.containsPoint(bi.origin)===!1&&(bi.intersectSphere(nr,Nl)===null||bi.origin.distanceToSquared(Nl)>(e.far-e.near)**2))&&(Dl.copy(s).invert(),bi.copy(e.ray).applyMatrix4(Dl),!(n.boundingBox!==null&&bi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,bi)))}_computeIntersections(e,t,n){let i;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,f=s.groups,d=s.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,_=f.length;m<_;m++){const g=f[m],p=a[g.materialIndex],x=Math.max(g.start,d.start),y=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let M=x,w=y;M<w;M+=3){const E=o.getX(M),v=o.getX(M+1),T=o.getX(M+2);i=lr(this,p,e,n,c,h,u,E,v,T),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{const m=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let g=m,p=_;g<p;g+=3){const x=o.getX(g),y=o.getX(g+1),M=o.getX(g+2);i=lr(this,a,e,n,c,h,u,x,y,M),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,_=f.length;m<_;m++){const g=f[m],p=a[g.materialIndex],x=Math.max(g.start,d.start),y=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let M=x,w=y;M<w;M+=3){const E=M,v=M+1,T=M+2;i=lr(this,p,e,n,c,h,u,E,v,T),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{const m=Math.max(0,d.start),_=Math.min(l.count,d.start+d.count);for(let g=m,p=_;g<p;g+=3){const x=g,y=g+1,M=g+2;i=lr(this,a,e,n,c,h,u,x,y,M),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}}}function Af(r,e,t,n,i,s,a,o){let l;if(e.side===jt?l=n.intersectTriangle(a,s,i,!0,o):l=n.intersectTriangle(i,s,a,e.side===ei,o),l===null)return null;or.copy(o),or.applyMatrix4(r.matrixWorld);const c=t.ray.origin.distanceTo(or);return c<t.near||c>t.far?null:{distance:c,point:or.clone(),object:r}}function lr(r,e,t,n,i,s,a,o,l,c){r.getVertexPosition(o,ir),r.getVertexPosition(l,sr),r.getVertexPosition(c,rr);const h=Af(r,e,t,n,ir,sr,rr,Ul);if(h){const u=new z;An.getBarycoord(Ul,ir,sr,rr,u),i&&(h.uv=An.getInterpolatedAttribute(i,o,l,c,u,new Ue)),s&&(h.uv1=An.getInterpolatedAttribute(s,o,l,c,u,new Ue)),a&&(h.normal=An.getInterpolatedAttribute(a,o,l,c,u,new z),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new z,materialIndex:0};An.getNormal(ir,sr,rr,f.normal),h.face=f,h.barycoord=u}return h}const gs=new Ze,Fl=new Ze,Ol=new Ze,Rf=new Ze,zl=new Oe,cr=new z,xa=new xn,Bl=new Oe,Ma=new Vr;class Cf extends wt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=fl,this.bindMatrix=new Oe,this.bindMatrixInverse=new Oe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new ni),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,cr),this.boundingBox.expandByPoint(cr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new xn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,cr),this.boundingSphere.expandByPoint(cr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),xa.copy(this.boundingSphere),xa.applyMatrix4(i),e.ray.intersectsSphere(xa)!==!1&&(Bl.copy(i).invert(),Ma.copy(e.ray).applyMatrix4(Bl),!(this.boundingBox!==null&&Ma.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Ma)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new Ze,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===fl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Eu?this.bindMatrixInverse.copy(this.bindMatrix).invert():we("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;Fl.fromBufferAttribute(i.attributes.skinIndex,e),Ol.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(gs.copy(t),t.set(0,0,0,0)):(gs.set(t.x,t.y,t.z,1),t.set(0,0,0)),gs.applyMatrix4(this.bindMatrix);for(let s=0;s<4;s++){const a=Ol.getComponent(s);if(a!==0){const o=Fl.getComponent(s);zl.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(Rf.copy(gs).applyMatrix4(zl),a)}}return t.isVector4&&(t.w=gs.w),t.applyMatrix4(this.bindMatrixInverse)}}class fh extends mt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Qi extends Mt{constructor(e=null,t=1,n=1,i,s,a,o,l,c=vt,h=vt,u,f){super(null,a,o,l,c,h,i,s,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const kl=new Oe,Pf=new Oe;class zo{constructor(e=[],t=[]){this.uuid=kn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.previousBoneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){we("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Oe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Oe;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,a=e.length;s<a;s++){const o=e[s]?e[s].matrixWorld:Pf;kl.multiplyMatrices(o,t[s]),kl.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new zo(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Qi(t,e,e,sn,gn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null),this.previousBoneTexture!==null&&(this.previousBoneTexture.dispose(),this.previousBoneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const s=e.bones[n];let a=t[s];a===void 0&&(we("Skeleton: No bone found with UUID:",s),a=new fh),this.bones.push(a),this.boneInverses.push(new Oe().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){const a=t[i];e.bones.push(a.uuid);const o=n[i];e.boneInverses.push(o.toArray())}return e}}class zs extends ht{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Gi=new Oe,Gl=new Oe,hr=[],Hl=new ni,Lf=new Oe,vs=new wt,_s=new xn;class dh extends wt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new zs(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Lf)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ni),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Gi),Hl.copy(e.boundingBox).applyMatrix4(Gi),this.boundingBox.union(Hl)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new xn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Gi),_s.copy(e.boundingSphere).applyMatrix4(Gi),this.boundingSphere.union(_s)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,a=e*s+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(vs.geometry=this.geometry,vs.material=this.material,vs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),_s.copy(this.boundingSphere),_s.applyMatrix4(n),e.ray.intersectsSphere(_s)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,Gi),Gl.multiplyMatrices(n,Gi),vs.matrixWorld=Gl,vs.raycast(e,hr);for(let a=0,o=hr.length;a<o;a++){const l=hr[a];l.instanceId=s,l.object=this,t.push(l)}hr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new zs(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Qi(new Float32Array(i*this.count),i,this.count,Co,gn));const s=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;return s[l]=o,s.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Ti=new xn,If=new Ue(.5,.5),ur=new z;class Bs{constructor(e=new ui,t=new ui,n=new ui,i=new ui,s=new ui,a=new ui){this.planes=[e,t,n,i,s,a]}set(e,t,n,i,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Rn,n=!1){const i=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],h=s[4],u=s[5],f=s[6],d=s[7],m=s[8],_=s[9],g=s[10],p=s[11],x=s[12],y=s[13],M=s[14],w=s[15];if(i[0].setComponents(c-a,d-h,p-m,w-x).normalize(),i[1].setComponents(c+a,d+h,p+m,w+x).normalize(),i[2].setComponents(c+o,d+u,p+_,w+y).normalize(),i[3].setComponents(c-o,d-u,p-_,w-y).normalize(),n)i[4].setComponents(l,f,g,M).normalize(),i[5].setComponents(c-l,d-f,p-g,w-M).normalize();else if(i[4].setComponents(c-l,d-f,p-g,w-M).normalize(),t===Rn)i[5].setComponents(c+l,d+f,p+g,w+M).normalize();else if(t===Fs)i[5].setComponents(l,f,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ti.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ti.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ti)}intersectsSprite(e){Ti.center.set(0,0,0);const t=If.distanceTo(e.center);return Ti.radius=.7071067811865476+t,Ti.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ti)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(ur.x=i.normal.x>0?e.max.x:e.min.x,ur.y=i.normal.y>0?e.max.y:e.min.y,ur.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(ur)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const Vl=new Oe;class Bo{constructor(){this.coordinateSystem=Rn,this._frustums=[],this._count=0}setFromArrayCamera(e){const t=e.cameras,n=this._frustums;for(let i=0;i<t.length;i++){const s=t[i];Vl.multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse),n[i]===void 0&&(n[i]=new Bs),n[i].setFromProjectionMatrix(Vl,s.coordinateSystem,s.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;const t=this._frustums,n=e._frustums;for(let i=0;i<e._count;i++)t[i]===void 0&&(t[i]=new Bs),t[i].copy(n[i]);return this._count=e._count,this}clone(){return new Bo().copy(this)}}class ph extends zn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ne(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Or=new z,zr=new z,Wl=new Oe,xs=new Vr,fr=new xn,Sa=new z,Xl=new z;class ko extends mt{constructor(e=new Ct,t=new ph){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)Or.fromBufferAttribute(t,i-1),zr.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Or.distanceTo(zr);e.setAttribute("lineDistance",new St(n,1))}else we("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),fr.copy(n.boundingSphere),fr.applyMatrix4(i),fr.radius+=s,e.ray.intersectsSphere(fr)===!1)return;Wl.copy(i).invert(),xs.copy(e.ray).applyMatrix4(Wl);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const d=Math.max(0,a.start),m=Math.min(h.count,a.start+a.count);for(let _=d,g=m-1;_<g;_+=c){const p=h.getX(_),x=h.getX(_+1),y=dr(this,e,xs,l,p,x,_);y&&t.push(y)}if(this.isLineLoop){const _=h.getX(m-1),g=h.getX(d),p=dr(this,e,xs,l,_,g,m-1);p&&t.push(p)}}else{const d=Math.max(0,a.start),m=Math.min(f.count,a.start+a.count);for(let _=d,g=m-1;_<g;_+=c){const p=dr(this,e,xs,l,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){const _=dr(this,e,xs,l,m-1,d,m-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function dr(r,e,t,n,i,s,a){const o=r.geometry.attributes.position;if(Or.fromBufferAttribute(o,i),zr.fromBufferAttribute(o,s),t.distanceSqToSegment(Or,zr,Sa,Xl)>n)return;Sa.applyMatrix4(r.matrixWorld);const c=e.ray.origin.distanceTo(Sa);if(!(c<e.near||c>e.far))return{distance:c,point:Xl.clone().applyMatrix4(r.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:r}}const ql=new z,Yl=new z;class Df extends ko{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)ql.fromBufferAttribute(t,i),Yl.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+ql.distanceTo(Yl);e.setAttribute("lineDistance",new St(n,1))}else we("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Nf extends ko{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class mh extends zn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ne(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Kl=new Oe,xo=new Vr,pr=new xn,mr=new z;class Uf extends mt{constructor(e=new Ct,t=new mh){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),pr.copy(n.boundingSphere),pr.applyMatrix4(i),pr.radius+=s,e.ray.intersectsSphere(pr)===!1)return;Kl.copy(i).invert(),xo.copy(e.ray).applyMatrix4(Kl);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){const f=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let m=f,_=d;m<_;m++){const g=c.getX(m);mr.fromBufferAttribute(u,g),Zl(mr,g,l,i,e,t,this)}}else{const f=Math.max(0,a.start),d=Math.min(u.count,a.start+a.count);for(let m=f,_=d;m<_;m++)mr.fromBufferAttribute(u,m),Zl(mr,m,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Zl(r,e,t,n,i,s,a){const o=xo.distanceSqToPoint(r);if(o<t){const l=new z;xo.closestPointToPoint(r,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class gh extends Mt{constructor(e=[],t=ts,n,i,s,a,o,l,c,h){super(e,t,n,i,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Z_ extends Mt{constructor(e,t,n,i,s,a,o,l,c){super(e,t,n,i,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ss extends Mt{constructor(e,t,n=Bn,i,s,a,o=vt,l=vt,c,h=mi,u=1){if(h!==mi&&h!==di)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:u};super(f,i,s,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Fo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class vh extends ss{constructor(e,t=Bn,n=ts,i,s,a=vt,o=vt,l,c=mi){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,i,s,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class _h extends Mt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Hs extends Ct{constructor(e=1,t=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};const o=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],h=[],u=[];let f=0,d=0;m("z","y","x",-1,-1,n,t,e,a,s,0),m("z","y","x",1,-1,n,t,-e,a,s,1),m("x","z","y",1,1,e,n,t,i,a,2),m("x","z","y",1,-1,e,n,-t,i,a,3),m("x","y","z",1,-1,e,t,n,i,s,4),m("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new St(c,3)),this.setAttribute("normal",new St(h,3)),this.setAttribute("uv",new St(u,2));function m(_,g,p,x,y,M,w,E,v,T,I){const R=M/v,P=w/T,F=M/2,G=w/2,C=E/2,V=v+1,q=T+1;let W=0,D=0;const O=new z;for(let Y=0;Y<q;Y++){const te=Y*P-G;for(let xe=0;xe<V;xe++){const Pe=xe*R-F;O[_]=Pe*x,O[g]=te*y,O[p]=C,c.push(O.x,O.y,O.z),O[_]=0,O[g]=0,O[p]=E>0?1:-1,h.push(O.x,O.y,O.z),u.push(xe/v),u.push(1-Y/T),W+=1}}for(let Y=0;Y<T;Y++)for(let te=0;te<v;te++){const xe=f+te+V*Y,Pe=f+te+V*(Y+1),$=f+(te+1)+V*(Y+1),de=f+(te+1)+V*Y;l.push(xe,Pe,de),l.push(Pe,$,de),D+=6}o.addGroup(d,D,I),d+=D,f+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Hs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class xh extends Ct{constructor(e=1,t=1,n=1,i=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),s=Math.floor(s);const h=[],u=[],f=[],d=[];let m=0;const _=[],g=n/2;let p=0;x(),a===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new St(u,3)),this.setAttribute("normal",new St(f,3)),this.setAttribute("uv",new St(d,2));function x(){const M=new z,w=new z;let E=0;const v=(t-e)/n;for(let T=0;T<=s;T++){const I=[],R=T/s,P=R*(t-e)+e;for(let F=0;F<=i;F++){const G=F/i,C=G*l+o,V=Math.sin(C),q=Math.cos(C);w.x=P*V,w.y=-R*n+g,w.z=P*q,u.push(w.x,w.y,w.z),M.set(V,v,q).normalize(),f.push(M.x,M.y,M.z),d.push(G,1-R),I.push(m++)}_.push(I)}for(let T=0;T<i;T++)for(let I=0;I<s;I++){const R=_[I][T],P=_[I+1][T],F=_[I+1][T+1],G=_[I][T+1];(e>0||I!==0)&&(h.push(R,P,G),E+=3),(t>0||I!==s-1)&&(h.push(P,F,G),E+=3)}c.addGroup(p,E,0),p+=E}function y(M){const w=m,E=new Ue,v=new z;let T=0;const I=M===!0?e:t,R=M===!0?1:-1;for(let F=1;F<=i;F++)u.push(0,g*R,0),f.push(0,R,0),d.push(.5,.5),m++;const P=m;for(let F=0;F<=i;F++){const C=F/i*l+o,V=Math.cos(C),q=Math.sin(C);v.x=I*q,v.y=g*R,v.z=I*V,u.push(v.x,v.y,v.z),f.push(0,R,0),E.x=V*.5+.5,E.y=q*.5*R+.5,d.push(E.x,E.y),m++}for(let F=0;F<i;F++){const G=w+F,C=P+F;M===!0?h.push(C,C+1,G):h.push(C+1,C,G),T+=3}c.addGroup(p,T,M===!0?1:2),p+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xh(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class vi extends Ct{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=e/o,f=t/l,d=[],m=[],_=[],g=[];for(let p=0;p<h;p++){const x=p*f-a;for(let y=0;y<c;y++){const M=y*u-s;m.push(M,-x,0),_.push(0,0,1),g.push(y/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<o;x++){const y=x+c*p,M=x+c*(p+1),w=x+1+c*(p+1),E=x+1+c*p;d.push(y,M,E),d.push(M,w,E)}this.setIndex(d),this.setAttribute("position",new St(m,3)),this.setAttribute("normal",new St(_,3)),this.setAttribute("uv",new St(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new vi(e.width,e.height,e.widthSegments,e.heightSegments)}}class Mh extends Ct{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new z,f=new z,d=[],m=[],_=[],g=[];for(let p=0;p<=n;p++){const x=[],y=p/n,M=a+y*o,w=e*Math.cos(M),E=Math.sqrt(e*e-w*w);let v=0;p===0&&a===0?v=.5/t:p===n&&l===Math.PI&&(v=-.5/t);for(let T=0;T<=t;T++){const I=T/t,R=i+I*s;u.x=-E*Math.cos(R),u.y=w,u.z=E*Math.sin(R),m.push(u.x,u.y,u.z),f.copy(u).normalize(),_.push(f.x,f.y,f.z),g.push(I+v,1-y),x.push(c++)}h.push(x)}for(let p=0;p<n;p++)for(let x=0;x<t;x++){const y=h[p][x+1],M=h[p][x],w=h[p+1][x],E=h[p+1][x+1];(p!==0||a>0)&&d.push(y,M,E),(p!==n-1||l<Math.PI)&&d.push(M,w,E)}this.setIndex(d),this.setAttribute("position",new St(m,3)),this.setAttribute("normal",new St(_,3)),this.setAttribute("uv",new St(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Mh(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Sh extends Ct{constructor(e=1,t=.4,n=12,i=48,s=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:s,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);const l=[],c=[],h=[],u=[],f=new z,d=new z,m=new z;for(let _=0;_<=n;_++){const g=a+_/n*o;for(let p=0;p<=i;p++){const x=p/i*s;d.x=(e+t*Math.cos(g))*Math.cos(x),d.y=(e+t*Math.cos(g))*Math.sin(x),d.z=t*Math.sin(g),c.push(d.x,d.y,d.z),f.x=e*Math.cos(x),f.y=e*Math.sin(x),m.subVectors(d,f).normalize(),h.push(m.x,m.y,m.z),u.push(p/i),u.push(_/n)}}for(let _=1;_<=n;_++)for(let g=1;g<=i;g++){const p=(i+1)*_+g-1,x=(i+1)*(_-1)+g-1,y=(i+1)*(_-1)+g,M=(i+1)*_+g;l.push(p,x,M),l.push(x,y,M)}this.setIndex(l),this.setAttribute("position",new St(c,3)),this.setAttribute("normal",new St(h,3)),this.setAttribute("uv",new St(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Sh(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}}function rs(r){const e={};for(const t in r){e[t]={};for(const n in r[t]){const i=r[t][n];if($l(i))i.isRenderTargetTexture?(we("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if($l(i[0])){const s=[];for(let a=0,o=i.length;a<o;a++)s[a]=i[a].clone();e[t][n]=s}else e[t][n]=i.slice();else e[t][n]=i}}return e}function qt(r){const e={};for(let t=0;t<r.length;t++){const n=rs(r[t]);for(const i in n)e[i]=n[i]}return e}function $l(r){return r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)}function Ff(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function yh(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Xe.workingColorSpace}const Of={clone:rs,merge:qt};var zf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Bf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Vt extends zn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=zf,this.fragmentShader=Bf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=rs(e.uniforms),this.uniformsGroups=Ff(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new Ne().setHex(i.value);break;case"v2":this.uniforms[n].value=new Ue().fromArray(i.value);break;case"v3":this.uniforms[n].value=new z().fromArray(i.value);break;case"v4":this.uniforms[n].value=new Ze().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Be().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Oe().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class kf extends Vt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Go extends zn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ne(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=vo,this.normalScale=new Ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Cn extends Go{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ue(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return We(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new Ne(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ne(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ne(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(e){this._diffuseRoughness>0!=e>0&&this.version++,this._diffuseRoughness=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}get iridescenceThicknessRange(){return $i('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(e){$i('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=e[0],this.iridescenceThicknessMaximum=e[1]}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.diffuseRoughness=e.diffuseRoughness,this.diffuseRoughnessMap=e.diffuseRoughnessMap,this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum,this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Gf extends zn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ru,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Hf extends zn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function fi(r,e){return!r||r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function Es(r){return r!==void 0&&r.inTangents!==void 0&&r.outTangents!==void 0}function Vf(r){function e(i,s){return r[i]-r[s]}const t=r.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Jl(r,e,t){const n=r.length,i=new r.constructor(n);for(let s=0,a=0;a!==n;++s){const o=t[s]*e;for(let l=0;l!==e;++l)i[a++]=r[o+l]}return i}function Wf(r,e,t,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let a=s[n];if(a!==void 0)if(Array.isArray(a))do a=s[n],a!==void 0&&(e.push(s.time),t.push(...a)),s=r[i++];while(s!==void 0);else if(a.toArray!==void 0)do a=s[n],a!==void 0&&(e.push(s.time),a.toArray(t,t.length)),s=r[i++];while(s!==void 0);else do a=s[n],a!==void 0&&(e.push(s.time),t.push(a)),s=r[i++];while(s!==void 0)}class as{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],s=t[n-1];n:{e:{let a;t:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=i,i=t[++n],e<i)break e}a=t.length;break t}if(!(e>=s)){const o=t[1];e<o&&(n=2,s=o);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=s,s=t[--n-1],e>=s)break e}a=n,n=0;break t}break n}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let a=0;a!==i;++a)t[a]=n[s+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class Xf extends as{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:pl,endingEnd:pl}}intervalChanged_(e,t,n){const i=this.parameterPositions;let s=e-2,a=e+1,o=i[s],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case ml:s=e,o=2*t-n;break;case gl:s=i.length-2,o=t+i[s]-i[s+1];break;default:s=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case ml:a=e,l=2*n-t;break;case gl:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}const c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=s*h,this._offsetNext=a*h}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,m=(n-t)/(i-t),_=m*m,g=_*m,p=-f*g+2*f*_-f*m,x=(1+f)*g+(-1.5-2*f)*_+(-.5+f)*m+1,y=(-1-d)*g+(1.5+d)*_+.5*m,M=d*g-d*_;for(let w=0;w!==o;++w)s[w]=p*a[h+w]+x*a[c+w]+y*a[l+w]+M*a[u+w];return s}}class qf extends as{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(i-t),u=1-h;for(let f=0;f!==o;++f)s[f]=a[c+f]*u+a[l+f]*h;return s}}class Yf extends as{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class Kf extends as{interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,u=this.outTangents;if(!h||!u){const m=(n-t)/(i-t),_=1-m;for(let g=0;g!==o;++g)s[g]=a[c+g]*_+a[l+g]*m;return s}const f=o*2,d=e-1;for(let m=0;m!==o;++m){const _=a[c+m],g=a[l+m],p=d*f+m*2,x=u[p],y=u[p+1],M=e*f+m*2,w=h[M],E=h[M+1],v=$f(n,t,x,w,i);s[m]=bh(v,_,y,E,g)}return s}}function bh(r,e,t,n,i){const s=1-r;return s*s*s*e+3*s*s*r*t+3*s*r*r*n+r*r*r*i}function Zf(r,e,t,n,i){const s=1-r;return 3*s*s*(t-e)+6*s*r*(n-t)+3*r*r*(i-n)}function $f(r,e,t,n,i){let s=(r-e)/(i-e);for(let a=0;a<8;a++){const o=bh(s,e,t,n,i)-r;if(Math.abs(o)<1e-10)break;const l=Zf(s,e,t,n,i);if(Math.abs(l)<1e-10)break;s=Math.max(0,Math.min(1,s-o/l))}return s}class Pn{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=fi(t,this.TimeBufferType),this.values=fi(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:fi(e.times,Array),values:fi(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i),Es(e.settings)&&(n.settings={inTangents:fi(e.settings.inTangents,Array),outTangents:fi(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Yf(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new qf(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Xf(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new Kf(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Ns:t=this.InterpolantFactoryMethodDiscrete;break;case Us:t=this.InterpolantFactoryMethodLinear;break;case Jr:t=this.InterpolantFactoryMethodSmooth;break;case dl:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return we("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ns;case this.InterpolantFactoryMethodLinear:return Us;case this.InterpolantFactoryMethodSmooth:return Jr;case this.InterpolantFactoryMethodBezier:return dl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e;Es(this.settings)&&(Ql(this.settings.inTangents,e),Ql(this.settings.outTangents,e))}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e;Es(this.settings)&&(jl(this.settings.inTangents,e),jl(this.settings.outTangents,e))}return this}trim(e,t){const n=this.times,i=n.length;let s=0,a=i-1;for(;s!==i&&n[s]<e;)++s;for(;a!==-1&&n[a]>t;)--a;if(++a,s!==0||a!==i){s>=a&&(a=Math.max(a,1),s=a-1);const o=this.getValueSize();this.times=n.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(De("KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,s=n.length;s===0&&(De("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){De("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){De("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&Ou(i))for(let o=0,l=i.length;o!==l;++o){const c=i[o];if(isNaN(c)){De("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Jr,s=e.length-1;let a=1;for(let o=1;o<s;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(i)l=!0;else{const u=o*n,f=u-n,d=u+n;for(let m=0;m!==n;++m){const _=t[u+m];if(_!==t[f+m]||_!==t[d+m]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const u=o*n,f=a*n;for(let d=0;d!==n;++d)t[f+d]=t[u+d]}++a}}if(s>0){e[a]=e[s];for(let o=s*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,Es(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}}function Ql(r,e){for(let t=0,n=r.length;t!==n;t+=2)r[t]+=e}function jl(r,e){for(let t=0,n=r.length;t!==n;t+=2)r[t]*=e}Pn.prototype.ValueTypeName="";Pn.prototype.TimeBufferType=Float32Array;Pn.prototype.ValueBufferType=Float32Array;Pn.prototype.DefaultInterpolation=Us;class os extends Pn{constructor(e,t,n){super(e,t,n)}}os.prototype.ValueTypeName="bool";os.prototype.ValueBufferType=Array;os.prototype.DefaultInterpolation=Ns;os.prototype.InterpolantFactoryMethodLinear=void 0;os.prototype.InterpolantFactoryMethodSmooth=void 0;class Th extends Pn{constructor(e,t,n,i){super(e,t,n,i)}}Th.prototype.ValueTypeName="color";class ks extends Pn{constructor(e,t,n,i){super(e,t,n,i)}}ks.prototype.ValueTypeName="number";class Jf extends as{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t);let c=e*o;for(let h=c+o;c!==h;c+=4)ti.slerpFlat(s,0,a,c-o,a,c,l);return s}}class Gs extends Pn{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new Jf(this.times,this.values,this.getValueSize(),e)}}Gs.prototype.ValueTypeName="quaternion";Gs.prototype.InterpolantFactoryMethodSmooth=void 0;class ls extends Pn{constructor(e,t,n){super(e,t,n)}}ls.prototype.ValueTypeName="string";ls.prototype.ValueBufferType=Array;ls.prototype.DefaultInterpolation=Ns;ls.prototype.InterpolantFactoryMethodLinear=void 0;ls.prototype.InterpolantFactoryMethodSmooth=void 0;class Br extends Pn{constructor(e,t,n,i){super(e,t,n,i)}}Br.prototype.ValueTypeName="vector";class Qf{constructor(e="",t=-1,n=[],i=wu){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=kn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(ed(n[a]).scale(i));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,a=n.length;s!==a;++s)t.push(Pn.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const s=t.length,a=[];for(let o=0;o<s;o++){let l=[],c=[];l.push((o+s-1)%s,o,(o+1)%s),c.push(0,1,0);const h=Vf(l);l=Jl(l,1,h),c=Jl(c,1,h),!i&&l[0]===0&&(l.push(s),c.push(c[0])),a.push(new ks(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(s);if(h&&h.length>1){const u=h[1];let f=i[u];f||(i[u]=f=[]),f.push(c)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function jf(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return ks;case"vector":case"vector2":case"vector3":case"vector4":return Br;case"color":return Th;case"quaternion":return Gs;case"bool":case"boolean":return os;case"string":return ls}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function ed(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=jf(r.type);if(r.times===void 0){const n=[],i=[];Wf(r.keys,n,i,"value"),r.times=n,r.values=i}let t;return e.parse!==void 0?t=e.parse(r):t=new e(r.name,r.times,r.values,r.interpolation),Es(r.settings)&&(t.settings={inTangents:fi(r.settings.inTangents,Float32Array),outTangents:fi(r.settings.outTangents,Float32Array)}),t}const Qn={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(ec(r)||(this.files[r]=e))},get:function(r){if(this.enabled!==!1&&!ec(r))return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};function ec(r){try{const e=r.slice(r.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class td{constructor(e,t,n){const i=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,s===!1&&i.onStart!==void 0&&i.onStart(h,a,o),s=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){const d=c[u],m=c[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const nd=new td;class cs{constructor(e){this.manager=e!==void 0?e:nd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}}cs.DEFAULT_MATERIAL_NAME="__DEFAULT";const Yn={};class id extends Error{constructor(e,t){super(e),this.response=t}}class Eh extends cs{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=Qn.get(`file:${e}`);if(s!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0);return}if(Yn[e]!==void 0){Yn[e].push({onLoad:t,onProgress:n,onError:i});return}Yn[e]=[],Yn[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",priority:this.priority,cache:this.cache,signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&we("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=Yn[e],u=c.body.getReader(),f=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=f?parseInt(f):0,m=d!==0;let _=0;const g=new ReadableStream({start(p){x();function x(){u.read().then(({done:y,value:M})=>{if(y)p.close();else{_+=M.byteLength;const w=new ProgressEvent("progress",{lengthComputable:m,loaded:_,total:d});for(let E=0,v=h.length;E<v;E++){const T=h[E];T.onProgress&&T.onProgress(w)}p.enqueue(M),x()}},y=>{p.error(y)})}}});return new Response(g)}else throw new id(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const u=/charset="?([^;"\s]*)"?/i.exec(o),f=u&&u[1]?u[1].toLowerCase():void 0,d=new TextDecoder(f);return c.arrayBuffer().then(m=>d.decode(m))}}}).then(c=>{Qn.add(`file:${e}`,c);const h=Yn[e];delete Yn[e];for(let u=0,f=h.length;u<f;u++){const d=h[u];d.onLoad&&d.onLoad(c)}}).catch(c=>{const h=Yn[e];if(h===void 0)throw this.manager.itemError(e),c;delete Yn[e];for(let u=0,f=h.length;u<f;u++){const d=h[u];d.onError&&d.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Hi=new WeakMap;class sd extends cs{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Qn.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);else{let u=Hi.get(a);u===void 0&&(u=[],Hi.set(a,u)),u.push({onLoad:t,onError:i})}return a}const o=Os("img");function l(){h(),t&&t(this);const u=Hi.get(this)||[];for(let f=0;f<u.length;f++){const d=u[f];d.onLoad&&d.onLoad(this)}Hi.delete(this),s.manager.itemEnd(e)}function c(u){h(),i&&i(u),Qn.remove(`image:${e}`);const f=Hi.get(this)||[];for(let d=0;d<f.length;d++){const m=f[d];m.onError&&m.onError(u)}Hi.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Qn.add(`image:${e}`,o),s.manager.itemStart(e),o.fetchPriority=this.priority,o.src=e,o}}class rd extends cs{constructor(e){super(e)}load(e,t,n,i){const s=new Mt,a=new sd(this.manager);return a.setPriority(this.priority),a.setCache(this.cache),a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}}class Ho extends mt{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ne(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}const ya=new Oe,tc=new z,nc=new z;class Vo{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ue(512,512),this.mapType=Qt,this.map=null,this.mapPass=null,this.matrix=new Oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Bs,this._frameExtents=new Ue(1,1),this._viewportCount=1,this._viewports=[new Ze(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;tc.setFromMatrixPosition(e.matrixWorld),t.position.copy(tc),nc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(nc),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){ya.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(ya,e.coordinateSystem,e.reversedDepth);const s=this._frameExtents,a=i?i.z/s.x:1,o=i?i.w/s.y:1,l=i?i.x/s.x:0,c=i?i.y/s.y:0;e.coordinateSystem===Fs||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(ya)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const gr=new z,vr=new ti,In=new z;class wh extends mt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Oe,this.projectionMatrix=new Oe,this.projectionMatrixInverse=new Oe,this.coordinateSystem=Rn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(gr,vr,In),In.x===1&&In.y===1&&In.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(gr,vr,In.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(gr,vr,In),In.x===1&&In.y===1&&In.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(gr,vr,In.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const ci=new z,ic=new Ue,sc=new Ue;class Jt extends wh{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=is*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Rs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return is*2*Math.atan(Math.tan(Rs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ci.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ci.x,ci.y).multiplyScalar(-e/ci.z),ci.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ci.x,ci.y).multiplyScalar(-e/ci.z)}getViewSize(e,t){return this.getViewBounds(e,ic,sc),t.subVectors(sc,ic)}setViewOffset(e,t,n,i,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Rs*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class ad extends Vo{constructor(){super(new Jt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=is*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){const e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}}class od extends Ho{constructor(e,t,n=0,i=Math.PI/3,s=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(mt.DEFAULT_UP),this.updateMatrix(),this.target=new mt,this.distance=n,this.angle=i,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new ad}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class ld extends Vo{constructor(){super(new Jt(90,1,.5,500)),this.isPointLightShadow=!0}}class cd extends Ho{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new ld}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Wr extends wh{constructor(e=-1,t=1,n=1,i=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class hd extends Vo{constructor(){super(new Wr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ud extends Ho{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(mt.DEFAULT_UP),this.updateMatrix(),this.target=new mt,this.shadow=new hd}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class Ps{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const ba=new WeakMap;class fd extends cs{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&we("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&we("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Qn.get(`image-bitmap:${e}`);if(a!==void 0){if(s.manager.itemStart(e),a.then){a.then(c=>{ba.has(a)===!0?(i&&i(ba.get(a)),s.manager.itemError(e),s.manager.itemEnd(e)):(t&&t(c),s.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);return}const o={};o.credentials=this.withCredentials||this.crossOrigin!=="anonymous"?"include":"same-origin",o.headers=this.requestHeader,o.priority=this.priority,o.cache=this.cache,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},s.options,{colorSpaceConversion:"none"}))}).then(function(c){return Qn.add(`image-bitmap:${e}`,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){i&&i(c),ba.set(l,c),Qn.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});Qn.add(`image-bitmap:${e}`,l),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Vi=-90,Wi=1;class Mo extends mt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Jt(Vi,Wi,e,t);i.layers=this.layers,this.add(i);const s=new Jt(Vi,Wi,e,t);s.layers=this.layers,this.add(s);const a=new Jt(Vi,Wi,e,t);a.layers=this.layers,this.add(a);const o=new Jt(Vi,Wi,e,t);o.layers=this.layers,this.add(o);const l=new Jt(Vi,Wi,e,t);l.layers=this.layers,this.add(l);const c=new Jt(Vi,Wi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===Rn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Fs)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,1,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.mipmapsAutoUpdate=_,e.setRenderTarget(n,5,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,f,d),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class dd extends Jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}}const Wo="\\[\\]\\.:\\/",pd=new RegExp("["+Wo+"]","g"),Xo="[^"+Wo+"]",md="[^"+Wo.replace("\\.","")+"]",gd=/((?:WC+[\/:])*)/.source.replace("WC",Xo),vd=/(WCOD+)?/.source.replace("WCOD",md),_d=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Xo),xd=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Xo),Md=new RegExp("^"+gd+vd+_d+xd+"$"),Sd=["material","materials","bones","map"];class yd{constructor(e,t,n){const i=n||it.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class it{constructor(e,t,n){this.path=t,this.parsedPath=n||it.parseTrackName(t),this.node=it.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new it.Composite(e,t,n):new it(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(pd,"")}static parseTrackName(e){const t=Md.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const s=n.nodeName.substring(i+1);Sd.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(s){for(let a=0;a<s.length;a++){const o=s[a];if(o.name===t||o.uuid===t)return o;const l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let s=t.propertyIndex;if(e||(e=it.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){we("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){De("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){De("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){De("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){De("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){De("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){De("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){De("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[i];if(a===void 0){const c=t.nodeName;De("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){De("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){De("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}it.Composite=yd;it.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};it.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};it.prototype.GetterByBindingType=[it.prototype._getValue_direct,it.prototype._getValue_array,it.prototype._getValue_arrayElement,it.prototype._getValue_toArray];it.prototype.SetterByBindingTypeAndVersioning=[[it.prototype._setValue_direct,it.prototype._setValue_direct_setNeedsUpdate,it.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[it.prototype._setValue_array,it.prototype._setValue_array_setNeedsUpdate,it.prototype._setValue_array_setMatrixWorldNeedsUpdate],[it.prototype._setValue_arrayElement,it.prototype._setValue_arrayElement_setNeedsUpdate,it.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[it.prototype._setValue_fromArray,it.prototype._setValue_fromArray_setNeedsUpdate,it.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];function rc(r,e,t,n){const i=bd(n);switch(t){case Qc:return r*e;case Co:return r*e/i.components*i.byteLength;case Po:return r*e/i.components*i.byteLength;case Ci:return r*e*2/i.components*i.byteLength;case Lo:return r*e*2/i.components*i.byteLength;case jc:return r*e*3/i.components*i.byteLength;case sn:return r*e*4/i.components*i.byteLength;case Io:return r*e*4/i.components*i.byteLength;case wr:case Ar:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Rr:case Cr:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case ka:case Ha:return Math.max(r,16)*Math.max(e,8)/4;case Ba:case Ga:return Math.max(r,8)*Math.max(e,8)/2;case Va:case Wa:case qa:case Ya:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Xa:case Dr:case Ka:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Za:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case $a:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case Ja:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case Qa:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case ja:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case eo:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case to:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case no:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case io:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case so:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case ro:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case ao:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case oo:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case lo:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case co:case ho:case uo:return Math.ceil(r/4)*Math.ceil(e/4)*16;case fo:case po:return Math.ceil(r/4)*Math.ceil(e/4)*8;case Nr:case mo:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function bd(r){switch(r){case Qt:case Kc:return{byteLength:1,components:1};case Ds:case Zc:case rn:return{byteLength:2,components:1};case Ao:case Ro:return{byteLength:2,components:4};case Bn:case wo:case gn:return{byteLength:4,components:1};case $c:case Jc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Eo}}));typeof window<"u"&&(window.__THREE__?we("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Eo);function Ah(){let r=null,e=!1,t=null,n=null;function i(s,a){n=r.requestAnimationFrame(i),t(s,a)}return{start:function(){e!==!0&&t!==null&&r!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r!==null&&r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function Td(r){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,f=r.createBuffer();r.bindBuffer(l,f),r.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=r.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=r.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=r.HALF_FLOAT:d=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=r.SHORT;else if(c instanceof Uint32Array)d=r.UNSIGNED_INT;else if(c instanceof Int32Array)d=r.INT;else if(c instanceof Int8Array)d=r.BYTE;else if(c instanceof Uint8Array)d=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(r.bindBuffer(c,o),u.length===0)r.bufferSubData(c,0,h);else{u.sort((d,m)=>d.start-m.start);let f=0;for(let d=1;d<u.length;d++){const m=u[f],_=u[d];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++f,u[f]=_)}u.length=f+1;for(let d=0,m=u.length;d<m;d++){const _=u[d];r.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(r.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:s,update:a}}var Ed=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,wd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Ad=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Rd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Cd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Pd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ld=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Id=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Dd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Nd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ud=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Fd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Od=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,zd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Bd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,kd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Gd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Hd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Vd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Wd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Xd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,qd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Yd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Kd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Zd=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,$d=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Jd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Qd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,jd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ep="gl_FragColor = linearToOutputTexel( gl_FragColor );",tp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,np=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,ip=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,sp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,rp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ap=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,op=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,lp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,cp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,hp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,up=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,fp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,dp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,pp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,mp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,gp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,vp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,_p=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,xp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Mp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Sp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,yp=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,bp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Tp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Ep=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,wp=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Ap=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Rp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Cp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Pp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Lp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ip=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Dp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Np=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Up=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Fp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Op=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,zp=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Bp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,kp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Gp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Hp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Vp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Wp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Xp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Yp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Kp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Zp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,$p=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Jp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Qp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,jp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,em=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,tm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,nm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,im=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,sm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,rm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,am=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,om=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,lm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,cm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,hm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,um=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,fm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,dm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,pm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,mm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,gm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,vm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,_m=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,xm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Mm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Sm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ym=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,bm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Tm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Em=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Am=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Rm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Cm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Lm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Im=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Dm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Nm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Um=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Fm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Om=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,zm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Bm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,km=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Vm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Xm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,qm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ym=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Km=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Zm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$m=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Jm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Qm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,jm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,e0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,t0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,n0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,i0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,He={alphahash_fragment:Ed,alphahash_pars_fragment:wd,alphamap_fragment:Ad,alphamap_pars_fragment:Rd,alphatest_fragment:Cd,alphatest_pars_fragment:Pd,aomap_fragment:Ld,aomap_pars_fragment:Id,batching_pars_vertex:Dd,batching_vertex:Nd,begin_vertex:Ud,beginnormal_vertex:Fd,bsdfs:Od,iridescence_fragment:zd,bumpmap_pars_fragment:Bd,clipping_planes_fragment:kd,clipping_planes_pars_fragment:Gd,clipping_planes_pars_vertex:Hd,clipping_planes_vertex:Vd,color_fragment:Wd,color_pars_fragment:Xd,color_pars_vertex:qd,color_vertex:Yd,common:Kd,defaultnormal_vertex:Zd,displacementmap_pars_vertex:$d,displacementmap_vertex:Jd,emissivemap_fragment:Qd,emissivemap_pars_fragment:jd,colorspace_fragment:ep,colorspace_pars_fragment:tp,envmap_fragment:np,envmap_common_pars_fragment:ip,envmap_pars_fragment:sp,envmap_pars_vertex:rp,envmap_physical_pars_fragment:gp,envmap_vertex:ap,fog_vertex:op,fog_pars_vertex:lp,fog_fragment:cp,fog_pars_fragment:hp,gradientmap_pars_fragment:up,lightmap_pars_fragment:fp,lights_lambert_fragment:dp,lights_lambert_pars_fragment:pp,lights_pars_begin:mp,lights_toon_fragment:vp,lights_toon_pars_fragment:_p,lights_phong_fragment:xp,lights_phong_pars_fragment:Mp,lights_physical_fragment:Sp,lights_physical_pars_fragment:yp,lights_fragment_begin:bp,lights_fragment_maps:Tp,lights_fragment_end:Ep,lightprobes_pars_fragment:wp,logdepthbuf_fragment:Ap,logdepthbuf_pars_fragment:Rp,logdepthbuf_pars_vertex:Cp,logdepthbuf_vertex:Pp,map_fragment:Lp,map_pars_fragment:Ip,map_particle_fragment:Dp,map_particle_pars_fragment:Np,metalnessmap_fragment:Up,metalnessmap_pars_fragment:Fp,morphinstance_vertex:Op,morphcolor_vertex:zp,morphnormal_vertex:Bp,morphtarget_pars_vertex:kp,morphtarget_vertex:Gp,normal_fragment_begin:Hp,normal_fragment_maps:Vp,normal_pars_fragment:Wp,normal_pars_vertex:Xp,normal_vertex:qp,normalmap_pars_fragment:Yp,clearcoat_normal_fragment_begin:Kp,clearcoat_normal_fragment_maps:Zp,clearcoat_pars_fragment:$p,iridescence_pars_fragment:Jp,opaque_fragment:Qp,packing:jp,premultiplied_alpha_fragment:em,project_vertex:tm,dithering_fragment:nm,dithering_pars_fragment:im,roughnessmap_fragment:sm,roughnessmap_pars_fragment:rm,shadowmap_pars_fragment:am,shadowmap_pars_vertex:om,shadowmap_vertex:lm,shadowmask_pars_fragment:cm,skinbase_vertex:hm,skinning_pars_vertex:um,skinning_vertex:fm,skinnormal_vertex:dm,specularmap_fragment:pm,specularmap_pars_fragment:mm,tonemapping_fragment:gm,tonemapping_pars_fragment:vm,transmission_fragment:_m,transmission_pars_fragment:xm,uv_pars_fragment:Mm,uv_pars_vertex:Sm,uv_vertex:ym,worldpos_vertex:bm,background_vert:Tm,background_frag:Em,backgroundCube_vert:wm,backgroundCube_frag:Am,cube_vert:Rm,cube_frag:Cm,depth_vert:Pm,depth_frag:Lm,distance_vert:Im,distance_frag:Dm,equirect_vert:Nm,equirect_frag:Um,linedashed_vert:Fm,linedashed_frag:Om,meshbasic_vert:zm,meshbasic_frag:Bm,meshlambert_vert:km,meshlambert_frag:Gm,meshmatcap_vert:Hm,meshmatcap_frag:Vm,meshnormal_vert:Wm,meshnormal_frag:Xm,meshphong_vert:qm,meshphong_frag:Ym,meshphysical_vert:Km,meshphysical_frag:Zm,meshtoon_vert:$m,meshtoon_frag:Jm,points_vert:Qm,points_frag:jm,shadow_vert:e0,shadow_frag:t0,sprite_vert:n0,sprite_frag:i0},ve={common:{diffuse:{value:new Ne(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Be}},envmap:{envMap:{value:null},envMapRotation:{value:new Be},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Be}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Be}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Be},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Be},normalScale:{value:new Ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Be},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Be}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Be}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Be}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ne(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Ne(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0},uvTransform:{value:new Be}},sprite:{diffuse:{value:new Ne(16777215)},opacity:{value:1},center:{value:new Ue(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}}},Un={basic:{uniforms:qt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.fog]),vertexShader:He.meshbasic_vert,fragmentShader:He.meshbasic_frag},lambert:{uniforms:qt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Ne(0)},envMapIntensity:{value:1}}]),vertexShader:He.meshlambert_vert,fragmentShader:He.meshlambert_frag},phong:{uniforms:qt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Ne(0)},specular:{value:new Ne(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:He.meshphong_vert,fragmentShader:He.meshphong_frag},standard:{uniforms:qt([ve.common,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.roughnessmap,ve.metalnessmap,ve.fog,ve.lights,{emissive:{value:new Ne(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag},toon:{uniforms:qt([ve.common,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.gradientmap,ve.fog,ve.lights,{emissive:{value:new Ne(0)}}]),vertexShader:He.meshtoon_vert,fragmentShader:He.meshtoon_frag},matcap:{uniforms:qt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,{matcap:{value:null}}]),vertexShader:He.meshmatcap_vert,fragmentShader:He.meshmatcap_frag},points:{uniforms:qt([ve.points,ve.fog]),vertexShader:He.points_vert,fragmentShader:He.points_frag},dashed:{uniforms:qt([ve.common,ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:He.linedashed_vert,fragmentShader:He.linedashed_frag},depth:{uniforms:qt([ve.common,ve.displacementmap]),vertexShader:He.depth_vert,fragmentShader:He.depth_frag},normal:{uniforms:qt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,{opacity:{value:1}}]),vertexShader:He.meshnormal_vert,fragmentShader:He.meshnormal_frag},sprite:{uniforms:qt([ve.sprite,ve.fog]),vertexShader:He.sprite_vert,fragmentShader:He.sprite_frag},background:{uniforms:{uvTransform:{value:new Be},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:He.background_vert,fragmentShader:He.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Be}},vertexShader:He.backgroundCube_vert,fragmentShader:He.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:He.cube_vert,fragmentShader:He.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:He.equirect_vert,fragmentShader:He.equirect_frag},distance:{uniforms:qt([ve.common,ve.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:He.distance_vert,fragmentShader:He.distance_frag},shadow:{uniforms:qt([ve.lights,ve.fog,{color:{value:new Ne(0)},opacity:{value:1}}]),vertexShader:He.shadow_vert,fragmentShader:He.shadow_frag}};Un.physical={uniforms:qt([Un.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Be},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Be},clearcoatNormalScale:{value:new Ue(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Be},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Be},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Be},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Be},sheen:{value:0},sheenColor:{value:new Ne(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Be},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Be},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Be},transmissionSamplerSize:{value:new Ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Be},attenuationDistance:{value:0},attenuationColor:{value:new Ne(0)},specularColor:{value:new Ne(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Be},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Be},anisotropyVector:{value:new Ue},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Be}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag};const _r={r:0,b:0,g:0},s0=new Oe,Rh=new Be;Rh.set(-1,0,0,0,1,0,0,0,1);function r0(r,e,t,n,i,s){const a=new Ne(0);let o=i===!0?0:1,l,c,h=null,u=0,f=null;function d(x){let y=x.isScene===!0?x.background:null;if(y&&y.isTexture){const M=x.backgroundBlurriness>0;y=e.get(y,M)}return y}function m(x){let y=!1;const M=d(x);M===null?g(a,o):M&&M.isColor&&(g(M,1),y=!0);const w=r.xr.getEnvironmentBlendMode();w==="additive"?t.buffers.color.setClear(0,0,0,1,s):w==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(r.autoClear||y)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function _(x,y){const M=d(y);M&&M.isCubeTexture?(c===void 0&&(c=new wt(new Hs(1,1,1),new Vt({name:"BackgroundCubeMaterial",uniforms:rs(Un.backgroundCube.uniforms),vertexShader:Un.backgroundCube.vertexShader,fragmentShader:Un.backgroundCube.fragmentShader,side:jt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,E,v){this.matrixWorld.copyPosition(v.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(s0.makeRotationFromEuler(y.backgroundRotation)).transpose(),M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Rh),c.material.toneMapped=Xe.getTransfer(M.colorSpace)!==nt,(h!==M||u!==M.version||f!==r.toneMapping)&&(c.material.needsUpdate=!0,h=M,u=M.version,f=r.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new wt(new vi(2,2),new Vt({name:"BackgroundMaterial",uniforms:rs(Un.background.uniforms),vertexShader:Un.background.vertexShader,fragmentShader:Un.background.fragmentShader,side:ei,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=Xe.getTransfer(M.colorSpace)!==nt,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||u!==M.version||f!==r.toneMapping)&&(l.material.needsUpdate=!0,h=M,u=M.version,f=r.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function g(x,y){x.getRGB(_r,yh(r)),t.buffers.color.setClear(_r.r,_r.g,_r.b,y,s)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(x,y=1){a.set(x),o=y,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(x){o=x,g(a,o)},render:m,addToRenderList:_,dispose:p}}function a0(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=f(null);let s=i,a=!1;function o(P,F,G,C,V){let q=!1;const W=u(P,C,G,F);s!==W&&(s=W,c(s.object)),q=d(P,C,G,V),q&&m(P,C,G,V),V!==null&&e.update(V,r.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,M(P,F,G,C),V!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return r.createVertexArray()}function c(P){return r.bindVertexArray(P)}function h(P){return r.deleteVertexArray(P)}function u(P,F,G,C){const V=C.wireframe===!0;let q=n[F.id];q===void 0&&(q={},n[F.id]=q);const W=P.isInstancedMesh===!0?P.id:0;let D=q[W];D===void 0&&(D={},q[W]=D);let O=D[G.id];O===void 0&&(O={},D[G.id]=O);let Y=O[V];return Y===void 0&&(Y=f(l()),O[V]=Y),Y}function f(P){const F=[],G=[],C=[];for(let V=0;V<t;V++)F[V]=0,G[V]=0,C[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:G,attributeDivisors:C,object:P,attributes:{},index:null}}function d(P,F,G,C){const V=s.attributes,q=F.attributes;let W=0;const D=G.getAttributes();for(const O in D)if(D[O].location>=0){const te=V[O];let xe=q[O];if(xe===void 0&&(O==="instanceMatrix"&&P.instanceMatrix&&(xe=P.instanceMatrix),O==="instanceColor"&&P.instanceColor&&(xe=P.instanceColor)),te===void 0||te.attribute!==xe||xe&&te.data!==xe.data)return!0;W++}return s.attributesNum!==W||s.index!==C}function m(P,F,G,C){const V={},q=F.attributes;let W=0;const D=G.getAttributes();for(const O in D)if(D[O].location>=0){let te=q[O];te===void 0&&(O==="instanceMatrix"&&P.instanceMatrix&&(te=P.instanceMatrix),O==="instanceColor"&&P.instanceColor&&(te=P.instanceColor));const xe={};xe.attribute=te,te&&te.data&&(xe.data=te.data),V[O]=xe,W++}s.attributes=V,s.attributesNum=W,s.index=C}function _(){const P=s.newAttributes;for(let F=0,G=P.length;F<G;F++)P[F]=0}function g(P){p(P,0)}function p(P,F){const G=s.newAttributes,C=s.enabledAttributes,V=s.attributeDivisors;G[P]=1,C[P]===0&&(r.enableVertexAttribArray(P),C[P]=1),V[P]!==F&&(r.vertexAttribDivisor(P,F),V[P]=F)}function x(){const P=s.newAttributes,F=s.enabledAttributes;for(let G=0,C=F.length;G<C;G++)F[G]!==P[G]&&(r.disableVertexAttribArray(G),F[G]=0)}function y(P,F,G,C,V,q,W){W===!0?r.vertexAttribIPointer(P,F,G,V,q):r.vertexAttribPointer(P,F,G,C,V,q)}function M(P,F,G,C){_();const V=C.attributes,q=G.getAttributes(),W=F.defaultAttributeValues;for(const D in q){const O=q[D];if(O.location>=0){let Y=V[D];if(Y===void 0&&(D==="instanceMatrix"&&P.instanceMatrix&&(Y=P.instanceMatrix),D==="instanceColor"&&P.instanceColor&&(Y=P.instanceColor)),Y!==void 0){const te=Y.normalized,xe=Y.itemSize,Pe=e.get(Y);if(Pe===void 0)continue;const $=Pe.buffer,de=Pe.type,Me=Pe.bytesPerElement,Re=de===r.INT||de===r.UNSIGNED_INT||Y.gpuType===wo;if(Y.isInterleavedBufferAttribute){const me=Y.data,Ie=me.isInterleavedBuffer===!0?me.stride:me.itemSize,ft=Y.offset;if(me.isInstancedInterleavedBuffer||me.isInstancedBufferAttribute){for(let Te=0;Te<O.locationSize;Te++)p(O.location+Te,me.meshPerAttribute);P.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=me.meshPerAttribute*me.count)}else for(let Te=0;Te<O.locationSize;Te++)g(O.location+Te);r.bindBuffer(r.ARRAY_BUFFER,$);for(let Te=0;Te<O.locationSize;Te++)y(O.location+Te,xe/O.locationSize,de,te,Ie*Me,(ft+xe/O.locationSize*Te)*Me,Re)}else{if(Y.isInstancedBufferAttribute){for(let me=0;me<O.locationSize;me++)p(O.location+me,Y.meshPerAttribute);P.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let me=0;me<O.locationSize;me++)g(O.location+me);r.bindBuffer(r.ARRAY_BUFFER,$);for(let me=0;me<O.locationSize;me++)y(O.location+me,xe/O.locationSize,de,te,xe*Me,xe/O.locationSize*me*Me,Re)}}else if(W!==void 0){const te=W[D];if(te!==void 0)switch(te.length){case 2:r.vertexAttrib2fv(O.location,te);break;case 3:r.vertexAttrib3fv(O.location,te);break;case 4:r.vertexAttrib4fv(O.location,te);break;default:r.vertexAttrib1fv(O.location,te)}}}}x()}function w(){I();for(const P in n){const F=n[P];for(const G in F){const C=F[G];for(const V in C){const q=C[V];for(const W in q)h(q[W].object),delete q[W];delete C[V]}}delete n[P]}}function E(P){if(n[P.id]===void 0)return;const F=n[P.id];for(const G in F){const C=F[G];for(const V in C){const q=C[V];for(const W in q)h(q[W].object),delete q[W];delete C[V]}}delete n[P.id]}function v(P){for(const F in n){const G=n[F];for(const C in G){const V=G[C];if(V[P.id]===void 0)continue;const q=V[P.id];for(const W in q)h(q[W].object),delete q[W];delete V[P.id]}}}function T(P){for(const F in n){const G=n[F],C=P.isInstancedMesh===!0?P.id:0,V=G[C];if(V!==void 0){for(const q in V){const W=V[q];for(const D in W)h(W[D].object),delete W[D];delete V[q]}delete G[C],Object.keys(G).length===0&&delete n[F]}}}function I(){R(),a=!0,s!==i&&(s=i,c(s.object))}function R(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:I,resetDefaultState:R,dispose:w,releaseStatesOfGeometry:E,releaseStatesOfObject:T,releaseStatesOfProgram:v,initAttributes:_,enableAttribute:g,disableUnusedAttributes:x}}function o0(r,e,t){let n;function i(l){n=l}function s(l,c){r.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(r.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let f=0;for(let d=0;d<h;d++)f+=c[d];t.update(f,n,1)}this.setMode=i,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function l0(r,e,t,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const v=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(v.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(v){return!(v!==sn&&n.convert(v)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(v){const T=v===rn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(v!==Qt&&v!==gn&&!T&&n.convert(v)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE))}function l(v){if(v==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";v="mediump"}return v==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(we("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=t.logarithmicDepthBuffer===!0&&u===!1;t.reversedDepthBuffer===!0&&u===!1&&we("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&u===!0&&we("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const d=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),m=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=r.getParameter(r.MAX_TEXTURE_SIZE),g=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),p=r.getParameter(r.MAX_VERTEX_ATTRIBS),x=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),y=r.getParameter(r.MAX_VARYING_VECTORS),M=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),w=r.getParameter(r.MAX_SAMPLES),E=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:x,maxVaryings:y,maxFragmentUniforms:M,maxSamples:w,samples:E}}function c0(r){const e=this;let t=null,n=0,i=!1,s=!1;const a=new ui,o=new Be,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||i;return i=f,n=u.length,d},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,d){const m=u.clippingPlanes,_=u.clipIntersection,g=u.clipShadows,p=r.get(u);if(!i||m===null||m.length===0||s&&!g)s?h(null):c();else{const x=s?0:n,y=x*4;let M=p.clippingState||null;l.value=M,M=h(m,f,y,d);for(let w=0;w!==y;++w)M[w]=t[w];p.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,d,m){const _=u!==null?u.length:0;let g=null;if(_!==0){if(g=l.value,m!==!0||g===null){const p=d+_*4,x=f.matrixWorldInverse;o.getNormalMatrix(x),(g===null||g.length<p)&&(g=new Float32Array(p));for(let y=0,M=d;y!==_;++y,M+=4)a.copy(u[y]).applyMatrix4(x,o),a.normal.toArray(g,M),g[M+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}class qo extends _n{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new gh(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Hs(5,5,5),s=new Vt({name:"CubemapFromEquirect",uniforms:rs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:jt,blending:Zi});s.uniforms.tEquirect.value=t;const a=new wt(i,s),o=t.minFilter;return t.minFilter===mn&&(t.minFilter=ut),new Mo(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(s)}}const ac=256,h0=3,u0=20,Ch=256,Ph=16,f0=3,d0=new z,p0=new Ne;class kr{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Mo(1,10,null),this._boxMesh=new wt(new Hs(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,i=100,s={}){const{size:a=256,position:o=d0}=s,l=this._renderer;this._setSize(a);const c=this._allocateTarget(),h=this._getSourceTarget(!0);t>0&&(h.texture.mipmapsAutoUpdate=!1);const u=l.autoClear,f=l.autoClearColor,d=l.autoClearDepth,m=l.autoClearStencil,_=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,_===null&&(e.background=l.getClearColor(p0));const g=new Mo(n,i,h);return g.position.copy(o),g.update(l,e),l.autoClear=u,l.autoClearColor=f,l.autoClearDepth=d,l.autoClearStencil=m,e.background=_,t>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=cc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=lc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(ac,ah(e))}_fromTexture(e,t){e.mapping===ts||e.mapping===Is?this._setSize(e.image.length===0?ac:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);const n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){const e=this._cubeSize,t=oc(e,!1,!1),n=Math.log2(e)-h0;for(let i=0;i<=n;i++)t.texture.mipmaps.push({width:e>>i,height:e>>i});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){const t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=oc(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){const i=this._boxMesh,s=this._cubeCamera;i.material=n,s.renderTarget=e,s.activeMipmapLevel=t;const a=e.width>>t;e.viewport.set(0,0,a,a),s.update(this._renderer,i),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===ts||e.mapping===Is?(this._cubemapMaterial===null&&(this._cubemapMaterial=cc()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=lc()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=m0(),this._integrationMaterial=g0());const t=this._cubeSize,n=e.texture.mipmaps.length-1,i=this._ggxMaterial.uniforms;i.envMap.value=this._sourceTarget.texture;const s=this._integrationMaterial.uniforms;s.envMap.value=this._sourceTarget.texture,s.sourceLod.value=Math.log2(t/Ph);for(let a=0;a<=n;a++){const o=kr.lodToRoughness(a,n);if(a>n-f0)s.roughness.value=o,this._renderCube(e,a,this._integrationMaterial);else{const l=o>0?Math.log2(t)+.5*Math.log2(6/(Ch*Math.pow(o,4)))+.5:0;i.roughness.value=o,i.lodBias.value=l,this._renderCube(e,a,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=v0());const n=this._blurMaterial,i=n.uniforms,s=this._sourceTarget;i.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,i.envMap.value=s.texture,this._renderCube(e,0,n),i.envMap.value=e.texture,this._renderCube(s,0,n)}}function oc(r,e,t){return new qo(r,{minFilter:mn,generateMipmaps:e,type:rn,colorSpace:en,depthBuffer:t})}function Vs(r,e,t){return new Vt({name:r,uniforms:e,vertexShader:He.cube_vert,fragmentShader:t,side:jt,blending:Zi,depthTest:!1,depthWrite:!1})}function m0(){return Vs("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Ch}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function g0(){return Vs("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Ph}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function v0(){return Vs("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${u0}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function lc(){return Vs("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function cc(){return Vs("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function _0(r){let e=new WeakMap,t=new WeakMap,n=null;function i(f,d=!1){return f==null?null:d?a(f):s(f)}function s(f){if(f&&f.isTexture){const d=f.mapping;if(d===Zr||d===$r)if(e.has(f)){const m=e.get(f).texture;return o(m,f.mapping)}else{const m=f.image;if(m&&m.height>0){const _=new qo(m.height);return _.fromEquirectangularTexture(r,f),e.set(f,_),f.addEventListener("dispose",c),o(_.texture,f.mapping)}else return null}}return f}function a(f){if(f&&f.isTexture&&f.isPMREMTexture!==!0){const d=f.mapping,m=d===Zr||d===$r,_=d===ts||d===Is;if(m||_){let g=t.get(f);const p=g!==void 0?g.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==p)return n===null&&(n=new kr(r)),g=m?n.fromEquirectangular(f,g):n.fromCubemap(f,g),g.texture.pmremVersion=f.pmremVersion,t.set(f,g),g.texture;if(g!==void 0)return g.texture;{const x=f.image;return m&&x&&x.height>0||_&&x&&l(x)?(n===null&&(n=new kr(r)),g=m?n.fromEquirectangular(f):n.fromCubemap(f),g.texture.pmremVersion=f.pmremVersion,t.set(f,g),f.addEventListener("dispose",h),g.texture):null}}}return f}function o(f,d){return d===Zr?f.mapping=ts:d===$r&&(f.mapping=Is),f}function l(f){let d=0;const m=6;for(let _=0;_<m;_++)f[_]!==void 0&&d++;return d===m}function c(f){const d=f.target;d.removeEventListener("dispose",c);const m=e.get(d);m!==void 0&&(e.delete(d),m.dispose())}function h(f){const d=f.target;d.removeEventListener("dispose",h);const m=t.get(d);m!==void 0&&(t.delete(d),m.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:u}}function x0(r){const e={};function t(n){if(e[n]!==void 0)return e[n];const i=r.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&$i("WebGLRenderer: "+n+" extension not supported."),i}}}function M0(r,e,t,n){const i={},s=new WeakMap,a=new FinalizationRegistry(m=>delete i[m]);function o(m){l(m.target)}function l(m){m.index!==null&&e.remove(m.index);for(const g in m.attributes)e.remove(m.attributes[g]);m.removeEventListener("dispose",o),delete i[m.id],a.unregister(m);const _=s.get(m);_&&(e.remove(_),s.delete(m)),n.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function c(m,_){return i[_.id]!==void 0||(_.addEventListener("dispose",o),i[_.id]=new WeakRef(_),a.register(_,_.id,_),t.memory.geometries++),_}function h(m){const _=m.attributes;for(const g in _)e.update(_[g],r.ARRAY_BUFFER)}function u(m){const _=m.index,g=m.attributes.position;let p=0;if(g===void 0)return;const x=_!==null?_.array.length:g.array.length/3-1,y=g.count>=65535?uh:hh,M=new y(Math.ceil(x/3)*6,1),w=M.array;if(_!==null){const v=_.array;p=_.version;for(let T=0,I=0;T<x;T+=3){const R=v[T+0],P=v[T+1],F=v[T+2];w[I++]=R,w[I++]=P,w[I++]=P,w[I++]=F,w[I++]=F,w[I++]=R}}else{p=g.version;for(let v=0,T=0;v<x;v+=3){const I=v+0,R=v+1,P=v+2;w[T++]=I,w[T++]=R,w[T++]=R,w[T++]=P,w[T++]=P,w[T++]=I}}M.version=p;const E=s.get(m);E&&e.remove(E),s.set(m,M)}function f(m){const _=s.get(m);if(_){const g=m.index;g!==null&&_.version<g.version&&u(m)}else u(m);return s.get(m)}function d(){for(const m in i){const _=i[m].deref();_!==void 0&&l(_)}}return{get:c,update:h,getWireframeAttribute:f,dispose:d}}function S0(r,e,t){let n;function i(u){n=u}let s,a;function o(u){s=u.type,a=u.bytesPerElement}function l(u,f){r.drawElements(n,f,s,u*a),t.update(f,n,1)}function c(u,f,d){d!==0&&(r.drawElementsInstanced(n,f,s,u*a,d),t.update(f,n,d))}function h(u,f,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,u,0,d);let _=0;for(let g=0;g<d;g++)_+=f[g];t.update(_,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function y0(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case r.TRIANGLES:t.triangles+=o*(s/3);break;case r.LINES:t.lines+=o*(s/2);break;case r.LINE_STRIP:t.lines+=o*(s-1);break;case r.LINE_LOOP:t.lines+=o*s;break;case r.POINTS:t.points+=o*s;break;default:De("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function b0(r,e,t){const n=new WeakMap,i=new Ze;function s(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(o);if(f===void 0||f.count!==u){let I=function(){v.dispose(),n.delete(o),o.removeEventListener("dispose",I)};f!==void 0&&f.texture.dispose();const d=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],x=o.morphAttributes.color||[];let y=0;d===!0&&(y=1),m===!0&&(y=2),_===!0&&(y=3);let M=o.attributes.position.count*y,w=1;M>e.maxTextureSize&&(w=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const E=new Float32Array(M*w*4*u),v=new oh(E,M,w,u);v.type=gn,v.needsUpdate=!0;const T=y*4;for(let R=0;R<u;R++){const P=g[R],F=p[R],G=x[R],C=M*w*4*R;for(let V=0;V<P.count;V++){const q=V*T;d===!0&&(i.fromBufferAttribute(P,V),E[C+q+0]=i.x,E[C+q+1]=i.y,E[C+q+2]=i.z,E[C+q+3]=0),m===!0&&(i.fromBufferAttribute(F,V),E[C+q+4]=i.x,E[C+q+5]=i.y,E[C+q+6]=i.z,E[C+q+7]=0),_===!0&&(i.fromBufferAttribute(G,V),E[C+q+8]=i.x,E[C+q+9]=i.y,E[C+q+10]=i.z,E[C+q+11]=G.itemSize===4?i.w:1)}}f={count:u,texture:v,size:new Ue(M,w)},n.set(o,f),o.addEventListener("dispose",I)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",a.morphTexture,t);else{let d=0;for(let _=0;_<c.length;_++)d+=c[_];const m=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(r,"morphTargetBaseInfluence",m),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(r,"morphTargetsTextureSize",f.size)}return{update:s}}function T0(r,e,t,n,i){let s=new WeakMap;function a(c){const h=i.render.frame,u=c.geometry,f=e.get(c,u);if(s.get(f)!==h&&(e.update(f),s.set(f,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==h&&(t.update(c.instanceMatrix,r.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,r.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==h&&(d.update(),s.set(d,h))}return f}function o(){s=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const E0={[Bc]:"LINEAR_TONE_MAPPING",[kc]:"REINHARD_TONE_MAPPING",[Gc]:"CINEON_TONE_MAPPING",[Hc]:"ACES_FILMIC_TONE_MAPPING",[Wc]:"AGX_TONE_MAPPING",[Xc]:"NEUTRAL_TONE_MAPPING",[Vc]:"CUSTOM_TONE_MAPPING"};function w0(r,e,t,n,i,s){const a=new _n(e,t,{type:r,depthBuffer:i,stencilBuffer:s,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null,c=null;const h=new Ct;h.setAttribute("position",new St([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new St([0,2,0,0,2,0],2));const u=new kf({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new wt(h,u),d=new Wr(-1,1,1,-1,0,1);let m=null,_=null,g=!1,p,x=null,y=[],M=!1;this.setSize=function(w,E){a.setSize(w,E),o!==null&&o.setSize(w,E),l!==null&&l.setSize(w,E);for(let v=0;v<y.length;v++){const T=y[v];T.setSize&&T.setSize(w,E)}},this.setEffects=function(w){y=w,M=y.length>0&&y[0].isRenderPass===!0;const E=a.width,v=a.height;y.length>0&&o===null&&(o=new _n(E,v,{type:rn,depthBuffer:!1,stencilBuffer:!1}),l=new _n(E,v,{type:rn,depthBuffer:!1,stencilBuffer:!1}));const T=i===!0&&y.some(I=>I.needsDepthTexture===!0);T!==(a.depthTexture!==null)&&(T===!0&&c===null&&(c=new ss(E,v),s===!0&&(c.format=di,c.type=ns)),a.dispose(),a.depthTexture=T?c:null,a.resolveDepthBuffer=T,a.storeMultisampledDepthBuffer=T);for(let I=0;I<y.length;I++){const R=y[I];R.setSize&&R.setSize(E,v),T&&R.needsDepthTexture===!0&&R.setDepthTexture&&R.setDepthTexture(c)}},this.begin=function(w,E){if(g||w.toneMapping===On&&y.length===0)return!1;if(x=E,E!==null){const v=E.width,T=E.height;(a.width!==v||a.height!==T)&&this.setSize(v,T)}return M===!1&&w.setRenderTarget(a),p=w.toneMapping,w.toneMapping=On,!0},this.hasRenderPass=function(){return M},this.end=function(w,E){w.toneMapping=p,g=!0;let v=a,T=o;for(let I=0;I<y.length;I++){const R=y[I];R.enabled!==!1&&(R.render(w,T,v,E),R.needsSwap!==!1&&(v=T,T=T===o?l:o))}if(m!==w.outputColorSpace||_!==w.toneMapping){m=w.outputColorSpace,_=w.toneMapping,u.defines={},Xe.getTransfer(m)===nt&&(u.defines.SRGB_TRANSFER="");const I=E0[_];I&&(u.defines[I]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=v.texture,w.setRenderTarget(x),w.render(f,d),x=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),h.dispose(),u.dispose()}}const Lh=new Mt,Ih=new ss(1,1),Dh=new vh(1),Nh=new oh,Uh=new cf,Fh=new gh,hc=[],uc=[],fc=new Float32Array(16),dc=new Float32Array(9),pc=new Float32Array(4);function hs(r,e,t){const n=r[0];if(n<=0||n>0)return r;const i=e*t;let s=hc[i];if(s===void 0&&(s=new Float32Array(i),hc[i]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function At(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function Rt(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function Xr(r,e){let t=uc[e];t===void 0&&(t=new Int32Array(e),uc[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function A0(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function R0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;r.uniform2fv(this.addr,e),Rt(t,e)}}function C0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(At(t,e))return;r.uniform3fv(this.addr,e),Rt(t,e)}}function P0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;r.uniform4fv(this.addr,e),Rt(t,e)}}function L0(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(At(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Rt(t,e)}else{if(At(t,n))return;pc.set(n),r.uniformMatrix2fv(this.addr,!1,pc),Rt(t,n)}}function I0(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(At(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Rt(t,e)}else{if(At(t,n))return;dc.set(n),r.uniformMatrix3fv(this.addr,!1,dc),Rt(t,n)}}function D0(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(At(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Rt(t,e)}else{if(At(t,n))return;fc.set(n),r.uniformMatrix4fv(this.addr,!1,fc),Rt(t,n)}}function N0(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function U0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;r.uniform2iv(this.addr,e),Rt(t,e)}}function F0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;r.uniform3iv(this.addr,e),Rt(t,e)}}function O0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;r.uniform4iv(this.addr,e),Rt(t,e)}}function z0(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function B0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;r.uniform2uiv(this.addr,e),Rt(t,e)}}function k0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;r.uniform3uiv(this.addr,e),Rt(t,e)}}function G0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;r.uniform4uiv(this.addr,e),Rt(t,e)}}function qr(r){return r.version===0&&(r.compareFunction=ih,r.needsUpdate=!0),r}function H0(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?s=qr(Ih):s=Lh,t.setTexture2D(e||s,i)}function V0(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Uh,i)}function W0(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_CUBE_SHADOW?s=qr(Dh):s=Fh,t.setTextureCube(e||s,i)}function X0(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Nh,i)}function q0(r){switch(r){case 5126:return A0;case 35664:return R0;case 35665:return C0;case 35666:return P0;case 35674:return L0;case 35675:return I0;case 35676:return D0;case 5124:case 35670:return N0;case 35667:case 35671:return U0;case 35668:case 35672:return F0;case 35669:case 35673:return O0;case 5125:return z0;case 36294:return B0;case 36295:return k0;case 36296:return G0;case 35678:case 36198:case 36298:case 36306:case 35682:return H0;case 35679:case 36299:case 36307:return V0;case 35680:case 36300:case 36308:case 36293:return W0;case 36289:case 36303:case 36311:case 36292:return X0}}function Y0(r,e){r.uniform1fv(this.addr,e)}function K0(r,e){const t=hs(e,this.size,2);r.uniform2fv(this.addr,t)}function Z0(r,e){const t=hs(e,this.size,3);r.uniform3fv(this.addr,t)}function $0(r,e){const t=hs(e,this.size,4);r.uniform4fv(this.addr,t)}function J0(r,e){const t=hs(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function Q0(r,e){const t=hs(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function j0(r,e){const t=hs(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function eg(r,e){r.uniform1iv(this.addr,e)}function tg(r,e){r.uniform2iv(this.addr,e)}function ng(r,e){r.uniform3iv(this.addr,e)}function ig(r,e){r.uniform4iv(this.addr,e)}function sg(r,e){r.uniform1uiv(this.addr,e)}function rg(r,e){r.uniform2uiv(this.addr,e)}function ag(r,e){r.uniform3uiv(this.addr,e)}function og(r,e){r.uniform4uiv(this.addr,e)}function lg(r,e,t){const n=this.cache,i=e.length,s=Xr(t,i);At(n,s)||(r.uniform1iv(this.addr,s),Rt(n,s));let a;this.type===r.SAMPLER_2D_SHADOW?a=qr(Ih):a=Lh;for(let o=0;o!==i;++o)t.setTexture2D(e[o]||a,s[o])}function cg(r,e,t){const n=this.cache,i=e.length,s=Xr(t,i);At(n,s)||(r.uniform1iv(this.addr,s),Rt(n,s));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||Uh,s[a])}function hg(r,e,t){const n=this.cache,i=e.length,s=Xr(t,i);At(n,s)||(r.uniform1iv(this.addr,s),Rt(n,s));let a;this.type===r.SAMPLER_CUBE_SHADOW?a=qr(Dh):a=Fh;for(let o=0;o!==i;++o)t.setTextureCube(e[o]||a,s[o])}function ug(r,e,t){const n=this.cache,i=e.length,s=Xr(t,i);At(n,s)||(r.uniform1iv(this.addr,s),Rt(n,s));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||Nh,s[a])}function fg(r){switch(r){case 5126:return Y0;case 35664:return K0;case 35665:return Z0;case 35666:return $0;case 35674:return J0;case 35675:return Q0;case 35676:return j0;case 5124:case 35670:return eg;case 35667:case 35671:return tg;case 35668:case 35672:return ng;case 35669:case 35673:return ig;case 5125:return sg;case 36294:return rg;case 36295:return ag;case 36296:return og;case 35678:case 36198:case 36298:case 36306:case 35682:return lg;case 35679:case 36299:case 36307:return cg;case 35680:case 36300:case 36308:case 36293:return hg;case 36289:case 36303:case 36311:case 36292:return ug}}class dg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=q0(t.type)}}class pg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=fg(t.type)}}class mg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let s=0,a=i.length;s!==a;++s){const o=i[s];o.setValue(e,t[o.id],n)}}}const Ta=/(\w+)(\])?(\[|\.)?/g;function mc(r,e){r.seq.push(e),r.map[e.id]=e}function gg(r,e,t){const n=r.name,i=n.length;for(Ta.lastIndex=0;;){const s=Ta.exec(n),a=Ta.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){mc(t,c===void 0?new dg(o,r,e):new pg(o,r,e));break}else{let u=t.map[o];u===void 0&&(u=new mg(o),mc(t,u)),t=u}}}class Pr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);gg(o,l,this)}const i=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):s.push(a);i.length>0&&(this.seq=i.concat(s))}setValue(e,t,n,i){const s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,s=e.length;i!==s;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function gc(r,e,t){const n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}const vg=37297;let _g=0;function xg(r,e){const t=r.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=i;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const vc=new Be;function Mg(r){Xe._getMatrix(vc,Xe.workingColorSpace,r);const e=`mat3( ${vc.elements.map(t=>t.toFixed(4))} )`;switch(Xe.getTransfer(r)){case Ur:return[e,"LinearTransferOETF"];case nt:return[e,"sRGBTransferOETF"];default:return we("WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function _c(r,e,t){const n=r.getShaderParameter(e,r.COMPILE_STATUS),s=(r.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+xg(r.getShaderSource(e),o)}else return s}function Sg(r,e){const t=Mg(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const yg={[Bc]:"Linear",[kc]:"Reinhard",[Gc]:"Cineon",[Hc]:"ACESFilmic",[Wc]:"AgX",[Xc]:"Neutral",[Vc]:"Custom"};function bg(r,e){const t=yg[e];return t===void 0?(we("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const xr=new z;function Tg(){Xe.getLuminanceCoefficients(xr);const r=xr.x.toFixed(4),e=xr.y.toFixed(4),t=xr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Eg(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ws).join(`
`)}function wg(r){const e=[];for(const t in r){const n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Ag(r,e){const t={},n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(e,i),a=s.name;let o=1;s.type===r.FLOAT_MAT2&&(o=2),s.type===r.FLOAT_MAT3&&(o=3),s.type===r.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:r.getAttribLocation(e,a),locationSize:o}}return t}function ws(r){return r!==""}function xc(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function Mc(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Rg=/^[ \t]*#include +<([\w\d./]+)>/gm;function So(r){return r.replace(Rg,Cg)}function Cg(r,e){const t=He[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return So(t)}const Pg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Sc(r){return r.replace(Pg,Lg)}function Lg(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function yc(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Ig={[Tr]:"SHADOWMAP_TYPE_PCF",[bs]:"SHADOWMAP_TYPE_VSM"};function Dg(r){return Ig[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Ng={[Is]:"ENVMAP_MODE_REFRACTION"};function Ug(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":Ng[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Fg={[zc]:"ENVMAP_BLENDING_MULTIPLY",[bu]:"ENVMAP_BLENDING_MIX",[Tu]:"ENVMAP_BLENDING_ADD"};function Og(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":Fg[r.combine]||"ENVMAP_BLENDING_NONE"}function zg(r,e,t,n){const i=r.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Dg(t),c=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=Ug(t),u=Og(t),f=Eg(t),d=wg(s),m=i.createProgram();let _,g,p=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(ws).join(`
`),_.length>0&&(_+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(ws).join(`
`),g.length>0&&(g+=`
`)):(_=[yc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ws).join(`
`),g=[yc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==On?"#define TONE_MAPPING":"",t.toneMapping!==On?He.tonemapping_pars_fragment:"",t.toneMapping!==On?bg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",He.colorspace_pars_fragment,Sg("linearToOutputTexel",t.outputColorSpace),Tg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ws).join(`
`)),a=So(a),a=xc(a,t),a=Mc(a,t),o=So(o),o=xc(o,t),o=Mc(o,t),a=Sc(a),o=Sc(o),t.isRawShaderMaterial!==!0&&(p=`#version 300 es
`,_=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,g=["#define varying in",t.glslVersion===vl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===vl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const x=p+_+a,y=p+g+o,M=gc(i,i.VERTEX_SHADER,x),w=gc(i,i.FRAGMENT_SHADER,y);i.attachShader(m,M),i.attachShader(m,w),t.index0AttributeName!==void 0?i.bindAttribLocation(m,0,t.index0AttributeName):t.hasPositionAttribute===!0&&i.bindAttribLocation(m,0,"position"),i.linkProgram(m);function E(R){if(r.debug.checkShaderErrors){const P=i.getProgramInfoLog(m)||"",F=i.getShaderInfoLog(M)||"",G=i.getShaderInfoLog(w)||"",C=P.trim(),V=F.trim(),q=G.trim();let W=!0,D=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1)if(W=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,m,M,w);else{const O=_c(i,M,"vertex"),Y=_c(i,w,"fragment");De("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+C+`
`+O+`
`+Y)}else C!==""?we("WebGLProgram: Program Info Log:",C):(V===""||q==="")&&(D=!1);D&&(R.diagnostics={runnable:W,programLog:C,vertexShader:{log:V,prefix:_},fragmentShader:{log:q,prefix:g}})}i.deleteShader(M),i.deleteShader(w),v=new Pr(i,m),T=Ag(i,m)}let v;this.getUniforms=function(){return v===void 0&&E(this),v};let T;this.getAttributes=function(){return T===void 0&&E(this),T};let I=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=i.getProgramParameter(m,vg)),I},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=_g++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=M,this.fragmentShader=w,this}let Bg=0;class kg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const i=this._getShaderCacheForMaterial(e);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Gg(e),t.set(e,n)),n}}class Gg{constructor(e){this.id=Bg++,this.code=e,this.usedTimes=0}}function Hg(r){return r===Ci||r===Dr||r===Nr}function Vg(r,e,t,n,i,s){const a=new lh,o=new kg,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(v){return l.add(v),v===0?"uv":`uv${v}`}function m(v,T,I,R,P,F){const G=R.fog,C=P.geometry,V=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?R.environment:null,q=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,W=e.get(v.envMap||V,q),D=f[v.type];let O=n.precision;v.precision!==null&&(O=n.getMaxPrecision(v.precision),O!==v.precision&&we("WebGLProgram.getParameters:",v.precision,"not supported, using",O,"instead."));const Y=C.morphAttributes.position||C.morphAttributes.normal||C.morphAttributes.color,te=Y!==void 0?Y.length:0;let xe=0;C.morphAttributes.position!==void 0&&(xe=1),C.morphAttributes.normal!==void 0&&(xe=2),C.morphAttributes.color!==void 0&&(xe=3);let Pe,$,de,Me;if(D){const ge=Un[D];Pe=ge.vertexShader,$=ge.fragmentShader}else{Pe=v.vertexShader,$=v.fragmentShader;const ge=o.getVertexShaderStage(v),et=o.getFragmentShaderStage(v);o.update(v,ge,et),de=ge.id,Me=et.id}const Re=r.getRenderTarget(),me=r.state.buffers.depth.getReversed(),Ie=P.isInstancedMesh===!0,ft=P.isBatchedMesh===!0,Te=!!v.map,Qe=!!v.matcap,st=!!W,qe=st&&W.isPMREMTexture===!0,Ot=!!v.aoMap,yt=!!v.lightMap,Kt=!!v.bumpMap&&v.wireframe===!1,dt=!!v.normalMap,Ln=!!v.displacementMap,Pt=!!v.emissiveMap,an=!!v.metalnessMap,on=!!v.roughnessMap,ln=v.anisotropy>0,U=v.clearcoat>0,cn=v.diffuseRoughness>0,lt=v.dispersion>0,ct=v.retroreflectivity>0,pe=v.iridescence>0,bt=v.sheen>0,Le=v.transmission>0,Fe=ln&&!!v.anisotropyMap,A=U&&!!v.clearcoatMap,S=U&&!!v.clearcoatNormalMap,k=U&&!!v.clearcoatRoughnessMap,ie=cn&&!!v.diffuseRoughnessMap,ee=pe&&!!v.iridescenceMap,ae=pe&&!!v.iridescenceThicknessMap,ue=bt&&!!v.sheenColorMap,Z=bt&&!!v.sheenRoughnessMap,J=!!v.specularMap,le=!!v.specularColorMap,L=!!v.specularIntensityMap,Q=Le&&!!v.transmissionMap,K=Le&&!!v.thicknessMap,ce=!!v.gradientMap,re=!!v.alphaMap,oe=v.alphaTest>0,Ae=!!v.alphaHash,Ge=!!v.extensions;let se=On;v.toneMapped&&(Re===null||Re.isXRRenderTarget===!0)&&(se=r.toneMapping);const Ce=qe?W.isCompressedCubeTexture?W.image[0].mipmaps:W.mipmaps:null,ke={shaderID:D,shaderType:v.type,shaderName:v.name,vertexShader:Pe,fragmentShader:$,defines:v.defines,customVertexShaderID:de,customFragmentShaderID:Me,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:O,batching:ft,batchingColor:ft&&P._colorsTexture!==null,instancing:Ie,instancingColor:Ie&&P.instanceColor!==null,instancingMorph:Ie&&P.morphTexture!==null,outputColorSpace:Re===null?r.outputColorSpace:Re.isXRRenderTarget===!0?Re.texture.colorSpace:Xe.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:Te,matcap:Qe,envMap:st,envMapMode:st&&W.mapping,envMapPMREM:qe,envMapMaxLod:qe?Ce.length-1:null,envMapSize:qe?Ce[0].width:null,aoMap:Ot,lightMap:yt,bumpMap:Kt,normalMap:dt,displacementMap:Ln,emissiveMap:Pt,normalMapObjectSpace:dt&&v.normalMapType===Cu,normalMapTangentSpace:dt&&v.normalMapType===vo,packedNormalMap:dt&&v.normalMapType===vo&&Hg(v.normalMap.format),metalnessMap:an,roughnessMap:on,anisotropy:ln,anisotropyMap:Fe,clearcoat:U,clearcoatMap:A,clearcoatNormalMap:S,clearcoatRoughnessMap:k,diffuseRoughness:cn,diffuseRoughnessMap:ie,dispersion:lt,retroreflection:ct,iridescence:pe,iridescenceMap:ee,iridescenceThicknessMap:ae,sheen:bt,sheenColorMap:ue,sheenRoughnessMap:Z,specularMap:J,specularColorMap:le,specularIntensityMap:L,transmission:Le,transmissionMap:Q,thicknessMap:K,gradientMap:ce,opaque:v.transparent===!1&&v.blending===As&&v.alphaToCoverage===!1,alphaMap:re,alphaTest:oe,alphaHash:Ae,combine:v.combine,mapUv:Te&&d(v.map.channel),aoMapUv:Ot&&d(v.aoMap.channel),lightMapUv:yt&&d(v.lightMap.channel),bumpMapUv:Kt&&d(v.bumpMap.channel),normalMapUv:dt&&d(v.normalMap.channel),displacementMapUv:Ln&&d(v.displacementMap.channel),emissiveMapUv:Pt&&d(v.emissiveMap.channel),metalnessMapUv:an&&d(v.metalnessMap.channel),roughnessMapUv:on&&d(v.roughnessMap.channel),anisotropyMapUv:Fe&&d(v.anisotropyMap.channel),clearcoatMapUv:A&&d(v.clearcoatMap.channel),clearcoatNormalMapUv:S&&d(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:k&&d(v.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:ie&&d(v.diffuseRoughnessMap.channel),iridescenceMapUv:ee&&d(v.iridescenceMap.channel),iridescenceThicknessMapUv:ae&&d(v.iridescenceThicknessMap.channel),sheenColorMapUv:ue&&d(v.sheenColorMap.channel),sheenRoughnessMapUv:Z&&d(v.sheenRoughnessMap.channel),specularMapUv:J&&d(v.specularMap.channel),specularColorMapUv:le&&d(v.specularColorMap.channel),specularIntensityMapUv:L&&d(v.specularIntensityMap.channel),transmissionMapUv:Q&&d(v.transmissionMap.channel),thicknessMapUv:K&&d(v.thicknessMap.channel),alphaMapUv:re&&d(v.alphaMap.channel),vertexTangents:!!C.attributes.tangent&&(dt||ln),vertexNormals:!!C.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!C.attributes.color&&C.attributes.color.itemSize===4,pointsUvs:P.isPoints===!0&&!!C.attributes.uv&&(Te||re),fog:!!G,useFog:v.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||C.attributes.normal===void 0&&dt===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:me,skinning:P.isSkinnedMesh===!0,hasPositionAttribute:C.attributes.position!==void 0,morphTargets:C.morphAttributes.position!==void 0,morphNormals:C.morphAttributes.normal!==void 0,morphColors:C.morphAttributes.color!==void 0,morphTargetsCount:te,morphTextureStride:xe,numSunLights:T.sun.length,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numSunLightShadows:T.sunShadowMap.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:F.filter(ge=>ge.texture!==null).length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:v.dithering,shadowMapEnabled:r.shadowMap.enabled&&I.length>0,shadowMapType:r.shadowMap.type,toneMapping:se,decodeVideoTexture:Te&&v.map.isVideoTexture===!0&&Xe.getTransfer(v.map.colorSpace)===nt,decodeVideoTextureEmissive:Pt&&v.emissiveMap.isVideoTexture===!0&&Xe.getTransfer(v.emissiveMap.colorSpace)===nt,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===pn,flipSided:v.side===jt,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:Ge&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ge&&v.extensions.multiDraw===!0||ft)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return ke.vertexUv1s=l.has(1),ke.vertexUv2s=l.has(2),ke.vertexUv3s=l.has(3),l.clear(),ke}function _(v){const T=[];if(v.shaderID?T.push(v.shaderID):(T.push(v.customVertexShaderID),T.push(v.customFragmentShaderID)),v.defines!==void 0)for(const I in v.defines)T.push(I),T.push(v.defines[I]);return v.isRawShaderMaterial===!1&&(g(T,v),p(T,v),T.push(r.outputColorSpace)),T.push(v.customProgramCacheKey),T.join()}function g(v,T){v.push(T.precision),v.push(T.outputColorSpace),v.push(T.envMapMode),v.push(T.envMapPMREM),v.push(T.envMapMaxLod),v.push(T.envMapSize),v.push(T.mapUv),v.push(T.alphaMapUv),v.push(T.lightMapUv),v.push(T.aoMapUv),v.push(T.bumpMapUv),v.push(T.normalMapUv),v.push(T.displacementMapUv),v.push(T.emissiveMapUv),v.push(T.metalnessMapUv),v.push(T.roughnessMapUv),v.push(T.anisotropyMapUv),v.push(T.clearcoatMapUv),v.push(T.clearcoatNormalMapUv),v.push(T.clearcoatRoughnessMapUv),v.push(T.diffuseRoughnessMapUv),v.push(T.iridescenceMapUv),v.push(T.iridescenceThicknessMapUv),v.push(T.sheenColorMapUv),v.push(T.sheenRoughnessMapUv),v.push(T.specularMapUv),v.push(T.specularColorMapUv),v.push(T.specularIntensityMapUv),v.push(T.transmissionMapUv),v.push(T.thicknessMapUv),v.push(T.combine),v.push(T.fogExp2),v.push(T.sizeAttenuation),v.push(T.morphTargetsCount),v.push(T.numSunLights),v.push(T.numDirLights),v.push(T.numPointLights),v.push(T.numSpotLights),v.push(T.numSpotLightMaps),v.push(T.numHemiLights),v.push(T.numRectAreaLights),v.push(T.numSunLightShadows),v.push(T.numDirLightShadows),v.push(T.numPointLightShadows),v.push(T.numSpotLightShadows),v.push(T.numSpotLightShadowsWithMaps),v.push(T.numLightProbes),v.push(T.numLightProbeGrids),v.push(T.shadowMapType),v.push(T.toneMapping),v.push(T.numClippingPlanes),v.push(T.numClipIntersection),v.push(T.depthPacking)}function p(v,T){a.disableAll(),T.instancing&&a.enable(0),T.instancingColor&&a.enable(1),T.instancingMorph&&a.enable(2),T.matcap&&a.enable(3),T.envMap&&a.enable(4),T.normalMapObjectSpace&&a.enable(5),T.normalMapTangentSpace&&a.enable(6),T.clearcoat&&a.enable(7),T.iridescence&&a.enable(8),T.alphaTest&&a.enable(9),T.vertexColors&&a.enable(10),T.vertexAlphas&&a.enable(11),T.vertexUv1s&&a.enable(12),T.vertexUv2s&&a.enable(13),T.vertexUv3s&&a.enable(14),T.vertexTangents&&a.enable(15),T.anisotropy&&a.enable(16),T.alphaHash&&a.enable(17),T.batching&&a.enable(18),T.dispersion&&a.enable(19),T.retroreflection&&a.enable(24),T.diffuseRoughness&&a.enable(25),T.batchingColor&&a.enable(20),T.gradientMap&&a.enable(21),T.packedNormalMap&&a.enable(22),T.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.reversedDepthBuffer&&a.enable(4),T.skinning&&a.enable(5),T.morphTargets&&a.enable(6),T.morphNormals&&a.enable(7),T.morphColors&&a.enable(8),T.premultipliedAlpha&&a.enable(9),T.shadowMapEnabled&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),T.decodeVideoTextureEmissive&&a.enable(20),T.alphaToCoverage&&a.enable(21),T.numLightProbeGrids>0&&a.enable(22),T.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function x(v){const T=f[v.type];let I;if(T){const R=Un[T];I=Of.clone(R.uniforms)}else I=v.uniforms;return I}function y(v,T){let I=h.get(T);return I!==void 0?++I.usedTimes:(I=new zg(r,T,v,i),c.push(I),h.set(T,I)),I}function M(v){if(--v.usedTimes===0){const T=c.indexOf(v);c[T]=c[c.length-1],c.pop(),h.delete(v.cacheKey),v.destroy()}}function w(v){o.remove(v)}function E(){o.dispose()}return{getParameters:m,getProgramCacheKey:_,getUniforms:x,acquireProgram:y,releaseProgram:M,releaseShaderCache:w,programs:c,dispose:E}}function Wg(){let r=new WeakMap;function e(a){return r.has(a)}function t(a){let o=r.get(a);return o===void 0&&(o={},r.set(a,o)),o}function n(a){r.delete(a)}function i(a,o,l){r.get(a)[o]=l}function s(){r=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:s}}function Xg(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.materialVariant!==e.materialVariant?r.materialVariant-e.materialVariant:r.z!==e.z?r.z-e.z:r.id-e.id}function bc(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function Tc(){const r=[];let e=0;const t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function a(f){let d=0;return f.isInstancedMesh&&(d+=2),f.isSkinnedMesh&&(d+=1),d}function o(f,d,m,_,g,p){let x=r[e];return x===void 0?(x={id:f.id,object:f,geometry:d,material:m,materialVariant:a(f),groupOrder:_,renderOrder:f.renderOrder,z:g,group:p},r[e]=x):(x.id=f.id,x.object=f,x.geometry=d,x.material=m,x.materialVariant=a(f),x.groupOrder=_,x.renderOrder=f.renderOrder,x.z=g,x.group=p),e++,x}function l(f,d,m,_,g,p,x){x.reversedDepth===!0&&(g=-g);const y=o(f,d,m,_,g,p);m.transmission>0?n.push(y):m.transparent===!0?i.push(y):t.push(y)}function c(f,d,m,_,g,p){const x=o(f,d,m,_,g,p);m.transmission>0?n.unshift(x):m.transparent===!0?i.unshift(x):t.unshift(x)}function h(f,d){t.length>1&&t.sort(f||Xg),n.length>1&&n.sort(d||bc),i.length>1&&i.sort(d||bc)}function u(){for(let f=e,d=r.length;f<d;f++){const m=r[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:l,unshift:c,finish:u,sort:h}}function qg(){let r=new WeakMap;function e(n,i){const s=r.get(n);let a;return s===void 0?(a=new Tc,r.set(n,[a])):i>=s.length?(a=new Tc,s.push(a)):a=s[i],a}function t(){r=new WeakMap}return{get:e,dispose:t}}function Yg(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new z,color:new Ne};break;case"SpotLight":t={position:new z,direction:new z,color:new Ne,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new z,color:new Ne,distance:0,decay:0};break;case"HemisphereLight":t={direction:new z,skyColor:new Ne,groundColor:new Ne};break;case"RectAreaLight":t={color:new Ne,position:new z,halfWidth:new z,halfHeight:new z};break}return r[e.id]=t,t}}}function Kg(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let Zg=0;function $g(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function Jg(r){const e=new Yg,t=Kg(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new z);const i=new z,s=new Oe,a=new Oe;function o(c){let h=0,u=0,f=0;for(let F=0;F<9;F++)n.probe[F].set(0,0,0);let d=0,m=0,_=0,g=0,p=0,x=0,y=0,M=0,w=0,E=0,v=0,T=0,I=0,R=0;c.sort($g);for(let F=0,G=c.length;F<G;F++){const C=c[F],V=C.color,q=C.intensity,W=C.distance;let D=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===Ci?D=C.shadow.map.texture:D=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)h+=V.r*q,u+=V.g*q,f+=V.b*q;else if(C.isLightProbe){for(let O=0;O<9;O++)n.probe[O].addScaledVector(C.sh.coefficients[O],q);R++}else if(C.isSunLight){const O=e.get(C);if(O.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const Y=C.shadow,te=t.get(C);te.shadowIntensity=Y.intensity,te.shadowBias=Y.bias,te.shadowNormalBias=Y.normalBias,te.shadowRadius=Y.radius,te.shadowMapSize.copy(Y.mapSize).multiply(Y.getFrameExtents()),n.sunShadow[m]=te,n.sunShadowMap[m]=D;const xe=Y.getViewportCount();for(let Pe=0;Pe<xe;Pe++)n.sunShadowMatrix[_+Pe]=Y.getMatrix(Pe),n.sunShadowCascade[_+Pe]=Y._cascadeData[Pe];_+=xe,m++}n.sun[d]=O,d++}else if(C.isDirectionalLight){const O=e.get(C);if(O.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const Y=C.shadow,te=t.get(C);te.shadowIntensity=Y.intensity,te.shadowBias=Y.bias,te.shadowNormalBias=Y.normalBias,te.shadowRadius=Y.radius,te.shadowMapSize=Y.mapSize,n.directionalShadow[g]=te,n.directionalShadowMap[g]=D,n.directionalShadowMatrix[g]=C.shadow.matrix,w++}n.directional[g]=O,g++}else if(C.isSpotLight){const O=e.get(C);O.position.setFromMatrixPosition(C.matrixWorld),O.color.copy(V).multiplyScalar(q),O.distance=W,O.coneCos=Math.cos(C.angle),O.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),O.decay=C.decay,n.spot[x]=O;const Y=C.shadow;if(C.map&&(n.spotLightMap[T]=C.map,T++,Y.updateMatrices(C),C.castShadow&&I++),n.spotLightMatrix[x]=Y.matrix,C.castShadow){const te=t.get(C);te.shadowIntensity=Y.intensity,te.shadowBias=Y.bias,te.shadowNormalBias=Y.normalBias,te.shadowRadius=Y.radius,te.shadowMapSize=Y.mapSize,n.spotShadow[x]=te,n.spotShadowMap[x]=D,v++}x++}else if(C.isRectAreaLight){const O=e.get(C);O.color.copy(V).multiplyScalar(q),O.halfWidth.set(C.width*.5,0,0),O.halfHeight.set(0,C.height*.5,0),n.rectArea[y]=O,y++}else if(C.isPointLight){const O=e.get(C);if(O.color.copy(C.color).multiplyScalar(C.intensity),O.distance=C.distance,O.decay=C.decay,C.castShadow){const Y=C.shadow,te=t.get(C);te.shadowIntensity=Y.intensity,te.shadowBias=Y.bias,te.shadowNormalBias=Y.normalBias,te.shadowRadius=Y.radius,te.shadowMapSize=Y.mapSize,te.shadowCameraNear=Y.camera.near,te.shadowCameraFar=Y.camera.far,n.pointShadow[p]=te,n.pointShadowMap[p]=D,n.pointShadowMatrix[p]=C.shadow.matrix,E++}n.point[p]=O,p++}else if(C.isHemisphereLight){const O=e.get(C);O.skyColor.copy(C.color).multiplyScalar(q),O.groundColor.copy(C.groundColor).multiplyScalar(q),n.hemi[M]=O,M++}}y>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ve.LTC_FLOAT_1,n.rectAreaLTC2=ve.LTC_FLOAT_2):(n.rectAreaLTC1=ve.LTC_HALF_1,n.rectAreaLTC2=ve.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const P=n.hash;(P.sunLength!==d||P.directionalLength!==g||P.pointLength!==p||P.spotLength!==x||P.rectAreaLength!==y||P.hemiLength!==M||P.numSunShadows!==m||P.numDirectionalShadows!==w||P.numPointShadows!==E||P.numSpotShadows!==v||P.numSpotMaps!==T||P.numLightProbes!==R)&&(n.sun.length=d,n.directional.length=g,n.spot.length=x,n.rectArea.length=y,n.point.length=p,n.hemi.length=M,n.sunShadow.length=m,n.sunShadowMap.length=m,n.sunShadowMatrix.length=_,n.sunShadowCascade.length=_,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.directionalShadowMatrix.length=w,n.pointShadow.length=E,n.pointShadowMap.length=E,n.pointShadowMatrix.length=E,n.spotShadow.length=v,n.spotShadowMap.length=v,n.spotLightMatrix.length=v+T-I,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=I,n.numLightProbes=R,P.sunLength=d,P.directionalLength=g,P.pointLength=p,P.spotLength=x,P.rectAreaLength=y,P.hemiLength=M,P.numSunShadows=m,P.numDirectionalShadows=w,P.numPointShadows=E,P.numSpotShadows=v,P.numSpotMaps=T,P.numLightProbes=R,n.version=Zg++)}function l(c,h){let u=0,f=0,d=0,m=0,_=0,g=0;const p=h.matrixWorldInverse;for(let x=0,y=c.length;x<y;x++){const M=c[x];if(M.isSunLight){const w=n.sun[u];w.direction.setFromMatrixPosition(M.matrixWorld),w.direction.transformDirection(p),u++}else if(M.isDirectionalLight){const w=n.directional[f];w.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),w.direction.sub(i),w.direction.transformDirection(p),f++}else if(M.isSpotLight){const w=n.spot[m];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(p),w.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),w.direction.sub(i),w.direction.transformDirection(p),m++}else if(M.isRectAreaLight){const w=n.rectArea[_];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(p),a.identity(),s.copy(M.matrixWorld),s.premultiply(p),a.extractRotation(s),w.halfWidth.set(M.width*.5,0,0),w.halfHeight.set(0,M.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),_++}else if(M.isPointLight){const w=n.point[d];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(p),d++}else if(M.isHemisphereLight){const w=n.hemi[g];w.direction.setFromMatrixPosition(M.matrixWorld),w.direction.transformDirection(p),g++}}}return{setup:o,setupView:l,state:n}}function Ec(r){const e=new Jg(r),t=[],n=[],i=[];function s(u){h.camera=u,t.length=0,n.length=0,i.length=0}function a(u){u.isLightProbeGrid?i.push(u):t.push(u)}function o(u){n.push(u)}function l(){e.setup(t),i.sort((u,f)=>u.priority-f.priority||u.id-f.id)}function c(u){e.setupView(t,u)}const h={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:h,setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function Qg(r){let e=new WeakMap;function t(i,s=0){const a=e.get(i);let o;return a===void 0?(o=new Ec(r),e.set(i,[o])):s>=a.length?(o=new Ec(r),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const jg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ev=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,tv=[new z(1,0,0),new z(-1,0,0),new z(0,1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1)],nv=[new z(0,-1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1),new z(0,-1,0),new z(0,-1,0)],wc=new Oe,Ms=new z,Ea=new z;function iv(r,e,t){let n=new Bs;const i=new Ue,s=new Ue,a=new Ze,o=new Gf,l=new Hf,c={},h=t.maxTextureSize,u={[ei]:jt,[jt]:ei,[pn]:pn},f=new Vt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ue},radius:{value:4}},vertexShader:jg,fragmentShader:ev}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const m=new Ct;m.setAttribute("position",new ht(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new wt(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Tr;let p=this.type;this.render=function(E,v,T){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;this.type===su&&(we("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Tr);const I=r.getRenderTarget(),R=r.getActiveCubeFace(),P=r.getActiveMipmapLevel(),F=r.state;F.setBlending(Zi),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const G=p!==this.type;G&&v.traverse(function(C){C.material&&(Array.isArray(C.material)?C.material.forEach(V=>V.needsUpdate=!0):C.material.needsUpdate=!0)});for(let C=0,V=E.length;C<V;C++){const q=E[C],W=q.shadow;if(W===void 0){we("WebGLShadowMap:",q,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;i.copy(W.mapSize);const D=W.getFrameExtents();i.multiply(D),s.copy(W.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/D.x),i.x=s.x*D.x,W.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/D.y),i.y=s.y*D.y,W.mapSize.y=s.y));const O=r.state.buffers.depth.getReversed();if(W.camera._reversedDepth=O,W.map===null||G===!0){if(W.map!==null&&(W.map.depthTexture!==null&&(W.map.depthTexture.dispose(),W.map.depthTexture=null),W.map.dispose()),this.type===bs){if(q.isPointLight){we("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}W.map=new _n(i.x,i.y,{format:Ci,type:rn,minFilter:ut,magFilter:ut,generateMipmaps:!1}),W.map.texture.name=q.name+".shadowMap",W.map.depthTexture=new ss(i.x,i.y,gn),W.map.depthTexture.name=q.name+".shadowMapDepth",W.map.depthTexture.format=mi,W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=vt,W.map.depthTexture.magFilter=vt}else q.isPointLight?(W.map=new qo(i.x),W.map.depthTexture=new vh(i.x,Bn)):(W.map=new _n(i.x,i.y),W.map.depthTexture=new ss(i.x,i.y,Bn)),W.map.depthTexture.name=q.name+".shadowMap",W.map.depthTexture.format=mi,this.type===Tr?(W.map.depthTexture.compareFunction=O?nh:th,W.map.depthTexture.minFilter=ut,W.map.depthTexture.magFilter=ut):(W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=vt,W.map.depthTexture.magFilter=vt);W.camera.updateProjectionMatrix()}W.map.isWebGLCubeRenderTarget!==!0&&(W.map.width!==i.x||W.map.height!==i.y)&&W.map.setSize(i.x,i.y);const Y=W.map.isWebGLCubeRenderTarget?6:W.getViewportCount();q.isPointLight!==!0&&W.updateMatrices(q,T);const te=(W.camera.layers.mask&4294967294)!==0?W.camera.layers:T.layers;for(let xe=0;xe<Y;xe++){const Pe=W.getCamera(xe);if(q.isPointLight){const $=W.camera,de=W.matrix,Me=q.distance||$.far;Me!==$.far&&($.far=Me,$.updateProjectionMatrix()),Ms.setFromMatrixPosition(q.matrixWorld),$.position.copy(Ms),Ea.copy($.position),Ea.add(tv[xe]),$.up.copy(nv[xe]),$.lookAt(Ea),$.updateMatrixWorld(),de.makeTranslation(-Ms.x,-Ms.y,-Ms.z),wc.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),W._frustum.setFromProjectionMatrix(wc,$.coordinateSystem,$.reversedDepth)}if(W.map.isWebGLCubeRenderTarget)r.setRenderTarget(W.map,xe),r.clear();else{xe===0&&(r.setRenderTarget(W.map),r.clear());const $=W.getViewport(xe);a.set(s.x*$.x,s.y*$.y,s.x*$.z,s.y*$.w),F.viewport(a)}n=W.getFrustum(xe),M(v,T,Pe,q,te,this.type)}W.isPointLightShadow!==!0&&this.type===bs&&x(W,T),W.needsUpdate=!1}p=this.type,g.needsUpdate=!1,r.setRenderTarget(I,R,P)};function x(E,v){const T=e.update(_);f.defines.VSM_SAMPLES!==E.blurSamples&&(f.defines.VSM_SAMPLES=E.blurSamples,d.defines.VSM_SAMPLES=E.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),E.mapPass===null?E.mapPass=new _n(i.x,i.y,{format:Ci,type:rn}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),f.uniforms.shadow_pass.value=E.map.depthTexture,f.uniforms.resolution.value.set(E.map.width,E.map.height),f.uniforms.radius.value=E.radius,r.setRenderTarget(E.mapPass),r.clear(),r.renderBufferDirect(v,null,T,f,_,null),d.uniforms.shadow_pass.value=E.mapPass.texture,d.uniforms.resolution.value.set(E.map.width,E.map.height),d.uniforms.radius.value=E.radius,r.setRenderTarget(E.map),r.clear(),r.renderBufferDirect(v,null,T,d,_,null)}function y(E,v,T,I){let R=null;const P=T.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(P!==void 0)R=P;else if(R=T.isPointLight===!0?l:o,r.localClippingEnabled&&v.clipShadows===!0&&Array.isArray(v.clippingPlanes)&&v.clippingPlanes.length!==0||v.displacementMap&&v.displacementScale!==0||v.alphaMap&&v.alphaTest>0||v.map&&v.alphaTest>0||v.alphaToCoverage===!0){const F=R.uuid,G=v.uuid;let C=c[F];C===void 0&&(C={},c[F]=C);let V=C[G];V===void 0&&(V=R.clone(),C[G]=V,v.addEventListener("dispose",w)),R=V}if(R.visible=v.visible,R.wireframe=v.wireframe,I===bs?R.side=v.shadowSide!==null?v.shadowSide:v.side:R.side=v.shadowSide!==null?v.shadowSide:u[v.side],R.alphaMap=v.alphaMap,R.alphaTest=v.alphaToCoverage===!0?.5:v.alphaTest,R.map=v.map,R.clipShadows=v.clipShadows,R.clippingPlanes=v.clippingPlanes,R.clipIntersection=v.clipIntersection,R.displacementMap=v.displacementMap,R.displacementScale=v.displacementScale,R.displacementBias=v.displacementBias,R.wireframeLinewidth=v.wireframeLinewidth,R.linewidth=v.linewidth,T.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const F=r.properties.get(R);F.light=T}return R}function M(E,v,T,I,R,P){if(E.visible===!1)return;if(E.layers.test(R)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&P===bs)&&(!E.frustumCulled||E.intersectsFrustum(n))){E.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,E.matrixWorld);const C=e.update(E),V=E.material;if(Array.isArray(V)){const q=C.groups;for(let W=0,D=q.length;W<D;W++){const O=q[W],Y=V[O.materialIndex];if(Y&&Y.visible){const te=y(E,Y,I,P);E.onBeforeShadow(r,E,v,T,C,te,O),r.renderBufferDirect(T,null,C,te,E,O),E.onAfterShadow(r,E,v,T,C,te,O)}}}else if(V.visible){const q=y(E,V,I,P);E.onBeforeShadow(r,E,v,T,C,q,null),r.renderBufferDirect(T,null,C,q,E,null),E.onAfterShadow(r,E,v,T,C,q,null)}}const G=E.children;for(let C=0,V=G.length;C<V;C++)M(G[C],v,T,I,R,P)}function w(E){E.target.removeEventListener("dispose",w);for(const T in c){const I=c[T],R=E.target.uuid;R in I&&(I[R].dispose(),delete I[R])}}}function sv(r,e){function t(){let L=!1;const Q=new Ze;let K=null;const ce=new Ze(0,0,0,0);return{setMask:function(re){K!==re&&!L&&(r.colorMask(re,re,re,re),K=re)},setLocked:function(re){L=re},setClear:function(re,oe,Ae,Ge,se){se===!0&&(re*=Ge,oe*=Ge,Ae*=Ge),Q.set(re,oe,Ae,Ge),ce.equals(Q)===!1&&(r.clearColor(re,oe,Ae,Ge),ce.copy(Q))},reset:function(){L=!1,K=null,ce.set(-1,0,0,0)}}}function n(){let L=!1,Q=!1,K=null,ce=null,re=null;return{setReversed:function(oe){if(Q!==oe){const Ae=e.get("EXT_clip_control");oe?Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.ZERO_TO_ONE_EXT):Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.NEGATIVE_ONE_TO_ONE_EXT),Q=oe;const Ge=re;re=null,this.setClear(Ge)}},getReversed:function(){return Q},setTest:function(oe){oe?me(r.DEPTH_TEST):Ie(r.DEPTH_TEST)},setMask:function(oe){K!==oe&&!L&&(r.depthMask(oe),K=oe)},setFunc:function(oe){if(Q&&(oe=ku[oe]),ce!==oe){switch(oe){case Ia:r.depthFunc(r.NEVER);break;case Da:r.depthFunc(r.ALWAYS);break;case Na:r.depthFunc(r.LESS);break;case Ls:r.depthFunc(r.LEQUAL);break;case Ua:r.depthFunc(r.EQUAL);break;case Fa:r.depthFunc(r.GEQUAL);break;case Oa:r.depthFunc(r.GREATER);break;case za:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}ce=oe}},setLocked:function(oe){L=oe},setClear:function(oe){re!==oe&&(re=oe,Q&&(oe=1-oe),r.clearDepth(oe))},reset:function(){L=!1,K=null,ce=null,re=null,Q=!1}}}function i(){let L=!1,Q=null,K=null,ce=null,re=null,oe=null,Ae=null,Ge=null,se=null;return{setTest:function(Ce){L||(Ce?me(r.STENCIL_TEST):Ie(r.STENCIL_TEST))},setMask:function(Ce){Q!==Ce&&!L&&(r.stencilMask(Ce),Q=Ce)},setFunc:function(Ce,ke,ge){(K!==Ce||ce!==ke||re!==ge)&&(r.stencilFunc(Ce,ke,ge),K=Ce,ce=ke,re=ge)},setOp:function(Ce,ke,ge){(oe!==Ce||Ae!==ke||Ge!==ge)&&(r.stencilOp(Ce,ke,ge),oe=Ce,Ae=ke,Ge=ge)},setLocked:function(Ce){L=Ce},setClear:function(Ce){se!==Ce&&(r.clearStencil(Ce),se=Ce)},reset:function(){L=!1,Q=null,K=null,ce=null,re=null,oe=null,Ae=null,Ge=null,se=null}}}const s=new t,a=new n,o=new i;let l={};const c=new WeakMap;let h={},u={},f={},d=new WeakMap,m=[],_=null,g=!1,p=null,x=null,y=null,M=null,w=null,E=null,v=null,T=new Ne(0,0,0),I=0,R=!1,P=null,F=null,G=null,C=null,V=null;const q=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,D=0;const O=r.getParameter(r.VERSION);O.indexOf("WebGL")!==-1?(D=parseFloat(/^WebGL (\d)/.exec(O)[1]),W=D>=1):O.indexOf("OpenGL ES")!==-1&&(D=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),W=D>=2);let Y=null,te={};const xe=r.getParameter(r.SCISSOR_BOX),Pe=r.getParameter(r.VIEWPORT),$=new Ze().fromArray(xe),de=new Ze().fromArray(Pe);function Me(L,Q,K,ce){const re=new Uint8Array(4),oe=r.createTexture();r.bindTexture(L,oe),r.texParameteri(L,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(L,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Ae=0;Ae<K;Ae++)L===r.TEXTURE_3D||L===r.TEXTURE_2D_ARRAY?r.texImage3D(Q,0,r.RGBA,1,1,ce,0,r.RGBA,r.UNSIGNED_BYTE,re):r.texImage2D(Q+Ae,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,re);return oe}const Re={};Re[r.TEXTURE_2D]=Me(r.TEXTURE_2D,r.TEXTURE_2D,1),Re[r.TEXTURE_CUBE_MAP]=Me(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),Re[r.TEXTURE_2D_ARRAY]=Me(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),Re[r.TEXTURE_3D]=Me(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),me(r.DEPTH_TEST),a.setFunc(Ls),Kt(!1),dt(ll),me(r.CULL_FACE),Ot(Zi);function me(L){h[L]!==!0&&(r.enable(L),h[L]=!0)}function Ie(L){h[L]!==!1&&(r.disable(L),h[L]=!1)}function ft(L,Q){return f[L]!==Q?(r.bindFramebuffer(L,Q),f[L]=Q,L===r.DRAW_FRAMEBUFFER&&(f[r.FRAMEBUFFER]=Q),L===r.FRAMEBUFFER&&(f[r.DRAW_FRAMEBUFFER]=Q),!0):!1}function Te(L,Q){let K=m,ce=!1;if(L){K=d.get(Q),K===void 0&&(K=[],d.set(Q,K));const re=L.textures;if(K.length!==re.length||K[0]!==r.COLOR_ATTACHMENT0){for(let oe=0,Ae=re.length;oe<Ae;oe++)K[oe]=r.COLOR_ATTACHMENT0+oe;K.length=re.length,ce=!0}}else K[0]!==r.BACK&&(K[0]=r.BACK,ce=!0);ce&&r.drawBuffers(K)}function Qe(L){return _!==L?(r.useProgram(L),_=L,!0):!1}const st={[Yi]:r.FUNC_ADD,[au]:r.FUNC_SUBTRACT,[ou]:r.FUNC_REVERSE_SUBTRACT};st[lu]=r.MIN,st[cu]=r.MAX;const qe={[hu]:r.ZERO,[uu]:r.ONE,[fu]:r.SRC_COLOR,[Fc]:r.SRC_ALPHA,[_u]:r.SRC_ALPHA_SATURATE,[gu]:r.DST_COLOR,[pu]:r.DST_ALPHA,[du]:r.ONE_MINUS_SRC_COLOR,[Oc]:r.ONE_MINUS_SRC_ALPHA,[vu]:r.ONE_MINUS_DST_COLOR,[mu]:r.ONE_MINUS_DST_ALPHA,[xu]:r.CONSTANT_COLOR,[Mu]:r.ONE_MINUS_CONSTANT_COLOR,[Su]:r.CONSTANT_ALPHA,[yu]:r.ONE_MINUS_CONSTANT_ALPHA};function Ot(L,Q,K,ce,re,oe,Ae,Ge,se,Ce){if(L===Zi){g===!0&&(Ie(r.BLEND),g=!1);return}if(g===!1&&(me(r.BLEND),g=!0),L!==ru){if(L!==p||Ce!==R){if((x!==Yi||w!==Yi)&&(r.blendEquation(r.FUNC_ADD),x=Yi,w=Yi),Ce)switch(L){case As:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case cl:r.blendFunc(r.ONE,r.ONE);break;case hl:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case ul:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:De("WebGLState: Invalid blending: ",L);break}else switch(L){case As:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case cl:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case hl:De("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ul:De("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:De("WebGLState: Invalid blending: ",L);break}y=null,M=null,E=null,v=null,T.set(0,0,0),I=0,p=L,R=Ce}return}re=re||Q,oe=oe||K,Ae=Ae||ce,(Q!==x||re!==w)&&(r.blendEquationSeparate(st[Q],st[re]),x=Q,w=re),(K!==y||ce!==M||oe!==E||Ae!==v)&&(r.blendFuncSeparate(qe[K],qe[ce],qe[oe],qe[Ae]),y=K,M=ce,E=oe,v=Ae),(Ge.equals(T)===!1||se!==I)&&(r.blendColor(Ge.r,Ge.g,Ge.b,se),T.copy(Ge),I=se),p=L,R=!1}function yt(L,Q){L.side===pn?Ie(r.CULL_FACE):me(r.CULL_FACE);let K=L.side===jt;Q&&(K=!K),Kt(K),L.blending===As&&L.transparent===!1?Ot(Zi):Ot(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),s.setMask(L.colorWrite);const ce=L.stencilWrite;o.setTest(ce),ce&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Pt(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?me(r.SAMPLE_ALPHA_TO_COVERAGE):Ie(r.SAMPLE_ALPHA_TO_COVERAGE)}function Kt(L){P!==L&&(L?r.frontFace(r.CW):r.frontFace(r.CCW),P=L)}function dt(L){L!==nu?(me(r.CULL_FACE),L!==F&&(L===ll?r.cullFace(r.BACK):L===iu?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Ie(r.CULL_FACE),F=L}function Ln(L){L!==G&&(W&&r.lineWidth(L),G=L)}function Pt(L,Q,K){L?(me(r.POLYGON_OFFSET_FILL),(C!==Q||V!==K)&&(C=Q,V=K,a.getReversed()&&(Q=-Q,K=-K),r.polygonOffset(Q,K))):Ie(r.POLYGON_OFFSET_FILL)}function an(L){L?me(r.SCISSOR_TEST):Ie(r.SCISSOR_TEST)}function on(L){L===void 0&&(L=r.TEXTURE0+q-1),Y!==L&&(r.activeTexture(L),Y=L)}function ln(L,Q,K){K===void 0&&(Y===null?K=r.TEXTURE0+q-1:K=Y);let ce=te[K];ce===void 0&&(ce={type:void 0,texture:void 0},te[K]=ce),(ce.type!==L||ce.texture!==Q)&&(Y!==K&&(r.activeTexture(K),Y=K),r.bindTexture(L,Q||Re[L]),ce.type=L,ce.texture=Q)}function U(){const L=te[Y];L!==void 0&&L.type!==void 0&&(r.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function cn(){try{r.compressedTexImage2D(...arguments)}catch(L){De("WebGLState:",L)}}function lt(){try{r.compressedTexImage3D(...arguments)}catch(L){De("WebGLState:",L)}}function ct(){try{r.texSubImage2D(...arguments)}catch(L){De("WebGLState:",L)}}function pe(){try{r.texSubImage3D(...arguments)}catch(L){De("WebGLState:",L)}}function bt(){try{r.compressedTexSubImage2D(...arguments)}catch(L){De("WebGLState:",L)}}function Le(){try{r.compressedTexSubImage3D(...arguments)}catch(L){De("WebGLState:",L)}}function Fe(){try{r.texStorage2D(...arguments)}catch(L){De("WebGLState:",L)}}function A(){try{r.texStorage3D(...arguments)}catch(L){De("WebGLState:",L)}}function S(){try{r.texImage2D(...arguments)}catch(L){De("WebGLState:",L)}}function k(){try{r.texImage3D(...arguments)}catch(L){De("WebGLState:",L)}}function ie(L){return u[L]!==void 0?u[L]:r.getParameter(L)}function ee(L,Q){u[L]!==Q&&(r.pixelStorei(L,Q),u[L]=Q)}function ae(L){$.equals(L)===!1&&(r.scissor(L.x,L.y,L.z,L.w),$.copy(L))}function ue(L){de.equals(L)===!1&&(r.viewport(L.x,L.y,L.z,L.w),de.copy(L))}function Z(L,Q){let K=c.get(Q);K===void 0&&(K=new WeakMap,c.set(Q,K));let ce=K.get(L);ce===void 0&&(ce=r.getUniformBlockIndex(Q,L.name),r.uniformBlockBinding(Q,ce,ce),K.set(L,ce))}function J(L,Q,K){const re=c.get(Q).get(L);l[re]!==K&&(r.bindBufferBase(r.UNIFORM_BUFFER,re,K),l[re]=K)}function le(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),r.pixelStorei(r.PACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,r.BROWSER_DEFAULT_WEBGL),r.pixelStorei(r.PACK_ROW_LENGTH,0),r.pixelStorei(r.PACK_SKIP_PIXELS,0),r.pixelStorei(r.PACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_ROW_LENGTH,0),r.pixelStorei(r.UNPACK_IMAGE_HEIGHT,0),r.pixelStorei(r.UNPACK_SKIP_PIXELS,0),r.pixelStorei(r.UNPACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_SKIP_IMAGES,0),h={},u={},Y=null,te={},f={},l={},d=new WeakMap,m=[],_=null,g=!1,p=null,x=null,y=null,M=null,w=null,E=null,v=null,T=new Ne(0,0,0),I=0,R=!1,P=null,F=null,G=null,C=null,V=null,$.set(0,0,r.canvas.width,r.canvas.height),de.set(0,0,r.canvas.width,r.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:me,disable:Ie,bindFramebuffer:ft,drawBuffers:Te,useProgram:Qe,setBlending:Ot,setMaterial:yt,setFlipSided:Kt,setCullFace:dt,setLineWidth:Ln,setPolygonOffset:Pt,setScissorTest:an,activeTexture:on,bindTexture:ln,unbindTexture:U,compressedTexImage2D:cn,compressedTexImage3D:lt,texImage2D:S,texImage3D:k,pixelStorei:ee,getParameter:ie,updateUBOMapping:Z,uniformBlockBinding:J,texStorage2D:Fe,texStorage3D:A,texSubImage2D:ct,texSubImage3D:pe,compressedTexSubImage2D:bt,compressedTexSubImage3D:Le,scissor:ae,viewport:ue,reset:le}}function rv(r,e,t,n,i,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ue,h=new WeakMap,u=new Set;let f;const d=new WeakMap,m=new Set,_=new FinalizationRegistry(A=>m.delete(A));let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(A,S){return g?new OffscreenCanvas(A,S):Os("canvas")}function x(A,S,k){let ie=1;const ee=Fe(A);if((ee.width>k||ee.height>k)&&(ie=k/Math.max(ee.width,ee.height)),ie<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const ae=Math.floor(ie*ee.width),ue=Math.floor(ie*ee.height);f===void 0&&(f=p(ae,ue));const Z=S?p(ae,ue):f;return Z.width=ae,Z.height=ue,Z.getContext("2d").drawImage(A,0,0,ae,ue),we("WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+ae+"x"+ue+")."),Z}else return"data"in A&&we("WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),A;return A}function y(A){return A.generateMipmaps}function M(A){r.generateMipmap(A)}function w(A){return A.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?r.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function E(A,S,k,ie,ee,ae=!1){if(A!==null){if(r[A]!==void 0)return r[A];we("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let ue;ie&&(ue=e.get("EXT_texture_norm16"),ue||we("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=S;if(S===r.RED&&(k===r.FLOAT&&(Z=r.R32F),k===r.HALF_FLOAT&&(Z=r.R16F),k===r.UNSIGNED_BYTE&&(Z=r.R8),k===r.UNSIGNED_SHORT&&ue&&(Z=ue.R16_EXT),k===r.SHORT&&ue&&(Z=ue.R16_SNORM_EXT)),S===r.RED_INTEGER&&(k===r.UNSIGNED_BYTE&&(Z=r.R8UI),k===r.UNSIGNED_SHORT&&(Z=r.R16UI),k===r.UNSIGNED_INT&&(Z=r.R32UI),k===r.BYTE&&(Z=r.R8I),k===r.SHORT&&(Z=r.R16I),k===r.INT&&(Z=r.R32I)),S===r.RG&&(k===r.FLOAT&&(Z=r.RG32F),k===r.HALF_FLOAT&&(Z=r.RG16F),k===r.UNSIGNED_BYTE&&(Z=r.RG8),k===r.UNSIGNED_SHORT&&ue&&(Z=ue.RG16_EXT),k===r.SHORT&&ue&&(Z=ue.RG16_SNORM_EXT)),S===r.RG_INTEGER&&(k===r.UNSIGNED_BYTE&&(Z=r.RG8UI),k===r.UNSIGNED_SHORT&&(Z=r.RG16UI),k===r.UNSIGNED_INT&&(Z=r.RG32UI),k===r.BYTE&&(Z=r.RG8I),k===r.SHORT&&(Z=r.RG16I),k===r.INT&&(Z=r.RG32I)),S===r.RGB_INTEGER&&(k===r.UNSIGNED_BYTE&&(Z=r.RGB8UI),k===r.UNSIGNED_SHORT&&(Z=r.RGB16UI),k===r.UNSIGNED_INT&&(Z=r.RGB32UI),k===r.BYTE&&(Z=r.RGB8I),k===r.SHORT&&(Z=r.RGB16I),k===r.INT&&(Z=r.RGB32I)),S===r.RGBA_INTEGER&&(k===r.UNSIGNED_BYTE&&(Z=r.RGBA8UI),k===r.UNSIGNED_SHORT&&(Z=r.RGBA16UI),k===r.UNSIGNED_INT&&(Z=r.RGBA32UI),k===r.BYTE&&(Z=r.RGBA8I),k===r.SHORT&&(Z=r.RGBA16I),k===r.INT&&(Z=r.RGBA32I)),S===r.RGB&&(k===r.UNSIGNED_SHORT&&ue&&(Z=ue.RGB16_EXT),k===r.SHORT&&ue&&(Z=ue.RGB16_SNORM_EXT),k===r.UNSIGNED_INT_5_9_9_9_REV&&(Z=r.RGB9_E5),k===r.UNSIGNED_INT_10F_11F_11F_REV&&(Z=r.R11F_G11F_B10F)),S===r.RGBA){const J=ae?Ur:Xe.getTransfer(ee);k===r.FLOAT&&(Z=r.RGBA32F),k===r.HALF_FLOAT&&(Z=r.RGBA16F),k===r.UNSIGNED_BYTE&&(Z=J===nt?r.SRGB8_ALPHA8:r.RGBA8),k===r.UNSIGNED_SHORT&&ue&&(Z=ue.RGBA16_EXT),k===r.SHORT&&ue&&(Z=ue.RGBA16_SNORM_EXT),k===r.UNSIGNED_SHORT_4_4_4_4&&(Z=r.RGBA4),k===r.UNSIGNED_SHORT_5_5_5_1&&(Z=r.RGB5_A1)}return(Z===r.R16F||Z===r.R32F||Z===r.RG16F||Z===r.RG32F||Z===r.RGBA16F||Z===r.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function v(A,S){let k;return A?S===null||S===Bn||S===ns?k=r.DEPTH24_STENCIL8:S===gn?k=r.DEPTH32F_STENCIL8:S===Ds&&(k=r.DEPTH24_STENCIL8,we("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Bn||S===ns?k=r.DEPTH_COMPONENT24:S===gn?k=r.DEPTH_COMPONENT32F:S===Ds&&(k=r.DEPTH_COMPONENT16),k}function T(A,S){return y(A)===!0||A.isFramebufferTexture&&A.minFilter!==vt&&A.minFilter!==ut?Math.log2(Math.max(S.width,S.height))+1:A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?S.mipmaps.length:1}function I(A){const S=new WeakRef(A);n.get(A).__ref=S,m.add(S),_.register(A,S,S)}function R(A){const S=n.get(A).__ref;S!==void 0&&(m.delete(S),_.unregister(S))}function P(A){G(A.target)}function F(A){C(A.target)}function G(A){A.removeEventListener("dispose",P),R(A),q(A),A.isVideoTexture&&h.delete(A),A.isHTMLTexture&&u.delete(A)}function C(A){A.removeEventListener("dispose",F),R(A),D(A)}function V(){for(const A of m){const S=A.deref();S!==void 0&&(S.isRenderTarget===!0?C(S):G(S))}m.clear(),u.clear()}function q(A){const S=n.get(A);if(S.__webglInit===void 0)return;const k=A.source,ie=d.get(k);if(ie){const ee=ie[S.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&W(A),Object.keys(ie).length===0&&d.delete(k)}n.remove(A)}function W(A){const S=n.get(A);r.deleteTexture(S.__webglTexture);const k=A.source,ie=d.get(k);delete ie[S.__cacheKey],a.memory.textures--}function D(A){const S=n.get(A);S.__depthDisposeCallback&&S.__depthDisposeCallback();const k=A.depthTexture;if(k&&k.renderTarget===A&&G(k),A.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(S.__webglFramebuffer[ee]))for(let ae=0;ae<S.__webglFramebuffer[ee].length;ae++)r.deleteFramebuffer(S.__webglFramebuffer[ee][ae]);else r.deleteFramebuffer(S.__webglFramebuffer[ee]);S.__webglDepthbuffer&&r.deleteRenderbuffer(S.__webglDepthbuffer[ee])}else{if(Array.isArray(S.__webglFramebuffer))for(let ee=0;ee<S.__webglFramebuffer.length;ee++)r.deleteFramebuffer(S.__webglFramebuffer[ee]);else r.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&r.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&r.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let ee=0;ee<S.__webglColorRenderbuffer.length;ee++)S.__webglColorRenderbuffer[ee]&&r.deleteRenderbuffer(S.__webglColorRenderbuffer[ee]);S.__webglDepthRenderbuffer&&r.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const ie=A.textures;for(let ee=0,ae=ie.length;ee<ae;ee++){const ue=n.get(ie[ee]);ue.__webglTexture&&(r.deleteTexture(ue.__webglTexture),a.memory.textures--),n.remove(ie[ee])}n.remove(A)}let O=0;function Y(){O=0}function te(){return O}function xe(A){O=A}function Pe(){const A=O;return A>=i.maxTextures&&we("WebGLTextures: Trying to use "+(A+1)+" texture units while this GPU supports only "+i.maxTextures),O+=1,A}function $(A){const S=[];return S.push(A.wrapS),S.push(A.wrapT),S.push(A.wrapR||0),S.push(A.magFilter),S.push(A.minFilter),S.push(A.anisotropy),S.push(A.internalFormat),S.push(A.format),S.push(A.type),S.push(A.generateMipmaps),S.push(A.mipmapsAutoUpdate),S.push(A.premultiplyAlpha),S.push(A.flipY),S.push(A.unpackAlignment),S.push(A.colorSpace),S.join()}function de(A,S){const k=n.get(A);if(A.isVideoTexture&&bt(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&k.__version!==A.version){const ie=A.image;if(ie===null)we("WebGLRenderer: Texture marked for update but no image data found.");else if(ie.complete===!1)we("WebGLRenderer: Texture marked for update but image is incomplete");else{yt(k,A,S);return}}else A.isExternalTexture&&(k.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(r.TEXTURE_2D,k.__webglTexture,r.TEXTURE0+S)}function Me(A,S){const k=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&k.__version!==A.version){yt(k,A,S);return}else A.isExternalTexture&&(k.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(r.TEXTURE_2D_ARRAY,k.__webglTexture,r.TEXTURE0+S)}function Re(A,S){const k=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&k.__version!==A.version){yt(k,A,S);return}t.bindTexture(r.TEXTURE_3D,k.__webglTexture,r.TEXTURE0+S)}function me(A,S){const k=n.get(A);if(A.version>0&&k.__version!==A.version){Kt(k,A,S);return}t.bindTexture(r.TEXTURE_CUBE_MAP,k.__webglTexture,r.TEXTURE0+S)}const Ie={[Ri]:r.REPEAT,[Yt]:r.CLAMP_TO_EDGE,[Ir]:r.MIRRORED_REPEAT},ft={[vt]:r.NEAREST,[Yc]:r.NEAREST_MIPMAP_NEAREST,[Ts]:r.NEAREST_MIPMAP_LINEAR,[ut]:r.LINEAR,[Er]:r.LINEAR_MIPMAP_NEAREST,[mn]:r.LINEAR_MIPMAP_LINEAR},Te={[Lu]:r.NEVER,[ih]:r.ALWAYS,[Iu]:r.LESS,[th]:r.LEQUAL,[Du]:r.EQUAL,[nh]:r.GEQUAL,[Nu]:r.GREATER,[Uu]:r.NOTEQUAL};function Qe(A,S){if(S.type===gn&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===ut||S.magFilter===Er||S.magFilter===Ts||S.magFilter===mn||S.minFilter===ut||S.minFilter===Er||S.minFilter===Ts||S.minFilter===mn)&&we("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(A,r.TEXTURE_WRAP_S,Ie[S.wrapS]),r.texParameteri(A,r.TEXTURE_WRAP_T,Ie[S.wrapT]),(A===r.TEXTURE_3D||A===r.TEXTURE_2D_ARRAY)&&r.texParameteri(A,r.TEXTURE_WRAP_R,Ie[S.wrapR]),r.texParameteri(A,r.TEXTURE_MAG_FILTER,ft[S.magFilter]),r.texParameteri(A,r.TEXTURE_MIN_FILTER,ft[S.minFilter]),S.compareFunction&&(r.texParameteri(A,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(A,r.TEXTURE_COMPARE_FUNC,Te[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===vt||S.minFilter!==Ts&&S.minFilter!==mn||S.type===gn&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");r.texParameterf(A,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,i.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function st(A,S){let k=!1;A.__webglInit===void 0&&(A.__webglInit=!0,S.addEventListener("dispose",P),I(S));const ie=S.source;let ee=d.get(ie);ee===void 0&&(ee={},d.set(ie,ee));const ae=$(S);if(ae!==A.__cacheKey){ee[ae]===void 0&&(ee[ae]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,k=!0),ee[ae].usedTimes++;const ue=ee[A.__cacheKey];ue!==void 0&&(ee[A.__cacheKey].usedTimes--,ue.usedTimes===0&&W(S)),A.__cacheKey=ae,A.__webglTexture=ee[ae].texture}return k}function qe(A,S,k){return Math.floor(Math.floor(A/k)/S)}function Ot(A,S,k,ie){const ae=A.updateRanges;if(ae.length===0)t.texSubImage2D(r.TEXTURE_2D,0,0,0,S.width,S.height,k,ie,S.data);else{ae.sort((L,Q)=>L.start-Q.start);let ue=0;for(let L=1;L<ae.length;L++){const Q=ae[ue],K=ae[L],ce=Q.start+Q.count,re=qe(K.start,S.width,4),oe=qe(Q.start,S.width,4);K.start<=ce+1&&re===oe&&qe(K.start+K.count-1,S.width,4)===re?Q.count=Math.max(Q.count,K.start+K.count-Q.start):(++ue,ae[ue]=K)}ae.length=ue+1;const Z=t.getParameter(r.UNPACK_ROW_LENGTH),J=t.getParameter(r.UNPACK_SKIP_PIXELS),le=t.getParameter(r.UNPACK_SKIP_ROWS);t.pixelStorei(r.UNPACK_ROW_LENGTH,S.width);for(let L=0,Q=ae.length;L<Q;L++){const K=ae[L],ce=Math.floor(K.start/4),re=Math.ceil(K.count/4),oe=ce%S.width,Ae=Math.floor(ce/S.width),Ge=re,se=1;t.pixelStorei(r.UNPACK_SKIP_PIXELS,oe),t.pixelStorei(r.UNPACK_SKIP_ROWS,Ae),t.texSubImage2D(r.TEXTURE_2D,0,oe,Ae,Ge,se,k,ie,S.data)}A.clearUpdateRanges(),t.pixelStorei(r.UNPACK_ROW_LENGTH,Z),t.pixelStorei(r.UNPACK_SKIP_PIXELS,J),t.pixelStorei(r.UNPACK_SKIP_ROWS,le)}}function yt(A,S,k){let ie=r.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(ie=r.TEXTURE_2D_ARRAY),S.isData3DTexture&&(ie=r.TEXTURE_3D);const ee=st(A,S),ae=S.source;t.bindTexture(ie,A.__webglTexture,r.TEXTURE0+k);const ue=n.get(ae);if(ae.version!==ue.__version||ee===!0){if(t.activeTexture(r.TEXTURE0+k),(typeof ImageBitmap<"u"&&S.image instanceof ImageBitmap)===!1){const se=Xe.getPrimaries(Xe.workingColorSpace),Ce=S.colorSpace===wn?null:Xe.getPrimaries(S.colorSpace),ke=S.colorSpace===wn||se===Ce?r.NONE:r.BROWSER_DEFAULT_WEBGL;t.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,ke)}t.pixelStorei(r.UNPACK_ALIGNMENT,S.unpackAlignment);let J=x(S.image,!1,i.maxTextureSize);J=Le(S,J);const le=s.convert(S.format,S.colorSpace),L=s.convert(S.type);let Q=E(S.internalFormat,le,L,S.normalized,S.colorSpace,S.isVideoTexture);Qe(ie,S);let K;const ce=S.mipmaps,re=S.isVideoTexture!==!0,oe=ue.__version===void 0||ee===!0,Ae=ae.dataReady,Ge=T(S,J);if(S.isDepthTexture)Q=v(S.format===di,S.type),oe&&(re?t.texStorage2D(r.TEXTURE_2D,1,Q,J.width,J.height):t.texImage2D(r.TEXTURE_2D,0,Q,J.width,J.height,0,le,L,null));else if(S.isDataTexture)if(ce.length>0){re&&oe&&t.texStorage2D(r.TEXTURE_2D,Ge,Q,ce[0].width,ce[0].height);for(let se=0,Ce=ce.length;se<Ce;se++)K=ce[se],re?Ae&&t.texSubImage2D(r.TEXTURE_2D,se,0,0,K.width,K.height,le,L,K.data):t.texImage2D(r.TEXTURE_2D,se,Q,K.width,K.height,0,le,L,K.data);S.generateMipmaps=!1}else re?(oe&&t.texStorage2D(r.TEXTURE_2D,Ge,Q,J.width,J.height),Ae&&Ot(S,J,le,L)):t.texImage2D(r.TEXTURE_2D,0,Q,J.width,J.height,0,le,L,J.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){re&&oe&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Ge,Q,ce[0].width,ce[0].height,J.depth);for(let se=0,Ce=ce.length;se<Ce;se++)if(K=ce[se],S.format!==sn)if(le!==null)if(re){if(Ae)if(S.layerUpdates.size>0){const ke=rc(K.width,K.height,S.format,S.type);for(const ge of S.layerUpdates){const et=K.data.subarray(ge*ke/K.data.BYTES_PER_ELEMENT,(ge+1)*ke/K.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,se,0,0,ge,K.width,K.height,1,le,et)}}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,se,0,0,0,K.width,K.height,J.depth,le,K.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,se,Q,K.width,K.height,J.depth,0,K.data,0,0);else we("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else re?Ae&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,se,0,0,0,K.width,K.height,J.depth,le,L,K.data):t.texImage3D(r.TEXTURE_2D_ARRAY,se,Q,K.width,K.height,J.depth,0,le,L,K.data);S.layerUpdates.size>0&&S.clearLayerUpdates()}else{re&&oe&&t.texStorage2D(r.TEXTURE_2D,Ge,Q,ce[0].width,ce[0].height);for(let se=0,Ce=ce.length;se<Ce;se++)K=ce[se],S.format!==sn?le!==null?re?Ae&&t.compressedTexSubImage2D(r.TEXTURE_2D,se,0,0,K.width,K.height,le,K.data):t.compressedTexImage2D(r.TEXTURE_2D,se,Q,K.width,K.height,0,K.data):we("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):re?Ae&&t.texSubImage2D(r.TEXTURE_2D,se,0,0,K.width,K.height,le,L,K.data):t.texImage2D(r.TEXTURE_2D,se,Q,K.width,K.height,0,le,L,K.data)}else if(S.isDataArrayTexture)if(re){if(oe&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Ge,Q,J.width,J.height,J.depth),Ae)if(S.layerUpdates.size>0){const se=rc(J.width,J.height,S.format,S.type);for(const Ce of S.layerUpdates){const ke=J.data.subarray(Ce*se/J.data.BYTES_PER_ELEMENT,(Ce+1)*se/J.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,Ce,J.width,J.height,1,le,L,ke)}S.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,le,L,J.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,Q,J.width,J.height,J.depth,0,le,L,J.data);else if(S.isData3DTexture)re?(oe&&t.texStorage3D(r.TEXTURE_3D,Ge,Q,J.width,J.height,J.depth),Ae&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,le,L,J.data)):t.texImage3D(r.TEXTURE_3D,0,Q,J.width,J.height,J.depth,0,le,L,J.data);else if(S.isFramebufferTexture){if(oe)if(re)t.texStorage2D(r.TEXTURE_2D,Ge,Q,J.width,J.height);else{let se=J.width,Ce=J.height;for(let ke=0;ke<Ge;ke++)t.texImage2D(r.TEXTURE_2D,ke,Q,se,Ce,0,le,L,null),se>>=1,Ce>>=1}}else if(S.isHTMLTexture){if("texElementImage2D"in r){const se=r.canvas;if(se.hasAttribute("layoutsubtree")||se.setAttribute("layoutsubtree","true"),J.parentNode!==se){se.appendChild(J),u.add(S),se.onpaint=Ce=>{const ke=Ce.changedElements;for(const ge of u)ke.includes(ge.image)&&(ge.needsUpdate=!0)},se.requestPaint();return}if(r.texElementImage2D.length===3)r.texElementImage2D(r.TEXTURE_2D,r.RGBA8,J);else{const ke=r.RGBA,ge=r.RGBA,et=r.UNSIGNED_BYTE;r.texElementImage2D(r.TEXTURE_2D,0,ke,ge,et,J)}r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)}}else if(ce.length>0){if(re&&oe){const se=Fe(ce[0]);t.texStorage2D(r.TEXTURE_2D,Ge,Q,se.width,se.height)}for(let se=0,Ce=ce.length;se<Ce;se++)K=ce[se],re?Ae&&t.texSubImage2D(r.TEXTURE_2D,se,0,0,le,L,K):t.texImage2D(r.TEXTURE_2D,se,Q,le,L,K);S.generateMipmaps=!1}else if(re){if(oe){const se=Fe(J);t.texStorage2D(r.TEXTURE_2D,Ge,Q,se.width,se.height)}Ae&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,le,L,J)}else t.texImage2D(r.TEXTURE_2D,0,Q,le,L,J);y(S)&&S.mipmapsAutoUpdate===!0&&M(ie),ue.__version=ae.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function Kt(A,S,k){if(S.image.length!==6)return;const ie=st(A,S),ee=S.source;t.bindTexture(r.TEXTURE_CUBE_MAP,A.__webglTexture,r.TEXTURE0+k);const ae=n.get(ee);if(ee.version!==ae.__version||ie===!0){t.activeTexture(r.TEXTURE0+k);const ue=Xe.getPrimaries(Xe.workingColorSpace),Z=S.colorSpace===wn?null:Xe.getPrimaries(S.colorSpace),J=S.colorSpace===wn||ue===Z?r.NONE:r.BROWSER_DEFAULT_WEBGL;t.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(r.UNPACK_ALIGNMENT,S.unpackAlignment),t.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,J);const le=S.isCompressedTexture||S.image[0].isCompressedTexture,L=S.image[0]&&S.image[0].isDataTexture,Q=[];for(let ge=0;ge<6;ge++)!le&&!L?Q[ge]=x(S.image[ge],!0,i.maxCubemapSize):Q[ge]=L?S.image[ge].image:S.image[ge],Q[ge]=Le(S,Q[ge]);const K=Q[0],ce=s.convert(S.format,S.colorSpace),re=s.convert(S.type);let oe=E(S.internalFormat,ce,re,S.normalized,S.colorSpace);const Ae=S.isVideoTexture!==!0,Ge=ae.__version===void 0||ie===!0,se=ee.dataReady;let Ce=T(S,K);Qe(r.TEXTURE_CUBE_MAP,S);let ke;if(S.isDepthTexture){if(oe=v(S.format===di,S.type),Ge)if(Ae)t.texStorage2D(r.TEXTURE_CUBE_MAP,1,oe,K.width,K.height);else for(let ge=0;ge<6;ge++)t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,oe,K.width,K.height,0,ce,re,null)}else if(le){Ae&&Ge&&t.texStorage2D(r.TEXTURE_CUBE_MAP,Ce,oe,K.width,K.height);for(let ge=0;ge<6;ge++){ke=Q[ge].mipmaps;for(let et=0;et<ke.length;et++){const Lt=ke[et];S.format!==sn?ce!==null?Ae?se&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,et,0,0,Lt.width,Lt.height,ce,Lt.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,et,oe,Lt.width,Lt.height,0,Lt.data):we("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ae?se&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,et,0,0,Lt.width,Lt.height,ce,re,Lt.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,et,oe,Lt.width,Lt.height,0,ce,re,Lt.data)}}}else{if(ke=S.mipmaps,Ae&&Ge){ke.length>0&&Ce++;const ge=Fe(Q[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,Ce,oe,ge.width,ge.height)}for(let ge=0;ge<6;ge++)if(L){Ae?se&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,0,0,Q[ge].width,Q[ge].height,ce,re,Q[ge].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,oe,Q[ge].width,Q[ge].height,0,ce,re,Q[ge].data);for(let et=0;et<ke.length;et++){const ii=ke[et].image[ge].image;Ae?se&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,et+1,0,0,ii.width,ii.height,ce,re,ii.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,et+1,oe,ii.width,ii.height,0,ce,re,ii.data)}}else{Ae?se&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,0,0,ce,re,Q[ge]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,oe,ce,re,Q[ge]);for(let et=0;et<ke.length;et++){const Lt=ke[et];Ae?se&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,et+1,0,0,ce,re,Lt.image[ge]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,et+1,oe,ce,re,Lt.image[ge])}}}y(S)&&S.mipmapsAutoUpdate===!0&&M(r.TEXTURE_CUBE_MAP),ae.__version=ee.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function dt(A,S,k,ie,ee,ae){const ue=s.convert(k.format,k.colorSpace),Z=s.convert(k.type),J=E(k.internalFormat,ue,Z,k.normalized,k.colorSpace),le=n.get(S),L=n.get(k);if(L.__renderTarget=S,!le.__hasExternalTextures){const Q=Math.max(1,S.width>>ae),K=Math.max(1,S.height>>ae);ee===r.TEXTURE_3D||ee===r.TEXTURE_2D_ARRAY?t.texImage3D(ee,ae,J,Q,K,S.depth,0,ue,Z,null):t.texImage2D(ee,ae,J,Q,K,0,ue,Z,null)}t.bindFramebuffer(r.FRAMEBUFFER,A),pe(S)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,ie,ee,L.__webglTexture,0,ct(S)):(ee===r.TEXTURE_2D||ee>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,ie,ee,L.__webglTexture,ae),t.bindFramebuffer(r.FRAMEBUFFER,null)}function Ln(A,S,k){if(r.bindRenderbuffer(r.RENDERBUFFER,A),S.depthBuffer){const ie=S.depthTexture,ee=ie&&ie.isDepthTexture?ie.type:null,ae=v(S.stencilBuffer,ee),ue=S.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;pe(S)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ct(S),ae,S.width,S.height):k?r.renderbufferStorageMultisample(r.RENDERBUFFER,ct(S),ae,S.width,S.height):r.renderbufferStorage(r.RENDERBUFFER,ae,S.width,S.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,ue,r.RENDERBUFFER,A)}else{const ie=S.textures;for(let ee=0;ee<ie.length;ee++){const ae=ie[ee],ue=s.convert(ae.format,ae.colorSpace),Z=s.convert(ae.type),J=E(ae.internalFormat,ue,Z,ae.normalized,ae.colorSpace);pe(S)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ct(S),J,S.width,S.height):k?r.renderbufferStorageMultisample(r.RENDERBUFFER,ct(S),J,S.width,S.height):r.renderbufferStorage(r.RENDERBUFFER,J,S.width,S.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Pt(A,S,k){const ie=S.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(r.FRAMEBUFFER,A),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const ee=n.get(S.depthTexture);ee.__renderTarget=S;const ae=ie?S.depthTexture.image[0]:S.depthTexture.image;(!ee.__webglTexture||ae.width!==S.width||ae.height!==S.height)&&(ae.width=S.width,ae.height=S.height,S.depthTexture.needsUpdate=!0),ie?me(S.depthTexture,0):de(S.depthTexture,0);const ue=ee.__webglTexture,Z=ct(S),J=ie?r.TEXTURE_CUBE_MAP_POSITIVE_X+k:r.TEXTURE_2D,le=S.depthTexture.format===di?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(S.depthTexture.format===mi)pe(S)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,le,J,ue,0,Z):r.framebufferTexture2D(r.FRAMEBUFFER,le,J,ue,0);else if(S.depthTexture.format===di)pe(S)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,le,J,ue,0,Z):r.framebufferTexture2D(r.FRAMEBUFFER,le,J,ue,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function an(A){const S=n.get(A),k=A.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==A.depthTexture){const ie=A.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),ie){const ee=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,ie.removeEventListener("dispose",ee)};ie.addEventListener("dispose",ee),S.__depthDisposeCallback=ee}S.__boundDepthTexture=ie}if(A.depthTexture&&!S.__autoAllocateDepthBuffer)if(k)for(let ie=0;ie<6;ie++)Pt(S.__webglFramebuffer[ie],A,ie);else A.texture.mipmaps.length>0?Pt(S.__webglFramebuffer[0],A,0):Pt(S.__webglFramebuffer,A,0);else if(k){S.__webglDepthbuffer=[];for(let ie=0;ie<6;ie++)if(t.bindFramebuffer(r.FRAMEBUFFER,S.__webglFramebuffer[ie]),S.__webglDepthbuffer[ie]===void 0)S.__webglDepthbuffer[ie]=r.createRenderbuffer(),Ln(S.__webglDepthbuffer[ie],A,!1);else{const ee=A.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ae=S.__webglDepthbuffer[ie];r.bindRenderbuffer(r.RENDERBUFFER,ae),r.framebufferRenderbuffer(r.FRAMEBUFFER,ee,r.RENDERBUFFER,ae)}}else if(A.texture.mipmaps.length>0?t.bindFramebuffer(r.FRAMEBUFFER,S.__webglFramebuffer[0]):t.bindFramebuffer(r.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=r.createRenderbuffer(),Ln(S.__webglDepthbuffer,A,!1);else{const ee=A.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ae=S.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,ae),r.framebufferRenderbuffer(r.FRAMEBUFFER,ee,r.RENDERBUFFER,ae)}t.bindFramebuffer(r.FRAMEBUFFER,null)}function on(A,S,k){const ie=n.get(A);S!==void 0&&dt(ie.__webglFramebuffer,A,A.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),k!==void 0&&an(A)}function ln(A){const S=A.texture,k=n.get(A),ie=n.get(S);A.addEventListener("dispose",F),I(A);const ee=A.textures,ae=A.isWebGLCubeRenderTarget===!0,ue=ee.length>1;if(ue||(ie.__webglTexture===void 0&&(ie.__webglTexture=r.createTexture()),ie.__version=S.version,a.memory.textures++),ae){k.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(S.mipmaps.length>0){k.__webglFramebuffer[Z]=[];for(let J=0;J<S.mipmaps.length;J++)k.__webglFramebuffer[Z][J]=r.createFramebuffer()}else k.__webglFramebuffer[Z]=r.createFramebuffer()}else{if(S.mipmaps.length>0){k.__webglFramebuffer=[];for(let Z=0;Z<S.mipmaps.length;Z++)k.__webglFramebuffer[Z]=r.createFramebuffer()}else k.__webglFramebuffer=r.createFramebuffer();if(ue)for(let Z=0,J=ee.length;Z<J;Z++){const le=n.get(ee[Z]);le.__webglTexture===void 0&&(le.__webglTexture=r.createTexture(),a.memory.textures++)}if(A.samples>0&&pe(A)===!1){k.__webglMultisampledFramebuffer=r.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let Z=0;Z<ee.length;Z++){const J=ee[Z];k.__webglColorRenderbuffer[Z]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,k.__webglColorRenderbuffer[Z]);const le=s.convert(J.format,J.colorSpace),L=s.convert(J.type),Q=E(J.internalFormat,le,L,J.normalized,J.colorSpace,A.isXRRenderTarget===!0),K=ct(A);r.renderbufferStorageMultisample(r.RENDERBUFFER,K,Q,A.width,A.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Z,r.RENDERBUFFER,k.__webglColorRenderbuffer[Z])}r.bindRenderbuffer(r.RENDERBUFFER,null),A.depthBuffer&&(k.__webglDepthRenderbuffer=r.createRenderbuffer(),Ln(k.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(ae){t.bindTexture(r.TEXTURE_CUBE_MAP,ie.__webglTexture),Qe(r.TEXTURE_CUBE_MAP,S);for(let Z=0;Z<6;Z++)if(S.mipmaps.length>0)for(let J=0;J<S.mipmaps.length;J++)dt(k.__webglFramebuffer[Z][J],A,S,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,J);else dt(k.__webglFramebuffer[Z],A,S,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);y(S)?M(r.TEXTURE_CUBE_MAP):S.mipmaps.length>0&&r.texParameteri(r.TEXTURE_CUBE_MAP,r.TEXTURE_MAX_LEVEL,S.mipmaps.length-1),t.unbindTexture()}else if(ue){for(let Z=0,J=ee.length;Z<J;Z++){const le=ee[Z],L=n.get(le);let Q=r.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(Q=A.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(Q,L.__webglTexture),Qe(Q,le),dt(k.__webglFramebuffer,A,le,r.COLOR_ATTACHMENT0+Z,Q,0),y(le)&&M(Q)}t.unbindTexture()}else{let Z=r.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(Z=A.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(Z,ie.__webglTexture),Qe(Z,S),S.mipmaps.length>0)for(let J=0;J<S.mipmaps.length;J++)dt(k.__webglFramebuffer[J],A,S,r.COLOR_ATTACHMENT0,Z,J);else dt(k.__webglFramebuffer,A,S,r.COLOR_ATTACHMENT0,Z,0);y(S)?M(Z):S.mipmaps.length>0&&r.texParameteri(Z,r.TEXTURE_MAX_LEVEL,S.mipmaps.length-1),t.unbindTexture()}A.depthBuffer&&an(A)}function U(A){const S=A.textures;for(let k=0,ie=S.length;k<ie;k++){const ee=S[k];if(y(ee)&&ee.mipmapsAutoUpdate===!0){const ae=w(A),ue=n.get(ee).__webglTexture;t.bindTexture(ae,ue),M(ae),t.unbindTexture()}}}const cn=[];function lt(A){if(A.samples>0){if(pe(A)===!1){const S=A.textures,k=A.width,ie=A.height;let ee=r.COLOR_BUFFER_BIT;const ae=A.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ue=n.get(A),Z=S.length>1;if(Z)for(let le=0;le<S.length;le++)t.bindFramebuffer(r.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,ue.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,ue.__webglMultisampledFramebuffer),A.texture.mipmaps.length>0?t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ue.__webglFramebuffer[0]):t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ue.__webglFramebuffer);for(let le=0;le<S.length;le++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(ee|=r.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(ee|=r.STENCIL_BUFFER_BIT)),Z){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,ue.__webglColorRenderbuffer[le]);const L=n.get(S[le]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,L,0)}r.blitFramebuffer(0,0,k,ie,0,0,k,ie,ee,r.NEAREST),l===!0&&(cn.length=0,cn.push(r.COLOR_ATTACHMENT0+le),A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&cn.push(ae),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,cn))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),Z)for(let le=0;le<S.length;le++){t.bindFramebuffer(r.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.RENDERBUFFER,ue.__webglColorRenderbuffer[le]);const L=n.get(S[le]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,ue.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.TEXTURE_2D,L,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ue.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&l){const S=A.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[S])}}}function ct(A){return Math.min(i.maxSamples,A.samples)}function pe(A){const S=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function bt(A){const S=a.render.frame;h.get(A)!==S&&(h.set(A,S),A.update())}function Le(A,S){const k=A.colorSpace,ie=A.format,ee=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||k!==en&&k!==wn&&(Xe.getTransfer(k)===nt?(ie!==sn||ee!==Qt)&&we("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):De("WebGLTextures: Unsupported texture color space:",k)),S}function Fe(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=Pe,this.resetTextureUnits=Y,this.getTextureUnits=te,this.setTextureUnits=xe,this.setTexture2D=de,this.setTexture2DArray=Me,this.setTexture3D=Re,this.setTextureCube=me,this.rebindTextures=on,this.setupRenderTarget=ln,this.updateRenderTargetMipmap=U,this.updateMultisampleRenderTarget=lt,this.setupDepthRenderbuffer=an,this.setupFrameBufferTexture=dt,this.useMultisampledRTT=pe,this.dispose=V}function av(r,e){function t(n,i=wn){let s;const a=Xe.getTransfer(i);if(n===Qt)return r.UNSIGNED_BYTE;if(n===Ao)return r.UNSIGNED_SHORT_4_4_4_4;if(n===Ro)return r.UNSIGNED_SHORT_5_5_5_1;if(n===$c)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===Jc)return r.UNSIGNED_INT_10F_11F_11F_REV;if(n===Kc)return r.BYTE;if(n===Zc)return r.SHORT;if(n===Ds)return r.UNSIGNED_SHORT;if(n===wo)return r.INT;if(n===Bn)return r.UNSIGNED_INT;if(n===gn)return r.FLOAT;if(n===rn)return r.HALF_FLOAT;if(n===Qc)return r.ALPHA;if(n===jc)return r.RGB;if(n===sn)return r.RGBA;if(n===mi)return r.DEPTH_COMPONENT;if(n===di)return r.DEPTH_STENCIL;if(n===Co)return r.RED;if(n===Po)return r.RED_INTEGER;if(n===Ci)return r.RG;if(n===Lo)return r.RG_INTEGER;if(n===Io)return r.RGBA_INTEGER;if(n===wr||n===Ar||n===Rr||n===Cr)if(a===nt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===wr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ar)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Rr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Cr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===wr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ar)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Rr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Cr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ba||n===ka||n===Ga||n===Ha)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Ba)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ka)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ga)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ha)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Va||n===Wa||n===Xa||n===qa||n===Ya||n===Dr||n===Ka)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Va||n===Wa)return a===nt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Xa)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===qa)return s.COMPRESSED_R11_EAC;if(n===Ya)return s.COMPRESSED_SIGNED_R11_EAC;if(n===Dr)return s.COMPRESSED_RG11_EAC;if(n===Ka)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Za||n===$a||n===Ja||n===Qa||n===ja||n===eo||n===to||n===no||n===io||n===so||n===ro||n===ao||n===oo||n===lo)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Za)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===$a)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ja)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Qa)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ja)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===eo)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===to)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===no)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===io)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===so)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ro)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ao)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===oo)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===lo)return a===nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===co||n===ho||n===uo)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===co)return a===nt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ho)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===uo)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===fo||n===po||n===Nr||n===mo)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===fo)return s.COMPRESSED_RED_RGTC1_EXT;if(n===po)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Nr)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===mo)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ns?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:t}}const ov=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,lv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class cv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new _h(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Vt({vertexShader:ov,fragmentShader:lv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new wt(new vi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class hv extends Pi{constructor(e,t){super();const n=this;let i=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,m=null;const _=typeof XRWebGLBinding<"u",g=new cv,p={},x=t.getContextAttributes();let y=null,M=null;const w=[],E=[],v=new Ue;let T=null,I=null;const R=new Jt;R.viewport=new Ze;const P=new Jt;P.viewport=new Ze;const F=[R,P],G=new dd;let C=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let de=w[$];return de===void 0&&(de=new sa,w[$]=de),de.getTargetRaySpace()},this.getControllerGrip=function($){let de=w[$];return de===void 0&&(de=new sa,w[$]=de),de.getGripSpace()},this.getHand=function($){let de=w[$];return de===void 0&&(de=new sa,w[$]=de),de.getHandSpace()};function q($){const de=E.indexOf($.inputSource);if(de===-1)return;const Me=w[de];Me!==void 0&&(Me.update($.inputSource,$.frame,c||a),Me.dispatchEvent({type:$.type,data:$.inputSource}))}function W(){i.removeEventListener("select",q),i.removeEventListener("selectstart",q),i.removeEventListener("selectend",q),i.removeEventListener("squeeze",q),i.removeEventListener("squeezestart",q),i.removeEventListener("squeezeend",q),i.removeEventListener("end",W),i.removeEventListener("inputsourceschange",D);for(let $=0;$<w.length;$++){const de=E[$];de!==null&&(E[$]=null,w[$].disconnect(de))}C=null,V=null,g.reset();for(const $ in p)delete p[$];if(e.setRenderTarget(y),d=null,f=null,u=null,i=null,M=null,Pe.stop(),n.isPresenting=!1,e.setPixelRatio(T),e.setSize(v.width,v.height,!1),I!==null){const $=I.camera;$.fov=I.fov,$.zoom=I.zoom,$.updateProjectionMatrix(),I=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){s=$,n.isPresenting===!0&&we("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&we("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(i,t)),u},this.getFrame=function(){return m},this.getSession=function(){return i},this.setSession=async function($){if(i=$,i!==null){if(y=e.getRenderTarget(),i.addEventListener("select",q),i.addEventListener("selectstart",q),i.addEventListener("selectend",q),i.addEventListener("squeeze",q),i.addEventListener("squeezestart",q),i.addEventListener("squeezeend",q),i.addEventListener("end",W),i.addEventListener("inputsourceschange",D),x.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(v),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Me=null,Re=null,me=null;x.depth&&(me=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Me=x.stencil?di:mi,Re=x.stencil?ns:Bn);const Ie={colorFormat:t.RGBA8,depthFormat:me,scaleFactor:s};u=this.getBinding(),f=u.createProjectionLayer(Ie),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),M=new _n(f.textureWidth,f.textureHeight,{format:sn,type:Qt,depthTexture:new ss(f.textureWidth,f.textureHeight,Re,void 0,void 0,void 0,void 0,void 0,void 0,Me),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}else{const Me={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(i,t,Me),i.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),M=new _n(d.framebufferWidth,d.framebufferHeight,{format:sn,type:Qt,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Pe.setContext(i),Pe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function D($){for(let de=0;de<$.removed.length;de++){const Me=$.removed[de],Re=E.indexOf(Me);Re>=0&&(E[Re]=null,w[Re].disconnect(Me))}for(let de=0;de<$.added.length;de++){const Me=$.added[de];let Re=E.indexOf(Me);if(Re===-1){for(let Ie=0;Ie<w.length;Ie++)if(Ie>=E.length){E.push(Me),Re=Ie;break}else if(E[Ie]===null){E[Ie]=Me,Re=Ie;break}if(Re===-1)break}const me=w[Re];me&&me.connect(Me)}}function O($,de){de===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(de.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(i===null)return;let de=$.near,Me=$.far;g.texture!==null&&(g.depthNear>0&&(de=g.depthNear),g.depthFar>0&&(Me=g.depthFar)),G.near=P.near=R.near=de,G.far=P.far=R.far=Me,(C!==G.near||V!==G.far)&&(i.updateRenderState({depthNear:G.near,depthFar:G.far}),C=G.near,V=G.far),G.layers.mask=$.layers.mask|6,R.layers.mask=G.layers.mask&-5,P.layers.mask=G.layers.mask&-3;const Re=$.parent,me=G.cameras;O(G,Re);for(let Ie=0;Ie<me.length;Ie++)O(me[Ie],Re);G.projectionMatrix.copy(R.projectionMatrix),G.projectionMatrixInverse.copy(R.projectionMatrixInverse),I===null&&$.isPerspectiveCamera&&(I={camera:$,fov:$.fov,zoom:$.zoom}),Y($,G,Re)};function Y($,de,Me){Me===null?$.matrix.copy(de.matrixWorld):($.matrix.copy(Me.matrixWorld),$.matrix.invert(),$.matrix.multiply(de.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(de.projectionMatrix),$.projectionMatrixInverse.copy(de.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=is*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return G},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function($){l=$,f!==null&&(f.fixedFoveation=$),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=$)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(G)},this.getCameraTexture=function($){return p[$]};let te=null;function xe($,de){if(h=de.getViewerPose(c||a),m=de,h!==null){const Me=h.views;d!==null&&(e.setRenderTargetFramebuffer(M,d.framebuffer),e.setRenderTarget(M));let Re=!1;Me.length!==G.cameras.length&&(G.cameras.length=0,Re=!0);for(let Te=0;Te<Me.length;Te++){const Qe=Me[Te];let st=null;if(d!==null)st=d.getViewport(Qe);else{const Ot=u.getViewSubImage(f,Qe);st=Ot.viewport,Te===0&&(e.setRenderTargetTextures(M,Ot.colorTexture,Ot.depthStencilTexture),e.setRenderTarget(M))}let qe=F[Te];qe===void 0&&(qe=new Jt,qe.layers.enable(Te),qe.viewport=new Ze,F[Te]=qe),qe.matrix.fromArray(Qe.transform.matrix),qe.matrix.decompose(qe.position,qe.quaternion,qe.scale),qe.projectionMatrix.fromArray(Qe.projectionMatrix),qe.projectionMatrixInverse.copy(qe.projectionMatrix).invert(),qe.viewport.set(st.x,st.y,st.width,st.height),Te===0&&(G.matrix.copy(qe.matrix),G.matrix.decompose(G.position,G.quaternion,G.scale)),Re===!0&&G.cameras.push(qe)}const me=i.enabledFeatures;if(me&&me.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){u=n.getBinding();const Te=u.getDepthInformation(Me[0]);Te&&Te.isValid&&Te.texture&&g.init(Te,i.renderState)}if(me&&me.includes("camera-access")&&_){e.state.unbindTexture(),u=n.getBinding();for(let Te=0;Te<Me.length;Te++){const Qe=Me[Te].camera;if(Qe){let st=p[Qe];st||(st=new _h,p[Qe]=st);const qe=u.getCameraImage(Qe);st.sourceTexture=qe}}}}for(let Me=0;Me<w.length;Me++){const Re=E[Me],me=w[Me];Re!==null&&me!==void 0&&me.update(Re,de,c||a)}te&&te($,de),de.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:de}),m=null}const Pe=new Ah;Pe.setAnimationLoop(xe),this.setAnimationLoop=function($){te=$},this.dispose=function(){}}}const uv=new Oe,Oh=new Be;Oh.set(-1,0,0,0,1,0,0,0,1);function fv(r,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,yh(r)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function i(g,p,x,y,M){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?s(g,p):p.isMeshLambertMaterial?(s(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(s(g,p),u(g,p)):p.isMeshPhongMaterial?(s(g,p),h(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(s(g,p),f(g,p),p.isMeshPhysicalMaterial&&d(g,p,M)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),_(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,x,y):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===jt&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===jt&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const x=e.get(p),y=x.envMap,M=x.envMapRotation;y&&(g.envMap.value=y,g.envMapRotation.value.setFromMatrix4(uv.makeRotationFromEuler(M)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Oh),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,x,y){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*x,g.scale.value=y*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function f(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function d(g,p,x){g.ior.value=p.ior,p.diffuseRoughness>0&&(g.diffuseRoughness.value=p.diffuseRoughness,p.diffuseRoughnessMap&&(g.diffuseRoughnessMap.value=p.diffuseRoughnessMap,t(p.diffuseRoughnessMap,g.diffuseRoughnessMapTransform))),p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===jt&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessMinimum,g.iridescenceThicknessMaximum.value=p.iridescenceThicknessMaximum,p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function _(g,p){const x=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function dv(r,e,t,n){let i={},s={};function a(x,y){const M=y.program;n.uniformBlockBinding(x,M,i[x.id])}function o(x,y){let M=i[x.id];M===void 0&&(m(x),M=l(x),i[x.id]=M,x.addEventListener("dispose",g));const w=y.program;n.updateUBOMapping(x,w);const E=e.render.frame;s[x.id]!==E&&(c(x),s[x.id]=E)}function l(x){const y=r.createBuffer(),M=x.__size,w=x.usage;return r.bindBuffer(r.UNIFORM_BUFFER,y),r.bufferData(r.UNIFORM_BUFFER,M,w),r.bindBuffer(r.UNIFORM_BUFFER,null),y}function c(x){const y=i[x.id],M=x.uniforms,w=x.__cache;r.bindBuffer(r.UNIFORM_BUFFER,y);for(let E=0,v=M.length;E<v;E++){const T=M[E];if(Array.isArray(T))for(let I=0,R=T.length;I<R;I++)h(T[I],E,I,w);else h(T,E,0,w)}r.bindBuffer(r.UNIFORM_BUFFER,null)}function h(x,y,M,w){if(f(x,y,M,w)===!0){const E=x.__offset,v=x.value;if(Array.isArray(v)){let T=0;for(let I=0;I<v.length;I++){const R=v[I],P=_(R,!0);u(R,x.__data,T),T+=P.storage/Float32Array.BYTES_PER_ELEMENT}}else u(v,x.__data,0);r.bufferSubData(r.UNIFORM_BUFFER,E,x.__data)}}function u(x,y,M){typeof x=="number"||typeof x=="boolean"?y[M]=x:x.isMatrix3?(y[M]=x.elements[0],y[M+1]=x.elements[1],y[M+2]=x.elements[2],y[M+3]=0,y[M+4]=x.elements[3],y[M+5]=x.elements[4],y[M+6]=x.elements[5],y[M+7]=0,y[M+8]=x.elements[6],y[M+9]=x.elements[7],y[M+10]=x.elements[8],y[M+11]=0):ArrayBuffer.isView(x)?y.set(x.subarray(0,y.length-M),M):x.toArray(y,M)}function f(x,y,M,w){const E=x.value,v=y+"_"+M;if(Array.isArray(E)){w[v]===void 0&&(w[v]=[]);const T=w[v];let I=!1;for(let R=0;R<E.length;R++)d(E[R],T,R)===!0&&(I=!0);return I}return d(E,w,v)}function d(x,y,M){if(y[M]===void 0)return typeof x=="number"||typeof x=="boolean"?y[M]=x:ArrayBuffer.isView(x)?y[M]=x.slice():y[M]=x.clone(),!0;{const w=y[M];if(typeof x=="number"||typeof x=="boolean"){if(w!==x)return y[M]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(w.equals(x)===!1)return w.copy(x),!0}}return!1}function m(x){const y=x.uniforms;let M=0;const w=16;for(let v=0,T=y.length;v<T;v++){const I=Array.isArray(y[v])?y[v]:[y[v]];for(let R=0,P=I.length;R<P;R++){const F=I[R],G=Array.isArray(F.value)?F.value:[F.value],C=Array.isArray(y[v])||Array.isArray(F.value);let V=M;for(let W=0,D=G.length;W<D;W++){const O=G[W],Y=_(O,C),te=M%w,xe=te%Y.boundary,Pe=te+xe;M+=xe,Pe!==0&&w-Pe<Y.storage&&(M+=w-Pe),W===0&&(V=M),M+=Y.storage}const q=F.type==="int"?Int32Array:F.type==="uint"?Uint32Array:Float32Array;F.__data=new q((M-V)/Float32Array.BYTES_PER_ELEMENT),F.__offset=V}}const E=M%w;return E>0&&(M+=w-E),x.__size=M,x.__cache={},this}function _(x,y){const M={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(M.boundary=4,M.storage=4):x.isVector2?(M.boundary=8,M.storage=8):x.isVector3||x.isColor?(M.boundary=16,M.storage=12):x.isVector4?(M.boundary=16,M.storage=16):x.isMatrix3?(M.boundary=16,M.storage=48):x.isMatrix4?(M.boundary=16,M.storage=64):x.isTexture?we("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(M.boundary=16,M.storage=x.byteLength):we("WebGLRenderer: Unsupported uniform value type.",x),y===!0&&(M.boundary=16,M.storage=Math.ceil(M.storage/16)*16),M}function g(x){const y=x.target;y.removeEventListener("dispose",g),r.deleteBuffer(i[y.id]),delete i[y.id],delete s[y.id]}function p(){for(const x in i)r.deleteBuffer(i[x]);i={},s={}}return{bind:a,update:o,dispose:p}}const pv=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Dn=null;function mv(){return Dn===null&&(Dn=new Qi(pv,16,16,Ci,rn),Dn.name="DFG_LUT",Dn.minFilter=ut,Dn.magFilter=ut,Dn.wrapS=Yt,Dn.wrapT=Yt,Dn.generateMipmaps=!1,Dn.needsUpdate=!0),Dn}class gv{constructor(e={}){const{canvas:t=zu(),context:n=null,depth:i=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1,outputBufferType:d=Qt}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;const _=d,g=new Set([Io,Lo,Po]),p=new Set([Qt,Bn,Ds,ns,Ao,Ro]),x=new Uint32Array(4),y=new Int32Array(4),M={textures:[],min:[],max:[],resolution:[]};let w=null,E=null;const v=[],T=[];let I=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=On,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const R=this;let P=!1,F=null,G=null,C=null,V=null;this._outputColorSpace=Ut;let q=0,W=0,D=null,O=-1,Y=null;const te=new Ze,xe=new Ze;let Pe=null;const $=new Ne(0);let de=0,Me=t.width,Re=t.height,me=1,Ie=null,ft=null;const Te=new Ze(0,0,Me,Re),Qe=new Ze(0,0,Me,Re);let st=!1;const qe=new Bs,Ot=new Bo;let yt=!1,Kt=!1;const dt=new Oe,Ln=new z,Pt=new Ze,an={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let on=!1;function ln(){return D===null?me:1}let U=n;function cn(b,N){return t.getContext(b,N)}let lt,ct,pe,bt,Le,Fe,A,S,k,ie,ee,ae,ue,Z,J,le,L,Q,K,ce,re,oe,Ae;try{const b={alpha:!0,depth:i,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Eo}`),t.addEventListener("webglcontextlost",Ce,!1),t.addEventListener("webglcontextrestored",ke,!1),t.addEventListener("webglcontextcreationerror",ge,!1),U===null){const N="webgl2";if(U=cn(N,b),U===null)throw cn(N)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ge()}catch(b){throw t.removeEventListener("webglcontextlost",Ce,!1),t.removeEventListener("webglcontextrestored",ke,!1),t.removeEventListener("webglcontextcreationerror",ge,!1),De("WebGLRenderer: "+b.message),b}function Ge(){lt=new x0(U),lt.init(),re=new av(U,lt),ct=new l0(U,lt,e,re),pe=new sv(U,lt),ct.reversedDepthBuffer&&f&&pe.buffers.depth.setReversed(!0),G=U.createFramebuffer(),C=U.createFramebuffer(),V=U.createFramebuffer(),bt=new y0(U),Le=new Wg,Fe=new rv(U,lt,pe,Le,ct,re,bt),A=new _0(R),S=new Td(U),oe=new a0(U,S),k=new M0(U,S,bt,oe),ie=new T0(U,k,S,oe,bt),Q=new b0(U,ct,Fe),J=new c0(Le),ee=new Vg(R,A,lt,ct,oe,J),ae=new fv(R,Le),ue=new qg,Z=new Qg(lt),L=new r0(R,A,pe,ie,m,l),le=new iv(R,ie,ct),Ae=new dv(U,bt,ct,pe),K=new o0(U,lt,bt),ce=new S0(U,lt,bt),bt.programs=ee.programs,R.capabilities=ct,R.extensions=lt,R.properties=Le,R.renderLists=ue,R.shadowMap=le,R.state=pe,R.info=bt}_!==Qt&&(I=new w0(_,t.width,t.height,o,i,s));const se=new hv(R,U);this.xr=se,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const b=lt.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=lt.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return me},this.setPixelRatio=function(b){b!==void 0&&(me=b,this.setSize(Me,Re,!1))},this.getSize=function(b){return b.set(Me,Re)},this.setSize=function(b,N,X=!0){if(se.isPresenting){we("WebGLRenderer: Can't change size while VR device is presenting.");return}Me=b,Re=N,t.width=Math.floor(b*me),t.height=Math.floor(N*me),X===!0&&(t.style.width=b+"px",t.style.height=N+"px"),I!==null&&I.setSize(t.width,t.height),this.setViewport(0,0,b,N)},this.getDrawingBufferSize=function(b){return b.set(Me*me,Re*me).floor()},this.setDrawingBufferSize=function(b,N,X){Me=b,Re=N,me=X,t.width=Math.floor(b*X),t.height=Math.floor(N*X),this.setViewport(0,0,b,N)},this.setEffects=function(b){if(_===Qt){De("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let N=0;N<b.length;N++)if(b[N].isOutputPass===!0){we("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}I.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(te)},this.getViewport=function(b){return b.copy(Te)},this.setViewport=function(b,N,X,B){b.isVector4?Te.set(b.x,b.y,b.z,b.w):Te.set(b,N,X,B),pe.viewport(te.copy(Te).multiplyScalar(ln()).round())},this.getScissor=function(b){return b.copy(Qe)},this.setScissor=function(b,N,X,B){b.isVector4?Qe.set(b.x,b.y,b.z,b.w):Qe.set(b,N,X,B),pe.scissor(xe.copy(Qe).multiplyScalar(ln()).round())},this.getScissorTest=function(){return st},this.setScissorTest=function(b){pe.setScissorTest(st=b)},this.setOpaqueSort=function(b){Ie=b},this.setTransparentSort=function(b){ft=b},this.getClearColor=function(b){return b.copy(L.getClearColor())},this.setClearColor=function(){L.setClearColor(...arguments)},this.getClearAlpha=function(){return L.getClearAlpha()},this.setClearAlpha=function(){L.setClearAlpha(...arguments)},this.clear=function(b=!0,N=!0,X=!0){let B=0;if(b){let H=!1;if(D!==null){const fe=D.texture.format;H=g.has(fe)}if(H){const fe=D.texture.type,Se=p.has(fe),he=L.getClearColor(),_e=L.getClearAlpha(),Ee=he.r,ze=he.g,Ye=he.b;Se?(x[0]=Ee,x[1]=ze,x[2]=Ye,x[3]=_e,U.clearBufferuiv(U.COLOR,0,x)):(y[0]=Ee,y[1]=ze,y[2]=Ye,y[3]=_e,U.clearBufferiv(U.COLOR,0,y))}else B|=U.COLOR_BUFFER_BIT}N&&(B|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(B|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B!==0&&U.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),F=b},this.dispose=function(){t.removeEventListener("webglcontextlost",Ce,!1),t.removeEventListener("webglcontextrestored",ke,!1),t.removeEventListener("webglcontextcreationerror",ge,!1),L.dispose(),ue.dispose(),Z.dispose(),Fe.dispose(),Le.dispose(),A.dispose(),ie.dispose(),k.dispose(),oe.dispose(),Ae.dispose(),ee.dispose(),se.dispose(),se.removeEventListener("sessionstart",Jo),se.removeEventListener("sessionend",Qo),_i.stop()};function Ce(b){b.preventDefault(),Fr("WebGLRenderer: Context Lost."),P=!0}function ke(){Fr("WebGLRenderer: Context Restored."),P=!1;const b=bt.autoReset,N=le.enabled,X=le.autoUpdate,B=le.needsUpdate,H=le.type;Ge(),bt.autoReset=b,le.enabled=N,le.autoUpdate=X,le.needsUpdate=B,le.type=H}function ge(b){De("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function et(b){const N=b.target;N.removeEventListener("dispose",et),Lt(N)}function Lt(b){ii(b),Le.remove(b)}function ii(b){const N=Le.get(b).programs;N!==void 0&&(N.forEach(function(X){ee.releaseProgram(X)}),b.isShaderMaterial&&ee.releaseShaderCache(b))}this.renderBufferDirect=function(b,N,X,B,H,fe){N===null&&(N=an);const Se=H.isMesh&&H.matrixWorld.determinantAffine()<0,he=$h(b,N,X,B,H);pe.setMaterial(B,Se);let _e=X.index,Ee=1;if(B.wireframe===!0){if(_e=k.getWireframeAttribute(X),_e===void 0)return;Ee=2}const ze=X.drawRange,Ye=X.attributes.position;let ye=ze.start*Ee,Ke=(ze.start+ze.count)*Ee;fe!==null&&(ye=Math.max(ye,fe.start*Ee),Ke=Math.min(Ke,(fe.start+fe.count)*Ee)),_e!==null?(ye=Math.max(ye,0),Ke=Math.min(Ke,_e.count)):Ye!=null&&(ye=Math.max(ye,0),Ke=Math.min(Ke,Ye.count));const _t=Ke-ye;if(_t<0||_t===1/0)return;oe.setup(H,B,he,X,_e);let ot,rt=K;if(_e!==null&&(ot=S.get(_e),rt=ce,rt.setIndex(ot)),H.isMesh)B.wireframe===!0?(pe.setLineWidth(B.wireframeLinewidth*ln()),rt.setMode(U.LINES)):rt.setMode(U.TRIANGLES);else if(H.isLine){let Bt=B.linewidth;Bt===void 0&&(Bt=1),pe.setLineWidth(Bt*ln()),H.isLineSegments?rt.setMode(U.LINES):H.isLineLoop?rt.setMode(U.LINE_LOOP):rt.setMode(U.LINE_STRIP)}else H.isPoints?rt.setMode(U.POINTS):H.isSprite&&rt.setMode(U.TRIANGLES);if(H.isBatchedMesh)if(lt.get("WEBGL_multi_draw"))rt.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const Bt=H._multiDrawStarts,be=H._multiDrawCounts,Wt=H._multiDrawCount,Je=_e?S.get(_e).bytesPerElement:1,xi=Le.get(B).currentProgram.getUniforms();for(let kt=0;kt<Wt;kt++)xi.setValue(U,"_gl_DrawID",kt),rt.render(Bt[kt]/Je,be[kt])}else if(H.isInstancedMesh)rt.renderInstances(ye,_t,H.count);else if(X.isInstancedBufferGeometry){const Bt=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,be=Math.min(X.instanceCount,Bt);rt.renderInstances(ye,_t,be)}else rt.render(ye,_t)};function $o(b,N,X,B){F!==null&&b.isNodeMaterial&&F.setObject(B,b),yt===!0&&J.setState(b,X,!1),b.transparent===!0&&b.side===pn&&b.forceSinglePass===!1?(b.side=jt,b.needsUpdate=!0,us(b,N,B),b.side=ei,b.needsUpdate=!0,us(b,N,B),b.side=pn):us(b,N,B)}this.compile=function(b,N,X=null){X===null&&(X=b),F!==null&&F.renderStart(b,N,X),E=Z.get(X),E.init(N),T.push(E),X.traverseVisible(function(H){H.isLight&&H.layers.test(N.layers)&&(E.pushLight(H),H.castShadow&&E.pushShadow(H))}),b!==X&&b.traverseVisible(function(H){H.isLight&&H.layers.test(N.layers)&&(E.pushLight(H),H.castShadow&&E.pushShadow(H))}),E.setupLights(),F!==null&&F.updateLights(E.state.lightsArray),Kt=this.localClippingEnabled,yt=J.init(this.clippingPlanes,Kt),yt===!0&&J.setGlobalState(this.clippingPlanes,N),F!==null&&le.render(E.state.shadowsArray,X,N);const B=new Set;return b.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const fe=H.material;if(fe)if(Array.isArray(fe))for(let Se=0;Se<fe.length;Se++){const he=fe[Se];$o(he,X,N,H),B.add(he)}else $o(fe,X,N,H),B.add(fe)}),E=T.pop(),F!==null&&F.renderEnd(),B},this.compileAsync=function(b,N,X=null){const B=this.compile(b,N,X);return new Promise(H=>{function fe(){if(B.forEach(function(Se){const _e=Le.get(Se).currentProgram;(_e===void 0||_e.isReady())&&B.delete(Se)}),B.size===0){H(b);return}setTimeout(fe,10)}lt.get("KHR_parallel_shader_compile")!==null?fe():setTimeout(fe,10)})};let Yr=null;function Kh(b){Yr&&Yr(b)}function Jo(){_i.stop()}function Qo(){_i.start()}const _i=new Ah;_i.setAnimationLoop(Kh),typeof self<"u"&&_i.setContext(self),this.setAnimationLoop=function(b){Yr=b,se.setAnimationLoop(b),b===null?_i.stop():_i.start()},se.addEventListener("sessionstart",Jo),se.addEventListener("sessionend",Qo),this.render=function(b,N){if(N!==void 0&&N.isCamera!==!0){De("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;F!==null&&F.renderStart(b,N);const X=se.enabled===!0&&se.isPresenting===!0,B=I!==null&&(D===null||X)&&I.begin(R,D);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),se.enabled===!0&&se.isPresenting===!0&&(I===null||I.isCompositing()===!1)&&(se.cameraAutoUpdate===!0&&se.updateCamera(N),N=se.getCamera()),b.isScene===!0&&b.onBeforeRender(R,b,N,D),E=Z.get(b,T.length),E.init(N),E.state.textureUnits=Fe.getTextureUnits(),T.push(E),dt.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),N.isArrayCamera?Ot.setFromArrayCamera(N):qe.setFromProjectionMatrix(dt,Rn,N.reversedDepth),Kt=this.localClippingEnabled,yt=J.init(this.clippingPlanes,Kt),w=ue.get(b,v.length),w.init(),v.push(w),this.info.render.frame++,se.enabled===!0&&se.isPresenting===!0){const Se=R.xr.getDepthSensingMesh();Se!==null&&Kr(Se,N,-1/0,R.sortObjects)}Kr(b,N,0,R.sortObjects),w.finish(),F!==null&&F.updateLights(E.state.lightsArray),R.sortObjects===!0&&w.sort(Ie,ft),on=se.enabled===!1||se.isPresenting===!1||se.hasDepthSensing()===!1,on&&L.addToRenderList(w,b),this.info.autoReset===!0&&this.info.reset(),yt===!0&&J.beginShadows();const H=E.state.shadowsArray;if(le.render(H,b,N),yt===!0&&J.endShadows(),(B&&I.hasRenderPass())===!1){const Se=w.opaque,he=w.transmissive;if(E.setupLights(),N.isArrayCamera){const _e=N.cameras;if(he.length>0)for(let Ee=0,ze=_e.length;Ee<ze;Ee++){const Ye=_e[Ee];el(Se,he,b,Ye)}on&&L.render(b);for(let Ee=0,ze=_e.length;Ee<ze;Ee++){const Ye=_e[Ee];jo(w,b,Ye,Ye.viewport)}}else he.length>0&&el(Se,he,b,N),on&&L.render(b),jo(w,b,N)}D!==null&&W===0&&(Fe.updateMultisampleRenderTarget(D),Fe.updateRenderTargetMipmap(D)),B&&I.end(R),b.isScene===!0&&b.onAfterRender(R,b,N),oe.resetDefaultState(),O=-1,Y=null,T.pop(),T.length>0?(E=T[T.length-1],Fe.setTextureUnits(E.state.textureUnits),yt===!0&&J.setGlobalState(R.clippingPlanes,E.state.camera)):E=null,v.pop(),v.length>0?w=v[v.length-1]:w=null,F!==null&&F.renderEnd()};function Kr(b,N,X,B){if(b.visible===!1)return;if(b.layers.test(N.layers)){if(b.isGroup)X=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(N);else if(b.isLight)E.pushLight(b),b.castShadow&&E.pushShadow(b);else if(b.isSprite){const Se=N.isArrayCamera?Ot:qe;if(!b.frustumCulled||b.intersectsFrustum(Se)){B&&Pt.setFromMatrixPosition(b.matrixWorld).applyMatrix4(dt);const he=ie.update(b),_e=b.material;_e.visible&&w.push(b,he,_e,X,Pt.z,null,N)}}else if(b.isMesh||b.isLine||b.isPoints){const Se=N.isArrayCamera?Ot:qe;if(!b.frustumCulled||b.intersectsFrustum(Se)){const he=ie.update(b),_e=b.material;if(B&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Pt.copy(b.boundingSphere.center)):(he.boundingSphere===null&&he.computeBoundingSphere(),Pt.copy(he.boundingSphere.center)),Pt.applyMatrix4(b.matrixWorld).applyMatrix4(dt)),Array.isArray(_e)){const Ee=he.groups;for(let ze=0,Ye=Ee.length;ze<Ye;ze++){const ye=Ee[ze],Ke=_e[ye.materialIndex];Ke&&Ke.visible&&w.push(b,he,Ke,X,Pt.z,ye,N)}}else _e.visible&&w.push(b,he,_e,X,Pt.z,null,N)}}}const fe=b.children;for(let Se=0,he=fe.length;Se<he;Se++)Kr(fe[Se],N,X,B)}function jo(b,N,X,B){const{opaque:H,transmissive:fe,transparent:Se}=b;E.setupLightsView(X),yt===!0&&J.setGlobalState(R.clippingPlanes,X),B&&pe.viewport(te.copy(B)),H.length>0&&Xs(H,N,X),fe.length>0&&Xs(fe,N,X),Se.length>0&&Xs(Se,N,X),pe.buffers.depth.setTest(!0),pe.buffers.depth.setMask(!0),pe.buffers.color.setMask(!0),pe.setPolygonOffset(!1)}function el(b,N,X,B){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[B.id]===void 0){const ye=lt.has("EXT_color_buffer_half_float")||lt.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[B.id]=new _n(1,1,{generateMipmaps:!0,type:ye?rn:Qt,minFilter:mn,samples:Math.max(4,ct.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Xe.workingColorSpace})}const fe=E.state.transmissionRenderTarget[B.id],Se=B.viewport||te;fe.setSize(Se.z*R.transmissionResolutionScale,Se.w*R.transmissionResolutionScale);const he=R.getRenderTarget(),_e=R.getActiveCubeFace(),Ee=R.getActiveMipmapLevel();R.setRenderTarget(fe),R.getClearColor($),de=R.getClearAlpha(),de<1&&R.setClearColor(16777215,.5),R.clear(),on&&L.render(X);const ze=R.toneMapping;R.toneMapping=On;const Ye=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),E.setupLightsView(B),yt===!0&&J.setGlobalState(R.clippingPlanes,B),Xs(b,X,B),Fe.updateMultisampleRenderTarget(fe),Fe.updateRenderTargetMipmap(fe),lt.has("WEBGL_multisampled_render_to_texture")===!1){let ye=!1;for(let Ke=0,_t=N.length;Ke<_t;Ke++){const ot=N[Ke],{object:rt,geometry:Bt,material:be,group:Wt}=ot;if(be.side===pn&&rt.layers.test(B.layers)){const Je=be.side;be.side=jt,be.needsUpdate=!0,tl(rt,X,B,Bt,be,Wt),be.side=Je,be.needsUpdate=!0,ye=!0}}ye===!0&&(Fe.updateMultisampleRenderTarget(fe),Fe.updateRenderTargetMipmap(fe))}R.setRenderTarget(he,_e,Ee),R.setClearColor($,de),Ye!==void 0&&(B.viewport=Ye),R.toneMapping=ze}function Xs(b,N,X){const B=N.isScene===!0?N.overrideMaterial:null;for(let H=0,fe=b.length;H<fe;H++){const Se=b[H],{object:he,geometry:_e,group:Ee}=Se;let ze=Se.material;ze.allowOverride===!0&&B!==null&&(ze=B),he.layers.test(X.layers)&&tl(he,N,X,_e,ze,Ee)}}function tl(b,N,X,B,H,fe){F!==null&&H.isNodeMaterial&&F.setObject(b,H),b.onBeforeRender(R,N,X,B,H,fe),b.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),H.onBeforeRender(R,N,X,B,b,fe),H.transparent===!0&&H.side===pn&&H.forceSinglePass===!1?(H.side=jt,H.needsUpdate=!0,R.renderBufferDirect(X,N,B,H,b,fe),H.side=ei,H.needsUpdate=!0,R.renderBufferDirect(X,N,B,H,b,fe),H.side=pn):R.renderBufferDirect(X,N,B,H,b,fe),b.onAfterRender(R,N,X,B,H,fe)}function nl(b){let N=0;for(const X of b)X.texture!==null&&N++;return N}function us(b,N,X){N.isScene!==!0&&(N=an);const B=Le.get(b),H=E.state.lights,fe=E.state.shadowsArray,Se=H.state.version,he=ee.getParameters(b,H.state,fe,N,X,E.state.lightProbeGridArray),_e=ee.getProgramCacheKey(he);let Ee=B.programs;B.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?N.environment:null,B.fog=N.fog;const ze=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;B.envMap=A.get(b.envMap||B.environment,ze),B.envMapRotation=B.environment!==null&&b.envMap===null?N.environmentRotation:b.envMapRotation,Ee===void 0&&(b.addEventListener("dispose",et),Ee=new Map,B.programs=Ee,B.programVariants=new Map);let Ye=Ee.get(_e);if(Ye!==void 0){if(B.currentProgram===Ye&&B.lightsStateVersion===Se)return sl(b,he),Ye}else he.uniforms=ee.getUniforms(b),F!==null&&b.isNodeMaterial&&F.build(b,X,he),b.onBeforeCompile(he,R),Ye=ee.acquireProgram(he,_e),Ee.set(_e,Ye),B.uniforms=he.uniforms;const ye=B.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(ye.clippingPlanes=J.uniform),sl(b,he),B.needsLights=Qh(b),B.lightsStateVersion=Se,B.needsLights&&(ye.ambientLightColor.value=H.state.ambient,ye.lightProbe.value=H.state.probe,ye.sunLights.value=H.state.sun,ye.sunLightShadows.value=H.state.sunShadow,ye.directionalLights.value=H.state.directional,ye.directionalLightShadows.value=H.state.directionalShadow,ye.spotLights.value=H.state.spot,ye.spotLightShadows.value=H.state.spotShadow,ye.rectAreaLights.value=H.state.rectArea,ye.ltc_1.value=H.state.rectAreaLTC1,ye.ltc_2.value=H.state.rectAreaLTC2,ye.pointLights.value=H.state.point,ye.pointLightShadows.value=H.state.pointShadow,ye.hemisphereLights.value=H.state.hemi,ye.sunShadowMatrix.value=H.state.sunShadowMatrix,ye.sunShadowCascade.value=H.state.sunShadowCascade,ye.directionalShadowMatrix.value=H.state.directionalShadowMatrix,ye.spotLightMatrix.value=H.state.spotLightMatrix,ye.spotLightMap.value=H.state.spotLightMap,ye.pointShadowMatrix.value=H.state.pointShadowMatrix),B.numLightProbeGrids=nl(E.state.lightProbeGridArray),B.currentProgram=Ye,B.uniformsList=null,Ye}function Zh(b,N,X,B,H){const fe=Le.get(b),Se=fe.currentProgram.id+","+B+","+H;let he=fe.programVariants.get(Se);return he===void 0?(he=us(b,N,X),fe.programVariants.set(Se,he)):(fe.currentProgram=he,fe.uniformsList=null,fe.outputColorSpace=B,fe.toneMapping=H),he}function il(b){if(b.uniformsList===null){const N=b.currentProgram.getUniforms();b.uniformsList=Pr.seqWithValue(N.seq,b.uniforms)}return b.uniformsList}function sl(b,N){const X=Le.get(b);X.outputColorSpace=N.outputColorSpace,X.batching=N.batching,X.batchingColor=N.batchingColor,X.instancing=N.instancing,X.instancingColor=N.instancingColor,X.instancingMorph=N.instancingMorph,X.skinning=N.skinning,X.morphTargets=N.morphTargets,X.morphNormals=N.morphNormals,X.morphColors=N.morphColors,X.morphTargetsCount=N.morphTargetsCount,X.numClippingPlanes=N.numClippingPlanes,X.numIntersection=N.numClipIntersection,X.vertexAlphas=N.vertexAlphas,X.vertexTangents=N.vertexTangents,X.toneMapping=N.toneMapping}function $h(b,N,X,B,H){N.isScene!==!0&&(N=an),Fe.resetTextureUnits();const fe=N.fog,Se=B.isMeshStandardMaterial||B.isMeshLambertMaterial||B.isMeshPhongMaterial?N.environment:null,he=D===null?R.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:Xe.workingColorSpace,_e=B.isMeshStandardMaterial||B.isMeshLambertMaterial&&!B.envMap||B.isMeshPhongMaterial&&!B.envMap,Ee=A.get(B.envMap||Se,_e),ze=B.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Ye=!!X.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),ye=!!X.morphAttributes.position,Ke=!!X.morphAttributes.normal,_t=!!X.morphAttributes.color;let ot=On;B.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(ot=R.toneMapping);const rt=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Bt=rt!==void 0?rt.length:0,be=Le.get(B),Wt=E.state.lights;if(yt===!0&&(Kt===!0||b!==Y)){const pt=b===Y&&B.id===O;J.setState(B,b,pt)}let Je=!1,xi=!1;B.version===be.__version?be.needsLights&&be.lightsStateVersion!==Wt.state.version||H.isBatchedMesh&&be.batching===!1||!H.isBatchedMesh&&be.batching===!0||H.isBatchedMesh&&be.batchingColor===!0&&H._colorsTexture===null||H.isBatchedMesh&&be.batchingColor===!1&&H._colorsTexture!==null||H.isInstancedMesh&&be.instancing===!1||!H.isInstancedMesh&&be.instancing===!0||H.isSkinnedMesh&&be.skinning===!1||!H.isSkinnedMesh&&be.skinning===!0||H.isInstancedMesh&&be.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&be.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&be.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&be.instancingMorph===!1&&H.morphTexture!==null||be.envMap!==Ee||B.fog===!0&&be.fog!==fe||be.numClippingPlanes!==void 0&&(be.numClippingPlanes!==J.numPlanes||be.numIntersection!==J.numIntersection)||be.vertexAlphas!==ze||be.vertexTangents!==Ye||be.morphTargets!==ye||be.morphNormals!==Ke||be.morphColors!==_t||be.morphTargetsCount!==Bt||be.numLightProbeGrids!==nl(E.state.lightProbeGridArray)?Je=!0:(be.outputColorSpace!==he||be.toneMapping!==ot)&&(xi=!0):(Je=!0,be.__version=B.version);let kt=be.currentProgram;(Je===!0||xi===!0)&&(kt=xi===!0?Zh(B,N,H,he,ot):us(B,N,H),F&&B.isNodeMaterial&&F.onUpdateProgram(B,kt,be));let qs=!1,si=!1,Mi=!1;const $e=kt.getUniforms(),zt=be.uniforms;if(pe.useProgram(kt.program)&&(qs=!0,si=!0,Mi=!0),B.id!==O&&(O=B.id,si=!0),qs||Y!==b){pe.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),$e.setValue(U,"projectionMatrix",b.projectionMatrix),$e.setValue(U,"viewMatrix",b.matrixWorldInverse);const It=$e.map.cameraPosition;It!==void 0&&It.setValue(U,Ln.setFromMatrixPosition(b.matrixWorld)),ct.logarithmicDepthBuffer&&$e.setValue(U,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&$e.setValue(U,"isOrthographic",b.isOrthographicCamera===!0),Y!==b&&(Y=b,si=!0,Mi=!0)}if(be.needsLights&&(Wt.state.sunShadowMap.length>0&&$e.setValue(U,"sunShadowMap",Wt.state.sunShadowMap,Fe),Wt.state.directionalShadowMap.length>0&&$e.setValue(U,"directionalShadowMap",Wt.state.directionalShadowMap,Fe),Wt.state.spotShadowMap.length>0&&$e.setValue(U,"spotShadowMap",Wt.state.spotShadowMap,Fe),Wt.state.pointShadowMap.length>0&&$e.setValue(U,"pointShadowMap",Wt.state.pointShadowMap,Fe)),H.isSkinnedMesh){$e.setOptional(U,H,"bindMatrix"),$e.setOptional(U,H,"bindMatrixInverse");const pt=H.skeleton;pt&&(pt.boneTexture===null&&pt.computeBoneTexture(),$e.setValue(U,"boneTexture",pt.boneTexture,Fe))}H.isBatchedMesh&&($e.setOptional(U,H,"batchingTexture"),$e.setValue(U,"batchingTexture",H._matricesTexture,Fe),$e.setOptional(U,H,"batchingIdTexture"),$e.setValue(U,"batchingIdTexture",H._indirectTexture,Fe),$e.setOptional(U,H,"batchingColorTexture"),H._colorsTexture!==null&&$e.setValue(U,"batchingColorTexture",H._colorsTexture,Fe));const Mn=X.morphAttributes;if((Mn.position!==void 0||Mn.normal!==void 0||Mn.color!==void 0)&&Q.update(H,X,kt),(si||be.receiveShadow!==H.receiveShadow)&&(be.receiveShadow=H.receiveShadow,$e.setValue(U,"receiveShadow",H.receiveShadow)),(B.isMeshStandardMaterial||B.isMeshLambertMaterial||B.isMeshPhongMaterial)&&B.envMap===null&&N.environment!==null&&(zt.envMapIntensity.value=N.environmentIntensity),zt.dfgLUT!==void 0&&(zt.dfgLUT.value=mv()),si){if($e.setValue(U,"toneMappingExposure",R.toneMappingExposure),be.needsLights&&Jh(zt,Mi),fe&&B.fog===!0&&ae.refreshFogUniforms(zt,fe),ae.refreshMaterialUniforms(zt,B,me,Re,E.state.transmissionRenderTarget[b.id]),be.needsLights&&be.numLightProbeGrids>0){const pt=M;let It=0;for(const Gn of E.state.lightProbeGridArray)Gn.texture!==null&&(pt.textures[It]=Gn.texture,pt.min[It]=Gn.boundingBox.min,pt.max[It]=Gn.boundingBox.max,pt.resolution[It]=Gn.resolution,It++);for(const Gn in pt)pt[Gn].length=It;zt.probesSH.value=pt.textures,zt.probesMin.value=pt.min,zt.probesMax.value=pt.max,zt.probesResolution.value=pt.resolution}Pr.upload(U,il(be),zt,Fe)}if(B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(Pr.upload(U,il(be),zt,Fe),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&$e.setValue(U,"center",H.center),$e.setValue(U,"modelViewMatrix",H.modelViewMatrix),$e.setValue(U,"normalMatrix",H.normalMatrix),$e.setValue(U,"modelMatrix",H.matrixWorld),B.uniformsGroups!==void 0){const pt=B.uniformsGroups;for(let It=0,Gn=pt.length;It<Gn;It++){const al=pt[It];Ae.update(al,kt),Ae.bind(al,kt)}}return kt}function Jh(b,N){b.ambientLightColor.needsUpdate=N,b.lightProbe.needsUpdate=N,b.sunLights.needsUpdate=N,b.sunLightShadows.needsUpdate=N,b.directionalLights.needsUpdate=N,b.directionalLightShadows.needsUpdate=N,b.pointLights.needsUpdate=N,b.pointLightShadows.needsUpdate=N,b.spotLights.needsUpdate=N,b.spotLightShadows.needsUpdate=N,b.rectAreaLights.needsUpdate=N,b.hemisphereLights.needsUpdate=N}function Qh(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return q},this.getActiveMipmapLevel=function(){return W},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(b,N,X){const B=Le.get(b);B.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,B.__autoAllocateDepthBuffer===!1&&(B.__useRenderToTexture=!1),Le.get(b.texture).__webglTexture=N,Le.get(b.depthTexture).__webglTexture=B.__autoAllocateDepthBuffer?void 0:X,B.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,N){const X=Le.get(b);X.__webglFramebuffer=N,X.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(b,N=0,X=0){D=b,q=N,W=X;let B=null,H=!1,fe=!1;if(b){const he=Le.get(b);if(he.__useDefaultFramebuffer!==void 0){pe.bindFramebuffer(U.FRAMEBUFFER,he.__webglFramebuffer),te.copy(b.viewport),xe.copy(b.scissor),Pe=b.scissorTest,pe.viewport(te),pe.scissor(xe),pe.setScissorTest(Pe),O=-1;return}else if(he.__webglFramebuffer===void 0)Fe.setupRenderTarget(b);else if(he.__hasExternalTextures)Fe.rebindTextures(b,Le.get(b.texture).__webglTexture,Le.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const ze=b.depthTexture;if(he.__boundDepthTexture!==ze){if(ze!==null&&Le.has(ze)&&(b.width!==ze.image.width||b.height!==ze.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Fe.setupDepthRenderbuffer(b)}}const _e=b.texture;(_e.isData3DTexture||_e.isDataArrayTexture||_e.isCompressedArrayTexture)&&(fe=!0);const Ee=Le.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ee[N])?B=Ee[N][X]:B=Ee[N],H=!0):b.samples>0&&Fe.useMultisampledRTT(b)===!1?B=Le.get(b).__webglMultisampledFramebuffer:Array.isArray(Ee)?B=Ee[X]:B=Ee,te.copy(b.viewport),xe.copy(b.scissor),Pe=b.scissorTest}else te.copy(Te).multiplyScalar(me).floor(),xe.copy(Qe).multiplyScalar(me).floor(),Pe=st;if(X!==0&&(B=G),pe.bindFramebuffer(U.FRAMEBUFFER,B)&&pe.drawBuffers(b,B),pe.viewport(te),pe.scissor(xe),pe.setScissorTest(Pe),H){const he=Le.get(b.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+N,he.__webglTexture,X)}else if(fe){const he=N;for(let _e=0;_e<b.textures.length;_e++){const Ee=Le.get(b.textures[_e]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+_e,Ee.__webglTexture,X,he)}}else if(b!==null&&X!==0){const he=Le.get(b.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,he.__webglTexture,X)}O=-1};function rl(b){const N=Le.get(b);return(N.__readFormat!==b.format||N.__readType!==b.type)&&(N.__readFormat=b.format,N.__readType=b.type,N.__formatReadable=ct.textureFormatReadable(b.format),N.__typeReadable=ct.textureTypeReadable(b.type)),N}this.readRenderTargetPixels=function(b,N,X,B,H,fe,Se,he=0){if(!(b&&b.isWebGLRenderTarget)){De("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _e=Le.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Se!==void 0&&(_e=_e[Se],Array.isArray(_e)&&(_e=_e[0])),_e){pe.bindFramebuffer(U.FRAMEBUFFER,_e);try{const Ee=b.textures[he],ze=Ee.format,Ye=Ee.type;b.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+he);const ye=rl(Ee);if(ye.__formatReadable===!1){De("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(ye.__typeReadable===!1){De("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=b.width-B&&X>=0&&X<=b.height-H&&U.readPixels(N,X,B,H,re.convert(ze),re.convert(Ye),fe)}finally{const Ee=D!==null?Le.get(D).__webglFramebuffer:null;pe.bindFramebuffer(U.FRAMEBUFFER,Ee)}}},this.readRenderTargetPixelsAsync=async function(b,N,X,B,H,fe,Se,he=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _e=Le.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Se!==void 0&&(_e=_e[Se],Array.isArray(_e)&&(_e=_e[0])),_e)if(N>=0&&N<=b.width-B&&X>=0&&X<=b.height-H){pe.bindFramebuffer(U.FRAMEBUFFER,_e);const Ee=b.textures[he],ze=Ee.format,Ye=Ee.type;b.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+he);const ye=rl(Ee);if(ye.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(ye.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ke=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Ke),U.bufferData(U.PIXEL_PACK_BUFFER,fe.byteLength,U.STREAM_READ),U.readPixels(N,X,B,H,re.convert(ze),re.convert(Ye),0),U.bindBuffer(U.PIXEL_PACK_BUFFER,null);const _t=D!==null?Le.get(D).__webglFramebuffer:null;pe.bindFramebuffer(U.FRAMEBUFFER,_t);const ot=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Bu(U,ot,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Ke),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,fe),U.bindBuffer(U.PIXEL_PACK_BUFFER,null),U.deleteBuffer(Ke),U.deleteSync(ot),fe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,N=null,X=0){const B=Math.pow(2,-X),H=Math.floor(b.image.width*B),fe=Math.floor(b.image.height*B),Se=N!==null?N.x:0,he=N!==null?N.y:0;Fe.setTexture2D(b,0),U.copyTexSubImage2D(U.TEXTURE_2D,X,0,0,Se,he,H,fe),pe.unbindTexture()},this.copyTextureToTexture=function(b,N,X=null,B=null,H=0,fe=0){let Se,he,_e,Ee,ze,Ye,ye,Ke,_t;const ot=b.isCompressedTexture?b.mipmaps[fe]:b.image;if(X!==null)Se=X.max.x-X.min.x,he=X.max.y-X.min.y,_e=X.isBox3?X.max.z-X.min.z:1,Ee=X.min.x,ze=X.min.y,Ye=X.isBox3?X.min.z:0;else{const $e=Math.pow(2,-H);Se=Math.floor(ot.width*$e),he=Math.floor(ot.height*$e),b.isDataArrayTexture?_e=ot.depth:b.isData3DTexture?_e=Math.floor(ot.depth*$e):_e=1,Ee=0,ze=0,Ye=0}B!==null?(ye=B.x,Ke=B.y,_t=B.z):(ye=0,Ke=0,_t=0);const rt=re.convert(N.format),Bt=re.convert(N.type);let be;N.isData3DTexture?(Fe.setTexture3D(N,0),be=U.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(Fe.setTexture2DArray(N,0),be=U.TEXTURE_2D_ARRAY):(Fe.setTexture2D(N,0),be=U.TEXTURE_2D),pe.activeTexture(U.TEXTURE0),pe.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,N.flipY),pe.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),pe.pixelStorei(U.UNPACK_ALIGNMENT,N.unpackAlignment);const Wt=pe.getParameter(U.UNPACK_ROW_LENGTH),Je=pe.getParameter(U.UNPACK_IMAGE_HEIGHT),xi=pe.getParameter(U.UNPACK_SKIP_PIXELS),kt=pe.getParameter(U.UNPACK_SKIP_ROWS),qs=pe.getParameter(U.UNPACK_SKIP_IMAGES);pe.pixelStorei(U.UNPACK_ROW_LENGTH,ot.width),pe.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ot.height),pe.pixelStorei(U.UNPACK_SKIP_PIXELS,Ee),pe.pixelStorei(U.UNPACK_SKIP_ROWS,ze),pe.pixelStorei(U.UNPACK_SKIP_IMAGES,Ye);const si=b.isDataArrayTexture||b.isData3DTexture,Mi=N.isDataArrayTexture||N.isData3DTexture;if(b.isDepthTexture){const $e=Le.get(b),zt=Le.get(N),Mn=Le.get($e.__renderTarget),pt=Le.get(zt.__renderTarget);pe.bindFramebuffer(U.READ_FRAMEBUFFER,Mn.__webglFramebuffer),pe.bindFramebuffer(U.DRAW_FRAMEBUFFER,pt.__webglFramebuffer);for(let It=0;It<_e;It++)si&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Le.get(b).__webglTexture,H,Ye+It),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Le.get(N).__webglTexture,fe,_t+It)),U.blitFramebuffer(Ee,ze,Ee+Se,ze+he,ye,Ke,ye+Se,Ke+he,U.DEPTH_BUFFER_BIT,U.NEAREST);pe.bindFramebuffer(U.READ_FRAMEBUFFER,null),pe.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(H!==0||b.isRenderTargetTexture||Le.has(b)){const $e=Le.get(b),zt=Le.get(N);pe.bindFramebuffer(U.READ_FRAMEBUFFER,C),pe.bindFramebuffer(U.DRAW_FRAMEBUFFER,V);for(let Mn=0;Mn<_e;Mn++)si?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,$e.__webglTexture,H,Ye+Mn):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,$e.__webglTexture,H),Mi?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,zt.__webglTexture,fe,_t+Mn):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,zt.__webglTexture,fe),H!==0?U.blitFramebuffer(Ee,ze,Ee+Se,ze+he,ye,Ke,ye+Se,Ke+he,U.COLOR_BUFFER_BIT,U.NEAREST):Mi?U.copyTexSubImage3D(be,fe,ye,Ke,_t+Mn,Ee,ze,Se,he):U.copyTexSubImage2D(be,fe,ye,Ke,Ee,ze,Se,he);pe.bindFramebuffer(U.READ_FRAMEBUFFER,null),pe.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else Mi?b.isDataTexture||b.isData3DTexture?U.texSubImage3D(be,fe,ye,Ke,_t,Se,he,_e,rt,Bt,ot.data):N.isCompressedArrayTexture?U.compressedTexSubImage3D(be,fe,ye,Ke,_t,Se,he,_e,rt,ot.data):U.texSubImage3D(be,fe,ye,Ke,_t,Se,he,_e,rt,Bt,ot):b.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,fe,ye,Ke,Se,he,rt,Bt,ot.data):b.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,fe,ye,Ke,ot.width,ot.height,rt,ot.data):U.texSubImage2D(U.TEXTURE_2D,fe,ye,Ke,Se,he,rt,Bt,ot);pe.pixelStorei(U.UNPACK_ROW_LENGTH,Wt),pe.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Je),pe.pixelStorei(U.UNPACK_SKIP_PIXELS,xi),pe.pixelStorei(U.UNPACK_SKIP_ROWS,kt),pe.pixelStorei(U.UNPACK_SKIP_IMAGES,qs),fe===0&&N.generateMipmaps===!0&&N.mipmapsAutoUpdate===!0&&U.generateMipmap(be),pe.unbindTexture()},this.initRenderTarget=function(b){Le.get(b).__webglFramebuffer===void 0&&Fe.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?Fe.setTextureCube(b,0):b.isData3DTexture?Fe.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?Fe.setTexture2DArray(b,0):Fe.setTexture2D(b,0),pe.unbindTexture()},this.resetState=function(){q=0,W=0,D=null,pe.reset(),oe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Rn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Xe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Xe._getUnpackColorSpace()}}const ne=1.2192,Tt=2.6,wi=.118,vv=2.083,zh=.34,Et=12,je=22,Kn=0,Ft=1,dn=2,ji=3;class _v{seed;ovE=new Map;ovS=new Set;ep=new Map;ovDyn=new Set;ovDead=new Set;ov;constructor(e){this.ov=e,this.seed=e.seed|0,this.setOverrides(e)}setOverrides(e){this.ov=e,this.ovE.clear(),this.ovS.clear(),this.ep.clear(),this.ovDyn.clear(),this.ovDead.clear();for(const[t,n]of e.dyn||[])this.ovDyn.add(t+","+n);for(const[t,n]of e.dead||[])this.ovDead.add(t+","+n);for(const[t,n,i,s]of e.edges)this.ovE.set(t+","+n+","+i,s);for(const[t,n]of e.solid)this.ovS.add(t+","+n);for(const[t,n,i]of e.epochs)this.ep.set(t+","+n,i)}h(e,t,n){let i=Math.imul(e|0,374761393)^Math.imul(t|0,668265263)^Math.imul(n+this.seed|0,1274126177);return i=Math.imul(i^i>>>13,1274126177),i^=i>>>16,i=Math.imul(i,2246822519),i^=i>>>13,(i>>>0)/4294967296}he(e,t,n){const i=this.ep.size&&this.ep.get(Math.floor(e/Et)+","+Math.floor(t/Et))||0;return this.h(e,t,n+i*7919)}noise(e,t,n,i){const s=e/n,a=t/n,o=Math.floor(s),l=Math.floor(a);let c=s-o,h=a-l;c=c*c*(3-2*c),h=h*h*(3-2*h);const u=this.h(o,l,i),f=this.h(o+1,l,i),d=this.h(o,l+1,i),m=this.h(o+1,l+1,i);return u+(f-u)*c+(d-u)*h+(u-f-d+m)*c*h}busy(e,t){return this.noise(e,t,17,11)*.7+this.noise(e,t,7,12)*.3}feat(e,t){const n=this.he(e*je+3,t*je+3,40);if(n<.34){const i=5+Math.floor(this.he(e*je+3,t*je+3,41)*8),s=4+Math.floor(this.he(e*je+3,t*je+3,42)*7),a=e*je+2+Math.floor(this.he(e*je+3,t*je+3,43)*(je-i-3)),o=t*je+2+Math.floor(this.he(e*je+3,t*je+3,44)*(je-s-3));return{kind:1,x:a,z:o,w:i,d:s}}if(n<.62){const i=this.he(e*je+3,t*je+3,45)<.5?0:1,s=this.he(e*je+3,t*je+3,46)<.6?1:2,a=10+Math.floor(this.he(e*je+3,t*je+3,47)*9),o=i?s:a,l=i?a:s,c=e*je+1+Math.floor(this.he(e*je+3,t*je+3,48)*(je-o-2)),h=t*je+1+Math.floor(this.he(e*je+3,t*je+3,49)*(je-l-2));return{kind:2,x:c,z:h,w:o,d:l}}return null}fc=new Map;featAt(e,t){const n=Math.floor(e/je),i=Math.floor(t/je),s=n+","+i;let a=this.fc.get(s);return a===void 0&&(a=this.feat(n,i),this.fc.set(s,a),this.fc.size>400&&this.fc.clear()),a}edge(e,t,n){if(this.ovE.size){const o=this.ovE.get(e+","+t+","+n);if(o!==void 0)return o}for(const o of n===0?[this.featAt(e,t),this.featAt(e,t-1)]:[this.featAt(e,t),this.featAt(e-1,t)]){if(!o)continue;const l=o.x+o.w,c=o.z+o.d;if(n===0){if(e<o.x||e>=l||t<o.z||t>c)continue;return t>o.z&&t<c?Kn:this.boundary(o,e,t,0)}else{if(t<o.z||t>=c||e<o.x||e>l)continue;return e>o.x&&e<l?Kn:this.boundary(o,e,t,1)}}const i=this.busy(e,t),s=i<.36?.085:i<.66?.27:.43,a=i<.36?5:i<.66?4:3;for(let o=0;o<a;o++){const l=n===0?e-o:e,c=n===0?t:t-o;if(this.he(l,c,1)>=s||(this.he(l,c,2)<.5?0:1)!==n)continue;const h=1+Math.floor(this.he(l,c,3)*a);if(!(h<=o)){if(h>=3&&o===h>>1){const u=this.he(l,c,4);if(u<.3)return dn;if(u<.5)return Kn}return Ft}}return Kn}boundary(e,t,n,i){const s=this.he(t*3+i,n*3+1,50);return e.kind===1?s<.11?Kn:s<.24?dn:Ft:(e.w>e.d?i===1:i===0)?s<.75?Kn:dn:s<.09?Kn:s<.26?dn:Ft}solid(e,t){return this.ovS.size>0&&this.ovS.has(e+","+t)}column(e,t){const n=this.featAt(e,t);return n&&n.kind===1&&e>n.x&&e<n.x+n.w&&t>n.z&&t<n.z+n.d?n.w>=7&&n.d>=6&&(e-n.x)%3===0&&(t-n.z)%3===0:n&&e>=n.x&&e<=n.x+n.w&&t>=n.z&&t<=n.z+n.d?!1:this.busy(e,t)<.36&&(e%4+4)%4===0&&(t%4+4)%4===0&&this.he(e,t,60)<.8}fixture(e,t){if(this.solid(e,t))return null;const n=Math.floor(e/9),i=Math.floor(t/9),s=this.h(n,i,70)<.55?2:3,a=this.h(n,i,71)<.5?2:3,o=Math.floor(this.h(n,i,72)*s),l=Math.floor(this.h(n,i,73)*a);if((e%s+s)%s!==o||(t%a+a)%a!==l)return null;const c=this.h(n,i,74),h=c<.1?.62:c<.3?.22:.07,u=this.he(e,t,75);let f=u<h?1:u<h+.008?2:0;this.ovDyn.size&&this.ovDyn.has(e+","+t)?f=2:this.ovDead.size&&this.ovDead.has(e+","+t)&&(f=1);const d=(.74+.36*this.he(e,t,76))*(s*a>6?1.18:1),m=this.he(e,t,77),_=[1+.06*m,1,.77-.15*m];return{i:e,j:t,x:(e+.5)*ne,z:(t+.5)*ne,state:f,power:d,tint:_,voice:Math.floor(this.he(e,t,78)*6),id:e*73856093^t*19349663}}diffuser(e,t){return!this.fixture(e,t)&&this.h(e,t,80)<.012&&!this.solid(e,t)}sprinkler(e,t){return(e%3+3)%3===1&&(t%3+3)%3===1}region(e,t,n,i){const s=new Uint8Array((n+1)*(i+1)),a=new Uint8Array((n+1)*(i+1)),o=new Uint8Array((n+1)*(i+1)),l=new Uint8Array(n*i),c=[];for(let h=0;h<=i;h++)for(let u=0;u<=n;u++){const f=h*(n+1)+u;if(u<n&&(s[f]=this.edge(e+u,t+h,0)),h<i&&(a[f]=this.edge(e+u,t+h,1)),o[f]=this.column(e+u,t+h)?1:0,u<n&&h<i)if(this.solid(e+u,t+h))l[h*n+u]=1;else{const d=this.fixture(e+u,t+h);d&&c.push(d)}}for(let h=0;h<=i;h++)for(let u=0;u<=n;u++){const f=h*(n+1)+u;if(!o[f])continue;const d=u<n?s[f]:0,m=u>0?s[f-1]:0,_=h<i?a[f]:0,g=h>0?a[f-(n+1)]:0;(d>=dn||m>=dn||_>=dn||g>=dn)&&(o[f]=0)}return{i0:e,j0:t,w:n,h:i,ex:s,ez:a,col:o,fix:c,solid:l}}}const $n=(r,e,t)=>e<r.i0||t<r.j0||e>=r.i0+r.w||t>r.j0+r.h?0:r.ex[(t-r.j0)*(r.w+1)+(e-r.i0)],Jn=(r,e,t)=>e<r.i0||t<r.j0||e>r.i0+r.w||t>=r.j0+r.h?0:r.ez[(t-r.j0)*(r.w+1)+(e-r.i0)],Bh=(r,e,t)=>e<r.i0||t<r.j0||e>r.i0+r.w||t>r.j0+r.h?0:r.col[(t-r.j0)*(r.w+1)+(e-r.i0)];function $t(r,e,t,n,i,s,a,o=!1){let l=Math.floor(e/ne),c=Math.floor(n/ne);const h=Math.floor(i/ne),u=Math.floor(a/ne),f=i-e,d=a-n,m=s-t,_=f>0?1:-1,g=d>0?1:-1;let p=f!==0?((l+(_>0?1:0))*ne-e)/f:1/0,x=d!==0?((c+(g>0?1:0))*ne-n)/d:1/0;const y=f!==0?ne/Math.abs(f):1/0,M=d!==0?ne/Math.abs(d):1/0;let w=0,E=0;const v=(T,I)=>{for(let R=0;R<2;R++)for(let P=0;P<2;P++){if(!Bh(r,T+R,I+P))continue;const F=(T+R)*ne,G=(I+P)*ne,C=zh/2;let V=0,q=1;if(Math.abs(f)<1e-9){if(e<F-C||e>F+C)continue}else{let W=(F-C-e)/f,D=(F+C-e)/f;if(W>D){const O=W;W=D,D=O}V=Math.max(V,W),q=Math.min(q,D)}if(Math.abs(d)<1e-9){if(n<G-C||n>G+C)continue}else{let W=(G-C-n)/d,D=(G+C-n)/d;if(W>D){const O=W;W=D,D=O}V=Math.max(V,W),q=Math.min(q,D)}if(V<q&&q>.002&&V<.998)return!0}return!1};for(;E++<200;){if(v(l,c)){if(!o)return 1;w+=2}if(l===h&&c===u)break;let T,I;if(p<x?(I=p,T=Jn(r,_>0?l+1:l,c),l+=_,p+=y):(I=x,T=$n(r,l,g>0?c+1:c),c+=g,x+=M),I>1)break;if(T===Ft||T===ji||T===dn&&t+m*I>vv){if(!o)return 1;w++}}return w}const Fn=16;function xv(){return{uL:{value:Array.from({length:Fn},()=>new Ze(0,-100,0,0))},uLC:{value:Array.from({length:Fn},()=>new z(1,1,1))},uTime:{value:0},uSmooth:{value:null},uFog:{value:new Ze(.0043,.0036,.0018,0)},uFlat:{value:0},uSink:{value:new Ze(0,0,0,0)}}}const Ws=`
#define NL ${Fn}
#define PI 3.14159265
uniform sampler2D uLm, uLm2; uniform float uFlick; uniform vec4 uFlick2; uniform vec3 uFlickCol;
uniform vec4 uL[NL]; uniform vec3 uLC[NL]; uniform float uTime; uniform sampler2D uSmooth; uniform vec4 uFog; uniform float uFlat;
varying vec3 vP; varying vec3 vN; varying vec2 vLm;
/* for checking the lighting against a path tracer: every surface one flat colour, the one the light bake assumed */
#define FLAT(rho) if (uFlat > 0.5) { gl_FragColor = vec4(rho * irr() / PI, 1.0); return; }
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 hash22(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
vec3 sm(vec2 p){ return texture2D(uSmooth, p).rgb; }
vec3 irr(){ vec4 t = texture2D(uLm, vLm), t2 = texture2D(uLm2, vLm); return max(t.rgb, 0.0) + (max(t.a, 0.0) * uFlick + dot(max(t2, 0.0), uFlick2)) * uFlickCol; }
/* the fixtures near the camera. returns rgb = specular radiance, a = how much the bumped normal changes the diffuse */
vec4 nearLights(vec3 P, vec3 Ng, vec3 N, vec3 V, float rough, float f0, vec3 E){
  float dg = 0.0, dn = 0.0; vec3 sp = vec3(0.0); float nv = max(dot(N, V), 0.02);
  for (int i = 0; i < NL; i++) {
    vec3 Lv = uL[i].xyz - P; float d2 = max(dot(Lv, Lv), 0.06); float d = sqrt(d2); vec3 L = Lv / d;
    float ce = max(L.y, 0.0);
    float w = uL[i].w * ce * smoothstep(0.015, 0.16, ce) / d2 * (1.0 - smoothstep(6.0, 8.0, length(Lv.xz)));
    float a = max(dot(Ng, L), 0.0), b = max(dot(N, L), 0.0); dg += w * a; dn += w * b;
    /* ggx, with the lens treated as a sphere of its size: it widens the lobe so the highlight is a soft panel, not a point */
    float al = clamp(rough * rough + 0.28 / d, 0.02, 1.0), al0 = max(rough * rough, 0.02);
    vec3 Hh = normalize(L + V); float nh = max(dot(N, Hh), 0.0);
    float dd = nh * nh * (al * al - 1.0) + 1.0; float D = al * al / (PI * dd * dd) * (al0 * al0) / (al * al) * (al / al0);
    float k = al * 0.5; float G = 1.0 / ((b * (1.0 - k) + k) * (nv * (1.0 - k) + k) * 4.0);
    float F = f0 + (1.0 - f0) * pow(1.0 - max(dot(Hh, V), 0.0), 5.0);
    sp += uLC[i] * (w * 0.3025 * b * D * G * F);
  }
  /* how much of the direct light the lightmap says really arrives here: stands in for shadows */
  float lum = dot(E, vec3(0.3, 0.6, 0.1)); float expect = dg * 0.3025;
  float vis = clamp(lum / max(expect, 1e-4), 0.0, 1.0);
  float bump = clamp((dn + 0.6 * dg + 0.004) / (1.6 * dg + 0.004), 0.55, 1.6);
  return vec4(sp * vis, bump);
}
vec3 fogged(vec3 c){ float d = length(vP - cameraPosition); return mix(c, uFog.rgb, smoothstep(uFog.w * 0.72, uFog.w, d)); }
`,Mv=`
attribute vec2 lm; varying vec3 vP; varying vec3 vN; varying vec2 vLm;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vP = w.xyz; vN = normal; vLm = lm; gl_Position = projectionMatrix * viewMatrix * w; }
`,Sv=Ws+`
uniform sampler2D uA, uN, uO; uniform vec4 uSink;
void main(){
  FLAT(vec3(0.258, 0.203, 0.131))
  vec3 V = normalize(cameraPosition - vP); vec3 E = irr();
  vec2 uv = vP.xz / 0.3048;
  /* the floor stops applying (noclip0.ts): under your feet the pile swirls and runs like something poured, and darkens into nothing */
  float sinkK = 0.0;
  if (uSink.w > 0.0) { vec2 d = vP.xz - uSink.xy; float r = length(d); sinkK = uSink.w * (1.0 - smoothstep(0.05, uSink.z, r));
    float a = sinkK * (3.2 + 2.0 * sin(uTime * 2.3 + r * 9.0)); float ca = cos(a), sa = sin(a); vec2 dr = vec2(ca * d.x - sa * d.y, sa * d.x + ca * d.y) * (1.0 - 0.45 * sinkK);
    uv = (uSink.xy + dr) / 0.3048 + vec2(sin(r * 31.0 - uTime * 9.0), cos(r * 27.0 - uTime * 7.0)) * 0.05 * sinkK; }
  /* two copies of the tile, one shifted, mixed by a slow noise sharpened by the pile height: no repeat to find */
  vec2 uv2 = uv * 0.97 + vec2(0.37, 0.61);
  vec3 o1 = texture2D(uO, uv).rgb, o2 = texture2D(uO, uv2).rgb;
  float m = sm(vP.xz * 0.11).r; m = smoothstep(0.35, 0.65, m + (o2.b - o1.b) * 0.25);
  vec3 alb = mix(texture2D(uA, uv).rgb, texture2D(uA, uv2).rgb, m) * 0.86; vec3 orh = mix(o1, o2, m);
  vec3 nt = mix(texture2D(uN, uv).rgb, texture2D(uN, uv2).rgb, m) * 2.0 - 1.0;
  /* thirty years of feet: soiled lanes, clean edges, the odd stain, and patches that never dried */
  vec3 s1 = sm(vP.xz * 0.021), s2 = sm(vP.xz * 0.083 + 0.3), s3 = sm(vP.xz * 0.37);
  float soil = s1.b * 0.6 + s2.g * 0.4; alb *= mix(1.10, 0.74, smoothstep(0.25, 0.8, soil)); alb = mix(alb, vec3(dot(alb, vec3(0.33))) * vec3(1.0, 0.93, 0.80), 0.18 * soil);
  float damp = smoothstep(0.60, 0.70, s1.r * 0.72 + s2.b * 0.28 + (orh.b - 0.5) * 0.05);
  float rim = smoothstep(0.55, 0.61, s1.r * 0.72 + s2.b * 0.28) * (1.0 - damp);
  alb *= mix(1.0, 0.56, damp) * (1.0 - 0.16 * rim);
  float spot = smoothstep(0.80, 0.86, s3.g * 0.7 + s2.r * 0.3); alb *= 1.0 - 0.38 * spot;
  float rough = mix(orh.g, 0.50, damp * 0.8);
  vec3 N = normalize(vec3(nt.x, nt.z * mix(1.0, 2.2, damp), nt.y));
  vec4 nl = nearLights(vP, vec3(0.0, 1.0, 0.0), N, V, rough, mix(0.035, 0.05, damp), E);
  float ao = mix(1.0, orh.r, 0.85);
  vec3 c = alb * E * (ao * nl.a / PI);
  /* pile catches light at a glancing angle: the far carpet always looks paler than the carpet at your feet */
  float nv = max(dot(vec3(0.0, 1.0, 0.0), V), 0.0); c += alb * E * (0.14 / PI) * pow(1.0 - nv, 3.0) * (1.0 - 0.7 * damp);
  c += nl.rgb * mix(0.25, 1.0, damp) * ao;
  c *= 1.0 - 0.92 * sinkK * sinkK;
  gl_FragColor = vec4(fogged(c), 1.0);
}`,yv=Ws+`
uniform sampler2D uA, uN, uO;
void main(){
  FLAT(vec3(0.62, 0.50, 0.215))
  vec3 Ng = normalize(vN); vec3 V = normalize(cameraPosition - vP); vec3 E = irr();
  if (abs(Ng.y) > 0.5) {      /* the underside of a header: painted board, no paper */
    vec3 a = vec3(0.60, 0.53, 0.35) * (0.9 + 0.2 * sm(vP.xz * 0.9).g);
    gl_FragColor = vec4(fogged(a * E / PI), 1.0); return;
  }
  vec3 Tn = vec3(-Ng.z, 0.0, Ng.x); float along = dot(vP, Tn) + dot(vP, Ng) * 3.7;
  /* hung in drops 20.5 in wide. each drop is a few mm out of register with the next, and the butt joint shows */
  float drop = along / 0.5207; float di = floor(drop), df = fract(drop);
  float reg = (hash12(vec2(di, Ng.x * 7.0 + Ng.z * 13.0)) - 0.5) * 0.022;
  vec2 uv = vec2(along, vP.y + reg) / 0.6096;
  vec3 alb = texture2D(uA, uv).rgb, orh = texture2D(uO, uv).rgb; vec3 nt = texture2D(uN, uv).rgb * 2.0 - 1.0;
  /* thirty years of light have taken most of the difference between the three inks */
  alb = mix(textureLod(uA, uv, 7.0).rgb, alb, 0.62); nt.xy *= 0.55;
  float seamD = min(df, 1.0 - df) * 0.5207;
  float seam = 1.0 - smoothstep(0.0006, 0.0022, seamD);
  float lift = step(0.93, hash12(vec2(di, 4.0))) * smoothstep(0.012, 0.0, seamD) * smoothstep(0.3, 0.9, sm(vec2(di * 0.37, vP.y * 0.4)).r);
  alb *= 1.0 - 0.30 * seam; nt.x += (df < 0.5 ? 1.0 : -1.0) * (seam * 0.25 + lift * 0.5);
  /* age. the paper has yellowed unevenly, browner toward the ceiling where warm air sat, grubby near the floor */
  vec3 s1 = sm(vec2(along, vP.y) * 0.045 + Ng.xz * 0.37), s2 = sm(vec2(along, vP.y) * 0.21 + 0.5);
  float yel = s1.r * 0.7 + s2.g * 0.3; alb *= mix(vec3(1.06, 1.05, 1.02), vec3(0.90, 0.83, 0.62), smoothstep(0.3, 0.85, yel) * 0.75);
  alb *= mix(1.0, 0.86, smoothstep(1.9, 2.6, vP.y) * (0.5 + 0.5 * s2.b));
  alb *= mix(0.80, 1.0, smoothstep(0.08, 0.5, vP.y + (s2.r - 0.5) * 0.2));
  /* water. where the ceiling leaked the paper has a tide mark and brown runs under it */
  float leak = smoothstep(0.74, 0.80, sm(vec2(along * 0.031, Ng.x * 3.1 + Ng.z * 1.7 + floor(vP.z * 0.02) * 0.1)).b);
  float run = smoothstep(0.52, 0.7, sm(vec2(along * 1.9, vP.y * 0.07)).g) * smoothstep(0.9, 2.6, vP.y + (s2.g - 0.5) * 0.8);
  float wet = leak * run; alb *= mix(vec3(1.0), vec3(0.66, 0.55, 0.36), wet * 0.85);
  /* scuffs at trolley height */
  float scuff = smoothstep(0.83, 0.9, sm(vec2(along * 0.5, vP.y * 6.0 + 0.2)).r) * smoothstep(0.25, 0.1, abs(vP.y - 0.82)); alb *= 1.0 - 0.25 * scuff;
  vec3 N = normalize(Tn * nt.x + vec3(0.0, 1.0, 0.0) * nt.y + Ng * nt.z);
  float rough = clamp(orh.g + 0.08 * wet + 0.1 * scuff, 0.2, 1.0);
  vec4 nl = nearLights(vP, Ng, N, V, rough, 0.04, E);
  vec3 c = alb * E * (mix(1.0, orh.r, 0.7) * nl.a / PI) + nl.rgb;
  gl_FragColor = vec4(fogged(c), 1.0);
}`,bv=Ws+`
uniform sampler2D uA, uN, uO;
void main(){
  FLAT(vec3(0.68, 0.63, 0.50))
  vec3 E = irr();
  vec2 g = (vP.xz - 0.3048) / 0.6096; vec2 cell = floor(g), f = fract(g);
  vec2 h = hash22(cell + 0.5);
  /* four different tiles, some turned end for end */
  float v = floor(h.x * 4.0); vec2 q = vec2(mod(v, 2.0), floor(v / 2.0));
  if (h.y > 0.5) f = 1.0 - f;
  vec2 uv = (q + 0.012 + f * 0.976) * 0.5;
  vec3 alb = texture2D(uA, uv).rgb, orh = texture2D(uO, uv).rgb;
  /* replaced at different times: most have gone cream, a few are newer and whiter */
  float h2 = hash12(cell * 1.7 + 3.1);
  alb *= 0.965 + 0.07 * h2; alb *= h2 > 0.93 ? vec3(1.05, 1.06, 1.10) : h2 < 0.12 ? vec3(0.94, 0.90, 0.78) : vec3(1.0);
  /* a leak above: a brown ring with a paler middle */
  float h3 = hash12(cell * 0.73 + 9.2);
  if (h3 < 0.045) { vec2 c = 0.25 + 0.5 * hash22(cell + 7.7); float r = 0.16 + 0.22 * hash12(cell + 2.2);
    float d = length(f - c) + (sm(f * 0.9 + h).r - 0.5) * 0.16; float ring = smoothstep(r, r - 0.03, d) * smoothstep(r - 0.12, r - 0.02, d); float fill = smoothstep(r, r - 0.05, d);
    alb *= mix(vec3(1.0), vec3(0.58, 0.44, 0.24), ring * 0.8 + fill * 0.28); }
  /* dust drawn in along the grid by the air handling */
  float edge = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y)); alb *= 0.90 + 0.10 * smoothstep(0.02, 0.10, edge);
  vec3 c = alb * E * (mix(1.0, orh.r, 0.9) / PI);
  gl_FragColor = vec4(fogged(c), 1.0);
}`,Tv=Ws+`
void main(){
  FLAT(vec3(0.68, 0.63, 0.50))
  vec3 E = irr();
  vec3 a = vec3(0.80, 0.795, 0.76) * (0.92 + 0.12 * hash12(floor(vP.xz / 0.6096))) * (0.9 + 0.2 * sm(vP.xz * 0.6).r);
  gl_FragColor = vec4(fogged(a * E / PI), 1.0);
}`,Ev=Ws+`
void main(){
  FLAT(vec3(0.62, 0.50, 0.215))
  vec3 Ng = normalize(vN); vec3 V = normalize(cameraPosition - vP); vec3 E = irr();
  vec3 a = vec3(0.40, 0.325, 0.185) * (0.85 + 0.3 * sm(vP.xz * 0.8 + vP.y).g);
  a *= 0.8 + 0.2 * smoothstep(0.0, 0.03, vP.y);         /* fluff and dirt where it meets the carpet */
  vec4 nl = nearLights(vP, Ng, Ng, V, 0.42, 0.045, E);
  gl_FragColor = vec4(fogged(a * E / PI + nl.rgb * 0.6), 1.0);
}`,wv=`
attribute vec4 aFix;      /* state, power, flicker phase, - */
attribute vec3 aTint; attribute vec3 aAmb;
varying vec2 vUv; varying vec4 vFix; varying vec3 vTint; varying vec3 vAmb; varying vec3 vP;
void main(){ vUv = uv; vFix = aFix; vTint = aTint; vAmb = aAmb; vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0); vP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,Av=`
uniform float uTime; uniform float uFlickVal; uniform vec4 uFlick2; uniform vec4 uFog;
varying vec2 vUv; varying vec4 vFix; varying vec3 vTint; varying vec3 vAmb; varying vec3 vP;
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
void main(){
  vec3 V = normalize(cameraPosition - vP);
  /* two U-bent tubes behind a prismatic acrylic lens: four soft bright bands, darker toward the frame */
  float bands = 0.0; for (int i = 0; i < 4; i++) { float c = 0.2 + 0.2 * float(i); bands += exp(-pow((vUv.x - c) / 0.07, 2.0)); }
  float ends = smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.88, vUv.y) * 0.25 + 0.75;
  float edge = smoothstep(0.0, 0.03, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));
  /* each little prism throws its light a slightly different way: the lens glitters as you move under it */
  vec2 pc = floor(vUv * 114.0); float pr = hash12(pc + floor(V.xz * 9.0 + pc * 0.37));
  float pat = (0.80 + 0.26 * bands) * ends * (0.55 + 0.45 * edge) * (0.90 + 0.2 * pr);
  /* lambertian-ish, a little brighter straight on */
  float nv = max(V.y * -1.0, 0.0); pat *= 0.82 + 0.18 * nv;
  /* a separately-lit fixture reads its own slot (vFix.z): the same number its light on the walls and its hum read */
  float fv = vFix.z < 0.5 ? uFlickVal : vFix.z < 1.5 ? uFlick2.x : vFix.z < 2.5 ? uFlick2.y : vFix.z < 3.5 ? uFlick2.z : uFlick2.w;
  float on = vFix.x < 0.5 ? 1.0 : vFix.x < 1.5 ? 0.0 : fv;
  vec3 lit = vTint * vFix.y * pat * on;
  /* a dead one is a grey panel showing the room back at itself, and the tubes' ends have blackened */
  vec3 dead = vec3(0.60, 0.58, 0.50) * vAmb / 3.14159 * (0.62 + 0.08 * bands) * (0.6 + 0.4 * edge) + vec3(0.00030, 0.00026, 0.00014);
  vec3 c = lit + dead * (1.0 - on * 0.9);
  float d = length(vP - cameraPosition); c = mix(c, uFog.rgb + lit * 0.5, smoothstep(uFog.w * 0.72, uFog.w, d));
  gl_FragColor = vec4(c, 1.0);
}`,Rv=`
#ifdef USE_INSTANCING
attribute vec3 aAmb; attribute vec4 aFix; attribute vec3 aTint;
#endif
uniform vec3 uAmb;
varying vec3 vP; varying vec3 vN; varying vec3 vAmb; varying float vAo; varying vec3 vGlow;
void main(){
  mat4 m = modelMatrix;
  #ifdef USE_INSTANCING
  m = m * instanceMatrix; vAmb = aAmb;
  /* the frame of a lit fixture catches its own lens */
  float on = aFix.x < 0.5 ? 1.0 : 0.0; vGlow = aTint * aFix.y * on * smoothstep(-0.003, 0.008, position.y) * 0.05;
  #else
  vAmb = uAmb; vGlow = vec3(0.0);
  #endif
  vec4 w = m * vec4(position, 1.0); vP = w.xyz; vN = normalize(mat3(m) * normal);
  #ifdef USE_COLOR
  vAo = color.r;
  #else
  vAo = 1.0;
  #endif
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Cv=`
#define NL ${Fn}
#define PI 3.14159265
uniform vec3 uCol; uniform float uRough; uniform float uF0; uniform float uMetal; uniform vec4 uL[NL]; uniform vec3 uLC[NL]; uniform vec4 uFog;
varying vec3 vP; varying vec3 vN; varying vec3 vAmb; varying float vAo; varying vec3 vGlow;
void main(){
  vec3 N = normalize(vN), V = normalize(cameraPosition - vP); float nv = max(dot(N, V), 0.02);
  vec3 dif = vec3(0.0), sp = vec3(0.0);
  for (int i = 0; i < NL; i++) {
    vec3 Lv = uL[i].xyz - vP; float d2 = max(dot(Lv, Lv), 0.06); float d = sqrt(d2); vec3 L = Lv / d; float ce = max(L.y, 0.0);
    float w = uL[i].w * ce * smoothstep(0.015, 0.16, ce) / d2 * 0.3025 * (1.0 - smoothstep(6.0, 8.0, length(Lv.xz)));
    float b = max(dot(N, L), 0.0); dif += uLC[i] * w * b;
    float al = clamp(uRough * uRough + 0.28 / d, 0.02, 1.0); vec3 Hh = normalize(L + V); float nh = max(dot(N, Hh), 0.0);
    float dd = nh * nh * (al * al - 1.0) + 1.0; float D = al * al / (PI * dd * dd) * max(uRough * uRough, 0.02) / al; float k = al * 0.5;
    float G = 1.0 / ((b * (1.0 - k) + k) * (nv * (1.0 - k) + k) * 4.0); float F = uF0 + (1.0 - uF0) * pow(1.0 - max(dot(Hh, V), 0.0), 5.0);
    sp += uLC[i] * (w * b * D * G * F);
  }
  /* the baked ambient is the truth about how bright it is here; the live lights only give it a direction */
  float lum = dot(vAmb, vec3(0.3, 0.6, 0.1)), dl = dot(dif, vec3(0.3, 0.6, 0.1));
  vec3 E = vAmb * (0.55 + 0.45 * clamp(dl / max(lum, 1e-4), 0.0, 1.6));
  float vis = clamp(lum / max(dl, 1e-4), 0.0, 1.0);
  vec3 c = uCol * (1.0 - uMetal) * E * vAo / PI + sp * vis * mix(vec3(1.0), uCol, uMetal) * vAo + vGlow + uCol * uMetal * vAmb * 0.25 * vAo / PI;
  float d = length(vP - cameraPosition); c = mix(c, uFog.rgb, smoothstep(uFog.w * 0.72, uFog.w, d));
  gl_FragColor = vec4(c, 1.0);
}`,Ac={paint_white:{col:[.8,.79,.74],rough:.5,f0:.04,metal:0},steel:{col:[.62,.62,.63],rough:.32,f0:.6,metal:1},door_paint:{col:[.5,.46,.36],rough:.45,f0:.045,metal:0},plastic_ivory:{col:[.74,.69,.55],rough:.35,f0:.045,metal:0},dark:{col:[.02,.02,.02],rough:.6,f0:.03,metal:0},brass:{col:[.72,.55,.25],rough:.4,f0:.7,metal:1},fridge_white:{col:[.8,.79,.73],rough:.28,f0:.05,metal:0},figure:{col:[.011,.011,.012],rough:.92,f0:.02,metal:0},rubber:{col:[.04,.04,.04],rough:.8,f0:.03,metal:0}};class Pv{constructor(e){this.shared=e}shared;tex={};base(e,t,n=Mv){const i=this.shared;return new Vt({vertexShader:n,fragmentShader:t,uniforms:{uLm:{value:null},uLm2:{value:null},uFlick:{value:1},uFlick2:{value:new Ze(1,1,1,1)},uFlickCol:{value:new z(1.03,1,.7)},uL:i.uL,uLC:i.uLC,uTime:i.uTime,uSmooth:i.uSmooth,uFog:i.uFog,uFlat:i.uFlat,uSink:i.uSink,...e}})}maps(e){return{uA:{value:this.tex[e+"_a"]},uN:{value:this.tex[e+"_n"]},uO:{value:this.tex[e+"_o"]}}}protos;lens;props=new Map;propsInst=new Map;build(){this.protos={floor:this.base(this.maps("carpet"),Sv),ceil:this.base(this.maps("tile"),bv),wall:this.base(this.maps("wall"),yv),base:this.base({},Ev),trim:this.base({},Tv)},this.protos.ceil.side=ei,this.lens=new Vt({side:pn,vertexShader:wv,fragmentShader:Av,uniforms:{uTime:this.shared.uTime,uFlickVal:{value:1},uFlick2:{value:new Ze(1,1,1,1)},uFog:this.shared.uFog}})}forChunk(e,t){const n={};for(const[i,s]of Object.entries(this.protos)){const a=s.clone();a.uniforms.uLm.value=e,a.uniforms.uLm2.value=t;const o=this.shared;a.uniforms.uL=o.uL,a.uniforms.uLC=o.uLC,a.uniforms.uTime=o.uTime,a.uniforms.uSmooth=o.uSmooth,a.uniforms.uFog=o.uFog,a.uniforms.uFlat=o.uFlat,a.uniforms.uSink=o.uSink;for(const l of["uA","uN","uO"])s.uniforms[l]&&(a.uniforms[l]=s.uniforms[l]);n[i]=a}return n}prop(e,t,n=!0){const i=t?this.propsInst:this.props;let s=i.get(e+n);if(!s){const a=Ac[e]||Ac.paint_white,o=this.shared;s=new Vt({vertexShader:Rv,fragmentShader:Cv,vertexColors:n,uniforms:{uCol:{value:new z(...a.col)},uRough:{value:a.rough},uF0:{value:a.f0},uMetal:{value:a.metal},uAmb:{value:new z(.1,.1,.08)},uL:o.uL,uLC:o.uLC,uFog:o.uFog}}),i.set(e+n,s)}return s}dispose(){for(const e of Object.values(this.protos))e.dispose();this.lens.dispose();for(const e of this.props.values())e.dispose();for(const e of this.propsInst.values())e.dispose();for(const e of Object.values(this.tex))e.dispose()}}const Lv="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",Iv=`
varying vec2 vUv; uniform sampler2D uScene, uPrev; uniform float uDt, uInit, uLod, uTarget;
void main(){
  float s = 0.0, ws = 0.0; vec3 cs = vec3(0.0);
  for (int y = 0; y < 5; y++) for (int x = 0; x < 6; x++) {
    vec2 p = (vec2(float(x), float(y)) + 0.5) / vec2(6.0, 5.0); vec3 c = textureLod(uScene, p, uLod).rgb;
    float l = dot(c, vec3(0.299, 0.587, 0.114)); float w = 1.0 - 0.6 * length(p - vec2(0.5, 0.45));
    /* centre-weighted average, part linear part log: a lamp in shot pulls the exposure down, but not all the way */
    s += w * (0.5 * log(l + 1e-4) + 0.5 * log(min(l, 0.25) + 1e-4)); ws += w; cs += w * min(c, vec3(0.25)); }
  float L = exp(s / ws);
  float want = clamp(uTarget / L, 3.0, 280.0);
  float prev = texture2D(uPrev, vec2(0.5)).r;
  float rate = want < prev ? 2.6 : 1.3;                       /* closes faster than it opens */
  float e = mix(prev, want, 1.0 - exp(-uDt * rate)); if (uInit > 0.5 || prev <= 0.0) e = want;
  /* auto white balance: how warm the picture is (log red over blue), followed slowly, over several seconds, and held when it's
     too dark to judge. the lens pass uses as much of it as the level asks (level 0: none, its yellow is the point) */
  float tw = clamp(log(max(cs.r, 1e-6) / max(cs.b, 1e-6)), -0.5, 0.9), tp = texture2D(uPrev, vec2(0.5)).a;
  float t = mix(tp, tw, (1.0 - exp(-uDt * 0.32)) * (1.0 - smoothstep(110.0, 250.0, e))); if (uInit > 0.5 || prev <= 0.0) t = tw;
  /* past about 60x the iris is wide open and the rest is gain */
  gl_FragColor = vec4(e, clamp(log2(max(e / 60.0, 1.0)) / 3.0, 0.0, 1.0), L, t);
}`,Dv=`
varying vec2 vUv; uniform sampler2D uScene, uExp;
void main(){ float e = texture2D(uExp, vec2(0.5)).r; vec3 c = vec3(0.0);
  for (int i = 0; i < 4; i++) { vec2 o = (vec2(float(i - (i / 2) * 2), float(i / 2)) - 0.5) / vec2(480.0, 360.0); c += textureLod(uScene, vUv + o, 1.0).rgb; }
  c = max(c * 0.25 * e - 0.92, 0.0); gl_FragColor = vec4(min(c, vec3(24.0)), 1.0); }`,Nv=`
varying vec2 vUv; uniform sampler2D uTex; uniform vec2 uDir;
void main(){ vec3 c = texture2D(uTex, vUv).rgb * 0.227;
  c += (texture2D(uTex, vUv + uDir * 1.385).rgb + texture2D(uTex, vUv - uDir * 1.385).rgb) * 0.316;
  c += (texture2D(uTex, vUv + uDir * 3.231).rgb + texture2D(uTex, vUv - uDir * 3.231).rgb) * 0.070; gl_FragColor = vec4(c, 1.0); }`,Uv=`
varying vec2 vUv; uniform sampler2D uTex;
void main(){ vec3 c = vec3(0.0); for (int i = 0; i < 30; i++) c += texture2D(uTex, vec2(vUv.x, (float(i) + 0.5) / 30.0)).rgb; gl_FragColor = vec4(c / 30.0, 1.0); }`,Fv=`
varying vec2 vUv; uniform sampler2D uScene, uExp, uBloom, uSmear;
uniform float uFocus, uSkew, uZoom; uniform vec2 uMove; uniform vec3 uWB; uniform float uAspect, uAwb;
vec2 distort(vec2 uv, float k){ vec2 d = uv - 0.5; d.x *= uAspect; float r2 = dot(d, d); d *= (1.0 + k * r2) / (1.0 + k * 0.39); d.x /= uAspect; return d + 0.5; }
void main(){
  float e = texture2D(uExp, vec2(0.5)).r;
  vec2 uv = vUv; uv.x += (uv.y - 0.5) * uSkew;
  vec2 d = uv - 0.5; d.x *= uAspect; float r2 = dot(d, d);
  float kb = mix(0.105, 0.02, uZoom);                             /* widest at the wide end, like every zoom of the era */
  /* soft everywhere, softer in the corners, softer still while it hunts */
  float rad = (0.30 + 1.1 * r2 + 3.2 * uFocus) / 720.0;
  vec3 c = vec3(0.0);
  for (int i = 0; i < 6; i++) {
    float t = (float(i) + 0.5) / 6.0 - 0.5; float a = float(i) * 2.399 + 0.7; vec2 o = uMove * t + vec2(cos(a), sin(a) * 1.333) * rad * sqrt((float(i) + 0.5) / 6.0);
    /* red and blue come to a focus a little outside and inside green */
    c.r += texture2D(uScene, distort(uv + o, kb * 1.018) + (uv - 0.5) * 0.0016).r;
    c.g += texture2D(uScene, distort(uv + o, kb)).g;
    c.b += texture2D(uScene, distort(uv + o, kb * 0.982) - (uv - 0.5) * 0.0016).b;
  }
  c /= 6.0;
  vec2 uvd = distort(uv, kb);
  c = c * e + texture2D(uBloom, uvd).rgb * 0.085 + texture2D(uSmear, vec2(uvd.x, 0.5)).rgb * vec3(0.016, 0.017, 0.020);
  c *= 1.0 - 0.42 * r2 * (1.0 + 0.6 * r2);                        /* the corners get less light */
  float awb = texture2D(uExp, vec2(0.5)).a * uAwb; c *= uWB * vec3(exp(-0.5 * awb), 1.0, exp(0.5 * awb));
  /* the sensor and the video amp: a knee above 80%, a hard clip, then gamma */
  c = mix(c, 0.8 + (c - 0.8) * 0.28, step(0.8, c)); c = clamp(c, 0.0, 1.0);
  float l = dot(c, vec3(0.299, 0.587, 0.114)); c = mix(vec3(l), c, 1.04);
  c = pow(c, vec3(0.47));
  gl_FragColor = vec4(c, 1.0);
}`,Ov=`
varying vec2 vUv; uniform sampler2D uSig, uPrev, uNoise, uExp;
uniform float uField, uFrame, uGlitch, uTrack; uniform vec2 uRes;
uniform vec4 uFxA;   /* signal gone to black, signal gone to snow, colour gain, colour phase */
uniform vec4 uFxB;   /* vertical slip (fraction of a frame), flagging at the top, colour bleed, video level */
uniform vec4 uBand;  /* a crease in the tape: where it is (0 bottom .. 1 top), how tall, how bad */
uniform vec4 uTear;  /* a strip that has slipped sideways: bottom, height, pixels */
uniform float uDrop; /* extra dropouts */
vec3 yiq(vec3 c){ return vec3(dot(c, vec3(0.299, 0.587, 0.114)), dot(c, vec3(0.596, -0.274, -0.322)), dot(c, vec3(0.211, -0.523, 0.312))); }
vec3 rgb(vec3 c){ return vec3(c.x + 0.956 * c.y + 0.621 * c.z, c.x - 0.272 * c.y - 0.647 * c.z, c.x - 1.106 * c.y + 1.703 * c.z); }
float h1(float n){ return fract(sin(n * 12.9898) * 43758.5453); }
vec4 nz(vec2 p){ return texture2D(uNoise, p); }
void main(){
  float row = floor(vUv.y * uRes.y); float line = row;
  vec3 prev = texture2D(uPrev, vUv).rgb;
  /* this field only writes its own lines */
  if (mod(row + uField, 2.0) > 0.5) { gl_FragColor = vec4(mix(prev, vec3(0.03), uFxA.x), 1.0); return; }      /* the deck mutes both fields when the signal goes */
  float gain = texture2D(uExp, vec2(0.5)).g;
  float px = 1.0 / uRes.x; float fr = uFrame;
  /* timebase: every line starts a little early or late. worse near the head switch at the bottom, and during a tracking slip */
  float jit = (h1(line * 0.731 + fr * 1.37) - 0.5) * 0.55 + sin(line * 0.021 + fr * 0.17) * 0.25;
  float fromBottom = vUv.y * uRes.y;                               /* rows up from the bottom edge */
  float hs = smoothstep(9.0, 3.0, fromBottom);
  jit += hs * (14.0 + 18.0 * h1(fr * 0.37 + line)) ;
  float band = smoothstep(0.06, 0.0, abs(vUv.y - uTrack)) * uGlitch;
  jit += band * (h1(line * 3.1 + fr) - 0.3) * 46.0;
  /* things going wrong with the tape (src/events.ts decides when). each is a real fault:
     flagging: tape tension is off, so the top of the picture leans over. a tear: a strip of lines lands late.
     a crease: a fold in the tape passes the heads, and for those lines there's almost no signal.
     vertical slip: the deck loses vertical sync and the picture drops with the blanking bar across it. */
  float fy = vUv.y;
  jit += pow(smoothstep(0.76, 1.0, fy), 1.4) * uFxB.y * (64.0 + 14.0 * sin(fr * 0.9 + line * 0.07));
  jit += step(uTear.x, fy) * step(fy, uTear.x + uTear.y) * uTear.z * (0.8 + 0.4 * h1(line * 0.37 + floor(fr * 0.5)));
  float cb = uBand.z * smoothstep(uBand.y, 0.0, abs(fy - uBand.x));
  jit += cb * (sin(line * 0.9 + fr * 2.1) * 26.0 + (h1(line * 7.7 + fr) - 0.5) * 60.0);
  float vy = fy + uFxB.x; float blank = clamp(step(1.0, vy) + step(vy, 0.0) + smoothstep(0.012, 0.0, abs(fract(vy + 0.5) - 0.5)) * step(0.0005, abs(uFxB.x)), 0.0, 1.0); vy = fract(vy);
  vec2 uv = vec2(vUv.x + jit * px, vy);
  /* luma: detail above about 3 MHz is gone, and the edge enhancer rings */
  float y0 = yiq(texture2D(uSig, uv).rgb).x;
  float y1 = yiq(texture2D(uSig, uv + vec2(px * 1.0, 0.0)).rgb).x + yiq(texture2D(uSig, uv - vec2(px * 1.0, 0.0)).rgb).x;
  float y2 = yiq(texture2D(uSig, uv + vec2(px * 2.3, 0.0)).rgb).x + yiq(texture2D(uSig, uv - vec2(px * 2.3, 0.0)).rgb).x;
  float Y = y0 * 0.40 + y1 * 0.24 + y2 * 0.06; Y += (Y - (y0 * 0.2 + y1 * 0.2 + y2 * 0.2)) * 0.55;
  /* chroma: a tenth of the bandwidth, late, and averaged with the line before */
  vec2 C = vec2(0.0); float ws = 0.0;
  for (int i = -4; i <= 4; i++) { float w = 1.0 - abs(float(i)) / 5.0; float cx = (float(i) * 2.6 * (1.0 + 2.5 * uFxB.z) - 2.2 - 7.0 * uFxB.z) * px; vec3 q = yiq(texture2D(uSig, uv + vec2(cx, 0.0)).rgb); vec3 q2 = yiq(texture2D(uSig, uv + vec2(cx, 2.0 / uRes.y)).rgb); C += w * (q.yz * 0.62 + q2.yz * 0.38); ws += w; }
  C /= ws; C *= uFxA.z * (1.0 - 0.85 * cb); { float cs = cos(uFxA.w), sn = sin(uFxA.w); C = vec2(C.x * cs - C.y * sn, C.x * sn + C.y * cs); }
  Y *= uFxB.w;
  /* noise. luma: fine, a little streaky along the line. chroma: big soft blotches that crawl */
  vec2 np = vec2(vUv.x * 2.9 + h1(fr) * 7.0, line / 256.0 + h1(fr + 3.0) * 5.0);
  float ny = (nz(np).r + nz(np * vec2(0.5, 1.0) + 0.31).g - 1.0);
  Y += ny * (0.020 + 0.060 * gain) * (0.6 + 0.8 * (1.0 - Y));
  vec2 cp = vec2(vUv.x * 0.21 + h1(fr * 1.7) * 3.0, line / 256.0 * 0.5 + h1(fr * 0.9) * 9.0);
  C += (nz(cp).ba - 0.5) * (0.030 + 0.075 * gain);
  /* a dropout: oxide missing from the tape. the deck fills it from the line above, not quite well enough */
  float dl = h1(line * 1.913 + floor(fr * 0.5) * 7.77);
  if (dl > 0.99996 - 0.03 * band - uDrop - 0.3 * cb) { float x0 = h1(dl * 91.7), len = 0.04 + 0.2 * h1(dl * 13.1); float k = smoothstep(x0, x0 + 0.004, vUv.x) * smoothstep(x0 + len, x0 + len * 0.7, vUv.x); Y = mix(Y, 0.92, k * 0.75); C *= 1.0 - k; }
  /* the head switch: the last lines are noise from the other head */
  Y = mix(Y, nz(vec2(vUv.x * 0.7 + fr * 0.13, line * 0.37)).r * 0.75 + 0.1, hs * 0.55);
  Y = mix(Y, nz(vec2(vUv.x * 1.3 + fr * 0.31, line * 0.11)).g, band * 0.5); C *= 1.0 - 0.7 * band;
  /* no signal: snow where the heads read nothing, black where the deck mutes the picture */
  float sn = clamp(uFxA.y + 0.8 * cb, 0.0, 1.0); float snow = nz(vec2(vUv.x * 1.7 + h1(fr * 1.3) * 9.0, line * 0.43 + h1(fr) * 3.0)).r; snow = snow * snow * 1.2;
  Y = mix(Y, snow, sn); C *= 1.0 - sn;
  float bk = clamp(uFxA.x + blank, 0.0, 1.0); Y = mix(Y, 0.03 + 0.03 * nz(vec2(vUv.x * 3.1 + fr * 0.7, line * 0.21)).g, bk); C *= 1.0 - bk;
  vec3 c = clamp(rgb(vec3(Y, C)), 0.0, 1.0);
  /* the tube-era trick still in these decks: a little of the last frame's same line is left in */
  c = mix(c, prev, 0.14);
  gl_FragColor = vec4(c, 1.0);
}`,zv=`
varying vec2 vUv; uniform sampler2D uTex; uniform vec2 uRes; uniform vec4 uRect; uniform float uFrame;
float h1(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec2 uv = (vUv - uRect.xy) / uRect.zw;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
  /* overscan: the capture trims the ragged left edge and most of the head switch */
  uv = uv * vec2(0.972, 0.972) + vec2(0.016, 0.022);
  float ly = 1.0 / uRes.y;
  vec3 c = texture2D(uTex, uv).rgb * 0.5 + (texture2D(uTex, uv + vec2(0.0, ly)).rgb + texture2D(uTex, uv - vec2(0.0, ly)).rgb) * 0.25;
  /* somebody digitised this once: faint blocking in the flat dark areas */
  vec2 blk = floor(uv * uRes / 8.0); float l = dot(c, vec3(0.3, 0.6, 0.1));
  c += (h1(blk + floor(uFrame / 6.0)) - 0.5) * 0.010 * smoothstep(0.35, 0.05, l);
  gl_FragColor = vec4(c, 1.0);
}`,Bv=`
varying vec2 vUv; uniform sampler2D uScene, uExp; uniform vec4 uRect;
void main(){ vec2 uv = (vUv - uRect.xy) / uRect.zw; if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
  vec3 c = texture2D(uScene, uv).rgb * texture2D(uExp, vec2(0.5)).r; c = mix(c, 0.8 + (c - 0.8) * 0.28, step(0.8, c)); gl_FragColor = vec4(pow(clamp(c, 0.0, 1.0), vec3(0.47)), 1.0); }`;class kv{constructor(e,t,n){this.r=e,n<1&&(this.SW=720,this.SH=540);const i=rn;this.scene=new _n(this.SW,this.SH,{type:i,samples:n>=1?4:0,depthBuffer:!0,generateMipmaps:!0,minFilter:mn,magFilter:ut});const s=(o,l,c=Qt,h=ut)=>new _n(o,l,{type:c,depthBuffer:!1,minFilter:h,magFilter:h,wrapS:Yt,wrapT:Yt});this.sig=s(this.W,this.H),this.out=[s(this.W,this.H),s(this.W,this.H)],this.exp=[s(1,1,i,vt),s(1,1,i,vt)],this.bright=s(240,180,i),this.blurA=s(240,180,i),this.smear=s(240,1,i);const a=(o,l)=>new Vt({vertexShader:Lv,fragmentShader:o,uniforms:l,depthTest:!1,depthWrite:!1});this.m.meter=a(Iv,{uScene:{value:this.scene.texture},uPrev:{value:null},uDt:{value:.016},uInit:{value:1},uLod:{value:Math.log2(this.SW/30)},uTarget:{value:this.target}}),this.m.bright=a(Dv,{uScene:{value:this.scene.texture},uExp:{value:null}}),this.m.blur=a(Nv,{uTex:{value:null},uDir:{value:new Ue}}),this.m.smear=a(Uv,{uTex:{value:null}}),this.m.lens=a(Fv,{uScene:{value:this.scene.texture},uExp:{value:null},uBloom:{value:this.bright.texture},uSmear:{value:this.smear.texture},uFocus:{value:0},uSkew:{value:0},uZoom:{value:0},uMove:{value:new Ue},uWB:{value:new z(1,1,1)},uAspect:{value:4/3},uAwb:{value:0}}),this.m.tape=a(Ov,{uSig:{value:this.sig.texture},uPrev:{value:null},uNoise:{value:t},uExp:{value:null},uField:{value:0},uFrame:{value:0},uGlitch:{value:0},uTrack:{value:.5},uFxA:{value:new Ze(0,0,1,0)},uFxB:{value:new Ze(0,0,0,1)},uBand:{value:new Ze(0,.05,0,0)},uTear:{value:new Ze(0,0,0,0)},uDrop:{value:0},uRes:{value:new Ue(this.W,this.H)}}),this.m.show=a(zv,{uTex:{value:null},uRes:{value:new Ue(this.W,this.H)},uRect:{value:this.rect},uFrame:{value:0}}),this.m.raw=a(Bv,{uScene:{value:this.scene.texture},uExp:{value:null},uRect:{value:this.rect}}),this.quad=new wt(new vi(2,2),this.m.show),this.quad.frustumCulled=!1,this.qs.add(this.quad)}r;SW=960;SH=720;W=720;H=480;scene;sig;out;exp;bright;blurA;smear;quad;cam=new Wr(-1,1,1,-1,0,1);qs=new _o;m={};frame=0;flip=0;first=!0;rect=new Ze(0,0,1,1);raw=!1;target=.25;awb=0;fx={black:0,snow:0,chroma:1,hue:0,vshift:0,flag:0,bleed:0,level:1,bandY:0,bandH:.05,band:0,tearY:0,tearH:0,tear:0,drop:0,glitch:0,track:.5,freeze:!1};clearFx(){const e=this.fx;e.black=e.snow=e.hue=e.vshift=e.flag=e.bleed=e.band=e.tear=e.tearH=e.drop=e.glitch=0,e.chroma=e.level=1,e.freeze=!1}layout(e,t){const n=e/t,i=4/3;if(n>i){const s=i/n;this.rect.set((1-s)/2,0,s,1)}else{const s=n/i;this.rect.set(0,(1-s)/2,1,s)}}pass(e,t){this.quad.material=e,this.r.setRenderTarget(t),this.r.render(this.qs,this.cam)}render(e,t,n){const i=this.r,s=this.m;i.setRenderTarget(this.scene),i.render(e,t);const a=this.exp[this.flip],o=this.exp[1-this.flip];if(s.meter.uniforms.uPrev.value=a.texture,s.meter.uniforms.uDt.value=n.dt,s.meter.uniforms.uTarget.value=this.target,s.meter.uniforms.uInit.value=this.first?1:0,this.pass(s.meter,o),this.raw){s.raw.uniforms.uExp.value=o.texture,this.pass(s.raw,null),this.flip=1-this.flip,this.frame++,this.first=!1;return}s.bright.uniforms.uExp.value=o.texture,this.pass(s.bright,this.bright),s.smear.uniforms.uTex.value=this.bright.texture,this.pass(s.smear,this.smear),s.blur.uniforms.uTex.value=this.bright.texture,s.blur.uniforms.uDir.value.set(1/240,0),this.pass(s.blur,this.blurA),s.blur.uniforms.uTex.value=this.blurA.texture,s.blur.uniforms.uDir.value.set(0,1/180),this.pass(s.blur,this.bright);const l=this.fx;if(l.freeze&&!this.first){s.show.uniforms.uTex.value=this.out[this.flip].texture,s.show.uniforms.uFrame.value=this.frame,this.pass(s.show,null),this.frame++;return}const c=s.lens.uniforms;c.uExp.value=o.texture,c.uFocus.value=n.focus,c.uSkew.value=n.skew,c.uZoom.value=n.zoom,c.uMove.value.set(n.move[0],n.move[1]),c.uWB.value.set(n.wb[0],n.wb[1],n.wb[2]),c.uAwb.value=this.awb,this.pass(s.lens,this.sig);const h=this.out[this.flip],u=this.out[1-this.flip],f=s.tape.uniforms;f.uPrev.value=h.texture,f.uExp.value=o.texture,f.uField.value=this.frame&1,f.uFrame.value=this.frame,f.uGlitch.value=Math.max(n.glitch,l.glitch),f.uTrack.value=l.glitch>n.glitch?l.track:n.track,f.uFxA.value.set(l.black,l.snow,l.chroma,l.hue),f.uFxB.value.set(l.vshift,l.flag,l.bleed,l.level),f.uBand.value.set(l.bandY,l.bandH,l.band,0),f.uTear.value.set(l.tearY,l.tearH,l.tear,0),f.uDrop.value=l.drop,this.pass(s.tape,u),this.first&&(f.uPrev.value=u.texture,f.uField.value=1,this.pass(s.tape,h),f.uPrev.value=h.texture,f.uField.value=0,this.pass(s.tape,u)),s.show.uniforms.uTex.value=u.texture,s.show.uniforms.uFrame.value=this.frame,this.pass(s.show,null),this.flip=1-this.flip,this.frame++,this.first=!1}reset(){this.first=!0}readScene(e,t,n,i){const s=new Uint16Array(n*i*4),a=[0,0,0];this.r.readRenderTargetPixels(this.scene,e,t,n,i,s);for(let o=0;o<n*i;o++)for(let l=0;l<3;l++)a[l]+=Ll.fromHalfFloat(s[o*4+l])/(n*i);return a}meter(){const e=new Uint16Array(4);return this.r.readRenderTargetPixels(this.exp[this.flip],0,0,1,1,e),[0,1,2].map(t=>Ll.fromHalfFloat(e[t]))}dispose(){for(const e of[this.scene,this.sig,...this.out,...this.exp,this.bright,this.blurA,this.smear])e.dispose();for(const e in this.m)this.m[e].dispose();this.quad.geometry.dispose()}}const Zt=(r,e,t)=>Math.max(e,Math.min(t,r)),Mr=.12,Gv=new Set;function Ai(r,e){const t=Math.floor(r),n=r-t,i=n*n*(3-2*n),s=a=>{const o=Math.sin((a+e*57.3)*127.1)*43758.5453;return(o-Math.floor(o))*2-1};return s(t)*(1-i)+s(t+1)*i}const wa=(r,e)=>Ai(r,e)*.55+Ai(r*2.1,e+1)*.28+Ai(r*4.3,e+2)*.17;class Hv{x=0;z=0;vx=0;vz=0;yawT=0;pitchT=0;yaw=0;pitch=0;roll=0;wy=0;wp=0;zoom=0;zoomT=0;zoomV=0;step=0;foot=1;speed=0;moving=!1;idle=0;turnAcc=0;bobY=0;kick=0;kickV=0;fInv=1/3;fVel=0;fDelay=0;focus=0;focusNear=0;t=0;glitch=0;glitchAt=40+Math.random()*70;track=.5;wbT=Math.random()*100;keys=new Set;look=[0,0];stick=[0,0];extra=[];lock=!1;fallY=0;plan=null;onStep=()=>{};onZoom=()=>{};EYE=1.5;hfov(){return(58-38*this.zoom)*Math.PI/180}ray(e,t,n,i=30){if(this.plan)return this.plan.ray(this.x,this.z,t,n,i);let s=Math.floor(this.x/ne),a=Math.floor(this.z/ne);const o=t>0?1:-1,l=n>0?1:-1;let c=t!==0?((s+(o>0?1:0))*ne-this.x)/t:1/0,h=n!==0?((a+(l>0?1:0))*ne-this.z)/n:1/0;const u=t!==0?ne/Math.abs(t):1/0,f=n!==0?ne/Math.abs(n):1/0;for(let d=0;d<80;d++){let m,_;if(c<h?(m=c,_=Jn(e,o>0?s+1:s,a),s+=o,c+=u):(m=h,_=$n(e,s,l>0?a+1:a),a+=l,h+=f),m>i)return i;if(_===Ft||_===ji)return m}return i}collide(e){if(this.plan){this.plan.collide(this);return}const t=.27,n=Math.floor(this.x/ne),i=Math.floor(this.z/ne),s=[],a=wi/2+.012;for(let o=i-1;o<=i+2;o++)for(let l=n-1;l<=n+2;l++){const c=$n(e,l,o),h=Jn(e,l,o);c===Ft&&s.push({x0:l*ne,z0:o*ne-a,x1:(l+1)*ne,z1:o*ne+a}),h===Ft&&s.push({x0:l*ne-a,z0:o*ne,x1:l*ne+a,z1:(o+1)*ne}),c===ji&&(s.push({x0:l*ne,z0:o*ne-a,x1:l*ne+Mr,z1:o*ne+a}),s.push({x0:(l+1)*ne-Mr,z0:o*ne-a,x1:(l+1)*ne,z1:o*ne+a})),h===ji&&(s.push({x0:l*ne-a,z0:o*ne,x1:l*ne+a,z1:o*ne+Mr}),s.push({x0:l*ne-a,z0:(o+1)*ne-Mr,x1:l*ne+a,z1:(o+1)*ne}));const u=Bh(e,l,o)?zh/2+.012:c||h||$n(e,l-1,o)||Jn(e,l,o-1)?a:0;u&&s.push({x0:l*ne-u,z0:o*ne-u,x1:l*ne+u,z1:o*ne+u})}for(const o of this.extra)s.push(o);for(let o=0;o<3;o++)for(const l of s){const c=Zt(this.x,l.x0,l.x1),h=Zt(this.z,l.z0,l.z1);let u=this.x-c,f=this.z-h;const d=u*u+f*f;if(d>=t*t)continue;if(d<1e-9){const g=this.x-l.x0,p=l.x1-this.x,x=this.z-l.z0,y=l.z1-this.z,M=Math.min(g,p,x,y);M===g?this.x=l.x0-t:M===p?this.x=l.x1+t:M===x?this.z=l.z0-t:this.z=l.z1+t;continue}const m=Math.sqrt(d);u/=m,f/=m,this.x=c+u*t,this.z=h+f*t;const _=this.vx*u+this.vz*f;_<0&&(this.vx-=_*u,this.vz-=_*f)}}update(e,t,n){this.t+=e;const i=this.t,s=.0021*(this.hfov()/1.012);this.lock&&(this.look[0]=this.look[1]=0),this.yawT-=this.look[0]*s,this.pitchT=Zt(this.pitchT-this.look[1]*s,-1.25,1.25),this.look[0]=this.look[1]=0;const a=this.lock?Gv:this.keys,o=this.lock?[0,0]:this.stick;let l=(a.has("KeyD")||a.has("ArrowRight")?1:0)-(a.has("KeyA")||a.has("ArrowLeft")?1:0)+o[0],c=(a.has("KeyW")||a.has("ArrowUp")?1:0)-(a.has("KeyS")||a.has("ArrowDown")?1:0)+o[1];const h=Math.hypot(l,c);h>1&&(l/=h,c/=h);const f=(a.has("ShiftLeft")||a.has("ShiftRight")||h>1.3?2.25:1.28)*(c<-.1?.72:1)*(1-.25*this.zoom),d=Math.sin(this.yaw),m=Math.cos(this.yaw),_=(-d*c+m*l*.85)*f,g=(-m*c-d*l*.85)*f,p=h>.05?4.6:6.5,x=_-this.vx,y=g-this.vz,M=Math.hypot(x,y),w=p*e;M>w?(this.vx+=x/M*w,this.vz+=y/M*w):(this.vx=_,this.vz=g),this.x+=this.vx*e,this.z+=this.vz*e,this.collide(t);const E=Math.hypot(this.vx,this.vz);this.speed=E;const v=Zt(E/1.28,0,1.8),T=.62+.16*Zt(E/2.25,0,1),I=this.moving;this.moving=E>.28,this.moving?(this.idle=0,this.step+=E*e/T,this.step>=1&&(this.step-=1,this.foot=-this.foot,this.onStep(this.foot,E,0),this.kickV-=.055*(.6+.5*v))):(this.idle+=e,I&&(this.foot=-this.foot,this.onStep(this.foot,.6,1),this.kickV-=.03,this.step=.5)),this.turnAcc+=Math.abs(this.wy)*e,!this.moving&&this.turnAcc>.85&&(this.turnAcc=0,this.foot=-this.foot,this.onStep(this.foot,.45,1)),this.moving&&(this.turnAcc=0);const R=this.step*Math.PI*2,P=this.moving?1:Math.max(0,1-this.idle*4),F=-Math.abs(Math.sin(R*.5))*.034*v*P+.017*v*P;this.bobY+=(F-this.bobY)*Math.min(1,e*18);const G=Math.sin(R*.5+(this.foot>0?0:Math.PI))*.016*v*P,C=2*Math.PI*2.3,V=.72,q=C*C*(this.yawT-this.yaw)-2*V*C*this.wy,W=C*C*(this.pitchT-this.pitch)-2*V*C*this.wp;this.wy+=q*e,this.wp+=W*e,this.yaw+=this.wy*e,this.pitch+=this.wp*e,this.kickV+=(-260*this.kick-17*this.kickV)*e,this.kick+=this.kickV*e;const D=(.0042+.0105*v+.004*Zt(Math.abs(this.wy)+Math.abs(this.wp),0,2))*(1+.5*this.zoom),O=Math.sin(i*1.55)*.0022*(1-Zt(v,0,1)),Y=wa(i*.9,1)*D+Ai(i*7.3,2)*D*.1+G*.25,te=wa(i*.8,5)*D*.85+Ai(i*8.1,6)*D*.09+O+this.kick+Math.sin(R)*.004*v*P,xe=wa(i*.6,9)*D*1.2+G*.55-this.wy*.012+this.vx*0;this.roll+=(xe-this.roll)*Math.min(1,e*9);const Pe=(a.has("KeyE")||a.has("Equal")?1:0)-(a.has("KeyQ")||a.has("Minus")?1:0);Pe&&(this.zoomT=Zt(this.zoomT+Pe*e*.42,0,1));const $=Zt((this.zoomT-this.zoom)*7,-.42,.42);this.zoomV+=($-this.zoomV)*Math.min(1,e*10),this.zoom=Zt(this.zoom+this.zoomV*e,0,1),this.onZoom(Math.abs(this.zoomV)/.42);const de=Math.max(.25,this.ray(t,-Math.sin(this.yaw)*Math.cos(this.pitch),-Math.cos(this.yaw)*Math.cos(this.pitch),30)/Math.max(.35,Math.cos(this.pitch))),Re=1/(this.focusNear>0?this.focusNear:this.pitch<-.25?Math.min(de,this.EYE/Math.sin(-this.pitch)):this.pitch>.3?Math.min(de,((this.plan?this.plan.ceil(this.x,this.z):Tt)-this.EYE)/Math.sin(this.pitch)):de),me=Re-this.fInv;Math.abs(me)>.12*(1-.6*this.zoom)?this.fDelay+=e:this.fDelay=Math.max(0,this.fDelay-e*2),this.fDelay>.22?(this.fVel+=(7.5*7.5*me-2*.42*7.5*this.fVel)*e,this.fInv+=this.fVel*e,Math.abs(me)<.02&&Math.abs(this.fVel)<.05&&(this.fDelay=0)):this.fVel*=Math.exp(-e*6),this.focus=Zt(Math.abs(Re-this.fInv)*(.42+2.4*this.zoom),0,1),i>this.glitchAt&&(this.glitch=1,this.glitchAt=i+45+Math.random()*110,this.track=.15+Math.random()*.2),this.glitch=Math.max(0,this.glitch-e*2.6),this.track+=e*.5,this.wbT+=e;const Ie=this.hfov(),ft=2*Math.atan(Math.tan(Ie/2)*.75);n.px=this.x+Math.cos(this.yaw)*G,n.py=this.EYE+this.bobY+Math.sin(i*1.55)*.004+this.fallY,n.pz=this.z-Math.sin(this.yaw)*G,n.yaw=this.yaw+Y,n.pitch=this.pitch+te,n.roll=this.roll,n.fov=ft*180/Math.PI;const Te=n.cam;Te.dt=e,Te.focus=this.focus,Te.skew=Zt(this.wy*.0035,-.012,.012),Te.zoom=this.zoom,Te.move[0]=Zt(this.wy*e*.5/Ie,-.03,.03),Te.move[1]=Zt(-this.wp*e*.5/ft,-.03,.03),Te.wb[0]=.965+.02*Ai(this.wbT*.07,3),Te.wb[1]=1,Te.wb[2]=.87+.05*Ai(this.wbT*.05,4),Te.glitch=this.glitch,Te.track=this.track}}const Sr=12,Vv=-1,Wv=-9,Xv=-6,tt=(r,e)=>r+Math.random()*(e-r),un=r=>Math.pow(10,r/20);class Yo{constructor(e){this.man=e}man;buf=new Map;ctx;live=!1;bus;rev=[];revIn;voices=[];bed;vent=[];hvac;zoomG;doorV=null;fridgeV=null;flickG=null;lastStep=-1;lastWet=-1;nextEvent=6;nextHandle=4;t=0;farTone=150+Math.random()*240;revW=[0,0,1,0];upd=0;master;fxGain;fxLp;tapeIn;humMul=1;hvacMul=1;revMul=1;revBias=[0,0,0,0];detune=0;mods=new Map;debug={voices:0,bed:0,room:[0,0,0,0],occl:0};asleep=!1;sleepWorld(){if(!this.live||this.asleep)return;this.asleep=!0;const e=this.ctx.currentTime;for(const t of[...this.voices,...this.vent,...this.doorV?[this.doorV]:[],...this.fridgeV?[this.fridgeV]:[]]){t.g.gain.cancelScheduledValues(e),t.g.gain.setTargetAtTime(0,e,.05);const n=t.src;if(n)try{n.stop(e+.5)}catch{}t.src=null,t.fix=null,this.unbuzz(t,e)}this.bed.gain.setTargetAtTime(0,e,.05),this.hvac.gain.setTargetAtTime(0,e,.05);for(const t of this.rev)t.g.gain.setTargetAtTime(0,e,.1);setTimeout(()=>{for(const t of this.rev)try{this.revIn.disconnect(t.conv)}catch{}},800)}static async load(e){const t=await(await fetch(e+"manifest.json")).json(),n=new Yo(t),i=window.OfflineAudioContext||window.webkitOfflineAudioContext,s=new i(2,2,32e3),a=new Map;for(const o of Object.values(t))a.has(o.file)||a.set(o.file,fetch(e+o.file).then(l=>l.arrayBuffer()).then(l=>s.decodeAudioData(l)));return await Promise.all(Object.entries(t).map(async([o,l])=>{const c=await a.get(l.file);if(l.at===void 0){n.buf.set(o,c);return}const h=c.sampleRate,u=Math.max(0,Math.floor((l.at-.02)*h)),f=Math.min(c.length,Math.ceil((l.at+l.len+.02)*h)),d=s.createBuffer(c.numberOfChannels,f-u,h);for(let m=0;m<c.numberOfChannels;m++)d.getChannelData(m).set(c.getChannelData(m).subarray(u,f));n.buf.set(o,d)})),n}loop(e,t,n=1){const i=this.buf.get(e),s=this.man[e],a=this.ctx.createBufferSource();a.buffer=i,a.loop=!0,a.playbackRate.value=n;const o=s.loop?.1:0,l=s.loop?s.loop/s.sr:i.duration;return a.loopStart=o,a.loopEnd=o+l,a.connect(t),a.start(0,o+Math.random()*l*.9),a}voice(e=60,t=1.25,n=1.3){const i=this.ctx,s=i.createGain();s.gain.value=0;const a=i.createBiquadFilter();a.type="lowpass",a.frequency.value=12e3,a.Q.value=.5;const o=i.createPanner();o.panningModel="HRTF",o.distanceModel="inverse",o.refDistance=n,o.rolloffFactor=t,o.maxDistance=e;const l=i.createGain();return l.gain.value=.3,s.connect(a),a.connect(o),o.connect(this.bus),o.connect(l),l.connect(this.revIn),{src:null,g:s,lp:a,pan:o,send:l,id:0,fix:null,level:0,rate0:1,bz:null,bzG:null}}start(e,t=e.destination){this.ctx=e,this.voices=[],this.vent=[],this.rev=[];const n=e,i=n.currentTime,s=this.master=n.createGain();s.gain.setValueAtTime(1e-4,i),s.gain.exponentialRampToValueAtTime(un(Wv),i+.035),s.connect(t);const a=n.createDynamicsCompressor();a.threshold.value=-3,a.knee.value=4,a.ratio.value=20,a.attack.value=.002,a.release.value=.12,a.connect(s);const o=n.createDelay(.05);o.delayTime.value=.006,o.connect(a);const l=n.createOscillator();l.frequency.value=.55;const c=n.createGain();c.gain.value=22e-5,l.connect(c),c.connect(o.delayTime),l.start();const h=n.createOscillator();h.frequency.value=6.3;const u=n.createGain();u.gain.value=3e-5,h.connect(u),u.connect(o.delayTime),h.start();const f=this.fxGain=n.createGain();f.gain.value=1,f.connect(o);const d=this.fxLp=n.createBiquadFilter();d.type="lowpass",d.frequency.value=16e3,d.Q.value=.5,d.connect(f),this.tapeIn=o;const m=n.createGain();m.gain.value=un(Vv),m.connect(d);const _=n.createDynamicsCompressor();_.threshold.value=-40,_.knee.value=18,_.ratio.value=2,_.attack.value=.03,_.release.value=1,_.connect(m);const g=n.createBiquadFilter();g.type="lowpass",g.frequency.value=9500,g.Q.value=.6;const p=n.createBiquadFilter();p.type="lowpass",p.frequency.value=11e3,p.Q.value=.7,g.connect(p),p.connect(_);const x=n.createBiquadFilter();x.type="peaking",x.frequency.value=3300,x.Q.value=.9,x.gain.value=3.5,x.connect(g);const y=n.createBiquadFilter();y.type="highpass",y.frequency.value=75,y.Q.value=.6,y.connect(x);const M=n.createChannelSplitter(2),w=n.createChannelMerger(2),E=(R,P,F)=>{const G=n.createGain();G.gain.value=F,M.connect(G,R),G.connect(w,0,P)};E(0,0,.7),E(1,0,.3),E(0,1,.3),E(1,1,.7),w.connect(y),this.bus=n.createGain(),this.bus.gain.value=1,this.bus.channelCount=2,this.bus.channelCountMode="explicit",this.bus.connect(M);const v=n.createGain();v.gain.value=un(Xv),v.connect(d),this.loop("hiss",v);const T=n.createGain();T.gain.value=un(-8),T.connect(y),this.loop("transport",T),this.zoomG=n.createGain(),this.zoomG.gain.value=0,this.zoomG.connect(y),this.loop("zoom",this.zoomG),this.revIn=n.createGain(),this.revIn.gain.value=1;for(const R of["ir_corridor","ir_small","ir_medium","ir_hall"]){const P=n.createConvolver();P.normalize=!1,P.buffer=this.atRate(this.buf.get(R));const F=n.createGain();F.gain.value=0,this.revIn.connect(P),P.connect(F),F.connect(this.bus),this.rev.push({conv:P,g:F})}for(let R=0;R<Sr;R++)this.voices.push(this.voice());this.bed=n.createGain(),this.bed.gain.value=0;const I=n.createBiquadFilter();I.type="lowpass",I.frequency.value=2400,this.bed.connect(I),I.connect(this.bus),this.loop("bed_hum",this.bed),this.hvac=n.createGain(),this.hvac.gain.value=un(-7),this.hvac.connect(this.bus),this.loop("hvac",this.hvac);for(let R=0;R<2;R++){const P=this.voice(25,1.6,.9);P.src=this.loop("vent",P.g,tt(.96,1.04)),this.vent.push(P)}this.setListener(0,1.5,0,0,0,-1,0,1,0),this.live=!0}atRate(e){const t=this.ctx.sampleRate;if(Math.abs(e.sampleRate-t)<1)return e;const n=e.sampleRate/t,i=Math.floor(e.length/n),s=this.ctx.createBuffer(e.numberOfChannels,i,t);for(let a=0;a<e.numberOfChannels;a++){const o=e.getChannelData(a),l=s.getChannelData(a),c=o.length-1;for(let h=0;h<i;h++){const u=h*n,f=Math.floor(u),d=u-f,m=o[Math.max(0,f-1)],_=o[f],g=o[Math.min(c,f+1)],p=o[Math.min(c,f+2)];l[h]=(_+.5*d*(g-m+d*(2*m-5*_+4*g-p+d*(3*(_-g)+p-m))))*n}}return s}setListener(e,t,n,i,s,a,o,l,c){const h=this.ctx.listener,u=this.ctx.currentTime;h.positionX?(h.positionX.setTargetAtTime(e,u,.02),h.positionY.setTargetAtTime(t,u,.02),h.positionZ.setTargetAtTime(n,u,.02),h.forwardX.setTargetAtTime(i,u,.02),h.forwardY.setTargetAtTime(s,u,.02),h.forwardZ.setTargetAtTime(a,u,.02),h.upX.setTargetAtTime(o,u,.02),h.upY.setTargetAtTime(l,u,.02),h.upZ.setTargetAtTime(c,u,.02)):(h.setPosition(e,t,n),h.setOrientation(i,s,a,o,l,c))}place(e,t,n,i){const s=e.pan,a=this.ctx.currentTime;s.positionX?(s.positionX.setValueAtTime(t,a),s.positionY.setValueAtTime(n,a),s.positionZ.setValueAtTime(i,a)):s.setPosition(t,n,i)}shot(e,t,n,i,s,a=1,o=.3,l=14e3,c=1.5,h=1){const u=this.buf.get(e);if(!u)return;const f=this.ctx,d=f.createBufferSource();d.buffer=u,d.playbackRate.value=a;const m=f.createGain();m.gain.value=s;const _=f.createBiquadFilter();_.type="lowpass",_.frequency.value=l,_.Q.value=.5;const g=f.createPanner();g.panningModel="HRTF",g.distanceModel="inverse",g.refDistance=c,g.rolloffFactor=h,g.maxDistance=80,g.positionX?(g.positionX.value=t,g.positionY.value=n,g.positionZ.value=i):g.setPosition(t,n,i);const p=f.createGain();p.gain.value=o,d.connect(m),m.connect(_),_.connect(g),g.connect(this.bus),g.connect(p),p.connect(this.revIn),d.start(),d.onended=()=>{try{d.disconnect(),m.disconnect(),_.disconnect(),g.disconnect(),p.disconnect()}catch{}}}unbuzz(e,t){if(!e.bz)return;const n=e.bz,i=e.bzG;e.bz=null,e.bzG=null,i.gain.setTargetAtTime(0,t,.05),n.stop(t+.4),n.onended=()=>{try{n.disconnect(),i.disconnect()}catch{}}}recDrop(e,t=0){if(!this.live)return;const n=this.fxGain.gain,i=this.ctx.currentTime;n.cancelScheduledValues(i),n.setTargetAtTime(t,i,.004),n.setTargetAtTime(1,i+e,.02)}recLevel(e,t){if(!this.live)return;const n=this.fxGain.gain,i=this.ctx.currentTime;n.cancelScheduledValues(i),n.setTargetAtTime(e,i,t*.25),n.setTargetAtTime(1,i+t,t*.4)}recMuffle(e,t=900){if(!this.live)return;const n=this.fxLp.frequency,i=this.ctx.currentTime;n.cancelScheduledValues(i),n.setTargetAtTime(t,i,.03),n.setTargetAtTime(16e3,i+e,.12)}tapeStatic(e,t){const n=this.buf.get(e);if(!n||!this.live)return;const i=this.ctx,s=i.createBufferSource(),a=i.createGain();s.buffer=n,a.gain.value=t,s.connect(a),a.connect(this.tapeIn),s.start(),s.onended=()=>{try{s.disconnect(),a.disconnect()}catch{}}}lx=0;lz=0;fwx=0;fwz=-1;step(e,t,n,i=0){if(!this.live)return;let s;const a=n?6:14;do s=Math.floor(Math.random()*a);while(s===this.lastStep);this.lastStep=s;const o=-this.fwz,l=this.fwx,c=this.lx+o*e*.11+this.fwx*.1,h=this.lz+l*e*.11+this.fwz*.1,u=n?.55:.62+.42*Math.min(1.6,t/1.28)*tt(.85,1.12);if(this.shot((n?"scuff":"step")+s,c,.02,h,u*1.5,tt(.94,1.06)*(1+.04*Math.min(1,t/2.25)),.55,9e3),i>.02){let f;do f=Math.floor(Math.random()*8);while(f===this.lastWet);this.lastWet=f,this.shot("wet"+f,c,.02,h,u*(.5+2.6*i)*tt(.8,1.2),tt(.9,1.1)*(1-.06*i),.4,5200+1500*(1-i))}Math.random()<.6&&this.shot("cloth"+Math.floor(Math.random()*8),this.lx+o*e*.2,1.1,this.lz+l*e*.2,tt(.5,1)*(.5+.5*Math.min(1.5,t/1.28)),tt(.9,1.1),.1)}handle(e){this.live&&this.shot("handle"+Math.floor(Math.random()*8),this.lx+this.fwx*.15,1.45,this.lz+this.fwz*.15,.9*e,tt(.9,1.1),.02,3e3)}zoomMotor(e){this.live&&this.zoomG.gain.setTargetAtTime(e>.02?un(-15)*Math.min(1,e*2):0,this.ctx.currentTime,.03)}doorSound(e,t,n,i=1){this.shot(e,t,1.1,n,i,tt(.95,1.05),.4)}update(e,t,n,i,s,a,o,l,c,h,u,f){const d=this.ctx,m=d.currentTime;this.t+=e,this.lx=n,this.lz=s;const _=Math.hypot(a,l)||1;if(this.fwx=a/_,this.fwz=l/_,!this.asleep){if(this.setListener(n,i,s,a,o,l,c,h,u),this.upd-=e,this.upd<=0){this.upd=.09;const g=f.lit.map(D=>({f:D,d:(D.x-n)**2+(D.z-s)**2})).sort((D,O)=>D.d-O.d),p=f.pin||[],x=p.length?g.filter(D=>p.includes(D.f.id)&&D.d<900).slice(0,5):[],y=x.length?[...x,...g.filter(D=>!x.includes(D))].slice(0,Sr):g.slice(0,Sr),M=x.length?g.filter(D=>!y.includes(D)):g.slice(Sr),w=new Set(y.map(D=>D.f.id));for(const D of this.voices)if(D.fix&&!w.has(D.fix.id)){D.g.gain.setTargetAtTime(0,m,.12);const O=D.src;D.src=null,D.fix=null,O&&O.stop(m+.6),this.unbuzz(D,m)}const E=new Set(this.voices.filter(D=>D.fix).map(D=>D.fix.id));for(const D of y){if(E.has(D.f.id))continue;const O=this.voices.find(Pe=>!Pe.fix);if(!O)break;const Y=D.f,te=(Y.id>>>0)%1e3/1e3;O.fix=Y,this.place(O,Y.x,Tt-.05,Y.z);const xe=Y.state===2?"hum_bad":"hum_"+"abcdef"[Y.voice%6];O.level=un(-3+7*te+(Y.voice===4?2:0))*(.7+.3*Y.power),O.rate0=1+(te-.5)*.0012,O.src=this.loop(xe,O.g,O.rate0),O.g.gain.setValueAtTime(0,m)}let v=0,T=0;for(const D of this.voices){if(!D.fix)continue;T++;const O=$t(t,n,i,s,D.fix.x,Tt-.1,D.fix.z,!0);v+=O;const Y=f.flick(D.fix.id),te=this.mods.get(D.fix.id),xe=Y<.02?0:.1+.9*Y,Pe=Y<.999||!!te;D.g.gain.setTargetAtTime(D.level*Math.pow(.5,O)*xe*this.humMul*(te?te.gain:1),m,Pe?.015:.18),D.src&&D.src.playbackRate.setTargetAtTime(D.rate0*(1+this.detune)*(te?te.rate:1),m,.25),te&&te.buzz>.01?(D.bz||(D.bzG=d.createGain(),D.bzG.gain.value=0,D.bzG.connect(D.lp),D.bz=this.loop("hum_bad",D.bzG,tt(.97,1.03))),D.bzG.gain.setTargetAtTime(D.level*Math.pow(.5,O)*te.buzz*(.25+.75*Y),m,.02)):D.bz&&this.unbuzz(D,m),D.lp.frequency.setTargetAtTime(O===0?12e3:Math.max(500,2600/O),m,.2),D.send.gain.setTargetAtTime(.28+.2*Math.min(2,O),m,.3)}let I=0;for(const D of M)I+=1/(1+D.d/60);const R=un(-13)*Math.max(.3,Math.min(1.5,.3+I/80));this.bed.gain.setTargetAtTime(R*this.humMul,m,1.2),this.hvac.gain.setTargetAtTime(un(-7)*this.hvacMul,m,1.6);const P=[];for(let D=0;D<f.vents.length;D+=2)P.push([f.vents[D],f.vents[D+1],(f.vents[D]-n)**2+(f.vents[D+1]-s)**2]);P.sort((D,O)=>D[2]-O[2]),this.vent.forEach((D,O)=>{const Y=P[O];if(Y&&Y[2]<400){this.place(D,Y[0],Tt-.05,Y[1]);const te=$t(t,n,i,s,Y[0],Tt-.1,Y[1],!0);D.g.gain.setTargetAtTime(un(-4)*Math.pow(.5,te),m,.4),D.lp.frequency.setTargetAtTime(te?1800:9e3,m,.3)}else D.g.gain.setTargetAtTime(0,m,.4)});const F=[];for(let D=0;D<16;D++){const O=D/16*Math.PI*2;F.push(this.probe(t,n,s,Math.cos(O),Math.sin(O)))}let G=99,C=0;for(let D=0;D<8;D++){const O=F[D]+F[D+8];O<G&&(G=O),C=Math.max(C,O)}const V=F.reduce((D,O)=>D+O,0)/16,W=(G<2.7&&C>7?1:0)?[1,0,0,0]:V<2.6?[0,1,0,0]:V<6.5?[0,.25,1,0]:[0,0,.4,1];for(let D=0;D<4;D++)this.revW[D]+=(Math.max(0,W[D]+this.revBias[D])-this.revW[D])*.12,this.rev[D].g.gain.setTargetAtTime(this.revW[D]*.8*this.revMul,m,.25);if(this.debug.voices=T,this.debug.bed=R,this.debug.room=this.revW.slice(),this.debug.occl=v,f.door){this.doorV||(this.doorV=this.voice(14,2.2,.7),this.doorV.src=this.loop("outside",this.doorV.g),this.doorV.lp.frequency.value=1500),this.place(this.doorV,f.door[0],1,f.door[1]);const D=$t(t,n,i,s,f.door[0],1,f.door[1],!0);this.doorV.g.gain.setTargetAtTime(un(2)*Math.pow(.45,D),m,.3)}else this.doorV&&this.doorV.g.gain.setTargetAtTime(0,m,.2);if(f.fridge){this.fridgeV||(this.fridgeV=this.voice(30,1.4,1),this.fridgeV.src=this.loop("fridge",this.fridgeV.g)),this.place(this.fridgeV,f.fridge[0],.5,f.fridge[1]);const D=$t(t,n,i,s,f.fridge[0],.8,f.fridge[1],!0);this.fridgeV.g.gain.setTargetAtTime(un(0)*Math.pow(.5,D),m,.3),this.fridgeV.lp.frequency.setTargetAtTime(D?1200:1e4,m,.3)}else this.fridgeV&&this.fridgeV.g.gain.setTargetAtTime(0,m,.2)}if(this.nextEvent-=e,this.nextEvent<=0){this.nextEvent=tt(11,34);const g=Math.random(),p=Math.random()*Math.PI*2,x=tt(7,26),y=n+Math.cos(p)*x,M=s+Math.sin(p)*x,w=Math.min(1,x/26),E=5e3-3800*w;g<.42?this.shot("tick"+Math.floor(Math.random()*6),y,Tt+.4,M,tt(1.2,2.4),tt(.9,1.12),.6,E):g<.58?this.shot("tile"+Math.floor(Math.random()*4),n+Math.cos(p)*tt(2,8),Tt,s+Math.sin(p)*tt(2,8),tt(.8,1.6),tt(.9,1.1),.4,7e3):g<.74?this.shot("creak"+Math.floor(Math.random()*5),y,Tt+.5,M,tt(1,2),tt(.85,1.1),.7,E):g<.88?this.shot("far"+Math.floor(Math.random()*5),n+Math.cos(p)*40,1,s+Math.sin(p)*40,tt(3,6),tt(.9,1.05),.8,900):this.shot("pipe"+Math.floor(Math.random()*3),y,Tt+.6,M,tt(1.2,2.2),tt(.92,1.05),.7,E)}if(this.farTone-=e,this.farTone<=0){this.farTone=tt(260,520);const g=Math.random()*Math.PI*2;this.shot("far_tone",n+Math.cos(g)*55,1.2,s+Math.sin(g)*55,4,tt(.92,1.04),1.2,700)}this.nextHandle-=e*(1+3*f.shake),this.nextHandle<=0&&(this.nextHandle=tt(5,16),this.handle(tt(.5,1))),f.idle>14&&Math.random()<e*.05&&this.shot("breath"+Math.floor(Math.random()*3),n+this.fwx*-.1,1.55,s+this.fwz*-.1,1,tt(.95,1.05),.05,6e3)}}probe(e,t,n,i,s){let a=.3;const o=18;for(let l=.6;l<=o;l+=.6){if($t(e,t,1.4,n,t+i*l,1.4,n+s*l))return a;a=l}return o}stop(){if(this.live=!1,!this.ctx)return;try{this.master.gain.setTargetAtTime(0,this.ctx.currentTime,.01)}catch{}const e=this.ctx;e.close&&setTimeout(()=>e.close().catch(()=>{}),60)}}function $_(r,e=!1){const t=r[0].index!==null,n=new Set(Object.keys(r[0].attributes)),i=new Set(Object.keys(r[0].morphAttributes)),s={},a={},o=r[0].morphTargetsRelative,l=new Ct;l.morphTargetsRelative=o;let c=0;for(let h=0;h<r.length;++h){const u=r[h];let f=0,d=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const m in u.attributes){if(!n.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+m+'" attribute exists among all geometries, or in none of them.'),null;s[m]===void 0&&(s[m]=[]),s[m].push(u.attributes[m]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const m in u.morphAttributes){if(!i.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;if(u.morphAttributes[m].length!==r[0].morphAttributes[m].length)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have the same number of morph targets for the "'+m+'" morph attribute.'),null;a[m]===void 0&&(a[m]=[]),a[m].push(u.morphAttributes[m]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of morph attributes."),null;if(e){let m;if(t)m=u.index.count;else if(u.attributes.position!==void 0)m=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,m,h),c+=m}}if(t){let h=0;const u=[];for(let f=0;f<r.length;++f){const d=r[f].index;for(let m=0;m<d.count;++m)u.push(d.getX(m)+h);h+=r[f].attributes.position.count}l.setIndex(u)}for(const h in s){const u=Rc(s[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let f=0;f<u;++f){const d=[];for(let _=0;_<a[h].length;++_)d.push(a[h][_][f]);const m=Rc(d);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}}return l}function Rc(r){let e,t,n,i=-1,s=0;for(let c=0;c<r.length;++c){const h=r[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=h.count*t}const a=new e(s),o=new ht(a,t,n);let l=0;for(let c=0;c<r.length;++c){const h=r[c];if(h.isInterleavedBufferAttribute){const u=l/t;for(let f=0,d=h.count;f<d;f++)for(let m=0;m<t;m++){const _=h.getComponent(f,m);o.setComponent(f+u,m,_)}}else a.set(h.array,l);l+=h.count*t}return i!==void 0&&(o.gpuType=i),o}function Cc(r,e){if(e===Au)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),r;if(e===go||e===eh){let t=r.getIndex();if(t===null){const s=[],a=r.getAttribute("position");if(a!==void 0){for(let o=0;o<a.count;o++)s.push(o);r.setIndex(s),t=r.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),r}const n=t.count-2,i=[];if(e===go)for(let s=1;s<=n;s++)i.push(t.getX(0)),i.push(t.getX(s)),i.push(t.getX(s+1));else for(let s=0;s<n;s++)s%2===0?(i.push(t.getX(s)),i.push(t.getX(s+1)),i.push(t.getX(s+2))):(i.push(t.getX(s+2)),i.push(t.getX(s+1)),i.push(t.getX(s)));return i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),r}function qv(r){const e=new Map,t=new Map,n=r.clone();return kh(r,n,function(i,s){e.set(s,i),t.set(i,s)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;const s=i,a=e.get(i),o=a.skeleton.bones;s.skeleton=a.skeleton.clone(),s.bindMatrix.copy(a.bindMatrix),s.skeleton.bones=o.map(function(l){return t.get(l)}),s.bind(s.skeleton,s.bindMatrix)}),n}function kh(r,e,t){t(r,e);for(let n=0;n<r.children.length;n++)kh(r.children[n],e.children[n],t)}class Yv extends cs{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Qv(t)}),this.register(function(t){return new jv(t)}),this.register(function(t){return new e_(t)}),this.register(function(t){return new c_(t)}),this.register(function(t){return new h_(t)}),this.register(function(t){return new u_(t)}),this.register(function(t){return new n_(t)}),this.register(function(t){return new i_(t)}),this.register(function(t){return new s_(t)}),this.register(function(t){return new r_(t)}),this.register(function(t){return new Jv(t)}),this.register(function(t){return new a_(t)}),this.register(function(t){return new t_(t)}),this.register(function(t){return new l_(t)}),this.register(function(t){return new o_(t)}),this.register(function(t){return new Zv(t)}),this.register(function(t){return new Pc(t,Ve.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Pc(t,Ve.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new f_(t)})}load(e,t,n,i){const s=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=Ps.extractUrlBase(e);a=Ps.resolveURL(c,this.path)}else a=Ps.extractUrlBase(e);this.manager.itemStart(e);const o=function(c){i?i(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},l=new Eh(this.manager);l.setPriority(this.priority),l.setCache(this.cache),l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{s.parse(c,a,function(h){t(h),s.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let s;const a={},o={},l=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Gh){try{a[Ve.KHR_BINARY_GLTF]=new d_(e)}catch(u){i&&i(u);return}s=JSON.parse(a[Ve.KHR_BINARY_GLTF].content)}else s=JSON.parse(l.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new w_(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,priority:this.priority,cache:this.cache,withCredentials:this.withCredentials,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(s.extensionsUsed)for(let h=0;h<s.extensionsUsed.length;++h){const u=s.extensionsUsed[h],f=s.extensionsRequired||[];switch(u){case Ve.KHR_MATERIALS_UNLIT:a[u]=new $v;break;case Ve.KHR_DRACO_MESH_COMPRESSION:a[u]=new p_(s,this.dracoLoader);break;case Ve.KHR_TEXTURE_TRANSFORM:a[u]=new m_;break;case Ve.KHR_MESH_QUANTIZATION:a[u]=new g_;break;default:f.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}}function Kv(){let r={};return{get:function(e){return r[e]},add:function(e,t){r[e]=t},remove:function(e){delete r[e]},removeAll:function(){r={}}}}function gt(r,e,t){const n=r.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}const Ve={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DIFFUSE_ROUGHNESS:"KHR_materials_diffuse_roughness",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class Zv{constructor(e){this.parser=e,this.name=Ve.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const s=t.json,l=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e];let c;const h=new Ne(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],en);const u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new ud(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new cd(h),c.distance=u;break;case"spot":c=new od(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Nn(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,s=n.json.nodes[e],o=(s.extensions&&s.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}}class $v{constructor(){this.name=Ve.KHR_MATERIALS_UNLIT}getMaterialType(){return Ki}extendParams(e,t,n){const i=[];e.color=new Ne(1,1,1),e.opacity=1;const s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){const a=s.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],en),e.opacity=a[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,Ut))}return Promise.all(i)}}class Jv{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=gt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}}class Qv{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){const n=gt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){const s=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Ue(s,s)}return Promise.all(i)}}class jv{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_DIFFUSE_ROUGHNESS}getMaterialType(e){return gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){const n=gt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return t.diffuseRoughness=n.diffuseRoughnessFactor!==void 0?n.diffuseRoughnessFactor:0,n.diffuseRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"diffuseRoughnessMap",n.diffuseRoughnessTexture)),Promise.all(i)}}class e_{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_DISPERSION}getMaterialType(e){return gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){const n=gt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}}class t_{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){const n=gt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessMinimum=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessMaximum=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}}class n_{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_SHEEN}getMaterialType(e){return gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){const n=gt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(t.sheenColor=new Ne(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){const s=n.sheenColorFactor;t.sheenColor.setRGB(s[0],s[1],s[2],en)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,Ut)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}}class i_{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){const n=gt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}}class s_{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_VOLUME}getMaterialType(e){return gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){const n=gt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;const s=n.attenuationColor||[1,1,1];return t.attenuationColor=new Ne().setRGB(s[0],s[1],s[2],en),Promise.all(i)}}class r_{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_IOR}getMaterialType(e){return gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){const n=gt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}}class a_{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_SPECULAR}getMaterialType(e){return gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){const n=gt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));const s=n.specularColorFactor||[1,1,1];return t.specularColor=new Ne().setRGB(s[0],s[1],s[2],en),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,Ut)),Promise.all(i)}}class o_{constructor(e){this.parser=e,this.name=Ve.EXT_MATERIALS_BUMP}getMaterialType(e){return gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){const n=gt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}}class l_{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){const n=gt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}}class c_{constructor(e){this.parser=e,this.name=Ve.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const s=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,a)}}class h_{constructor(e){this.parser=e,this.name=Ve.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;const a=s.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class u_{constructor(e){this.parser=e,this.name=Ve.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;const a=s.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class Pc{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(o){const l=i.byteOffset||0,c=i.byteLength||0,h=i.count,u=i.byteStride,f=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,f,i.mode,i.filter).then(function(d){return d.buffer}):a.ready.then(function(){const d=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(d),h,u,f,i.mode,i.filter),d})})}else return null}}class f_{constructor(e){this.name=Ve.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const c of i.primitives)if(c.mode!==fn.TRIANGLES&&c.mode!==fn.TRIANGLE_STRIP&&c.mode!==fn.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],l={};for(const c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{const h=c.pop(),u=h.isGroup?h.children:[h],f=c[0].count,d=[];for(const m of u){const _=new Oe,g=new z,p=new ti,x=new z(1,1,1),y=new dh(m.geometry,m.material,f);for(let w=0;w<f;w++)l.TRANSLATION&&g.fromBufferAttribute(l.TRANSLATION,w),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,w),l.SCALE&&x.fromBufferAttribute(l.SCALE,w),y.setMatrixAt(w,_.compose(g,p,x));let M=null;for(const w in l)if(w==="_COLOR_0"){const E=l[w];y.instanceColor=new zs(E.array,E.itemSize,E.normalized)}else if(w!=="TRANSLATION"&&w!=="ROTATION"&&w!=="SCALE"){if(M===null){const v=y.geometry;M=new Ct,M.name=v.name;for(const T in v.attributes)M.setAttribute(T,v.attributes[T]);for(const T in v.morphAttributes)M.morphAttributes[T]=v.morphAttributes[T];v.index!==null&&M.setIndex(v.index),M.morphTargetsRelative=v.morphTargetsRelative;for(const T of v.groups)M.addGroup(T.start,T.count,T.materialIndex);v.boundingBox!==null&&(M.boundingBox=v.boundingBox.clone()),v.boundingSphere!==null&&(M.boundingSphere=v.boundingSphere.clone()),M.drawRange.start=v.drawRange.start,M.drawRange.count=v.drawRange.count,M.userData=Object.assign({},v.userData),y.geometry=M}const E=l[w];M.setAttribute(w,new zs(E.array,E.itemSize,E.normalized))}mt.prototype.copy.call(y,m),this.parser.assignFinalMaterial(y),d.push(y)}return h.isGroup?(h.clear(),h.add(...d),h):d[0]}))}}const Gh="glTF",Ss=12,Lc={JSON:1313821514,BIN:5130562};class d_{constructor(e){this.name=Ve.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Ss),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Gh)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-Ss,s=new DataView(e,Ss);let a=0;for(;a<i;){const o=s.getUint32(a,!0);a+=4;const l=s.getUint32(a,!0);if(a+=4,l===Lc.JSON){const c=new Uint8Array(e,Ss+a,o);this.content=n.decode(c)}else if(l===Lc.BIN){const c=Ss+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class p_{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ve.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(const h in a){const u=yo[h]||h.toLowerCase();o[u]=a[h]}for(const h in e.attributes){const u=yo[h]||h.toLowerCase();if(a[h]!==void 0){const f=n.accessors[e.attributes[h]],d=es[f.componentType];c[u]=d.name,l[u]=f.normalized===!0}}return t.getDependency("bufferView",s).then(function(h){return new Promise(function(u,f){i.decodeDracoFile(h,function(d){for(const m in d.attributes){const _=d.attributes[m],g=l[m];g!==void 0&&(_.normalized=g)}u(d)},o,c,en,f)})})}}class m_{constructor(){this.name=Ve.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){const n=Math.cos(e.rotation),i=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*i,e.offset.x,-e.repeat.x*i,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}}class g_{constructor(){this.name=Ve.KHR_MESH_QUANTIZATION}}class Hh extends as{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[s+a];return t}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=i-t,u=(n-t)/h,f=u*u,d=f*u,m=e*c,_=m-c,g=-2*d+3*f,p=d-f,x=1-g,y=p-f+u;for(let M=0;M!==o;M++){const w=a[_+M+o],E=a[_+M+l]*h,v=a[m+M+o],T=a[m+M]*h;s[M]=x*w+y*E+g*v+p*T}return s}}const v_=new ti;class __ extends Hh{interpolate_(e,t,n,i){const s=super.interpolate_(e,t,n,i);return v_.fromArray(s).normalize().toArray(s),s}}const fn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},es={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Ic={9728:vt,9729:ut,9984:Yc,9985:Er,9986:Ts,9987:mn},Dc={33071:Yt,33648:Ir,10497:Ri},Aa={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},yo={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},hi={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},x_={CUBICSPLINE:void 0,LINEAR:Us,STEP:Ns},Ra={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function M_(r){return r.DefaultMaterial===void 0&&(r.DefaultMaterial=new Go({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:ei})),r.DefaultMaterial}function Ei(r,e,t){for(const n in t.extensions)r[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Nn(r,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(r.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function S_(r,e,t){let n=!1,i=!1,s=!1;for(let c=0,h=e.length;c<h;c++){const u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(r);const a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){const u=e[c];if(n){const f=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):r.attributes.position;a.push(f)}if(i){const f=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):r.attributes.normal;o.push(f)}if(s){const f=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):r.attributes.color;l.push(f)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){const h=c[0],u=c[1],f=c[2];return n&&(r.morphAttributes.position=h),i&&(r.morphAttributes.normal=u),s&&(r.morphAttributes.color=f),r.morphTargetsRelative=!0,r})}function y_(r,e){if(r.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)r.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(r.morphTargetInfluences.length===t.length){r.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)r.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function b_(r){let e;const t=r.extensions&&r.extensions[Ve.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Ca(t.attributes):e=r.indices+":"+Ca(r.attributes)+":"+r.mode,r.targets!==void 0)for(let n=0,i=r.targets.length;n<i;n++)e+=":"+Ca(r.targets[n]);return e}function Ca(r){let e="";const t=Object.keys(r).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+r[t[n]]+";";return e}function bo(r){switch(r){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function T_(r){return r.search(/\.jpe?g($|\?)/i)>0||r.search(/^data\:image\/jpeg/)===0?"image/jpeg":r.search(/\.webp($|\?)/i)>0||r.search(/^data\:image\/webp/)===0?"image/webp":r.search(/\.ktx2($|\?)/i)>0||r.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const E_=new Oe;class w_{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Kv,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const l=o.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,s=o.indexOf("Firefox")>-1,a=s?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&a<98?(this.textureLoader=new rd(this.options.manager),this.textureLoader.setPriority(this.options.priority),this.textureLoader.setCache(this.options.cache)):(this.textureLoader=new fd(this.options.manager),this.textureLoader.setPriority(this.options.priority),this.textureLoader.setCache(this.options.cache)),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setWithCredentials(this.options.withCredentials),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Eh(this.options.manager),this.fileLoader.setPriority(this.options.priority),this.fileLoader.setCache(this.options.cache),this.fileLoader.setResponseType("arraybuffer"),(this.options.withCredentials||this.options.crossOrigin==="use-credentials")&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return Ei(s,o,i),Nn(o,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(const l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){const a=t[i].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let i=0,s=e.length;i<s;i++){const a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),s=(a,o)=>{const l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(const[c,h]of a.children.entries())s(h,o.children[c])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const s=e(t[i]);s&&n.push(s)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ve.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(s,a){n.load(Ps.resolveURL(t.uri,i.path),s,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const a=Aa[i.type],o=es[i.componentType],l=i.normalized===!0,c=new o(i.count*a);return Promise.resolve(new ht(c,a,l))}const s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(a){const o=a[0],l=Aa[i.type],c=es[i.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,f=i.byteOffset||0,d=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,m=i.normalized===!0;let _,g;if(d&&d!==u){const p=Math.floor(f/d),x="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+p+":"+i.count;let y=t.cache.get(x);y||(_=new c(o,p*d,i.count*d/h),y=new bf(_,d/h),t.cache.add(x,y)),g=new Oo(y,l,f%d/h,m)}else o===null?_=new c(i.count*l):_=new c(o,f,i.count*l),g=new ht(_,l,m);if(i.sparse!==void 0){const p=Aa.SCALAR,x=es[i.sparse.indices.componentType],y=i.sparse.indices.byteOffset||0,M=i.sparse.values.byteOffset||0,w=new x(a[1],y,i.sparse.count*p),E=new c(a[2],M,i.sparse.count*l);o!==null&&(g=new ht(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let v=0,T=w.length;v<T;v++){const I=w[v];if(g.setX(I,E[v*l]),l>=2&&g.setY(I,E[v*l+1]),l>=3&&g.setZ(I,E[v*l+2]),l>=4&&g.setW(I,E[v*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=m}return g})}loadTexture(e){const t=this.json,n=this.options,s=t.textures[e].source,a=t.images[s];let o=this.textureLoader;if(a.uri){const l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,s,o)}loadTextureImage(e,t,n){const i=this,s=this.json,a=s.textures[e],o=s.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const f=(s.samplers||{})[a.sampler]||{};return h.magFilter=Ic[f.magFilter]||ut,h.minFilter=Ic[f.minFilter]||mn,h.wrapS=Dc[f.wrapS]||Ri,h.wrapT=Dc[f.wrapT]||Ri,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==vt&&h.minFilter!==ut,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(f=>f.clone());const a=i.images[e],o=self.URL||self.webkitURL;let l=a.uri||"",c=!1,h;if(t.isKTX2Loader===!0&&a.bufferView!==void 0)h=n.getDependency("bufferView",a.bufferView).then(function(f){return new Promise(function(d,m){t.parse(f,d,m)})});else{if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(f){c=!0;const d=new Blob([f],{type:a.mimeType});return l=o.createObjectURL(d),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");h=Promise.resolve(l).then(function(f){return new Promise(function(d,m){let _=d;t.isImageBitmapLoader===!0&&(_=function(g){const p=new Mt(g);p.needsUpdate=!0,d(p)}),t.load(Ps.resolveURL(f,s.path),_,void 0,m)})})}const u=h.then(function(f){return c===!0&&o.revokeObjectURL(l),Nn(f,a),f.userData.mimeType=a.mimeType||T_(a.uri),f}).catch(function(f){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),f});return this.sourceCache[e]=u,u}assignTexture(e,t,n,i){const s=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),s.extensions[Ve.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[Ve.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const l=s.associations.get(a);a=s.extensions[Ve.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),s.associations.set(a,l)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new mh,zn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new ph,zn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(i||s||a){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),s&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),s&&(l.vertexColors=!0),a&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Go}loadMaterial(e){const t=this,n=this.json,i=this.extensions,s=n.materials[e];let a;const o={},l=s.extensions||{},c=[];if(l[Ve.KHR_MATERIALS_UNLIT]){const u=i[Ve.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),c.push(u.extendParams(o,s,t))}else{const u=s.pbrMetallicRoughness||{};if(o.color=new Ne(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){const f=u.baseColorFactor;o.color.setRGB(f[0],f[1],f[2],en),o.opacity=f[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",u.baseColorTexture,Ut)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(f){return f.getMaterialType&&f.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(f){return f.extendMaterialParams&&f.extendMaterialParams(e,o)})))}s.doubleSided===!0&&(o.side=pn);const h=s.alphaMode||Ra.OPAQUE;if(h===Ra.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===Ra.MASK&&(o.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&a!==Ki&&(c.push(t.assignTexture(o,"normalMap",s.normalTexture)),o.normalScale=new Ue(1,1),s.normalTexture.scale!==void 0)){const u=s.normalTexture.scale;o.normalScale.set(u,u)}if(s.occlusionTexture!==void 0&&a!==Ki&&(c.push(t.assignTexture(o,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&a!==Ki){const u=s.emissiveFactor;o.emissive=new Ne().setRGB(u[0],u[1],u[2],en)}return s.emissiveTexture!==void 0&&a!==Ki&&c.push(t.assignTexture(o,"emissiveMap",s.emissiveTexture,Ut)),Promise.all(c).then(function(){const u=new a(o);return s.name&&(u.name=s.name),Nn(u,s),t.associations.set(u,{materials:e}),s.extensions&&Ei(i,u,s),u})}createUniqueName(e){const t=it.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function s(o){return n[Ve.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return Nc(l,o,t)})}const a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o],h=b_(c),u=i[h];if(u)a.push(u.promise);else{let f;c.extensions&&c.extensions[Ve.KHR_DRACO_MESH_COMPRESSION]?f=s(c):f=Nc(new Ct,c,t),c.mode===fn.TRIANGLE_STRIP?f=f.then(d=>Cc(d,eh)):c.mode===fn.TRIANGLE_FAN&&(f=f.then(d=>Cc(d,go))),i[h]={primitive:c,promise:f},a.push(f)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,i=this.extensions,s=n.meshes[e],a=s.primitives,o=[];for(let l=0,c=a.length;l<c;l++){const h=a[l].material===void 0?M_(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(async function(l){const c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let d=0,m=h.length;d<m;d++){const _=h[d],g=a[d];let p;const x=c[d];if(g.mode===fn.TRIANGLES||g.mode===fn.TRIANGLE_STRIP||g.mode===fn.TRIANGLE_FAN||g.mode===void 0){const y=s.isSkinnedMesh===!0,M=_.hasAttribute("skinIndex")&&_.hasAttribute("skinWeight");y&&M===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),p=y&&M?new Cf(_,x):new wt(_,x),p.isSkinnedMesh===!0&&p.normalizeSkinWeights()}else if(g.mode===fn.LINES)p=new Df(_,x);else if(g.mode===fn.LINE_STRIP)p=new ko(_,x);else if(g.mode===fn.LINE_LOOP)p=new Nf(_,x);else if(g.mode===fn.POINTS)p=new Uf(_,x);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(p.geometry.morphAttributes).length>0&&y_(p,s),p.name=t.createUniqueName(s.name||"mesh_"+e),Nn(p,s),g.extensions&&Ei(i,p,g),t.assignFinalMaterial(p),u.push(p)}for(let d=0,m=u.length;d<m;d++)t.associations.set(u[d],{meshes:e,primitives:d});if(u.length===1)return s.extensions&&Ei(i,u[0],s),u[0];const f=new vn;s.extensions&&Ei(i,f,s),t.associations.set(f,{meshes:e});for(let d=0,m=u.length;d<m;d++)f.add(u[d]);return f})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Jt(nf.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Wr(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Nn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const s=i.pop(),a=i,o=[],l=[];for(let c=0,h=a.length;c<h;c++){const u=a[c];if(u){o.push(u);const f=new Oe;s!==null&&f.fromArray(s.array,c*16),l.push(f)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new zo(o,l)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let u=0,f=i.channels.length;u<f;u++){const d=i.channels[u],m=i.samplers[d.sampler],_=d.target,g=_.node,p=i.parameters!==void 0?i.parameters[m.input]:m.input,x=i.parameters!==void 0?i.parameters[m.output]:m.output;_.node!==void 0&&(a.push(this.getDependency("node",g)),o.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",x)),c.push(m),h.push(_))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){const f=u[0],d=u[1],m=u[2],_=u[3],g=u[4],p=[];for(let y=0,M=f.length;y<M;y++){const w=f[y],E=d[y],v=m[y],T=_[y],I=g[y];if(w===void 0)continue;w.updateMatrix&&w.updateMatrix();const R=n._createAnimationTracks(w,E,v,T,I);if(R)for(let P=0;P<R.length;P++)p.push(R[P])}const x=new Qf(s,void 0,p);return Nn(x,i),x})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){const a=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=i.weights.length;l<c;l++)o.morphTargetInfluences[l]=i.weights[l]}),a})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),a=[],o=i.children||[];for(let c=0,h=o.length;c<h;c++)a.push(n.getDependency("node",o[c]));const l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(a),l]).then(function(c){const h=c[0],u=c[1],f=c[2];f!==null&&h.traverse(function(d){d.isSkinnedMesh&&d.bind(f,E_)});for(let d=0,m=u.length;d<m;d++)h.add(u[d]);if(h.userData.pivot!==void 0&&u.length>0){const d=h.userData.pivot,m=u[0];h.pivot=new z().fromArray(d),h.position.x-=d[0],h.position.y-=d[1],h.position.z-=d[2],m.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const s=t.nodes[e],a=s.name?i.createUniqueName(s.name):"",o=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),s.camera!==void 0&&o.push(i.getDependency("camera",s.camera).then(function(c){return i._getNodeRef(i.cameraCache,s.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(s.isBone===!0?h=new fh:c.length>1?h=new vn:c.length===1?h=c[0]:h=new mt,h!==c[0])for(let u=0,f=c.length;u<f;u++)h.add(c[u]);if(s.name&&(h.userData.name=s.name,h.name=a),Nn(h,s),s.extensions&&Ei(n,h,s),s.matrix!==void 0){const u=new Oe;u.fromArray(s.matrix),h.applyMatrix4(u)}else s.translation!==void 0&&h.position.fromArray(s.translation),s.rotation!==void 0&&h.quaternion.fromArray(s.rotation),s.scale!==void 0&&h.scale.fromArray(s.scale);if(!i.associations.has(h))i.associations.set(h,{});else if(s.mesh!==void 0&&i.meshCache.refs[s.mesh]>1){const u=i.associations.get(h);i.associations.set(h,{...u})}return i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,s=new vn;n.name&&(s.name=i.createUniqueName(n.name)),Nn(s,n),n.extensions&&Ei(t,s,n);const a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(i.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,u=l.length;h<u;h++){const f=l[h];f.parent!==null?s.add(qv(f)):s.add(f)}const c=h=>{const u=new Map;for(const[f,d]of i.associations)(f instanceof zn||f instanceof Mt)&&u.set(f,d);return h.traverse(f=>{const d=i.associations.get(f);d!=null&&u.set(f,d)}),u};return i.associations=c(s),s})}_createAnimationTracks(e,t,n,i,s){const a=[],o=e.name?e.name:e.uuid,l=[];function c(d){d.morphTargetInfluences&&l.push(d.name?d.name:d.uuid)}hi[s.path]===hi.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(o);let h;switch(hi[s.path]){case hi.weights:h=ks;break;case hi.rotation:h=Gs;break;case hi.translation:case hi.scale:h=Br;break;default:n.itemSize===1?h=ks:h=Br;break}const u=i.interpolation!==void 0?x_[i.interpolation]:Us,f=this._getArrayFromAccessor(n);for(let d=0,m=l.length;d<m;d++){const _=new h(l[d]+"."+hi[s.path],t.array,f,u);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(_),a.push(_)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=bo(t.constructor),i=new Float32Array(t.length);for(let s=0,a=t.length;s<a;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof Gs?__:Hh;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function A_(r,e,t){const n=e.attributes,i=new ni;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(i.set(new z(l[0],l[1],l[2]),new z(c[0],c[1],c[2])),o.normalized){const h=bo(es[o.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const s=e.targets;if(s!==void 0){const o=new z,l=new z;for(let c=0,h=s.length;c<h;c++){const u=s[c];if(u.POSITION!==void 0){const f=t.json.accessors[u.POSITION],d=f.min,m=f.max;if(d!==void 0&&m!==void 0){if(l.setX(Math.max(Math.abs(d[0]),Math.abs(m[0]))),l.setY(Math.max(Math.abs(d[1]),Math.abs(m[1]))),l.setZ(Math.max(Math.abs(d[2]),Math.abs(m[2]))),f.normalized){const _=bo(es[f.componentType]);l.multiplyScalar(_)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}r.boundingBox=i;const a=new xn;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,r.boundingSphere=a}function Nc(r,e,t){const n=e.attributes,i=[];function s(a,o){return t.getDependency("accessor",a).then(function(l){r.setAttribute(o,l)})}for(const a in n){const o=yo[a]||a.toLowerCase();o in r.attributes||i.push(s(n[a],o))}if(e.indices!==void 0&&!r.index){const a=t.getDependency("accessor",e.indices).then(function(o){r.setIndex(o)});i.push(a)}return Xe.workingColorSpace!==en&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Xe.workingColorSpace}" not supported.`),Nn(r,e),A_(r,e,t),Promise.all(i).then(function(){return e.targets!==void 0?S_(r,e.targets,t):r})}const R_=[["wall_a.jpg",!0,!0],["wall_n.jpg",!1,!0],["wall_o.jpg",!1,!0],["tile_a.jpg",!0,!1],["tile_n.jpg",!1,!1],["tile_o.jpg",!1,!1],["carpet_a.jpg",!0,!0],["carpet_n.jpg",!1,!0],["carpet_o.jpg",!1,!0],["noise.png",!1,!0],["smooth.png",!1,!0]],Vh=new WeakMap;async function C_(r,e){const t={};return await Promise.all(R_.map(async([n,i,s])=>{const a=await(await fetch(r+"tex/"+n)).blob(),o=await createImageBitmap(a,{imageOrientation:"flipY",premultiplyAlpha:"none",colorSpaceConversion:"none"}),l=new Mt(o);l.flipY=!1,l.premultiplyAlpha=!1,l.colorSpace=i?Ut:wn,l.wrapS=l.wrapT=s?Ri:Yt;const c=n.split(".")[0];if(c==="noise"?(l.minFilter=ut,l.magFilter=ut,l.generateMipmaps=!1):(l.minFilter=mn,l.magFilter=ut,l.generateMipmaps=!0,l.anisotropy=c==="smooth"?1:e),c==="smooth")try{const h=document.createElement("canvas");h.width=o.width,h.height=o.height;const u=h.getContext("2d",{willReadFrequently:!0});u.drawImage(o,0,0),Vh.set(l,{w:o.width,h:o.height,d:u.getImageData(0,0,o.width,o.height).data})}catch{}l.needsUpdate=!0,t[c]=l})),t}function Pa(r,e){const t=r.geometry,n=new Ct,i=new Oe().multiplyMatrices(e,r.matrixWorld),s=t.attributes.position.clone();s.applyMatrix4(i),n.setAttribute("position",s);const a=t.attributes.normal.clone();a.applyNormalMatrix(new Be().getNormalMatrix(i)),n.setAttribute("normal",a),t.attributes.uv&&n.setAttribute("uv",t.attributes.uv.clone());const o=t.attributes.color;if(o){const l=new Float32Array(o.count*3);for(let c=0;c<o.count;c++)l[c*3]=o.getX(c),l[c*3+1]=o.getY(c),l[c*3+2]=o.getZ(c);n.setAttribute("color",new ht(l,3))}return t.index&&n.setIndex(t.index.clone()),{geo:n,mat:r.material.name||"paint_white",color:!!o}}function La(r){const e=new Map;for(const n of r)(e.get(n.mat)||(e.set(n.mat,[]),e.get(n.mat))).push(n);const t=[];for(const[n,i]of e){const s=i.every(p=>p.color);let a=0,o=0;for(const p of i)a+=p.geo.attributes.position.count,o+=p.geo.index?p.geo.index.count:p.geo.attributes.position.count;const l=new Float32Array(a*3),c=new Float32Array(a*3),h=new Float32Array(a*3),u=new Float32Array(a*2),f=new Uint32Array(o);let d=0,m=0,_=!0;for(const p of i){const x=p.geo,y=x.attributes.position.count;if(l.set(x.attributes.position.array,d*3),c.set(x.attributes.normal.array,d*3),s&&h.set(x.attributes.color.array,d*3),x.attributes.uv?u.set(x.attributes.uv.array,d*2):_=!1,x.index)for(let M=0;M<x.index.count;M++)f[m++]=x.index.getX(M)+d;else for(let M=0;M<y;M++)f[m++]=M+d;d+=y,x.dispose()}const g=new Ct;g.setAttribute("position",new ht(l,3)),g.setAttribute("normal",new ht(c,3)),s&&g.setAttribute("color",new ht(h,3)),_&&g.setAttribute("uv",new ht(u,2)),g.setIndex(new ht(f,1)),g.computeBoundingSphere(),t.push({geo:g,mat:n,color:s})}return t}async function P_(r){const e=new Yv,t=new Oe,n=async f=>{const d=await e.parseAsync(await(await fetch(r+"models/"+f+".glb")).arrayBuffer(),"");return d.scene.updateMatrixWorld(!0),d.scene},i=["troffer","outlet","diffuser","sprinkler","fridge","figure"],s=await Promise.all([...i.map(n),n("door")]),a={};i.forEach((f,d)=>{const m=[];s[d].traverse(_=>{_.isMesh&&m.push(Pa(_,t))}),a[f]=La(m)});const o=s[i.length],l=o.getObjectByName("slab"),c=new Oe().copy(l.matrixWorld).invert(),h=[],u=[];return o.traverse(f=>{if(!f.isMesh)return;let d=f,m=!1;for(;d;)d===l&&(m=!0),d=d.parent;m?u.push(Pa(f,c)):h.push(Pa(f,t))}),{parts:a,doorFixed:La(h),doorLeaf:La(u),hinge:new z().setFromMatrixPosition(l.matrixWorld)}}const Nt=Et*ne,Xi=new Oe;class L_{constructor(e,t,n,i,s){this.scene=e,this.mats=t,this.models=n,this.ov=i;for(let a=0;a<s;a++){const o=new Worker(new URL(""+new URL("bake-Bln5YyVj.js",import.meta.url).href,import.meta.url),{type:"module"}),l={w:o,busy:null};this.workers.push(l),o.onmessage=c=>{const h=l.busy;l.busy=null,this.dead||(this.result(h,c.data),this.pump())},o.onerror=c=>{this.errors.push(String(c.message)),l.busy=null}}}scene;mats;models;ov;map=new Map;lit=[];vents=[];R=3;times=[];baked=0;errors=[];onReady=()=>{};gate=null;zero=(()=>{const e=new Qi(new Uint8Array(4),1,1);return e.needsUpdate=!0,e})();workers=[];queue=[];jobId=1;px=0;pz=0;pcx=1e9;pcz=1e9;dead=!1;get(e,t){const n=e+","+t;let i=this.map.get(n);return i||(i={cx:e,cz:t,key:n,ready:!1,job:0,queued:!1,t0:0,group:null,lm:null,lm2:null,mats:null,lens:null,fixtures:[],vents:[],flickFix:null,flickV:1,doorAmb:null,fridgeAmb:null,tris:0,small:[],fk:[],held:null},this.map.set(n,i),this.request(i)),i}request(e){e.job=this.jobId++,e.queued||(e.queued=!0,this.queue.push(e))}invalidate(e,t,n,i){for(const s of this.map.values()){const a=s.cx*Et-8,o=s.cz*Et-8;n<a||i<o||e>a+Et+16||t>o+Et+16||this.request(s)}this.pump()}update(e,t){this.px=e,this.pz=t;const n=Math.floor(e/Nt),i=Math.floor(t/Nt),s=this.R;if(n!==this.pcx||i!==this.pcz){this.pcx=n,this.pcz=i;for(const a of this.map.values()){const o=Math.max(Math.abs(a.cx-n),Math.abs(a.cz-i))<=1;for(const l of a.small)l.visible=o}}for(let a=-s;a<=s;a++)for(let o=-s;o<=s;o++)this.get(n+o,i+a);for(const a of[...this.map.values()])Math.max(Math.abs(a.cx-n),Math.abs(a.cz-i))>s+1?this.drop(a):a.held&&(!this.gate||this.gate(a))&&this.swap(a,a.held);this.pump()}pump(){if(!this.queue.length)return;const e=t=>((t.cx+.5)*Nt-this.px)**2+((t.cz+.5)*Nt-this.pz)**2;for(const t of this.workers){if(t.busy||!this.queue.length)continue;let n=0,i=1/0;for(let a=0;a<this.queue.length;a++){const o=e(this.queue[a]);o<i&&(i=o,n=a)}const s=this.queue.splice(n,1)[0];s.queued=!1,this.map.has(s.key)&&(t.busy=s,s.t0=performance.now(),t.w.postMessage({id:s.job,cx:s.cx,cz:s.cz,ov:this.ov}))}}result(e,t){if(!(!e||this.map.get(e.key)!==e)){if(t.error){this.errors.push(t.error),console.warn("[level0] bake failed",e.key,t.error);return}if(this.times.push(performance.now()-e.t0),this.baked++,t.id===e.job){if(e.group&&this.gate&&!this.gate(e)){e.held=t;return}this.swap(e,t)}}}swap(e,t){e.held=null,this.unbuild(e),this.build(e,t),e.ready=!0,this.relist(),this.onReady(e)}build(e,t){const n=new Qi(t.lm,t.lw,t.lh,sn,rn);n.minFilter=n.magFilter=ut,n.wrapS=n.wrapT=Yt,n.generateMipmaps=!1,n.colorSpace=wn,n.needsUpdate=!0;let i=null;t.lm2&&(i=new Qi(t.lm2,t.lw,t.lh,sn,rn),i.minFilter=i.magFilter=ut,i.wrapS=i.wrapT=Yt,i.generateMipmaps=!1,i.colorSpace=wn,i.needsUpdate=!0);const s=new Map;for(let p=0;p<t.fk.length;p+=2)s.set(t.fk[p]*73856093^t.fk[p+1]*19349663,Math.min(4,p/2));const a=this.mats.forChunk(n,i||this.zero),o=new vn;o.matrixAutoUpdate=!1;let l=0;for(const p of["floor","ceil","wall","base","trim"]){const x=t.g[p];if(!x.idx.length)continue;const y=new Ct;y.setAttribute("position",new ht(x.pos,3)),y.setAttribute("normal",new ht(x.nrm,3)),y.setAttribute("lm",new ht(x.uv,2)),y.setIndex(new ht(x.idx,1)),y.boundingSphere=new xn(new z((e.cx+.5)*Nt,Tt/2,(e.cz+.5)*Nt),Nt*.75);const M=new wt(y,a[p]);M.matrixAutoUpdate=!1,o.add(M),l+=x.idx.length/3}const c=t.fx.length/12;e.fixtures=[],e.flickFix=null;const h=new Float32Array(c*4),u=new Float32Array(c*3),f=new Float32Array(c*3);for(let p=0;p<c;p++){const x=p*12,y=t.fx[x],M=t.fx[x+1],w=Math.floor(y/ne),E=Math.floor(M/ne),v={i:w,j:E,x:y,z:M,state:t.fx[x+2],power:t.fx[x+3],tint:[t.fx[x+4],t.fx[x+5],t.fx[x+6]],voice:t.fx[x+7],id:w*73856093^E*19349663};e.fixtures.push(v),v.state===2&&(e.flickFix=v),h.set([v.state,v.power,s.get(v.id)||0,0],p*4),u.set(v.tint,p*3),f.set([t.fx[x+8],t.fx[x+9],t.fx[x+10]],p*3)}const d=this.mats.lens.clone();if(d.uniforms.uTime=this.mats.shared.uTime,d.uniforms.uFog=this.mats.shared.uFog,e.flickFix)for(const p of Object.values(a))p.uniforms.uFlickCol.value.set(e.flickFix.tint[0],e.flickFix.tint[1],e.flickFix.tint[2]);const m=new xn(new z((e.cx+.5)*Nt,Tt/2,(e.cz+.5)*Nt),Nt*.75);e.small=[];const _=(p,x,y,M,w=!1)=>{if(x)for(const E of p){const v=E.geo.clone();for(const[I,[R,P]]of Object.entries(M))v.setAttribute(I,new zs(R,P));const T=new dh(v,E.mat==="lens"?d:this.mats.prop(E.mat,!0,E.color),x);T.boundingSphere=m,T.matrixAutoUpdate=!1,w&&(e.small.push(T),T.visible=Math.max(Math.abs(e.cx-this.pcx),Math.abs(e.cz-this.pcz))<=1);for(let I=0;I<x;I++)y(I),T.setMatrixAt(I,Xi);T.instanceMatrix.needsUpdate=!0,o.add(T),l+=x*(v.index?v.index.count/3:0)}};_(this.models.parts.troffer,c,p=>Xi.makeTranslation(t.fx[p*12],Tt,t.fx[p*12+1]),{aFix:[h,4],aTint:[u,3],aAmb:[f,3]});const g=(p,x,y)=>{const M=p.length/x,w=new Float32Array(M*3);for(let E=0;E<M;E++)w[E*3]=p[E*x+y],w[E*3+1]=p[E*x+y+1],w[E*3+2]=p[E*x+y+2];return w};_(this.models.parts.outlet,t.ol.length/7,p=>{Xi.makeRotationY(t.ol[p*7+3]),Xi.setPosition(t.ol[p*7],t.ol[p*7+1],t.ol[p*7+2])},{aAmb:[g(t.ol,7,4),3]},!0),_(this.models.parts.diffuser,t.df.length/5,p=>Xi.makeTranslation(t.df[p*5],Tt,t.df[p*5+1]),{aAmb:[g(t.df,5,2),3]}),_(this.models.parts.sprinkler,t.sp.length/5,p=>Xi.makeTranslation(t.sp[p*5],Tt,t.sp[p*5+1]),{aAmb:[g(t.sp,5,2),3]},!0),e.vents=[];for(let p=0;p<t.df.length;p+=5)e.vents.push(t.df[p],t.df[p+1]);e.fk=[];for(let p=0;p<t.fk.length;p+=2)e.fk.push(t.fk[p]*73856093^t.fk[p+1]*19349663);e.group=o,e.lm=n,e.lm2=i,e.mats=a,e.lens=d,e.doorAmb=t.doorAmb,e.fridgeAmb=t.fridgeAmb,e.tris=l,this.scene.add(o)}unbuild(e){if(e.group){this.scene.remove(e.group);for(const t of e.group.children){const n=t;n.geometry.dispose(),n.isInstancedMesh&&n.dispose()}for(const t of Object.values(e.mats))t.dispose();e.lens.dispose(),e.lm.dispose(),e.lm2&&e.lm2.dispose(),e.lm2=null,e.group=null,e.mats=null,e.lens=null,e.lm=null,e.small=[]}}drop(e){e.held=null,this.unbuild(e),this.map.delete(e.key);const t=this.queue.indexOf(e);t>=0&&this.queue.splice(t,1),e.queued=!1,e.ready&&this.relist(),e.ready=!1}relist(){this.lit=[],this.vents=[];for(const e of this.map.values())if(e.ready){for(const t of e.fixtures)t.state!==1&&this.lit.push(t);for(const t of e.vents)this.vents.push(t)}}readyAround(e,t,n){const i=Math.floor(e/Nt),s=Math.floor(t/Nt);for(let a=-n;a<=n;a++)for(let o=-n;o<=n;o++){const l=this.map.get(i+o+","+(s+a));if(!l||!l.ready)return!1}return!0}viewDist(e,t){const n=Math.floor(e/Nt),i=Math.floor(t/Nt),s=this.R+1;let a=1/0;for(let o=-s;o<=s;o++)for(let l=-s;l<=s;l++){const c=this.map.get(n+l+","+(i+o));if(c&&c.ready)continue;const h=(n+l)*Nt,u=(i+o)*Nt;a=Math.min(a,Math.hypot(Math.max(h-e,0,e-h-Nt),Math.max(u-t,0,t-u-Nt)))}return a}pending(){let e=this.queue.length;for(const t of this.workers)t.busy&&e++;return e}dispose(){this.zero.dispose(),this.dead=!0;for(const e of this.workers)e.w.terminate();this.workers=[];for(const e of[...this.map.values()])this.drop(e);this.queue=[]}}const Wh=r=>()=>{r|=0,r=r+1831565813|0;let e=Math.imul(r^r>>>15,1|r);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296},Xh=r=>r===Kn||r===dn;class pi{constructor(e,t,n,i,s,a=!1){this.W=e,this.R=i,this.block=s;const o=this.n=2*i+1;this.i0=t-i,this.j0=n-i,this.dist=new Int16Array(o*o).fill(-1),this.q=new Int32Array(o*o),this.dist[i*o+i]=0,this.q[this.qt++]=i*o+i,a||this.run(1/0)}W;R;block;n;i0;j0;dist;count=0;done=!1;q;qh=0;qt=0;run(e){const t=this.n,n=this.dist,i=this.q,s=this.W,a=this.block,o=(l,c,h,u)=>{if(l<0||c<0||l>=t||c>=t||!Xh(h))return;const f=c*t+l;if(n[f]>=0)return;const d=this.i0+l,m=this.j0+c;s.solid(d,m)||a&&a(d,m)||(n[f]=u,i[this.qt++]=f)};for(;this.qh<this.qt&&e-- >0;){const l=i[this.qh++],c=l%t,h=(l-c)/t,u=this.i0+c,f=this.j0+h,d=n[l]+1;this.count++,o(c+1,h,s.edge(u+1,f,1),d),o(c-1,h,s.edge(u,f,1),d),o(c,h+1,s.edge(u,f+1,0),d),o(c,h-1,s.edge(u,f,0),d)}return this.done=this.qh>=this.qt}at(e,t){const n=e-this.i0,i=t-this.j0;return n<0||i<0||n>=this.n||i>=this.n?-1:this.dist[i*this.n+n]}}const qh=[[1,0,1,0,1,-1],[-1,0,0,0,1,1],[0,1,0,1,0,-1],[0,-1,0,0,0,1]];function I_(r,e,t,n,i=!1){const s=[];for(let a=2;a<e.n-2;a++)for(let o=2;o<e.n-2;o++){const l=e.dist[a*e.n+o];if(l<t||l>n)continue;const c=e.i0+o,h=e.j0+a;for(const[u,f,d,m,_,g]of qh){const p=r.edge(c+d,h+m,_);if(i?p===ji:p!==Ft)continue;const x=c+u,y=h+f;if(r.fixture(x,y)||r.diffuser(x,y)||r.solid(x,y)||r.column(x,y)||r.column(x+1,y)||r.column(x,y+1)||r.column(x+1,y+1))continue;const M=_===1?r.edge(u>0?c:c+1,h,1):r.edge(c,f>0?h:h+1,0);!Xh(M)||e.at(c-u,h-f)<0||s.push({i:c+d,j:h+m,dir:_,side:g,ai:c,aj:h,bi:x,bj:y,d:l})}}return s}function D_(r){const e=[[r.bi,r.bj,0,Ft],[r.bi,r.bj+1,0,Ft],[r.bi,r.bj,1,Ft],[r.bi+1,r.bj,1,Ft]];for(const t of e)t[0]===r.i&&t[1]===r.j&&t[2]===r.dir&&(t[3]=ji);return e}const Yh=r=>r.dir===0?[(r.i+.5)*ne,r.j*ne,0,r.side]:[r.i*ne,(r.j+.5)*ne,r.side,0];function N_(r,e,t,n){const i=[];for(let s=2;s<e.n-2;s++)for(let a=2;a<e.n-2;a++){const o=e.dist[s*e.n+a];if(o<t||o>n)continue;const l=e.i0+a,c=e.j0+s;if(r.column(l,c)||r.column(l+1,c)||r.column(l,c+1)||r.column(l+1,c+1))continue;const h=[];let u=0;for(const[f,d,m,_,g]of qh){const p=r.edge(l+m,c+_,g);p===Ft?(h.push([f,d]),u++):p!==Kn&&(u+=9)}u===1&&i.push({i:l,j:c,wx:h[0][0],wz:h[0][1],d:o})}return i}function Lr(r,e,t,n,i,s,a=!1,o,l=!1){const c=I_(r,t,i,s,a),h=t.i0+t.R,u=t.j0+t.R,f=l?Math.min(t.R,s+8):t.R,d=e.fridge;for(let g=c.length-1;g>0;g--){const p=Math.floor(n()*(g+1)),x=c[g];c[g]=c[p],c[p]=x}const m=e.door,_=[];if(m){const g=m.dir===1&&m.side>0?m.i-1:m.i,p=m.dir===0&&m.side>0?m.j-1:m.j;_.push([g,p,0],[g,p+1,0],[g,p,1],[g+1,p,1])}for(const g of c.slice(0,40)){if(o&&o(g)||e.edges.some(y=>!_.some(M=>M[0]===y[0]&&M[1]===y[1]&&M[2]===y[2])&&Math.abs(y[0]-g.bi)<3&&Math.abs(y[1]-g.bj)<3)||d&&Math.max(Math.abs(d.i-g.bi),Math.abs(d.j-g.bj))<4||Math.max(Math.abs(g.bi-h),Math.abs(g.bj-u))<2)continue;const p={...e,edges:[...e.edges.filter(y=>!_.some(M=>M[0]===y[0]&&M[1]===y[1]&&M[2]===y[2])),...D_(g)],solid:[[g.bi,g.bj]],door:{i:g.i,j:g.j,dir:g.dir,side:g.side}};r.setOverrides(p);const x=new pi(r,h,u,f,d?(y,M)=>y===d.i&&M===d.j:void 0);if(x.at(g.ai,g.aj)>=0&&(l||x.count>t.count*.7))return{ov:p,spot:g};r.setOverrides(e)}return null}function U_(r){const e=Wh(r^1374496523);let t={seed:r,edges:[],solid:[],epochs:[],door:null,fridge:null,dyn:[],dead:[]};const n=new _v(t);let i=0,s=0,a,o=0;for(let m=0;m<60&&(o++,i=Math.floor((e()-.5)*60),s=Math.floor((e()-.5)*60),!(!(n.column(i,s)||n.column(i+1,s)||n.column(i,s+1)||n.column(i+1,s+1))&&(a=new pi(n,i,s,64),a.count>3500)));m++);const l=(i+.5)*ne+(e()-.5)*.3,c=(s+.5)*ne+(e()-.5)*.3,h=Lr(n,t,a,e,24,42)||Lr(n,t,a,e,12,58)||Lr(n,t,a,e,5,63,!0);let u=null;h&&(t=h.ov,u=h.spot);const f=N_(n,a,22,60);let d=null;for(let m=f.length-1;m>0;m--){const _=Math.floor(e()*(m+1)),g=f[m];f[m]=f[_],f[_]=g}for(const m of f.slice(0,40)){if(u&&Math.max(Math.abs(m.i-u.ai),Math.abs(m.j-u.aj))<14)continue;const _=new pi(n,i,s,64,(g,p)=>g===m.i&&p===m.j);if(!(u&&_.at(u.ai,u.aj)<0)){t.fridge={i:m.i,j:m.j},d=m;break}}return n.setOverrides(t),{world:n,ov:t,si:i,sj:s,x:l,z:c,spot:u,fspot:d,flood:a,tries:o}}const F_="varying vec3 vL; void main(){ vL = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",O_=`varying vec3 vL; uniform float uZ;
void main(){ vec3 q = (vL - vec3(0.12, 1.02, uZ)) * vec3(1.0, 1.25, 1.5); float g = exp(-dot(q, q) * 4.2);
  gl_FragColor = vec4(vec3(0.000010, 0.000014, 0.000022) + vec3(0.34, 0.56, 1.0) * 0.0011 * g, 1.0); }`,Ko="varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",Zo=`varying vec2 vUv; uniform vec2 uSize, uFoot; uniform float uK;
void main(){ vec2 p = (vUv - 0.5) * uSize; vec2 d = max(abs(p) - uFoot, 0.0); float r = length(d);
  float a = uK * pow(1.0 - smoothstep(0.0, 0.34, r), 2.2); a = max(a, step(r, 0.0001) * 0.9 * step(0.5, uK)); gl_FragColor = vec4(0.0, 0.0, 0.0, a); }`;function To(r,e,t){const n=new vn;for(const i of r){const s=e.prop(i.mat,!1,i.color).clone(),a=e.shared;s.uniforms.uL=a.uL,s.uniforms.uLC=a.uLC,s.uniforms.uFog=a.uFog,t.push(s);const o=new wt(i.geo,s);o.frustumCulled=!1,n.add(o)}return n}class z_{group=new vn;slab;angle=.21;vel=0;target=.21;x=0;z=0;nx=0;nz=1;ax=1;az=0;placed=!1;box={x0:0,z0:0,x1:0,z1:0};stale=[];own=[];voidMat;voidGeo;opened=!1;constructor(e,t){this.group.add(To(e.doorFixed,t,this.own)),this.slab=To(e.doorLeaf,t,this.own),this.slab.position.copy(e.hinge),this.group.add(this.slab);const n=.016,i=-ne/2+wi/2+n,s=ne/2-wi/2-n,a=wi/2+.002,o=ne-wi/2-n,l=n,c=Tt-n,h=[[i,l,o],[s,l,o],[s,c,o],[i,c,o],[i,l,a],[i,c,a],[s,l,a],[s,c,a]],u=[[0,1,2,3],[4,0,3,5],[1,6,7,2],[4,6,1,0],[5,3,2,7]],f=[],d=[];for(const _ of u){const g=f.length/3;for(const p of _)f.push(...h[p]);d.push(g,g+1,g+2,g,g+2,g+3)}this.voidGeo=new Ct,this.voidGeo.setAttribute("position",new ht(new Float32Array(f),3)),this.voidGeo.setIndex(d),this.voidMat=new Vt({vertexShader:F_,fragmentShader:O_,side:pn,uniforms:{uZ:{value:o}}});const m=new wt(this.voidGeo,this.voidMat);m.frustumCulled=!1,this.group.add(m),this.group.visible=!1}place(e){const[t,n,i,s]=Yh(e);this.x=t,this.z=n,this.nx=i,this.nz=s,this.ax=e.dir===0?1:0,this.az=e.dir===0?0:1,this.group.position.set(t,0,n),this.group.rotation.y=Math.atan2(-i,-s),this.group.visible=!0,this.placed=!0,this.angle=this.target=.21,this.vel=0,this.opened=!1,this.slab.rotation.y=-this.angle;const a=.914/2,o=wi/2+.02;this.stale.push(this.box),this.box=e.dir===0?{x0:t-a,x1:t+a,z0:n-o,z1:n+o}:{x0:t-o,x1:t+o,z0:n-a,z1:n+a}}setAmb(e){for(const t of this.own)t.uniforms.uAmb.value.set(e[0],e[1],e[2])}placeAt(e,t,n,i,s,a){this.x=e,this.z=t,this.nx=n,this.nz=i,this.ax=s===0?1:0,this.az=s===0?0:1,this.group.position.set(e,0,t),this.group.rotation.y=Math.atan2(-n,-i),this.group.visible=!0,this.placed=!0,this.angle=this.target=.21,this.vel=0,this.opened=!1,this.slab.rotation.y=-this.angle;const o=.914/2,l=a/2+.02;this.stale.push(this.box),this.box=s===0?{x0:e-o,x1:e+o,z0:t-l,z1:t+l}:{x0:e-l,x1:e+l,z0:t-o,z1:t+o}}useLights(e){for(const t of this.own)t.uniforms.uL=e.uL,t.uniforms.uLC=e.uLC,t.uniforms.uFog=e.uFog}update(e,t,n,i){if(!this.placed)return 0;for(const f of this.stale){const d=i.indexOf(f);d>=0&&i.splice(d,1)}this.stale.length=0;const s=(t-this.x)*this.nx+(n-this.z)*this.nz,a=Math.abs((t-this.x)*this.ax+(n-this.z)*this.az);let o=0;const l=s>-.3&&s<1.75&&a<1.3,c=this.target;this.target=l?1.52:s>3.2||a>3?.21:this.target,this.target>1&&c<1&&(o=1);const h=this.target>this.angle?9:3.2;this.vel+=((this.target-this.angle)*h-this.vel*5.2)*e,this.angle=Math.min(1.56,Math.max(0,this.angle+this.vel*e)),this.slab.rotation.y=-this.angle;const u=i.indexOf(this.box);return this.angle<1.05?u<0&&i.push(this.box):u>=0&&i.splice(u,1),this.angle>1.05&&(this.opened=!0),s<-.16&&s>-1.2&&a<.5&&(o=2),o}dispose(){for(const e of this.own)e.dispose();this.voidMat.dispose(),this.voidGeo.dispose()}}class B_{group=new vn;x=0;z=0;placed=!1;box={x0:0,z0:0,x1:0,z1:0};own=[];sm=[];sg;constructor(e,t){this.group.add(To(e.parts.fridge,t,this.own)),this.sg=new vi(1,1);const n=(a,o,l,c,h)=>{const u=new Vt({vertexShader:Ko,fragmentShader:Zo,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,uniforms:{uSize:{value:new Ue(a,o)},uFoot:{value:new Ue(l,c)},uK:{value:h}}});this.sm.push(u);const f=new wt(this.sg,u);return f.scale.set(a,o,1),f.renderOrder=2,f},i=n(1.5,1.5,.37,.33,.62);i.rotation.x=-Math.PI/2,i.position.set(0,.004,.02),this.group.add(i);const s=n(1.5,2.3,.36,.84,.36);s.position.set(0,.86,-.398),this.group.add(s),this.group.visible=!1}place(e){const t=ne/2-wi/2-.05-.35;this.x=(e.i+.5)*ne+e.wx*t,this.z=(e.j+.5)*ne+e.wz*t,this.group.position.set(this.x,0,this.z),this.group.rotation.y=Math.atan2(-e.wx,-e.wz);const n=e.wx?.36:.39,i=e.wz?.36:.39;this.box={x0:this.x-n,x1:this.x+n,z0:this.z-i,z1:this.z+i},this.group.visible=!0,this.placed=!0}setAmb(e){for(const t of this.own)t.uniforms.uAmb.value.set(e[0],e[1],e[2])}dispose(){for(const e of this.own)e.dispose();for(const e of this.sm)e.dispose();this.sg.dispose()}}const j=(r,e)=>r+Math.random()*(e-r),at=r=>r[Math.floor(Math.random()*r.length)],k_=r=>{for(;r>Math.PI;)r-=2*Math.PI;for(;r<-Math.PI;)r+=2*Math.PI;return r},Tn=(r,e,t)=>{const n=Math.min(1,Math.max(0,(t-r)/(e-r)));return n*n*(3-2*n)},yr=r=>{const e=Math.sin(r*127.1+311.7)*43758.5453;return e-Math.floor(e)},br=Et*ne,G_="attribute vec3 color; varying vec3 vP; varying vec3 vN; varying float vAo; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vP = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vAo = color.r; gl_Position = projectionMatrix * viewMatrix * w; }",H_=`uniform vec3 uAmb; uniform vec4 uFog; uniform float uK; varying vec3 vP; varying vec3 vN; varying float vAo;
void main(){ vec3 V = normalize(cameraPosition - vP); float nv = abs(dot(normalize(vN), V)); float a = smoothstep(0.04, 0.42, nv) * uK;
  vec3 c = uAmb * 0.028 * vAo / 3.14159; float d = length(vP - cameraPosition); c = mix(c, uFog.rgb, smoothstep(uFog.w * 0.72, uFog.w, d)); a *= 1.0 - smoothstep(uFog.w * 0.8, uFog.w, d);
  gl_FragColor = vec4(c, a); }`;class V_{group=new vn;mat;sh;sg=new vi(1,1);x=0;z=0;up=!1;constructor(e){const t=e.models.parts.figure[0];this.mat=new Vt({vertexShader:G_,fragmentShader:H_,transparent:!0,depthWrite:!0,uniforms:{uAmb:{value:new z(.05,.05,.04)},uFog:e.mats.shared.uFog,uK:{value:.94}}});const n=new wt(t.geo,this.mat);n.frustumCulled=!1,n.renderOrder=3,this.group.add(n),this.sh=new Vt({vertexShader:Ko,fragmentShader:Zo,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,uniforms:{uSize:{value:new Ue(1,.9)},uFoot:{value:new Ue(.1,.06)},uK:{value:.42}}});const i=new wt(this.sg,this.sh);i.scale.set(1,.9,1),i.rotation.x=-Math.PI/2,i.position.y=.004,i.renderOrder=2,this.group.add(i),this.group.visible=!1,e.scene.add(this.group)}show(e,t,n,i){this.x=e,this.z=t,this.group.position.set(e,0,t),this.group.rotation.y=n,this.mat.uniforms.uAmb.value.set(i,i*.9,i*.62),this.group.visible=!0,this.up=!0}hide(){this.group.visible=!1,this.up=!1}dispose(e){e.scene.remove(this.group),this.mat.dispose(),this.sh.dispose(),this.sg.dispose()}}class W_{constructor(e){this.h=e,this.activity=Math.random()<.2?j(.12,.3):Math.min(2,Math.max(.55,Math.exp((Math.random()+Math.random()+Math.random()-1.5)*.75))),this.next=j(38,95)/Math.sqrt(this.activity);const t=(n,i,s,a,o,l)=>this.defs.push({name:n,cat:i,tier:s,w:a,cool:o,make:l});t("tape_streaks","tape",0,14,8,()=>this.tStreaks()),t("tape_tracking","tape",0,9,20,()=>this.tTracking()),t("tape_chroma","tape",0,7,25,()=>this.tChroma()),t("tape_level","tape",0,5,30,()=>this.tLevel()),t("tape_dropout","tape",1,7,30,()=>this.tDropout()),t("tape_flagging","tape",1,5,40,()=>this.tFlag()),t("tape_vsync","tape",1,4,45,()=>this.tVsync()),t("tape_crease","tape",1,3,70,()=>this.tCrease()),t("tape_freeze","tape",1,2.5,60,()=>this.tFreeze()),t("tape_skip","tape",2,2,150,()=>this.tSkip()),t("audio_dropout","audio",0,5,30,()=>this.aDrop()),t("audio_static","audio",1,3,45,()=>this.aStatic()),t("audio_muffle","audio",0,4,40,()=>this.aMuffle()),t("audio_level","audio",0,5,30,()=>this.aLevel()),t("focus_hunt","cam",0,4,50,()=>this.cFocus()),t("light_flicker","light",0,10,25,()=>this.lFlicker()),t("light_dim","light",0,5,30,()=>this.lDim()),t("light_hum","light",1,4,60,()=>this.lHum()),t("light_fail","light",1,4,60,()=>this.lFail()),t("light_group","light",1,2.5,120,()=>this.lGroup()),t("light_off","light",2,2.5,180,()=>this.lOff()),t("light_wake","light",2,1,240,()=>this.lWake()),t("sound_mechanical","sound",1,6,60,()=>this.sMech()),t("sound_faint","sound",1,5,60,()=>this.sFaint()),t("sound_wall","sound",1,4,70,()=>this.sWall()),t("hum_quiet","room",1,2.5,120,()=>this.rQuiet()),t("room_tone","room",1,3,120,()=>this.rTone()),t("air_stops","room",2,1.2,300,()=>this.rAir()),t("figure","figure",2,9,150,()=>this.fStand(!1)),t("figure_far","figure",2,3,240,()=>this.fStand(!0)),t("figure_crossing","figure",3,1,400,()=>this.fCross()),t("shadow_wrong","figure",3,1.2,300,()=>this.fShadow()),t("heavy_steps","steps",2,7,200,()=>this.hSteps()),t("plan_change","plan",3,1,400,()=>this.pChange()),this.figure(),this.makeDecal()}h;log=[];live=[];enabled=!0;activity;defs=[];last=new Map;next;fig=null;lastFig=[1e9,1e9];decal=null;queued=[];dynAge=new Map;sweep=[];wantFig=-1;wantFar=!1;wantTry=0;fN=1;names(){return this.defs.map(e=>e.name)}busy(e){return this.live.some(t=>t.def.cat===e)}start(e,t){if(this.busy(e.cat))return!1;const n=e.make();return n?(this.live.push({def:e,run:n,t:0}),this.last.set(e.name,this.h.t),this.log.push({t:+this.h.t.toFixed(2),name:e.name,note:t}),this.log.length>400&&this.log.shift(),!0):!1}force(e){const t=this.defs.find(n=>n.name===e);return!!t&&this.start(t,"forced")}update(e){const t=this.h,n=t.t;t.post.clearFx();for(let a=this.live.length-1;a>=0;a--){const o=this.live[a];o.t+=e;let l=!1;try{l=o.run.step(e,o.t)}catch(c){console.warn("[level0] event",o.def.name,c)}if(!l){try{o.run.end&&o.run.end()}catch{}this.live.splice(a,1)}}for(let a=this.sweep.length-1;a>=0;a--)n>=this.sweep[a].at&&t.chunks.pending()===0&&(t.lightCtl.delete(this.sweep[a].id),this.sweep.splice(a,1));for(let a=this.queued.length-1;a>=0;a--)if(n>=this.queued[a].at){const o=this.queued.splice(a,1)[0],l=this.defs.find(c=>c.name===o.name);l&&this.start(l,"with another")}if(this.wantFig>n&&n>this.wantTry&&this.enabled){this.wantTry=n+.5;const a=this.defs.find(o=>o.name===(this.wantFar?"figure_far":"figure"));!this.busy("figure")&&!this.live.some(o=>o.def.tier>=2)&&(this.fN=.35,this.start(a,"waited"))&&(this.wantFig=-1),this.fN=1}if(!this.enabled||n<this.next)return;const i=this.defs.filter(a=>!this.busy(a.cat)&&n-(this.last.get(a.name)??-1e9)>a.cool&&!(a.tier>=2&&this.live.some(o=>o.def.tier>=2)));let s=!1;for(let a=0;a<5&&i.length&&!s;a++){let o=Math.random()*i.reduce((h,u)=>h+u.w,0),l=0;for(;l<i.length-1&&(o-=i[l].w)>0;)l++;const c=i.splice(l,1)[0];if(s=this.start(c),!s&&(c.name==="figure"||c.name==="figure_far")&&(this.wantFig=n+j(25,80),this.wantFar=c.name==="figure_far"),s&&Math.random()<.035){const h=this.defs.filter(u=>u.cat!==c.cat&&u.tier<=2&&!this.busy(u.cat));h.length&&this.queued.push({at:n+j(.3,4),name:at(h).name})}}this.next=n+(s?Math.max(16,-Math.log(1-Math.random())*62/this.activity)+(Math.random()<.15?j(60,170):0):j(5,11))}dispose(){for(const t of this.live)try{t.run.end&&t.run.end()}catch{}this.live=[],this.queued=[],this.sweep=[],this.h.post.clearFx(),this.h.lightCtl.clear();const e=this.h.audio;e.humMul=e.hvacMul=e.revMul=1,e.detune=0,e.revBias=[0,0,0,0],e.mods.clear(),this.fig&&(this.fig.dispose(this.h),this.fig=null),this.decal&&(this.h.scene.remove(this.decal),this.decal.material.dispose(),this.decal.geometry.dispose(),this.decal=null)}ang(e,t,n){const i=this.h.view();return k_(Math.atan2(-(e-i.x),-(t-i.z))-n)}los(e,t,n,i=this.h.region){const s=this.h.view();return!$t(i,s.x,s.y,s.z,e,t,n)}timed(e,t,n){return{step:(i,s)=>(t(Math.min(1,s/e),s,i),s<e),end:n}}wall(e,t,n,i,s){const a=this.h.region;let o=Math.floor(e/ne),l=Math.floor(t/ne);const c=n>0?1:-1,h=i>0?1:-1;let u=n!==0?((o+(c>0?1:0))*ne-e)/n:1/0,f=i!==0?((l+(h>0?1:0))*ne-t)/i:1/0;const d=n!==0?ne/Math.abs(n):1/0,m=i!==0?ne/Math.abs(i):1/0;for(let _=0;_<60;_++)if(u<f){const g=Jn(a,c>0?o+1:o,l),p=u;if(o+=c,u+=d,p>s)return null;if(g===Ft)return{t:p,nx:-c,nz:0}}else{const g=$n(a,o,h>0?l+1:l),p=f;if(l+=h,f+=m,p>s)return null;if(g===Ft)return{t:p,nx:0,nz:-h}}return null}open(e,t,n=.34){const i=this.h.region,s=Math.floor(e/ne),a=Math.floor(t/ne),o=e-s*ne,l=t-a*ne;if(this.h.world.solid(s,a)||Jn(i,s,a)&&o<n||Jn(i,s+1,a)&&ne-o<n||$n(i,s,a)&&l<n||$n(i,s,a+1)&&ne-l<n)return!1;for(let c=0;c<2;c++)for(let h=0;h<2;h++)if(($n(i,s+c,a+h)||$n(i,s+c-1,a+h)||Jn(i,s+c,a+h)||Jn(i,s+c,a+h-1))&&Math.hypot(o-c*ne,l-h*ne)<n+.1)return!1;return!0}nearLit=null;lastTry=null;lightAt(e,t){let n=0;for(const i of this.nearLit||this.h.chunks.lit){const s=(i.x-e)**2+(i.z-t)**2;s<60&&(n+=i.power*.3025*1.2/Math.pow(s+1.44,1.5)*(this.h.lightCtl.get(i.id)??1))}return n}fixtures(e,t,n,i=!1,s=!0){const a=this.h,o=a.view(),l=o.hfov/2,c=[];for(const h of a.chunks.map.values())if(h.ready)for(const u of h.fixtures){if(i?u.state!==1:u.state!==0)continue;const f=Math.hypot(u.x-o.x,u.z-o.z);if(f<e||f>t||a.lightCtl.has(u.id))continue;const d=Math.abs(this.ang(u.x,u.z,o.yaw));(n?d>l*.95:d>2.2)||s&&!this.los(u.x,Tt-.05,u.z)||this.clear(u)&&c.push(u)}return c}clear(e){for(const t of this.h.chunks.map.values()){const n=t.cx*br-8.4,i=t.cz*br-8.4;if(!(e.x<n||e.z<i||e.x>n+br+16.8||e.z>i+br+16.8)&&(t.fk.length>=5&&!t.fk.includes(e.id)||t.held))return!1}return!0}arm(e){const t=this.h,n=t.ov;n.dyn=n.dyn||[];let i=1e9,s=1e9,a=-1e9,o=-1e9,l=!1;for(const c of e){i=Math.min(i,c.i),s=Math.min(s,c.j),a=Math.max(a,c.i),o=Math.max(o,c.j);const h=c.i+","+c.j;this.dynAge.set(h,t.t),t.everDyn.add(c.id),!n.dyn.some(u=>u[0]===c.i&&u[1]===c.j)&&c.state!==2&&(n.dyn.push([c.i,c.j]),l=!0)}return l&&(t.applyOv(),t.chunks.invalidate(i,s,a,o)),()=>{if(t.chunks.pending()>0)return!1;for(const c of e){const h=t.chunks.map.get(Math.floor(c.i/Et)+","+Math.floor(c.j/Et));if(!h||!h.ready||h.held||!h.fk.includes(c.id))return!1}return!0}}lit(e,t,n,i,s=1){const a=this.h;for(const h of e)a.lightCtl.set(h.id,s);const o=this.arm(e);let l=-1,c=0;return{step:(h,u)=>{if(l<0){if(c+=h,c>14)return!1;if(!o())return!0;l=u}const f=u-l;return n(Math.min(1,f/t),f),f<t},end:()=>{for(const h of e)a.audio.mods.delete(h.id);if(i)i();else for(const h of e)a.lightCtl.delete(h.id);this.release(e)}}}release(e){const t=this.h,n=t.ov.dyn||[];let i=1e9,s=1e9,a=-1e9,o=-1e9,l=!1;for(const c of e){const h=n.findIndex(u=>u[0]===c.i&&u[1]===c.j);h<0||(n.splice(h,1),l=!0,i=Math.min(i,c.i),s=Math.min(s,c.j),a=Math.max(a,c.i),o=Math.max(o,c.j))}l&&(t.applyOv(),t.chunks.invalidate(i,s,a,o))}stutter(e,t,n=.12){const i=Math.floor(e*5),s=yr(i*3.77+t),a=yr(i*9.1+t+4);return s<.45?n+(.5-n)*a:s<.62?.75:1}tStreaks(){const e=j(.07,.3),t=j(.004,.03),n=Math.random()<.3;return this.timed(e,i=>{const s=this.h.post.fx;s.drop=t,n&&(s.chroma=Math.min(s.chroma,.35))})}tTracking(){const e=Math.random()<.7?j(.04,.2):j(.75,.95),t=j(.3,1.6),n=j(-.12,.12),i=j(.35,1),s=Math.random()<.4?j(-14,14):0;return this.timed(t,(a,o)=>{const l=this.h.post.fx,c=Math.sin(Math.PI*a)**.6;l.glitch=i*c,l.track=e+n*o,s&&(l.tearY=e+n*o-.05,l.tearH=.09,l.tear=s*c)})}tChroma(){const e=j(.25,1.3),t=Math.random()<.4?0:j(.15,.55),n=j(-.5,.5),i=j(.2,1),s=Math.random()*99;return this.timed(e,(a,o)=>{const l=this.h.post.fx,c=Math.sin(Math.PI*a)**.5;l.chroma=1-(1-t)*c*(.7+.3*yr(Math.floor(o*12)+s)),l.hue=n*c*Math.sin(o*9+s),l.bleed=i*c})}tLevel(){const e=j(.3,1.3),t=at([-1,1])*j(.12,.3),n=Math.random()*99;return this.timed(e,(i,s)=>{this.h.post.fx.level=1+t*Math.sin(Math.PI*i)*(.6+.4*Math.sin(s*17+n))})}tDropout(){const e=this.h,t=j(.05,.22),n=at(["black","black","snow","part"]),i=j(.25,.7),s=j(.1,.7),a=j(.12,.4),o=Math.random()<.6?j(.01,.05)*at([-1,1]):0,l=j(-.25,.3);return Math.random()<.7&&e.audio.recDrop(t+j(0,.08),Math.random()<.5?0:.15),this.timed(t+i,(c,h)=>{const u=e.post.fx;if(h<t)n==="black"?u.black=1:n==="snow"?(u.snow=.92,u.chroma=0):(u.bandY=s+a/2,u.bandH=a/2,u.band=1,u.chroma=.2);else{const f=1-(h-t)/i;u.vshift=o*f*f*Math.cos((h-t)*30),u.level=1+l*f*f,u.chroma=1-.6*f*f,u.drop=.004*f}})}tFlag(){const e=j(.5,2.6),t=j(.25,1)*at([-1,1]),n=Math.random()*9;return this.timed(e,(i,s)=>{this.h.post.fx.flag=t*Math.sin(Math.PI*i)**.7*(.75+.25*Math.sin(s*6+n))})}tVsync(){const e=j(.12,.5),t=j(.02,.16)*at([-1,1]),n=Math.random()<.25;return this.timed(e,(i,s)=>{const a=this.h.post.fx;a.vshift=n?t*4*i:t*(1-i)*(1-i),a.drop=.003})}tCrease(){const e=Math.random()<.5?1:Math.floor(j(2,4)),t=j(.45,1),n=j(.15,.6),i=j(.03,.09),s=j(.55,1),a=at([-1,1]);return Math.random()<.4&&this.h.audio.recMuffle(e*(t+n),j(700,1800)),this.timed(e*(t+n),(o,l)=>{const c=this.h.post.fx,h=l%(t+n);if(h<t){const u=h/t;c.bandY=a>0?1.1-1.2*u:-.1+1.2*u,c.bandH=i,c.band=s}})}tFreeze(){const e=j(.05,.14),t=.12;return this.timed(e+t,(n,i)=>{const s=this.h.post.fx;i<e?s.freeze=!0:(s.glitch=.8*(1-(i-e)/t),s.track=.5,s.drop=.01)})}tSkip(){const e=this.h,t=j(.08,.2);let n=!1;return e.audio.recDrop(t,0),this.timed(t+.3,(i,s)=>{const a=e.post.fx;if(s<t){if(a.black=1,!n&&s>t*.5){n=!0;const o=e.rig,l=j(.02,.05)*at([-1,1]),c=j(.1,.24),h=Math.hypot(o.vx,o.vz),u=h>.3?o.vx/h:-Math.sin(o.yaw),f=h>.3?o.vz/h:-Math.cos(o.yaw);this.open(o.x+u*c,o.z+f*c,.36)&&this.open(o.x+u*c*.5,o.z+f*c*.5,.36)&&(o.x+=u*c,o.z+=f*c),o.yaw+=l,o.yawT+=l,o.pitch+=j(-.015,.015)}}else{const o=1-(s-t)/.3;a.vshift=.03*o*o*Math.cos(s*40),a.chroma=1-.7*o,a.level=1+.2*o}})}aDrop(){return this.h.audio.recDrop(j(.07,.35),Math.random()<.6?0:j(.1,.3)),this.timed(.5,()=>{})}aStatic(){return this.h.audio.tapeStatic("static"+Math.floor(Math.random()*3),j(3.5,5.5)),Math.random()<.35&&this.queued.push({at:this.h.t,name:"tape_streaks"}),this.timed(.5,()=>{})}aMuffle(){const e=j(.4,1.6);return this.h.audio.recMuffle(e,j(600,1500)),this.timed(e+.4,()=>{})}aLevel(){const e=j(.5,2);return this.h.audio.recLevel(Math.random()<.5?j(.45,.75):j(1.25,1.6),e),this.timed(e+.8,()=>{})}cFocus(){const e=this.h.rig,t=j(.7,1.5),n=Math.random()<.5?1/.45:1/30;let i=!1;return this.timed(t,s=>{!i&&s<.3?(e.fInv+=(n-e.fInv)*.1,e.fDelay=.23):i=!0})}lFlicker(){const e=at(this.fixtures(4,20,Math.random()<.8));if(!e)return null;const t=j(.7,3.2),n=Math.random()*99,i=j(.08,.4),s=j(.5,1.3);return this.lit([e],t+.6,(a,o)=>{const l=o<t?this.stutter(o,n,i):.8+.2*Math.min(1,(o-t)/.6);this.h.lightCtl.set(e.id,l),this.h.audio.mods.set(e.id,{gain:1.15,rate:1+.004*Math.sin(o*7),buzz:o<t?s:s*(1-(o-t)/.6)})})}lDim(){const e=at(this.fixtures(4,20,Math.random()<.7));if(!e)return null;const t=j(3,11),n=j(.35,.72),i=j(.985,.996),s=Math.random()*9;return this.lit([e],t,(a,o)=>{const l=Tn(0,.5,o)*(1-Tn(t-1.2,t,o));this.h.lightCtl.set(e.id,1-(1-n)*l*(.93+.07*Math.sin(o*2.3+s))),this.h.audio.mods.set(e.id,{gain:1+.35*l,rate:1-(1-i)*l,buzz:.35*l})})}lHum(){const e=at(this.fixtures(1.5,9,!1));if(!e)return null;const t=j(18,55),n=at([j(.955,.985),j(1.012,1.04)]),i=j(1.5,2.2),s=this.h.audio;return{step:(a,o)=>{const l=Tn(0,4,o)*(1-Tn(t-5,t,o));return s.mods.set(e.id,{gain:1+(i-1)*l,rate:1+(n-1)*l,buzz:.25*l}),o<t},end:()=>{s.mods.delete(e.id)}}}lFail(){const e=at(this.fixtures(5,22,Math.random()<.75));if(!e)return null;const t=j(4,24),n=Math.random()*99,i=j(.2,.9),s=j(.6,1.8);return this.lit([e],i+t+s,(a,o)=>{const l=o<i?this.stutter(o,n,.2):o<i+t?0:o<i+t+s?this.stutter(o,n+5,.05):1;this.h.lightCtl.set(e.id,l),this.h.audio.mods.set(e.id,{gain:1,rate:1,buzz:o>i+t?.9:.4})})}lGroup(){const e=at(this.fixtures(3,22,!1)),t=this.fixtures(2,26,!1,!1,!1);if(!e)return null;this.h.view();const n=at([1,0]),i=t.filter(c=>n?Math.abs(c.z-e.z)<1.3:Math.abs(c.x-e.x)<1.3).sort((c,h)=>n?c.x-h.x:c.z-h.z).slice(0,6);if(i.length<3)return null;Math.random()<.5&&i.reverse();const s=j(.12,.3),a=j(.35,.9),o=Math.random()*99,l=j(.1,.45);return this.lit(i,s*i.length+a+.3,(c,h)=>{i.forEach((u,f)=>{const d=h-f*s,m=d>0&&d<a;this.h.lightCtl.set(u.id,m?this.stutter(d,o+f,l):1),m?this.h.audio.mods.set(u.id,{gain:1.2,rate:.995,buzz:.8}):this.h.audio.mods.delete(u.id)})})}lOff(){const e=at(this.fixtures(10,30,!0));if(!e)return null;const t=this.h;return this.lit([e],1.2,(n,i)=>{t.lightCtl.set(e.id,i<.25?yr(Math.floor(i*5)+e.id)<.5?.5:1:0)},()=>{t.lightCtl.set(e.id,0),t.ov.dead=t.ov.dead||[],t.ov.dead.push([e.i,e.j]),t.ov.dead.length>40&&t.ov.dead.shift(),this.sweep.push({id:e.id,at:t.t+8})})}lWake(){const e=at(this.fixtures(6,24,!0,!0));if(!e)return null;const t=j(.25,1.6),n=Math.random()*99,i=this.h;return this.lit([e],t+.4,(s,a)=>{i.lightCtl.set(e.id,a<t?.35+.65*this.stutter(a,n,.3):0)},()=>{i.lightCtl.set(e.id,0),this.sweep.push({id:e.id,at:i.t+8})},0)}around(e,t,n){const i=this.h.view(),s=i.yaw+(n?Math.PI+j(-1.1,1.1):j(0,Math.PI*2)),a=j(e,t),o=i.x-Math.sin(s)*a,l=i.z-Math.cos(s)*a;return[o,l,$t(this.h.region,i.x,1.5,i.z,o,1.5,l,!0)]}sMech(){const[e,t,n]=this.around(16,32,!1);return this.h.audio.shot("mech"+Math.floor(Math.random()*4),e,j(.5,2.4),t,j(9,15),j(.9,1.08),1,Math.max(420,1800/(1+n*.5)),3,1),this.timed(4,()=>{})}sFaint(){const[e,t]=this.around(14,28,Math.random()<.7);return this.h.audio.shot("faint"+Math.floor(Math.random()*4),e,j(.8,2.2),t,j(6,9),j(.88,1.1),1.2,j(900,2200),3,1),this.timed(6,()=>{})}sWall(){const e=this.h.view();let t=null;for(let a=0;a<12;a++){const o=e.yaw+Math.PI/2*at([-1,1])+j(-.7,.7)+(Math.random()<.3?Math.PI/2:0),l=this.wall(e.x,e.z,-Math.sin(o),-Math.cos(o),3.4);l&&(!t||l.t<t.t)&&(t={...l,a:o})}if(!t)return null;const n=e.x-Math.sin(t.a)*(t.t+.7),i=e.z-Math.cos(t.a)*(t.t+.7);return this.h.audio.shot("wall"+Math.floor(Math.random()*3),n,j(.6,1.6),i,j(1.8,2.8),j(.9,1.08),.25,j(380,620),1.2,1),Math.random()<.4&&(this.h.rig.kickV-=.004),this.timed(2,()=>{})}rQuiet(){const e=this.h.audio,t=j(7,22),n=j(.06,.22);return{step:(i,s)=>(e.humMul=1-(1-n)*Tn(0,2.2,s)*(1-Tn(t,t+7,s)),s<t+7),end:()=>{e.humMul=1}}}rTone(){const e=this.h.audio,t=j(20,55),n=at([0,1,2]),i=j(-.006,-.002);return{step:(s,a)=>{const o=Tn(0,5,a)*(1-Tn(t-6,t,a));return e.revMul=1+(n===0?1.3:n===1?-.7:.6)*o,e.revBias=n===0?[0,0,0,.9*o]:n===1?[0,.5*o,0,0]:[.7*o,0,0,0],e.detune=i*o,a<t},end:()=>{e.revMul=1,e.revBias=[0,0,0,0],e.detune=0}}}rAir(){const e=this.h.audio,t=j(35,110),[n,i]=this.around(25,40,!1);e.shot("mech3",n,2.4,i,8,.9,1,900,3,1);let s=!1;return{step:(a,o)=>(e.hvacMul=o<t?1-Tn(.4,6,o):Tn(t,t+9,o),o>t&&!s&&(s=!0,e.shot("mech0",n,2.4,i,7,.85,1,800,3,1)),o<t+9),end:()=>{e.hvacMul=1}}}figure(){return this.fig||(this.fig=new V_(this.h))}fStand(e){const t=this.h,n=t.view(),i=n.hfov/2;this.nearLit=t.chunks.lit.filter(s=>(s.x-n.x)**2+(s.z-n.z)**2<3600);try{return this.fStand2(e,t,n,i)}finally{this.nearLit=null}}fStand2(e,t,n,i){let s=null,a=t.region;e&&(a=t.world.region(Math.floor(n.x/ne)-34,Math.floor(n.z/ne)-34,68,68));let o=1e9,l=0;for(let g=0;g<(e?160:260)*this.fN;g++){const p=e?at([-1,1])*j(.14,.5)*i:at([-1,1])*j(.55,.9)*i,x=-Math.sin(n.yaw+p),y=-Math.cos(n.yaw+p),M=this.wall(n.x,n.z,x,y,40),w=M?M.t-.45:40,E=e?21:7.5,v=Math.min(e?35:23,w);if(v<E)continue;const T=j(E,v),I=n.x+x*T,R=n.z+y*T;if(!this.open(I,R,.3)||Math.hypot(I-this.lastFig[0],R-this.lastFig[1])<12)continue;const P=!$t(a,n.x,n.y,n.z,I,2.3,R),F=!$t(a,n.x,n.y,n.z,I,1.4,R);if(!P&&!F)continue;const G=-y,C=x,V=($t(a,n.x,n.y,n.z,I+G*.22,1.4,R+C*.22)?1:0)+($t(a,n.x,n.y,n.z,I-G*.22,1.4,R-C*.22)?1:0)+(P&&F?0:1);if(V>=2)continue;const q=this.wall(I,R,x,y,30),W=q?this.lightAt(I+x*Math.max(0,q.t-.15),R+y*Math.max(0,q.t-.15))*(q.t<1.2?1.25:1):.02,D=this.lightAt(I,R),O=W*10+D*4-V*.9+Math.random()*.15;O<o&&(o=O,s=[I,R,D,W],l=V)}if(this.lastTry=s?{bg:+s[3].toFixed(3),lit:+s[2].toFixed(3),hid:l}:null,s&&(l>=1?s[3]>(e?.34:.3):s[3]>(e?.24:.17)||s[2]>.16)&&(s=null),!s)return null;const[c,h,u]=s,f=this.figure();f.show(c,h,Math.atan2(n.x-c,n.z-h)+j(-.25,.25),Math.max(.004,u*.8)),this.lastFig=[c,h];const d=e?j(1.4,4.5):j(14,40);let m=Math.abs(this.ang(c,h,n.yaw)),_=0;return{step:(g,p)=>{const x=t.view(),y=x.hfov/2,M=Math.abs(this.ang(c,h,x.yaw)),w=Math.abs(this.ang(c,h,t.rig.yawT)),E=Math.hypot(c-x.x,h-x.z),v=(M-m)/Math.max(g,.001);m=M;const T=M<y*1.05&&this.los(c,1.9,h,e?a:t.region);if(T&&(_+=g),e?M<y*.1||w<y*.08||t.rig.zoom>.2||E<15:M<y*.44||w<y*.44||v<-1.1&&M<y*1||E<6.5||t.rig.zoomT>t.rig.zoom+.02&&M<y*.9)return!1;if(p>d){if(T){const R=t.post.fx;R.drop=.03,R.glitch=Math.max(R.glitch,.7),R.track=.5+.3*Math.sin(p*40)}return!1}return!0},end:()=>{f.hide(),this.log.push({t:+t.t.toFixed(2),name:e?"figure_far:gone":"figure:gone",note:"in view "+_.toFixed(2)+" s"})}}}fCross(){const e=this.h,t=e.view(),n=t.hfov/2;for(let i=0;i<220;i++){const s=at([-1,1])*j(.35,.95)*n,a=j(12,25),o=t.x-Math.sin(t.yaw+s)*a,l=t.z-Math.cos(t.yaw+s)*a,c=at([-1,1]),h=Math.cos(t.yaw+s)*c,u=-Math.sin(t.yaw+s)*c,f=j(1.3,2.8);if(!this.los(o,1.6,l)||this.los(o-h*f,1.6,l-u*f)||this.los(o+h*f,1.6,l+u*f))continue;let d=!0;for(let x=-4;x<=4&&d;x++)d=this.open(o+h*f*x/4,l+u*f*x/4,.2);if(!d)continue;const m=this.figure(),_=j(2.6,3.6),g=2*f/_,p=this.lightAt(o,l);return{step:(x,y)=>{const M=-f+_*y,w=e.view();return m.show(o+h*M,l+u*M,Math.atan2(h,u),Math.max(.004,p*.8)),m.group.position.y=.012*Math.sin(y*9),y<g&&Math.abs(this.ang(o+h*M,l+u*M,w.yaw))>w.hfov/2*.22},end:()=>{m.hide(),m.group.position.y=0}}}return null}fShadow(){const e=this.h,t=e.view(),n=t.hfov/2;for(let i=0;i<24;i++){const s=at([-1,1])*j(.55,.92)*n,a=-Math.sin(t.yaw+s),o=-Math.cos(t.yaw+s),l=this.wall(t.x,t.z,a,o,14);if(!l||l.t<3.5)continue;const c=t.x+a*l.t+l.nx*.064,h=t.z+o*l.t+l.nz*.064,u=-l.nz,f=l.nx;if(this.lightAt(c,h)<.012)continue;this.makeDecal();const d=this.decal,m=d.material.uniforms.uK,_=j(.12,.3)*at([-1,1]),g=j(3,8);d.rotation.y=Math.atan2(l.nx,l.nz),d.visible=!0;let p=-1;return{step:(x,y)=>{const M=_*y,w=c+u*M,E=h+f*M,v=e.view(),T=Math.abs(this.ang(w,E,v.yaw));return d.position.set(w,1.25,E),d.rotation.z=.05*Math.sin(y*.9),p<0&&(T<v.hfov/2*.42||y>g)&&(p=y),m.value=p<0?.34*Tn(0,1.2,y):.34*Math.max(0,1-(y-p)/.12),p<0||y-p<.12},end:()=>{d.visible=!1,m.value=0}}}return null}prime(e){const t=this.figure();this.makeDecal();const n=this.decal,i=this.h.rig;e?(t.group.position.set(i.x,-40,i.z),n.position.set(i.x,-40,i.z)):(t.group.position.set(0,0,0),n.position.set(0,0,0)),t.group.visible=e,n.visible=e}makeDecal(){if(this.decal)return;const e=new Vt({vertexShader:Ko,fragmentShader:Zo,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3,uniforms:{uSize:{value:new Ue(1.5,3.2)},uFoot:{value:new Ue(.11,.95)},uK:{value:0}}});this.decal=new wt(new vi(1.5,3.2),e),this.decal.renderOrder=2,this.decal.frustumCulled=!1,this.decal.visible=!1,this.h.scene.add(this.decal)}hSteps(){const e=this.h,t=e.view(),n=e.audio;if(!n.live)return null;const i=t.yaw+Math.PI+j(-.75,.75),s=at(["pair","approach","approach","approach","fade"]);let a=j(26,34),o=0,l=0,c=0;const h=Math.floor(s==="pair"?j(1,3):s==="fade"?j(3,6):j(4,10)),u=j(2,3),f={a:i};let d=-1;return{step:(m,_)=>{const g=e.view(),p=g.x-Math.sin(f.a)*a,x=g.z-Math.cos(f.a)*a;if(o>0&&Math.abs(this.ang(p,x,g.yaw))<.62){if(c+=m,c>.25)return this.log.push({t:+e.t.toFixed(2),name:"heavy_steps:looked",note:o+" steps, "+a.toFixed(0)+" m"}),!1}else c=0;if(l-=m,l>0)return!0;if(o>=h||a<7.5)return!1;let y;do y=Math.floor(Math.random()*6);while(y===d);d=y;const M=$t(e.region,g.x,1.5,g.z,p,1.5,x,!0),w=1-Math.min(1,(a-7)/27);return n.shot("heavy"+y,p,.1,x,j(2.8,3.6)*(s==="fade"?Math.max(.35,1-o*.2):1),j(.93,1.05),1.1,(260+1500*w*w)/(1+.35*Math.min(4,M)),4,1),a<15&&(Math.random()<.7&&n.shot("tile"+Math.floor(Math.random()*4),g.x+j(-2,2),Tt,g.z+j(-2,2),.35*w,j(.9,1.1),.3,6e3),e.rig.kickV-=.004*w),o++,s!=="pair"&&s!=="fade"?a-=u*j(.85,1.2):s==="fade"&&(a+=j(0,1.5)),f.a+=j(-.06,.06),l=j(1.7,2.7)*(s==="approach"?1-.25*w:1),!0}}}pChange(){const e=this.h,t=e.view(),n=e.world,i=Math.floor(t.x/ne),s=Math.floor(t.z/ne),a=e.doorCell(),o=e.ov.fridge;for(let l=0;l<60;l++){const c=i+Math.floor(j(-20,20)),h=s+Math.floor(j(-20,20)),u=at([0,1]),f=u?c*ne:(c+.5)*ne,d=u?(h+.5)*ne:h*ne,m=Math.hypot(f-t.x,d-t.z);if(m<11||m>26||(f-t.x)*t.fx+(d-t.z)*t.fz>-.25*m)continue;const _=n.edge(c,h,u);if(_!==Ft&&_!==dn||this.seesEdge(c,h,u)||a&&Math.abs(a[0]-c)+Math.abs(a[1]-h)<5||o&&Math.abs(o.i-c)+Math.abs(o.j-h)<4||n.column(c,h)||n.column(c+(u?0:1),h+(u?1:0))||e.ov.edges.some(y=>Math.abs(y[0]-c)<3&&Math.abs(y[1]-h)<3))continue;const g=_===Ft?dn:Ft,p=new pi(n,i,s,30).count;if(e.ov.edges.push([c,h,u,g]),n.setOverrides(e.ov),new pi(n,i,s,30).count<p*.97){e.ov.edges.pop(),n.setOverrides(e.ov);continue}const x=y=>{const M=y.cx*Et-8,w=y.cz*Et-8;return c<M||h<w||c>M+Et+16||h>w+Et+16?!0:!this.seesEdge(c,h,u)};return e.chunks.gate=x,e.applyOv(!0),e.chunks.invalidate(c,h,c+(u?0:1),h+(u?1:0)),e.checkSoon(),this.log.push({t:+e.t.toFixed(2),name:"plan_change:edge",note:[c,h,u,_,g].join(",")}),{step:(y,M)=>M<60&&(e.chunks.pending()>0||[...e.chunks.map.values()].some(w=>w.held)),end:()=>{e.chunks.gate===x&&(e.chunks.gate=null)}}}return null}seesEdge(e,t,n){const i=this.h.view();for(const s of[.1,.5,.9])for(const a of[-.25,.25]){const o=n?e*ne+a:(e+s)*ne,l=n?(t+s)*ne:t*ne+a;if(Math.hypot(o-i.x,l-i.z)<44&&!$t(this.h.region,i.x,i.y,i.z,o,1.2,l))return!0}return!1}}const ys={odds:180,metresPerRoll:4,settle:40,near:6},qi=(r,e,t)=>{const n=Math.min(1,Math.max(0,(t-r)/(e-r)));return n*n*(3-2*n)};class X_{constructor(e){this.h=e}h;state="idle";rolls=0;walked=0;t=0;lastRoll=-9;log=[];seq=0;vy=0;switched=!1;landT=-1;sx=0;sz=0;odds=ys.odds;force(){this.state==="idle"&&this.win("forced")}win(e){this.state="fetching",this.log.push({t:this.h.t,what:"roll came up ("+e+")"}),this.h.loadL1().then(()=>{this.state==="fetching"&&(this.state="armed",this.log.push({t:this.h.t,what:"level 1 ready"}))}).catch(t=>{this.state="failed",this.log.push({t:this.h.t,what:"level 1 failed: "+t})})}update(e,t){const n=this.h,i=n.rig;if(this.t+=e,this.state==="idle"){if(n.t<ys.settle||i.speed<.5||(this.walked+=t,this.walked<ys.metresPerRoll||n.t-this.lastRoll<2.5)||(this.walked=0,this.lastRoll=n.t,this.rolls++,n.door&&n.door.placed&&(n.door.x-i.x)**2+(n.door.z-i.z)**2<ys.near*ys.near))return;Math.random()*this.odds<1&&this.win("roll "+this.rolls);return}if(this.state==="armed"){const c=n.events&&n.events.live.some(h=>h.def.tier>=2);i.speed>.7&&!c&&i.ray(n.region,-Math.sin(i.yaw),-Math.cos(i.yaw),3)>1.2&&(this.state="falling",this.seq=0,this.vy=0,this.switched=!1,this.landT=-1,this.sx=i.x,this.sz=i.z,this.log.push({t:n.t,what:"the floor gives"}));return}if(this.state!=="falling")return;this.seq+=e;const s=this.seq,a=n.audio,o=n.shared.uSink.value;if(!this.switched){if(o.set(this.sx,this.sz,.35+.9*qi(0,.9,s),qi(0,.5,s)),s>.25&&(i.lock=!0),s<.95?(i.fallY=-.06*qi(.1,.55,s)-.3*qi(.55,.95,s)*qi(.55,.95,s),s>.55&&s-e<=.55&&(i.kickV-=.5,i.roll+=.06)):(s-e<.95&&(this.vy=-1.2),this.vy-=9.8*e*.8,i.fallY+=this.vy*e,i.pitchT-=e*.25),a.live&&(s-e<=.02&&(a.shot("wet"+Math.floor(Math.random()*8),i.x,.02,i.z,2.6,.62,.5,2600),a.shot("wet"+Math.floor(Math.random()*8),i.x+.2,.02,i.z,1.8,.5,.5,1800)),s>.55&&s-e<=.55&&(a.shot("wet"+Math.floor(Math.random()*8),i.x,0,i.z,3.4,.42,.4,1400),a.shot("cloth"+Math.floor(Math.random()*8),i.x,1,i.z,1.6,.8,.1)),s>.95&&s-e<=.95&&(a.shot("l1_slip",i.x,.3,i.z,2,1,.2,9e3),a.shot("handle"+Math.floor(Math.random()*8),i.x,1.4,i.z,1.4,.9,.05))),n.voidView=1.5+i.fallY<.03,n.voidView&&s>1.2&&a.live&&!this.windOn&&(this.windOn=!0,a.shot("l1_fall",i.x,1.5,i.z,2.4,1,0,6e3)),s>2&&n.l1){const c=n.l1.world.landing();n.switchL1({x:c.x,z:c.z,yaw:c.yaw}),this.switched=!0,this.vy=-4.6,i.fallY=3.62-i.EYE,i.pitch=i.pitchT=-.35,i.wp=-.4,n.voidView=!1,o.set(0,0,0,0),this.log.push({t:n.t,what:"level 1"})}return}if(this.landT<0){if(this.vy-=9.8*e,i.fallY+=this.vy*e,i.EYE+i.fallY<=.72){i.fallY=.72-i.EYE,this.landT=s,this.vy=0,i.kickV-=2.4,i.roll+=.16*(Math.random()<.5?-1:1),i.wp-=1.4,i.wy+=(Math.random()-.5)*1.6,i.glitch=1;const c=n.post.fx;c.glitch=1,c.track=.2,c.drop=.05,a.live&&(a.shot("l1_land",i.x,.05,i.z,3.2,1,.5,12e3),a.shot("cloth"+Math.floor(Math.random()*8),i.x,.6,i.z,2.2,.85,.2),a.shot("handle"+Math.floor(Math.random()*8),i.x,.9,i.z,2.6,.8,.1),a.recDrop(.09,.15)),this.log.push({t:n.t,what:"landed"})}return}const l=s-this.landT;if(l<.35){const c=n.post.fx;c.glitch=Math.max(c.glitch,1-l*2.5),c.track=.2+l}i.fallY=(.72-i.EYE)*(1-qi(.7,2.2,l)),l>.6&&l<2&&(i.pitchT+=(-.06-i.pitchT)*Math.min(1,e*2.2)),l>1.6&&(i.lock=!1),l>2.3&&(i.fallY=0,i.lock=!1,this.state="done",this.log.push({t:n.t,what:"up"}))}}const Uc=Et*ne,En=22,Gr=r=>{const e=Math.sin(r*127.1+311.7)*43758.5453;return e-Math.floor(e)},q_=(r,e)=>{const t=Math.floor(r),n=r-t,i=n*n*(3-2*n);return(Gr(t+e*57.3)*2-1)*(1-i)+(Gr(t+1+e*57.3)*2-1)*i};function Y_(r,e){const t=(r>>>0)%997,n=q_(e*.31,t),i=Math.floor(e*5+t),s=Gr(i*7.13+t),a=Gr(i*3.7+t+9);return n>.2?s<.07?.45:1:n>-.35?s<.4?.3+.4*a:1:s<.14?.85:.22}class K_{constructor(e,t){this.seed=e,this.quality=t;const n=this.canvas=document.createElement("canvas");n.width=16,n.height=12,this.renderer=new gv({canvas:n,antialias:!1,alpha:!1,depth:!1,stencil:!1,powerPreference:"high-performance"});const i=this.renderer.getContext();if(!this.renderer.capabilities.isWebGL2||!i.getExtension("EXT_color_buffer_float"))throw this.renderer.dispose(),new Error("level0: this GPU cannot do half-float render targets");this.renderer.outputColorSpace=en,this.renderer.toneMapping=On,this.renderer.setPixelRatio(1),this.renderer.info.autoReset=!1,this.scene.background=new Ne(this.shared.uFog.value.x,this.shared.uFog.value.y,this.shared.uFog.value.z),this.scene.matrixWorldAutoUpdate=!0,this.camera.rotation.order="YXZ",this.rng=Wh(e^1374496523)}seed;quality;ready=!1;active=!1;disposed=!1;manual=!1;canvas;renderer;scene=new _o;camera=new Jt(45,4/3,.05,70);shared=xv();mats=new Pv(this.shared);post;chunks;world;ov;rig=new Hv;audio;models;door;fridge;t=0;frames=0;metres=0;moved=0;fridgeFound=!1;spot=null;region;events;lightCtl=new Map;flSm=new Map;everDyn=new Set;damp=null;stats={load:0,bake:0,warm:0,frame:0,worst:0};rci=1e9;rcj=1e9;regionDirty=!0;raf=0;last=0;acc=0;lastFrame=0;out={px:0,py:0,pz:0,yaw:0,pitch:0,roll:0,fov:45,cam:{dt:1/60,focus:0,skew:0,zoom:0,move:[0,0],wb:[1,1,1],glitch:0,track:.5}};rng;un=[];onExit;leaving=!1;lsel=[];lseld=new Float64Array(Fn);fl=new Map;checkT=14;pcx=1e9;pcz=1e9;seen=new Map;fwd=new z;up=new z;lx=0;lz=0;touches=new Map;interact=0;base="";async load(e){this.base=e;const t=performance.now(),[n,i,s]=await Promise.all([C_(e,Math.min(8,this.renderer.capabilities.getMaxAnisotropy())),P_(e),Yo.load(e+"audio/")]);if(this.disposed)throw new Error("level0: disposed while loading");this.mats.tex=n,this.shared.uSmooth.value=n.smooth,this.mats.build(),this.post=new kv(this.renderer,n.noise,this.quality),this.models=i,this.audio=s,this.door=new z_(i,this.mats),this.fridge=new B_(i,this.mats),this.scene.add(this.door.group,this.fridge.group),this.stats.load=performance.now()-t,this.plan();const a=Math.max(1,Math.min(4,(navigator.hardwareConcurrency||4)-1));this.chunks=new L_(this.scene,this.mats,i,this.ov,a),this.chunks.onReady=c=>{c.doorAmb&&this.door.setAmb(c.doorAmb),c.fridgeAmb&&this.fridge.setAmb(c.fridgeAmb)},this.chunks.update(this.rig.x,this.rig.z);const o=performance.now();await new Promise((c,h)=>{const u=setInterval(()=>{this.disposed?(clearInterval(u),h(new Error("level0: disposed while baking"))):this.chunks.readyAround(this.rig.x,this.rig.z,2)&&(clearInterval(u),c())},40)}),this.stats.bake=performance.now()-o;const l=performance.now();if(await new Promise(c=>{const h=()=>c();"requestIdleCallback"in window?window.requestIdleCallback(h,{timeout:400}):setTimeout(h,0)}),this.disposed)throw new Error("level0: disposed while warming");this.damp=Vh.get(n.smooth)||null,this.events=new W_(this);try{await this.renderer.compileAsync(this.scene,this.camera)}catch{}this.shared.uFog.value.w=Math.max(20,Math.min(41,this.chunks.viewDist(this.rig.x,this.rig.z)-1.5)),this.events.prime(!0);for(let c=0;c<3;c++)this.frame(1/60,!0);this.events.prime(!1),this.rig.pitch=-.42,this.rig.roll=.05,this.rig.wp=.4,this.stats.warm=performance.now()-l,this.ready=!0}plan(){const e=U_(this.seed);this.world=e.world,this.ov=e.ov,this.spot=e.spot,this.rig.x=e.x,this.rig.z=e.z,e.spot?this.door.place(e.spot):console.warn("[level0] no place for a door"),e.fspot&&this.fridge.place(e.fspot);const t=this.rng;this.refreshRegion();let n=0,i=0;for(let s=0;s<24;s++){const a=s/24*Math.PI*2,o=this.rig.ray(this.region,-Math.sin(a),-Math.cos(a),40)+t()*2;o>n&&(n=o,i=a)}this.rig.yaw=this.rig.yawT=i+(t()-.5)*.5}placeDoor(e,t,n,i=!1,s,a=!1){const o=Lr(this.world,this.ov,e,this.rng,t,n,i,s,a);return o?(this.ov=o.ov,this.spot=o.spot,this.door.place(o.spot),this.chunks&&(this.chunks.ov=o.ov),this.regionDirty=!0,!0):!1}sees(e,t){const n=e-this.rig.x,i=t-this.rig.z;return n*n+i*i>2116?!1:!$t(this.region,this.rig.x,1.5,this.rig.z,e,1.2,t)}seesSpot(e){const[t,n,i,s]=Yh(e),a=e.dir===0?.4:0,o=e.dir===0?0:.4;return this.sees(t+i*.4,n+s*.4)||this.sees(t+i*.4+a,n+s*.4+o)||this.sees(t+i*.4-a,n+s*.4-o)}pf=null;checkExit(e=!1){if(!this.pf){const l=this.ov.fridge;this.pf=new pi(this.world,Math.floor(this.rig.x/ne),Math.floor(this.rig.z/ne),56,l?(c,h)=>c===l.i&&h===l.j:void 0,!0)}if(!this.pf.run(e?1/0:500))return;const t=this.pf,n=this.spot;this.pf=null;const i=n?t.at(n.ai,n.aj):-1;if(!(i<0||this.t>240&&i>30||this.t>420&&i>18)||n&&this.seesSpot(n))return;const a=this.t>420?8:this.t>240?12:16;this.placeDoor(t,a,a+10,!1,l=>this.seesSpot(l),!0)||this.placeDoor(t,6,40,!1,l=>this.seesSpot(l),!0)||i<0&&this.placeDoor(t,4,50,!0,l=>this.seesSpot(l),!0);const o=this.spot;o!==n&&(this.moved++,n&&this.chunks.invalidate(n.bi-9,n.bj-9,n.bi+9,n.bj+9),o&&this.chunks.invalidate(o.bi-9,o.bj-9,o.bi+9,o.bj+9))}view(){const e=this.out;return{x:e.px,y:e.py,z:e.pz,yaw:e.yaw,pitch:e.pitch,hfov:this.rig.hfov(),fx:-Math.sin(e.yaw),fz:-Math.cos(e.yaw)}}applyOv(e=!1){this.world.setOverrides(this.ov),this.chunks&&(this.chunks.ov=this.ov),e&&(this.regionDirty=!0)}checkSoon(){this.checkT=Math.min(this.checkT,1)}doorCell(){return this.spot?[this.spot.bi,this.spot.bj]:null}wetAt(e,t){const n=this.damp;if(!n)return .25;const i=(o,l,c)=>{o=(o-Math.floor(o))*n.w-.5,l=(l-Math.floor(l))*n.h-.5;const h=Math.floor(o),u=Math.floor(l),f=o-h,d=l-u,m=(_,g)=>n.d[((g%n.h+n.h)%n.h*n.w+(_%n.w+n.w)%n.w)*4+c]/255;return(m(h,u)*(1-f)+m(h+1,u)*f)*(1-d)+(m(h,u+1)*(1-f)+m(h+1,u+1)*f)*d},s=i(e*.021,t*.021,0)*.72+i(e*.083+.3,t*.083+.3,2)*.28,a=Math.min(1,Math.max(0,(s-.57)/.13));return .08+.92*a*a*(3-2*a)}refreshRegion(){const e=Math.floor(this.rig.x/ne),t=Math.floor(this.rig.z/ne);this.rci=e,this.rcj=t,this.regionDirty=!1,this.regionGen++,this.rwWant=0,this.region=this.world.region(e-En,t-En,2*En,2*En)}rw=null;rwId=0;rwWant=0;regionGen=0;requestRegion(e,t){if(!this.rw){try{this.rw=new Worker(new URL(""+new URL("bake-Bln5YyVj.js",import.meta.url).href,import.meta.url),{type:"module"})}catch{this.rw=null;return}this.rw.onmessage=n=>{const i=n.data;i.id===this.rwWant&&(this.rwWant=0,!(!i.region||i.gen!==this.regionGen||this.regionDirty||this.l1on)&&(this.region=i.region,this.rci=i.region.i0+En,this.rcj=i.region.j0+En))},this.rw.onerror=()=>{this.rw&&this.rw.terminate(),this.rw=null,this.rwWant=0}}this.rwWant=++this.rwId,this.rw.postMessage({kind:"region",id:this.rwWant,gen:this.regionGen,ov:this.ov,i0:e-En,j0:t-En,w:2*En,h:2*En})}stopRegionWorker(){this.rw&&(this.rw.terminate(),this.rw=null),this.rwWant=0}l1=null;l1on=!1;l1p=null;noclip=new X_(this);voidView=!1;voidScene=new _o;loadL1(){return this.l1p||(this.l1p=tu(()=>import("./chunk-DlHoQweO.js"),[],import.meta.url).then(async e=>{const t=new e.Level1(this,this.seed);if(await t.prepare(),this.disposed)throw t.dispose(),new Error("level0: disposed");return this.l1=t,t})),this.l1p}switchL1(e={}){return!this.l1||this.l1on?!1:(this.events&&this.events.dispose(),this.stopRegionWorker(),this.audio&&this.audio.live&&this.audio.sleepWorld(),this.chunks&&this.chunks.dispose(),this.door.group.visible=!1,this.fridge.group.visible=!1,this.door.placed=!1,this.fridge.placed=!1,this.rig.extra=[],this.l1on=!0,this.l1.enter(e),!0)}norender=!1;tinkT=-9;frame(e,t=!1){if(this.l1on&&this.l1){const w=performance.now();this.t+=e,this.frames++,this.renderer.info.reset(),this.l1.frame(e,t);const E=performance.now()-w;this.stats.frame+=(E-this.stats.frame)*.05,this.frames>30&&E>this.stats.worst&&(this.stats.worst=E);return}const n=performance.now(),i=this.rig,s=this.out;this.t+=e,this.renderer.info.reset(),this.frames++;const a=this.t,o=Math.floor(i.x/ne),l=Math.floor(i.z/ne);{const w=Math.max(Math.abs(o-this.rci),Math.abs(l-this.rcj));this.regionDirty||w>En-5?this.refreshRegion():w>6&&!this.rwWant&&this.requestRegion(o,l)}const c=i.x,h=i.z;i.update(e,this.region,s);const u=Math.hypot(i.x-c,i.z-h);if(this.metres+=u,!t&&(this.noclip.update(e,u),this.l1on))return;const f=this.camera;f.position.set(s.px,s.py,s.pz),f.rotation.set(s.pitch,s.yaw,s.roll),Math.abs(f.fov-s.fov)>.001&&(f.fov=s.fov,f.updateProjectionMatrix()),f.updateMatrixWorld(),f.getWorldDirection(this.fwd),this.up.set(0,1,0).applyQuaternion(f.quaternion),this.frames%12===1&&this.chunks.update(i.x,i.z);const d=Math.max(20,Math.min(41,this.chunks.viewDist(i.x,i.z)-1.5)),m=this.shared.uFog.value;m.w+=(d-m.w)*Math.min(1,e*(d<m.w?5:.6));const _=Math.floor(i.x/Uc),g=Math.floor(i.z/Uc);(_!==this.pcx||g!==this.pcz)&&(this.pcx=_,this.pcz=g,this.shift()),!t&&this.events&&this.events.update(e),this.fl.clear();for(const w of this.chunks.map.values()){if(!w.ready||!w.fk.length)continue;for(const P of w.fk){if(this.fl.has(P))continue;const F=this.lightCtl.get(P),G=F!==void 0?F:this.everDyn.has(P)?1:Y_(P,a),C=this.flSm.get(P)??G,V=C+(G-C)*Math.min(1,e*22);this.flSm.set(P,V),this.fl.set(P,V)}const E=w.flickFix,v=w.flickV,T=w.fk,I=P=>P<T.length?this.fl.get(T[P]):1;w.flickV=E?this.fl.get(E.id):1;const R=I(0);for(const P of Object.values(w.mats))P.uniforms.uFlick.value=R,P.uniforms.uFlick2.value.set(I(1),I(2),I(3),I(4));w.lens.uniforms.uFlickVal.value=R,w.lens.uniforms.uFlick2.value.set(I(1),I(2),I(3),I(4)),E&&!t&&v<.5&&w.flickV>=.5&&this.audio.live&&a-this.tinkT>2.2&&Math.random()<.5&&(E.x-i.x)**2+(E.z-i.z)**2<150&&(this.tinkT=a,this.audio.shot("tink"+Math.floor(Math.random()*6),E.x,Tt,E.z,.45,.9+Math.random()*.2,.3,9e3))}if(this.flSm.size>this.fl.size+8)for(const w of[...this.flSm.keys()])this.fl.has(w)||this.flSm.delete(w);(this.frames%5===1||this.lsel.length===0)&&this.pickLights(s.px+this.fwd.x*2.2,s.pz+this.fwd.z*2.2);const p=this.shared.uL.value,x=this.shared.uLC.value;for(let w=0;w<Fn;w++){const E=this.lsel[w];E?(p[w].set(E.x,Tt+.008,E.z,E.power*(this.fl.get(E.id)??1)),x[w].set(E.tint[0],E.tint[1],E.tint[2])):p[w].set(0,-100,0,0)}this.shared.uTime.value=a;const y=this.door.update(e,i.x,i.z,i.extra);y===1&&!t&&this.audio.live&&this.audio.doorSound("door_creak",this.door.x,this.door.z,1.3),y===2&&this.active&&(this.leaving=!0),this.fridge.placed&&(i.extra.indexOf(this.fridge.box)<0&&i.extra.push(this.fridge.box),!this.fridgeFound&&(this.fridge.x-i.x)**2+(this.fridge.z-i.z)**2<6.2&&this.sees(this.fridge.x,this.fridge.z)&&(this.fridgeFound=!0)),t||(this.checkT-=e,this.pf?this.checkExit():this.checkT<=0&&(this.checkT=15,this.checkExit())),this.audio.live&&!t&&this.audio.update(e,this.region,s.px,s.py,s.pz,this.fwd.x,this.fwd.y,this.fwd.z,this.up.x,this.up.y,this.up.z,{lit:this.chunks.lit,vents:this.chunks.vents,door:this.door.placed?[this.door.x-this.door.nx*.5,this.door.z-this.door.nz*.5]:null,fridge:this.fridge.placed?[this.fridge.x,this.fridge.z]:null,flick:w=>this.fl.get(w)??1,pin:this.lightCtl.size||this.audio.mods.size?[...this.lightCtl.keys(),...this.audio.mods.keys()]:void 0,shake:Math.min(1.5,Math.abs(i.wy)+Math.abs(i.wp))*.5+Math.min(1,i.speed/1.3)*.5,idle:i.idle}),this.norender||this.post.render(this.voidView?this.voidScene:this.scene,f,s.cam);const M=performance.now()-n;this.stats.frame+=(M-this.stats.frame)*.05,this.frames>30&&M>this.stats.worst&&(this.stats.worst=M)}pickLights(e,t){const n=this.lsel,i=this.lseld;let s=0;n.length=0;for(const a of this.chunks.lit){const o=(a.x-e)**2+(a.z-t)**2;if(s===Fn&&o>=i[Fn-1])continue;let l=s<Fn?s++:Fn-1;for(;l>0&&i[l-1]>o;)i[l]=i[l-1],n[l]=n[l-1],l--;i[l]=o,n[l]=a}}shift(){let e=!1;const t=this.spot,n=this.ov.fridge;for(const[i,[s,a]]of this.seen){if(Math.max(Math.abs(s-this.pcx),Math.abs(a-this.pcz))<6||(this.seen.delete(i),Math.random()>.35)||t&&Math.max(Math.abs(Math.floor(t.bi/Et)-s),Math.abs(Math.floor(t.bj/Et)-a))<=1||n&&Math.max(Math.abs(Math.floor(n.i/Et)-s),Math.abs(Math.floor(n.j/Et)-a))<=1)continue;const o=this.ov.epochs.find(l=>l[0]===s&&l[1]===a);o?o[2]++:this.ov.epochs.push([s,a,1]),e=!0}for(let i=-1;i<=1;i++)for(let s=-1;s<=1;s++)this.seen.set(this.pcx+s+","+(this.pcz+i),[this.pcx+s,this.pcz+i]);e&&(this.world.setOverrides(this.ov),this.checkT=Math.min(this.checkT,1))}enter(e={}){if(!this.ready||this.active||this.disposed)return!1;this.onExit=e.onExit,this.active=!0;const t=this.canvas,n=this.rig;t.setAttribute("aria-hidden","true"),t.tabIndex=-1,t.style.cssText="position:fixed;left:0;top:0;width:100%;height:100%;z-index:2147483647;background:#000;cursor:none;touch-action:none;outline:none;user-select:none;-webkit-user-select:none;display:block;margin:0;padding:0;border:0",(document.body||document.documentElement).appendChild(t),this.resize();try{const h=window.AudioContext||window.webkitAudioContext,u=new h({latencyHint:"interactive"});this.audio.start(u),u.state!=="running"&&u.resume().catch(()=>{}),this.l1on&&this.audio.sleepWorld(),n.onStep=(f,d,m)=>{this.l1on&&this.l1&&this.l1.audio1?this.l1.audio1.step(f,d,m):this.audio.step(f,d,m,this.wetAt(n.x,n.z))},n.onZoom=f=>this.audio.zoomMotor(f)}catch(h){console.warn("[level0] no sound",h)}const i=(h,u,f,d={capture:!0,passive:!1})=>{h.addEventListener(u,f,d),this.un.push(()=>h.removeEventListener(u,f,d))},s=(h,u=!0)=>{h.stopImmediatePropagation(),u&&h.cancelable&&h.preventDefault()},a=h=>h.ctrlKey||h.metaKey||h.altKey||/^F\d+$/.test(h.code),o=()=>{if(document.pointerLockElement!==t&&t.requestPointerLock)try{const h=t.requestPointerLock();h&&h.catch&&h.catch(()=>{})}catch{}};i(window,"keydown",h=>{s(h,!a(h)),a(h)||(n.keys.add(h.code),h.code==="KeyF"&&!h.repeat&&this.interact++),l()}),i(window,"keyup",h=>{s(h,!a(h)),n.keys.delete(h.code)}),i(window,"keypress",h=>s(h,!a(h))),i(window,"blur",()=>n.keys.clear()),i(window,"mousemove",h=>{s(h,!1),(document.pointerLockElement===t||h.buttons)&&(n.look[0]+=h.movementX||0,n.look[1]+=h.movementY||0)});const l=()=>{const h=this.audio.ctx;this.audio.live&&h&&h.state==="suspended"&&!document.hidden&&h.resume().catch(()=>{})};i(window,"mousedown",h=>{s(h),document.pointerLockElement===t&&h.button===0&&this.interact++,o(),l()});for(const h of["mouseup","click","dblclick","auxclick","contextmenu","gesturestart","dragstart","selectstart","pointerdown","pointerup","pointermove","pointercancel"])i(window,h,u=>s(u,!h.startsWith("pointer")));i(window,"wheel",h=>{s(h),n.zoomT=Math.max(0,Math.min(1,n.zoomT-h.deltaY*7e-4))}),i(window,"touchstart",h=>{s(h);for(const u of Array.from(h.changedTouches))this.touches.set(u.identifier,{side:u.clientX<innerWidth/2?0:1,x0:u.clientX,y0:u.clientY,x:u.clientX,y:u.clientY,t0:performance.now()})}),i(window,"touchmove",h=>{s(h);for(const u of Array.from(h.changedTouches)){const f=this.touches.get(u.identifier);if(f&&(f.side&&(n.look[0]+=(u.clientX-f.x)*2.2,n.look[1]+=(u.clientY-f.y)*2.2),f.x=u.clientX,f.y=u.clientY,!f.side)){const d=(f.x-f.x0)/55,m=-(f.y-f.y0)/55,_=Math.hypot(d,m),g=Math.min(1.5,_);n.stick[0]=_>.15?d/_*g:0,n.stick[1]=_>.15?m/_*g:0}}});const c=h=>{s(h),l();for(const u of Array.from(h.changedTouches)){const f=this.touches.get(u.identifier);f&&!f.side&&(n.stick[0]=n.stick[1]=0),f&&f.side&&h.type==="touchend"&&Math.hypot(f.x-f.x0,f.y-f.y0)<14&&performance.now()-f.t0<300&&this.interact++,this.touches.delete(u.identifier)}};return i(window,"touchend",c),i(window,"touchcancel",c),i(window,"resize",()=>this.resize(),{capture:!1,passive:!0}),i(document,"visibilitychange",()=>{const h=this.audio.ctx;document.hidden?(cancelAnimationFrame(this.raf),n.keys.clear(),h&&h.suspend&&h.suspend().catch(()=>{})):this.active&&!this.manual&&(h&&h.resume&&h.resume().catch(()=>{}),this.last=this.lastFrame=performance.now(),this.acc=0,this.raf=requestAnimationFrame(this.tick))},{capture:!1,passive:!0}),o(),this.frame(1/60),this.last=this.lastFrame=performance.now(),this.acc=0,this.manual||(this.raf=requestAnimationFrame(this.tick)),!0}resize(){const e=Math.max(1,innerWidth),t=Math.max(1,innerHeight),n=Math.min(2,devicePixelRatio||1);this.renderer.setPixelRatio(n),this.renderer.setSize(e,t,!1),this.post.layout(e,t)}tick=e=>{if(!this.active||this.manual||(this.raf=requestAnimationFrame(this.tick),this.acc+=e-this.last,this.last=e,this.acc<13.6))return;this.acc=Math.max(-3,Math.min(20,this.acc-1e3/60));const t=Math.min(.05,Math.max(.004,(e-this.lastFrame)/1e3));this.lastFrame=e,this.frame(t),this.leaving&&this.leave()};leave(){const e={seed:this.seed,seconds:this.t,metres:this.metres,fridge:this.fridgeFound,level:this.l1on?1:0},t=this.onExit;this.dispose(),t&&t(e)}dispose(){if(!this.disposed){this.disposed=!0,this.active=!1,this.ready=!1,cancelAnimationFrame(this.raf);for(const e of this.un)e();this.un=[];try{document.pointerLockElement===this.canvas&&document.exitPointerLock()}catch{}if(this.audio&&this.audio.stop(),this.events&&this.events.dispose(),this.stopRegionWorker(),this.chunks&&this.chunks.dispose(),this.door&&this.door.dispose(),this.fridge&&this.fridge.dispose(),this.models)for(const e of[...Object.values(this.models.parts),this.models.doorFixed,this.models.doorLeaf])for(const t of e)t.geo.dispose();this.l1&&this.l1.dispose(),this.post&&this.post.dispose(),this.mats.protos&&this.mats.dispose(),this.scene.clear(),this.renderer.dispose();try{this.renderer.forceContextLoss()}catch{}this.canvas.remove(),this.canvas.width=this.canvas.height=1}}debug={step:(e,t=1/60)=>{for(let n=0;n<e&&!this.disposed;n++)if(this.frame(t),this.leaving){this.leave();break}this.disposed||this.renderer.getContext().finish()},level1:async(e={})=>(await this.loadL1(),this.switchL1(e),this.l1?this.l1.debugInfo():null),info1:()=>this.l1?this.l1.debugInfo():null,noclip:()=>(this.noclip.force(),this.noclip.state),event1:e=>this.l1&&this.l1.dir?this.l1.dir.force(e):!1,noclipInfo:()=>({state:this.noclip.state,rolls:this.noclip.rolls,log:this.noclip.log.slice()}),teleport1:(e,t,n,i=0)=>{const s=this.rig;s.x=e,s.z=t,s.vx=s.vz=0,n!==void 0&&(s.yaw=s.yawT=n,s.wy=0),s.pitch=s.pitchT=i,s.wp=0,this.l1&&(this.l1.regionDirty=!0,this.l1.chunks.update(e,t))},teleport:(e,t,n,i=0)=>{const s=this.rig;s.x=e,s.z=t,s.vx=s.vz=0,n!==void 0&&(s.yaw=s.yawT=n,s.wy=0),s.pitch=s.pitchT=i,s.wp=0,this.regionDirty=!0,this.chunks.update(e,t)},info:()=>({seed:this.seed,t:this.t,x:this.rig.x,z:this.rig.z,yaw:this.rig.yaw,chunks:this.chunks.map.size,ready:[...this.chunks.map.values()].filter(e=>e.ready).length,pending:this.chunks.pending(),bake:this.chunks.times.slice(),errors:this.chunks.errors.slice(),door:this.spot?{x:this.door.x,z:this.door.z,nx:this.door.nx,nz:this.door.nz,angle:this.door.angle,d:this.spot.d}:null,fridge:this.fridge.placed?{x:this.fridge.x,z:this.fridge.z,fx:Math.sin(this.fridge.group.rotation.y),fz:Math.cos(this.fridge.group.rotation.y)}:null,moved:this.moved,events:this.events?{activity:this.events.activity,live:this.events.live.map(e=>e.def.name),log:this.events.log.slice(-40)}:null,lit:this.chunks.lit.length,fog:this.shared.uFog.value.w,stats:{...this.stats},audio:this.audio.live?{...this.audio.debug,state:this.audio.ctx.state}:null,gl:{...this.renderer.info.memory,calls:this.renderer.info.render.calls,tris:this.renderer.info.render.triangles}}),path:(e=56)=>{const t=new pi(this.world,Math.floor(this.rig.x/ne),Math.floor(this.rig.z/ne),e);return this.spot?t.at(this.spot.ai,this.spot.aj):-1},flood:(e=56)=>new pi(this.world,Math.floor(this.rig.x/ne),Math.floor(this.rig.z/ne),e),check:()=>this.checkExit(!0),sim:(e,t=1/60)=>{this.norender=!0;for(let n=0;n<e&&!this.disposed&&!this.leaving;n++)this.frame(t);this.norender=!1,this.leaving&&this.leave()},meter:()=>this.post.meter(),readScene:(e,t,n,i)=>this.post.readScene(e,t,n,i),exportPlan:(e=12)=>{const t=Math.floor(this.rig.x/ne),n=Math.floor(this.rig.z/ne),i=this.world.region(t-e,n-e,2*e,2*e);return{i0:i.i0,j0:i.j0,w:i.w,h:i.h,ex:Array.from(i.ex),ez:Array.from(i.ez),col:Array.from(i.col),fix:i.fix,cam:{x:this.out.px,y:this.out.py,z:this.out.pz,yaw:this.out.yaw,pitch:this.out.pitch,vfov:this.camera.fov}}}}}async function J_(r={}){const e=r.base||new URL(".",import.meta.url).href,t=r.seed??crypto.getRandomValues(new Uint32Array(1))[0]|0,n=typeof matchMedia=="function"&&matchMedia("(pointer: coarse)").matches,i=new K_(t,r.quality??(n?0:1));try{await i.load(e),r.level===1&&(await i.loadL1(),i.switchL1())}catch(s){throw i.dispose(),s}return i}export{Hs as B,Z_ as C,pn as D,Bs as F,vn as G,rn as H,zs as I,ut as L,wt as M,Fn as N,Ac as P,ti as Q,sn as R,Vt as S,Sh as T,Ze as V,_n as W,z as a,Ue as b,wn as c,Ut as d,vi as e,Ct as f,ht as g,xh as h,Mh as i,Qi as j,Yt as k,xn as l,$_ as m,dh as n,Oe as o,W_ as p,Ki as q,ul as r,Yv as s,_o as t,Ne as u,K_ as v,J_ as w};
