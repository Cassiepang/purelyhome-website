import { supabase } from "./supabase.js";

/* ==========================================
   PURELYHOME PRODUCTS DASHBOARD V2
========================================== */

const productList = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");

// Stats
const totalProducts = document.getElementById("totalProducts");
const activeProducts = document.getElementById("activeProducts");
const hiddenProducts = document.getElementById("hiddenProducts");
const lowStockProducts = document.getElementById("lowStockProducts");

// Modal
const modal = document.getElementById("productModal");
const deleteModal = document.getElementById("deleteModal");

const addBtn = document.getElementById("addProductBtn");
const closeBtn = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelModal");
const saveBtn = document.getElementById("saveProduct");

const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");

// Form
const previewImage = document.getElementById("previewImage");
const imageInput = document.getElementById("productImage");

const nameInput = document.getElementById("productName");
const priceInput = document.getElementById("productPrice");
const stockInput = document.getElementById("productStock");
const scentInput = document.getElementById("productScent");
const statusInput = document.getElementById("productStatus");
const descInput = document.getElementById("productDescription");

let editingId = null;
let deletingId = null;
let products = [];

/* ==========================================
   DEFAULT LOCAL IMAGES
========================================== */

function getLocalImage(product){

  const name = (product.name || "").toLowerCase();

  if(name.includes("white")) return "images/product2.jpeg";
  if(name.includes("freesia")) return "images/freesia.jpeg";
  if(name.includes("amber")) return "images/amber.jpeg";

  return "images/wt.jpeg";
}

/* ==========================================
   LOAD PRODUCTS
========================================== */

async function loadProducts(){

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at",{ascending:false});

  if(error){
    console.error(error);
    return;
  }

  products = data || [];

  renderProducts(products);
  updateStats(products);
}

loadProducts();

/* ==========================================
   RENDER PRODUCTS
========================================== */

function renderProducts(list){

  productList.innerHTML = "";

  list.forEach(product=>{

    const image =getLocalImage(product);

    const badge = product.is_active
      ? `<span class="badge active">ACTIVE</span>`
      : `<span class="badge hidden">HIDDEN</span>`;

    const hideText = product.is_active ? "Hide" : "Unhide";

    productList.innerHTML += `
      <div class="product-card">

        <img src="${image}" alt="${product.name}">

        <div class="product-info">

          <div class="top-row">
            ${badge}
            <span class="price">RM${Number(product.price).toFixed(2)}</span>
          </div>

          <h3>${product.name}</h3>

          <p>${product.description || ""}</p>

          <small>${product.scent || ""}</small>

          <div class="stock-row">
            Stock : ${product.stock}
          </div>

        </div>

        <div class="card-actions">

          <button class="edit-btn" onclick="editProduct('${product.id}')">
            Edit
          </button>

          <button class="hide-btn" onclick="toggleProduct('${product.id}', ${product.is_active})">
            ${hideText}
          </button>

          <button class="delete-btn" onclick="openDelete('${product.id}')">
            Delete
          </button>

        </div>

      </div>
    `;

  });

}

/* ==========================================
   UPDATE STATS
========================================== */

function updateStats(list){

  totalProducts.textContent = list.length;

  activeProducts.textContent =
    list.filter(item => item.is_active === true).length;

  hiddenProducts.textContent =
    list.filter(item => item.is_active === false).length;

  lowStockProducts.textContent =
    list.filter(item => Number(item.stock) <= 20).length;

}

/* ==========================================
   SEARCH
========================================== */

searchInput.addEventListener("input",(e)=>{

  const keyword = e.target.value.toLowerCase();

  const filtered = products.filter(item =>
    item.name.toLowerCase().includes(keyword)
  );

  renderProducts(filtered);

});

/* ==========================================
   FILTER BUTTON
========================================== */

document.querySelectorAll(".filter").forEach(button=>{

  button.addEventListener("click",()=>{

    document.querySelectorAll(".filter")
      .forEach(btn=>btn.classList.remove("active"));

    button.classList.add("active");

    const filter = button.dataset.filter;

    if(filter==="all"){
      renderProducts(products);
    }

    if(filter==="active"){
      renderProducts(products.filter(item=>item.is_active));
    }

    if(filter==="hidden"){
      renderProducts(products.filter(item=>!item.is_active));
    }

  });

});

/* ==========================================
   OPEN ADD MODAL
========================================== */

addBtn.onclick = ()=>{

  editingId = null;

  document.getElementById("modalTitle").textContent = "Add Product";

  previewImage.src = "images/wt.jpeg";

  nameInput.value = "";
  priceInput.value = "";
  stockInput.value = "";
  scentInput.value = "White Tea";
  statusInput.value = "true";
  descInput.value = "";

  modal.classList.remove("hidden");

};

/* ==========================================
   CLOSE MODAL
========================================== */

closeBtn.onclick = ()=> modal.classList.add("hidden");
cancelBtn.onclick = ()=> modal.classList.add("hidden");

/* ==========================================
   IMAGE PREVIEW
========================================== */

imageInput.addEventListener("change",(event)=>{

  const file = event.target.files[0];

  if(file){
    previewImage.src = URL.createObjectURL(file);
  }

});

/* ==========================================
   EDIT PRODUCT
========================================== */

window.editProduct = (id)=>{

  const product = products.find(item=>item.id===id);

  if(!product) return;

  editingId = id;

  document.getElementById("modalTitle").textContent = "Edit Product";

  previewImage.src =
    product.image_url || getLocalImage(product);

  nameInput.value = product.name;
  priceInput.value = product.price;
  stockInput.value = product.stock;
  scentInput.value = product.scent;
  statusInput.value = String(product.is_active);
  descInput.value = product.description || "";

  modal.classList.remove("hidden");

};

/* ==========================================
   SAVE PRODUCT
========================================== */

saveBtn.onclick = async()=>{

  const payload = {

    name: nameInput.value,
    price: Number(priceInput.value),
    stock: Number(stockInput.value),
    scent: scentInput.value,
    description: descInput.value,
    is_active: statusInput.value === "true"

  };

  let result;

  if(editingId){

    result = await supabase
      .from("products")
      .update(payload)
      .eq("id",editingId);

  }else{

    result = await supabase
      .from("products")
      .insert(payload);

  }

  if(result.error){
    alert(result.error.message);
    return;
  }

  modal.classList.add("hidden");

  loadProducts();

};

/* ==========================================
   HIDE / UNHIDE
========================================== */

window.toggleProduct = async(id,currentStatus)=>{

  const { error } = await supabase
    .from("products")
    .update({
      is_active: !currentStatus
    })
    .eq("id",id);

  if(error){
    alert(error.message);
    return;
  }

  loadProducts();

};

/* ==========================================
   DELETE PRODUCT
========================================== */

window.openDelete = (id)=>{

  deletingId = id;

  deleteModal.classList.remove("hidden");

};

cancelDelete.onclick = ()=>{

  deleteModal.classList.add("hidden");

};

confirmDelete.onclick = async()=>{

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id",deletingId);

  if(error){
    alert(error.message);
    return;
  }

  deleteModal.classList.add("hidden");

  loadProducts();

};