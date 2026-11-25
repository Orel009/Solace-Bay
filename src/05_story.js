const SPK={ray:{he:'ריי',en:'Ray',c:'#7fc8ff',p:210},benny:{he:'בני',en:'Benny',c:'#ffcf5a',p:140},dice:{he:'דייס',en:'Dice',c:'#ff7ad9',p:260},
  vex:{he:'וקס',en:'Vex',c:'#c59bff',p:110},salt:{he:'מאמא סולט',en:'Mama Salt',c:'#5fe0d0',p:300}};
const l=(who,he,en)=>({who,he,en});
const INTRO=[
 l('ray','סולס ביי. שמש, ים, וחוב שאני לא יכול להחזיר.','Solace Bay. Sun, sea, and a debt I can\'t pay back.'),
 l('ray','בחור במעבורת אמר שקוויקדרופ שליחויות מחפשים נהגים. בלי שאלות.','A guy on the ferry said QuickDrop Couriers needs drivers. No questions asked.'),
 l('ray','שכרתי חדר קטן בנמל, הדלת עם הסוכך הירוק. שם ישנים, שומרים ומחליפים בגדים.','I rented a small room at the harbor, the door with the green awning. Sleep, save and change clothes there.'),
 l('ray','המשרד שלהם ממש פה ליד. נתחיל משם.','Their office is right next door. Let\'s start there.')];
