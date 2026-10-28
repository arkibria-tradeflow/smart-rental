/* Smart Rental premium homepage. Main application workflows stay in app.js. */
(function(){
"use strict";
/* Hero creative is intentionally separate from the vehicle catalogue.
   AI-generated showcase photographs must not imply actual inventory availability. */
const showcaseCars=[
  ["rolls-royce-cullinan","Rolls-Royce Cullinan"],
  ["bentley-bentayga","Bentley Bentayga"],
  ["lamborghini-urus","Lamborghini Urus"],
  ["ferrari-f8","Ferrari F8"],
  ["porsche-911","Porsche 911"],
  ["mercedes-g63","Mercedes G63"]
];
const heroMessages=[
  {lead:"The Right Car.",accent:"For Every Journey.",detail:"Discover a car for every occasion, from everyday comfort to extraordinary drives."},
  {lead:"Know the Cost.",accent:"Before You Commit.",detail:"Explore catalogue prices and confirm deposits, insurance and final rental terms with our team."},
  {lead:"Choose with Confidence.",accent:"Drive with Peace of Mind.",detail:"Explore vehicle options, customer reviews and rental details before you enquire."},
  {lead:"Less Hassle.",accent:"More Time to Drive.",detail:"Find your car, choose your dates and request a quote in a few simple steps."},
  {lead:"Your Plans Matter.",accent:"So Do the Details.",detail:"Ask about pickup arrangements, rental requirements and extension options."}
];
function heroImage(slug,name,first){
  return "<img class='sr-hero-car' "+(first?"src='":"data-src='")+
    "assets/hero/"+slug+".webp' data-fallback='assets/"+slug+".webp' alt='"+esc(name)+"' "+
    (first?"fetchpriority='high' loading='eager'":"loading='lazy'")+
    " decoding='async' onerror=\"if(this.dataset.fallback){this.src=this.dataset.fallback;delete this.dataset.fallback;}\">";
}
function luxuryHero(){
  const slides=showcaseCars.map((car,i)=>
    "<div class='sr-lux-slide"+(i===0?" is-active":"")+"' data-sr-slide='"+i+"' aria-hidden='"+(i===0?"false":"true")+"'>"+
    heroImage(car[0],car[1],i===0)+"</div>"
  ).join("");
  return "<div class='sr-lux-slider' id='sr-luxury-slideshow' aria-label='Six premium vehicle showcase images'>"+
    "<div class='sr-lux-track'>"+slides+"</div>"+
    "<div class='sr-lux-controls'>"+
      "<div class='sr-lux-caption'><span class='sr-lux-overline'>FEATURED COLLECTION</span><strong data-sr-lux-name>"+esc(showcaseCars[0][1])+"</strong></div>"+
      "<div class='sr-lux-navigation'><span class='sr-lux-counter' data-sr-lux-count>01 / 06</span>"+
        "<button type='button' class='sr-lux-arrow' data-sr-step='-1' aria-label='Previous vehicle'>"+icon("back",17)+"</button>"+
        "<button type='button' class='sr-lux-arrow' data-sr-step='1' aria-label='Next vehicle'>"+icon("chevron",17)+"</button>"+
      "</div>"+
    "</div>"+
  "</div>";
}
function heroThumbnails(){
  return "<div class='container sr-hero-showcase'><div class='sr-hero-thumbnails' aria-label='Choose a featured vehicle'>"+
    showcaseCars.map((car,i)=>
      "<button type='button' class='sr-hero-thumb"+(i===0?" is-active":"")+"' data-sr-go='"+i+"' aria-label='Show "+esc(car[1])+"' aria-pressed='"+(i===0?"true":"false")+"'>"+
      "<img src='assets/hero/"+car[0]+".webp' alt='' loading='lazy' data-fallback='assets/"+car[0]+".webp' onerror=\"if(this.dataset.fallback){this.src=this.dataset.fallback;delete this.dataset.fallback;}\">"+
      "<span>"+esc(car[1])+"</span></button>"
    ).join("")+"</div><p class='sr-hero-visual-note'>AI-generated showcase visuals · Specific vehicles and availability confirmed on enquiry</p></div>";
}
const cats=[["Economy","Economy","nissan-sunny"],["Sedan","Sedans","hyundai-sonata"],["SUV","SUVs","toyota-fortuner"],["Luxury","Luxury","mercedes-s-class"],["Sports","Supercars","ferrari-f8"]];
const brands=[["Toyota","toyota-corolla"],["Hyundai","hyundai-sonata"],["Nissan","nissan-patrol-new"],["Mercedes","mercedes-c200"],["BMW","bmw-5-series"],["Range Rover","range-rover-velar"],["Audi","audi-a6"],["Lamborghini","lamborghini-huracan"]];
const mapURL=CFG.googleMapsUrl||"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(CFG.businessName+" "+CFG.city);
function photo(slug,alt){return "<img src='assets/"+slug+".webp' alt='"+esc(alt)+"' loading='lazy' decoding='async' onerror='this.hidden=true'>";}
function menuLink(id,title){return "<a href='#"+id+"' class='"+(ui.page===id?"on":"")+"'>"+title+"</a>";}
header=function(){
return "<header class='site-header sr-header'><div class='container header-inner'>"+brand()+
"<nav class='desktop-nav sr-main-nav' aria-label='Main navigation'>"+menuLink("home","Home")+menuLink("fleet","Explore Cars")+menuLink("my-rental","My Rental")+menuLink("about","About")+"</nav>"+
"<div class='header-actions sr-header-actions'><a class='sr-call-link' href='tel:+"+TEL+"' aria-label='Call the rental office'>"+icon("phone",18)+"<span>"+esc(CFG.phoneDisplay||"Call us")+"</span></a>"+contactButton("WhatsApp","header-whatsapp")+
"<button class='mobile-menu-button sr-menu-button' type='button' data-action='menu' aria-label='Toggle menu' aria-expanded='"+(ui.menu?"true":"false")+"'>"+icon("menu",21)+"</button></div></div></header>"+
(ui.menu?"<nav class='mobile-menu sr-mobile-menu' aria-label='Mobile menu'><a href='#home'>Home</a><a href='#fleet'>Explore Cars</a><a href='#my-rental'>My Rental</a><a href='#about'>About & Contact</a></nav>":"");
};
searchFields=function(){
return "<form id='quick-search' class='sr-search' aria-label='Find a car'>"+
"<div class='sr-search-field'><label for='pickup'>"+icon("calendar",17)+" Pick-up date</label><input type='date' id='pickup' name='pickup' value='"+esc(ui.pickup||dateISO(1))+"' min='"+dateISO()+"' required></div>"+
"<div class='sr-search-field'><label for='returnDate'>"+icon("calendar",17)+" Return date</label><input type='date' id='returnDate' name='returnDate' value='"+esc(ui.returnDate||dateISO(4))+"' min='"+dateISO()+"' required></div>"+
"<div class='sr-search-field sr-search-style'><label for='carType'>"+icon("car",17)+" Car style</label><select id='carType' name='carType'>"+
["All","Economy","Sedan","SUV","Luxury","Sports","Van"].map(function(c){return "<option value='"+c+"' "+(ui.category===c?"selected":"")+">"+(c==="All"?"Any style":c==="Sports"?"Supercars":c)+"</option>";}).join("")+
"</select></div><button class='sr-search-submit' type='submit'>"+icon("search",19)+"<span>Find my car</span>"+icon("arrow",18)+"</button></form>";
};
home=function(){
const categoryCards=cats.map(function(c){
return "<button class='sr-category-card' data-action='category' data-category='"+c[0]+"' aria-label='Explore "+c[1]+"'><span class='sr-category-image'>"+photo(c[2],c[1]+" car")+"</span><span class='sr-category-label'><strong>"+c[1]+"</strong><span>"+icon("arrow",18)+"</span></span></button>";
}).join("");
const brandCards=brands.map(function(b){
const n=cars.filter(function(c){return c.name.toLowerCase().includes(b[0].toLowerCase());}).length;
return "<button class='sr-brand-card' data-brand-filter='"+esc(b[0])+"' aria-label='Explore "+esc(b[0])+" vehicles'><span class='sr-brand-image'>"+photo(b[1],b[0]+" vehicle")+"</span><span class='sr-brand-meta'><strong>"+esc(b[0]==="Mercedes"?"Mercedes-Benz":b[0])+"</strong><small>"+n+" "+(n===1?"model":"models")+"</small></span><span class='sr-brand-arrow'>"+icon("arrow",16)+"</span></button>";
}).join("");
return "<main class='sr-home'>"+
"<section class='sr-hero'><div class='container sr-hero-layout'><div class='sr-hero-copy'><span class='sr-eyebrow'><i></i> PREMIUM CAR RENTAL IN "+esc(CFG.city.toUpperCase())+"</span>"+
"<div class='sr-hero-message'><h1 data-sr-hero-title><span data-sr-hero-lead>"+esc(heroMessages[0].lead)+"</span> <em data-sr-hero-accent>"+esc(heroMessages[0].accent)+"</em></h1><p data-sr-hero-description>"+esc(heroMessages[0].detail)+"</p></div>"+
"<div class='sr-hero-actions'><button class='sr-button-dark' type='button' data-action='browse'>Explore Cars "+icon("arrow",17)+"</button>"+
"<a class='sr-button-link' href='https://wa.me/"+PHONE+"' target='_blank' rel='noopener noreferrer'>"+icon("message",17)+" Chat on WhatsApp</a></div>"+"<div class='sr-hero-proof'><span>"+icon("car",18)+" Explore our fleet</span><span>"+icon("calendar",18)+" Flexible rental enquiries</span><span>"+icon("pin",18)+" Dubai, UAE</span></div></div>"+
"<div class='sr-hero-media'><div class='sr-hero-glow'></div>"+luxuryHero()+"</div></div>"+heroThumbnails()+
"<div class='container sr-search-holder'><div class='sr-search-label'><span>FIND YOUR NEXT DRIVE</span><strong>Pick your dates and car style</strong></div>"+searchFields()+"</div></section>"+
"<div class='container sr-trust-row'><span>"+icon("calendar",19)+" Daily · Weekly · Monthly</span><span>"+icon("car",19)+" Economy to luxury</span><span>"+icon("pin",19)+" Based in Deira, Dubai</span></div>"+
"<section class='sr-section sr-categories' id='categories'><div class='container'><div class='sr-section-heading'><div><span class='sr-overline'>THE COLLECTION</span><h2>Explore by category</h2><p>Something for every kind of drive.</p></div><a class='sr-inline-link' href='#fleet'>View all cars "+icon("arrow",17)+"</a></div><div class='sr-category-grid'>"+categoryCards+"</div></div></section>"+
"<section class='sr-section sr-brands-section' id='brands'><div class='container'><div class='sr-section-heading'><div><span class='sr-overline'>FIND YOUR FAVOURITE</span><h2>Explore by brand</h2><p>Browse the brands you know and love.</p></div><a class='sr-inline-link' href='#fleet'>Browse all "+icon("arrow",17)+"</a></div><div class='sr-brand-grid'>"+brandCards+"</div></div></section>"+
"<section class='sr-review-section' id='reviews'><div class='container sr-review-inner'><div class='sr-review-heading'><span class='sr-overline'>CUSTOMER EXPERIENCES</span><h2>Real reviews. Real journeys.</h2><p>See what customers say about their experience with us.</p></div>"+
"<div class='sr-review-rating'><span class='sr-google-g'>G</span><div><div class='sr-rating-main'><strong>"+esc(CFG.googleRating||"4.4")+"</strong><span class='sr-rating-stars' aria-label='Rated "+esc(CFG.googleRating||4.4)+" out of 5 stars'>★★★★★</span></div><small>Google rating · "+esc(CFG.googleReviewCount||13)+" reviews</small></div>"+
"<a href='"+mapURL+"' target='_blank' rel='noopener noreferrer'>Read reviews "+icon("arrow",17)+"</a></div></div></section>"+
"<section class='sr-section sr-visit-section' id='visit'><div class='container'><div class='sr-section-heading'><div><span class='sr-overline'>VISIT THE OFFICE</span><h2>Find us in Deira</h2><p>Visit us or get in touch before your journey.</p></div></div>"+
"<div class='sr-visit-grid'><div class='sr-visit-info'><span class='sr-visit-icon'>"+icon("pin",22)+"</span><h3>"+esc(CFG.businessName)+"</h3><p>"+esc(CFG.address)+"</p>"+
"<div class='sr-visit-actions'><a class='sr-button-dark' href='"+mapURL+"' target='_blank' rel='noopener noreferrer'>Get directions "+icon("arrow",16)+"</a><a class='sr-outline-button' href='tel:+"+TEL+"'>"+icon("phone",16)+" Call us</a></div></div>"+
"<div class='sr-map-panel'><iframe loading='lazy' title='Rental office location in Deira, Dubai' referrerpolicy='no-referrer-when-downgrade' src='https://www.google.com/maps?q="+encodeURIComponent(CFG.businessName+" "+CFG.address)+"&output=embed'></iframe></div></div></div></section>"+
"</main>";
};
footer=function(){
return "<footer class='footer sr-footer'><div class='container'><div class='sr-footer-grid'><div class='sr-footer-brand'>"+brand()+"<p>Your next drive starts here in "+esc(CFG.city)+".</p><a href='https://wa.me/"+PHONE+"' rel='noopener noreferrer' target='_blank'>"+icon("message",17)+" Message us on WhatsApp</a></div>"+
"<nav class='sr-footer-col' aria-label='Explore'><b>Explore</b><a href='#fleet'>All cars</a><a href='#fleet' data-footer-category='Economy'>Economy</a><a href='#fleet' data-footer-category='SUV'>SUVs</a><a href='#fleet' data-footer-category='Luxury'>Luxury</a></nav>"+
"<nav class='sr-footer-col' aria-label='Information'><b>Information</b><a href='#my-rental'>My Rental</a><a href='#about'>About us</a><a href='"+mapURL+"' target='_blank' rel='noopener noreferrer'>Find us</a></nav>"+
"<div class='sr-footer-col sr-footer-contact'><b>Contact</b><a href='tel:+"+TEL+"'>"+esc(CFG.phoneDisplay)+"</a><span>"+esc(CFG.address)+"</span></div></div>"+
"<div class='sr-footer-bottom'><span>© "+new Date().getFullYear()+" "+esc(CFG.businessName)+". All rights reserved.</span><span>"+esc(CFG.city)+", "+esc(CFG.country)+"</span></div></div></footer>";
};
bottomNav=function(){
return "<nav class='bottom-nav sr-bottom-nav' aria-label='Mobile navigation'><a href='#home' class='"+(ui.page==="home"?"active":"")+"'>"+icon("grid",21)+"<span>Home</span></a><a href='#fleet' class='"+(["fleet","detail","booking"].includes(ui.page)?"active":"")+"'>"+icon("car",21)+"<span>Explore</span></a><a href='#my-rental' class='"+(ui.page==="my-rental"?"active":"")+"'>"+icon("calendar",21)+"<span>My Rental</span></a><a href='#about' class='"+(ui.page==="about"?"active":"")+"'>"+icon("user",21)+"<span>About</span></a></nav>";
};
document.addEventListener("click",function(e){
const br=e.target.closest("[data-brand-filter]");if(br){e.preventDefault();ui.category="All";ui.search="";ui.brand=(br.dataset.brandFilter==="Mercedes"?"Mercedes-Benz":br.dataset.brandFilter)||"All";ui.priceMin="";ui.priceMax="";navigate("fleet");return;}
const ca=e.target.closest("[data-footer-category]");if(ca){e.preventDefault();ui.category=ca.dataset.footerCategory;ui.search="";navigate("fleet");}
});
render(false);
})();