const $=id=>document.getElementById(id);
// ---------- audio ----------
const AU={ctx:null,
 init(){if(this.ctx)return;try{const C=window.AudioContext||window.webkitAudioContext;this.ctx=new C();const x=this.ctx;
  this.master=x.createGain();this.master.gain.value=G.sound?0.5:0;this.master.connect(x.destination);
  const b=x.createBuffer(1,x.sampleRate,x.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;this.noise=b;
  this.eng=x.createOscillator();this.eng.type='sawtooth';const f=x.createBiquadFilter();f.type='lowpass';f.frequency.value=520;this.engF=f;this.engG=x.createGain();this.engG.gain.value=0;
  this.eng.connect(f);f.connect(this.engG);this.engG.connect(this.master);this.eng.start();
  this.sir=x.createOscillator();this.sir.type='triangle';this.sirG=x.createGain();this.sirG.gain.value=0;this.sir.connect(this.sirG);this.sirG.connect(this.master);this.sir.start();
  this.eng2=x.createOscillator();this.eng2.type='sine';const e2=x.createGain();e2.gain.value=0.7;this.eng2.connect(e2);e2.connect(this.engG);this.eng2.start();
  this.tr=x.createOscillator();this.tr.type='sawtooth';const tf=x.createBiquadFilter();tf.type='lowpass';tf.frequency.value=420;this.trG=x.createGain();this.trG.gain.value=0;this.tr.connect(tf);tf.connect(this.trG);this.trG.connect(this.master);this.tr.start();
  const rf=x.createBiquadFilter();rf.type='lowpass';rf.frequency.value=3200;this.radioG=x.createGain();this.radioG.gain.value=0.6;this.radioG.connect(rf);rf.connect(this.master);
  const loop=(type,fq,q)=>{const s=x.createBufferSource();s.buffer=b;s.loop=true;const fl=x.createBiquadFilter();fl.type=type;fl.frequency.value=fq;fl.Q.value=q;const gn=x.createGain();gn.gain.value=0;s.connect(fl);fl.connect(gn);gn.connect(this.master);s.start();return gn;};
  this.heliG=loop('lowpass',260,1);this.rainG=loop('highpass',1600,0.5);this.skidG=loop('bandpass',1150,4);
 }catch(e){this.ctx=null;}},
 setVol(){if(this.master)this.master.gain.value=G.sound?0.5:0;},
 tone(fq,dur,type,vol,slide){if(!this.ctx||!G.sound)return;const x=this.ctx,t=x.currentTime,o=x.createOscillator(),gn=x.createGain();o.type=type||'square';
  o.frequency.setValueAtTime(fq,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,fq*slide),t+dur);gn.gain.setValueAtTime(vol||0.15,t);gn.gain.exponentialRampToValueAtTime(0.001,t+dur);
  o.connect(gn);gn.connect(this.master);o.start(t);o.stop(t+dur+0.02);},
 hit(dur,vol,fq){if(!this.ctx||!G.sound)return;const x=this.ctx,t=x.currentTime,s=x.createBufferSource();s.buffer=this.noise;const f=x.createBiquadFilter();f.type='lowpass';f.frequency.value=fq;
  const gn=x.createGain();gn.gain.setValueAtTime(vol,t);gn.gain.exponentialRampToValueAtTime(0.001,t+dur);s.connect(f);f.connect(gn);gn.connect(this.master);s.start(t);s.stop(t+dur);}};
