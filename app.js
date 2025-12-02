// VARIABLES
const bundleEl = document.getElementById("bundle");
const phoneEl = document.getElementById("phone");
const qtyEl = document.getElementById("qty");
const payBtn = document.getElementById("payBtn");
const providerEl = document.getElementById("provider");
const recentEl = document.getElementById("recentPayments");
const lastPaymentBanner = document.getElementById("lastPaymentBanner");
const sidebar = document.querySelector('.dashboard-sidebar');
const toggleBtn = document.getElementById('sidebarToggle');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});


// PAYSTACK TEST KEY
const PAYSTACK_PUBLIC_KEY = "pk_test_174a70c5e75a68e3d77fc816b1b98f05065ba332"; // replace with your test key

const bundles = {
  b1: "150MB (1 day)",
  b2: "500MB (3 days)",
  b3: "1.5GB (7 days)",
  b4: "3GB (14 days)",
  b5: "5GB (30 days)"
};

function showRecentPayments(){
  const payments = JSON.parse(localStorage.getItem("recentPayments")) || [];
  recentEl.innerHTML = "";
  let totalRevenue = 0, totalBundles = 0;

  payments.slice(-5).reverse().forEach(p=>{
    totalRevenue += getBundlePrice(p.bundle) * p.qty;
    totalBundles += p.qty;

    const div = document.createElement("div");
    div.className = "recent-payment " + p.provider;

    const img = document.createElement("img");
    img.className = "provider-logo";
    img.src = `logos/${p.provider.toLowerCase()}.png`; // mtn.png, vodafone.png, airteltigo.png
    img.alt = p.provider;

    const span = document.createElement("span");
    span.textContent = `✅ ${bundles[p.bundle]} x${p.qty} - Ref: ${p.reference} - ${p.date} - ${p.provider}`;

    div.appendChild(img);
    div.appendChild(span);
    recentEl.appendChild(div);
  });

  // Update stats panel
  document.getElementById("totalPayments").textContent = payments.length;
  document.getElementById("totalBundles").textContent = totalBundles;
  document.getElementById("totalRevenue").textContent = totalRevenue.toFixed(2);
}

// Helper to get bundle price
function getBundlePrice(bundleId){
  const prices = { b1:1.50, b2:3.50, b3:7.00, b4:12.00, b5:18.00 };
  return prices[bundleId] || 0;
}

// LAST PAYMENT BANNER
(function(){
  const lastPayment = JSON.parse(localStorage.getItem("lastPayment"));
  if(lastPayment && lastPayment.status === "success"){
    lastPaymentBanner.textContent = `✅ Last payment confirmed. Ref: ${lastPayment.reference}`;
    lastPaymentBanner.style.display = "block";
    localStorage.removeItem("lastPayment");
  }
})();

// RECENT PAYMENTS
function showRecentPayments(){
  const payments = JSON.parse(localStorage.getItem("recentPayments")) || [];
  recentEl.innerHTML = "";
  payments.slice(-5).reverse().forEach(p=>{
    const div = document.createElement("div");
    div.className = "recent-payment " + p.provider;
    div.textContent = `✅ ${bundles[p.bundle]} x${p.qty} - Ref: ${p.reference} - ${p.date} - ${p.provider}`;
    recentEl.appendChild(div);
  });
}
showRecentPayments();

// PROVIDER DETECTION
phoneEl.addEventListener("input", () => {
  const phone = phoneEl.value.trim();
  const detected = detectProvider(phone);
  providerEl.textContent = detected !== "Unknown" ? `Provider: ${detected}` : "";
});

function detectProvider(phone){
  if(!phone) return "Unknown";
  phone = phone.replace(/\s+/g,"");
  if(phone.startsWith("+233")) phone = "0" + phone.slice(4);
  if(phone.length < 3 || !phone.startsWith("0")) return "Unknown";
  const prefix = phone.slice(0,3);
  if(["024","054","055","059"].includes(prefix)) return "MTN";
  if(["020","050"].includes(prefix)) return "Vodafone";
  if(["027","057","026"].includes(prefix)) return "AirtelTigo";
  return "Unknown";
}

// PAY NOW BUTTON
payBtn.addEventListener("click", async () => {
  const bundleId = bundleEl.value;
  const phone = phoneEl.value.trim();
  const qty = parseInt(qtyEl.value);
  const provider = detectProvider(phone);

  if(!phone || phone.length < 10){ alert("Enter valid phone number"); return; }

  const payload = { bundleId, phone, qty };

  try{
    const res = await fetch("https://web-backend-dp.onrender.com/api/pay", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(payload)
    });
    const data = await res.json();
    if(!data.success){ alert("Error: " + data.message); return; }

    let handler = PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: "customer@example.com",
      amount: data.amount,
      currency: "GHS",
      ref: data.reference,
      callback: function(response){
        const now = new Date().toLocaleString();
        const paymentObj = {
          reference: response.reference,
          bundle: bundleId,
          qty,
          date: now,
          status:"success",
          provider
        };
        let recent = JSON.parse(localStorage.getItem("recentPayments")) || [];
        recent.push(paymentObj);
        localStorage.setItem("recentPayments", JSON.stringify(recent));
        localStorage.setItem("lastPayment", JSON.stringify(paymentObj));

        window.location.href = "payment-success.html?reference=" + response.reference;
      },
      onClose: function(){ alert("Payment not completed."); }
    });
    handler.openIframe();
  }catch(err){ alert("Network error"); console.error(err);}
});

