/* RRSP estate planning: pure deterministic model, 2026 Canadian tax approximations. */
const RRSPModel = (function buildModel(){
  "use strict";
  const federal=[[0,.14],[58523,.205],[117045,.26],[181440,.29],[258482,.33]];
  const provincial={ON:[[0,.0505],[53891,.0915],[107785,.1116],[150000,.1216],[220000,.1316]],BC:[[0,.056],[50363,.077],[100728,.105],[115648,.1229],[140430,.147],[190405,.168],[265545,.205]]};
  const factors=[.054,.0553,.0567,.0582,.0598,.0617,.0636,.0658,.0682,.0708,.0738,.0771,.0808,.0851,.0899,.0955,.1021,.1099,.1192,.1306,.1449,.1634,.1879,.20];
  const sum=(brackets,x)=>brackets.reduce((s,[lo,r],i)=>s+Math.max(0,Math.min(x,brackets[i+1]?.[0]??Infinity)-lo)*r,0);
  const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
  // Illustrative 2026 income tax; basic credits, Ontario surtax/health premium, and OAS recovery.
  function tax(income,p){
    income=Math.max(0,income);
    const oas=clamp((income-95323)*.15,0,Math.min(p.oas,p.pension));
    const x=Math.max(0,income-oas);
    const bpa=16452-1623*clamp((x-181440)/(258482-181440),0,1);
    const fed=Math.max(0,sum(federal,x)-bpa*.14);
    const bc=p.province==="BC";
    let prov=Math.max(0,sum(provincial[bc?"BC":"ON"],x)-(bc?13216*.056:12989*.0505));
    if(!bc){
      prov+=.20*Math.max(0,prov-5818)+.36*Math.max(0,prov-7446);
      prov-=clamp(600-prov,0,prov);
      prov+=x<=20000?0:x<=36000?Math.min(300,(x-20000)*.06):x<=48000?Math.min(450,300+(x-36000)*.06):x<=72000?Math.min(600,450+(x-48000)*.25):x<=200000?Math.min(750,600+(x-72000)*.25):Math.min(900,750+(x-200000)*.25);
    }
    return {total:fed+prov+oas, recovery:oas};
  }
  function extraTax(withdrawal,p){
    return Math.max(0,tax(p.pension+withdrawal,p).total-tax(p.pension,p).total);
  }
  const net=(w,p)=>w-extraTax(w,p);
  function grossForNet(target,p){
    if(target<=0)return 0;
    let lo=0,hi=Math.max(1,target*5+10000);
    for(let i=0;i<55;i++){const m=(lo+hi)/2;if(net(m,p)<target)lo=m;else hi=m;}
    return hi;
  }
  const minFactor=age=>age<72?0:factors[Math.min(age-72,factors.length-1)];
  const names={gift:"Infographic: fund TFSAs",draw:"Faster withdrawals",drawTerm:"Faster + term",hold:"Keep RRSP invested",holdTerm:"Keep invested + term",drawPerm:"Faster + permanent"};
  const defaults={age:67,balance:650000,pension:35000,oas:9000,province:"ON",reserve:50000,shortfall:0,room:14000,carry:0,draw:60000,hold:0,drawReturn:5,holdReturn:5,tfsaReturn:5,taxableReturn:4,reserveReturn:2,shock:0,coverage:350000,term:10,termPremium:225,permPremium:1100,inflation:2,years:20};
  function scenario(key,p){
    const hold=key==="hold"||key==="holdTerm";
    return {key,name:names[key],gross:key==="gift"?grossForNet(p.room+p.shortfall,p):hold?p.hold:p.draw,rate:(hold?p.holdReturn:p.drawReturn)/100,policy:key==="drawTerm"||key==="holdTerm"?"term":key==="drawPerm"?"permanent":"none"};
  }
  function project(p,key,years=30){
    const s=scenario(key,p);
    let reg=p.balance, reserve=p.reserve, tfsa=0, taxable=0, room=p.carry;
    let paid=0, taxes=0, gifts=0, unmet=0, lapseYear=null, policyActive=s.policy!=="none";
    const rows=[];
    for(let y=1;y<=years;y++){
      const age=p.age+y-1, start=reg;
      const shock=y===1&&p.shock!==0?p.shock/100:null;
      reg=Math.max(0,reg*(1+(shock??s.rate)));
      tfsa=Math.max(0,tfsa*(1+(shock??p.tfsaReturn/100)));
      taxable=Math.max(0,taxable*(1+(shock??p.taxableReturn/100)));
      reserve=Math.max(0,reserve*(1+p.reserveReturn/100));
      room+=p.room;
      const termInForce=s.policy==="term"&&y<=p.term;
      const due=policyActive?(s.policy==="permanent"?p.permPremium*12:termInForce?p.termPremium*12:0):0;
      const min=start*minFactor(age);
      // Extra withdrawals only when planned cash cannot fund spending/premiums.
      // Use retained reserve after the planned withdrawal, before taking an extra taxable withdrawal.
      const target=Math.min(reg,Math.max(s.gross,min));
      const additionalNeed=Math.max(0,p.shortfall+due-reserve);
      const w=Math.min(reg,Math.max(target,grossForNet(additionalNeed,p)));
      reg=Math.max(0,reg-w);
      const annualTax=extraTax(w,p);
      taxes+=annualTax;
      let cash=Math.max(0,w-annualTax);
      const spend=Math.min(p.shortfall,cash+reserve);
      const fromCash=Math.min(cash,spend);
      cash-=fromCash;reserve-=spend-fromCash;
      const deficit=p.shortfall-spend;unmet+=deficit;
      let premium=0;
      if(due>0){
        if(cash+reserve+1e-6>=due){
          premium=due;const use=Math.min(cash,premium);cash-=use;reserve=Math.max(0,reserve-(premium-use));paid+=premium;
        }else{policyActive=false;lapseYear=y;}
      }
      // Never reclaim children's gifts; reserve remains under the retiree's control.
      const gifted=Math.max(0,cash);gifts+=gifted;
      const t=Math.min(room,gifted);room-=t;tfsa+=t;taxable+=gifted-t;
      const terminalTax=Math.max(0,tax(p.pension+w+reg,p).total-tax(p.pension+w,p).total);
      const payout=policyActive&&(s.policy==="permanent"||termInForce)?p.coverage:0;
      const registeredNet=Math.max(0,reg-terminalTax);
      const wealth=registeredNet+reserve+tfsa+taxable+payout;
      rows.push({year:y,age:p.age+y,reg,reserve,tfsa,taxable,room,w,annualTax,terminalTax,registeredNet,premium,paid,taxes,gifted,gifts,payout,wealth,min:Math.min(reg+w,min),unmet,lapseYear,coverageGap:Math.max(0,terminalTax-payout),funded:unmet<.01&&lapseYear===null});
    }
    return rows;
  }
  return {tax,extraTax,net,grossForNet,minFactor,project,scenario,names,defaults};
})();