const sfx={shot(big){AU.hit(big?0.5:0.12,big?0.5:0.28,big?800:2600);AU.tone(big?90:170,0.08,'square',0.1,0.5);},boom(){AU.hit(1,0.6,500);AU.tone(70,0.7,'sine',0.45,0.4);},
 crash(i){AU.hit(0.25,Math.min(0.5,i/500),900);},blip(){AU.tone(880,0.08,'square',0.1);setTimeout(()=>AU.tone(1320,0.1,'square',0.1),70);},
 chat(p){AU.tone((p||220)*rr(0.8,1.4),0.05,'square',0.05);},splash(){AU.hit(0.45,0.3,1300);},horn(v,vol){const h=HORN[v&&v.type]||[392,494],k=vol==null?1:vol;if(k<0.05)return;if(G.duckHorn&&v&&v===G.player.veh){AU.tone(520,0.16,'square',0.14,0.55);setTimeout(()=>AU.tone(480,0.16,'square',0.14,0.55),170);return;}AU.tone(h[0],0.3,'square',0.1*k);if(h[1])AU.tone(h[1],0.3,'square',0.08*k);},
 voice(p,vol){if(!(vol>0.05))return;const f=(p&&p.voice)||200;for(let i=0;i<3;i++)setTimeout(()=>AU.tone(f*rr(0.8,1.35),0.06,'square',0.05*vol),i*75);},scream(vol,f){if(vol>0.05)AU.tone((f||220)*3,0.42,'sawtooth',0.07*vol,0.45);},bark(vol){if(!(vol>0.05))return;AU.tone(430,0.07,'square',0.09*vol,0.6);setTimeout(()=>AU.tone(400,0.07,'square',0.09*vol,0.6),130);},
 pass(){[523,659,784,1046].forEach((f,i)=>setTimeout(()=>AU.tone(f,0.25,'triangle',0.22),i*130));},fail(){[392,330,262].forEach((f,i)=>setTimeout(()=>AU.tone(f,0.3,'triangle',0.22),i*170));},
 punch(){AU.hit(0.08,0.35,700);},door(){AU.tone(200,0.06,'square',0.08);},step(){AU.hit(0.035,0.05,1500);},thunder(){AU.hit(2.4,0.7,170);AU.hit(0.5,0.3,600);},flame(){AU.hit(0.12,0.12,1300);},no(){AU.tone(160,0.15,'square',0.1);},jump(){AU.tone(260,0.13,'sine',0.09,1.9);}};
const HORN={bus:[220,277],army:[196,247],van:[330,415],pickup:[311,392],bike:[660,0],stinger:[440,554],aurum:[523,659],compact:[466,587],police:[700,880],muscle:[294,370]};
const SND={def:{w:'sawtooth',b:46,r:60,c:520,v:1},compact:{b:56,r:72,c:680,v:0.9},bike:{w:'square',b:88,r:150,c:1500,v:0.5},bus:{b:30,r:32,c:300,v:1.35},van:{b:36,r:40,c:380,v:1.15},pickup:{b:38,r:44,c:400,v:1.15,am:11},army:{b:27,r:26,c:260,v:1.4},
 muscle:{b:36,r:50,c:430,v:1.25,am:13},stinger:{b:62,r:100,c:950,v:0.95},aurum:{w:'square',b:70,r:120,c:1100,v:0.6},police:{b:50,r:78,c:720,v:1},tank:{b:22,r:18,c:200,v:1.6,am:7},speedboat:{w:'triangle',b:40,r:50,c:500,v:1.3,am:16},dinghy:{w:'triangle',b:55,r:40,c:600,v:1,am:22},plane:{b:72,r:70,c:950,v:1.25,am:28}};
const RADIO=[{n:'Neon FM',bpm:116,roots:[45,41,48,43],arp:[0,7,12,15,12,7,3,7],bw:'sawtooth',lw:'square',ls:1,kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],hat:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1]},
 {n:'Tide 99.1',bpm:98,roots:[38,38,43,45],arp:[0,3,7,10,7,3,12,10],bw:'triangle',lw:'triangle',ls:2,kick:[1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0],hat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]},
 {n:'Marina Chill',bpm:80,roots:[48,45,41,43],arp:[0,4,7,11,12,11,7,4],bw:'sine',lw:'sine',ls:2,kick:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0],hat:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]}];
function rnote(f,dur,type,vol,t,slide){const x=AU.ctx,o=x.createOscillator(),gn=x.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(f*slide,t+dur);gn.gain.setValueAtTime(vol,t);gn.gain.exponentialRampToValueAtTime(0.001,t+dur);o.connect(gn);gn.connect(AU.radioG);o.start(t);o.stop(t+dur+0.02);}
function rhat(t){const x=AU.ctx,s=x.createBufferSource();s.buffer=AU.noise;const f=x.createBiquadFilter();f.type='highpass';f.frequency.value=6000;const gn=x.createGain();gn.gain.setValueAtTime(0.045,t);gn.gain.exponentialRampToValueAtTime(0.001,t+0.04);s.connect(f);f.connect(gn);gn.connect(AU.radioG);s.start(t);s.stop(t+0.05);}
function radioTick(){const x=AU.ctx,P=G.player,on=P.veh&&!P.dead&&G.state==='play'&&G.radio>=0&&G.sound;if(!on){AU.rNext=0;return;}const R=RADIO[G.radio],sd=60/R.bpm/4,t=x.currentTime,mf=n=>440*Math.pow(2,(n-69)/12);
  if(!AU.rNext||AU.rNext<t-0.3){AU.rNext=t+0.05;AU.rStep=0;}
  while(AU.rNext<t+0.12){const i=AU.rStep++,s=i%16,root=R.roots[(i>>4)%4],T0=AU.rNext;if(R.kick[s])rnote(mf(36),0.12,'sine',0.2,T0,0.4);if(R.hat[s])rhat(T0);
    if(s%2===0)rnote(mf(root),sd*1.8,R.bw,0.09,T0);if(s%R.ls===0)rnote(mf(root+12+R.arp[(i/R.ls|0)%8]),sd*R.ls*0.9,R.lw,0.03,T0);AU.rNext+=sd;}}
