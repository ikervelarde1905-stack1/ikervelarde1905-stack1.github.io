const cart = new Map();
const cartDrawer = document.querySelector(".cart-drawer");
const cartItems = document.querySelector(".cart-items");
const cartCount = document.querySelector(".bag-count");
const subtotal = document.querySelector(".subtotal strong");
const checkout = document.querySelector(".checkout-button");
const toast = document.querySelector(".toast");

function money(value) {
  return `$${value.toFixed(2)}`;
}

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function renderCart() {
  cartItems.innerHTML = "";
  let totalQuantity = 0;
  let total = 0;

  if (!cart.size) {
    cartItems.innerHTML = '<p class="empty-state">Tu bolsa está esperando una pieza especial.</p>';
  }

  cart.forEach((item, name) => {
    totalQuantity += item.quantity;
    total += item.price * item.quantity;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-thumb"><span></span></div>
      <div>
        <h3>${name}</h3>
        <small>${money(item.price)}</small>
        <div class="cart-quantity">
          <button type="button" data-action="minus" data-name="${name}" aria-label="Quitar uno">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-action="plus" data-name="${name}" aria-label="Agregar uno">+</button>
        </div>
      </div>
      <strong>${money(item.price * item.quantity)}</strong>
    `;
    cartItems.appendChild(row);
  });

  cartCount.textContent = totalQuantity;
  subtotal.textContent = money(total);
  checkout.disabled = cart.size === 0;
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("locked");
}

document.querySelectorAll(".quick-add").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    const current = cart.get(name);
    cart.set(name, current ? { ...current, quantity: current.quantity + 1 } : { price, quantity: 1 });
    renderCart();
    notify(`${name} agregada a tu bolsa`);
  });
});

document.querySelector(".bag-button").addEventListener("click", openCart);
document.querySelector(".cart-close").addEventListener("click", closeCart);
document.querySelector(".cart-overlay").addEventListener("click", closeCart);

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const item = cart.get(button.dataset.name);
  if (!item) return;
  item.quantity += button.dataset.action === "plus" ? 1 : -1;
  if (item.quantity <= 0) cart.delete(button.dataset.name);
  else cart.set(button.dataset.name, item);
  renderCart();
});

checkout.addEventListener("click", () => {
  let message = "Hola Damaris, quiero realizar este pedido:%0A";
  cart.forEach((item, name) => {
    message += `• ${item.quantity} x ${name} - ${money(item.price * item.quantity)}%0A`;
  });
  message += `%0ASubtotal: ${subtotal.textContent}`;
  window.open(`https://wa.me/12025550148?text=${message}`, "_blank", "noopener");
});

document.querySelectorAll(".product-tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".product-tabs .active")?.classList.remove("active");
    button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".product-card").forEach((card) => {
      card.classList.toggle("hidden", filter !== "todos" && card.dataset.category !== filter);
    });
  });
});

document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("click", () => {
    const filter = card.dataset.filter;
    document.querySelectorAll(".product-tabs button").forEach((button) => {
      button.classList.toggle("active", button.dataset.filter === filter);
    });
    document.querySelectorAll(".product-card").forEach((product) => {
      product.classList.toggle("hidden", product.dataset.category !== filter);
    });
  });
});

document.querySelectorAll(".wishlist").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("active");
    button.textContent = button.classList.contains("active") ? "♥" : "♡";
  });
});

const searchPanel = document.querySelector(".search-panel");
document.querySelector(".search-button").addEventListener("click", () => {
  searchPanel.classList.add("open");
  searchPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
  document.querySelector("#search").focus();
});
document.querySelector(".search-close").addEventListener("click", () => {
  searchPanel.classList.remove("open");
  searchPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("locked");
});
searchPanel.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  const term = document.querySelector("#search").value.trim();
  if (term) notify(`Buscando: ${term}`);
});

const mobileMenu = document.querySelector(".mobile-menu");
document.querySelector(".menu-button").addEventListener("click", () => {
  mobileMenu.classList.add("open");
  document.body.classList.add("locked");
});
document.querySelector(".mobile-close").addEventListener("click", () => {
  mobileMenu.classList.remove("open");
  document.body.classList.remove("locked");
});
mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  mobileMenu.classList.remove("open");
  document.body.classList.remove("locked");
}));

document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  notify("Te agregamos al Círculo Damaris");
  event.currentTarget.reset();
});
