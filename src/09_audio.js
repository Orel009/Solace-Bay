// ---------- v4 audio: layered engines, formant voices, ambience, reverb ----------
var VOW=[[800,1250],[520,1850],[320,2300],[500,900],[360,750]];
function aOut(node,o){node.connect(AU.master);if(o&&o.rev&&AU.rev){const r=AU.ctx.createGain();r.gain.value=o.rev;node.connect(r);r.connect(AU.rev);}}
function aN(dur,vol,type,fq,q,o){o=o||{};const x=AU.ctx;if(!x||!G.sound||!(vol>0.003))return;const t=x.currentTime+(o.at||0),s=x.createBufferSource();s.buffer=AU.noise;s.loop=true;s.playbackRate.value=o.rate||1;
  const f=x.createBiquadFilter();f.type=type;f.frequency.setValueAtTime(fq,t);if(o.to)f.frequency.exponentialRampToValueAtTime(o.to,t+dur);f.Q.value=q||0.7;
  const gn=x.createGain();gn.gain.setValueAtTime(0.0001,t);gn.gain.linearRampToValueAtTime(vol,t+(o.a||0.004));gn.gain.exponentialRampToValueAtTime(0.0006,t+dur);s.connect(f);f.connect(gn);aOut(gn,o);s.start(t,Math.random()*0.6);s.stop(t+dur+0.03);}
function aT(fq,dur,type,vol,o){o=o||{};const x=AU.ctx;if(!x||!G.sound||!(vol>0.003))return;const t=x.currentTime+(o.at||0),os=x.createOscillator(),gn=x.createGain();os.type=type;os.frequency.setValueAtTime(fq,t);if(o.to)os.frequency.exponentialRampToValueAtTime(Math.max(20,o.to),t+(o.gl||dur));
  gn.gain.setValueAtTime(0.0001,t);gn.gain.linearRampToValueAtTime(vol,t+(o.a||0.005));gn.gain.exponentialRampToValueAtTime(0.0006,t+dur);os.connect(gn);let out=gn;
  if(o.lp){const f=x.createBiquadFilter();f.type=o.bp?'bandpass':'lowpass';f.frequency.value=o.lp;f.Q.value=o.q||0.8;gn.connect(f);out=f;}aOut(out,o);os.start(t);os.stop(t+dur+0.03);}
function aSyl(f0,at,dur,vol,vow,rev){const x=AU.ctx;if(!x||!G.sound||!(vol>0.003))return;const t=x.currentTime+at,os=x.createOscillator(),gn=x.createGain(),F=VOW[vow%5],up=f0>230?1.16:1;os.type='sawtooth';
  os.frequency.setValueAtTime(f0*rr(0.93,1.08),t);os.frequency.linearRampToValueAtTime(f0*rr(0.84,1.16),t+dur);gn.gain.setValueAtTime(0.0001,t);gn.gain.linearRampToValueAtTime(vol,t+0.016);gn.gain.setValueAtTime(vol,t+dur*0.55);gn.gain.exponentialRampToValueAtTime(0.0006,t+dur);
  for(let k=0;k<2;k++){const b=x.createBiquadFilter();b.type='bandpass';b.frequency.value=F[k]*up;b.Q.value=k?8:5;os.connect(b);b.connect(gn);}aOut(gn,{rev:rev||0});os.start(t);os.stop(t+dur+0.03);}
