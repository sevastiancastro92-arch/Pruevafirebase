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

// --- Firebase Configuración ---
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

// UI elements
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

// --- LÓGICA DE RECARGA ---
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

// --- Publicaciones ---
pubsRef.on("value", (snapshot) => {
  publicationsContainer.innerHTML = "";
  const data = snapshot.val();
  if (!data) {
    publicationsContainer.innerHTML = "<p>No hay publicaciones disponibles.</p>";
    return;
  }
  
  const pubsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
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
      mediaHTML = `<img src="${pub.mediaUrl}" class="w-full h-48 object-cover rounded-lg mb-4">`;
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
        <div class="btn-buy neon-btn p-4 rounded-lg text-center transition-transform hover:scale-105 cursor-pointer mb-3" 
             onclick="openConfirmModal('${key}','${safeBtnId}', ${priceNum}, '${btnKey}')">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-2xl font-bold text-neon-cyan">$${price}</div>
                <div class="text-sm font-semibold text-neon-pink">${duration || '—'}</div>
                <div class="text-xs small-muted mt-1">🔑 ${keysCount} claves</div>
              </div>
              <div><div class="py-2 px-3 rounded-full bg-white text-blue-900 font-bold">Comprar</div></div>
            </div>
        </div>`;
    });
  }

  div.innerHTML = `
    ${mediaHTML}
    <h2 class="text-2xl font-bold mb-3 text-neon-pink">${pub.title}</h2>
    <button class="btn-show neon-btn w-full py-2 rounded-lg font-semibold mb-3" onclick="toggleDetails('${key}')">Mostrar Opciones</button>
    <div id="details-${key}" class="hidden mt-4 space-y-3">${buttonsHTML || "<p>Sin botones</p>"}</div>`;
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

  const isArr = Array.isArray(pub.buttons);
  const path = `publications/${pubId}/buttons/${btnKeyIdentifier}/keys`;
  
  if (typeof originalBtn.keys === "string") {
    const s = newKeysArr.map(k => `key: ${k.key}`).join(", ");
    await db.ref(path).set(s);
  } else {
    const arr = newKeysArr.map(k => ({ key: k.key, usada: !!k.usada }));
    await db.ref(path).set(arr);
  }
}

// =================================================================
// --- LÓGICA DE NIVELES Y DESCUENTOS DINÁMICOS (ADMIN CONTROLLED) ---
// =================================================================

const LEVEL_VIP_SPEND = 50;
const LEVEL_PREMIUM_SPEND = 150;
let userTotalSpending = 0; 

// Determina solo el rango actual del usuario
function calculateLevel(spending) {
    if (spending >= LEVEL_PREMIUM_SPEND) return { level: "Premium", nextGoal: LEVEL_PREMIUM_SPEND, goalLabel: "¡Nivel Máximo!", progressColor: "var(--level-premium)" };
    if (spending >= LEVEL_VIP_SPEND) return { level: "VIP", nextGoal: LEVEL_PREMIUM_SPEND, goalLabel: `Meta Premium: $${LEVEL_PREMIUM_SPEND}`, progressColor: "var(--level-vip)" };
    return { level: "Base", nextGoal: LEVEL_VIP_SPEND, goalLabel: `Meta VIP: $${LEVEL_VIP_SPEND}`, progressColor: "var(--level-base)" };
}

function updateLevelUI(spending) {
    const { level, goalLabel, progressColor } = calculateLevel(spending);
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
        let perc = (spending < LEVEL_VIP_SPEND) ? (spending/LEVEL_VIP_SPEND)*100 : (spending/LEVEL_PREMIUM_SPEND)*100;
        bar.levelProgressBar.style.width = `${Math.min(perc, 100).toFixed(2)}%`;
        bar.levelProgressBar.style.backgroundColor = progressColor;
        bar.levelProgressText.textContent = `$${spending.toFixed(2)}`;
    });
}

function loadUserSpendingAndLevel(email) {
    const userKey = sanitizeEmail(email);
    db.ref(`users/${userKey}/purchases`).on("value", snap => {
        let total = 0;
        snap.forEach(p => { total += parseFloat(p.val().price || 0); });
        updateLevelUI(total);
    });
}

let _pendingPurchase = null;

async function openConfirmModal(pubId, safeBtnId, price, rawBtnId) {
    // 1. Obtener datos actuales de la publicación/botón para leer el descuento del admin
    const pubSnap = await db.ref(`publications/${pubId}`).once("value");
    const pub = pubSnap.val();
    const btn = Array.isArray(pub.buttons) ? pub.buttons[Number(safeBtnId)] : pub.buttons[rawBtnId];
    
    // 2. Determinar rango y buscar el descuento configurado por el admin para este botón
    const { level } = calculateLevel(userTotalSpending);
    let discountAmount = 0;
    
    if (level === "VIP") {
        // El admin debe guardar el campo 'discountVIP' en el botón (ej: 0.50 para descontar 50 centavos)
        discountAmount = parseFloat(btn.discountVIP || 0);
    } else if (level === "Premium") {
        // El admin debe guardar el campo 'discountPremium'
        discountAmount = parseFloat(btn.discountPremium || 0);
    }

    const finalPrice = Math.max(0, price - discountAmount);

    confirmModal.style.display = "flex";
    confirmText.textContent = `¿Comprar key? Precio: $${price.toFixed(2)}`;

    if (discountAmount > 0) {
        finalPriceDisplay.innerHTML = `
            <div class="text-xl font-bold text-neon-green">Final: $${finalPrice.toFixed(2)} USD</div>
            <div class="text-xs text-neon-cyan">Ahorras $${discountAmount.toFixed(2)} por ser ${level}</div>
        `;
    } else {
        finalPriceDisplay.innerHTML = `<div class="text-neon-yellow">Final: $${finalPrice.toFixed(2)} USD</div>`;
    }

    _pendingPurchase = { pubId, safeBtnId, price, rawBtnId, finalPrice, discountAmount };
}

confirmCancel.onclick = () => { confirmModal.style.display = "none"; _pendingPurchase = null; };
confirmOk.onclick = async () => {
  if (!_pendingPurchase) return;
  const p = _pendingPurchase;
  confirmModal.style.display = "none";
  await comprarKey(p.pubId, p.safeBtnId, p.price, p.rawBtnId, p.finalPrice, p.discountAmount);
  _pendingPurchase = null;
};

// --- Función de Compra Principal ---
async function comprarKey(pubId, safeBtnId, originalPrice, rawBtnId, finalPrice, discountApplied) {
  try {
    const userKey = sanitizeEmail(currentUser);
    const userRef = db.ref(`users/${userKey}`);
    const balSnap = await userRef.child("balance").once("value");
    let balance = parseFloat(balSnap.val() || 0);

    if (balance < finalPrice) { alert("Saldo insuficiente."); return; }

    const pubSnap = await db.ref(`publications/${pubId}`).once("value");
    const pub = pubSnap.val();
    let originalBtn = Array.isArray(pub.buttons) ? pub.buttons[Number(safeBtnId)] : pub.buttons[rawBtnId];

    const keysArr = parseKeysField(originalBtn.keys);
    if (!keysArr.length) { alert("No hay claves."); return; }
    const selected = keysArr[0];

    // Actualizar Balance
    await userRef.child("balance").set(Number((balance - finalPrice).toFixed(2)));

    // Quitar Key
    const updatedKeys = keysArr.slice();
    updatedKeys.shift();
    await updateKeysField(pubId, Array.isArray(pub.buttons) ? Number(safeBtnId) : rawBtnId, originalBtn, updatedKeys);

    // Guardar Historial
    await userRef.child("purchases").push().set({
      pubId, title: pub.title || "",
      optionText: originalBtn.text || originalBtn.option || "",
      key: selected.key,
      price: finalPrice, 
      originalPrice: originalPrice,
      discountApplied: discountApplied,
      date: new Date().toISOString()
    });
    
    // Incrementar Ventas
    await db.ref(`publications/${pubId}/buyCount`).transaction(c => (c || 0) + 1);

    // Modal de éxito
    keyModalContent.innerHTML = `<div class="mono text-green-300 font-semibold p-2">${selected.key}</div>`;
    keyModal.style.display = "flex";
    keyCopyBtn.onclick = () => { navigator.clipboard.writeText(selected.key); alert("Copiada"); };
    keyCloseBtn.onclick = () => keyModal.style.display = "none";

  } catch (err) { console.error(err); alert("Error"); }
}

function sanitizeEmail(email) { return email.replace(/\./g, "_"); }

function loadUserBalance(email) {
  const userKey = sanitizeEmail(email);
  db.ref(`users/${userKey}/balance`).on("value", snap => {
    const bal = parseFloat(snap.val() || 0);
    userBalanceEl.textContent = `$${bal.toFixed(2)}`;
    menuUserBalance.textContent = `Saldo: $${bal.toFixed(2)}`;
  });
}

function loadUserPurchases(email) {
  const userKey = sanitizeEmail(email);
  const purchasesRef = db.ref(`users/${userKey}/purchases`);
  const searchInput = document.getElementById("searchKeyInput");
  const filterSelect = document.getElementById("filterDateSelect");
  let allPurchases = [];

  purchasesRef.on("value", snap => {
    const data = snap.val();
    if (!data) { myKeysList.innerHTML = "<p>Sin claves.</p>"; return; }
    allPurchases = Object.keys(data).map(k => ({ id: k, ...data[k] })).reverse();
    renderPurchases();
  });

  function renderPurchases() {
    const term = (searchInput.value || "").toLowerCase();
    myKeysList.innerHTML = "";
    allPurchases.filter(it => (it.title||"").toLowerCase().includes(term) || (it.key||"").toLowerCase().includes(term)).forEach(it => {
      const div = document.createElement("div");
      div.className = "card rounded-lg p-4 mb-2";
      div.innerHTML = `
        <div class="flex justify-between items-center">
            <div>
                <div class="font-bold">${it.title}</div>
                <div class="text-xs small-muted">${new Date(it.date).toLocaleString()}</div>
            </div>
            <div class="text-right">
                <div class="text-green-400 font-bold">$${parseFloat(it.price).toFixed(2)}</div>
                <div class="mono text-xs">${it.key}</div>
            </div>
        </div>`;
      myKeysList.appendChild(div);
    });
  }
  searchInput.oninput = renderPurchases;
}

showTab("pubs");
