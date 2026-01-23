(function(){
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const colors = [
    'rgba(0,240,255,0.95)',
    'rgba(255,77,240,0.95)',
    'rgba(0,255,136,0.95)',
    'rgba(255,212,96,0.95)'
  ];
  const particles = [];
  const PARTICLE_COUNT = Math.floor((w*h) / 80000) + 30; // scaled by screen
  function rand(min,max){return Math.random()*(max-min)+min;}
  function makeParticle(){
    return {
      x: rand(0,w),
      y: rand(0,h),
      vx: rand(-0.3,0.3),
      vy: rand(-0.15,0.15),
      r: rand(0.7,2.6),
      life: rand(60,240),
      hue: colors[Math.floor(Math.random()*colors.length)],
      glow: rand(6,18)
    };
  }
  for(let i=0;i<PARTICLE_COUNT;i++) particles.push(makeParticle());
  function resize(){
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  }
  addEventListener('resize', ()=>{ resize(); });

  function draw(){
    ctx.clearRect(0,0,w,h);
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0, 'rgba(10,8,20,0.0)');
    g.addColorStop(1, 'rgba(6,4,12,0.12)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    for(let p of particles){
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if(p.x < -20) p.x = w+20;
      if(p.x > w+20) p.x = -20;
      if(p.y < -20) p.y = h+20;
      if(p.y > h+20) p.y = -20;
      if(p.life <= 0){
        Object.assign(p, makeParticle());
        p.x = rand(0,w);
        p.y = rand(0,h);
      }

      ctx.beginPath();
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glow);
      grd.addColorStop(0, p.hue);
      grd.addColorStop(0.15, p.hue.replace('1)', '0.35)'));
      grd.addColorStop(0.6, p.hue.replace('1)', '0.08)'));
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.arc(p.x, p.y, p.r*3 + (p.glow/6), 0, Math.PI*2);
      ctx.fill();
    }

    ctx.lineWidth = 0.6;
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length && j<i+4;j++){
        const a=particles[i], b=particles[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const d2 = dx*dx+dy*dy;
        if(d2 < 25000){
          const alpha = 1 - d2/25000;
          ctx.strokeStyle = 'rgba(120,200,255,'+ (alpha*0.06) +')';
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  resize();
  draw();
})();

/* ===================== REST OF APP ===================== */

const firebaseConfig = {
  apiKey: "AIzaSyCr1-2dIqgxoXBTKYgSusnUZorUICX2Too",
  authDomain: "chatglobal-e9370.firebaseapp.com",
  databaseURL: "https://chatglobal-e9370-default-rtdb.firebaseio.com",
  projectId: "chatglobal-e9370",
  storageBucket: "chatglobal-e9370.firebasestorage.app",
  messagingSenderId: "382420208590",
  appId: "1:382420208590:web:9425fa28c8cdf669adb99f"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const pubsRef = db.ref("publications");

const userNameEl = document.getElementById("userName");
const userBalanceEl = document.getElementById("userBalance");
const logoutBtn = document.getElementById("logoutBtn");
const publicationsContainer = document.getElementById("publicationsContainer");
const myKeysList = document.getElementById("myKeysList");
const myKeysContainer = document.getElementById("myKeysContainer");

const hamburgerBtn = document.getElementById("hamburgerBtn");
const sideMenu = document.getElementById("sideMenu");
const menuBackdrop = document.getElementById("menuBackdrop");
const menuUserName = document.getElementById("menuUserName");
const menuUserBalance = document.getElementById("menuUserBalance");
const menuAvatar = document.getElementById("menuAvatar");
const menuPublicaciones = document.getElementById("menuPublicaciones");
const menuKeys = document.getElementById("menuKeys");
const menuLogout = document.getElementById("menuLogout");
const menuRecharge = document.getElementById("menuRecharge"); 

const confirmModal = document.getElementById("confirmModal");
const confirmText = document.getElementById("confirmText");
const confirmOk = document.getElementById("confirmOk");
const confirmCancel = document.getElementById("confirmCancel");
const keyModal = document.getElementById("keyModal");
const keyModalContent = document.getElementById("keyModalContent");
const keyCopyBtn = document.getElementById("keyCopyBtn");
const keyCloseBtn = document.getElementById("keyCloseBtn");
const rechargeModal = document.getElementById("rechargeModal");
const rechargeAmountInput = document.getElementById("rechargeAmountInput");
const rechargeConfirmBtn = document.getElementById("rechargeConfirmBtn");
const rechargeCancelBtn = document.getElementById("rechargeCancelBtn");
const rechargeError = document.getElementById("rechargeError");

const finalPriceDisplay = document.getElementById("finalPriceDisplay"); 

const userLevelTextMenu = document.getElementById("userLevelTextMenu");
const levelProgressTextMenu = document.getElementById("levelProgressTextMenu");
const levelProgressBarMenu = document.getElementById("levelProgressBarMenu");
const levelNextGoalMenu = document.getElementById("levelNextGoalMenu");

const userLevelTextMain = document.getElementById("userLevelTextMain");
const levelProgressTextMain = document.getElementById("levelProgressTextMain");
const levelProgressBarMain = document.getElementById("levelProgressBarMain");
const levelNextGoalMain = document.getElementById("levelNextGoalMain");

const tabPublicaciones = document.getElementById("tabPublicaciones");
const tabKeys = document.getElementById("tabKeys");

tabPublicaciones.onclick = () => showTab("pubs");
tabKeys.onclick = () => showTab("keys");

function showTab(tab) {
  if (tab === "pubs") {
    publicationsContainer.classList.remove("hidden");
    myKeysContainer.classList.add("hidden");
    tabPublicaciones.classList.add("active");
    tabKeys.classList.remove("active");
  } else {
    publicationsContainer.classList.add("hidden");
    myKeysContainer.classList.remove("hidden");
    tabPublicaciones.classList.remove("active");
    tabKeys.classList.add("active");
  }
}

const currentUser = sessionStorage.getItem("sociosxit_user");
if (!currentUser) window.location.href = "index.html";
else {
  userNameEl.textContent = currentUser;
  loadUserBalance(currentUser);
  loadUserPurchases(currentUser);
  loadUserSpendingAndLevel(currentUser);
  menuUserName.textContent = currentUser;
  menuAvatar.textContent = String(currentUser).charAt(0)?.toUpperCase() || "U";
}

logoutBtn.onclick = () => {
  sessionStorage.removeItem("sociosxit_user");
  window.location.href = "index.html";
};

function openMenu() {
  sideMenu.classList.add("open");
  menuBackdrop.style.display = "block";
  setTimeout(()=> menuBackdrop.style.opacity = "1", 10);
  hamburgerBtn.classList.add("open");
  sideMenu.setAttribute("aria-hidden", "false");
}
function closeMenu() {
  sideMenu.classList.remove("open");
  menuBackdrop.style.opacity = "0";
  hamburgerBtn.classList.remove("open");
  sideMenu.setAttribute("aria-hidden", "true");
  setTimeout(()=> menuBackdrop.style.display = "none", 240);
}

hamburgerBtn.addEventListener("click", ()=> {
  if (sideMenu.classList.contains("open")) closeMenu();
  else openMenu();
});

menuBackdrop.addEventListener("click", closeMenu);

window.addEventListener("scroll", () => {
  const px = window.scrollY || document.documentElement.scrollTop;
  if (px > 20) hamburgerBtn.classList.add("open");
  else {
    if (!sideMenu.classList.contains("open")) hamburgerBtn.classList.remove("open");
  }
});

menuPublicaciones.addEventListener("click", ()=> { showTab("pubs"); closeMenu(); });
menuKeys.addEventListener("click", ()=> { showTab("keys"); closeMenu(); });
menuLogout.addEventListener("click", ()=> {
  sessionStorage.removeItem("sociosxit_user");
  window.location.href = "index.html";
});

// --- RECARGA ---
menuRecharge.addEventListener("click", ()=> { 
  closeMenu(); 
  rechargeModal.style.display = "flex";
  rechargeAmountInput.value = ""; 
  rechargeError.classList.add("hidden");
});

rechargeCancelBtn.addEventListener("click", ()=> { 
  rechargeModal.style.display = "none";
});

rechargeConfirmBtn.addEventListener("click", ()=> { 
  const amount = parseFloat(rechargeAmountInput.value);
  const minAmount = 4.00;
  const whatsappNumber = "+573142369516";
  if (isNaN(amount) || amount < minAmount) {
    rechargeError.classList.remove("hidden");
    return;
  }
  rechargeError.classList.add("hidden");
  rechargeModal.style.display = "none";
  const message = `Hola quiero recargar ${amount.toFixed(2)} USD en la pagina de socios`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  window.open(whatsappURL, '_blank');
});

// --- PUBLICACIONES ---
pubsRef.on("value", (snapshot) => {
  publicationsContainer.innerHTML = "";
  const data = snapshot.val();
  if (!data) {
    publicationsContainer.innerHTML = "<p>No hay publicaciones disponibles.</p>";
    return;
  }
  const pubsArray = Object.keys(data).map(key => {
    return { id: key, ...data[key] };
  });
  pubsArray.sort((a, b) => (b.buyCount || 0) - (a.buyCount || 0));
  pubsArray.forEach(pub => {
    publicationsContainer.appendChild(createPublicationElement(pub, pub.id));
  });
});

function createPublicationElement(pub, key) {
  const div = document.createElement("div");
  div.className = "card rounded-xl overflow-hidden shadow-lg p-5";
  let mediaHTML = "";
  if (pub.mediaUrl) {
    if (pub.mediaUrl.includes("youtube.com") || pub.mediaUrl.includes("youtu.be")) {
      const videoId = pub.mediaUrl.split('v=')[1] || pub.mediaUrl.split('/').pop();
      mediaHTML = `<div class="aspect-w-16 aspect-h-9 mb-4"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen class="w-full h-full rounded-lg"></iframe></div>`;
    } else {
      mediaHTML = `<img src="${pub.mediaUrl}" alt="${pub.title}" class="w-full h-48 object-cover rounded-lg mb-4">`;
    }
  }

  let buttonsHTML = "";
  if (pub.buttons) {
    Object.keys(pub.buttons).forEach(btnKey => {
      const btn = pub.buttons[btnKey];
      const priceNum = parseFloat(btn.price || 0);
      const price = Number.isFinite(priceNum) ? priceNum.toFixed(2) : "0.00";
      const duration = btn.duration || (btn.days ? `${btn.days} días` : "");
      const keysCount = countKeys(btn.keys);
      const safeBtnId = String(btnKey).replace(/\W/g, "_");

      buttonsHTML += `
        <div class="btn-buy neon-btn p-4 rounded-lg text-center transition-transform hover:scale-105 cursor-pointer mb-3">
          <button onclick="openConfirmModal('${key}','${safeBtnId}', ${priceNum}, '${btnKey}')" class="w-full text-left">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-2xl font-bold text-neon-cyan">$${price}</div>
                <div class="text-sm font-semibold text-neon-pink">${duration || '—'}</div>
                <div class="text-xs small-muted mt-1">🔑 ${keysCount} disponibles</div>
              </div>
              <div><div class="py-2 px-3 rounded-full bg-white text-blue-900 font-bold">Comprar</div></div>
            </div>
          </button>
        </div>`;
    });
  }

  div.innerHTML = `
    ${mediaHTML}
    <h2 class="text-2xl font-bold mb-3 text-neon-pink">${pub.title}</h2>
    <button class="btn-show neon-btn w-full py-2 rounded-lg font-semibold mb-3" onclick="toggleDetails('${key}')">Mostrar Opciones</button>
    <div id="details-${key}" class="hidden mt-4 space-y-3">${buttonsHTML || "<p>Sin opciones</p>"}</div>
  `;
  return div;
}

function toggleDetails(key) {
  const el = document.getElementById(`details-${key}`);
  if (el) el.classList.toggle("hidden");
}

function countKeys(keysField) {
  if (!keysField) return 0;
  if (Array.isArray(keysField)) return keysField.length;
  if (typeof keysField === "string") return keysField.split(",").map(s => s.trim()).filter(Boolean).length;
  return 0;
}

function parseKeysField(keysField) {
  if (!keysField) return [];
  if (Array.isArray(keysField)) {
    return keysField.map(k => {
      if (typeof k === "string") {
        const v = k.match(/key\s*:\s*(.+)/i) ? k.match(/key\s*:\s*(.+)/i)[1].trim() : k.trim();
        return { key: v, usada: false };
      } else if (typeof k === "object" && k.key) return { key: String(k.key).trim(), usada: !!k.usada };
      return null;
    }).filter(Boolean);
  }
  if (typeof keysField === "string") {
    return keysField.split(",").map(s => s.trim()).filter(Boolean).map(p => {
      const v = p.match(/key\s*:\s*(.+)/i) ? p.match(/key\s*:\s*(.+)/i)[1].trim() : p;
      return { key: v, usada: false };
    });
  }
  return [];
}

async function updateKeysField(pubId, btnKeyIdentifier, originalBtn, newKeysArr) {
  const pubSnap = await db.ref(`publications/${pubId}`).once("value");
  const pub = pubSnap.val();
  if (!pub) return;
  const targetPath = Array.isArray(pub.buttons) ? `publications/${pubId}/buttons/${btnKeyIdentifier}/keys` : `publications/${pubId}/buttons/${btnKeyIdentifier}/keys`;
  
  if (typeof originalBtn.keys === "string") {
    const s = newKeysArr.map(k => `key: ${k.key}`).join(", ");
    await db.ref(targetPath).set(s);
  } else {
    const arr = newKeysArr.map(k => ({ key: k.key, usada: !!k.usada }));
    await db.ref(targetPath).set(arr);
  }
}

// --- NIVEL Y DESCUENTOS (VALORES FIJOS SOLICITADOS) ---
const LEVEL_VIP_SPEND = 50;
const LEVEL_PREMIUM_SPEND = 150;
let userTotalSpending = 0; 

function calculateLevel(spending) {
    if (spending >= LEVEL_PREMIUM_SPEND) {
        return { level: "Premium", nextGoal: LEVEL_PREMIUM_SPEND, goalLabel: "¡Nivel Máximo!", progressColor: "var(--level-premium)" };
    } else if (spending >= LEVEL_VIP_SPEND) {
        return { level: "VIP", nextGoal: LEVEL_PREMIUM_SPEND, goalLabel: `Meta Premium: $${LEVEL_PREMIUM_SPEND.toFixed(2)}`, progressColor: "var(--level-vip)" };
    } else {
        return { level: "Base", nextGoal: LEVEL_VIP_SPEND, goalLabel: `Meta VIP: $${LEVEL_VIP_SPEND.toFixed(2)}`, progressColor: "var(--level-base)" };
    }
}

function updateLevelUI(spending) {
    const { level, nextGoal, goalLabel, progressColor } = calculateLevel(spending);
    userTotalSpending = spending; 
    const bars = [
        { userLevelText: userLevelTextMenu, levelProgressText: levelProgressTextMenu, levelProgressBar: levelProgressBarMenu, levelNextGoal: levelNextGoalMenu },
        { userLevelText: userLevelTextMain, levelProgressText: levelProgressTextMain, levelProgressBar: levelProgressBarMain, levelNextGoal: levelNextGoalMain }
    ];
    bars.forEach(bar => {
        if (!bar.userLevelText) return;
        bar.userLevelText.textContent = `Nivel: ${level}`;
        bar.userLevelText.className = `level-label ${level === 'VIP' ? 'level-vip-text' : level === 'Premium' ? 'level-premium-text' : ''}`;
        bar.levelNextGoal.textContent = goalLabel;
        let percentage = (spending / nextGoal) * 100;
        bar.levelProgressBar.style.width = `${Math.min(percentage, 100).toFixed(2)}%`;
        bar.levelProgressBar.style.backgroundColor = progressColor;
        bar.levelProgressText.textContent = `$${spending.toFixed(2)}`;
    });
}

function loadUserSpendingAndLevel(email) {
    const userKey = sanitizeEmail(email);
    db.ref(`users/${userKey}/purchases`).on("value", snap => {
        let totalSpent = 0;
        snap.forEach(p => { totalSpent += parseFloat(p.val().price || 0); });
        updateLevelUI(totalSpent);
    });
}

// --- MODAL CONFIRMACION (ACTUALIZADO CON DESCUENTOS 0.10 Y 0.20) ---
let _pendingPurchase = null; 

async function openConfirmModal(pubId, safeBtnId, price, rawBtnId) {
    const { level } = calculateLevel(userTotalSpending);
    
    // Aplicar descuentos según nivel solicitado
    let discountAmount = 0;
    if (level === "VIP") {
        discountAmount = 0.10;
    } else if (level === "Premium") {
        discountAmount = 0.20;
    }

    const finalPrice = Math.max(0, price - discountAmount);

    confirmModal.style.display = "flex";
    confirmText.textContent = `¿Comprar key? Precio original: $${Number(price).toFixed(2)} USD`;

    if (discountAmount > 0) {
        finalPriceDisplay.innerHTML = `
            <div class="text-xl font-bold text-neon-green">Total a pagar: $${finalPrice.toFixed(2)} USD</div>
            <div class="text-xs text-neon-cyan mt-1">Beneficio ${level}: -$${discountAmount.toFixed(2)} de descuento</div>
        `;
    } else {
        finalPriceDisplay.textContent = `Final: $${finalPrice.toFixed(2)} USD`;
        finalPriceDisplay.className = "text-neon-yellow font-bold text-xl";
    }

    _pendingPurchase = { pubId, safeBtnId, price, rawBtnId, finalPrice, discountAmount };
}

confirmCancel.onclick = () => { confirmModal.style.display = "none"; _pendingPurchase = null; };
confirmOk.onclick = async () => {
  if (!_pendingPurchase) return;
  confirmModal.style.display = "none";
  await comprarKey(_pendingPurchase.pubId, _pendingPurchase.safeBtnId, _pendingPurchase.price, _pendingPurchase.rawBtnId, _pendingPurchase.finalPrice, _pendingPurchase.discountAmount);
  _pendingPurchase = null;
};

// --- COMPRA FINAL ---
async function comprarKey(pubId, safeBtnId, originalPrice, rawBtnId, finalPrice, discountAmount) {
  try {
    const userKey = sanitizeEmail(currentUser);
    const userRef = db.ref(`users/${userKey}`);
    const balSnap = await userRef.child("balance").once("value");
    let balance = parseFloat(balSnap.val() || 0);

    if (balance < finalPrice) { alert("⚠️ Saldo insuficiente."); return; }

    const pubSnap = await db.ref(`publications/${pubId}`).once("value");
    const pub = pubSnap.val();
    let btnIndexOrKey = Array.isArray(pub.buttons) ? Number(rawBtnId) : rawBtnId;
    let originalBtn = pub.buttons[btnIndexOrKey];

    const keysArr = parseKeysField(originalBtn.keys);
    if (!keysArr.length) { alert("❌ Sin claves disponibles."); return; }
    const selected = keysArr.shift();

    // Actualizar base de datos
    await userRef.child("balance").set(Number((balance - finalPrice).toFixed(2)));
    await updateKeysField(pubId, btnIndexOrKey, originalBtn, keysArr);

    await userRef.child("purchases").push().set({
      pubId, title: pub.title, optionText: originalBtn.text || originalBtn.option,
      key: selected.key, price: Number(finalPrice), originalPrice: Number(originalPrice),
      discountApplied: Number(discountAmount).toFixed(2), date: new Date().toISOString()
    });
    
    await db.ref(`publications/${pubId}/buyCount`).transaction(c => (c || 0) + 1);

    keyModalContent.innerHTML = `<div class="mono text-green-300 font-semibold p-2">${selected.key}</div>`;
    keyModal.style.display = "flex";
    keyCopyBtn.onclick = () => { navigator.clipboard.writeText(selected.key); alert("🔑 Copiado."); };
    keyCloseBtn.onclick = () => { keyModal.style.display = "none"; };
    userBalanceEl.textContent = `$${Number(balance - finalPrice).toFixed(2)}`;

  } catch (err) { alert("Error en compra."); }
}

function sanitizeEmail(email) { return email.replace(/\./g, "_"); }

function loadUserBalance(email) {
  db.ref(`users/${sanitizeEmail(email)}/balance`).on("value", snap => {
    const b = parseFloat(snap.val() || 0);
    userBalanceEl.textContent = `$${b.toFixed(2)}`;
    menuUserBalance.textContent = `Saldo: $${b.toFixed(2)}`;
  });
}

function loadUserPurchases(email) {
  db.ref(`users/${sanitizeEmail(email)}/purchases`).on("value", snap => {
    myKeysList.innerHTML = "";
    const data = snap.val();
    if (!data) return;
    Object.keys(data).reverse().forEach(k => {
      const it = data[k];
      const div = document.createElement("div");
      div.className = "card rounded-lg p-4 mb-2";
      div.innerHTML = `<div class="flex justify-between"><div><b>${it.title}</b><br>${it.optionText}</div><div class="text-right text-green-400 font-bold">$${it.price.toFixed(2)}<br><small>${it.key}</small></div></div>`;
      myKeysList.appendChild(div);
    });
  });
}

showTab("pubs");
