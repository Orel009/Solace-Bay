// ---------- ducks: live duck families, crossings, feeding, angry moms, golden duckling, rubber duck, pet duck ----------
const DSPOT=[];let RUBBER=null;
const DUCKC={f:{b:'#8a6a45',w:'#5d4630',h:'#7a5b3a'},m:{b:'#cfc8b8',w:'#7a6a58',h:'#1f7a3a'},pet:{b:'#f4f1ea',w:'#d9d2c3',h:'#f4f1ea'}};
function dWalk(x,y,road){const t=tileAt(x,y);return t!==TL.BLD&&t!==TL.FENCE&&(road||t!==TL.ROAD);}
function dWater(x,y){return tileAt(x,y)===TL.WATER;}
function genDucks(){const N=MW*MH,lab=new Int32Array(N).fill(-1);let id=0;const comps=[];
  for(let i=0;i<N;i++){if(lab[i]>=0||MAP[i]!==TL.WATER)continue;const st=[i];lab[i]=id;let n=0,sx=0,sy=0,big=false;
    while(st.length){const k=st.pop();n++;const x=k%MW,y=(k/MW)|0;sx+=x;sy+=y;if(n>120)big=true;
      if(x===0||y===0||x===MW-1||y===MH-1){big=true;}
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=MW||ny>=MH)continue;const q=ny*MW+nx;if(lab[q]<0&&MAP[q]===TL.WATER){lab[q]=id;st.push(q);}}}
    if(!big&&n>=2)comps.push({x:(sx/n+0.5)*T,y:(sy/n+0.5)*T,n});id++;}
  for(const c of comps)DSPOT.push({x:c.x,y:c.y,pond:1,cool:0});
  const R=mulberry32(4242),sand=[];for(let y=2;y<MH-2;y+=2)for(let x=2;x<MW-2;x+=2){if(tget(x,y)!==TL.SAND)continue;let w=0;for(const [dx,dy] of [[2,0],[-2,0],[0,2],[0,-2]])if(tget(x+dx,y+dy)===TL.WATER)w++;if(w)sand.push([x,y]);}
  for(let k=0;k<400&&DSPOT.length<comps.length+16;k++){const s=sand[Math.floor(R()*sand.length)];if(!s)break;const x=(s[0]+0.5)*T,y=(s[1]+0.5)*T;if(DSPOT.some(d=>hyp(d.x-x,d.y-y)<26*T))continue;DSPOT.push({x,y,cool:0});}
  for(const sp of DSPOT){sp.cross=[];for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){let mode=0,a=null;const hx=Math.floor(sp.x/T),hy=Math.floor(sp.y/T);
    for(let s=1;s<16;s++){const t=tget(hx+dx*s,hy+dy*s);if(t===TL.BLD||t===TL.FENCE)break;if(mode===0&&t!==TL.ROAD&&t!==TL.WATER){a={x:(hx+dx*s+0.5)*T,y:(hy+dy*s+0.5)*T};}
      if(t===TL.ROAD){if(!a)break;mode=1;}else if(mode===1&&t!==TL.WATER){sp.cross.push([a,{x:(hx+dx*s+0.5)*T,y:(hy+dy*s+0.5)*T}]);break;}}}}
  const pr=POI.pier||POI.tide;if(pr&&typeof nearWater==='function'){const w=nearWater(pr.x-380,pr.y+260);if(w)RUBBER={x:w.x,y:w.y,hx:w.x,hy:w.y,vx:0,vy:0,hits:0,sq:0};}}
function quack(x,y,p,n,v){const k=(v==null?1:v)*dv(x,y);if(k<0.04)return;for(let i=0;i<(n||1);i++)aT(560*(p||1),0.12,'sawtooth',0.17*k,{to:330*(p||1),lp:1500,bp:1,q:3,at:i*0.17});}
function peep(x,y){const k=dv(x,y);if(k<0.05)return;aT(2500+rr(-200,200),0.06,'sine',0.07*k,{to:3300});}
function squeak(x,y){const k=dv(x,y);if(k<0.05)return;aT(1700,0.09,'sine',0.2*k,{to:2600});aT(2600,0.12,'sine',0.16*k,{to:1500,at:0.1});}
function mkDuck(gr,k,x,y){const d={g:gr,k,x,y,a:rr(0,TAU),ph:rr(0,9),z:0,vz:0,st:'idle',dead:false,t:0};G.ducks.push(d);gr.m.push(d);return d;}
function spawnDuckGroup(sp,opt){opt=opt||{};const gr={sp,home:{x:sp.x,y:sp.y},m:[],mode:'idle',t:rr(1,3),tx:sp.x,ty:sp.y,crossT:rr(12,30),noise:rr(2,5)};G.dgroups.push(gr);
  const ok=(x,y)=>dWater(x,y)||dWalk(x,y);const pt=()=>{for(let k=0;k<20;k++){const x=sp.x+rr(-90,90),y=sp.y+rr(-90,90);if(ok(x,y))return[x,y];}return[sp.x,sp.y];};
  if(opt.momOnly){const[x,y]=pt();mkDuck(gr,'f',x,y);gr.wait=1;return gr;}
  const fam=rand()<0.62;if(fam){let [x,y]=pt();mkDuck(gr,'f',x,y);if(rand()<0.5)mkDuck(gr,'m',x+rr(-20,20),y+rr(-20,20));const nb=2+Math.floor(rand()*5);for(let i=0;i<nb;i++)mkDuck(gr,rand()<0.06&&!G.got.includes('egg_goldduck')?'gold':'b',x-rr(10,40),y+rr(-20,20));}
  else{const n=2+Math.floor(rand()*3);for(let i=0;i<n;i++){const[x,y]=pt();mkDuck(gr,rand()<0.5?'m':'f',x,y);}}
  return gr;}
