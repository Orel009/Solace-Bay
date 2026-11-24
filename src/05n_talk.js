// ---------- v6: conversation engine, no-repeat picker, varied reactions ----------
G.bags={};G.convUsed=new Set();
function bagPick(key,arr){let b=G.bags[key];if(!b||!b.length||b.n!==arr.length){const last=b&&b.last;b=G.bags[key]=arr.map((_,i)=>i);for(let i=b.length-1;i>0;i--){const r=Math.floor(rand()*(i+1));[b[i],b[r]]=[b[r],b[i]];}b.n=arr.length;if(b.length>1&&b[b.length-1]===last){[b[0],b[b.length-1]]=[b[b.length-1],b[0]];}}
  const i=b.pop();b.last=i;return i;}
function say(p,key,dur){if(!p)return;const kk=p.kind&&REACT[key+'_'+p.kind];let pool=REACT[key],k=key;if(kk&&(!pool||rand()<0.55)){pool=kk;k=key+'_'+p.kind;}if(!pool||!pool.length)return;
  let t=L(pool[bagPick(k,pool)]);if(t.indexOf('{0}')>=0)t=t.replace('{0}',L(OUTFIT()));p.say=t;p.sayT=dur||Math.min(4,1.6+t.length*0.035);}
const AREATAG={down:['neon','downtown'],harb:['harbor'],beach:['beach'],crown:['crown'],strip:['strip'],glass:['glass','downtown'],forge:['forge'],air:['air'],air2:['air'],vista:['beach'],east:[],res:[]};
function ctxTags(p,o){const P=G.player,t=new Set(),h=ENV.clock,ar=areaAt(p.x,p.y);
  if(ENV.dark>0.5)t.add('night');if(h>=6&&h<10.5)t.add('morning');if(ENV.rain>0.3)t.add('rain');
  for(const a of (AREATAG[ar]||[]))t.add(a);for(const q of [p,o]){if(q.kind)t.add(q.kind);if(q.party)t.add('party');}
  if(G.time-(G.shotT??-99)<35&&hyp(G.shotX-p.x,G.shotY-p.y)<1000)t.add('shots');
  if(G.time-(G.boomT??-99)<45&&hyp(G.boomX-p.x,G.boomY-p.y)<1200)t.add('boom');
  if(G.wanted>0&&hyp(P.x-p.x,P.y-p.y)<700)t.add('cops');else for(const q of G.peds)if(q.type==='cop'&&!q.dead&&hyp(q.x-p.x,q.y-p.y)<380){t.add('cops');break;}
  const dP=hyp(P.x-p.x,P.y-p.y);if(G.wanted>=2&&dP<280&&!P.veh)t.add('wanted');if(dP<95&&!P.veh&&!P.inside)t.add('player');return t;}
function pickConv(p,o){const tags=ctxTags(p,o),cand=[];for(let i=0;i<CONVS.length;i++){const c=CONVS[i];if(c.t.every(x=>tags.has(x)))cand.push(i);}
  let free=cand.filter(i=>!G.convUsed.has(i));if(!free.length){for(const i of cand)G.convUsed.delete(i);free=cand;}
  let tot=0;const w=free.map(i=>{const k=CONVS[i].t.length?4:1;tot+=k;return k;});let r=rand()*tot,pick2=free[0];for(let k=0;k<free.length;k++){r-=w[k];if(r<=0){pick2=free[k];break;}}
  G.convUsed.add(pick2);return CONVS[pick2];}
function convTick(p,o,dt){if(!p.conv&&!o.conv){if(!onScreen(p.x,p.y,300))return;const c=pickConv(p,o);p.conv=o.conv={c,i:0,t:rr(0.2,0.9),a:p,b:o};p.ft=o.ft=60;}
  const cv=p.conv;if(!cv||cv.a!==p)return;cv.t-=dt;if(cv.t>0)return;
  if(cv.i>=cv.c.l.length){for(const q of [cv.a,cv.b]){q.conv=null;q.st='walk';q.mate=null;q.tm=rr(1,3);q.chatT=G.time+rr(20,40);q.a=rr(0,TAU);}return;}
  const sp=cv.i%2?cv.b:cv.a,ls=cv.i%2?cv.a:cv.b;if(sp.dead||ls.dead||sp.st!=='chat'){cv.i=cv.c.l.length;return;}
  sp.say=L(cv.c.l[cv.i]);sp.sayT=Math.min(4.8,1.5+sp.say.length*0.05);cv.t=sp.sayT+0.3;cv.i++;const vv=dv(sp.x,sp.y);if(vv>0.12)sfx.voice(sp,vv);}
