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
function math(car){
 const period=plans[ui.period]?ui.period:"Daily",plan=plans[period];
 const daysCount=days(selection.pickup,selection.returnDate);
 const both=!!(selection.pickup&&selection.returnDate);
 const datesValid=both&&stamp(selection.pickup)>=stamp(dateISO())&&daysCount>0;
 const valid=datesValid&&daysCount>=plan.min;
 const unit=car.rate!=null&&Number.isFinite(car.rate)?car.rate:null;
 const gross=valid&&unit!==null?unit*daysCount:null;
 const saved=gross===null?null:gross*plan.off;
 return {period,plan,daysCount,both,datesValid,valid,unit,gross,saved,total:gross===null?null:gross-saved};
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
 const message=!p.both?"Select your pick-up and return dates to enable quotation.":
 !p.datesValid?"Choose a future pick-up date and a later return date.":
 p.daysCount<p.plan.min?p.period+" plan requires at least "+p.plan.min+" rental days.":"You can now request a quotation for these dates.";
 const photos="<img src='"+esc(c.photo)+"' alt='"+esc(c.name)+"' loading='eager' decoding='async' onerror=\"this.hidden=true\">";
 const related=other.map(o=>"<button type='button' data-action='details' data-id='"+esc(o.id)+"' class='sr-vdetail-related-card'>"+
  "<span class='sr-vdetail-related-photo'>"+carImg(o)+"</span><strong>"+esc(o.name)+"</strong>"+
  "<small>"+(o.rate===null?"Rate on request":money(o.rate))+"</small></button>").join("");
 const periodButtons=["Daily","Weekly","Monthly"].map(k=>"<button type='button' data-action='period' data-period='"+k+
  "' class='sr-vdetail-period"+(p.period===k?" is-selected":"")+"' aria-pressed='"+String(p.period===k)+"'>"+
  "<strong>"+k+"</strong><small>"+(k==="Daily"?"Standard":"−"+Math.round(plans[k].off*100)+"%")+"</small></button>").join("");
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
    "<section class='sr-vdetail-rate'><div class='sr-vdetail-rate-heading'><span>INDICATIVE PRICE</span><span class='sr-vdetail-rate-notice'>Estimate only</span></div>"+
    "<div class='sr-vdetail-rate-main'><strong>"+(p.unit===null?"Rate on request":money(p.unit))+"</strong>"+
    "<small>"+(p.unit===null?"Contact the rental team for the rate":"Assumed daily reference — not a confirmed daily rental rate")+"</small></div></section>"+
    "<section class='sr-vdetail-options'><div class='sr-vdetail-section-title'><h2>Rental plan</h2><span>Select a plan</span></div>"+
      "<div class='sr-vdetail-periods' role='group' aria-label='Rental plan'>"+periodButtons+"</div>"+
      "<p class='sr-vdetail-period-note'>Weekly 7+ days: −10% · Monthly 30+ days: −15%. Discounts are proposed and subject to confirmation.</p></section>"+
    "<section class='sr-vdetail-dates' aria-label='Select rental dates'>"+
      "<div class='sr-vdetail-section-title'><h2>Select rental dates</h2><span>Pick-up → Return</span></div>"+
      "<div class='sr-vdetail-date-fields'>"+field("pickup","Pick-up date")+field("returnDate","Return date")+"</div>"+
      "<div class='sr-vdetail-date-select'><span>Quick dates: select "+(selection.phase==="pickup"?"pick-up":"return")+"</span>"+
      "<button type='button' data-sr-clear-dates>Clear</button></div>"+
      datesTimeline()+"<p class='sr-vdetail-help'>For later dates, use the calendar fields above.</p></section>"+
    "<section class='sr-vdetail-estimate' aria-label='Rental estimate' aria-live='polite'>"+
      "<div class='sr-vdetail-estimate-line'><span>Selected duration</span><b>"+(p.datesValid?p.daysCount+" days":"Select dates")+"</b></div>"+
      "<div class='sr-vdetail-estimate-line'><span>"+p.period+" discount</span><b>"+Math.round(p.plan.off*100)+"%</b></div>"+
      breakdown+"<p>Illustrative estimate based on an unverified daily figure. Deposit, VAT, insurance, mileage and other charges are excluded. Final rates require team confirmation.</p></section>"+
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
    ">Request a Quote "+icon("arrow",18)+"</button>"+
    "<button type='button' class='sr-vdetail-cta-whatsapp' data-action='whatsapp' data-id='"+esc(c.id)+"'>"+
      icon("message",20)+"<span>WhatsApp</span></button></div></main>";
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
if(ui.page==="detail")render(false);
})();