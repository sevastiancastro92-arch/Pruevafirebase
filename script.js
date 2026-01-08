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
  const PARTICLE_COUNT = Math.floor((w*h) / 80000) + 30;
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

// Elementos UI
const userNameEl = document.getElementById("userName");
const userBalanceEl = document.getElementById("userBalance");
const logoutBtn = document.getElementById("logoutBtn");
const publicationsContainer = document.getElementById("publicationsContainer");
const myKeysContainer = document.getElementById("myKeysContainer");
const myKeysList = document.getElementById("myKeysList");

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
const finalPriceDisplay = document.getElementById("finalPriceDisplay");
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

// --- Tabs ---
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

// --- Sesión ---
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

// --- Menú ---
function openMenu() {
  sideMenu.classList.add("open");
  menuBackdrop.style.display = "block";
  setTimeout(()=> menuBackdrop.style.opacity = "1", 10);
  hamburgerBtn.classList.add("open");
}
function closeMenu() {
  sideMenu.classList.remove("open");
  menuBackdrop.style.opacity = "0";
  hamburgerBtn.classList.remove("open");
  setTimeout(()=> menuBackdrop.style.display = "none", 240);
}
hamburgerBtn.addEventListener("click", ()=> sideMenu.classList.contains("open") ? closeMenu() : openMenu());
menuBackdrop.addEventListener("click", closeMenu);
menuPublicaciones.addEventListener("click", ()=> { showTab("pubs"); closeMenu(); });
menuKeys.addEventListener("click", ()=> { showTab("keys"); closeMenu(); });
menuLogout.addEventListener("click", () => { sessionStorage.removeItem("sociosxit_user"); window.location.href = "index.html"; });

// --- Recarga ---
menuRecharge.addEventListener("click", ()=> { 
  closeMenu();
  rechargeModal.style.display = "flex";
  rechargeAmountInput.value = "";
  rechargeError.classList.add("hidden");
});
rechargeCancelBtn.addEventListener("click", ()=> rechargeModal.style.display = "none");
rechargeConfirmBtn.addEventListener("click", ()=> {
  const amount = parseFloat(rechargeAmountInput.value);
  if (isNaN(amount) || amount < 4) { rechargeError.classList.remove("hidden"); return; }
  window.open(`https://wa.me/+573142369516?text=${encodeURIComponent('Hola quiero recargar ' + amount.toFixed(2) + ' USD en SociosXIT')}`, '_blank');
  rechargeModal.style.display = "none";
});

// =================================================================
// --- LÓGICA DE NIVELES Y DESCUENTOS DESDE ADMIN ---
// =================================================================

const LEVEL_VIP_SPEND = 50;
const LEVEL_PREMIUM_SPEND = 150;
let userTotalSpending = 0;

function calculateLevel(spending) {
    if (spending >= LEVEL_PREMIUM_SPEND) return { level: "Premium", goalLabel: "¡Nivel Máximo!", progressColor: "var(--level-premium)" };
    if (spending >= LEVEL_VIP_SPEND) return { level: "VIP", goalLabel: `Meta Premium: $${LEVEL_PREMIUM_SPEND}`, progressColor: "var(--level-vip)" };
    return { level: "Base", goalLabel: `Meta VIP: $${LEVEL_VIP_SPEND}`, progressColor: "var(--level-base)" };
}

function updateLevelUI(spending) {
    const { level, goalLabel, progressColor } = calculateLevel(spending);
    userTotalSpending = spending;
    const bars = [
        { levelText: userLevelTextMenu, progressText: levelProgressTextMenu, progressBar: levelProgressBarMenu, nextGoal: levelNextGoalMenu },
        { levelText: userLevelTextMain, progressText: levelProgressTextMain, progressBar: levelProgressBarMain, nextGoal: levelNextGoalMain }
    ];
    bars.forEach(bar => {
        if (!bar.levelText) return;
        bar.levelText.textContent = `Nivel: ${level}`;
        bar.nextGoal.textContent = goalLabel;
        let perc = (spending < LEVEL_VIP_SPEND) ? (spending/LEVEL_VIP_SPEND)*100 : (spending/LEVEL_PREMIUM_SPEND)*100;
        bar.progressBar.style.width = `${Math.min(perc, 100).toFixed(2)}%`;
        bar.progressBar.style.backgroundColor = progressColor;
        bar.progressText.textContent = `$${spending.toFixed(2)}`;
    });
}

