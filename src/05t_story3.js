// ---------- v8: Chapter 3 (Coral Key), more side missions, clear story/side labels ----------
Object.assign(SPK,{vale:{he:'אדריאן וייל',en:'Adrian Vale',c:'#c9a227',p:150},pino:{he:'פינו',en:'Pino',c:'#ff9f43',p:190},mime:{he:'המים',en:'The Mime',c:'#f4f6f7',p:200},hans:{he:'הנס',en:'Hans',c:'#7fd4ff',p:230},darren:{he:'דארן',en:'Darren',c:'#b8e600',p:180},chip:{he:'צ׳יפ',en:'Chip',c:'#9bdc78',p:160},otto:{he:'אוטו',en:'Otto',c:'#d8dee6',p:120}});
Object.assign(STR.he,{tagStory:'סיפור',tagSide:'משימת צד',tagFree:'חופשי',passStory:'משימת סיפור הושלמה!',passSide:'משימת צד הושלמה!',chap3:'פרק 3',startStory:'משימת סיפור',startSide:'משימת צד'});
Object.assign(STR.en,{tagStory:'STORY',tagSide:'SIDE JOB',tagFree:'FREE ROAM',passStory:'Story mission passed!',passSide:'Side job done!',chap3:'Chapter 3',startStory:'Story mission',startSide:'Side job'});
function nearWater(x,y){let best=null,bd=1e9;for(let dy=-12;dy<=12;dy++)for(let dx=-12;dx<=12;dx++){const tx=Math.floor(x/T)+dx,ty=Math.floor(y/T)+dy;if(tget(tx,ty)!==0||tget(tx+1,ty)!==0||tget(tx,ty+1)!==0||tget(tx-1,ty)!==0)continue;const d=dx*dx+dy*dy;if(d<bd){bd=d;best={x:(tx+0.5)*T,y:(ty+0.5)*T,a:0};}}return best||{x,y,a:0};}
function nearWalk(x,y){let best=null,bd=1e9;for(let dy=-5;dy<=5;dy++)for(let dx=-5;dx<=5;dx++){const tx=Math.floor(x/T)+dx,ty=Math.floor(y/T)+dy,t=tget(tx,ty);if(t!==TL.WALK&&t!==TL.CONC&&t!==TL.SAND&&t!==TL.GRASS)continue;const d=dx*dx+dy*dy;if(d<bd){bd=d;best={x:(tx+0.5)*T,y:(ty+0.5)*T};}}return best||{x,y};}
function buildMissions4(){const cp=(i,j)=>{const p=nodePos(i,j);return[p.x,p.y];};
 POI.dealM={x:POI.dealer.x,y:POI.dealer.y+74,a:0};POI.padM={x:POI.pad.x+96,y:POI.pad.y,a:-Math.PI/2};
 POI.haloDoor=nearWalk(POI.halo.x,POI.halo.y+60);POI.galaCar=nearWalk(POI.safe.x+140,POI.safe.y+40);POI.truckStart={x:48.5*T,y:170*T};
 POI.pinoStart=nearWalk(POI.pier.x-220,POI.pier.y);POI.pinoBoat=nearWater(POI.pier.x-260,POI.pier.y+120);POI.mimeStart=nearWalk(PERF[0]?PERF[0].x+110:POI.duck.x,PERF[0]?PERF[0].y+40:POI.duck.y);
 POI.hans=nearWalk(POI.pier.x+60,POI.pier.y+140);POI.darren=nearWalk(nodePos(1,6).x+90,nodePos(1,6).y+90);POI.chip=nearWalk(POI.golf.x-420,POI.golf.y-560);POI.chipCart=nearWalk(POI.chip.x+70,POI.chip.y);POI.otto=nearWalk(STATIONS[0].gx+80,STATIONS[0].gy);
 POI.vanStart={x:nodePos(2,2).x,y:nodePos(2,2).y};
 MISSIONS.push(
 {id:'m9',name:R2('הקונה','The Buyer'),giver:'salt',col:'#ffd23f',ic:'3',start:POI.tide,hint:R2('פרק 3: מאמא סולט במחסן בנמל','Chapter 3: Mama Salt at the harbor warehouse'),steps:[
  {t:'talk',lines:[l('salt','מצאנו את פנקס החשבונות של הקולונל. כל תשלום הלך לאותה חתימה: H.','We found the Colonel\'s ledger. Every payment went to the same signature: H.'),l('benny','H כמו... הילו? המגדל הזה במרידיאן שנראה כמו מגהץ?','H as in... HALO? That tower in Meridian that looks like an iron?'),
   l('ray','חברת הייטק קונה רובים מקולונל?','A tech company buys rifles from a colonel?'),l('salt','חברת הייטק קונה הכול, מתוק. קח את הרכבת העילית, זה כיף. מישהו שם ידבר.','A tech company buys everything, sweetheart. Take the Sky Line, it is fun. Someone there will talk.')]},
  {t:'goto',at:'haloDoor',r:90,obj:R2('סע למגדל הילו ברובע הזכוכית (הרכבת העילית עוצרת קרוב)','Go to the HALO tower in the Glass Quarter (the Sky Line stops nearby)')},
  {t:'talk',lines:[l('ivy','אתה שוב. הבחור מנסיעת המבחן.','You again. The test-drive guy.'),l('ray','אני מחפש את מי שקנה את הנשק של הקולונל.','I am looking for whoever bought the Colonel\'s guns.'),l('ivy','אדריאן וייל. הבוס לשעבר שלי. הוא פיטר אותי בהולוגרמה.','Adrian Vale. My old boss. He fired me by hologram.'),
   l('ivy','הוא עושה מסיבת גאלה באי הפרטי שלו, קורל קי. דרומית לנמל, יש גשר חדש.','He is throwing a gala on his private island, Coral Key. South of the harbor, there is a new bridge.'),l('ray','ומה את רוצה מזה?','And what do you want out of this?'),l('ivy','את המכונית שלו. ונקמה. בעיקר את המכונית.','His car. And revenge. Mostly the car.')]},
  {t:'reward',money:3000}]},
 {id:'m10',name:R2('נסיעת מבחן אמיתית','A Real Test Drive'),giver:'ivy',col:'#ffd23f',ic:'3',start:POI.dealer,hint:R2('פרק 3: אייבי בסוכנות אוטוהאוס במרידיאן','Chapter 3: Ivy at the Autohaus dealership in Meridian'),steps:[
  {t:'talk',lines:[l('ivy','וייל משאיר פה את אב הטיפוס שלו, ואנטה X. ההזמנה לגאלה בתא הכפפות.','Vale keeps his prototype here, the Vanta X. The gala invitation is in the glovebox.'),l('ray','ואיך גונבים מכונית מסוכנות?','And how do you steal a car from a dealership?'),
   l('ivy','נוסעים מהר. האזעקה מחוברת למשטרה.','You drive fast. The alarm is wired to the police.'),l('ivy','אחר כך תצבע אותה באחד המוסכים. סגול זה לא הצבע שלה, אבל זה צבע שלא מחפשים.','Then respray it at a garage. Purple is not her color, but nobody looks for purple.')]},
  {t:'getveh',key:'vx',type:'vanta',at:'dealM',col:'#c9a227',obj:R2('גנוב את ואנטה X','Steal the Vanta X')},{t:'wanted',n:2},
  {t:'cond',f:M=>{const v=M.key.vx,P=G.player;return P.veh===v&&SPRAYS.some(sp=>hyp(v.x-sp.x,v.y-sp.y)<95);},init:M=>{M.target=SPRAYS.map(sp=>({x:sp.x,y:sp.y})).sort((a,b)=>hyp(a.x-G.player.x,a.y-G.player.y)-hyp(b.x-G.player.x,b.y-G.player.y))[0];},obj:R2('צבע את ואנטה X באחד ממוסכי הצביעה ✦','Respray the Vanta X at any spray garage ✦')},
  {t:'talk',lines:[l('ivy','(בטלפון) ההזמנה אצלך? יופי. קוד לבוש: חליפה. בבקשה לא אימונית.','(On the phone) Got the invitation? Good. Dress code: suit. Please, not the tracksuit.'),l('ray','האימונית שלי מכובדת.','My tracksuit is respectable.'),l('ivy','האימונית שלך מבוקשת בשלוש מדינות.','Your tracksuit is wanted in three states.')]},
  {t:'reward',money:4000}]},
 {id:'m11',name:R2('עין בשמיים','Eye in the Sky'),giver:'cap',col:'#ffd23f',ic:'3',start:POI.pad,hint:R2('פרק 3: קפטן רוטור במנחת סקייפורט','Chapter 3: Captain Rotor at the Skyport pad'),steps:[
  {t:'talk',lines:[l('cap','שמעתי שאתה הולך לגאלה של וייל. באי שלו יש יותר שומרים מבחתונה של האקסית שלי.','I hear you are going to Vale\'s gala. His island has more guards than my ex\'s wedding.'),l('ray','אז מה ההצעה?','So what is the plan?'),l('cap','מצלמים מלמעלה. אני מחזיק את המצלמה, אתה מחזיק את ההגה. ובבקשה, הפעם עם שני הידיים.','We take pictures from above. I hold the camera, you hold the stick. Both hands this time, please.')]},
  {t:'getveh',key:'heli',type:'heli',at:'padM',col:'#16161d',obj:R2('היכנס למסוק','Get in the helicopter')},
  {t:'pick',air:1,pts:()=>[[POI.coralHotel.x,POI.coralHotel.y],[POI.golf.x,POI.golf.y],[POI.vale.x,POI.vale.y],[POI.coralPier.x,POI.coralPier.y]],obj:R2('טוס מעל קורל קי וצלם ({0}/{1})','Fly over Coral Key and take photos ({0}/{1})')},
  {t:'cond',f:M=>{const v=M.key.heli;return !(v.alt>0)&&hyp(v.x-POI.pad.x,v.y-POI.pad.y)<420;},obj:R2('נחת בחזרה במנחת סקייפורט','Land back at the Skyport pad')},
  {t:'talk',lines:[l('cap','צלפים על הגג, מנחת מסוקים, ובריכה בצורת הפנים שלו.','Snipers on the roof, a helipad, and a pool shaped like his face.'),l('ray','בצורת הפנים שלו?','Shaped like his face?'),l('cap','עשירים. הם לא קונים מראות, הם קונים בריכות.','Rich people. They do not buy mirrors, they buy pools.')]},
  {t:'reward',money:3500}]},
 {id:'m12',name:R2('ערב גאלה','Gala Night'),giver:'ivy',col:'#ffd23f',ic:'3',start:POI.galaCar,hint:R2('פרק 3: אייבי מחכה ליד הבית שלך בנמל','Chapter 3: Ivy is waiting by your place at the harbor'),steps:[
  {t:'talk',lines:[l('ivy','הגאלה מתחילה. יש לך הזמנה, יש לך מכונית סגולה. חסרה לך חליפה.','The gala is starting. You have an invitation, you have a purple car. You are missing a suit.'),l('ray','יש לי חולצת הוואי.','I have a Hawaiian shirt.'),l('ivy','זה אי פרטי, לא טיול שנתי. חליפה. בחנות בגדים או בארון בבית.','It is a private island, not a school trip. A suit. Clothing store, or your wardrobe at home.')]},
  {t:'cond',f:()=>G.outfit==='suit',init:M=>{const s=SHOPS.filter(s=>s.k==='clothes').sort((a,b)=>hyp(a.sx-G.player.x,a.sy-G.player.y)-hyp(b.sx-G.player.x,b.sy-G.player.y))[0];if(s)M.target={x:s.sx,y:s.sy};},obj:R2('לבש חליפה (חנות בגדים או ארון בבית)','Put on a suit (clothing store or your wardrobe at home)')},
  {t:'goto',at:'coralHotel',r:100,obj:R2('סע לגאלה במלון קורל גרנד (דרך הגשר הדרומי לקורל קי)','Drive to the gala at the Coral Grand (over the south bridge to Coral Key)')},
  {t:'talk',lines:[l('vale','מר שליח! אני עוקב אחרי העבודה שלך. הקפיצות מגשרים, הברווז. מקסים.','Mister Courier! I have followed your work. The bridge jumps, the duck. Delightful.'),l('ray','קנית את הנשק של הקולונל.','You bought the Colonel\'s guns.'),
   l('vale','אני קונה הכול. עיר היא בסך הכול סטארט־אפ גדול מאוד. והסטארט־אפ הזה צריך... התייעלות.','I buy everything. A city is just a very large startup. And this startup needs... efficiency.'),l('ray','כלומר?','Meaning?'),l('vale','כלומר פחות אנשים כמוך. אבטחה, בבקשה תלוו את האורח החוצה. לתמיד.','Meaning fewer people like you. Security, please escort our guest out. Permanently.')]},
  {t:'kill',n:6,at:'vale',rad:260,ptype:'gang',faction:'vale',obj:R2('צא מהאחוזה של וייל בחיים ({0}/{1})','Fight your way out of Vale\'s estate ({0}/{1})')},{t:'wanted',n:3},{t:'lose'},
  {t:'talk',lines:[l('ivy','(בטלפון) ראיתי בחדשות. "תקרית קלה בגאלה". הוא בורח, ריי. הוא מעביר את כל הכסף ליבשה.','(On the phone) Saw it on the news. "A minor incident at the gala". He is running, Ray. He is moving all his money to the mainland.')]},
  {t:'reward',money:6000}]},
 {id:'m13',name:R2('המלך של קורל קי','King of Coral Key'),giver:'salt',col:'#ffd23f',ic:'★',start:POI.tide,hint:R2('סיום פרק 3: מאמא סולט במחסן בנמל','Chapter 3 finale: Mama Salt at the harbor warehouse'),steps:[
  {t:'talk',lines:[l('salt','וייל מעביר משאית מלאה כסף מהאי. הוא קורא לזה "רה־ארגון". אצל עשירים זה אומר לשרוף עיר ולקנות אותה בזול.','Vale is moving a truck full of cash off the island. He calls it "restructuring". For rich men that means burn a city and buy it cheap.'),
   l('benny','אז עושים רעש.','So we make noise.'),l('salt','עושים הרבה רעש. ריי, המשאית. ואחר כך האיש עצמו.','A lot of noise. Ray, the truck. And then the man himself.')]},
  {t:'hostiles',n:2,type:'suv',faction:'vale',col:'#16161d'},
  {t:'destroy',type:'bulwark',col:'#c9a227',hp:1500,move:240,timer:300,pts:()=>[[POI.truckStart.x/T,POI.truckStart.y/T,-Math.PI/2]],obj:R2('עצור את משאית הכסף של וייל ({0}/{1})','Stop Vale\'s cash truck ({0}/{1})')},
  {t:'kill',n:1,at:'valePad',rad:40,ptype:'gang',faction:'vale',hp:450,boss:1,obj:R2('וייל בורח למסוק שלו — עצור אותו! ({0}/{1})','Vale is running for his helicopter — stop him! ({0}/{1})')},
  {t:'talk',lines:[l('vale','אתה לא יכול לגעת בי! יש לי משקיעים!','You cannot touch me! I have investors!'),l('salt','משקיעים? מתוק, יש לך אותנו.','Investors? Darling, you have us.'),l('ray','סולס ביי זה לא סטארט־אפ.','Solace Bay is not a startup.'),l('vale','...אפשר לפחות לשמור את הברווז?','...Can I at least keep the duck?'),
   l('salt','הברווז נשאר. אתה הולך. המשטרה כבר בדרך, ודווקא היום הם ממהרים.','The duck stays. You go. The police are on their way, and today of all days they are in a hurry.')]},
  {t:'reward',money:15000,fn:()=>{const v=mkVeh('heli',POI.valePad.x,POI.valePad.y,0,'#c9a227');v.persist=true;v.fuel=1;},endMsg:R2('סוף פרק 3 — קורל קי שלך. המסוק המוזהב של וייל מחכה לך במנחת שלו.','End of Chapter 3 — Coral Key is yours. Vale\'s golden helicopter waits on his helipad.')}]});
 SIDE.push(
 {id:'s9',name:R2('פיצה פיראטית','Pizza Pirate'),giver:'pino',start:POI.pinoStart,look:'worker',steps:[
  {t:'talk',lines:[l('pino','אמיגו! יש לי שלוש הזמנות פיצה לסירות במפרץ. הים לא מחכה, הגבינה גם לא.','Amigo! I have three pizza orders for boats in the bay. The sea does not wait, neither does the cheese.'),l('ray','למה שמישהו יזמין פיצה לסירה?','Why would anyone order pizza to a boat?'),l('pino','כי הם עשירים ומשועממים. כמו כל המפרץ.','Because they are rich and bored. Like the whole bay.')]},
  {t:'getveh',key:'boat',type:'speedboat',at:'pinoBoat',col:'#ff9f43',obj:R2('עלה על סירת הפיצה','Get in the pizza boat')},
  {t:'pick',timer:200,r:110,pts:()=>[nearWater(POI.pier.x+300,POI.pier.y+700),nearWater(60*T,150*T),nearWater(POI.coralPier.x+150,POI.coralPier.y)].map(q=>[q.x,q.y]),obj:R2('מסור פיצות לסירות ({0}/{1})','Deliver pizzas to the boats ({0}/{1})')},
  {t:'talk',lines:[l('pino','שלוש סירות, אפס פיצות רטובות. אתה אמן.','Three boats, zero soggy pizzas. You are an artist.'),l('ray','אחת נפלה למים.','One fell in the water.'),l('pino','אז הדגים קיבלו פיצה. גם הם לקוחות.','Then the fish got pizza. They are customers too.')]},
  {t:'reward',money:900}]},
 {id:'s10',name:R2('הנקמה של המים','The Mime\'s Revenge'),giver:'mime',start:POI.mimeStart,look:'casual',steps:[
  {t:'talk',lines:[l('mime','(המים מצביע עליך. ואז על טנדר גלידה. ואז מעביר אצבע על הצוואר)','(The mime points at you. Then at an ice-cream van. Then drags a finger across his throat)'),l('ray','אתה רוצה שאני... אפגע בטנדר גלידה?','You want me to... hit an ice-cream van?'),l('mime','(מהנהן בהתלהבות. מחקה מישהו שגונב לו את הכובע ובורח בטנדר)','(Nods eagerly. Mimes someone stealing his hat and fleeing in a van)'),l('ray','הליצן גנב לך את הכובע. הבנתי.','The clown stole your hat. Got it.')]},
  {t:'destroy',type:'van',col:'#ff9ff3',move:220,timer:180,pts:()=>[[POI.vanStart.x/T,POI.vanStart.y/T,0]],obj:R2('השמד את טנדר הגלידה של הליצן ({0}/{1})','Destroy the clown\'s ice-cream van ({0}/{1})')},
  {t:'talk',lines:[l('mime','(מוחא כפיים בלי קול. מוציא כסף מכיס בלתי נראה. הכסף אמיתי)','(Claps silently. Pulls money from an invisible pocket. The money is real)')]},
  {t:'reward',money:800}]},
 {id:'s11',name:R2('סיור סלפי','Selfie Tour'),giver:'hans',start:POI.hans,look:'tourist',steps:[
  {t:'talk',lines:[l('hans','סליחה! אני הנס. יש לי רק שעה בעיר ואני צריך סלפי בכל המקומות המפורסמים.','Excuse me! I am Hans. I have one hour in town and I need a selfie at every famous spot.'),l('ray','ואני הנהג?','And I am the driver?'),l('hans','אתה הנהג, הצלם והמדריך. התשלום טוב. הנוף טוב יותר.','You are driver, photographer and guide. The pay is good. The view is better.')]},
  {t:'pick',timer:330,r:90,pts:()=>[[POI.duck.x,POI.duck.y+60],[POI.pier.x,POI.pier.y],[POI.halo.x,POI.halo.y+80],[POI.coralHotel.x,POI.coralHotel.y],[STATIONS[2].gx,STATIONS[2].gy]],obj:R2('קח את הנס לנקודות הסלפי ({0}/{1})','Take Hans to the selfie spots ({0}/{1})')},
  {t:'talk',lines:[l('hans','מושלם! בכל התמונות רואים רק את האצבע שלי, אבל זה האומנות.','Perfect! In every photo you only see my finger, but that is art.')]},
  {t:'reward',money:1200}]},
 {id:'s12',name:R2('צייד ביגפוט','Bigfoot Hunter'),giver:'darren',start:POI.darren,look:'punk',steps:[
  {t:'talk',lines:[l('darren','אתה! אתה נראה כמו מישהו שמאמין.','You! You look like a believer.'),l('ray','אני מאמין בהרבה דברים. בעיקר בכסף.','I believe in many things. Mostly money.'),l('darren','ביגפוט גר בפרדס הישן. הוא יוצא רק בלילה. אף אחד לא מאמין לי, אפילו לא אמא שלי, שהיא בעצמה ראתה עב״ם.','Bigfoot lives in Old Orchard. He only comes out at night. Nobody believes me, not even my mom, who saw a UFO herself.')]},
  {t:'cond',f:()=>G.got.includes('bigfootSeen'),init:M=>{M.target={x:POI.darren.x,y:POI.darren.y};},obj:R2('מצא את ביגפוט בפרדס הישן — רק בלילה','Find Bigfoot in Old Orchard — only at night')},
  {t:'talk',lines:[l('darren','ראית אותו?! באמת?! אני ידעתי! אני הולך לספר לאמא!','You saw him?! Really?! I knew it! I am telling my mom!')]},
  {t:'reward',money:1500}]},
 {id:'s13',name:R2('טורניר הגולף','Golf Rage'),giver:'chip',start:POI.chip,look:'biz',req:'m9',steps:[
  {t:'talk',lines:[l('chip','אני צ׳יפ, מנהל מועדון הגולף. מישהו פיזר עשרה כדורים במגרש ויש תחרות בעוד דקה וחצי.','I am Chip, golf club manager. Someone scattered balls all over the course and the tournament starts in ninety seconds.'),l('ray','ואני...?','And I...?'),l('chip','אתה אוסף אותם בעגלת גולף. ובלי לדרוס את הדשא. טוב, תדרוס קצת.','You collect them in a golf cart. And do not ruin the grass. Fine, ruin it a little.')]},
  {t:'getveh',key:'cart',type:'cart',at:'chipCart',col:'#f4f6f7',obj:R2('עלה על עגלת הגולף','Get in the golf cart')},
  {t:'pick',timer:100,r:46,pts:()=>[[0.2,0.25],[0.4,0.15],[0.7,0.22],[0.85,0.5],[0.6,0.6],[0.3,0.7],[0.55,0.85]].map(f=>[51*T+f[0]*20*T,166*T+f[1]*20*T]),obj:R2('אסוף את כדורי הגולף ({0}/{1})','Collect the golf balls ({0}/{1})')},
  {t:'talk',lines:[l('chip','הצלת את הטורניר! טוב, את רוב הדשא לא.','You saved the tournament! Well, not most of the grass.')]},
  {t:'reward',money:1000}]},
 {id:'s14',name:R2('פקח רכבת','Ticket Inspector'),giver:'otto',start:POI.otto,look:'elder',steps:[
  {t:'talk',lines:[l('otto','אני אוטו, פקח הרכבת. הברכיים שלי פרשו לפניי. תבדוק בשבילי שלוש תחנות?','I am Otto, train inspector. My knees retired before me. Check three stations for me?'),l('ray','מה אני בודק?','What am I checking?'),l('otto','שהן עדיין שם. פעם אחת תחנה נעלמה. התברר שזה היה ערפל.','That they are still there. Once a station vanished. Turned out it was fog.')]},
  {t:'pick',timer:420,r:70,pts:()=>[STATIONS[3],STATIONS[5],STATIONS[7]].map(s=>[s.gx,s.gy]),obj:R2('בקר בשלוש תחנות רכבת ({0}/{1}) — אפשר לנסוע ברכבת','Visit three train stations ({0}/{1}) — you can ride the train')},
  {t:'talk',lines:[l('otto','כולן שם? מצוין. אני הולך לנמנם בקרון האחרון. שם השקט.','All still there? Excellent. I am napping in the last car. It is quiet there.')]},
  {t:'reward',money:1100}]});}