function duckLead(gr){return gr.m.find(d=>!d.dead&&!d.gone&&d.k!=='b'&&d.k!=='gold'&&d.st!=='fly')||gr.m.find(d=>!d.dead&&!d.gone);}
function ducksScare(x,y,r){if(!G.ducks)return;for(const gr of G.dgroups){if(gr.lost||gr.chain)continue;let hit=false;for(const d of gr.m){if(d.dead||d.gone||d.pet)continue;if(hyp(d.x-x,d.y-y)<r){hit=true;break;}}if(!hit)continue;
  gr.mode='flee';gr.t=rr(5,7);gr.fx=x;gr.fy=y;let q=0;for(const d of gr.m){if(d.dead||d.gone)continue;if(d.k==='b'||d.k==='gold'){d.st='run';}else{d.st='fly';d.vz=70;}if(q++<2)quack(d.x,d.y,rr(0.95,1.15),2);}
  if(!gr.momBack)gr.momBack=rr(9,14);}}
function ducksBoom(x,y){if(!G.ducks)return;for(const d of G.ducks)if(!d.dead&&!d.gone&&!d.pet&&hyp(d.x-x,d.y-y)<130)killDuck(d,G.player,'boom');ducksScare(x,y,650);}
function ducksCall(){if(!G.ducks)return;const P=G.player;let n=0;for(const gr of G.dgroups){if(gr.lost||gr.chain||gr.mode==='flee'||gr.wait)continue;const L0=duckLead(gr);if(!L0||hyp(L0.x-P.x,L0.y-P.y)>280)continue;gr.mode='follow';gr.t=25;n++;quack(L0.x,L0.y,1,2);}
  if(n){if(!G.duckFollowTip){G.duckFollowTip=1;toast(L(R2('🦆 הברווזים עוקבים אחריך! (שריקה נוספת מאריכה)','🦆 The ducks are following you! (whistle again to keep them)')),4);}react(nearestCiv(P.x,P.y,260),'duckFollow');}}
function killDuck(d,by,how){if(d.dead||d.gone||d.pet)return;d.dead=true;d.deadT=0;d.st='dead';const pl=by===G.player||(by&&by===G.player.veh);
  aT(700,0.18,'sawtooth',0.2*dv(d.x,d.y),{to:200,lp:1800});for(let i=0;i<(d.k==='b'?6:12);i++)G.dfeath.push({x:d.x,y:d.y,z:6,vx:rr(-70,70),vy:rr(-70,70),vz:rr(40,110),r:rr(0,TAU),life:rr(1.6,2.6),c:d.k==='b'?'#ffe27a':d.k==='gold'?'#ffd700':rand()<0.5?'#f4f1ea':DUCKC[d.k]?DUCKC[d.k].b:'#ddd'});
  if(!pl)return;G.duckKills=(G.duckKills||0)+1;react(nearestCiv(d.x,d.y,320),'duckDead');crime(0.5);
  if(G.duckKills===1)toast(L(R2('🦆 הרגת ברווז. איגוד הברווזים של סולס ביי פתח בחקירה.','🦆 You killed a duck. The Solace Bay Duck Union has opened an investigation.')),4);
  else if(G.duckKills===10)toast(L(R2('🦆 10 ברווזים. הברווזים כבר תולים את התמונה שלך בפארק.','🦆 10 ducks. The ducks have put your photo up in the park.')),4);
  const gr=d.g;if((d.k==='b'||d.k==='gold')&&gr){const mom=gr.m.find(o=>!o.dead&&!o.gone&&o.k==='f'&&o.st!=='fly');if(mom){mom.st='angry';mom.t=14;quack(mom.x,mom.y,0.8,3,1.3);if(!G.momTip){G.momTip=1;toast(L(R2('🦆 אמא ברווזה רוצה נקמה! ברח!','🦆 Mama duck wants revenge! Run!')),4);}}}}
function duckHit(b){if(!G.ducks)return false;for(const d of G.ducks){if(d.dead||d.gone||d.pet||d.z>40)continue;if((d.x-b.x)**2+(d.y-b.y)**2<(d.k==='b'?100:170)){killDuck(d,b.op,'shot');return !b.expl;}}
  const R0=RUBBER;if(R0&&(R0.x-b.x)**2+(R0.y-b.y)**2<45*45){squeak(R0.x,R0.y);R0.vx+=b.vx*0.02;R0.vy+=b.vy*0.02;R0.sq=0.5;if(++R0.hits===12)secret('rubber');return true;}return false;}
function duckMove(d,tx,ty,sp,dt,road){const dx=tx-d.x,dy=ty-d.y,dd=hyp(dx,dy);if(dd<2)return 0;const wa=Math.atan2(dy,dx);d.a+=clamp(angDiff(d.a,wa),-dt*8,dt*8);
  const s=Math.min(sp*dt,dd),nx=d.x+Math.cos(wa)*s,ny=d.y+Math.sin(wa)*s;
  if(dWater(nx,ny)||dWalk(nx,ny,road)){d.x=nx;d.y=ny;d.ph+=dt*(dWater(nx,ny)?3:12);return s;}
  if(dWater(nx,d.y)||dWalk(nx,d.y,road)){d.x=nx;d.ph+=dt*12;return s;}if(dWater(d.x,ny)||dWalk(d.x,ny,road)){d.y=ny;d.ph+=dt*12;return s;}return 0;}
