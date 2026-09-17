
import { supabase } from "./supabase.js";

// Auto fill order number
const params = new URLSearchParams(window.location.search);
const orderFromUrl = params.get("id");

if (orderFromUrl) {
  document.getElementById("orderInput").value = orderFromUrl;
}

const btn = document.getElementById("trackBtn");


btn.addEventListener("click", async () => {

    const orderId = document.getElementById("orderInput").value;
    const email = document.getElementById("emailInput").value.trim();

    if(!orderId || !email){
        alert("Please enter your Order Number and Email.");
        return;
    }

    const { data: order, error } = await supabase
        .from("order")
        .select("*")
        .eq("public_id", orderId)
        .eq("email", email)
        .single();

    if(error || !order){
        alert("Order not found.");
        return;
    }

    document.getElementById("result").style.display="block";

    document.getElementById("orderNo").innerText=`Order #${order.public_id}`;

    document.getElementById("customerName").innerText=order.name;

    document.getElementById("totalPrice").innerText=
    `RM ${Number(order.total_price).toFixed(2)}`;

    document.getElementById("address").innerText=
    `${order.address}, ${order.postcode} ${order.city}`;

    const badge=document.getElementById("statusBadge");

    badge.className="status";

   const message = document.getElementById("statusMessage");

   badge.innerText = order.status;
badge.classList.add(order.status.toLowerCase().replace(/\s+/g, "-"));


switch(order.status){

  case "Pending":
    message.innerHTML =
      "We're waiting to verify your payment proof. This usually takes within 24 hours.";
    break;

  case "Payment Received":
    message.innerHTML =
      "Great news! Your payment has been verified successfully.";
    break;

  case "Preparing Order":
    message.innerHTML =
      "Our team is packing your order. It will be shipped within 1–2 working days.";
    break;

  case "Shipped":
    message.innerHTML =
      "Your parcel has been shipped! Tracking details are available below.";
    break;
}

    if(order.payment_receipt){
        const receipt=document.getElementById("receiptImage");
        receipt.src=order.payment_receipt;
        receipt.style.display="block";
    }

    if(order.tracking_number){

    document.getElementById("trackingBox").style.display = "block";

    document.getElementById("trackingNumber").innerText =
        order.tracking_number;

    document.getElementById("courierName").innerText =
        order.courier || "Shopee Express";
}

});