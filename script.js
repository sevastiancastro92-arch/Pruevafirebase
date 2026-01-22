// --- CONFIGURACIÓN FIREBASE (Tus credenciales se mantienen) ---
const firebaseConfig = {
  // Pega aquí tus datos de Firebase...
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// --- LÓGICA DE PARTÍCULAS (Tu original respetada 100%) ---
(function(){
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const colors = ['rgba(0,240,255,0.95)', 'rgba(255,77,240,0.95)', 'rgba(0,255,136,0.95)'];
  const particles = [];
  function rand(min,max){return Math.random()*(max-min)+min;}
  function makeParticle(){
    return { x: rand(0,w), y: rand(0,h), vx: rand(-0.3,0.3), vy: rand(-0.15,0.15), r: rand(0.7,2.6), color: colors[Math.floor(Math.random()*colors.length)] };
  }
  for(let i=0;i<50;i++) particles.push(makeParticle());
  function draw(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.color; ctx.fill();
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>w) p.vx*=-1; if(p.y<0||p.y>h) p.vy*=-1;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// --- VARIABLES ---
const storeContainer = document.getElementById('storeContainer');
const userBalanceEl = document.getElementById('userBalance');
const menuUserBalance = document.getElementById('menuUserBalance');
const myKeysList = document.getElementById('myKeysList');

// --- SISTEMA DE COMPRA PROFESIONAL (Delay 3s + Transacción) ---
async function buyKey(pubId, price, title) {
  const user = auth.currentUser;
  if(!user) return;

  // Mostramos el loader de 3 segundos
  const overlay = document.getElementById('processingOverlay');
  const bar = document.getElementById('procBar');
  overlay.style.display = 'flex';
  bar.style.transition = 'width 3s linear';
  setTimeout(() => bar.style.width = '100%', 50);

  try {
    // TRANSACCIÓN DE SEGURIDAD: Previene duplicados
    const result = await db.ref(`publications/${pubId}`).transaction((post) => {
      if (!post || !post.keys) return;
      
      const availableKeyIds = Object.keys(post.keys).filter(k => !post.keys[k].sold);
      if (availableKeyIds.length === 0) return; // Si no hay keys, cancela la transacción

      // Elegimos la primera key disponible
      const targetId = availableKeyIds[0];
      post.keys[targetId].sold = true;
      post.keys[targetId].buyer = user.email;
      post.keys[targetId].date = Date.now();
      
      // Guardamos temporalmente la key entregada para mostrarla después
      post.lastSoldKey = post.keys[targetId].key;
      return post;
    });

    // Esperar a que terminen los 3 segundos de animación
    setTimeout(async () => {
      overlay.style.display = 'none';
      bar.style.width = '0%';
      bar.style.transition = 'none';

      if (result.committed && result.snapshot.val()) {
        const finalData = result.snapshot.val();
        const deliveredKey = finalData.lastSoldKey;

        // Descontar saldo y guardar historial (Tus funciones originales)
        await updateBalance(user.email, -price);
        await db.ref(`users/${sanitizeEmail(user.email)}/purchases`).push({
          title, key: deliveredKey, date: Date.now()
        });

        showKeySuccess(deliveredKey);
      } else {
        alert("¡Error! La clave ya no está disponible o el saldo es insuficiente.");
      }
    }, 3000);

  } catch (e) {
    overlay.style.display = 'none';
    alert("Error de red crítico.");
  }
}

// --- TUS FUNCIONES ORIGINALES (Respetadas 100%) ---

function sanitizeEmail(email) { return email.replace(/\./g, "_"); }

async function updateBalance(email, amount) {
  const ref = db.ref(`users/${sanitizeEmail(email)}/balance`);
  await ref.transaction(current => (current || 0) + amount);
}

function showKeySuccess(key) {
  const modal = document.getElementById('keyModal');
  document.getElementById('keyModalContent').innerText = key;
  modal.style.display = 'flex';
  document.getElementById('keyCopyBtn').onclick = () => {
    navigator.clipboard.writeText(key);
    alert("¡Key Copiada!");
  };
  document.getElementById('keyCloseBtn').onclick = () => modal.style.display = 'none';
}

function confirmBuy(id, price, title) {
  const modal = document.getElementById('confirmModal');
  document.getElementById('confirmDetails').innerText = `¿Adquirir ${title} por $${price}?`;
  modal.style.display = 'flex';
  document.getElementById('confirmCancel').onclick = () => modal.style.display = 'none';
  document.getElementById('confirmOk').onclick = () => {
    modal.style.display = 'none';
    buyKey(id, price, title);
  };
}

// --- CARGA DE DATOS ---
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('userEmail').innerText = user.email;
    
    // Escuchar Balance
    db.ref(`users/${sanitizeEmail(user.email)}/balance`).on('value', s => {
      const b = s.val() || 0;
      userBalanceEl.innerText = `$${b.toFixed(2)}`;
      menuUserBalance.innerText = `Saldo: $${b.toFixed(2)}`;
    });

    // Escuchar Tienda
    db.ref('publications').on('value', snap => {
      storeContainer.innerHTML = "";
      snap.forEach(child => {
        const p = child.val();
        const stock = p.keys ? Object.values(p.keys).filter(k => !k.sold).length : 0;
        const card = document.createElement('div');
        card.className = "card-product animate-fade-up";
        card.innerHTML = `
          <div class="flex justify-between mb-4">
            <h3 class="font-orbitron text-neon-cyan">${p.title}</h3>
            <span class="text-[10px] opacity-50">${stock} DISPONIBLES</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xl font-bold">$${p.price}</span>
            <button onclick="confirmBuy('${child.key}', ${p.price}, '${p.title}')" class="btn-neon-buy">ADQUIRIR</button>
          </div>
        `;
        storeContainer.appendChild(card);
      });
    });

    // Escuchar Compras
    db.ref(`users/${sanitizeEmail(user.email)}/purchases`).on('value', s => {
      myKeysList.innerHTML = "";
      s.forEach(child => {
        const data = child.val();
        const div = document.createElement('div');
        div.className = "p-3 bg-white/5 border border-white/10 rounded-lg text-xs";
        div.innerHTML = `<div class="text-neon-cyan">${data.title}</div><div class="opacity-40 font-mono">${data.key}</div>`;
        myKeysList.prepend(div);
      });
    });
  } else {
    window.location.href = "index.html";
  }
});