function nextRadio(){G.radio=G.radio>=RADIO.length-1?-1:G.radio+1;store.set('sb_radio',G.radio);AU.rNext=0;sfx.door();}
function updateAudio(){if(!AU.ctx)return;const P=G.player,t=AU.ctx.currentTime,live=G.state==='play'||G.state==='dialog';
  if(P.veh&&!P.dead&&G.state==='play'){const v=P.veh,S=Object.assign({},SND.def,SND[v.type]),sp=Math.abs(v.speed),gs=v.t.max/4,gear=Math.min(3,Math.floor(sp/gs)),fr=(sp-gear*gs)/gs;
    if(AU.engT!==v.type){AU.engT=v.type;AU.eng.type=S.w;AU.engF.frequency.value=S.c;}
    const fq=S.b+gear*S.r*0.2+fr*S.r+(v.thr>0?S.r*0.14:0),dry=v.fuel<=0?0.3:1;AU.eng.frequency.setTargetAtTime(fq,t,0.06);AU.eng2.frequency.setTargetAtTime(fq/2,t,0.06);
    AU.engG.gain.setTargetAtTime(0.05*S.v*dry*(v.thr>0?1.35:1)*(S.am?0.7+0.3*Math.sin(G.time*S.am*6.283):1),t,0.03);
    AU.skidG.gain.setTargetAtTime(G.skidNow?0.11:0,t,0.05);}
  else{AU.engG.gain.setTargetAtTime(0,t,0.1);AU.skidG.gain.setTargetAtTime(0,t,0.05);}
  {let bd=380,bv=null;if(live)for(const v of G.vehicles){if(v===P.veh||!v.driver||v.dead||Math.abs(v.speed)<30)continue;const d=hyp(v.x-P.x,v.y-P.y);if(d<bd){bd=d;bv=v;}}
    if(bv){const S=Object.assign({},SND.def,SND[bv.type]);AU.tr.frequency.setTargetAtTime(S.b+Math.abs(bv.speed)*0.22,t,0.1);AU.trG.gain.setTargetAtTime(0.03*S.v*(1-bd/380),t,0.1);}else AU.trG.gain.setTargetAtTime(0,t,0.15);}
  radioTick();
  AU.rainG.gain.setTargetAtTime(live?0.085*ENV.rain:0,t,0.3);
  AU.heliG.gain.setTargetAtTime(G.heli&&G.state==='play'?clamp(1-hyp(G.heli.x-P.x,G.heli.y-P.y)/1400,0,1)*0.5*(0.5+0.5*Math.abs(Math.sin(G.time*19))):0,t,0.02);
  let near=1e9;if(G.wanted>0)for(const v of G.vehicles)if(v.ai&&v.ai.mode==='chase'&&v.ai.faction==='police'){near=Math.min(near,hyp(v.x-P.x,v.y-P.y));}
  if(near<1100&&G.state==='play'){AU.sirG.gain.setTargetAtTime(0.035*(1-near/1100),t,0.1);AU.sir.frequency.setTargetAtTime(Math.floor(G.time*2.5)%2?960:720,t,0.02);}else AU.sirG.gain.setTargetAtTime(0,t,0.1);}