function pickDuckTarget(gr){const h=gr.home;for(let k=0;k<14;k++){const x=h.x+rr(-150,150),y=h.y+rr(-150,150);if(dWater(x,y)||dWalk(x,y)){gr.tx=x;gr.ty=y;return;}}gr.tx=h.x;gr.ty=h.y;}
function ducksTick(dt){if(!G.ducks){G.ducks=[];G.dgroups=[];G.dfeath=[];}const P=G.player,px=P.veh?P.veh.x:P.x,py=P.veh?P.veh.y:P.y;
  G.duckSpT=(G.duckSpT||0)-dt;if(G.duckSpT<=0){G.duckSpT=1.2;
    for(const sp of DSPOT){if(sp.cool>0){sp.cool-=1.2;continue;}if(sp.act)continue;const d=hyp(sp.x-px,sp.y-py);if(d<1350&&d>(G.time<6?0:420)&&G.dgroups.filter(g0=>!g0.lost&&!g0.chain).length<7){sp.act=1;spawnDuckGroup(sp);}}
    for(const gr of G.dgroups){if(gr.lost||gr.chain||gr.wait)continue;const alive=gr.m.filter(d=>!d.dead&&!d.gone);let far=true;for(const d of gr.m)if(hyp(d.x-px,d.y-py)<1900)far=false;if(far||!alive.length&&gr.m.every(d=>d.deadT>15)){gr.dead=1;gr.sp.act=0;gr.sp.cool=20;}}
    if(G.dgroups.some(g0=>g0.dead)){G.dgroups=G.dgroups.filter(g0=>!g0.dead);G.ducks=G.ducks.filter(d=>d.g&&!d.g.dead||d.pet);}
    G.ducks=G.ducks.filter(d=>!d.gone);
    if(G.got.includes('petduck')&&!G.ducks.some(d=>d.pet)){const gr={m:[],pet:1,home:{x:px,y:py},mode:'pet'};G.dgroups.push(gr);const d=mkDuck(gr,'pet',P.x-30,P.y+20);d.pet=1;}}
  // groups
  for(const gr of G.dgroups){if(gr.pet||gr.lost)continue;const lead=duckLead(gr);if(!lead)continue;gr.t-=dt;
    if(gr.mode==='idle'){if(gr.t<=0){gr.t=rr(3,7);pickDuckTarget(gr);}duckMove(lead,gr.tx,gr.ty,dWater(lead.x,lead.y)?28:36,dt,false);
      gr.crossT-=dt;if(gr.crossT<=0){gr.crossT=rr(18,40);const sp=gr.sp;if(sp&&sp.cross&&sp.cross.length&&hyp(lead.x-px,lead.y-py)<850&&rand()<0.6){const c=sp.cross[Math.floor(rand()*sp.cross.length)];gr.mode='cross';gr.path=[c[0],c[1]];gr.back=[c[1],c[0]];gr.stay=0;gr.warned=0;}}}
    else if(gr.mode==='cross'){const w=gr.path[0];if(!w){gr.stay+=dt;if(gr.stay>14){if(gr.back){gr.path=gr.back;gr.back=null;gr.warned=0;}else{gr.mode='idle';gr.t=0;}}}
      else{if(!duckMove(lead,w.x,w.y,34,dt,true)&&hyp(lead.x-w.x,lead.y-w.y)>8){gr.stuck=(gr.stuck||0)+dt;if(gr.stuck>4){gr.path.shift();gr.stuck=0;}}if(hyp(lead.x-w.x,lead.y-w.y)<10)gr.path.shift();}
      if(!gr.warned&&gr.m.some(d=>!d.dead&&tileAt(d.x,d.y)===TL.ROAD)&&onScreen(lead.x,lead.y,0)){gr.warned=1;if((G.time-(G.crossTip||-99))>60){G.crossTip=G.time;toast(L(R2('🦆 חציית ברווזים! כל התנועה עוצרת.','🦆 Duck crossing! All traffic stops.')),3);}react(nearestCiv(lead.x,lead.y,300),'duckCross');}}
    else if(gr.mode==='follow'){const tx=px-Math.cos(P.a)*40,ty=py-Math.sin(P.a)*40;if(P.veh&&Math.abs(P.veh.speed)>150){gr.mode='return';gr.t=12;}else duckMove(lead,tx,ty,hyp(tx-lead.x,ty-lead.y)>60?95:40,dt,true);if(gr.t<=0){gr.mode='return';gr.t=12;}}
    else if(gr.mode==='return'){if(!duckMove(lead,gr.home.x,gr.home.y,40,dt,true)||gr.t<=0){if(!onScreen(lead.x,lead.y,80)||gr.t<-6){for(const d of gr.m){d.x=gr.home.x+rr(-40,40);d.y=gr.home.y+rr(-40,40);}gr.mode='idle';gr.t=1;}}if(hyp(lead.x-gr.home.x,lead.y-gr.home.y)<60){gr.mode='idle';gr.t=1;}}
    else if(gr.mode==='flee'){if(gr.t<=0){gr.mode='idle';gr.t=1;for(const d of gr.m)if(d.st==='run')d.st='idle';}}
    if(gr.momBack!=null&&gr.mode!=='flee'){gr.momBack-=dt;if(gr.momBack<=0){gr.momBack=null;if(!gr.m.some(d=>!d.dead&&!d.gone&&d.k!=='b'&&d.k!=='gold')&&gr.m.some(d=>!d.dead&&!d.gone)){const a=rr(0,TAU),d=mkDuck(gr,'f',gr.home.x+Math.cos(a)*700,gr.home.y+Math.sin(a)*700);d.st='land';d.z=70;}}}
    // ambient
    gr.noise-=dt;if(gr.noise<=0){gr.noise=rr(2.5,6);const d=gr.m[Math.floor(rand()*gr.m.length)];if(d&&!d.dead&&!d.gone&&onScreen(d.x,d.y,40)){if(d.k==='b'||d.k==='gold')peep(d.x,d.y);else quack(d.x,d.y,rr(0.9,1.1),rand()<0.4?3:1,0.7);}}}
  // individual ducks
  let following=0;
  for(const d of G.ducks){if(d.dead){d.deadT+=dt;continue;}const gr=d.g;d.t-=dt;
    if(d.st==='fly'){d.z=Math.min(90,d.z+d.vz*dt);const ax=d.x-(gr.fx!=null?gr.fx:px),ay=d.y-(gr.fy!=null?gr.fy:py),a=Math.atan2(ay,ax);d.a=a;d.x+=Math.cos(a)*170*dt;d.y+=Math.sin(a)*170*dt;d.ph+=dt*16;if(hyp(d.x-px,d.y-py)>1100||d.z>=90&&!onScreen(d.x,d.y,100))d.gone=true;continue;}
    if(d.st==='land'){const h=gr.home,dd=hyp(h.x-d.x,h.y-d.y);d.a=Math.atan2(h.y-d.y,h.x-d.x);const s=Math.min(dd,150*dt);d.x+=Math.cos(d.a)*s;d.y+=Math.sin(d.a)*s;d.z=Math.max(0,Math.min(d.z,dd*0.12));d.ph+=dt*16;if(dd<20){d.st='idle';d.z=0;quack(d.x,d.y,1,2);}continue;}
    if(d.st==='run'){const ax=d.x-gr.fx,ay=d.y-gr.fy,a=Math.atan2(ay,ax)+Math.sin(G.time*3+d.ph)*0.6;duckMove(d,d.x+Math.cos(a)*40,d.y+Math.sin(a)*40,70,dt,true);continue;}
    if(d.st==='angry'){const tx=P.veh?P.veh.x:P.x,ty=P.veh?P.veh.y:P.y,dd=hyp(tx-d.x,ty-d.y);duckMove(d,tx,ty,dd>30?118:20,dt,true);
      if(dd<(P.veh?P.veh.t.w*0.5+16:24)&&(d.peck=(d.peck||0)-dt)<=0){d.peck=0.7;quack(d.x,d.y,0.85,1,1.2);if(!P.veh&&!P.dead){P.hp-=3;G.hurtFlash=0.3;}else if(P.veh)damageVeh(P.veh,1,null,'hit');d.say='!!!';d.sayT=0.6;}
      if(d.t<=0||dd>900){d.st='idle';}continue;}
    if(d.pet){const tgt=P.veh?null:{x:P.x-Math.cos(P.a)*34,y:P.y-Math.sin(P.a)*34};if(P.veh){d.ride=P.veh;d.x=P.veh.x;d.y=P.veh.y;}else{if(d.ride){d.ride=null;d.x=P.x-20;d.y=P.y+16;}const dd=hyp(tgt.x-d.x,tgt.y-d.y);if(dd>500){d.x=tgt.x;d.y=tgt.y;}else duckMove(d,tgt.x,tgt.y,dd>50?150:dd>14?60:0,dt,true);}
      if((d.ns=(d.ns||rr(6,14))-dt)<=0){d.ns=rr(8,18);quack(d.x,d.y,1.15,rand()<0.3?2:1,0.6);}continue;}
    if(d.st==='lost'){if(rand()<dt*0.6)peep(d.x,d.y);if(!P.veh&&!P.dead&&hyp(P.x-d.x,P.y-d.y)<46){d.st='chain';d.g=G.duckChain;G.duckChain.m.push(d);peep(d.x,d.y);peep(d.x,d.y);toast(L(R2('🐥 ברווזון הצטרף אליך!','🐥 A duckling joined you!')),2);}continue;}
    if(gr&&(gr.mode==='follow'))following++;
    // followers: chain behind previous member
    if(gr){const lead=gr.chain?null:duckLead(gr);if(d!==lead){const idx=gr.m.indexOf(d);let prev=null;for(let i=idx-1;i>=0;i--){const o=gr.m[i];if(!o.dead&&!o.gone&&o.st!=='fly'&&o.st!=='land'&&o.st!=='angry'){prev=o;break;}}
      if(!prev&&gr.chain)prev={x:P.x,y:P.y,a:P.a};if(prev){const gap=d.k==='b'||d.k==='gold'?15:22,tx=prev.x-Math.cos(prev.a)*gap,ty=prev.y-Math.sin(prev.a)*gap,dd=hyp(tx-d.x,ty-d.y);if(dd>2.5)duckMove(d,tx,ty,dd>80?110:dd>20?60:30,dt,true);if(dd>700&&!onScreen(d.x,d.y,50)){d.x=tx;d.y=ty;}}}}
    // dodge / get run over
    if(d.z<4){for(const v of G.vehicles){if(v.sunk||v.alt>0.2||Math.abs(v.x-d.x)>90||Math.abs(v.y-d.y)>90)continue;const sp=Math.abs(v.speed||0);if(sp<25)continue;
        if(pointInVeh(v,d.x,d.y,4)){if(v.t.boat&&!dWater(d.x,d.y))continue;killDuck(d,v.driver===P?P:null,'car');break;}
        if(d.k!=='b'&&d.k!=='gold'&&rand()<dt*3&&d.st!=='chain'){const a=v.a+Math.PI/2*(rand()<0.5?1:-1);duckMove(d,d.x+Math.cos(a)*30,d.y+Math.sin(a)*30,160,dt,true);}}}
    if(d.k==='gold'&&!d.dead&&!P.veh&&!P.dead&&hyp(P.x-d.x,P.y-d.y)<30){if(secret('goldduck')){peep(d.x,d.y);toast(L(R2('🐥✨ ליטפת את הברווזון המוזהב. הוא הניח לך מטבע.','🐥✨ You petted the golden duckling. It left you a coin.')),4);mkPickup('cash',d.x+10,d.y+10,{amt:500});}d.k='b';}
    d.road=tileAt(d.x,d.y)===TL.ROAD;if(d.sayT>0)d.sayT-=dt;}
  if(following>=10&&secret('duckking'))toast(L(R2('🦆👑 עשרה ברווזים אחריך. אתה מלך הברווזים.','🦆👑 Ten ducks behind you. You are the Duck King.')),4);
  // player sprinting through ducks
  if(!P.veh&&!P.dead){const sp=hyp(P.mvx||0,P.mvy||0);if(sp>120)for(const d of G.ducks){if(d.dead||d.gone||d.pet||d.st!=='idle'&&d.st!=='chain')continue;if(Math.abs(d.x-P.x)<34&&Math.abs(d.y-P.y)<34){const a=Math.atan2(d.y-P.y,d.x-P.x);d.x+=Math.cos(a)*10;d.y+=Math.sin(a)*10;if(rand()<0.3)quack(d.x,d.y,1.2,1,0.8);}}}
  // feathers
  for(const f of G.dfeath){f.life-=dt;f.x+=f.vx*dt;f.y+=f.vy*dt;f.vx*=1-dt*1.5;f.vy*=1-dt*1.5;f.vz-=140*dt;if(f.vz<-25)f.vz=-25;f.z=Math.max(0,f.z+f.vz*dt);f.r+=dt*4;f.x+=Math.sin(G.time*4+f.r)*dt*14;}
  if(G.dfeath.length)G.dfeath=G.dfeath.filter(f=>f.life>0);
  // rubber duck
  const R0=RUBBER;if(R0){R0.x+=R0.vx*dt;R0.y+=R0.vy*dt;R0.vx*=1-dt*0.8;R0.vy*=1-dt*0.8;R0.vx+=(R0.hx-R0.x)*dt*0.05;R0.vy+=(R0.hy-R0.y)*dt*0.05;if(R0.sq>0)R0.sq-=dt;
    if(P.veh&&P.veh.t.boat){const v=P.veh,dd=hyp(v.x-R0.x,v.y-R0.y);if(dd<70&&dd>1){R0.vx+=(R0.x-v.x)/dd*90;R0.vy+=(R0.y-v.y)/dd*90;if(R0.sq<=0){squeak(R0.x,R0.y);R0.sq=0.6;}}}}}
