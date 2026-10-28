/* Accessible, progressive enhancement for the luxury homepage carousel.
   Reinitializes after the existing SPA navigates back to Home. */
(function(){
  "use strict";
  const app=document.getElementById("app");
  if(!app)return;
  const intervalMs=7000;
  const pauseMs=12000;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  let mounted=null;
  function unmount(){
    if(!mounted)return;
    window.clearInterval(mounted.interval);
    mounted=null;
  }
  function initialize(){
    const root=app.querySelector("#sr-luxury-slideshow");
    if(root===mounted?.root)return;
    unmount();
    if(!root)return;
    const slides=Array.from(root.querySelectorAll(".sr-lux-slide"));
    const dots=Array.from(root.querySelectorAll(".sr-lux-dot"));
    if(slides.length<2)return;
    let messages=[];
    try{messages=JSON.parse(root.dataset.srMessages||"[]");}catch(e){messages=[];}
    const messageNode=app.querySelector(".sr-hero-message");
    const leadNode=app.querySelector("[data-sr-hero-lead]");
    const accentNode=app.querySelector("[data-sr-hero-accent]");
    const descriptionNode=app.querySelector("[data-sr-hero-description]");
    const name=root.querySelector("[data-sr-lux-name]");
    const counter=root.querySelector("[data-sr-lux-count]");
    const state={root,slides,dots,current:0,pending:0,pausedUntil:0,hovering:false,focused:false,interval:null,startX:null,startY:null};
    mounted=state;
    function ensureLoaded(index){
      const img=slides[index].querySelector("img");
      if(!img)return Promise.resolve(false);
      if(img.dataset.src){
        img.loading="eager";
        img.src=img.dataset.src;
        delete img.dataset.src;
      }
      if(img.complete)return Promise.resolve(img.naturalWidth>0);
      if(typeof img.decode==="function")return img.decode().then(()=>true,()=>false);
      return new Promise(resolve=>{
        img.addEventListener("load",()=>resolve(true),{once:true});
        img.addEventListener("error",()=>resolve(false),{once:true});
      });
    }
    function warmNext(index){
      ensureLoaded((index+1)%slides.length);
      ensureLoaded((index+2)%slides.length);
    }
    function show(next,manual){
      if(manual)state.pausedUntil=Date.now()+pauseMs;
      const target=(next+slides.length)%slides.length;
      if(target===state.current)return;
      const request=++state.pending;
      ensureLoaded(target).then(ok=>{
        if(!ok || mounted!==state || request!==state.pending)return;
        const old=state.current;
        slides[old].classList.remove("is-active");
        slides[old].setAttribute("aria-hidden","true");
        slides[target].classList.add("is-active");
        slides[target].setAttribute("aria-hidden","false");
        state.current=target;
        const msg=messages[Number(slides[target].dataset.srMessage)];
        if(msg && leadNode && accentNode && descriptionNode){
          leadNode.textContent=msg.lead;
          accentNode.textContent=msg.accent;
          descriptionNode.textContent=msg.detail;
          const titleElement=leadNode.closest("h1");
          if(titleElement)titleElement.classList.toggle("sr-hero-long",Number(slides[target].dataset.srMessage)===2);
          if(messageNode && !reduced.matches){
            messageNode.classList.remove("sr-message-enter");
            void messageNode.offsetWidth;
            messageNode.classList.add("sr-message-enter");
          }
        }
        const img=slides[target].querySelector("img");
        if(name)name.textContent=img?.alt||"Premium car";
        if(counter)counter.textContent=String(target+1).padStart(2,"0")+" / "+String(slides.length).padStart(2,"0");
        dots.forEach((dot,i)=>{
          dot.classList.toggle("is-active",i===target);
          dot.setAttribute("aria-pressed",String(i===target));
        });
        warmNext(target);
      });
    }
    root.addEventListener("click",e=>{
      const arrow=e.target.closest("[data-sr-step]");
      if(arrow){show(state.current+Number(arrow.dataset.srStep),true);return;}
      const dot=e.target.closest("[data-sr-go]");
      if(dot)show(Number(dot.dataset.srGo),true);
    });
    // Pause while visitors are reading the headline as well as while using the car controls.
    const hoverArea=root.closest(".sr-hero-layout")||root;
    hoverArea.addEventListener("mouseenter",()=>{state.hovering=true;});
    hoverArea.addEventListener("mouseleave",()=>{state.hovering=false;});
    hoverArea.addEventListener("focusin",()=>{state.focused=true;});
    hoverArea.addEventListener("focusout",e=>{if(!hoverArea.contains(e.relatedTarget))state.focused=false;});
    root.addEventListener("touchstart",e=>{
      if(e.touches.length!==1)return;
      state.startX=e.touches[0].clientX;
      state.startY=e.touches[0].clientY;
    },{passive:true});
    root.addEventListener("touchend",e=>{
      if(state.startX==null||!e.changedTouches.length)return;
      const dx=e.changedTouches[0].clientX-state.startX;
      const dy=e.changedTouches[0].clientY-state.startY;
      state.startX=null;state.startY=null;
      if(Math.abs(dx)>42&&Math.abs(dx)>Math.abs(dy)*1.35)
        show(state.current+(dx<0?1:-1),true);
    },{passive:true});
    state.interval=window.setInterval(()=>{
      if(mounted!==state||reduced.matches||document.hidden||state.hovering||state.focused||Date.now()<state.pausedUntil)return;
      show(state.current+1,false);
    },intervalMs);
    warmNext(0);
  }
  const observer=new MutationObserver(initialize);
  observer.observe(app,{childList:true});
  initialize();
})();
