'use strict';
/* Keep compact logo support without replacing single-car imagery with galleries. */
(function(){
  const app=document.getElementById('app');
  if(!app)return;
  function enhance(){document.body.classList.toggle('has-brand-logo',Boolean(window.SMART_RENTAL_CONFIG?.logoPath));}
  const observer=new MutationObserver(enhance);
  observer.observe(app,{childList:true,subtree:false});
  enhance();
})();
