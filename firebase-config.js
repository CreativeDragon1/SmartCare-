const firebaseConfig = {
    apiKey: "AIzaSyDuO0EsYvzwc8r3RmlUl8N1oiAcskoHja0",
    authDomain: "smartcare-9d8b6.firebaseapp.com",
    projectId: "smartcare-9d8b6",
    storageBucket: "smartcare-9d8b6.firebasestorage.app",
    messagingSenderId: "15010411909",
    appId: "1:15010411909:web:96ad8f042ff345c6fc40ec",
    measurementId: "G-55ZLR0QQ4N"
};

firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const db = firebase.firestore()