function aSpeak(f0,vol,n,rev){let at=0;for(let i=0;i<n;i++){const d=rr(0.07,0.13);aSyl(f0*(1+0.12*Math.sin(i*1.9)),at,d,vol,ri(0,4),rev);at+=d+rr(0.01,0.05);}}
function audioUp(){const x=AU.ctx;AU.up=1;
  try{const cp=x.createDynamicsCompressor();cp.threshold.value=-15;cp.knee.value=12;cp.ratio.value=5;cp.attack.value=0.004;cp.release.value=0.22;AU.master.disconnect();AU.master.connect(cp);cp.connect(x.destination);AU.master.gain.value=G.sound?0.62:0;}catch(e){}
  try{const len=Math.floor(x.sampleRate*1.25),ib=x.createBuffer(2,len,x.sampleRate);for(let c=0;c<2;c++){const d=ib.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.8);}
    const cv=x.createConvolver();cv.buffer=ib;AU.rev=x.createGain();const wet=x.createGain();wet.gain.value=0.33;AU.rev.connect(cv);cv.connect(wet);wet.connect(AU.master);}catch(e){AU.rev=null;}
  const loop=(type,fq,q,dest)=>{const s=x.createBufferSource();s.buffer=AU.noise;s.loop=true;const fl=x.createBiquadFilter();fl.type=type;fl.frequency.value=fq;fl.Q.value=q;const gn=x.createGain();gn.gain.value=0;s.connect(fl);fl.connect(gn);gn.connect(dest||AU.master);s.start(0,Math.random());return{g:gn.gain,f:fl.frequency};};
  AU.amb={hum:loop('lowpass',170,0.7),sea:loop('bandpass',520,0.6),wind:loop('bandpass',700,1.1),road:loop('lowpass',430,0.5),skid:loop('bandpass',1300,7),exh:loop('bandpass',300,1.4,AU.engF),crowd:loop('bandpass',620,0.9),rainLow:loop('lowpass',850,0.5),rotor:loop('lowpass',300,1)};
  AU.engB=x.createOscillator();AU.engB.type='sawtooth';const gb=x.createGain();gb.gain.value=0.55;AU.engB.connect(gb);gb.connect(AU.engF);AU.engB.start();
  AU.lfo=x.createOscillator();AU.lfo.type='sine';AU.lfo.frequency.value=9;AU.lfoG=x.createGain();AU.lfoG.gain.value=0;AU.lfo.connect(AU.lfoG);AU.lfoG.connect(AU.engG.gain);AU.lfo.start();
  AU.sr=x.createOscillator();AU.sr.type='sawtooth';const sf=x.createBiquadFilter();sf.type='lowpass';sf.frequency.value=2100;AU.srG=x.createGain();AU.srG.gain.value=0;AU.sr.connect(sf);sf.connect(AU.srG);AU.srG.connect(AU.master);AU.sr.start();
  AU.sirG.gain.value=0;AU.skidG.gain.value=0;
  Object.assign(sfx,{
   shot(big){if(big){aN(0.5,0.6,'lowpass',900,0.7,{to:160,rev:0.7});aT(120,0.4,'sine',0.5,{to:38});aN(0.07,0.4,'highpass',1800,0.7);}else{aN(0.06,0.42,'highpass',1300,0.7);aN(0.22,0.26,'bandpass',900,0.8,{to:260,rev:0.6});aT(190,0.11,'triangle',0.3,{to:55});}},
   boom(){aT(70,1.3,'sine',0.75,{to:26,rev:0.4});aN(1.5,0.75,'lowpass',520,0.6,{to:70,rev:0.8});aN(0.2,0.5,'highpass',900,0.7);for(let i=0;i<5;i++)aN(0.09,0.14,'bandpass',rr(900,2600),2,{at:0.25+i*rr(0.08,0.2)});},
   crash(i){const v=Math.min(0.55,i/480);aN(0.2,v,'bandpass',1700,0.9,{to:500,rev:0.3});aT(95,0.16,'sine',v*0.8,{to:45});for(const f of [523,811,1217,1733])aT(f*rr(0.95,1.05),0.14,'square',v*0.07,{lp:2600});if(i>260)for(let k=0;k<4;k++)aN(0.05,v*0.25,'highpass',rr(3000,6000),1,{at:0.1+k*rr(0.05,0.12)});},
   blip(){aT(988,0.09,'sine',0.16);aT(1319,0.16,'sine',0.14,{at:0.07});aT(2637,0.12,'sine',0.04,{at:0.07});},
   chat(p){const t=AU.ctx.currentTime;if(t-(AU.lastChat||0)<0.085)return;AU.lastChat=t;aSyl((p||220)*0.62,0,rr(0.06,0.1),0.16,ri(0,4));},
   splash(){aN(0.5,0.3,'bandpass',1900,0.7,{to:420});aN(0.25,0.2,'lowpass',500,0.7,{at:0.04});for(let i=0;i<3;i++)aT(rr(500,900),0.06,'sine',0.05,{to:1300,at:0.12+i*0.07});},
   horn(v,vol){const k=vol==null?1:vol;if(k<0.05)return;if(G.duckHorn&&v&&v===G.player.veh){for(let i=0;i<2;i++)aT(560,0.14,'sawtooth',0.2,{to:330,lp:1500,bp:1,q:3,at:i*0.17});return;}
     const h=HORN[v&&v.type]||(v&&v.t&&v.t.truck?[196,247]:[392,494]),d=v&&v.t&&(v.t.bus||v.t.truck)?0.5:0.32;for(const f of h)if(f){aT(f,d,'sawtooth',0.085*k,{lp:f*4.5,a:0.012});aT(f*1.006,d,'square',0.03*k,{lp:f*3,a:0.012});}},
   voice(p,vol){if(!(vol>0.05))return;if(p&&p.kind==='dog'){this.bark(vol);return;}const f=((p&&p.voice)||200)*(p&&p.fem?1.05:0.8);aSpeak(clamp(f,95,330),0.2*vol,ri(3,6),0.15);},
   scream(vol,f){if(!(vol>0.05))return;const x2=AU.ctx,t=x2.currentTime,f0=(f||220)*1.9,os=x2.createOscillator(),gn=x2.createGain();os.type='sawtooth';os.frequency.setValueAtTime(f0*0.8,t);os.frequency.linearRampToValueAtTime(f0*1.25,t+0.12);os.frequency.linearRampToValueAtTime(f0*0.75,t+0.55);
     gn.gain.setValueAtTime(0.0001,t);gn.gain.linearRampToValueAtTime(0.22*vol,t+0.04);gn.gain.exponentialRampToValueAtTime(0.0006,t+0.6);for(const fr of [950,1500]){const b=x2.createBiquadFilter();b.type='bandpass';b.frequency.value=fr;b.Q.value=4;os.connect(b);b.connect(gn);}aOut(gn,{rev:0.4});os.start(t);os.stop(t+0.65);},
   bark(vol){if(!(vol>0.05))return;for(let i=0;i<2;i++){aT(rr(300,360),0.09,'sawtooth',0.24*vol,{to:170,lp:850,bp:1,q:2.5,at:i*0.16});aN(0.05,0.09*vol,'bandpass',1200,1.5,{at:i*0.16});}},
   pass(){[523,659,784,1046].forEach((f,i)=>{aT(f,0.34,'triangle',0.2,{at:i*0.13,rev:0.4});aT(f*2,0.2,'sine',0.06,{at:i*0.13});});},
   fail(){[392,330,262,196].forEach((f,i)=>aT(f,0.4,'triangle',0.2,{at:i*0.18,rev:0.4,to:f*0.97}));},
   punch(){aT(140,0.1,'sine',0.4,{to:55});aN(0.06,0.3,'bandpass',1100,1);},
   door(){aT(115,0.09,'sine',0.3,{to:62});aN(0.03,0.16,'highpass',2300,0.7);aN(0.07,0.12,'lowpass',420,0.8,{at:0.012});},
   step(){const P=G.player,tl=P.inside?-1:tileAt(P.x,P.y),soft=tl===TL.GRASS||tl===TL.SAND;AU.stp=!AU.stp;if(P.inside){aT(AU.stp?150:135,0.05,'sine',0.07,{to:80});aN(0.03,0.04,'lowpass',900,0.8);}
     else if(soft)aN(0.07,0.06,'lowpass',AU.stp?520:440,0.6);else if(ENV.wet>0.4){aN(0.06,0.07,'bandpass',1700,0.8);}else{aN(0.035,0.07,'bandpass',AU.stp?1500:1250,1.2);aT(95,0.04,'sine',0.05,{to:60});}},
   thunder(){aN(0.25,0.6,'highpass',700,0.7);aN(3.2,0.8,'lowpass',150,0.6,{to:55,at:0.05,rev:0.8});aN(1.2,0.3,'lowpass',420,0.6,{at:0.3});},
   flame(){aN(0.14,0.13,'bandpass',700,0.7,{to:1500});},no(){aT(155,0.16,'square',0.09,{lp:900});aT(147,0.16,'square',0.09,{lp:900});},jump(){aN(0.16,0.09,'bandpass',600,1.2,{to:1900});},
   starter(e){if(e){aT(300,0.25,'sine',0.08,{to:900});return;}for(let i=0;i<4;i++)aN(0.055,0.16,'bandpass',760,3,{at:i*0.075});aN(0.3,0.18,'lowpass',300,0.8,{at:0.3});}});}
