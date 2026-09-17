import { supabase } from "./supabase.js";

const params = new URLSearchParams(window.location.search);
const orderId = Number(params.get("id"));

const shipBtn = document.getElementById("shipBtn");

async function loadOrder(){

  const { data, error } = await supabase
    .from("order")
    .select("*")
    .eq("id", orderId)
    .single();

  if(error){
    alert(error.message);
    return;
  }

  document.getElementById("orderNumber").textContent = "#" + data.id;
  document.getElementById("customerName").textContent = data.name;
  document.getElementById("customerEmail").textContent = data.email;
  document.getElementById("customerPhone").textContent = data.phone;

  document.getElementById("customerAddress").innerHTML = `
    ${data.address}<br>
    ${data.postcode} ${data.city}<br>
    ${data.state}
  `;

  document.getElementById("orderTotal").textContent =
    `RM ${Number(data.total_price).toFixed(2)}`;

  const badge = document.getElementById("orderStatus");
  badge.textContent = data.status || "Pending";

  if((data.status || "Pending") === "Shipped"){
    badge.style.background="#E8F7EC";
    badge.style.color="#2E7D32";
    shipBtn.textContent="Order Shipped";
    shipBtn.disabled=true;
  }

  // 商品
  const container = document.getElementById("itemsContainer");
  container.innerHTML="";

  (data.items || []).forEach(item=>{

    container.innerHTML += `
      <div class="product">

        <img src="${item.image}" alt="${item.name}">

        <div style="flex:1">

          <h4>${item.name}</h4>

          <p style="color:#8B8178;margin-top:6px;">
            Qty ${item.qty}
          </p>

        </div>

        <strong>
          RM ${(Number(item.price)*item.qty).toFixed(2)}
        </strong>

      </div>

      <hr style="margin:18px 0;border:none;border-top:1px solid #F1ECE4;">

    `;

  });

}
 // ← loadOrder() 函数结束，不要删

// 页面打开就读取订单
loadOrder();

// 按钮：Mark as Shipped
shipBtn.addEventListener("click", async () => {

  const { error } = await supabase
    .from("order")
    .update({ status: "Shipped" })
    .eq("id", orderId);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Order marked as Shipped ✅");

  // 更新页面资料
  loadOrder();

});