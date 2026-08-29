const firebaseConfig = {
  apiKey: "AIzaSyDuov6g5rWoyaE9jeiSSZ3xytpSAK5JdoI",
  authDomain: "tihaya-gavan-f732b.firebaseapp.com",
  projectId: "tihaya-gavan-f732b",
  storageBucket: "tihaya-gavan-f732b.firebasestorage.app",
  messagingSenderId: "419773336477",
  appId: "1:419773336477:web:1a148208c1b1d623c83d74",
  measurementId: "G-T9C1Q659FT",
};

window.chechenLearningFirebase = {
  app: null,
  analytics: null,
};

if (window.firebase) {
  window.chechenLearningFirebase.app = firebase.initializeApp(firebaseConfig);

  if (location.protocol !== "file:" && firebase.analytics) {
    firebase.analytics.isSupported().then((isSupported) => {
      if (isSupported) {
        window.chechenLearningFirebase.analytics = firebase.analytics();
      }
    });
  }
}
