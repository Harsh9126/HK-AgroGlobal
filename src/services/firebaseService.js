import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { db, auth } from '../lib/firebase';

/**
 * AGROGLOBAL - FIREBASE DATA SERVICE
 * Handles all Firestore and Authentication operations.
 */

export const FirebaseService = {
  // --- Authentication ---
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      throw err;
    }
  },

  async logout() {
    try {
      await signOut(auth);
    } catch (err) {
      throw err;
    }
  },

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      throw err;
    }
  },

  subscribeToAuth(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // --- Products ---
  async getProducts() {
    try {
      const q = query(collection(db, 'products'), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      return products;
    } catch (err) {
      console.warn('Firebase Error:', err.message);
      return [];
    }
  },

  async getProductBySlug(slug) {
    try {
      const q = query(collection(db, 'products'), where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      const productDoc = querySnapshot.docs[0];
      return { id: productDoc.id, ...productDoc.data() };
    } catch (err) {
      console.warn('Firebase Error:', err.message);
      return null;
    }
  },

  async createProduct(productData) {
    const { id, ...cleanData } = productData;
    const docRef = await addDoc(collection(db, 'products'), {
      ...cleanData,
      created_at: serverTimestamp()
    });
    return { id: docRef.id, ...cleanData };
  },

  async updateProduct(id, productData) {
    const { id: _, ...cleanData } = productData;
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, cleanData);
    return { id, ...cleanData };
  },

  async deleteProduct(id) {
    await deleteDoc(doc(db, 'products', id));
  },

  // --- Categories ---
  async getCategories() {
    try {
      // Fetch categories and products in parallel
      const [catSnapshot, prodSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'categories'), orderBy('name'))),
        getDocs(collection(db, 'products'))
      ]);

      // Build a list of all products
      const allProducts = [];
      prodSnapshot.forEach((d) => allProducts.push({ id: d.id, ...d.data() }));

      // Map categories with a live product_count using category_id (exact match only)
      const categories = [];
      catSnapshot.forEach((d) => {
        const cat = { id: d.id, ...d.data() };

        // Count only products that are explicitly assigned to this category via category_id
        const count = allProducts.filter((p) => p.category_id === cat.id).length;

        categories.push({ ...cat, product_count: count });
      });

      return categories;
    } catch (err) {
      console.warn('Firebase Error:', err.message);
      return [];
    }
  },

  async createCategory(categoryData) {
    const { id, ...cleanData } = categoryData;
    const docRef = await addDoc(collection(db, 'categories'), {
      ...cleanData,
      created_at: serverTimestamp()
    });
    return { id: docRef.id, ...cleanData };
  },

  async updateCategory(id, categoryData) {
    const { id: _, ...cleanData } = categoryData;
    const docRef = doc(db, 'categories', id);
    await updateDoc(docRef, cleanData);
    return { id, ...cleanData };
  },

  async deleteCategory(id) {
    await deleteDoc(doc(db, 'categories', id));
  },

  // --- Certificates ---
  async getCertificates() {
    try {
      const q = query(collection(db, 'certificates'), orderBy('order'));
      const snap = await getDocs(q);
      const certs = [];
      snap.forEach((d) => certs.push({ id: d.id, ...d.data() }));
      return certs;
    } catch (err) {
      console.warn('Firebase Error (certificates):', err.message);
      return [];
    }
  },

  async createCertificate(data) {
    const { id, ...clean } = data;
    const ref = await addDoc(collection(db, 'certificates'), {
      ...clean,
      created_at: serverTimestamp()
    });
    return { id: ref.id, ...clean };
  },

  async updateCertificate(id, data) {
    const { id: _, ...clean } = data;
    await updateDoc(doc(db, 'certificates', id), clean);
    return { id, ...clean };
  },

  async deleteCertificate(id) {
    await deleteDoc(doc(db, 'certificates', id));
  },

  // --- Inquiries ---

  async getInquiries() {
    try {
      const q = query(collection(db, 'inquiries'), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const inquiries = [];
      querySnapshot.forEach((doc) => {
        inquiries.push({ id: doc.id, ...doc.data() });
      });
      return inquiries;
    } catch (err) {
      console.warn('Firebase Error:', err.message);
      return [];
    }
  },

  async submitInquiry(inquiryData) {
    const extras = [];
    if (inquiryData.phone1)    extras.push(`Primary Phone: ${inquiryData.phone1}`);
    if (inquiryData.phone2)    extras.push(`Secondary Phone: ${inquiryData.phone2}`);
    if (inquiryData.phone)     extras.push(`Phone: ${inquiryData.phone}`);
    if (inquiryData.company)   extras.push(`Company: ${inquiryData.company}`);
    if (inquiryData.product)   extras.push(`Product: ${inquiryData.product}`);
    if (inquiryData.quantity)  extras.push(`Quantity: ${inquiryData.quantity}`);
    if (inquiryData.country)   extras.push(`Destination: ${inquiryData.country}`);

    const fullMessage = extras.length > 0
      ? `${inquiryData.message || ''}\n\n--- Additional Details ---\n${extras.join('\n')}`
      : (inquiryData.message || '');

    const payload = {
      name:     inquiryData.name,
      email:    inquiryData.email,
      interest: inquiryData.interest || 'General',
      subject:  inquiryData.subject || 'General Inquiry',
      message:  fullMessage,
      status:   inquiryData.status || 'new',
      created_at: serverTimestamp()
    };

    await addDoc(collection(db, 'inquiries'), payload);
    return { success: true };
  },

  async updateInquiryStatus(id, status) {
    const docRef = doc(db, 'inquiries', id);
    await updateDoc(docRef, { status });
    return { id, status };
  },

  // --- Orders ---
  async getOrders() {
    try {
      const q = query(collection(db, 'orders'), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      return orders;
    } catch (err) {
      console.warn('Firebase Error:', err.message);
      return [];
    }
  },

  async updateOrderStatus(id, status) {
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, { status });
    return { id, status };
  },

  // --- Profile ---
  async getProfile(userId) {
    try {
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (err) {
      console.warn('Firebase Error:', err.message);
      return null;
    }
  }
};
