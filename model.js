(function(root){
  'use strict';
  const pad=n=>String(n).padStart(2,'0');
  const day=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const today=()=>day(new Date());
  const time=()=>`${pad(new Date().getHours())}:${pad(new Date().getMinutes())}`;
  const id=()=>globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(16).slice(2)}`;
  function seed(){
    const d=new Date(); d.setMonth(d.getMonth()-4); const dob=day(d);
    const date=today();
    return {version:1,baby:{name:'Emma Rose Jenkins',nickname:'Emma',dob,birthTime:'08:24',birthWeight:3.2,birthLength:49,pediatrician:'Dr. Rachel Green',avatar:''},
      records:[{id:'r1',type:'Feeding',method:'Formula bottle',amount:160,duration:15,date,time:'10:45',notes:'A calm bottle feed, followed by a little cuddle.'},{id:'r2',type:'Diaper',kind:'Wet',date,time:'09:15',notes:'Changed and comfortable.'},{id:'r3',type:'Sleep',duration:75,date,time:'07:30',notes:'A quiet morning nap.'},{id:'r4',type:'Feeding',method:'Formula bottle',amount:140,duration:15,date,time:'07:00',notes:'First bottle of the morning.'}],
      measurements:[0,1,2,3,4].map((n)=>{const at=new Date(d);at.setMonth(at.getMonth()+n);return {id:'m'+n,date:day(at),weight:[3.2,4.1,4.9,5.7,6.4][n],length:[49,53,56.5,59.5,62.5][n],head:[34,36.5,38.2,39.8,41][n],notes:n===0?'Birth record':'Sample measurement'};}),
      bookmarks:[],read:[],checks:{},prefs:{feeding:true,sleep:true,growth:false,quiet:true}};
  }
  function validDate(s){return /^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(Date.parse(s))&&s<=today();}
  function careError(r){if(!['Feeding','Sleep','Diaper'].includes(r.type))return 'Choose an activity.';if(!validDate(r.date))return 'Choose a valid date, no later than today.';if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(r.time))return 'Enter a valid time.';if(r.type==='Feeding'&&r.method!=='Nursing'&&!(Number(r.amount)>0&&Number(r.amount)<=2000))return 'Enter a milk amount between 1 and 2,000 ml.';if((r.type==='Sleep'||r.type==='Feeding')&&!(Number(r.duration)>0&&Number(r.duration)<=1440))return 'Enter a duration between 1 and 1,440 minutes.';return '';}
  function measurementError(m){if(!validDate(m.date))return 'Choose a valid date, no later than today.';if(!(Number(m.weight)>0&&Number(m.weight)<=100))return 'Enter a weight greater than 0 and no more than 100 kg.';if(!(Number(m.length)>0&&Number(m.length)<=200))return 'Enter a length greater than 0 and no more than 200 cm.';if(m.head!==''&&m.head!=null&&!(Number(m.head)>0&&Number(m.head)<=100))return 'Enter a head circumference between 0 and 100 cm, or leave it blank.';return '';}
  function babyError(b){if(!b.name.trim()||!b.nickname.trim())return 'Enter a name and nickname.';if(!validDate(b.dob))return 'Choose a birth date, no later than today.';if(!(Number(b.birthWeight)>0&&Number(b.birthWeight)<=20))return 'Enter a birth weight between 0 and 20 kg.';if(!(Number(b.birthLength)>0&&Number(b.birthLength)<=100))return 'Enter a birth length between 0 and 100 cm.';return '';}
  const sortedMeasurements=s=>s.measurements.map((x,i)=>({...x,_order:i})).sort((a,b)=>a.date.localeCompare(b.date)||a._order-b._order);
  const latest=s=>sortedMeasurements(s).at(-1);
  function totals(s,date=today()){const r=s.records.filter(r=>r.date===date);return {milk:r.filter(x=>x.type==='Feeding').reduce((a,x)=>a+Number(x.amount||0),0),feeds:r.filter(x=>x.type==='Feeding').length,sleep:r.filter(x=>x.type==='Sleep').reduce((a,x)=>a+Number(x.duration),0),diapers:r.filter(x=>x.type==='Diaper').length};}
  function months(dob){const a=new Date(dob+'T12:00:00'),b=new Date();return Math.max(0,(b.getFullYear()-a.getFullYear())*12+b.getMonth()-a.getMonth()-(b.getDate()<a.getDate()?1:0));}
  const API={day,today,time,id,seed,careError,measurementError,babyError,latest,sortedMeasurements,totals,months};root.BabyModel=API;if(typeof module!=='undefined')module.exports=API;
})(globalThis);
