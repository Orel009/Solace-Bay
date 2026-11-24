'use strict';
const T=64,MW=256,MH=200,TAU=Math.PI*2;
const clamp=(v,a,b)=>v<a?a:(v>b?b:v);
const lerp=(a,b,t)=>a+(b-a)*t;
const hyp=Math.hypot;
function angDiff(a,b){let d=(b-a)%TAU;if(d>Math.PI)d-=TAU;else if(d<-Math.PI)d+=TAU;return d;}
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const rand=Math.random;
const rr=(a,b)=>a+rand()*(b-a);
const ri=(a,b)=>Math.floor(a+rand()*(b-a+1));
const pick=a=>a[Math.floor(rand()*a.length)];
let UID=0;
const store={
  get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}},
  del(k){try{localStorage.removeItem(k);}catch(e){}}
};
function shade(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;
  if(f<0){r*=1+f;g*=1+f;b*=1+f;}else{r+=(255-r)*f;g+=(255-g)*f;b+=(255-b)*f;}
  return 'rgb('+(r|0)+','+(g|0)+','+(b|0)+')';}

const G={state:'title',lang:store.get('sb_lang','he'),sound:store.get('sb_sound',true),time:0,
  money:0,wanted:0,unseen:0,lastCrime:-9,vehicles:[],peds:[],bullets:[],parts:[],pickups:[],decals:[],
  player:null,cam:{x:0,y:0,z:1,s:1},mission:null,done:[],tokens:[],weapons:{fist:1},weapon:'fist',
  stamina:15,maxStam:15,fireCD:0,inBase:false,spawnT:0,seen:{},deadT:0,obj:'',dialog:null};

const STR={
he:{title:'סולס ביי',sub:'פרקים 1–2: מלח וניאון · צווארון ברזל',newgame:'משחק חדש',cont:'המשך משחק',lang:'English',sound:'סאונד',on:'פועל',off:'כבוי',
 resume:'חזרה למשחק',map:'מפה',save:'שמירה',menu:'תפריט ראשי',saved:'המשחק נשמר',wasted:'חוסלת',busted:'נעצרת',
 passed:'המשימה הושלמה!',failed:'המשימה נכשלה',restricted:'אזור צבאי סגור! החיילים פותחים באש',spray:'צבע חדש — המשטרה איבדה אותך (200$)',
 nomoney:'צריך 200$ למוסך הצביעה',token:'מטבע נסתר {0}/{1}  +250$',alltokens:'מצאת את כל המטבעות! +5000$',
 chapend:'סוף פרק 1 — הסיפור ימשיך בפרק 2',getback:'חזור ל{0}',lose:'תתחמק מהמשטרה',
 f_dead:'',f_veh:'הרכב הושמד',f_time:'נגמר הזמן',f_dmg:'הרכב ניזוק יותר מדי',tap:'הקש להמשך ▸',
 landscape:'מומלץ לסובב את הטלפון לרוחב',help:'ג׳ויסטיק משמאל לתנועה · 🚗 כניסה/יציאה מרכב · 👊 תקיפה/ירי · 🔄 החלפת נשק',
 newconfirm:'להתחיל משחק חדש? ההתקדמות הקודמת תימחק.',aurum:'מצאת את האורום — מכונית הזהב!',
 secret:'מצאת את האי הסודי. המשחק הזה נבנה בשביל אורל.',duck:'קוואק.',goto_qd:'לך לקוויקדרופ שליחויות (הסמן הצהוב)',
 free:'שוטטות חופשית — חפש מטבעות נסתרים',crates:'אסוף את הארגזים ({0}/{1})',safe:'הבית של ריי — המשחק נשמר',
 tokens:'מטבעות נסתרים',missions:'משימות',money:'כסף',yes:'כן',no:'לא',alarm:'החיילים זיהו אותך!',
 reward:'+{0}$',newweap:'קיבלת: {0}',tip:'טיפ: אפשר להוסיף את המשחק למסך הבית בטלפון, והוא ייפתח במסך מלא כמו אפליקציה',cont_hint:'',stam:'כוח'},
en:{title:'SOLACE BAY',sub:'Chapters 1–2: Salt & Neon · Iron Collar',newgame:'New Game',cont:'Continue',lang:'עברית',sound:'Sound',on:'On',off:'Off',
 resume:'Resume',map:'Map',save:'Save',menu:'Main Menu',saved:'Game saved',wasted:'WASTED',busted:'BUSTED',
 passed:'MISSION PASSED!',failed:'MISSION FAILED',restricted:'Restricted military area! Soldiers open fire',spray:'Fresh paint — the cops lost you ($200)',
 nomoney:'You need $200 for the spray shop',token:'Hidden token {0}/{1}  +$250',alltokens:'All tokens found! +$5000',
 chapend:'End of Chapter 1 — the story continues in Chapter 2',getback:'Get back in the {0}',lose:'Lose the cops',
 f_dead:'',f_veh:'The vehicle was destroyed',f_time:'Out of time',f_dmg:'The car is too damaged',tap:'Tap to continue ▸',
 landscape:'Best played in landscape',help:'Left joystick to move · 🚗 enter/exit vehicle · 👊 attack/shoot · 🔄 switch weapon',
 newconfirm:'Start a new game? Your previous progress will be erased.',aurum:'You found the Aurum — the golden car!',
 secret:'You found the secret island. This game was built for Orel.',duck:'Quack.',goto_qd:'Go to QuickDrop Couriers (yellow marker)',
 free:'Free roam — look for hidden tokens',crates:'Collect the crates ({0}/{1})',safe:"Ray's place — game saved",
 tokens:'Hidden tokens',missions:'Missions',money:'Money',yes:'Yes',no:'No',alarm:'The soldiers spotted you!',
 reward:'+${0}',newweap:'Got: {0}',tip:'Tip: add the game to your phone home screen and it opens full screen like an app',cont_hint:'',stam:'Stamina'}
};
function tr(k){const s=STR[G.lang][k];return s===undefined?k:s;}
function L(o){return o?(o[G.lang]||o.en||''):'';}
function fmt(s,...a){return s.replace(/\{(\d)\}/g,(m,i)=>a[i]);}

