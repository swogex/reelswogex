importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js');

// Initialize Aplu
const apluPushConfig = {
    apiKey: "AIzaSyCHxVFhXm93Sq4ONAIgDnIFX0XzUccQbBk",
	authDomain: "aplu-a24.firebaseapp.com",
	projectId: "aplu-a24",
	storageBucket: "aplu-a24.firebasestorage.app",
	messagingSenderId: "283909295354",
	appId: "1:283909295354:web:8138e14d4880270663cd43"
};

try {
    importScripts('https://push.aplu.io/import-aplu-messaging.js');
} catch (err) {
    console.warn("Couldn't load aplu-script, falling back: ", err);
}