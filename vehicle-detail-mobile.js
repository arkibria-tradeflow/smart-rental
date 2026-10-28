/* Smart Rental: compact native-feeling vehicle detail UI for phones/tablets.
   Desktop deliberately continues to use the original details renderer.
   Pricing stays an unverified catalogue reference; no fictional availability. */
(function () {
  "use strict";
  const mobileWidth=window.matchMedia("(max-width: 900px)");
  const desktopDetail=detail;

  function mobileDetail(){
    const c=cars.find(x=>x.id===ui.selected)||cars[0];
    const other=cars.filter(x=>x.category===c.category&&x.id!==c.id).slice(0,6);
    const period=ui.period||"Daily";
    const selectedClass=p=>period===p?" is-selected":"";
    const price=num(c.rate);
    const hero="<img src='"+esc(c.photo)+"' alt='"+esc(c.name)+" rental vehicle catalogue photo' loading='eager' decoding='async' onerror=\"this.hidden=true;this.parentElement.classList.add('sr-vdetail-photo-missing')\">";
    const related=other.map(car=>
      "<button type='button' class='sr-vdetail-related-card' data-action='details' data-id='"+esc(car.id)+"' aria-label='View "+esc(car.name)+" details'>"+
        "<span class='sr-vdetail-related-photo'>"+carImg(car)+"</span>"+
        "<strong>"+esc(car.name)+"</strong>"+
        "<small>"+num(car.rate)+"</small>"+
      "</button>"
    ).join("");
    return "<main class='container inner-main sr-vdetail'>"+
      "<nav class='sr-vdetail-back' aria-label='Vehicle navigation'><a href='#fleet'>"+icon("back",17)+" Explore cars</a><span>"+esc(c.category)+"</span></nav>"+
      "<header class='sr-vdetail-header'><span class='sr-vdetail-eyebrow'>"+esc(c.category)+" · RENTAL IN "+esc(CFG.city.toUpperCase())+"</span>"+
        "<h1>"+esc(c.name)+"</h1>"+
        "<p>"+icon("pin",15)+" "+esc(CFG.city)+", "+esc(CFG.country)+"</p></header>"+
      "<figure class='sr-vdetail-gallery'><div class='sr-vdetail-photo'>"+hero+"</div>"+
        "<figcaption>Reference photograph · Exact vehicle specification to be confirmed</figcaption></figure>"+
      "<section class='sr-vdetail-rate' aria-label='Indicative catalogue figure'>"+
        "<div class='sr-vdetail-rate-heading'><span>CATALOGUE FIGURE</span><span class='sr-vdetail-rate-notice'>Quote required</span></div>"+
        "<div class='sr-vdetail-rate-main'><strong>"+price+"</strong><small>Rental period and final price to be confirmed by the rental team</small></div>"+
      "</section>"+
      "<section class='sr-vdetail-options' aria-labelledby='sr-vdetail-period-heading'>"+
        "<div class='sr-vdetail-section-title'><h2 id='sr-vdetail-period-heading'>Rental duration</h2><span>Choose a plan</span></div>"+
        "<div class='sr-vdetail-periods' role='group' aria-label='Preferred rental duration'>"+
        ["Daily","Weekly","Monthly"].map(p=>
          "<button type='button' data-action='period' data-period='"+p+"' class='sr-vdetail-period"+selectedClass(p)+"' aria-pressed='"+(period===p?"true":"false")+"'>"+p+"</button>"
        ).join("")+
        "</div>"+
        "<p class='sr-vdetail-period-note'>Ask for the <strong>"+period.toLowerCase()+"</strong> rental quote, including deposit, mileage and insurance terms.</p>"+
      "</section>"+
      "<section class='sr-vdetail-facts' aria-label='Rental information'>"+
        "<div>"+icon("map-pin",18)+"<span><small>Collection</small><strong>"+esc(CFG.city)+", UAE</strong></span></div>"+
        "<div>"+icon("calendar",18)+"<span><small>Availability</small><strong>Confirm with team</strong></span></div>"+
      "</section>"+
      "<div class='sr-vdetail-disclosure'>"+icon("shield",17)+"<span>No automatic booking or payment. A team member must confirm the vehicle, availability and full rental terms.</span></div>"+
      (related?"<section class='sr-vdetail-related' aria-labelledby='sr-vdetail-related-title'>"+
        "<div class='sr-vdetail-related-heading'><h2 id='sr-vdetail-related-title'>Similar cars</h2><a href='#fleet'>View all "+icon("arrow",15)+"</a></div>"+
        "<div class='sr-vdetail-related-track'>"+related+"</div></section>":"")+
      "<div class='sr-vdetail-cta-bar' aria-label='Car rental enquiry actions'>"+
        "<button class='sr-vdetail-cta-primary' type='button' data-action='quote-inquiry' data-model='"+esc(c.name)+"' data-car-type='"+esc(c.category)+"' data-period='"+esc(period)+"'>Request a Quote "+icon("arrow",18)+"</button>"+
        "<button class='sr-vdetail-cta-whatsapp' type='button' data-action='whatsapp' data-id='"+esc(c.id)+"' aria-label='Ask about "+esc(c.name)+" on WhatsApp'>"+icon("message",20)+"<span>WhatsApp</span></button>"+
      "</div></main>";
  }
  detail=function(){
    return mobileWidth.matches?mobileDetail():desktopDetail();
  };
  const changed=()=>{if(ui.page==="detail")render(false);};
  if(mobileWidth.addEventListener)mobileWidth.addEventListener("change",changed);
  else if(mobileWidth.addListener)mobileWidth.addListener(changed);
  if(ui.page==="detail")render(false);
})();