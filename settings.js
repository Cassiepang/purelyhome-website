import { supabase } from "./supabase.js";

/* ==========================================
   PURELYHOME SETTINGS
========================================== */

// Save Button
const saveBtn = document.getElementById("saveSettingsBtn");

// Banner Preview
const bannerInput = document.getElementById("bannerImage");
const bannerPreview = document.getElementById("bannerPreview");

// Inputs
const storeName = document.getElementById("storeName");
const storeWhatsapp = document.getElementById("storeWhatsapp");
const storeEmail = document.getElementById("storeEmail");
const storeInstagram = document.getElementById("storeInstagram");
const storeAddress = document.getElementById("storeAddress");

const freeShipping = document.getElementById("freeShipping");
const westShipping = document.getElementById("westShipping");
const eastShipping = document.getElementById("eastShipping");
const pickupStatus = document.getElementById("pickupStatus");

const voucherCode = document.getElementById("voucherCode");
const voucherDiscount = document.getElementById("voucherDiscount");
const voucherMinimum = document.getElementById("voucherMinimum");
const voucherExpiry = document.getElementById("voucherExpiry");

const announcementBar = document.getElementById("announcementBar");
const homepageVideo = document.getElementById("homepageVideo");

// Payment
const duitnowToggle = document.getElementById("duitnowToggle");
const fpxToggle = document.getElementById("fpxToggle");
const tngToggle = document.getElementById("tngToggle");
const codToggle = document.getElementById("codToggle");

// ==========================================
// LOAD SETTINGS
// ==========================================

async function loadSettings() {

  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .single();

  if (error) {
    console.log("No settings yet.");
    return;
  }

  storeName.value = data.store_name || "PurelyHome";
  storeWhatsapp.value = data.whatsapp || "";
  storeEmail.value = data.email || "";
  storeInstagram.value = data.instagram || "";
  storeAddress.value = data.address || "";

  freeShipping.value = data.free_shipping || 80;
  westShipping.value = data.west_shipping || 8;
  eastShipping.value = data.east_shipping || 15;
  pickupStatus.value = String(data.self_pickup);

  voucherCode.value = data.voucher_code || "";
  voucherDiscount.value = data.voucher_discount || "";
  voucherMinimum.value = data.voucher_minimum || "";
  voucherExpiry.value = data.voucher_expiry || "";

  announcementBar.value = data.announcement || "";
  homepageVideo.value = data.homepage_video || "";

  duitnowToggle.checked = data.duitnow;
  fpxToggle.checked = data.fpx;
  tngToggle.checked = data.tng;
  codToggle.checked = data.cod;

  if (data.banner_image) {
    bannerPreview.src = data.banner_image;
  }

}

loadSettings();

// ==========================================
// HERO BANNER PREVIEW
// ==========================================

bannerInput.addEventListener("change", (event) => {

  const file = event.target.files[0];

  if (!file) return;

  bannerPreview.src = URL.createObjectURL(file);

});

// ==========================================
// SAVE SETTINGS
// ==========================================

saveBtn.addEventListener("click", async () => {

  saveBtn.innerText = "Saving...";
  saveBtn.disabled = true;

  const settings = {

    id: 1,

    store_name: storeName.value,
    whatsapp: storeWhatsapp.value,
    email: storeEmail.value,
    instagram: storeInstagram.value,
    address: storeAddress.value,

    free_shipping: Number(freeShipping.value),
    west_shipping: Number(westShipping.value),
    east_shipping: Number(eastShipping.value),

    self_pickup: pickupStatus.value === "true",

    voucher_code: voucherCode.value,
    voucher_discount: Number(voucherDiscount.value),
    voucher_minimum: Number(voucherMinimum.value),
    voucher_expiry: voucherExpiry.value,

    announcement: announcementBar.value,
    homepage_video: homepageVideo.value,

    duitnow: duitnowToggle.checked,
    fpx: fpxToggle.checked,
    tng: tngToggle.checked,
    cod: codToggle.checked,

    banner_image: bannerPreview.src

  };

  const { error } = await supabase
    .from("settings")
    .upsert(settings);

  if (error) {

    alert("❌ " + error.message);

    saveBtn.innerText = "Save Changes";
    saveBtn.disabled = false;

    return;

  }

  saveBtn.innerText = "Saved Successfully ✨";

  setTimeout(() => {

    saveBtn.innerText = "Save Changes";
    saveBtn.disabled = false;

  }, 1800);

});

// ==========================================
// LOGOUT
// ==========================================

const logoutBtn = document.querySelector(".logout-btn");

logoutBtn.addEventListener("click", async () => {

  const confirmLogout = confirm("Logout from PurelyHome Admin?");

  if (!confirmLogout) return;

  await supabase.auth.signOut();

  window.location.href = "login.html";

});