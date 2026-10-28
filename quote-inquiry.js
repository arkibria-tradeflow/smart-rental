/* Quotation enquiry form: sends only via the visitor's own WhatsApp. */
(function(){
"use strict";
const config=window.SMART_RENTAL_CONFIG||{};
const phone=String(config.whatsappNumber||"").replace(/\D/g,"");
const business=String(config.businessName||"the rental team");
let modal=null;
let returnFocus=null;
function closeModal(){
  if(!modal)return;
  const previous=returnFocus;
  modal.remove();modal=null;
  document.body.classList.remove("sr-quote-open");
  if(previous?.isConnected)previous.focus({preventScroll:true});
}
function openModal(trigger){
  if(modal)return;
  if(!phone){window.alert("Please contact the rental team directly for a quotation.");return;}
  returnFocus=document.activeElement;
  modal=document.createElement("div");
  modal.className="sr-quote-overlay";
  modal.innerHTML=[
    '<div class="sr-quote-backdrop" data-sr-quote-close></div>',
    '<section class="sr-quote-dialog" role="dialog" aria-modal="true" aria-labelledby="sr-quote-heading" aria-describedby="sr-quote-subtitle">',
      '<div class="sr-quote-top">',
        '<div><span class="sr-quote-eyebrow">PERSONALIZED RENTAL ENQUIRY</span>',
          '<h2 id="sr-quote-heading">Request a Quotation</h2>',
          '<p id="sr-quote-subtitle">Choose your preferences and prepare a message to our rental team.</p></div>',
        '<button class="sr-quote-close" type="button" data-sr-quote-close aria-label="Close quotation form">×</button>',
      '</div>',
      '<form id="sr-quote-form" class="sr-quote-form">',
        '<label>Preferred car type',
          '<select name="type"><option value="Any available vehicle">Any car type</option>',
            '<option>Economy</option><option>Sedan</option><option>SUV</option>',
            '<option>Luxury</option><option>Sports / Supercar</option><option>Van</option>',
          '</select></label>',
        '<label>Preferred model (optional)',
          '<input type="text" name="model" maxlength="80" placeholder="e.g. Toyota Corolla or Mercedes G63" autocomplete="off"></label>',
        '<div class="sr-quote-dates">',
          '<label>Pick-up date (optional)<input type="date" name="pickup"></label>',
          '<label>Return date (optional)<input type="date" name="returnDate"></label>',
        '</div>',
        '<label>Additional details (optional)<textarea name="note" maxlength="400" rows="2" placeholder="Rental duration, pickup location or other requirements"></textarea></label>',
        '<p class="sr-quote-disclaimer">This opens WhatsApp with a prepared message. Your enquiry is only sent when you press Send in WhatsApp. The rental team must confirm availability and pricing.</p>',
        '<div class="sr-quote-footer">',
          '<button type="button" class="sr-quote-cancel" data-sr-quote-close>Cancel</button>',
          '<button type="submit" class="sr-quote-submit">Continue to WhatsApp <span aria-hidden="true">↗</span></button>',
        '</div>',
      '</form>',
    '</section>'
  ].join("");
  document.body.appendChild(modal);
  // Reuse the visitor's selected homepage search dates when available.
  const pickup=String(trigger?.dataset.pickup||document.querySelector("#pickup")?.value||"");
  const returnDate=String(trigger?.dataset.returnDate||document.querySelector("#returnDate")?.value||"");
  const quotePickup=modal.querySelector('[name="pickup"]');
  const quoteReturn=modal.querySelector('[name="returnDate"]');
  if(quotePickup)quotePickup.value=pickup;
  if(quoteReturn)quoteReturn.value=returnDate;
  // A detail-page quotation uses the exact model and selected rental duration.
  const model=String(trigger?.dataset.model||"").trim().slice(0,80);
  const carType=String(trigger?.dataset.carType||"").trim();
  const period=String(trigger?.dataset.period||"").trim();
  const modelField=modal.querySelector('[name="model"]');
  const typeField=modal.querySelector('[name="type"]');
  const noteField=modal.querySelector('[name="note"]');
  if(modelField&&model)modelField.value=model;
  if(typeField&&carType){
    const selectedType=carType==="Sports"?"Sports / Supercar":carType;
    if(Array.from(typeField.options).some(o=>o.value===selectedType||o.textContent===selectedType))
      typeField.value=selectedType;
  }
  const estimated=String(trigger?.dataset.estimate||"").trim();
  if(noteField&&(period||estimated)){
    noteField.value=(period?"Preferred rental plan: "+period:"")+
      (estimated?"\nIllustrative estimated total: "+estimated+" (subject to confirmation)":"");
  }
  document.body.classList.add("sr-quote-open");
  modal.querySelector(".sr-quote-close")?.focus({preventScroll:true});
}
document.addEventListener("click",function(e){
  const trigger=e.target.closest('[data-action="quote-inquiry"]');
  if(trigger){e.preventDefault();openModal(trigger);return;}
  if(modal&&e.target.closest("[data-sr-quote-close]")){e.preventDefault();closeModal();}
});
document.addEventListener("keydown",function(e){
  if(!modal)return;
  if(e.key==="Escape"){e.preventDefault();closeModal();return;}
  if(e.key!=="Tab")return;
  const controls=Array.from(modal.querySelectorAll("button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])"));
  if(!controls.length)return;
  if(e.shiftKey&&document.activeElement===controls[0]){e.preventDefault();controls[controls.length-1].focus();}
  else if(!e.shiftKey&&document.activeElement===controls[controls.length-1]){e.preventDefault();controls[0].focus();}
});
document.addEventListener("submit",function(e){
  if(e.target.id!=="sr-quote-form")return;
  e.preventDefault();
  const f=new FormData(e.target);
  const type=String(f.get("type")||"Any available vehicle").trim();
  const model=String(f.get("model")||"").trim().slice(0,80);
  const pickup=String(f.get("pickup")||"");
  const ret=String(f.get("returnDate")||"");
  const note=String(f.get("note")||"").trim().slice(0,400);
  if(pickup&&ret&&ret<=pickup){window.alert("Return date must be later than pick-up date.");return;}
  const message=[
    "Hello "+business+",",
    "I would like to request a car rental quotation.",
    "",
    "Car type: "+type,
    ...(model?["Preferred model: "+model]:[]),
    ...(pickup?["Pick-up: "+pickup]:[]),
    ...(ret?["Return: "+ret]:[]),
    ...(note?["Additional details: "+note]:[]),
    "",
    "Please confirm availability, the rental price and period, security deposit, insurance and additional charges."
  ].join("\n");
  window.open("https://wa.me/"+phone+"?text="+encodeURIComponent(message),"_blank","noopener,noreferrer");
  closeModal();
});
})();