// ---------- icons ----------
const SV=s=>`<svg viewBox="0 0 24 24" width="56%" height="56%" fill="currentColor" stroke="currentColor" stroke-width="0" stroke-linejoin="round" stroke-linecap="round">${s}</svg>`;
const IC={fist:SV('<path d="M6 10a2 2 0 0 1 4 0a2 2 0 0 1 4 0a2 2 0 0 1 4 0v6a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4z"/><rect x="3" y="12" width="3" height="5" rx="1.5"/>'),
 aim:SV('<g fill="none" stroke-width="2"><circle cx="12" cy="12" r="7"/><path d="M12 2v6M12 16v6M2 12h6M16 12h6"/></g><circle cx="12" cy="12" r="1.6"/>'),
 car:SV('<path d="M3 15l2-6a2 2 0 0 1 2-1.4h10A2 2 0 0 1 19 9l2 6v3h-2.2a2.3 2.3 0 0 1-4.6 0H9.8a2.3 2.3 0 0 1-4.6 0H3z"/>'),
 run:SV('<g fill="none" stroke-width="2.6"><path d="M5 6l6 6-6 6M13 6l6 6-6 6"/></g>'),
 gun:SV('<path d="M2 8h18v4h-9l-1 3H7l-.8 5H2.5l1-8H2z"/>'),
 gas:SV('<path d="M12 3l9 11h-5.5v7h-7v-7H3z"/>'),brake:SV('<path d="M12 21l9-11h-5.5V3h-7v7H3z"/>'),
 hb:SV('<g fill="none" stroke-width="2"><circle cx="12" cy="12" r="9.5"/></g><path fill-rule="evenodd" d="M9 6.5h4.2a3.3 3.3 0 0 1 0 6.6H11.4v4.4H9zm2.4 2.2v2.2h1.6a1.1 1.1 0 0 0 0-2.2z"/>'),
 horn:SV('<path d="M3 9h4l6-5v16l-6-5H3z"/><g fill="none" stroke-width="2"><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></g>'),
 jump:SV('<g fill="none" stroke-width="2.6"><path d="M6 13l6-6 6 6M6 19l6-6 6 6"/></g>'),
 lad:SV('<g fill="none" stroke-width="2.4"><path d="M8 3v18M16 3v18M8 7h8M8 12h8M8 17h8"/></g>'),use:SV('<path d="M6 9h12l1 11H5z"/><g fill="none" stroke-width="2"><path d="M9 9V7a3 3 0 0 1 6 0v2"/></g>'),
 pause:SV('<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>')};

// ---------- input ----------
const IN={mx:0,my:0,act:false,b:false,w:false,x:false,enterP:false,weapP:false,keys:{}};
const stick={id:null,ox:0,oy:0};
function setupInput(){const zone=$('stickZone'),base=$('stickBase'),knob=$('stickKnob');
  zone.addEventListener('pointerdown',e=>{AU.init();toggleWbar(false);if(stick.id!==null)return;stick.id=e.pointerId;stick.ox=e.offsetX;stick.oy=e.offsetY;zone.setPointerCapture(e.pointerId);
    base.style.display='block';base.style.left=(zone.offsetLeft+e.offsetX-60)+'px';base.style.top=(zone.offsetTop+e.offsetY-60)+'px';knob.style.transform='translate(0px,0px)';e.preventDefault();});
  zone.addEventListener('pointermove',e=>{if(e.pointerId!==stick.id)return;let dx=e.offsetX-stick.ox,dy=e.offsetY-stick.oy;const d=hyp(dx,dy),R=55;if(d>R){dx*=R/d;dy*=R/d;}
    IN.mx=dx/R;IN.my=dy/R;knob.style.transform=`translate(${dx}px,${dy}px)`;});
  const end=e=>{if(e.pointerId!==stick.id)return;stick.id=null;IN.mx=0;IN.my=0;base.style.display='none';};
  zone.addEventListener('pointerup',end);zone.addEventListener('pointercancel',end);
  const hold=(id,on,off)=>{const el=$(id);el.addEventListener('pointerdown',e=>{AU.init();el.classList.add('on');on();e.preventDefault();e.stopPropagation();});
    const up=()=>{el.classList.remove('on');off&&off();};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('pointerleave',up);};
  hold('bAct',()=>IN.act=true,()=>IN.act=false);hold('bB',()=>IN.b=true,()=>IN.b=false);hold('bX',()=>IN.x=true,()=>IN.x=false);
  hold('bEnter',()=>{IN.enterP=true;toggleWbar(false);});
  hold('bW',()=>{IN.w=true;if(G.player&&!G.player.veh&&G.state==='play')toggleWbar();},()=>IN.w=false);
  $('bPause').innerHTML=IC.pause;$('bPause').addEventListener('pointerdown',e=>{e.stopPropagation();if(G.state==='play')openPause();});
  $('mini').addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();openMap();});{const bm=$('bigmap');let d0=null;bm.addEventListener('pointerdown',e=>{e.preventDefault();d0={x:e.offsetX,y:e.offsetY,px:e.offsetX,py:e.offsetY,mv:0};});
   bm.addEventListener('pointermove',e=>{if(!d0||!G.mapT)return;const dx=e.offsetX-d0.px,dy=e.offsetY-d0.py;d0.px=e.offsetX;d0.py=e.offsetY;d0.mv+=Math.abs(dx)+Math.abs(dy);if(d0.mv>10&&G.mapPan){G.mapPan.x-=dx*G.dpr/G.mapT.sc;G.mapPan.y-=dy*G.dpr/G.mapT.sc;drawMap();}});
   const up=e=>{if(d0&&d0.mv<=10)mapTap(e);d0=null;};bm.addEventListener('pointerup',up);bm.addEventListener('pointercancel',()=>{d0=null;});}$('mapClose').addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();closeMap();});
  $('med').addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();useMed();});$('radio').addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();AU.init();nextRadio();});
  $('dlg').addEventListener('pointerdown',e=>{e.preventDefault();if(G.state==='dialog')advanceDialog();});
  addEventListener('keydown',e=>{IN.keys[e.code]=true;AU.init();
    if(e.code==='KeyE'||e.code==='KeyF')IN.enterP=true;if(e.code==='KeyQ')IN.weapP=true;if(e.code==='KeyH')useMed();if(e.code==='KeyR'&&G.player&&G.player.veh)nextRadio();
    if((e.code==='Enter'||e.code==='Space')&&G.state==='dialog'){advanceDialog();e.preventDefault();}
    if(e.code==='Escape'){if(G.state==='play')openPause();else if(G.state==='pause')closePause();else if(G.state==='shop')closeShop();else if(G.state==='map')closeMap();}if(e.code==='KeyM'){if(G.state==='play')openMap();else if(G.state==='map')closeMap();}});
  addEventListener('keyup',e=>{IN.keys[e.code]=false;});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&G.state==='play')openPause();});
  addEventListener('contextmenu',e=>e.preventDefault());}
