/* Vehicle rental detail: timeline, date validation and illustrative discounts.
   Assumed daily reference and discounts require owner confirmation. */
(function(){
"use strict";
const D=86400000;
const plans={Daily:{min:1,off:0},Weekly:{min:7,off:.10},Monthly:{min:30,off:.15}};
const selection={pickup:"",returnDate:"",phase:"pickup",initialized:false};
function stamp(s){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(s||""))return null;
 const p=s.split("-").map(Number),ms=Date.UTC(p[0],p[1]-1,p[2]),d=new Date(ms);
 return d.getUTCFullYear()===p[0]&&d.getUTCMonth()+1===p[1]&&d.getUTCDate()===p[2]?ms:null;
}
function days(a,b){const x=stamp(a),y=stamp(b);return x===null||y===null?0:Math.round((y-x)/D);}
function money(v){return CFG.currency+" "+Math.round(v).toLocaleString("en-AE");}
function rateMoney(v){return CFG.currency+" "+Number(v).toLocaleString("en-AE",{minimumFractionDigits:Number.isInteger(v)?0:2,maximumFractionDigits:2});}
function periodPrice(rate,period){
 if(rate===null)return null;
 return rate*(period==="Weekly"?7:period==="Monthly"?30:1);
}
function periodSuffix(period){return period==="Weekly"?"/week":period==="Monthly"?"/30 days":"/day";}
function math(car){
 const period=plans[ui.period]?ui.period:"Daily",plan=plans[period];
 const daysCount=days(selection.pickup,selection.returnDate);
 const both=!!(selection.pickup&&selection.returnDate);
 const datesValid=both&&stamp(selection.pickup)>=stamp(dateISO())&&daysCount>0;
 const valid=datesValid&&daysCount>=plan.min;
 const unit=car.rate!=null&&Number.isFinite(car.rate)?car.rate:null;
 const gross=valid&&unit!==null?unit*daysCount:null;
 const saved=gross===null?null:gross*plan.off;
 const planUnit=unit===null?null:unit*(1-plan.off);
 return {period,plan,daysCount,both,datesValid,valid,unit,planUnit,gross,saved,total:gross===null?null:gross-saved};
}
function datesTimeline(){
 const start=stamp(dateISO());
 return "<div class='sr-vdetail-timeline' role='group' aria-label='Quick select pickup and return dates'>"+
 Array.from({length:21},(_,i)=>{
  const dt=new Date(start+i*D),value=dt.toISOString().slice(0,10);
  const name=dt.toLocaleDateString("en",{timeZone:"UTC",weekday:"short"});
  const pickup=selection.pickup===value,ret=selection.returnDate===value;
  const between=selection.pickup&&selection.returnDate&&value>selection.pickup&&value<selection.returnDate;
  return "<button type='button' data-sr-quick-date='"+value+"' class='sr-vdetail-date"+
   (pickup?" is-pickup":"")+(ret?" is-return":"")+(between?" is-between":"")+
   "' aria-pressed='"+String(pickup||ret)+"' aria-label='"+name+" "+value+"'><span>"+name+"</span><strong>"+dt.getUTCDate()+"</strong></button>";
 }).join("")+"</div>";
}
function field(key,label){
 return "<label class='sr-vdetail-date-field'><span>"+label+"</span><input type='date' data-sr-date='"+key+
 "' min='"+dateISO()+"' value='"+esc(selection[key])+"' aria-label='"+label+"'></label>";
}
function detailV2(){
 const c=cars.find(x=>x.id===ui.selected)||cars[0];
 if(!selection.initialized){selection.initialized=true;
  if(ui.pickup&&ui.returnDate){selection.pickup=ui.pickup;selection.returnDate=ui.returnDate;selection.phase="pickup";}
 }
 const p=math(c);
 const other=cars.filter(x=>x.category===c.category&&x.id!==c.id).slice(0,5);
 const message=!p.both?"Select your dates to get your rental estimate.":
 !p.datesValid?"Choose a future pick-up date and a later return date.":
 p.daysCount<p.plan.min?p.period+" requires at least "+p.plan.min+" days. Adjust your dates or choose another plan.":"Ready to ask the rental team to check availability and provide a quote.";
 const photos="<img src='"+esc(c.photo)+"' alt='"+esc(c.name)+"' loading='eager' decoding='async' onerror=\"this.hidden=true\">";
 const related=other.map(o=>"<button type='button' data-action='details' data-id='"+esc(o.id)+"' class='sr-vdetail-related-card'>"+
  "<span class='sr-vdetail-related-photo'>"+carImg(o)+"</span><strong>"+esc(o.name)+"</strong>"+
  "<small>"+(o.rate===null?"Rate on request":money(o.rate))+"</small></button>").join("");
 const periodButtons=["Daily","Weekly","Monthly"].map(k=>{
 const discount=plans[k].off;
 const rate=p.unit===null?null:p.unit*(1-discount);
 const price=periodPrice(rate,k);
 const label=price===null?"Ask for rate":rateMoney(price);
 return "<button type='button' data-action='period' data-period='"+k+
  "' class='sr-vdetail-period"+(p.period===k?" is-selected":"")+"' aria-pressed='"+String(p.period===k)+
  "' aria-label='"+k+" rental, "+Math.round(discount*100)+" percent discount, "+label+" "+periodSuffix(k)+"'>"+
  "<strong>"+k+"</strong><small>"+(discount?"−"+Math.round(discount*100)+"%":"Regular")+"</small>"+
  "<span class='sr-vdetail-tab-price'><b>"+esc(label)+"</b><i>"+periodSuffix(k)+"</i></span></button>";
 }).join("");
 const breakdown=p.valid&&p.total!==null?
  "<div class='sr-vdetail-estimate-line'><span>Estimated saving</span><b>"+money(p.saved)+"</b></div>"+
  "<div class='sr-vdetail-estimate-total'><span>Estimated rental total</span><strong>"+money(p.total)+"</strong></div>":
  "<div class='sr-vdetail-estimate-total'><span>Estimated rental total</span><strong>"+(p.valid?"Rate on request":"—")+"</strong></div>";
 return "<main class='container inner-main sr-vdetail sr-vdetail-v2'>"+
  "<nav class='sr-vdetail-back'><a href='#fleet'>"+icon("back",17)+" Explore cars</a><span>"+esc(c.category)+"</span></nav>"+
  "<div class='sr-vdetail-layout'><div class='sr-vdetail-gallery-col'>"+
    "<header class='sr-vdetail-header'><span class='sr-vdetail-eyebrow'>"+esc(c.category)+" · CAR RENTAL IN "+esc(CFG.city.toUpperCase())+"</span>"+
    "<h1>"+esc(c.name)+"</h1><p>"+icon("pin",15)+" "+esc(CFG.city)+", "+esc(CFG.country)+"</p></header>"+
    "<figure class='sr-vdetail-gallery'><div class='sr-vdetail-photo'>"+photos+"</div>"+
      "<figcaption>Vehicle image for reference · Please confirm the exact specification</figcaption></figure></div>"+
  "<div class='sr-vdetail-details-col'>"+
    "<section class='sr-vdetail-rate sr-vdetail-rate-compact' aria-label='Selected rental rate'>"+
      "<div class='sr-vdetail-rate-compact-main'><span>"+esc(p.period)+" rate <small>"+(p.plan.off?Math.round(p.plan.off*100)+"% less than the Daily plan":"Daily reference price")+"</small></span>"+
      "<strong>"+(p.planUnit===null?"Ask for rate":rateMoney(periodPrice(p.planUnit,p.period)))+" <em>"+periodSuffix(p.period)+"</em></strong></div>"+
      (p.plan.off&&p.unit!==null?"<div class='sr-vdetail-rate-compare'>Equivalent to "+rateMoney(p.planUnit)+" /day · Daily reference "+rateMoney(p.unit)+" /day</div>":"")+
    "</section>"+
    "<section class='sr-vdetail-options'><div class='sr-vdetail-section-title'><h2>Rental plan</h2><span>Select a plan</span></div>"+
      "<div class='sr-vdetail-periods' role='group' aria-label='Rental plan'>"+periodButtons+"</div>"+
      "<p class='sr-vdetail-period-note'>Weekly is 10% below the Daily rate (7+ days). Monthly is 15% below Daily (30+ days). Estimates subject to confirmation.</p></section>"+
    "<section class='sr-vdetail-dates' aria-label='Select rental dates'>"+
      "<div class='sr-vdetail-section-title'><h2>Select rental dates</h2><span>Pick-up → Return</span></div>"+
      "<div class='sr-vdetail-date-fields'>"+field("pickup","Pick-up date")+field("returnDate","Return date")+"</div>"+
      "<div class='sr-vdetail-date-select'><span>Tap a date to select "+(selection.phase==="pickup"?"pick-up":"return")+"</span>"+
      "<button type='button' data-sr-clear-dates>Clear</button></div>"+
      datesTimeline()+"</section>"+
    "<section class='sr-vdetail-estimate sr-vdetail-estimate-compact' aria-label='Rental estimate' aria-live='polite'>"+
      "<div class='sr-vdetail-estimate-top'><span>"+(p.datesValid?p.daysCount+" day"+(p.daysCount===1?"":"s")+" · "+p.period:"Rental estimate")+"</span><small>"+(p.plan.off?Math.round(p.plan.off*100)+"% saving":"Standard rate")+"</small></div>"+
      "<div class='sr-vdetail-estimate-total'><span>Estimated total</span><strong>"+(p.valid?(p.total!==null?money(p.total):"On request"):"—")+"</strong></div>"+
      "<p>Estimate only. Listed amounts are assumed daily references; discounts and final charges require confirmation.</p></section>"+
    "<p class='sr-vdetail-date-feedback"+(p.both&&!p.valid?" is-error":"")+"' aria-live='polite'>"+esc(message)+"</p>"+
  "</div></div>"+
  "<div class='sr-vdetail-disclosure'>"+icon("shield",17)+"<span>No automatic booking or payment. Availability and final terms are confirmed by the rental team.</span></div>"+
  (related?"<section class='sr-vdetail-related'><div class='sr-vdetail-related-heading'><h2>Similar cars</h2><a href='#fleet'>View all "+icon("arrow",15)+"</a></div>"+
   "<div class='sr-vdetail-related-track'>"+related+"</div></section>":"")+
  "<div class='sr-vdetail-cta-bar' aria-label='Enquiry actions'>"+
    "<button type='button' class='sr-vdetail-cta-primary' data-action='quote-inquiry' data-model='"+esc(c.name)+
    "' data-car-type='"+esc(c.category)+"' data-period='"+p.period+"' data-pickup='"+esc(selection.pickup)+
    "' data-return-date='"+esc(selection.returnDate)+"'"+
    (p.valid&&p.total!==null?" data-estimate='"+esc(money(p.total))+"'":"")+
    (!p.valid?" disabled aria-disabled='true' title='Select valid dates and duration first'":"")+
    ">Check Availability &amp; Get Quote "+icon("arrow",18)+"</button>"+
    "<button type='button' class='sr-vdetail-cta-whatsapp' data-sr-whatsapp-detail data-id='"+esc(c.id)+"' data-model='"+esc(c.name)+
    "' data-pickup='"+esc(selection.pickup)+"' data-return-date='"+esc(selection.returnDate)+"' data-period='"+p.period+"'"+
    (p.valid&&p.total!==null?" data-estimate='"+esc(money(p.total))+"'":"")+">"+
      icon("message",20)+"<span>"+(p.datesValid?"Send Dates":"WhatsApp")+"</span></button></div></main>";
}
detail=detailV2;
document.addEventListener("click",function(e){
 const cell=e.target.closest("[data-sr-quick-date]");
 if(cell&&ui.page==="detail"){
  e.preventDefault();
  const value=cell.dataset.srQuickDate;
  if(selection.phase==="pickup"){
   selection.pickup=value;
   if(selection.returnDate&&selection.returnDate<=value)selection.returnDate="";
   selection.phase="return";
  }else{
   if(value<=selection.pickup){selection.pickup=value;selection.returnDate="";selection.phase="return";}
   else{selection.returnDate=value;selection.phase="pickup";}
  }
  render(false);return;
 }
 if(e.target.closest("[data-sr-clear-dates]")&&ui.page==="detail"){
  e.preventDefault();selection.pickup="";selection.returnDate="";selection.phase="pickup";render(false);
 }
});
document.addEventListener("change",function(e){
 const el=e.target.closest("[data-sr-date]");
 if(!el||ui.page!=="detail")return;
 selection[el.dataset.srDate]=el.value;
 selection.phase=el.dataset.srDate==="pickup"?"return":"pickup";
 render(false);
});
document.addEventListener("click",function(e){
 const btn=e.target.closest("[data-sr-whatsapp-detail]");
 if(!btn||ui.page!=="detail")return;
 e.preventDefault();
 e.stopPropagation();
 const phone=String(CFG.whatsappNumber||"").replace(/\D/g,"");
 if(!phone)return;
 const lines=["Hello "+CFG.businessName+",",
  "I would like to enquire about "+(btn.dataset.model||"a rental car")+".",
  ...(btn.dataset.pickup?["Pick-up: "+btn.dataset.pickup]:[]),
  ...(btn.dataset.returnDate?["Return: "+btn.dataset.returnDate]:[]),
  ...(btn.dataset.pickup&&btn.dataset.returnDate?["Preferred plan: "+(btn.dataset.period||"Daily")]:[]),
  ...(btn.dataset.estimate?["Estimated total: "+btn.dataset.estimate+" (subject to confirmation)"]:[]),
  "Please confirm availability, the rental rate, deposit and insurance terms."];
 window.open("https://wa.me/"+phone+"?text="+encodeURIComponent(lines.join("\n")),"_blank","noopener,noreferrer");
},true);
if(ui.page==="detail")render(false);
})();