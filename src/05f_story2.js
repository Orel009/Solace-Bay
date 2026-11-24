// ---------- chapter 2, side missions, extra step types ----------
Object.assign(SPK,{pond:{he:'פרופסור פונד',en:'Professor Pond',c:'#ffe066',p:330},gus:{he:'גאס',en:'Gus',c:'#ff9f6b',p:150},krys:{he:'קריסטל',en:'Krystal',c:'#ff8fd6',p:380},gran:{he:'גברת אברמוב',en:'Mrs. Abramov',c:'#d9c2ff',p:290},
 nud:{he:'השוטר נודניק',en:'Officer Nudnik',c:'#8fb4ff',p:160},crane:{he:'קולונל קריין',en:'Colonel Crane',c:'#b8c48a',p:95},lev:{he:'קפטן לב',en:'Captain Lev',c:'#9ad7ff',p:130}});
const walkable=t=>t===TL.WALK||t===TL.CONC||t===TL.SAND||t===TL.GRASS||t===TL.LOT||t===TL.DOCK||t===TL.ROAD;
let SIDE=[];
function sideAvail(){return SIDE.filter(m=>!G.done.includes(m.id)&&(!m.req||G.done.includes(m.req)));}
function buildMissions2(){const shop=k=>SHOPS.find(s=>s.k===k),bank=shop('bank'),cas=shop('casino'),V0=POI.vendors[0];
 POI.bankSide={x:bank.sx+80,y:bank.sy};POI.granCar={x:bank.sx+80,y:bank.sy+72,a:0};POI.casino={x:cas.sx,y:cas.sy+60};POI.gusBike={x:V0.x+120,y:V0.y,a:0};
 POI.pondStart={x:26.6*T,y:69.6*T};POI.krys={x:110.5*T,y:76*T};POI.nud={x:POI.cops.x+80,y:POI.cops.y};POI.m8start={x:100*T,y:61.5*T};
 MISSIONS.find(m=>m.id==='m3').steps.slice(-1)[0].end=false;
 MISSIONS.push(
 {id:'m4',name:R2('ניירת','Paperwork'),giver:'salt',col:'#5fe0d0',ic:'M',start:POI.tide,hint:R2('פרק 2: מאמא סולט מחכה במחסן בנמל','Chapter 2: Mama Salt is waiting at the harbor warehouse'),steps:[
  {t:'talk',lines:[l('salt','לרובים האלה יש מספרים סידוריים. פורט קולר. אני רוצה לראות מה עוד הם שולחים.','Those rifles have serial numbers. Fort Collar. I want to see what else they ship.'),
   l('salt','יש משאית צבאית שחונה בתוך הבסיס. תביא אותה למחסן שלי.','There is an army truck parked inside the base. Bring it to my warehouse.'),l('ray','את רוצה שאגנוב מהצבא.','You want me to steal from the army.'),
   l('salt','אני רוצה שתשאיל. בקול רם, אם צריך. יש גשר עץ מהחוף, או שתקפוץ מעל הגדר.','I want you to borrow. Loudly, if you must. There is a causeway from the beach, or hop the fence.')]},
  {t:'getveh',key:'truck',type:'army',at:'truckM',col:'#4b5320',obj:R2('גנוב את המשאית הצבאית מפורט קולר','Steal the army truck from Fort Collar')},{t:'wanted',n:3},
  {t:'goto',at:'tide',inVeh:'truck',r:110,stop:1,obj:R2('הבא את המשאית למחסן של הגאות','Bring the truck to the Tide warehouse')},
  {t:'talk',lines:[l('salt','ארגזים. עם מדבקות של קוויקדרופ שליחויות.','Crates. With QuickDrop Couriers stickers.'),l('ray','בני אמר לי אף פעם לא לפתוח אותם.','Benny told me never to open them.'),l('salt','איש חכם. שליח טיפש.','Smart man. Stupid courier.')]},
  {t:'reward',money:2500}]},
 {id:'m5',name:R2('דיפלומטיית ניאון','Neon Diplomacy'),giver:'vex',col:'#c59bff',ic:'V',start:POI.garage,hint:R2('וקס רוצה לדבר. המוסך של הקדושים (הסמן הסגול)','Vex wants a word. The Saints garage (purple marker)'),steps:[
  {t:'talk',lines:[l('vex','למאמא סולט יש רובים של הצבא. לי יש משהו טוב יותר: נימוסים.','Mama Salt has army rifles. I have something better: manners.'),l('vex','עוגה. שלוש קומות. תמסור אותה למחסן שלה, עם ברכותיי.','A cake. Three tiers. Deliver it to her warehouse, with my compliments.'),
   l('ray','עוגה.','A cake.'),l('vex','סע בעדינות. בעדינות רבה.','Drive gently. Very gently.'),l('dice','ומה שלא יקרה, אל תענה אם היא מצלצלת.','And whatever happens, do not answer if it rings.'),l('ray','...עוגות לא מצלצלות.','...Cakes do not ring.')]},
  {t:'getveh',key:'van',type:'van',at:'cakevan',col:'#f7c6d9',obj:R2('היכנס לוואן של הקונדיטוריה','Get in the bakery van')},
  {t:'goto',at:'tide',inVeh:'van',r:100,minHp:0.7,stop:1,obj:R2('מסור את העוגה למחסן של הגאות — בלי להתנגש!','Deliver the cake to the Tide warehouse — do not crash!')},
  {t:'talk',lines:[l('ray','משלוח בשביל— למה זה מתקתק?','Delivery for— why is it ticking?'),l('dice','(הודעה) אמרתי לך לא לענות. רוץ.','(text) I told you not to answer. Run.')]},
  {t:'away',veh:'van',dist:330,fuse:9,obj:R2('ברח מהוואן!','Get away from the van!')},
  {t:'talk',lines:[l('salt','הוא שלח לי עוגה מתפוצצת. אפילו לא עוגה טובה.','He sent me an exploding cake. Not even a good cake.'),l('salt','תגיד לוקס שהמלחמה התחילה. ותגיד לו שאני מעדיפה שוקולד.','Tell Vex the war is on. And tell him I prefer chocolate.')]},
  {t:'reward',money:2000}]},
 {id:'m6',name:R2('החזר לשולח','Return to Sender'),giver:'benny',col:'#ffcf5a',ic:'B',start:POI.office,hint:R2('הגיע הזמן לשאול את בני כמה שאלות (הסמן הצהוב)','Time to ask Benny some questions (yellow marker)'),steps:[
  {t:'talk',lines:[l('benny','ריי! שמעתי שפתחת קופסה.','Ray! I heard you opened a box.'),l('ray','פתחו בשבילי. רובים של הצבא, בני.','It was opened for me. Army rifles, Benny.'),l('benny','אני רק מזיז קופסאות! מי שמשלם זה קולונל קריין מפורט קולר.','I just move boxes! The one paying is Colonel Crane from Fort Collar.'),
   l('benny','יש חבילה אחרונה. למגדלור. קח את הסירה. אחרי זה אני פורש לדוג.','One last package. To the lighthouse. Take the boat. After that I retire to go fishing.'),l('ray','אתה שונא דגים.','You hate fish.'),l('benny','אני שונא יותר את קריין.','I hate Crane more.')]},
  {t:'getveh',key:'boat',type:'speedboat',at:'speedboat',col:'#ecf0f1',obj:R2('קח את הסירה המהירה בנמל','Take the speedboat at the harbor')},
  {t:'goto',at:'lhDock',inVeh:'boat',r:120,stop:1,obj:R2('שוט אל אי המגדלור (עוברים מתחת לגשרים)','Sail to the lighthouse island (boats pass under the bridges)')},
  {t:'talk',lines:[l('ray','אין פה אף אחד. רק... חיילים. זו מלכודת.','Nobody here. Just... soldiers. It is a trap.'),l('ray','ובחבילה יש רובה. תודה, בני. באמת.','And the package has a rifle in it. Thanks, Benny. Really.')]},
  {t:'give',weapon:['rifle',120]},{t:'kill',at:'lhLand',n:5,ptype:'soldier',rad:120,obj:R2('חסל את החיילים ({0}/{1})','Take out the soldiers ({0}/{1})')},
  {t:'pick',pts:()=>[[POI.lhLand.x,POI.lhLand.y]],obj:R2('קח את הפנקס של הקולונל ({0}/{1})','Grab the Colonel\'s ledger ({0}/{1})')},
  {t:'talk',lines:[l('ray','"שלם לקדושים. שלם לגאות. כשהעיר תישרף — הנמל שלנו."','"Pay the Saints. Pay the Tide. When the city burns — the port is ours."'),l('ray','הוא מוכר לשני הצדדים. ומחכה שיהרגו אחד את השני.','He sells to both sides. And waits for them to kill each other.')]},
  {t:'reward',money:3000}]},
 {id:'m7',name:R2('אורות נמוכים','Low Lights'),giver:'dice',col:'#ff7ad9',ic:'D',start:POI.club,hint:R2('הראה את הפנקס לדייס ב"חדר הסגול"','Show the ledger to Dice at the Violet Room'),steps:[
  {t:'talk',lines:[l('dice','וקס ומאמא סולט באותו חדר. בפעם הקודמת זה נגמר בשלושה אמבולנסים.','Vex and Mama Salt in one room. Last time that ended with three ambulances.'),l('salt','הקולונל שיחק בשנינו.','The Colonel played us both.'),l('vex','אז נשחק בו. יש לו שלוש משאיות אספקה בעיר.','Then we play him. He has three supply trucks in the city.'),
   l('salt','ויש לו טנק שהוא לא שומר מספיק טוב.','And a tank he does not guard well enough.'),l('dice','אני אוהב לאן שזה הולך.','I like where this is going.'),l('ray','למה תמיד אני?','Why is it always me?'),l('vex','כי אתה שקט. והטנק רועש בשביל שנינו.','Because you are quiet. And the tank is loud enough for both of us.')]},
  {t:'getveh',key:'tank',type:'tank',at:'tankM',col:'#556b2f',obj:R2('גנוב את הטנק מפורט קולר','Steal the tank from Fort Collar')},
  {t:'destroy',type:'army',col:'#3f4a1c',pts:[[40,61.5,0],[66,101.5,0],[94,35.5,0]],obj:R2('השמד את משאיות האספקה ({0}/{1})','Destroy the supply trucks ({0}/{1})')},
  {t:'talk',lines:[l('dice','שלוש מתוך שלוש. העירייה תשלח לך חשבון על האספלט.','Three for three. City hall will bill you for the asphalt.'),l('salt','עכשיו הוא יודע שאנחנו יודעים. הוא ינסה לברוח.','Now he knows that we know. He will try to run.')]},
  {t:'reward',money:4000}]},
 {id:'m8',name:R2('צווארון ברזל','Iron Collar'),giver:'salt',col:'#5fe0d0',ic:'M',start:POI.tide,hint:R2('סיום פרק 2: מאמא סולט במחסן בנמל','Chapter 2 finale: Mama Salt at the harbor warehouse'),steps:[
  {t:'talk',lines:[l('salt','הקולונל בורח. משאית משוריינת, בדרך לנמל התעופה.','The Colonel is running. Armored truck, headed for the airport.'),l('salt','אם הוא עולה על מטוס, הוא חוזר עם צבא אמיתי.','If he boards a plane, he comes back with a real army.'),l('ray','ואם הוא לא עולה?','And if he does not board?'),l('salt','אז העיר נשארת שלנו. ושלך, קצת.','Then the city stays ours. And yours, a little.')]},
  {t:'hostiles',n:2,type:'army',faction:'army',col:'#3f4a1c'},
  {t:'destroy',type:'army',col:'#20260f',hp:1100,move:250,timer:260,pts:()=>[[POI.m8start.x/T,POI.m8start.y/T,0]],obj:R2('עצור את המשאית של הקולונל ({0}/{1})','Stop the Colonel\'s truck ({0}/{1})')},
  {t:'talk',lines:[l('crane','אתה חושב שזה נגמר, שליח? אני רק הספק. הקונה שלי עוד לא הציג את עצמו.','You think this is over, courier? I am only the supplier. My buyer has not introduced himself yet.'),l('salt','תן לו לדבר. לרוחות אין צבא.','Let him talk. Ghosts have no army.'),
   l('ray','מי הקונה?','Who is the buyer?'),l('salt','זה כבר פרק אחר, מתוק. הלילה — אתה שותה על חשבוני.','That is another chapter, sweetheart. Tonight — you drink on me.')]},
  {t:'reward',money:8000,endMsg:R2('סוף פרק 2 — סולס ביי שלך. פרק 3 בדרך.','End of Chapter 2 — Solace Bay is yours. Chapter 3 is coming.')}]});
 SIDE=[
 {id:'s1',name:R2('מבצע קוואק','Operation Quack'),giver:'pond',start:POI.pondStart,look:'elder',steps:[
  {t:'talk',lines:[l('pond','אתה! אתה נראה כמו אדם שלא שואל שאלות.','You! You look like a man who asks no questions.'),l('ray','זה ממש כתוב עליי.','It is practically written on me.'),l('pond','הברווז הענק הטיל חמש ביצים. השחפים גנבו אותן. אני מדען. אל תשאל של מה.','The giant duck laid five eggs. The gulls stole them. I am a scientist. Do not ask of what.'),
   l('pond','הן על הגגות. חפש בניינים עם סולם. מדע דורש קורבנות, בעיקר שלך.','They are on the rooftops. Look for buildings with ladders. Science demands sacrifice, mostly yours.')]},
  {t:'pick',pts:()=>{const c=POI.duck,bs=[...new Set(LADS.filter(q=>!q.b.court).map(q=>q.b))].map(b=>[(b.x+b.w/2)*T,(b.y+b.h/2)*T,b.ht]).sort((a,b)=>hyp(a[0]-c.x,a[1]-c.y)-hyp(b[0]-c.x,b[1]-c.y));return bs.slice(0,5);},obj:R2('אסוף ביצי ברווז מהגגות ({0}/{1})','Collect duck eggs from the rooftops ({0}/{1})')},
  {t:'goto',at:'pondStart',r:60,obj:R2('חזור לפרופסור פונד בפארק','Return to Professor Pond in the park')},
  {t:'talk',lines:[l('pond','מצוין! עכשיו אוכל לדגור עליהן בעצמי.','Excellent! Now I can incubate them myself.'),l('ray','...מה?','...What?'),l('pond','מדע. קח, התקנתי לך משהו ברכב.','Science. Here, I installed something in your car.')]},
  {t:'reward',money:600,fn:()=>{G.duckHorn=1;setTimeout(()=>toast(tr('duckHorn'),4),1800);}}]},
 {id:'s2',name:R2('נקניקייה בהולה','Hot Dog Emergency'),giver:'gus',start:{x:V0.x+78,y:V0.y},steps:[
  {t:'talk',lines:[l('gus','אחי, יש לי ארבע הזמנות ואני לא יכול לעזוב את הדוכן. נקניקייה קרה זו טרגדיה.','Buddy, I have four orders and I cannot leave the stand. A cold hot dog is a tragedy.'),l('ray','אני שליח, לא מלצר.','I am a courier, not a waiter.'),l('gus','שליח זה מלצר עם דלק. קח את האופנוע.','A courier is a waiter with fuel. Take the bike.')]},
  {t:'getveh',key:'bike',type:'bike',at:'gusBike',col:'#c0392b',obj:R2('עלה על האופנוע של גאס','Get on Gus\'s bike')},
  {t:'pick',timer:170,r:60,pts:()=>[[POI.club.x,POI.club.y],[bank.sx,bank.sy],[POI.spray.x,POI.spray.y],[POI.safe.x,POI.safe.y]],obj:R2('מסור נקניקיות חמות ({0}/{1})','Deliver hot dogs while hot ({0}/{1})')},
  {t:'talk',lines:[l('gus','ארבע מתוך ארבע, חמות! אתה גיבור. הנה טיפ. וחרדל.','Four for four, still hot! You are a hero. Here is a tip. And mustard.')]},
  {t:'reward',money:500,fn:()=>{G.meds=Math.min(3,G.meds+1);}}]},
 {id:'s3',name:R2('משפיענית','Influencer'),giver:'krys',start:POI.krys,look:'tourist',req:'m1',steps:[
  {t:'talk',lines:[l('krys','אומייגאד, אתה נראה מסוכן. מושלם. אני צריכה תוכן.','Oh my god, you look dangerous. Perfect. I need content.'),l('ray','אני צריך שקט.','I need quiet.'),l('krys','שלושה קליפים: קפיצה מגג, מכונית לתוך הים, ומרדף משטרתי. הקהל שלי מת על טראומה.','Three clips: a rooftop jump, a car into the sea, and a police chase. My audience loves trauma.')]},
  {t:'cond',init:M=>{M.c0=G.stats.falls;},f:M=>G.stats.falls>M.c0,obj:R2('קליפ 1: קפוץ מגג של בניין','Clip 1: jump off a building roof')},
  {t:'cond',init:M=>{M.c0=G.stats.sunk;},f:M=>G.stats.sunk>M.c0,obj:R2('קליפ 2: הכנס מכונית לים (וצא בזמן!)','Clip 2: drive a car into the sea (and get out!)')},
  {t:'cond',f:()=>G.wanted>=2,obj:R2('קליפ 3: השג 2 כוכבי מבוקש','Clip 3: get a 2-star wanted level')},{t:'lose'},
  {t:'goto',at:'krys',r:70,obj:R2('חזור לקריסטל בחוף','Return to Krystal at the beach')},
  {t:'talk',lines:[l('krys','מיליון צפיות! רובן בוטים, אבל עדיין.','A million views! Mostly bots, but still.'),l('ray','אני רוצה אחוזים.','I want a cut.'),l('krys','קיבלת חשיפה. וגם קצת כסף, כי אתה מפחיד.','You got exposure. And some money, because you scare me.')]},
  {t:'reward',money:800,fn:()=>{G.rep=Math.min(50,G.rep+5);}}]},
 {id:'s4',name:R2('הבריחה של סבתא','Grandma\'s Getaway'),giver:'gran',start:POI.bankSide,look:'elder',req:'m2',steps:[
  {t:'talk',lines:[l('gran','צעיר! יש לך רכב? הרגע שדדתי את הבנק.','Young man! Do you have a car? I just robbed the bank.'),l('ray','את... מה?','You... what?'),l('gran','עם מסרגה. הפקיד התעלף. הפנסיה לא מספיקה, חמוד.','With a knitting needle. The teller fainted. The pension is not enough, dear.'),l('gran','תסיע אותי לקזינו באיסט סייד. יש לי תחושה טובה.','Drive me to the casino on the east side. I have a good feeling.')]},
  {t:'wanted',n:3},{t:'getveh',key:'car',type:'sedan',at:'granCar',col:'#b7950b',obj:R2('היכנס לרכב עם סבתא','Get in the car with Grandma')},
  {t:'goto',at:'casino',inVeh:'car',r:120,obj:R2('סע לקזינו לאקי טייד (מעבר לגשר)','Drive to the Lucky Tide Casino (across the bridge)')},{t:'lose'},
  {t:'talk',lines:[l('gran','נהיגה נפלאה. הנה חמישים דולר. אל תבזבז הכול במקום אחד.','Lovely driving. Here is fifty dollars. Do not spend it all in one place.'),l('ray','שדדת בנק.','You robbed a bank.'),l('gran','וזה הטיפ שלך. שלום!','And that is your tip. Bye!')]},
  {t:'reward',money:50,fn:()=>{setTimeout(()=>{G.money+=2000;toast(tr('granBag'),5);sfx.blip();},3500);}}]},
 {id:'s5',name:R2('פיקוח חניה','Parking Enforcement'),giver:'nud',start:POI.nud,look:'biz',steps:[
  {t:'talk',lines:[l('nud','אזרח! שלוש מכוניות חונות על המדרכה. הגרר בשביתה.','Citizen! Three cars are parked on the sidewalk. The tow truck is on strike.'),l('ray','ואתה רוצה ש...?','And you want me to...?'),l('nud','שהן ייעלמו. אני לא אראה כלום. אני אפילו אסתובב.','Make them disappear. I will see nothing. I will even turn around.')]},
  {t:'destroy',type:'compact',timer:150,pts:()=>[[(POI.cops.x-170)/T,POI.cops.y/T,0],[(POI.cops.x+260)/T,POI.cops.y/T,0],[POI.cops.x/T,(POI.cops.y-250)/T,Math.PI/2]],obj:R2('העלם את המכוניות ({0}/{1})','Make the cars disappear ({0}/{1})')},
  {t:'talk',lines:[l('nud','איזה מכוניות? בדיוק. הנה שובר לסופגנייה.','What cars? Exactly. Here is a doughnut voucher.')]},
  {t:'reward',money:700,fn:()=>clearWanted()}]},
 {id:'s6',name:R2('שיעור טיסה','Flying Lesson'),giver:'lev',start:POI.airport,look:'biz',steps:[
  {t:'talk',lines:[l('lev','רישיון? בסולס ביי? חמוד. תעלה, תלחץ על הגז, ואל תפגע במגדל. הוא חדש.','A license? In Solace Bay? Cute. Hop in, hit the gas, and do not hit the tower. It is new.'),l('ray','איך נוחתים?','How do you land?'),l('lev','מאטים. או שלא. שתי הדרכים עובדות פעם אחת.','You slow down. Or you do not. Both ways work once.')]},
  {t:'getveh',key:'plane',type:'plane',at:'planeM',col:'#f4f6f7',obj:R2('היכנס למטוס','Get in the plane')},
  {t:'pick',air:1,pts:()=>[[POI.pier.x,POI.pier.y],[cas.sx,cas.sy],[140*T,61*T],[POI.lh.x,POI.lh.y],[POI.club.x,POI.club.y]],obj:R2('טוס דרך הטבעות ({0}/{1}) — המריא מעל 330 קמ"ש','Fly through the rings ({0}/{1}) — take off above full speed')},
  {t:'cond',f:M=>{const v=M.key.plane;return !(v.alt>0)&&hyp(v.x-POI.airport.x,v.y-POI.airport.y)<1500&&Math.abs(v.speed)<60;},obj:R2('נחת בנמל התעופה ועצור','Land at the airport and stop')},
  {t:'talk',lines:[l('lev','נחתת! רוב התלמידים שלי... טוב, לא חשוב.','You landed! Most of my students... well, never mind.')]},
  {t:'reward',money:1500}]}];
 POI.planeM={x:POI.planes[0].x,y:POI.planes[0].y-90,a:0};}
