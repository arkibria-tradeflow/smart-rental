/* Smart Rental — visitor-facing About page and compact company footer.
   Keep truthful business details; do not imply unverified operations. */
(function(){
"use strict";
const map=CFG.googleMapsUrl||"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(CFG.businessName+" "+CFG.city);
const wh=PHONE?"https://wa.me/"+PHONE:"";
const tel=TEL?"tel:+"+TEL:"";
about=function(){
 return "<main class='sr-about-main'><section class='sr-about-intro container'>"+
 "<div class='sr-about-lead'><span class='sr-about-eyebrow'>CAR RENTAL IN "+esc(CFG.city.toUpperCase())+"</span>"+
 "<h1>Drive your way.<br><em>We're here to help.</em></h1>"+
 "<p>Explore a selection of rental cars for everyday journeys, family trips and special occasions. Choose what fits your plans, then speak with our team about availability and rental terms.</p>"+
 "<div class='sr-about-actions'><a href='#fleet' class='sr-about-primary'>Explore Cars "+icon("arrow",17)+"</a>"+
 (wh?"<a href='"+wh+"' target='_blank' rel='noopener noreferrer' class='sr-about-secondary'>"+icon("message",17)+" WhatsApp us</a>":"")+
 "</div></div><div class='sr-about-visual'><img src='assets/hyundai-sonata.webp' alt='Hyundai Sonata available for car rental enquiry' loading='lazy' decoding='async'></div></section>"+
 "<section class='sr-about-benefits container'><div><span>"+icon("car",20)+"</span><strong>Choose your car</strong><p>Explore our range by vehicle type, make and listed price.</p></div>"+
 "<div><span>"+icon("calendar",20)+"</span><strong>Share your dates</strong><p>Select your preferred rental period and request an estimate.</p></div>"+
 "<div><span>"+icon("message",20)+"</span><strong>Confirm with the team</strong><p>Ask about vehicle availability, pickup and final rental conditions.</p></div></section>"+
 "<section class='sr-about-visit container'><div class='sr-about-visit-header'><span class='sr-about-eyebrow'>VISIT OR CONTACT US</span>"+
 "<h2>Find us in Deira, Dubai</h2><p>Our team can help you with rental enquiries and next steps.</p></div>"+
 "<div class='sr-about-visit-layout'><div class='sr-about-address'>"+
 "<h3>"+esc(CFG.businessName)+"</h3>"+
 "<p>"+icon("pin",19)+" <span>"+esc(CFG.address)+"</span></p>"+
 "<p>"+icon("phone",19)+" <span>"+esc(CFG.phoneDisplay)+"</span></p>"+
 "<div class='sr-about-visit-links'><a href='"+map+"' target='_blank' rel='noopener noreferrer'>Directions "+icon("arrow",16)+"</a>"+
 (tel?"<a href='"+tel+"'>Call us "+icon("phone",16)+"</a>":"")+"</div>"+
 "<small>Rental conditions, availability and final pricing are confirmed directly by the company.</small>"+
 "</div><div class='sr-about-map'><iframe title='Location of "+esc(CFG.businessName)+" in Dubai' src='https://www.google.com/maps?q="+encodeURIComponent(CFG.businessName+" "+CFG.address)+"&output=embed' loading='lazy' referrerpolicy='no-referrer-when-downgrade'></iframe></div></div></section></main>";
};
footer=function(){
 return "<footer class='sr-footer-v2'><div class='container sr-footer-v2-main'>"+
  "<div class='sr-footer-v2-brand'>"+brand()+
    "<p>Explore cars for your plans in "+esc(CFG.city)+". Enquire directly for confirmed rental terms.</p>"+
    (wh?"<a class='sr-footer-v2-whatsapp' href='"+wh+"' rel='noopener noreferrer' target='_blank'>"+icon("message",16)+" WhatsApp us</a>":"")+"</div>"+
  "<nav class='sr-footer-v2-links' aria-label='Footer exploration'><strong>Explore</strong>"+
   "<a href='#fleet'>All cars</a><a href='#fleet' data-footer-category='SUV'>SUVs</a>"+
   "<a href='#fleet' data-footer-category='Luxury'>Luxury</a></nav>"+
  "<nav class='sr-footer-v2-links' aria-label='Company information'><strong>Information</strong>"+
   "<a href='#about'>About us</a><a href='#my-rental'>My Rental</a>"+
   "<a href='"+map+"' target='_blank' rel='noopener noreferrer'>Find us</a></nav>"+
  "<div class='sr-footer-v2-contact'><strong>Contact</strong>"+
   (tel?"<a href='"+tel+"'>"+icon("phone",15)+" "+esc(CFG.phoneDisplay)+"</a>":"")+
   "<span>"+icon("pin",15)+" "+esc(CFG.address)+"</span></div>"+
  "</div><div class='container sr-footer-v2-bottom'>"+
  "<span>© "+new Date().getFullYear()+" "+esc(CFG.businessName)+"</span>"+
  "<span>"+esc(CFG.city)+", "+esc(CFG.country)+"</span></div></footer>";
};
render(false);
})();