// ---------- drawing ----------
function drawDuckBody(d,x,y,s,swim,fly){const k=d.k,a=d.a,wob=swim||fly?0:Math.sin(d.ph)*0.18;g.save();g.translate(x,y);g.rotate(a+wob);g.scale(s,s);
  if(k==='b'||k==='gold'){const gd=k==='gold';g.fillStyle=gd?'#ffd700':'#ffd84a';g.beginPath();g.ellipse(0,0,5.4,4.3,0,0,TAU);g.fill();g.fillStyle=gd?'#e6a800':'#b89430';g.beginPath();g.ellipse(-1.5,0,2.6,1.6,0,0,TAU);g.fill();
    g.fillStyle=gd?'#fff1a0':'#ffe27a';g.beginPath();g.arc(4.6,0,3.1,0,TAU);g.fill();g.fillStyle='#e08a20';g.beginPath();g.ellipse(7.6,0,1.8,1.2,0,0,TAU);g.fill();g.fillStyle='#222';g.fillRect(5,-1.9,1,1);g.fillRect(5,0.9,1,1);
    if(gd&&Math.sin(G.time*6+d.ph)>0.6){g.fillStyle='#fff';g.fillRect(-3,-5,1.6,1.6);g.fillRect(2,4,1.2,1.2);}g.restore();return;}
  const C=DUCKC[k]||DUCKC.f;
  if(fly){const fl=Math.sin(d.ph)*0.9;g.fillStyle=C.w;for(const sd of[-1,1]){g.save();g.scale(1,sd);g.rotate(-0.3+fl*0.5);g.beginPath();g.ellipse(-1,9,4,10*(0.55+Math.abs(fl)*0.45),0.2,0,TAU);g.fill();g.fillStyle='#2e6fd0';g.fillRect(-3,4,3,2.5);g.fillStyle=C.w;g.restore();}}
  g.fillStyle=C.w;g.beginPath();g.moveTo(-9,-2.5);g.lineTo(-13,0);g.lineTo(-9,2.5);g.fill();
  g.fillStyle=C.b;g.beginPath();g.ellipse(0,0,9,6,0,0,TAU);g.fill();
  if(!fly){g.fillStyle=C.w;g.beginPath();g.ellipse(-2,-2.6,5.5,2.4,-0.12,0,TAU);g.fill();g.beginPath();g.ellipse(-2,2.6,5.5,2.4,0.12,0,TAU);g.fill();if(k!=='pet'){g.fillStyle='#2e6fd0';g.fillRect(-1.5,-4.4,2.6,1.2);g.fillRect(-1.5,3.2,2.6,1.2);}}
  if(k==='m'){g.fillStyle='#7b3f22';g.beginPath();g.ellipse(5.5,0,3.2,4.4,0,0,TAU);g.fill();g.fillStyle='#fff';g.beginPath();g.ellipse(7.3,0,1,3.4,0,0,TAU);g.fill();}
  g.fillStyle=C.h;g.beginPath();g.arc(8.8,0,3.9,0,TAU);g.fill();if(k==='m'){g.fillStyle='rgba(255,255,255,0.25)';g.beginPath();g.arc(9.6,-1.2,1.5,0,TAU);g.fill();}
  g.fillStyle=k==='m'?'#e8c33a':'#e8962a';g.beginPath();g.ellipse(13.2,0,2.6,1.7,0,0,TAU);g.fill();
  g.fillStyle='#111';g.fillRect(9.6,-2.8,1.2,1.2);g.fillRect(9.6,1.6,1.2,1.2);
  if(k==='pet'){g.fillStyle='#d62828';g.fillRect(5.2,-4,2.4,8);g.beginPath();g.moveTo(5.2,-4);g.lineTo(1.5,-7);g.lineTo(3.6,-3.6);g.fill();}
  g.restore();}
