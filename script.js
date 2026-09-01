const API="/api";
const $=id=>document.getElementById(id);
const charts={};
const palette=["#7166f3","#35c8d0","#3bc48d","#f4a34d","#e96f9b","#7aa3ff","#9f7aea"];

Chart.defaults.font.family="Inter, sans-serif";
Chart.defaults.color="#7a879a";

async function request(path,options={}){
  const r=await fetch(API+path,{...options,headers:{"Content-Type":"application/json",...(options.headers||{})}});
  const data=await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(data.message||"Something went wrong");
  return data;
}
function pct(n,total){return total?Math.round(n/total*100):0}
function topEntry(obj){return Object.entries(obj||{}).sort((a,b)=>b[1]-a[1])[0]||["—",0]}
function destroy(id){if(charts[id])charts[id].destroy()}
function doughnut(id,obj){
  destroy(id); const labels=Object.keys(obj),values=Object.values(obj);
  charts[id]=new Chart($(id),{type:"doughnut",data:{labels,datasets:[{data:values,backgroundColor:palette,borderColor:"transparent",hoverOffset:8}]},options:{responsive:true,maintainAspectRatio:false,cutout:"68%",plugins:{legend:{position:"bottom",labels:{boxWidth:8,boxHeight:8,usePointStyle:true,padding:13,font:{size:9}}}}}});
}
function bars(id,obj,horizontal=false,dark=false){
  destroy(id); const labels=Object.keys(obj),values=Object.values(obj);
  charts[id]=new Chart($(id),{type:"bar",data:{labels,datasets:[{data:values,backgroundColor:palette,borderRadius:8,borderSkipped:false,barThickness:24}]},options:{responsive:true,maintainAspectRatio:false,indexAxis:horizontal?"y":"x",plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:dark?"#7f91ad":"#7a879a",font:{size:9}}},y:{beginAtZero:true,grid:{color:dark?"rgba(255,255,255,.06)":"#edf1f6"},ticks:{precision:0,color:dark?"#7f91ad":"#7a879a",font:{size:9}}}}}});
}
function lineSpark(total){
  destroy("heroSpark");
  const vals=Array.from({length:Math.max(total,2)},(_,i)=>i+1);
  charts.heroSpark=new Chart($("heroSpark"),{type:"line",data:{labels:vals.map(()=>""),datasets:[{data:vals,borderColor:"#6edac7",backgroundColor:"rgba(83,220,197,.1)",fill:true,tension:.42,pointRadius:0,borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{display:false},y:{display:false}}}});
}
async function loadDashboard(){
  const d=await request("/dashboard");
  const total=d.total;
  const [topConcern,topCount]=topEntry(d.mainConcern);
  const yesCharts=d.chartsUseful["Yes"]||0;
  const safe=(d.safety["Safe"]||0)+(d.safety["Very safe"]||0);
  $("totalResponses").textContent=total;
  $("topConcern").textContent=topConcern;
  $("topConcernSub").textContent=`${topCount} of ${total} respondents`;
  $("chartSupport").textContent=`${pct(yesCharts,total)}%`;
  $("safeShare").textContent=`${pct(safe,total)}%`;
  $("heroTotal").textContent=total;
  $("heroTopConcern").textContent=topConcern;
  $("heroTopPercent").textContent=`${pct(topCount,total)}% of responses`;
  $("heroChartsYes").textContent=`${pct(yesCharts,total)}%`;
  $("heroProgress").style.width=`${pct(yesCharts,total)}%`;

  const [infoTop]=topEntry(d.infoSource),[vizTop]=topEntry(d.visualizationType);
  $("infoSourceTop").textContent=infoTop;
  $("vizTop").textContent=vizTop;
  $("decisionYes").textContent=`${pct(d.dataVizDecision["Yes"]||0,total)}% Yes`;

  const [envTop,envCount]=topEntry(d.environmentIssue);
  $("liveInsight").textContent=`${topConcern} is currently the leading overall concern, while ${envTop} is the most selected local environmental issue (${envCount} response${envCount===1?"":"s"}).`;

  bars("concernChart",d.mainConcern,true);
  doughnut("ageChart",d.ageGroup);
  doughnut("airChart",d.airQuality);
  bars("environmentChart",d.environmentIssue,true);
  doughnut("safetyChart",d.safety);
  bars("infoSourceChart",d.infoSource,false,true);
  doughnut("vizChart",d.visualizationType);
  doughnut("decisionChart",d.dataVizDecision);
  lineSpark(total);
}
$("refreshBtn").addEventListener("click",()=>loadDashboard().catch(console.error));
$("surveyForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const f=new FormData(e.currentTarget);
  const payload=Object.fromEntries(f.entries());
  payload.consent=!!f.get("consent");
  $("formMessage").textContent="";
  try{
    const d=await request("/responses",{method:"POST",body:JSON.stringify(payload)});
    e.currentTarget.reset();
    await loadDashboard();
    $("successTotal").textContent=d.total;
    $("successConcern").textContent=payload.mainConcern;
    $("successModal").classList.remove("hidden");
  }catch(err){$("formMessage").textContent=err.message}
});
$("viewUpdated").addEventListener("click",()=>{$("successModal").classList.add("hidden");location.hash="dashboard"});
loadDashboard().catch(console.error);