function stepStart(M,s){M.rings=null;M.target=null;switch(s.t){
  case'give':giveWeapon(s.weapon[0],s.weapon[1]);G.weapon=s.weapon[0];toast(fmt(tr('newweap'),L(WEAP[s.weapon[0]])));nextStep();break;
  case'away':setObj(L(s.obj));M.timer=s.fuse;break;
  case'lose':setObj(tr('lose'));break;
  case'cond':if(s.init)s.init(M);setObj(L(s.obj));break;
  case'kill':{const p0=POI[s.at];M.tg=[];for(let k=0;k<s.n;k++){let x,y,n=0;do{const a=rr(0,TAU),r=rr(30,s.rad||130);x=p0.x+Math.cos(a)*r;y=p0.y+Math.sin(a)*r;}while(++n<25&&!walkable(tileAt(x,y)));
      M.tg.push(mkPed(s.ptype||'soldier',x,y,{faction:s.faction,hostile:true,persist:true,mission:true}));}break;}
  case'destroy':{M.tg=[];const pts=typeof s.pts==='function'?s.pts():s.pts;for(const q of pts){const v=mkVeh(s.type,q[0]*T,q[1]*T,q[2]||0,s.col);v.persist=true;v.fuel=1;if(s.hp)v.hp=s.hp;M.tg.push(v);M.ents.push(v);
      if(s.move){v.driver='soldier';trafficFromHere(v);v.ai.cruise=s.move;}}break;}
  case'pick':{const pts=typeof s.pts==='function'?s.pts():s.pts;M.pts=pts.map(q=>({x:q[0],y:q[1],roof:q[2]||0,done:false}));break;}
  default:nextStep();}}
