const ENV={clock:8,dayLen:540,weather:'clear',wT:80,rain:0,rainT:0,fog:0,fogT:0,cloud:0,cloudT:0,wind:0.3,windT:0.3,flash:0,wet:0,dark:0,amb:[255,255,255],sun:{ox:0,oy:0,a:0},thunder:0};
const WEATHERS={clear:{rain:0,fog:0,cloud:0,w:5},cloudy:{rain:0,fog:0,cloud:0.8,w:3},rain:{rain:0.6,fog:0.1,cloud:1,w:2.4},storm:{rain:1,fog:0.15,cloud:1,w:1.2},fog:{rain:0,fog:0.8,cloud:0.5,w:1}};
const WNAME={clear:{he:'בהיר',en:'Clear'},cloudy:{he:'מעונן',en:'Cloudy'},rain:{he:'גשם',en:'Rain'},storm:{he:'סערה',en:'Storm'},fog:{he:'ערפל',en:'Fog'}};
const appr=(a,b,s)=>a<b?Math.min(b,a+s):Math.max(b,a-s);
function setWeather(k,instant){ENV.weather=k;const w=WEATHERS[k];ENV.rainT=w.rain;ENV.fogT=w.fog;ENV.cloudT=w.cloud;ENV.windT=k==='storm'?1:k==='rain'?0.6:rr(0.1,0.5);ENV.wT=rr(70,150);
  if(instant){ENV.rain=w.rain;ENV.fog=w.fog;ENV.cloud=w.cloud;ENV.wind=ENV.windT;ENV.wet=w.rain>0?1:0;}}
function pickWeather(){let tot=0;for(const k in WEATHERS)if(k!==ENV.weather)tot+=WEATHERS[k].w;let r=rand()*tot;
  for(const k in WEATHERS){if(k===ENV.weather)continue;r-=WEATHERS[k].w;if(r<=0){setWeather(k);return;}}}
function updateEnv(dt){ENV.clock=(ENV.clock+dt*24/ENV.dayLen)%24;ENV.wT-=dt;if(ENV.wT<=0)pickWeather();
  ENV.rain=appr(ENV.rain,ENV.rainT,dt*0.07);ENV.fog=appr(ENV.fog,ENV.fogT,dt*0.05);ENV.cloud=appr(ENV.cloud,ENV.cloudT,dt*0.06);ENV.wind=appr(ENV.wind,ENV.windT,dt*0.05);
  ENV.wet=ENV.rain>0.05?Math.min(1,ENV.wet+dt*0.06*(0.5+ENV.rain)):Math.max(0,ENV.wet-dt*0.012);
  if(ENV.flash>0)ENV.flash=Math.max(0,ENV.flash-dt*2.2);
  if(ENV.weather==='storm'&&ENV.rain>0.7&&rand()<dt*0.09){ENV.flash=1;ENV.thunder=rr(0.4,1.6);}
  if(ENV.thunder>0){ENV.thunder-=dt;if(ENV.thunder<=0)sfx.thunder();}
  calcLight();}
function calcLight(){const h=ENV.clock,d=h<5?1:h<7?1-(h-5)/2:h<18?0:h<20?(h-18)/2:1;ENV.dark=d;
  const tw=1-Math.abs(d-0.5)*2;let r=lerp(255,58,d),gg=lerp(255,70,d),b=lerp(255,126,d);
  r=lerp(r,255,tw*0.45);gg=lerp(gg,150,tw*0.3);b=lerp(b,120,tw*0.3);
  const dim=1-0.26*ENV.cloud*(1-d)-0.08*ENV.rain;ENV.amb=[r*dim|0,gg*dim|0,Math.min(255,b*dim*1.03)|0];
  const t=clamp((h-6)/12,0,1),c=Math.cos(Math.PI*t);ENV.sun={ox:-c*(0.25+0.75*Math.abs(c)),oy:-0.32,a:(1-d)*(1-0.8*ENV.cloud)*0.27};}
function clockStr(){const h=Math.floor(ENV.clock),m=Math.floor((ENV.clock-h)*6)*10;return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');}
// traffic lights: returns [east-west, north-south]
function lightState(i,j){const t=(G.time+((i*3+j*5)%14))%14;return[t<7?'r':t<12.5?'g':'y',t<5.5?'g':t<7?'y':'r'];}
function sightRange(){return lerp(760,480,ENV.dark)*(1-0.3*ENV.fog-0.12*ENV.rain);}
function copVisible(){if(G.player.ride&&G.player.ride.tr)return false;if(G.heli&&G.heli.see)return true;const P=G.player,px=P.x,py=P.y,R=sightRange(),R2=R*R;
  for(const p of G.peds)if(p.type==='cop'&&!p.dead&&(p.x-px)**2+(p.y-py)**2<R2&&los(p.x,p.y,px,py))return true;
  for(const v of G.vehicles)if((v.t.police||v.t.army)&&!v.dead&&v.ai&&v.ai.mode==='chase'&&(v.x-px)**2+(v.y-py)**2<R2&&los(v.x,v.y,px,py))return true;
  for(const v of G.vehicles)if(v.t.police&&!v.dead&&v.driver==='cop'&&(v.x-px)**2+(v.y-py)**2<R2&&los(v.x,v.y,px,py))return true;
  return false;}
const AREAS={down:{he:'גבעות הניאון',en:'Neon Heights'},res:{he:'הפרדס הישן',en:'Old Orchard'},harb:{he:'שוק המלח',en:'Saltmarket'},beach:{he:'טיילת המרינה',en:'Marina Mile'},fort:{he:'מבצר קולר',en:'Fort Collar'}};
function areaAt(x,y){const tx=x/T,ty=y/T;if(tx>=124&&tx<=160&&ty>=12&&ty<=54)return'fort';if(tx>=258&&tx<=350&&ty>=4&&ty<=194)return district(tx,ty);if(tx>=168&&tx<=252&&ty>=4&&ty<=194)return district(tx,ty);if(tx<4||ty<4||tx>118||ty>146)return null;return district(tx,ty);}
