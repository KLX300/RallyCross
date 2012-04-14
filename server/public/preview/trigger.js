Function.prototype.method=function(a,b){this.prototype[a]=b;return this};Function.method("inherits",function(a){var b={},e=this.prototype=new a;this.method("uber",function(f){f in b||(b[f]=0);var c,d;c=b[f];d=a.prototype;if(c){for(;c;)d=d.constructor.prototype,c-=1;c=d[f]}else c=e[f],c==this[f]&&(c=d[f]);b[f]+=1;d=c.apply(this,Array.prototype.slice.apply(arguments,[1]));b[f]-=1;return d});return this});
Function.method("swiss",function(a){for(var b=1;b<arguments.length;b+=1){var e=arguments[b];this.prototype[e]=a.prototype[e]}return this});var require=function(a){return window[a]},TWOPI=2*Math.PI,Vec2=THREE.Vector2,Vec3=THREE.Vector3,Quat=THREE.Quaternion,PULLTOWARD=function(a,b,e){return b+(a-b)/(1+e)},MOVETOWARD=function(a,b,e){var f;return b<(f=a-e)?f:b>(f=a+e)?f:b},INTERP=function(a,b,e){return a+(b-a)*e},CLAMP=function(a,b,e){return Math.min(Math.max(a,b),e)},Vec3FromArray=function(a){return new Vec3(a[0],a[1],a[2])},QuatFromEuler=function(a){var b=new Quat;b.setFromAxisAngle(new Vec3(1,0,0),a.x);b.multiplySelf((new Quat).setFromAxisAngle(new Vec3(0,
1,0),a.y));b.multiplySelf((new Quat).setFromAxisAngle(new Vec3(0,0,1),a.z));return b},KEYCODE={SPACE:32,LEFT:37,UP:38,RIGHT:39,DOWN:40,C:67},CallbackQueue=function(a){this.callbacks=[];a&&this.callbacks.push(a)};CallbackQueue.prototype.add=function(a){this.callbacks.push(a)};CallbackQueue.prototype.fire=function(){for(var a=0;a<this.callbacks.length;++a)this.callbacks[a].apply(void 0,arguments)};var MODULE="audio";
(function(a){a.WebkitAudio=function(){"webkitAudioContext"in window&&(this.audio=new webkitAudioContext);this.buffers={}};a.WebkitAudio.prototype.getBuffer=function(b){b=this.buffers[b];return b instanceof CallbackQueue?null:b||null};a.WebkitAudio.prototype.loadBuffer=function(b,a){if(b in this.buffers){var f=this.buffers[b];f instanceof CallbackQueue?f.add(a):a(this.buffers[b])}else if(audio){var c=new CallbackQueue(a);this.buffers[b]=c;var d=new XMLHttpRequest;d.open("GET",b,!0);d.responseType=
"arraybuffer";d.onload=function(){var f=this.audio.createBuffer(d.response,!0);this.buffers[b]=f;c.fire(f)}.bind(this);d.send()}};a.WebkitAudio.prototype.playSound=function(b,a,f,c){var d=this.audio.createBufferSource();d.buffer=b;d.connect(this.audio.destination);d.loop=a;d.gain.value=f;d.playbackRate.value=void 0===c?1:c;d.noteOn(0);return d}})("undefined"===typeof exports?this[MODULE]={}:exports);MODULE="pterrain";
(function(a){a.ImageSource=function(){this.hmap=null;this.onload=[]};a.ImageSource.prototype.load=function(b,a){var f=new Image;f.onload=function(){var b=this.cx=f.width,d=this.cy=f.height,g=document.createElement("canvas");g.width=b;g.height=d;g=g.getContext("2d");g.drawImage(f,0,0);this.hmap=g.getImageData(0,0,b,d).data;for(var i in this.onload)this.onload[i]();a&&a(this)}.bind(this);f.src=b};a.ImageSource.prototype.loadTile=function(b,a,f,c,d,g){if(this.hmap){var i=this.cx,j=this.cy,k=this.hmap,
h=new Float32Array(f*c),m,l,n=0;for(l=a;l<a+c;++l){m=l%j;0>m&&(m+=j);var p=m*i;for(m=b;m<b+f;++m){var o=m%i;0>o&&(o+=i);h[++n]=k[4*(o+p)]*d}}g(h)}else this.onload.push(this.loadTile.bind(this,b,a,f,c,d,g))};a.Terrain=function(b){this.tileSize=128;this.scaleVt=this.scaleHz=1;this.tileTotalSize=this.tileSize*this.scaleHz;this.tiles={};this.source=b};a.Terrain.prototype.getTile=function(b,a){return this.tiles[b+","+a]};a.Terrain.prototype.loadTile=function(b,e,f){var c=b+","+e;if(c in this.tiles)f(this.tiles[c]);
else{var d=this.tileSize,g=d+1;this.source.loadTile(b*d,e*d,g,g,this.scaleVt,function(d){d=new a.TerrainTile(this,b,e,d);this.tiles[c]=d;f&&f(d)}.bind(this))}};a.Terrain.prototype.getContact=function(b){return this.getContactRayZ(b.x,-b.z)};a.Terrain.prototype.getContactRayZ=function(b,a){var f=null,c=b/this.scaleHz,d=a/this.scaleHz,g=Math.floor(c/this.tileSize),i=Math.floor(d/this.tileSize),j=this.getTile(g,i);if(j&&(f=j.getContactRayZ(c-g*this.tileSize,d-i*this.tileSize)))f.surfacePos.x=b,f.surfacePos.z=
-a;return f};a.TerrainTile=function(b,a,f,c){this.terrain=b;this.size=b.tileSize;this.heightMap=c};a.TerrainTile.prototype.getContactRayZ=function(b,a){var f=Math.floor(b),c=Math.floor(a),d=b-f,g=a-c,i=this.size+1,j=this.heightMap[f+0+(c+0)*i],k=this.heightMap[f+1+(c+0)*i],h=this.heightMap[f+0+(c+1)*i],c=this.heightMap[f+1+(c+1)*i],f=new Vec3;f.z=this.terrain.scaleHz;1>d+g?(f.x=j-k,f.y=j-h,d=j+(k-j)*d+(h-j)*g):(f.x=h-c,f.y=k-c,d=c+(h-c)*(1-d)+(k-c)*(1-g));return{normal:(new Vec3(f.x,f.z,-f.y)).normalize(),
surfacePos:new Vec3(0,d,0)}}})("undefined"===typeof exports?this[MODULE]={}:exports);MODULE="psim";
(function(a){a.Sim=function(){this.gravity=new Vec3(0,-9.81,0);this.objects=[];this.staticObjects=[]};a.Sim.prototype.addObject=function(b){this.objects.push(b)};a.Sim.prototype.addStaticObject=function(b){this.staticObjects.push(b)};a.Sim.prototype.tick=function(b){if(!(0>=b)){0.1<b&&(b=0.1);var a=Math.floor(b/0.01)+1,b=b/a,f,c;for(f=0;f<a;++f)for(c=0;c<this.objects.length;++c)this.objects[c].tick(b)}};a.Sim.prototype.collide=function(b){var a,f=[];for(a=0;a<this.staticObjects.length;++a){var c=this.staticObjects[a].getContact(b);
if(c){var d=c.surfacePos.clone().subSelf(b);c.depth=d.dot(c.normal);0<c.depth&&f.push(c)}}return f};a.ReferenceFrame=function(){this.pos=new Vec3;this.ori=new Quat;this.oriMat=new THREE.Matrix4;this.oriMatInv=new THREE.Matrix4};a.ReferenceFrame.prototype.updateMatrices=function(){this.ori.normalize();this.oriMat.setRotationFromQuaternion(this.ori);this.oriMatInv.copy(this.oriMat).transpose()};a.ReferenceFrame.prototype.getLocToWorldVector=function(b){b=b.clone();this.oriMat.multiplyVector3(b);return b};
a.ReferenceFrame.prototype.getWorldToLocVector=function(b){b=b.clone();this.oriMatInv.multiplyVector3(b);return b};a.ReferenceFrame.prototype.getLocToWorldPoint=function(b){b=b.clone();this.oriMat.multiplyVector3(b);b.addSelf(this.pos);return b};a.ReferenceFrame.prototype.getWorldToLocPoint=function(b){b=b.clone().subSelf(this.pos);this.oriMatInv.multiplyVector3(b);return b};a.RigidBody=function(b){this.sim=b;b.addObject(this);this.mass=1;this.angMass=new Vec3(1,1,1);this.angMassInv=new Vec3(1,1,
1);this.linVel=new Vec3;this.angVel=new Vec3;this.accumForce=new Vec3;this.accumTorque=new Vec3};a.RigidBody.inherits(a.ReferenceFrame);a.RigidBody.prototype.setMassCuboid=function(b,a){0>=b||0>=a.x||0>=a.y||0>=a.z||(this.mass=b,this.angMass.x=1,this.angMass.y=1,this.angMass.z=1,this.angMass.multiplyScalar(b),this.angMassInv.x=1/this.angMass.x,this.angMassInv.y=1/this.angMass.y,this.angMassInv.z=1/this.angMass.z)};a.RigidBody.prototype.getLinearVel=function(){return this.linVel};a.RigidBody.prototype.addForce=
function(a){this.accumForce.addSelf(a)};a.RigidBody.prototype.addLocForce=function(a){this.addForce(this.getLocToWorldVector(a))};a.RigidBody.prototype.addForceAtPoint=function(a,e){this.accumForce.addSelf(a);var f=this.getWorldToLocPoint(e),c=this.getWorldToLocVector(a);this.addTorque((new Vec3).cross(f,c))};a.RigidBody.prototype.addLocForceAtPoint=function(a,e){this.addForceAtPoint(this.getLocToWorldVector(a),e)};a.RigidBody.prototype.addForceAtLocPoint=function(a,e){this.addForceAtPoint(a,this.getLocToWorldPoint(e))};
a.RigidBody.prototype.addLocForceAtLocPoint=function(a,e){this.addForceAtPoint(this.getLocToWorldVector(a),this.getLocToWorldPoint(e))};a.RigidBody.prototype.addTorque=function(a){this.accumTorque.addSelf(a)};a.RigidBody.prototype.addLocTorque=function(a){this.addTorque(this.getLocToWorldVector(a))};a.RigidBody.prototype.getLinearVelAtPoint=function(a){var a=a.clone().subSelf(this.pos),e=this.getLocToWorldVector(this.angVel),a=(new Vec3).cross(e,a);return(new Vec3).add(this.linVel,a)};a.RigidBody.prototype.tick=
function(a){var e=this.accumForce.clone().divideScalar(this.mass);e.addSelf(this.sim.gravity);this.linVel.addSelf(e.multiplyScalar(a));this.pos.addSelf(this.linVel.clone().multiplyScalar(a));e=this.angMassInv;this.angVel.addSelf((new Vec3).multiply(this.accumTorque,e).clone().multiplyScalar(a));a=this.angVel.clone().multiplyScalar(a);this.ori.multiplySelf(QuatFromEuler(a));this.accumForce.x=this.accumForce.y=this.accumForce.z=0;this.accumTorque.x=this.accumTorque.y=this.accumTorque.z=0;this.updateMatrices()};
a.CylinderCollection=function(){}})("undefined"===typeof exports?this[MODULE]={}:exports);MODULE="pvehicle";
(function(a){function b(a,c){if(0>=a)return 0;if(a<=c[0].radps)return c[0].power*a/c[0].radps;var d;for(d=1;d<c.length;++d)if(a<=c[d].radps)return INTERP(c[d-1].power,c[d].power,(a-c[d-1].radps)/(c[d].radps-c[d-1].radps));return c[d-1].power}a.AutomaticController=function(a){this.car=a;this.shiftTimer=0;this.input={forward:0,back:0,left:0,right:0,handbrake:0};this.output={throttle:0,clutch:1,gear:1,brake:0,handbrake:0,desiredTurnPos:0}};a.AutomaticController.prototype.tick=function(a){var c=this.input,
d=this.output,e=this.car,i=e.cfg.engine.powerband,j=function(a){var f=e.engineAngVel*e.gearRatios[a]/e.gearRatios[d.gear];return b(f,i)*e.gearRatios[a]/f},k=c.forward,h=c.back,m=b(e.engineAngVel,i)*e.gearRatios[d.gear]/e.engineAngVel;0>=this.shiftTimer?d.clutch&&1<=d.gear?1<d.gear&&j(d.gear-1)>m?(d.gear-=1,this.shiftTimer=0.2):d.gear<e.gearRatios.length-1&&j(d.gear+1)>m?(d.gear+=1,this.shiftTimer=0.2):h&&1>e.differentialAngVel&&(d.gear=-1,this.shiftTimer=0.2):-1==d.gear&&(k?(d.gear=1,this.shiftTimer=
0.2):(k=h,h=0)):this.shiftTimer-=a;d.throttle=PULLTOWARD(d.throttle,k,8*a);d.brake=PULLTOWARD(d.brake,h,5*a);d.handbrake=PULLTOWARD(d.handbrake,c.handbrake,20*a);d.desiredTurnPos=PULLTOWARD(d.desiredTurnPos,c.left-c.right,5*a);d.clutch=1;d.clutch*=0.5>d.handbrake?1:0};a.Vehicle=function(f,c){this.sim=f;f.addObject(this);this.cfg=c;this.body=new psim.RigidBody(f);this.body.setMassCuboid(c.mass,Vec3FromArray(c.dimensions).multiplyScalar(0.5));this.wheelTurnPos=-1;this.totalDrive=this.wheelTurnVel=0;
this.wheels=[];for(var d=0;d<c.wheels.length;++d){var b=this.wheels[d]={};b.cfg=c.wheels[d];b.ridePos=0;b.rideVel=0;b.spinPos=0;b.spinVel=0;b.bumpLast=0;b.bumpNext=0;b.bumpTravel=0;b.frictionForce=new Vec2;this.totalDrive+=b.cfg.drive||0}this.controller=new a.AutomaticController(this);for(d=0;d<c.engine.powerband.length;++d)c.engine.powerband[d].radps=c.engine.powerband[d].rpm*TWOPI/60;this.engineAngVelSmoothed=this.engineAngVel=0;this.engineIdle=c.engine.powerband[0].radps;this.engineRedline=c.engine.redline*
TWOPI/60;this.engineRecover=0.98*this.engineRedline;this.engineOverspeed=!1;this.enginePowerscale=1E3*c.engine.powerscale;d=c.transmission["final"];this.gearRatios=[];this.gearRatios[-1]=-c.transmission.reverse*d;for(b=this.gearRatios[0]=0;b<c.transmission.forward.length;++b)this.gearRatios[b+1]=c.transmission.forward[b]*d;this.skidLevel=this.crashLevelPrev=this.crashLevel=this.recoverTimer=0};a.Vehicle.prototype.recover=function(a){var c=this.recoverState,b=this.body;c||(c=Math.atan2(b.oriMat.n13,
b.oriMat.n11),c=(new Quat).setFromAxisAngle(new Vec3(0,1,0),Math.PI-c),0>c.x*b.ori.x+c.y*b.ori.y+c.z*b.ori.z+c.w*b.ori.w&&(c.x*=-1,c.y*=-1,c.z*=-1,c.w*=-1),c=this.recoverState={pos:b.pos.clone().addSelf(Vec3FromArray(this.cfg.recover.posOffset)),ori:c});a*=2;b.pos.x=PULLTOWARD(b.pos.x,c.pos.x,a);b.pos.y=PULLTOWARD(b.pos.y,c.pos.y,a);b.pos.z=PULLTOWARD(b.pos.z,c.pos.z,a);b.ori.x=PULLTOWARD(b.ori.x,c.ori.x,a);b.ori.y=PULLTOWARD(b.ori.y,c.ori.y,a);b.ori.z=PULLTOWARD(b.ori.z,c.ori.z,a);b.ori.w=PULLTOWARD(b.ori.w,
c.ori.w,a);b.linVel.set(0,0,0);b.angVel.set(0,0,0);this.recoverTimer>=this.cfg.recover.releaseTime&&(this.recoverTimer=0,this.recoverState=null)};a.Vehicle.prototype.tick=function(a){var c;this.controller.tick(a);var d=this.cfg.engine.powerband,e=this.controller.output,i=e.throttle;this.crashLevelPrev=PULLTOWARD(this.crashLevelPrev,this.crashLevel,5*a);this.crashLevel=PULLTOWARD(this.crashLevel,0,5*a);this.skidLevel=0;0.1>=this.body.oriMat.n22||this.recoverTimer>=this.cfg.recover.triggerTime?(this.recoverTimer+=
a,this.recoverTimer>=this.cfg.recover.triggerTime&&this.recover(a)):this.recoverTimer=0;var j=0,k=0;for(c=0;c<this.wheels.length;++c)var h=this.wheels[c],j=j+h.spinVel*(h.cfg.drive||0),k=k+h.frictionForce.x;this.differentialAngVel=j/=this.totalDrive;c=this.gearRatios[e.gear];0!=c&&e.clutch&&(this.engineAngVel=j*c);this.engineAngVel<this.engineIdle&&(this.engineAngVel=this.engineIdle);if(this.engineOverspeed){if(this.engineOverspeed=this.engineAngVel>this.engineRecover)i=0,e.throttle=0}else this.engineAngVel>
this.engineRedline&&(i=0,this.engineOverspeed=!0);h=i-0.5;h=0<=h?h/0.5:h/0.5;h=0<=h?h*this.enginePowerscale*b(this.engineAngVel,d)/this.engineAngVel:0.1*h*(this.engineAngVel-this.engineIdle);d=0;0!=c&&e.clutch?d=h*c/this.totalDrive:(this.engineAngVel+=5E4*h*a/this.cfg.engine.flywheel,this.engineAngVel<this.engineIdle&&(this.engineAngVel=this.engineIdle));for(c=0;c<this.wheels.length;++c)h=this.wheels[c],i=0.3*h.frictionForce.y,h.cfg.drive&&(i+=(d-800*(h.spinVel-j))*h.cfg.drive),h.spinVel+=0.13*i*
a,i=e.brake*(h.cfg.brake||0)+e.handbrake*(h.cfg.handbrake||0),0<i&&(h.spinVel=MOVETOWARD(h.spinVel,0,i*a));for(c=0;c<this.cfg.clips.length;++c)this.clipPoint(this.cfg.clips[c]);e=300*(e.desiredTurnPos-this.wheelTurnPos)+-0.0050*k;e=CLAMP(e,-8,8);this.wheelTurnVel=PULLTOWARD(this.wheelTurnVel,e,10*a);this.wheelTurnPos+=this.wheelTurnVel*a;this.wheelTurnPos=CLAMP(this.wheelTurnPos,-1,1);for(c=0;c<this.cfg.wheels.length;++c)this.tickWheel(this.wheels[c],a);this.engineAngVelSmoothed=PULLTOWARD(this.engineAngVelSmoothed,
this.engineAngVel,20*a)};var e=function(a,b){var d={};d.w=a;d.v=(new Vec3).cross(a,b);d.v.normalize();d.u=(new Vec3).cross(d.v,a);d.u.normalize();return d};a.Vehicle.prototype.clipPoint=function(a){for(var a=this.body.getLocToWorldPoint(Vec3FromArray(a.pos)),b=this.body.getLinearVelAtPoint(a),d=this.sim.collide(a),g=0;g<d.length;++g){var i=d[g],j=e(i.normal,new Vec3(1,0,0)),k=new Vec3(b.dot(j.u),b.dot(j.v),b.dot(j.w)),i=2E5*i.depth-8E3*k.z;if(0<i){var k=(new Vec2(-k.x,-k.y)).multiplyScalar(1E4),h=
0.6*i,m=0.8*i,l=k.length();l>m&&k.multiplyScalar(h/l);h=j.w.multiplyScalar(i);h.addSelf(j.u.multiplyScalar(k.x));h.addSelf(j.v.multiplyScalar(k.y));this.body.addForceAtPoint(h,a);this.crashLevel=Math.max(this.crashLevel,i)}}};a.Vehicle.prototype.tickWheel=function(a,b){var d=5E4*a.ridePos;a.frictionForce.set(0,0);a.rideVel-=d/15*b;a.rideVel*=1/(1+50*b);a.ridePos+=a.rideVel*b;a.spinPos+=a.spinVel*b;a.spinPos-=Math.floor(a.spinPos/TWOPI)*TWOPI;a.bumpTravel+=0.6*Math.abs(a.spinVel)*b;1<=a.bumpTravel&&
(a.bumpLast=a.bumpNext,a.bumpTravel-=Math.floor(a.bumpTravel),a.bumpNext=0.02*(Math.random()-0.5)*Math.random());var g=this.body.getLocToWorldPoint(Vec3FromArray(a.cfg.pos));g.y+=a.ridePos-a.cfg.radius;g.y+=INTERP(a.bumpLast,a.bumpNext,a.bumpTravel);for(var i=this.body.getLinearVelAtPoint(g),j=this.sim.collide(g),k=0;k<j.length;++k){var h=j[k],m=e(h.normal,this.getWheelRightVector(a)),l=new Vec3(i.dot(m.u),i.dot(m.v),i.dot(m.w));l.y+=a.spinVel*a.cfg.radius;this.skidLevel+=Math.sqrt(l.x*l.x+l.y*l.y);
var n=d-8E3*l.z;a.ridePos+=h.depth;0.13<a.ridePos&&(a.ridePos=0.13,a.rideVel=0,n=2E5*h.depth-8E3*l.z);a.rideVel<-l.z&&(a.rideVel=-l.z);if(0<n){var h=(new Vec2(-l.x,-l.y)).multiplyScalar(3E3),l=0.9*n,p=1.2*n,o=h.length();o>p&&h.multiplyScalar(l/o);a.frictionForce.addSelf(h);n=m.w.multiplyScalar(n);n.addSelf(m.u.multiplyScalar(h.x));n.addSelf(m.v.multiplyScalar(h.y));this.body.addForceAtPoint(n,g)}}};a.Vehicle.prototype.getWheelTurnPos=function(a){return(a.cfg.turn||0)*this.wheelTurnPos};a.Vehicle.prototype.getWheelRightVector=
function(a){var b=this.getWheelTurnPos(a),a=Math.cos(b),b=Math.sin(b),d=this.body.oriMat.getColumnX().clone(),e=this.body.oriMat.getColumnZ();return new Vec3(d.x*a-e.x*b,d.y*a-e.y*b,d.z*a-e.z*b)};a.Vehicle.prototype.getCrashNoiseLevel=function(){return this.crashLevel>this.crashLevelPrev?(this.crashLevelPrev=2*this.crashLevel,this.crashLevel):0}})("undefined"===typeof exports?this[MODULE]={}:exports);MODULE="level";
(function(a){a.Level=function(){};a.Level.prototype.load=function(a,e){var f=new XMLHttpRequest;f.onload=function(){this.config=JSON.parse(f.responseText);this.setup();e&&e(this)}.bind(this);f.open("GET",a,!0);f.send()};a.Level.prototype.setup=function(){var a=this.config;if(a.terrain){var e=new pterrain.ImageSource(a.terrain.heightmap);e.load(a.terrain.heightmap);e=new pterrain.Terrain(e);e.scaleHz=a.terrain.horizontalscale;e.scaleVt=a.terrain.verticalscale;this.terrain=e}}})("undefined"===typeof exports?
this[MODULE]={}:exports);Car=function(){function a(){var a;if(b.bodyGeometry&&b.wheelGeometry){var f=Vec3FromArray(b.config.center),c=b.config.scale||1,d=new THREE.MeshFaceMaterial;b.bodyMesh=new THREE.Mesh(b.bodyGeometry,d);b.bodyMesh.position.copy(f).multiplyScalar(-1);b.bodyMesh.scale.set(c,c,c);b.root.add(b.bodyMesh);for(a=0;a<b.config.clips.length;++a){var g=b.config.clips[a];g.pos[0]-=f.x;g.pos[1]-=f.y;g.pos[2]-=f.z}for(a=0;a<b.config.wheels.length;++a){g=b.config.wheels[a];g.pos[0]-=f.x;g.pos[1]-=f.y;g.pos[2]-=f.z;
var i={};i.cfg=g;i.mesh=new THREE.Mesh(b.wheelGeometry,d);i.mesh.scale.set(c,c,c);g.flip&&(i.mesh.rotation.z=Math.PI);i.root=new THREE.Object3D;i.root.position=new THREE.Vector3(g.pos[0],g.pos[1],g.pos[2]);i.root.add(i.mesh);b.root.add(i.root);b.wheels.push(i)}if(this.aud){a=this.config.sounds;this.aud.loadBuffer(a.engine,function(a){this.sourceEngine=this.aud.playSound(a,!0,0)}.bind(this));this.aud.loadBuffer(a.transmission,function(a){this.sourceTransmission=this.aud.playSound(a,!0,0)}.bind(this));
this.aud.loadBuffer(a.wind,function(a){this.sourceWind=this.aud.playSound(a,!0,0)}.bind(this));this.aud.loadBuffer(a.skid,function(a){this.sourceSkid=this.aud.playSound(a,!0,0)}.bind(this));for(f=0;f<a.crash.length;++f)this.aud.loadBuffer(a.crash[f],function(a,b){this.buffersCrash[a]=b}.bind(this,f))}b.callback&&b.callback(b)}}var b=this;this.wheelGeometry=this.bodyGeometry=null;this.root=new THREE.Object3D;this.root.useQuaternion=!0;this.bodyMesh=null;this.wheels=[];this.vehic=null;this.config={};
this.sourceSkid=this.sourceWind=this.sourceTransmission=this.sourceEngine=null;this.buffersCrash=[];this.loadCar=function(a){var b=new XMLHttpRequest;b.onload=function(){this.config=JSON.parse(b.responseText);this.loadPartsJSON(this.config.meshes.body,this.config.meshes.wheel)}.bind(this);b.open("GET",a,!0);b.send()};this.loadPartsJSON=function(e,f){var c=new THREE.JSONLoader;c.load(e,function(c){b.bodyGeometry=c;a.bind(b)()},"/a/textures");c.load(f,function(c){b.wheelGeometry=c;a.bind(b)()},"/a/textures")};
this.attachPhysics=function(a){this.vehic=new pvehicle.Vehicle(a,this.config);this.vehic.body.pos.x=100;this.vehic.body.pos.y=10;this.vehic.body.pos.z=-100;this.vehic.body.ori=new THREE.Quaternion(0,0.5,0,0.5);this.vehic.body.ori.normalize()};this.getControls=function(){return this.vehic&&this.vehic.controller.input};this.update=function(){if(this.vehic){this.root.position.copy(this.vehic.body.pos);this.root.quaternion.copy(this.vehic.body.ori);for(var a=0;a<this.wheels.length;++a){var b=this.wheels[a],
c=this.vehic.wheels[a];b.root.position.y=b.cfg.pos[1]+c.ridePos;b.root.rotation.y=this.vehic.getWheelTurnPos(c);b.mesh.rotation.x=c.spinPos}this.aud&&(this.sourceEngine&&(this.sourceEngine.gain.value=0.2*this.vehic.controller.output.throttle+0.4,this.sourceEngine.playbackRate.value=this.vehic.engineAngVelSmoothed/(this.config.sounds.engineRpm*Math.PI/30)),this.sourceTransmission&&(a=this.vehic.differentialAngVel/(this.config.sounds.transmissionRpm*Math.PI/30),this.sourceTransmission.gain.value=0.08*
Math.min(1,a)*this.vehic.controller.output.throttle,this.sourceTransmission.playbackRate.value=a),this.sourceWind&&(a=this.vehic.body.linVel.length()/this.config.sounds.windSpeed,this.sourceWind.gain.value=1*Math.min(1,a),this.sourceWind.playbackRate=a),this.sourceSkid&&(this.sourceSkid.gain.value=Math.log(1+0.02*this.vehic.skidLevel)),a=5.0E-6*this.vehic.getCrashNoiseLevel(),0<a&&this.aud.playSound(this.buffersCrash[Math.floor(Math.random()*this.buffersCrash.length)],!1,Math.log(1+a),0.99+0.02*Math.random()))}}};var SCREEN_WIDTH=window.innerWidth,SCREEN_HEIGHT=window.innerHeight,SCREEN_ASPECT=0<SCREEN_HEIGHT?SCREEN_WIDTH/SCREEN_HEIGHT:1,SHADOW_MAP_WIDTH=1024,SHADOW_MAP_HEIGHT=1024,container,stats,sceneHUD,cameraHUD,revMeter,scene,camera,debugMesh,webglRenderer,sunLight,sunLightPos,cameraMode=0,CAMERA_MODES=2,track,keyDown=[],loading=!0,textureCube,sim,car,aud,sourceEngine,sourceTransmission,sourceWind,crashBuffers=[],sourcesTmp=[],windowHalfX=window.innerWidth/2,windowHalfY=window.innerHeight/2;
document.addEventListener("mousemove",onDocumentMouseMove,!1);document.addEventListener("keydown",onDocumentKeyDown,!1);document.addEventListener("keyup",onDocumentKeyUp,!1);var lastTime=Date.now();init();animate();
function init(){container=document.createElement("div");document.body.appendChild(container);sceneHUD=new THREE.Scene;cameraHUD=new THREE.OrthographicCamera(-SCREEN_ASPECT,SCREEN_ASPECT,-1,1,-1,1);sceneHUD.add(cameraHUD);var a=new THREE.Geometry;a.vertices.push(new THREE.Vertex(new Vec3(1,0,0)));a.vertices.push(new THREE.Vertex(new Vec3(-0.1,-0.02,0)));a.vertices.push(new THREE.Vertex(new Vec3(-0.1,0.02,0)));a.faces.push(new THREE.Face3(0,1,2));a.computeCentroids();var b=new THREE.MeshBasicMaterial;
revMeter=new THREE.Mesh(a,b);revMeter.position.x=-1.5;revMeter.scale.multiplyScalar(0.4);sceneHUD.add(revMeter);scene=new THREE.Scene;camera=new THREE.PerspectiveCamera(75,SCREEN_WIDTH/SCREEN_HEIGHT,0.1,1E5);camera.position.x=2;camera.position.y=2;camera.position.z=2;scene.add(camera);a=new THREE.SphereGeometry(0.2,16,8);b=new THREE.MeshBasicMaterial;debugMesh=new THREE.Mesh(a,b);scene.add(debugMesh);scene.fog=new THREE.FogExp2(14540253,0.0010);a=new THREE.AmbientLight(4482688);scene.add(a);sunLightPos=
new Vec3(0,10,-15);sunLight=new THREE.DirectionalLight(16769211);sunLight.intensity=1.3;sunLight.position.copy(sunLightPos);sunLight.castShadow=!0;sunLight.shadowCameraNear=-10;sunLight.shadowCameraFar=50;sunLight.shadowCameraLeft=-14;sunLight.shadowCameraRight=14;sunLight.shadowCameraTop=14;sunLight.shadowCameraBottom=-14;sunLight.shadowDarkness=0.4;sunLight.shadowMapWidth=SHADOW_MAP_WIDTH;sunLight.shadowMapHeight=SHADOW_MAP_HEIGHT;scene.add(sunLight);webglRenderer=new THREE.WebGLRenderer({antialias:!1});
webglRenderer.setSize(SCREEN_WIDTH,SCREEN_HEIGHT);webglRenderer.domElement.style.position="relative";webglRenderer.shadowMapEnabled=!0;webglRenderer.shadowMapSoft=!0;webglRenderer.autoClear=!1;container.appendChild(webglRenderer.domElement);"undefined"!=typeof Stats&&(stats=new Stats,stats.domElement.style.position="absolute",stats.domElement.style.top="0px",stats.domElement.style.zIndex=100,container.appendChild(stats.domElement));textureCube=THREE.ImageUtils.loadTextureCube("/a/textures/Teide-1024/posx.jpg,/a/textures/Teide-1024/negx.jpg,/a/textures/Teide-1024/posy.jpg,/a/textures/Teide-1024/negy.jpg,/a/textures/Teide-1024/posz.jpg,/a/textures/Teide-1024/negz.jpg".split(","));
aud=new audio.WebkitAudio;sim=new psim.Sim;track=new level.Level;track.load("/a/tracks/lunar/lunar.json",function(){sim.addStaticObject(track.terrain);track.terrain.loadTile(0,0,drawTrack)});car=new Car;car.aud=aud;car.callback=function(a){a.attachPhysics(sim);var b=a.bodyGeometry.materials[0];b.envMap=textureCube;b.combine=THREE.MixOperation;b.reflectivity=0.1;b.wrapAround=0;b.ambient=b.color;b=a.wheelGeometry.materials[0];b.ambient=b.color;a.bodyMesh.castShadow=!0;a.bodyMesh.receiveShadow=!0;for(b=
0;b<a.wheels.length;++b)a.wheels[b].mesh.castShadow=!0,a.wheels[b].mesh.receiveShadow=!0;scene.add(a.root)};car.loadCar("/a/cars/car1.json");for(var e=[],a=0;100>a;++a)e.push(new Vec3(100+100*Math.random(),2.2,-100-100*Math.random())),e[e.length-1].rot=2*Math.random()*Math.PI,e[e.length-1].scl=2*Math.random()+2;a=new THREE.JSONLoader;a.load("/a/meshes/tree1a_lod2_tex_000.json",function(a){var b=a.materials[0];b.ambient=b.color;for(var d=0;d<e.length;++d){var g=new THREE.Mesh(a,b);g.castShadow=!0;
g.receiveShadow=!0;g.scale.set(e[d].scl,e[d].scl,e[d].scl);g.position.copy(e[d]);g.rotation.y=e[d].rot;scene.add(g)}},"/a/textures");a.load("/a/meshes/tree1a_lod2_tex_001.json",function(a){var b=a.materials[0];b.ambient=b.color;b.depthWrite=!1;b.transparent=!0;for(var d=0;d<e.length;++d){var g=new THREE.Mesh(a,b);g.castShadow=!0;g.doubleSided=!0;g.scale.set(e[d].scl,e[d].scl,e[d].scl);g.position.copy(e[d]);g.rotation.y=e[d].rot;scene.add(g)}},"/a/textures");drawCube()}
function drawCube(){var a=THREE.ShaderUtils.lib.cube;a.uniforms.tCube.texture=textureCube;a=new THREE.ShaderMaterial({fragmentShader:a.fragmentShader,vertexShader:a.vertexShader,uniforms:a.uniforms});a=new THREE.Mesh(new THREE.CubeGeometry(1E5,1E5,1E5),a);a.geometry.faces.splice(3,1);a.flipSided=!0;a.position.set(0,-1E3,0);scene.add(a)}
var drawTrack=function(a){var b=track.terrain,e=new THREE.PlaneGeometry(1,1,a.size,a.size),f,c,d=0;for(c=0;c<=a.size;++c)for(f=0;f<=a.size;++f)e.vertices[d].position.x=f*b.scaleHz,e.vertices[d].position.y=c*b.scaleHz,e.vertices[d].position.z=a.heightMap[d],++d;for(d=0;d<e.faces.length;++d)f=e.faces[d].a,e.faces[d].a=e.faces[d].c,e.faces[d].c=f,f=e.faceVertexUvs[0][d][0],e.faceVertexUvs[0][d][0]=e.faceVertexUvs[0][d][2],e.faceVertexUvs[0][d][2]=f;e.computeCentroids();e.computeFaceNormals();e.computeVertexNormals();
a=THREE.ImageUtils.loadTexture("/a/textures/mayang-earth.jpg");a.wrapS=a.wrapT=THREE.RepeatWrapping;a.repeat.set(100,100);a=new THREE.MeshLambertMaterial({map:a,wrapAround:!1});a.ambient=a.color;e=new THREE.Mesh(e,a);e.position.set(0,0,0);e.rotation.x=-Math.PI/2;e.castShadow=!1;e.receiveShadow=!0;scene.add(e)};function onDocumentMouseMove(a){mouseX=0.01*(a.clientX-windowHalfX);mouseY=0.01*(a.clientY-windowHalfY)}
function onDocumentKeyDown(a){keyDown[a.keyCode]=!0;switch(a.keyCode){case KEYCODE.C:cameraMode=(cameraMode+1)%CAMERA_MODES}return!1}function onDocumentKeyUp(a){return keyDown[a.keyCode]=!1}var DELETEME=0;
function animate(){if(loading){if(car.vehic&&track.terrain.getTile(0,0)){var a=document.getElementsByClassName("overlay")[0];a.className+=" loaded";loading=!1}}else{var b=Date.now(),a=Math.min(0.0010*(b-lastTime),0.1);lastTime=b;if(b=car.getControls())b.forward=keyDown[KEYCODE.UP]?1:0,b.back=keyDown[KEYCODE.DOWN]?1:0,b.left=keyDown[KEYCODE.LEFT]?1:0,b.right=keyDown[KEYCODE.RIGHT]?1:0,b.handbrake=keyDown[KEYCODE.SPACE]?1:0;sim.tick(a);car.update(a);if(car.vehic){var b=car.vehic.body.linVel,e=20*a;
camera.quaternion.x=PULLTOWARD(camera.quaternion.x,-car.root.quaternion.z,e);camera.quaternion.y=PULLTOWARD(camera.quaternion.y,car.root.quaternion.w,e);camera.quaternion.z=PULLTOWARD(camera.quaternion.z,car.root.quaternion.x,e);camera.quaternion.w=PULLTOWARD(camera.quaternion.w,-car.root.quaternion.y,e);camera.quaternion.normalize();switch(cameraMode){case 0:e=car.root.position.clone();e.addSelf(b.clone().multiplyScalar(0.17));e.addSelf(car.root.matrix.getColumnX().clone().multiplyScalar(0));e.addSelf(car.root.matrix.getColumnY().clone().multiplyScalar(1.2));
e.addSelf(car.root.matrix.getColumnZ().clone().multiplyScalar(-2.9));a*=5;camera.position.x=PULLTOWARD(camera.position.x,e.x,a);camera.position.y=PULLTOWARD(camera.position.y,e.y,a);camera.position.z=PULLTOWARD(camera.position.z,e.z,a);a=camera.position.clone();a.y-=1;a=sim.collide(a);for(b=0;b<a.length;++b)camera.position.y<a[b].surfacePos.y+1&&(camera.position.y=a[b].surfacePos.y+1);camera.useQuaternion=!1;a=car.root.position.clone();a.addSelf(car.root.matrix.getColumnY().clone().multiplyScalar(0.7));
camera.lookAt(a);break;case 1:camera.useQuaternion=!0,camera.updateMatrix(),camera.position.x=car.root.position.x+0.7*camera.matrix.n12,camera.position.y=car.root.position.y+0.7*camera.matrix.n22,camera.position.z=car.root.position.z+0.7*camera.matrix.n32,camera.matrix.setPosition(camera.position)}sunLight.target.position.copy(car.root.position);sunLight.position.copy(car.root.position).addSelf(sunLightPos);sunLight.updateMatrixWorld();sunLight.target.updateMatrixWorld();revMeter.rotation.z=2.5+4.5*
((car.vehic.engineAngVelSmoothed-car.vehic.engineIdle)/(car.vehic.engineRedline-car.vehic.engineIdle))}render()}stats&&stats.update();requestAnimationFrame(animate)}function render(){webglRenderer.render(scene,camera);webglRenderer.render(sceneHUD,cameraHUD)};