function loadUserSpendingAndLevel(email) {
    db.ref(`users/${sanitizeEmail(email)}/purchases`).on("value", snap => {
        let total = 0;
        snap.forEach(p => { total += parseFloat(p.val().price || 0); });
        updateLevelUI(total);
    });
}

// --- Comprar y Confirmar ---
let _pendingPurchase = null;

async function openConfirmModal(pubId, safeBtnId, price, rawBtnId) {
    const pubSnap = await db.ref(`publications/${pubId}`).once("value");
    const pub = pubSnap.val();
    const btn = Array.isArray(pub.buttons) ? pub.buttons[Number(rawBtnId)] : pub.buttons[rawBtnId];
    
    const { level } = calculateLevel(userTotalSpending);
    
    // DESCUENTO DIRECTO DESDE ADMIN
    let discount = 0;
    if (level === "VIP") discount = parseFloat(btn.discountVIP || 0);
    else if (level === "Premium") discount = parseFloat(btn.discountPremium || 0);

    const finalPrice = Math.max(0, price - discount);

    confirmModal.style.display = "flex";
    confirmText.textContent = `¿Comprar key? Precio Original: $${price.toFixed(2)}`;
    
    if (discount > 0) {
        finalPriceDisplay.innerHTML = `
            <div class="text-xl font-bold text-neon-green">Precio Final: $${finalPrice.toFixed(2)}</div>
            <div class="text-xs text-neon-cyan">Descuento de Rango ${level}: -$${discount.toFixed(2)}</div>
        `;
    } else {
        finalPriceDisplay.innerHTML = `<div class="text-neon-yellow">Precio Final: $${finalPrice.toFixed(2)}</div>`;
    }

    _pendingPurchase = { pubId, safeBtnId, price, rawBtnId, finalPrice, discount };
}

confirmOk.onclick = async () => {
    if (!_pendingPurchase) return;
    const p = _pendingPurchase;
    confirmModal.style.display = "none";
    await ejecutarCompra(p.pubId, p.safeBtnId, p.price, p.rawBtnId, p.finalPrice, p.discount);
    _pendingPurchase = null;
};
confirmCancel.onclick = () => confirmModal.style.display = "none";

async function ejecutarCompra(pubId, safeBtnId, originalPrice, rawBtnId, finalPrice, discount) {
    try {
        const userKey = sanitizeEmail(currentUser);
        const userRef = db.ref(`users/${userKey}`);
        const balSnap = await userRef.child("balance").once("value");
        let balance = parseFloat(balSnap.val() || 0);

        if (balance < finalPrice) { alert("Saldo insuficiente."); return; }

        const pubSnap = await db.ref(`publications/${pubId}`).once("value");
        const pub = pubSnap.val();
        const btnIndex = Array.isArray(pub.buttons) ? Number(rawBtnId) : rawBtnId;
        const originalBtn = pub.buttons[btnIndex];

        const keysArr = parseKeysField(originalBtn.keys);
        if (keysArr.length === 0) { alert("No hay stock."); return; }
        const selectedKey = keysArr.shift();

        // 1. Descontar Balance
        await userRef.child("balance").set(Number((balance - finalPrice).toFixed(2)));

        // 2. Actualizar Keys
        await updateKeysField(pubId, btnIndex, originalBtn, keysArr);

        // 3. Registrar Compra
        await userRef.child("purchases").push().set({
            pubId, title: pub.title, optionText: originalBtn.text,
            key: selectedKey.key, price: finalPrice, originalPrice,
            discountApplied: discount, date: new Date().toISOString()
        });

        // 4. Incrementar Ventas
        await db.ref(`publications/${pubId}/buyCount`).transaction(c => (c || 0) + 1);

        // 5. Mostrar Key
        keyModalContent.innerHTML = `<div class="mono text-green-300 p-2 text-center text-xl">${selectedKey.key}</div>`;
        keyModal.style.display = "flex";
        keyCopyBtn.onclick = () => { navigator.clipboard.writeText(selectedKey.key); alert("Copiado"); };
        keyCloseBtn.onclick = () => keyModal.style.display = "none";

    } catch (e) { console.error(e); alert("Error en compra"); }
}

