/* Smart Rental: hide detail's fixed action dock while footer is on screen.
   Rebind after SPA renders; no network calls or persistent state. */
(function(){
"use strict";
const app=document.getElementById("app");
if(!app)return;
let watched=null,observer=null;
function update(){
 const dock=app.querySelector(".sr-vdetail-v2 .sr-vdetail-cta-bar");
 const footer=app.querySelector(".sr-footer-v2");
 if(!dock||!footer){
   if(observer){observer.disconnect();observer=null;}
   watched=null;
   document.body.classList.remove("sr-detail-footer-near");
   return;
 }
 if(watched===footer)return;
 if(observer)observer.disconnect();
 watched=footer;
 const watchFooter=()=>document.body.classList.toggle(
   "sr-detail-footer-near",
   footer.getBoundingClientRect().top < window.innerHeight-110
 );
 watchFooter();
 if("IntersectionObserver" in window){
   observer=new IntersectionObserver(watchFooter,{threshold:[0,.01,.05]});
   observer.observe(footer);
 }
}
const domObserver=new MutationObserver(update);
domObserver.observe(app,{childList:true});
window.addEventListener("scroll",()=>{
 if(watched)document.body.classList.toggle(
  "sr-detail-footer-near",watched.getBoundingClientRect().top < window.innerHeight-110
 );
},{passive:true});
window.addEventListener("resize",()=>{
 if(watched)document.body.classList.toggle(
  "sr-detail-footer-near",watched.getBoundingClientRect().top < window.innerHeight-110
 );
},{passive:true});
update();
})();