function readKeys(){const k=IN.keys;let x=(k.KeyD||k.ArrowRight?1:0)-(k.KeyA||k.ArrowLeft?1:0),y=(k.KeyS||k.ArrowDown?1:0)-(k.KeyW||k.ArrowUp?1:0);
  if(x||y){const d=hyp(x,y);return[x/d,y/d];}return[IN.mx,IN.my];}
function toggleWbar(force){const el=$('wbar');const show=force!==undefined?force:el.style.display!=='flex';el.style.display=show?'flex':'none';if(!show)return;el.innerHTML='';el.dir=G.lang==='he'?'rtl':'ltr';
  for(const w of WORDER){if(w!=='fist'&&!(G.weapons[w]>0))continue;const b=document.createElement('button');b.className='wchip'+(w===G.weapon?' sel':'');
    b.innerHTML=WICON[w]+'<span></span>';b.lastChild.textContent=L(WEAP[w])+(w==='fist'?'':'  '+G.weapons[w]);b.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();G.weapon=w;sfx.door();toggleWbar(false);});el.appendChild(b);}}

// ---------- HUD / overlays ----------
let toastT=0,bigT=0,areaT=0,feedT=0;
function showFeed(t){const el=$('feed');el.textContent=t;el.dir=G.lang==='he'?'rtl':'ltr';el.style.opacity=1;feedT=6;}
function buildTalk(){const el=$('tbar');if(!G.talk){el.style.display='none';return;}el.style.display='flex';el.innerHTML='';el.dir=G.lang==='he'?'rtl':'ltr';const p=G.talk.p;
  const add=k=>{const b=document.createElement('button');b.className='wchip';b.textContent=tr('t_'+k);b.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();talkDo(k);});el.appendChild(b);};
  add('greet');add('taunt');if(p.type==='civ'&&G.weapon!=='fist'&&!p.mugged)add('rob');}const hudCache={};
function setObj(t){if(G.obj===t)return;G.obj=t;$('obj').textContent=t;$('obj').style.display=t?'block':'none';$('obj').style.opacity=1;G.objT=6;}
function toast(t,dur){const el=$('toast');el.textContent=bidi(t);el.style.opacity=1;toastT=dur||3.2;}
function bigMsg(t,col,sub){const el=$('big');el.innerHTML='';const a=document.createElement('div');a.textContent=t;a.style.color=col;el.appendChild(a);
  if(sub){const b=document.createElement('small');b.textContent=sub;el.appendChild(b);}el.style.opacity=1;bigT=3;}
