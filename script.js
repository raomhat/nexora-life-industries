// ===== NEXORA LIFE PRODUCTS =====
const products = [
  { id: "500ml", name: "500 ML PET", pack: "12 bottles / carton", price: 360, type: "small" },
  { id: "1.5l", name: "1.5 Liter PET", pack: "6 bottles / carton", price: 300, type: "medium" },
  { id: "6l", name: "6 Liter Bottle", pack: "1 bottle", price: 100, type: "large" },
  { id: "19l", name: "19 Liter Can", pack: "1 can", price: 600, type: "can" }
];

// Replace this with Nexora Life's WhatsApp number in international format.
// Example: Pakistan 0300xxxxxxx -> 92300xxxxxxx
const WHATSAPP_NUMBER = "923281991137";

const productGrid = document.getElementById("productGrid");
const productSelect = document.getElementById("product");
const quantity = document.getElementById("quantity");
const total = document.getElementById("total");

function productVisual(type){
  const height = type === "can" ? "125px" : type === "large" ? "175px" : type === "medium" ? "160px" : "145px";
  const width = type === "can" ? "115px" : type === "large" ? "90px" : "72px";
  return `<div class="mini-bottle" style="height:${height};width:${width}">
    <div class="mini-cap"></div>
    <div class="mini-body"><div class="mini-label">NEXORA <em>LIFE</em><br><small>MINERAL WATER</small></div></div>
  </div>`;
}

products.forEach(p => {
  const card = document.createElement("article");
  card.className = "product-card";
  card.innerHTML = `
    <div class="product-visual">${productVisual(p.type)}</div>
    <h3>${p.name}</h3>
    <p class="pack">${p.pack}</p>
    <div class="price">Rs. ${p.price.toLocaleString()}</div>
    <button class="btn primary card-btn" data-product="${p.id}">Order Now</button>
  `;
  productGrid.appendChild(card);

  const option = document.createElement("option");
  option.value = p.id;
  option.textContent = `${p.name} — ${p.pack} — Rs. ${p.price}`;
  productSelect.appendChild(option);
});

function getSelected(){
  return products.find(p => p.id === productSelect.value) || products[0];
}
function updateTotal(){
  const p = getSelected();
  const q = Math.max(1, Number(quantity.value) || 1);
  total.textContent = `Rs. ${(p.price * q).toLocaleString()}`;
}
productSelect.addEventListener("change", updateTotal);
quantity.addEventListener("input", updateTotal);

document.querySelectorAll("[data-product]").forEach(btn => {
  btn.addEventListener("click", () => {
    productSelect.value = btn.dataset.product;
    updateTotal();
    document.getElementById("order").scrollIntoView({behavior:"smooth"});
  });
});

document.getElementById("orderForm").addEventListener("submit", e => {
  e.preventDefault();
  const p = getSelected();
  const q = Math.max(1, Number(quantity.value) || 1);
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const notes = document.getElementById("notes").value.trim();

  const message =
`*NEXORA LIFE INDUSTRIES — NEW ORDER*
Product: ${p.name}
Pack: ${p.pack}
Quantity: ${q}
Estimated Total: Rs. ${(p.price*q).toLocaleString()}

Customer: ${name}
Phone: ${phone}
Address: ${address}
Notes: ${notes || "None"}`;

  if (WHATSAPP_NUMBER.includes("X")) {
    alert("Please add Nexora Life's WhatsApp number in script.js first.");
    return;
  }
  window.open(`https://wa.me/${+923281991137}?text=${encodeURIComponent(message)}`, "_blank");
});

document.getElementById("waLink").href =
  WHATSAPP_NUMBER.includes("X") ? "#" : `https://wa.me/${+923281991137}`;

document.querySelector(".menu-btn").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});
document.querySelectorAll("#navLinks a").forEach(a => a.addEventListener("click", () => {
  document.getElementById("navLinks").classList.remove("open");
}));
document.getElementById("year").textContent = new Date().getFullYear();
updateTotal();
