/* Premium 2026 responsive homepage — white-label presentation layer.
   Existing booking, enquiry and owner demo workflows remain in app.js. */
(function(){
  const heroPhoto='https://images.unsplash.com/photo-1773417889450-220602f31b42?auto=format&fit=crop&w=1500&q=82';
  const categoryPhotos={
    Economy:'https://images.unsplash.com/photo-1596429916858-6f97b5b9cf48?auto=format&fit=crop&w=650&q=78',
    Sedan:'https://images.unsplash.com/photo-1578245601540-19edcdc12e7f?auto=format&fit=crop&w=650&q=78',
    SUV:'https://images.unsplash.com/photo-1767274592417-c986b7619c8c?auto=format&fit=crop&w=650&q=78',
    Luxury:'https://images.unsplash.com/photo-1556161189-78e416f7e934?auto=format&fit=crop&w=650&q=78',
    Sports:'https://images.unsplash.com/photo-1778959686627-4b77ad253447?auto=format&fit=crop&w=650&q=78'
  };
  header=function(){
    return (CFG.showDemoBanner?'<div class="demo-banner">INTERACTIVE PREVIEW · SAMPLE INVENTORY · NO LIVE BOOKINGS</div>':'')
      +'<header class="site-header"><div class="container header-inner">'
      +brand()
      +'<nav class="desktop-nav" aria-label="Main navigation"><a href="#home" class="'+(ui.page==='home'?'on':'')+'">Home</a><a href="#fleet" class="'+(ui.page==='fleet'?'on':'')+'">Explore Cars</a><a href="#my-rental" class="'+(ui.page==='my-rental'?'on':'')+'">My Rental</a><a href="#about" class="'+(ui.page==='about'?'on':'')+'">About</a><a href="#about">Contact</a></nav>'
      +'<div class="header-actions"><span class="compact-phone">'+icon('phone',17)+'<span>'+esc(CFG.phoneDisplay||'Dubai rental enquiries')+'</span></span>'
      +contactButton('WhatsApp Us','header-whatsapp')
      +'<button class="mobile-menu-button" aria-label="Open menu" data-action="menu">'+icon('menu',23)+'</button></div></div></header>'
      +(ui.menu?'<nav class="mobile-menu" aria-label="Mobile menu"><a href="#home">Home</a><a href="#fleet">Explore cars</a><a href="#my-rental">My rental</a><a href="#about">About & contact</a><a href="#owner">Owner demo</a></nav>':'');
  };
  searchFields=function(){
    return '<form id="quick-search" class="search-panel premium-search">'
      +'<div class="field pickup-location"><label for="pickupLocation">'+icon('pin',18)+' Pick-up location</label><select id="pickupLocation" name="pickupLocation"><option value="Dubai, UAE">Dubai, UAE</option><option value="Deira, Dubai">Deira, Dubai</option><option value="Dubai Airport">Dubai Airport</option></select></div>'
      +'<div class="field"><label for="pickup">'+icon('calendar',17)+' Pick-up date</label><input type="date" id="pickup" name="pickup" value="'+esc(ui.pickup||dateISO(1))+'" min="'+dateISO()+'" required></div>'
      +'<div class="field"><label for="returnDate">'+icon('calendar',17)+' Return date</label><input type="date" id="returnDate" name="returnDate" value="'+esc(ui.returnDate||dateISO(4))+'" min="'+dateISO()+'" required></div>'
      +'<div class="field select-field"><label for="carType">'+icon('car',18)+' Car style</label><select id="carType" name="carType">'
      +['All','Economy','Sedan','SUV','Luxury','Sports','Van'].map(function(c){return '<option value="'+c+'" '+(ui.category===c?'selected':'')+'>'+((c==='All')?'All styles':c)+'</option>';}).join('')
      +'</select></div><button class="btn primary" type="submit">'+icon('search',20)+' Find My Car '+icon('arrow',19)+'</button></form>';
  };
  home=function(){
    const categories=[
      ['Economy','Economy',categoryPhotos.Economy],
      ['Sedan','Sedan',categoryPhotos.Sedan],
      ['SUV','SUV',categoryPhotos.SUV],
      ['Luxury','Luxury',categoryPhotos.Luxury],
      ['Sports','Supercars',categoryPhotos.Sports]
    ];
    const categoryMarkup=categories.map(function(c){
      return '<button class="premium-category" type="button" data-action="category" data-category="'+c[0]+'" aria-label="Browse '+c[1]+' rentals">'
       +'<span class="premium-category-photo"><img src="'+c[2]+'" loading="lazy" alt="Illustrative '+c[1]+' vehicle" onerror="this.style.visibility=\'hidden\'"></span>'
       +'<span class="premium-category-title">'+c[1]+'</span><span class="premium-category-sub">Explore vehicles</span>'
       +'<span class="premium-category-arrow">'+icon('arrow',17)+'</span></button>';
    }).join('');
    return '<main class="premium-home">'
      +'<section class="premium-hero"><div class="container premium-hero-inner">'
      +'<div class="premium-hero-copy"><div class="premium-kicker">PREMIUM CAR RENTAL IN DUBAI</div>'
      +'<h1>Drive Your<br><em>Next Journey</em></h1>'
      +'<p>Explore the right car for every occasion. Flexible rental options, a curated selection and an easier way to enquire.</p>'
      +'<button class="premium-hero-link" type="button" data-action="browse">Explore our fleet '+icon('arrow',19)+'</button></div>'
      +'<div class="premium-hero-media"><div class="premium-hero-halo"></div>'
      +'<img class="premium-hero-photo" src="'+heroPhoto+'" alt="Illustrative white Range Rover in an upscale setting; vehicle photo is not company inventory" loading="eager" fetchpriority="high" onerror="this.src=CFG.heroImage">'
      +'<span class="premium-hero-caption">ILLUSTRATIVE VEHICLE PHOTO</span></div>'
      +'<div class="premium-hero-benefits"><span>'+icon('car',23)+'<b>Wide selection</b></span><span>'+icon('shield',23)+'<b>Flexible rentals</b></span><span>'+icon('message',23)+'<b>Personal assistance</b></span></div>'
      +'</div></section>'
      +'<div class="container premium-search-wrap">'+searchFields()+'</div>'
      +'<div class="container premium-brand-strip"><span class="premium-brand-intro">EXPLORE BY BRAND</span><div class="premium-brand-logos">'
      +['TOYOTA','HYUNDAI','NISSAN','LEXUS','BMW','MERCEDES','AUDI','RANGE ROVER'].map(function(b){return '<span>'+b+'</span>';}).join('')
      +'</div><a href="#fleet" aria-label="See all car brands">'+icon('arrow',18)+'</a></div>'
      +'<section class="premium-categories-section"><div class="container"><div class="premium-section-heading">'
      +'<div><span class="premium-kicker">EXPLORE BY CATEGORY</span><h2>Find the <em>perfect car.</em></h2><p>From everyday comfort to exceptional experiences.</p></div>'
      +'<a class="premium-view-all" href="#fleet">View all cars '+icon('arrow',17)+'</a></div>'
      +'<div class="premium-category-grid">'+categoryMarkup+'</div></div></section>'
      +'<section class="premium-how"><div class="container"><div class="premium-section-heading"><div><span class="premium-kicker">A BETTER WAY TO RENT</span><h2>Simple from start to finish.</h2></div></div>'
      +'<div class="premium-how-grid"><div><b>01</b><h3>Find a car</h3><p>Browse by category, brand or indicative price.</p></div><div><b>02</b><h3>Select your dates</h3><p>Share the rental period and pickup preference.</p></div><div><b>03</b><h3>Request a quote</h3><p>Our team confirms availability and rental terms.</p></div></div></div></section>'
      +'<div class="premium-demo-disclaimer container">Interactive demonstration only. Car photographs are illustrative; sample catalogue rates and inventory are not verified live offers. No real bookings are placed.</div>'
      +'</main>';
  };
  bottomNav=function(){
    return '<nav class="bottom-nav" aria-label="Mobile navigation">'
      +'<a href="#home" class="'+(ui.page==='home'?'active':'')+'">'+icon('grid',21)+'<span>Home</span></a>'
      +'<a href="#fleet" class="'+(['fleet','detail','booking'].includes(ui.page)?'active':'')+'">'+icon('car',21)+'<span>Explore</span></a>'
      +'<a href="#my-rental" class="'+(ui.page==='my-rental'?'active':'')+'">'+icon('calendar',21)+'<span>My Rental</span></a>'
      +'<a href="#owner" class="'+(ui.page==='owner'?'active':'')+'">'+icon('user',21)+'<span>Owner Demo</span></a></nav>';
  };
  // App handlers, data and pages remain provided by app.js.
  render(false);
})();
