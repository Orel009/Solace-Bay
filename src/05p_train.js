// ---------- v6: Sky Line elevated train ----------
Object.assign(STR.he,{trBoard:'🚆 תחנת {0} — לחץ על כפתור הפעולה כדי לחכות לרכבת ({1}$)',trWait:'מחכה לרכבת בתחנת {0}... (הרכבת הבאה בעוד כ־{1} שנ׳). לחץ שוב כדי לוותר.',trOn:'עלית לרכבת. התחנה הבאה: {0}. לחץ על כפתור הרכב כדי לרדת.',trNext:'התחנה הבאה: {0}',trExitNext:'תרד בתחנה הבאה: {0}',trOff:'ירדת בתחנת {0}',trAt:'הרכבת בתחנת {0}. לחץ על כפתור הרכב כדי לרדת.',trCancel:'ויתרת על הרכבת',trNoWanted:'עם כוכבי משטרה אי אפשר לעלות לרכבת',trLine:'הקו העילי'});
Object.assign(STR.en,{trBoard:'🚆 {0} station — press the action button to wait for the train (${1})',trWait:'Waiting for the train at {0}... (next train in about {1}s). Press again to give up.',trOn:'You boarded the train. Next stop: {0}. Press the car button to get off.',trNext:'Next stop: {0}',trExitNext:'Getting off at the next stop: {0}',trOff:'You got off at {0}',trAt:'The train is at {0}. Press the car button to get off.',trCancel:'You gave up on the train',trNoWanted:'You cannot board the train with police stars',trLine:'Sky Line'});
Object.assign(MAPN,{train:R2('תחנת רכבת','Train station')});Object.assign(MAPC,{train:'#c9d6e3'});
const TRK={pts:[],cum:[],L:0},STATIONS=[],TRAINS=[],TRH=140,CARL=92,CARG=8,NCAR=3,TVMAX=560,TACC=140,TDEC=170;
function genTrack(){const y0=46.4*T,y1=115.6*T,x0=8.4*T,x1=339.6*T,r=4*T,P=[];
  const arc=(cx,cy,a0,a1)=>{for(let k=0;k<=8;k++){const a=a0+(a1-a0)*k/8;P.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}};
  P.push([x0+r,y0]);P.push([x1-r,y0]);arc(x1-r,y0+r,-Math.PI/2,0);P.push([x1,y1-r]);arc(x1-r,y1-r,0,Math.PI/2);P.push([x0+r,y1]);arc(x0+r,y1-r,Math.PI/2,Math.PI);P.push([x0,y0+r]);arc(x0+r,y0+r,Math.PI,Math.PI*1.5);
  TRK.pts=P;TRK.cum=[0];for(let i=1;i<P.length;i++)TRK.cum.push(TRK.cum[i-1]+hyp(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));TRK.L=TRK.cum[TRK.cum.length-1];
  const S=(name,tx,ty)=>{let best=null,bd=1e9;for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const x=Math.floor(tx)+dx,y=Math.floor(ty)+dy,t=tget(x,y);if(t!==TL.WALK&&t!==TL.CONC&&t!==TL.SAND&&t!==TL.GRASS)continue;const d=hyp(dx,dy);if(d<bd){bd=d;best=[(x+0.5)*T,(y+0.5)*T];}}
    if(!best)return;const s=trkProj(best[0],best[1]);STATIONS.push({name,s,gx:best[0],gy:best[1]});};
  S(R2('גבעות הניאון','Neon Heights'),40,47.5);S(R2('טיילת המרינה','Marina Mile'),96,47.5);S(R2('רמת הכתר','Crown Heights'),197,47.5);S(R2('רובע הזכוכית','Glass Quarter'),292,47.5);
  S(R2('שדרות השקיעה','Sunset Vista'),338.5,80);S(R2('המפחה','The Forge'),318,114.5);S(R2('שער המזרח','Eastgate'),205,114.5);S(R2('שוק המלח','Saltmarket'),62,114.5);S(R2('הפרדס הישן','Old Orchard'),9.5,80);
  STATIONS.sort((a,b)=>a.s-b.s);STATIONS.forEach((st,i)=>{st.i=i;const q=trkAt(st.s);st.px=q.x;st.py=q.y;st.a=q.a;
    USES.push({x:st.gx,y:st.gy,r:48,ic:'🚆',col:'#c9d6e3',station:st,lb:R2('',''),fn(){trainUse(this.station);}});});
  for(let k=0;k<3;k++)TRAINS.push({s:STATIONS[k*3].s,v:0,st:'stop',t:4+k*2,at:STATIONS[k*3],col:['#d8dee6','#e9e2cf','#d6e6df'][k],stripe:['#e84393','#00b4d8','#f39c12'][k]});}