function drawDuck(d,inV){if(d.gone||!inV(d.x,d.y,60))return;const swim=!d.dead&&d.z<2&&dWater(d.x,d.y),s=(d.k==='b'||d.k==='gold'?1.5:1.6);
  if(d.dead){if(d.deadT>25)return;g.globalAlpha=Math.max(0,1-d.deadT/25);g.fillStyle='rgba(120,20,20,0.35)';g.beginPath();g.ellipse(d.x,d.y,9,6,d.a,0,TAU);g.fill();g.save();g.translate(d.x,d.y);g.rotate(d.a);g.scale(1.3,0.5);g.translate(-d.x,-d.y);drawDuckBody(Object.assign({},d,{ph:0}),d.x,d.y,1,true,false);g.restore();g.globalAlpha=1;return;}
  if(d.ride){const v=d.ride;drawDuckBody(Object.assign({},d,{a:v.a}),d.x-Math.cos(v.a)*v.t.l*0.08,d.y-Math.sin(v.a)*v.t.l*0.08,s*1.05,true,false);return;}
  if(d.z>2)return;
  if(swim){g.strokeStyle=`rgba(255,255,255,${0.25+0.12*Math.sin(G.time*3+d.ph)})`;g.lineWidth=1.2;g.beginPath();g.ellipse(d.x,d.y,13*s,9*s,d.a,0,TAU);g.stroke();}
  else{g.fillStyle='rgba(0,0,0,0.22)';g.beginPath();g.ellipse(d.x+2,d.y+3,9*s,6*s,d.a,0,TAU);g.fill();
    if(d.k!=='b'&&d.k!=='gold'){const st=Math.sin(d.ph);g.fillStyle='#e8962a';for(const sd of[-1,1]){const fx=d.x+Math.cos(d.a)*(st*sd*3)-Math.sin(d.a)*sd*3,fy=d.y+Math.sin(d.a)*(st*sd*3)+Math.cos(d.a)*sd*3;g.beginPath();g.arc(fx,fy,2,0,TAU);g.fill();}}}
  drawDuckBody(d,d.x,d.y-(swim?0:1),s,swim,false);
  const bub=d.st==='lost'?'?':d.st==='angry'?'!!!':d.sayT>0?d.say:null;if(bub){g.font='bold 13px Rubik,sans-serif';g.textAlign='center';g.fillStyle='rgba(10,12,22,0.8)';rrect(g,d.x-14,d.y-34,28,17,8);g.fill();g.fillStyle=d.st==='angry'?'#ff5d5d':'#ffd23f';g.fillText(bub,d.x,d.y-21);}
  if(d.st==='lost'){const pu=(Math.sin(G.time*4)+1)/2;g.strokeStyle=`rgba(255,216,74,${0.3+pu*0.4})`;g.lineWidth=2;g.beginPath();g.arc(d.x,d.y,18+pu*5,0,TAU);g.stroke();}}
