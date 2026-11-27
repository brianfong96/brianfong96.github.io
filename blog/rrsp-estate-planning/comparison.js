/* The narrative examples deliberately use Linda's fixed baseline.
   The independent full comparison uses the reader's own inputs. */
(()=>{
"use strict";
const M=RRSPModel, $=id=>document.getElementById(id), base={...M.defaults};
const cash=n=>Math.round(n).toLocaleString("en-CA",{style:"currency",currency:"CAD",maximumFractionDigits:0});
const sign=n=>(n>0?"+":"")+cash(n);
const yearLabel=(n,p=base)=>"Age "+(p.age+n)+" · "+n+" year"+(n===1?"":"s");
const keys=Object.keys(M.names);
const names={gift:"Original annual gift strategy",draw:"Withdraw more each year",drawTerm:"Withdraw more + term insurance",hold:"Keep more in RRSP",holdTerm:"Keep more in RRSP + term",drawPerm:"Withdraw more + permanent insurance"};
const line=(label,value,cls="")=>'<div class="money-line '+cls+'"><span>'+label+'</span><strong>'+cash(value)+'</strong></div>';
const bar=(label,value,max,tone="blue")=>'<div class="measure"><div class="money-line"><span>'+label+'</span><strong>'+cash(value)+'</strong></div><div class="track" aria-hidden="true"><div class="fill '+tone+'" style="width:'+Math.max(0,Math.min(100,100*value/Math.max(1,max)))+'%"></div></div></div>';
const split=(gross,tax)=>'<div class="track split" aria-hidden="true"><div class="fill good" style="width:'+100*(gross-tax)/Math.max(1,gross)+'%"></div><div class="fill tax" style="width:'+100*tax/Math.max(1,gross)+'%"></div></div>';
function pressed(group,attribute,value){for(const b of $(group).querySelectorAll("button"))b.setAttribute("aria-pressed",String(b.dataset[attribute]===String(value)));}
function buttons(group,attribute,callback){$(group).addEventListener("click",e=>{const b=e.target.closest("button");if(!b||!b.dataset[attribute])return;pressed(group,attribute,b.dataset[attribute]);callback(b.dataset[attribute]);});}
const fields=[
 ["age","Current age",50,85,1,"years"],["balance","RRSP savings",0,10000000,1000,"CAD"],["pension","Other income before tax, per year",0,500000,1000,"CAD"],["draw","Larger planned RRSP withdrawal per year",0,500000,1000,"CAD"],["hold","Smaller planned RRSP withdrawal per year",0,500000,1000,"CAD"],
 ["drawReturn","RRSP return: larger withdrawals",-20,25,.5,"%"],["holdReturn","RRSP return: smaller withdrawals",-20,25,.5,"%"],["tfsaReturn","Children's TFSA investment return",-20,25,.5,"%"],["taxableReturn","Children's taxable investment return after tax",-20,25,.5,"%"],
 ["coverage","Insurance death benefit",0,5000000,10000,"CAD"],["term","Term length",1,30,1,"years"],["termPremium","Term premium per month",0,20000,25,"CAD"],["permPremium","Permanent premium per month",0,20000,25,"CAD"],
 ["reserve","Linda's initial retained cash reserve",0,5000000,1000,"CAD"],["shortfall","Annual spending not covered by other income",0,500000,1000,"CAD"],["room","Combined new TFSA room for the children per year",0,100000,1000,"CAD"],["carry","Children's existing unused TFSA room",0,1000000,1000,"CAD"],["oas","OAS included in other annual income",0,20000,100,"CAD"],["reserveReturn","Cash reserve return",0,15,.5,"%"],["shock","First-year market decline (0 for no shock)",-90,0,5,"%"],["inflation","Annual inflation",0,15,.5,"%"]];
const tips={draw:"Before income tax. Mandatory minimum withdrawals can exceed this.",hold:"Zero means take only mandatory withdrawals or extra money needed for bills.",pension:"Include CPP, OAS and other taxable pension income.",coverage:"The same face amount is used for term and permanent examples.",term:"No renewal after the selected term. Longer terms may not be available at this age.",room:"Use only genuinely unused room. Excess gifts go into taxable investments.",shortfall:"An after-tax spending gap. The pension itself is not accumulated as estate wealth.",shock:"Replaces the normal first-year return; subsequent years use the selected return."};
for(const [id,label,min,max,step,unit] of fields){
 const wrap=document.createElement("div");wrap.className="field";
 const lab=document.createElement("label");lab.htmlFor=id;lab.textContent=label+" ("+unit+")";wrap.append(lab);
 const input=document.createElement("input");Object.assign(input,{id,type:"number",inputMode:step<1?"decimal":"numeric",min,max,step,value:base[id],required:true});wrap.append(input);
 if(tips[id]){const hint=document.createElement("p");hint.id=id+"-hint";hint.className="note";hint.textContent=tips[id];input.setAttribute("aria-describedby",hint.id);wrap.append(hint);}
 $(["balance","age","pension","draw"].includes(id)?"basic-fields":["coverage","term","termPremium","permPremium"].includes(id)?"insurance-fields":["drawReturn","holdReturn","tfsaReturn","taxableReturn","shock"].includes(id)?"return-fields":"other-fields").append(wrap);
}
const pairs={timing:["draw","hold"],termDraw:["draw","drawTerm"],termHold:["hold","holdTerm"],combined:["draw","holdTerm"],permanent:["drawTerm","drawPerm"],original:["gift","draw"]};
let horizon=10,pair="timing",portfolio=5;
function params(){
 const p={...base,province:$("province").value};
 for(const [id,label,min,max] of fields){const n=$(id).valueAsNumber;if(!Number.isFinite(n)||n<min||n>max)throw Error(label+": enter a number between "+min+" and "+max+".");p[id]=n;}
 if(p.oas>p.pension)throw Error("OAS cannot exceed the other annual income. Adjust OAS in the detailed settings.");
 return p;
}
function describe(k,p){
 const s=M.scenario(k,p);
 if(k==="gift")return "Aim to gift "+cash(p.room)+" a year before mandatory minimums.";
 return "Plan to withdraw "+cash(s.gross)+"/year before minimums; "+(s.rate*100).toFixed(1)+"% RRSP return"+(s.policy==="term"?"; "+p.term+"-year term":s.policy==="permanent"?"; permanent insurance":"; no insurance")+".";
}
function table(el,head,rows){el.innerHTML="<thead><tr>"+head.map(x=>'<th scope="col">'+x+"</th>").join("")+"</tr></thead><tbody>"+rows.map(r=>"<tr>"+r.map((x,i)=>i?'<td>'+x+'</td>':'<th scope="row">'+x+'</th>').join("")+"</tr>").join("")+"</tbody>";}
function render(){
 try{
 const p=params();$("calc-error").textContent="";
 const all=Object.fromEntries(keys.map(k=>[k,M.project(p,k,30)])), [a,b]=pairs[pair], x=all[a][horizon-1],y=all[b][horizon-1],delta=y.wealth-x.wealth;
 const max=Math.max(x.wealth,y.wealth,1);
 $("assumptions-summary").textContent=cash(p.balance)+" starting RRSP · "+p.province+" · "+p.drawReturn+"% / "+p.holdReturn+"% registered returns · "+cash(p.reserve)+" retained reserve";
 $("answer").innerHTML='<p class="small-label">'+yearLabel(horizon,p)+'</p>'+bar(names[a],x.wealth,max,"neutral")+'<p class="note">'+describe(a,p)+'</p>'+bar(names[b],y.wealth,max,"good")+'<p class="note">'+describe(b,p)+'</p><div class="rule"></div><p class="small-label">Difference in total family wealth (second plan minus first)</p><div class="big '+(delta<0?"tax-text":"good-text")+'">'+sign(delta)+'</div><p>'+ (Math.abs(delta)<1?"The strategies have essentially the same modeled outcome.":(delta>0?names[b]:names[a])+" leaves "+cash(Math.abs(delta))+" more under these assumptions.")+'</p>'+(!x.funded||!y.funded?'<p class="warning">At least one scenario has unmet spending or lapsed coverage. A larger inheritance does not make an unfunded plan viable.</p>':'')+'<p class="note">Includes gifts already invested by the children and Linda’s remaining assets, after terminal income tax. Not all of this is an inheritance paid at death.</p>';
 $("pair-breakdown").innerHTML=[a,b].map(k=>{const q=all[k][horizon-1];return '<div class="accounting"><h4>'+names[k]+'</h4>'+line("RRSP remaining before tax",q.reg)+line("Less: RRSP tax at death",q.terminalTax,"tax-text")+line("RRSP after tax",q.registeredNet)+line("Plus: children's TFSA investments",q.tfsa)+line("Plus: children's taxable investments",q.taxable)+line("Plus: Linda's remaining cash",q.reserve)+line("Plus: insurance payout",q.payout,"good-text")+'<div class="rule"></div>'+line("Total family wealth",q.wealth,"good-text")+line("In today's dollars",q.wealth/Math.pow(1+p.inflation/100,horizon))+ '<p class="note">Lifetime withdrawal tax: '+cash(q.taxes)+' · Premiums paid: '+cash(q.paid)+'.'+(q.lapseYear?" Policy lapsed in year "+q.lapseYear+".":"")+(q.unmet>0?" Unmet spending: "+cash(q.unmet)+".":"")+'</p></div>';}).join("");
 $("timeline").innerHTML=[1,5,10,20,30].map(n=>{const q=all[a][n-1],r=all[b][n-1],m=Math.max(1,...[1,5,10,20,30].flatMap(i=>[all[a][i-1].wealth,all[b][i-1].wealth]));return '<div class="timeline-item"><p class="small-label">'+yearLabel(n,p)+'</p>'+bar(names[a],q.wealth,m,"neutral")+bar(names[b],r.wealth,m,"good")+'<p class="note">Difference: '+sign(r.wealth-q.wealth)+(q.funded&&r.funded?"":" · funding warning")+'</p></div>';}).join("");
 const selected=keys.map(k=>({k,...all[k][horizon-1]}));$("all-strategies").innerHTML=selected.map(q=>bar(names[q.k],q.wealth,Math.max(1,...selected.map(i=>i.wealth)),q.funded?"blue":"tax")+(q.funded?"":'<p class="warning">Unfunded spending or lapsed policy.</p>')).join("");
 const q=all[$("ledger-strategy").value];table($("ledger"),["Age","Gross withdrawal","Withdrawal tax","Premium","Gift","RRSP left","Tax at death","Total wealth"],q.slice(0,horizon).map(v=>[v.age,...[v.w,v.annualTax,v.premium,v.gifted,v.reg,v.terminalTax,v.wealth].map(cash)]));
 }catch(e){$("calc-error").textContent=e.message;$("answer").innerHTML='<p>Correct the inputs above to see results.</p>';for(const id of ["pair-breakdown","timeline","all-strategies","ledger"])$(id).innerHTML="";}
}
for(const k of keys){const opt=document.createElement("option");opt.value=k;opt.textContent=names[k];$("ledger-strategy").append(opt);}
$("ledger-strategy").value="draw";
buttons("calc-pairs","pair",v=>{pair=v;render();});
buttons("calc-years","year",v=>{horizon=Number(v);render();});
buttons("calc-rates","rate",v=>{portfolio=Number(v);for(const id of ["drawReturn","holdReturn","tfsaReturn"])$(id).value=portfolio;$("taxableReturn").value=portfolio-1;render();});
$("calculator-form").addEventListener("submit",e=>e.preventDefault());
$("calculator-form").addEventListener("input",e=>{if(["drawReturn","holdReturn","tfsaReturn","taxableReturn"].includes(e.target.id))pressed("calc-rates","rate","custom");render();});
$("ledger-strategy").addEventListener("change",render);
$("reset").addEventListener("click",()=>{for(const [id] of fields)$(id).value=base[id];$("province").value=base.province;horizon=10;pair="timing";portfolio=5;pressed("calc-years","year",horizon);pressed("calc-pairs","pair",pair);pressed("calc-rates","rate",portfolio);render();});
render();
})();