// --- Helpers Publicaciones ---
pubsRef.on("value", snap => {
    publicationsContainer.innerHTML = "";
    const data = snap.val();
    if (!data) return;
    const pubs = Object.keys(data).map(k => ({ id: k, ...data[k] })).sort((a,b) => (b.buyCount||0)-(a.buyCount||0));
    pubs.forEach(p => publicationsContainer.appendChild(renderCard(p)));
});

function renderCard(pub) {
    const div = document.createElement("div");
    div.className = "card rounded-xl overflow-hidden shadow-lg p-5";
    let btns = "";
    if (pub.buttons) {
        Object.keys(pub.buttons).forEach(bk => {
            const b = pub.buttons[bk];
            btns += `
                <div class="btn-buy neon-btn p-4 rounded-lg cursor-pointer mb-3" onclick="openConfirmModal('${pub.id}','${bk}',${b.price},'${bk}')">
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="text-2xl font-bold text-neon-cyan">$${parseFloat(b.price).toFixed(2)}</div>
                            <div class="text-sm text-neon-pink">${b.text || b.duration}</div>
                            <div class="text-xs small-muted mt-1">🔑 ${countKeys(b.keys)} keys</div>
                        </div>
                        <div class="bg-white text-blue-900 px-3 py-1 rounded-full font-bold">Comprar</div>
                    </div>
                </div>`;
        });
    }
    div.innerHTML = `
        <h2 class="text-2xl font-bold mb-3 text-neon-pink">${pub.title}</h2>
        <button class="btn-show neon-btn w-full py-2 rounded-lg font-semibold mb-3" onclick="toggleDetails('${pub.id}')">Mostrar Opciones</button>
        <div id="details-${pub.id}" class="hidden mt-4">${btns}</div>`;
    return div;
}

function toggleDetails(id) { document.getElementById(`details-${id}`).classList.toggle("hidden"); }
function sanitizeEmail(e) { return e.replace(/\./g, "_"); }
function loadUserBalance(e) { db.ref(`users/${sanitizeEmail(e)}/balance`).on("value", s => {
    const b = parseFloat(s.val()||0);
    userBalanceEl.textContent = `$${b.toFixed(2)}`;
    menuUserBalance.textContent = `Saldo: $${b.toFixed(2)}`;
});}
function countKeys(k) { if(!k) return 0; return Array.isArray(k) ? k.length : k.split(',').length; }
function parseKeysField(f) { 
    if(!f) return [];
    let raw = Array.isArray(f) ? f : f.split(',').map(s=>s.trim());
    return raw.map(x => {
        let v = typeof x === 'string' ? (x.match(/key\s*:\s*(.+)/i) ? x.match(/key\s*:\s*(.+)/i)[1] : x) : x.key;
        return { key: String(v).trim(), usada: false };
    });
}
async function updateKeysField(id, bk, btn, keys) {
    const path = `publications/${id}/buttons/${bk}/keys`;
    const data = typeof btn.keys === 'string' ? keys.map(k=>`key: ${k.key}`).join(', ') : keys;
    await db.ref(path).set(data);
}

function loadUserPurchases(e) {
    db.ref(`users/${sanitizeEmail(e)}/purchases`).on("value", snap => {
        myKeysList.innerHTML = "";
        const data = snap.val();
        if(!data) { myKeysList.innerHTML = "<p>Sin compras.</p>"; return; }
        Object.values(data).reverse().forEach(p => {
            const d = document.createElement("div");
            d.className = "card rounded-lg p-4 mb-3 flex justify-between items-center";
            d.innerHTML = `<div><div class="font-bold">${p.title}</div><div class="text-xs small-muted">${p.optionText}</div></div>
                           <div class="text-right"><div class="text-green-400 font-bold">$${p.price.toFixed(2)}</div><div class="mono text-xs">${p.key}</div></div>`;
            myKeysList.appendChild(d);
        });
    });
}

showTab("pubs");