function showArea(k){const el=$('area');el.textContent=L(AREAS[k]);el.style.opacity=1;areaT=3.5;}
function setHud(k,v,fn){if(hudCache[k]===v)return;hudCache[k]=v;fn(v);}
function updateHUD(dt){const P=G.player;
  setHud('money',G.money,v=>$('money').textContent='$'+v.toLocaleString('en-US'));
  setHud('hp',Math.ceil(Math.max(0,P.hp)),v=>{$('hpbar').style.width=Math.min(100,v)+'%';$('hpbar').style.background=v<30?'#ff4444':'#4ade80';});
  setHud('arv',G.armor>0.5,v=>$('arm').style.display=v?'block':'none');setHud('ar',Math.ceil(G.armor),v=>$('armbar').style.width=v+'%');
  const showSt=P.swim&&!P.veh||G.stamina<G.maxStam-0.1;setHud('stv',showSt,v=>$('stam').style.display=v?'block':'none');
  setHud('st',Math.round(G.stamina/G.maxStam*100),v=>$('stambar').style.width=v+'%');
  const flash=G.wanted>0&&!G.seenNow&&Math.floor(G.time*3)%2;
  setHud('wanted',G.wanted+'|'+flash,()=>{let h='';for(let i=0;i<6;i++)h+=`<span class="${i<G.wanted?(flash?'s f':'s on'):'s'}">★</span>`;$('stars').innerHTML=h;});
  const w=G.weapon,am=w==='fist'?'':' '+(G.weapons[w]||0);setHud('weap',w+am+G.lang+(P.veh?P.veh.type:''),()=>{const el=$('weap');if(P.veh)el.textContent=vehName(P.veh);else{el.innerHTML=WICON[w]+'<span></span>';el.lastChild.textContent=L(WEAP[w])+am;}});
  setHud('bust',Math.round(Math.max(G.bust||0,G.bustCar||0)*25),v=>{$('bust').style.display=v>0?'block':'none';$('bustbar').style.width=Math.min(100,v*4)+'%';});
  const tank=P.veh&&P.veh.t.tank,mode=!P.veh?'foot|'+(w==='fist')+'|'+(G.nearLad?1:0)+'|'+(P.inside||G.nearProp||G.nearUse?1:0):(G.ctrl==='classic'?'cl|':'ez|')+tank;
  setHud('btn',mode,()=>{const A=$('bAct'),B=$('bB'),Wb=$('bW'),X=$('bX');
    if(!P.veh){A.innerHTML=w==='fist'?IC.fist:IC.aim;B.innerHTML=IC.run;Wb.innerHTML=IC.gun;Wb.style.display='flex';X.innerHTML=IC.jump;X.style.display=P.inside?'none':'flex';}
    else if(G.ctrl==='classic'){A.innerHTML=IC.gas;B.innerHTML=IC.brake;Wb.innerHTML=IC.hb;Wb.style.display='flex';X.innerHTML=tank?IC.aim:IC.horn;X.style.display='flex';}
    else{A.innerHTML=tank?IC.aim:IC.horn;B.innerHTML=IC.hb;Wb.style.display='none';X.style.display='none';}
    $('bEnter').innerHTML=!P.veh&&(P.inside||G.nearProp||G.nearUse)?IC.use:!P.veh&&G.nearLad?IC.lad:IC.car;});
  setHud('clock',clockStr()+ENV.weather+G.lang,()=>$('clock').textContent=clockStr()+' · '+L(WNAME[ENV.weather]));
  const M=G.mission,tm=M&&M.timer!=null?Math.ceil(M.timer):null;
  setHud('timer',tm,v=>{$('timer').style.display=v==null?'none':'block';if(v!=null)$('timer').textContent=Math.floor(v/60)+':'+String(v%60).padStart(2,'0');});
  if(toastT>0){toastT-=dt;if(toastT<=0)$('toast').style.opacity=0;}
  if(bigT>0){bigT-=dt;if(bigT<=0)$('big').style.opacity=0;}
  if(areaT>0){areaT-=dt;if(areaT<=0)$('area').style.opacity=0;}
  if(feedT>0){feedT-=dt;if(feedT<=0)$('feed').style.opacity=0;}
  const fv=P.veh&&!P.veh.t.boat&&!P.veh.t.tank;setHud('fuelv',!!fv,v=>$('fuel').style.display=v?'block':'none');if(fv)setHud('fuel',Math.round(P.veh.fuel*50),v=>{$('fuelbar').style.width=v*2+'%';$('fuelbar').style.background=v<8?'#ff5a3c':'#f5c542';});
  setHud('med',G.meds,v=>{$('med').style.display=v>0?'block':'none';$('med').textContent='✚ '+v;});
  setHud('radio',(P.veh?1:0)+'|'+G.radio+G.lang,()=>{$('radio').style.display=P.veh?'block':'none';$('radio').textContent='♪ '+(G.radio>=0?RADIO[G.radio].n:tr('radioOff'));});
  if(G.hurtFlash>0)G.hurtFlash=Math.max(0,G.hurtFlash-dt*2);
  if(G.punchT>0)G.punchT-=dt;
  drawMini();}