let MISSIONS=[];
function buildMissions(){MISSIONS=[
{id:'m1',name:{he:'משמרת ראשונה',en:'First Shift'},giver:'benny',col:'#ffcf5a',ic:'B',start:POI.office,
 hint:{he:'לך לקוויקדרופ שליחויות (הסמן הצהוב)',en:'Go to QuickDrop Couriers (yellow marker)'},
 steps:[
 {t:'talk',lines:[
  l('benny','אז אתה ריי. הבחור מהמעבורת אמר שאתה ירוק. אתה ירוק, ריי?','So you\'re Ray. The ferry guy said you\'re green. Are you green, Ray?'),
  l('ray','אני יודע לנהוג. ואני יודע לשתוק.','I can drive. And I can keep my mouth shut.'),
  l('benny','שני דברים נדירים בסולס ביי. הוואן הצהוב בחניה ליד.','Both rare in Solace Bay. The yellow van is in the lot next door.'),
  l('benny','החבילה הולכת למועדון "החדר הסגול" במרכז העיר. הלקוח משלם תוספת על מהירות.','The package goes to the Violet Room club, downtown. The client pays extra for speed.'),
  l('benny','יש לך דקה וחצי. ואל תפתח אותה.','You have a minute and a half. And don\'t open it.')]},
 {t:'getveh',key:'van',type:'van',at:'van',col:'#f4d03f',obj:{he:'היכנס לוואן של קוויקדרופ',en:'Get in the QuickDrop van'}},
 {t:'goto',at:'club',inVeh:'van',r:85,timer:120,stop:1,obj:{he:'מסור את החבילה ב"חדר הסגול"',en:'Deliver the package to the Violet Room'}},
 {t:'talk',lines:[
  l('dice','קוויקדרופ? הבחורים של בני תמיד מאחרים. אתה הקדמת. אני לא אוהב הפתעות.','QuickDrop? Benny\'s boys are always late. You\'re early. I don\'t like early.'),
  l('ray','אז שאעשה עוד סיבוב?','Want me to go around the block?'),
  l('dice','מצחיק. וקס אוהב מצחיקים. הנה, קח את זה — הרחובות פה נושכים.','Funny. Vex likes funny. Here, take this — the streets here bite back.'),
  l('dice','תחזור כשתרצה כסף אמיתי.','Come back when you want real money.')]},
 {t:'reward',money:500,weapon:['pistol',36]}]},
{id:'m2',name:{he:'גלגלים שאולים',en:'Borrowed Wheels'},giver:'dice',col:'#ff7ad9',ic:'D',start:POI.club,
 hint:{he:'חזור לדייס ב"חדר הסגול" (הסמן הוורוד)',en:'Go back to Dice at the Violet Room (pink marker)'},
 steps:[
 {t:'talk',lines:[
  l('dice','כסף אמיתי, כמו שהבטחתי. יש סטינגר צהוב שחונה על החול ליד החוף.','Real money, like I promised. There\'s a yellow Stinger parked on the sand by the beach.'),
  l('dice','הוא שייך לאחד העכברושים של מאמא סולט מהנמל. וקס רוצה אותו במוסך שלנו.','It belongs to one of Mama Salt\'s harbor rats. Vex wants it in our garage.'),
  l('ray','מאמא סולט?','Mama Salt?'),
  l('dice','"הגאות" מחזיקים את הנמל. אנחנו מחזיקים את האורות. תביא אותו שלם — וקס שונא שריטות.','The Tide runs the harbor. We run the lights. Bring it back in one piece — Vex hates scratches.')]},
 {t:'getveh',key:'car',type:'stinger',at:'stinger',col:'#ffd400',obj:{he:'גנוב את הסטינגר הצהוב ליד החוף',en:'Steal the yellow Stinger by the beach'}},
 {t:'wanted',n:1,toast:{he:'אזעקה! אנשי הגאות בדרך',en:'Car alarm! The Tide is coming'}},
 {t:'hostiles',n:2,type:'muscle',faction:'tide',col:'#1f6f68'},
 {t:'goto',at:'garage',inVeh:'car',r:85,minHp:0.3,stop:1,obj:{he:'הבא את הסטינגר למוסך של הקדושים (בלי להרוס אותו)',en:'Bring the Stinger to the Saints garage (keep it intact)'}},
 {t:'talk',lines:[
  l('vex','אף שריטה. טוב... כמעט.','Not a scratch. Well... almost.'),
  l('vex','אני וקס. דייס אומר שאתה שקט. שקטים חיים פה הרבה זמן.','I\'m Vex. Dice says you\'re quiet. Quiet men live long in this town.'),
  l('vex','מאמא סולט תשמע על זה. כשהיא תקרא לך — והיא תקרא — תענה.','Mama Salt will hear about this. When she calls for you — and she will — answer.')]},
 {t:'reward',money:1500}]},
{id:'m3',name:{he:'שפל',en:'Low Tide'},giver:'salt',col:'#5fe0d0',ic:'M',start:POI.tide,
 hint:{he:'מאמא סולט מחכה לך במחסן בנמל (הסמן הטורקיז)',en:'Mama Salt is waiting at the harbor warehouse (teal marker)'},
 steps:[
 {t:'talk',lines:[
  l('salt','אז. השליח שגונב מכוניות בשביל ילדי הניאון.','So. The courier who steals cars for the neon boys.'),
  l('ray','זו הייתה עבודה.','It was a job.'),
  l('salt','הכול עבודה, מתוק. עכשיו תעשה אחת בשבילי, ונהיה תיקו.','Everything\'s a job, sweetheart. Now you do one for me, and we\'re even.'),
  l('salt','שלושה ארגזים נפלו מסירה אתמול בלילה. קח את הסירה המהירה שלי ותמשה אותם מהמים לפני שמשמר החופים יגיע.','Three crates went overboard last night. Take my speedboat and fish them out before the coast guard does.'),
  l('salt','אחד נסחף ליד האי הצבאי. אל תחטוף כדור. אתה יותר שימושי חי.','One drifted near the army island. Don\'t get shot. You\'re more useful alive.')]},
 {t:'getveh',key:'boat',type:'speedboat',at:'speedboat',col:'#ecf0f1',obj:{he:'קח את הסירה המהירה ליד הרציף',en:'Take the speedboat by the pier'}},
 {t:'collect',timer:210},
 {t:'goto',at:'tidedock',inVeh:'boat',r:95,stop:1,obj:{he:'הבא את הארגזים לרציף של הגאות',en:'Bring the crates to the Tide dock'}},
 {t:'talk',lines:[
  l('salt','בוא נראה מה שווה כל כך הרבה צרות...','Let\'s see what\'s worth so much trouble...'),
  l('salt','רובים. עם חותמות של הצבא. צווארון הברזל.','Rifles. Army stamps. Iron Collar.'),
  l('ray','החיילים מהאי?','The soldiers from the island?'),
  l('salt','מישהו מוכר נשק גם לגאות וגם לקדושים. מישהו רוצה שהעיר הזאת תישרף.','Someone is selling guns to the Tide AND the Saints. Someone wants this city to burn.'),
  l('salt','תישאר קרוב, שליח. הרגע נהיית מעניין.','Stay close, courier. You just became interesting.')]},
 {t:'reward',money:2000,end:true}]}
];}

function nextMission(){return MISSIONS.find(m=>!G.done.includes(m.id));}
function startMission(m){G.mission={m,step:-1,key:{},timer:null,target:null,ents:[]};nextStep();}
function nextStep(){const M=G.mission;if(!M)return;M.step++;const s=M.m.steps[M.step];M.s=s;if(!s)return;
  M.timer=s.timer!=null?s.timer:null;M.target=null;
  switch(s.t){
  case'talk':setObj('');if(G.player.veh){G.player.veh.vx=0;G.player.veh.vy=0;}showDialog(s.lines,()=>nextStep());break;
  case'getveh':{let v=M.key[s.key];if(!v){const p=POI[s.at];v=mkVeh(s.type,p.x,p.y,p.a||0,s.col);v.persist=true;v.mission=true;v.fuel=1;M.key[s.key]=v;}M.target=v;setObj(L(s.obj));break;}
  case'goto':{const p=POI[s.at];M.target={x:p.x,y:p.y,r:s.r};setObj(L(s.obj));break;}
  case'wanted':setStars(s.n);if(s.toast)toast(L(s.toast));nextStep();break;
  case'hostiles':for(let k=0;k<s.n;k++){const v=spawnChaser(s.faction,s.type,s.col,500,1100);if(v){v.persist=true;v.mission=true;M.ents.push(v);}}nextStep();break;
  case'collect':M.need=POI.crates.length;M.got=0;M.crates=POI.crates.map(c=>mkPickup('crate',c.x,c.y,{alarm:c.alarm,mission:1}));setObj(fmt(tr('crates'),0,M.need));break;
  case'reward':passMission(s);break;
  default:stepStart(M,s);}}
