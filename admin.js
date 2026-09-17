import { supabase } from "./supabase.js";

/* ==========================================
   PURELYHOME ADMIN DASHBOARD
========================================== */

const ordersTable = document.getElementById("ordersTable");
const searchInput = document.getElementById("searchInput");

const totalOrders = document.getElementById("totalOrders");
const totalRevenue = document.getElementById("totalRevenue");
const pendingOrders = document.getElementById("pendingOrders");
const shippedOrders = document.getElementById("shippedOrders");

let orders = [];

/* ==========================================
   LOAD ORDERS
========================================== */

async function loadOrders() {

  const { data, error } = await supabase
    .from("order")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    alert("Cannot load orders.");
    return;
  }

  orders = data || [];

  updateSummary();
  renderOrders(orders);

}

/* ==========================================
   SUMMARY CARDS
========================================== */

function updateSummary() {

  totalOrders.textContent = orders.length;

  const revenue = orders.reduce((sum, order) => {
    return sum + Number(order.total_price || 0);
  }, 0);

  totalRevenue.textContent = `RM ${revenue.toFixed(2)}`;

  pendingOrders.textContent = orders.filter(
    order => (order.status || "Pending") === "Pending"
  ).length;

  shippedOrders.textContent = orders.filter(
    order => order.status === "Shipped"
  ).length;

}

/* ==========================================
   RENDER TABLE
========================================== */

function renderOrders(list) {

  ordersTable.innerHTML = "";

  if (list.length === 0) {
    ordersTable.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;padding:30px;">
          No Orders Found
        </td>
      </tr>
    `;
    return;
  }

  list.forEach(order => {

    const status = order.status || "Pending";

    ordersTable.innerHTML += `
      <tr>

        <td><strong>#${order.id}</strong></td>

        <td>
          <div class="customer-name">${order.name || "-"}</div>
          <div class="customer-email">${order.email || ""}</div>
        </td>

        <td>${order.phone || "-"}</td>

        <td>RM ${Number(order.total_price || 0).toFixed(2)}</td>

       <td>
  <select
  id="status-${order.id}"
  class="statusSelect"
  onchange="saveStatus(${order.id})">
    <option value="Pending" ${status === "Pending" ? "selected" : ""}>Pending</option>

    <option value="Payment Received"
      ${status === "Payment Received" ? "selected" : ""}>
      Payment Received
    </option>

    <option value="Preparing Order"
      ${status === "Preparing Order" ? "selected" : ""}>
      Preparing Order
    </option>

    <option value="Shipped" ${status === "Shipped" ? "selected" : ""}>
      Shipped
    </option>
  </select>
</td>

        <!-- RECEIPT -->

        <td>
          ${
            order.receipt_url
              ? `<img src="${order.receipt_url}" class="receipt-img" onclick="window.open('${order.receipt_url}','_blank')">`
              : `<span class="no-receipt">No receipt</span>`
          }
        </td>

        <!-- ACTION -->

        <td>

          <div class="action-box">

            <select
              id="courier-${order.id}"
              class="courier-select">

              <option value="">Courier</option>

              <option value="J&T"
                ${order.courier === "J&T" ? "selected" : ""}>
                J&T
              </option>

              <option value="Ninja Van"
                ${order.courier === "Ninja Van" ? "selected" : ""}>
                Ninja Van
              </option>

              <option value="PosLaju"
                ${order.courier === "PosLaju" ? "selected" : ""}>
                PosLaju
              </option>

              <option value="SPX"
                ${order.courier === "SPX" ? "selected" : ""}>
                SPX
              </option>

            </select>

            <input
              id="tracking-${order.id}"
              class="tracking-input"
              placeholder="Tracking Number"
              value="${order.tracking_number || ""}"
            >

            <div class="action-buttons">

              <button
                class="save-btn"
                onclick="saveTracking(${order.id})">
                Save
              </button>

              <button
                class="view-btn"
                onclick="viewOrder(${order.id})">
                View
              </button>

            </div>

          </div>

        </td>
<!-- NOTES -->
<td class="order-notes">
  ${order.notes || "—"}
</td>
      </tr>
    `;
  });

}

/* ==========================================
   SAVE TRACKING
========================================== */


window.saveStatus = async function(id) {
  const status = document
    .getElementById(`status-${id}`)
    .value;

  const { error } = await supabase
    .from("order")
    .update({ status: status })
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("Failed to update status.");
  } else {
    console.log("Status updated!");
  }
};

window.saveTracking = async function(id){

  
  const courier = document
    .getElementById(`courier-${id}`)
    .value;

  const tracking = document
    .getElementById(`tracking-${id}`)
    .value
    .trim();
const status = document
  .getElementById(`status-${id}`)
  .value;


  if (!courier) {
    alert("Please select courier.");
    return;
  }

  if (!tracking) {
    alert("Please enter tracking number.");
    return;
  }

  const { error } = await supabase
    .from("order")
    .update({
      courier: courier,
      tracking_number: tracking,
      status: status,
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }

  alert("Tracking updated successfully!");

  loadOrders();

};

/* ==========================================
   VIEW ORDER
========================================== */

window.viewOrder = function(id){
  window.location.href = `order.html?id=${id}`;
};

/* ==========================================
   SEARCH CUSTOMER
========================================== */

searchInput.addEventListener("input", () => {

  const keyword = searchInput.value.toLowerCase();

  const filtered = orders.filter(order => {

    return (

      String(order.id).includes(keyword) ||

      (order.name || "")
        .toLowerCase()
        .includes(keyword) ||

      (order.email || "")
        .toLowerCase()
        .includes(keyword) ||

      (order.phone || "")
        .includes(keyword)

    );

  });

  renderOrders(filtered);

});

/* ==========================================
   START
========================================== */

loadOrders();