function drawRubber(inV){const R0=RUBBER;if(!R0||!inV(R0.x,R0.y,120))return;const bob=Math.sin(G.time*1.6)*3,sq=R0.sq>0?1+Math.sin(R0.sq*40)*0.06:1,x=R0.x,y=R0.y+bob;
  g.strokeStyle='rgba(255,255,255,0.35)';g.lineWidth=2;g.beginPath();g.ellipse(R0.x,R0.y+4,72+Math.sin(G.time*2)*4,48,0,0,TAU);g.stroke();
  g.fillStyle='rgba(0,40,60,0.3)';g.beginPath();g.ellipse(x+8,y+10,62,42,0,0,TAU);g.fill();
  g.save();g.translate(x,y);g.scale(sq,1/sq);
  const gr=g.createRadialGradient(-12,-14,6,0,0,64);gr.addColorStop(0,'#fff27a');gr.addColorStop(0.6,'#ffd21f');gr.addColorStop(1,'#e0a800');g.fillStyle=gr;
  g.beginPath();g.ellipse(-8,0,60,40,0,0,TAU);g.fill();g.beginPath();g.moveTo(-60,-14);g.quadraticCurveTo(-90,-30,-76,0);g.quadraticCurveTo(-90,30,-60,14);g.fill();
  g.fillStyle='rgba(224,168,0,0.6)';g.beginPath();g.ellipse(-18,-22,24,10,-0.3,0,TAU);g.fill();g.beginPath();g.ellipse(-18,22,24,10,0.3,0,TAU);g.fill();g.restore();
  const [hx,hy]=projPt(x+30,y,45);const hg=g.createRadialGradient(hx-8,hy-10,4,hx,hy,34);hg.addColorStop(0,'#fff6a0');hg.addColorStop(1,'#f2bd00');g.fillStyle=hg;g.beginPath();g.arc(hx,hy,30,0,TAU);g.fill();
  g.fillStyle='#ff7a1a';g.beginPath();g.ellipse(hx+32,hy+2,15,9,0,0,TAU);g.fill();g.fillStyle='#e85d00';g.fillRect(hx+20,hy+1,26,2);
  g.fillStyle='#fff';for(const sd of[-1,1]){g.beginPath();g.arc(hx+12,hy+sd*12,7,0,TAU);g.fill();}g.fillStyle='#111';for(const sd of[-1,1]){g.beginPath();g.arc(hx+14,hy+sd*12,3.6,0,TAU);g.fill();}
  if(R0.sq>0){g.font='bold 16px Rubik,sans-serif';g.textAlign='center';g.fillStyle='#fff';g.fillText(G.lang==='he'?'ציייץ!':'SQUEAK!',hx,hy-44);}}
