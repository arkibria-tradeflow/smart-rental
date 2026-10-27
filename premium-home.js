/* Premium 2026 responsive homepage — white-label presentation layer.
   Existing booking, enquiry and owner demo workflows remain in app.js. */
(function(){
  const heroPhoto='assets/range-rover-vogue.webp';
  const categoryPhotos={
    Economy:'assets/nissan-sunny.webp',
    Sedan:'assets/hyundai-sonata.webp',
    SUV:'assets/toyota-fortuner.webp',
    Luxury:'assets/mercedes-s-class.webp',
    Sports:'assets/ferrari-f8.webp'
  };
  header=function(){
    return ''
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
    const brands=[
      ['Toyota','toyota'],['Hyundai','hyundai'],['Nissan','nissan'],['Lexus','lexus'],
      ['BMW','bmw'],['Mercedes','mercedesbenz'],['Audi','audi'],['Land Rover','landrover']
    ];
    const categoryMarkup=categories.map(function(c){
      return '<button class="premium-category" type="button" data-action="category" data-category="'+c[0]+'" aria-label="Browse '+c[1]+' cars">'
        +'<span class="premium-category-photo"><img src="'+c[2]+'" loading="lazy" alt="'+c[1]+' car" onerror="this.style.display=\'none\'"></span>'
        +'<span class="premium-category-title">'+c[1]+'</span><span class="premium-category-sub">Explore cars</span>'
        +'<span class="premium-category-arrow">'+icon('arrow',17)+'</span></button>';
    }).join('');
    const brandMarkup=brands.map(function(b){
      return '<button type="button" class="lux-brand-card" data-brand-filter="'+esc(b[0])+'" aria-label="Explore '+esc(b[0])+' cars">'
        +'<span class="lux-brand-symbol"><img src="https://cdn.simpleicons.org/'+b[1]+'/7a808b" loading="lazy" alt="" onerror="this.style.display=\'none\'"></span>'
        +'<span class="lux-brand-name">'+esc(b[0])+'</span>'+icon('arrow',14)+'</button>';
    }).join('');
    const googleUrl=CFG.googleMapsUrl||'https://www.google.com/maps/search/?api=1&query=Wadi%20Salsabeel%20Rent%20A%20Car%20LLC';
    const rating=CFG.googleRating||'4.4',count=CFG.googleReviewCount||13;
    const phone=CFG.phoneNumber||'971566829999';
    const address=CFG.address||'Afra Plaza, Al Corniche, Deira, Dubai';
    return '<main class="premium-home">'
      +'<section class="premium-hero"><div class="container premium-hero-inner">'
      +'<div class="premium-hero-copy"><div class="premium-kicker">YOUR DRIVE, YOUR WAY · DUBAI</div>'
      +'<h1>Drive Your<br><em>Next Journey</em></h1>'
      +'<p>From everyday essentials to exceptional drives. Discover a vehicle that suits your journey.</p>'
      +'<button class="premium-hero-link" type="button" data-action="browse">Explore our cars '+icon('arrow',19)+'</button></div>'
      +'<div class="premium-hero-media"><div class="premium-hero-halo"></div>'
      +'<img class="premium-hero-photo" src="'+heroPhoto+'" alt="White Range Rover at an elegant architectural setting" loading="eager" fetchpriority="high" onerror="this.src=CFG.heroImage">'
      +'</div><div class="premium-hero-benefits"><span>'+icon('car',23)+'<b>Cars for every journey</b></span><span>'+icon('shield',23)+'<b>Flexible rental options</b></span><span>'+icon('message',23)+'<b>Talk to our team</b></span></div>'
      +'</div></section>'
      +'<div class="container premium-search-wrap">'+searchFields()+'</div>'
      +'<section class="premium-categories-section" id="categories"><div class="container"><div class="premium-section-heading">'
      +'<div><span class="premium-kicker">THE COLLECTION</span><h2>Explore by <em>category.</em></h2><p>Everyday drives, family comfort and something extraordinary.</p></div>'
      +'<a class="premium-view-all" href="#fleet">View all cars '+icon('arrow',17)+'</a></div>'
      +'<div class="premium-category-grid">'+categoryMarkup+'</div></div></section>'
      +'<section class="lux-brand-section" id="brands"><div class="container"><div class="premium-section-heading">'
      +'<div><span class="premium-kicker">FIND YOUR FAVOURITE</span><h2>Explore by <em>brand.</em></h2><p>Choose the marque that fits your next drive.</p></div>'
      +'<a class="premium-view-all" href="#fleet">Browse our fleet '+icon('arrow',17)+'</a></div>'
      +'<div class="lux-brand-grid">'+brandMarkup+'</div></div></section>'
      +'<section class="lux-reviews-section" id="reviews"><div class="container lux-reviews-layout">'
      +'<div class="lux-reviews-copy"><span class="premium-kicker">CUSTOMER FEEDBACK</span><h2>Trusted journeys.<br><em>Real experiences.</em></h2>'
      +'<p>See what customers are saying about their experience with Wadi Salsabeel Rent A Car on Google.</p>'
      +'<a href="'+googleUrl+'" target="_blank" rel="noopener noreferrer" class="lux-text-link">Read Google reviews '+icon('arrow',17)+'</a></div>'
      +'<div class="lux-rating-card"><div class="lux-google-wordmark"><span class="lux-g">G</span><span>Google Reviews</span></div>'
      +'<div class="lux-rating-number">'+rating+'<span>/ 5</span></div>'
      +'<div class="lux-stars" aria-label="Rated '+rating+' out of 5">★★★★<span>★</span></div>'
      +'<div class="lux-rating-count">Based on '+count+' public Google reviews</div>'
      +'<a href="'+googleUrl+'" target="_blank" rel="noopener noreferrer">View customer reviews '+icon('arrow',15)+'</a></div>'
      +'</div></section>'
      +'<section class="lux-location-section" id="visit"><div class="container"><div class="premium-section-heading">'
      +'<div><span class="premium-kicker">FIND US IN DUBAI</span><h2>Visit our <em>showroom.</em></h2><p>We are conveniently located in Deira, Dubai.</p></div></div>'
      +'<div class="lux-location-grid"><div class="lux-location-card">'
      +'<span class="lux-location-icon">'+icon('pin',24)+'</span><h3>Wadi Salsabeel Rent A Car</h3><p>'+esc(address)+'</p>'
      +'<div class="lux-location-actions"><a class="lux-dark-btn" href="'+googleUrl+'" target="_blank" rel="noopener noreferrer">'+icon('pin',18)+' Get directions</a>'
      +'<a class="lux-call-btn" href="tel:+'+phone+'">'+icon('phone',17)+' Call us</a></div>'
      +'<div class="lux-location-bottom"><span>Deira · Dubai · UAE</span><span>'+esc(CFG.phoneDisplay||'+971 56 682 9999')+'</span></div>'
      +'</div><div class="lux-map-container"><iframe title="Location of Wadi Salsabeel Rent A Car in Deira, Dubai" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Wadi%20Salsabeel%20Rent%20A%20Car%20LLC%2C%20Afra%20Plaza%2C%20Deira%2C%20Dubai&output=embed"></iframe></div></div>'
      +'</div></section>'
      +'</main>';
  };
  footer=function(){
    const mapsUrl=CFG.googleMapsUrl||'https://www.google.com/maps/search/?api=1&query=Wadi%20Salsabeel%20Rent%20A%20Car%20LLC';
    const phone=String(CFG.phoneNumber||'971566829999').replace(/\D/g,'');
    const whatsapp=String(CFG.whatsappNumber||phone).replace(/\D/g,'');
    return '<footer class="footer lux-footer"><div class="container lux-footer-top">'
      +'<div class="lux-footer-identity"><a href="#home" aria-label="Back to homepage" class="lux-footer-logo"><img src="'+esc(CFG.logoPath)+'" alt="'+esc(CFG.businessName)+'"></a>'
      +'<p>Discover the right car for every occasion. From city drives to extraordinary experiences in Dubai.</p>'
      +'<div class="lux-footer-social"><a href="https://wa.me/'+whatsapp+'" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">'+icon('message',19)+'</a>'
      +'<a href="'+mapsUrl+'" target="_blank" rel="noopener noreferrer" aria-label="Find us on Google Maps">'+icon('pin',19)+'</a></div></div>'
      +'<div class="lux-footer-col"><h3>Discover</h3><a href="#home">Home</a><a href="#fleet">Explore Cars</a><a href="#my-rental">My Rental</a><a href="#about">About Us</a></div>'
      +'<div class="lux-footer-col"><h3>Explore</h3><a href="#fleet" data-footer-category="Economy">Economy Cars</a><a href="#fleet" data-footer-category="Sedan">Sedans</a>'
      +'<a href="#fleet" data-footer-category="SUV">SUVs</a><a href="#fleet" data-footer-category="Luxury">Luxury Cars</a></div>'
      +'<div class="lux-footer-col lux-footer-contact"><h3>Visit & Contact</h3><span>'+icon('pin',16)+' '+esc(CFG.address)+'</span>'
      +'<a href="tel:+'+phone+'">'+icon('phone',16)+' '+esc(CFG.phoneDisplay||'+971 56 682 9999')+'</a>'
      +'<a href="'+mapsUrl+'" target="_blank" rel="noopener noreferrer">'+icon('arrow',16)+' View on Google Maps</a></div>'
      +'</div><div class="container lux-footer-bottom"><span>© '+new Date().getFullYear()+' '+esc(CFG.businessName)+'. All rights reserved.</span>'
      +'<span>Made for effortless journeys in Dubai.</span></div></footer>';
  };
  document.addEventListener('click',function(e){
    const brand=e.target.closest('[data-brand-filter]');
    if(brand){e.preventDefault();ui.category='All';ui.search=brand.dataset.brandFilter||'';navigate('fleet');return;}
    const cat=e.target.closest('[data-footer-category]');
    if(cat){e.preventDefault();ui.search='';ui.category=cat.dataset.footerCategory;navigate('fleet');}
  });
  bottomNav=function(){
    return '<nav class="bottom-nav" aria-label="Mobile navigation">'
      +'<a href="#home" class="'+(ui.page==='home'?'active':'')+'">'+icon('grid',21)+'<span>Home</span></a>'
      +'<a href="#fleet" class="'+(['fleet','detail','booking'].includes(ui.page)?'active':'')+'">'+icon('car',21)+'<span>Explore</span></a>'
      +'<a href="#my-rental" class="'+(ui.page==='my-rental'?'active':'')+'">'+icon('calendar',21)+'<span>My Rental</span></a>'
      +'<a href="#about" class="'+(ui.page==='about'?'active':'')+'">'+icon('user',21)+'<span>About</span></a></nav>';
  };
  // App handlers, data and pages remain provided by app.js.
  render(false);
})();
