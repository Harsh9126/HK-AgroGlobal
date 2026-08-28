import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("🛠️ --- AGROGLOBAL ADMIN SETUP --- 🛠️");
console.log("This script will create your initial Admin account in Firebase.");

rl.question("Enter Admin Email: ", (email) => {
  rl.question("Enter Admin Password (min 6 chars): ", async (password) => {
    try {
      console.log("⏳ Creating account...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ SUCCESS! Admin account created.");
      console.log("📧 Email:", userCredential.user.email);
      console.log("🔑 ID:", userCredential.user.uid);
      console.log("\nYou can now login at http://localhost:5173/admin");
    } catch (error) {
      console.error("❌ ERROR:", error.message);
    } finally {
      rl.close();
    }
  });
});