function stepUpdate(M,s,dt,P,px,py){const near=(list)=>{let b=list[0];for(const o of list)if(hyp(o.x-px,o.y-py)<hyp(b.x-px,b.y-py))b=o;return b;};
  switch(s.t){
  case'away':{const v=M.key[s.veh];if(!v){nextStep();return true;}if(hyp(px-v.x,py-v.y)>s.dist||M.timer<0.35){delete M.key[s.veh];v.persist=false;v.mission=false;explodeVeh(v,null);if(G.mission===M&&!P.dead)nextStep();}return true;}
  case'lose':if(G.wanted===0)nextStep();return true;
  case'cond':if(s.f(M))nextStep();return true;
  case'kill':{const al=M.tg.filter(p=>!p.dead);if(!al.length){nextStep();return true;}const b=near(al);M.target={x:b.x,y:b.y};M.rings=al.map(p=>({x:p.x,y:p.y,r:18,c:'#ff5050'}));setObj(fmt(L(s.obj),s.n-al.length,s.n));return true;}
  case'destroy':{const al=M.tg.filter(v=>!v.dead&&!v.sunk&&!v.remove);if(!al.length){nextStep();return true;}const b=near(al);M.target={x:b.x,y:b.y};M.rings=al.map(v=>({x:v.x,y:v.y,r:50,c:'#ff5050'}));setObj(fmt(L(s.obj),M.tg.length-al.length,M.tg.length));return true;}
  case'pick':{let left=[];for(const q of M.pts){if(q.done)continue;const d=hyp(q.x-px,q.y-py),ok=s.air?(P.veh&&P.veh.alt>0.5&&d<130):q.roof?(!!P.roof&&!P.veh&&d<52):d<(s.r||48);if(ok){q.done=true;sfx.blip();part('flash',q.x,q.y,0,0,0.2,20);}else left.push(q);}
    if(!left.length){nextStep();return true;}const b=near(left);M.target={x:b.x,y:b.y};M.rings=left.map(q=>({x:q.x,y:q.y,r:s.air?100:26,c:'#ffe14d',h:q.roof}));setObj(fmt(L(s.obj),M.pts.length-left.length,M.pts.length));return true;}}
  return false;}