function shotReact(x,y,op){G.shotT=G.time;G.shotX=x;G.shotY=y;let spoke=0;
  for(const p of G.peds){if(p.type!=='civ'||p.dead||p.medicP||hyp(p.x-x,p.y-y)>380)continue;if(p.st==='call'||p.brawl>0)continue;if(p.st==='film'||p.st==='cower'||p.st==='flee'){continue;}
    const K=p.kind,r=((p.id*2654435761)>>>0)%100;p.conv=null;
    if(K==='dog'){p.st='flee';p.ft=5;p.fx=x;p.fy=y;continue;}
    if((K==='tourist'||K==='punk'||K==='casual')&&r<(K==='casual'?12:35)){p.st='film';p.ft=rr(4,8);p.fx=x;p.fy=y;}
    else if(((K==='elder'||K==='biz')&&r<55)||r<14){p.st='cower';p.ft=rr(3,6);}
    else{p.st='flee';p.ft=rr(4,7);p.fx=x;p.fy=y;}
    if(spoke<2&&G.sayCD<=0&&onScreen(p.x,p.y,0)&&rand()<0.6){spoke++;const key=p.st==='film'?'film':(K==='worker'&&r<25&&op===G.player)?'brave':'shots';say(p,key);
      if(key==='shots'&&spoke===1)sfx.scream(dv(p.x,p.y),p.voice||200);else sfx.voice(p,dv(p.x,p.y));if(spoke===2)G.sayCD=1.1;}}}
function boomReact(x,y){G.boomT=G.time;G.boomX=x;G.boomY=y;let n=0;for(const p of G.peds){if(p.type!=='civ'||p.dead||hyp(p.x-x,p.y-y)>520||!onScreen(p.x,p.y,0))continue;if(n<2&&rand()<0.5){n++;setTimeout(()=>{if(!p.dead){say(p,'boom');sfx.voice(p,dv(p.x,p.y));}},n*500+rr(200,500));}}}
function talkTick(dt){G.talkT=(G.talkT||0)-dt;if(G.talkT>0)return;G.talkT=1.3;const P=G.player;
  if(G.wanted>0){for(const v of G.vehicles){if(!v.siren||v.dead||!v.onScreen)continue;for(const p of G.peds){if(p.type!=='civ'||p.dead||p.kind==='dog'||p.sayT>0||p.st==='flee'||hyp(p.x-v.x,p.y-v.y)>260)continue;if(rand()<0.35){say(p,'copnear');sfx.voice(p,dv(p.x,p.y)*0.8);if(rand()<0.4){p.st='film';p.ft=rr(3,6);p.fx=v.x;p.fy=v.y;}}break;}break;}}
  if(ENV.rain>0.5&&rand()<0.2)for(const p of G.peds){if(p.type!=='civ'||p.dead||p.sayT>0||p.st==='chat'||!onScreen(p.x,p.y,0))continue;say(p,'rain');sfx.voice(p,dv(p.x,p.y)*0.7);break;}}
function filmTick(p,dt){p.ft-=dt;p.walk=0;const P=G.player;if(hyp(P.x-p.x,P.y-p.y)<500&&G.time-(G.shotT||0)<4){p.fx=P.x;p.fy=P.y;}p.a=Math.atan2(p.fy-p.y,p.fx-p.x);
  if(rand()<dt*0.9)part('flash',p.x+Math.cos(p.a)*13,p.y+Math.sin(p.a)*13,0,0,0.07,5);if(hyp(P.x-p.x,P.y-p.y)<60&&!P.veh){p.st='flee';p.ft=3;p.fx=P.x;p.fy=P.y;say(p,'gun');return;}if(p.ft<=0){p.st='walk';p.tm=rr(1,3);}}
