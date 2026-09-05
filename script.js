(()=>{
"use strict";
const products=[
{id:"500ml",name:"500 ML PET",pack:"12 bottles / carton",price:360,type:"small"},
{id:"1.5l",name:"1.5 Liter PET",pack:"6 bottles / carton",price:300,type:"medium"},
{id:"6l",name:"6 Liter Bottle",pack:"1 bottle",price:100,type:"large"},
{id:"19l",name:"19 Liter Can",pack:"1 can",price:600,type:"can"}
];
const WA="923281991137",PROFILE="nexora_profile_v21",ORDERS="nexora_orders_v21",POINTS="nexora_points_v21";
const $=id=>document.getElementById(id);
const profile=()=>{try{return JSON.parse(localStorage.getItem(PROFILE)||"null")}catch{return null}};
const orders=()=>{try{return JSON.parse(localStorage.getItem(ORDERS)||"[]")}catch{return[]}};
const points=()=>Number(localStorage.getItem(POINTS)||0);
const saveProfile=p=>localStorage.setItem(PROFILE,JSON.stringify(p));
const saveOrders=o=>localStorage.setItem(ORDERS,JSON.stringify(o));
const addPoints=n=>localStorage.setItem(POINTS,String(points()+n));
const price=n=>"Rs. "+Number(n).toLocaleString("en-PK");
const wa=msg=>window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(msg),"_blank");
function visual(type){return type==="can"?'<div class="mini-bottle" style="height:125px;width:115px"><div class="mini-cap"></div><div class="mini-body"><div class="mini-label">NEXORA <em>LIFE</em><br><small>19 L CAN</small></div></div></div>':`<div class="mini-bottle" style="height:${type==="large"?175:type==="medium"?160:145}px;width:${type==="large"?90:72}px"><div class="mini-cap"></div><div class="mini-body"><div class="mini-label">NEXORA <em>LIFE</em><br><small>MINERAL WATER</small></div></div></div>`}
function card(p){return `<article class="product-card"><div class="product-visual">${visual(p.type)}</div><h3>${p.name}</h3><p class="pack">${p.pack}</p><div class="price">${price(p.price)}</div><a class="btn primary card-btn" href="order.html?product=${p.id}">Order Now</a></article>`}
const grid=$("productGrid");if(grid)grid.innerHTML=products.map(card).join("");
const menu=$("menuToggle");const nav=$("navLinks");if(menu&&nav){menu.addEventListener("click",()=>{nav.classList.toggle("open");menu.textContent=nav.classList.contains("open")?"×":"☰"});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu.textContent="☰"}))}
const page=location.pathname.split("/").pop()||"index.html";document.querySelectorAll("#navLinks a").forEach(a=>{if(a.getAttribute("href")===page)a.style.color="var(--green)"});
document.querySelectorAll("#year").forEach(e=>e.textContent=new Date().getFullYear());
const form=$("orderForm");if(form){const sel=$("product"),qty=$("quantity"),tot=$("total");sel.innerHTML=products.map(p=>`<option value="${p.id}">${p.name} — ${p.pack} — ${price(p.price)}</option>`).join("");const q=new URLSearchParams(location.search).get("product");if(products.some(p=>p.id===q))sel.value=q;const pr=profile();if(pr){$("customerName").value=pr.name||"";$("phone").value=pr.phone||"";$("address").value=pr.address||""}function update(){const p=products.find(x=>x.id===sel.value)||products[0];tot.textContent=price(p.price*Math.max(1,Number(qty.value)||1))}sel.addEventListener("change",update);qty.addEventListener("input",update);update();form.addEventListener("submit",e=>{e.preventDefault();const p=products.find(x=>x.id===sel.value)||products[0],n=$("customerName").value.trim(),ph=$("phone").value.trim(),ad=$("address").value.trim(),notes=$("notes").value.trim(),q=Math.max(1,Number(qty.value)||1),amount=p.price*q,id="NX-"+Date.now().toString().slice(-8);saveProfile({name:n,phone:ph,address:ad});const list=orders();list.unshift({id,date:new Date().toISOString(),productId:p.id,product:p.name,pack:p.pack,quantity:q,amount,name:n,phone:ph,address:ad,notes});saveOrders(list);addPoints(10);wa(`*NEXORA LIFE INDUSTRIES*
*NEW WATER ORDER*

Order ID: ${id}

Product: ${p.name}
Pack: ${p.pack}
Quantity: ${q}
Estimated Total: ${price(amount)}

*CUSTOMER DETAILS*
Name: ${n}
Phone: ${ph}
Address: ${ad}
Notes: ${notes||"None"}

Please confirm availability and delivery.`)})}
const link=$("waLink");if(link)link.href="https://wa.me/"+WA;
const welcome=$("nxWelcome");if(welcome){let pr=profile(),list=orders(),pts=points();welcome.textContent=pr?.name?"Welcome, "+pr.name:"Welcome to My Nexora";if($("nxSubtext"))$("nxSubtext").textContent=pr?"Your saved details are ready for faster ordering.":"Save your details to make future orders faster.";if($("nxPoints"))$("nxPoints").textContent=pts;if($("pointsBig"))$("pointsBig").textContent=pts;if($("nxOrders"))$("nxOrders").textContent=list.length;if($("nxLastOrder"))$("nxLastOrder").textContent=list[0]?.product||"None yet";if($("profileName"))$("profileName").textContent=pr?.name||"Not set";if($("profilePhone"))$("profilePhone").textContent=pr?.phone||"Not set";if($("profileAddress"))$("profileAddress").textContent=pr?.address||"Not set";
const show=id=>{["profilePanel","historyPanel","detailsPanel"].forEach(x=>{if($(x))$(x).hidden=x!==id});if($(id))$(id).scrollIntoView({behavior:"smooth",block:"center"})};
if($("editProfileBtn"))$("editProfileBtn").onclick=()=>{if($("profileEditName")){ $("profileEditName").value=pr?.name||"";$("profileEditPhone").value=pr?.phone||"";$("profileEditAddress").value=pr?.address||"";}show("profilePanel")};
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>{const p=$(b.dataset.close);if(p)p.hidden=true});
if($("profileForm"))$("profileForm").onsubmit=e=>{e.preventDefault();saveProfile({name:$("profileEditName").value.trim(),phone:$("profileEditPhone").value.trim(),address:$("profileEditAddress").value.trim()});location.reload()};
function history(){const box=$("orderHistoryList");if(!box)return;if(!list.length){box.innerHTML='<p class="small">No orders saved yet.</p>';return}box.innerHTML=list.map((o,i)=>`<div class="history-item"><div><strong>${o.product}</strong><p>${o.quantity} × ${price(o.amount/o.quantity)} · ${price(o.amount)}</p><p>${new Date(o.date).toLocaleString("en-PK")}</p></div><div class="history-actions"><button type="button" data-r="${i}">Reorder</button><button type="button" data-d="${i}">Details</button></div></div>`).join("");box.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>location.href="order.html?product="+list[+b.dataset.r].productId);box.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{const o=list[+b.dataset.d];$("orderDetails").innerHTML=`<p><b>Order ID:</b> ${o.id}</p><p><b>Date:</b> ${new Date(o.date).toLocaleString("en-PK")}</p><p><b>Product:</b> ${o.product}</p><p><b>Pack:</b> ${o.pack}</p><p><b>Quantity:</b> ${o.quantity}</p><p><b>Estimated Total:</b> ${price(o.amount)}</p><p><b>Name:</b> ${o.name}</p><p><b>Phone:</b> ${o.phone}</p><p><b>Address:</b> ${o.address}</p><p><b>Notes:</b> ${o.notes||"None"}</p>`;show("detailsPanel")})}
if($("historyBtn"))$("historyBtn").onclick=()=>{history();show("historyPanel")};if($("reorderBtn"))$("reorderBtn").onclick=()=>location.href=list[0]?"order.html?product="+list[0].productId:"order.html";if($("referralBtn"))$("referralBtn").onclick=()=>wa(`*NEXORA LIFE INDUSTRIES*
I use Nexora Life Industries for drinking water orders.
Check products and order here:
https://raomhat.github.io/nexora-life-industries/`);
const sp=$("subscriptionProduct"),sq=$("subscriptionQuantity"),ss=$("subscriptionSchedule"),sf=$("subscriptionForm"),sw=$("subscriptionWhatsApp");if(sp&&sq&&ss&&sf&&sw){sp.innerHTML=products.map(p=>`<option value="${p.id}">${p.name} — ${p.pack} — ${price(p.price)}</option>`).join("");document.querySelectorAll(".subscription-btn").forEach(b=>b.onclick=()=>{ss.value=b.dataset.plan||"Custom";sf.hidden=false;sf.scrollIntoView({behavior:"smooth",block:"center"})});sw.onclick=()=>{const p=products.find(x=>x.id===sp.value)||products[0],q=Math.max(1,Number(sq.value)||1),pr=profile(),amount=p.price*q;wa(`*NEXORA LIFE INDUSTRIES*
*REGULAR WATER DELIVERY REQUEST*

Delivery Plan: ${ss.value}
Product: ${p.name}
Pack: ${p.pack}
Quantity: ${q}
Estimated Order Value: ${price(amount)}

*CUSTOMER DETAILS*
Name: ${pr?.name||"Not provided"}
Phone: ${pr?.phone||"Not provided"}
Address: ${pr?.address||"Not provided"}

Please contact me to confirm my regular delivery plan.`)}}}
})();