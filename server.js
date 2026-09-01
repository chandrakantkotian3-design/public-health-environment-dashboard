require("dotenv").config();
const express=require("express"),fs=require("fs"),path=require("path");
const app=express();
const PORT=process.env.PORT||3000;
const DB=path.join(__dirname,"data","db.json");
app.use(express.json({limit:"100kb"}));
app.use(express.static(__dirname));

const clean=(v,n=160)=>String(v||"").trim().slice(0,n);
function readDB(){return JSON.parse(fs.readFileSync(DB,"utf8"))}
function writeDB(d){fs.writeFileSync(DB,JSON.stringify(d,null,2))}
function counts(rows,key){
  const o={};
  for(const r of rows){
    const value=clean(r[key])||"Not answered";
    o[value]=(o[value]||0)+1;
  }
  return o;
}
function dashboard(rows){
  return{
    total:rows.length,
    ageGroup:counts(rows,"ageGroup"),
    mainConcern:counts(rows,"mainConcern"),
    airQuality:counts(rows,"airQuality"),
    pollutionFrequency:counts(rows,"pollutionFrequency"),
    diseaseConcern:counts(rows,"diseaseConcern"),
    healthInfoFrequency:counts(rows,"healthInfoFrequency"),
    environmentIssue:counts(rows,"environmentIssue"),
    airPollutionCause:counts(rows,"airPollutionCause"),
    wasteFrequency:counts(rows,"wasteFrequency"),
    infoSource:counts(rows,"infoSource"),
    chartsUseful:counts(rows,"chartsUseful"),
    visualizationType:counts(rows,"visualizationType"),
    dataVizDecision:counts(rows,"dataVizDecision"),
    waterConcern:counts(rows,"waterConcern"),
    safety:counts(rows,"safety")
  }
}
app.get("/api/dashboard",(req,res)=>res.json(dashboard(readDB().responses)));

app.post("/api/responses",(req,res)=>{
  const x=req.body||{};
  const required=["email","ageGroup","mainConcern","airQuality","pollutionFrequency","diseaseConcern","healthInfoFrequency","environmentIssue","airPollutionCause","wasteFrequency","infoSource","chartsUseful","visualizationType","dataVizDecision","waterConcern","safety"];
  if(required.some(k=>!clean(x[k]))||!x.consent) return res.status(400).json({message:"Please answer all required questions and accept the consent checkbox."});
  const email=clean(x.email,120).toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({message:"Please enter a valid email address."});

  const db=readDB();
  const response={
    id:"R"+String(db.responses.length+1).padStart(3,"0"),
    timestamp:new Date().toISOString(),
    name:clean(x.name,60),
    email,
    area:clean(x.area,80),
    source:"Website Survey"
  };
  for(const k of required.filter(k=>k!=="email")) response[k]=clean(x[k],160);
  db.responses.push(response);
  writeDB(db);
  res.json({message:"Response recorded",total:db.responses.length});
});

app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"index.html")));
app.listen(PORT,()=>console.log(`Community Pulse running at http://localhost:${PORT}`));