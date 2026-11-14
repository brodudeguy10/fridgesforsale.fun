const xa="attached",Ll="detached";const Pt="srgb",Kt="srgb-linear",qs="linear",it="srgb";const Ma="300 es";function Pl(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function Dl(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function ns(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function Il(){const r=ns("canvas");return r.style.display="block",r}const Sa={};function Ys(...r){const e="THREE."+r.shift();console.log(e,...r)}function zo(r){const e=r[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=r[1];t&&t.isStackTrace?r[0]+=" "+t.getLocation():r[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return r}function Ee(...r){r=zo(r);const e="THREE."+r.shift();{const t=r[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...r)}}function Ie(...r){r=zo(r);const e="THREE."+r.shift();{const t=r[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...r)}}function wi(...r){const e=r.join(" ");e in Sa||(Sa[e]=!0,Ee(...r))}function Fl(r,e,t){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}const Nl={0:0,2:6,4:4,3:5,1:1,6:2,7:7,5:3};class hi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let s=0,a=i.length;s<a;s++)i[s].call(this,e);e.target=null}}}const Ot=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ya=1234567;const ji=Math.PI/180,Di=180/Math.PI;function En(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ot[r&255]+Ot[r>>8&255]+Ot[r>>16&255]+Ot[r>>24&255]+"-"+Ot[e&255]+Ot[e>>8&255]+"-"+Ot[e>>16&15|64]+Ot[e>>24&255]+"-"+Ot[t&63|128]+Ot[t>>8&255]+"-"+Ot[t>>16&255]+Ot[t>>24&255]+Ot[n&255]+Ot[n>>8&255]+Ot[n>>16&255]+Ot[n>>24&255]).toLowerCase()}function We(r,e,t){return Math.max(e,Math.min(t,r))}function Xr(r,e){return(r%e+e)%e}function Ul(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)}function Ol(r,e,t){return r!==e?(t-r)/(e-r):0}function es(r,e,t){return(1-t)*r+t*e}function Bl(r,e,t,n){return es(r,e,1-Math.exp(-t*n))}function zl(r,e=1){return e-Math.abs(Xr(r,e*2)-e)}function kl(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function Gl(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function Hl(r,e){return r+Math.floor(Math.random()*(e-r+1))}function Vl(r,e){return r+Math.random()*(e-r)}function Wl(r){return r*(.5-Math.random())}function Xl(r){r!==void 0&&(ya=r);let e=ya+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function ql(r){return r*ji}function Yl(r){return r*Di}function Kl(r){return r>0&&Number.isInteger(r)&&2**Math.round(Math.log2(r))===r}function Zl(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function ko(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function $l(r,e,t,n,i){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+n)/2),h=a((e+n)/2),u=s((e-n)/2),f=a((e-n)/2),d=s((n-e)/2),g=a((n-e)/2);switch(i){case"XYX":r.set(o*h,l*u,l*f,o*c);break;case"YZY":r.set(l*f,o*h,l*u,o*c);break;case"ZXZ":r.set(l*u,l*f,o*h,o*c);break;case"XZX":r.set(o*h,l*g,l*d,o*c);break;case"YXY":r.set(l*d,o*h,l*g,o*c);break;case"ZYZ":r.set(l*g,l*d,o*h,o*c);break;default:Ee("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function js(r){switch(r.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function qr(r,e){if(e.constructor===Float32Array)return r;const t=js(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(r/t,-1)}function Yr(r,e){if(e.constructor===Float32Array)return r;const t=js(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(r*t)}const Jl={DEG2RAD:ji,RAD2DEG:Di,generateUUID:En,clamp:We,euclideanModulo:Xr,mapLinear:Ul,inverseLerp:Ol,lerp:es,damp:Bl,pingpong:zl,smoothstep:kl,smootherstep:Gl,randInt:Hl,randFloat:Vl,randFloatSpread:Wl,seededRandom:Xl,degToRad:ql,radToDeg:Yl,isPowerOfTwo:Kl,ceilPowerOfTwo:Zl,floorPowerOfTwo:ko,setQuaternionFromProperEuler:$l,normalize:Yr,denormalize:qr};class Ue{static{this.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(We(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*i+e.x,this.y=s*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class zn{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],f=s[a+0],d=s[a+1],g=s[a+2],v=s[a+3];if(u!==v||l!==f||c!==d||h!==g){let m=l*f+c*d+h*g+u*v;m<0&&(f=-f,d=-d,g=-g,v=-v,m=-m);let p=1-o;if(m<.9995){const x=Math.acos(m),b=Math.sin(x);p=Math.sin(p*x)/b,o=Math.sin(o*x)/b,l=l*p+f*o,c=c*p+d*o,h=h*p+g*o,u=u*p+v*o}else{l=l*p+f*o,c=c*p+d*o,h=h*p+g*o,u=u*p+v*o;const x=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=x,c*=x,h*=x,u*=x}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,s,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=s[a],f=s[a+1],d=s[a+2],g=s[a+3];return e[t]=o*g+h*u+l*d-c*f,e[t+1]=l*g+h*f+c*u-o*d,e[t+2]=c*g+h*d+o*f-l*u,e[t+3]=h*g-o*u-l*f-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(s/2),f=l(n/2),d=l(i/2),g=l(s/2);switch(a){case"XYZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"YZX":this._x=f*h*u+c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u-f*d*g;break;case"XZY":this._x=f*h*u-c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u+f*d*g;break;default:Ee("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=n+o+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(s-c)*d,this._z=(a-i)*d}else if(n>o&&n>u){const d=2*Math.sqrt(1+n-o-u);this._w=(h-l)/d,this._x=.25*d,this._y=(i+a)/d,this._z=(s+c)/d}else if(o>u){const d=2*Math.sqrt(1+o-n-u);this._w=(s-c)/d,this._x=(i+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+u-n-o);this._w=(a-i)/d,this._x=(s+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(We(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-s*l,this._y=i*h+a*l+s*o-n*c,this._z=s*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-s*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,s=-s,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class B{static{this.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ba.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ba.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),h=2*(o*t-s*i),u=2*(s*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-s*u,this.z=i+l*u+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-s*o,this.y=s*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ar.copy(this).projectOnVector(e),this.sub(ar)}reflect(e){return this.sub(ar.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(We(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ar=new B,ba=new zn;class ze{static{this.prototype.isMatrix3=!0}constructor(e,t,n,i,s,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c)}set(e,t,n,i,s,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],d=n[5],g=n[8],v=i[0],m=i[3],p=i[6],x=i[1],b=i[4],M=i[7],E=i[2],A=i[5],_=i[8];return s[0]=a*v+o*x+l*E,s[3]=a*m+o*b+l*A,s[6]=a*p+o*M+l*_,s[1]=c*v+h*x+u*E,s[4]=c*m+h*b+u*A,s[7]=c*p+h*M+u*_,s[2]=f*v+d*x+g*E,s[5]=f*m+d*b+g*A,s[8]=f*p+d*M+g*_,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*s*h+n*o*l+i*s*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,f=o*l-h*s,d=c*s-a*l,g=t*u+n*f+i*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=u*v,e[1]=(i*c-h*n)*v,e[2]=(o*n-i*a)*v,e[3]=f*v,e[4]=(h*t-i*l)*v,e[5]=(i*s-o*t)*v,e[6]=d*v,e[7]=(n*l-c*t)*v,e[8]=(a*t-n*s)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return wi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(or.makeScale(e,t)),this}rotate(e){return wi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(or.makeRotation(-e)),this}translate(e,t){return wi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(or.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const or=new ze,Ta=new ze().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ea=new ze().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ql(){const r={enabled:!0,workingColorSpace:Kt,spaces:{},convert:function(i,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===it&&(i.r=Bn(i.r),i.g=Bn(i.g),i.b=Bn(i.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===it&&(i.r=Ri(i.r),i.g=Ri(i.g),i.b=Ri(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===""?qs:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,a){return i.copy(this.spaces[a].fromXYZ).multiply(this.spaces[s].toXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[Kt]:{primaries:e,whitePoint:n,transfer:qs,toXYZ:Ta,fromXYZ:Ea,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Pt},outputColorSpaceConfig:{drawingBufferColorSpace:Pt}},[Pt]:{primaries:e,whitePoint:n,transfer:it,toXYZ:Ta,fromXYZ:Ea,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Pt}}}),r}const Xe=Ql();function Bn(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Ri(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let ui;class jl{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ui===void 0&&(ui=ns("canvas")),ui.width=e.width,ui.height=e.height;const i=ui.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=ui}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ns("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let a=0;a<s.length;a++)s[a]=Bn(s[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Bn(t[n]/255)*255):t[n]=Bn(t[n]);return{data:t,width:e.width,height:e.height}}else return Ee("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let ec=0;class Kr{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:ec++}),this.uuid=En(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?s.push(lr(i[a].image)):s.push(lr(i[a]))}else s=lr(i);n.url=s}return t||(e.images[this.uuid]=n),n}}function lr(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?jl.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(Ee("Texture: Unable to serialize Texture."),{})}let tc=0;const cr=new B;class yt extends hi{constructor(e=yt.DEFAULT_IMAGE,t=yt.DEFAULT_MAPPING,n=1001,i=1001,s=1006,a=1008,o=1023,l=1009,c=yt.DEFAULT_ANISOTROPY,h=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:tc++}),this.uuid=En(),this.name="",this.source=new Kr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ue(0,0),this.repeat=new Ue(1,1),this.center=new Ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ze,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(cr).x}get height(){return this.source.getSize(cr).y}get depth(){return this.source.getSize(cr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Ee(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Ee(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case 1e3:e.x=e.x-Math.floor(e.x);break;case 1001:e.x=e.x<0?0:1;break;case 1002:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case 1e3:e.y=e.y-Math.floor(e.y);break;case 1001:e.y=e.y<0?0:1;break;case 1002:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}yt.DEFAULT_IMAGE=null;yt.DEFAULT_MAPPING=300;yt.DEFAULT_ANISOTROPY=1;class Ze{static{this.prototype.isVector4=!0}constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s;const l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(c+1)/2,M=(d+1)/2,E=(p+1)/2,A=(h+f)/4,_=(u+v)/4,T=(g+m)/4;return b>M&&b>E?b<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(b),i=A/n,s=_/n):M>E?M<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(M),n=A/i,s=T/i):E<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(E),n=_/s,i=T/s),this.set(n,i,s,t),this}let x=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(f-h)*(f-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(u-v)/x,this.z=(f-h)/x,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this.w=We(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this.w=We(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class nc extends hi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Ze(0,0,e,t),this.scissorTest=!1,this.viewport=new Ze(0,0,e,t),this.textures=[];const i=n.count;for(let s=0;s<i;s++)this.textures[s]=new yt({width:e,height:t,depth:n.depth}),this.textures[s].isRenderTargetTexture=!0,this.textures[s].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:1006,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new Kr(i)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class on extends nc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Go extends yt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class ic extends yt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}class Oe{static{this.prototype.isMatrix4=!0}constructor(e,t,n,i,s,a,o,l,c,h,u,f,d,g,v,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c,h,u,f,d,g,v,m)}set(e,t,n,i,s,a,o,l,c,h,u,f,d,g,v,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=s,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Oe().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,i=1/fi.setFromMatrixColumn(e,0).length(),s=1/fi.setFromMatrixColumn(e,1).length(),a=1/fi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){const f=a*h,d=a*u,g=o*h,v=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=d+g*c,t[5]=f-v*c,t[9]=-o*l,t[2]=v-f*c,t[6]=g+d*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*h,d=l*u,g=c*h,v=c*u;t[0]=f+v*o,t[4]=g*o-d,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=d*o-g,t[6]=v+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*h,d=l*u,g=c*h,v=c*u;t[0]=f-v*o,t[4]=-a*u,t[8]=g+d*o,t[1]=d+g*o,t[5]=a*h,t[9]=v-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*h,d=a*u,g=o*h,v=o*u;t[0]=l*h,t[4]=g*c-d,t[8]=f*c+v,t[1]=l*u,t[5]=v*c+f,t[9]=d*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,d=a*c,g=o*l,v=o*c;t[0]=l*h,t[4]=v-f*u,t[8]=g*u+d,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=d*u+g,t[10]=f-v*u}else if(e.order==="XZY"){const f=a*l,d=a*c,g=o*l,v=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+v,t[5]=a*h,t[9]=d*u-g,t[2]=g*u-d,t[6]=o*h,t[10]=v*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(sc,e,rc)}lookAt(e,t,n){const i=this.elements;return Zt.subVectors(e,t),Zt.lengthSq()===0&&(Zt.z=1),Zt.normalize(),Vn.crossVectors(n,Zt),Vn.lengthSq()===0&&(Math.abs(n.z)===1?Zt.x+=1e-4:Zt.z+=1e-4,Zt.normalize(),Vn.crossVectors(n,Zt)),Vn.normalize(),fs.crossVectors(Zt,Vn),i[0]=Vn.x,i[4]=fs.x,i[8]=Zt.x,i[1]=Vn.y,i[5]=fs.y,i[9]=Zt.y,i[2]=Vn.z,i[6]=fs.z,i[10]=Zt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],d=n[13],g=n[2],v=n[6],m=n[10],p=n[14],x=n[3],b=n[7],M=n[11],E=n[15],A=i[0],_=i[4],T=i[8],F=i[12],R=i[1],D=i[5],O=i[9],V=i[13],L=i[2],W=i[6],q=i[10],G=i[14],I=i[3],U=i[7],Y=i[11],te=i[15];return s[0]=a*A+o*R+l*L+c*I,s[4]=a*_+o*D+l*W+c*U,s[8]=a*T+o*O+l*q+c*Y,s[12]=a*F+o*V+l*G+c*te,s[1]=h*A+u*R+f*L+d*I,s[5]=h*_+u*D+f*W+d*U,s[9]=h*T+u*O+f*q+d*Y,s[13]=h*F+u*V+f*G+d*te,s[2]=g*A+v*R+m*L+p*I,s[6]=g*_+v*D+m*W+p*U,s[10]=g*T+v*O+m*q+p*Y,s[14]=g*F+v*V+m*G+p*te,s[3]=x*A+b*R+M*L+E*I,s[7]=x*_+b*D+M*W+E*U,s[11]=x*T+b*O+M*q+E*Y,s[15]=x*F+b*V+M*G+E*te,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],d=e[14],g=e[3],v=e[7],m=e[11],p=e[15],x=l*d-c*f,b=o*d-c*u,M=o*f-l*u,E=a*d-c*h,A=a*f-l*h,_=a*u-o*h;return t*(v*x-m*b+p*M)-n*(g*x-m*E+p*A)+i*(g*b-v*E+p*_)-s*(g*M-v*A+m*_)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(s*h-o*l)+i*(s*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],d=e[11],g=e[12],v=e[13],m=e[14],p=e[15],x=t*o-n*a,b=t*l-i*a,M=t*c-s*a,E=n*l-i*o,A=n*c-s*o,_=i*c-s*l,T=h*v-u*g,F=h*m-f*g,R=h*p-d*g,D=u*m-f*v,O=u*p-d*v,V=f*p-d*m,L=x*V-b*O+M*D+E*R-A*F+_*T;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const W=1/L;return e[0]=(o*V-l*O+c*D)*W,e[1]=(i*O-n*V-s*D)*W,e[2]=(v*_-m*A+p*E)*W,e[3]=(f*A-u*_-d*E)*W,e[4]=(l*R-a*V-c*F)*W,e[5]=(t*V-i*R+s*F)*W,e[6]=(m*M-g*_-p*b)*W,e[7]=(h*_-f*M+d*b)*W,e[8]=(a*O-o*R+c*T)*W,e[9]=(n*R-t*O-s*T)*W,e[10]=(g*A-v*M+p*x)*W,e[11]=(u*M-h*A-d*x)*W,e[12]=(o*F-a*D-l*T)*W,e[13]=(t*D-n*F+i*T)*W,e[14]=(v*b-g*E-m*x)*W,e[15]=(h*E-u*b+f*x)*W,this}scale(e){const t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,a){return this.set(1,n,s,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,u=o+o,f=s*c,d=s*h,g=s*u,v=a*h,m=a*u,p=o*u,x=l*c,b=l*h,M=l*u,E=n.x,A=n.y,_=n.z;return i[0]=(1-(v+p))*E,i[1]=(d+M)*E,i[2]=(g-b)*E,i[3]=0,i[4]=(d-M)*A,i[5]=(1-(f+p))*A,i[6]=(m+x)*A,i[7]=0,i[8]=(g+b)*_,i[9]=(m-x)*_,i[10]=(1-(f+v))*_,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];const s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let a=fi.set(i[0],i[1],i[2]).length();const o=fi.set(i[4],i[5],i[6]).length(),l=fi.set(i[8],i[9],i[10]).length();s<0&&(a=-a),hn.copy(this);const c=1/a,h=1/o,u=1/l;return hn.elements[0]*=c,hn.elements[1]*=c,hn.elements[2]*=c,hn.elements[4]*=h,hn.elements[5]*=h,hn.elements[6]*=h,hn.elements[8]*=u,hn.elements[9]*=u,hn.elements[10]*=u,t.setFromRotationMatrix(hn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,i,s,a,o=2e3,l=!1){const c=this.elements,h=2*s/(t-e),u=2*s/(n-i),f=(t+e)/(t-e),d=(n+i)/(n-i);let g,v;if(l)g=s/(a-s),v=a*s/(a-s);else if(o===2e3)g=-(a+s)/(a-s),v=-2*a*s/(a-s);else if(o===2001)g=-a/(a-s),v=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,s,a,o=2e3,l=!1){const c=this.elements,h=2/(t-e),u=2/(n-i),f=-(t+e)/(t-e),d=-(n+i)/(n-i);let g,v;if(l)g=1/(a-s),v=a/(a-s);else if(o===2e3)g=-2/(a-s),v=-(a+s)/(a-s);else if(o===2001)g=-1/(a-s),v=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const fi=new B,hn=new Oe,sc=new B(0,0,0),rc=new B(1,1,1),Vn=new B,fs=new B,Zt=new B,Aa=new Oe,wa=new zn;class Qn{constructor(e=0,t=0,n=0,i=Qn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,s=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],f=i[6],d=i[10];switch(t){case"XYZ":this._y=Math.asin(We(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-We(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(We(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-We(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(We(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-We(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,d),this._y=0);break;default:Ee("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Aa.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Aa,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return wa.setFromEuler(this),this.setFromQuaternion(wa,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Qn.DEFAULT_ORDER="XYZ";class Ho{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let ac=0;const Ra=new B,di=new zn,wn=new Oe,ds=new B,Gi=new B,oc=new B,lc=new zn,Ca=new B(1,0,0),La=new B(0,1,0),Pa=new B(0,0,1),Da={type:"added"},cc={type:"removed"},pi={type:"childadded",child:null},hr={type:"childremoved",child:null};class pt extends hi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ac++}),this.uuid=En(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=pt.DEFAULT_UP.clone();const e=new B,t=new Qn,n=new zn,i=new B(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Oe},normalMatrix:{value:new ze}}),this.matrix=new Oe,this.matrixWorld=new Oe,this.matrixAutoUpdate=pt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=pt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ho,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return di.setFromAxisAngle(e,t),this.quaternion.multiply(di),this}rotateOnWorldAxis(e,t){return di.setFromAxisAngle(e,t),this.quaternion.premultiply(di),this}rotateX(e){return this.rotateOnAxis(Ca,e)}rotateY(e){return this.rotateOnAxis(La,e)}rotateZ(e){return this.rotateOnAxis(Pa,e)}translateOnAxis(e,t){return Ra.copy(e).applyQuaternion(this.quaternion),this.position.add(Ra.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ca,e)}translateY(e){return this.translateOnAxis(La,e)}translateZ(e){return this.translateOnAxis(Pa,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(wn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ds.copy(e):ds.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Gi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?wn.lookAt(Gi,ds,this.up):wn.lookAt(ds,Gi,this.up),this.quaternion.setFromRotationMatrix(wn),i&&(wn.extractRotation(i.matrixWorld),di.setFromRotationMatrix(wn),this.quaternion.premultiply(di.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ie("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Da),pi.child=e,this.dispatchEvent(pi),pi.child=null):Ie("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(cc),hr.child=e,this.dispatchEvent(hr),hr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),wn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),wn.multiply(e.parent.matrixWorld)),e.applyMatrix4(wn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Da),pi.child=e,this.dispatchEvent(pi),pi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gi,e,oc),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gi,lc,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,i=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*i,s[13]+=n-s[1]*t-s[5]*n-s[9]*i,s[14]+=i-s[2]*t-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));i.material=o}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),f=a(e.skeletons),d=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}pt.DEFAULT_UP=new B(0,1,0);pt.DEFAULT_MATRIX_AUTO_UPDATE=!0;pt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class an extends pt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const hc={type:"move"};class ur{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new an,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new an,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new an,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,n),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.quaternion,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;c.inputState.pinching&&f>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(hc)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new an;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Vo={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Wn={h:0,s:0,l:0},ps={h:0,s:0,l:0};function fr(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class Fe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Pt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Xe.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=Xe.workingColorSpace){return this.r=e,this.g=t,this.b=n,Xe.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=Xe.workingColorSpace){if(e=Xr(e,1),t=We(t,0,1),n=We(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=fr(a,s,e+1/3),this.g=fr(a,s,e),this.b=fr(a,s,e-1/3)}return Xe.colorSpaceToWorking(this,i),this}setStyle(e,t=Pt){function n(s){s!==void 0&&parseFloat(s)<1&&Ee("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseFloat(s[1]))/100,Math.min(100,parseFloat(s[2]))/100,Math.min(100,parseFloat(s[3]))/100,t);break;case"hsl":case"hsla":if(s=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Ee("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=i[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);Ee("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Pt){const n=Vo[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ee("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Bn(e.r),this.g=Bn(e.g),this.b=Bn(e.b),this}copyLinearToSRGB(e){return this.r=Ri(e.r),this.g=Ri(e.g),this.b=Ri(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Pt){return Xe.workingToColorSpace(Bt.copy(this),e),Math.round(We(Bt.r*255,0,255))*65536+Math.round(We(Bt.g*255,0,255))*256+Math.round(We(Bt.b*255,0,255))}getHexString(e=Pt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Xe.workingColorSpace){Xe.workingToColorSpace(Bt.copy(this),t);const n=Bt.r,i=Bt.g,s=Bt.b,a=Math.max(n,i,s),o=Math.min(n,i,s);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(i-s)/u+(i<s?6:0);break;case i:l=(s-n)/u+2;break;case s:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Xe.workingColorSpace){return Xe.workingToColorSpace(Bt.copy(this),t),e.r=Bt.r,e.g=Bt.g,e.b=Bt.b,e}getStyle(e=Pt){Xe.workingToColorSpace(Bt.copy(this),e);const t=Bt.r,n=Bt.g,i=Bt.b;return e!==Pt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Wn),this.setHSL(Wn.h+e,Wn.s+t,Wn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Wn),e.getHSL(ps);const n=es(Wn.h,ps.h,t),i=es(Wn.s,ps.s,t),s=es(Wn.l,ps.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Bt=new Fe;Fe.NAMES=Vo;class Wo extends pt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Qn,this.environmentIntensity=1,this.environmentRotation=new Qn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const un=new B,Rn=new B,dr=new B,Cn=new B,mi=new B,gi=new B,Ia=new B,pr=new B,mr=new B,gr=new B,_r=new Ze,vr=new Ze,xr=new Ze;class pn{constructor(e=new B,t=new B,n=new B){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),un.subVectors(e,t),i.cross(un);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){un.subVectors(i,t),Rn.subVectors(n,t),dr.subVectors(e,t);const a=un.dot(un),o=un.dot(Rn),l=un.dot(dr),c=Rn.dot(Rn),h=Rn.dot(dr),u=a*c-o*o;if(u===0)return s.set(0,0,0),null;const f=1/u,d=(c*l-o*h)*f,g=(a*h-o*l)*f;return s.set(1-d-g,g,d)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Cn)===null?!1:Cn.x>=0&&Cn.y>=0&&Cn.x+Cn.y<=1}static getInterpolation(e,t,n,i,s,a,o,l){return this.getBarycoord(e,t,n,i,Cn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Cn.x),l.addScaledVector(a,Cn.y),l.addScaledVector(o,Cn.z),l)}static getInterpolatedAttribute(e,t,n,i,s,a){return _r.setScalar(0),vr.setScalar(0),xr.setScalar(0),_r.fromBufferAttribute(e,t),vr.fromBufferAttribute(e,n),xr.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(_r,s.x),a.addScaledVector(vr,s.y),a.addScaledVector(xr,s.z),a}static isFrontFacing(e,t,n,i){return un.subVectors(n,t),Rn.subVectors(e,t),un.cross(Rn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return un.subVectors(this.c,this.b),Rn.subVectors(this.a,this.b),un.cross(Rn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return pn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return pn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return pn.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return pn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return pn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,s=this.c;let a,o;mi.subVectors(i,n),gi.subVectors(s,n),pr.subVectors(e,n);const l=mi.dot(pr),c=gi.dot(pr);if(l<=0&&c<=0)return t.copy(n);mr.subVectors(e,i);const h=mi.dot(mr),u=gi.dot(mr);if(h>=0&&u<=h)return t.copy(i);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0&&l-h>0)return a=l/(l-h),t.copy(n).addScaledVector(mi,a);gr.subVectors(e,s);const d=mi.dot(gr),g=gi.dot(gr);if(g>=0&&d<=g)return t.copy(s);const v=d*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(gi,o);const m=h*g-d*u;if(m<=0&&u-h>=0&&d-g>=0)return Ia.subVectors(s,i),o=(u-h)/(u-h+(d-g)),t.copy(i).addScaledVector(Ia,o);const p=1/(m+v+f);return a=v*p,o=f*p,t.copy(n).addScaledVector(mi,a).addScaledVector(gi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class kn{constructor(e=new B(1/0,1/0,1/0),t=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(fn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(fn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=fn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,fn):fn.fromBufferAttribute(s,a),fn.applyMatrix4(e.matrixWorld),this.expandByPoint(fn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ms.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ms.copy(n.boundingBox)),ms.applyMatrix4(e.matrixWorld),this.union(ms)}const i=e.children;for(let s=0,a=i.length;s<a;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,fn),fn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Hi),gs.subVectors(this.max,Hi),_i.subVectors(e.a,Hi),vi.subVectors(e.b,Hi),xi.subVectors(e.c,Hi),Xn.subVectors(vi,_i),qn.subVectors(xi,vi),ii.subVectors(_i,xi);let t=[0,-Xn.z,Xn.y,0,-qn.z,qn.y,0,-ii.z,ii.y,Xn.z,0,-Xn.x,qn.z,0,-qn.x,ii.z,0,-ii.x,-Xn.y,Xn.x,0,-qn.y,qn.x,0,-ii.y,ii.x,0];return!Mr(t,_i,vi,xi,gs)||(t=[1,0,0,0,1,0,0,0,1],!Mr(t,_i,vi,xi,gs))?!1:(_s.crossVectors(Xn,qn),t=[_s.x,_s.y,_s.z],Mr(t,_i,vi,xi,gs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,fn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(fn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ln[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ln[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ln[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ln[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ln[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ln[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ln[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ln[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ln),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Ln=[new B,new B,new B,new B,new B,new B,new B,new B],fn=new B,ms=new kn,_i=new B,vi=new B,xi=new B,Xn=new B,qn=new B,ii=new B,Hi=new B,gs=new B,_s=new B,si=new B;function Mr(r,e,t,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){si.fromArray(r,s);const o=i.x*Math.abs(si.x)+i.y*Math.abs(si.y)+i.z*Math.abs(si.z),l=e.dot(si),c=t.dot(si),h=n.dot(si);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Fn=uc();function uc(){const r=new ArrayBuffer(4),e=new Float32Array(r),t=new Uint32Array(r),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,i[l]=24,i[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,i[l]=-c-1,i[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,i[l]=13,i[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,i[l]=24,i[l|256]=24):(n[l]=31744,n[l|256]=64512,i[l]=13,i[l|256]=13)}const s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,s[l]=c|h}for(let l=1024;l<2048;++l)s[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:s,exponentTable:a,offsetTable:o}}function fc(r){Math.abs(r)>65504&&Ee("DataUtils.toHalfFloat(): Value out of range."),r=We(r,-65504,65504),Fn.floatView[0]=r;const e=Fn.uint32View[0],t=e>>23&511;return Fn.baseTable[t]+((e&8388607)>>Fn.shiftTable[t])}function dc(r){const e=r>>10;return Fn.uint32View[0]=Fn.mantissaTable[Fn.offsetTable[e]+(r&1023)]+Fn.exponentTable[e],Fn.floatView[0]}class Fa{static toHalfFloat(e){return fc(e)}static fromHalfFloat(e){return dc(e)}}const _t=new B,vs=new Ue;let pc=0;class dt extends hi{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:pc++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=35044,this.updateRanges=[],this.gpuType=1015,this.version=0,this._normalizationScale=e!==void 0?js(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)vs.fromBufferAttribute(this,t),vs.applyMatrix3(e),this.setXY(t,vs.x,vs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix3(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix4(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyNormalMatrix(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.transformDirection(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),i=this._normalize(i),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):qr(e,this.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):Yr(e,this.array)}}class Xo extends dt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class qo extends dt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class mn extends dt{constructor(e,t,n){super(new Float32Array(e),t,n)}}const mc=new kn,Vi=new B,Sr=new B;class ln{constructor(e=new B,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):mc.setFromPoints(e).getCenter(n);let i=0;for(let s=0,a=e.length;s<a;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Vi.subVectors(e,this.center);const t=Vi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Vi,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Sr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Vi.copy(e.center).add(Sr)),this.expandByPoint(Vi.copy(e.center).sub(Sr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let gc=0;const tn=new Oe,yr=new pt,Mi=new B,$t=new kn,Wi=new kn,Ct=new B;class Vt extends hi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:gc++}),this.uuid=En(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Pl(e)?qo:Xo)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new ze().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return tn.makeRotationFromQuaternion(e),this.applyMatrix4(tn),this}rotateX(e){return tn.makeRotationX(e),this.applyMatrix4(tn),this}rotateY(e){return tn.makeRotationY(e),this.applyMatrix4(tn),this}rotateZ(e){return tn.makeRotationZ(e),this.applyMatrix4(tn),this}translate(e,t,n){return tn.makeTranslation(e,t,n),this.applyMatrix4(tn),this}scale(e,t,n){return tn.makeScale(e,t,n),this.applyMatrix4(tn),this}lookAt(e){return yr.lookAt(e),yr.updateMatrix(),this.applyMatrix4(yr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Mi).negate(),this.translate(Mi.x,Mi.y,Mi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,s=e.length;i<s;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new mn(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&Ee("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new kn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ie("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const s=t[n];$t.setFromBufferAttribute(s),this.morphTargetsRelative?(Ct.addVectors(this.boundingBox.min,$t.min),this.boundingBox.expandByPoint(Ct),Ct.addVectors(this.boundingBox.max,$t.max),this.boundingBox.expandByPoint(Ct)):(this.boundingBox.expandByPoint($t.min),this.boundingBox.expandByPoint($t.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ie('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ln);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ie("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new B,1/0);return}if(e){const n=this.boundingSphere.center;if($t.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];Wi.setFromBufferAttribute(o),this.morphTargetsRelative?(Ct.addVectors($t.min,Wi.min),$t.expandByPoint(Ct),Ct.addVectors($t.max,Wi.max),$t.expandByPoint(Ct)):($t.expandByPoint(Wi.min),$t.expandByPoint(Wi.max))}$t.getCenter(n);let i=0;for(let s=0,a=e.count;s<a;s++)Ct.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Ct));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ct.fromBufferAttribute(o,c),l&&(Mi.fromBufferAttribute(e,c),Ct.add(Mi)),i=Math.max(i,n.distanceToSquared(Ct))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Ie('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ie("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,s=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new dt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[],c=new Uint8Array(n.count);for(let F=0;F<n.count;F++)o[F]=new B,l[F]=new B;const h=new B,u=new B,f=new B,d=new Ue,g=new Ue,v=new Ue,m=new B,p=new B;function x(F,R,D){c[F]=c[R]=c[D]=1,h.fromBufferAttribute(n,F),u.fromBufferAttribute(n,R),f.fromBufferAttribute(n,D),d.fromBufferAttribute(s,F),g.fromBufferAttribute(s,R),v.fromBufferAttribute(s,D),u.sub(h),f.sub(h),g.sub(d),v.sub(d);const O=1/(g.x*v.y-v.x*g.y);isFinite(O)&&(m.copy(u).multiplyScalar(v.y).addScaledVector(f,-g.y).multiplyScalar(O),p.copy(f).multiplyScalar(g.x).addScaledVector(u,-v.x).multiplyScalar(O),o[F].add(m),o[R].add(m),o[D].add(m),l[F].add(p),l[R].add(p),l[D].add(p))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let F=0,R=b.length;F<R;++F){const D=b[F],O=D.start,V=D.count;for(let L=O,W=O+V;L<W;L+=3)x(e.getX(L+0),e.getX(L+1),e.getX(L+2))}const M=new B,E=new B,A=new B,_=new B;function T(F){A.fromBufferAttribute(i,F),_.copy(A);const R=o[F];M.copy(R),M.sub(A.multiplyScalar(A.dot(R))).normalize(),E.crossVectors(_,R);const O=E.dot(l[F])<0?-1:1;a.setXYZW(F,M.x,M.y,M.z,O)}for(let F=0,R=n.count;F<R;++F)c[F]&&T(F);this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new dt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const i=new B,s=new B,a=new B,o=new B,l=new B,c=new B,h=new B,u=new B;if(e)for(let f=0,d=e.count;f<d;f+=3){const g=e.getX(f+0),v=e.getX(f+1),m=e.getX(f+2);i.fromBufferAttribute(t,g),s.fromBufferAttribute(t,v),a.fromBufferAttribute(t,m),h.subVectors(a,s),u.subVectors(i,s),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,d=t.count;f<d;f+=3)i.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),h.subVectors(a,s),u.subVectors(i,s),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ct.fromBufferAttribute(e,t),Ct.normalize(),e.setXYZ(t,Ct.x,Ct.y,Ct.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h);let d=0,g=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?d=l[v]*o.data.stride+o.offset:d=l[v]*h;for(let p=0;p<h;p++)f[g++]=c[d++]}return new dt(f,h,u)}if(this.index===null)return Ee("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Vt,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let h=0,u=c.length;h<u;h++){const f=c[h],d=e(f,n);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const d=c[u];h.push(d.toJSON(e.data))}h.length>0&&(i[l]=h,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const s=e.morphAttributes;for(const c in s){const h=[],u=s[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class _c{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=35044,this.updateRanges=[],this.version=0,this.uuid=En()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});const t=Na(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);const n=new this.array.constructor(e.arrayBuffers[t]),i=new this.constructor(n,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});const t=Na(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));const n={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}}function Na(r){return r.buffer._uuid===void 0&&(r.buffer._uuid=En()),r.byteOffset===0&&r.byteLength===r.buffer.byteLength?r.buffer._uuid:r.buffer._uuid+":"+r.byteOffset+":"+r.byteLength}const Gt=new B;class Zr{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i,this._normalizationScale=e!==void 0?js(e.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyMatrix4(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyNormalMatrix(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.transformDirection(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),i=this._normalize(i)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),i=this._normalize(i),s=this._normalize(s)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){Ys("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new dt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Zr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Ys("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):qr(e,this.data.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):Yr(e,this.data.array)}}const br=new B,vc=new B,xc=new ze;class Zn{constructor(e=new B(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=br.subVectors(n,t).cross(vc.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const i=e.delta(br),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||xc.getNormalMatrix(e),i=this.coplanarPoint(br).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let Mc=0;class Tn extends hi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Mc++}),this.uuid=En(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Fe(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Ee(`Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Ee(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=i(e.textures),a=i(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Fe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Zn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Ue().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ue().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Pn=new B,Tr=new B,xs=new B,Ms=new B;class er{constructor(e=new B,t=new B(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Pn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Pn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Pn.copy(this.origin).addScaledVector(this.direction,t),Pn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Tr.copy(e).add(t).multiplyScalar(.5),xs.copy(t).sub(e).normalize(),Ms.copy(this.origin).sub(Tr);const s=e.distanceTo(t)*.5,a=-this.direction.dot(xs),o=Ms.dot(this.direction),l=-Ms.dot(xs),c=Ms.lengthSq(),h=Math.abs(1-a*a);let u,f,d,g;if(h>0)if(u=a*l-o,f=a*o-l,g=s*h,u>=0)if(f>=-g)if(f<=g){const v=1/h;u*=v,f*=v,d=u*(u+a*f+2*o)+f*(a*u+f+2*l)+c}else f=s,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;else f=-s,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-a*s+o)),f=u>0?-s:Math.min(Math.max(-s,-l),s),d=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-s,-l),s),d=f*(f+2*l)+c):(u=Math.max(0,-(a*s+o)),f=u>0?s:Math.min(Math.max(-s,-l),s),d=-u*u+f*(f+2*l)+c);else f=a>0?-s:s,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Tr).addScaledVector(xs,f),d}intersectSphere(e,t){if(e.radius<0)return null;Pn.subVectors(e.center,this.origin);const n=Pn.dot(this.direction),i=Pn.dot(Pn)-n*n,s=e.radius*e.radius;if(i>s)return null;const a=Math.sqrt(s-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,i=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,i=(e.min.x-f.x)*c),h>=0?(s=(e.min.y-f.y)*h,a=(e.max.y-f.y)*h):(s=(e.max.y-f.y)*h,a=(e.min.y-f.y)*h),n>a||s>i||((s>n||isNaN(n))&&(n=s),(a<i||isNaN(i))&&(i=a),u>=0?(o=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(o=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Pn)!==null}intersectTriangle(e,t,n,i,s){const a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,u=e.x-a.x,f=e.y-a.y,d=e.z-a.z,g=t.x-a.x,v=t.y-a.y,m=t.z-a.z,p=n.x-a.x,x=n.y-a.y,b=n.z-a.z,M=Math.abs(l),E=Math.abs(c),A=Math.abs(h);let _,T,F,R,D,O,V,L,W,q,G,I;if(M>=E&&M>=A?(F=l,O=u,W=g,I=p,l>=0?(_=c,T=h,R=f,D=d,V=v,L=m,q=x,G=b):(_=h,T=c,R=d,D=f,V=m,L=v,q=b,G=x)):E>=A?(F=c,O=f,W=v,I=x,c>=0?(_=h,T=l,R=d,D=u,V=m,L=g,q=b,G=p):(_=l,T=h,R=u,D=d,V=g,L=m,q=p,G=b)):(F=h,O=d,W=m,I=b,h>=0?(_=l,T=c,R=u,D=f,V=g,L=v,q=p,G=x):(_=c,T=l,R=f,D=u,V=v,L=g,q=x,G=p)),F===0)return null;const U=_/F,Y=T/F,te=1/F,xe=R-U*O,Le=D-Y*O,$=V-U*W,me=L-Y*W,Me=q-U*I,we=G-Y*I,pe=Me*me-we*$,De=xe*we-Le*Me,Je=$*Le-me*xe;if(i){if(pe<0||De<0||Je<0)return null}else if((pe<0||De<0||Je<0)&&(pe>0||De>0||Je>0))return null;const Pe=pe+De+Je;if(Pe===0)return null;const je=te*(pe*O+De*W+Je*I);return(Pe>0?je<0:je>0)?null:this.at(je/Pe,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ai extends Tn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Fe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Qn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ua=new Oe,ri=new er,Ss=new ln,Oa=new B,ys=new B,bs=new B,Ts=new B,Er=new B,Es=new B,Ba=new B,As=new B;class bt extends pt{constructor(e=new Vt,t=new Ai){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(s&&o){Es.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=o[l],u=s[l];h!==0&&(Er.fromBufferAttribute(u,e),a?Es.addScaledVector(Er,h):Es.addScaledVector(Er.sub(t),h))}t.add(Es)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ss.copy(n.boundingSphere),Ss.applyMatrix4(s),ri.copy(e.ray).recast(e.near),!(Ss.containsPoint(ri.origin)===!1&&(ri.intersectSphere(Ss,Oa)===null||ri.origin.distanceToSquared(Oa)>(e.far-e.near)**2))&&(Ua.copy(s).invert(),ri.copy(e.ray).applyMatrix4(Ua),!(n.boundingBox!==null&&ri.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ri)))}_computeIntersections(e,t,n){let i;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,f=s.groups,d=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=f.length;g<v;g++){const m=f[g],p=a[m.materialIndex],x=Math.max(m.start,d.start),b=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let M=x,E=b;M<E;M+=3){const A=o.getX(M),_=o.getX(M+1),T=o.getX(M+2);i=ws(this,p,e,n,c,h,u,A,_,T),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,d.start),v=Math.min(o.count,d.start+d.count);for(let m=g,p=v;m<p;m+=3){const x=o.getX(m),b=o.getX(m+1),M=o.getX(m+2);i=ws(this,a,e,n,c,h,u,x,b,M),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,v=f.length;g<v;g++){const m=f[g],p=a[m.materialIndex],x=Math.max(m.start,d.start),b=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let M=x,E=b;M<E;M+=3){const A=M,_=M+1,T=M+2;i=ws(this,p,e,n,c,h,u,A,_,T),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,d.start),v=Math.min(l.count,d.start+d.count);for(let m=g,p=v;m<p;m+=3){const x=m,b=m+1,M=m+2;i=ws(this,a,e,n,c,h,u,x,b,M),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function Sc(r,e,t,n,i,s,a,o){let l;if(e.side===1?l=n.intersectTriangle(a,s,i,!0,o):l=n.intersectTriangle(i,s,a,e.side===0,o),l===null)return null;As.copy(o),As.applyMatrix4(r.matrixWorld);const c=t.ray.origin.distanceTo(As);return c<t.near||c>t.far?null:{distance:c,point:As.clone(),object:r}}function ws(r,e,t,n,i,s,a,o,l,c){r.getVertexPosition(o,ys),r.getVertexPosition(l,bs),r.getVertexPosition(c,Ts);const h=Sc(r,e,t,n,ys,bs,Ts,Ba);if(h){const u=new B;pn.getBarycoord(Ba,ys,bs,Ts,u),i&&(h.uv=pn.getInterpolatedAttribute(i,o,l,c,u,new Ue)),s&&(h.uv1=pn.getInterpolatedAttribute(s,o,l,c,u,new Ue)),a&&(h.normal=pn.getInterpolatedAttribute(a,o,l,c,u,new B),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new B,materialIndex:0};pn.getNormal(ys,bs,Ts,f.normal),h.face=f,h.barycoord=u}return h}const Xi=new Ze,za=new Ze,ka=new Ze,yc=new Ze,Ga=new Oe,Rs=new B,Ar=new ln,Ha=new Oe,wr=new er;class bc extends bt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=xa,this.bindMatrix=new Oe,this.bindMatrixInverse=new Oe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new kn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Rs),this.boundingBox.expandByPoint(Rs)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new ln),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Rs),this.boundingSphere.expandByPoint(Rs)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ar.copy(this.boundingSphere),Ar.applyMatrix4(i),e.ray.intersectsSphere(Ar)!==!1&&(Ha.copy(i).invert(),wr.copy(e.ray).applyMatrix4(Ha),!(this.boundingBox!==null&&wr.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,wr)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new Ze,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===xa?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Ll?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ee("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;za.fromBufferAttribute(i.attributes.skinIndex,e),ka.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(Xi.copy(t),t.set(0,0,0,0)):(Xi.set(t.x,t.y,t.z,1),t.set(0,0,0)),Xi.applyMatrix4(this.bindMatrix);for(let s=0;s<4;s++){const a=ka.getComponent(s);if(a!==0){const o=za.getComponent(s);Ga.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(yc.copy(Xi).applyMatrix4(Ga),a)}}return t.isVector4&&(t.w=Xi.w),t.applyMatrix4(this.bindMatrixInverse)}}class Yo extends pt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Ci extends yt{constructor(e=null,t=1,n=1,i,s,a,o,l,c=1003,h=1003,u,f){super(null,a,o,l,c,h,i,s,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Va=new Oe,Tc=new Oe;class $r{constructor(e=[],t=[]){this.uuid=En(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.previousBoneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ee("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Oe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Oe;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,a=e.length;s<a;s++){const o=e[s]?e[s].matrixWorld:Tc;Va.multiplyMatrices(o,t[s]),Va.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new $r(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Ci(t,e,e,1023,1015);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null),this.previousBoneTexture!==null&&(this.previousBoneTexture.dispose(),this.previousBoneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const s=e.bones[n];let a=t[s];a===void 0&&(Ee("Skeleton: No bone found with UUID:",s),a=new Yo),this.bones.push(a),this.boneInverses.push(new Oe().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){const a=t[i];e.bones.push(a.uuid);const o=n[i];e.boneInverses.push(o.toArray())}return e}}class is extends dt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Si=new Oe,Wa=new Oe,Cs=[],Xa=new kn,Ec=new Oe,qi=new bt,Yi=new ln;class Ko extends bt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new is(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Ec)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new kn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Si),Xa.copy(e.boundingBox).applyMatrix4(Si),this.boundingBox.union(Xa)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ln),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Si),Yi.copy(e.boundingSphere).applyMatrix4(Si),this.boundingSphere.union(Yi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,a=e*s+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(qi.geometry=this.geometry,qi.material=this.material,qi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Yi.copy(this.boundingSphere),Yi.applyMatrix4(n),e.ray.intersectsSphere(Yi)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,Si),Wa.multiplyMatrices(n,Si),qi.matrixWorld=Wa,qi.raycast(e,Cs);for(let a=0,o=Cs.length;a<o;a++){const l=Cs[a];l.instanceId=s,l.object=this,t.push(l)}Cs.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new is(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ci(new Float32Array(i*this.count),i,this.count,1028,1015));const s=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;return s[l]=o,s.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const ai=new ln,Ac=new Ue(.5,.5),Ls=new B;class ss{constructor(e=new Zn,t=new Zn,n=new Zn,i=new Zn,s=new Zn,a=new Zn){this.planes=[e,t,n,i,s,a]}set(e,t,n,i,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=2e3,n=!1){const i=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],h=s[4],u=s[5],f=s[6],d=s[7],g=s[8],v=s[9],m=s[10],p=s[11],x=s[12],b=s[13],M=s[14],E=s[15];if(i[0].setComponents(c-a,d-h,p-g,E-x).normalize(),i[1].setComponents(c+a,d+h,p+g,E+x).normalize(),i[2].setComponents(c+o,d+u,p+v,E+b).normalize(),i[3].setComponents(c-o,d-u,p-v,E-b).normalize(),n)i[4].setComponents(l,f,m,M).normalize(),i[5].setComponents(c-l,d-f,p-m,E-M).normalize();else if(i[4].setComponents(c-l,d-f,p-m,E-M).normalize(),t===2e3)i[5].setComponents(c+l,d+f,p+m,E+M).normalize();else if(t===2001)i[5].setComponents(l,f,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ai.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ai.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ai)}intersectsSprite(e){ai.center.set(0,0,0);const t=Ac.distanceTo(e.center);return ai.radius=.7071067811865476+t,ai.applyMatrix4(e.matrixWorld),this.intersectsSphere(ai)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Ls.x=i.normal.x>0?e.max.x:e.min.x,Ls.y=i.normal.y>0?e.max.y:e.min.y,Ls.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Ls)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const qa=new Oe;class Jr{constructor(){this.coordinateSystem=2e3,this._frustums=[],this._count=0}setFromArrayCamera(e){const t=e.cameras,n=this._frustums;for(let i=0;i<t.length;i++){const s=t[i];qa.multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse),n[i]===void 0&&(n[i]=new ss),n[i].setFromProjectionMatrix(qa,s.coordinateSystem,s.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;const t=this._frustums,n=e._frustums;for(let i=0;i<e._count;i++)t[i]===void 0&&(t[i]=new ss),t[i].copy(n[i]);return this._count=e._count,this}clone(){return new Jr().copy(this)}}class Zo extends Tn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Fe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ks=new B,Zs=new B,Ya=new Oe,Ki=new er,Ps=new ln,Rr=new B,Ka=new B;class Qr extends pt{constructor(e=new Vt,t=new Zo){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)Ks.fromBufferAttribute(t,i-1),Zs.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Ks.distanceTo(Zs);e.setAttribute("lineDistance",new mn(n,1))}else Ee("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ps.copy(n.boundingSphere),Ps.applyMatrix4(i),Ps.radius+=s,e.ray.intersectsSphere(Ps)===!1)return;Ya.copy(i).invert(),Ki.copy(e.ray).applyMatrix4(Ya);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const d=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let v=d,m=g-1;v<m;v+=c){const p=h.getX(v),x=h.getX(v+1),b=Ds(this,e,Ki,l,p,x,v);b&&t.push(b)}if(this.isLineLoop){const v=h.getX(g-1),m=h.getX(d),p=Ds(this,e,Ki,l,v,m,g-1);p&&t.push(p)}}else{const d=Math.max(0,a.start),g=Math.min(f.count,a.start+a.count);for(let v=d,m=g-1;v<m;v+=c){const p=Ds(this,e,Ki,l,v,v+1,v);p&&t.push(p)}if(this.isLineLoop){const v=Ds(this,e,Ki,l,g-1,d,g-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Ds(r,e,t,n,i,s,a){const o=r.geometry.attributes.position;if(Ks.fromBufferAttribute(o,i),Zs.fromBufferAttribute(o,s),t.distanceSqToSegment(Ks,Zs,Rr,Ka)>n)return;Rr.applyMatrix4(r.matrixWorld);const c=e.ray.origin.distanceTo(Rr);if(!(c<e.near||c>e.far))return{distance:c,point:Ka.clone().applyMatrix4(r.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:r}}const Za=new B,$a=new B;class wc extends Qr{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)Za.fromBufferAttribute(t,i),$a.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Za.distanceTo($a);e.setAttribute("lineDistance",new mn(n,1))}else Ee("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Rc extends Qr{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class $o extends Tn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Fe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Ja=new Oe,zr=new er,Is=new ln,Fs=new B;class Cc extends pt{constructor(e=new Vt,t=new $o){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Is.copy(n.boundingSphere),Is.applyMatrix4(i),Is.radius+=s,e.ray.intersectsSphere(Is)===!1)return;Ja.copy(i).invert(),zr.copy(e.ray).applyMatrix4(Ja);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){const f=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let g=f,v=d;g<v;g++){const m=c.getX(g);Fs.fromBufferAttribute(u,m),Qa(Fs,m,l,i,e,t,this)}}else{const f=Math.max(0,a.start),d=Math.min(u.count,a.start+a.count);for(let g=f,v=d;g<v;g++)Fs.fromBufferAttribute(u,g),Qa(Fs,g,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Qa(r,e,t,n,i,s,a){const o=zr.distanceSqToPoint(r);if(o<t){const l=new B;zr.closestPointToPoint(r,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Jo extends yt{constructor(e=[],t=301,n,i,s,a,o,l,c,h){super(e,t,n,i,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Ii extends yt{constructor(e,t,n=1014,i,s,a,o=1003,l=1003,c,h=1026,u=1){if(h!==1026&&h!==1027)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:u};super(f,i,s,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Kr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Qo extends Ii{constructor(e,t=1014,n=301,i,s,a=1003,o=1003,l,c=1026){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,i,s,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class jo extends yt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class os extends Vt{constructor(e=1,t=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};const o=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],h=[],u=[];let f=0,d=0;g("z","y","x",-1,-1,n,t,e,a,s,0),g("z","y","x",1,-1,n,t,-e,a,s,1),g("x","z","y",1,1,e,n,t,i,a,2),g("x","z","y",1,-1,e,n,-t,i,a,3),g("x","y","z",1,-1,e,t,n,i,s,4),g("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new mn(c,3)),this.setAttribute("normal",new mn(h,3)),this.setAttribute("uv",new mn(u,2));function g(v,m,p,x,b,M,E,A,_,T,F){const R=M/_,D=E/T,O=M/2,V=E/2,L=A/2,W=_+1,q=T+1;let G=0,I=0;const U=new B;for(let Y=0;Y<q;Y++){const te=Y*D-V;for(let xe=0;xe<W;xe++){const Le=xe*R-O;U[v]=Le*x,U[m]=te*b,U[p]=L,c.push(U.x,U.y,U.z),U[v]=0,U[m]=0,U[p]=A>0?1:-1,h.push(U.x,U.y,U.z),u.push(xe/_),u.push(1-Y/T),G+=1}}for(let Y=0;Y<T;Y++)for(let te=0;te<_;te++){const xe=f+te+W*Y,Le=f+te+W*(Y+1),$=f+(te+1)+W*(Y+1),me=f+(te+1)+W*Y;l.push(xe,Le,me),l.push(Le,$,me),I+=6}o.addGroup(d,I,F),d+=I,f+=G}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new os(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class jn extends Vt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=e/o,f=t/l,d=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const x=p*f-a;for(let b=0;b<c;b++){const M=b*u-s;g.push(M,-x,0),v.push(0,0,1),m.push(b/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<o;x++){const b=x+c*p,M=x+c*(p+1),E=x+1+c*(p+1),A=x+1+c*p;d.push(b,M,A),d.push(M,E,A)}this.setIndex(d),this.setAttribute("position",new mn(g,3)),this.setAttribute("normal",new mn(v,3)),this.setAttribute("uv",new mn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new jn(e.width,e.height,e.widthSegments,e.heightSegments)}}function Fi(r){const e={};for(const t in r){e[t]={};for(const n in r[t]){const i=r[t][n];if(ja(i))i.isRenderTargetTexture?(Ee("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(ja(i[0])){const s=[];for(let a=0,o=i.length;a<o;a++)s[a]=i[a].clone();e[t][n]=s}else e[t][n]=i.slice();else e[t][n]=i}}return e}function Ht(r){const e={};for(let t=0;t<r.length;t++){const n=Fi(r[t]);for(const i in n)e[i]=n[i]}return e}function ja(r){return r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)}function Lc(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function el(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Xe.workingColorSpace}const Pc={clone:Fi,merge:Ht};var Dc=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ic=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class zt extends Tn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Dc,this.fragmentShader=Ic,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Fi(e.uniforms),this.uniformsGroups=Lc(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new Fe().setHex(i.value);break;case"v2":this.uniforms[n].value=new Ue().fromArray(i.value);break;case"v3":this.uniforms[n].value=new B().fromArray(i.value);break;case"v4":this.uniforms[n].value=new Ze().fromArray(i.value);break;case"m3":this.uniforms[n].value=new ze().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Oe().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Fc extends zt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class jr extends Tn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Fe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Fe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new Ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Qn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class gn extends jr{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ue(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return We(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new Fe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Fe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Fe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(e){this._diffuseRoughness>0!=e>0&&this.version++,this._diffuseRoughness=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}get iridescenceThicknessRange(){return wi('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(e){wi('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=e[0],this.iridescenceThicknessMaximum=e[1]}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.diffuseRoughness=e.diffuseRoughness,this.diffuseRoughnessMap=e.diffuseRoughnessMap,this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum,this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Nc extends Tn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Uc extends Tn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function $n(r,e){return!r||r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function Ji(r){return r!==void 0&&r.inTangents!==void 0&&r.outTangents!==void 0}function Oc(r){function e(i,s){return r[i]-r[s]}const t=r.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function eo(r,e,t){const n=r.length,i=new r.constructor(n);for(let s=0,a=0;a!==n;++s){const o=t[s]*e;for(let l=0;l!==e;++l)i[a++]=r[o+l]}return i}function Bc(r,e,t,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let a=s[n];if(a!==void 0)if(Array.isArray(a))do a=s[n],a!==void 0&&(e.push(s.time),t.push(...a)),s=r[i++];while(s!==void 0);else if(a.toArray!==void 0)do a=s[n],a!==void 0&&(e.push(s.time),a.toArray(t,t.length)),s=r[i++];while(s!==void 0);else do a=s[n],a!==void 0&&(e.push(s.time),t.push(a)),s=r[i++];while(s!==void 0)}class Ni{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],s=t[n-1];n:{e:{let a;t:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=i,i=t[++n],e<i)break e}a=t.length;break t}if(!(e>=s)){const o=t[1];e<o&&(n=2,s=o);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=s,s=t[--n-1],e>=s)break e}a=n,n=0;break t}break n}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let a=0;a!==i;++a)t[a]=n[s+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class zc extends Ni{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:2400,endingEnd:2400}}intervalChanged_(e,t,n){const i=this.parameterPositions;let s=e-2,a=e+1,o=i[s],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case 2401:s=e,o=2*t-n;break;case 2402:s=i.length-2,o=t+i[s]-i[s+1];break;default:s=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case 2401:a=e,l=2*n-t;break;case 2402:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}const c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=s*h,this._offsetNext=a*h}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,g=(n-t)/(i-t),v=g*g,m=v*g,p=-f*m+2*f*v-f*g,x=(1+f)*m+(-1.5-2*f)*v+(-.5+f)*g+1,b=(-1-d)*m+(1.5+d)*v+.5*g,M=d*m-d*v;for(let E=0;E!==o;++E)s[E]=p*a[h+E]+x*a[c+E]+b*a[l+E]+M*a[u+E];return s}}class kc extends Ni{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(i-t),u=1-h;for(let f=0;f!==o;++f)s[f]=a[c+f]*u+a[l+f]*h;return s}}class Gc extends Ni{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class Hc extends Ni{interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,u=this.outTangents;if(!h||!u){const g=(n-t)/(i-t),v=1-g;for(let m=0;m!==o;++m)s[m]=a[c+m]*v+a[l+m]*g;return s}const f=o*2,d=e-1;for(let g=0;g!==o;++g){const v=a[c+g],m=a[l+g],p=d*f+g*2,x=u[p],b=u[p+1],M=e*f+g*2,E=h[M],A=h[M+1],_=Wc(n,t,x,E,i);s[g]=tl(_,v,b,A,m)}return s}}function tl(r,e,t,n,i){const s=1-r;return s*s*s*e+3*s*s*r*t+3*s*r*r*n+r*r*r*i}function Vc(r,e,t,n,i){const s=1-r;return 3*s*s*(t-e)+6*s*r*(n-t)+3*r*r*(i-n)}function Wc(r,e,t,n,i){let s=(r-e)/(i-e);for(let a=0;a<8;a++){const o=tl(s,e,t,n,i)-r;if(Math.abs(o)<1e-10)break;const l=Vc(s,e,t,n,i);if(Math.abs(l)<1e-10)break;s=Math.max(0,Math.min(1,s-o/l))}return s}class _n{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=$n(t,this.TimeBufferType),this.values=$n(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:$n(e.times,Array),values:$n(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i),Ji(e.settings)&&(n.settings={inTangents:$n(e.settings.inTangents,Array),outTangents:$n(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Gc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new kc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new zc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new Hc(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case 2300:t=this.InterpolantFactoryMethodDiscrete;break;case 2301:t=this.InterpolantFactoryMethodLinear;break;case 2302:t=this.InterpolantFactoryMethodSmooth;break;case 2303:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ee("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return 2300;case this.InterpolantFactoryMethodLinear:return 2301;case this.InterpolantFactoryMethodSmooth:return 2302;case this.InterpolantFactoryMethodBezier:return 2303}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e;Ji(this.settings)&&(to(this.settings.inTangents,e),to(this.settings.outTangents,e))}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e;Ji(this.settings)&&(no(this.settings.inTangents,e),no(this.settings.outTangents,e))}return this}trim(e,t){const n=this.times,i=n.length;let s=0,a=i-1;for(;s!==i&&n[s]<e;)++s;for(;a!==-1&&n[a]>t;)--a;if(++a,s!==0||a!==i){s>=a&&(a=Math.max(a,1),s=a-1);const o=this.getValueSize();this.times=n.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(Ie("KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,s=n.length;s===0&&(Ie("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){Ie("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Ie("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&Dl(i))for(let o=0,l=i.length;o!==l;++o){const c=i[o];if(isNaN(c)){Ie("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===2302,s=e.length-1;let a=1;for(let o=1;o<s;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(i)l=!0;else{const u=o*n,f=u-n,d=u+n;for(let g=0;g!==n;++g){const v=t[u+g];if(v!==t[f+g]||v!==t[d+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const u=o*n,f=a*n;for(let d=0;d!==n;++d)t[f+d]=t[u+d]}++a}}if(s>0){e[a]=e[s];for(let o=s*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,Ji(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}}function to(r,e){for(let t=0,n=r.length;t!==n;t+=2)r[t]+=e}function no(r,e){for(let t=0,n=r.length;t!==n;t+=2)r[t]*=e}_n.prototype.ValueTypeName="";_n.prototype.TimeBufferType=Float32Array;_n.prototype.ValueBufferType=Float32Array;_n.prototype.DefaultInterpolation=2301;class Ui extends _n{constructor(e,t,n){super(e,t,n)}}Ui.prototype.ValueTypeName="bool";Ui.prototype.ValueBufferType=Array;Ui.prototype.DefaultInterpolation=2300;Ui.prototype.InterpolantFactoryMethodLinear=void 0;Ui.prototype.InterpolantFactoryMethodSmooth=void 0;class nl extends _n{constructor(e,t,n,i){super(e,t,n,i)}}nl.prototype.ValueTypeName="color";class rs extends _n{constructor(e,t,n,i){super(e,t,n,i)}}rs.prototype.ValueTypeName="number";class Xc extends Ni{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t);let c=e*o;for(let h=c+o;c!==h;c+=4)zn.slerpFlat(s,0,a,c-o,a,c,l);return s}}class as extends _n{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new Xc(this.times,this.values,this.getValueSize(),e)}}as.prototype.ValueTypeName="quaternion";as.prototype.InterpolantFactoryMethodSmooth=void 0;class Oi extends _n{constructor(e,t,n){super(e,t,n)}}Oi.prototype.ValueTypeName="string";Oi.prototype.ValueBufferType=Array;Oi.prototype.DefaultInterpolation=2300;Oi.prototype.InterpolantFactoryMethodLinear=void 0;Oi.prototype.InterpolantFactoryMethodSmooth=void 0;class $s extends _n{constructor(e,t,n,i){super(e,t,n,i)}}$s.prototype.ValueTypeName="vector";class qc{constructor(e="",t=-1,n=[],i=2500){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=En(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(Kc(n[a]).scale(i));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,a=n.length;s!==a;++s)t.push(_n.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const s=t.length,a=[];for(let o=0;o<s;o++){let l=[],c=[];l.push((o+s-1)%s,o,(o+1)%s),c.push(0,1,0);const h=Oc(l);l=eo(l,1,h),c=eo(c,1,h),!i&&l[0]===0&&(l.push(s),c.push(c[0])),a.push(new rs(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(s);if(h&&h.length>1){const u=h[1];let f=i[u];f||(i[u]=f=[]),f.push(c)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function Yc(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return rs;case"vector":case"vector2":case"vector3":case"vector4":return $s;case"color":return nl;case"quaternion":return as;case"bool":case"boolean":return Ui;case"string":return Oi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function Kc(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=Yc(r.type);if(r.times===void 0){const n=[],i=[];Bc(r.keys,n,i,"value"),r.times=n,r.values=i}let t;return e.parse!==void 0?t=e.parse(r):t=new e(r.name,r.times,r.values,r.interpolation),Ji(r.settings)&&(t.settings={inTangents:$n(r.settings.inTangents,Float32Array),outTangents:$n(r.settings.outTangents,Float32Array)}),t}const On={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(io(r)||(this.files[r]=e))},get:function(r){if(this.enabled!==!1&&!io(r))return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};function io(r){try{const e=r.slice(r.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class Zc{constructor(e,t,n){const i=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,s===!1&&i.onStart!==void 0&&i.onStart(h,a,o),s=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){const d=c[u],g=c[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const $c=new Zc;class Bi{constructor(e){this.manager=e!==void 0?e:$c,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}}Bi.DEFAULT_MATERIAL_NAME="__DEFAULT";const Dn={};class Jc extends Error{constructor(e,t){super(e),this.response=t}}class il extends Bi{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=On.get(`file:${e}`);if(s!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0);return}if(Dn[e]!==void 0){Dn[e].push({onLoad:t,onProgress:n,onError:i});return}Dn[e]=[],Dn[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",priority:this.priority,cache:this.cache,signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Ee("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=Dn[e],u=c.body.getReader(),f=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=f?parseInt(f):0,g=d!==0;let v=0;const m=new ReadableStream({start(p){x();function x(){u.read().then(({done:b,value:M})=>{if(b)p.close();else{v+=M.byteLength;const E=new ProgressEvent("progress",{lengthComputable:g,loaded:v,total:d});for(let A=0,_=h.length;A<_;A++){const T=h[A];T.onProgress&&T.onProgress(E)}p.enqueue(M),x()}},b=>{p.error(b)})}}});return new Response(m)}else throw new Jc(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const u=/charset="?([^;"\s]*)"?/i.exec(o),f=u&&u[1]?u[1].toLowerCase():void 0,d=new TextDecoder(f);return c.arrayBuffer().then(g=>d.decode(g))}}}).then(c=>{On.add(`file:${e}`,c);const h=Dn[e];delete Dn[e];for(let u=0,f=h.length;u<f;u++){const d=h[u];d.onLoad&&d.onLoad(c)}}).catch(c=>{const h=Dn[e];if(h===void 0)throw this.manager.itemError(e),c;delete Dn[e];for(let u=0,f=h.length;u<f;u++){const d=h[u];d.onError&&d.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const yi=new WeakMap;class Qc extends Bi{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=On.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);else{let u=yi.get(a);u===void 0&&(u=[],yi.set(a,u)),u.push({onLoad:t,onError:i})}return a}const o=ns("img");function l(){h(),t&&t(this);const u=yi.get(this)||[];for(let f=0;f<u.length;f++){const d=u[f];d.onLoad&&d.onLoad(this)}yi.delete(this),s.manager.itemEnd(e)}function c(u){h(),i&&i(u),On.remove(`image:${e}`);const f=yi.get(this)||[];for(let d=0;d<f.length;d++){const g=f[d];g.onError&&g.onError(u)}yi.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),On.add(`image:${e}`,o),s.manager.itemStart(e),o.fetchPriority=this.priority,o.src=e,o}}class jc extends Bi{constructor(e){super(e)}load(e,t,n,i){const s=new yt,a=new Qc(this.manager);return a.setPriority(this.priority),a.setCache(this.cache),a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}}class ea extends pt{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Fe(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}const Cr=new Oe,so=new B,ro=new B;class ta{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ue(512,512),this.mapType=1009,this.map=null,this.mapPass=null,this.matrix=new Oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ss,this._frameExtents=new Ue(1,1),this._viewportCount=1,this._viewports=[new Ze(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;so.setFromMatrixPosition(e.matrixWorld),t.position.copy(so),ro.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ro),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){Cr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Cr,e.coordinateSystem,e.reversedDepth);const s=this._frameExtents,a=i?i.z/s.x:1,o=i?i.w/s.y:1,l=i?i.x/s.x:0,c=i?i.y/s.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Cr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Ns=new B,Us=new zn,xn=new B;class sl extends pt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Oe,this.projectionMatrix=new Oe,this.projectionMatrixInverse=new Oe,this.coordinateSystem=2e3,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Ns,Us,xn),xn.x===1&&xn.y===1&&xn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ns,Us,xn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Ns,Us,xn),xn.x===1&&xn.y===1&&xn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ns,Us,xn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Yn=new B,ao=new Ue,oo=new Ue;class Yt extends sl{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Di*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ji*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Di*2*Math.atan(Math.tan(ji*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Yn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Yn.x,Yn.y).multiplyScalar(-e/Yn.z),Yn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Yn.x,Yn.y).multiplyScalar(-e/Yn.z)}getViewSize(e,t){return this.getViewBounds(e,ao,oo),t.subVectors(oo,ao)}setViewOffset(e,t,n,i,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ji*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class eh extends ta{constructor(){super(new Yt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=Di*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){const e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}}class th extends ea{constructor(e,t,n=0,i=Math.PI/3,s=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(pt.DEFAULT_UP),this.updateMatrix(),this.target=new pt,this.distance=n,this.angle=i,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new eh}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class nh extends ta{constructor(){super(new Yt(90,1,.5,500)),this.isPointLightShadow=!0}}class ih extends ea{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new nh}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class tr extends sl{constructor(e=-1,t=1,n=1,i=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class sh extends ta{constructor(){super(new tr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class rh extends ea{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(pt.DEFAULT_UP),this.updateMatrix(),this.target=new pt,this.shadow=new sh}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class ts{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const Lr=new WeakMap;class ah extends Bi{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ee("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ee("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=On.get(`image-bitmap:${e}`);if(a!==void 0){if(s.manager.itemStart(e),a.then){a.then(c=>{Lr.has(a)===!0?(i&&i(Lr.get(a)),s.manager.itemError(e),s.manager.itemEnd(e)):(t&&t(c),s.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);return}const o={};o.credentials=this.withCredentials||this.crossOrigin!=="anonymous"?"include":"same-origin",o.headers=this.requestHeader,o.priority=this.priority,o.cache=this.cache,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},s.options,{colorSpaceConversion:"none"}))}).then(function(c){return On.add(`image-bitmap:${e}`,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){i&&i(c),Lr.set(l,c),On.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});On.add(`image-bitmap:${e}`,l),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const bi=-90,Ti=1;class kr extends pt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Yt(bi,Ti,e,t);i.layers=this.layers,this.add(i);const s=new Yt(bi,Ti,e,t);s.layers=this.layers,this.add(s);const a=new Yt(bi,Ti,e,t);a.layers=this.layers,this.add(a);const o=new Yt(bi,Ti,e,t);o.layers=this.layers,this.add(o);const l=new Yt(bi,Ti,e,t);l.layers=this.layers,this.add(l);const c=new Yt(bi,Ti,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,1,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.mipmapsAutoUpdate=v,e.setRenderTarget(n,5,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,f,d),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class oh extends Yt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}}const na="\\[\\]\\.:\\/",lh=new RegExp("["+na+"]","g"),ia="[^"+na+"]",ch="[^"+na.replace("\\.","")+"]",hh=/((?:WC+[\/:])*)/.source.replace("WC",ia),uh=/(WCOD+)?/.source.replace("WCOD",ch),fh=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",ia),dh=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",ia),ph=new RegExp("^"+hh+uh+fh+dh+"$"),mh=["material","materials","bones","map"];class gh{constructor(e,t,n){const i=n||st.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class st{constructor(e,t,n){this.path=t,this.parsedPath=n||st.parseTrackName(t),this.node=st.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new st.Composite(e,t,n):new st(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(lh,"")}static parseTrackName(e){const t=ph.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const s=n.nodeName.substring(i+1);mh.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(s){for(let a=0;a<s.length;a++){const o=s[a];if(o.name===t||o.uuid===t)return o;const l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let s=t.propertyIndex;if(e||(e=st.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ee("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Ie("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ie("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ie("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ie("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ie("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ie("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Ie("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[i];if(a===void 0){const c=t.nodeName;Ie("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){Ie("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ie("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}st.Composite=gh;st.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};st.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};st.prototype.GetterByBindingType=[st.prototype._getValue_direct,st.prototype._getValue_array,st.prototype._getValue_arrayElement,st.prototype._getValue_toArray];st.prototype.SetterByBindingTypeAndVersioning=[[st.prototype._setValue_direct,st.prototype._setValue_direct_setNeedsUpdate,st.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[st.prototype._setValue_array,st.prototype._setValue_array_setNeedsUpdate,st.prototype._setValue_array_setMatrixWorldNeedsUpdate],[st.prototype._setValue_arrayElement,st.prototype._setValue_arrayElement_setNeedsUpdate,st.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[st.prototype._setValue_fromArray,st.prototype._setValue_fromArray_setNeedsUpdate,st.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];function lo(r,e,t,n){const i=_h(n);switch(t){case 1021:return r*e;case 1028:return r*e/i.components*i.byteLength;case 1029:return r*e/i.components*i.byteLength;case 1030:return r*e*2/i.components*i.byteLength;case 1031:return r*e*2/i.components*i.byteLength;case 1022:return r*e*3/i.components*i.byteLength;case 1023:return r*e*4/i.components*i.byteLength;case 1033:return r*e*4/i.components*i.byteLength;case 33776:case 33777:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case 33778:case 33779:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case 35841:case 35843:return Math.max(r,16)*Math.max(e,8)/4;case 35840:case 35842:return Math.max(r,8)*Math.max(e,8)/2;case 36196:case 37492:case 37488:case 37489:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case 37496:case 37490:case 37491:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case 37808:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case 37809:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case 37810:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case 37811:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case 37812:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case 37813:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case 37814:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case 37815:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case 37816:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case 37817:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case 37818:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case 37819:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case 37820:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case 37821:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(r/4)*Math.ceil(e/4)*16;case 36283:case 36284:return Math.ceil(r/4)*Math.ceil(e/4)*8;case 36285:case 36286:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function _h(r){switch(r){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:case 35899:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?Ee("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");function rl(){let r=null,e=!1,t=null,n=null;function i(s,a){n=r.requestAnimationFrame(i),t(s,a)}return{start:function(){e!==!0&&t!==null&&r!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r!==null&&r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function vh(r){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,f=r.createBuffer();r.bindBuffer(l,f),r.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=r.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=r.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=r.HALF_FLOAT:d=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=r.SHORT;else if(c instanceof Uint32Array)d=r.UNSIGNED_INT;else if(c instanceof Int32Array)d=r.INT;else if(c instanceof Int8Array)d=r.BYTE;else if(c instanceof Uint8Array)d=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(r.bindBuffer(c,o),u.length===0)r.bufferSubData(c,0,h);else{u.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<u.length;d++){const g=u[f],v=u[d];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++f,u[f]=v)}u.length=f+1;for(let d=0,g=u.length;d<g;d++){const v=u[d];r.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(r.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:s,update:a}}var xh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Mh=`#ifdef USE_ALPHAHASH
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
#endif`,Sh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,yh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bh=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Th=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Eh=`#ifdef USE_AOMAP
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
#endif`,Ah=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,wh=`#ifdef USE_BATCHING
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
#endif`,Rh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ch=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Lh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ph=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Dh=`#ifdef USE_IRIDESCENCE
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
#endif`,Ih=`#ifdef USE_BUMPMAP
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
#endif`,Fh=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Nh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Uh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Oh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Bh=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,zh=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,kh=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Gh=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Hh=`#define PI 3.141592653589793
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
} // validated`,Vh=`vec3 transformedNormal = objectNormal;
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
#endif`,Wh=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Xh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,qh=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Yh=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Kh="gl_FragColor = linearToOutputTexel( gl_FragColor );",Zh=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,$h=`#ifdef USE_ENVMAP
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
#endif`,Jh=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Qh=`#ifdef USE_ENVMAP
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
#endif`,jh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,eu=`#ifdef USE_ENVMAP
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
#endif`,tu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,nu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,iu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,su=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ru=`#ifdef USE_GRADIENTMAP
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
}`,au=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ou=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,cu=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,hu=`#ifdef USE_ENVMAP
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
#endif`,uu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,fu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,du=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,pu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,mu=`PhysicalMaterial material;
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
#endif`,gu=`uniform sampler2D dfgLUT;
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
}`,_u=`
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
#endif`,vu=`#if defined( RE_IndirectDiffuse )
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
#endif`,xu=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Mu=`#if NUM_LIGHT_PROBE_GRIDS > 0
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
#endif`,Su=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,yu=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bu=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Tu=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Eu=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Au=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,wu=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Ru=`#if defined( USE_POINTS_UV )
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
#endif`,Cu=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Lu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Pu=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Du=`#if defined( USE_MORPHCOLORS )
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
#endif`,Iu=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fu=`#ifdef USE_MORPHTARGETS
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
#endif`,Nu=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Uu=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Ou=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Bu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ku=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Gu=`#ifdef USE_NORMALMAP
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
#endif`,Hu=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Vu=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Wu=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Xu=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,qu=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Yu=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Ku=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Zu=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,$u=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ju=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Qu=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ju=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ef=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,tf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,nf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,sf=`float getShadowMask() {
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
}`,rf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,af=`#ifdef USE_SKINNING
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
#endif`,of=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,lf=`#ifdef USE_SKINNING
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
#endif`,cf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,hf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,uf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ff=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,df=`#ifdef USE_TRANSMISSION
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
#endif`,pf=`#ifdef USE_TRANSMISSION
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
#endif`,mf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_f=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,vf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const xf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Mf=`uniform sampler2D t2D;
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
}`,Sf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,yf=`uniform float backgroundBlurriness;
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
}`,bf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Tf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ef=`#include <common>
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
}`,Af=`#if DEPTH_PACKING == 3200
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
}`,wf=`#define DISTANCE
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
}`,Rf=`#define DISTANCE
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
}`,Cf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Lf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pf=`uniform float scale;
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
}`,Df=`uniform vec3 diffuse;
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
}`,If=`#include <common>
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
}`,Ff=`uniform vec3 diffuse;
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
}`,Nf=`#define LAMBERT
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
}`,Uf=`#define LAMBERT
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
}`,Of=`#define MATCAP
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
}`,Bf=`#define MATCAP
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
}`,zf=`#define NORMAL
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
}`,kf=`#define NORMAL
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
}`,Gf=`#define PHONG
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
}`,Hf=`#define PHONG
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
}`,Vf=`#define STANDARD
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
}`,Wf=`#define STANDARD
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
}`,Xf=`#define TOON
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
}`,qf=`#define TOON
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
}`,Yf=`uniform float size;
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
}`,Kf=`uniform vec3 diffuse;
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
}`,Zf=`#include <common>
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
}`,$f=`uniform vec3 color;
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
}`,Jf=`uniform float rotation;
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
}`,Qf=`uniform vec3 diffuse;
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
}`,He={alphahash_fragment:xh,alphahash_pars_fragment:Mh,alphamap_fragment:Sh,alphamap_pars_fragment:yh,alphatest_fragment:bh,alphatest_pars_fragment:Th,aomap_fragment:Eh,aomap_pars_fragment:Ah,batching_pars_vertex:wh,batching_vertex:Rh,begin_vertex:Ch,beginnormal_vertex:Lh,bsdfs:Ph,iridescence_fragment:Dh,bumpmap_pars_fragment:Ih,clipping_planes_fragment:Fh,clipping_planes_pars_fragment:Nh,clipping_planes_pars_vertex:Uh,clipping_planes_vertex:Oh,color_fragment:Bh,color_pars_fragment:zh,color_pars_vertex:kh,color_vertex:Gh,common:Hh,defaultnormal_vertex:Vh,displacementmap_pars_vertex:Wh,displacementmap_vertex:Xh,emissivemap_fragment:qh,emissivemap_pars_fragment:Yh,colorspace_fragment:Kh,colorspace_pars_fragment:Zh,envmap_fragment:$h,envmap_common_pars_fragment:Jh,envmap_pars_fragment:Qh,envmap_pars_vertex:jh,envmap_physical_pars_fragment:hu,envmap_vertex:eu,fog_vertex:tu,fog_pars_vertex:nu,fog_fragment:iu,fog_pars_fragment:su,gradientmap_pars_fragment:ru,lightmap_pars_fragment:au,lights_lambert_fragment:ou,lights_lambert_pars_fragment:lu,lights_pars_begin:cu,lights_toon_fragment:uu,lights_toon_pars_fragment:fu,lights_phong_fragment:du,lights_phong_pars_fragment:pu,lights_physical_fragment:mu,lights_physical_pars_fragment:gu,lights_fragment_begin:_u,lights_fragment_maps:vu,lights_fragment_end:xu,lightprobes_pars_fragment:Mu,logdepthbuf_fragment:Su,logdepthbuf_pars_fragment:yu,logdepthbuf_pars_vertex:bu,logdepthbuf_vertex:Tu,map_fragment:Eu,map_pars_fragment:Au,map_particle_fragment:wu,map_particle_pars_fragment:Ru,metalnessmap_fragment:Cu,metalnessmap_pars_fragment:Lu,morphinstance_vertex:Pu,morphcolor_vertex:Du,morphnormal_vertex:Iu,morphtarget_pars_vertex:Fu,morphtarget_vertex:Nu,normal_fragment_begin:Uu,normal_fragment_maps:Ou,normal_pars_fragment:Bu,normal_pars_vertex:zu,normal_vertex:ku,normalmap_pars_fragment:Gu,clearcoat_normal_fragment_begin:Hu,clearcoat_normal_fragment_maps:Vu,clearcoat_pars_fragment:Wu,iridescence_pars_fragment:Xu,opaque_fragment:qu,packing:Yu,premultiplied_alpha_fragment:Ku,project_vertex:Zu,dithering_fragment:$u,dithering_pars_fragment:Ju,roughnessmap_fragment:Qu,roughnessmap_pars_fragment:ju,shadowmap_pars_fragment:ef,shadowmap_pars_vertex:tf,shadowmap_vertex:nf,shadowmask_pars_fragment:sf,skinbase_vertex:rf,skinning_pars_vertex:af,skinning_vertex:of,skinnormal_vertex:lf,specularmap_fragment:cf,specularmap_pars_fragment:hf,tonemapping_fragment:uf,tonemapping_pars_fragment:ff,transmission_fragment:df,transmission_pars_fragment:pf,uv_pars_fragment:mf,uv_pars_vertex:gf,uv_vertex:_f,worldpos_vertex:vf,background_vert:xf,background_frag:Mf,backgroundCube_vert:Sf,backgroundCube_frag:yf,cube_vert:bf,cube_frag:Tf,depth_vert:Ef,depth_frag:Af,distance_vert:wf,distance_frag:Rf,equirect_vert:Cf,equirect_frag:Lf,linedashed_vert:Pf,linedashed_frag:Df,meshbasic_vert:If,meshbasic_frag:Ff,meshlambert_vert:Nf,meshlambert_frag:Uf,meshmatcap_vert:Of,meshmatcap_frag:Bf,meshnormal_vert:zf,meshnormal_frag:kf,meshphong_vert:Gf,meshphong_frag:Hf,meshphysical_vert:Vf,meshphysical_frag:Wf,meshtoon_vert:Xf,meshtoon_frag:qf,points_vert:Yf,points_frag:Kf,shadow_vert:Zf,shadow_frag:$f,sprite_vert:Jf,sprite_frag:Qf},_e={common:{diffuse:{value:new Fe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ze}},envmap:{envMap:{value:null},envMapRotation:{value:new ze},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ze},normalScale:{value:new Ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Fe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Fe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0},uvTransform:{value:new ze}},sprite:{diffuse:{value:new Fe(16777215)},opacity:{value:1},center:{value:new Ue(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}}},yn={basic:{uniforms:Ht([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:He.meshbasic_vert,fragmentShader:He.meshbasic_frag},lambert:{uniforms:Ht([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Fe(0)},envMapIntensity:{value:1}}]),vertexShader:He.meshlambert_vert,fragmentShader:He.meshlambert_frag},phong:{uniforms:Ht([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Fe(0)},specular:{value:new Fe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:He.meshphong_vert,fragmentShader:He.meshphong_frag},standard:{uniforms:Ht([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new Fe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag},toon:{uniforms:Ht([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new Fe(0)}}]),vertexShader:He.meshtoon_vert,fragmentShader:He.meshtoon_frag},matcap:{uniforms:Ht([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:He.meshmatcap_vert,fragmentShader:He.meshmatcap_frag},points:{uniforms:Ht([_e.points,_e.fog]),vertexShader:He.points_vert,fragmentShader:He.points_frag},dashed:{uniforms:Ht([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:He.linedashed_vert,fragmentShader:He.linedashed_frag},depth:{uniforms:Ht([_e.common,_e.displacementmap]),vertexShader:He.depth_vert,fragmentShader:He.depth_frag},normal:{uniforms:Ht([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:He.meshnormal_vert,fragmentShader:He.meshnormal_frag},sprite:{uniforms:Ht([_e.sprite,_e.fog]),vertexShader:He.sprite_vert,fragmentShader:He.sprite_frag},background:{uniforms:{uvTransform:{value:new ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:He.background_vert,fragmentShader:He.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ze}},vertexShader:He.backgroundCube_vert,fragmentShader:He.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:He.cube_vert,fragmentShader:He.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:He.equirect_vert,fragmentShader:He.equirect_frag},distance:{uniforms:Ht([_e.common,_e.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:He.distance_vert,fragmentShader:He.distance_frag},shadow:{uniforms:Ht([_e.lights,_e.fog,{color:{value:new Fe(0)},opacity:{value:1}}]),vertexShader:He.shadow_vert,fragmentShader:He.shadow_frag}};yn.physical={uniforms:Ht([yn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ze},clearcoatNormalScale:{value:new Ue(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ze},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new ze},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ze},sheen:{value:0},sheenColor:{value:new Fe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ze},transmissionSamplerSize:{value:new Ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ze},attenuationDistance:{value:0},attenuationColor:{value:new Fe(0)},specularColor:{value:new Fe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ze},anisotropyVector:{value:new Ue},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ze}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag};const Os={r:0,b:0,g:0},jf=new Oe,al=new ze;al.set(-1,0,0,0,1,0,0,0,1);function ed(r,e,t,n,i,s){const a=new Fe(0);let o=i===!0?0:1,l,c,h=null,u=0,f=null;function d(x){let b=x.isScene===!0?x.background:null;if(b&&b.isTexture){const M=x.backgroundBlurriness>0;b=e.get(b,M)}return b}function g(x){let b=!1;const M=d(x);M===null?m(a,o):M&&M.isColor&&(m(M,1),b=!0);const E=r.xr.getEnvironmentBlendMode();E==="additive"?t.buffers.color.setClear(0,0,0,1,s):E==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(r.autoClear||b)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function v(x,b){const M=d(b);M&&M.isCubeTexture?(c===void 0&&(c=new bt(new os(1,1,1),new zt({name:"BackgroundCubeMaterial",uniforms:Fi(yn.backgroundCube.uniforms),vertexShader:yn.backgroundCube.vertexShader,fragmentShader:yn.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,A,_){this.matrixWorld.copyPosition(_.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(jf.makeRotationFromEuler(b.backgroundRotation)).transpose(),M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(al),c.material.toneMapped=Xe.getTransfer(M.colorSpace)!==it,(h!==M||u!==M.version||f!==r.toneMapping)&&(c.material.needsUpdate=!0,h=M,u=M.version,f=r.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new bt(new jn(2,2),new zt({name:"BackgroundMaterial",uniforms:Fi(yn.background.uniforms),vertexShader:yn.background.vertexShader,fragmentShader:yn.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=Xe.getTransfer(M.colorSpace)!==it,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||u!==M.version||f!==r.toneMapping)&&(l.material.needsUpdate=!0,h=M,u=M.version,f=r.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function m(x,b){x.getRGB(Os,el(r)),t.buffers.color.setClear(Os.r,Os.g,Os.b,b,s)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(x,b=1){a.set(x),o=b,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(x){o=x,m(a,o)},render:g,addToRenderList:v,dispose:p}}function td(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=f(null);let s=i,a=!1;function o(D,O,V,L,W){let q=!1;const G=u(D,L,V,O);s!==G&&(s=G,c(s.object)),q=d(D,L,V,W),q&&g(D,L,V,W),W!==null&&e.update(W,r.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,M(D,O,V,L),W!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function l(){return r.createVertexArray()}function c(D){return r.bindVertexArray(D)}function h(D){return r.deleteVertexArray(D)}function u(D,O,V,L){const W=L.wireframe===!0;let q=n[O.id];q===void 0&&(q={},n[O.id]=q);const G=D.isInstancedMesh===!0?D.id:0;let I=q[G];I===void 0&&(I={},q[G]=I);let U=I[V.id];U===void 0&&(U={},I[V.id]=U);let Y=U[W];return Y===void 0&&(Y=f(l()),U[W]=Y),Y}function f(D){const O=[],V=[],L=[];for(let W=0;W<t;W++)O[W]=0,V[W]=0,L[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:V,attributeDivisors:L,object:D,attributes:{},index:null}}function d(D,O,V,L){const W=s.attributes,q=O.attributes;let G=0;const I=V.getAttributes();for(const U in I)if(I[U].location>=0){const te=W[U];let xe=q[U];if(xe===void 0&&(U==="instanceMatrix"&&D.instanceMatrix&&(xe=D.instanceMatrix),U==="instanceColor"&&D.instanceColor&&(xe=D.instanceColor)),te===void 0||te.attribute!==xe||xe&&te.data!==xe.data)return!0;G++}return s.attributesNum!==G||s.index!==L}function g(D,O,V,L){const W={},q=O.attributes;let G=0;const I=V.getAttributes();for(const U in I)if(I[U].location>=0){let te=q[U];te===void 0&&(U==="instanceMatrix"&&D.instanceMatrix&&(te=D.instanceMatrix),U==="instanceColor"&&D.instanceColor&&(te=D.instanceColor));const xe={};xe.attribute=te,te&&te.data&&(xe.data=te.data),W[U]=xe,G++}s.attributes=W,s.attributesNum=G,s.index=L}function v(){const D=s.newAttributes;for(let O=0,V=D.length;O<V;O++)D[O]=0}function m(D){p(D,0)}function p(D,O){const V=s.newAttributes,L=s.enabledAttributes,W=s.attributeDivisors;V[D]=1,L[D]===0&&(r.enableVertexAttribArray(D),L[D]=1),W[D]!==O&&(r.vertexAttribDivisor(D,O),W[D]=O)}function x(){const D=s.newAttributes,O=s.enabledAttributes;for(let V=0,L=O.length;V<L;V++)O[V]!==D[V]&&(r.disableVertexAttribArray(V),O[V]=0)}function b(D,O,V,L,W,q,G){G===!0?r.vertexAttribIPointer(D,O,V,W,q):r.vertexAttribPointer(D,O,V,L,W,q)}function M(D,O,V,L){v();const W=L.attributes,q=V.getAttributes(),G=O.defaultAttributeValues;for(const I in q){const U=q[I];if(U.location>=0){let Y=W[I];if(Y===void 0&&(I==="instanceMatrix"&&D.instanceMatrix&&(Y=D.instanceMatrix),I==="instanceColor"&&D.instanceColor&&(Y=D.instanceColor)),Y!==void 0){const te=Y.normalized,xe=Y.itemSize,Le=e.get(Y);if(Le===void 0)continue;const $=Le.buffer,me=Le.type,Me=Le.bytesPerElement,we=me===r.INT||me===r.UNSIGNED_INT||Y.gpuType===1013;if(Y.isInterleavedBufferAttribute){const pe=Y.data,De=pe.isInterleavedBuffer===!0?pe.stride:pe.itemSize,Je=Y.offset;if(pe.isInstancedInterleavedBuffer||pe.isInstancedBufferAttribute){for(let Pe=0;Pe<U.locationSize;Pe++)p(U.location+Pe,pe.meshPerAttribute);D.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=pe.meshPerAttribute*pe.count)}else for(let Pe=0;Pe<U.locationSize;Pe++)m(U.location+Pe);r.bindBuffer(r.ARRAY_BUFFER,$);for(let Pe=0;Pe<U.locationSize;Pe++)b(U.location+Pe,xe/U.locationSize,me,te,De*Me,(Je+xe/U.locationSize*Pe)*Me,we)}else{if(Y.isInstancedBufferAttribute){for(let pe=0;pe<U.locationSize;pe++)p(U.location+pe,Y.meshPerAttribute);D.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let pe=0;pe<U.locationSize;pe++)m(U.location+pe);r.bindBuffer(r.ARRAY_BUFFER,$);for(let pe=0;pe<U.locationSize;pe++)b(U.location+pe,xe/U.locationSize,me,te,xe*Me,xe/U.locationSize*pe*Me,we)}}else if(G!==void 0){const te=G[I];if(te!==void 0)switch(te.length){case 2:r.vertexAttrib2fv(U.location,te);break;case 3:r.vertexAttrib3fv(U.location,te);break;case 4:r.vertexAttrib4fv(U.location,te);break;default:r.vertexAttrib1fv(U.location,te)}}}}x()}function E(){F();for(const D in n){const O=n[D];for(const V in O){const L=O[V];for(const W in L){const q=L[W];for(const G in q)h(q[G].object),delete q[G];delete L[W]}}delete n[D]}}function A(D){if(n[D.id]===void 0)return;const O=n[D.id];for(const V in O){const L=O[V];for(const W in L){const q=L[W];for(const G in q)h(q[G].object),delete q[G];delete L[W]}}delete n[D.id]}function _(D){for(const O in n){const V=n[O];for(const L in V){const W=V[L];if(W[D.id]===void 0)continue;const q=W[D.id];for(const G in q)h(q[G].object),delete q[G];delete W[D.id]}}}function T(D){for(const O in n){const V=n[O],L=D.isInstancedMesh===!0?D.id:0,W=V[L];if(W!==void 0){for(const q in W){const G=W[q];for(const I in G)h(G[I].object),delete G[I];delete W[q]}delete V[L],Object.keys(V).length===0&&delete n[O]}}}function F(){R(),a=!0,s!==i&&(s=i,c(s.object))}function R(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:F,resetDefaultState:R,dispose:E,releaseStatesOfGeometry:A,releaseStatesOfObject:T,releaseStatesOfProgram:_,initAttributes:v,enableAttribute:m,disableUnusedAttributes:x}}function nd(r,e,t){let n;function i(l){n=l}function s(l,c){r.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(r.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let f=0;for(let d=0;d<h;d++)f+=c[d];t.update(f,n,1)}this.setMode=i,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function id(r,e,t,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const _=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(_){return!(_!==1023&&n.convert(_)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(_){const T=_===1016&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(_!==1009&&_!==1015&&!T&&n.convert(_)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE))}function l(_){if(_==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Ee("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=t.logarithmicDepthBuffer===!0&&u===!1;t.reversedDepthBuffer===!0&&u===!1&&Ee("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&u===!0&&Ee("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const d=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=r.getParameter(r.MAX_TEXTURE_SIZE),m=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),p=r.getParameter(r.MAX_VERTEX_ATTRIBS),x=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),b=r.getParameter(r.MAX_VARYING_VECTORS),M=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),E=r.getParameter(r.MAX_SAMPLES),A=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:b,maxFragmentUniforms:M,maxSamples:E,samples:A}}function sd(r){const e=this;let t=null,n=0,i=!1,s=!1;const a=new Zn,o=new ze,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||i;return i=f,n=u.length,d},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,d){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=r.get(u);if(!i||g===null||g.length===0||s&&!m)s?h(null):c();else{const x=s?0:n,b=x*4;let M=p.clippingState||null;l.value=M,M=h(g,f,b,d);for(let E=0;E!==b;++E)M[E]=t[E];p.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,d,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const p=d+v*4,x=f.matrixWorldInverse;o.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let b=0,M=d;b!==v;++b,M+=4)a.copy(u[b]).applyMatrix4(x,o),a.normal.toArray(m,M),m[M+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}class sa extends on{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Jo(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new os(5,5,5),s=new zt({name:"CubemapFromEquirect",uniforms:Fi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});s.uniforms.tEquirect.value=t;const a=new bt(i,s),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=1006),new kr(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(s)}}const co=256,rd=3,ad=20,ol=256,ll=16,od=3,ld=new B,cd=new Fe;class Js{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new kr(1,10,null),this._boxMesh=new bt(new os(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,i=100,s={}){const{size:a=256,position:o=ld}=s,l=this._renderer;this._setSize(a);const c=this._allocateTarget(),h=this._getSourceTarget(!0);t>0&&(h.texture.mipmapsAutoUpdate=!1);const u=l.autoClear,f=l.autoClearColor,d=l.autoClearDepth,g=l.autoClearStencil,v=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,v===null&&(e.background=l.getClearColor(cd));const m=new kr(n,i,h);return m.position.copy(o),m.update(l,e),l.autoClear=u,l.autoClearColor=f,l.autoClearDepth=d,l.autoClearStencil=g,e.background=v,t>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=fo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=uo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(co,ko(e))}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?co:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);const n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){const e=this._cubeSize,t=ho(e,!1,!1),n=Math.log2(e)-rd;for(let i=0;i<=n;i++)t.texture.mipmaps.push({width:e>>i,height:e>>i});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){const t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=ho(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){const i=this._boxMesh,s=this._cubeCamera;i.material=n,s.renderTarget=e,s.activeMipmapLevel=t;const a=e.width>>t;e.viewport.set(0,0,a,a),s.update(this._renderer,i),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===301||e.mapping===302?(this._cubemapMaterial===null&&(this._cubemapMaterial=fo()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=uo()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=hd(),this._integrationMaterial=ud());const t=this._cubeSize,n=e.texture.mipmaps.length-1,i=this._ggxMaterial.uniforms;i.envMap.value=this._sourceTarget.texture;const s=this._integrationMaterial.uniforms;s.envMap.value=this._sourceTarget.texture,s.sourceLod.value=Math.log2(t/ll);for(let a=0;a<=n;a++){const o=Js.lodToRoughness(a,n);if(a>n-od)s.roughness.value=o,this._renderCube(e,a,this._integrationMaterial);else{const l=o>0?Math.log2(t)+.5*Math.log2(6/(ol*Math.pow(o,4)))+.5:0;i.roughness.value=o,i.lodBias.value=l,this._renderCube(e,a,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=fd());const n=this._blurMaterial,i=n.uniforms,s=this._sourceTarget;i.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,i.envMap.value=s.texture,this._renderCube(e,0,n),i.envMap.value=e.texture,this._renderCube(s,0,n)}}function ho(r,e,t){return new sa(r,{minFilter:1008,generateMipmaps:e,type:1016,colorSpace:Kt,depthBuffer:t})}function ls(r,e,t){return new zt({name:r,uniforms:e,vertexShader:He.cube_vert,fragmentShader:t,side:1,blending:0,depthTest:!1,depthWrite:!1})}function hd(){return ls("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${ol}u

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
	`)}function ud(){return ls("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:ll}},`

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
	`)}function fd(){return ls("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${ad}
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
	`)}function uo(){return ls("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

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
	`)}function fo(){return ls("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function dd(r){let e=new WeakMap,t=new WeakMap,n=null;function i(f,d=!1){return f==null?null:d?a(f):s(f)}function s(f){if(f&&f.isTexture){const d=f.mapping;if(d===303||d===304)if(e.has(f)){const g=e.get(f).texture;return o(g,f.mapping)}else{const g=f.image;if(g&&g.height>0){const v=new sa(g.height);return v.fromEquirectangularTexture(r,f),e.set(f,v),f.addEventListener("dispose",c),o(v.texture,f.mapping)}else return null}}return f}function a(f){if(f&&f.isTexture&&f.isPMREMTexture!==!0){const d=f.mapping,g=d===303||d===304,v=d===301||d===302;if(g||v){let m=t.get(f);const p=m!==void 0?m.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==p)return n===null&&(n=new Js(r)),m=g?n.fromEquirectangular(f,m):n.fromCubemap(f,m),m.texture.pmremVersion=f.pmremVersion,t.set(f,m),m.texture;if(m!==void 0)return m.texture;{const x=f.image;return g&&x&&x.height>0||v&&x&&l(x)?(n===null&&(n=new Js(r)),m=g?n.fromEquirectangular(f):n.fromCubemap(f),m.texture.pmremVersion=f.pmremVersion,t.set(f,m),f.addEventListener("dispose",h),m.texture):null}}}return f}function o(f,d){return d===303?f.mapping=301:d===304&&(f.mapping=302),f}function l(f){let d=0;const g=6;for(let v=0;v<g;v++)f[v]!==void 0&&d++;return d===g}function c(f){const d=f.target;d.removeEventListener("dispose",c);const g=e.get(d);g!==void 0&&(e.delete(d),g.dispose())}function h(f){const d=f.target;d.removeEventListener("dispose",h);const g=t.get(d);g!==void 0&&(t.delete(d),g.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:u}}function pd(r){const e={};function t(n){if(e[n]!==void 0)return e[n];const i=r.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&wi("WebGLRenderer: "+n+" extension not supported."),i}}}function md(r,e,t,n){const i={},s=new WeakMap,a=new FinalizationRegistry(g=>delete i[g]);function o(g){l(g.target)}function l(g){g.index!==null&&e.remove(g.index);for(const m in g.attributes)e.remove(g.attributes[m]);g.removeEventListener("dispose",o),delete i[g.id],a.unregister(g);const v=s.get(g);v&&(e.remove(v),s.delete(g)),n.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,t.memory.geometries--}function c(g,v){return i[v.id]!==void 0||(v.addEventListener("dispose",o),i[v.id]=new WeakRef(v),a.register(v,v.id,v),t.memory.geometries++),v}function h(g){const v=g.attributes;for(const m in v)e.update(v[m],r.ARRAY_BUFFER)}function u(g){const v=g.index,m=g.attributes.position;let p=0;if(m===void 0)return;const x=v!==null?v.array.length:m.array.length/3-1,b=m.count>=65535?qo:Xo,M=new b(Math.ceil(x/3)*6,1),E=M.array;if(v!==null){const _=v.array;p=v.version;for(let T=0,F=0;T<x;T+=3){const R=_[T+0],D=_[T+1],O=_[T+2];E[F++]=R,E[F++]=D,E[F++]=D,E[F++]=O,E[F++]=O,E[F++]=R}}else{p=m.version;for(let _=0,T=0;_<x;_+=3){const F=_+0,R=_+1,D=_+2;E[T++]=F,E[T++]=R,E[T++]=R,E[T++]=D,E[T++]=D,E[T++]=F}}M.version=p;const A=s.get(g);A&&e.remove(A),s.set(g,M)}function f(g){const v=s.get(g);if(v){const m=g.index;m!==null&&v.version<m.version&&u(g)}else u(g);return s.get(g)}function d(){for(const g in i){const v=i[g].deref();v!==void 0&&l(v)}}return{get:c,update:h,getWireframeAttribute:f,dispose:d}}function gd(r,e,t){let n;function i(u){n=u}let s,a;function o(u){s=u.type,a=u.bytesPerElement}function l(u,f){r.drawElements(n,f,s,u*a),t.update(f,n,1)}function c(u,f,d){d!==0&&(r.drawElementsInstanced(n,f,s,u*a,d),t.update(f,n,d))}function h(u,f,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,u,0,d);let v=0;for(let m=0;m<d;m++)v+=f[m];t.update(v,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function _d(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case r.TRIANGLES:t.triangles+=o*(s/3);break;case r.LINES:t.lines+=o*(s/2);break;case r.LINE_STRIP:t.lines+=o*(s-1);break;case r.LINE_LOOP:t.lines+=o*s;break;case r.POINTS:t.points+=o*s;break;default:Ie("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function vd(r,e,t){const n=new WeakMap,i=new Ze;function s(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(o);if(f===void 0||f.count!==u){let F=function(){_.dispose(),n.delete(o),o.removeEventListener("dispose",F)};f!==void 0&&f.texture.dispose();const d=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],x=o.morphAttributes.color||[];let b=0;d===!0&&(b=1),g===!0&&(b=2),v===!0&&(b=3);let M=o.attributes.position.count*b,E=1;M>e.maxTextureSize&&(E=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const A=new Float32Array(M*E*4*u),_=new Go(A,M,E,u);_.type=1015,_.needsUpdate=!0;const T=b*4;for(let R=0;R<u;R++){const D=m[R],O=p[R],V=x[R],L=M*E*4*R;for(let W=0;W<D.count;W++){const q=W*T;d===!0&&(i.fromBufferAttribute(D,W),A[L+q+0]=i.x,A[L+q+1]=i.y,A[L+q+2]=i.z,A[L+q+3]=0),g===!0&&(i.fromBufferAttribute(O,W),A[L+q+4]=i.x,A[L+q+5]=i.y,A[L+q+6]=i.z,A[L+q+7]=0),v===!0&&(i.fromBufferAttribute(V,W),A[L+q+8]=i.x,A[L+q+9]=i.y,A[L+q+10]=i.z,A[L+q+11]=V.itemSize===4?i.w:1)}}f={count:u,texture:_,size:new Ue(M,E)},n.set(o,f),o.addEventListener("dispose",F)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",a.morphTexture,t);else{let d=0;for(let v=0;v<c.length;v++)d+=c[v];const g=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(r,"morphTargetBaseInfluence",g),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(r,"morphTargetsTextureSize",f.size)}return{update:s}}function xd(r,e,t,n,i){let s=new WeakMap;function a(c){const h=i.render.frame,u=c.geometry,f=e.get(c,u);if(s.get(f)!==h&&(e.update(f),s.set(f,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==h&&(t.update(c.instanceMatrix,r.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,r.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==h&&(d.update(),s.set(d,h))}return f}function o(){s=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const Md={1:"LINEAR_TONE_MAPPING",2:"REINHARD_TONE_MAPPING",3:"CINEON_TONE_MAPPING",4:"ACES_FILMIC_TONE_MAPPING",6:"AGX_TONE_MAPPING",7:"NEUTRAL_TONE_MAPPING",5:"CUSTOM_TONE_MAPPING"};function Sd(r,e,t,n,i,s){const a=new on(e,t,{type:r,depthBuffer:i,stencilBuffer:s,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null,c=null;const h=new Vt;h.setAttribute("position",new mn([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new mn([0,2,0,0,2,0],2));const u=new Fc({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),f=new bt(h,u),d=new tr(-1,1,1,-1,0,1);let g=null,v=null,m=!1,p,x=null,b=[],M=!1;this.setSize=function(E,A){a.setSize(E,A),o!==null&&o.setSize(E,A),l!==null&&l.setSize(E,A);for(let _=0;_<b.length;_++){const T=b[_];T.setSize&&T.setSize(E,A)}},this.setEffects=function(E){b=E,M=b.length>0&&b[0].isRenderPass===!0;const A=a.width,_=a.height;b.length>0&&o===null&&(o=new on(A,_,{type:1016,depthBuffer:!1,stencilBuffer:!1}),l=new on(A,_,{type:1016,depthBuffer:!1,stencilBuffer:!1}));const T=i===!0&&b.some(F=>F.needsDepthTexture===!0);T!==(a.depthTexture!==null)&&(T===!0&&c===null&&(c=new Ii(A,_),s===!0&&(c.format=1027,c.type=1020)),a.dispose(),a.depthTexture=T?c:null,a.resolveDepthBuffer=T,a.storeMultisampledDepthBuffer=T);for(let F=0;F<b.length;F++){const R=b[F];R.setSize&&R.setSize(A,_),T&&R.needsDepthTexture===!0&&R.setDepthTexture&&R.setDepthTexture(c)}},this.begin=function(E,A){if(m||E.toneMapping===0&&b.length===0)return!1;if(x=A,A!==null){const _=A.width,T=A.height;(a.width!==_||a.height!==T)&&this.setSize(_,T)}return M===!1&&E.setRenderTarget(a),p=E.toneMapping,E.toneMapping=0,!0},this.hasRenderPass=function(){return M},this.end=function(E,A){E.toneMapping=p,m=!0;let _=a,T=o;for(let F=0;F<b.length;F++){const R=b[F];R.enabled!==!1&&(R.render(E,T,_,A),R.needsSwap!==!1&&(_=T,T=T===o?l:o))}if(g!==E.outputColorSpace||v!==E.toneMapping){g=E.outputColorSpace,v=E.toneMapping,u.defines={},Xe.getTransfer(g)===it&&(u.defines.SRGB_TRANSFER="");const F=Md[v];F&&(u.defines[F]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=_.texture,E.setRenderTarget(x),E.render(f,d),x=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),h.dispose(),u.dispose()}}const cl=new yt,hl=new Ii(1,1),ul=new Qo(1),fl=new Go,dl=new ic,pl=new Jo,po=[],mo=[],go=new Float32Array(16),_o=new Float32Array(9),vo=new Float32Array(4);function zi(r,e,t){const n=r[0];if(n<=0||n>0)return r;const i=e*t;let s=po[i];if(s===void 0&&(s=new Float32Array(i),po[i]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function Tt(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function Et(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function nr(r,e){let t=mo[e];t===void 0&&(t=new Int32Array(e),mo[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function yd(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function bd(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;r.uniform2fv(this.addr,e),Et(t,e)}}function Td(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Tt(t,e))return;r.uniform3fv(this.addr,e),Et(t,e)}}function Ed(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;r.uniform4fv(this.addr,e),Et(t,e)}}function Ad(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Et(t,e)}else{if(Tt(t,n))return;vo.set(n),r.uniformMatrix2fv(this.addr,!1,vo),Et(t,n)}}function wd(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Et(t,e)}else{if(Tt(t,n))return;_o.set(n),r.uniformMatrix3fv(this.addr,!1,_o),Et(t,n)}}function Rd(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Et(t,e)}else{if(Tt(t,n))return;go.set(n),r.uniformMatrix4fv(this.addr,!1,go),Et(t,n)}}function Cd(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function Ld(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;r.uniform2iv(this.addr,e),Et(t,e)}}function Pd(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;r.uniform3iv(this.addr,e),Et(t,e)}}function Dd(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;r.uniform4iv(this.addr,e),Et(t,e)}}function Id(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function Fd(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;r.uniform2uiv(this.addr,e),Et(t,e)}}function Nd(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;r.uniform3uiv(this.addr,e),Et(t,e)}}function Ud(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;r.uniform4uiv(this.addr,e),Et(t,e)}}function ir(r){return r.version===0&&(r.compareFunction=519,r.needsUpdate=!0),r}function Od(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?s=ir(hl):s=cl,t.setTexture2D(e||s,i)}function Bd(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||dl,i)}function zd(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_CUBE_SHADOW?s=ir(ul):s=pl,t.setTextureCube(e||s,i)}function kd(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||fl,i)}function Gd(r){switch(r){case 5126:return yd;case 35664:return bd;case 35665:return Td;case 35666:return Ed;case 35674:return Ad;case 35675:return wd;case 35676:return Rd;case 5124:case 35670:return Cd;case 35667:case 35671:return Ld;case 35668:case 35672:return Pd;case 35669:case 35673:return Dd;case 5125:return Id;case 36294:return Fd;case 36295:return Nd;case 36296:return Ud;case 35678:case 36198:case 36298:case 36306:case 35682:return Od;case 35679:case 36299:case 36307:return Bd;case 35680:case 36300:case 36308:case 36293:return zd;case 36289:case 36303:case 36311:case 36292:return kd}}function Hd(r,e){r.uniform1fv(this.addr,e)}function Vd(r,e){const t=zi(e,this.size,2);r.uniform2fv(this.addr,t)}function Wd(r,e){const t=zi(e,this.size,3);r.uniform3fv(this.addr,t)}function Xd(r,e){const t=zi(e,this.size,4);r.uniform4fv(this.addr,t)}function qd(r,e){const t=zi(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function Yd(r,e){const t=zi(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function Kd(r,e){const t=zi(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function Zd(r,e){r.uniform1iv(this.addr,e)}function $d(r,e){r.uniform2iv(this.addr,e)}function Jd(r,e){r.uniform3iv(this.addr,e)}function Qd(r,e){r.uniform4iv(this.addr,e)}function jd(r,e){r.uniform1uiv(this.addr,e)}function ep(r,e){r.uniform2uiv(this.addr,e)}function tp(r,e){r.uniform3uiv(this.addr,e)}function np(r,e){r.uniform4uiv(this.addr,e)}function ip(r,e,t){const n=this.cache,i=e.length,s=nr(t,i);Tt(n,s)||(r.uniform1iv(this.addr,s),Et(n,s));let a;this.type===r.SAMPLER_2D_SHADOW?a=ir(hl):a=cl;for(let o=0;o!==i;++o)t.setTexture2D(e[o]||a,s[o])}function sp(r,e,t){const n=this.cache,i=e.length,s=nr(t,i);Tt(n,s)||(r.uniform1iv(this.addr,s),Et(n,s));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||dl,s[a])}function rp(r,e,t){const n=this.cache,i=e.length,s=nr(t,i);Tt(n,s)||(r.uniform1iv(this.addr,s),Et(n,s));let a;this.type===r.SAMPLER_CUBE_SHADOW?a=ir(ul):a=pl;for(let o=0;o!==i;++o)t.setTextureCube(e[o]||a,s[o])}function ap(r,e,t){const n=this.cache,i=e.length,s=nr(t,i);Tt(n,s)||(r.uniform1iv(this.addr,s),Et(n,s));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||fl,s[a])}function op(r){switch(r){case 5126:return Hd;case 35664:return Vd;case 35665:return Wd;case 35666:return Xd;case 35674:return qd;case 35675:return Yd;case 35676:return Kd;case 5124:case 35670:return Zd;case 35667:case 35671:return $d;case 35668:case 35672:return Jd;case 35669:case 35673:return Qd;case 5125:return jd;case 36294:return ep;case 36295:return tp;case 36296:return np;case 35678:case 36198:case 36298:case 36306:case 35682:return ip;case 35679:case 36299:case 36307:return sp;case 35680:case 36300:case 36308:case 36293:return rp;case 36289:case 36303:case 36311:case 36292:return ap}}class lp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Gd(t.type)}}class cp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=op(t.type)}}class hp{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let s=0,a=i.length;s!==a;++s){const o=i[s];o.setValue(e,t[o.id],n)}}}const Pr=/(\w+)(\])?(\[|\.)?/g;function xo(r,e){r.seq.push(e),r.map[e.id]=e}function up(r,e,t){const n=r.name,i=n.length;for(Pr.lastIndex=0;;){const s=Pr.exec(n),a=Pr.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){xo(t,c===void 0?new lp(o,r,e):new cp(o,r,e));break}else{let u=t.map[o];u===void 0&&(u=new hp(o),xo(t,u)),t=u}}}class Ws{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);up(o,l,this)}const i=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):s.push(a);i.length>0&&(this.seq=i.concat(s))}setValue(e,t,n,i){const s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,s=e.length;i!==s;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function Mo(r,e,t){const n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}const fp=37297;let dp=0;function pp(r,e){const t=r.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=i;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const So=new ze;function mp(r){Xe._getMatrix(So,Xe.workingColorSpace,r);const e=`mat3( ${So.elements.map(t=>t.toFixed(4))} )`;switch(Xe.getTransfer(r)){case qs:return[e,"LinearTransferOETF"];case it:return[e,"sRGBTransferOETF"];default:return Ee("WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function yo(r,e,t){const n=r.getShaderParameter(e,r.COMPILE_STATUS),s=(r.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+pp(r.getShaderSource(e),o)}else return s}function gp(r,e){const t=mp(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const _p={1:"Linear",2:"Reinhard",3:"Cineon",4:"ACESFilmic",6:"AgX",7:"Neutral",5:"Custom"};function vp(r,e){const t=_p[e];return t===void 0?(Ee("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Bs=new B;function xp(){Xe.getLuminanceCoefficients(Bs);const r=Bs.x.toFixed(4),e=Bs.y.toFixed(4),t=Bs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Mp(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Qi).join(`
`)}function Sp(r){const e=[];for(const t in r){const n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function yp(r,e){const t={},n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(e,i),a=s.name;let o=1;s.type===r.FLOAT_MAT2&&(o=2),s.type===r.FLOAT_MAT3&&(o=3),s.type===r.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:r.getAttribLocation(e,a),locationSize:o}}return t}function Qi(r){return r!==""}function bo(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function To(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const bp=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gr(r){return r.replace(bp,Tp)}function Tp(r,e){const t=He[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Gr(t)}const Ep=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Eo(r){return r.replace(Ep,Ap)}function Ap(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function Ao(r){let e=`precision ${r.precision} float;
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
#define LOW_PRECISION`),e}const wp={1:"SHADOWMAP_TYPE_PCF",3:"SHADOWMAP_TYPE_VSM"};function Rp(r){return wp[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Cp={302:"ENVMAP_MODE_REFRACTION"};function Lp(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":Cp[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Pp={0:"ENVMAP_BLENDING_MULTIPLY",1:"ENVMAP_BLENDING_MIX",2:"ENVMAP_BLENDING_ADD"};function Dp(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":Pp[r.combine]||"ENVMAP_BLENDING_NONE"}function Ip(r,e,t,n){const i=r.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Rp(t),c=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=Lp(t),u=Dp(t),f=Mp(t),d=Sp(s),g=i.createProgram();let v,m,p=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(v=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(Qi).join(`
`),v.length>0&&(v+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(Qi).join(`
`),m.length>0&&(m+=`
`)):(v=[Ao(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Qi).join(`
`),m=[Ao(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==0?"#define TONE_MAPPING":"",t.toneMapping!==0?He.tonemapping_pars_fragment:"",t.toneMapping!==0?vp("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",He.colorspace_pars_fragment,gp("linearToOutputTexel",t.outputColorSpace),xp(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Qi).join(`
`)),a=Gr(a),a=bo(a,t),a=To(a,t),o=Gr(o),o=bo(o,t),o=To(o,t),a=Eo(a),o=Eo(o),t.isRawShaderMaterial!==!0&&(p=`#version 300 es
`,v=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+v,m=["#define varying in",t.glslVersion===Ma?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ma?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const x=p+v+a,b=p+m+o,M=Mo(i,i.VERTEX_SHADER,x),E=Mo(i,i.FRAGMENT_SHADER,b);i.attachShader(g,M),i.attachShader(g,E),t.index0AttributeName!==void 0?i.bindAttribLocation(g,0,t.index0AttributeName):t.hasPositionAttribute===!0&&i.bindAttribLocation(g,0,"position"),i.linkProgram(g);function A(R){if(r.debug.checkShaderErrors){const D=i.getProgramInfoLog(g)||"",O=i.getShaderInfoLog(M)||"",V=i.getShaderInfoLog(E)||"",L=D.trim(),W=O.trim(),q=V.trim();let G=!0,I=!0;if(i.getProgramParameter(g,i.LINK_STATUS)===!1)if(G=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,g,M,E);else{const U=yo(i,M,"vertex"),Y=yo(i,E,"fragment");Ie("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(g,i.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+L+`
`+U+`
`+Y)}else L!==""?Ee("WebGLProgram: Program Info Log:",L):(W===""||q==="")&&(I=!1);I&&(R.diagnostics={runnable:G,programLog:L,vertexShader:{log:W,prefix:v},fragmentShader:{log:q,prefix:m}})}i.deleteShader(M),i.deleteShader(E),_=new Ws(i,g),T=yp(i,g)}let _;this.getUniforms=function(){return _===void 0&&A(this),_};let T;this.getAttributes=function(){return T===void 0&&A(this),T};let F=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return F===!1&&(F=i.getProgramParameter(g,fp)),F},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=dp++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=M,this.fragmentShader=E,this}let Fp=0;class Np{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const i=this._getShaderCacheForMaterial(e);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Up(e),t.set(e,n)),n}}class Up{constructor(e){this.id=Fp++,this.code=e,this.usedTimes=0}}function Op(r){return r===1030||r===37490||r===36285}function Bp(r,e,t,n,i,s){const a=new Ho,o=new Np,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(_){return l.add(_),_===0?"uv":`uv${_}`}function g(_,T,F,R,D,O){const V=R.fog,L=D.geometry,W=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?R.environment:null,q=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,G=e.get(_.envMap||W,q),I=f[_.type];let U=n.precision;_.precision!==null&&(U=n.getMaxPrecision(_.precision),U!==_.precision&&Ee("WebGLProgram.getParameters:",_.precision,"not supported, using",U,"instead."));const Y=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,te=Y!==void 0?Y.length:0;let xe=0;L.morphAttributes.position!==void 0&&(xe=1),L.morphAttributes.normal!==void 0&&(xe=2),L.morphAttributes.color!==void 0&&(xe=3);let Le,$,me,Me;if(I){const ge=yn[I];Le=ge.vertexShader,$=ge.fragmentShader}else{Le=_.vertexShader,$=_.fragmentShader;const ge=o.getVertexShaderStage(_),tt=o.getFragmentShaderStage(_);o.update(_,ge,tt),me=ge.id,Me=tt.id}const we=r.getRenderTarget(),pe=r.state.buffers.depth.getReversed(),De=D.isInstancedMesh===!0,Je=D.isBatchedMesh===!0,Pe=!!_.map,je=!!_.matcap,rt=!!G,qe=rt&&G.isPMREMTexture===!0,It=!!_.aoMap,vt=!!_.lightMap,Wt=!!_.bumpMap&&_.wireframe===!1,ut=!!_.normalMap,vn=!!_.displacementMap,At=!!_.emissiveMap,Jt=!!_.metalnessMap,Qt=!!_.roughnessMap,jt=_.anisotropy>0,N=_.clearcoat>0,en=_.diffuseRoughness>0,ct=_.dispersion>0,ht=_.retroreflectivity>0,de=_.iridescence>0,xt=_.sheen>0,Ce=_.transmission>0,Ne=jt&&!!_.anisotropyMap,w=N&&!!_.clearcoatMap,S=N&&!!_.clearcoatNormalMap,k=N&&!!_.clearcoatRoughnessMap,ie=en&&!!_.diffuseRoughnessMap,ee=de&&!!_.iridescenceMap,ae=de&&!!_.iridescenceThicknessMap,ue=xt&&!!_.sheenColorMap,Z=xt&&!!_.sheenRoughnessMap,J=!!_.specularMap,le=!!_.specularColorMap,C=!!_.specularIntensityMap,Q=Ce&&!!_.transmissionMap,K=Ce&&!!_.thicknessMap,ce=!!_.gradientMap,re=!!_.alphaMap,oe=_.alphaTest>0,Ae=!!_.alphaHash,Ge=!!_.extensions;let se=0;_.toneMapped&&(we===null||we.isXRRenderTarget===!0)&&(se=r.toneMapping);const Re=qe?G.isCompressedCubeTexture?G.image[0].mipmaps:G.mipmaps:null,ke={shaderID:I,shaderType:_.type,shaderName:_.name,vertexShader:Le,fragmentShader:$,defines:_.defines,customVertexShaderID:me,customFragmentShaderID:Me,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:U,batching:Je,batchingColor:Je&&D._colorsTexture!==null,instancing:De,instancingColor:De&&D.instanceColor!==null,instancingMorph:De&&D.morphTexture!==null,outputColorSpace:we===null?r.outputColorSpace:we.isXRRenderTarget===!0?we.texture.colorSpace:Xe.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Pe,matcap:je,envMap:rt,envMapMode:rt&&G.mapping,envMapPMREM:qe,envMapMaxLod:qe?Re.length-1:null,envMapSize:qe?Re[0].width:null,aoMap:It,lightMap:vt,bumpMap:Wt,normalMap:ut,displacementMap:vn,emissiveMap:At,normalMapObjectSpace:ut&&_.normalMapType===1,normalMapTangentSpace:ut&&_.normalMapType===0,packedNormalMap:ut&&_.normalMapType===0&&Op(_.normalMap.format),metalnessMap:Jt,roughnessMap:Qt,anisotropy:jt,anisotropyMap:Ne,clearcoat:N,clearcoatMap:w,clearcoatNormalMap:S,clearcoatRoughnessMap:k,diffuseRoughness:en,diffuseRoughnessMap:ie,dispersion:ct,retroreflection:ht,iridescence:de,iridescenceMap:ee,iridescenceThicknessMap:ae,sheen:xt,sheenColorMap:ue,sheenRoughnessMap:Z,specularMap:J,specularColorMap:le,specularIntensityMap:C,transmission:Ce,transmissionMap:Q,thicknessMap:K,gradientMap:ce,opaque:_.transparent===!1&&_.blending===1&&_.alphaToCoverage===!1,alphaMap:re,alphaTest:oe,alphaHash:Ae,combine:_.combine,mapUv:Pe&&d(_.map.channel),aoMapUv:It&&d(_.aoMap.channel),lightMapUv:vt&&d(_.lightMap.channel),bumpMapUv:Wt&&d(_.bumpMap.channel),normalMapUv:ut&&d(_.normalMap.channel),displacementMapUv:vn&&d(_.displacementMap.channel),emissiveMapUv:At&&d(_.emissiveMap.channel),metalnessMapUv:Jt&&d(_.metalnessMap.channel),roughnessMapUv:Qt&&d(_.roughnessMap.channel),anisotropyMapUv:Ne&&d(_.anisotropyMap.channel),clearcoatMapUv:w&&d(_.clearcoatMap.channel),clearcoatNormalMapUv:S&&d(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:k&&d(_.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:ie&&d(_.diffuseRoughnessMap.channel),iridescenceMapUv:ee&&d(_.iridescenceMap.channel),iridescenceThicknessMapUv:ae&&d(_.iridescenceThicknessMap.channel),sheenColorMapUv:ue&&d(_.sheenColorMap.channel),sheenRoughnessMapUv:Z&&d(_.sheenRoughnessMap.channel),specularMapUv:J&&d(_.specularMap.channel),specularColorMapUv:le&&d(_.specularColorMap.channel),specularIntensityMapUv:C&&d(_.specularIntensityMap.channel),transmissionMapUv:Q&&d(_.transmissionMap.channel),thicknessMapUv:K&&d(_.thicknessMap.channel),alphaMapUv:re&&d(_.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(ut||jt),vertexNormals:!!L.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!L.attributes.uv&&(Pe||re),fog:!!V,useFog:_.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||L.attributes.normal===void 0&&ut===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:pe,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:L.attributes.position!==void 0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:te,morphTextureStride:xe,numSunLights:T.sun.length,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numSunLightShadows:T.sunShadowMap.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:O.filter(ge=>ge.texture!==null).length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:_.dithering,shadowMapEnabled:r.shadowMap.enabled&&F.length>0,shadowMapType:r.shadowMap.type,toneMapping:se,decodeVideoTexture:Pe&&_.map.isVideoTexture===!0&&Xe.getTransfer(_.map.colorSpace)===it,decodeVideoTextureEmissive:At&&_.emissiveMap.isVideoTexture===!0&&Xe.getTransfer(_.emissiveMap.colorSpace)===it,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===2,flipSided:_.side===1,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:Ge&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ge&&_.extensions.multiDraw===!0||Je)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return ke.vertexUv1s=l.has(1),ke.vertexUv2s=l.has(2),ke.vertexUv3s=l.has(3),l.clear(),ke}function v(_){const T=[];if(_.shaderID?T.push(_.shaderID):(T.push(_.customVertexShaderID),T.push(_.customFragmentShaderID)),_.defines!==void 0)for(const F in _.defines)T.push(F),T.push(_.defines[F]);return _.isRawShaderMaterial===!1&&(m(T,_),p(T,_),T.push(r.outputColorSpace)),T.push(_.customProgramCacheKey),T.join()}function m(_,T){_.push(T.precision),_.push(T.outputColorSpace),_.push(T.envMapMode),_.push(T.envMapPMREM),_.push(T.envMapMaxLod),_.push(T.envMapSize),_.push(T.mapUv),_.push(T.alphaMapUv),_.push(T.lightMapUv),_.push(T.aoMapUv),_.push(T.bumpMapUv),_.push(T.normalMapUv),_.push(T.displacementMapUv),_.push(T.emissiveMapUv),_.push(T.metalnessMapUv),_.push(T.roughnessMapUv),_.push(T.anisotropyMapUv),_.push(T.clearcoatMapUv),_.push(T.clearcoatNormalMapUv),_.push(T.clearcoatRoughnessMapUv),_.push(T.diffuseRoughnessMapUv),_.push(T.iridescenceMapUv),_.push(T.iridescenceThicknessMapUv),_.push(T.sheenColorMapUv),_.push(T.sheenRoughnessMapUv),_.push(T.specularMapUv),_.push(T.specularColorMapUv),_.push(T.specularIntensityMapUv),_.push(T.transmissionMapUv),_.push(T.thicknessMapUv),_.push(T.combine),_.push(T.fogExp2),_.push(T.sizeAttenuation),_.push(T.morphTargetsCount),_.push(T.numSunLights),_.push(T.numDirLights),_.push(T.numPointLights),_.push(T.numSpotLights),_.push(T.numSpotLightMaps),_.push(T.numHemiLights),_.push(T.numRectAreaLights),_.push(T.numSunLightShadows),_.push(T.numDirLightShadows),_.push(T.numPointLightShadows),_.push(T.numSpotLightShadows),_.push(T.numSpotLightShadowsWithMaps),_.push(T.numLightProbes),_.push(T.numLightProbeGrids),_.push(T.shadowMapType),_.push(T.toneMapping),_.push(T.numClippingPlanes),_.push(T.numClipIntersection),_.push(T.depthPacking)}function p(_,T){a.disableAll(),T.instancing&&a.enable(0),T.instancingColor&&a.enable(1),T.instancingMorph&&a.enable(2),T.matcap&&a.enable(3),T.envMap&&a.enable(4),T.normalMapObjectSpace&&a.enable(5),T.normalMapTangentSpace&&a.enable(6),T.clearcoat&&a.enable(7),T.iridescence&&a.enable(8),T.alphaTest&&a.enable(9),T.vertexColors&&a.enable(10),T.vertexAlphas&&a.enable(11),T.vertexUv1s&&a.enable(12),T.vertexUv2s&&a.enable(13),T.vertexUv3s&&a.enable(14),T.vertexTangents&&a.enable(15),T.anisotropy&&a.enable(16),T.alphaHash&&a.enable(17),T.batching&&a.enable(18),T.dispersion&&a.enable(19),T.retroreflection&&a.enable(24),T.diffuseRoughness&&a.enable(25),T.batchingColor&&a.enable(20),T.gradientMap&&a.enable(21),T.packedNormalMap&&a.enable(22),T.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.reversedDepthBuffer&&a.enable(4),T.skinning&&a.enable(5),T.morphTargets&&a.enable(6),T.morphNormals&&a.enable(7),T.morphColors&&a.enable(8),T.premultipliedAlpha&&a.enable(9),T.shadowMapEnabled&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),T.decodeVideoTextureEmissive&&a.enable(20),T.alphaToCoverage&&a.enable(21),T.numLightProbeGrids>0&&a.enable(22),T.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function x(_){const T=f[_.type];let F;if(T){const R=yn[T];F=Pc.clone(R.uniforms)}else F=_.uniforms;return F}function b(_,T){let F=h.get(T);return F!==void 0?++F.usedTimes:(F=new Ip(r,T,_,i),c.push(F),h.set(T,F)),F}function M(_){if(--_.usedTimes===0){const T=c.indexOf(_);c[T]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function E(_){o.remove(_)}function A(){o.dispose()}return{getParameters:g,getProgramCacheKey:v,getUniforms:x,acquireProgram:b,releaseProgram:M,releaseShaderCache:E,programs:c,dispose:A}}function zp(){let r=new WeakMap;function e(a){return r.has(a)}function t(a){let o=r.get(a);return o===void 0&&(o={},r.set(a,o)),o}function n(a){r.delete(a)}function i(a,o,l){r.get(a)[o]=l}function s(){r=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:s}}function kp(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.materialVariant!==e.materialVariant?r.materialVariant-e.materialVariant:r.z!==e.z?r.z-e.z:r.id-e.id}function wo(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function Ro(){const r=[];let e=0;const t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function a(f){let d=0;return f.isInstancedMesh&&(d+=2),f.isSkinnedMesh&&(d+=1),d}function o(f,d,g,v,m,p){let x=r[e];return x===void 0?(x={id:f.id,object:f,geometry:d,material:g,materialVariant:a(f),groupOrder:v,renderOrder:f.renderOrder,z:m,group:p},r[e]=x):(x.id=f.id,x.object=f,x.geometry=d,x.material=g,x.materialVariant=a(f),x.groupOrder=v,x.renderOrder=f.renderOrder,x.z=m,x.group=p),e++,x}function l(f,d,g,v,m,p,x){x.reversedDepth===!0&&(m=-m);const b=o(f,d,g,v,m,p);g.transmission>0?n.push(b):g.transparent===!0?i.push(b):t.push(b)}function c(f,d,g,v,m,p){const x=o(f,d,g,v,m,p);g.transmission>0?n.unshift(x):g.transparent===!0?i.unshift(x):t.unshift(x)}function h(f,d){t.length>1&&t.sort(f||kp),n.length>1&&n.sort(d||wo),i.length>1&&i.sort(d||wo)}function u(){for(let f=e,d=r.length;f<d;f++){const g=r[f];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:l,unshift:c,finish:u,sort:h}}function Gp(){let r=new WeakMap;function e(n,i){const s=r.get(n);let a;return s===void 0?(a=new Ro,r.set(n,[a])):i>=s.length?(a=new Ro,s.push(a)):a=s[i],a}function t(){r=new WeakMap}return{get:e,dispose:t}}function Hp(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new B,color:new Fe};break;case"SpotLight":t={position:new B,direction:new B,color:new Fe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new B,color:new Fe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new B,skyColor:new Fe,groundColor:new Fe};break;case"RectAreaLight":t={color:new Fe,position:new B,halfWidth:new B,halfHeight:new B};break}return r[e.id]=t,t}}}function Vp(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let Wp=0;function Xp(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function qp(r){const e=new Hp,t=Vp(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new B);const i=new B,s=new Oe,a=new Oe;function o(c){let h=0,u=0,f=0;for(let O=0;O<9;O++)n.probe[O].set(0,0,0);let d=0,g=0,v=0,m=0,p=0,x=0,b=0,M=0,E=0,A=0,_=0,T=0,F=0,R=0;c.sort(Xp);for(let O=0,V=c.length;O<V;O++){const L=c[O],W=L.color,q=L.intensity,G=L.distance;let I=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===1030?I=L.shadow.map.texture:I=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)h+=W.r*q,u+=W.g*q,f+=W.b*q;else if(L.isLightProbe){for(let U=0;U<9;U++)n.probe[U].addScaledVector(L.sh.coefficients[U],q);R++}else if(L.isSunLight){const U=e.get(L);if(U.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const Y=L.shadow,te=t.get(L);te.shadowIntensity=Y.intensity,te.shadowBias=Y.bias,te.shadowNormalBias=Y.normalBias,te.shadowRadius=Y.radius,te.shadowMapSize.copy(Y.mapSize).multiply(Y.getFrameExtents()),n.sunShadow[g]=te,n.sunShadowMap[g]=I;const xe=Y.getViewportCount();for(let Le=0;Le<xe;Le++)n.sunShadowMatrix[v+Le]=Y.getMatrix(Le),n.sunShadowCascade[v+Le]=Y._cascadeData[Le];v+=xe,g++}n.sun[d]=U,d++}else if(L.isDirectionalLight){const U=e.get(L);if(U.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const Y=L.shadow,te=t.get(L);te.shadowIntensity=Y.intensity,te.shadowBias=Y.bias,te.shadowNormalBias=Y.normalBias,te.shadowRadius=Y.radius,te.shadowMapSize=Y.mapSize,n.directionalShadow[m]=te,n.directionalShadowMap[m]=I,n.directionalShadowMatrix[m]=L.shadow.matrix,E++}n.directional[m]=U,m++}else if(L.isSpotLight){const U=e.get(L);U.position.setFromMatrixPosition(L.matrixWorld),U.color.copy(W).multiplyScalar(q),U.distance=G,U.coneCos=Math.cos(L.angle),U.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),U.decay=L.decay,n.spot[x]=U;const Y=L.shadow;if(L.map&&(n.spotLightMap[T]=L.map,T++,Y.updateMatrices(L),L.castShadow&&F++),n.spotLightMatrix[x]=Y.matrix,L.castShadow){const te=t.get(L);te.shadowIntensity=Y.intensity,te.shadowBias=Y.bias,te.shadowNormalBias=Y.normalBias,te.shadowRadius=Y.radius,te.shadowMapSize=Y.mapSize,n.spotShadow[x]=te,n.spotShadowMap[x]=I,_++}x++}else if(L.isRectAreaLight){const U=e.get(L);U.color.copy(W).multiplyScalar(q),U.halfWidth.set(L.width*.5,0,0),U.halfHeight.set(0,L.height*.5,0),n.rectArea[b]=U,b++}else if(L.isPointLight){const U=e.get(L);if(U.color.copy(L.color).multiplyScalar(L.intensity),U.distance=L.distance,U.decay=L.decay,L.castShadow){const Y=L.shadow,te=t.get(L);te.shadowIntensity=Y.intensity,te.shadowBias=Y.bias,te.shadowNormalBias=Y.normalBias,te.shadowRadius=Y.radius,te.shadowMapSize=Y.mapSize,te.shadowCameraNear=Y.camera.near,te.shadowCameraFar=Y.camera.far,n.pointShadow[p]=te,n.pointShadowMap[p]=I,n.pointShadowMatrix[p]=L.shadow.matrix,A++}n.point[p]=U,p++}else if(L.isHemisphereLight){const U=e.get(L);U.skyColor.copy(L.color).multiplyScalar(q),U.groundColor.copy(L.groundColor).multiplyScalar(q),n.hemi[M]=U,M++}}b>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=_e.LTC_FLOAT_1,n.rectAreaLTC2=_e.LTC_FLOAT_2):(n.rectAreaLTC1=_e.LTC_HALF_1,n.rectAreaLTC2=_e.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const D=n.hash;(D.sunLength!==d||D.directionalLength!==m||D.pointLength!==p||D.spotLength!==x||D.rectAreaLength!==b||D.hemiLength!==M||D.numSunShadows!==g||D.numDirectionalShadows!==E||D.numPointShadows!==A||D.numSpotShadows!==_||D.numSpotMaps!==T||D.numLightProbes!==R)&&(n.sun.length=d,n.directional.length=m,n.spot.length=x,n.rectArea.length=b,n.point.length=p,n.hemi.length=M,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=v,n.sunShadowCascade.length=v,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.directionalShadowMatrix.length=E,n.pointShadow.length=A,n.pointShadowMap.length=A,n.pointShadowMatrix.length=A,n.spotShadow.length=_,n.spotShadowMap.length=_,n.spotLightMatrix.length=_+T-F,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=F,n.numLightProbes=R,D.sunLength=d,D.directionalLength=m,D.pointLength=p,D.spotLength=x,D.rectAreaLength=b,D.hemiLength=M,D.numSunShadows=g,D.numDirectionalShadows=E,D.numPointShadows=A,D.numSpotShadows=_,D.numSpotMaps=T,D.numLightProbes=R,n.version=Wp++)}function l(c,h){let u=0,f=0,d=0,g=0,v=0,m=0;const p=h.matrixWorldInverse;for(let x=0,b=c.length;x<b;x++){const M=c[x];if(M.isSunLight){const E=n.sun[u];E.direction.setFromMatrixPosition(M.matrixWorld),E.direction.transformDirection(p),u++}else if(M.isDirectionalLight){const E=n.directional[f];E.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),E.direction.sub(i),E.direction.transformDirection(p),f++}else if(M.isSpotLight){const E=n.spot[g];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(p),E.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),E.direction.sub(i),E.direction.transformDirection(p),g++}else if(M.isRectAreaLight){const E=n.rectArea[v];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(p),a.identity(),s.copy(M.matrixWorld),s.premultiply(p),a.extractRotation(s),E.halfWidth.set(M.width*.5,0,0),E.halfHeight.set(0,M.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),v++}else if(M.isPointLight){const E=n.point[d];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(p),d++}else if(M.isHemisphereLight){const E=n.hemi[m];E.direction.setFromMatrixPosition(M.matrixWorld),E.direction.transformDirection(p),m++}}}return{setup:o,setupView:l,state:n}}function Co(r){const e=new qp(r),t=[],n=[],i=[];function s(u){h.camera=u,t.length=0,n.length=0,i.length=0}function a(u){u.isLightProbeGrid?i.push(u):t.push(u)}function o(u){n.push(u)}function l(){e.setup(t),i.sort((u,f)=>u.priority-f.priority||u.id-f.id)}function c(u){e.setupView(t,u)}const h={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:h,setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function Yp(r){let e=new WeakMap;function t(i,s=0){const a=e.get(i);let o;return a===void 0?(o=new Co(r),e.set(i,[o])):s>=a.length?(o=new Co(r),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const Kp=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Zp=`uniform sampler2D shadow_pass;
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
}`,$p=[new B(1,0,0),new B(-1,0,0),new B(0,1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1)],Jp=[new B(0,-1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1),new B(0,-1,0),new B(0,-1,0)],Lo=new Oe,Zi=new B,Dr=new B;function Qp(r,e,t){let n=new ss;const i=new Ue,s=new Ue,a=new Ze,o=new Nc,l=new Uc,c={},h=t.maxTextureSize,u={0:1,1:0,2:2},f=new zt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ue},radius:{value:4}},vertexShader:Kp,fragmentShader:Zp}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new Vt;g.setAttribute("position",new dt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new bt(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let p=this.type;this.render=function(A,_,T){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;this.type===2&&(Ee("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=1);const F=r.getRenderTarget(),R=r.getActiveCubeFace(),D=r.getActiveMipmapLevel(),O=r.state;O.setBlending(0),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const V=p!==this.type;V&&_.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(W=>W.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,W=A.length;L<W;L++){const q=A[L],G=q.shadow;if(G===void 0){Ee("WebGLShadowMap:",q,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;i.copy(G.mapSize);const I=G.getFrameExtents();i.multiply(I),s.copy(G.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/I.x),i.x=s.x*I.x,G.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/I.y),i.y=s.y*I.y,G.mapSize.y=s.y));const U=r.state.buffers.depth.getReversed();if(G.camera._reversedDepth=U,G.map===null||V===!0){if(G.map!==null&&(G.map.depthTexture!==null&&(G.map.depthTexture.dispose(),G.map.depthTexture=null),G.map.dispose()),this.type===3){if(q.isPointLight){Ee("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}G.map=new on(i.x,i.y,{format:1030,type:1016,minFilter:1006,magFilter:1006,generateMipmaps:!1}),G.map.texture.name=q.name+".shadowMap",G.map.depthTexture=new Ii(i.x,i.y,1015),G.map.depthTexture.name=q.name+".shadowMapDepth",G.map.depthTexture.format=1026,G.map.depthTexture.compareFunction=null,G.map.depthTexture.minFilter=1003,G.map.depthTexture.magFilter=1003}else q.isPointLight?(G.map=new sa(i.x),G.map.depthTexture=new Qo(i.x,1014)):(G.map=new on(i.x,i.y),G.map.depthTexture=new Ii(i.x,i.y,1014)),G.map.depthTexture.name=q.name+".shadowMap",G.map.depthTexture.format=1026,this.type===1?(G.map.depthTexture.compareFunction=U?518:515,G.map.depthTexture.minFilter=1006,G.map.depthTexture.magFilter=1006):(G.map.depthTexture.compareFunction=null,G.map.depthTexture.minFilter=1003,G.map.depthTexture.magFilter=1003);G.camera.updateProjectionMatrix()}G.map.isWebGLCubeRenderTarget!==!0&&(G.map.width!==i.x||G.map.height!==i.y)&&G.map.setSize(i.x,i.y);const Y=G.map.isWebGLCubeRenderTarget?6:G.getViewportCount();q.isPointLight!==!0&&G.updateMatrices(q,T);const te=(G.camera.layers.mask&4294967294)!==0?G.camera.layers:T.layers;for(let xe=0;xe<Y;xe++){const Le=G.getCamera(xe);if(q.isPointLight){const $=G.camera,me=G.matrix,Me=q.distance||$.far;Me!==$.far&&($.far=Me,$.updateProjectionMatrix()),Zi.setFromMatrixPosition(q.matrixWorld),$.position.copy(Zi),Dr.copy($.position),Dr.add($p[xe]),$.up.copy(Jp[xe]),$.lookAt(Dr),$.updateMatrixWorld(),me.makeTranslation(-Zi.x,-Zi.y,-Zi.z),Lo.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),G._frustum.setFromProjectionMatrix(Lo,$.coordinateSystem,$.reversedDepth)}if(G.map.isWebGLCubeRenderTarget)r.setRenderTarget(G.map,xe),r.clear();else{xe===0&&(r.setRenderTarget(G.map),r.clear());const $=G.getViewport(xe);a.set(s.x*$.x,s.y*$.y,s.x*$.z,s.y*$.w),O.viewport(a)}n=G.getFrustum(xe),M(_,T,Le,q,te,this.type)}G.isPointLightShadow!==!0&&this.type===3&&x(G,T),G.needsUpdate=!1}p=this.type,m.needsUpdate=!1,r.setRenderTarget(F,R,D)};function x(A,_){const T=e.update(v);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,d.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),A.mapPass===null?A.mapPass=new on(i.x,i.y,{format:1030,type:1016}):(A.mapPass.width!==A.map.width||A.mapPass.height!==A.map.height)&&A.mapPass.setSize(A.map.width,A.map.height),f.uniforms.shadow_pass.value=A.map.depthTexture,f.uniforms.resolution.value.set(A.map.width,A.map.height),f.uniforms.radius.value=A.radius,r.setRenderTarget(A.mapPass),r.clear(),r.renderBufferDirect(_,null,T,f,v,null),d.uniforms.shadow_pass.value=A.mapPass.texture,d.uniforms.resolution.value.set(A.map.width,A.map.height),d.uniforms.radius.value=A.radius,r.setRenderTarget(A.map),r.clear(),r.renderBufferDirect(_,null,T,d,v,null)}function b(A,_,T,F){let R=null;const D=T.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(D!==void 0)R=D;else if(R=T.isPointLight===!0?l:o,r.localClippingEnabled&&_.clipShadows===!0&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0||_.alphaToCoverage===!0){const O=R.uuid,V=_.uuid;let L=c[O];L===void 0&&(L={},c[O]=L);let W=L[V];W===void 0&&(W=R.clone(),L[V]=W,_.addEventListener("dispose",E)),R=W}if(R.visible=_.visible,R.wireframe=_.wireframe,F===3?R.side=_.shadowSide!==null?_.shadowSide:_.side:R.side=_.shadowSide!==null?_.shadowSide:u[_.side],R.alphaMap=_.alphaMap,R.alphaTest=_.alphaToCoverage===!0?.5:_.alphaTest,R.map=_.map,R.clipShadows=_.clipShadows,R.clippingPlanes=_.clippingPlanes,R.clipIntersection=_.clipIntersection,R.displacementMap=_.displacementMap,R.displacementScale=_.displacementScale,R.displacementBias=_.displacementBias,R.wireframeLinewidth=_.wireframeLinewidth,R.linewidth=_.linewidth,T.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const O=r.properties.get(R);O.light=T}return R}function M(A,_,T,F,R,D){if(A.visible===!1)return;if(A.layers.test(R)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&D===3)&&(!A.frustumCulled||A.intersectsFrustum(n))){A.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,A.matrixWorld);const L=e.update(A),W=A.material;if(Array.isArray(W)){const q=L.groups;for(let G=0,I=q.length;G<I;G++){const U=q[G],Y=W[U.materialIndex];if(Y&&Y.visible){const te=b(A,Y,F,D);A.onBeforeShadow(r,A,_,T,L,te,U),r.renderBufferDirect(T,null,L,te,A,U),A.onAfterShadow(r,A,_,T,L,te,U)}}}else if(W.visible){const q=b(A,W,F,D);A.onBeforeShadow(r,A,_,T,L,q,null),r.renderBufferDirect(T,null,L,q,A,null),A.onAfterShadow(r,A,_,T,L,q,null)}}const V=A.children;for(let L=0,W=V.length;L<W;L++)M(V[L],_,T,F,R,D)}function E(A){A.target.removeEventListener("dispose",E);for(const T in c){const F=c[T],R=A.target.uuid;R in F&&(F[R].dispose(),delete F[R])}}}function jp(r,e){function t(){let C=!1;const Q=new Ze;let K=null;const ce=new Ze(0,0,0,0);return{setMask:function(re){K!==re&&!C&&(r.colorMask(re,re,re,re),K=re)},setLocked:function(re){C=re},setClear:function(re,oe,Ae,Ge,se){se===!0&&(re*=Ge,oe*=Ge,Ae*=Ge),Q.set(re,oe,Ae,Ge),ce.equals(Q)===!1&&(r.clearColor(re,oe,Ae,Ge),ce.copy(Q))},reset:function(){C=!1,K=null,ce.set(-1,0,0,0)}}}function n(){let C=!1,Q=!1,K=null,ce=null,re=null;return{setReversed:function(oe){if(Q!==oe){const Ae=e.get("EXT_clip_control");oe?Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.ZERO_TO_ONE_EXT):Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.NEGATIVE_ONE_TO_ONE_EXT),Q=oe;const Ge=re;re=null,this.setClear(Ge)}},getReversed:function(){return Q},setTest:function(oe){oe?pe(r.DEPTH_TEST):De(r.DEPTH_TEST)},setMask:function(oe){K!==oe&&!C&&(r.depthMask(oe),K=oe)},setFunc:function(oe){if(Q&&(oe=Nl[oe]),ce!==oe){switch(oe){case 0:r.depthFunc(r.NEVER);break;case 1:r.depthFunc(r.ALWAYS);break;case 2:r.depthFunc(r.LESS);break;case 3:r.depthFunc(r.LEQUAL);break;case 4:r.depthFunc(r.EQUAL);break;case 5:r.depthFunc(r.GEQUAL);break;case 6:r.depthFunc(r.GREATER);break;case 7:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}ce=oe}},setLocked:function(oe){C=oe},setClear:function(oe){re!==oe&&(re=oe,Q&&(oe=1-oe),r.clearDepth(oe))},reset:function(){C=!1,K=null,ce=null,re=null,Q=!1}}}function i(){let C=!1,Q=null,K=null,ce=null,re=null,oe=null,Ae=null,Ge=null,se=null;return{setTest:function(Re){C||(Re?pe(r.STENCIL_TEST):De(r.STENCIL_TEST))},setMask:function(Re){Q!==Re&&!C&&(r.stencilMask(Re),Q=Re)},setFunc:function(Re,ke,ge){(K!==Re||ce!==ke||re!==ge)&&(r.stencilFunc(Re,ke,ge),K=Re,ce=ke,re=ge)},setOp:function(Re,ke,ge){(oe!==Re||Ae!==ke||Ge!==ge)&&(r.stencilOp(Re,ke,ge),oe=Re,Ae=ke,Ge=ge)},setLocked:function(Re){C=Re},setClear:function(Re){se!==Re&&(r.clearStencil(Re),se=Re)},reset:function(){C=!1,Q=null,K=null,ce=null,re=null,oe=null,Ae=null,Ge=null,se=null}}}const s=new t,a=new n,o=new i;let l={};const c=new WeakMap;let h={},u={},f={},d=new WeakMap,g=[],v=null,m=!1,p=null,x=null,b=null,M=null,E=null,A=null,_=null,T=new Fe(0,0,0),F=0,R=!1,D=null,O=null,V=null,L=null,W=null;const q=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,I=0;const U=r.getParameter(r.VERSION);U.indexOf("WebGL")!==-1?(I=parseFloat(/^WebGL (\d)/.exec(U)[1]),G=I>=1):U.indexOf("OpenGL ES")!==-1&&(I=parseFloat(/^OpenGL ES (\d)/.exec(U)[1]),G=I>=2);let Y=null,te={};const xe=r.getParameter(r.SCISSOR_BOX),Le=r.getParameter(r.VIEWPORT),$=new Ze().fromArray(xe),me=new Ze().fromArray(Le);function Me(C,Q,K,ce){const re=new Uint8Array(4),oe=r.createTexture();r.bindTexture(C,oe),r.texParameteri(C,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(C,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Ae=0;Ae<K;Ae++)C===r.TEXTURE_3D||C===r.TEXTURE_2D_ARRAY?r.texImage3D(Q,0,r.RGBA,1,1,ce,0,r.RGBA,r.UNSIGNED_BYTE,re):r.texImage2D(Q+Ae,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,re);return oe}const we={};we[r.TEXTURE_2D]=Me(r.TEXTURE_2D,r.TEXTURE_2D,1),we[r.TEXTURE_CUBE_MAP]=Me(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),we[r.TEXTURE_2D_ARRAY]=Me(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),we[r.TEXTURE_3D]=Me(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),pe(r.DEPTH_TEST),a.setFunc(3),Wt(!1),ut(1),pe(r.CULL_FACE),It(0);function pe(C){h[C]!==!0&&(r.enable(C),h[C]=!0)}function De(C){h[C]!==!1&&(r.disable(C),h[C]=!1)}function Je(C,Q){return f[C]!==Q?(r.bindFramebuffer(C,Q),f[C]=Q,C===r.DRAW_FRAMEBUFFER&&(f[r.FRAMEBUFFER]=Q),C===r.FRAMEBUFFER&&(f[r.DRAW_FRAMEBUFFER]=Q),!0):!1}function Pe(C,Q){let K=g,ce=!1;if(C){K=d.get(Q),K===void 0&&(K=[],d.set(Q,K));const re=C.textures;if(K.length!==re.length||K[0]!==r.COLOR_ATTACHMENT0){for(let oe=0,Ae=re.length;oe<Ae;oe++)K[oe]=r.COLOR_ATTACHMENT0+oe;K.length=re.length,ce=!0}}else K[0]!==r.BACK&&(K[0]=r.BACK,ce=!0);ce&&r.drawBuffers(K)}function je(C){return v!==C?(r.useProgram(C),v=C,!0):!1}const rt={100:r.FUNC_ADD,101:r.FUNC_SUBTRACT,102:r.FUNC_REVERSE_SUBTRACT};rt[103]=r.MIN,rt[104]=r.MAX;const qe={200:r.ZERO,201:r.ONE,202:r.SRC_COLOR,204:r.SRC_ALPHA,210:r.SRC_ALPHA_SATURATE,208:r.DST_COLOR,206:r.DST_ALPHA,203:r.ONE_MINUS_SRC_COLOR,205:r.ONE_MINUS_SRC_ALPHA,209:r.ONE_MINUS_DST_COLOR,207:r.ONE_MINUS_DST_ALPHA,211:r.CONSTANT_COLOR,212:r.ONE_MINUS_CONSTANT_COLOR,213:r.CONSTANT_ALPHA,214:r.ONE_MINUS_CONSTANT_ALPHA};function It(C,Q,K,ce,re,oe,Ae,Ge,se,Re){if(C===0){m===!0&&(De(r.BLEND),m=!1);return}if(m===!1&&(pe(r.BLEND),m=!0),C!==5){if(C!==p||Re!==R){if((x!==100||E!==100)&&(r.blendEquation(r.FUNC_ADD),x=100,E=100),Re)switch(C){case 1:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case 2:r.blendFunc(r.ONE,r.ONE);break;case 3:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case 4:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:Ie("WebGLState: Invalid blending: ",C);break}else switch(C){case 1:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case 2:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case 3:Ie("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case 4:Ie("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ie("WebGLState: Invalid blending: ",C);break}b=null,M=null,A=null,_=null,T.set(0,0,0),F=0,p=C,R=Re}return}re=re||Q,oe=oe||K,Ae=Ae||ce,(Q!==x||re!==E)&&(r.blendEquationSeparate(rt[Q],rt[re]),x=Q,E=re),(K!==b||ce!==M||oe!==A||Ae!==_)&&(r.blendFuncSeparate(qe[K],qe[ce],qe[oe],qe[Ae]),b=K,M=ce,A=oe,_=Ae),(Ge.equals(T)===!1||se!==F)&&(r.blendColor(Ge.r,Ge.g,Ge.b,se),T.copy(Ge),F=se),p=C,R=!1}function vt(C,Q){C.side===2?De(r.CULL_FACE):pe(r.CULL_FACE);let K=C.side===1;Q&&(K=!K),Wt(K),C.blending===1&&C.transparent===!1?It(0):It(C.blending,C.blendEquation,C.blendSrc,C.blendDst,C.blendEquationAlpha,C.blendSrcAlpha,C.blendDstAlpha,C.blendColor,C.blendAlpha,C.premultipliedAlpha),a.setFunc(C.depthFunc),a.setTest(C.depthTest),a.setMask(C.depthWrite),s.setMask(C.colorWrite);const ce=C.stencilWrite;o.setTest(ce),ce&&(o.setMask(C.stencilWriteMask),o.setFunc(C.stencilFunc,C.stencilRef,C.stencilFuncMask),o.setOp(C.stencilFail,C.stencilZFail,C.stencilZPass)),At(C.polygonOffset,C.polygonOffsetFactor,C.polygonOffsetUnits),C.alphaToCoverage===!0?pe(r.SAMPLE_ALPHA_TO_COVERAGE):De(r.SAMPLE_ALPHA_TO_COVERAGE)}function Wt(C){D!==C&&(C?r.frontFace(r.CW):r.frontFace(r.CCW),D=C)}function ut(C){C!==0?(pe(r.CULL_FACE),C!==O&&(C===1?r.cullFace(r.BACK):C===2?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):De(r.CULL_FACE),O=C}function vn(C){C!==V&&(G&&r.lineWidth(C),V=C)}function At(C,Q,K){C?(pe(r.POLYGON_OFFSET_FILL),(L!==Q||W!==K)&&(L=Q,W=K,a.getReversed()&&(Q=-Q,K=-K),r.polygonOffset(Q,K))):De(r.POLYGON_OFFSET_FILL)}function Jt(C){C?pe(r.SCISSOR_TEST):De(r.SCISSOR_TEST)}function Qt(C){C===void 0&&(C=r.TEXTURE0+q-1),Y!==C&&(r.activeTexture(C),Y=C)}function jt(C,Q,K){K===void 0&&(Y===null?K=r.TEXTURE0+q-1:K=Y);let ce=te[K];ce===void 0&&(ce={type:void 0,texture:void 0},te[K]=ce),(ce.type!==C||ce.texture!==Q)&&(Y!==K&&(r.activeTexture(K),Y=K),r.bindTexture(C,Q||we[C]),ce.type=C,ce.texture=Q)}function N(){const C=te[Y];C!==void 0&&C.type!==void 0&&(r.bindTexture(C.type,null),C.type=void 0,C.texture=void 0)}function en(){try{r.compressedTexImage2D(...arguments)}catch(C){Ie("WebGLState:",C)}}function ct(){try{r.compressedTexImage3D(...arguments)}catch(C){Ie("WebGLState:",C)}}function ht(){try{r.texSubImage2D(...arguments)}catch(C){Ie("WebGLState:",C)}}function de(){try{r.texSubImage3D(...arguments)}catch(C){Ie("WebGLState:",C)}}function xt(){try{r.compressedTexSubImage2D(...arguments)}catch(C){Ie("WebGLState:",C)}}function Ce(){try{r.compressedTexSubImage3D(...arguments)}catch(C){Ie("WebGLState:",C)}}function Ne(){try{r.texStorage2D(...arguments)}catch(C){Ie("WebGLState:",C)}}function w(){try{r.texStorage3D(...arguments)}catch(C){Ie("WebGLState:",C)}}function S(){try{r.texImage2D(...arguments)}catch(C){Ie("WebGLState:",C)}}function k(){try{r.texImage3D(...arguments)}catch(C){Ie("WebGLState:",C)}}function ie(C){return u[C]!==void 0?u[C]:r.getParameter(C)}function ee(C,Q){u[C]!==Q&&(r.pixelStorei(C,Q),u[C]=Q)}function ae(C){$.equals(C)===!1&&(r.scissor(C.x,C.y,C.z,C.w),$.copy(C))}function ue(C){me.equals(C)===!1&&(r.viewport(C.x,C.y,C.z,C.w),me.copy(C))}function Z(C,Q){let K=c.get(Q);K===void 0&&(K=new WeakMap,c.set(Q,K));let ce=K.get(C);ce===void 0&&(ce=r.getUniformBlockIndex(Q,C.name),r.uniformBlockBinding(Q,ce,ce),K.set(C,ce))}function J(C,Q,K){const re=c.get(Q).get(C);l[re]!==K&&(r.bindBufferBase(r.UNIFORM_BUFFER,re,K),l[re]=K)}function le(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),r.pixelStorei(r.PACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,r.BROWSER_DEFAULT_WEBGL),r.pixelStorei(r.PACK_ROW_LENGTH,0),r.pixelStorei(r.PACK_SKIP_PIXELS,0),r.pixelStorei(r.PACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_ROW_LENGTH,0),r.pixelStorei(r.UNPACK_IMAGE_HEIGHT,0),r.pixelStorei(r.UNPACK_SKIP_PIXELS,0),r.pixelStorei(r.UNPACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_SKIP_IMAGES,0),h={},u={},Y=null,te={},f={},l={},d=new WeakMap,g=[],v=null,m=!1,p=null,x=null,b=null,M=null,E=null,A=null,_=null,T=new Fe(0,0,0),F=0,R=!1,D=null,O=null,V=null,L=null,W=null,$.set(0,0,r.canvas.width,r.canvas.height),me.set(0,0,r.canvas.width,r.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:pe,disable:De,bindFramebuffer:Je,drawBuffers:Pe,useProgram:je,setBlending:It,setMaterial:vt,setFlipSided:Wt,setCullFace:ut,setLineWidth:vn,setPolygonOffset:At,setScissorTest:Jt,activeTexture:Qt,bindTexture:jt,unbindTexture:N,compressedTexImage2D:en,compressedTexImage3D:ct,texImage2D:S,texImage3D:k,pixelStorei:ee,getParameter:ie,updateUBOMapping:Z,uniformBlockBinding:J,texStorage2D:Ne,texStorage3D:w,texSubImage2D:ht,texSubImage3D:de,compressedTexSubImage2D:xt,compressedTexSubImage3D:Ce,scissor:ae,viewport:ue,reset:le}}function em(r,e,t,n,i,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ue,h=new WeakMap,u=new Set;let f;const d=new WeakMap,g=new Set,v=new FinalizationRegistry(w=>g.delete(w));let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(w,S){return m?new OffscreenCanvas(w,S):ns("canvas")}function x(w,S,k){let ie=1;const ee=Ne(w);if((ee.width>k||ee.height>k)&&(ie=k/Math.max(ee.width,ee.height)),ie<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const ae=Math.floor(ie*ee.width),ue=Math.floor(ie*ee.height);f===void 0&&(f=p(ae,ue));const Z=S?p(ae,ue):f;return Z.width=ae,Z.height=ue,Z.getContext("2d").drawImage(w,0,0,ae,ue),Ee("WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+ae+"x"+ue+")."),Z}else return"data"in w&&Ee("WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),w;return w}function b(w){return w.generateMipmaps}function M(w){r.generateMipmap(w)}function E(w){return w.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?r.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function A(w,S,k,ie,ee,ae=!1){if(w!==null){if(r[w]!==void 0)return r[w];Ee("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let ue;ie&&(ue=e.get("EXT_texture_norm16"),ue||Ee("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=S;if(S===r.RED&&(k===r.FLOAT&&(Z=r.R32F),k===r.HALF_FLOAT&&(Z=r.R16F),k===r.UNSIGNED_BYTE&&(Z=r.R8),k===r.UNSIGNED_SHORT&&ue&&(Z=ue.R16_EXT),k===r.SHORT&&ue&&(Z=ue.R16_SNORM_EXT)),S===r.RED_INTEGER&&(k===r.UNSIGNED_BYTE&&(Z=r.R8UI),k===r.UNSIGNED_SHORT&&(Z=r.R16UI),k===r.UNSIGNED_INT&&(Z=r.R32UI),k===r.BYTE&&(Z=r.R8I),k===r.SHORT&&(Z=r.R16I),k===r.INT&&(Z=r.R32I)),S===r.RG&&(k===r.FLOAT&&(Z=r.RG32F),k===r.HALF_FLOAT&&(Z=r.RG16F),k===r.UNSIGNED_BYTE&&(Z=r.RG8),k===r.UNSIGNED_SHORT&&ue&&(Z=ue.RG16_EXT),k===r.SHORT&&ue&&(Z=ue.RG16_SNORM_EXT)),S===r.RG_INTEGER&&(k===r.UNSIGNED_BYTE&&(Z=r.RG8UI),k===r.UNSIGNED_SHORT&&(Z=r.RG16UI),k===r.UNSIGNED_INT&&(Z=r.RG32UI),k===r.BYTE&&(Z=r.RG8I),k===r.SHORT&&(Z=r.RG16I),k===r.INT&&(Z=r.RG32I)),S===r.RGB_INTEGER&&(k===r.UNSIGNED_BYTE&&(Z=r.RGB8UI),k===r.UNSIGNED_SHORT&&(Z=r.RGB16UI),k===r.UNSIGNED_INT&&(Z=r.RGB32UI),k===r.BYTE&&(Z=r.RGB8I),k===r.SHORT&&(Z=r.RGB16I),k===r.INT&&(Z=r.RGB32I)),S===r.RGBA_INTEGER&&(k===r.UNSIGNED_BYTE&&(Z=r.RGBA8UI),k===r.UNSIGNED_SHORT&&(Z=r.RGBA16UI),k===r.UNSIGNED_INT&&(Z=r.RGBA32UI),k===r.BYTE&&(Z=r.RGBA8I),k===r.SHORT&&(Z=r.RGBA16I),k===r.INT&&(Z=r.RGBA32I)),S===r.RGB&&(k===r.UNSIGNED_SHORT&&ue&&(Z=ue.RGB16_EXT),k===r.SHORT&&ue&&(Z=ue.RGB16_SNORM_EXT),k===r.UNSIGNED_INT_5_9_9_9_REV&&(Z=r.RGB9_E5),k===r.UNSIGNED_INT_10F_11F_11F_REV&&(Z=r.R11F_G11F_B10F)),S===r.RGBA){const J=ae?qs:Xe.getTransfer(ee);k===r.FLOAT&&(Z=r.RGBA32F),k===r.HALF_FLOAT&&(Z=r.RGBA16F),k===r.UNSIGNED_BYTE&&(Z=J===it?r.SRGB8_ALPHA8:r.RGBA8),k===r.UNSIGNED_SHORT&&ue&&(Z=ue.RGBA16_EXT),k===r.SHORT&&ue&&(Z=ue.RGBA16_SNORM_EXT),k===r.UNSIGNED_SHORT_4_4_4_4&&(Z=r.RGBA4),k===r.UNSIGNED_SHORT_5_5_5_1&&(Z=r.RGB5_A1)}return(Z===r.R16F||Z===r.R32F||Z===r.RG16F||Z===r.RG32F||Z===r.RGBA16F||Z===r.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function _(w,S){let k;return w?S===null||S===1014||S===1020?k=r.DEPTH24_STENCIL8:S===1015?k=r.DEPTH32F_STENCIL8:S===1012&&(k=r.DEPTH24_STENCIL8,Ee("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===1014||S===1020?k=r.DEPTH_COMPONENT24:S===1015?k=r.DEPTH_COMPONENT32F:S===1012&&(k=r.DEPTH_COMPONENT16),k}function T(w,S){return b(w)===!0||w.isFramebufferTexture&&w.minFilter!==1003&&w.minFilter!==1006?Math.log2(Math.max(S.width,S.height))+1:w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?S.mipmaps.length:1}function F(w){const S=new WeakRef(w);n.get(w).__ref=S,g.add(S),v.register(w,S,S)}function R(w){const S=n.get(w).__ref;S!==void 0&&(g.delete(S),v.unregister(S))}function D(w){V(w.target)}function O(w){L(w.target)}function V(w){w.removeEventListener("dispose",D),R(w),q(w),w.isVideoTexture&&h.delete(w),w.isHTMLTexture&&u.delete(w)}function L(w){w.removeEventListener("dispose",O),R(w),I(w)}function W(){for(const w of g){const S=w.deref();S!==void 0&&(S.isRenderTarget===!0?L(S):V(S))}g.clear(),u.clear()}function q(w){const S=n.get(w);if(S.__webglInit===void 0)return;const k=w.source,ie=d.get(k);if(ie){const ee=ie[S.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&G(w),Object.keys(ie).length===0&&d.delete(k)}n.remove(w)}function G(w){const S=n.get(w);r.deleteTexture(S.__webglTexture);const k=w.source,ie=d.get(k);delete ie[S.__cacheKey],a.memory.textures--}function I(w){const S=n.get(w);S.__depthDisposeCallback&&S.__depthDisposeCallback();const k=w.depthTexture;if(k&&k.renderTarget===w&&V(k),w.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(S.__webglFramebuffer[ee]))for(let ae=0;ae<S.__webglFramebuffer[ee].length;ae++)r.deleteFramebuffer(S.__webglFramebuffer[ee][ae]);else r.deleteFramebuffer(S.__webglFramebuffer[ee]);S.__webglDepthbuffer&&r.deleteRenderbuffer(S.__webglDepthbuffer[ee])}else{if(Array.isArray(S.__webglFramebuffer))for(let ee=0;ee<S.__webglFramebuffer.length;ee++)r.deleteFramebuffer(S.__webglFramebuffer[ee]);else r.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&r.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&r.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let ee=0;ee<S.__webglColorRenderbuffer.length;ee++)S.__webglColorRenderbuffer[ee]&&r.deleteRenderbuffer(S.__webglColorRenderbuffer[ee]);S.__webglDepthRenderbuffer&&r.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const ie=w.textures;for(let ee=0,ae=ie.length;ee<ae;ee++){const ue=n.get(ie[ee]);ue.__webglTexture&&(r.deleteTexture(ue.__webglTexture),a.memory.textures--),n.remove(ie[ee])}n.remove(w)}let U=0;function Y(){U=0}function te(){return U}function xe(w){U=w}function Le(){const w=U;return w>=i.maxTextures&&Ee("WebGLTextures: Trying to use "+(w+1)+" texture units while this GPU supports only "+i.maxTextures),U+=1,w}function $(w){const S=[];return S.push(w.wrapS),S.push(w.wrapT),S.push(w.wrapR||0),S.push(w.magFilter),S.push(w.minFilter),S.push(w.anisotropy),S.push(w.internalFormat),S.push(w.format),S.push(w.type),S.push(w.generateMipmaps),S.push(w.mipmapsAutoUpdate),S.push(w.premultiplyAlpha),S.push(w.flipY),S.push(w.unpackAlignment),S.push(w.colorSpace),S.join()}function me(w,S){const k=n.get(w);if(w.isVideoTexture&&xt(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&k.__version!==w.version){const ie=w.image;if(ie===null)Ee("WebGLRenderer: Texture marked for update but no image data found.");else if(ie.complete===!1)Ee("WebGLRenderer: Texture marked for update but image is incomplete");else{vt(k,w,S);return}}else w.isExternalTexture&&(k.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(r.TEXTURE_2D,k.__webglTexture,r.TEXTURE0+S)}function Me(w,S){const k=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&k.__version!==w.version){vt(k,w,S);return}else w.isExternalTexture&&(k.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(r.TEXTURE_2D_ARRAY,k.__webglTexture,r.TEXTURE0+S)}function we(w,S){const k=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&k.__version!==w.version){vt(k,w,S);return}t.bindTexture(r.TEXTURE_3D,k.__webglTexture,r.TEXTURE0+S)}function pe(w,S){const k=n.get(w);if(w.version>0&&k.__version!==w.version){Wt(k,w,S);return}t.bindTexture(r.TEXTURE_CUBE_MAP,k.__webglTexture,r.TEXTURE0+S)}const De={1e3:r.REPEAT,1001:r.CLAMP_TO_EDGE,1002:r.MIRRORED_REPEAT},Je={1003:r.NEAREST,1004:r.NEAREST_MIPMAP_NEAREST,1005:r.NEAREST_MIPMAP_LINEAR,1006:r.LINEAR,1007:r.LINEAR_MIPMAP_NEAREST,1008:r.LINEAR_MIPMAP_LINEAR},Pe={512:r.NEVER,519:r.ALWAYS,513:r.LESS,515:r.LEQUAL,514:r.EQUAL,518:r.GEQUAL,516:r.GREATER,517:r.NOTEQUAL};function je(w,S){if(S.type===1015&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===1006||S.magFilter===1007||S.magFilter===1005||S.magFilter===1008||S.minFilter===1006||S.minFilter===1007||S.minFilter===1005||S.minFilter===1008)&&Ee("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(w,r.TEXTURE_WRAP_S,De[S.wrapS]),r.texParameteri(w,r.TEXTURE_WRAP_T,De[S.wrapT]),(w===r.TEXTURE_3D||w===r.TEXTURE_2D_ARRAY)&&r.texParameteri(w,r.TEXTURE_WRAP_R,De[S.wrapR]),r.texParameteri(w,r.TEXTURE_MAG_FILTER,Je[S.magFilter]),r.texParameteri(w,r.TEXTURE_MIN_FILTER,Je[S.minFilter]),S.compareFunction&&(r.texParameteri(w,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(w,r.TEXTURE_COMPARE_FUNC,Pe[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===1003||S.minFilter!==1005&&S.minFilter!==1008||S.type===1015&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");r.texParameterf(w,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,i.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function rt(w,S){let k=!1;w.__webglInit===void 0&&(w.__webglInit=!0,S.addEventListener("dispose",D),F(S));const ie=S.source;let ee=d.get(ie);ee===void 0&&(ee={},d.set(ie,ee));const ae=$(S);if(ae!==w.__cacheKey){ee[ae]===void 0&&(ee[ae]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,k=!0),ee[ae].usedTimes++;const ue=ee[w.__cacheKey];ue!==void 0&&(ee[w.__cacheKey].usedTimes--,ue.usedTimes===0&&G(S)),w.__cacheKey=ae,w.__webglTexture=ee[ae].texture}return k}function qe(w,S,k){return Math.floor(Math.floor(w/k)/S)}function It(w,S,k,ie){const ae=w.updateRanges;if(ae.length===0)t.texSubImage2D(r.TEXTURE_2D,0,0,0,S.width,S.height,k,ie,S.data);else{ae.sort((C,Q)=>C.start-Q.start);let ue=0;for(let C=1;C<ae.length;C++){const Q=ae[ue],K=ae[C],ce=Q.start+Q.count,re=qe(K.start,S.width,4),oe=qe(Q.start,S.width,4);K.start<=ce+1&&re===oe&&qe(K.start+K.count-1,S.width,4)===re?Q.count=Math.max(Q.count,K.start+K.count-Q.start):(++ue,ae[ue]=K)}ae.length=ue+1;const Z=t.getParameter(r.UNPACK_ROW_LENGTH),J=t.getParameter(r.UNPACK_SKIP_PIXELS),le=t.getParameter(r.UNPACK_SKIP_ROWS);t.pixelStorei(r.UNPACK_ROW_LENGTH,S.width);for(let C=0,Q=ae.length;C<Q;C++){const K=ae[C],ce=Math.floor(K.start/4),re=Math.ceil(K.count/4),oe=ce%S.width,Ae=Math.floor(ce/S.width),Ge=re,se=1;t.pixelStorei(r.UNPACK_SKIP_PIXELS,oe),t.pixelStorei(r.UNPACK_SKIP_ROWS,Ae),t.texSubImage2D(r.TEXTURE_2D,0,oe,Ae,Ge,se,k,ie,S.data)}w.clearUpdateRanges(),t.pixelStorei(r.UNPACK_ROW_LENGTH,Z),t.pixelStorei(r.UNPACK_SKIP_PIXELS,J),t.pixelStorei(r.UNPACK_SKIP_ROWS,le)}}function vt(w,S,k){let ie=r.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(ie=r.TEXTURE_2D_ARRAY),S.isData3DTexture&&(ie=r.TEXTURE_3D);const ee=rt(w,S),ae=S.source;t.bindTexture(ie,w.__webglTexture,r.TEXTURE0+k);const ue=n.get(ae);if(ae.version!==ue.__version||ee===!0){if(t.activeTexture(r.TEXTURE0+k),(typeof ImageBitmap<"u"&&S.image instanceof ImageBitmap)===!1){const se=Xe.getPrimaries(Xe.workingColorSpace),Re=S.colorSpace===""?null:Xe.getPrimaries(S.colorSpace),ke=S.colorSpace===""||se===Re?r.NONE:r.BROWSER_DEFAULT_WEBGL;t.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,ke)}t.pixelStorei(r.UNPACK_ALIGNMENT,S.unpackAlignment);let J=x(S.image,!1,i.maxTextureSize);J=Ce(S,J);const le=s.convert(S.format,S.colorSpace),C=s.convert(S.type);let Q=A(S.internalFormat,le,C,S.normalized,S.colorSpace,S.isVideoTexture);je(ie,S);let K;const ce=S.mipmaps,re=S.isVideoTexture!==!0,oe=ue.__version===void 0||ee===!0,Ae=ae.dataReady,Ge=T(S,J);if(S.isDepthTexture)Q=_(S.format===1027,S.type),oe&&(re?t.texStorage2D(r.TEXTURE_2D,1,Q,J.width,J.height):t.texImage2D(r.TEXTURE_2D,0,Q,J.width,J.height,0,le,C,null));else if(S.isDataTexture)if(ce.length>0){re&&oe&&t.texStorage2D(r.TEXTURE_2D,Ge,Q,ce[0].width,ce[0].height);for(let se=0,Re=ce.length;se<Re;se++)K=ce[se],re?Ae&&t.texSubImage2D(r.TEXTURE_2D,se,0,0,K.width,K.height,le,C,K.data):t.texImage2D(r.TEXTURE_2D,se,Q,K.width,K.height,0,le,C,K.data);S.generateMipmaps=!1}else re?(oe&&t.texStorage2D(r.TEXTURE_2D,Ge,Q,J.width,J.height),Ae&&It(S,J,le,C)):t.texImage2D(r.TEXTURE_2D,0,Q,J.width,J.height,0,le,C,J.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){re&&oe&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Ge,Q,ce[0].width,ce[0].height,J.depth);for(let se=0,Re=ce.length;se<Re;se++)if(K=ce[se],S.format!==1023)if(le!==null)if(re){if(Ae)if(S.layerUpdates.size>0){const ke=lo(K.width,K.height,S.format,S.type);for(const ge of S.layerUpdates){const tt=K.data.subarray(ge*ke/K.data.BYTES_PER_ELEMENT,(ge+1)*ke/K.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,se,0,0,ge,K.width,K.height,1,le,tt)}}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,se,0,0,0,K.width,K.height,J.depth,le,K.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,se,Q,K.width,K.height,J.depth,0,K.data,0,0);else Ee("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else re?Ae&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,se,0,0,0,K.width,K.height,J.depth,le,C,K.data):t.texImage3D(r.TEXTURE_2D_ARRAY,se,Q,K.width,K.height,J.depth,0,le,C,K.data);S.layerUpdates.size>0&&S.clearLayerUpdates()}else{re&&oe&&t.texStorage2D(r.TEXTURE_2D,Ge,Q,ce[0].width,ce[0].height);for(let se=0,Re=ce.length;se<Re;se++)K=ce[se],S.format!==1023?le!==null?re?Ae&&t.compressedTexSubImage2D(r.TEXTURE_2D,se,0,0,K.width,K.height,le,K.data):t.compressedTexImage2D(r.TEXTURE_2D,se,Q,K.width,K.height,0,K.data):Ee("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):re?Ae&&t.texSubImage2D(r.TEXTURE_2D,se,0,0,K.width,K.height,le,C,K.data):t.texImage2D(r.TEXTURE_2D,se,Q,K.width,K.height,0,le,C,K.data)}else if(S.isDataArrayTexture)if(re){if(oe&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Ge,Q,J.width,J.height,J.depth),Ae)if(S.layerUpdates.size>0){const se=lo(J.width,J.height,S.format,S.type);for(const Re of S.layerUpdates){const ke=J.data.subarray(Re*se/J.data.BYTES_PER_ELEMENT,(Re+1)*se/J.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,Re,J.width,J.height,1,le,C,ke)}S.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,le,C,J.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,Q,J.width,J.height,J.depth,0,le,C,J.data);else if(S.isData3DTexture)re?(oe&&t.texStorage3D(r.TEXTURE_3D,Ge,Q,J.width,J.height,J.depth),Ae&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,le,C,J.data)):t.texImage3D(r.TEXTURE_3D,0,Q,J.width,J.height,J.depth,0,le,C,J.data);else if(S.isFramebufferTexture){if(oe)if(re)t.texStorage2D(r.TEXTURE_2D,Ge,Q,J.width,J.height);else{let se=J.width,Re=J.height;for(let ke=0;ke<Ge;ke++)t.texImage2D(r.TEXTURE_2D,ke,Q,se,Re,0,le,C,null),se>>=1,Re>>=1}}else if(S.isHTMLTexture){if("texElementImage2D"in r){const se=r.canvas;if(se.hasAttribute("layoutsubtree")||se.setAttribute("layoutsubtree","true"),J.parentNode!==se){se.appendChild(J),u.add(S),se.onpaint=Re=>{const ke=Re.changedElements;for(const ge of u)ke.includes(ge.image)&&(ge.needsUpdate=!0)},se.requestPaint();return}if(r.texElementImage2D.length===3)r.texElementImage2D(r.TEXTURE_2D,r.RGBA8,J);else{const ke=r.RGBA,ge=r.RGBA,tt=r.UNSIGNED_BYTE;r.texElementImage2D(r.TEXTURE_2D,0,ke,ge,tt,J)}r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)}}else if(ce.length>0){if(re&&oe){const se=Ne(ce[0]);t.texStorage2D(r.TEXTURE_2D,Ge,Q,se.width,se.height)}for(let se=0,Re=ce.length;se<Re;se++)K=ce[se],re?Ae&&t.texSubImage2D(r.TEXTURE_2D,se,0,0,le,C,K):t.texImage2D(r.TEXTURE_2D,se,Q,le,C,K);S.generateMipmaps=!1}else if(re){if(oe){const se=Ne(J);t.texStorage2D(r.TEXTURE_2D,Ge,Q,se.width,se.height)}Ae&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,le,C,J)}else t.texImage2D(r.TEXTURE_2D,0,Q,le,C,J);b(S)&&S.mipmapsAutoUpdate===!0&&M(ie),ue.__version=ae.version,S.onUpdate&&S.onUpdate(S)}w.__version=S.version}function Wt(w,S,k){if(S.image.length!==6)return;const ie=rt(w,S),ee=S.source;t.bindTexture(r.TEXTURE_CUBE_MAP,w.__webglTexture,r.TEXTURE0+k);const ae=n.get(ee);if(ee.version!==ae.__version||ie===!0){t.activeTexture(r.TEXTURE0+k);const ue=Xe.getPrimaries(Xe.workingColorSpace),Z=S.colorSpace===""?null:Xe.getPrimaries(S.colorSpace),J=S.colorSpace===""||ue===Z?r.NONE:r.BROWSER_DEFAULT_WEBGL;t.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(r.UNPACK_ALIGNMENT,S.unpackAlignment),t.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,J);const le=S.isCompressedTexture||S.image[0].isCompressedTexture,C=S.image[0]&&S.image[0].isDataTexture,Q=[];for(let ge=0;ge<6;ge++)!le&&!C?Q[ge]=x(S.image[ge],!0,i.maxCubemapSize):Q[ge]=C?S.image[ge].image:S.image[ge],Q[ge]=Ce(S,Q[ge]);const K=Q[0],ce=s.convert(S.format,S.colorSpace),re=s.convert(S.type);let oe=A(S.internalFormat,ce,re,S.normalized,S.colorSpace);const Ae=S.isVideoTexture!==!0,Ge=ae.__version===void 0||ie===!0,se=ee.dataReady;let Re=T(S,K);je(r.TEXTURE_CUBE_MAP,S);let ke;if(S.isDepthTexture){if(oe=_(S.format===1027,S.type),Ge)if(Ae)t.texStorage2D(r.TEXTURE_CUBE_MAP,1,oe,K.width,K.height);else for(let ge=0;ge<6;ge++)t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,oe,K.width,K.height,0,ce,re,null)}else if(le){Ae&&Ge&&t.texStorage2D(r.TEXTURE_CUBE_MAP,Re,oe,K.width,K.height);for(let ge=0;ge<6;ge++){ke=Q[ge].mipmaps;for(let tt=0;tt<ke.length;tt++){const wt=ke[tt];S.format!==1023?ce!==null?Ae?se&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,tt,0,0,wt.width,wt.height,ce,wt.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,tt,oe,wt.width,wt.height,0,wt.data):Ee("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ae?se&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,tt,0,0,wt.width,wt.height,ce,re,wt.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,tt,oe,wt.width,wt.height,0,ce,re,wt.data)}}}else{if(ke=S.mipmaps,Ae&&Ge){ke.length>0&&Re++;const ge=Ne(Q[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,Re,oe,ge.width,ge.height)}for(let ge=0;ge<6;ge++)if(C){Ae?se&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,0,0,Q[ge].width,Q[ge].height,ce,re,Q[ge].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,oe,Q[ge].width,Q[ge].height,0,ce,re,Q[ge].data);for(let tt=0;tt<ke.length;tt++){const Gn=ke[tt].image[ge].image;Ae?se&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,tt+1,0,0,Gn.width,Gn.height,ce,re,Gn.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,tt+1,oe,Gn.width,Gn.height,0,ce,re,Gn.data)}}else{Ae?se&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,0,0,ce,re,Q[ge]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,oe,ce,re,Q[ge]);for(let tt=0;tt<ke.length;tt++){const wt=ke[tt];Ae?se&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,tt+1,0,0,ce,re,wt.image[ge]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,tt+1,oe,ce,re,wt.image[ge])}}}b(S)&&S.mipmapsAutoUpdate===!0&&M(r.TEXTURE_CUBE_MAP),ae.__version=ee.version,S.onUpdate&&S.onUpdate(S)}w.__version=S.version}function ut(w,S,k,ie,ee,ae){const ue=s.convert(k.format,k.colorSpace),Z=s.convert(k.type),J=A(k.internalFormat,ue,Z,k.normalized,k.colorSpace),le=n.get(S),C=n.get(k);if(C.__renderTarget=S,!le.__hasExternalTextures){const Q=Math.max(1,S.width>>ae),K=Math.max(1,S.height>>ae);ee===r.TEXTURE_3D||ee===r.TEXTURE_2D_ARRAY?t.texImage3D(ee,ae,J,Q,K,S.depth,0,ue,Z,null):t.texImage2D(ee,ae,J,Q,K,0,ue,Z,null)}t.bindFramebuffer(r.FRAMEBUFFER,w),de(S)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,ie,ee,C.__webglTexture,0,ht(S)):(ee===r.TEXTURE_2D||ee>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,ie,ee,C.__webglTexture,ae),t.bindFramebuffer(r.FRAMEBUFFER,null)}function vn(w,S,k){if(r.bindRenderbuffer(r.RENDERBUFFER,w),S.depthBuffer){const ie=S.depthTexture,ee=ie&&ie.isDepthTexture?ie.type:null,ae=_(S.stencilBuffer,ee),ue=S.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;de(S)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ht(S),ae,S.width,S.height):k?r.renderbufferStorageMultisample(r.RENDERBUFFER,ht(S),ae,S.width,S.height):r.renderbufferStorage(r.RENDERBUFFER,ae,S.width,S.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,ue,r.RENDERBUFFER,w)}else{const ie=S.textures;for(let ee=0;ee<ie.length;ee++){const ae=ie[ee],ue=s.convert(ae.format,ae.colorSpace),Z=s.convert(ae.type),J=A(ae.internalFormat,ue,Z,ae.normalized,ae.colorSpace);de(S)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ht(S),J,S.width,S.height):k?r.renderbufferStorageMultisample(r.RENDERBUFFER,ht(S),J,S.width,S.height):r.renderbufferStorage(r.RENDERBUFFER,J,S.width,S.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function At(w,S,k){const ie=S.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(r.FRAMEBUFFER,w),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const ee=n.get(S.depthTexture);ee.__renderTarget=S;const ae=ie?S.depthTexture.image[0]:S.depthTexture.image;(!ee.__webglTexture||ae.width!==S.width||ae.height!==S.height)&&(ae.width=S.width,ae.height=S.height,S.depthTexture.needsUpdate=!0),ie?pe(S.depthTexture,0):me(S.depthTexture,0);const ue=ee.__webglTexture,Z=ht(S),J=ie?r.TEXTURE_CUBE_MAP_POSITIVE_X+k:r.TEXTURE_2D,le=S.depthTexture.format===1027?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(S.depthTexture.format===1026)de(S)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,le,J,ue,0,Z):r.framebufferTexture2D(r.FRAMEBUFFER,le,J,ue,0);else if(S.depthTexture.format===1027)de(S)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,le,J,ue,0,Z):r.framebufferTexture2D(r.FRAMEBUFFER,le,J,ue,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Jt(w){const S=n.get(w),k=w.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==w.depthTexture){const ie=w.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),ie){const ee=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,ie.removeEventListener("dispose",ee)};ie.addEventListener("dispose",ee),S.__depthDisposeCallback=ee}S.__boundDepthTexture=ie}if(w.depthTexture&&!S.__autoAllocateDepthBuffer)if(k)for(let ie=0;ie<6;ie++)At(S.__webglFramebuffer[ie],w,ie);else w.texture.mipmaps.length>0?At(S.__webglFramebuffer[0],w,0):At(S.__webglFramebuffer,w,0);else if(k){S.__webglDepthbuffer=[];for(let ie=0;ie<6;ie++)if(t.bindFramebuffer(r.FRAMEBUFFER,S.__webglFramebuffer[ie]),S.__webglDepthbuffer[ie]===void 0)S.__webglDepthbuffer[ie]=r.createRenderbuffer(),vn(S.__webglDepthbuffer[ie],w,!1);else{const ee=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ae=S.__webglDepthbuffer[ie];r.bindRenderbuffer(r.RENDERBUFFER,ae),r.framebufferRenderbuffer(r.FRAMEBUFFER,ee,r.RENDERBUFFER,ae)}}else if(w.texture.mipmaps.length>0?t.bindFramebuffer(r.FRAMEBUFFER,S.__webglFramebuffer[0]):t.bindFramebuffer(r.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=r.createRenderbuffer(),vn(S.__webglDepthbuffer,w,!1);else{const ee=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ae=S.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,ae),r.framebufferRenderbuffer(r.FRAMEBUFFER,ee,r.RENDERBUFFER,ae)}t.bindFramebuffer(r.FRAMEBUFFER,null)}function Qt(w,S,k){const ie=n.get(w);S!==void 0&&ut(ie.__webglFramebuffer,w,w.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),k!==void 0&&Jt(w)}function jt(w){const S=w.texture,k=n.get(w),ie=n.get(S);w.addEventListener("dispose",O),F(w);const ee=w.textures,ae=w.isWebGLCubeRenderTarget===!0,ue=ee.length>1;if(ue||(ie.__webglTexture===void 0&&(ie.__webglTexture=r.createTexture()),ie.__version=S.version,a.memory.textures++),ae){k.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(S.mipmaps.length>0){k.__webglFramebuffer[Z]=[];for(let J=0;J<S.mipmaps.length;J++)k.__webglFramebuffer[Z][J]=r.createFramebuffer()}else k.__webglFramebuffer[Z]=r.createFramebuffer()}else{if(S.mipmaps.length>0){k.__webglFramebuffer=[];for(let Z=0;Z<S.mipmaps.length;Z++)k.__webglFramebuffer[Z]=r.createFramebuffer()}else k.__webglFramebuffer=r.createFramebuffer();if(ue)for(let Z=0,J=ee.length;Z<J;Z++){const le=n.get(ee[Z]);le.__webglTexture===void 0&&(le.__webglTexture=r.createTexture(),a.memory.textures++)}if(w.samples>0&&de(w)===!1){k.__webglMultisampledFramebuffer=r.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let Z=0;Z<ee.length;Z++){const J=ee[Z];k.__webglColorRenderbuffer[Z]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,k.__webglColorRenderbuffer[Z]);const le=s.convert(J.format,J.colorSpace),C=s.convert(J.type),Q=A(J.internalFormat,le,C,J.normalized,J.colorSpace,w.isXRRenderTarget===!0),K=ht(w);r.renderbufferStorageMultisample(r.RENDERBUFFER,K,Q,w.width,w.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Z,r.RENDERBUFFER,k.__webglColorRenderbuffer[Z])}r.bindRenderbuffer(r.RENDERBUFFER,null),w.depthBuffer&&(k.__webglDepthRenderbuffer=r.createRenderbuffer(),vn(k.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(ae){t.bindTexture(r.TEXTURE_CUBE_MAP,ie.__webglTexture),je(r.TEXTURE_CUBE_MAP,S);for(let Z=0;Z<6;Z++)if(S.mipmaps.length>0)for(let J=0;J<S.mipmaps.length;J++)ut(k.__webglFramebuffer[Z][J],w,S,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,J);else ut(k.__webglFramebuffer[Z],w,S,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);b(S)?M(r.TEXTURE_CUBE_MAP):S.mipmaps.length>0&&r.texParameteri(r.TEXTURE_CUBE_MAP,r.TEXTURE_MAX_LEVEL,S.mipmaps.length-1),t.unbindTexture()}else if(ue){for(let Z=0,J=ee.length;Z<J;Z++){const le=ee[Z],C=n.get(le);let Q=r.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(Q=w.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(Q,C.__webglTexture),je(Q,le),ut(k.__webglFramebuffer,w,le,r.COLOR_ATTACHMENT0+Z,Q,0),b(le)&&M(Q)}t.unbindTexture()}else{let Z=r.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(Z=w.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(Z,ie.__webglTexture),je(Z,S),S.mipmaps.length>0)for(let J=0;J<S.mipmaps.length;J++)ut(k.__webglFramebuffer[J],w,S,r.COLOR_ATTACHMENT0,Z,J);else ut(k.__webglFramebuffer,w,S,r.COLOR_ATTACHMENT0,Z,0);b(S)?M(Z):S.mipmaps.length>0&&r.texParameteri(Z,r.TEXTURE_MAX_LEVEL,S.mipmaps.length-1),t.unbindTexture()}w.depthBuffer&&Jt(w)}function N(w){const S=w.textures;for(let k=0,ie=S.length;k<ie;k++){const ee=S[k];if(b(ee)&&ee.mipmapsAutoUpdate===!0){const ae=E(w),ue=n.get(ee).__webglTexture;t.bindTexture(ae,ue),M(ae),t.unbindTexture()}}}const en=[];function ct(w){if(w.samples>0){if(de(w)===!1){const S=w.textures,k=w.width,ie=w.height;let ee=r.COLOR_BUFFER_BIT;const ae=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ue=n.get(w),Z=S.length>1;if(Z)for(let le=0;le<S.length;le++)t.bindFramebuffer(r.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,ue.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,ue.__webglMultisampledFramebuffer),w.texture.mipmaps.length>0?t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ue.__webglFramebuffer[0]):t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ue.__webglFramebuffer);for(let le=0;le<S.length;le++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(ee|=r.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(ee|=r.STENCIL_BUFFER_BIT)),Z){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,ue.__webglColorRenderbuffer[le]);const C=n.get(S[le]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,C,0)}r.blitFramebuffer(0,0,k,ie,0,0,k,ie,ee,r.NEAREST),l===!0&&(en.length=0,en.push(r.COLOR_ATTACHMENT0+le),w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&en.push(ae),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,en))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),Z)for(let le=0;le<S.length;le++){t.bindFramebuffer(r.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.RENDERBUFFER,ue.__webglColorRenderbuffer[le]);const C=n.get(S[le]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,ue.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.TEXTURE_2D,C,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ue.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&l){const S=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[S])}}}function ht(w){return Math.min(i.maxSamples,w.samples)}function de(w){const S=n.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function xt(w){const S=a.render.frame;h.get(w)!==S&&(h.set(w,S),w.update())}function Ce(w,S){const k=w.colorSpace,ie=w.format,ee=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||k!==Kt&&k!==""&&(Xe.getTransfer(k)===it?(ie!==1023||ee!==1009)&&Ee("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ie("WebGLTextures: Unsupported texture color space:",k)),S}function Ne(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=Le,this.resetTextureUnits=Y,this.getTextureUnits=te,this.setTextureUnits=xe,this.setTexture2D=me,this.setTexture2DArray=Me,this.setTexture3D=we,this.setTextureCube=pe,this.rebindTextures=Qt,this.setupRenderTarget=jt,this.updateRenderTargetMipmap=N,this.updateMultisampleRenderTarget=ct,this.setupDepthRenderbuffer=Jt,this.setupFrameBufferTexture=ut,this.useMultisampledRTT=de,this.dispose=W}function tm(r,e){function t(n,i=""){let s;const a=Xe.getTransfer(i);if(n===1009)return r.UNSIGNED_BYTE;if(n===1017)return r.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return r.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return r.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return r.BYTE;if(n===1011)return r.SHORT;if(n===1012)return r.UNSIGNED_SHORT;if(n===1013)return r.INT;if(n===1014)return r.UNSIGNED_INT;if(n===1015)return r.FLOAT;if(n===1016)return r.HALF_FLOAT;if(n===1021)return r.ALPHA;if(n===1022)return r.RGB;if(n===1023)return r.RGBA;if(n===1026)return r.DEPTH_COMPONENT;if(n===1027)return r.DEPTH_STENCIL;if(n===1028)return r.RED;if(n===1029)return r.RED_INTEGER;if(n===1030)return r.RG;if(n===1031)return r.RG_INTEGER;if(n===1033)return r.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779)if(a===it)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===33776)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===33776)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===35840||n===35841||n===35842||n===35843)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===35840)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===36196||n===37492)return a===it?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===37496)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return s.COMPRESSED_R11_EAC;if(n===37489)return s.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return s.COMPRESSED_RG11_EAC;if(n===37491)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===37808)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===36492||n===36494||n===36495)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===36492)return a===it?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===36283||n===36284||n===36285||n===36286)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===36283)return s.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===1020?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:t}}const nm=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,im=`
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

}`;class sm{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new jo(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new zt({vertexShader:nm,fragmentShader:im,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new bt(new jn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class rm extends hi{constructor(e,t){super();const n=this;let i=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,g=null;const v=typeof XRWebGLBinding<"u",m=new sm,p={},x=t.getContextAttributes();let b=null,M=null;const E=[],A=[],_=new Ue;let T=null,F=null;const R=new Yt;R.viewport=new Ze;const D=new Yt;D.viewport=new Ze;const O=[R,D],V=new oh;let L=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let me=E[$];return me===void 0&&(me=new ur,E[$]=me),me.getTargetRaySpace()},this.getControllerGrip=function($){let me=E[$];return me===void 0&&(me=new ur,E[$]=me),me.getGripSpace()},this.getHand=function($){let me=E[$];return me===void 0&&(me=new ur,E[$]=me),me.getHandSpace()};function q($){const me=A.indexOf($.inputSource);if(me===-1)return;const Me=E[me];Me!==void 0&&(Me.update($.inputSource,$.frame,c||a),Me.dispatchEvent({type:$.type,data:$.inputSource}))}function G(){i.removeEventListener("select",q),i.removeEventListener("selectstart",q),i.removeEventListener("selectend",q),i.removeEventListener("squeeze",q),i.removeEventListener("squeezestart",q),i.removeEventListener("squeezeend",q),i.removeEventListener("end",G),i.removeEventListener("inputsourceschange",I);for(let $=0;$<E.length;$++){const me=A[$];me!==null&&(A[$]=null,E[$].disconnect(me))}L=null,W=null,m.reset();for(const $ in p)delete p[$];if(e.setRenderTarget(b),d=null,f=null,u=null,i=null,M=null,Le.stop(),n.isPresenting=!1,e.setPixelRatio(T),e.setSize(_.width,_.height,!1),F!==null){const $=F.camera;$.fov=F.fov,$.zoom=F.zoom,$.updateProjectionMatrix(),F=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){s=$,n.isPresenting===!0&&Ee("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&Ee("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(i,t)),u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function($){if(i=$,i!==null){if(b=e.getRenderTarget(),i.addEventListener("select",q),i.addEventListener("selectstart",q),i.addEventListener("selectend",q),i.addEventListener("squeeze",q),i.addEventListener("squeezestart",q),i.addEventListener("squeezeend",q),i.addEventListener("end",G),i.addEventListener("inputsourceschange",I),x.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(_),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let Me=null,we=null,pe=null;x.depth&&(pe=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Me=x.stencil?1027:1026,we=x.stencil?1020:1014);const De={colorFormat:t.RGBA8,depthFormat:pe,scaleFactor:s};u=this.getBinding(),f=u.createProjectionLayer(De),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),M=new on(f.textureWidth,f.textureHeight,{format:1023,type:1009,depthTexture:new Ii(f.textureWidth,f.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,Me),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}else{const Me={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(i,t,Me),i.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),M=new on(d.framebufferWidth,d.framebufferHeight,{format:1023,type:1009,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Le.setContext(i),Le.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function I($){for(let me=0;me<$.removed.length;me++){const Me=$.removed[me],we=A.indexOf(Me);we>=0&&(A[we]=null,E[we].disconnect(Me))}for(let me=0;me<$.added.length;me++){const Me=$.added[me];let we=A.indexOf(Me);if(we===-1){for(let De=0;De<E.length;De++)if(De>=A.length){A.push(Me),we=De;break}else if(A[De]===null){A[De]=Me,we=De;break}if(we===-1)break}const pe=E[we];pe&&pe.connect(Me)}}function U($,me){me===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(me.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(i===null)return;let me=$.near,Me=$.far;m.texture!==null&&(m.depthNear>0&&(me=m.depthNear),m.depthFar>0&&(Me=m.depthFar)),V.near=D.near=R.near=me,V.far=D.far=R.far=Me,(L!==V.near||W!==V.far)&&(i.updateRenderState({depthNear:V.near,depthFar:V.far}),L=V.near,W=V.far),V.layers.mask=$.layers.mask|6,R.layers.mask=V.layers.mask&-5,D.layers.mask=V.layers.mask&-3;const we=$.parent,pe=V.cameras;U(V,we);for(let De=0;De<pe.length;De++)U(pe[De],we);V.projectionMatrix.copy(R.projectionMatrix),V.projectionMatrixInverse.copy(R.projectionMatrixInverse),F===null&&$.isPerspectiveCamera&&(F={camera:$,fov:$.fov,zoom:$.zoom}),Y($,V,we)};function Y($,me,Me){Me===null?$.matrix.copy(me.matrixWorld):($.matrix.copy(Me.matrixWorld),$.matrix.invert(),$.matrix.multiply(me.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(me.projectionMatrix),$.projectionMatrixInverse.copy(me.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Di*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return V},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function($){l=$,f!==null&&(f.fixedFoveation=$),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=$)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(V)},this.getCameraTexture=function($){return p[$]};let te=null;function xe($,me){if(h=me.getViewerPose(c||a),g=me,h!==null){const Me=h.views;d!==null&&(e.setRenderTargetFramebuffer(M,d.framebuffer),e.setRenderTarget(M));let we=!1;Me.length!==V.cameras.length&&(V.cameras.length=0,we=!0);for(let Pe=0;Pe<Me.length;Pe++){const je=Me[Pe];let rt=null;if(d!==null)rt=d.getViewport(je);else{const It=u.getViewSubImage(f,je);rt=It.viewport,Pe===0&&(e.setRenderTargetTextures(M,It.colorTexture,It.depthStencilTexture),e.setRenderTarget(M))}let qe=O[Pe];qe===void 0&&(qe=new Yt,qe.layers.enable(Pe),qe.viewport=new Ze,O[Pe]=qe),qe.matrix.fromArray(je.transform.matrix),qe.matrix.decompose(qe.position,qe.quaternion,qe.scale),qe.projectionMatrix.fromArray(je.projectionMatrix),qe.projectionMatrixInverse.copy(qe.projectionMatrix).invert(),qe.viewport.set(rt.x,rt.y,rt.width,rt.height),Pe===0&&(V.matrix.copy(qe.matrix),V.matrix.decompose(V.position,V.quaternion,V.scale)),we===!0&&V.cameras.push(qe)}const pe=i.enabledFeatures;if(pe&&pe.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&v){u=n.getBinding();const Pe=u.getDepthInformation(Me[0]);Pe&&Pe.isValid&&Pe.texture&&m.init(Pe,i.renderState)}if(pe&&pe.includes("camera-access")&&v){e.state.unbindTexture(),u=n.getBinding();for(let Pe=0;Pe<Me.length;Pe++){const je=Me[Pe].camera;if(je){let rt=p[je];rt||(rt=new jo,p[je]=rt);const qe=u.getCameraImage(je);rt.sourceTexture=qe}}}}for(let Me=0;Me<E.length;Me++){const we=A[Me],pe=E[Me];we!==null&&pe!==void 0&&pe.update(we,me,c||a)}te&&te($,me),me.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:me}),g=null}const Le=new rl;Le.setAnimationLoop(xe),this.setAnimationLoop=function($){te=$},this.dispose=function(){}}}const am=new Oe,ml=new ze;ml.set(-1,0,0,0,1,0,0,0,1);function om(r,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,el(r)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,x,b,M){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?s(m,p):p.isMeshLambertMaterial?(s(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(s(m,p),u(m,p)):p.isMeshPhongMaterial?(s(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(s(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,M)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),v(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,x,b):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===1&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===1&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=e.get(p),b=x.envMap,M=x.envMapRotation;b&&(m.envMap.value=b,m.envMapRotation.value.setFromMatrix4(am.makeRotationFromEuler(M)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(ml),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,x,b){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=b*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,x){m.ior.value=p.ior,p.diffuseRoughness>0&&(m.diffuseRoughness.value=p.diffuseRoughness,p.diffuseRoughnessMap&&(m.diffuseRoughnessMap.value=p.diffuseRoughnessMap,t(p.diffuseRoughnessMap,m.diffuseRoughnessMapTransform))),p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===1&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessMinimum,m.iridescenceThicknessMaximum.value=p.iridescenceThicknessMaximum,p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const x=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function lm(r,e,t,n){let i={},s={};function a(x,b){const M=b.program;n.uniformBlockBinding(x,M,i[x.id])}function o(x,b){let M=i[x.id];M===void 0&&(g(x),M=l(x),i[x.id]=M,x.addEventListener("dispose",m));const E=b.program;n.updateUBOMapping(x,E);const A=e.render.frame;s[x.id]!==A&&(c(x),s[x.id]=A)}function l(x){const b=r.createBuffer(),M=x.__size,E=x.usage;return r.bindBuffer(r.UNIFORM_BUFFER,b),r.bufferData(r.UNIFORM_BUFFER,M,E),r.bindBuffer(r.UNIFORM_BUFFER,null),b}function c(x){const b=i[x.id],M=x.uniforms,E=x.__cache;r.bindBuffer(r.UNIFORM_BUFFER,b);for(let A=0,_=M.length;A<_;A++){const T=M[A];if(Array.isArray(T))for(let F=0,R=T.length;F<R;F++)h(T[F],A,F,E);else h(T,A,0,E)}r.bindBuffer(r.UNIFORM_BUFFER,null)}function h(x,b,M,E){if(f(x,b,M,E)===!0){const A=x.__offset,_=x.value;if(Array.isArray(_)){let T=0;for(let F=0;F<_.length;F++){const R=_[F],D=v(R,!0);u(R,x.__data,T),T+=D.storage/Float32Array.BYTES_PER_ELEMENT}}else u(_,x.__data,0);r.bufferSubData(r.UNIFORM_BUFFER,A,x.__data)}}function u(x,b,M){typeof x=="number"||typeof x=="boolean"?b[M]=x:x.isMatrix3?(b[M]=x.elements[0],b[M+1]=x.elements[1],b[M+2]=x.elements[2],b[M+3]=0,b[M+4]=x.elements[3],b[M+5]=x.elements[4],b[M+6]=x.elements[5],b[M+7]=0,b[M+8]=x.elements[6],b[M+9]=x.elements[7],b[M+10]=x.elements[8],b[M+11]=0):ArrayBuffer.isView(x)?b.set(x.subarray(0,b.length-M),M):x.toArray(b,M)}function f(x,b,M,E){const A=x.value,_=b+"_"+M;if(Array.isArray(A)){E[_]===void 0&&(E[_]=[]);const T=E[_];let F=!1;for(let R=0;R<A.length;R++)d(A[R],T,R)===!0&&(F=!0);return F}return d(A,E,_)}function d(x,b,M){if(b[M]===void 0)return typeof x=="number"||typeof x=="boolean"?b[M]=x:ArrayBuffer.isView(x)?b[M]=x.slice():b[M]=x.clone(),!0;{const E=b[M];if(typeof x=="number"||typeof x=="boolean"){if(E!==x)return b[M]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(E.equals(x)===!1)return E.copy(x),!0}}return!1}function g(x){const b=x.uniforms;let M=0;const E=16;for(let _=0,T=b.length;_<T;_++){const F=Array.isArray(b[_])?b[_]:[b[_]];for(let R=0,D=F.length;R<D;R++){const O=F[R],V=Array.isArray(O.value)?O.value:[O.value],L=Array.isArray(b[_])||Array.isArray(O.value);let W=M;for(let G=0,I=V.length;G<I;G++){const U=V[G],Y=v(U,L),te=M%E,xe=te%Y.boundary,Le=te+xe;M+=xe,Le!==0&&E-Le<Y.storage&&(M+=E-Le),G===0&&(W=M),M+=Y.storage}const q=O.type==="int"?Int32Array:O.type==="uint"?Uint32Array:Float32Array;O.__data=new q((M-W)/Float32Array.BYTES_PER_ELEMENT),O.__offset=W}}const A=M%E;return A>0&&(M+=E-A),x.__size=M,x.__cache={},this}function v(x,b){const M={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(M.boundary=4,M.storage=4):x.isVector2?(M.boundary=8,M.storage=8):x.isVector3||x.isColor?(M.boundary=16,M.storage=12):x.isVector4?(M.boundary=16,M.storage=16):x.isMatrix3?(M.boundary=16,M.storage=48):x.isMatrix4?(M.boundary=16,M.storage=64):x.isTexture?Ee("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(M.boundary=16,M.storage=x.byteLength):Ee("WebGLRenderer: Unsupported uniform value type.",x),b===!0&&(M.boundary=16,M.storage=Math.ceil(M.storage/16)*16),M}function m(x){const b=x.target;b.removeEventListener("dispose",m),r.deleteBuffer(i[b.id]),delete i[b.id],delete s[b.id]}function p(){for(const x in i)r.deleteBuffer(i[x]);i={},s={}}return{bind:a,update:o,dispose:p}}const cm=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Mn=null;function hm(){return Mn===null&&(Mn=new Ci(cm,16,16,1030,1016),Mn.name="DFG_LUT",Mn.minFilter=1006,Mn.magFilter=1006,Mn.wrapS=1001,Mn.wrapT=1001,Mn.generateMipmaps=!1,Mn.needsUpdate=!0),Mn}class um{constructor(e={}){const{canvas:t=Il(),context:n=null,depth:i=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1,outputBufferType:d=1009}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const v=d,m=new Set([1033,1031,1029]),p=new Set([1009,1014,1012,1020,1017,1018]),x=new Uint32Array(4),b=new Int32Array(4),M={textures:[],min:[],max:[],resolution:[]};let E=null,A=null;const _=[],T=[];let F=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const R=this;let D=!1,O=null,V=null,L=null,W=null;this._outputColorSpace=Pt;let q=0,G=0,I=null,U=-1,Y=null;const te=new Ze,xe=new Ze;let Le=null;const $=new Fe(0);let me=0,Me=t.width,we=t.height,pe=1,De=null,Je=null;const Pe=new Ze(0,0,Me,we),je=new Ze(0,0,Me,we);let rt=!1;const qe=new ss,It=new Jr;let vt=!1,Wt=!1;const ut=new Oe,vn=new B,At=new Ze,Jt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Qt=!1;function jt(){return I===null?pe:1}let N=n;function en(y,P){return t.getContext(y,P)}let ct,ht,de,xt,Ce,Ne,w,S,k,ie,ee,ae,ue,Z,J,le,C,Q,K,ce,re,oe,Ae;try{const y={alpha:!0,depth:i,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r187"),t.addEventListener("webglcontextlost",Re,!1),t.addEventListener("webglcontextrestored",ke,!1),t.addEventListener("webglcontextcreationerror",ge,!1),N===null){const P="webgl2";if(N=en(P,y),N===null)throw en(P)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ge()}catch(y){throw t.removeEventListener("webglcontextlost",Re,!1),t.removeEventListener("webglcontextrestored",ke,!1),t.removeEventListener("webglcontextcreationerror",ge,!1),Ie("WebGLRenderer: "+y.message),y}function Ge(){ct=new pd(N),ct.init(),re=new tm(N,ct),ht=new id(N,ct,e,re),de=new jp(N,ct),ht.reversedDepthBuffer&&f&&de.buffers.depth.setReversed(!0),V=N.createFramebuffer(),L=N.createFramebuffer(),W=N.createFramebuffer(),xt=new _d(N),Ce=new zp,Ne=new em(N,ct,de,Ce,ht,re,xt),w=new dd(R),S=new vh(N),oe=new td(N,S),k=new md(N,S,xt,oe),ie=new xd(N,k,S,oe,xt),Q=new vd(N,ht,Ne),J=new sd(Ce),ee=new Bp(R,w,ct,ht,oe,J),ae=new om(R,Ce),ue=new Gp,Z=new Yp(ct),C=new ed(R,w,de,ie,g,l),le=new Qp(R,ie,ht),Ae=new lm(N,xt,ht,de),K=new nd(N,ct,xt),ce=new gd(N,ct,xt),xt.programs=ee.programs,R.capabilities=ht,R.extensions=ct,R.properties=Ce,R.renderLists=ue,R.shadowMap=le,R.state=de,R.info=xt}v!==1009&&(F=new Sd(v,t.width,t.height,o,i,s));const se=new rm(R,N);this.xr=se,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const y=ct.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=ct.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return pe},this.setPixelRatio=function(y){y!==void 0&&(pe=y,this.setSize(Me,we,!1))},this.getSize=function(y){return y.set(Me,we)},this.setSize=function(y,P,X=!0){if(se.isPresenting){Ee("WebGLRenderer: Can't change size while VR device is presenting.");return}Me=y,we=P,t.width=Math.floor(y*pe),t.height=Math.floor(P*pe),X===!0&&(t.style.width=y+"px",t.style.height=P+"px"),F!==null&&F.setSize(t.width,t.height),this.setViewport(0,0,y,P)},this.getDrawingBufferSize=function(y){return y.set(Me*pe,we*pe).floor()},this.setDrawingBufferSize=function(y,P,X){Me=y,we=P,pe=X,t.width=Math.floor(y*X),t.height=Math.floor(P*X),this.setViewport(0,0,y,P)},this.setEffects=function(y){if(v===1009){Ie("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let P=0;P<y.length;P++)if(y[P].isOutputPass===!0){Ee("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}F.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(te)},this.getViewport=function(y){return y.copy(Pe)},this.setViewport=function(y,P,X,z){y.isVector4?Pe.set(y.x,y.y,y.z,y.w):Pe.set(y,P,X,z),de.viewport(te.copy(Pe).multiplyScalar(jt()).round())},this.getScissor=function(y){return y.copy(je)},this.setScissor=function(y,P,X,z){y.isVector4?je.set(y.x,y.y,y.z,y.w):je.set(y,P,X,z),de.scissor(xe.copy(je).multiplyScalar(jt()).round())},this.getScissorTest=function(){return rt},this.setScissorTest=function(y){de.setScissorTest(rt=y)},this.setOpaqueSort=function(y){De=y},this.setTransparentSort=function(y){Je=y},this.getClearColor=function(y){return y.copy(C.getClearColor())},this.setClearColor=function(){C.setClearColor(...arguments)},this.getClearAlpha=function(){return C.getClearAlpha()},this.setClearAlpha=function(){C.setClearAlpha(...arguments)},this.clear=function(y=!0,P=!0,X=!0){let z=0;if(y){let H=!1;if(I!==null){const fe=I.texture.format;H=m.has(fe)}if(H){const fe=I.texture.type,Se=p.has(fe),he=C.getClearColor(),ve=C.getClearAlpha(),Te=he.r,Be=he.g,Ye=he.b;Se?(x[0]=Te,x[1]=Be,x[2]=Ye,x[3]=ve,N.clearBufferuiv(N.COLOR,0,x)):(b[0]=Te,b[1]=Be,b[2]=Ye,b[3]=ve,N.clearBufferiv(N.COLOR,0,b))}else z|=N.COLOR_BUFFER_BIT}P&&(z|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(z|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z!==0&&N.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),O=y},this.dispose=function(){t.removeEventListener("webglcontextlost",Re,!1),t.removeEventListener("webglcontextrestored",ke,!1),t.removeEventListener("webglcontextcreationerror",ge,!1),C.dispose(),ue.dispose(),Z.dispose(),Ne.dispose(),Ce.dispose(),w.dispose(),ie.dispose(),k.dispose(),oe.dispose(),Ae.dispose(),ee.dispose(),se.dispose(),se.removeEventListener("sessionstart",ca),se.removeEventListener("sessionend",ha),ei.stop()};function Re(y){y.preventDefault(),Ys("WebGLRenderer: Context Lost."),D=!0}function ke(){Ys("WebGLRenderer: Context Restored."),D=!1;const y=xt.autoReset,P=le.enabled,X=le.autoUpdate,z=le.needsUpdate,H=le.type;Ge(),xt.autoReset=y,le.enabled=P,le.autoUpdate=X,le.needsUpdate=z,le.type=H}function ge(y){Ie("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function tt(y){const P=y.target;P.removeEventListener("dispose",tt),wt(P)}function wt(y){Gn(y),Ce.remove(y)}function Gn(y){const P=Ce.get(y).programs;P!==void 0&&(P.forEach(function(X){ee.releaseProgram(X)}),y.isShaderMaterial&&ee.releaseShaderCache(y))}this.renderBufferDirect=function(y,P,X,z,H,fe){P===null&&(P=Jt);const Se=H.isMesh&&H.matrixWorld.determinantAffine()<0,he=wl(y,P,X,z,H);de.setMaterial(z,Se);let ve=X.index,Te=1;if(z.wireframe===!0){if(ve=k.getWireframeAttribute(X),ve===void 0)return;Te=2}const Be=X.drawRange,Ye=X.attributes.position;let ye=Be.start*Te,Ke=(Be.start+Be.count)*Te;fe!==null&&(ye=Math.max(ye,fe.start*Te),Ke=Math.min(Ke,(fe.start+fe.count)*Te)),ve!==null?(ye=Math.max(ye,0),Ke=Math.min(Ke,ve.count)):Ye!=null&&(ye=Math.max(ye,0),Ke=Math.min(Ke,Ye.count));const gt=Ke-ye;if(gt<0||gt===1/0)return;oe.setup(H,z,he,X,ve);let lt,at=K;if(ve!==null&&(lt=S.get(ve),at=ce,at.setIndex(lt)),H.isMesh)z.wireframe===!0?(de.setLineWidth(z.wireframeLinewidth*jt()),at.setMode(N.LINES)):at.setMode(N.TRIANGLES);else if(H.isLine){let Nt=z.linewidth;Nt===void 0&&(Nt=1),de.setLineWidth(Nt*jt()),H.isLineSegments?at.setMode(N.LINES):H.isLineLoop?at.setMode(N.LINE_LOOP):at.setMode(N.LINE_STRIP)}else H.isPoints?at.setMode(N.POINTS):H.isSprite&&at.setMode(N.TRIANGLES);if(H.isBatchedMesh)if(ct.get("WEBGL_multi_draw"))at.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const Nt=H._multiDrawStarts,be=H._multiDrawCounts,kt=H._multiDrawCount,Qe=ve?S.get(ve).bytesPerElement:1,ti=Ce.get(z).currentProgram.getUniforms();for(let Ut=0;Ut<kt;Ut++)ti.setValue(N,"_gl_DrawID",Ut),at.render(Nt[Ut]/Qe,be[Ut])}else if(H.isInstancedMesh)at.renderInstances(ye,gt,H.count);else if(X.isInstancedBufferGeometry){const Nt=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,be=Math.min(X.instanceCount,Nt);at.renderInstances(ye,gt,be)}else at.render(ye,gt)};function la(y,P,X,z){O!==null&&y.isNodeMaterial&&O.setObject(z,y),vt===!0&&J.setState(y,X,!1),y.transparent===!0&&y.side===2&&y.forceSinglePass===!1?(y.side=1,y.needsUpdate=!0,ki(y,P,z),y.side=0,y.needsUpdate=!0,ki(y,P,z),y.side=2):ki(y,P,z)}this.compile=function(y,P,X=null){X===null&&(X=y),O!==null&&O.renderStart(y,P,X),A=Z.get(X),A.init(P),T.push(A),X.traverseVisible(function(H){H.isLight&&H.layers.test(P.layers)&&(A.pushLight(H),H.castShadow&&A.pushShadow(H))}),y!==X&&y.traverseVisible(function(H){H.isLight&&H.layers.test(P.layers)&&(A.pushLight(H),H.castShadow&&A.pushShadow(H))}),A.setupLights(),O!==null&&O.updateLights(A.state.lightsArray),Wt=this.localClippingEnabled,vt=J.init(this.clippingPlanes,Wt),vt===!0&&J.setGlobalState(this.clippingPlanes,P),O!==null&&le.render(A.state.shadowsArray,X,P);const z=new Set;return y.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const fe=H.material;if(fe)if(Array.isArray(fe))for(let Se=0;Se<fe.length;Se++){const he=fe[Se];la(he,X,P,H),z.add(he)}else la(fe,X,P,H),z.add(fe)}),A=T.pop(),O!==null&&O.renderEnd(),z},this.compileAsync=function(y,P,X=null){const z=this.compile(y,P,X);return new Promise(H=>{function fe(){if(z.forEach(function(Se){const ve=Ce.get(Se).currentProgram;(ve===void 0||ve.isReady())&&z.delete(Se)}),z.size===0){H(y);return}setTimeout(fe,10)}ct.get("KHR_parallel_shader_compile")!==null?fe():setTimeout(fe,10)})};let sr=null;function El(y){sr&&sr(y)}function ca(){ei.stop()}function ha(){ei.start()}const ei=new rl;ei.setAnimationLoop(El),typeof self<"u"&&ei.setContext(self),this.setAnimationLoop=function(y){sr=y,se.setAnimationLoop(y),y===null?ei.stop():ei.start()},se.addEventListener("sessionstart",ca),se.addEventListener("sessionend",ha),this.render=function(y,P){if(P!==void 0&&P.isCamera!==!0){Ie("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;O!==null&&O.renderStart(y,P);const X=se.enabled===!0&&se.isPresenting===!0,z=F!==null&&(I===null||X)&&F.begin(R,I);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),P.parent===null&&P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),se.enabled===!0&&se.isPresenting===!0&&(F===null||F.isCompositing()===!1)&&(se.cameraAutoUpdate===!0&&se.updateCamera(P),P=se.getCamera()),y.isScene===!0&&y.onBeforeRender(R,y,P,I),A=Z.get(y,T.length),A.init(P),A.state.textureUnits=Ne.getTextureUnits(),T.push(A),ut.multiplyMatrices(P.projectionMatrix,P.matrixWorldInverse),P.isArrayCamera?It.setFromArrayCamera(P):qe.setFromProjectionMatrix(ut,2e3,P.reversedDepth),Wt=this.localClippingEnabled,vt=J.init(this.clippingPlanes,Wt),E=ue.get(y,_.length),E.init(),_.push(E),this.info.render.frame++,se.enabled===!0&&se.isPresenting===!0){const Se=R.xr.getDepthSensingMesh();Se!==null&&rr(Se,P,-1/0,R.sortObjects)}rr(y,P,0,R.sortObjects),E.finish(),O!==null&&O.updateLights(A.state.lightsArray),R.sortObjects===!0&&E.sort(De,Je),Qt=se.enabled===!1||se.isPresenting===!1||se.hasDepthSensing()===!1,Qt&&C.addToRenderList(E,y),this.info.autoReset===!0&&this.info.reset(),vt===!0&&J.beginShadows();const H=A.state.shadowsArray;if(le.render(H,y,P),vt===!0&&J.endShadows(),(z&&F.hasRenderPass())===!1){const Se=E.opaque,he=E.transmissive;if(A.setupLights(),P.isArrayCamera){const ve=P.cameras;if(he.length>0)for(let Te=0,Be=ve.length;Te<Be;Te++){const Ye=ve[Te];fa(Se,he,y,Ye)}Qt&&C.render(y);for(let Te=0,Be=ve.length;Te<Be;Te++){const Ye=ve[Te];ua(E,y,Ye,Ye.viewport)}}else he.length>0&&fa(Se,he,y,P),Qt&&C.render(y),ua(E,y,P)}I!==null&&G===0&&(Ne.updateMultisampleRenderTarget(I),Ne.updateRenderTargetMipmap(I)),z&&F.end(R),y.isScene===!0&&y.onAfterRender(R,y,P),oe.resetDefaultState(),U=-1,Y=null,T.pop(),T.length>0?(A=T[T.length-1],Ne.setTextureUnits(A.state.textureUnits),vt===!0&&J.setGlobalState(R.clippingPlanes,A.state.camera)):A=null,_.pop(),_.length>0?E=_[_.length-1]:E=null,O!==null&&O.renderEnd()};function rr(y,P,X,z){if(y.visible===!1)return;if(y.layers.test(P.layers)){if(y.isGroup)X=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(P);else if(y.isLight)A.pushLight(y),y.castShadow&&A.pushShadow(y);else if(y.isSprite){const Se=P.isArrayCamera?It:qe;if(!y.frustumCulled||y.intersectsFrustum(Se)){z&&At.setFromMatrixPosition(y.matrixWorld).applyMatrix4(ut);const he=ie.update(y),ve=y.material;ve.visible&&E.push(y,he,ve,X,At.z,null,P)}}else if(y.isMesh||y.isLine||y.isPoints){const Se=P.isArrayCamera?It:qe;if(!y.frustumCulled||y.intersectsFrustum(Se)){const he=ie.update(y),ve=y.material;if(z&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),At.copy(y.boundingSphere.center)):(he.boundingSphere===null&&he.computeBoundingSphere(),At.copy(he.boundingSphere.center)),At.applyMatrix4(y.matrixWorld).applyMatrix4(ut)),Array.isArray(ve)){const Te=he.groups;for(let Be=0,Ye=Te.length;Be<Ye;Be++){const ye=Te[Be],Ke=ve[ye.materialIndex];Ke&&Ke.visible&&E.push(y,he,Ke,X,At.z,ye,P)}}else ve.visible&&E.push(y,he,ve,X,At.z,null,P)}}}const fe=y.children;for(let Se=0,he=fe.length;Se<he;Se++)rr(fe[Se],P,X,z)}function ua(y,P,X,z){const{opaque:H,transmissive:fe,transparent:Se}=y;A.setupLightsView(X),vt===!0&&J.setGlobalState(R.clippingPlanes,X),z&&de.viewport(te.copy(z)),H.length>0&&hs(H,P,X),fe.length>0&&hs(fe,P,X),Se.length>0&&hs(Se,P,X),de.buffers.depth.setTest(!0),de.buffers.depth.setMask(!0),de.buffers.color.setMask(!0),de.setPolygonOffset(!1)}function fa(y,P,X,z){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(A.state.transmissionRenderTarget[z.id]===void 0){const ye=ct.has("EXT_color_buffer_half_float")||ct.has("EXT_color_buffer_float");A.state.transmissionRenderTarget[z.id]=new on(1,1,{generateMipmaps:!0,type:ye?1016:1009,minFilter:1008,samples:Math.max(4,ht.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Xe.workingColorSpace})}const fe=A.state.transmissionRenderTarget[z.id],Se=z.viewport||te;fe.setSize(Se.z*R.transmissionResolutionScale,Se.w*R.transmissionResolutionScale);const he=R.getRenderTarget(),ve=R.getActiveCubeFace(),Te=R.getActiveMipmapLevel();R.setRenderTarget(fe),R.getClearColor($),me=R.getClearAlpha(),me<1&&R.setClearColor(16777215,.5),R.clear(),Qt&&C.render(X);const Be=R.toneMapping;R.toneMapping=0;const Ye=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),A.setupLightsView(z),vt===!0&&J.setGlobalState(R.clippingPlanes,z),hs(y,X,z),Ne.updateMultisampleRenderTarget(fe),Ne.updateRenderTargetMipmap(fe),ct.has("WEBGL_multisampled_render_to_texture")===!1){let ye=!1;for(let Ke=0,gt=P.length;Ke<gt;Ke++){const lt=P[Ke],{object:at,geometry:Nt,material:be,group:kt}=lt;if(be.side===2&&at.layers.test(z.layers)){const Qe=be.side;be.side=1,be.needsUpdate=!0,da(at,X,z,Nt,be,kt),be.side=Qe,be.needsUpdate=!0,ye=!0}}ye===!0&&(Ne.updateMultisampleRenderTarget(fe),Ne.updateRenderTargetMipmap(fe))}R.setRenderTarget(he,ve,Te),R.setClearColor($,me),Ye!==void 0&&(z.viewport=Ye),R.toneMapping=Be}function hs(y,P,X){const z=P.isScene===!0?P.overrideMaterial:null;for(let H=0,fe=y.length;H<fe;H++){const Se=y[H],{object:he,geometry:ve,group:Te}=Se;let Be=Se.material;Be.allowOverride===!0&&z!==null&&(Be=z),he.layers.test(X.layers)&&da(he,P,X,ve,Be,Te)}}function da(y,P,X,z,H,fe){O!==null&&H.isNodeMaterial&&O.setObject(y,H),y.onBeforeRender(R,P,X,z,H,fe),y.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),H.onBeforeRender(R,P,X,z,y,fe),H.transparent===!0&&H.side===2&&H.forceSinglePass===!1?(H.side=1,H.needsUpdate=!0,R.renderBufferDirect(X,P,z,H,y,fe),H.side=0,H.needsUpdate=!0,R.renderBufferDirect(X,P,z,H,y,fe),H.side=2):R.renderBufferDirect(X,P,z,H,y,fe),y.onAfterRender(R,P,X,z,H,fe)}function pa(y){let P=0;for(const X of y)X.texture!==null&&P++;return P}function ki(y,P,X){P.isScene!==!0&&(P=Jt);const z=Ce.get(y),H=A.state.lights,fe=A.state.shadowsArray,Se=H.state.version,he=ee.getParameters(y,H.state,fe,P,X,A.state.lightProbeGridArray),ve=ee.getProgramCacheKey(he);let Te=z.programs;z.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?P.environment:null,z.fog=P.fog;const Be=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;z.envMap=w.get(y.envMap||z.environment,Be),z.envMapRotation=z.environment!==null&&y.envMap===null?P.environmentRotation:y.envMapRotation,Te===void 0&&(y.addEventListener("dispose",tt),Te=new Map,z.programs=Te,z.programVariants=new Map);let Ye=Te.get(ve);if(Ye!==void 0){if(z.currentProgram===Ye&&z.lightsStateVersion===Se)return ga(y,he),Ye}else he.uniforms=ee.getUniforms(y),O!==null&&y.isNodeMaterial&&O.build(y,X,he),y.onBeforeCompile(he,R),Ye=ee.acquireProgram(he,ve),Te.set(ve,Ye),z.uniforms=he.uniforms;const ye=z.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(ye.clippingPlanes=J.uniform),ga(y,he),z.needsLights=Cl(y),z.lightsStateVersion=Se,z.needsLights&&(ye.ambientLightColor.value=H.state.ambient,ye.lightProbe.value=H.state.probe,ye.sunLights.value=H.state.sun,ye.sunLightShadows.value=H.state.sunShadow,ye.directionalLights.value=H.state.directional,ye.directionalLightShadows.value=H.state.directionalShadow,ye.spotLights.value=H.state.spot,ye.spotLightShadows.value=H.state.spotShadow,ye.rectAreaLights.value=H.state.rectArea,ye.ltc_1.value=H.state.rectAreaLTC1,ye.ltc_2.value=H.state.rectAreaLTC2,ye.pointLights.value=H.state.point,ye.pointLightShadows.value=H.state.pointShadow,ye.hemisphereLights.value=H.state.hemi,ye.sunShadowMatrix.value=H.state.sunShadowMatrix,ye.sunShadowCascade.value=H.state.sunShadowCascade,ye.directionalShadowMatrix.value=H.state.directionalShadowMatrix,ye.spotLightMatrix.value=H.state.spotLightMatrix,ye.spotLightMap.value=H.state.spotLightMap,ye.pointShadowMatrix.value=H.state.pointShadowMatrix),z.numLightProbeGrids=pa(A.state.lightProbeGridArray),z.currentProgram=Ye,z.uniformsList=null,Ye}function Al(y,P,X,z,H){const fe=Ce.get(y),Se=fe.currentProgram.id+","+z+","+H;let he=fe.programVariants.get(Se);return he===void 0?(he=ki(y,P,X),fe.programVariants.set(Se,he)):(fe.currentProgram=he,fe.uniformsList=null,fe.outputColorSpace=z,fe.toneMapping=H),he}function ma(y){if(y.uniformsList===null){const P=y.currentProgram.getUniforms();y.uniformsList=Ws.seqWithValue(P.seq,y.uniforms)}return y.uniformsList}function ga(y,P){const X=Ce.get(y);X.outputColorSpace=P.outputColorSpace,X.batching=P.batching,X.batchingColor=P.batchingColor,X.instancing=P.instancing,X.instancingColor=P.instancingColor,X.instancingMorph=P.instancingMorph,X.skinning=P.skinning,X.morphTargets=P.morphTargets,X.morphNormals=P.morphNormals,X.morphColors=P.morphColors,X.morphTargetsCount=P.morphTargetsCount,X.numClippingPlanes=P.numClippingPlanes,X.numIntersection=P.numClipIntersection,X.vertexAlphas=P.vertexAlphas,X.vertexTangents=P.vertexTangents,X.toneMapping=P.toneMapping}function wl(y,P,X,z,H){P.isScene!==!0&&(P=Jt),Ne.resetTextureUnits();const fe=P.fog,Se=z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial?P.environment:null,he=I===null?R.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:Xe.workingColorSpace,ve=z.isMeshStandardMaterial||z.isMeshLambertMaterial&&!z.envMap||z.isMeshPhongMaterial&&!z.envMap,Te=w.get(z.envMap||Se,ve),Be=z.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Ye=!!X.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),ye=!!X.morphAttributes.position,Ke=!!X.morphAttributes.normal,gt=!!X.morphAttributes.color;let lt=0;z.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(lt=R.toneMapping);const at=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Nt=at!==void 0?at.length:0,be=Ce.get(z),kt=A.state.lights;if(vt===!0&&(Wt===!0||y!==Y)){const ft=y===Y&&z.id===U;J.setState(z,y,ft)}let Qe=!1,ti=!1;z.version===be.__version?be.needsLights&&be.lightsStateVersion!==kt.state.version||H.isBatchedMesh&&be.batching===!1||!H.isBatchedMesh&&be.batching===!0||H.isBatchedMesh&&be.batchingColor===!0&&H._colorsTexture===null||H.isBatchedMesh&&be.batchingColor===!1&&H._colorsTexture!==null||H.isInstancedMesh&&be.instancing===!1||!H.isInstancedMesh&&be.instancing===!0||H.isSkinnedMesh&&be.skinning===!1||!H.isSkinnedMesh&&be.skinning===!0||H.isInstancedMesh&&be.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&be.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&be.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&be.instancingMorph===!1&&H.morphTexture!==null||be.envMap!==Te||z.fog===!0&&be.fog!==fe||be.numClippingPlanes!==void 0&&(be.numClippingPlanes!==J.numPlanes||be.numIntersection!==J.numIntersection)||be.vertexAlphas!==Be||be.vertexTangents!==Ye||be.morphTargets!==ye||be.morphNormals!==Ke||be.morphColors!==gt||be.morphTargetsCount!==Nt||be.numLightProbeGrids!==pa(A.state.lightProbeGridArray)?Qe=!0:(be.outputColorSpace!==he||be.toneMapping!==lt)&&(ti=!0):(Qe=!0,be.__version=z.version);let Ut=be.currentProgram;(Qe===!0||ti===!0)&&(Ut=ti===!0?Al(z,P,H,he,lt):ki(z,P,H),O&&z.isNodeMaterial&&O.onUpdateProgram(z,Ut,be));let us=!1,Hn=!1,ni=!1;const $e=Ut.getUniforms(),Ft=be.uniforms;if(de.useProgram(Ut.program)&&(us=!0,Hn=!0,ni=!0),z.id!==U&&(U=z.id,Hn=!0),us||Y!==y){de.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),$e.setValue(N,"projectionMatrix",y.projectionMatrix),$e.setValue(N,"viewMatrix",y.matrixWorldInverse);const Rt=$e.map.cameraPosition;Rt!==void 0&&Rt.setValue(N,vn.setFromMatrixPosition(y.matrixWorld)),ht.logarithmicDepthBuffer&&$e.setValue(N,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&$e.setValue(N,"isOrthographic",y.isOrthographicCamera===!0),Y!==y&&(Y=y,Hn=!0,ni=!0)}if(be.needsLights&&(kt.state.sunShadowMap.length>0&&$e.setValue(N,"sunShadowMap",kt.state.sunShadowMap,Ne),kt.state.directionalShadowMap.length>0&&$e.setValue(N,"directionalShadowMap",kt.state.directionalShadowMap,Ne),kt.state.spotShadowMap.length>0&&$e.setValue(N,"spotShadowMap",kt.state.spotShadowMap,Ne),kt.state.pointShadowMap.length>0&&$e.setValue(N,"pointShadowMap",kt.state.pointShadowMap,Ne)),H.isSkinnedMesh){$e.setOptional(N,H,"bindMatrix"),$e.setOptional(N,H,"bindMatrixInverse");const ft=H.skeleton;ft&&(ft.boneTexture===null&&ft.computeBoneTexture(),$e.setValue(N,"boneTexture",ft.boneTexture,Ne))}H.isBatchedMesh&&($e.setOptional(N,H,"batchingTexture"),$e.setValue(N,"batchingTexture",H._matricesTexture,Ne),$e.setOptional(N,H,"batchingIdTexture"),$e.setValue(N,"batchingIdTexture",H._indirectTexture,Ne),$e.setOptional(N,H,"batchingColorTexture"),H._colorsTexture!==null&&$e.setValue(N,"batchingColorTexture",H._colorsTexture,Ne));const cn=X.morphAttributes;if((cn.position!==void 0||cn.normal!==void 0||cn.color!==void 0)&&Q.update(H,X,Ut),(Hn||be.receiveShadow!==H.receiveShadow)&&(be.receiveShadow=H.receiveShadow,$e.setValue(N,"receiveShadow",H.receiveShadow)),(z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial)&&z.envMap===null&&P.environment!==null&&(Ft.envMapIntensity.value=P.environmentIntensity),Ft.dfgLUT!==void 0&&(Ft.dfgLUT.value=hm()),Hn){if($e.setValue(N,"toneMappingExposure",R.toneMappingExposure),be.needsLights&&Rl(Ft,ni),fe&&z.fog===!0&&ae.refreshFogUniforms(Ft,fe),ae.refreshMaterialUniforms(Ft,z,pe,we,A.state.transmissionRenderTarget[y.id]),be.needsLights&&be.numLightProbeGrids>0){const ft=M;let Rt=0;for(const An of A.state.lightProbeGridArray)An.texture!==null&&(ft.textures[Rt]=An.texture,ft.min[Rt]=An.boundingBox.min,ft.max[Rt]=An.boundingBox.max,ft.resolution[Rt]=An.resolution,Rt++);for(const An in ft)ft[An].length=Rt;Ft.probesSH.value=ft.textures,Ft.probesMin.value=ft.min,Ft.probesMax.value=ft.max,Ft.probesResolution.value=ft.resolution}Ws.upload(N,ma(be),Ft,Ne)}if(z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(Ws.upload(N,ma(be),Ft,Ne),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&$e.setValue(N,"center",H.center),$e.setValue(N,"modelViewMatrix",H.modelViewMatrix),$e.setValue(N,"normalMatrix",H.normalMatrix),$e.setValue(N,"modelMatrix",H.matrixWorld),z.uniformsGroups!==void 0){const ft=z.uniformsGroups;for(let Rt=0,An=ft.length;Rt<An;Rt++){const va=ft[Rt];Ae.update(va,Ut),Ae.bind(va,Ut)}}return Ut}function Rl(y,P){y.ambientLightColor.needsUpdate=P,y.lightProbe.needsUpdate=P,y.sunLights.needsUpdate=P,y.sunLightShadows.needsUpdate=P,y.directionalLights.needsUpdate=P,y.directionalLightShadows.needsUpdate=P,y.pointLights.needsUpdate=P,y.pointLightShadows.needsUpdate=P,y.spotLights.needsUpdate=P,y.spotLightShadows.needsUpdate=P,y.rectAreaLights.needsUpdate=P,y.hemisphereLights.needsUpdate=P}function Cl(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return q},this.getActiveMipmapLevel=function(){return G},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(y,P,X){const z=Ce.get(y);z.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),Ce.get(y.texture).__webglTexture=P,Ce.get(y.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:X,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,P){const X=Ce.get(y);X.__webglFramebuffer=P,X.__useDefaultFramebuffer=P===void 0},this.setRenderTarget=function(y,P=0,X=0){I=y,q=P,G=X;let z=null,H=!1,fe=!1;if(y){const he=Ce.get(y);if(he.__useDefaultFramebuffer!==void 0){de.bindFramebuffer(N.FRAMEBUFFER,he.__webglFramebuffer),te.copy(y.viewport),xe.copy(y.scissor),Le=y.scissorTest,de.viewport(te),de.scissor(xe),de.setScissorTest(Le),U=-1;return}else if(he.__webglFramebuffer===void 0)Ne.setupRenderTarget(y);else if(he.__hasExternalTextures)Ne.rebindTextures(y,Ce.get(y.texture).__webglTexture,Ce.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const Be=y.depthTexture;if(he.__boundDepthTexture!==Be){if(Be!==null&&Ce.has(Be)&&(y.width!==Be.image.width||y.height!==Be.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Ne.setupDepthRenderbuffer(y)}}const ve=y.texture;(ve.isData3DTexture||ve.isDataArrayTexture||ve.isCompressedArrayTexture)&&(fe=!0);const Te=Ce.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Te[P])?z=Te[P][X]:z=Te[P],H=!0):y.samples>0&&Ne.useMultisampledRTT(y)===!1?z=Ce.get(y).__webglMultisampledFramebuffer:Array.isArray(Te)?z=Te[X]:z=Te,te.copy(y.viewport),xe.copy(y.scissor),Le=y.scissorTest}else te.copy(Pe).multiplyScalar(pe).floor(),xe.copy(je).multiplyScalar(pe).floor(),Le=rt;if(X!==0&&(z=V),de.bindFramebuffer(N.FRAMEBUFFER,z)&&de.drawBuffers(y,z),de.viewport(te),de.scissor(xe),de.setScissorTest(Le),H){const he=Ce.get(y.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+P,he.__webglTexture,X)}else if(fe){const he=P;for(let ve=0;ve<y.textures.length;ve++){const Te=Ce.get(y.textures[ve]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+ve,Te.__webglTexture,X,he)}}else if(y!==null&&X!==0){const he=Ce.get(y.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,he.__webglTexture,X)}U=-1};function _a(y){const P=Ce.get(y);return(P.__readFormat!==y.format||P.__readType!==y.type)&&(P.__readFormat=y.format,P.__readType=y.type,P.__formatReadable=ht.textureFormatReadable(y.format),P.__typeReadable=ht.textureTypeReadable(y.type)),P}this.readRenderTargetPixels=function(y,P,X,z,H,fe,Se,he=0){if(!(y&&y.isWebGLRenderTarget)){Ie("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ve=Ce.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Se!==void 0&&(ve=ve[Se],Array.isArray(ve)&&(ve=ve[0])),ve){de.bindFramebuffer(N.FRAMEBUFFER,ve);try{const Te=y.textures[he],Be=Te.format,Ye=Te.type;y.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+he);const ye=_a(Te);if(ye.__formatReadable===!1){Ie("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(ye.__typeReadable===!1){Ie("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}P>=0&&P<=y.width-z&&X>=0&&X<=y.height-H&&N.readPixels(P,X,z,H,re.convert(Be),re.convert(Ye),fe)}finally{const Te=I!==null?Ce.get(I).__webglFramebuffer:null;de.bindFramebuffer(N.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(y,P,X,z,H,fe,Se,he=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ve=Ce.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Se!==void 0&&(ve=ve[Se],Array.isArray(ve)&&(ve=ve[0])),ve)if(P>=0&&P<=y.width-z&&X>=0&&X<=y.height-H){de.bindFramebuffer(N.FRAMEBUFFER,ve);const Te=y.textures[he],Be=Te.format,Ye=Te.type;y.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+he);const ye=_a(Te);if(ye.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(ye.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ke=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Ke),N.bufferData(N.PIXEL_PACK_BUFFER,fe.byteLength,N.STREAM_READ),N.readPixels(P,X,z,H,re.convert(Be),re.convert(Ye),0),N.bindBuffer(N.PIXEL_PACK_BUFFER,null);const gt=I!==null?Ce.get(I).__webglFramebuffer:null;de.bindFramebuffer(N.FRAMEBUFFER,gt);const lt=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Fl(N,lt,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Ke),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,fe),N.bindBuffer(N.PIXEL_PACK_BUFFER,null),N.deleteBuffer(Ke),N.deleteSync(lt),fe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,P=null,X=0){const z=Math.pow(2,-X),H=Math.floor(y.image.width*z),fe=Math.floor(y.image.height*z),Se=P!==null?P.x:0,he=P!==null?P.y:0;Ne.setTexture2D(y,0),N.copyTexSubImage2D(N.TEXTURE_2D,X,0,0,Se,he,H,fe),de.unbindTexture()},this.copyTextureToTexture=function(y,P,X=null,z=null,H=0,fe=0){let Se,he,ve,Te,Be,Ye,ye,Ke,gt;const lt=y.isCompressedTexture?y.mipmaps[fe]:y.image;if(X!==null)Se=X.max.x-X.min.x,he=X.max.y-X.min.y,ve=X.isBox3?X.max.z-X.min.z:1,Te=X.min.x,Be=X.min.y,Ye=X.isBox3?X.min.z:0;else{const $e=Math.pow(2,-H);Se=Math.floor(lt.width*$e),he=Math.floor(lt.height*$e),y.isDataArrayTexture?ve=lt.depth:y.isData3DTexture?ve=Math.floor(lt.depth*$e):ve=1,Te=0,Be=0,Ye=0}z!==null?(ye=z.x,Ke=z.y,gt=z.z):(ye=0,Ke=0,gt=0);const at=re.convert(P.format),Nt=re.convert(P.type);let be;P.isData3DTexture?(Ne.setTexture3D(P,0),be=N.TEXTURE_3D):P.isDataArrayTexture||P.isCompressedArrayTexture?(Ne.setTexture2DArray(P,0),be=N.TEXTURE_2D_ARRAY):(Ne.setTexture2D(P,0),be=N.TEXTURE_2D),de.activeTexture(N.TEXTURE0),de.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,P.flipY),de.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),de.pixelStorei(N.UNPACK_ALIGNMENT,P.unpackAlignment);const kt=de.getParameter(N.UNPACK_ROW_LENGTH),Qe=de.getParameter(N.UNPACK_IMAGE_HEIGHT),ti=de.getParameter(N.UNPACK_SKIP_PIXELS),Ut=de.getParameter(N.UNPACK_SKIP_ROWS),us=de.getParameter(N.UNPACK_SKIP_IMAGES);de.pixelStorei(N.UNPACK_ROW_LENGTH,lt.width),de.pixelStorei(N.UNPACK_IMAGE_HEIGHT,lt.height),de.pixelStorei(N.UNPACK_SKIP_PIXELS,Te),de.pixelStorei(N.UNPACK_SKIP_ROWS,Be),de.pixelStorei(N.UNPACK_SKIP_IMAGES,Ye);const Hn=y.isDataArrayTexture||y.isData3DTexture,ni=P.isDataArrayTexture||P.isData3DTexture;if(y.isDepthTexture){const $e=Ce.get(y),Ft=Ce.get(P),cn=Ce.get($e.__renderTarget),ft=Ce.get(Ft.__renderTarget);de.bindFramebuffer(N.READ_FRAMEBUFFER,cn.__webglFramebuffer),de.bindFramebuffer(N.DRAW_FRAMEBUFFER,ft.__webglFramebuffer);for(let Rt=0;Rt<ve;Rt++)Hn&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ce.get(y).__webglTexture,H,Ye+Rt),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ce.get(P).__webglTexture,fe,gt+Rt)),N.blitFramebuffer(Te,Be,Te+Se,Be+he,ye,Ke,ye+Se,Ke+he,N.DEPTH_BUFFER_BIT,N.NEAREST);de.bindFramebuffer(N.READ_FRAMEBUFFER,null),de.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(H!==0||y.isRenderTargetTexture||Ce.has(y)){const $e=Ce.get(y),Ft=Ce.get(P);de.bindFramebuffer(N.READ_FRAMEBUFFER,L),de.bindFramebuffer(N.DRAW_FRAMEBUFFER,W);for(let cn=0;cn<ve;cn++)Hn?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,$e.__webglTexture,H,Ye+cn):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,$e.__webglTexture,H),ni?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ft.__webglTexture,fe,gt+cn):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Ft.__webglTexture,fe),H!==0?N.blitFramebuffer(Te,Be,Te+Se,Be+he,ye,Ke,ye+Se,Ke+he,N.COLOR_BUFFER_BIT,N.NEAREST):ni?N.copyTexSubImage3D(be,fe,ye,Ke,gt+cn,Te,Be,Se,he):N.copyTexSubImage2D(be,fe,ye,Ke,Te,Be,Se,he);de.bindFramebuffer(N.READ_FRAMEBUFFER,null),de.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else ni?y.isDataTexture||y.isData3DTexture?N.texSubImage3D(be,fe,ye,Ke,gt,Se,he,ve,at,Nt,lt.data):P.isCompressedArrayTexture?N.compressedTexSubImage3D(be,fe,ye,Ke,gt,Se,he,ve,at,lt.data):N.texSubImage3D(be,fe,ye,Ke,gt,Se,he,ve,at,Nt,lt):y.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,fe,ye,Ke,Se,he,at,Nt,lt.data):y.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,fe,ye,Ke,lt.width,lt.height,at,lt.data):N.texSubImage2D(N.TEXTURE_2D,fe,ye,Ke,Se,he,at,Nt,lt);de.pixelStorei(N.UNPACK_ROW_LENGTH,kt),de.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Qe),de.pixelStorei(N.UNPACK_SKIP_PIXELS,ti),de.pixelStorei(N.UNPACK_SKIP_ROWS,Ut),de.pixelStorei(N.UNPACK_SKIP_IMAGES,us),fe===0&&P.generateMipmaps===!0&&P.mipmapsAutoUpdate===!0&&N.generateMipmap(be),de.unbindTexture()},this.initRenderTarget=function(y){Ce.get(y).__webglFramebuffer===void 0&&Ne.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?Ne.setTextureCube(y,0):y.isData3DTexture?Ne.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?Ne.setTexture2DArray(y,0):Ne.setTexture2D(y,0),de.unbindTexture()},this.resetState=function(){q=0,G=0,I=null,de.reset(),oe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return 2e3}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Xe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Xe._getUnpackColorSpace()}}const ne=1.2192,Mt=2.6,li=.118,fm=2.083,gl=.34,St=12,et=22,In=0,Dt=1,rn=2,Li=3;class dm{seed;ovE=new Map;ovS=new Set;ep=new Map;ovDyn=new Set;ovDead=new Set;ov;constructor(e){this.ov=e,this.seed=e.seed|0,this.setOverrides(e)}setOverrides(e){this.ov=e,this.ovE.clear(),this.ovS.clear(),this.ep.clear(),this.ovDyn.clear(),this.ovDead.clear();for(const[t,n]of e.dyn||[])this.ovDyn.add(t+","+n);for(const[t,n]of e.dead||[])this.ovDead.add(t+","+n);for(const[t,n,i,s]of e.edges)this.ovE.set(t+","+n+","+i,s);for(const[t,n]of e.solid)this.ovS.add(t+","+n);for(const[t,n,i]of e.epochs)this.ep.set(t+","+n,i)}h(e,t,n){let i=Math.imul(e|0,374761393)^Math.imul(t|0,668265263)^Math.imul(n+this.seed|0,1274126177);return i=Math.imul(i^i>>>13,1274126177),i^=i>>>16,i=Math.imul(i,2246822519),i^=i>>>13,(i>>>0)/4294967296}he(e,t,n){const i=this.ep.size&&this.ep.get(Math.floor(e/St)+","+Math.floor(t/St))||0;return this.h(e,t,n+i*7919)}noise(e,t,n,i){const s=e/n,a=t/n,o=Math.floor(s),l=Math.floor(a);let c=s-o,h=a-l;c=c*c*(3-2*c),h=h*h*(3-2*h);const u=this.h(o,l,i),f=this.h(o+1,l,i),d=this.h(o,l+1,i),g=this.h(o+1,l+1,i);return u+(f-u)*c+(d-u)*h+(u-f-d+g)*c*h}busy(e,t){return this.noise(e,t,17,11)*.7+this.noise(e,t,7,12)*.3}feat(e,t){const n=this.he(e*et+3,t*et+3,40);if(n<.34){const i=5+Math.floor(this.he(e*et+3,t*et+3,41)*8),s=4+Math.floor(this.he(e*et+3,t*et+3,42)*7),a=e*et+2+Math.floor(this.he(e*et+3,t*et+3,43)*(et-i-3)),o=t*et+2+Math.floor(this.he(e*et+3,t*et+3,44)*(et-s-3));return{kind:1,x:a,z:o,w:i,d:s}}if(n<.62){const i=this.he(e*et+3,t*et+3,45)<.5?0:1,s=this.he(e*et+3,t*et+3,46)<.6?1:2,a=10+Math.floor(this.he(e*et+3,t*et+3,47)*9),o=i?s:a,l=i?a:s,c=e*et+1+Math.floor(this.he(e*et+3,t*et+3,48)*(et-o-2)),h=t*et+1+Math.floor(this.he(e*et+3,t*et+3,49)*(et-l-2));return{kind:2,x:c,z:h,w:o,d:l}}return null}fc=new Map;featAt(e,t){const n=Math.floor(e/et),i=Math.floor(t/et),s=n+","+i;let a=this.fc.get(s);return a===void 0&&(a=this.feat(n,i),this.fc.set(s,a),this.fc.size>400&&this.fc.clear()),a}edge(e,t,n){if(this.ovE.size){const o=this.ovE.get(e+","+t+","+n);if(o!==void 0)return o}for(const o of n===0?[this.featAt(e,t),this.featAt(e,t-1)]:[this.featAt(e,t),this.featAt(e-1,t)]){if(!o)continue;const l=o.x+o.w,c=o.z+o.d;if(n===0){if(e<o.x||e>=l||t<o.z||t>c)continue;return t>o.z&&t<c?In:this.boundary(o,e,t,0)}else{if(t<o.z||t>=c||e<o.x||e>l)continue;return e>o.x&&e<l?In:this.boundary(o,e,t,1)}}const i=this.busy(e,t),s=i<.36?.085:i<.66?.27:.43,a=i<.36?5:i<.66?4:3;for(let o=0;o<a;o++){const l=n===0?e-o:e,c=n===0?t:t-o;if(this.he(l,c,1)>=s||(this.he(l,c,2)<.5?0:1)!==n)continue;const h=1+Math.floor(this.he(l,c,3)*a);if(!(h<=o)){if(h>=3&&o===h>>1){const u=this.he(l,c,4);if(u<.3)return rn;if(u<.5)return In}return Dt}}return In}boundary(e,t,n,i){const s=this.he(t*3+i,n*3+1,50);return e.kind===1?s<.11?In:s<.24?rn:Dt:(e.w>e.d?i===1:i===0)?s<.75?In:rn:s<.09?In:s<.26?rn:Dt}solid(e,t){return this.ovS.size>0&&this.ovS.has(e+","+t)}column(e,t){const n=this.featAt(e,t);return n&&n.kind===1&&e>n.x&&e<n.x+n.w&&t>n.z&&t<n.z+n.d?n.w>=7&&n.d>=6&&(e-n.x)%3===0&&(t-n.z)%3===0:n&&e>=n.x&&e<=n.x+n.w&&t>=n.z&&t<=n.z+n.d?!1:this.busy(e,t)<.36&&(e%4+4)%4===0&&(t%4+4)%4===0&&this.he(e,t,60)<.8}fixture(e,t){if(this.solid(e,t))return null;const n=Math.floor(e/9),i=Math.floor(t/9),s=this.h(n,i,70)<.55?2:3,a=this.h(n,i,71)<.5?2:3,o=Math.floor(this.h(n,i,72)*s),l=Math.floor(this.h(n,i,73)*a);if((e%s+s)%s!==o||(t%a+a)%a!==l)return null;const c=this.h(n,i,74),h=c<.1?.62:c<.3?.22:.07,u=this.he(e,t,75);let f=u<h?1:u<h+.008?2:0;this.ovDyn.size&&this.ovDyn.has(e+","+t)?f=2:this.ovDead.size&&this.ovDead.has(e+","+t)&&(f=1);const d=(.74+.36*this.he(e,t,76))*(s*a>6?1.18:1),g=this.he(e,t,77),v=[1+.06*g,1,.77-.15*g];return{i:e,j:t,x:(e+.5)*ne,z:(t+.5)*ne,state:f,power:d,tint:v,voice:Math.floor(this.he(e,t,78)*6),id:e*73856093^t*19349663}}diffuser(e,t){return!this.fixture(e,t)&&this.h(e,t,80)<.012&&!this.solid(e,t)}sprinkler(e,t){return(e%3+3)%3===1&&(t%3+3)%3===1}region(e,t,n,i){const s=new Uint8Array((n+1)*(i+1)),a=new Uint8Array((n+1)*(i+1)),o=new Uint8Array((n+1)*(i+1)),l=new Uint8Array(n*i),c=[];for(let h=0;h<=i;h++)for(let u=0;u<=n;u++){const f=h*(n+1)+u;if(u<n&&(s[f]=this.edge(e+u,t+h,0)),h<i&&(a[f]=this.edge(e+u,t+h,1)),o[f]=this.column(e+u,t+h)?1:0,u<n&&h<i)if(this.solid(e+u,t+h))l[h*n+u]=1;else{const d=this.fixture(e+u,t+h);d&&c.push(d)}}for(let h=0;h<=i;h++)for(let u=0;u<=n;u++){const f=h*(n+1)+u;if(!o[f])continue;const d=u<n?s[f]:0,g=u>0?s[f-1]:0,v=h<i?a[f]:0,m=h>0?a[f-(n+1)]:0;(d>=rn||g>=rn||v>=rn||m>=rn)&&(o[f]=0)}return{i0:e,j0:t,w:n,h:i,ex:s,ez:a,col:o,fix:c,solid:l}}}const Nn=(r,e,t)=>e<r.i0||t<r.j0||e>=r.i0+r.w||t>r.j0+r.h?0:r.ex[(t-r.j0)*(r.w+1)+(e-r.i0)],Un=(r,e,t)=>e<r.i0||t<r.j0||e>r.i0+r.w||t>=r.j0+r.h?0:r.ez[(t-r.j0)*(r.w+1)+(e-r.i0)],_l=(r,e,t)=>e<r.i0||t<r.j0||e>r.i0+r.w||t>r.j0+r.h?0:r.col[(t-r.j0)*(r.w+1)+(e-r.i0)];function qt(r,e,t,n,i,s,a,o=!1){let l=Math.floor(e/ne),c=Math.floor(n/ne);const h=Math.floor(i/ne),u=Math.floor(a/ne),f=i-e,d=a-n,g=s-t,v=f>0?1:-1,m=d>0?1:-1;let p=f!==0?((l+(v>0?1:0))*ne-e)/f:1/0,x=d!==0?((c+(m>0?1:0))*ne-n)/d:1/0;const b=f!==0?ne/Math.abs(f):1/0,M=d!==0?ne/Math.abs(d):1/0;let E=0,A=0;const _=(T,F)=>{for(let R=0;R<2;R++)for(let D=0;D<2;D++){if(!_l(r,T+R,F+D))continue;const O=(T+R)*ne,V=(F+D)*ne,L=gl/2;let W=0,q=1;if(Math.abs(f)<1e-9){if(e<O-L||e>O+L)continue}else{let G=(O-L-e)/f,I=(O+L-e)/f;if(G>I){const U=G;G=I,I=U}W=Math.max(W,G),q=Math.min(q,I)}if(Math.abs(d)<1e-9){if(n<V-L||n>V+L)continue}else{let G=(V-L-n)/d,I=(V+L-n)/d;if(G>I){const U=G;G=I,I=U}W=Math.max(W,G),q=Math.min(q,I)}if(W<q&&q>.002&&W<.998)return!0}return!1};for(;A++<200;){if(_(l,c)){if(!o)return 1;E+=2}if(l===h&&c===u)break;let T,F;if(p<x?(F=p,T=Un(r,v>0?l+1:l,c),l+=v,p+=b):(F=x,T=Nn(r,l,m>0?c+1:c),c+=m,x+=M),F>1)break;if(T===Dt||T===Li||T===rn&&t+g*F>fm){if(!o)return 1;E++}}return E}const bn=16;function pm(){return{uL:{value:Array.from({length:bn},()=>new Ze(0,-100,0,0))},uLC:{value:Array.from({length:bn},()=>new B(1,1,1))},uTime:{value:0},uSmooth:{value:null},uFog:{value:new Ze(.0043,.0036,.0018,0)},uFlat:{value:0}}}const cs=`
#define NL ${bn}
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
`,mm=`
attribute vec2 lm; varying vec3 vP; varying vec3 vN; varying vec2 vLm;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vP = w.xyz; vN = normal; vLm = lm; gl_Position = projectionMatrix * viewMatrix * w; }
`,gm=cs+`
uniform sampler2D uA, uN, uO;
void main(){
  FLAT(vec3(0.258, 0.203, 0.131))
  vec3 V = normalize(cameraPosition - vP); vec3 E = irr();
  vec2 uv = vP.xz / 0.3048;
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
  gl_FragColor = vec4(fogged(c), 1.0);
}`,_m=cs+`
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
}`,vm=cs+`
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
}`,xm=cs+`
void main(){
  FLAT(vec3(0.68, 0.63, 0.50))
  vec3 E = irr();
  vec3 a = vec3(0.80, 0.795, 0.76) * (0.92 + 0.12 * hash12(floor(vP.xz / 0.6096))) * (0.9 + 0.2 * sm(vP.xz * 0.6).r);
  gl_FragColor = vec4(fogged(a * E / PI), 1.0);
}`,Mm=cs+`
void main(){
  FLAT(vec3(0.62, 0.50, 0.215))
  vec3 Ng = normalize(vN); vec3 V = normalize(cameraPosition - vP); vec3 E = irr();
  vec3 a = vec3(0.40, 0.325, 0.185) * (0.85 + 0.3 * sm(vP.xz * 0.8 + vP.y).g);
  a *= 0.8 + 0.2 * smoothstep(0.0, 0.03, vP.y);         /* fluff and dirt where it meets the carpet */
  vec4 nl = nearLights(vP, Ng, Ng, V, 0.42, 0.045, E);
  gl_FragColor = vec4(fogged(a * E / PI + nl.rgb * 0.6), 1.0);
}`,Sm=`
attribute vec4 aFix;      /* state, power, flicker phase, - */
attribute vec3 aTint; attribute vec3 aAmb;
varying vec2 vUv; varying vec4 vFix; varying vec3 vTint; varying vec3 vAmb; varying vec3 vP;
void main(){ vUv = uv; vFix = aFix; vTint = aTint; vAmb = aAmb; vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0); vP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,ym=`
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
}`,bm=`
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
}`,Tm=`
#define NL ${bn}
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
}`,Po={paint_white:{col:[.8,.79,.74],rough:.5,f0:.04,metal:0},steel:{col:[.62,.62,.63],rough:.32,f0:.6,metal:1},door_paint:{col:[.5,.46,.36],rough:.45,f0:.045,metal:0},plastic_ivory:{col:[.74,.69,.55],rough:.35,f0:.045,metal:0},dark:{col:[.02,.02,.02],rough:.6,f0:.03,metal:0},brass:{col:[.72,.55,.25],rough:.4,f0:.7,metal:1},fridge_white:{col:[.8,.79,.73],rough:.28,f0:.05,metal:0},figure:{col:[.011,.011,.012],rough:.92,f0:.02,metal:0},rubber:{col:[.04,.04,.04],rough:.8,f0:.03,metal:0}};class Em{constructor(e){this.shared=e}shared;tex={};base(e,t,n=mm){const i=this.shared;return new zt({vertexShader:n,fragmentShader:t,uniforms:{uLm:{value:null},uLm2:{value:null},uFlick:{value:1},uFlick2:{value:new Ze(1,1,1,1)},uFlickCol:{value:new B(1.03,1,.7)},uL:i.uL,uLC:i.uLC,uTime:i.uTime,uSmooth:i.uSmooth,uFog:i.uFog,uFlat:i.uFlat,...e}})}maps(e){return{uA:{value:this.tex[e+"_a"]},uN:{value:this.tex[e+"_n"]},uO:{value:this.tex[e+"_o"]}}}protos;lens;props=new Map;propsInst=new Map;build(){this.protos={floor:this.base(this.maps("carpet"),gm),ceil:this.base(this.maps("tile"),vm),wall:this.base(this.maps("wall"),_m),base:this.base({},Mm),trim:this.base({},xm)},this.protos.ceil.side=0,this.lens=new zt({side:2,vertexShader:Sm,fragmentShader:ym,uniforms:{uTime:this.shared.uTime,uFlickVal:{value:1},uFlick2:{value:new Ze(1,1,1,1)},uFog:this.shared.uFog}})}forChunk(e,t){const n={};for(const[i,s]of Object.entries(this.protos)){const a=s.clone();a.uniforms.uLm.value=e,a.uniforms.uLm2.value=t;const o=this.shared;a.uniforms.uL=o.uL,a.uniforms.uLC=o.uLC,a.uniforms.uTime=o.uTime,a.uniforms.uSmooth=o.uSmooth,a.uniforms.uFog=o.uFog,a.uniforms.uFlat=o.uFlat;for(const l of["uA","uN","uO"])s.uniforms[l]&&(a.uniforms[l]=s.uniforms[l]);n[i]=a}return n}prop(e,t,n=!0){const i=t?this.propsInst:this.props;let s=i.get(e+n);if(!s){const a=Po[e]||Po.paint_white,o=this.shared;s=new zt({vertexShader:bm,fragmentShader:Tm,vertexColors:n,uniforms:{uCol:{value:new B(...a.col)},uRough:{value:a.rough},uF0:{value:a.f0},uMetal:{value:a.metal},uAmb:{value:new B(.1,.1,.08)},uL:o.uL,uLC:o.uLC,uFog:o.uFog}}),i.set(e+n,s)}return s}dispose(){for(const e of Object.values(this.protos))e.dispose();this.lens.dispose();for(const e of this.props.values())e.dispose();for(const e of this.propsInst.values())e.dispose();for(const e of Object.values(this.tex))e.dispose()}}const Am="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",wm=`
varying vec2 vUv; uniform sampler2D uScene, uPrev; uniform float uDt, uInit, uLod;
void main(){
  float s = 0.0, ws = 0.0;
  for (int y = 0; y < 5; y++) for (int x = 0; x < 6; x++) {
    vec2 p = (vec2(float(x), float(y)) + 0.5) / vec2(6.0, 5.0); vec3 c = textureLod(uScene, p, uLod).rgb;
    float l = dot(c, vec3(0.299, 0.587, 0.114)); float w = 1.0 - 0.6 * length(p - vec2(0.5, 0.45));
    /* centre-weighted average, part linear part log: a lamp in shot pulls the exposure down, but not all the way */
    s += w * (0.5 * log(l + 1e-4) + 0.5 * log(min(l, 0.25) + 1e-4)); ws += w; }
  float L = exp(s / ws);
  float want = clamp(0.25 / L, 3.0, 280.0);
  float prev = texture2D(uPrev, vec2(0.5)).r;
  float rate = want < prev ? 2.6 : 1.3;                       /* closes faster than it opens */
  float e = mix(prev, want, 1.0 - exp(-uDt * rate)); if (uInit > 0.5 || prev <= 0.0) e = want;
  /* past about 60x the iris is wide open and the rest is gain */
  gl_FragColor = vec4(e, clamp(log2(max(e / 60.0, 1.0)) / 3.0, 0.0, 1.0), L, 1.0);
}`,Rm=`
varying vec2 vUv; uniform sampler2D uScene, uExp;
void main(){ float e = texture2D(uExp, vec2(0.5)).r; vec3 c = vec3(0.0);
  for (int i = 0; i < 4; i++) { vec2 o = (vec2(float(i - (i / 2) * 2), float(i / 2)) - 0.5) / vec2(480.0, 360.0); c += textureLod(uScene, vUv + o, 1.0).rgb; }
  c = max(c * 0.25 * e - 0.92, 0.0); gl_FragColor = vec4(min(c, vec3(24.0)), 1.0); }`,Cm=`
varying vec2 vUv; uniform sampler2D uTex; uniform vec2 uDir;
void main(){ vec3 c = texture2D(uTex, vUv).rgb * 0.227;
  c += (texture2D(uTex, vUv + uDir * 1.385).rgb + texture2D(uTex, vUv - uDir * 1.385).rgb) * 0.316;
  c += (texture2D(uTex, vUv + uDir * 3.231).rgb + texture2D(uTex, vUv - uDir * 3.231).rgb) * 0.070; gl_FragColor = vec4(c, 1.0); }`,Lm=`
varying vec2 vUv; uniform sampler2D uTex;
void main(){ vec3 c = vec3(0.0); for (int i = 0; i < 30; i++) c += texture2D(uTex, vec2(vUv.x, (float(i) + 0.5) / 30.0)).rgb; gl_FragColor = vec4(c / 30.0, 1.0); }`,Pm=`
varying vec2 vUv; uniform sampler2D uScene, uExp, uBloom, uSmear;
uniform float uFocus, uSkew, uZoom; uniform vec2 uMove; uniform vec3 uWB; uniform float uAspect;
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
  c *= uWB;
  /* the sensor and the video amp: a knee above 80%, a hard clip, then gamma */
  c = mix(c, 0.8 + (c - 0.8) * 0.28, step(0.8, c)); c = clamp(c, 0.0, 1.0);
  float l = dot(c, vec3(0.299, 0.587, 0.114)); c = mix(vec3(l), c, 1.04);
  c = pow(c, vec3(0.47));
  gl_FragColor = vec4(c, 1.0);
}`,Dm=`
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
}`,Im=`
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
}`,Fm=`
varying vec2 vUv; uniform sampler2D uScene, uExp; uniform vec4 uRect;
void main(){ vec2 uv = (vUv - uRect.xy) / uRect.zw; if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
  vec3 c = texture2D(uScene, uv).rgb * texture2D(uExp, vec2(0.5)).r; c = mix(c, 0.8 + (c - 0.8) * 0.28, step(0.8, c)); gl_FragColor = vec4(pow(clamp(c, 0.0, 1.0), vec3(0.47)), 1.0); }`;class Nm{constructor(e,t,n){this.r=e,n<1&&(this.SW=720,this.SH=540);const i=1016;this.scene=new on(this.SW,this.SH,{type:i,samples:n>=1?4:0,depthBuffer:!0,generateMipmaps:!0,minFilter:1008,magFilter:1006});const s=(o,l,c=1009,h=1006)=>new on(o,l,{type:c,depthBuffer:!1,minFilter:h,magFilter:h,wrapS:1001,wrapT:1001});this.sig=s(this.W,this.H),this.out=[s(this.W,this.H),s(this.W,this.H)],this.exp=[s(1,1,i,1003),s(1,1,i,1003)],this.bright=s(240,180,i),this.blurA=s(240,180,i),this.smear=s(240,1,i);const a=(o,l)=>new zt({vertexShader:Am,fragmentShader:o,uniforms:l,depthTest:!1,depthWrite:!1});this.m.meter=a(wm,{uScene:{value:this.scene.texture},uPrev:{value:null},uDt:{value:.016},uInit:{value:1},uLod:{value:Math.log2(this.SW/30)}}),this.m.bright=a(Rm,{uScene:{value:this.scene.texture},uExp:{value:null}}),this.m.blur=a(Cm,{uTex:{value:null},uDir:{value:new Ue}}),this.m.smear=a(Lm,{uTex:{value:null}}),this.m.lens=a(Pm,{uScene:{value:this.scene.texture},uExp:{value:null},uBloom:{value:this.bright.texture},uSmear:{value:this.smear.texture},uFocus:{value:0},uSkew:{value:0},uZoom:{value:0},uMove:{value:new Ue},uWB:{value:new B(1,1,1)},uAspect:{value:4/3}}),this.m.tape=a(Dm,{uSig:{value:this.sig.texture},uPrev:{value:null},uNoise:{value:t},uExp:{value:null},uField:{value:0},uFrame:{value:0},uGlitch:{value:0},uTrack:{value:.5},uFxA:{value:new Ze(0,0,1,0)},uFxB:{value:new Ze(0,0,0,1)},uBand:{value:new Ze(0,.05,0,0)},uTear:{value:new Ze(0,0,0,0)},uDrop:{value:0},uRes:{value:new Ue(this.W,this.H)}}),this.m.show=a(Im,{uTex:{value:null},uRes:{value:new Ue(this.W,this.H)},uRect:{value:this.rect},uFrame:{value:0}}),this.m.raw=a(Fm,{uScene:{value:this.scene.texture},uExp:{value:null},uRect:{value:this.rect}}),this.quad=new bt(new jn(2,2),this.m.show),this.quad.frustumCulled=!1,this.qs.add(this.quad)}r;SW=960;SH=720;W=720;H=480;scene;sig;out;exp;bright;blurA;smear;quad;cam=new tr(-1,1,1,-1,0,1);qs=new Wo;m={};frame=0;flip=0;first=!0;rect=new Ze(0,0,1,1);raw=!1;fx={black:0,snow:0,chroma:1,hue:0,vshift:0,flag:0,bleed:0,level:1,bandY:0,bandH:.05,band:0,tearY:0,tearH:0,tear:0,drop:0,glitch:0,track:.5,freeze:!1};clearFx(){const e=this.fx;e.black=e.snow=e.hue=e.vshift=e.flag=e.bleed=e.band=e.tear=e.tearH=e.drop=e.glitch=0,e.chroma=e.level=1,e.freeze=!1}layout(e,t){const n=e/t,i=4/3;if(n>i){const s=i/n;this.rect.set((1-s)/2,0,s,1)}else{const s=n/i;this.rect.set(0,(1-s)/2,1,s)}}pass(e,t){this.quad.material=e,this.r.setRenderTarget(t),this.r.render(this.qs,this.cam)}render(e,t,n){const i=this.r,s=this.m;i.setRenderTarget(this.scene),i.render(e,t);const a=this.exp[this.flip],o=this.exp[1-this.flip];if(s.meter.uniforms.uPrev.value=a.texture,s.meter.uniforms.uDt.value=n.dt,s.meter.uniforms.uInit.value=this.first?1:0,this.pass(s.meter,o),this.raw){s.raw.uniforms.uExp.value=o.texture,this.pass(s.raw,null),this.flip=1-this.flip,this.frame++,this.first=!1;return}s.bright.uniforms.uExp.value=o.texture,this.pass(s.bright,this.bright),s.smear.uniforms.uTex.value=this.bright.texture,this.pass(s.smear,this.smear),s.blur.uniforms.uTex.value=this.bright.texture,s.blur.uniforms.uDir.value.set(1/240,0),this.pass(s.blur,this.blurA),s.blur.uniforms.uTex.value=this.blurA.texture,s.blur.uniforms.uDir.value.set(0,1/180),this.pass(s.blur,this.bright);const l=this.fx;if(l.freeze&&!this.first){s.show.uniforms.uTex.value=this.out[this.flip].texture,s.show.uniforms.uFrame.value=this.frame,this.pass(s.show,null),this.frame++;return}const c=s.lens.uniforms;c.uExp.value=o.texture,c.uFocus.value=n.focus,c.uSkew.value=n.skew,c.uZoom.value=n.zoom,c.uMove.value.set(n.move[0],n.move[1]),c.uWB.value.set(n.wb[0],n.wb[1],n.wb[2]),this.pass(s.lens,this.sig);const h=this.out[this.flip],u=this.out[1-this.flip],f=s.tape.uniforms;f.uPrev.value=h.texture,f.uExp.value=o.texture,f.uField.value=this.frame&1,f.uFrame.value=this.frame,f.uGlitch.value=Math.max(n.glitch,l.glitch),f.uTrack.value=l.glitch>n.glitch?l.track:n.track,f.uFxA.value.set(l.black,l.snow,l.chroma,l.hue),f.uFxB.value.set(l.vshift,l.flag,l.bleed,l.level),f.uBand.value.set(l.bandY,l.bandH,l.band,0),f.uTear.value.set(l.tearY,l.tearH,l.tear,0),f.uDrop.value=l.drop,this.pass(s.tape,u),this.first&&(f.uPrev.value=u.texture,f.uField.value=1,this.pass(s.tape,h),f.uPrev.value=h.texture,f.uField.value=0,this.pass(s.tape,u)),s.show.uniforms.uTex.value=u.texture,s.show.uniforms.uFrame.value=this.frame,this.pass(s.show,null),this.flip=1-this.flip,this.frame++,this.first=!1}reset(){this.first=!0}readScene(e,t,n,i){const s=new Uint16Array(n*i*4),a=[0,0,0];this.r.readRenderTargetPixels(this.scene,e,t,n,i,s);for(let o=0;o<n*i;o++)for(let l=0;l<3;l++)a[l]+=Fa.fromHalfFloat(s[o*4+l])/(n*i);return a}meter(){const e=new Uint16Array(4);return this.r.readRenderTargetPixels(this.exp[this.flip],0,0,1,1,e),[0,1,2].map(t=>Fa.fromHalfFloat(e[t]))}dispose(){for(const e of[this.scene,this.sig,...this.out,...this.exp,this.bright,this.blurA,this.smear])e.dispose();for(const e in this.m)this.m[e].dispose();this.quad.geometry.dispose()}}const Xt=(r,e,t)=>Math.max(e,Math.min(t,r)),zs=.12;function ci(r,e){const t=Math.floor(r),n=r-t,i=n*n*(3-2*n),s=a=>{const o=Math.sin((a+e*57.3)*127.1)*43758.5453;return(o-Math.floor(o))*2-1};return s(t)*(1-i)+s(t+1)*i}const Ir=(r,e)=>ci(r,e)*.55+ci(r*2.1,e+1)*.28+ci(r*4.3,e+2)*.17;class Um{x=0;z=0;vx=0;vz=0;yawT=0;pitchT=0;yaw=0;pitch=0;roll=0;wy=0;wp=0;zoom=0;zoomT=0;zoomV=0;step=0;foot=1;speed=0;moving=!1;idle=0;turnAcc=0;bobY=0;kick=0;kickV=0;fInv=1/3;fVel=0;fDelay=0;focus=0;t=0;glitch=0;glitchAt=40+Math.random()*70;track=.5;wbT=Math.random()*100;keys=new Set;look=[0,0];stick=[0,0];extra=[];onStep=()=>{};onZoom=()=>{};EYE=1.5;hfov(){return(58-38*this.zoom)*Math.PI/180}ray(e,t,n,i=30){let s=Math.floor(this.x/ne),a=Math.floor(this.z/ne);const o=t>0?1:-1,l=n>0?1:-1;let c=t!==0?((s+(o>0?1:0))*ne-this.x)/t:1/0,h=n!==0?((a+(l>0?1:0))*ne-this.z)/n:1/0;const u=t!==0?ne/Math.abs(t):1/0,f=n!==0?ne/Math.abs(n):1/0;for(let d=0;d<80;d++){let g,v;if(c<h?(g=c,v=Un(e,o>0?s+1:s,a),s+=o,c+=u):(g=h,v=Nn(e,s,l>0?a+1:a),a+=l,h+=f),g>i)return i;if(v===Dt||v===Li)return g}return i}collide(e){const n=Math.floor(this.x/ne),i=Math.floor(this.z/ne),s=[],a=li/2+.012;for(let o=i-1;o<=i+2;o++)for(let l=n-1;l<=n+2;l++){const c=Nn(e,l,o),h=Un(e,l,o);c===Dt&&s.push({x0:l*ne,z0:o*ne-a,x1:(l+1)*ne,z1:o*ne+a}),h===Dt&&s.push({x0:l*ne-a,z0:o*ne,x1:l*ne+a,z1:(o+1)*ne}),c===Li&&(s.push({x0:l*ne,z0:o*ne-a,x1:l*ne+zs,z1:o*ne+a}),s.push({x0:(l+1)*ne-zs,z0:o*ne-a,x1:(l+1)*ne,z1:o*ne+a})),h===Li&&(s.push({x0:l*ne-a,z0:o*ne,x1:l*ne+a,z1:o*ne+zs}),s.push({x0:l*ne-a,z0:(o+1)*ne-zs,x1:l*ne+a,z1:(o+1)*ne}));const u=_l(e,l,o)?gl/2+.012:c||h||Nn(e,l-1,o)||Un(e,l,o-1)?a:0;u&&s.push({x0:l*ne-u,z0:o*ne-u,x1:l*ne+u,z1:o*ne+u})}for(const o of this.extra)s.push(o);for(let o=0;o<3;o++)for(const l of s){const c=Xt(this.x,l.x0,l.x1),h=Xt(this.z,l.z0,l.z1);let u=this.x-c,f=this.z-h;const d=u*u+f*f;if(d>=.27*.27)continue;if(d<1e-9){const m=this.x-l.x0,p=l.x1-this.x,x=this.z-l.z0,b=l.z1-this.z,M=Math.min(m,p,x,b);M===m?this.x=l.x0-.27:M===p?this.x=l.x1+.27:M===x?this.z=l.z0-.27:this.z=l.z1+.27;continue}const g=Math.sqrt(d);u/=g,f/=g,this.x=c+u*.27,this.z=h+f*.27;const v=this.vx*u+this.vz*f;v<0&&(this.vx-=v*u,this.vz-=v*f)}}update(e,t,n){this.t+=e;const i=this.t,s=.0021*(this.hfov()/1.012);this.yawT-=this.look[0]*s,this.pitchT=Xt(this.pitchT-this.look[1]*s,-1.25,1.25),this.look[0]=this.look[1]=0;const a=this.keys;let o=(a.has("KeyD")||a.has("ArrowRight")?1:0)-(a.has("KeyA")||a.has("ArrowLeft")?1:0)+this.stick[0],l=(a.has("KeyW")||a.has("ArrowUp")?1:0)-(a.has("KeyS")||a.has("ArrowDown")?1:0)+this.stick[1];const c=Math.hypot(o,l);c>1&&(o/=c,l/=c);const u=(a.has("ShiftLeft")||a.has("ShiftRight")||c>1.3?2.25:1.28)*(l<-.1?.72:1)*(1-.25*this.zoom),f=Math.sin(this.yaw),d=Math.cos(this.yaw),g=(-f*l+d*o*.85)*u,v=(-d*l-f*o*.85)*u,m=c>.05?4.6:6.5,p=g-this.vx,x=v-this.vz,b=Math.hypot(p,x),M=m*e;b>M?(this.vx+=p/b*M,this.vz+=x/b*M):(this.vx=g,this.vz=v),this.x+=this.vx*e,this.z+=this.vz*e,this.collide(t);const E=Math.hypot(this.vx,this.vz);this.speed=E;const A=Xt(E/1.28,0,1.8),_=.62+.16*Xt(E/2.25,0,1),T=this.moving;this.moving=E>.28,this.moving?(this.idle=0,this.step+=E*e/_,this.step>=1&&(this.step-=1,this.foot=-this.foot,this.onStep(this.foot,E,0),this.kickV-=.055*(.6+.5*A))):(this.idle+=e,T&&(this.foot=-this.foot,this.onStep(this.foot,.6,1),this.kickV-=.03,this.step=.5)),this.turnAcc+=Math.abs(this.wy)*e,!this.moving&&this.turnAcc>.85&&(this.turnAcc=0,this.foot=-this.foot,this.onStep(this.foot,.45,1)),this.moving&&(this.turnAcc=0);const F=this.step*Math.PI*2,R=this.moving?1:Math.max(0,1-this.idle*4),D=-Math.abs(Math.sin(F*.5))*.034*A*R+.017*A*R;this.bobY+=(D-this.bobY)*Math.min(1,e*18);const O=Math.sin(F*.5+(this.foot>0?0:Math.PI))*.016*A*R,V=2*Math.PI*2.3,L=.72,W=V*V*(this.yawT-this.yaw)-2*L*V*this.wy,q=V*V*(this.pitchT-this.pitch)-2*L*V*this.wp;this.wy+=W*e,this.wp+=q*e,this.yaw+=this.wy*e,this.pitch+=this.wp*e,this.kickV+=(-260*this.kick-17*this.kickV)*e,this.kick+=this.kickV*e;const G=(.0042+.0105*A+.004*Xt(Math.abs(this.wy)+Math.abs(this.wp),0,2))*(1+.5*this.zoom),I=Math.sin(i*1.55)*.0022*(1-Xt(A,0,1)),U=Ir(i*.9,1)*G+ci(i*7.3,2)*G*.1+O*.25,Y=Ir(i*.8,5)*G*.85+ci(i*8.1,6)*G*.09+I+this.kick+Math.sin(F)*.004*A*R,te=Ir(i*.6,9)*G*1.2+O*.55-this.wy*.012+this.vx*0;this.roll+=(te-this.roll)*Math.min(1,e*9);const xe=(a.has("KeyE")||a.has("Equal")?1:0)-(a.has("KeyQ")||a.has("Minus")?1:0);xe&&(this.zoomT=Xt(this.zoomT+xe*e*.42,0,1));const Le=Xt((this.zoomT-this.zoom)*7,-.42,.42);this.zoomV+=(Le-this.zoomV)*Math.min(1,e*10),this.zoom=Xt(this.zoom+this.zoomV*e,0,1),this.onZoom(Math.abs(this.zoomV)/.42);const $=Math.max(.25,this.ray(t,-Math.sin(this.yaw)*Math.cos(this.pitch),-Math.cos(this.yaw)*Math.cos(this.pitch),30)/Math.max(.35,Math.cos(this.pitch))),Me=1/(this.pitch<-.25?Math.min($,this.EYE/Math.sin(-this.pitch)):this.pitch>.3?Math.min($,(Mt-this.EYE)/Math.sin(this.pitch)):$),we=Me-this.fInv;Math.abs(we)>.12*(1-.6*this.zoom)?this.fDelay+=e:this.fDelay=Math.max(0,this.fDelay-e*2),this.fDelay>.22?(this.fVel+=(7.5*7.5*we-2*.42*7.5*this.fVel)*e,this.fInv+=this.fVel*e,Math.abs(we)<.02&&Math.abs(this.fVel)<.05&&(this.fDelay=0)):this.fVel*=Math.exp(-e*6),this.focus=Xt(Math.abs(Me-this.fInv)*(.42+2.4*this.zoom),0,1),i>this.glitchAt&&(this.glitch=1,this.glitchAt=i+45+Math.random()*110,this.track=.15+Math.random()*.2),this.glitch=Math.max(0,this.glitch-e*2.6),this.track+=e*.5,this.wbT+=e;const pe=this.hfov(),De=2*Math.atan(Math.tan(pe/2)*.75);n.px=this.x+Math.cos(this.yaw)*O,n.py=this.EYE+this.bobY+Math.sin(i*1.55)*.004,n.pz=this.z-Math.sin(this.yaw)*O,n.yaw=this.yaw+U,n.pitch=this.pitch+Y,n.roll=this.roll,n.fov=De*180/Math.PI;const Je=n.cam;Je.dt=e,Je.focus=this.focus,Je.skew=Xt(this.wy*.0035,-.012,.012),Je.zoom=this.zoom,Je.move[0]=Xt(this.wy*e*.5/pe,-.03,.03),Je.move[1]=Xt(-this.wp*e*.5/De,-.03,.03),Je.wb[0]=.965+.02*ci(this.wbT*.07,3),Je.wb[1]=1,Je.wb[2]=.87+.05*ci(this.wbT*.05,4),Je.glitch=this.glitch,Je.track=this.track}}const ks=12,Om=-1,Bm=-9,zm=-6,nt=(r,e)=>r+Math.random()*(e-r),nn=r=>Math.pow(10,r/20);class ra{constructor(e){this.man=e}man;buf=new Map;ctx;live=!1;bus;rev=[];revIn;voices=[];bed;vent=[];hvac;zoomG;doorV=null;fridgeV=null;flickG=null;lastStep=-1;lastWet=-1;nextEvent=6;nextHandle=4;t=0;farTone=150+Math.random()*240;revW=[0,0,1,0];upd=0;master;fxGain;fxLp;tapeIn;humMul=1;hvacMul=1;revMul=1;revBias=[0,0,0,0];detune=0;mods=new Map;debug={voices:0,bed:0,room:[0,0,0,0],occl:0};static async load(e){const t=await(await fetch(e+"manifest.json")).json(),n=new ra(t),i=window.OfflineAudioContext||window.webkitOfflineAudioContext,s=new i(2,2,32e3),a=new Map;for(const o of Object.values(t))a.has(o.file)||a.set(o.file,fetch(e+o.file).then(l=>l.arrayBuffer()).then(l=>s.decodeAudioData(l)));return await Promise.all(Object.entries(t).map(async([o,l])=>{const c=await a.get(l.file);if(l.at===void 0){n.buf.set(o,c);return}const h=c.sampleRate,u=Math.max(0,Math.floor((l.at-.02)*h)),f=Math.min(c.length,Math.ceil((l.at+l.len+.02)*h)),d=s.createBuffer(c.numberOfChannels,f-u,h);for(let g=0;g<c.numberOfChannels;g++)d.getChannelData(g).set(c.getChannelData(g).subarray(u,f));n.buf.set(o,d)})),n}loop(e,t,n=1){const i=this.buf.get(e),s=this.man[e],a=this.ctx.createBufferSource();a.buffer=i,a.loop=!0,a.playbackRate.value=n;const o=s.loop?.1:0,l=s.loop?s.loop/s.sr:i.duration;return a.loopStart=o,a.loopEnd=o+l,a.connect(t),a.start(0,o+Math.random()*l*.9),a}voice(e=60,t=1.25,n=1.3){const i=this.ctx,s=i.createGain();s.gain.value=0;const a=i.createBiquadFilter();a.type="lowpass",a.frequency.value=12e3,a.Q.value=.5;const o=i.createPanner();o.panningModel="HRTF",o.distanceModel="inverse",o.refDistance=n,o.rolloffFactor=t,o.maxDistance=e;const l=i.createGain();return l.gain.value=.3,s.connect(a),a.connect(o),o.connect(this.bus),o.connect(l),l.connect(this.revIn),{src:null,g:s,lp:a,pan:o,send:l,id:0,fix:null,level:0,rate0:1,bz:null,bzG:null}}start(e,t=e.destination){this.ctx=e,this.voices=[],this.vent=[],this.rev=[];const n=e,i=n.currentTime,s=this.master=n.createGain();s.gain.setValueAtTime(1e-4,i),s.gain.exponentialRampToValueAtTime(nn(Bm),i+.035),s.connect(t);const a=n.createDynamicsCompressor();a.threshold.value=-3,a.knee.value=4,a.ratio.value=20,a.attack.value=.002,a.release.value=.12,a.connect(s);const o=n.createDelay(.05);o.delayTime.value=.006,o.connect(a);const l=n.createOscillator();l.frequency.value=.55;const c=n.createGain();c.gain.value=22e-5,l.connect(c),c.connect(o.delayTime),l.start();const h=n.createOscillator();h.frequency.value=6.3;const u=n.createGain();u.gain.value=3e-5,h.connect(u),u.connect(o.delayTime),h.start();const f=this.fxGain=n.createGain();f.gain.value=1,f.connect(o);const d=this.fxLp=n.createBiquadFilter();d.type="lowpass",d.frequency.value=16e3,d.Q.value=.5,d.connect(f),this.tapeIn=o;const g=n.createGain();g.gain.value=nn(Om),g.connect(d);const v=n.createDynamicsCompressor();v.threshold.value=-40,v.knee.value=18,v.ratio.value=2,v.attack.value=.03,v.release.value=1,v.connect(g);const m=n.createBiquadFilter();m.type="lowpass",m.frequency.value=9500,m.Q.value=.6;const p=n.createBiquadFilter();p.type="lowpass",p.frequency.value=11e3,p.Q.value=.7,m.connect(p),p.connect(v);const x=n.createBiquadFilter();x.type="peaking",x.frequency.value=3300,x.Q.value=.9,x.gain.value=3.5,x.connect(m);const b=n.createBiquadFilter();b.type="highpass",b.frequency.value=75,b.Q.value=.6,b.connect(x);const M=n.createChannelSplitter(2),E=n.createChannelMerger(2),A=(R,D,O)=>{const V=n.createGain();V.gain.value=O,M.connect(V,R),V.connect(E,0,D)};A(0,0,.7),A(1,0,.3),A(0,1,.3),A(1,1,.7),E.connect(b),this.bus=n.createGain(),this.bus.gain.value=1,this.bus.channelCount=2,this.bus.channelCountMode="explicit",this.bus.connect(M);const _=n.createGain();_.gain.value=nn(zm),_.connect(d),this.loop("hiss",_);const T=n.createGain();T.gain.value=nn(-8),T.connect(b),this.loop("transport",T),this.zoomG=n.createGain(),this.zoomG.gain.value=0,this.zoomG.connect(b),this.loop("zoom",this.zoomG),this.revIn=n.createGain(),this.revIn.gain.value=1;for(const R of["ir_corridor","ir_small","ir_medium","ir_hall"]){const D=n.createConvolver();D.normalize=!1,D.buffer=this.atRate(this.buf.get(R));const O=n.createGain();O.gain.value=0,this.revIn.connect(D),D.connect(O),O.connect(this.bus),this.rev.push({conv:D,g:O})}for(let R=0;R<ks;R++)this.voices.push(this.voice());this.bed=n.createGain(),this.bed.gain.value=0;const F=n.createBiquadFilter();F.type="lowpass",F.frequency.value=2400,this.bed.connect(F),F.connect(this.bus),this.loop("bed_hum",this.bed),this.hvac=n.createGain(),this.hvac.gain.value=nn(-7),this.hvac.connect(this.bus),this.loop("hvac",this.hvac);for(let R=0;R<2;R++){const D=this.voice(25,1.6,.9);D.src=this.loop("vent",D.g,nt(.96,1.04)),this.vent.push(D)}this.setListener(0,1.5,0,0,0,-1,0,1,0),this.live=!0}atRate(e){const t=this.ctx.sampleRate;if(Math.abs(e.sampleRate-t)<1)return e;const n=e.sampleRate/t,i=Math.floor(e.length/n),s=this.ctx.createBuffer(e.numberOfChannels,i,t);for(let a=0;a<e.numberOfChannels;a++){const o=e.getChannelData(a),l=s.getChannelData(a),c=o.length-1;for(let h=0;h<i;h++){const u=h*n,f=Math.floor(u),d=u-f,g=o[Math.max(0,f-1)],v=o[f],m=o[Math.min(c,f+1)],p=o[Math.min(c,f+2)];l[h]=(v+.5*d*(m-g+d*(2*g-5*v+4*m-p+d*(3*(v-m)+p-g))))*n}}return s}setListener(e,t,n,i,s,a,o,l,c){const h=this.ctx.listener,u=this.ctx.currentTime;h.positionX?(h.positionX.setTargetAtTime(e,u,.02),h.positionY.setTargetAtTime(t,u,.02),h.positionZ.setTargetAtTime(n,u,.02),h.forwardX.setTargetAtTime(i,u,.02),h.forwardY.setTargetAtTime(s,u,.02),h.forwardZ.setTargetAtTime(a,u,.02),h.upX.setTargetAtTime(o,u,.02),h.upY.setTargetAtTime(l,u,.02),h.upZ.setTargetAtTime(c,u,.02)):(h.setPosition(e,t,n),h.setOrientation(i,s,a,o,l,c))}place(e,t,n,i){const s=e.pan,a=this.ctx.currentTime;s.positionX?(s.positionX.setValueAtTime(t,a),s.positionY.setValueAtTime(n,a),s.positionZ.setValueAtTime(i,a)):s.setPosition(t,n,i)}shot(e,t,n,i,s,a=1,o=.3,l=14e3,c=1.5,h=1){const u=this.buf.get(e);if(!u)return;const f=this.ctx,d=f.createBufferSource();d.buffer=u,d.playbackRate.value=a;const g=f.createGain();g.gain.value=s;const v=f.createBiquadFilter();v.type="lowpass",v.frequency.value=l,v.Q.value=.5;const m=f.createPanner();m.panningModel="HRTF",m.distanceModel="inverse",m.refDistance=c,m.rolloffFactor=h,m.maxDistance=80,m.positionX?(m.positionX.value=t,m.positionY.value=n,m.positionZ.value=i):m.setPosition(t,n,i);const p=f.createGain();p.gain.value=o,d.connect(g),g.connect(v),v.connect(m),m.connect(this.bus),m.connect(p),p.connect(this.revIn),d.start(),d.onended=()=>{try{d.disconnect(),g.disconnect(),v.disconnect(),m.disconnect(),p.disconnect()}catch{}}}unbuzz(e,t){if(!e.bz)return;const n=e.bz,i=e.bzG;e.bz=null,e.bzG=null,i.gain.setTargetAtTime(0,t,.05),n.stop(t+.4),n.onended=()=>{try{n.disconnect(),i.disconnect()}catch{}}}recDrop(e,t=0){if(!this.live)return;const n=this.fxGain.gain,i=this.ctx.currentTime;n.cancelScheduledValues(i),n.setTargetAtTime(t,i,.004),n.setTargetAtTime(1,i+e,.02)}recLevel(e,t){if(!this.live)return;const n=this.fxGain.gain,i=this.ctx.currentTime;n.cancelScheduledValues(i),n.setTargetAtTime(e,i,t*.25),n.setTargetAtTime(1,i+t,t*.4)}recMuffle(e,t=900){if(!this.live)return;const n=this.fxLp.frequency,i=this.ctx.currentTime;n.cancelScheduledValues(i),n.setTargetAtTime(t,i,.03),n.setTargetAtTime(16e3,i+e,.12)}tapeStatic(e,t){const n=this.buf.get(e);if(!n||!this.live)return;const i=this.ctx,s=i.createBufferSource(),a=i.createGain();s.buffer=n,a.gain.value=t,s.connect(a),a.connect(this.tapeIn),s.start(),s.onended=()=>{try{s.disconnect(),a.disconnect()}catch{}}}lx=0;lz=0;fwx=0;fwz=-1;step(e,t,n,i=0){if(!this.live)return;let s;const a=n?6:14;do s=Math.floor(Math.random()*a);while(s===this.lastStep);this.lastStep=s;const o=-this.fwz,l=this.fwx,c=this.lx+o*e*.11+this.fwx*.1,h=this.lz+l*e*.11+this.fwz*.1,u=n?.55:.62+.42*Math.min(1.6,t/1.28)*nt(.85,1.12);if(this.shot((n?"scuff":"step")+s,c,.02,h,u*1.5,nt(.94,1.06)*(1+.04*Math.min(1,t/2.25)),.55,9e3),i>.02){let f;do f=Math.floor(Math.random()*8);while(f===this.lastWet);this.lastWet=f,this.shot("wet"+f,c,.02,h,u*(.5+2.6*i)*nt(.8,1.2),nt(.9,1.1)*(1-.06*i),.4,5200+1500*(1-i))}Math.random()<.6&&this.shot("cloth"+Math.floor(Math.random()*8),this.lx+o*e*.2,1.1,this.lz+l*e*.2,nt(.5,1)*(.5+.5*Math.min(1.5,t/1.28)),nt(.9,1.1),.1)}handle(e){this.live&&this.shot("handle"+Math.floor(Math.random()*8),this.lx+this.fwx*.15,1.45,this.lz+this.fwz*.15,.9*e,nt(.9,1.1),.02,3e3)}zoomMotor(e){this.live&&this.zoomG.gain.setTargetAtTime(e>.02?nn(-15)*Math.min(1,e*2):0,this.ctx.currentTime,.03)}doorSound(e,t,n,i=1){this.shot(e,t,1.1,n,i,nt(.95,1.05),.4)}update(e,t,n,i,s,a,o,l,c,h,u,f){const d=this.ctx,g=d.currentTime;this.t+=e,this.lx=n,this.lz=s;const v=Math.hypot(a,l)||1;if(this.fwx=a/v,this.fwz=l/v,this.setListener(n,i,s,a,o,l,c,h,u),this.upd-=e,this.upd<=0){this.upd=.09;const m=f.lit.map(I=>({f:I,d:(I.x-n)**2+(I.z-s)**2})).sort((I,U)=>I.d-U.d),p=f.pin||[],x=p.length?m.filter(I=>p.includes(I.f.id)&&I.d<900).slice(0,5):[],b=x.length?[...x,...m.filter(I=>!x.includes(I))].slice(0,ks):m.slice(0,ks),M=x.length?m.filter(I=>!b.includes(I)):m.slice(ks),E=new Set(b.map(I=>I.f.id));for(const I of this.voices)if(I.fix&&!E.has(I.fix.id)){I.g.gain.setTargetAtTime(0,g,.12);const U=I.src;I.src=null,I.fix=null,U&&U.stop(g+.6),this.unbuzz(I,g)}const A=new Set(this.voices.filter(I=>I.fix).map(I=>I.fix.id));for(const I of b){if(A.has(I.f.id))continue;const U=this.voices.find(Le=>!Le.fix);if(!U)break;const Y=I.f,te=(Y.id>>>0)%1e3/1e3;U.fix=Y,this.place(U,Y.x,Mt-.05,Y.z);const xe=Y.state===2?"hum_bad":"hum_"+"abcdef"[Y.voice%6];U.level=nn(-3+7*te+(Y.voice===4?2:0))*(.7+.3*Y.power),U.rate0=1+(te-.5)*.0012,U.src=this.loop(xe,U.g,U.rate0),U.g.gain.setValueAtTime(0,g)}let _=0,T=0;for(const I of this.voices){if(!I.fix)continue;T++;const U=qt(t,n,i,s,I.fix.x,Mt-.1,I.fix.z,!0);_+=U;const Y=f.flick(I.fix.id),te=this.mods.get(I.fix.id),xe=Y<.02?0:.1+.9*Y,Le=Y<.999||!!te;I.g.gain.setTargetAtTime(I.level*Math.pow(.5,U)*xe*this.humMul*(te?te.gain:1),g,Le?.015:.18),I.src&&I.src.playbackRate.setTargetAtTime(I.rate0*(1+this.detune)*(te?te.rate:1),g,.25),te&&te.buzz>.01?(I.bz||(I.bzG=d.createGain(),I.bzG.gain.value=0,I.bzG.connect(I.lp),I.bz=this.loop("hum_bad",I.bzG,nt(.97,1.03))),I.bzG.gain.setTargetAtTime(I.level*Math.pow(.5,U)*te.buzz*(.25+.75*Y),g,.02)):I.bz&&this.unbuzz(I,g),I.lp.frequency.setTargetAtTime(U===0?12e3:Math.max(500,2600/U),g,.2),I.send.gain.setTargetAtTime(.28+.2*Math.min(2,U),g,.3)}let F=0;for(const I of M)F+=1/(1+I.d/60);const R=nn(-13)*Math.max(.3,Math.min(1.5,.3+F/80));this.bed.gain.setTargetAtTime(R*this.humMul,g,1.2),this.hvac.gain.setTargetAtTime(nn(-7)*this.hvacMul,g,1.6);const D=[];for(let I=0;I<f.vents.length;I+=2)D.push([f.vents[I],f.vents[I+1],(f.vents[I]-n)**2+(f.vents[I+1]-s)**2]);D.sort((I,U)=>I[2]-U[2]),this.vent.forEach((I,U)=>{const Y=D[U];if(Y&&Y[2]<400){this.place(I,Y[0],Mt-.05,Y[1]);const te=qt(t,n,i,s,Y[0],Mt-.1,Y[1],!0);I.g.gain.setTargetAtTime(nn(-4)*Math.pow(.5,te),g,.4),I.lp.frequency.setTargetAtTime(te?1800:9e3,g,.3)}else I.g.gain.setTargetAtTime(0,g,.4)});const O=[];for(let I=0;I<16;I++){const U=I/16*Math.PI*2;O.push(this.probe(t,n,s,Math.cos(U),Math.sin(U)))}let V=99,L=0;for(let I=0;I<8;I++){const U=O[I]+O[I+8];U<V&&(V=U),L=Math.max(L,U)}const W=O.reduce((I,U)=>I+U,0)/16,G=(V<2.7&&L>7?1:0)?[1,0,0,0]:W<2.6?[0,1,0,0]:W<6.5?[0,.25,1,0]:[0,0,.4,1];for(let I=0;I<4;I++)this.revW[I]+=(Math.max(0,G[I]+this.revBias[I])-this.revW[I])*.12,this.rev[I].g.gain.setTargetAtTime(this.revW[I]*.8*this.revMul,g,.25);if(this.debug.voices=T,this.debug.bed=R,this.debug.room=this.revW.slice(),this.debug.occl=_,f.door){this.doorV||(this.doorV=this.voice(14,2.2,.7),this.doorV.src=this.loop("outside",this.doorV.g),this.doorV.lp.frequency.value=1500),this.place(this.doorV,f.door[0],1,f.door[1]);const I=qt(t,n,i,s,f.door[0],1,f.door[1],!0);this.doorV.g.gain.setTargetAtTime(nn(2)*Math.pow(.45,I),g,.3)}else this.doorV&&this.doorV.g.gain.setTargetAtTime(0,g,.2);if(f.fridge){this.fridgeV||(this.fridgeV=this.voice(30,1.4,1),this.fridgeV.src=this.loop("fridge",this.fridgeV.g)),this.place(this.fridgeV,f.fridge[0],.5,f.fridge[1]);const I=qt(t,n,i,s,f.fridge[0],.8,f.fridge[1],!0);this.fridgeV.g.gain.setTargetAtTime(nn(0)*Math.pow(.5,I),g,.3),this.fridgeV.lp.frequency.setTargetAtTime(I?1200:1e4,g,.3)}else this.fridgeV&&this.fridgeV.g.gain.setTargetAtTime(0,g,.2)}if(this.nextEvent-=e,this.nextEvent<=0){this.nextEvent=nt(11,34);const m=Math.random(),p=Math.random()*Math.PI*2,x=nt(7,26),b=n+Math.cos(p)*x,M=s+Math.sin(p)*x,E=Math.min(1,x/26),A=5e3-3800*E;m<.42?this.shot("tick"+Math.floor(Math.random()*6),b,Mt+.4,M,nt(1.2,2.4),nt(.9,1.12),.6,A):m<.58?this.shot("tile"+Math.floor(Math.random()*4),n+Math.cos(p)*nt(2,8),Mt,s+Math.sin(p)*nt(2,8),nt(.8,1.6),nt(.9,1.1),.4,7e3):m<.74?this.shot("creak"+Math.floor(Math.random()*5),b,Mt+.5,M,nt(1,2),nt(.85,1.1),.7,A):m<.88?this.shot("far"+Math.floor(Math.random()*5),n+Math.cos(p)*40,1,s+Math.sin(p)*40,nt(3,6),nt(.9,1.05),.8,900):this.shot("pipe"+Math.floor(Math.random()*3),b,Mt+.6,M,nt(1.2,2.2),nt(.92,1.05),.7,A)}if(this.farTone-=e,this.farTone<=0){this.farTone=nt(260,520);const m=Math.random()*Math.PI*2;this.shot("far_tone",n+Math.cos(m)*55,1.2,s+Math.sin(m)*55,4,nt(.92,1.04),1.2,700)}this.nextHandle-=e*(1+3*f.shake),this.nextHandle<=0&&(this.nextHandle=nt(5,16),this.handle(nt(.5,1))),f.idle>14&&Math.random()<e*.05&&this.shot("breath"+Math.floor(Math.random()*3),n+this.fwx*-.1,1.55,s+this.fwz*-.1,1,nt(.95,1.05),.05,6e3)}probe(e,t,n,i,s){let a=.3;const o=18;for(let l=.6;l<=o;l+=.6){if(qt(e,t,1.4,n,t+i*l,1.4,n+s*l))return a;a=l}return o}stop(){if(this.live=!1,!this.ctx)return;try{this.master.gain.setTargetAtTime(0,this.ctx.currentTime,.01)}catch{}const e=this.ctx;e.close&&setTimeout(()=>e.close().catch(()=>{}),60)}}function Do(r,e){if(e===0)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),r;if(e===2||e===1){let t=r.getIndex();if(t===null){const s=[],a=r.getAttribute("position");if(a!==void 0){for(let o=0;o<a.count;o++)s.push(o);r.setIndex(s),t=r.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),r}const n=t.count-2,i=[];if(e===2)for(let s=1;s<=n;s++)i.push(t.getX(0)),i.push(t.getX(s)),i.push(t.getX(s+1));else for(let s=0;s<n;s++)s%2===0?(i.push(t.getX(s)),i.push(t.getX(s+1)),i.push(t.getX(s+2))):(i.push(t.getX(s+2)),i.push(t.getX(s+1)),i.push(t.getX(s)));return i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),r}function km(r){const e=new Map,t=new Map,n=r.clone();return vl(r,n,function(i,s){e.set(s,i),t.set(i,s)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;const s=i,a=e.get(i),o=a.skeleton.bones;s.skeleton=a.skeleton.clone(),s.bindMatrix.copy(a.bindMatrix),s.skeleton.bones=o.map(function(l){return t.get(l)}),s.bind(s.skeleton,s.bindMatrix)}),n}function vl(r,e,t){t(r,e);for(let n=0;n<r.children.length;n++)vl(r.children[n],e.children[n],t)}class Gm extends Bi{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new qm(t)}),this.register(function(t){return new Ym(t)}),this.register(function(t){return new Km(t)}),this.register(function(t){return new i0(t)}),this.register(function(t){return new s0(t)}),this.register(function(t){return new r0(t)}),this.register(function(t){return new $m(t)}),this.register(function(t){return new Jm(t)}),this.register(function(t){return new Qm(t)}),this.register(function(t){return new jm(t)}),this.register(function(t){return new Xm(t)}),this.register(function(t){return new e0(t)}),this.register(function(t){return new Zm(t)}),this.register(function(t){return new n0(t)}),this.register(function(t){return new t0(t)}),this.register(function(t){return new Vm(t)}),this.register(function(t){return new Io(t,Ve.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Io(t,Ve.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new a0(t)})}load(e,t,n,i){const s=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=ts.extractUrlBase(e);a=ts.resolveURL(c,this.path)}else a=ts.extractUrlBase(e);this.manager.itemStart(e);const o=function(c){i?i(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},l=new il(this.manager);l.setPriority(this.priority),l.setCache(this.cache),l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{s.parse(c,a,function(h){t(h),s.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let s;const a={},o={},l=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===xl){try{a[Ve.KHR_BINARY_GLTF]=new o0(e)}catch(u){i&&i(u);return}s=JSON.parse(a[Ve.KHR_BINARY_GLTF].content)}else s=JSON.parse(l.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new M0(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,priority:this.priority,cache:this.cache,withCredentials:this.withCredentials,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(s.extensionsUsed)for(let h=0;h<s.extensionsUsed.length;++h){const u=s.extensionsUsed[h],f=s.extensionsRequired||[];switch(u){case Ve.KHR_MATERIALS_UNLIT:a[u]=new Wm;break;case Ve.KHR_DRACO_MESH_COMPRESSION:a[u]=new l0(s,this.dracoLoader);break;case Ve.KHR_TEXTURE_TRANSFORM:a[u]=new c0;break;case Ve.KHR_MESH_QUANTIZATION:a[u]=new h0;break;default:f.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}}function Hm(){let r={};return{get:function(e){return r[e]},add:function(e,t){r[e]=t},remove:function(e){delete r[e]},removeAll:function(){r={}}}}function mt(r,e,t){const n=r.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}const Ve={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DIFFUSE_ROUGHNESS:"KHR_materials_diffuse_roughness",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class Vm{constructor(e){this.parser=e,this.name=Ve.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const s=t.json,l=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e];let c;const h=new Fe(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],Kt);const u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new rh(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new ih(h),c.distance=u;break;case"spot":c=new th(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Sn(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,s=n.json.nodes[e],o=(s.extensions&&s.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}}class Wm{constructor(){this.name=Ve.KHR_MATERIALS_UNLIT}getMaterialType(){return Ai}extendParams(e,t,n){const i=[];e.color=new Fe(1,1,1),e.opacity=1;const s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){const a=s.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],Kt),e.opacity=a[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,Pt))}return Promise.all(i)}}class Xm{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}}class qm{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return mt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){const s=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Ue(s,s)}return Promise.all(i)}}class Ym{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_DIFFUSE_ROUGHNESS}getMaterialType(e){return mt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return t.diffuseRoughness=n.diffuseRoughnessFactor!==void 0?n.diffuseRoughnessFactor:0,n.diffuseRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"diffuseRoughnessMap",n.diffuseRoughnessTexture)),Promise.all(i)}}class Km{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_DISPERSION}getMaterialType(e){return mt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}}class Zm{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return mt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessMinimum=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessMaximum=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}}class $m{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_SHEEN}getMaterialType(e){return mt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(t.sheenColor=new Fe(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){const s=n.sheenColorFactor;t.sheenColor.setRGB(s[0],s[1],s[2],Kt)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,Pt)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}}class Jm{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return mt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}}class Qm{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_VOLUME}getMaterialType(e){return mt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;const s=n.attenuationColor||[1,1,1];return t.attenuationColor=new Fe().setRGB(s[0],s[1],s[2],Kt),Promise.all(i)}}class jm{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_IOR}getMaterialType(e){return mt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}}class e0{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_SPECULAR}getMaterialType(e){return mt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));const s=n.specularColorFactor||[1,1,1];return t.specularColor=new Fe().setRGB(s[0],s[1],s[2],Kt),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,Pt)),Promise.all(i)}}class t0{constructor(e){this.parser=e,this.name=Ve.EXT_MATERIALS_BUMP}getMaterialType(e){return mt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}}class n0{constructor(e){this.parser=e,this.name=Ve.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return mt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}}class i0{constructor(e){this.parser=e,this.name=Ve.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const s=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,a)}}class s0{constructor(e){this.parser=e,this.name=Ve.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;const a=s.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class r0{constructor(e){this.parser=e,this.name=Ve.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;const a=s.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class Io{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(o){const l=i.byteOffset||0,c=i.byteLength||0,h=i.count,u=i.byteStride,f=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,f,i.mode,i.filter).then(function(d){return d.buffer}):a.ready.then(function(){const d=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(d),h,u,f,i.mode,i.filter),d})})}else return null}}class a0{constructor(e){this.name=Ve.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const c of i.primitives)if(c.mode!==sn.TRIANGLES&&c.mode!==sn.TRIANGLE_STRIP&&c.mode!==sn.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],l={};for(const c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{const h=c.pop(),u=h.isGroup?h.children:[h],f=c[0].count,d=[];for(const g of u){const v=new Oe,m=new B,p=new zn,x=new B(1,1,1),b=new Ko(g.geometry,g.material,f);for(let E=0;E<f;E++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,E),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,E),l.SCALE&&x.fromBufferAttribute(l.SCALE,E),b.setMatrixAt(E,v.compose(m,p,x));let M=null;for(const E in l)if(E==="_COLOR_0"){const A=l[E];b.instanceColor=new is(A.array,A.itemSize,A.normalized)}else if(E!=="TRANSLATION"&&E!=="ROTATION"&&E!=="SCALE"){if(M===null){const _=b.geometry;M=new Vt,M.name=_.name;for(const T in _.attributes)M.setAttribute(T,_.attributes[T]);for(const T in _.morphAttributes)M.morphAttributes[T]=_.morphAttributes[T];_.index!==null&&M.setIndex(_.index),M.morphTargetsRelative=_.morphTargetsRelative;for(const T of _.groups)M.addGroup(T.start,T.count,T.materialIndex);_.boundingBox!==null&&(M.boundingBox=_.boundingBox.clone()),_.boundingSphere!==null&&(M.boundingSphere=_.boundingSphere.clone()),M.drawRange.start=_.drawRange.start,M.drawRange.count=_.drawRange.count,M.userData=Object.assign({},_.userData),b.geometry=M}const A=l[E];M.setAttribute(E,new is(A.array,A.itemSize,A.normalized))}pt.prototype.copy.call(b,g),this.parser.assignFinalMaterial(b),d.push(b)}return h.isGroup?(h.clear(),h.add(...d),h):d[0]}))}}const xl="glTF",$i=12,Fo={JSON:1313821514,BIN:5130562};class o0{constructor(e){this.name=Ve.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,$i),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==xl)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-$i,s=new DataView(e,$i);let a=0;for(;a<i;){const o=s.getUint32(a,!0);a+=4;const l=s.getUint32(a,!0);if(a+=4,l===Fo.JSON){const c=new Uint8Array(e,$i+a,o);this.content=n.decode(c)}else if(l===Fo.BIN){const c=$i+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class l0{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ve.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(const h in a){const u=Hr[h]||h.toLowerCase();o[u]=a[h]}for(const h in e.attributes){const u=Hr[h]||h.toLowerCase();if(a[h]!==void 0){const f=n.accessors[e.attributes[h]],d=Pi[f.componentType];c[u]=d.name,l[u]=f.normalized===!0}}return t.getDependency("bufferView",s).then(function(h){return new Promise(function(u,f){i.decodeDracoFile(h,function(d){for(const g in d.attributes){const v=d.attributes[g],m=l[g];m!==void 0&&(v.normalized=m)}u(d)},o,c,Kt,f)})})}}class c0{constructor(){this.name=Ve.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){const n=Math.cos(e.rotation),i=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*i,e.offset.x,-e.repeat.x*i,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}}class h0{constructor(){this.name=Ve.KHR_MESH_QUANTIZATION}}class Ml extends Ni{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[s+a];return t}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=i-t,u=(n-t)/h,f=u*u,d=f*u,g=e*c,v=g-c,m=-2*d+3*f,p=d-f,x=1-m,b=p-f+u;for(let M=0;M!==o;M++){const E=a[v+M+o],A=a[v+M+l]*h,_=a[g+M+o],T=a[g+M]*h;s[M]=x*E+b*A+m*_+p*T}return s}}const u0=new zn;class f0 extends Ml{interpolate_(e,t,n,i){const s=super.interpolate_(e,t,n,i);return u0.fromArray(s).normalize().toArray(s),s}}const sn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Pi={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},No={9728:1003,9729:1006,9984:1004,9985:1007,9986:1005,9987:1008},Uo={33071:1001,33648:1002,10497:1e3},Fr={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Hr={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Kn={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},d0={CUBICSPLINE:void 0,LINEAR:2301,STEP:2300},Nr={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function p0(r){return r.DefaultMaterial===void 0&&(r.DefaultMaterial=new jr({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:0})),r.DefaultMaterial}function oi(r,e,t){for(const n in t.extensions)r[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Sn(r,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(r.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function m0(r,e,t){let n=!1,i=!1,s=!1;for(let c=0,h=e.length;c<h;c++){const u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(r);const a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){const u=e[c];if(n){const f=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):r.attributes.position;a.push(f)}if(i){const f=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):r.attributes.normal;o.push(f)}if(s){const f=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):r.attributes.color;l.push(f)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){const h=c[0],u=c[1],f=c[2];return n&&(r.morphAttributes.position=h),i&&(r.morphAttributes.normal=u),s&&(r.morphAttributes.color=f),r.morphTargetsRelative=!0,r})}function g0(r,e){if(r.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)r.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(r.morphTargetInfluences.length===t.length){r.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)r.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function _0(r){let e;const t=r.extensions&&r.extensions[Ve.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Ur(t.attributes):e=r.indices+":"+Ur(r.attributes)+":"+r.mode,r.targets!==void 0)for(let n=0,i=r.targets.length;n<i;n++)e+=":"+Ur(r.targets[n]);return e}function Ur(r){let e="";const t=Object.keys(r).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+r[t[n]]+";";return e}function Vr(r){switch(r){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function v0(r){return r.search(/\.jpe?g($|\?)/i)>0||r.search(/^data\:image\/jpeg/)===0?"image/jpeg":r.search(/\.webp($|\?)/i)>0||r.search(/^data\:image\/webp/)===0?"image/webp":r.search(/\.ktx2($|\?)/i)>0||r.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const x0=new Oe;class M0{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Hm,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const l=o.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,s=o.indexOf("Firefox")>-1,a=s?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&a<98?(this.textureLoader=new jc(this.options.manager),this.textureLoader.setPriority(this.options.priority),this.textureLoader.setCache(this.options.cache)):(this.textureLoader=new ah(this.options.manager),this.textureLoader.setPriority(this.options.priority),this.textureLoader.setCache(this.options.cache)),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setWithCredentials(this.options.withCredentials),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new il(this.options.manager),this.fileLoader.setPriority(this.options.priority),this.fileLoader.setCache(this.options.cache),this.fileLoader.setResponseType("arraybuffer"),(this.options.withCredentials||this.options.crossOrigin==="use-credentials")&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return oi(s,o,i),Sn(o,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(const l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){const a=t[i].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let i=0,s=e.length;i<s;i++){const a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),s=(a,o)=>{const l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(const[c,h]of a.children.entries())s(h,o.children[c])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const s=e(t[i]);s&&n.push(s)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ve.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(s,a){n.load(ts.resolveURL(t.uri,i.path),s,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const a=Fr[i.type],o=Pi[i.componentType],l=i.normalized===!0,c=new o(i.count*a);return Promise.resolve(new dt(c,a,l))}const s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(a){const o=a[0],l=Fr[i.type],c=Pi[i.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,f=i.byteOffset||0,d=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,g=i.normalized===!0;let v,m;if(d&&d!==u){const p=Math.floor(f/d),x="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+p+":"+i.count;let b=t.cache.get(x);b||(v=new c(o,p*d,i.count*d/h),b=new _c(v,d/h),t.cache.add(x,b)),m=new Zr(b,l,f%d/h,g)}else o===null?v=new c(i.count*l):v=new c(o,f,i.count*l),m=new dt(v,l,g);if(i.sparse!==void 0){const p=Fr.SCALAR,x=Pi[i.sparse.indices.componentType],b=i.sparse.indices.byteOffset||0,M=i.sparse.values.byteOffset||0,E=new x(a[1],b,i.sparse.count*p),A=new c(a[2],M,i.sparse.count*l);o!==null&&(m=new dt(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let _=0,T=E.length;_<T;_++){const F=E[_];if(m.setX(F,A[_*l]),l>=2&&m.setY(F,A[_*l+1]),l>=3&&m.setZ(F,A[_*l+2]),l>=4&&m.setW(F,A[_*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){const t=this.json,n=this.options,s=t.textures[e].source,a=t.images[s];let o=this.textureLoader;if(a.uri){const l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,s,o)}loadTextureImage(e,t,n){const i=this,s=this.json,a=s.textures[e],o=s.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const f=(s.samplers||{})[a.sampler]||{};return h.magFilter=No[f.magFilter]||1006,h.minFilter=No[f.minFilter]||1008,h.wrapS=Uo[f.wrapS]||1e3,h.wrapT=Uo[f.wrapT]||1e3,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==1003&&h.minFilter!==1006,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(f=>f.clone());const a=i.images[e],o=self.URL||self.webkitURL;let l=a.uri||"",c=!1,h;if(t.isKTX2Loader===!0&&a.bufferView!==void 0)h=n.getDependency("bufferView",a.bufferView).then(function(f){return new Promise(function(d,g){t.parse(f,d,g)})});else{if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(f){c=!0;const d=new Blob([f],{type:a.mimeType});return l=o.createObjectURL(d),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");h=Promise.resolve(l).then(function(f){return new Promise(function(d,g){let v=d;t.isImageBitmapLoader===!0&&(v=function(m){const p=new yt(m);p.needsUpdate=!0,d(p)}),t.load(ts.resolveURL(f,s.path),v,void 0,g)})})}const u=h.then(function(f){return c===!0&&o.revokeObjectURL(l),Sn(f,a),f.userData.mimeType=a.mimeType||v0(a.uri),f}).catch(function(f){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),f});return this.sourceCache[e]=u,u}assignTexture(e,t,n,i){const s=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),s.extensions[Ve.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[Ve.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const l=s.associations.get(a);a=s.extensions[Ve.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),s.associations.set(a,l)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new $o,Tn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new Zo,Tn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(i||s||a){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),s&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),s&&(l.vertexColors=!0),a&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return jr}loadMaterial(e){const t=this,n=this.json,i=this.extensions,s=n.materials[e];let a;const o={},l=s.extensions||{},c=[];if(l[Ve.KHR_MATERIALS_UNLIT]){const u=i[Ve.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),c.push(u.extendParams(o,s,t))}else{const u=s.pbrMetallicRoughness||{};if(o.color=new Fe(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){const f=u.baseColorFactor;o.color.setRGB(f[0],f[1],f[2],Kt),o.opacity=f[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",u.baseColorTexture,Pt)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(f){return f.getMaterialType&&f.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(f){return f.extendMaterialParams&&f.extendMaterialParams(e,o)})))}s.doubleSided===!0&&(o.side=2);const h=s.alphaMode||Nr.OPAQUE;if(h===Nr.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===Nr.MASK&&(o.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&a!==Ai&&(c.push(t.assignTexture(o,"normalMap",s.normalTexture)),o.normalScale=new Ue(1,1),s.normalTexture.scale!==void 0)){const u=s.normalTexture.scale;o.normalScale.set(u,u)}if(s.occlusionTexture!==void 0&&a!==Ai&&(c.push(t.assignTexture(o,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&a!==Ai){const u=s.emissiveFactor;o.emissive=new Fe().setRGB(u[0],u[1],u[2],Kt)}return s.emissiveTexture!==void 0&&a!==Ai&&c.push(t.assignTexture(o,"emissiveMap",s.emissiveTexture,Pt)),Promise.all(c).then(function(){const u=new a(o);return s.name&&(u.name=s.name),Sn(u,s),t.associations.set(u,{materials:e}),s.extensions&&oi(i,u,s),u})}createUniqueName(e){const t=st.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function s(o){return n[Ve.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return Oo(l,o,t)})}const a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o],h=_0(c),u=i[h];if(u)a.push(u.promise);else{let f;c.extensions&&c.extensions[Ve.KHR_DRACO_MESH_COMPRESSION]?f=s(c):f=Oo(new Vt,c,t),c.mode===sn.TRIANGLE_STRIP?f=f.then(d=>Do(d,1)):c.mode===sn.TRIANGLE_FAN&&(f=f.then(d=>Do(d,2))),i[h]={primitive:c,promise:f},a.push(f)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,i=this.extensions,s=n.meshes[e],a=s.primitives,o=[];for(let l=0,c=a.length;l<c;l++){const h=a[l].material===void 0?p0(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(async function(l){const c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let d=0,g=h.length;d<g;d++){const v=h[d],m=a[d];let p;const x=c[d];if(m.mode===sn.TRIANGLES||m.mode===sn.TRIANGLE_STRIP||m.mode===sn.TRIANGLE_FAN||m.mode===void 0){const b=s.isSkinnedMesh===!0,M=v.hasAttribute("skinIndex")&&v.hasAttribute("skinWeight");b&&M===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),p=b&&M?new bc(v,x):new bt(v,x),p.isSkinnedMesh===!0&&p.normalizeSkinWeights()}else if(m.mode===sn.LINES)p=new wc(v,x);else if(m.mode===sn.LINE_STRIP)p=new Qr(v,x);else if(m.mode===sn.LINE_LOOP)p=new Rc(v,x);else if(m.mode===sn.POINTS)p=new Cc(v,x);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&g0(p,s),p.name=t.createUniqueName(s.name||"mesh_"+e),Sn(p,s),m.extensions&&oi(i,p,m),t.assignFinalMaterial(p),u.push(p)}for(let d=0,g=u.length;d<g;d++)t.associations.set(u[d],{meshes:e,primitives:d});if(u.length===1)return s.extensions&&oi(i,u[0],s),u[0];const f=new an;s.extensions&&oi(i,f,s),t.associations.set(f,{meshes:e});for(let d=0,g=u.length;d<g;d++)f.add(u[d]);return f})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Yt(Jl.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new tr(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Sn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const s=i.pop(),a=i,o=[],l=[];for(let c=0,h=a.length;c<h;c++){const u=a[c];if(u){o.push(u);const f=new Oe;s!==null&&f.fromArray(s.array,c*16),l.push(f)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new $r(o,l)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let u=0,f=i.channels.length;u<f;u++){const d=i.channels[u],g=i.samplers[d.sampler],v=d.target,m=v.node,p=i.parameters!==void 0?i.parameters[g.input]:g.input,x=i.parameters!==void 0?i.parameters[g.output]:g.output;v.node!==void 0&&(a.push(this.getDependency("node",m)),o.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",x)),c.push(g),h.push(v))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){const f=u[0],d=u[1],g=u[2],v=u[3],m=u[4],p=[];for(let b=0,M=f.length;b<M;b++){const E=f[b],A=d[b],_=g[b],T=v[b],F=m[b];if(E===void 0)continue;E.updateMatrix&&E.updateMatrix();const R=n._createAnimationTracks(E,A,_,T,F);if(R)for(let D=0;D<R.length;D++)p.push(R[D])}const x=new qc(s,void 0,p);return Sn(x,i),x})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){const a=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=i.weights.length;l<c;l++)o.morphTargetInfluences[l]=i.weights[l]}),a})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),a=[],o=i.children||[];for(let c=0,h=o.length;c<h;c++)a.push(n.getDependency("node",o[c]));const l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(a),l]).then(function(c){const h=c[0],u=c[1],f=c[2];f!==null&&h.traverse(function(d){d.isSkinnedMesh&&d.bind(f,x0)});for(let d=0,g=u.length;d<g;d++)h.add(u[d]);if(h.userData.pivot!==void 0&&u.length>0){const d=h.userData.pivot,g=u[0];h.pivot=new B().fromArray(d),h.position.x-=d[0],h.position.y-=d[1],h.position.z-=d[2],g.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const s=t.nodes[e],a=s.name?i.createUniqueName(s.name):"",o=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),s.camera!==void 0&&o.push(i.getDependency("camera",s.camera).then(function(c){return i._getNodeRef(i.cameraCache,s.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(s.isBone===!0?h=new Yo:c.length>1?h=new an:c.length===1?h=c[0]:h=new pt,h!==c[0])for(let u=0,f=c.length;u<f;u++)h.add(c[u]);if(s.name&&(h.userData.name=s.name,h.name=a),Sn(h,s),s.extensions&&oi(n,h,s),s.matrix!==void 0){const u=new Oe;u.fromArray(s.matrix),h.applyMatrix4(u)}else s.translation!==void 0&&h.position.fromArray(s.translation),s.rotation!==void 0&&h.quaternion.fromArray(s.rotation),s.scale!==void 0&&h.scale.fromArray(s.scale);if(!i.associations.has(h))i.associations.set(h,{});else if(s.mesh!==void 0&&i.meshCache.refs[s.mesh]>1){const u=i.associations.get(h);i.associations.set(h,{...u})}return i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,s=new an;n.name&&(s.name=i.createUniqueName(n.name)),Sn(s,n),n.extensions&&oi(t,s,n);const a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(i.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,u=l.length;h<u;h++){const f=l[h];f.parent!==null?s.add(km(f)):s.add(f)}const c=h=>{const u=new Map;for(const[f,d]of i.associations)(f instanceof Tn||f instanceof yt)&&u.set(f,d);return h.traverse(f=>{const d=i.associations.get(f);d!=null&&u.set(f,d)}),u};return i.associations=c(s),s})}_createAnimationTracks(e,t,n,i,s){const a=[],o=e.name?e.name:e.uuid,l=[];function c(d){d.morphTargetInfluences&&l.push(d.name?d.name:d.uuid)}Kn[s.path]===Kn.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(o);let h;switch(Kn[s.path]){case Kn.weights:h=rs;break;case Kn.rotation:h=as;break;case Kn.translation:case Kn.scale:h=$s;break;default:n.itemSize===1?h=rs:h=$s;break}const u=i.interpolation!==void 0?d0[i.interpolation]:2301,f=this._getArrayFromAccessor(n);for(let d=0,g=l.length;d<g;d++){const v=new h(l[d]+"."+Kn[s.path],t.array,f,u);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(v),a.push(v)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=Vr(t.constructor),i=new Float32Array(t.length);for(let s=0,a=t.length;s<a;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof as?f0:Ml;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function S0(r,e,t){const n=e.attributes,i=new kn;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(i.set(new B(l[0],l[1],l[2]),new B(c[0],c[1],c[2])),o.normalized){const h=Vr(Pi[o.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const s=e.targets;if(s!==void 0){const o=new B,l=new B;for(let c=0,h=s.length;c<h;c++){const u=s[c];if(u.POSITION!==void 0){const f=t.json.accessors[u.POSITION],d=f.min,g=f.max;if(d!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(d[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(d[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(d[2]),Math.abs(g[2]))),f.normalized){const v=Vr(Pi[f.componentType]);l.multiplyScalar(v)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}r.boundingBox=i;const a=new ln;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,r.boundingSphere=a}function Oo(r,e,t){const n=e.attributes,i=[];function s(a,o){return t.getDependency("accessor",a).then(function(l){r.setAttribute(o,l)})}for(const a in n){const o=Hr[a]||a.toLowerCase();o in r.attributes||i.push(s(n[a],o))}if(e.indices!==void 0&&!r.index){const a=t.getDependency("accessor",e.indices).then(function(o){r.setIndex(o)});i.push(a)}return Xe.workingColorSpace!==Kt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Xe.workingColorSpace}" not supported.`),Sn(r,e),S0(r,e,t),Promise.all(i).then(function(){return e.targets!==void 0?m0(r,e.targets,t):r})}const y0=[["wall_a.jpg",!0,!0],["wall_n.jpg",!1,!0],["wall_o.jpg",!1,!0],["tile_a.jpg",!0,!1],["tile_n.jpg",!1,!1],["tile_o.jpg",!1,!1],["carpet_a.jpg",!0,!0],["carpet_n.jpg",!1,!0],["carpet_o.jpg",!1,!0],["noise.png",!1,!0],["smooth.png",!1,!0]];async function b0(r,e){const t={};return await Promise.all(y0.map(async([n,i,s])=>{const a=await(await fetch(r+"tex/"+n)).blob(),o=await createImageBitmap(a,{imageOrientation:"flipY",premultiplyAlpha:"none",colorSpaceConversion:"none"}),l=new yt(o);l.flipY=!1,l.premultiplyAlpha=!1,l.colorSpace=i?Pt:"",l.wrapS=l.wrapT=s?1e3:1001;const c=n.split(".")[0];if(c==="noise"?(l.minFilter=1006,l.magFilter=1006,l.generateMipmaps=!1):(l.minFilter=1008,l.magFilter=1006,l.generateMipmaps=!0,l.anisotropy=c==="smooth"?1:e),c==="smooth")try{const h=document.createElement("canvas");h.width=o.width,h.height=o.height;const u=h.getContext("2d",{willReadFrequently:!0});u.drawImage(o,0,0),l.userData.px={w:o.width,h:o.height,d:u.getImageData(0,0,o.width,o.height).data}}catch{}l.needsUpdate=!0,t[c]=l})),t}function Or(r,e){const t=r.geometry,n=new Vt,i=new Oe().multiplyMatrices(e,r.matrixWorld),s=t.attributes.position.clone();s.applyMatrix4(i),n.setAttribute("position",s);const a=t.attributes.normal.clone();a.applyNormalMatrix(new ze().getNormalMatrix(i)),n.setAttribute("normal",a),t.attributes.uv&&n.setAttribute("uv",t.attributes.uv.clone());const o=t.attributes.color;if(o){const l=new Float32Array(o.count*3);for(let c=0;c<o.count;c++)l[c*3]=o.getX(c),l[c*3+1]=o.getY(c),l[c*3+2]=o.getZ(c);n.setAttribute("color",new dt(l,3))}return t.index&&n.setIndex(t.index.clone()),{geo:n,mat:r.material.name||"paint_white",color:!!o}}function Br(r){const e=new Map;for(const n of r)(e.get(n.mat)||(e.set(n.mat,[]),e.get(n.mat))).push(n);const t=[];for(const[n,i]of e){const s=i.every(p=>p.color);let a=0,o=0;for(const p of i)a+=p.geo.attributes.position.count,o+=p.geo.index?p.geo.index.count:p.geo.attributes.position.count;const l=new Float32Array(a*3),c=new Float32Array(a*3),h=new Float32Array(a*3),u=new Float32Array(a*2),f=new Uint32Array(o);let d=0,g=0,v=!0;for(const p of i){const x=p.geo,b=x.attributes.position.count;if(l.set(x.attributes.position.array,d*3),c.set(x.attributes.normal.array,d*3),s&&h.set(x.attributes.color.array,d*3),x.attributes.uv?u.set(x.attributes.uv.array,d*2):v=!1,x.index)for(let M=0;M<x.index.count;M++)f[g++]=x.index.getX(M)+d;else for(let M=0;M<b;M++)f[g++]=M+d;d+=b,x.dispose()}const m=new Vt;m.setAttribute("position",new dt(l,3)),m.setAttribute("normal",new dt(c,3)),s&&m.setAttribute("color",new dt(h,3)),v&&m.setAttribute("uv",new dt(u,2)),m.setIndex(new dt(f,1)),m.computeBoundingSphere(),t.push({geo:m,mat:n,color:s})}return t}async function T0(r){const e=new Gm,t=new Oe,n=async f=>{const d=await e.parseAsync(await(await fetch(r+"models/"+f+".glb")).arrayBuffer(),"");return d.scene.updateMatrixWorld(!0),d.scene},i=["troffer","outlet","diffuser","sprinkler","fridge","figure"],s=await Promise.all([...i.map(n),n("door")]),a={};i.forEach((f,d)=>{const g=[];s[d].traverse(v=>{v.isMesh&&g.push(Or(v,t))}),a[f]=Br(g)});const o=s[i.length],l=o.getObjectByName("slab"),c=new Oe().copy(l.matrixWorld).invert(),h=[],u=[];return o.traverse(f=>{if(!f.isMesh)return;let d=f,g=!1;for(;d;)d===l&&(g=!0),d=d.parent;g?u.push(Or(f,c)):h.push(Or(f,t))}),{parts:a,doorFixed:Br(h),doorLeaf:Br(u),hinge:new B().setFromMatrixPosition(l.matrixWorld)}}const Lt=St*ne,Ei=new Oe;class E0{constructor(e,t,n,i,s){this.scene=e,this.mats=t,this.models=n,this.ov=i;for(let a=0;a<s;a++){const o=new Worker(new URL(""+new URL("bake-DtidVn3A.js",import.meta.url).href,import.meta.url),{type:"module"}),l={w:o,busy:null};this.workers.push(l),o.onmessage=c=>{const h=l.busy;l.busy=null,this.dead||(this.result(h,c.data),this.pump())},o.onerror=c=>{this.errors.push(String(c.message)),l.busy=null}}}scene;mats;models;ov;map=new Map;lit=[];vents=[];R=3;times=[];baked=0;errors=[];onReady=()=>{};gate=null;zero=(()=>{const e=new Ci(new Uint8Array(4),1,1);return e.needsUpdate=!0,e})();workers=[];queue=[];jobId=1;px=0;pz=0;pcx=1e9;pcz=1e9;dead=!1;get(e,t){const n=e+","+t;let i=this.map.get(n);return i||(i={cx:e,cz:t,key:n,ready:!1,job:0,queued:!1,t0:0,group:null,lm:null,lm2:null,mats:null,lens:null,fixtures:[],vents:[],flickFix:null,flickV:1,doorAmb:null,fridgeAmb:null,tris:0,small:[],fk:[],held:null},this.map.set(n,i),this.request(i)),i}request(e){e.job=this.jobId++,e.queued||(e.queued=!0,this.queue.push(e))}invalidate(e,t,n,i){for(const s of this.map.values()){const a=s.cx*St-8,o=s.cz*St-8;n<a||i<o||e>a+St+16||t>o+St+16||this.request(s)}this.pump()}update(e,t){this.px=e,this.pz=t;const n=Math.floor(e/Lt),i=Math.floor(t/Lt),s=this.R;if(n!==this.pcx||i!==this.pcz){this.pcx=n,this.pcz=i;for(const a of this.map.values()){const o=Math.max(Math.abs(a.cx-n),Math.abs(a.cz-i))<=1;for(const l of a.small)l.visible=o}}for(let a=-s;a<=s;a++)for(let o=-s;o<=s;o++)this.get(n+o,i+a);for(const a of[...this.map.values()])Math.max(Math.abs(a.cx-n),Math.abs(a.cz-i))>s+1?this.drop(a):a.held&&(!this.gate||this.gate(a))&&this.swap(a,a.held);this.pump()}pump(){if(!this.queue.length)return;const e=t=>((t.cx+.5)*Lt-this.px)**2+((t.cz+.5)*Lt-this.pz)**2;for(const t of this.workers){if(t.busy||!this.queue.length)continue;let n=0,i=1/0;for(let a=0;a<this.queue.length;a++){const o=e(this.queue[a]);o<i&&(i=o,n=a)}const s=this.queue.splice(n,1)[0];s.queued=!1,this.map.has(s.key)&&(t.busy=s,s.t0=performance.now(),t.w.postMessage({id:s.job,cx:s.cx,cz:s.cz,ov:this.ov}))}}result(e,t){if(!(!e||this.map.get(e.key)!==e)){if(t.error){this.errors.push(t.error),console.warn("[level0] bake failed",e.key,t.error);return}if(this.times.push(performance.now()-e.t0),this.baked++,t.id===e.job){if(e.group&&this.gate&&!this.gate(e)){e.held=t;return}this.swap(e,t)}}}swap(e,t){e.held=null,this.unbuild(e),this.build(e,t),e.ready=!0,this.relist(),this.onReady(e)}build(e,t){const n=new Ci(t.lm,t.lw,t.lh,1023,1016);n.minFilter=n.magFilter=1006,n.wrapS=n.wrapT=1001,n.generateMipmaps=!1,n.colorSpace="",n.needsUpdate=!0;let i=null;t.lm2&&(i=new Ci(t.lm2,t.lw,t.lh,1023,1016),i.minFilter=i.magFilter=1006,i.wrapS=i.wrapT=1001,i.generateMipmaps=!1,i.colorSpace="",i.needsUpdate=!0);const s=new Map;for(let p=0;p<t.fk.length;p+=2)s.set(t.fk[p]*73856093^t.fk[p+1]*19349663,Math.min(4,p/2));const a=this.mats.forChunk(n,i||this.zero),o=new an;o.matrixAutoUpdate=!1;let l=0;for(const p of["floor","ceil","wall","base","trim"]){const x=t.g[p];if(!x.idx.length)continue;const b=new Vt;b.setAttribute("position",new dt(x.pos,3)),b.setAttribute("normal",new dt(x.nrm,3)),b.setAttribute("lm",new dt(x.uv,2)),b.setIndex(new dt(x.idx,1)),b.boundingSphere=new ln(new B((e.cx+.5)*Lt,Mt/2,(e.cz+.5)*Lt),Lt*.75);const M=new bt(b,a[p]);M.matrixAutoUpdate=!1,o.add(M),l+=x.idx.length/3}const c=t.fx.length/12;e.fixtures=[],e.flickFix=null;const h=new Float32Array(c*4),u=new Float32Array(c*3),f=new Float32Array(c*3);for(let p=0;p<c;p++){const x=p*12,b=t.fx[x],M=t.fx[x+1],E=Math.floor(b/ne),A=Math.floor(M/ne),_={i:E,j:A,x:b,z:M,state:t.fx[x+2],power:t.fx[x+3],tint:[t.fx[x+4],t.fx[x+5],t.fx[x+6]],voice:t.fx[x+7],id:E*73856093^A*19349663};e.fixtures.push(_),_.state===2&&(e.flickFix=_),h.set([_.state,_.power,s.get(_.id)||0,0],p*4),u.set(_.tint,p*3),f.set([t.fx[x+8],t.fx[x+9],t.fx[x+10]],p*3)}const d=this.mats.lens.clone();if(d.uniforms.uTime=this.mats.shared.uTime,d.uniforms.uFog=this.mats.shared.uFog,e.flickFix)for(const p of Object.values(a))p.uniforms.uFlickCol.value.set(e.flickFix.tint[0],e.flickFix.tint[1],e.flickFix.tint[2]);const g=new ln(new B((e.cx+.5)*Lt,Mt/2,(e.cz+.5)*Lt),Lt*.75);e.small=[];const v=(p,x,b,M,E=!1)=>{if(x)for(const A of p){const _=A.geo.clone();for(const[F,[R,D]]of Object.entries(M))_.setAttribute(F,new is(R,D));const T=new Ko(_,A.mat==="lens"?d:this.mats.prop(A.mat,!0,A.color),x);T.boundingSphere=g,T.matrixAutoUpdate=!1,E&&(e.small.push(T),T.visible=Math.max(Math.abs(e.cx-this.pcx),Math.abs(e.cz-this.pcz))<=1);for(let F=0;F<x;F++)b(F),T.setMatrixAt(F,Ei);T.instanceMatrix.needsUpdate=!0,o.add(T),l+=x*(_.index?_.index.count/3:0)}};v(this.models.parts.troffer,c,p=>Ei.makeTranslation(t.fx[p*12],Mt,t.fx[p*12+1]),{aFix:[h,4],aTint:[u,3],aAmb:[f,3]});const m=(p,x,b)=>{const M=p.length/x,E=new Float32Array(M*3);for(let A=0;A<M;A++)E[A*3]=p[A*x+b],E[A*3+1]=p[A*x+b+1],E[A*3+2]=p[A*x+b+2];return E};v(this.models.parts.outlet,t.ol.length/7,p=>{Ei.makeRotationY(t.ol[p*7+3]),Ei.setPosition(t.ol[p*7],t.ol[p*7+1],t.ol[p*7+2])},{aAmb:[m(t.ol,7,4),3]},!0),v(this.models.parts.diffuser,t.df.length/5,p=>Ei.makeTranslation(t.df[p*5],Mt,t.df[p*5+1]),{aAmb:[m(t.df,5,2),3]}),v(this.models.parts.sprinkler,t.sp.length/5,p=>Ei.makeTranslation(t.sp[p*5],Mt,t.sp[p*5+1]),{aAmb:[m(t.sp,5,2),3]},!0),e.vents=[];for(let p=0;p<t.df.length;p+=5)e.vents.push(t.df[p],t.df[p+1]);e.fk=[];for(let p=0;p<t.fk.length;p+=2)e.fk.push(t.fk[p]*73856093^t.fk[p+1]*19349663);e.group=o,e.lm=n,e.lm2=i,e.mats=a,e.lens=d,e.doorAmb=t.doorAmb,e.fridgeAmb=t.fridgeAmb,e.tris=l,this.scene.add(o)}unbuild(e){if(e.group){this.scene.remove(e.group);for(const t of e.group.children){const n=t;n.geometry.dispose(),n.isInstancedMesh&&n.dispose()}for(const t of Object.values(e.mats))t.dispose();e.lens.dispose(),e.lm.dispose(),e.lm2&&e.lm2.dispose(),e.lm2=null,e.group=null,e.mats=null,e.lens=null,e.lm=null,e.small=[]}}drop(e){e.held=null,this.unbuild(e),this.map.delete(e.key);const t=this.queue.indexOf(e);t>=0&&this.queue.splice(t,1),e.queued=!1,e.ready&&this.relist(),e.ready=!1}relist(){this.lit=[],this.vents=[];for(const e of this.map.values())if(e.ready){for(const t of e.fixtures)t.state!==1&&this.lit.push(t);for(const t of e.vents)this.vents.push(t)}}readyAround(e,t,n){const i=Math.floor(e/Lt),s=Math.floor(t/Lt);for(let a=-n;a<=n;a++)for(let o=-n;o<=n;o++){const l=this.map.get(i+o+","+(s+a));if(!l||!l.ready)return!1}return!0}viewDist(e,t){const n=Math.floor(e/Lt),i=Math.floor(t/Lt),s=this.R+1;let a=1/0;for(let o=-s;o<=s;o++)for(let l=-s;l<=s;l++){const c=this.map.get(n+l+","+(i+o));if(c&&c.ready)continue;const h=(n+l)*Lt,u=(i+o)*Lt;a=Math.min(a,Math.hypot(Math.max(h-e,0,e-h-Lt),Math.max(u-t,0,t-u-Lt)))}return a}pending(){let e=this.queue.length;for(const t of this.workers)t.busy&&e++;return e}dispose(){this.zero.dispose(),this.dead=!0;for(const e of this.workers)e.w.terminate();this.workers=[];for(const e of[...this.map.values()])this.drop(e);this.queue=[]}}const Sl=r=>()=>{r|=0,r=r+1831565813|0;let e=Math.imul(r^r>>>15,1|r);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296},yl=r=>r===In||r===rn;class Jn{constructor(e,t,n,i,s,a=!1){this.W=e,this.R=i,this.block=s;const o=this.n=2*i+1;this.i0=t-i,this.j0=n-i,this.dist=new Int16Array(o*o).fill(-1),this.q=new Int32Array(o*o),this.dist[i*o+i]=0,this.q[this.qt++]=i*o+i,a||this.run(1/0)}W;R;block;n;i0;j0;dist;count=0;done=!1;q;qh=0;qt=0;run(e){const t=this.n,n=this.dist,i=this.q,s=this.W,a=this.block,o=(l,c,h,u)=>{if(l<0||c<0||l>=t||c>=t||!yl(h))return;const f=c*t+l;if(n[f]>=0)return;const d=this.i0+l,g=this.j0+c;s.solid(d,g)||a&&a(d,g)||(n[f]=u,i[this.qt++]=f)};for(;this.qh<this.qt&&e-- >0;){const l=i[this.qh++],c=l%t,h=(l-c)/t,u=this.i0+c,f=this.j0+h,d=n[l]+1;this.count++,o(c+1,h,s.edge(u+1,f,1),d),o(c-1,h,s.edge(u,f,1),d),o(c,h+1,s.edge(u,f+1,0),d),o(c,h-1,s.edge(u,f,0),d)}return this.done=this.qh>=this.qt}at(e,t){const n=e-this.i0,i=t-this.j0;return n<0||i<0||n>=this.n||i>=this.n?-1:this.dist[i*this.n+n]}}const bl=[[1,0,1,0,1,-1],[-1,0,0,0,1,1],[0,1,0,1,0,-1],[0,-1,0,0,0,1]];function A0(r,e,t,n,i=!1){const s=[];for(let a=2;a<e.n-2;a++)for(let o=2;o<e.n-2;o++){const l=e.dist[a*e.n+o];if(l<t||l>n)continue;const c=e.i0+o,h=e.j0+a;for(const[u,f,d,g,v,m]of bl){const p=r.edge(c+d,h+g,v);if(i?p===Li:p!==Dt)continue;const x=c+u,b=h+f;if(r.fixture(x,b)||r.diffuser(x,b)||r.solid(x,b)||r.column(x,b)||r.column(x+1,b)||r.column(x,b+1)||r.column(x+1,b+1))continue;const M=v===1?r.edge(u>0?c:c+1,h,1):r.edge(c,f>0?h:h+1,0);!yl(M)||e.at(c-u,h-f)<0||s.push({i:c+d,j:h+g,dir:v,side:m,ai:c,aj:h,bi:x,bj:b,d:l})}}return s}function w0(r){const e=[[r.bi,r.bj,0,Dt],[r.bi,r.bj+1,0,Dt],[r.bi,r.bj,1,Dt],[r.bi+1,r.bj,1,Dt]];for(const t of e)t[0]===r.i&&t[1]===r.j&&t[2]===r.dir&&(t[3]=Li);return e}const Tl=r=>r.dir===0?[(r.i+.5)*ne,r.j*ne,0,r.side]:[r.i*ne,(r.j+.5)*ne,r.side,0];function R0(r,e,t,n){const i=[];for(let s=2;s<e.n-2;s++)for(let a=2;a<e.n-2;a++){const o=e.dist[s*e.n+a];if(o<t||o>n)continue;const l=e.i0+a,c=e.j0+s;if(r.column(l,c)||r.column(l+1,c)||r.column(l,c+1)||r.column(l+1,c+1))continue;const h=[];let u=0;for(const[f,d,g,v,m]of bl){const p=r.edge(l+g,c+v,m);p===Dt?(h.push([f,d]),u++):p!==In&&(u+=9)}u===1&&i.push({i:l,j:c,wx:h[0][0],wz:h[0][1],d:o})}return i}function Xs(r,e,t,n,i,s,a=!1,o,l=!1){const c=A0(r,t,i,s,a),h=t.i0+t.R,u=t.j0+t.R,f=l?Math.min(t.R,s+8):t.R,d=e.fridge;for(let m=c.length-1;m>0;m--){const p=Math.floor(n()*(m+1)),x=c[m];c[m]=c[p],c[p]=x}const g=e.door,v=[];if(g){const m=g.dir===1&&g.side>0?g.i-1:g.i,p=g.dir===0&&g.side>0?g.j-1:g.j;v.push([m,p,0],[m,p+1,0],[m,p,1],[m+1,p,1])}for(const m of c.slice(0,40)){if(o&&o(m)||e.edges.some(b=>!v.some(M=>M[0]===b[0]&&M[1]===b[1]&&M[2]===b[2])&&Math.abs(b[0]-m.bi)<3&&Math.abs(b[1]-m.bj)<3)||d&&Math.max(Math.abs(d.i-m.bi),Math.abs(d.j-m.bj))<4||Math.max(Math.abs(m.bi-h),Math.abs(m.bj-u))<2)continue;const p={...e,edges:[...e.edges.filter(b=>!v.some(M=>M[0]===b[0]&&M[1]===b[1]&&M[2]===b[2])),...w0(m)],solid:[[m.bi,m.bj]],door:{i:m.i,j:m.j,dir:m.dir,side:m.side}};r.setOverrides(p);const x=new Jn(r,h,u,f,d?(b,M)=>b===d.i&&M===d.j:void 0);if(x.at(m.ai,m.aj)>=0&&(l||x.count>t.count*.7))return{ov:p,spot:m};r.setOverrides(e)}return null}function C0(r){const e=Sl(r^1374496523);let t={seed:r,edges:[],solid:[],epochs:[],door:null,fridge:null,dyn:[],dead:[]};const n=new dm(t);let i=0,s=0,a,o=0;for(let g=0;g<60&&(o++,i=Math.floor((e()-.5)*60),s=Math.floor((e()-.5)*60),!(!(n.column(i,s)||n.column(i+1,s)||n.column(i,s+1)||n.column(i+1,s+1))&&(a=new Jn(n,i,s,64),a.count>3500)));g++);const l=(i+.5)*ne+(e()-.5)*.3,c=(s+.5)*ne+(e()-.5)*.3,h=Xs(n,t,a,e,24,42)||Xs(n,t,a,e,12,58)||Xs(n,t,a,e,5,63,!0);let u=null;h&&(t=h.ov,u=h.spot);const f=R0(n,a,22,60);let d=null;for(let g=f.length-1;g>0;g--){const v=Math.floor(e()*(g+1)),m=f[g];f[g]=f[v],f[v]=m}for(const g of f.slice(0,40)){if(u&&Math.max(Math.abs(g.i-u.ai),Math.abs(g.j-u.aj))<14)continue;const v=new Jn(n,i,s,64,(m,p)=>m===g.i&&p===g.j);if(!(u&&v.at(u.ai,u.aj)<0)){t.fridge={i:g.i,j:g.j},d=g;break}}return n.setOverrides(t),{world:n,ov:t,si:i,sj:s,x:l,z:c,spot:u,fspot:d,flood:a,tries:o}}const L0="varying vec3 vL; void main(){ vL = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",P0=`varying vec3 vL; uniform float uZ;
void main(){ vec3 q = (vL - vec3(0.12, 1.02, uZ)) * vec3(1.0, 1.25, 1.5); float g = exp(-dot(q, q) * 4.2);
  gl_FragColor = vec4(vec3(0.000010, 0.000014, 0.000022) + vec3(0.34, 0.56, 1.0) * 0.0011 * g, 1.0); }`,aa="varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",oa=`varying vec2 vUv; uniform vec2 uSize, uFoot; uniform float uK;
void main(){ vec2 p = (vUv - 0.5) * uSize; vec2 d = max(abs(p) - uFoot, 0.0); float r = length(d);
  float a = uK * pow(1.0 - smoothstep(0.0, 0.34, r), 2.2); a = max(a, step(r, 0.0001) * 0.9 * step(0.5, uK)); gl_FragColor = vec4(0.0, 0.0, 0.0, a); }`;function Wr(r,e,t){const n=new an;for(const i of r){const s=e.prop(i.mat,!1,i.color).clone(),a=e.shared;s.uniforms.uL=a.uL,s.uniforms.uLC=a.uLC,s.uniforms.uFog=a.uFog,t.push(s);const o=new bt(i.geo,s);o.frustumCulled=!1,n.add(o)}return n}class D0{group=new an;slab;angle=.21;vel=0;target=.21;x=0;z=0;nx=0;nz=1;ax=1;az=0;placed=!1;box={x0:0,z0:0,x1:0,z1:0};stale=[];own=[];voidMat;voidGeo;opened=!1;constructor(e,t){this.group.add(Wr(e.doorFixed,t,this.own)),this.slab=Wr(e.doorLeaf,t,this.own),this.slab.position.copy(e.hinge),this.group.add(this.slab);const n=.016,i=-ne/2+li/2+n,s=ne/2-li/2-n,a=li/2+.002,o=ne-li/2-n,l=n,c=Mt-n,h=[[i,l,o],[s,l,o],[s,c,o],[i,c,o],[i,l,a],[i,c,a],[s,l,a],[s,c,a]],u=[[0,1,2,3],[4,0,3,5],[1,6,7,2],[4,6,1,0],[5,3,2,7]],f=[],d=[];for(const v of u){const m=f.length/3;for(const p of v)f.push(...h[p]);d.push(m,m+1,m+2,m,m+2,m+3)}this.voidGeo=new Vt,this.voidGeo.setAttribute("position",new dt(new Float32Array(f),3)),this.voidGeo.setIndex(d),this.voidMat=new zt({vertexShader:L0,fragmentShader:P0,side:2,uniforms:{uZ:{value:o}}});const g=new bt(this.voidGeo,this.voidMat);g.frustumCulled=!1,this.group.add(g),this.group.visible=!1}place(e){const[t,n,i,s]=Tl(e);this.x=t,this.z=n,this.nx=i,this.nz=s,this.ax=e.dir===0?1:0,this.az=e.dir===0?0:1,this.group.position.set(t,0,n),this.group.rotation.y=Math.atan2(-i,-s),this.group.visible=!0,this.placed=!0,this.angle=this.target=.21,this.vel=0,this.opened=!1,this.slab.rotation.y=-this.angle;const a=.914/2,o=li/2+.02;this.stale.push(this.box),this.box=e.dir===0?{x0:t-a,x1:t+a,z0:n-o,z1:n+o}:{x0:t-o,x1:t+o,z0:n-a,z1:n+a}}setAmb(e){for(const t of this.own)t.uniforms.uAmb.value.set(e[0],e[1],e[2])}update(e,t,n,i){if(!this.placed)return 0;for(const f of this.stale){const d=i.indexOf(f);d>=0&&i.splice(d,1)}this.stale.length=0;const s=(t-this.x)*this.nx+(n-this.z)*this.nz,a=Math.abs((t-this.x)*this.ax+(n-this.z)*this.az);let o=0;const l=s>-.3&&s<1.75&&a<1.3,c=this.target;this.target=l?1.52:s>3.2||a>3?.21:this.target,this.target>1&&c<1&&(o=1);const h=this.target>this.angle?9:3.2;this.vel+=((this.target-this.angle)*h-this.vel*5.2)*e,this.angle=Math.min(1.56,Math.max(0,this.angle+this.vel*e)),this.slab.rotation.y=-this.angle;const u=i.indexOf(this.box);return this.angle<1.05?u<0&&i.push(this.box):u>=0&&i.splice(u,1),this.angle>1.05&&(this.opened=!0),s<-.16&&s>-1.2&&a<.5&&(o=2),o}dispose(){for(const e of this.own)e.dispose();this.voidMat.dispose(),this.voidGeo.dispose()}}class I0{group=new an;x=0;z=0;placed=!1;box={x0:0,z0:0,x1:0,z1:0};own=[];sm=[];sg;constructor(e,t){this.group.add(Wr(e.parts.fridge,t,this.own)),this.sg=new jn(1,1);const n=(a,o,l,c,h)=>{const u=new zt({vertexShader:aa,fragmentShader:oa,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,uniforms:{uSize:{value:new Ue(a,o)},uFoot:{value:new Ue(l,c)},uK:{value:h}}});this.sm.push(u);const f=new bt(this.sg,u);return f.scale.set(a,o,1),f.renderOrder=2,f},i=n(1.5,1.5,.37,.33,.62);i.rotation.x=-Math.PI/2,i.position.set(0,.004,.02),this.group.add(i);const s=n(1.5,2.3,.36,.84,.36);s.position.set(0,.86,-.398),this.group.add(s),this.group.visible=!1}place(e){const t=ne/2-li/2-.05-.35;this.x=(e.i+.5)*ne+e.wx*t,this.z=(e.j+.5)*ne+e.wz*t,this.group.position.set(this.x,0,this.z),this.group.rotation.y=Math.atan2(-e.wx,-e.wz);const n=e.wx?.36:.39,i=e.wz?.36:.39;this.box={x0:this.x-n,x1:this.x+n,z0:this.z-i,z1:this.z+i},this.group.visible=!0,this.placed=!0}setAmb(e){for(const t of this.own)t.uniforms.uAmb.value.set(e[0],e[1],e[2])}dispose(){for(const e of this.own)e.dispose();for(const e of this.sm)e.dispose();this.sg.dispose()}}const j=(r,e)=>r+Math.random()*(e-r),ot=r=>r[Math.floor(Math.random()*r.length)],F0=r=>{for(;r>Math.PI;)r-=2*Math.PI;for(;r<-Math.PI;)r+=2*Math.PI;return r},dn=(r,e,t)=>{const n=Math.min(1,Math.max(0,(t-r)/(e-r)));return n*n*(3-2*n)},Gs=r=>{const e=Math.sin(r*127.1+311.7)*43758.5453;return e-Math.floor(e)},Hs=St*ne,N0="attribute vec3 color; varying vec3 vP; varying vec3 vN; varying float vAo; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vP = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vAo = color.r; gl_Position = projectionMatrix * viewMatrix * w; }",U0=`uniform vec3 uAmb; uniform vec4 uFog; uniform float uK; varying vec3 vP; varying vec3 vN; varying float vAo;
void main(){ vec3 V = normalize(cameraPosition - vP); float nv = abs(dot(normalize(vN), V)); float a = smoothstep(0.04, 0.42, nv) * uK;
  vec3 c = uAmb * 0.028 * vAo / 3.14159; float d = length(vP - cameraPosition); c = mix(c, uFog.rgb, smoothstep(uFog.w * 0.72, uFog.w, d)); a *= 1.0 - smoothstep(uFog.w * 0.8, uFog.w, d);
  gl_FragColor = vec4(c, a); }`;class O0{group=new an;mat;sh;sg=new jn(1,1);x=0;z=0;up=!1;constructor(e){const t=e.models.parts.figure[0];this.mat=new zt({vertexShader:N0,fragmentShader:U0,transparent:!0,depthWrite:!0,uniforms:{uAmb:{value:new B(.05,.05,.04)},uFog:e.mats.shared.uFog,uK:{value:.94}}});const n=new bt(t.geo,this.mat);n.frustumCulled=!1,n.renderOrder=3,this.group.add(n),this.sh=new zt({vertexShader:aa,fragmentShader:oa,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,uniforms:{uSize:{value:new Ue(1,.9)},uFoot:{value:new Ue(.1,.06)},uK:{value:.42}}});const i=new bt(this.sg,this.sh);i.scale.set(1,.9,1),i.rotation.x=-Math.PI/2,i.position.y=.004,i.renderOrder=2,this.group.add(i),this.group.visible=!1,e.scene.add(this.group)}show(e,t,n,i){this.x=e,this.z=t,this.group.position.set(e,0,t),this.group.rotation.y=n,this.mat.uniforms.uAmb.value.set(i,i*.9,i*.62),this.group.visible=!0,this.up=!0}hide(){this.group.visible=!1,this.up=!1}dispose(e){e.scene.remove(this.group),this.mat.dispose(),this.sh.dispose(),this.sg.dispose()}}class B0{constructor(e){this.h=e,this.activity=Math.random()<.2?j(.12,.3):Math.min(2,Math.max(.55,Math.exp((Math.random()+Math.random()+Math.random()-1.5)*.75))),this.next=j(38,95)/Math.sqrt(this.activity);const t=(n,i,s,a,o,l)=>this.defs.push({name:n,cat:i,tier:s,w:a,cool:o,make:l});t("tape_streaks","tape",0,14,8,()=>this.tStreaks()),t("tape_tracking","tape",0,9,20,()=>this.tTracking()),t("tape_chroma","tape",0,7,25,()=>this.tChroma()),t("tape_level","tape",0,5,30,()=>this.tLevel()),t("tape_dropout","tape",1,7,30,()=>this.tDropout()),t("tape_flagging","tape",1,5,40,()=>this.tFlag()),t("tape_vsync","tape",1,4,45,()=>this.tVsync()),t("tape_crease","tape",1,3,70,()=>this.tCrease()),t("tape_freeze","tape",1,2.5,60,()=>this.tFreeze()),t("tape_skip","tape",2,2,150,()=>this.tSkip()),t("audio_dropout","audio",0,5,30,()=>this.aDrop()),t("audio_static","audio",1,3,45,()=>this.aStatic()),t("audio_muffle","audio",0,4,40,()=>this.aMuffle()),t("audio_level","audio",0,5,30,()=>this.aLevel()),t("focus_hunt","cam",0,4,50,()=>this.cFocus()),t("light_flicker","light",0,10,25,()=>this.lFlicker()),t("light_dim","light",0,5,30,()=>this.lDim()),t("light_hum","light",1,4,60,()=>this.lHum()),t("light_fail","light",1,4,60,()=>this.lFail()),t("light_group","light",1,2.5,120,()=>this.lGroup()),t("light_off","light",2,2.5,180,()=>this.lOff()),t("light_wake","light",2,1,240,()=>this.lWake()),t("sound_mechanical","sound",1,6,60,()=>this.sMech()),t("sound_faint","sound",1,5,60,()=>this.sFaint()),t("sound_wall","sound",1,4,70,()=>this.sWall()),t("hum_quiet","room",1,2.5,120,()=>this.rQuiet()),t("room_tone","room",1,3,120,()=>this.rTone()),t("air_stops","room",2,1.2,300,()=>this.rAir()),t("figure","figure",2,9,150,()=>this.fStand(!1)),t("figure_far","figure",2,3,240,()=>this.fStand(!0)),t("figure_crossing","figure",3,1,400,()=>this.fCross()),t("shadow_wrong","figure",3,1.2,300,()=>this.fShadow()),t("heavy_steps","steps",2,7,200,()=>this.hSteps()),t("plan_change","plan",3,1,400,()=>this.pChange())}h;log=[];live=[];enabled=!0;activity;defs=[];last=new Map;next;fig=null;lastFig=[1e9,1e9];decal=null;queued=[];dynAge=new Map;sweep=[];wantFig=-1;wantFar=!1;wantTry=0;fN=1;names(){return this.defs.map(e=>e.name)}busy(e){return this.live.some(t=>t.def.cat===e)}start(e,t){if(this.busy(e.cat))return!1;const n=e.make();return n?(this.live.push({def:e,run:n,t:0}),this.last.set(e.name,this.h.t),this.log.push({t:+this.h.t.toFixed(2),name:e.name,note:t}),this.log.length>400&&this.log.shift(),!0):!1}force(e){const t=this.defs.find(n=>n.name===e);return!!t&&this.start(t,"forced")}update(e){const t=this.h,n=t.t;t.post.clearFx();for(let a=this.live.length-1;a>=0;a--){const o=this.live[a];o.t+=e;let l=!1;try{l=o.run.step(e,o.t)}catch(c){console.warn("[level0] event",o.def.name,c)}if(!l){try{o.run.end&&o.run.end()}catch{}this.live.splice(a,1)}}for(let a=this.sweep.length-1;a>=0;a--)n>=this.sweep[a].at&&t.chunks.pending()===0&&(t.lightCtl.delete(this.sweep[a].id),this.sweep.splice(a,1));for(let a=this.queued.length-1;a>=0;a--)if(n>=this.queued[a].at){const o=this.queued.splice(a,1)[0],l=this.defs.find(c=>c.name===o.name);l&&this.start(l,"with another")}if(this.wantFig>n&&n>this.wantTry&&this.enabled){this.wantTry=n+.5;const a=this.defs.find(o=>o.name===(this.wantFar?"figure_far":"figure"));!this.busy("figure")&&!this.live.some(o=>o.def.tier>=2)&&(this.fN=.35,this.start(a,"waited"))&&(this.wantFig=-1),this.fN=1}if(!this.enabled||n<this.next)return;const i=this.defs.filter(a=>!this.busy(a.cat)&&n-(this.last.get(a.name)??-1e9)>a.cool&&!(a.tier>=2&&this.live.some(o=>o.def.tier>=2)));let s=!1;for(let a=0;a<5&&i.length&&!s;a++){let o=Math.random()*i.reduce((h,u)=>h+u.w,0),l=0;for(;l<i.length-1&&(o-=i[l].w)>0;)l++;const c=i.splice(l,1)[0];if(s=this.start(c),!s&&(c.name==="figure"||c.name==="figure_far")&&(this.wantFig=n+j(25,80),this.wantFar=c.name==="figure_far"),s&&Math.random()<.035){const h=this.defs.filter(u=>u.cat!==c.cat&&u.tier<=2&&!this.busy(u.cat));h.length&&this.queued.push({at:n+j(.3,4),name:ot(h).name})}}this.next=n+(s?Math.max(16,-Math.log(1-Math.random())*62/this.activity)+(Math.random()<.15?j(60,170):0):j(5,11))}dispose(){for(const t of this.live)try{t.run.end&&t.run.end()}catch{}this.live=[],this.queued=[],this.sweep=[],this.h.post.clearFx(),this.h.lightCtl.clear();const e=this.h.audio;e.humMul=e.hvacMul=e.revMul=1,e.detune=0,e.revBias=[0,0,0,0],e.mods.clear(),this.fig&&(this.fig.dispose(this.h),this.fig=null),this.decal&&(this.h.scene.remove(this.decal),this.decal.material.dispose(),this.decal.geometry.dispose(),this.decal=null)}ang(e,t,n){const i=this.h.view();return F0(Math.atan2(-(e-i.x),-(t-i.z))-n)}los(e,t,n,i=this.h.region){const s=this.h.view();return!qt(i,s.x,s.y,s.z,e,t,n)}timed(e,t,n){return{step:(i,s)=>(t(Math.min(1,s/e),s,i),s<e),end:n}}wall(e,t,n,i,s){const a=this.h.region;let o=Math.floor(e/ne),l=Math.floor(t/ne);const c=n>0?1:-1,h=i>0?1:-1;let u=n!==0?((o+(c>0?1:0))*ne-e)/n:1/0,f=i!==0?((l+(h>0?1:0))*ne-t)/i:1/0;const d=n!==0?ne/Math.abs(n):1/0,g=i!==0?ne/Math.abs(i):1/0;for(let v=0;v<60;v++)if(u<f){const m=Un(a,c>0?o+1:o,l),p=u;if(o+=c,u+=d,p>s)return null;if(m===Dt)return{t:p,nx:-c,nz:0}}else{const m=Nn(a,o,h>0?l+1:l),p=f;if(l+=h,f+=g,p>s)return null;if(m===Dt)return{t:p,nx:0,nz:-h}}return null}open(e,t,n=.34){const i=this.h.region,s=Math.floor(e/ne),a=Math.floor(t/ne),o=e-s*ne,l=t-a*ne;if(this.h.world.solid(s,a)||Un(i,s,a)&&o<n||Un(i,s+1,a)&&ne-o<n||Nn(i,s,a)&&l<n||Nn(i,s,a+1)&&ne-l<n)return!1;for(let c=0;c<2;c++)for(let h=0;h<2;h++)if((Nn(i,s+c,a+h)||Nn(i,s+c-1,a+h)||Un(i,s+c,a+h)||Un(i,s+c,a+h-1))&&Math.hypot(o-c*ne,l-h*ne)<n+.1)return!1;return!0}nearLit=null;lastTry=null;lightAt(e,t){let n=0;for(const i of this.nearLit||this.h.chunks.lit){const s=(i.x-e)**2+(i.z-t)**2;s<60&&(n+=i.power*.3025*1.2/Math.pow(s+1.44,1.5)*(this.h.lightCtl.get(i.id)??1))}return n}fixtures(e,t,n,i=!1,s=!0){const a=this.h,o=a.view(),l=o.hfov/2,c=[];for(const h of a.chunks.map.values())if(h.ready)for(const u of h.fixtures){if(i?u.state!==1:u.state!==0)continue;const f=Math.hypot(u.x-o.x,u.z-o.z);if(f<e||f>t||a.lightCtl.has(u.id))continue;const d=Math.abs(this.ang(u.x,u.z,o.yaw));(n?d>l*.95:d>2.2)||s&&!this.los(u.x,Mt-.05,u.z)||this.clear(u)&&c.push(u)}return c}clear(e){for(const t of this.h.chunks.map.values()){const n=t.cx*Hs-8.4,i=t.cz*Hs-8.4;if(!(e.x<n||e.z<i||e.x>n+Hs+16.8||e.z>i+Hs+16.8)&&(t.fk.length>=5&&!t.fk.includes(e.id)||t.held))return!1}return!0}arm(e){const t=this.h,n=t.ov;n.dyn=n.dyn||[];let i=1e9,s=1e9,a=-1e9,o=-1e9,l=!1;for(const c of e){i=Math.min(i,c.i),s=Math.min(s,c.j),a=Math.max(a,c.i),o=Math.max(o,c.j);const h=c.i+","+c.j;this.dynAge.set(h,t.t),t.everDyn.add(c.id),!n.dyn.some(u=>u[0]===c.i&&u[1]===c.j)&&c.state!==2&&(n.dyn.push([c.i,c.j]),l=!0)}return l&&(t.applyOv(),t.chunks.invalidate(i-8,s-8,a+8,o+8)),()=>{if(t.chunks.pending()>0)return!1;for(const c of e){const h=t.chunks.map.get(Math.floor(c.i/St)+","+Math.floor(c.j/St));if(!h||!h.ready||h.held||!h.fk.includes(c.id))return!1}return!0}}lit(e,t,n,i,s=1){const a=this.h;for(const h of e)a.lightCtl.set(h.id,s);const o=this.arm(e);let l=-1,c=0;return{step:(h,u)=>{if(l<0){if(c+=h,c>14)return!1;if(!o())return!0;l=u}const f=u-l;return n(Math.min(1,f/t),f),f<t},end:()=>{for(const h of e)a.audio.mods.delete(h.id);if(i)i();else for(const h of e)a.lightCtl.delete(h.id);this.release(e)}}}release(e){const t=this.h,n=t.ov.dyn||[];let i=1e9,s=1e9,a=-1e9,o=-1e9,l=!1;for(const c of e){const h=n.findIndex(u=>u[0]===c.i&&u[1]===c.j);h<0||(n.splice(h,1),l=!0,i=Math.min(i,c.i),s=Math.min(s,c.j),a=Math.max(a,c.i),o=Math.max(o,c.j))}l&&(t.applyOv(),t.chunks.invalidate(i-8,s-8,a+8,o+8))}stutter(e,t,n=.12){const i=Math.floor(e*5),s=Gs(i*3.77+t),a=Gs(i*9.1+t+4);return s<.45?n+(.5-n)*a:s<.62?.75:1}tStreaks(){const e=j(.07,.3),t=j(.004,.03),n=Math.random()<.3;return this.timed(e,i=>{const s=this.h.post.fx;s.drop=t,n&&(s.chroma=Math.min(s.chroma,.35))})}tTracking(){const e=Math.random()<.7?j(.04,.2):j(.75,.95),t=j(.3,1.6),n=j(-.12,.12),i=j(.35,1),s=Math.random()<.4?j(-14,14):0;return this.timed(t,(a,o)=>{const l=this.h.post.fx,c=Math.sin(Math.PI*a)**.6;l.glitch=i*c,l.track=e+n*o,s&&(l.tearY=e+n*o-.05,l.tearH=.09,l.tear=s*c)})}tChroma(){const e=j(.25,1.3),t=Math.random()<.4?0:j(.15,.55),n=j(-.5,.5),i=j(.2,1),s=Math.random()*99;return this.timed(e,(a,o)=>{const l=this.h.post.fx,c=Math.sin(Math.PI*a)**.5;l.chroma=1-(1-t)*c*(.7+.3*Gs(Math.floor(o*12)+s)),l.hue=n*c*Math.sin(o*9+s),l.bleed=i*c})}tLevel(){const e=j(.3,1.3),t=ot([-1,1])*j(.12,.3),n=Math.random()*99;return this.timed(e,(i,s)=>{this.h.post.fx.level=1+t*Math.sin(Math.PI*i)*(.6+.4*Math.sin(s*17+n))})}tDropout(){const e=this.h,t=j(.05,.22),n=ot(["black","black","snow","part"]),i=j(.25,.7),s=j(.1,.7),a=j(.12,.4),o=Math.random()<.6?j(.01,.05)*ot([-1,1]):0,l=j(-.25,.3);return Math.random()<.7&&e.audio.recDrop(t+j(0,.08),Math.random()<.5?0:.15),this.timed(t+i,(c,h)=>{const u=e.post.fx;if(h<t)n==="black"?u.black=1:n==="snow"?(u.snow=.92,u.chroma=0):(u.bandY=s+a/2,u.bandH=a/2,u.band=1,u.chroma=.2);else{const f=1-(h-t)/i;u.vshift=o*f*f*Math.cos((h-t)*30),u.level=1+l*f*f,u.chroma=1-.6*f*f,u.drop=.004*f}})}tFlag(){const e=j(.5,2.6),t=j(.25,1)*ot([-1,1]),n=Math.random()*9;return this.timed(e,(i,s)=>{this.h.post.fx.flag=t*Math.sin(Math.PI*i)**.7*(.75+.25*Math.sin(s*6+n))})}tVsync(){const e=j(.12,.5),t=j(.02,.16)*ot([-1,1]),n=Math.random()<.25;return this.timed(e,(i,s)=>{const a=this.h.post.fx;a.vshift=n?t*4*i:t*(1-i)*(1-i),a.drop=.003})}tCrease(){const e=Math.random()<.5?1:Math.floor(j(2,4)),t=j(.45,1),n=j(.15,.6),i=j(.03,.09),s=j(.55,1),a=ot([-1,1]);return Math.random()<.4&&this.h.audio.recMuffle(e*(t+n),j(700,1800)),this.timed(e*(t+n),(o,l)=>{const c=this.h.post.fx,h=l%(t+n);if(h<t){const u=h/t;c.bandY=a>0?1.1-1.2*u:-.1+1.2*u,c.bandH=i,c.band=s}})}tFreeze(){const e=j(.05,.14),t=.12;return this.timed(e+t,(n,i)=>{const s=this.h.post.fx;i<e?s.freeze=!0:(s.glitch=.8*(1-(i-e)/t),s.track=.5,s.drop=.01)})}tSkip(){const e=this.h,t=j(.08,.2);let n=!1;return e.audio.recDrop(t,0),this.timed(t+.3,(i,s)=>{const a=e.post.fx;if(s<t){if(a.black=1,!n&&s>t*.5){n=!0;const o=e.rig,l=j(.02,.05)*ot([-1,1]),c=j(.1,.24),h=Math.hypot(o.vx,o.vz),u=h>.3?o.vx/h:-Math.sin(o.yaw),f=h>.3?o.vz/h:-Math.cos(o.yaw);this.open(o.x+u*c,o.z+f*c,.36)&&this.open(o.x+u*c*.5,o.z+f*c*.5,.36)&&(o.x+=u*c,o.z+=f*c),o.yaw+=l,o.yawT+=l,o.pitch+=j(-.015,.015)}}else{const o=1-(s-t)/.3;a.vshift=.03*o*o*Math.cos(s*40),a.chroma=1-.7*o,a.level=1+.2*o}})}aDrop(){return this.h.audio.recDrop(j(.07,.35),Math.random()<.6?0:j(.1,.3)),this.timed(.5,()=>{})}aStatic(){return this.h.audio.tapeStatic("static"+Math.floor(Math.random()*3),j(3.5,5.5)),Math.random()<.35&&this.queued.push({at:this.h.t,name:"tape_streaks"}),this.timed(.5,()=>{})}aMuffle(){const e=j(.4,1.6);return this.h.audio.recMuffle(e,j(600,1500)),this.timed(e+.4,()=>{})}aLevel(){const e=j(.5,2);return this.h.audio.recLevel(Math.random()<.5?j(.45,.75):j(1.25,1.6),e),this.timed(e+.8,()=>{})}cFocus(){const e=this.h.rig,t=j(.7,1.5),n=Math.random()<.5?1/.45:1/30;let i=!1;return this.timed(t,s=>{!i&&s<.3?(e.fInv+=(n-e.fInv)*.1,e.fDelay=.23):i=!0})}lFlicker(){const e=ot(this.fixtures(4,20,Math.random()<.8));if(!e)return null;const t=j(.7,3.2),n=Math.random()*99,i=j(.08,.4),s=j(.5,1.3);return this.lit([e],t+.6,(a,o)=>{const l=o<t?this.stutter(o,n,i):.8+.2*Math.min(1,(o-t)/.6);this.h.lightCtl.set(e.id,l),this.h.audio.mods.set(e.id,{gain:1.15,rate:1+.004*Math.sin(o*7),buzz:o<t?s:s*(1-(o-t)/.6)})})}lDim(){const e=ot(this.fixtures(4,20,Math.random()<.7));if(!e)return null;const t=j(3,11),n=j(.35,.72),i=j(.985,.996),s=Math.random()*9;return this.lit([e],t,(a,o)=>{const l=dn(0,.5,o)*(1-dn(t-1.2,t,o));this.h.lightCtl.set(e.id,1-(1-n)*l*(.93+.07*Math.sin(o*2.3+s))),this.h.audio.mods.set(e.id,{gain:1+.35*l,rate:1-(1-i)*l,buzz:.35*l})})}lHum(){const e=ot(this.fixtures(1.5,9,!1));if(!e)return null;const t=j(18,55),n=ot([j(.955,.985),j(1.012,1.04)]),i=j(1.5,2.2),s=this.h.audio;return{step:(a,o)=>{const l=dn(0,4,o)*(1-dn(t-5,t,o));return s.mods.set(e.id,{gain:1+(i-1)*l,rate:1+(n-1)*l,buzz:.25*l}),o<t},end:()=>{s.mods.delete(e.id)}}}lFail(){const e=ot(this.fixtures(5,22,Math.random()<.75));if(!e)return null;const t=j(4,24),n=Math.random()*99,i=j(.2,.9),s=j(.6,1.8);return this.lit([e],i+t+s,(a,o)=>{const l=o<i?this.stutter(o,n,.2):o<i+t?0:o<i+t+s?this.stutter(o,n+5,.05):1;this.h.lightCtl.set(e.id,l),this.h.audio.mods.set(e.id,{gain:1,rate:1,buzz:o>i+t?.9:.4})})}lGroup(){const e=ot(this.fixtures(3,22,!1)),t=this.fixtures(2,26,!1,!1,!1);if(!e)return null;this.h.view();const n=ot([1,0]),i=t.filter(c=>n?Math.abs(c.z-e.z)<1.3:Math.abs(c.x-e.x)<1.3).sort((c,h)=>n?c.x-h.x:c.z-h.z).slice(0,6);if(i.length<3)return null;Math.random()<.5&&i.reverse();const s=j(.12,.3),a=j(.35,.9),o=Math.random()*99,l=j(.1,.45);return this.lit(i,s*i.length+a+.3,(c,h)=>{i.forEach((u,f)=>{const d=h-f*s,g=d>0&&d<a;this.h.lightCtl.set(u.id,g?this.stutter(d,o+f,l):1),g?this.h.audio.mods.set(u.id,{gain:1.2,rate:.995,buzz:.8}):this.h.audio.mods.delete(u.id)})})}lOff(){const e=ot(this.fixtures(10,30,!0));if(!e)return null;const t=this.h;return this.lit([e],1.2,(n,i)=>{t.lightCtl.set(e.id,i<.25?Gs(Math.floor(i*5)+e.id)<.5?.5:1:0)},()=>{t.lightCtl.set(e.id,0),t.ov.dead=t.ov.dead||[],t.ov.dead.push([e.i,e.j]),t.ov.dead.length>40&&t.ov.dead.shift(),this.sweep.push({id:e.id,at:t.t+8})})}lWake(){const e=ot(this.fixtures(6,24,!0,!0));if(!e)return null;const t=j(.25,1.6),n=Math.random()*99,i=this.h;return this.lit([e],t+.4,(s,a)=>{i.lightCtl.set(e.id,a<t?.35+.65*this.stutter(a,n,.3):0)},()=>{i.lightCtl.set(e.id,0),this.sweep.push({id:e.id,at:i.t+8})},0)}around(e,t,n){const i=this.h.view(),s=i.yaw+(n?Math.PI+j(-1.1,1.1):j(0,Math.PI*2)),a=j(e,t),o=i.x-Math.sin(s)*a,l=i.z-Math.cos(s)*a;return[o,l,qt(this.h.region,i.x,1.5,i.z,o,1.5,l,!0)]}sMech(){const[e,t,n]=this.around(16,32,!1);return this.h.audio.shot("mech"+Math.floor(Math.random()*4),e,j(.5,2.4),t,j(9,15),j(.9,1.08),1,Math.max(420,1800/(1+n*.5)),3,1),this.timed(4,()=>{})}sFaint(){const[e,t]=this.around(14,28,Math.random()<.7);return this.h.audio.shot("faint"+Math.floor(Math.random()*4),e,j(.8,2.2),t,j(6,9),j(.88,1.1),1.2,j(900,2200),3,1),this.timed(6,()=>{})}sWall(){const e=this.h.view();let t=null;for(let a=0;a<12;a++){const o=e.yaw+Math.PI/2*ot([-1,1])+j(-.7,.7)+(Math.random()<.3?Math.PI/2:0),l=this.wall(e.x,e.z,-Math.sin(o),-Math.cos(o),3.4);l&&(!t||l.t<t.t)&&(t={...l,a:o})}if(!t)return null;const n=e.x-Math.sin(t.a)*(t.t+.7),i=e.z-Math.cos(t.a)*(t.t+.7);return this.h.audio.shot("wall"+Math.floor(Math.random()*3),n,j(.6,1.6),i,j(1.8,2.8),j(.9,1.08),.25,j(380,620),1.2,1),Math.random()<.4&&(this.h.rig.kickV-=.004),this.timed(2,()=>{})}rQuiet(){const e=this.h.audio,t=j(7,22),n=j(.06,.22);return{step:(i,s)=>(e.humMul=1-(1-n)*dn(0,2.2,s)*(1-dn(t,t+7,s)),s<t+7),end:()=>{e.humMul=1}}}rTone(){const e=this.h.audio,t=j(20,55),n=ot([0,1,2]),i=j(-.006,-.002);return{step:(s,a)=>{const o=dn(0,5,a)*(1-dn(t-6,t,a));return e.revMul=1+(n===0?1.3:n===1?-.7:.6)*o,e.revBias=n===0?[0,0,0,.9*o]:n===1?[0,.5*o,0,0]:[.7*o,0,0,0],e.detune=i*o,a<t},end:()=>{e.revMul=1,e.revBias=[0,0,0,0],e.detune=0}}}rAir(){const e=this.h.audio,t=j(35,110),[n,i]=this.around(25,40,!1);e.shot("mech3",n,2.4,i,8,.9,1,900,3,1);let s=!1;return{step:(a,o)=>(e.hvacMul=o<t?1-dn(.4,6,o):dn(t,t+9,o),o>t&&!s&&(s=!0,e.shot("mech0",n,2.4,i,7,.85,1,800,3,1)),o<t+9),end:()=>{e.hvacMul=1}}}figure(){return this.fig||(this.fig=new O0(this.h))}fStand(e){const t=this.h,n=t.view(),i=n.hfov/2;this.nearLit=t.chunks.lit.filter(s=>(s.x-n.x)**2+(s.z-n.z)**2<3600);try{return this.fStand2(e,t,n,i)}finally{this.nearLit=null}}fStand2(e,t,n,i){let s=null,a=t.region;e&&(a=t.world.region(Math.floor(n.x/ne)-34,Math.floor(n.z/ne)-34,68,68));let o=1e9,l=0;for(let m=0;m<(e?160:260)*this.fN;m++){const p=e?ot([-1,1])*j(.14,.5)*i:ot([-1,1])*j(.55,.9)*i,x=-Math.sin(n.yaw+p),b=-Math.cos(n.yaw+p),M=this.wall(n.x,n.z,x,b,40),E=M?M.t-.45:40,A=e?21:7.5,_=Math.min(e?35:23,E);if(_<A)continue;const T=j(A,_),F=n.x+x*T,R=n.z+b*T;if(!this.open(F,R,.3)||Math.hypot(F-this.lastFig[0],R-this.lastFig[1])<12)continue;const D=!qt(a,n.x,n.y,n.z,F,2.3,R),O=!qt(a,n.x,n.y,n.z,F,1.4,R);if(!D&&!O)continue;const V=-b,L=x,W=(qt(a,n.x,n.y,n.z,F+V*.22,1.4,R+L*.22)?1:0)+(qt(a,n.x,n.y,n.z,F-V*.22,1.4,R-L*.22)?1:0)+(D&&O?0:1);if(W>=2)continue;const q=this.wall(F,R,x,b,30),G=q?this.lightAt(F+x*Math.max(0,q.t-.15),R+b*Math.max(0,q.t-.15))*(q.t<1.2?1.25:1):.02,I=this.lightAt(F,R),U=G*10+I*4-W*.9+Math.random()*.15;U<o&&(o=U,s=[F,R,I,G],l=W)}if(this.lastTry=s?{bg:+s[3].toFixed(3),lit:+s[2].toFixed(3),hid:l}:null,s&&(l>=1?s[3]>(e?.34:.3):s[3]>(e?.24:.17)||s[2]>.16)&&(s=null),!s)return null;const[c,h,u]=s,f=this.figure();f.show(c,h,Math.atan2(n.x-c,n.z-h)+j(-.25,.25),Math.max(.004,u*.8)),this.lastFig=[c,h];const d=e?j(1.4,4.5):j(14,40);let g=Math.abs(this.ang(c,h,n.yaw)),v=0;return{step:(m,p)=>{const x=t.view(),b=x.hfov/2,M=Math.abs(this.ang(c,h,x.yaw)),E=Math.abs(this.ang(c,h,t.rig.yawT)),A=Math.hypot(c-x.x,h-x.z),_=(M-g)/Math.max(m,.001);g=M;const T=M<b*1.05&&this.los(c,1.9,h,e?a:t.region);if(T&&(v+=m),e?M<b*.1||E<b*.08||t.rig.zoom>.2||A<15:M<b*.44||E<b*.44||_<-1.1&&M<b*1||A<6.5||t.rig.zoomT>t.rig.zoom+.02&&M<b*.9)return!1;if(p>d){if(T){const R=t.post.fx;R.drop=.03,R.glitch=Math.max(R.glitch,.7),R.track=.5+.3*Math.sin(p*40)}return!1}return!0},end:()=>{f.hide(),this.log.push({t:+t.t.toFixed(2),name:e?"figure_far:gone":"figure:gone",note:"in view "+v.toFixed(2)+" s"})}}}fCross(){const e=this.h,t=e.view(),n=t.hfov/2;for(let i=0;i<220;i++){const s=ot([-1,1])*j(.35,.95)*n,a=j(12,25),o=t.x-Math.sin(t.yaw+s)*a,l=t.z-Math.cos(t.yaw+s)*a,c=ot([-1,1]),h=Math.cos(t.yaw+s)*c,u=-Math.sin(t.yaw+s)*c,f=j(1.3,2.8);if(!this.los(o,1.6,l)||this.los(o-h*f,1.6,l-u*f)||this.los(o+h*f,1.6,l+u*f))continue;let d=!0;for(let x=-4;x<=4&&d;x++)d=this.open(o+h*f*x/4,l+u*f*x/4,.2);if(!d)continue;const g=this.figure(),v=j(2.6,3.6),m=2*f/v,p=this.lightAt(o,l);return{step:(x,b)=>{const M=-f+v*b,E=e.view();return g.show(o+h*M,l+u*M,Math.atan2(h,u),Math.max(.004,p*.8)),g.group.position.y=.012*Math.sin(b*9),b<m&&Math.abs(this.ang(o+h*M,l+u*M,E.yaw))>E.hfov/2*.22},end:()=>{g.hide(),g.group.position.y=0}}}return null}fShadow(){const e=this.h,t=e.view(),n=t.hfov/2;for(let i=0;i<24;i++){const s=ot([-1,1])*j(.55,.92)*n,a=-Math.sin(t.yaw+s),o=-Math.cos(t.yaw+s),l=this.wall(t.x,t.z,a,o,14);if(!l||l.t<3.5)continue;const c=t.x+a*l.t+l.nx*.064,h=t.z+o*l.t+l.nz*.064,u=-l.nz,f=l.nx;if(this.lightAt(c,h)<.012)continue;if(!this.decal){const x=new zt({vertexShader:aa,fragmentShader:oa,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3,uniforms:{uSize:{value:new Ue(1.5,3.2)},uFoot:{value:new Ue(.11,.95)},uK:{value:0}}});this.decal=new bt(new jn(1.5,3.2),x),this.decal.renderOrder=2,this.decal.frustumCulled=!1,e.scene.add(this.decal)}const d=this.decal,g=d.material.uniforms.uK,v=j(.12,.3)*ot([-1,1]),m=j(3,8);d.rotation.y=Math.atan2(l.nx,l.nz),d.visible=!0;let p=-1;return{step:(x,b)=>{const M=v*b,E=c+u*M,A=h+f*M,_=e.view(),T=Math.abs(this.ang(E,A,_.yaw));return d.position.set(E,1.25,A),d.rotation.z=.05*Math.sin(b*.9),p<0&&(T<_.hfov/2*.42||b>m)&&(p=b),g.value=p<0?.34*dn(0,1.2,b):.34*Math.max(0,1-(b-p)/.12),p<0||b-p<.12},end:()=>{d.visible=!1,g.value=0}}}return null}hSteps(){const e=this.h,t=e.view(),n=e.audio;if(!n.live)return null;const i=t.yaw+Math.PI+j(-.75,.75),s=ot(["pair","approach","approach","approach","fade"]);let a=j(26,34),o=0,l=0,c=0;const h=Math.floor(s==="pair"?j(1,3):s==="fade"?j(3,6):j(4,10)),u=j(2,3),f={a:i};let d=-1;return{step:(g,v)=>{const m=e.view(),p=m.x-Math.sin(f.a)*a,x=m.z-Math.cos(f.a)*a;if(o>0&&Math.abs(this.ang(p,x,m.yaw))<.62){if(c+=g,c>.25)return this.log.push({t:+e.t.toFixed(2),name:"heavy_steps:looked",note:o+" steps, "+a.toFixed(0)+" m"}),!1}else c=0;if(l-=g,l>0)return!0;if(o>=h||a<7.5)return!1;let b;do b=Math.floor(Math.random()*6);while(b===d);d=b;const M=qt(e.region,m.x,1.5,m.z,p,1.5,x,!0),E=1-Math.min(1,(a-7)/27);return n.shot("heavy"+b,p,.1,x,j(2.8,3.6)*(s==="fade"?Math.max(.35,1-o*.2):1),j(.93,1.05),1.1,(260+1500*E*E)/(1+.35*Math.min(4,M)),4,1),a<15&&(Math.random()<.7&&n.shot("tile"+Math.floor(Math.random()*4),m.x+j(-2,2),Mt,m.z+j(-2,2),.35*E,j(.9,1.1),.3,6e3),e.rig.kickV-=.004*E),o++,s!=="pair"&&s!=="fade"?a-=u*j(.85,1.2):s==="fade"&&(a+=j(0,1.5)),f.a+=j(-.06,.06),l=j(1.7,2.7)*(s==="approach"?1-.25*E:1),!0}}}pChange(){const e=this.h,t=e.view(),n=e.world,i=Math.floor(t.x/ne),s=Math.floor(t.z/ne),a=e.doorCell(),o=e.ov.fridge;for(let l=0;l<60;l++){const c=i+Math.floor(j(-20,20)),h=s+Math.floor(j(-20,20)),u=ot([0,1]),f=u?c*ne:(c+.5)*ne,d=u?(h+.5)*ne:h*ne,g=Math.hypot(f-t.x,d-t.z);if(g<11||g>26||(f-t.x)*t.fx+(d-t.z)*t.fz>-.25*g)continue;const v=n.edge(c,h,u);if(v!==Dt&&v!==rn||this.seesEdge(c,h,u)||a&&Math.abs(a[0]-c)+Math.abs(a[1]-h)<5||o&&Math.abs(o.i-c)+Math.abs(o.j-h)<4||n.column(c,h)||n.column(c+(u?0:1),h+(u?1:0))||e.ov.edges.some(b=>Math.abs(b[0]-c)<3&&Math.abs(b[1]-h)<3))continue;const m=v===Dt?rn:Dt,p=new Jn(n,i,s,30).count;if(e.ov.edges.push([c,h,u,m]),n.setOverrides(e.ov),new Jn(n,i,s,30).count<p*.97){e.ov.edges.pop(),n.setOverrides(e.ov);continue}const x=b=>{const M=b.cx*St-8,E=b.cz*St-8;return c<M||h<E||c>M+St+16||h>E+St+16?!0:!this.seesEdge(c,h,u)};return e.chunks.gate=x,e.applyOv(),e.chunks.invalidate(c-8,h-8,c+8,h+8),e.checkSoon(),this.log.push({t:+e.t.toFixed(2),name:"plan_change:edge",note:[c,h,u,v,m].join(",")}),{step:(b,M)=>M<60&&(e.chunks.pending()>0||[...e.chunks.map.values()].some(E=>E.held)),end:()=>{e.chunks.gate===x&&(e.chunks.gate=null)}}}return null}seesEdge(e,t,n){const i=this.h.view();for(const s of[.1,.5,.9])for(const a of[-.25,.25]){const o=n?e*ne+a:(e+s)*ne,l=n?(t+s)*ne:t*ne+a;if(Math.hypot(o-i.x,l-i.z)<44&&!qt(this.h.region,i.x,i.y,i.z,o,1.2,l))return!0}return!1}}const Bo=St*ne,Vs=22,Qs=r=>{const e=Math.sin(r*127.1+311.7)*43758.5453;return e-Math.floor(e)},z0=(r,e)=>{const t=Math.floor(r),n=r-t,i=n*n*(3-2*n);return(Qs(t+e*57.3)*2-1)*(1-i)+(Qs(t+1+e*57.3)*2-1)*i};function k0(r,e){const t=(r>>>0)%997,n=z0(e*.31,t),i=Math.floor(e*5+t),s=Qs(i*7.13+t),a=Qs(i*3.7+t+9);return n>.2?s<.07?.45:1:n>-.35?s<.4?.3+.4*a:1:s<.14?.85:.22}class G0{constructor(e,t){this.seed=e,this.quality=t;const n=this.canvas=document.createElement("canvas");n.width=16,n.height=12,this.renderer=new um({canvas:n,antialias:!1,alpha:!1,depth:!1,stencil:!1,powerPreference:"high-performance"});const i=this.renderer.getContext();if(!this.renderer.capabilities.isWebGL2||!i.getExtension("EXT_color_buffer_float"))throw this.renderer.dispose(),new Error("level0: this GPU cannot do half-float render targets");this.renderer.outputColorSpace=Kt,this.renderer.toneMapping=0,this.renderer.setPixelRatio(1),this.renderer.info.autoReset=!1,this.scene.background=new Fe(this.shared.uFog.value.x,this.shared.uFog.value.y,this.shared.uFog.value.z),this.scene.matrixWorldAutoUpdate=!0,this.camera.rotation.order="YXZ",this.rng=Sl(e^1374496523)}seed;quality;ready=!1;active=!1;disposed=!1;manual=!1;canvas;renderer;scene=new Wo;camera=new Yt(45,4/3,.05,70);shared=pm();mats=new Em(this.shared);post;chunks;world;ov;rig=new Um;audio;models;door;fridge;t=0;frames=0;metres=0;moved=0;fridgeFound=!1;spot=null;region;events;lightCtl=new Map;flSm=new Map;everDyn=new Set;damp=null;stats={load:0,bake:0,warm:0,frame:0,worst:0};rci=1e9;rcj=1e9;regionDirty=!0;raf=0;last=0;acc=0;lastFrame=0;out={px:0,py:0,pz:0,yaw:0,pitch:0,roll:0,fov:45,cam:{dt:1/60,focus:0,skew:0,zoom:0,move:[0,0],wb:[1,1,1],glitch:0,track:.5}};rng;un=[];onExit;leaving=!1;lsel=[];lseld=new Float64Array(bn);fl=new Map;checkT=14;pcx=1e9;pcz=1e9;seen=new Map;fwd=new B;up=new B;lx=0;lz=0;touches=new Map;async load(e){const t=performance.now(),[n,i,s]=await Promise.all([b0(e,Math.min(8,this.renderer.capabilities.getMaxAnisotropy())),T0(e),ra.load(e+"audio/")]);if(this.disposed)throw new Error("level0: disposed while loading");this.mats.tex=n,this.shared.uSmooth.value=n.smooth,this.mats.build(),this.post=new Nm(this.renderer,n.noise,this.quality),this.models=i,this.audio=s,this.door=new D0(i,this.mats),this.fridge=new I0(i,this.mats),this.scene.add(this.door.group,this.fridge.group),this.stats.load=performance.now()-t,this.plan();const a=Math.max(1,Math.min(4,(navigator.hardwareConcurrency||4)-1));this.chunks=new E0(this.scene,this.mats,i,this.ov,a),this.chunks.onReady=c=>{c.doorAmb&&this.door.setAmb(c.doorAmb),c.fridgeAmb&&this.fridge.setAmb(c.fridgeAmb)},this.chunks.update(this.rig.x,this.rig.z);const o=performance.now();await new Promise((c,h)=>{const u=setInterval(()=>{this.disposed?(clearInterval(u),h(new Error("level0: disposed while baking"))):this.chunks.readyAround(this.rig.x,this.rig.z,2)&&(clearInterval(u),c())},40)}),this.stats.bake=performance.now()-o;const l=performance.now();if(await new Promise(c=>{const h=()=>c();"requestIdleCallback"in window?window.requestIdleCallback(h,{timeout:400}):setTimeout(h,0)}),this.disposed)throw new Error("level0: disposed while warming");try{await this.renderer.compileAsync(this.scene,this.camera)}catch{}this.shared.uFog.value.w=Math.max(20,Math.min(41,this.chunks.viewDist(this.rig.x,this.rig.z)-1.5));for(let c=0;c<3;c++)this.frame(1/60,!0);this.rig.pitch=-.42,this.rig.roll=.05,this.rig.wp=.4,this.damp=n.smooth.userData.px||null,this.events=new B0(this),this.stats.warm=performance.now()-l,this.ready=!0}plan(){const e=C0(this.seed);this.world=e.world,this.ov=e.ov,this.spot=e.spot,this.rig.x=e.x,this.rig.z=e.z,e.spot?this.door.place(e.spot):console.warn("[level0] no place for a door"),e.fspot&&this.fridge.place(e.fspot);const t=this.rng;this.refreshRegion();let n=0,i=0;for(let s=0;s<24;s++){const a=s/24*Math.PI*2,o=this.rig.ray(this.region,-Math.sin(a),-Math.cos(a),40)+t()*2;o>n&&(n=o,i=a)}this.rig.yaw=this.rig.yawT=i+(t()-.5)*.5}placeDoor(e,t,n,i=!1,s,a=!1){const o=Xs(this.world,this.ov,e,this.rng,t,n,i,s,a);return o?(this.ov=o.ov,this.spot=o.spot,this.door.place(o.spot),this.chunks&&(this.chunks.ov=o.ov),this.regionDirty=!0,!0):!1}sees(e,t){const n=e-this.rig.x,i=t-this.rig.z;return n*n+i*i>2116?!1:!qt(this.region,this.rig.x,1.5,this.rig.z,e,1.2,t)}seesSpot(e){const[t,n,i,s]=Tl(e),a=e.dir===0?.4:0,o=e.dir===0?0:.4;return this.sees(t+i*.4,n+s*.4)||this.sees(t+i*.4+a,n+s*.4+o)||this.sees(t+i*.4-a,n+s*.4-o)}pf=null;checkExit(e=!1){if(!this.pf){const l=this.ov.fridge;this.pf=new Jn(this.world,Math.floor(this.rig.x/ne),Math.floor(this.rig.z/ne),56,l?(c,h)=>c===l.i&&h===l.j:void 0,!0)}if(!this.pf.run(e?1/0:500))return;const t=this.pf,n=this.spot;this.pf=null;const i=n?t.at(n.ai,n.aj):-1;if(!(i<0||this.t>240&&i>30||this.t>420&&i>18)||n&&this.seesSpot(n))return;const a=this.t>420?8:this.t>240?12:16;this.placeDoor(t,a,a+10,!1,l=>this.seesSpot(l),!0)||this.placeDoor(t,6,40,!1,l=>this.seesSpot(l),!0)||i<0&&this.placeDoor(t,4,50,!0,l=>this.seesSpot(l),!0);const o=this.spot;o!==n&&(this.moved++,n&&this.chunks.invalidate(n.bi-9,n.bj-9,n.bi+9,n.bj+9),o&&this.chunks.invalidate(o.bi-9,o.bj-9,o.bi+9,o.bj+9))}view(){const e=this.out;return{x:e.px,y:e.py,z:e.pz,yaw:e.yaw,pitch:e.pitch,hfov:this.rig.hfov(),fx:-Math.sin(e.yaw),fz:-Math.cos(e.yaw)}}applyOv(){this.world.setOverrides(this.ov),this.chunks&&(this.chunks.ov=this.ov),this.regionDirty=!0}checkSoon(){this.checkT=Math.min(this.checkT,1)}doorCell(){return this.spot?[this.spot.bi,this.spot.bj]:null}wetAt(e,t){const n=this.damp;if(!n)return .25;const i=(o,l,c)=>{o=(o-Math.floor(o))*n.w-.5,l=(l-Math.floor(l))*n.h-.5;const h=Math.floor(o),u=Math.floor(l),f=o-h,d=l-u,g=(v,m)=>n.d[((m%n.h+n.h)%n.h*n.w+(v%n.w+n.w)%n.w)*4+c]/255;return(g(h,u)*(1-f)+g(h+1,u)*f)*(1-d)+(g(h,u+1)*(1-f)+g(h+1,u+1)*f)*d},s=i(e*.021,t*.021,0)*.72+i(e*.083+.3,t*.083+.3,2)*.28,a=Math.min(1,Math.max(0,(s-.57)/.13));return .08+.92*a*a*(3-2*a)}refreshRegion(){const e=Math.floor(this.rig.x/ne),t=Math.floor(this.rig.z/ne);this.rci=e,this.rcj=t,this.regionDirty=!1,this.region=this.world.region(e-Vs,t-Vs,2*Vs,2*Vs)}norender=!1;tinkT=-9;frame(e,t=!1){const n=performance.now(),i=this.rig,s=this.out;this.t+=e,this.renderer.info.reset(),this.frames++;const a=this.t,o=Math.floor(i.x/ne),l=Math.floor(i.z/ne);(this.regionDirty||Math.abs(o-this.rci)>8||Math.abs(l-this.rcj)>8)&&this.refreshRegion();const c=i.x,h=i.z;i.update(e,this.region,s),this.metres+=Math.hypot(i.x-c,i.z-h);const u=this.camera;u.position.set(s.px,s.py,s.pz),u.rotation.set(s.pitch,s.yaw,s.roll),Math.abs(u.fov-s.fov)>.001&&(u.fov=s.fov,u.updateProjectionMatrix()),u.updateMatrixWorld(),u.getWorldDirection(this.fwd),this.up.set(0,1,0).applyQuaternion(u.quaternion),this.frames%12===1&&this.chunks.update(i.x,i.z);const f=Math.max(20,Math.min(41,this.chunks.viewDist(i.x,i.z)-1.5)),d=this.shared.uFog.value;d.w+=(f-d.w)*Math.min(1,e*(f<d.w?5:.6));const g=Math.floor(i.x/Bo),v=Math.floor(i.z/Bo);(g!==this.pcx||v!==this.pcz)&&(this.pcx=g,this.pcz=v,this.shift()),!t&&this.events&&this.events.update(e),this.fl.clear();for(const M of this.chunks.map.values()){if(!M.ready||!M.fk.length)continue;for(const R of M.fk){if(this.fl.has(R))continue;const D=this.lightCtl.get(R),O=D!==void 0?D:this.everDyn.has(R)?1:k0(R,a),V=this.flSm.get(R)??O,L=V+(O-V)*Math.min(1,e*22);this.flSm.set(R,L),this.fl.set(R,L)}const E=M.flickFix,A=M.flickV,_=M.fk,T=R=>R<_.length?this.fl.get(_[R]):1;M.flickV=E?this.fl.get(E.id):1;const F=T(0);for(const R of Object.values(M.mats))R.uniforms.uFlick.value=F,R.uniforms.uFlick2.value.set(T(1),T(2),T(3),T(4));M.lens.uniforms.uFlickVal.value=F,M.lens.uniforms.uFlick2.value.set(T(1),T(2),T(3),T(4)),E&&!t&&A<.5&&M.flickV>=.5&&this.audio.live&&a-this.tinkT>2.2&&Math.random()<.5&&(E.x-i.x)**2+(E.z-i.z)**2<150&&(this.tinkT=a,this.audio.shot("tink"+Math.floor(Math.random()*6),E.x,Mt,E.z,.45,.9+Math.random()*.2,.3,9e3))}if(this.flSm.size>this.fl.size+8)for(const M of[...this.flSm.keys()])this.fl.has(M)||this.flSm.delete(M);(this.frames%5===1||this.lsel.length===0)&&this.pickLights(s.px+this.fwd.x*2.2,s.pz+this.fwd.z*2.2);const m=this.shared.uL.value,p=this.shared.uLC.value;for(let M=0;M<bn;M++){const E=this.lsel[M];E?(m[M].set(E.x,Mt+.008,E.z,E.power*(this.fl.get(E.id)??1)),p[M].set(E.tint[0],E.tint[1],E.tint[2])):m[M].set(0,-100,0,0)}this.shared.uTime.value=a;const x=this.door.update(e,i.x,i.z,i.extra);x===1&&!t&&this.audio.live&&this.audio.doorSound("door_creak",this.door.x,this.door.z,1.3),x===2&&this.active&&(this.leaving=!0),this.fridge.placed&&(i.extra.indexOf(this.fridge.box)<0&&i.extra.push(this.fridge.box),!this.fridgeFound&&(this.fridge.x-i.x)**2+(this.fridge.z-i.z)**2<6.2&&this.sees(this.fridge.x,this.fridge.z)&&(this.fridgeFound=!0)),t||(this.checkT-=e,this.pf?this.checkExit():this.checkT<=0&&(this.checkT=15,this.checkExit())),this.audio.live&&!t&&this.audio.update(e,this.region,s.px,s.py,s.pz,this.fwd.x,this.fwd.y,this.fwd.z,this.up.x,this.up.y,this.up.z,{lit:this.chunks.lit,vents:this.chunks.vents,door:this.door.placed?[this.door.x-this.door.nx*.5,this.door.z-this.door.nz*.5]:null,fridge:this.fridge.placed?[this.fridge.x,this.fridge.z]:null,flick:M=>this.fl.get(M)??1,pin:this.lightCtl.size||this.audio.mods.size?[...this.lightCtl.keys(),...this.audio.mods.keys()]:void 0,shake:Math.min(1.5,Math.abs(i.wy)+Math.abs(i.wp))*.5+Math.min(1,i.speed/1.3)*.5,idle:i.idle}),this.norender||this.post.render(this.scene,u,s.cam);const b=performance.now()-n;this.stats.frame+=(b-this.stats.frame)*.05,this.frames>30&&b>this.stats.worst&&(this.stats.worst=b)}pickLights(e,t){const n=this.lsel,i=this.lseld;let s=0;n.length=0;for(const a of this.chunks.lit){const o=(a.x-e)**2+(a.z-t)**2;if(s===bn&&o>=i[bn-1])continue;let l=s<bn?s++:bn-1;for(;l>0&&i[l-1]>o;)i[l]=i[l-1],n[l]=n[l-1],l--;i[l]=o,n[l]=a}}shift(){let e=!1;const t=this.spot,n=this.ov.fridge;for(const[i,[s,a]]of this.seen){if(Math.max(Math.abs(s-this.pcx),Math.abs(a-this.pcz))<6||(this.seen.delete(i),Math.random()>.35)||t&&Math.max(Math.abs(Math.floor(t.bi/St)-s),Math.abs(Math.floor(t.bj/St)-a))<=1||n&&Math.max(Math.abs(Math.floor(n.i/St)-s),Math.abs(Math.floor(n.j/St)-a))<=1)continue;const o=this.ov.epochs.find(l=>l[0]===s&&l[1]===a);o?o[2]++:this.ov.epochs.push([s,a,1]),e=!0}for(let i=-1;i<=1;i++)for(let s=-1;s<=1;s++)this.seen.set(this.pcx+s+","+(this.pcz+i),[this.pcx+s,this.pcz+i]);e&&(this.world.setOverrides(this.ov),this.checkT=Math.min(this.checkT,1))}enter(e={}){if(!this.ready||this.active||this.disposed)return!1;this.onExit=e.onExit,this.active=!0;const t=this.canvas,n=this.rig;t.setAttribute("aria-hidden","true"),t.tabIndex=-1,t.style.cssText="position:fixed;left:0;top:0;width:100%;height:100%;z-index:2147483647;background:#000;cursor:none;touch-action:none;outline:none;user-select:none;-webkit-user-select:none;display:block;margin:0;padding:0;border:0",(document.body||document.documentElement).appendChild(t),this.resize();try{const h=window.AudioContext||window.webkitAudioContext,u=new h({latencyHint:"interactive"});this.audio.start(u),u.state!=="running"&&u.resume().catch(()=>{}),n.onStep=(f,d,g)=>this.audio.step(f,d,g,this.wetAt(n.x,n.z)),n.onZoom=f=>this.audio.zoomMotor(f)}catch(h){console.warn("[level0] no sound",h)}const i=(h,u,f,d={capture:!0,passive:!1})=>{h.addEventListener(u,f,d),this.un.push(()=>h.removeEventListener(u,f,d))},s=(h,u=!0)=>{h.stopImmediatePropagation(),u&&h.cancelable&&h.preventDefault()},a=h=>h.ctrlKey||h.metaKey||h.altKey||/^F\d+$/.test(h.code),o=()=>{if(document.pointerLockElement!==t&&t.requestPointerLock)try{const h=t.requestPointerLock();h&&h.catch&&h.catch(()=>{})}catch{}};i(window,"keydown",h=>{s(h,!a(h)),a(h)||n.keys.add(h.code),l()}),i(window,"keyup",h=>{s(h,!a(h)),n.keys.delete(h.code)}),i(window,"keypress",h=>s(h,!a(h))),i(window,"blur",()=>n.keys.clear()),i(window,"mousemove",h=>{s(h,!1),(document.pointerLockElement===t||h.buttons)&&(n.look[0]+=h.movementX||0,n.look[1]+=h.movementY||0)});const l=()=>{const h=this.audio.ctx;this.audio.live&&h&&h.state==="suspended"&&!document.hidden&&h.resume().catch(()=>{})};i(window,"mousedown",h=>{s(h),o(),l()});for(const h of["mouseup","click","dblclick","auxclick","contextmenu","gesturestart","dragstart","selectstart","pointerdown","pointerup","pointermove","pointercancel"])i(window,h,u=>s(u,!h.startsWith("pointer")));i(window,"wheel",h=>{s(h),n.zoomT=Math.max(0,Math.min(1,n.zoomT-h.deltaY*7e-4))}),i(window,"touchstart",h=>{s(h);for(const u of Array.from(h.changedTouches))this.touches.set(u.identifier,{side:u.clientX<innerWidth/2?0:1,x0:u.clientX,y0:u.clientY,x:u.clientX,y:u.clientY})}),i(window,"touchmove",h=>{s(h);for(const u of Array.from(h.changedTouches)){const f=this.touches.get(u.identifier);if(f&&(f.side&&(n.look[0]+=(u.clientX-f.x)*2.2,n.look[1]+=(u.clientY-f.y)*2.2),f.x=u.clientX,f.y=u.clientY,!f.side)){const d=(f.x-f.x0)/55,g=-(f.y-f.y0)/55,v=Math.hypot(d,g),m=Math.min(1.5,v);n.stick[0]=v>.15?d/v*m:0,n.stick[1]=v>.15?g/v*m:0}}});const c=h=>{s(h),l();for(const u of Array.from(h.changedTouches)){const f=this.touches.get(u.identifier);f&&!f.side&&(n.stick[0]=n.stick[1]=0),this.touches.delete(u.identifier)}};return i(window,"touchend",c),i(window,"touchcancel",c),i(window,"resize",()=>this.resize(),{capture:!1,passive:!0}),i(document,"visibilitychange",()=>{const h=this.audio.ctx;document.hidden?(cancelAnimationFrame(this.raf),n.keys.clear(),h&&h.suspend&&h.suspend().catch(()=>{})):this.active&&!this.manual&&(h&&h.resume&&h.resume().catch(()=>{}),this.last=this.lastFrame=performance.now(),this.acc=0,this.raf=requestAnimationFrame(this.tick))},{capture:!1,passive:!0}),o(),this.frame(1/60),this.last=this.lastFrame=performance.now(),this.acc=0,this.manual||(this.raf=requestAnimationFrame(this.tick)),!0}resize(){const e=Math.max(1,innerWidth),t=Math.max(1,innerHeight),n=Math.min(2,devicePixelRatio||1);this.renderer.setPixelRatio(n),this.renderer.setSize(e,t,!1),this.post.layout(e,t)}tick=e=>{if(!this.active||this.manual||(this.raf=requestAnimationFrame(this.tick),this.acc+=e-this.last,this.last=e,this.acc<13.6))return;this.acc=Math.max(-3,Math.min(20,this.acc-1e3/60));const t=Math.min(.05,Math.max(.004,(e-this.lastFrame)/1e3));this.lastFrame=e,this.frame(t),this.leaving&&this.leave()};leave(){const e={seed:this.seed,seconds:this.t,metres:this.metres,fridge:this.fridgeFound},t=this.onExit;this.dispose(),t&&t(e)}dispose(){if(!this.disposed){this.disposed=!0,this.active=!1,this.ready=!1,cancelAnimationFrame(this.raf);for(const e of this.un)e();this.un=[];try{document.pointerLockElement===this.canvas&&document.exitPointerLock()}catch{}if(this.audio&&this.audio.stop(),this.events&&this.events.dispose(),this.chunks&&this.chunks.dispose(),this.door&&this.door.dispose(),this.fridge&&this.fridge.dispose(),this.models)for(const e of[...Object.values(this.models.parts),this.models.doorFixed,this.models.doorLeaf])for(const t of e)t.geo.dispose();this.post&&this.post.dispose(),this.mats.protos&&this.mats.dispose(),this.scene.clear(),this.renderer.dispose();try{this.renderer.forceContextLoss()}catch{}this.canvas.remove(),this.canvas.width=this.canvas.height=1}}debug={step:(e,t=1/60)=>{for(let n=0;n<e&&!this.disposed;n++)if(this.frame(t),this.leaving){this.leave();break}this.disposed||this.renderer.getContext().finish()},teleport:(e,t,n,i=0)=>{const s=this.rig;s.x=e,s.z=t,s.vx=s.vz=0,n!==void 0&&(s.yaw=s.yawT=n,s.wy=0),s.pitch=s.pitchT=i,s.wp=0,this.regionDirty=!0,this.chunks.update(e,t)},info:()=>({seed:this.seed,t:this.t,x:this.rig.x,z:this.rig.z,yaw:this.rig.yaw,chunks:this.chunks.map.size,ready:[...this.chunks.map.values()].filter(e=>e.ready).length,pending:this.chunks.pending(),bake:this.chunks.times.slice(),errors:this.chunks.errors.slice(),door:this.spot?{x:this.door.x,z:this.door.z,nx:this.door.nx,nz:this.door.nz,angle:this.door.angle,d:this.spot.d}:null,fridge:this.fridge.placed?{x:this.fridge.x,z:this.fridge.z,fx:Math.sin(this.fridge.group.rotation.y),fz:Math.cos(this.fridge.group.rotation.y)}:null,moved:this.moved,events:this.events?{activity:this.events.activity,live:this.events.live.map(e=>e.def.name),log:this.events.log.slice(-40)}:null,lit:this.chunks.lit.length,fog:this.shared.uFog.value.w,stats:{...this.stats},audio:this.audio.live?{...this.audio.debug,state:this.audio.ctx.state}:null,gl:{...this.renderer.info.memory,calls:this.renderer.info.render.calls,tris:this.renderer.info.render.triangles}}),path:(e=56)=>{const t=new Jn(this.world,Math.floor(this.rig.x/ne),Math.floor(this.rig.z/ne),e);return this.spot?t.at(this.spot.ai,this.spot.aj):-1},flood:(e=56)=>new Jn(this.world,Math.floor(this.rig.x/ne),Math.floor(this.rig.z/ne),e),check:()=>this.checkExit(!0),sim:(e,t=1/60)=>{this.norender=!0;for(let n=0;n<e&&!this.disposed&&!this.leaving;n++)this.frame(t);this.norender=!1,this.leaving&&this.leave()},meter:()=>this.post.meter(),readScene:(e,t,n,i)=>this.post.readScene(e,t,n,i),exportPlan:(e=12)=>{const t=Math.floor(this.rig.x/ne),n=Math.floor(this.rig.z/ne),i=this.world.region(t-e,n-e,2*e,2*e);return{i0:i.i0,j0:i.j0,w:i.w,h:i.h,ex:Array.from(i.ex),ez:Array.from(i.ez),col:Array.from(i.col),fix:i.fix,cam:{x:this.out.px,y:this.out.py,z:this.out.pz,yaw:this.out.yaw,pitch:this.out.pitch,vfov:this.camera.fov}}}}}async function H0(r={}){const e=r.base||new URL(".",import.meta.url).href,t=r.seed??crypto.getRandomValues(new Uint32Array(1))[0]|0,n=typeof matchMedia=="function"&&matchMedia("(pointer: coarse)").matches,i=new G0(t,r.quality??(n?0:1));try{await i.load(e)}catch(s){throw i.dispose(),s}return i}export{G0 as Level0,H0 as prepare};