function trkProj(x,y){let bs=0,bd=1e18;const P=TRK.pts;for(let i=1;i<P.length;i++){const ax=P[i-1][0],ay=P[i-1][1],dx=P[i][0]-ax,dy=P[i][1]-ay,l2=dx*dx+dy*dy||1,t=clamp(((x-ax)*dx+(y-ay)*dy)/l2,0,1),qx=ax+dx*t,qy=ay+dy*t,d=(qx-x)**2+(qy-y)**2;if(d<bd){bd=d;bs=TRK.cum[i-1]+Math.sqrt(l2)*t;}}return bs;}
function trkAt(s){s=((s%TRK.L)+TRK.L)%TRK.L;const C=TRK.cum,P=TRK.pts;let lo=0,hi=C.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(C[m]<=s)lo=m;else hi=m;}
  const t=(s-C[lo])/((C[hi]-C[lo])||1),x=P[lo][0]+(P[hi][0]-P[lo][0])*t,y=P[lo][1]+(P[hi][1]-P[lo][1])*t;return{x,y,a:Math.atan2(P[hi][1]-P[lo][1],P[hi][0]-P[lo][0])};}
const fwd=(a,b)=>((b-a)%TRK.L+TRK.L)%TRK.L;
function nextStation(s){let best=null,bd=1e18;for(const st of STATIONS){const d=fwd(s+1,st.s);if(d<bd){bd=d;best=st;}}return best;}
function trainsTick(dt){if(!TRAINS.length)return;const P=G.player;
  for(const tr of TRAINS){if(tr.st==='stop'){tr.t-=dt;tr.v=0;if(tr.t<=0){tr.st='run';tr.at=null;tr.nx=nextStation(tr.s);if(P.ride&&P.ride.tr===tr){toast(fmt(tr2('trNext'),L(tr.nx.name)),3);}}continue;}
    if(!tr.nx)tr.nx=nextStation(tr.s);const dist=fwd(tr.s,tr.nx.s);let ahead=1e9;for(const o of TRAINS)if(o!==tr){const d=fwd(tr.s,o.s-(CARL+CARG)*NCAR-60);if(d<ahead)ahead=d;}
    const tgt=Math.min(TVMAX,Math.sqrt(2*TDEC*Math.max(0,Math.min(dist,ahead)-2)));tr.v=tr.v<tgt?Math.min(tgt,tr.v+TACC*dt):Math.max(tgt,tr.v-TDEC*1.6*dt);tr.s=(tr.s+tr.v*dt)%TRK.L;
    if(dist<4&&tr.v<30){tr.s=tr.nx.s;tr.v=0;tr.st='stop';tr.t=7;tr.at=tr.nx;tr.nx=null;if(P.ride&&P.ride.tr===tr){if(P.ride.exit)trainExit(tr.at);else toast(fmt(tr2('trAt'),L(tr.at.name)),3);}
      else if(P.ride&&P.ride.wait===tr.at&&!P.ride.tr){P.ride={tr,exit:false};sfx.door();toast(fmt(tr2('trOn'),L(nextStation(tr.s).name)),4);}}}
  if(AU.ctx&&AU.amb){if(!AU.amb.train){const x=AU.ctx,s2=x.createBufferSource();s2.buffer=AU.noise;s2.loop=true;const fl=x.createBiquadFilter();fl.type='lowpass';fl.frequency.value=220;const gn=x.createGain();gn.gain.value=0;s2.connect(fl);fl.connect(gn);gn.connect(AU.master);s2.start();AU.amb.train=gn.gain;}
    let near=1e9,sp=0;for(const tr of TRAINS){const q=trkAt(tr.s-CARL),d=P.ride&&P.ride.tr===tr?0:hyp(q.x-P.x,q.y-P.y);if(d<near){near=d;sp=tr.v;}}
    const k=near<900?(1-near/900)*Math.min(1,sp/300):0;AU.amb.train.setTargetAtTime((G.state==='play'?k*0.16:0),AU.ctx.currentTime,0.2);
    if(k>0.15&&G.state==='play'){G.clackT=(G.clackT||0)-dt*sp/300;if(G.clackT<=0){G.clackT=0.55;aT(70,0.06,'sine',0.25*k,{to:45});aT(70,0.06,'sine',0.22*k,{to:45,at:0.11});aN(0.05,0.08*k,'bandpass',900,2,{at:0.01});}}}}
