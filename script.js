/* === SCRIPT COMPLETO SOCIOSXIT - LÓGICA DE NEGOCIO Y SEGURIDAD === */

// 1. Configuración de Firebase
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

// 2. Sistema de Partículas
(function(){
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const particles = [];
  function makeP() { return { x: Math.random()*w, y: Math.random()*h, vx: Math.random()*0.4-0.2, vy: Math.random()*0.4-0.2, r: Math.random()*2, life: Math.random()*100+100 }; }
  for(let i=0; i<60; i++) particles.push(makeP());
  function draw() {
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = "rgba(0, 243, 255, 0.5)";
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.life--;
      if(p.life <= 0) Object.assign(p, makeP());
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// 3. Variables de Estado
const currentUser = sessionStorage.getItem("sociosxit_user");
let userSpending = 0;
let isBuying = false; // LOCK DE SEGURIDAD
let _pending = null;

if (!currentUser) window.location.href = "index.html";
const userPath = currentUser.replace(/\./g, "_");

// 4. Carga de Datos de Usuario
function init() {
  document.getElementById("userName").textContent = currentUser.split('@')[0].toUpperCase();
  
  // Balance
  db.ref(`users/${userPath}/balance`).on("value", s => {
    const bal = parseFloat(s.val() || 0);
    document.getElementById("userBalance").textContent = `${bal.toFixed(2)} USD`;
  });

  // Gastos y Nivel
  db.ref(`users/${userPath}/purchases`).on("value", s => {
    let total = 0;
    const list = document.getElementById("myKeysContainer");
    list.innerHTML = '<h2 class="text-xl font-black text-neon-pink mb-4">HISTORIAL DE COMPRAS</h2>';
    
    s.forEach(snap => {
      const p = snap.val();
      total += parseFloat(p.price || 0);
      const div = document.createElement("div");
      div.className = "card p-5 flex justify-between items-center";
      div.innerHTML = `<div><div class="font-bold">${p.title}</div><div class="text-[10px] opacity-40">${p.date.split('T')[0]}</div></div><div class="text-neon-green font-mono font-bold">${p.key}</div>`;
      list.prepend(div);
    });
    userSpending = total;
  });
}
init();

// 5. Lógica de Niveles y Descuentos
function getLevel(spending) {
  if (spending >= 150) return { name: "PREMIUM", discount: "discountPremium" };
  if (spending >= 50) return { name: "VIP", discount: "discountVIP" };
  return { name: "BASE", discount: null };
}

// 6. Manejo de Publicaciones
db.ref("publications").on("value", s => {
  const container = document.getElementById("publicationsContainer");
  container.innerHTML = "";
  s.forEach(snap => {
    const pub = snap.val();
    const pubId = snap.key;
    const card = document.createElement("div");
    card.className = "card overflow-hidden";
    card.innerHTML = `
      <img src="${pub.mediaUrl}" class="w-full h-44 object-cover opacity-80">
      <div class="p-6">
        <h3 class="text-lg font-black mb-4 tracking-tight">${pub.title}</h3>
        <div class="grid grid-cols-1 gap-2">
          ${Object.keys(pub.buttons || {}).map(bKey => {
            const btn = pub.buttons[bKey];
            return `<button onclick="preparePurchase('${pubId}', '${bKey}', ${btn.price})" class="neon-btn py-3 rounded-xl text-sm uppercase">${btn.duration || bKey} - $${btn.price}</button>`;
          }).join('')}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
});

// 7. FLUJO DE COMPRA SEGURO
async function preparePurchase(pubId, btnKey, price) {
  const pubSnap = await db.ref(`publications/${pubId}`).once("value");
  const btn = pubSnap.val().buttons[btnKey];
  const level = getLevel(userSpending);
  
  let discount = btn[level.discount] || 0;
  let finalPrice = Math.max(0, price - discount);

  document.getElementById("confirmText").innerHTML = `Producto: ${pubSnap.val().title}<br>Nivel: <span class="text-neon-cyan">${level.name}</span>`;
  document.getElementById("finalPriceDisplay").textContent = `$${finalPrice.toFixed(2)} USD`;
  document.getElementById("confirmModal").style.display = "flex";

  _pending = { pubId, btnKey, finalPrice, title: pubSnap.val().title };
}

document.getElementById("confirmCancel").onclick = () => { document.getElementById("confirmModal").style.display = "none"; };

document.getElementById("confirmOk").onclick = async () => {
  if (!_pending || isBuying) return;
  document.getElementById("confirmModal").style.display = "none";

  // INICIO DE PROCESAMIENTO DE 3 SEGUNDOS
  const modal = document.getElementById("processingModal");
  const countEl = document.getElementById("processCountdown");
  modal.style.display = "flex";
  
  for(let i=3; i>0; i--) {
    countEl.textContent = i;
    await new Promise(r => setTimeout(r, 1000));
  }
  modal.style.display = "none";

  ejecutarCompra();
};

async function ejecutarCompra() {
  if (isBuying) return;
  isBuying = true;

  try {
    const userRef = db.ref(`users/${userPath}`);
    const balSnap = await userRef.child("balance").once("value");
    let balance = parseFloat(balSnap.val() || 0);

    if (balance < _pending.finalPrice) {
      alert("Saldo insuficiente.");
      isBuying = false;
      return;
    }

    const pubRef = db.ref(`publications/${_pending.pubId}/buttons/${_pending.btnKey}`);
    const btnSnap = await pubRef.once("value");
    const btnData = btnSnap.val();

    // Parsear Keys
    let keys = [];
    if(Array.isArray(btnData.keys)) keys = [...btnData.keys];
    else if(typeof btnData.keys === 'string') keys = btnData.keys.split(",").map(k => k.trim()).filter(k => k);

    if (keys.length === 0) {
      alert("¡SIN STOCK! Alguien compró la última key justo ahora.");
      isBuying = false;
      return;
    }

    // EXTRAER KEY (Garantiza que no se repita)
    const selected = keys.shift();

    // Transacción en Firebase
    await userRef.child("balance").set(Number((balance - _pending.finalPrice).toFixed(2)));
    await pubRef.child("keys").set(keys); // Actualizamos la lista sin la key vendida
    
    // Guardar compra
    await userRef.child("purchases").push().set({
      title: _pending.title,
      key: (typeof selected === 'object' ? selected.key : selected),
      price: _pending.finalPrice,
      date: new Date().toISOString()
    });

    // Mostrar Resultado
    document.getElementById("keyModalContent").innerHTML = `
      <div class="text-xs text-white/40 mb-2 uppercase tracking-widest">Tu código de acceso:</div>
      <div class="bg-white/5 border border-neon-green p-4 rounded-2xl font-mono text-xl text-neon-green shadow-[0_0_15px_rgba(10,255,96,0.1)]">
        ${(typeof selected === 'object' ? selected.key : selected)}
      </div>
    `;
    document.getElementById("keyModal").style.display = "flex";

  } catch (e) {
    console.error(e);
    alert("Error de red. Intenta de nuevo.");
  } finally {
    isBuying = false;
    _pending = null;
  }
}

// Botones de Modal Key
document.getElementById("keyCopyBtn").onclick = () => {
  const keyText = document.querySelector("#keyModalContent .font-mono").textContent.trim();
  navigator.clipboard.writeText(keyText);
  document.getElementById("keyCopyBtn").textContent = "¡COPIADO!";
  setTimeout(() => { document.getElementById("keyCopyBtn").textContent = "COPIAR AL PORTAPAPELES"; }, 2000);
};

document.getElementById("keyCloseBtn").onclick = () => { document.getElementById("keyModal").style.display = "none"; };

// Navegación de Pestañas
document.getElementById("tabPublicaciones").onclick = () => {
  document.getElementById("publicationsContainer").classList.remove("hidden");
  document.getElementById("myKeysContainer").classList.add("hidden");
  document.getElementById("tabPublicaciones").className = "flex-1 py-4 rounded-2xl font-bold border-2 border-neon-cyan bg-neon-cyan/10 text-neon-cyan";
  document.getElementById("tabKeys").className = "flex-1 py-4 rounded-2xl font-bold border border-white/10 bg-white/5 text-white/60";
};

document.getElementById("tabKeys").onclick = () => {
  document.getElementById("publicationsContainer").classList.add("hidden");
  document.getElementById("myKeysContainer").classList.remove("hidden");
  document.getElementById("tabKeys").className = "flex-1 py-4 rounded-2xl font-bold border-2 border-neon-pink bg-neon-pink/10 text-neon-pink";
  document.getElementById("tabPublicaciones").className = "flex-1 py-4 rounded-2xl font-bold border border-white/10 bg-white/5 text-white/60";
};
