const trips = [
  {id:"amalfi",name:"The Amalfi slow-down",place:"Amalfi Coast, Italy",country:"Italy",style:"coast",tag:"SALT AIR & SLOW DAYS",duration:"5 nights",season:"May – October",price:1280,description:"Lemon groves, little coves, and long lunches by the water.",image:"https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=900&q=80",position:"center 52%"},
  {id:"kyoto",name:"Kyoto, between seasons",place:"Kyoto, Japan",country:"Japan",style:"culture",tag:"A CITY TO WANDER",duration:"6 nights",season:"March – November",price:1640,description:"Temple paths, quiet tea houses, and the city at its own pace.",image:"https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80",position:"center 53%"},
  {id:"dolomites",name:"A cabin in the Dolomites",place:"South Tyrol, Italy",country:"Italy",style:"nature",tag:"MOUNTAIN AIR",duration:"4 nights",season:"June – September",price:990,description:"Wake to the peaks, follow a trail, come back to the fire.",image:"https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",position:"center 55%"},
  {id:"lisbon",name:"Lisbon, no rush",place:"Lisbon, Portugal",country:"Portugal",style:"culture",tag:"CITY WITH A VIEW",duration:"4 nights",season:"All year",price:760,description:"Sun-warmed tiles, neighbourhood bakeries, and tram-window views.",image:"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=80",position:"center 55%"},
  {id:"bali",name:"Bali, beyond the beach",place:"Ubud, Indonesia",country:"Indonesia",style:"nature",tag:"GREEN GETAWAY",duration:"7 nights",season:"April – October",price:1420,description:"A garden stay, early rice-field walks, and time to reset.",image:"https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",position:"center 52%"},
  {id:"cyclades",name:"A week in the Cyclades",place:"Naxos, Greece",country:"Greece",style:"coast",tag:"ISLAND TIME",duration:"6 nights",season:"May – September",price:1170,description:"Whitewashed lanes, a blue-water swim, and nowhere else to be.",image:"https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=80",position:"center 53%"}
];
const styleNames={coast:"Coast",culture:"Culture",nature:"Nature"};
const grid=document.querySelector("#trip-grid");
const empty=document.querySelector("#empty-state");
const search=document.querySelector("#search-input");
const savedToggle=document.querySelector("#saved-toggle");
const savedCount=document.querySelector("#saved-count");
const results=document.querySelector("#results-count");
let activeFilter="all", savedOnly=false, toastTimer;
let saved=new Set();
try{saved=new Set(JSON.parse(localStorage.getItem("roamly-saved")||"[]"));}catch{saved=new Set();}
function render(){
  const query=search.value.trim().toLowerCase();
  const visible=trips.filter(trip=>{
    const matchesStyle=activeFilter==="all"||trip.style===activeFilter;
    const text=`${trip.name} ${trip.place} ${trip.country} ${trip.style} ${trip.description}`.toLowerCase();
    return matchesStyle&&text.includes(query)&&(!savedOnly||saved.has(trip.id));
  });
  grid.innerHTML=visible.map(trip=>`<article class="trip-card">
    <div class="trip-photo" style="background-image:url('${trip.image}');background-position:${trip.position}">
      <span class="trip-tag">${trip.tag}</span>
      <button class="save-trip ${saved.has(trip.id)?"saved":""}" data-save="${trip.id}" type="button" aria-label="${saved.has(trip.id)?"Remove":"Save"} ${trip.name}" aria-pressed="${saved.has(trip.id)}">${saved.has(trip.id)?"♥":"♡"}</button>
      <span class="photo-place">${trip.place.toUpperCase()}</span>
    </div>
    <div class="trip-info"><div class="trip-meta"><span>${styleNames[trip.style]} · ${trip.duration}</span><span>✳ &nbsp; 4.9</span></div><h3 class="trip-title">${trip.name}</h3><p class="trip-description">${trip.description}</p><div class="trip-bottom"><span class="trip-price">From <strong>$${trip.price.toLocaleString("en-US")}</strong> <small>/ person</small></span><button class="trip-cta" data-book="${trip.id}" type="button">View trip ↗</button></div></div>
  </article>`).join("");
  empty.hidden=visible.length!==0;grid.hidden=visible.length===0;
  results.textContent=savedOnly?`Showing ${visible.length} saved ${visible.length===1?"escape":"escapes"}`:`Showing ${visible.length} thoughtful ${visible.length===1?"escape":"escapes"}`;
  savedCount.textContent=saved.size;
  savedToggle.setAttribute("aria-pressed",String(savedOnly));
}
function showToast(message){const toast=document.querySelector("#toast");toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2200);}
grid.addEventListener("click",event=>{
  const saveButton=event.target.closest("[data-save]");
  if(saveButton){const id=saveButton.dataset.save;if(saved.has(id)){saved.delete(id);showToast("Removed from your saved trips.");}else{saved.add(id);showToast("Trip saved for later.");}try{localStorage.setItem("roamly-saved",JSON.stringify([...saved]));}catch{}render();return;}
  const bookButton=event.target.closest("[data-book]");
  if(bookButton){const trip=trips.find(item=>item.id===bookButton.dataset.book);openBooking(trip);}
});
function openBooking(trip){document.querySelector("#booking-destination").textContent=trip.place;document.querySelector("#booking-description").textContent=`${trip.duration} · ${trip.season} · from $${trip.price.toLocaleString("en-US")} per person. ${trip.description}`;document.querySelector("#booking-form").hidden=false;document.querySelector("#booking-success").hidden=true;document.querySelector("#booking-form").reset();document.querySelector("#booking-dialog").showModal();}
document.querySelector("#booking-form").addEventListener("submit",event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const name=new FormData(form).get("name").trim().split(/\s+/)[0];document.querySelector("#booking-confirmation").textContent=`Thanks, ${name}. Your interest is noted. In a full booking site, a travel specialist would follow up with the details.`;form.hidden=true;document.querySelector("#booking-success").hidden=false;});
document.querySelector("#close-success").addEventListener("click",()=>document.querySelector("#booking-dialog").close());
document.querySelectorAll(".filter").forEach(button=>button.addEventListener("click",()=>{activeFilter=button.dataset.filter;document.querySelectorAll(".filter").forEach(item=>{const active=item===button;item.classList.toggle("active",active);item.setAttribute("aria-pressed",String(active));});render();}));
search.addEventListener("input",render);
document.querySelector("#clear-search").addEventListener("click",()=>{search.value="";activeFilter="all";savedOnly=false;document.querySelectorAll(".filter").forEach(item=>{const active=item.dataset.filter==="all";item.classList.toggle("active",active);item.setAttribute("aria-pressed",String(active));});render();});
savedToggle.addEventListener("click",()=>{savedOnly=!savedOnly;render();document.querySelector("#destinations").scrollIntoView({behavior:"smooth"});});
document.addEventListener("keydown",event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==="k"){event.preventDefault();search.focus();document.querySelector("#destinations").scrollIntoView({behavior:"smooth"});}});
document.querySelector("#newsletter-form").addEventListener("submit",event=>{event.preventDefault();if(!event.currentTarget.reportValidity())return;const message=document.querySelector("#newsletter-message");message.textContent="You're on the list. Your first postcard is on its way ✳";message.classList.add("success");event.currentTarget.querySelector("button").textContent="You're in ✓";event.currentTarget.querySelector("input").value="";});
render();