function drawDucks(inV){if(!G.ducks)return;drawRubber(inV);for(const d of G.ducks)drawDuck(d,inV);
  for(const f of G.dfeath){if(!inV(f.x,f.y,40))continue;g.globalAlpha=Math.min(1,f.life);g.fillStyle=f.c;g.save();g.translate(f.x,f.y-f.z);g.rotate(f.r);g.beginPath();g.ellipse(0,0,4,1.6,0,0,TAU);g.fill();g.restore();}g.globalAlpha=1;}
function drawDucksAir(inV){if(!G.ducks)return;for(const d of G.ducks){if(d.dead||d.gone||d.z<=2||!inV(d.x,d.y,120))continue;
  g.fillStyle='rgba(0,0,0,0.18)';g.beginPath();g.ellipse(d.x+d.z*0.5,d.y+d.z*0.7,8,5,d.a,0,TAU);g.fill();const [sx,sy]=projPt(d.x,d.y,d.z*3);drawDuckBody(d,sx,sy,1.6+d.z/140,false,true);}}
// ---------- side mission: lost ducklings ----------
function buildMissions5(){Object.assign(SPK,{dora:{he:'דורה מהפארק',en:'Dora from the park',c:'#ffd84a',p:300}});
  {let best=null,bs=-1;for(const [ox,oy] of [[260,-170],[-260,-170],[260,190],[-260,190],[0,240],[0,-220]]){const q=nearWalk(POI.duck.x+ox,POI.duck.y+oy);if(!q)continue;let md=1e9;for(const m of SIDE.concat(MISSIONS))if(m.start)md=Math.min(md,hyp(m.start.x-q.x,m.start.y-q.y));if(md>bs){bs=md;best=q;}}POI.doraStart=best||{x:POI.duck.x,y:POI.duck.y+240};}
  SIDE.push({id:'s15',name:R2('ברווזונים אבודים','Lost Ducklings'),giver:'dora',start:POI.doraStart,look:'elder',steps:[
   {t:'talk',lines:[l('dora','אתה! כן אתה, עם הפנים של מישהו שדורס ברווזים. אני דורה. אני מאכילה את הברווזים כבר ארבעים שנה.','You! Yes, you, with the face of someone who runs over ducks. I am Dora. I have fed these ducks for forty years.'),
    l('ray','אני לא דורס ברווזים. רוב הזמן.','I do not run over ducks. Mostly.'),l('dora','אמא ברווזה איבדה חמישה ברווזונים. הם נבהלו מהזיקוקים של ראש העיר ופרחו לכל העיר.','Mama duck lost five ducklings. The mayor\'s fireworks scared them all over the city.'),
    l('dora','לך אליהם ברגל, הם יצטרפו אליך בשורה. ואל תיסע מהר! ברווזונים לא נוסעים במהירות של מכונית.','Walk up to them and they will line up behind you. And no speeding! Ducklings do not do car speed.')]},
   {t:'cond',init:M=>{const P=G.player;G.duckChain={m:[],chain:1,mode:'chain',home:{x:POI.duck.x,y:POI.duck.y}};G.dgroups.push(G.duckChain);
     const lostG={m:[],lost:1,home:{x:POI.duck.x,y:POI.duck.y},mode:'lost'};G.dgroups.push(lostG);M.lostG=lostG;M.del=0;
     const momG=spawnDuckGroup({x:POI.duck.x,y:POI.duck.y,cross:[]},{momOnly:1});M.momG=momG;
     const angs=[0.3,1.5,2.6,3.8,5.0];for(const a0 of angs){const r=rr(650,1200);const q=nearWalk(POI.duck.x+Math.cos(a0)*r,POI.duck.y+Math.sin(a0)*r)||{x:POI.duck.x+Math.cos(a0)*300,y:POI.duck.y+Math.sin(a0)*300};const d=mkDuck(lostG,'b',q.x,q.y);d.st='lost';}},
    f:M=>{const lost=M.lostG.m.filter(d=>d.st==='lost'&&!d.dead),ch=G.duckChain.m.filter(d=>!d.dead),dead=M.lostG.m.filter(d=>d.dead).length;
      if(dead){failMission(L(R2('ברווזון נפגע... דורה לא תסלח לך.','A duckling got hurt... Dora will never forgive you.')));return false;}
      if(hyp(G.player.x-POI.duck.x,G.player.y-POI.duck.y)<200&&!G.player.veh)for(const d of ch){d.st='idle';d.g=M.momG;M.momG.m.push(d);M.del++;G.duckChain.m.splice(G.duckChain.m.indexOf(d),1);peep(d.x,d.y);}
      if(M.del>=5)return true;
      const P=G.player,txt=fmt(L(R2('מצא את הברווזונים ({0}/5 אצלך, {1}/5 בבית)','Find the ducklings ({0}/5 with you, {1}/5 home)')),ch.length,M.del);setObj(txt);
      if(lost.length){let b=lost[0];for(const d of lost)if(hyp(d.x-P.x,d.y-P.y)<hyp(b.x-P.x,b.y-P.y))b=d;M.target={x:b.x,y:b.y};}else M.target={x:POI.duck.x,y:POI.duck.y};
      if(G.player.veh&&ch.length&&Math.abs(G.player.veh.speed)>90&&!M.warn){M.warn=1;toast(L(R2('🐥 לאט! הברווזונים לא עומדים בקצב.','🐥 Slow down! The ducklings cannot keep up.')),3);}
      return false;},obj:R2('מצא את הברווזונים האבודים','Find the lost ducklings')},
   {t:'talk',lines:[l('dora','כולם פה! אמא ברווזה אומרת תודה. כלומר, היא אמרה "קוואק", אבל בטון של תודה.','They are all here! Mama duck says thank you. Well, she said "quack", but in a grateful tone.'),
    l('dora','קח את זה. זה ברווז. הוא מעכשיו שלך. הוא נבחר כי הוא הכי עצבני.','Take this. It is a duck. It is yours now. I picked him because he is the angriest.'),l('ray','...תודה?','...thanks?')]},
   {t:'reward',money:1500,fn:()=>{if(!G.got.includes('petduck'))G.got.push('petduck');if(G.duckChain){G.duckChain.m.length=0;}setTimeout(()=>toast(L(R2('🦆 קיבלת ברווז מחמד. הוא הולך אחריך ויושב על הגג של כל רכב.','🦆 You got a pet duck. It follows you and rides on the roof of every car.')),6),1800);}}]});}
