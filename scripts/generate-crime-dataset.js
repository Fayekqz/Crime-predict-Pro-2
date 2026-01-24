const fs=require('fs');
const args=process.argv.slice(2);
const getArg=(name,def)=>{
  const m=args.find(a=>a.startsWith(`--${name}=`));
  if(!m) return def;
  const v=m.split('=')[1];
  return v;
};
const MONTHS=parseInt(getArg('months','12'),10);
const ROWS=parseInt(getArg('rows','15000'),10);
const cities=[
{district:'Delhi',center:[28.6139,77.2090],areas:['Connaught Place','Hauz Khas','Karol Bagh','Dwarka','Saket','Rohini','Noida Sector 18','MG Road']},
{district:'Mumbai',center:[19.0760,72.8777],areas:['Marine Drive','Thane West','BKC','Juhu','Andheri','Borivali','Dadar','Colaba']},
{district:'Bengaluru',center:[12.9716,77.5946],areas:['Indiranagar','Koramangala','Yeshwanthpur','MG Road','Whitefield','HSR Layout','Electronic City','Malleshwaram']},
{district:'Chennai',center:[13.0827,80.2707],areas:['T. Nagar','Nungambakkam','Egmore','Guindy','Velachery','Anna Nagar','Adyar','Tambaram']},
{district:'Kolkata',center:[22.5726,88.3639],areas:['Park Street','Alipore','Dum Dum','Baranagar','Salt Lake','New Market','Howrah','Ballygunge']},
{district:'Hyderabad',center:[17.3850,78.4867],areas:['Charminar','Banjara Hills','Necklace Road','Kukatpally','Gachibowli','Madhapur','Secunderabad','Hitech City']},
{district:'Pune',center:[18.5204,73.8567],areas:['Camp','Kothrud','PCMC','Viman Nagar','Koregaon Park','Hadapsar','Shivajinagar','Baner']},
{district:'Ahmedabad',center:[23.0225,72.5714],areas:['Navrangpura','Maninagar','SG Highway','Chandkheda','Bopal','Vastrapur','Ellis Bridge','Sabarmati']}
];
const categories=['Theft','Assault','Burglary','Robbery','Vandalism','Drug Offense','Property Crime','Traffic Violation'];
const cityCategoryWeights={
  Delhi:{Property:0.45,Violent:0.20,Drug:0.10,Traffic:0.25},
  Mumbai:{Property:0.40,Violent:0.22,Drug:0.12,Traffic:0.26},
  Bengaluru:{Property:0.42,Violent:0.18,Drug:0.13,Traffic:0.27},
  Chennai:{Property:0.43,Violent:0.17,Drug:0.12,Traffic:0.28},
  Kolkata:{Property:0.41,Violent:0.21,Drug:0.11,Traffic:0.27},
  Hyderabad:{Property:0.40,Violent:0.20,Drug:0.14,Traffic:0.26},
  Pune:{Property:0.44,Violent:0.18,Drug:0.10,Traffic:0.28},
  Ahmedabad:{Property:0.45,Violent:0.17,Drug:0.10,Traffic:0.28}
};
const pickCategoryType=(district)=>{
  const w=cityCategoryWeights[district]||cityCategoryWeights['Delhi'];
  const r=Math.random();
  let major;
  if(r<w.Property) major='Property';
  else if(r<w.Property+w.Violent) major='Violent';
  else if(r<w.Property+w.Violent+w.Drug) major='Drug';
  else major='Traffic';
  if(major==='Property') return pick(['Theft','Burglary','Vandalism','Property Crime']);
  if(major==='Violent') return pick(['Assault','Robbery']);
  if(major==='Drug') return 'Drug Offense';
  return 'Traffic Violation';
};
const statuses=['Active','Resolved','Closed'];
const headers=['Date','Time','Crime_Type','Latitude','Longitude','Address','District','Description','Status','Response_Time_Minutes'];
const jitter=(v,s)=>v+(Math.random()-0.5)*s;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const pad=n=>String(n).padStart(2,'0');
const monthSeasonWeight=(monthIndex)=>{
  // 0=Jan ... 11=Dec
  const w=[0.92,0.95,1.00,1.05,1.10,1.15,1.12,1.10,1.02,1.00,1.04,1.08];
  return w[monthIndex]||1.0;
};
const buildDatePool=(days)=>{
  const pool=[];const now=new Date();
  for(let i=0;i<days;i++){const d=new Date(now.getTime()-i*24*60*60*1000);const dow=d.getDay();
    const isWeekend=(dow===0||dow===6);
    const weekendWeight=isWeekend?1.30:1.0;
    const seasonWeight=monthSeasonWeight(d.getMonth());
    const weight=weekendWeight*seasonWeight;
    pool.push({date:`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`,weight});
  }
  return pool;
};
const sampleWeighted=(pool)=>{
  const sum=pool.reduce((s,p)=>s+p.weight,0);let r=Math.random()*sum;for(const p of pool){if((r-=p.weight)<=0) return p.date;}return pool[pool.length-1].date;
};
const datePool=buildDatePool(MONTHS*30);
const dateWithinDays=()=>sampleWeighted(datePool);
const timeRandom=(type)=>{
  const hrBand=()=>{
    if(type==='Traffic Violation') return pick([7,8,9,17,18,19,20]);
    if(type==='Assault'||type==='Robbery') return pick([20,21,22,23,0,1]);
    if(type==='Drug Offense') return pick([21,22,23,0,1,2]);
    return pick([10,11,12,13,14,15,16]);
  };
  const h=hrBand();const m=Math.floor(Math.random()*60);
  return `${pad(h)}:${pad(m)}`;
};
const describe=(type)=>{
if(type==='Theft')return 'Theft of personal belongings reported';
if(type==='Assault')return 'Physical altercation between individuals';
if(type==='Burglary')return 'Breaking and entering into residential property';
if(type==='Robbery')return 'Street robbery near public area';
if(type==='Vandalism')return 'Damage to public or private property';
if(type==='Drug Offense')return 'Possession or distribution case';
if(type==='Property Crime')return 'Non-violent property related incident';
return 'Traffic rules violation captured';
};
const responseMinutes=(district,type,status)=>{
  const baseCity={Delhi:8.5,Mumbai:8.0,Bengaluru:9.0,Chennai:9.2,Kolkata:8.8,Hyderabad:8.7,Pune:9.5,Ahmedabad:9.3}[district]||9.0;
  let adj=0;
  if(type==='Traffic Violation') adj-=1.0;
  if(type==='Assault'||type==='Robbery') adj+=1.2;
  if(status==='Active') adj+=0.8; if(status==='Resolved'||status==='Closed') adj-=0.4;
  const val=Math.max(4.0, baseCity+adj+(Math.random()-0.5)*2.5);
  return Number(val.toFixed(1));
};
const toCsv=(arr)=>arr.map(v=>{const s=String(v??'');return s.includes(',')||s.includes('"')||s.includes('\n')?`"${s.replace(/"/g,'""')}"`:s;}).join(',');
const rows=[];
rows.push(headers.join(','));
for(let i=0;i<ROWS;i++){
const city=pick(cities);
const type=pickCategoryType(city.district);
const statusRand=Math.random();
const status=(function(){
  if(type==='Traffic Violation') return statusRand<0.4?'Active':statusRand<0.8?'Resolved':'Closed';
  if(type==='Drug Offense') return statusRand<0.7?'Active':statusRand<0.85?'Resolved':'Closed';
  if(type==='Assault'||type==='Robbery') return statusRand<0.6?'Active':statusRand<0.78?'Resolved':'Closed';
  return statusRand<0.5?'Active':statusRand<0.85?'Resolved':'Closed';
})();
const lat=jitter(city.center[0],0.08);
const lng=jitter(city.center[1],0.08);
const addr=pick(city.areas);
const row=[
dateWithinDays(),
timeRandom(type),
type,
lat.toFixed(6),
lng.toFixed(6),
addr,
city.district,
describe(type),
status,
responseMinutes(city.district,type,status)
];
rows.push(toCsv(row));
}
const outName=`crime_dataset_M${MONTHS}_R${ROWS}.csv`;
fs.writeFileSync(outName,rows.join('\n'),'utf8');
console.log(`Generated ${outName}`);