function updateMission(dt){const M=G.mission;
  if(!M){const nm=nextMission();const P=G.player;
    if(G.misLock){if(hyp(P.x-G.misLock.x,P.y-G.misLock.y)>80)G.misLock=null;else return;}
    if(nm&&!P.veh&&!P.dead&&hyp(P.x-nm.start.x,P.y-nm.start.y)<36){startMission(nm);return;}
    if(!P.veh&&!P.dead)for(const sm of sideAvail())if(hyp(P.x-sm.start.x,P.y-sm.start.y)<36){startMission(sm);return;}
    setObj(G.fare?tr('fareObj'):nm?L(nm.hint):tr('free'));return;}
  const s=M.s;if(!s||s.t==='talk')return;
  if(M.timer!=null){M.timer-=dt;if(M.timer<=0){failMission('f_time');return;}}
  for(const k in M.key){const v=M.key[k];if(v.dead||v.sunk){failMission('f_veh');return;}}
  const P=G.player;const px=P.veh?P.veh.x:P.x,py=P.veh?P.veh.y:P.y;
  if(stepUpdate(M,s,dt,P,px,py))return;
  if(s.t==='getveh'){if(P.veh===M.key[s.key])nextStep();return;}
  if(s.t==='goto'){const p=POI[s.at];
    if(s.inVeh){const v=M.key[s.inVeh];
      if(s.minHp&&v.hp/v.t.hp<s.minHp){failMission('f_dmg');return;}
      if(P.veh!==v){setObj(fmt(tr('getback'),vehName(v)));M.target=v;return;}
      setObj(L(s.obj));M.target={x:p.x,y:p.y,r:s.r};}
    if(hyp(px-p.x,py-p.y)<s.r){if(P.veh){P.veh.vx*=0.2;P.veh.vy*=0.2;}nextStep();}return;}
  if(s.t==='collect'){const left=M.crates.filter(c=>!c.taken);
    if(!left.length){nextStep();return;}
    let best=null,bd=1e9;for(const c of left){const d=hyp(c.x-px,c.y-py);if(d<bd){bd=d;best=c;}}M.target={x:best.x,y:best.y,r:40};
    setObj(fmt(tr('crates'),M.need-left.length,M.need));}}
function passMission(s){const M=G.mission;G.money+=s.money||0;
  if(s.weapon){giveWeapon(s.weapon[0],s.weapon[1]);setTimeout(()=>toast(fmt(tr('newweap'),L(WEAP[s.weapon[0]]))),1600);}
  G.done.push(M.m.id);if(s.fn)s.fn();if(s.endMsg)setTimeout(()=>toast(L(s.endMsg),8),3500);cleanupMission();bigMsg(tr('passed'),'#5dff7a',fmt(tr('reward'),s.money||0));sfx.pass();saveGame();
  if(s.end)setTimeout(()=>toast(tr('chapend'),7),3500);}
function failMission(reason){const M=G.mission;if(!M)return;cleanupMission();
  if(G.state==='play'||G.state==='dialog'){bigMsg(tr('failed'),'#ff5050',tr(reason));sfx.fail();}}
function cleanupMission(){const M=G.mission;if(!M)return;
  for(const k in M.key){M.key[k].persist=false;M.key[k].mission=false;}
  for(const v of M.ents){v.persist=false;v.mission=false;}
  for(const p of G.peds)if(p.mission){p.hostile=false;p.mission=false;}
  G.pickups=G.pickups.filter(p=>!p.mission);G.mission=null;G.dialog=null;if(G.state==='dialog')G.state='play';hideDialog();}

// ---------- dialog ----------
function showDialog(lines,cb){G.dialog={lines,i:0,ch:0,cb};G.state='dialog';renderDialog();}
function advanceDialog(){const D=G.dialog;if(!D)return;const line=D.lines[D.i],full=L(line);
  if(D.ch<full.length){D.ch=full.length;renderDialog();return;}
  D.i++;D.ch=0;if(D.i>=D.lines.length){G.dialog=null;G.state='play';hideDialog();D.cb&&D.cb();return;}renderDialog();}
function updateDialog(dt){const D=G.dialog;if(!D)return;const full=L(D.lines[D.i]);if(D.ch<full.length){const before=Math.floor(D.ch);D.ch=Math.min(full.length,D.ch+dt*42);
  if(Math.floor(D.ch)!==before&&Math.floor(D.ch)%3===0)sfx.chat(SPK[D.lines[D.i].who].p);renderDialog();}}
