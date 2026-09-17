import {supabase } from "./supabase.js" ;

// PURELYHOME — Luxury Website Interaction

// ===============================
// Navbar Blur on Scroll
// ===============================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

  if (window.scrollY > 20) {
    navbar.style.background = "rgba(248,245,241,.96)";
    navbar.style.backdropFilter = "blur(20px)";
    navbar.style.boxShadow = "0 2px 30px rgba(0,0,0,.03)";
  } else {
    navbar.style.background = "rgba(248,245,241,.90)";
    navbar.style.boxShadow = "none";
  }

});


// ===============================
// Fade In Sections
// ===============================

const revealItems = document.querySelectorAll("section, .benefit, .review, .step, .note");

const observer = new IntersectionObserver((entries)=>{

  entries.forEach(entry=>{

    if(entry.isIntersecting){

      entry.target.classList.add("show");

    }

  });

},{
  threshold:0.18
});

revealItems.forEach(item=>{

  item.classList.add("hidden");
  observer.observe(item);

});


// ===============================
// Hero Image Parallax
// ===============================

const heroImage = document.querySelector(".hero-image img");

if (heroImage) {
  window.addEventListener("scroll", () => {
    const y = window.scrollY * 0.06;
    heroImage.style.transform = `translateY(${y}px)`;
  });
}


// ===============================
// Text Link Hover Animation
// ===============================

document.querySelectorAll(".text-link").forEach(link=>{

  link.addEventListener("mouseenter",()=>{

    link.style.paddingRight = "12px";

  });

  link.addEventListener("mouseleave",()=>{

    link.style.paddingRight = "0px";

  });

});


// ===============================
// Smooth Image Zoom
// ===============================

document.querySelectorAll(".story-image img, .step img, .note img").forEach(img=>{

  img.addEventListener("mouseenter",()=>{

    img.style.transform = "scale(1.03)";
    img.style.transition = "1.2s ease";

  });

  img.addEventListener("mouseleave",()=>{

    img.style.transform = "scale(1)";

  });

});



// FAQ Accordion
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {

        const isOpen = item.classList.contains("active");

        faqItems.forEach(i => {
            i.classList.remove("active");
            i.querySelector(".faq-icon").textContent = "+";
        });

        if (!isOpen) {
            item.classList.add("active");
            item.querySelector(".faq-icon").textContent = "−";
        }
    });
});
let products=[];
async function testConnection() {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    console.error("❌ Error:", error);
  } else {
    console.log("✅ Products:", data);
    window.products = data;
console.log("window.products", window.products);

    

// Hero Product（固定抓 White Tea Signature）
const whiteTea = data.find(item => item.name === "White Tea Signature");

if (whiteTea) {
  const section = document.getElementById("white-tea-product");

  section.querySelector(".product-title").textContent = whiteTea.name;

  // ⭐ 强制写 34.90
  section.querySelector(".product-price").textContent = "RM34.90";

  
  // 图片
  section.querySelector(".product-image").src = "images/product2.jpeg";
}

// ===== Signature Scent Cards =====
const cards = {
  "White Tea Signature": "white-tea",
  "White Tea Signature": "white-tea-card",
  "Freesia Bloom": "freesia-card",
  "Amber Neroli": "amber-card"
};



  data.forEach(product => {
  

  const card = document.getElementById(cards[product.name]);

  if (!card) return;

  card.querySelector(".card-title").textContent = product.name;
 
card.querySelector(".card-price").textContent =
  `RM ${Number(product.price).toFixed(2)}`;

// White Tea (洗衣片)
if (product.name === "White Tea Signature") {
  card.querySelector(".card-image").src = "images/wt.jpeg";
}

// White Musk 留香珠
if (product.name === "White Tea Laundry Sheet") {
  card.querySelector(".card-image").src = "images/product2.jpeg";
}

// Freesia 留香珠
if (product.name === "Freesia Bloom") {
  card.querySelector(".card-image").src = "images/freesia.jpeg";
}

// Amber 留香珠
if (product.name === "Amber Neroli") {
  card.querySelector(".card-image").src = "images/amber.jpeg";
}
});
}
}
testConnection();

// ===== Shopping Cart =====

let cart = [];

const cartCount = document.getElementById("cart-count");
const cartDrawer = document.querySelector("#cart-drawer");
const cartOverlay = document.querySelector("#cart-overlay");
const cartBtn = document.querySelector("#cart-btn");
const closeCart = document.querySelector("#close-cart");

const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

// ---------- Add To Cart ----------
document.querySelectorAll(".add-cart").forEach((button) => {
    button.addEventListener("click", () => {

        if (!window.products) return;

        const id = Number(button.dataset.id);

        const product = window.products.find(
            (item) => Number(item.id) === id
        );

        if (!product) return;

        const exist = cart.find((item) => item.id === product.id);

        if (exist) {
            exist.qty += 1;
        } else {
            cart.push({
                ...product,
                qty: 1,
            });
        }

        updateCartCount();
        renderCart();

        // 自动打开 Drawer
        cartDrawer.classList.add("open");
        cartOverlay.classList.add("open");
    });
});

// ---------- Cart Drawer ----------
cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("open");
});

closeCart.addEventListener("click", () => {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
});

cartOverlay.addEventListener("click", () => {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
});

// ===== Checkout =====
const checkoutBtn = document.querySelector(".checkout-btn");
/* ===========================
   CHECKOUT
=========================== */

checkoutBtn.addEventListener("click", () => {

  // Cart empty
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  // Save cart for checkout.html
  localStorage.setItem("checkoutCart", JSON.stringify(cart));

  // Save total
  const total = cart.reduce((sum, item) => {
    return sum + (item.price * item.qty);
  }, 0);

  localStorage.setItem("checkoutTotal", total);

  // Generate Order ID
  const orderId = "PH" + Date.now();
  localStorage.setItem("checkoutOrderId", orderId);

  // Go to Checkout page
  window.location.href = "checkout.html";

});
// ---------- Cart Count ----------
function updateCartCount() {
    cartCount.textContent = cart.reduce(
        (sum, item) => sum + item.qty,
        0
    );
}

// ---------- Render Cart ----------
function renderCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">Your cart is empty.</p>
        `;
        cartTotal.textContent = "RM0.00";
        return;
    }

    let total = 0;

    cart.forEach((product, index) => {

        total += Number(product.price) * product.qty;

        cartItems.innerHTML += `
            <div class="cart-item">

                <img src="${product.image}"
                     class="cart-item-image">

                <div class="cart-item-info">

                    <h4>${product.name}</h4>

                    <p>RM ${(Number(product.price) * product.qty).toFixed(2)}</p>

                    <div class="qty-control">

                        <button onclick="changeQty(${index},-1)">−</button>

                        <span>${product.qty}</span>

                        <button onclick="changeQty(${index},1)">+</button>

                    </div>

                </div>

            </div>
        `;
    });

    cartTotal.textContent = `RM ${total.toFixed(2)}`;
}

// -------- Change Quantity --------
window.changeQty = function(index, change) {

  cart[index].qty += change;

  // 数量变成 0 就删除商品
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  // 更新购物袋数字
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);

  // 重新渲染购物车和 Total
  renderCart();

};

// 初始
updateCartCount();
renderCart();


const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