G.armor=0;G.ctrl=store.get('sb_ctrl','classic');G.seenNow=false;G.lastSeen=null;G.seenVeh=0;G.punchT=0;
Object.assign(STR.he,{lost:'המשטרה איבדה אותך',shop:'איירון אנד פאודר — חנות נשק',armor:'שכפ"ץ',close:'סגור',ctrl:'נהיגה',classic:'קלאסית',easy:'קלה',bribe:'שוחד שולם — המשטרה שכחה ממך',
 help:'ג׳ויסטיק משמאל לתנועה. ברכב (נהיגה קלאסית): הג׳ויסטיק ימינה/שמאלה מסובב את ההגה, ויש כפתור גז, כפתור בלם/רוורס ובלם יד. כדי לברוח מהמשטרה: צא משדה הראייה שלהם, התחבא מאחורי בניינים או החלף רכב עד שהכוכבים ייעלמו.',
 hide:'השוטרים איבדו קשר עין — התחבא!'});
Object.assign(STR.en,{lost:'The cops lost you',shop:'Iron & Powder — Gun Shop',armor:'Body armor',close:'Close',ctrl:'Driving',classic:'Classic',easy:'Easy',bribe:'Bribe paid — the cops forgot you',
 help:'Left joystick to move. In a vehicle (classic driving): joystick left/right steers, with a gas button, a brake/reverse button and a handbrake. To escape the police: break their line of sight, hide behind buildings or switch cars until the stars fade.',
 hide:'The cops lost sight of you — hide!'});

G.got=[];G.bust=0;G.bustCar=0;G.sayCD=0;G.callCD=0;G.jumpCD=0;G.heli=null;G.fare=null;G.ev=null;G.boom=null;
Object.assign(STR.he,{witness:'עד ראייה התקשר למשטרה!',dragged:'השוטר שלף אותך מהרכב — ברח או תילחם!',fare:'נוסע עלה — קח אותו ליעד (הסמן הצהוב)',fareObj:'מונית: הסע את הנוסע ליעד',farePaid:'נסיעה הושלמה +{0}$',fareLost:'הנסיעה בוטלה',
 snack:'נקניקייה −20$',thanks:'הצלת אותו! +150$',chest:'מצאת תיבת אוצר בספינה הטרופה! +3000$',heli:'מסוק משטרתי בדרך!',heliDown:'הפלת את המסוק! +500$',
 help:'ג׳ויסטיק משמאל לתנועה. כפתור הקפיצה מדלג מעל גדרות ומעלה אותך על מכולות. חץ צהוב ליד בניין מסמן סולם — לחץ על כפתור הרכב כדי לטפס לגג, ושם השוטרים לא רואים אותך. ברכב: ג׳ויסטיק ימינה/שמאלה להגה, כפתורי גז, בלם/רוורס ובלם יד. שוטר שתופס אותך ממלא מד מעצר — זוז, קפוץ או תן לו אגרוף כדי להשתחרר.'});
Object.assign(STR.en,{witness:'A witness called the police!',dragged:'The cop dragged you out — run or fight!',fare:'Passenger on board — drive to the yellow marker',fareObj:'Taxi: take the passenger to the destination',farePaid:'Fare complete +${0}',fareLost:'Fare cancelled',
 snack:'Hot dog −$20',thanks:'You saved him! +$150',chest:'You found the shipwreck treasure! +$3000',heli:'Police helicopter inbound!',heliDown:'Helicopter down! +$500',
 help:'Left joystick to move. The jump button hops fences and gets you onto containers. A yellow arrow by a building marks a ladder — press the car button to climb to the roof, where cops cannot see you. In a vehicle: joystick left/right steers, with gas, brake/reverse and handbrake buttons. A cop who grabs you fills an arrest meter — move, jump or punch him to break free.'});