Object.assign(FEED,{jack:[R2('@lucky_tide: מישהו הרגע רוקן את המכונה. הבית בוכה.','@lucky_tide: Someone just cleaned out a slot machine. The house is crying.')],
 amb:[R2('@bayfeed: מזג האוויר היום: חם. מחר: חם. מחרתיים: ראו מחר.','@bayfeed: Weather today: hot. Tomorrow: hot. Day after: see tomorrow.'),R2('@duck_truther: הברווז בפארק זז בלילה. אני יודע מה ראיתי.','@duck_truther: The park duck moves at night. I know what I saw.'),
  R2('@cityhall_sb: הרמזורים עובדים כמתוכנן. הנהגים — לא.','@cityhall_sb: Traffic lights work as intended. Drivers do not.'),R2('@gus_dogs: נקניקייה קונים בדוכן, לא שודדים. תודה.','@gus_dogs: You buy hot dogs at the stand, you do not rob them. Thanks.'),
  R2('@marina_mike: מי שם פלמינגו על הגג שלי?','@marina_mike: Who put a flamingo on my roof?'),R2('@scanner_sb: דיווח על אדם שקופץ מעל גדרות "בשביל הכיף".','@scanner_sb: Report of a man hopping fences "for fun".'),
  R2('@solace_news: מחקר: 9 מתוך 10 תושבים ראו היום רכב נכנס לים.','@solace_news: Study: 9 in 10 residents saw a car drive into the sea today.'),R2('@nudnik_pd: תזכורת — חניה על מדרכה היא פשע. לכאורה.','@nudnik_pd: Reminder — sidewalk parking is a crime. Allegedly.')]});
