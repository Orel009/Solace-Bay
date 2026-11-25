// ---------- performance: frame pacing + adaptive resolution ----------
const QL=[{d:2},{d:2},{d:2},{d:2,lock:1}];
const PF={hzS:[],hz:0,win:[],wt:0,good:0,last:0,ban:{},upT:-99,fpsN:0,fpsT:0,fps:0,work:[]};
G.q=0;G.gfx=store.get('sb_gfx','auto');G.showFps=!!store.get('sb_fps',false);
if(G.gfx!=='smooth')G.gfx='auto';G.q=G.gfx==='smooth'?3:0;
function gfxLock(){return G.gfx==='smooth'||(G.gfx==='auto'&&QL[G.q].lock);}
function resize(){G.dpr=Math.min(2,devicePixelRatio||1);G.lowFx=0;applyLayout();CV.width=Math.round(G.vw*G.dpr);CV.height=Math.round(G.vh*G.dpr);CV.style.width=G.vw+'px';CV.style.height=G.vh+'px';
  const ms=Math.round(Math.min(130,Math.max(96,Math.min(G.vw,G.vh)/G.ui*0.28)));MC.style.width=MC.style.height=ms+'px';MC.width=MC.height=Math.round(ms*Math.min(2,devicePixelRatio||1)*G.ui);document.getElementById('root').style.setProperty('--vw',G.vw+'px');document.documentElement.style.setProperty('--ms',ms+'px');}
function setQ(q,why){q=clamp(q,0,3);if(q===G.q)return;const up=q<G.q;G.q=q;PF.last=G.time;PF.win.length=0;PF.good=0;if(up)PF.upT=G.time;if(q<=2)store.set('sb_q',q);resize();}
function perfAdapt(dt,work){return;PF.win.push(dt);PF.work.push(work);PF.wt+=dt;if(PF.wt<2)return;PF.wt=0;
  const n=PF.win.length,avg=PF.win.reduce((x,y)=>x+y,0)/n,w=PF.work.slice().sort((x,y)=>x-y),wk=w[(w.length*0.8)|0];PF.win.length=0;PF.work.length=0;
  if(G.time-PF.last<2.5)return;const lk=gfxLock(),tgt=lk?1/30:1/60;
  if(avg>tgt*(lk?1.15:1.12)||(!lk&&wk>13)){PF.bad=(PF.bad||0)+1;if(PF.bad>=2||avg>tgt*1.5){if(G.time-PF.upT<10)PF.ban[G.q-1]=1;PF.bad=0;PF.good=0;setQ(G.q+1);}return;}PF.bad=0;
  if(G.q>0&&!PF.ban[G.q-1]&&(lk?wk<6:avg<tgt*1.04&&wk<8)){if(++PF.good>=4)setQ(G.q-1);}else PF.good=0;}
let last=0,acc=0;
function frame(now){requestAnimationFrame(frame);let raw=(now-last)/1000||0;last=now;if(raw>0.3)raw=1/60;
  if(raw>0.004){PF.hzS.push(raw);if(PF.hzS.length>=90){const s=PF.hzS.slice().sort((x,y)=>x-y);PF.hz=s[8];PF.hzS.length=0;}}
  const tgt=gfxLock()?1/30:1/60;acc+=raw;
  if(PF.hz&&PF.hz<tgt*0.62&&acc<tgt*0.86)return;
  const dt=Math.min(0.05,acc);acc=0;const t0=performance.now();
  if(G.state==='title'){G.time+=dt;G.cam.x=60*T+Math.sin(G.time*0.05)*1800;G.cam.y=70*T+Math.cos(G.time*0.04)*1500;G.cam.s=Math.min(G.vw,G.vh)/560*0.75;ENV.clock=19.4;calcLight();}
  else{G.ft=lerp(G.ft||0.016,dt,0.03);step(dt);if(G.state==='map')drawMap();updateCamera(dt);updateHUD(dt);updateAudio();}
  render();const work=performance.now()-t0;
  if(work<(gfxLock()?16:9))chunkPrefetch();
  perfAdapt(dt,work);
  PF.fpsN++;PF.fpsT+=dt;if(PF.fpsT>=0.5){PF.fps=Math.round(PF.fpsN/PF.fpsT);PF.fpsN=0;PF.fpsT=0;}
  if(G.showFps){g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';const z=G.dpr;g.font=`bold ${12*z}px monospace`;g.textAlign='left';g.textBaseline='top';g.fillStyle='rgba(0,0,0,0.55)';g.fillRect(4*z,(G.vh-22)*z,120*z,18*z);g.fillStyle=PF.fps>=55?'#5dff7a':PF.fps>=28?'#ffd23f':'#ff5d5d';g.fillText(PF.fps+' FPS  Q'+G.q+(gfxLock()?' 30':''),8*z,(G.vh-19)*z);}}
const GFXN={auto:R2('רגיל 60FPS','Normal 60FPS'),smooth:R2('יציב 30FPS','Steady 30FPS')};
function optRow(rebuild){const row=document.createElement('div');row.className='row';
  row.appendChild(btn(tr('lang'),()=>{G.lang=G.lang==='he'?'en':'he';store.set('sb_lang',G.lang);applyLang();}));
  row.appendChild(btn(tr('sound')+': '+tr(G.sound?'on':'off'),()=>{G.sound=!G.sound;store.set('sb_sound',G.sound);AU.setVol();rebuild();}));
  row.appendChild(btn(tr('ctrl')+': '+tr(G.ctrl),()=>{G.ctrl=G.ctrl==='classic'?'easy':'classic';store.set('sb_ctrl',G.ctrl);rebuild();}));
  row.appendChild(btn(L(R2('גרפיקה','Graphics'))+': '+L(GFXN[G.gfx]),()=>{G.gfx=G.gfx==='auto'?'smooth':'auto';store.set('sb_gfx',G.gfx);G.q=G.gfx==='smooth'?3:0;resize();rebuild();}));
  row.appendChild(btn('FPS: '+tr(G.showFps?'on':'off'),()=>{G.showFps=!G.showFps;store.set('sb_fps',G.showFps);rebuild();}));return row;}