// ---------- clarity: story vs side ----------
function isSide(m){return SIDE.includes(m);}
function setObj(t){const M=G.mission,tag=M?(isSide(M.m)?'side':'story'):(t&&nextMission()&&t===L(nextMission().hint)?'story':'');const key=tag+'|'+t;if(G.obj===key)return;G.obj=key;const el=$('obj');
  el.innerHTML='';if(tag){const c=document.createElement('span');c.className='otag '+tag;c.textContent=tr(tag==='side'?'tagSide':'tagStory');el.appendChild(c);}el.appendChild(document.createTextNode(t||''));el.className=tag;el.style.display=t?'block':'none';el.style.opacity=1;G.objT=6;}
function startMission(m){G.mission={m,step:-1,key:{},timer:null,target:null,ents:[]};const side=isSide(m);bigMsg(L(m.name),side?'#c59bff':'#ffd23f',tr(side?'startSide':'startStory'));nextStep();}
function passMission(s){G.misLock={x:G.player.x,y:G.player.y};const M=G.mission,side=isSide(M.m);G.money+=s.money||0;
  if(s.weapon){giveWeapon(s.weapon[0],s.weapon[1]);setTimeout(()=>toast(fmt(tr('newweap'),L(WEAP[s.weapon[0]]))),1600);}
  G.done.push(M.m.id);if(s.fn)s.fn();if(s.endMsg)setTimeout(()=>toast(L(s.endMsg),8),3500);cleanupMission();bigMsg(tr(side?'passSide':'passStory'),side?'#c59bff':'#5dff7a',fmt(tr('reward'),s.money||0));sfx.pass();saveGame();
  if(s.end)setTimeout(()=>toast(tr('chapend'),7),3500);}
function drawMissionLabels(inV){if(G.mission)return;const lab=(x,y,txt,col,ic)=>{if(!inV(x,y,120))return;g.save();g.font='bold 13px Rubik,sans-serif';g.direction=G.lang==='he'?'rtl':'ltr';const w=Math.min(220,g.measureText(txt).width+34);g.fillStyle='rgba(10,12,22,0.82)';rrect(g,x-w/2,y-62,w,24,12);g.fill();g.strokeStyle=col;g.lineWidth=2;rrect(g,x-w/2,y-62,w,24,12);g.stroke();
    g.fillStyle=col;g.textAlign='center';g.textBaseline='middle';g.fillText(ic+' '+txt,x,y-49.5,w-10);g.restore();};
  const nm=nextMission();if(nm)lab(nm.start.x,nm.start.y,tr('tagStory')+': '+L(nm.name),'#ffd23f','★');for(const sm of sideAvail())lab(sm.start.x,sm.start.y,tr('tagSide')+': '+L(sm.name),'#c59bff','?');}