function tr2(k){return tr(k);}
function trainUse(st){const P=G.player;if(P.ride&&P.ride.wait){P.ride=null;toast(tr('trCancel'),2);return;}
  if(G.wanted>0){toast(tr('trNoWanted'),2.5);sfx.no();return;}if(G.money<5){toast(tr('nomoney2'),2);sfx.no();return;}
  const here=TRAINS.find(t=>t.st==='stop'&&t.at===st);G.money-=5;sfx.blip();
  if(here){P.ride={tr:here,exit:false};sfx.door();toast(fmt(tr('trOn'),L(nextStation(here.s).name)),4);return;}
  let eta=1e9;for(const t of TRAINS){const d=fwd(t.s,st.s);eta=Math.min(eta,d/380+(t.st==='stop'?t.t:0)+4);}P.ride={wait:st};toast(fmt(tr('trWait'),L(st.name),Math.round(eta)),5);}
function trainExit(st){const P=G.player;P.ride=null;P.x=st.gx;P.y=st.gy;P.mvx=P.mvy=0;sfx.door();toast(fmt(tr('trOff'),L(st.name)),3);G.gpsT=0;}
function rideUpdate(dt){const P=G.player,R=P.ride;
  if(R.wait){P.walk=0;P.mvx=P.mvy=0;if(IN.enterP){IN.enterP=false;trainUse(R.wait);}if(G.wanted>0){P.ride=null;}return;}
  const tn=R.tr,q=trkAt(tn.s-CARL-CARG/2-CARL/2);P.x=q.x;P.y=q.y;P.a=q.a;P.walk=0;P.mvx=tn.v*Math.cos(q.a)*0.6;P.mvy=tn.v*Math.sin(q.a)*0.6;
  if(IN.enterP){IN.enterP=false;if(tn.st==='stop'&&tn.at)trainExit(tn.at);else{R.exit=!R.exit;const nx=tn.nx||nextStation(tn.s);toast(R.exit?fmt(tr('trExitNext'),L(nx.name)):fmt(tr('trNext'),L(nx.name)),2.5);}}}
