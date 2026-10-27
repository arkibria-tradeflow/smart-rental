/* Explore Cars v2: precise brand, body style and indicative price filters.
   Leaves booking data, pages and approved photos untouched. */
(function () {
  "use strict";
  ui.brand = ui.brand || "All";
  ui.priceMin = ui.priceMin || "";
  ui.priceMax = ui.priceMax || "";
  ui.srFiltersOpen = false;
  const styles = ["All", "Economy", "Sedan", "SUV", "Luxury", "Sports", "Van"];

  function brandOf(car) {
    const n = car.name;
    if (n.startsWith("Range Rover ")) return "Range Rover";
    if (n.startsWith("Land Rover ")) return "Land Rover";
    if (n.startsWith("Rolls-Royce ")) return "Rolls-Royce";
    if (n.startsWith("Mercedes ")) return "Mercedes-Benz";
    if (n.startsWith("Mini ")) return "MINI";
    return n.split(" ")[0];
  }
  const allBrands = [...new Set(cars.map(brandOf))].sort((a,b)=>a.localeCompare(b));
  function brandKey(name) {
    return name==="Mercedes" ? "Mercedes-Benz" : name;
  }
  function hasFilters() {
    return ui.category !== "All" || ui.brand !== "All" || ui.priceMin !== "" || ui.priceMax !== "" || ui.search.trim() !== "";
  }
  function activeCount() {
    return Number(ui.category!=="All") + Number(ui.brand!=="All") + Number(ui.priceMin!=="" || ui.priceMax!=="");
  }
  filtered = function() {
    const q=ui.search.trim().toLowerCase();
    let out=cars.filter(function(c){
      if(q && ![c.name,c.category,brandOf(c)].some(t=>t.toLowerCase().includes(q)))return false;
      if(ui.category!=="All" && c.category!==ui.category)return false;
      if(ui.brand!=="All" && brandOf(c)!==brandKey(ui.brand))return false;
      if(ui.priceMin!=="" && (c.rate==null || c.rate<Number(ui.priceMin)))return false;
      if(ui.priceMax!=="" && (c.rate==null || c.rate>Number(ui.priceMax)))return false;
      return true;
    });
    if(ui.sort==="low")out.sort((a,b)=>(a.rate??Infinity)-(b.rate??Infinity));
    if(ui.sort==="high")out.sort((a,b)=>(b.rate??-Infinity)-(a.rate??-Infinity));
    if(ui.sort==="name")out.sort((a,b)=>a.name.localeCompare(b.name));
    return out;
  };
  function options(values,selected) {
    return values.map(function(v){
      return "<option value='"+esc(v)+"' "+(v===selected?"selected":"")+">"+esc(v==="All"?"All types":v==="Sports"?"Supercars":v)+"</option>";
    }).join("");
  }
  function selectBrands() {
    return "<option value='All' "+(ui.brand==="All"?"selected":"")+">All brands</option>"+
      allBrands.map(b=>"<option value='"+esc(b)+"' "+(brandKey(ui.brand)===b?"selected":"")+">"+esc(b)+"</option>").join("");
  }
  function filterFields(prefix){
    return "<label class='sr-filter-label' for='"+prefix+"-brand'>Brand</label>"+
      "<select id='"+prefix+"-brand' name='brand' class='sr-filter-control'>"+selectBrands()+"</select>"+
      "<label class='sr-filter-label' for='"+prefix+"-type'>Car style</label>"+
      "<select id='"+prefix+"-type' name='category' class='sr-filter-control'>"+options(styles,ui.category)+"</select>"+
      "<label class='sr-filter-label' for='"+prefix+"-min'>Listed price (AED)</label>"+
      "<div class='sr-price-row'><div><span>Minimum</span><input class='sr-filter-control' id='"+prefix+"-min' name='priceMin' type='number' inputmode='numeric' min='0' max='100000' step='1' placeholder='No minimum' value='"+esc(ui.priceMin)+"'></div>"+
      "<div><span>Maximum</span><input class='sr-filter-control' id='"+prefix+"-max' name='priceMax' type='number' inputmode='numeric' min='0' max='100000' step='1' placeholder='No maximum' value='"+esc(ui.priceMax)+"'></div></div>"+
      "<p class='sr-price-hint'>These are catalogue figures, not confirmed daily rates.</p>";
  }
  function appliedChips(){
    let chips=[];
    if(ui.category!=="All")chips.push(["category",ui.category==="Sports"?"Supercars":ui.category]);
    if(ui.brand!=="All")chips.push(["brand",brandKey(ui.brand)]);
    if(ui.priceMin!=="" || ui.priceMax!==""){
      const label=ui.priceMin!=="" && ui.priceMax!=="" ? "AED "+Number(ui.priceMin).toLocaleString()+"–"+Number(ui.priceMax).toLocaleString() :
        ui.priceMin!=="" ? "From AED "+Number(ui.priceMin).toLocaleString() : "Up to AED "+Number(ui.priceMax).toLocaleString();
      chips.push(["price",label]);
    }
    if(ui.search.trim())chips.push(["search","“"+ui.search.trim()+"”"]);
    if(!chips.length)return "";
    return "<div class='sr-active-filters' aria-label='Active filters'>"+
      chips.map(c=>"<button type='button' class='sr-active-pill' data-sr-remove='"+c[0]+"' aria-label='Remove "+esc(c[1])+" filter'>"+esc(c[1])+" <span aria-hidden='true'>×</span></button>").join("")+
      "<button class='sr-clear-text' data-sr-reset type='button'>Clear all</button></div>";
  }
  function cardForExplore(c){
    const price=c.rate==null?"Request a quote":num(c.rate);
    return "<article class='sr-fleet-card'>"+
      "<button type='button' data-action='details' data-id='"+esc(c.id)+"' class='sr-fleet-photo' aria-label='View "+esc(c.name)+"'>"+
        carImg(c)+"<span class='sr-fleet-type'>"+esc(c.category==="Sports"?"Supercar":c.category)+"</span>"+
      "</button>"+
      "<div class='sr-fleet-card-info'>"+
        "<div class='sr-fleet-card-brand'>"+esc(brandOf(c))+"</div>"+
        "<h3>"+esc(c.name)+"</h3>"+
        "<div class='sr-fleet-card-bottom'><div><span>Catalogue price</span><strong>"+price+"</strong></div>"+
        "<button type='button' class='sr-fleet-card-button' data-action='details' data-id='"+esc(c.id)+"' aria-label='View details of "+esc(c.name)+"'>"+icon("arrow",18)+"</button></div>"+
      "</div></article>";
  }
  function filterDialog(){
    if(!ui.srFiltersOpen)return "";
    return "<div class='sr-filter-overlay'><button type='button' data-sr-close class='sr-filter-shade' aria-label='Close filters'></button>"+
      "<section class='sr-filter-sheet' role='dialog' aria-modal='true' aria-labelledby='sr-mobile-filters-title'>"+
        "<div class='sr-sheet-grabber' aria-hidden='true'></div>"+
        "<div class='sr-sheet-head'><div><span class='sr-overline'>REFINE YOUR SEARCH</span><h2 id='sr-mobile-filters-title'>Filters</h2></div>"+
        "<button class='sr-sheet-close' data-sr-close type='button' aria-label='Close filters'>×</button></div>"+
        "<form id='sr-mobile-filter-form' class='sr-sheet-form'>"+
          "<div class='sr-sheet-fields'>"+filterFields("sr-mobile")+"</div>"+
          "<div class='sr-sheet-actions'><button type='button' data-sr-clear-form class='sr-outline-clear'>Reset</button>"+
          "<button type='submit' class='sr-apply-btn'>Show cars "+icon("arrow",17)+"</button></div>"+
        "</form></section></div>";
  }
  fleet=function(){
    const list=filtered();
    const n=activeCount();
    return "<main class='container inner-main sr-explore'>"+
      "<div class='sr-explore-intro'><div class='sr-overline'>DISCOVER OUR FLEET</div><h1>Explore our cars</h1><p>Find a car that fits your style and budget.</p></div>"+
      "<div class='sr-explore-toolbar'>"+
        "<label class='sr-explore-search'>"+icon("search",19)+"<input id='fleet-search' type='search' value='"+esc(ui.search)+"' placeholder='Search models or brands' autocomplete='off' aria-label='Search car models or brands'></label>"+
        "<label class='sr-sort'><span>Sort</span><select id='sr-sort-select' aria-label='Sort vehicles'>"+
          [["recommended","Recommended"],["low","Price: low to high"],["high","Price: high to low"],["name","Name: A to Z"]].map(o=>"<option value='"+o[0]+"' "+(ui.sort===o[0]?"selected":"")+">"+o[1]+"</option>").join("")+
        "</select></label>"+
      "</div>"+
      "<div class='sr-category-chips' aria-label='Filter by car style'>"+
        styles.map(s=>"<button type='button' data-sr-category='"+esc(s)+"' class='sr-style-chip "+(ui.category===s?"active":"")+"' aria-pressed='"+(ui.category===s?"true":"false")+"'>"+esc(s==="All"?"All cars":s==="Sports"?"Supercars":s)+"</button>").join("")+
      "</div>"+
      "<div class='sr-explore-main'>"+
        "<aside class='sr-filter-sidebar' aria-label='Filter vehicles'><div class='sr-sidebar-title'>"+icon("filter",19)+"<strong>Refine results</strong></div>"+
          "<form id='sr-desktop-filter-form' class='sr-filter-form'>"+filterFields("sr-desktop")+
          "<button class='sr-apply-btn' type='submit'>Apply filters</button>"+
          "<button class='sr-sidebar-reset' data-sr-reset type='button'>Reset filters</button></form>"+
        "</aside>"+
        "<section class='sr-fleet-results'><div class='sr-results-summary'><span><b>"+list.length+"</b> "+(list.length===1?"car":"cars")+" found</span>"+
          "<button type='button' class='sr-open-filter' data-sr-open>"+icon("filter",18)+" Filters "+(n?"<span>"+n+"</span>":"")+"</button></div>"+
        appliedChips()+
        (list.length?"<div class='sr-fleet-grid'>"+list.map(cardForExplore).join("")+"</div>":
          "<div class='sr-no-results'>"+icon("search",34)+"<h2>No cars found</h2><p>Try a different brand, type or price range.</p><button data-sr-reset type='button' class='sr-apply-btn'>Clear filters</button></div>")+
        "<p class='sr-catalogue-note'>Prices are indicative catalogue figures; the rental period, availability, deposits and final costs are confirmed by the rental team.</p>"+
        "</section></div>"+filterDialog()+"</main>";
  };
  function clear(){
    ui.brand="All";ui.category="All";ui.priceMin="";ui.priceMax="";ui.search="";ui.srFiltersOpen=false;
  }
  function apply(form) {
    const d=new FormData(form);
    const low=String(d.get("priceMin")||"").trim();
    const high=String(d.get("priceMax")||"").trim();
    if(low!=="" && high!=="" && Number(low)>Number(high)){
      alert("Maximum price must be greater than minimum price.");return;
    }
    ui.brand=String(d.get("brand")||"All");
    ui.category=String(d.get("category")||"All");
    ui.priceMin=low;ui.priceMax=high;
    ui.srFiltersOpen=false;
    render(false);
  }
  document.addEventListener("click",function(e){
    if(e.target.closest("[data-sr-open]")){e.preventDefault();ui.srFiltersOpen=true;render(false);const el=document.querySelector(".sr-sheet-close");el?.focus();return;}
    if(e.target.closest("[data-sr-close]")){e.preventDefault();ui.srFiltersOpen=false;render(false);return;}
    if(e.target.closest("[data-sr-clear-form]")){
      e.preventDefault();
      const f=e.target.closest("form");
      if(f){f.querySelector("[name=brand]").value="All";f.querySelector("[name=category]").value="All";f.querySelector("[name=priceMin]").value="";f.querySelector("[name=priceMax]").value="";}
      return;
    }
    const category=e.target.closest("[data-sr-category]");
    if(category){e.preventDefault();ui.category=category.dataset.srCategory;render(false);return;}
    if(e.target.closest("[data-sr-reset]")){e.preventDefault();clear();render(false);return;}
    const remove=e.target.closest("[data-sr-remove]");
    if(remove){
      e.preventDefault();const type=remove.dataset.srRemove;
      if(type==="brand")ui.brand="All";
      if(type==="category")ui.category="All";
      if(type==="price"){ui.priceMin="";ui.priceMax="";}
      if(type==="search")ui.search="";
      render(false);return;
    }
    // Homepage navigation should reset stale filters from a previous browse session.
    if(ui.page!=="fleet" && (e.target.closest("[data-action=browse]")||e.target.closest("[data-action=category]"))){
      ui.brand="All";ui.priceMin="";ui.priceMax="";ui.search="";
    }
  },true);
  document.addEventListener("change",function(e){
    if(e.target.id==="sr-sort-select"){ui.sort=e.target.value;render(false);return;}
    if(e.target.id==="sr-desktop-brand" || e.target.id==="sr-desktop-type"){
      apply(e.target.closest("form"));
    }
  });
  document.addEventListener("submit",function(e){
    if(e.target.id==="sr-desktop-filter-form"||e.target.id==="sr-mobile-filter-form"){
      e.preventDefault();apply(e.target);
    }
  });
  document.addEventListener("keydown",function(e){
    if(e.key==="Escape" && ui.srFiltersOpen){ui.srFiltersOpen=false;render(false);}
  });
  render(false);
})();