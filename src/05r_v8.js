// ---------- v8: fairer police, bridge traffic ----------
Object.assign(VT.police,{max:430,acc:400});
function sightRange(){return lerp(600,400,ENV.dark)*(1-0.3*ENV.fog-0.12*ENV.rain);}
function spawnTraffic(cx,cy){const cand=[];for(let i=0;i<XS.length;i++)for(let j=0;j<YS.length;j++)for(let d=0;d<4;d++){if(!validDir(i,j,d))continue;const a=nodePos(i,j),b=nodePos(i+DIRS[d][0],j+DIRS[d][1]);
    for(let k=0;k<3;k++){const f=rr(0.08,0.92),x=a.x+(b.x-a.x)*f,y=a.y+(b.y-a.y)*f,dd=hyp(x-cx,y-cy);if(dd>=650&&dd<=1500){cand.push([i,j,d,f]);break;}}}
  for(let k=0;k<8&&cand.length;k++){const [i,j,d,f]=pick(cand),q=nodePos(i,j);const v=mkVeh(trafficType(q.x,q.y),0,0,0);trafficAt(v,i,j,d,f);
    if(onScreen(v.x,v.y,60)||G.vehicles.some(o=>o!==v&&hyp(o.x-v.x,o.y-v.y)<120)){G.vehicles.pop();continue;}v.driver='civ';return v;}}
function policeCD(dt){if(G.chaseCD>0)G.chaseCD-=dt;}
