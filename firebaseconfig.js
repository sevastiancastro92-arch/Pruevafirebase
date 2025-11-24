// --- Configuración de Firebase ---
const firebaseConfig = {
    apiKey: "AIzaSyCr1-2dIqgxoXBTKYgSusnUZorUICX2Too",
    authDomain: "chatglobal-e9370.firebaseapp.com",
    databaseURL: "https://chatglobal-e9370-default-rtdb.firebaseio.com",
    projectId: "chatglobal-e9370",
    storageBucket: "chatglobal-e9370.firebasestorage.app",
    messagingSenderId: "382420208590",
    appId: "1:382420208590:web:9425fa28c8cdf669adb99f"
};

// Inicializar Firebase si no está iniciado
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Exportamos las referencias para ser usadas en el otro script
const auth = firebase.auth();
const database = firebase.database(); 
const usersRef = database.ref('users'); 