Object.assign(REACT,{
 duckDead:[R2('הברווז!!! מה עשית?!','The duck!!! What did you do?!'),R2('יש לך לב של אבן!','You have a heart of stone!'),R2('אני מתקשר לאיגוד הברווזים!','I am calling the Duck Union!'),R2('הוא היה בדרך הביתה...','He was on his way home...'),R2('זה היה ברווז עם משפחה!','That duck had a family!'),R2('מישהו צילם את זה? אני רוצה עדים!','Did anyone film that? I want witnesses!')],
 duckCross:[R2('ברווזים חוצים! כולם לעצור!','Ducks crossing! Everybody stop!'),R2('אוו, תראו את הקטנים!','Aww, look at the little ones!'),R2('זה הפקק הכי חמוד שהיה פה אי פעם.','Cutest traffic jam this town has ever seen.'),R2('תנו להם, יש להם זכות קדימה!','Let them go, they have right of way!'),R2('אחד, שתיים, שלוש... הם עדיין יוצאים!','One, two, three... they keep coming!')],
 duckFollow:[R2('למה כל הברווזים הולכים אחריו?','Why are all the ducks following him?'),R2('אחי, אתה אבא שלהם עכשיו.','Dude, you are their dad now.'),R2('זה מצעד? יש פה מצעד?','Is this a parade? Is there a parade?'),R2('הוא שורק והם באים. אני שורק ואף אחד לא בא.','He whistles and they come. I whistle and nobody comes.')]});
CONVS.push(
 {t:[],l:[R2('ראית את הברווזים חוצים את הכביש היום?','Did you see the ducks crossing the road today?'),R2('ראיתי. אוטובוס שלם עצר. הנהג מחא כפיים.','I did. A whole bus stopped. The driver applauded.'),R2('הלוואי שעצרו ככה בשבילי.','I wish they stopped like that for me.'),R2('אתה לא חמוד מספיק.','You are not cute enough.')]},
 {t:[],l:[R2('קראתי שבסולס ביי יש יותר ברווזים מעורכי דין.','I read that Solace Bay has more ducks than lawyers.'),R2('ועדיין, הברווזים מנצחים בבית משפט.','And still the ducks win in court.')]},
 {t:[],l:[R2('אני מאכילה את הברווזים כל בוקר.','I feed the ducks every morning.'),R2('זה לא אסור?','Isn\'t that forbidden?'),R2('הם אף פעם לא הלשינו עליי.','They never snitched on me.')]},
 {t:['harbor'],l:[R2('הברווז הצהוב הענק בנמל... מישהו יודע מאיפה הוא הגיע?','The giant yellow duck in the harbor... anyone know where it came from?'),R2('אומרים שהוא נפל מאמבטיה של ענק.','They say it fell out of a giant\'s bathtub.'),R2('ואם תירה בו הוא מצייץ.','And if you shoot it, it squeaks.'),R2('למה שמישהו יירה בברווז גומי?','Why would anyone shoot a rubber duck?'),R2('...אתה לא מכיר את האנשים פה.','...you do not know the people here.')]},
 {t:[],l:[R2('הבן שלי רוצה ברווז מחמד.','My son wants a pet duck.'),R2('אמרת לו לא?','You said no?'),R2('אמרתי. הברווז לא הסכים. הוא גר אצלנו כבר שבוע.','I did. The duck disagreed. It has lived with us for a week.')]});
