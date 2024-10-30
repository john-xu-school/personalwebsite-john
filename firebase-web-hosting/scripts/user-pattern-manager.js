// Import all necessary Firebase functions
import { 
    initializeApp 
  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  
  import { 
    getFirestore, 
    doc, 
    getDoc, 
    updateDoc, 
    setDoc, 
    increment,
    onSnapshot 
  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
  
  import { 
    getAnalytics 
  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
  
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAZ3uSIfeNWjX6fzQGViILir-pDKr3bQgM",
    authDomain: "personalwebsite-john.firebaseapp.com",
    projectId: "personalwebsite-john",
    storageBucket: "personalwebsite-john.appspot.com",
    messagingSenderId: "641737664192",
    appId: "1:641737664192:web:fe5484527ea8bde2a52f25"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);
  
  // Define the statistics document reference
  const statsDoc = doc(db, 'statistics', 'globalStats');
  
  // Initialize or update site statistics
  async function initializeStats() {
    try {
      const statsSnapshot = await getDoc(statsDoc);
      
      if (!statsSnapshot.exists()) {
        // Create initial statistics document if it doesn't exist
        await setDoc(statsDoc, {
          totalVisitors: 0,
          totalPatternsCreated: 0,
          totalGenerationsRun: 0,
          activeUsers: 0,
          lastUpdated: new Date().toISOString()
        });
      }
      
      // Update visitor count and active users
      await updateDoc(statsDoc, {
        totalVisitors: increment(1),
        activeUsers: increment(1),
        lastUpdated: new Date().toISOString()
      });
  
      // Set up listener for real-time updates
      setupStatsListener();
      
      // Clean up function to decrease active users when leaving
      window.addEventListener('beforeunload', async () => {
        try {
          await updateDoc(statsDoc, {
            activeUsers: increment(-1),
            lastUpdated: new Date().toISOString()
          });
        } catch (error) {
          console.error('Error updating active users:', error);
        }
      });
  
    } catch (error) {
      console.error('Error initializing statistics:', error);
    }
  }
  
  // Set up real-time listener for statistics updates
  function setupStatsListener() {
    onSnapshot(statsDoc, (doc) => {
      if (doc.exists()) {
        const stats = doc.data();
        
        // Update UI elements
        document.getElementById('visitCount').textContent = stats.totalVisitors;
        document.getElementById('globalPatterns').textContent = stats.totalPatternsCreated;
        document.getElementById('globalGenerations').textContent = stats.totalGenerationsRun;
        document.getElementById('activeUsers').textContent = stats.activeUsers;
      }
    });
  }
  
  // Function to update pattern creation count
  async function incrementPatternCount() {
    try {
      await updateDoc(statsDoc, {
        totalPatternsCreated: increment(1),
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating pattern count:', error);
    }
  }
  
  // Function to update generations count
  async function incrementGenerationsCount(generationIncrement) {
    try {
      await updateDoc(statsDoc, {
        totalGenerationsRun: increment(generationIncrement),
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating generations count:', error);
    }
  }
  
  // Export the necessary functions and objects
  export {
    initializeStats,
    incrementPatternCount,
    incrementGenerationsCount,
    db  // Export db in case it's needed elsewhere
  };