function aBird(v){const n=ri(2,5),f=rr(2600,4300);for(let i=0;i<n;i++)aT(f*rr(0.9,1.1),0.07,'sine',0.028*v,{to:f*rr(0.7,1.45),at:i*rr(0.09,0.14)});}
function aCricket(v){const n=ri(6,10);for(let i=0;i<n;i++)aT(4300,0.028,'sine',0.014*v,{at:i*0.052});}
function aGull(v){const n=ri(2,3);for(let i=0;i<n;i++)aT(rr(1350,1600),0.3,'sawtooth',0.035*v,{to:860,lp:1900,bp:1,q:3,at:i*0.36,rev:0.5});}
function updateAudio(){if(!AU.ctx)return;if(!AU.up)audioUp();const P=G.player,x=AU.ctx,t=x.currentTime,play=G.state==='play',live=play||G.state==='dialog',A=AU.amb,v=P.veh,st=(p,val,k)=>p.setTargetAtTime(val,t,k||0.1),dtA=Math.min(0.1,t-(AU.pt||t));AU.pt=t;
  if(v&&!P.dead&&play){const S=Object.assign({},SND.def,SND[v.type]),sp=Math.abs(v.speed),gs=v.t.max/4,gear=Math.min(3,Math.floor(sp/gs)),fr=(sp-gear*gs)/gs,air=v.alt>0.25,load=v.thr>0?1:0,spin=load&&sp<55&&!v.t.elec&&!v.t.boat?0.45:0,dmg=v.hp<v.t.hp*0.35?1:0;
    if(AU.engV!==v){AU.engV=v;AU.eng.type=S.w;AU.engB.type=S.w==='sine'?'sine':S.w==='square'?'square':'sawtooth';if(!v.t.heli&&!v.t.plane)sfx.starter(v.t.elec);}
    const fq=S.b+gear*S.r*0.2+fr*S.r+load*S.r*0.16+spin*S.r,dry=v.fuel<=0?0.3:1,base=0.042*S.v*dry*(load?1.4:1);
    st(AU.eng.frequency,fq,0.07);st(AU.engB.frequency,fq*1.013+(dmg?Math.sin(G.time*33)*3:0),0.07);st(AU.eng2.frequency,fq/2,0.07);st(AU.engF.frequency,S.c*(0.7+0.5*fr+0.45*load),0.09);
    st(AU.engG.gain,base,0.05);st(AU.lfo.frequency,S.am?S.am:Math.max(7,fq/5),0.1);st(AU.lfoG.gain,base*(S.am?0.5:0.14)*(dmg?1.9:1),0.1);
    st(A.exh.g,v.t.elec?0:0.35+load*0.5,0.1);st(A.exh.f,Math.min(2200,fq*3.1),0.1);
    st(A.road.g,v.t.boat||air?0:Math.min(0.07,sp/5200),0.15);st(A.wind.g,Math.min(0.085,sp*sp/2.7e6)+(air?0.03:0),0.2);st(A.wind.f,520+sp*1.5,0.2);
    const sk=v.t.boat||air?0:Math.max(G.skidNow?clamp((Math.abs(v.slide||0)-70)/250,0.3,1):0,v.thr<0&&v.speed>230?0.45:0);st(A.skid.g,sk*0.08,0.05);st(A.skid.f,1000+Math.abs(v.slide||0)*1.3+sp*0.6,0.05);
    st(A.rotor.g,v.t.heli?0.3*(0.45+0.55*Math.abs(Math.sin(G.time*20))):0,0.02);}
  else{AU.engV=null;st(AU.engG.gain,0,0.1);st(AU.lfoG.gain,0,0.1);st(A.road.g,0);st(A.skid.g,0,0.05);st(A.rotor.g,0);st(A.wind.g,live?Math.min(0.05,ENV.wind*0.02+(ENV.weather==='storm'?0.035:0)):0,0.5);}
  {let bd=420,bv=null;if(live)for(const o of G.vehicles){if(o===v||!o.driver||o.dead||Math.abs(o.speed)<30)continue;const d=hyp(o.x-P.x,o.y-P.y);if(d<bd){bd=d;bv=o;}}
    if(bv){const S=Object.assign({},SND.def,SND[bv.type]),ap=((bv.vx-(v?v.vx:0))*(P.x-bv.x)+(bv.vy-(v?v.vy:0))*(P.y-bv.y))/(bd||1);st(AU.tr.frequency,(S.b+Math.abs(bv.speed)*0.22)*(1+clamp(ap/1500,-0.2,0.2)),0.1);st(AU.trG.gain,0.034*S.v*Math.pow(1-bd/420,1.5),0.1);}else st(AU.trG.gain,0,0.15);}
  radioTick();
  AU.ambN=(AU.ambN||0)-1;if(AU.ambN<=0){AU.ambN=18;let w=0,gr=0;const tx=Math.floor(P.x/T),ty=Math.floor(P.y/T);for(let dy=-5;dy<=5;dy+=2)for(let dx=-5;dx<=5;dx+=2){const tl=tget(tx+dx,ty+dy);if(tl===0)w++;else if(tl===TL.GRASS||tl===TL.SAND)gr++;}AU.nearW=w/36;AU.nearG=gr/36;
    let c=0;for(const p of G.peds)if(!p.dead&&p.type==='civ'&&hyp(p.x-P.x,p.y-P.y)<340)c++;AU.crowd=c;}
  const ins=P.inside?0.25:1,car=v?0.55:1,day=1-ENV.dark;
  st(A.hum.g,live?(0.02+0.022*day)*ins*car:0,0.6);
  st(A.sea.g,live?(clamp(AU.nearW*1.7,0,1)*0.07*(0.6+0.4*Math.sin(G.time*0.55))+(v&&v.t.boat?Math.min(0.09,Math.abs(v.speed)/4200):0))*ins:0,0.4);
  st(A.crowd.g,live?clamp(((AU.crowd||0)-3)/12,0,1)*0.028*car*(P.inside?1.8:1)*(0.8+0.2*Math.sin(G.time*1.7)):0,0.5);
  st(AU.rainG.gain,live?0.07*ENV.rain*ins:0,0.3);st(A.rainLow.g,live?ENV.rain*(v?0.1:0.045)*(P.inside?0.5:1):0,0.3);
  if(live&&G.sound&&!P.inside){AU.critT=(AU.critT==null?2:AU.critT)-dtA;if(AU.critT<=0){const d=ENV.dark,q=v?0.5:1;
      if(ENV.rain>0.25)AU.critT=3;else if(d>0.55){AU.critT=rr(1.1,2.6);aCricket(q*(0.6+(AU.nearG||0)));}else if((AU.nearW||0)>0.12&&rand()<0.45){AU.critT=rr(3,8);aGull(q);}else{AU.critT=rr(1.6,5);if((AU.nearG||0)>0.04||rand()<0.35)aBird(q);}
      if(rand()<0.07){const h=pick([[392,494],[330,415],[466,587]]);for(const f of h)aT(f,0.35,'sawtooth',0.012,{lp:900,rev:0.8});}else if(rand()<0.04)for(let i=0;i<2;i++)aT(330,0.09,'sawtooth',0.02,{to:180,lp:700,bp:1,q:2,at:i*0.17,rev:0.8});}}
  st(AU.heliG.gain,G.heli&&play?clamp(1-hyp(G.heli.x-P.x,G.heli.y-P.y)/1400,0,1)*0.5*(0.5+0.5*Math.abs(Math.sin(G.time*19))):0,0.02);
  let near=1e9;for(const o of G.vehicles)if(o.siren&&!o.dead)near=Math.min(near,o===v?160:hyp(o.x-P.x,o.y-P.y));if(G.wanted>0)for(const o of G.vehicles)if(o.ai&&o.ai.mode==='chase'&&o.ai.faction==='police')near=Math.min(near,hyp(o.x-P.x,o.y-P.y));
  if(near<1200&&play){st(AU.srG.gain,0.03*Math.pow(1-near/1200,1.3),0.1);const ph=near<330?G.time*13:G.time*2.7;AU.sr.frequency.setTargetAtTime(980+340*Math.sin(ph),t,0.02);}else st(AU.srG.gain,0,0.1);}
