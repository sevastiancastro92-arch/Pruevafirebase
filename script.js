(function(){
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const colors = ['rgba(0,240,255,0.95)', 'rgba(255,77,240,0.95)', 'rgba(0,255,136,0.95)', 'rgba(255,212,96,0.95)'];
  const particles = [];
  const PARTICLE_COUNT = Math.floor((w*h) / 80000) + 30;
  function rand(min,max){return Math.random()*(max-min)+min;}
  function makeParticle(){
    return {
      x: rand(0,w), y: rand(0,h), vx: rand(-0.3,0.3), vy: rand(-0.15,0.15),
      r: rand(0.7,2.6), life: rand(60,240), hue: colors[Math.floor(Math.random()*colors.length)], glow: rand(6,18)
    };
  }
  for(let i=0;i<PARTICLE_COUNT;i++) particles.push(makeParticle());
  function resize(){ w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
  addEventListener('resize', ()=>{ resize(); });
  function draw(){
    ctx.clearRect(0,0,w,h);
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0, 'rgba(10,8,20,0.0)'); g.addColorStop(1, 'rgba(6,4,12,0.12)');
    ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
    for(let p of particles){
      p.x += p.vx; p.y += p.vy; p.life--;
      if(p.x<-20)p.x=w+20; if(p.x>w+20)p.x=-20; if(p.y<-20)p.y=h+20; if(p.y>h+20)p.y=-20;
      if(p.life<=0){ Object.assign(p, makeParticle()); p.x=rand(0,w); p.y=rand(0,h); }
      ctx.beginPath();
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glow);
      grd.addColorStop(0, p.hue); grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd; ctx.arc(p.x, p.y, p.r*3+(p.glow/6), 0, Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  resize(); draw();
})();

/* ===================== LOGICA PRINCIPAL ===================== */
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
const rechargeModal = document.getElementById("rechargeModal");
const rechargeAmountInput = document.getElementById("rechargeAmountInput");
const rechargeConfirmBtn = document.getElementById("rechargeConfirmBtn");
const rechargeCancelBtn = document.getElementById("rechargeCancelBtn");
const rechargeError = document.getElementById("rechargeError");
const confirmModal = document.getElementById("confirmModal");
const confirmText = document.getElementById("confirmText");
const confirmOk = document.getElementById("confirmOk");
const confirmCancel = document.getElementById("confirmCancel");
const finalPriceDisplay = document.getElementById("finalPriceDisplay");
const keyModal = document.getElementById("keyModal");
const keyModalContent = document.getElementById("keyModalContent");
const keyCopyBtn = document.getElementById("keyCopyBtn");
const keyCloseBtn = document.getElementById("keyCloseBtn");
const tabPublicaciones = document.getElementById("tabPublicaciones");
const tabKeys = document.getElementById("tabKeys");

// Pestañas
tabPublicaciones.onclick = () => showTab("pubs");
tabKeys.onclick = () => showTab("keys");
function showTab(tab) {
  if (tab === "pubs") {
    publicationsContainer.classList.remove("hidden");
    myKeysContainer.classList.add("hidden");
    tabPublicaciones.classList.add("active"); tabKeys.classList.remove("active");
  } else {
    publicationsContainer.classList.add("hidden");
    myKeysContainer.classList.remove("hidden");
    tabPublicaciones.classList.remove("active"); tabKeys.classList.add("active");
  }
}

// Sesión
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

logoutBtn.onclick = () => { sessionStorage.removeItem("sociosxit_user"); window.location.href = "index.html"; };
menuLogout.addEventListener("click", ()=> { sessionStorage.removeItem("sociosxit_user"); window.location.href = "index.html"; });

// Menú Lateral
function openMenu() {
  sideMenu.classList.add("open"); menuBackdrop.style.display = "block";
  setTimeout(()=> menuBackdrop.style.opacity = "1", 10);
  hamburgerBtn.classList.add("open");
}
function closeMenu() {
  sideMenu.classList.remove("open"); menuBackdrop.style.opacity = "0";
  hamburgerBtn.classList.remove("open");
  setTimeout(()=> menuBackdrop.style.display = "none", 240);
}
hamburgerBtn.addEventListener("click", ()=> { if (sideMenu.classList.contains("open")) closeMenu(); else openMenu(); });
menuBackdrop.addEventListener("click", closeMenu);
menuPublicaciones.addEventListener("click", ()=> { showTab("pubs"); closeMenu(); });
menuKeys.addEventListener("click", ()=> { showTab("keys"); closeMenu(); });

// Recarga
menuRecharge.addEventListener("click", ()=> { closeMenu(); rechargeModal.style.display = "flex"; rechargeAmountInput.value = ""; rechargeError.classList.add("hidden"); });
rechargeCancelBtn.addEventListener("click", ()=> { rechargeModal.style.display = "none"; });
rechargeConfirmBtn.addEventListener("click", ()=> {
  const amount = parseFloat(rechargeAmountInput.value);
  if (isNaN(amount) || amount < 4) { rechargeError.classList.remove("hidden"); return; }
  rechargeModal.style.display = "none";
  window.open(`https://wa.me/+573142369516?text=${encodeURIComponent(`Hola quiero recargar ${amount.toFixed(2)} USD en la pagina de socios`)}`, '_blank');
});

// Nivel y Descuentos
const LEVEL_VIP_SPEND = 50;
const LEVEL_PREMIUM_SPEND = 150;
let userTotalSpending = 0;

function calculateLevel(spending) {
  if (spending >= LEVEL_PREMIUM_SPEND) return { level: "Premium", discount: 0.20, nextGoal: LEVEL_PREMIUM_SPEND, goalLabel: "¡Nivel Máximo!", progressColor: "var(--level-premium)" };
  else if (spending >= LEVEL_VIP_SPEND) return { level: "VIP", discount: 0.10, nextGoal: LEVEL_PREMIUM_SPEND, goalLabel: `Próx. nivel (Premium): $${LEVEL_PREMIUM_SPEND}`, progressColor: "var(--level-vip)" };
  else return { level: "Base", discount: 0.00, nextGoal: LEVEL_VIP_SPEND, goalLabel: `Próx. nivel (VIP): $${LEVEL_VIP_SPEND}`, progressColor: "var(--level-base)" };
}

function updateLevelUI(spending) {
  userTotalSpending = spending;
  const { level, nextGoal, goalLabel, progressColor } = calculateLevel(spending);
  const bars = [
    { txt: document.getElementById("userLevelTextMenu"), pTxt: document.getElementById("levelProgressTextMenu"), bar: document.getElementById("levelProgressBarMenu"), nxt: document.getElementById("levelNextGoalMenu") },
    { txt: document.getElementById("userLevelTextMain"), pTxt: document.getElementById("levelProgressTextMain"), bar: document.getElementById("levelProgressBarMain"), nxt: document.getElementById("levelNextGoalMain") }
  ];
  bars.forEach(b => {
    if(!b.txt) return;
    b.txt.textContent = `Nivel: ${level}`;
    b.txt.className = `level-label ${level==='VIP'?'level-vip-text':level==='Premium'?'level-premium-text':''}`;
    b.nxt.textContent = goalLabel;
    let pct = (spending / nextGoal) * 100;
    if(spending >= 150) pct = 100;
    b.pTxt.textContent = `$${spending.toFixed(2)} / $${nextGoal.toFixed(2)}`;
    b.bar.style.width = `${Math.min(pct, 100).toFixed(2)}%`;
    b.bar.style.backgroundColor = progressColor;
  });
}
function loadUserSpendingAndLevel(email) {
  db.ref(`users/${sanitizeEmail(email)}/purchases`).on("value", s => {
    let total = 0; const v = s.val();
    if(v) Object.values(v).forEach(p => total += parseFloat(p.price||0));
    updateLevelUI(total);
  });
}

// Publicaciones
pubsRef.on("value", (snapshot) => {
  publicationsContainer.innerHTML = "";
  const data = snapshot.val();
  if (!data) { publicationsContainer.innerHTML = "<p>No hay publicaciones.</p>"; return; }
  const pubsArray = Object.keys(data).map(k => ({ id: k, ...data[k] }));
  pubsArray.sort((a, b) => (b.buyCount || 0) - (a.buyCount || 0));
  pubsArray.forEach(pub => publicationsContainer.appendChild(createPublicationElement(pub, pub.id)));
});

function createPublicationElement(pub, key) {
  const div = document.createElement("div"); div.className = "card rounded-xl overflow-hidden shadow-lg p-5";
  let mediaHTML = "";
  if (pub.mediaUrl) {
    if (pub.mediaUrl.includes("youtube") || pub.mediaUrl.includes("youtu.be")) {
      const vidId = pub.mediaUrl.split('v=')[1] || pub.mediaUrl.split('/').pop();
      mediaHTML = `<div class="aspect-w-16 aspect-h-9 mb-4"><iframe src="https://www.youtube.com/embed/${vidId}" class="w-full h-full rounded-lg"></iframe></div>`;
    } else mediaHTML = `<img src="${pub.mediaUrl}" class="w-full h-48 object-cover rounded-lg mb-4">`;
  }
  let btnsHTML = "";
  if (pub.buttons) {
    Object.keys(pub.buttons).forEach(bk => {
      const btn = pub.buttons[bk];
      const pNum = parseFloat(btn.price||0);
      const safeId = String(bk).replace(/\W/g, "_");
      btnsHTML += `<div class="btn-buy neon-btn p-4 rounded-lg text-center transition-transform hover:scale-105 cursor-pointer mb-3">
        <button onclick="openConfirmModal('${key}','${safeId}', ${pNum}, '${bk}')" class="w-full text-left">
          <div class="flex items-center justify-between">
            <div><div class="text-2xl font-bold text-neon-cyan">$${pNum.toFixed(2)}</div><div class="text-sm font-semibold text-neon-pink">${btn.duration||'—'}</div><div class="text-xs small-muted mt-1">🔑 ${countKeys(btn.keys)} claves</div></div>
            <div class="py-2 px-3 rounded-full bg-white text-blue-900 font-bold">Comprar</div>
          </div>
        </button></div>`;
    });
  }
  div.innerHTML = `${mediaHTML}<h2 class="text-2xl font-bold mb-3 text-neon-pink">${pub.title}</h2><button class="btn-show neon-btn w-full py-2 rounded-lg font-semibold mb-3" onclick="document.getElementById('details-${key}').classList.toggle('hidden')">Mostrar Opciones</button><div id="details-${key}" class="hidden mt-4 space-y-3">${btnsHTML||"<p>Sin botones</p>"}</div>`;
  return div;
}

// Compras
let _pending = null;
window.openConfirmModal = function(pubId, safeId, price, rawId) {
  const { discount } = calculateLevel(userTotalSpending);
  const finalPrice = price - (price * discount);
  confirmModal.style.display = "flex";
  confirmText.textContent = `Precio base: $${price.toFixed(2)} USD`;
  finalPriceDisplay.innerHTML = discount > 0 ? `<span class="text-neon-green">Final: $${finalPrice.toFixed(2)}</span> <span class="text-xs">(-${discount*100}%)</span>` : `Final: $${finalPrice.toFixed(2)}`;
  _pending = { pubId, safeId, price, rawId, finalPrice };
};
confirmCancel.onclick = () => { confirmModal.style.display = "none"; _pending = null; };
confirmOk.onclick = async () => {
  if(!_pending) return; confirmModal.style.display = "none";
  await comprarKey(_pending.pubId, _pending.safeId, _pending.price, _pending.rawId, _pending.finalPrice);
  _pending = null;
};

async function comprarKey(pubId, safeId, orgPrice, rawId, finalPrice) {
  try {
    const userKey = sanitizeEmail(currentUser);
    const userRef = db.ref(`users/${userKey}`);
    const balSnap = await userRef.child("balance").once("value");
    let bal = parseFloat(balSnap.val()||0);
    if(bal < finalPrice) { alert("Saldo insuficiente"); return; }

    const pubSnap = await db.ref(`publications/${pubId}`).once("value");
    const pub = pubSnap.val();
    let btnKey = rawId;
    let btn = pub.buttons[btnKey];
    if(!btn && Array.isArray(pub.buttons)) { btn = pub.buttons[Number(safeId)]; btnKey = Number(safeId); }
    if(!btn) { alert("Opción no encontrada"); return; }

    const keysArr = parseKeysField(btn.keys);
    if(!keysArr.length) { alert("Sin stock"); return; }
    const selected = keysArr[0];

    const newBal = bal - finalPrice;
    await userRef.child("balance").set(Number(newBal.toFixed(2)));

    const updatedKeys = keysArr.slice(1);
    await updateKeysField(pubId, btnKey, btn, updatedKeys);

    await userRef.child("purchases").push({
      pubId, title: pub.title, optionText: btn.text||"", key: selected.key,
      price: finalPrice, originalPrice: orgPrice, discount: (orgPrice-finalPrice).toFixed(2),
      date: new Date().toISOString()
    });
    await db.ref(`publications/${pubId}/buyCount`).transaction(v => (v||0)+1);

    keyModalContent.innerHTML = `<div class="mb-2">${pub.title}</div><div class="mono text-green-300 p-2">${selected.key}</div>`;
    keyModal.style.display = "flex";
    keyCopyBtn.onclick = () => { navigator.clipboard.writeText(selected.key); alert("Copiado"); };
    keyCloseBtn.onclick = () => keyModal.style.display = "none";
    userBalanceEl.textContent = `$${newBal.toFixed(2)}`;
  } catch(e) { console.error(e); alert("Error en compra"); }
}

// Helpers
function sanitizeEmail(e) { return e.replace(/\./g, "_"); }
function loadUserBalance(e) {
  db.ref(`users/${sanitizeEmail(e)}/balance`).on("value", s => {
    const b = parseFloat(s.val()||0); const f = `$${b.toFixed(2)}`;
    userBalanceEl.textContent = f; menuUserBalance.textContent = `Saldo: ${f}`;
  });
}
function loadUserPurchases(e) {
  db.ref(`users/${sanitizeEmail(e)}/purchases`).on("value", s => {
    const d = s.val(); if(!d) { myKeysList.innerHTML="<p>Sin compras.</p>"; return; }
    const all = Object.values(d).reverse();
    const term = document.getElementById("searchKeyInput").value.toLowerCase();
    const filtered = all.filter(i => (i.title||"").toLowerCase().includes(term) || (i.key||"").toLowerCase().includes(term));
    myKeysList.innerHTML = "";
    filtered.forEach(it => {
      const date = new Date(it.date).toLocaleDateString();
      myKeysList.innerHTML += `<div class="card p-4 mb-2"><div class="font-bold">${it.title}</div><div class="text-xs text-gray-400">${date}</div><div class="mono text-green-300 mt-1">${it.key}</div></div>`;
    });
  });
  document.getElementById("searchKeyInput").oninput = () => loadUserPurchases(currentUser);
}
function countKeys(k) { return parseKeysField(k).length; }
function parseKeysField(k) {
  if(!k) return [];
  if(Array.isArray(k)) return k.map(x => typeof x==='string'?{key:x}:x);
  if(typeof k==='string') return k.split(',').map(s=>({key:s.trim()})).filter(x=>x.key);
  return [];
}
async function updateKeysField(pid, bid, btn, keys) {
  const path = `publications/${pid}/buttons/${bid}/keys`;
  if(typeof btn.keys==='string') await db.ref(path).set(keys.map(k=>k.key).join(", "));
  else await db.ref(path).set(keys);
}
showTab("pubs");

/* ===================== LOGICA CHAT FLOTANTE ===================== */
document.addEventListener("DOMContentLoaded", function() {
  const chatInput = document.getElementById("chatInput");
  const chatSendBtn = document.getElementById("chatSendBtn");
  const chatMessages = document.getElementById("chatMessages");
  const chatUploadBtn = document.getElementById("chatUploadBtn");
  const chatImgInput = document.getElementById("chatImgInput");
  
  const IMGBB_API_KEY = "f4a63b9f9af2fd112ded296694732a20";
  const chatRef = db.ref("globalChat");

  function sendMessage(text, type = "text") {
    if (!text.trim()) return;
    chatRef.push({ user: currentUser, content: text, type: type, timestamp: firebase.database.ServerValue.TIMESTAMP });
    chatInput.value = "";
  }

  chatSendBtn.addEventListener("click", () => sendMessage(chatInput.value));
  chatInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(chatInput.value); });

  chatUploadBtn.addEventListener("click", () => chatImgInput.click());
  chatImgInput.addEventListener("change", async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const oldIcon = chatUploadBtn.innerHTML; chatUploadBtn.innerHTML = "⏳";
    const fd = new FormData(); fd.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) sendMessage(data.data.url, "image");
      else alert("Error subida");
    } catch (er) { console.error(er); }
    finally { chatUploadBtn.innerHTML = oldIcon; chatImgInput.value = ""; }
  });

  chatRef.limitToLast(50).on("child_added", (snapshot) => {
    const data = snapshot.val();
    const isMe = data.user === currentUser;
    const div = document.createElement("div");
    div.className = `message ${isMe ? "self" : "other"}`;
    
    let contentHtml = "";
    if (data.type === "image" || (typeof data.content === 'string' && data.content.match(/^http.*\.(jpg|jpeg|png|gif|webp)$/i))) {
       contentHtml = `<span class="msg-user">${data.user}</span><a href="${data.content}" target="_blank"><img src="${data.content}" class="msg-img"></a>`;
    } else {
       contentHtml = `<span class="msg-user">${data.user}</span>${data.content.replace(/</g,"&lt;")}`;
    }
    
    div.innerHTML = contentHtml;
    chatMessages.appendChild(div);
    setTimeout(()=> chatMessages.scrollTop = chatMessages.scrollHeight, 100);
  });
});