// ---------- drawing ----------
function drawTrack(inV){const DK=c=>ENV.dark>0.03?shade(c,-ENV.dark*0.62):c,P=TRK.pts,c=G.cam,vw=G.view;if(!P.length||!vw)return;const pad=400,inb=(x,y)=>x>vw[0]-pad&&x<vw[2]+pad&&y>vw[1]-pad&&y<vw[3]+pad,segIn=(a,b)=>Math.max(a[0],b[0])>vw[0]-pad&&Math.min(a[0],b[0])<vw[2]+pad&&Math.max(a[1],b[1])>vw[1]-pad&&Math.min(a[1],b[1])<vw[3]+pad,d=ENV.dark,su=ENV.sun;
  // pillars + shadow
  g.fillStyle=`rgba(0,4,18,${0.22*(1-d*0.5)})`;for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i];if(!segIn(a,b))continue;const L2=hyp(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.floor(L2/(6*T)));
    for(let k=0;k<=n;k++){const x=a[0]+(b[0]-a[0])*k/n,y=a[1]+(b[1]-a[1])*k/n;if(!inV(x,y,60))continue;g.fillStyle=DK('#8d949c');g.fillRect(x-9,y-9,18,18);const q=projPt(x,y,TRH);g.strokeStyle=DK('#7a828b');g.lineWidth=14;g.beginPath();g.moveTo(x,y);g.lineTo(q[0],q[1]);g.stroke();}}
  const vx0=vw[0]-pad,vy0=vw[1]-pad,vx1=vw[2]+pad,vy1=vw[3]+pad,segs=[];
  for(let i=1;i<P.length;i++){let [ax,ay]=P[i-1],[bx,by]=P[i];const dx=bx-ax,dy=by-ay;let t0=0,t1=1,ok=true;
    for(const [pp,qq] of [[-dx,ax-vx0],[dx,vx1-ax],[-dy,ay-vy0],[dy,vy1-ay]]){if(pp===0){if(qq<0){ok=false;break;}}else{const r=qq/pp;if(pp<0){if(r>t1){ok=false;break;}if(r>t0)t0=r;}else{if(r<t0){ok=false;break;}if(r<t1)t1=r;}}}
    if(ok)segs.push([projPt(ax+dx*t0,ay+dy*t0,TRH),projPt(ax+dx*t1,ay+dy*t1,TRH)]);}
  const beam=(w,col,cap)=>{g.strokeStyle=col;g.lineWidth=w;g.lineCap=cap||'round';g.beginPath();for(const [a,b] of segs){g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);}g.stroke();};
  g.save();beam(46,DK('#5d646c'));beam(40,DK('#a9b1ba'));beam(30,DK('#6f6656'));beam(2.5,DK('#d0d5da'));g.setLineDash([3,9]);beam(26,DK('#4a4038'),'butt');g.restore();
  // stations: platform + canopy + sign
  for(const st of STATIONS){if(!inV(st.px,st.py,260))continue;g.save();const q=projPt(st.px,st.py,TRH);g.translate(q[0],q[1]);g.rotate(st.a);
    g.fillStyle='rgba(0,0,0,0.25)';g.fillRect(-150,22,300,8);g.fillStyle=DK('#c3c9cf');g.fillRect(-150,20,300,34);g.fillStyle=DK('#e6e9ec');g.fillRect(-150,20,300,5);g.fillStyle='#ffd23f';g.fillRect(-150,23,300,3);
    g.fillStyle=DK('#2f3a46');rrect(g,-120,30,240,22,6);g.fill();g.fillStyle='rgba(255,255,255,0.12)';for(let k=-110;k<120;k+=30)g.fillRect(k,32,14,18);
    g.restore();const sg=projPt(st.gx,st.gy,TRH*0.55);g.strokeStyle='#5d646c';g.lineWidth=5;g.beginPath();g.moveTo(st.gx,st.gy);g.lineTo(sg[0],sg[1]);g.stroke();
    g.fillStyle='#1f5f8b';rrect(g,sg[0]-58,sg[1]-13,116,26,6);g.fill();g.strokeStyle='#e6e9ec';g.lineWidth=2;rrect(g,sg[0]-58,sg[1]-13,116,26,6);g.stroke();g.save();g.fillStyle='#fff';g.font='bold 12px Rubik,sans-serif';g.textAlign='center';g.textBaseline='middle';g.direction=G.lang==='he'?'rtl':'ltr';g.fillText('🚆 '+L(st.name),sg[0],sg[1]+1,110);g.restore();}
  // trains
  for(const tr of TRAINS)for(let k=0;k<NCAR;k++){const s=tr.s-k*(CARL+CARG)-CARL/2,q=trkAt(s);if(!inV(q.x,q.y,120))continue;const a=trkAt(s+CARL*0.45),b=trkAt(s-CARL*0.45),ang=Math.atan2(a.y-b.y,a.x-b.x),pp=projPt(q.x,q.y,TRH+14);
    g.fillStyle=`rgba(0,4,18,${0.28*(1-d*0.5)})`;g.save();g.translate(q.x+su.ox*60+20,q.y+su.oy*60+26);g.rotate(ang);rrect(g,-CARL/2,-16,CARL,32,12);g.fill();g.restore();
    g.save();g.translate(pp[0],pp[1]);g.rotate(ang);const nose=k===0?1:k===NCAR-1?-1:0;
    g.beginPath();const L2=CARL/2,W2=17;g.moveTo(-L2+(nose<0?16:5),-W2);g.lineTo(L2-(nose>0?18:5),-W2);if(nose>0)g.quadraticCurveTo(L2+4,-W2,L2+4,0),g.quadraticCurveTo(L2+4,W2,L2-18,W2);else g.quadraticCurveTo(L2,-W2,L2,-W2+5),g.lineTo(L2,W2-5),g.quadraticCurveTo(L2,W2,L2-5,W2);
    g.lineTo(-L2+(nose<0?16:5),W2);if(nose<0)g.quadraticCurveTo(-L2-4,W2,-L2-4,0),g.quadraticCurveTo(-L2-4,-W2,-L2+16,-W2);else g.quadraticCurveTo(-L2,W2,-L2,W2-5),g.lineTo(-L2,-W2+5),g.quadraticCurveTo(-L2,-W2,-L2+5,-W2);g.closePath();
    const gr=g.createLinearGradient(0,-W2,0,W2);gr.addColorStop(0,DK(shade(tr.col,0.15)));gr.addColorStop(0.5,DK(tr.col));gr.addColorStop(1,DK(shade(tr.col,-0.25)));g.fillStyle=gr;g.fill();g.strokeStyle='rgba(0,0,0,0.45)';g.lineWidth=1.5;g.stroke();
    g.fillStyle=tr.stripe;g.fillRect(-L2+6,-W2+2,CARL-12,3);g.fillRect(-L2+6,W2-5,CARL-12,3);g.fillStyle=d>0.4?'rgba(255,236,180,0.95)':'#33495c';for(let x=-L2+12;x<L2-12;x+=15){g.fillRect(x,-W2+6,10,4);g.fillRect(x,W2-10,10,4);}
    g.fillStyle='rgba(0,0,0,0.18)';g.fillRect(-L2+10,-3,CARL-20,6);g.fillStyle='#7d8791';g.fillRect(-12,-8,24,16);
    if(nose){g.fillStyle='#1d2733';const nx=nose>0?L2-10:-L2+4;g.beginPath();g.ellipse(nx+3,0,6,12,0,0,TAU);g.fill();g.fillStyle=nose>0?'#fff3b8':'#ff4a3a';g.fillRect(nose>0?L2:-L2-3,-11,3,5);g.fillRect(nose>0?L2:-L2-3,6,3,5);}
    if(G.player.ride&&G.player.ride.tr===tr&&k===1){g.fillStyle='#7dffb0';g.beginPath();g.arc(0,0,6,0,TAU);g.fill();g.strokeStyle='#0b1020';g.lineWidth=2;g.stroke();}g.restore();}}