CHAT.push({he:'שילמתי 9 דולר על קפה. תשעה.',en:'I paid nine dollars for a coffee. Nine.'},{he:'אומרים שיש מישהי ששדדה בנק עם מסרגה.',en:'They say someone robbed a bank with a knitting needle.'},{he:'אני לא גר פה. אני רק תקוע בפקק כבר שנתיים.',en:'I do not live here. I have just been stuck in traffic for two years.'},
 {he:'הגשר לאיסטגייט? הכי יפה בעיר. גם הכי פקוק.',en:'The bridge to Eastgate? Prettiest in town. Also the most jammed.'},{he:'ראית את הגלגל הענק במזח? אני מפחד מגבהים.',en:'Seen the big wheel on the pier? I am afraid of heights.'},{he:'בקזינו הפסדתי את החולצה. פשוטו כמשמעו.',en:'I lost my shirt at the casino. Literally.'},
 {he:'מישהו עף אתמול מטוס מתחת לגשר. אגדה.',en:'Somebody flew a plane under the bridge yesterday. Legend.'},{he:'הכלב שלי נובח רק על שוטרים. גאה בו.',en:'My dog only barks at cops. Proud of him.'},{he:'אל תאכל מהדוכן ליד בית החולים. זה לא במקרה שהוא שם.',en:'Do not eat at the stand by the hospital. It is not there by accident.'});
