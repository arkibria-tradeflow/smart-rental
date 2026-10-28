/* Hero V4: car photography and customer promises rotate on independent clocks.
   No slide-to-headline coupling. SPA-safe initialization and reduced-motion support. */
(function(){
  "use strict";
  const app=document.getElementById("app");
  if(!app)return;

  const CAR_INTERVAL=5000;
  const MESSAGE_INTERVAL=9000;
  const MANUAL_PAUSE=9000;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  let current=null;

  function initialize(){
    const root=app.querySelector("#sr-luxury-slideshow");
    if(current?.root===root)return;
    if(current){current.destroy();current=null;}
    if(!root)return;
    const slides=Array.from(root.querySelectorAll(".sr-lux-slide"));
    if(slides.length<2)return;
    let messages=[];
    try{messages=JSON.parse(root.dataset.srMessages||"[]");}catch(e){}
    const lead=app.querySelector("[data-sr-hero-lead]");
    const accent=app.querySelector("[data-sr-hero-accent]");
    const description=app.querySelector("[data-sr-hero-description]");
    const messagePanel=app.querySelector(".sr-hero-message");
    const carName=root.querySelector("[data-sr-lux-name]");
    const counter=root.querySelector("[data-sr-lux-count]");
    const hoverArea=root.querySelector(".sr-lux-controls")||root;
    const timers=[];
    const state={
      root,carIndex:0,messageIndex:0,request:0,
      pauseCarsUntil:0,hovering:false,focused:false,swipeStart:null,
      destroy(){
        timers.forEach(id=>window.clearInterval(id));
        current=null;
      }
    };
    current=state;

    function ensureImage(index){
      const image=slides[index]?.querySelector("img");
      if(!image)return Promise.resolve(false);
      if(image.complete&&image.naturalWidth>0)return Promise.resolve(true);
      return new Promise(resolve=>{
        let complete=false;
        const settle=success=>{
          if(complete)return;
          complete=true;
          image.removeEventListener("load",loaded);
          image.removeEventListener("error",failed);
          resolve(success);
        };
        const loaded=()=>settle(true);
        const failed=()=>{
          // If the showcase image isn't installed yet, show catalogue
          // photography until the six approved creative files are uploaded.
          if(image.dataset.fallback){
            const fallback=image.dataset.fallback;
            delete image.dataset.fallback;
            image.src=fallback;
            return;
          }
          // The inline image fallback may have already started loading.
          if(image.currentSrc && image.currentSrc.includes("/assets/") &&
            !image.currentSrc.includes("/assets/hero/") && !image.complete)return;
          settle(false);
        };
        image.addEventListener("load",loaded);
        image.addEventListener("error",failed);
        if(image.dataset.src){
          image.loading="eager";
          image.src=image.dataset.src;
          delete image.dataset.src;
        }else if(image.complete){
          settle(image.naturalWidth>0);
        }
      });
    }
    function preload(index){
      ensureImage((index+1)%slides.length).catch(()=>{});
    }
    function changeCar(next,manual=false){
      const index=(next+slides.length)%slides.length;
      if(manual)state.pauseCarsUntil=Date.now()+MANUAL_PAUSE;
      if(index===state.carIndex)return;
      const token=++state.request;
      ensureImage(index).then(ready=>{
        if(!ready||current!==state||token!==state.request)return;
        const old=state.carIndex;
        slides[old].classList.remove("is-active");
        slides[old].setAttribute("aria-hidden","true");
        slides[index].classList.add("is-active");
        slides[index].setAttribute("aria-hidden","false");
        state.carIndex=index;
        const img=slides[index].querySelector("img");
        if(carName)carName.textContent=img?.alt||"Featured vehicle";
        if(counter)counter.textContent=String(index+1).padStart(2,"0")+" / "+String(slides.length).padStart(2,"0");
        preload(index);
      });
    }
    function changeMessage(next){
      if(!messages.length||!lead||!accent||!description)return;
      const index=(next+messages.length)%messages.length;
      const content=messages[index];
      state.messageIndex=index;
      lead.textContent=content.lead;
      accent.textContent=content.accent;
      description.textContent=content.detail;
      const heading=lead.closest("h1");
      if(heading)heading.classList.toggle("sr-hero-long",index===2);
      if(messagePanel&&!reduced.matches){
        messagePanel.classList.remove("sr-message-enter");
        void messagePanel.offsetWidth;
        messagePanel.classList.add("sr-message-enter");
      }
    }
    function onRootClick(e){
      const arrow=e.target.closest("[data-sr-step]");
      if(arrow){changeCar(state.carIndex+Number(arrow.dataset.srStep),true);}
    }
    const enter=()=>{state.hovering=true;};
    const leave=()=>{state.hovering=false;};
    const focus=()=>{state.focused=true;};
    const blur=e=>{if(!hoverArea.contains(e.relatedTarget))state.focused=false;};
    const touchStart=e=>{
      if(e.touches.length===1)state.swipeStart=[e.touches[0].clientX,e.touches[0].clientY];
    };
    const touchEnd=e=>{
      if(!state.swipeStart||!e.changedTouches.length)return;
      const dx=e.changedTouches[0].clientX-state.swipeStart[0];
      const dy=e.changedTouches[0].clientY-state.swipeStart[1];
      state.swipeStart=null;
      if(Math.abs(dx)>42&&Math.abs(dx)>Math.abs(dy)*1.4)
        changeCar(state.carIndex+(dx<0?1:-1),true);
    };
    root.addEventListener("click",onRootClick);
    hoverArea.addEventListener("mouseenter",enter);
    hoverArea.addEventListener("mouseleave",leave);
    hoverArea.addEventListener("focusin",focus);
    hoverArea.addEventListener("focusout",blur);
    root.addEventListener("touchstart",touchStart,{passive:true});
    root.addEventListener("touchend",touchEnd,{passive:true});
    // Remove listeners before a replacement SPA render to avoid accumulation.
    state.destroy=()=>{
      timers.forEach(id=>window.clearInterval(id));
      root.removeEventListener("click",onRootClick);
      hoverArea.removeEventListener("mouseenter",enter);
      hoverArea.removeEventListener("mouseleave",leave);
      hoverArea.removeEventListener("focusin",focus);
      hoverArea.removeEventListener("focusout",blur);
      root.removeEventListener("touchstart",touchStart);
      root.removeEventListener("touchend",touchEnd);
    };
    timers.push(window.setInterval(()=>{
      if(current!==state||reduced.matches||document.hidden||state.hovering||state.focused||Date.now()<state.pauseCarsUntil)return;
      changeCar(state.carIndex+1);
    },CAR_INTERVAL));
    timers.push(window.setInterval(()=>{
      if(current!==state||reduced.matches||document.hidden||state.hovering||state.focused)return;
      changeMessage(state.messageIndex+1);
    },MESSAGE_INTERVAL));
    preload(0);
  }
  const observer=new MutationObserver(initialize);
  observer.observe(app,{childList:true});
  initialize();
})();