function renderDialog(){const D=G.dialog;if(!D)return;const line=D.lines[D.i],sp=SPK[line.who];const el=$('dlg');el.style.display='block';
  el.dir=G.lang==='he'?'rtl':'ltr';el.querySelector('.who').textContent=L(sp);el.querySelector('.who').style.color=sp.c;
  el.querySelector('.txt').textContent=L(line).slice(0,Math.floor(D.ch));el.querySelector('.hint').textContent=tr('tap');}
function hideDialog(){$('dlg').style.display='none';}
function applyLang(){document.documentElement.lang=G.lang;const rtl=G.lang==='he';['obj','toast','big','pause','menu','shop','feed','area','timer'].forEach(id=>$(id).dir=rtl?'rtl':'ltr');
  for(const k in hudCache)delete hudCache[k];buildMenu();if(G.dialog)renderDialog();if(G.state==='pause')buildPause();
  if(G.player&&G.state!=='title'){G.obj='';updateMission(0);}}
function btn(txt,fn,cls){const b=document.createElement('button');b.className='mbtn'+(cls?' '+cls:'');b.textContent=txt;b.onclick=e=>{if(performance.now()-(G.panelT||0)<350)return;AU.init();sfx.door();fn(e);};return b;}
function optRow(rebuild){const row=document.createElement('div');row.className='row';
  row.appendChild(btn(tr('lang'),()=>{G.lang=G.lang==='he'?'en':'he';store.set('sb_lang',G.lang);applyLang();}));
  row.appendChild(btn(tr('sound')+': '+tr(G.sound?'on':'off'),()=>{G.sound=!G.sound;store.set('sb_sound',G.sound);AU.setVol();rebuild();}));
  row.appendChild(btn(tr('ctrl')+': '+tr(G.ctrl),()=>{G.ctrl=G.ctrl==='classic'?'easy':'classic';store.set('sb_ctrl',G.ctrl);rebuild();}));return row;}
function buildMenu(){const m=$('menu');m.innerHTML='';const has=!!store.get('sb_save',null);
  const t=document.createElement('div');t.className='logo';t.innerHTML='<span>SOLACE</span><span>BAY</span>';m.appendChild(t);
  const s=document.createElement('div');s.className='sub';s.textContent=(G.lang==='he'?'סולס ביי · ':'')+tr('sub');m.appendChild(s);
  if(has)m.appendChild(btn(tr('cont'),()=>startGame(false),'pri'));
  m.appendChild(btn(tr('newgame'),()=>{if(!has){startGame(true);return;}m.innerHTML='';const q=document.createElement('p');q.className='sub';q.textContent=tr('newconfirm');m.appendChild(q);
    const r=document.createElement('div');r.className='row';r.appendChild(btn(tr('yes'),()=>startGame(true),'pri'));r.appendChild(btn(tr('no'),buildMenu));m.appendChild(r);},has?'':'pri'));
  m.appendChild(optRow(buildMenu));
  if(innerHeight>innerWidth)m.appendChild(btn(tr(G.rot?'rotOff':'rotOn'),()=>{G.rot=!G.rot;store.set('sb_rot',G.rot);resize();buildMenu();}));}