function trainGlow(){if(ENV.dark<0.2)return;g.globalCompositeOperation='lighter';for(const tr of TRAINS){const h=trkAt(tr.s),hp=projPt(h.x,h.y,TRH+14);if(Math.abs(h.x-G.cam.x)>1400||Math.abs(h.y-G.cam.y)>1000)continue;glow(g,GL.warm,hp[0]+Math.cos(h.a)*40,hp[1]+Math.sin(h.a)*40,120,ENV.dark*0.6);
    for(let k=0;k<NCAR;k++){const q=trkAt(tr.s-k*(CARL+CARG)-CARL/2),pp=projPt(q.x,q.y,TRH+14);glow(g,GL.warm,pp[0],pp[1],70,ENV.dark*0.35);}}
  for(const st of STATIONS){if(Math.abs(st.px-G.cam.x)>1400||Math.abs(st.py-G.cam.y)>1000)continue;const q=projPt(st.px,st.py,TRH);glow(g,GL.white,q[0],q[1],170,ENV.dark*0.35);}g.globalAlpha=1;g.globalCompositeOperation='source-over';}
function trackMini(c,ox,oy,sc,w){const P=TRK.pts;if(!P.length)return;c.strokeStyle='rgba(200,214,227,0.9)';c.lineWidth=w;c.setLineDash([w*2,w*1.3]);c.beginPath();for(let i=0;i<P.length;i++){const x=ox+P[i][0]*sc,y=oy+P[i][1]*sc;if(i)c.lineTo(x,y);else c.moveTo(x,y);}c.closePath();c.stroke();c.setLineDash([]);}