G.heat=0;G.rep=0;G.outfit='std';G.outfits=['std'];G.meds=0;G.radio=store.get('sb_radio',0);G.gators=[];G.flam=[];G.talk=null;G.shop=null;
Object.assign(STR.he,{wearing:'לבוש כעת',wear:'בבעלותך — לבש',snackI:'חטיף',medkit:'ערכת עזרה ראשונה',needgun:'צריך נשק',robbing:'שוד בעיצומו...',robHint:'המוכר ממלא את התיק. המצלמות כבר קלטו אותך.',robAbort:'ברח עכשיו',
 nofuel:'נגמר הדלק! חפש תחנת דלק או רכב אחר',fueling:'מתדלק ומתקן את הרכב...',locked:'החנות נעלה את הדלתות — המשטרה מחפשת אותך',closedRob:'סגור זמנית אחרי השוד',newlook:'החלפת בגדים — המשטרה לא מזהה אותך יותר',
 t_greet:'ברך לשלום',t_taunt:'התגרה',t_rob:'שדוד',radioOff:'רדיו כבוי',rep:'מוניטין',medUsed:'ערכת עזרה ראשונה +70',free:'שוטטות חופשית — חנויות, מוניות, שוד, מטבעות נסתרים'});
Object.assign(STR.en,{wearing:'Wearing',wear:'Owned — wear',snackI:'Snack',medkit:'First-aid kit',needgun:'need a weapon',robbing:'Robbery in progress...',robHint:'The clerk is filling the bag. The cameras already have you.',robAbort:'Run now',
 nofuel:'Out of fuel! Find a gas station or another car',fueling:'Refueling and repairing...',locked:'The store locked its doors — the police are looking for you',closedRob:'Temporarily closed after the robbery',newlook:'New outfit — the police no longer recognize you',
 t_greet:'Greet',t_taunt:'Taunt',t_rob:'Rob',radioOff:'Radio off',rep:'Reputation',medUsed:'First-aid kit +70',free:'Free roam — shops, taxi fares, robberies, hidden tokens'});

G.stats={falls:0,sunk:0,robs:0};G.way=null;G.rot=store.get('sb_rot',false);G.ui=1;G.nearLad=null;G.rob=null;G.spot=null;
Object.assign(STR.he,{shopHint:'גש לעיגול ולחץ על כפתור הפעולה. נשק שלוף + תקיפה = שוד',robFail:'השוד נכשל — ברחת מוקדם מדי',robNear:'תתקרב לדלפק',robGrab:'קח את השקית מהדלפק וברח!',noexit:'אי אפשר לצאת באוויר!',
 ladHint:'סולם! המשך ללכת לכיוון הקיר, או לחץ על כפתור הסולם, כדי לטפס',mapHint:'הקש על המפה כדי לסמן יעד · הקש שוב על היעד כדי לבטל',rotOn:'סובב את המסך לרוחב',rotOff:'בטל סיבוב מסך',duckHorn:'קיבלת: צופר ברווז לכל הרכבים',granBag:'סבתא שכחה שקית במושב האחורי: +2000$',
 spin:'סובב',slotWin:'זכית ב-{0}$!',slotLose:'לא הפעם.',slots:'מכונת מזל',wayOn:'יעד סומן',robHint:'המוכר ממלא את השקית — הישאר קרוב לדלפק!',
 help:'ג׳ויסטיק משמאל לתנועה. קפיצה מדלגת מעל גדרות. עיגול צהוב עם סולם ליד בניין: לך לכיוון הקיר כדי לטפס לגג. לחנויות נכנסים בהליכה דרך הדלת, ובפנים ניגשים לעיגולים המסומנים. לחיצה על המפה הקטנה פותחת את המפה המלאה. ברכב: ג׳ויסטיק ימינה/שמאלה להגה, כפתורי גז, בלם ובלם יד. מטוס ממריא במהירות מלאה ונוחת כשמאטים.'});
Object.assign(STR.en,{shopHint:'step on a circle and press the action button. Gun drawn + attack = robbery',robFail:'Robbery failed — you left too early',robNear:'Get closer to the counter',robGrab:'grab the bag from the counter and run!',noexit:'You cannot bail out mid-air!',
 ladHint:'Ladder! Keep walking toward the wall, or press the ladder button, to climb',mapHint:'Tap the map to set a waypoint · tap the waypoint again to clear it',rotOn:'Rotate screen to landscape',rotOff:'Undo screen rotation',duckHorn:'Unlocked: duck horn for every vehicle',granBag:'Grandma left a bag on the back seat: +$2000',
 spin:'Spin',slotWin:'You won ${0}!',slotLose:'Not this time.',slots:'Slot machine',wayOn:'Waypoint set',robHint:'The clerk is filling the bag — stay near the counter!',
 help:'Left joystick to move. Jump hops fences. A yellow ladder circle by a building: walk toward the wall to climb to the roof. Enter shops by walking through the door, then step on the marked circles inside. Tap the minimap to open the full map. In a vehicle: joystick left/right steers, with gas, brake and handbrake buttons. A plane takes off at full speed and lands when you slow down.'});
