'use strict';
/* Visual enhancements only. Core quote, owner and rental flows stay in app.js. */
(function(){
 const logoEnabled=()=>Boolean(window.SMART_RENTAL_CONFIG?.logoPath);
 let albumIndex=0,albumKey='';
 const slots=[
   {label:'Exterior',hint:'Catalogue image'},
   {label:'Front',hint:'Front-angle photo pending'},
   {label:'Side',hint:'Side-angle photo pending'},
   {label:'Rear',hint:'Rear-angle photo pending'},
   {label:'Interior',hint:'Interior photo pending'}
 ];
 function currentAlbum(){
   const h=document.querySelector('.detail-info h1');
   const id=(h?.textContent||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
   const img=document.querySelector('.premium-gallery');
   return {id,el:img};
 }
 function makeGallery(el){
   if(el.dataset.premium==='1')return;
   const img=el.querySelector('img');
   const original=img?.getAttribute('src')||'';
   const title=document.querySelector('.detail-info h1')?.textContent||'Vehicle';
   if(albumKey!==title){albumKey=title;albumIndex=0;}
   const photos=slots.map((s,i)=>({...s,src:i===0?original:null}));
   el.dataset.premium='1';
   el.className='premium-gallery';
   el.dataset.gallery=title;
   const paint=()=>{
     const p=photos[albumIndex];
     el.innerHTML='<div class="premium-gallery-main"><span class="premium-gallery-count">'+(albumIndex+1)+' / 5</span>'+
       (p.src?'<img loading="eager" src="'+p.src.replace(/"/g,'&quot;')+'" alt="'+title.replace(/"/g,'&quot;')+' catalogue photo">':
       '<div class="gallery-placeholder"><span style="font-size:42px">📷</span><strong>'+p.label+' view</strong><span>'+p.hint+'</span></div>')+
       '<button class="premium-gallery-nav premium-gallery-prev" type="button" aria-label="Previous photo">‹</button><button class="premium-gallery-nav premium-gallery-next" type="button" aria-label="Next photo">›</button></div>'+
       '<div class="premium-gallery-thumbs">'+photos.map((x,i)=>'<button type="button" class="premium-gallery-thumb '+(i===albumIndex?'active ':'')+(!x.src?'pending':'')+'" data-gallery-index="'+i+'" aria-label="'+x.label+' view">'+(x.src?'<img src="'+x.src.replace(/"/g,'&quot;')+'" alt="">':'<span style="font-size:22px">＋</span>')+'<span>'+x.label+'</span></button>').join('')+'</div>'+
       '<span class="premium-gallery-note">Photos show the owner-provided catalogue where available. Additional genuine angles and cabin photos must be supplied before publishing as verified vehicle photography.</span>';
   };
   el.addEventListener('click',event=>{
     if(event.target.closest('.premium-gallery-prev'))albumIndex=(albumIndex+4)%5;
     else if(event.target.closest('.premium-gallery-next'))albumIndex=(albumIndex+1)%5;
     else {const b=event.target.closest('[data-gallery-index]');if(!b)return;albumIndex=Number(b.dataset.galleryIndex);}
     paint();
   });
   paint();
 }
 function enhance(){
   document.body.classList.toggle('has-brand-logo',logoEnabled());
   const hero=document.querySelector('.hero');
   if(hero){
     hero.classList.add('hero-premium');
     const image=hero.querySelector('.hero-art>img');
     if(image)image.alt='Illustrative vehicle photograph for the rental website preview';
   }
   const detail=document.querySelector('.detail-image');
   if(detail)makeGallery(detail);
 }
 const app=document.getElementById('app');
 if(!app)return;
 const observer=new MutationObserver(enhance);
 observer.observe(app,{childList:true,subtree:false});
 enhance();
})();