function openPause(){G.panelT=performance.now();G.state='pause';toggleWbar(false);buildPause();$('pause').style.display='flex';}
function closePause(){$('pause').style.display='none';G.state='play';}
function buildPause(){const m=$('pause');m.innerHTML='';const h=document.createElement('h2');h.textContent=tr('title');m.appendChild(h);
  const st=document.createElement('div');st.className='stats';st.textContent=`${tr('missions')}: ${G.done.length}/${MISSIONS.length}  ·  ${tr('tokens')}: ${G.tokens.length}/${TOKENS.length}  ·  ${tr('money')}: $${G.money}  ·  ${tr('rep')}: ${Math.round(G.rep)}`;m.appendChild(st);
  m.appendChild(btn(tr('resume'),closePause,'pri'));
  m.appendChild(btn(tr('misT'),()=>{closePause();openMis();}));m.appendChild(btn(tr('map'),openMap));if(innerHeight>innerWidth)m.appendChild(btn(tr(G.rot?'rotOff':'rotOn'),()=>{G.rot=!G.rot;store.set('sb_rot',G.rot);resize();buildPause();}));
  m.appendChild(optRow(buildPause));
  const hp=document.createElement('p');hp.className='help';hp.textContent=tr('help');m.appendChild(hp);
  const row=document.createElement('div');row.className='row';row.appendChild(btn(tr('save'),()=>{saveGame();toast(tr('saved'));}));row.appendChild(btn(tr('menu'),()=>{saveGame();location.reload();}));m.appendChild(row);}
function openShop(s,mode){G.panelT=performance.now();G.state='shop';G.shop=s;G.shopMode=mode;G.slot=null;G.talk=null;buildTalk();toggleWbar(false);$('ibar').style.display='none';buildShop();$('shop').style.display='flex';}
function closeShop(){$('shop').style.display='none';G.state='play';G.shop=null;saveGame();G.ibKey='';buildInsideBar();}
function buildShop(){const s=G.shop,P=G.player,md=G.shopMode,m=$('shop');m.innerHTML='';m.dir=G.lang==='he'?'rtl':'ltr';const h=document.createElement('h2');h.textContent=L(s.name);h.style.color=s.col;m.appendChild(h);
  const st=document.createElement('div');st.className='stats';st.textContent=tr('money')+': $'+G.money.toLocaleString('en-US');m.appendChild(st);
  const grid=document.createElement('div');grid.className='shopgrid';
  const item=(name,sub,price,fn,ic,dis)=>{const b=document.createElement('button');b.className='sitem'+((G.money<price||dis)?' dis':'');b.innerHTML=(ic||'')+'<b></b><span></span><i></i>';b.querySelector('b').textContent=name;b.querySelector('span').textContent=sub;b.querySelector('i').textContent=price?'$'+price:'';
    b.onclick=()=>{if(performance.now()-(G.panelT||0)<350)return;if(G.money<price||dis){sfx.no();return;}G.money-=price;fn();sfx.blip();buildShop();};grid.appendChild(b);};
  if(md==='guns'){for(const w of WORDER.slice(1)){const W=WEAP[w];item(L(W),'+'+W.pack+(G.weapons[w]?'  ('+G.weapons[w]+')':''),owned('b_guns')?Math.round(W.price*0.75):W.price,()=>giveWeapon(w,W.pack),WICON[w]);}item(tr('armor'),Math.ceil(G.armor)+'/100',300,()=>{G.armor=100;},WICON.armor);}
  if(md==='clothes')for(const o of OUTFITS){const own=G.outfits.includes(o.id),on=G.outfit===o.id;item(L(o),on?tr('wearing'):own?tr('wear'):'',own?0:o.price,()=>{if(!own)G.outfits.push(o.id);wearOutfit(o.id);},'<span class="sw" style="background:'+o.shirt+'"></span>',on);}
  if(md==='food'){item(tr('snackI'),'+40',15,()=>{P.hp=Math.min(100,P.hp+40);},null,P.hp>=100);item(tr('medkit'),G.meds+'/3',80,()=>{G.meds++;},null,G.meds>=3);}
  propPanel(md,item,m,P);if(md==='fly')flyPanel(item,m);if(md==='mis')misPanel(item,m);if(grid.children.length)m.appendChild(grid);
  if(md==='slots'){const d=document.createElement('div');d.className='reels';d.textContent=G.slot?G.slot.r.join('   '):'7   ★   ♦';m.appendChild(d);const rs=document.createElement('div');rs.className='stats';rs.textContent=G.slot?(G.slot.win>G.slot.bet?fmt(tr('slotWin'),G.slot.win):G.slot.win?'= $'+G.slot.win:tr('slotLose')):tr('slots');m.appendChild(rs);
    const row=document.createElement('div');row.className='row';for(const b of [50,200,1000])row.appendChild(btn(tr('spin')+' $'+b,()=>slotSpin(b),G.money>=b?'rob':''));m.appendChild(row);}
  m.appendChild(btn(tr('close'),closeShop,'pri'));}
