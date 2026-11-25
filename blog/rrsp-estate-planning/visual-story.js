/* Visual explanation layer. All values come from the shared projection engine. */
(()=>{
"use strict";
const M=RRSPModel,p=M.defaults,$=id=>document.getElementById(id);
const fmt=n=>Math.round(n).toLocaleString("en-CA",{style:"currency",currency:"CAD",maximumFractionDigits:0});
const pct=(n,d)=>d>0?(100*n/d).toFixed(1)+"%":"0%";
const metric=(label,n,tone="",caption="")=>'<div class="story-metric '+tone+'"><div class="metric-label">'+label+'</div><div class="metric-value">'+fmt(n)+'</div>'+(caption?'<p class="metric-caption">'+caption+'</p>':'')+'</div>';
const line=(label,n,tone="")=>'<div class="money-line '+tone+'"><span>'+label+'</span><strong>'+fmt(n)+'</strong></div>';
const arrow='<div class="flow-arrow" aria-hidden="true">↓</div>';
const split=(gross,tax)=>'<div class="track split" aria-hidden="true"><div class="fill good" style="width:'+pct(gross-tax,gross)+'"></div><div class="fill tax" style="width:'+pct(tax,gross)+'"></div></div>';
const bar=(label,n,max,tone="blue")=>'<div class="measure">'+line(label,n)+'<div class="track" aria-hidden="true"><div class="fill '+tone+'" style="width:'+pct(n,max)+'"></div></div></div>';
const firstTax=M.extraTax(p.balance,p), gross=M.grossForNet(p.room,p);
$("death-now").innerHTML='<p class="small-label">If Linda dies today, before any withdrawals</p>'+metric("Starting RRSP",p.balance,"source-metric","Pre-tax retirement savings")+arrow+split(p.balance,firstTax)+metric("Estimated tax bill",firstTax,"tax-metric",pct(firstTax,p.balance)+" of the RRSP goes to tax")+metric("Her family receives",p.balance-firstTax,"good-metric",pct(p.balance-firstTax,p.balance)+" of the RRSP remains")+'<p class="note">Estimated additional income tax and OAS recovery; assumes Ontario, $35,000 other annual income, and no qualifying rollover. Other assets excluded.</p>';
$("gift-flow").innerHTML='<p class="small-label">Year 1 · Original gift plan</p>'+metric("Withdraw from RRSP",gross,"source-metric","Gross amount, before income tax")+arrow+metric("Income tax paid now",gross-p.room,"tax-metric",pct(gross-p.room,gross)+" effective incremental tax rate")+split(gross,gross-p.room)+metric("Cash available to give away",p.room,"good-metric","No additional Canadian tax on the cash gift itself")+arrow+line("Son 1: TFSA contribution",p.room/2,"good-text")+line("Son 2: TFSA contribution",p.room/2,"good-text")+'<p class="note">Assumes the sons each have contribution room and Linda has no extra living expenses.</p>';
function select(group,key,value){for(const b of $(group).querySelectorAll("button"))b.setAttribute("aria-pressed",String(b.dataset[key]===String(value)));}
function bind(group,key,fn){$(group).addEventListener("click",e=>{const b=e.target.closest("button");if(!b||!b.dataset[key])return;select(group,key,b.dataset[key]);fn(b.dataset[key]);});}
let rate=5,years=10;
function growth(){
 const q={...p,drawReturn:rate,holdReturn:rate,tfsaReturn:rate,taxableReturn:rate-1};
 const first=M.project(q,"gift",1)[0],a=M.project(q,"gift",years).at(-1),b=M.project(q,"draw",years).at(-1),d=b.wealth-a.wealth,change=first.reg-p.balance;
 $("growth-result").innerHTML='<p class="small-label">Year 1 · Original gift plan at '+rate+'% return</p><div class="equation">'+line("Starting RRSP",p.balance)+line("+ Investment growth",p.balance*rate/100,"good-text")+line("− Gross withdrawal",first.w,"tax-text")+'</div>'+metric("RRSP after year 1",first.reg,"source-metric",(change>=0?"Grew by ":"Fell by ")+fmt(Math.abs(change))+" despite gifting "+fmt(first.gifted))+'<div class="rule"></div><p class="small-label">At age '+(p.age+years)+' · '+years+' years later</p>'+bar("RRSP left: original gift plan",a.reg,Math.max(p.balance,a.reg,b.reg))+bar("RRSP left: $60,000 annual withdrawals",b.reg,Math.max(p.balance,a.reg,b.reg),"neutral")+'<p class="note">Includes mandatory RRIF withdrawals starting at age 72.</p><div class="rule"></div><h3>Now count the money already transferred.</h3>'+bar("Family wealth: original plan",a.wealth,Math.max(a.wealth,b.wealth))+bar("Family wealth: larger withdrawals",b.wealth,Math.max(a.wealth,b.wealth),"neutral")+metric(d>=0?"Larger withdrawals leave more":"Original gift plan leaves more",Math.abs(d),"good-metric","Difference in total after-tax family wealth")+'<p class="note">Includes reinvested gifts, Linda’s retained cash and remaining RRSP after tax. A smaller RRSP does not mean the family has less money.</p>';
}
bind("lesson-rates","rate",v=>{rate=Number(v);growth();});bind("lesson-years","year",v=>{years=Number(v);growth();});growth();
let iy=5,policy="term";
function insurance(){
 const a=M.project(p,"draw",iy).at(-1),b=M.project(p,policy==="term"?"drawTerm":"drawPerm",iy).at(-1),d=b.wealth-a.wealth,cost=a.wealth-(b.wealth-b.payout),term=policy==="term";
 const end=term?p.term:b.lapseYear?b.lapseYear-1:30;
 const status=b.lapseYear?"Policy lapsed in year "+b.lapseYear+".":b.payout>0?"Death while policy is active.":"Term expired. No death benefit.";
 $("insurance-result").innerHTML='<p class="small-label">Age '+(p.age+iy)+' · '+iy+' years after buying insurance</p><div class="coverage-track" aria-hidden="true"><div class="coverage-active" style="width:'+pct(Math.min(30,end),30)+'"></div><div class="death-marker" style="left:'+pct(iy,30)+'"></div></div><div class="coverage-label"><span>67 · start</span><span>97</span></div><p class="note">'+(term?"10-year coverage ends around age 77.":"Permanent coverage continues if premiums are maintained.")+' Marker: selected death age '+(p.age+iy)+'.</p>'+metric("Estimated tax at death",b.terminalTax,"tax-metric","The tax is still owed")+metric("Insurance pays the family",b.payout,"good-metric",status)+'<div class="equation">'+line("Monthly premium",term?p.termPremium:p.permPremium)+line("Total premiums paid",b.paid,"tax-text")+line("Cost including foregone growth and extra taxes",cost,"tax-text")+'</div><div class="rule"></div><h3>What the family ends up with</h3>'+bar("Without insurance",a.wealth,Math.max(a.wealth,b.wealth),"neutral")+bar("With insurance",b.wealth,Math.max(a.wealth,b.wealth))+metric(d>=0?"Insurance leaves the family more":"Insurance leaves the family less",Math.abs(d),d>=0?"good-metric":"tax-metric","After premiums and their investment opportunity cost")+'<p class="note">Same $60,000 withdrawal plan and 5% return. Death in year 10 is assumed just before the term expires.</p>';
}
bind("insurance-type","policy",v=>{policy=v;insurance();});bind("insurance-years","year",v=>{iy=Number(v);insurance();});insurance();
let cy=10,mode="equal8";
function composition(label,q,max){
 const parts=[["RRSP after tax",q.registeredNet,"registered"],["Children’s investments",q.tfsa+q.taxable,"gifted"],["Linda’s remaining cash",q.reserve,"reserve"],["Insurance payout",q.payout,"insured"]];
 return '<div class="scenario-block"><h3>'+label+'</h3><div class="stacked-wealth" aria-hidden="true">'+parts.map(([k,v,c])=>'<div class="wealth-part '+c+'" style="width:'+pct(v,max)+'"></div>').join("")+'</div>'+parts.map(([k,v,c])=>'<div class="money-line"><span><i class="swatch '+c+'" aria-hidden="true"></i>'+k+'</span><strong>'+fmt(v)+'</strong></div>').join("")+'<div class="rule"></div>'+metric("Total family wealth",q.wealth,"good-metric")+'<p class="note">RRSP tax at death: '+fmt(q.terminalTax)+' · premiums paid: '+fmt(q.paid)+(q.lapseYear?" · policy lapsed in year "+q.lapseYear:"")+'.</p></div>';
}
function combined(){
 const mixed=mode==="mixed",r=mode==="equal5"?5:8,q={...p,drawReturn:mixed?3:r,holdReturn:r,tfsaReturn:mixed?3:r,taxableReturn:(mixed?3:r)-1};
 const a=M.project(q,"draw",cy).at(-1),b=M.project(q,"holdTerm",cy).at(-1),no=M.project(q,"hold",cy).at(-1),max=Math.max(a.wealth,b.wealth),d=b.wealth-a.wealth;
 $("combined-result").innerHTML='<p class="small-label">Age '+(p.age+cy)+' · '+cy+' years later</p>'+(mixed?'<p class="warning">This also changes portfolio returns, so it does not isolate the effect of the withdrawal strategy.</p>':'<p class="note">Both RRSP strategies and the children’s TFSAs earn '+r+'% per year. Taxable investments earn one percentage point less.</p>')+composition("Plan A · Withdraw $60,000 annually, no insurance",a,max)+composition("Plan B · Keep more invested, buy 10-year term",b,max)+metric(d>=0?"Plan B leaves more":"Plan A leaves more",Math.abs(d),"good-metric","Difference in total after-tax family wealth")+'<p class="takeaway">'+(b.payout?"Insurance pays "+fmt(b.payout)+". ":"Term has expired; insurance pays nothing. ")+(b.coverageGap?"Remaining RRSP tax not covered by insurance: "+fmt(b.coverageGap)+".":"Insurance covers the modeled remaining RRSP tax.")+'</p>'+line("Effect of insurance alone versus holding without insurance",b.wealth-no.wealth,b.wealth>=no.wealth?"good-text":"tax-text")+'<p class="note">The policy benefit is fixed even if the registered account grows. Returns are illustrations, not predictions.</p>';
}
bind("combo-rates","mode",v=>{mode=v;combined();});bind("combo-years","year",v=>{cy=Number(v);combined();});combined();
// Navigation is separate from the reading rail. Keep the active chapter visible.
const toc=$("article-toc"), links=Array.from(toc.querySelectorAll("a[href^='#']")),sections=links.map(a=>$(a.getAttribute("href").slice(1))).filter(Boolean);
let scheduled=false;
function mark(){scheduled=false;let current=sections[0];for(const section of sections){if(section.getBoundingClientRect().top<=140)current=section;else break;}for(const a of links){if(a.getAttribute("href")==="#"+current.id)a.setAttribute("aria-current","location");else a.removeAttribute("aria-current");}}
window.addEventListener("scroll",()=>{if(!scheduled){scheduled=true;window.requestAnimationFrame(mark);}},{passive:true});
window.addEventListener("resize",mark);mark();
for(const a of links)a.addEventListener("click",()=>{const details=$("mobile-contents");if(details&&details.open)details.open=false;});
})();
