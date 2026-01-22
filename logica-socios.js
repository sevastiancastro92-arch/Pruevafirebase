// --- CONFIGURACIÓN PARTICLES.JS ---
particlesJS("particles-js", {
  "particles": {
    "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
    "color": { "value": ["#ff006e", "#8338ec", "#3a86ff"] },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.5 },
    "size": { "value": 3, "random": true },
    "line_linked": { "enable": true, "distance": 150, "color": "#8338ec", "opacity": 0.4, "width": 1 },
    "move": { "enable": true, "speed": 2 }
  },
  "interactivity": {
    "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } },
    "modes": { "grab": { "distance": 180, "line_linked": { "opacity": 0.8 } } }
  },
  "retina_detect": true
});

// --- CONFIGURACIÓN FIREBASE ---
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
const auth = firebase.auth(); 
const usersRef = db.ref("users");
const uidMapRef = db.ref("uid_map"); 
const adminLogsRef = db.ref("admin_logs"); 

// --- NAVEGACIÓN ENTRE VISTAS ---
const show = (id) => {
  const views = ["welcomeView", "loginView", "usernamePromptView"];
  views.forEach(v => {
    const el = document.getElementById(v);
    if (v === id) el.classList.remove("hidden");
    else el.classList.add("hidden");
  });
  
  const formCont = document.getElementById("formContainer");
  if(id === "welcomeView") formCont.classList.add("hidden");
  else formCont.classList.remove("hidden");
};

// Asignación de eventos de botones de navegación
document.getElementById("btnGoLogin").onclick = () => show("loginView");
document.getElementById("btnGoRegister").onclick = () => signInWithGoogle();
document.getElementById("goBackHome").onclick = () => show("welcomeView");

// --- LÓGICA DE FIREBASE ---
let googleUserData = null;

const sendAdminLog = (username, action) => {
    adminLogsRef.push().set({
        timestamp: new Date().toISOString(),
        username: username,
        action: action, 
        status: "Success"
    });
};

const provider = new firebase.auth.GoogleAuthProvider();

async function signInWithGoogle() {
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    const uidSnap = await uidMapRef.child(user.uid).once("value");

    if (uidSnap.exists()) {
      const customUser = uidSnap.val();
      sessionStorage.setItem("sociosxit_user", customUser);
      sendAdminLog(customUser, "Google Login");
      window.location.href = "dashboard.html";
    } else {
      googleUserData = user; 
      show("usernamePromptView"); 
      document.getElementById("promptUser").value = user.displayName ? user.displayName.replace(/\s/g, '').toLowerCase() : user.email.split('@')[0];
    }
  } catch (error) { alert("Error: " + error.message); }
}

document.getElementById("googleLoginBtn").onclick = signInWithGoogle;

document.getElementById("loginBtn").onclick = async () => {
  const user = loginUser.value.trim();
  const pass = loginPass.value.trim();
  if (!user || !pass) return alert("Completa todos los campos");

  try {
    const snap = await usersRef.child(user).once("value");
    if (snap.exists() && snap.val().password === pass) {
      sessionStorage.setItem("sociosxit_user", user);
      sendAdminLog(user, "Manual Login");
      window.location.href = "dashboard.html";
    } else { alert("Datos incorrectos"); }
  } catch (error) { console.error(error); }
};

document.getElementById("promptUserBtn").onclick = async () => {
  const customUser = promptUser.value.trim();
  if (customUser.length < 3) return alert("Usuario muy corto");

  try {
    const userSnap = await usersRef.child(customUser).once("value");
    if (userSnap.exists()) return alert("El usuario ya existe");

    await usersRef.child(customUser).set({
      uid: googleUserData.uid,
      email: googleUserData.email,
      provider: 'google',
      registered_at: new Date().toISOString()
    });

    await uidMapRef.child(googleUserData.uid).set(customUser);
    sessionStorage.setItem("sociosxit_user", customUser);
    sendAdminLog(customUser, "Google Registration");
    
    document.getElementById("successMessage").innerText = "¡Registro exitoso!";
    document.getElementById("successModal").classList.remove("hidden");
  } catch (error) { alert("Error: " + error.message); }
};

document.getElementById("closeModalBtn").onclick = () => {
    window.location.href = "dashboard.html";
};
