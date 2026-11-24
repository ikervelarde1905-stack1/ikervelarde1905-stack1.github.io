const cart=new Map();
const drawer=document.querySelector(".cart-drawer");
const items=document.querySelector(".cart-items");
const count=document.querySelector(".cart-count");
const subtotal=document.querySelector(".subtotal strong");
const checkout=document.querySelector(".checkout-button");
const toast=document.querySelector(".toast");

function money(value){return `$${value.toFixed(2)}`}
function notify(message){toast.textContent=message;toast.classList.add("show");clearTimeout(notify.timer);notify.timer=setTimeout(()=>toast.classList.remove("show"),1800)}
function renderCart(){
  items.innerHTML="";
  let quantity=0,total=0;
  if(!cart.size) items.innerHTML='<p class="empty-cart">Tu bolsa está vacía.</p>';
  cart.forEach((item,name)=>{
    quantity+=item.quantity;total+=item.price*item.quantity;
    const row=document.createElement("div");
    row.className="cart-item";
    row.innerHTML=`<div><h3>${name}</h3><small>${money(item.price)}</small><div class="quantity"><button type="button" data-action="minus" data-name="${name}">−</button><span>${item.quantity}</span><button type="button" data-action="plus" data-name="${name}">+</button></div></div><strong>${money(item.price*item.quantity)}</strong>`;
    items.appendChild(row);
  });
  count.textContent=quantity;subtotal.textContent=money(total);checkout.disabled=!cart.size;
}
function openCart(){drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");document.body.classList.add("locked")}
function closeCart(){drawer.classList.remove("open");drawer.setAttribute("aria-hidden","true");document.body.classList.remove("locked")}

document.querySelectorAll(".quick-add,.add-combo").forEach(button=>{
  button.addEventListener("click",()=>{
    const name=button.dataset.name,price=Number(button.dataset.price),current=cart.get(name);
    cart.set(name,current?{...current,quantity:current.quantity+1}:{price,quantity:1});
    renderCart();notify(`${name} agregado`);
  });
});
document.querySelector(".cart-button").addEventListener("click",openCart);
document.querySelector(".cart-close").addEventListener("click",closeCart);
document.querySelector(".cart-overlay").addEventListener("click",closeCart);
items.addEventListener("click",event=>{
  const button=event.target.closest("[data-action]");
  if(!button)return;
  const item=cart.get(button.dataset.name);if(!item)return;
  item.quantity+=button.dataset.action==="plus"?1:-1;
  if(item.quantity<=0)cart.delete(button.dataset.name);else cart.set(button.dataset.name,item);
  renderCart();
});
checkout.addEventListener("click",()=>{
  let message="Hola, quiero hacer este pedido:%0A";
  cart.forEach((item,name)=>{message+=`• ${item.quantity} x ${name} - ${money(item.price*item.quantity)}%0A`});
  message+=`%0ATotal: ${subtotal.textContent}`;
  window.open(`https://wa.me/526674217660?text=${message}`,"_blank","noopener");
});
document.querySelectorAll(".filters button").forEach(button=>{
  button.addEventListener("click",()=>{
    document.querySelector(".filters .active")?.classList.remove("active");button.classList.add("active");
    const filter=button.dataset.filter;
    document.querySelectorAll(".product-card").forEach(card=>card.classList.toggle("hidden",filter!== "todos"&&card.dataset.level!==filter));
  });
});
document.querySelectorAll(".wishlist").forEach(button=>{
  button.addEventListener("click",()=>{button.classList.toggle("active");button.textContent=button.classList.contains("active")?"♥":"♡"});
});
const menu=document.querySelector(".menu-toggle"),mobileNav=document.querySelector(".mobile-nav");
menu.addEventListener("click",()=>{const open=mobileNav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open))});
mobileNav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>mobileNav.classList.remove("open")));
document.querySelector(".newsletter form").addEventListener("submit",event=>{event.preventDefault();notify("Te agregamos al Club Dulce & Pica");event.currentTarget.reset()});
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeCart()});
renderCart();
