// Firebase Configuration


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpgAJGWXAPN87CfBHI7cxA44NHjpSeOI4",
  authDomain: "queue3-1c1a4.firebaseapp.com",
  databaseURL: "https://queue3-1c1a4-default-rtdb.firebaseio.com",
  projectId: "queue3-1c1a4",
  storageBucket: "queue3-1c1a4.firebasestorage.app",
  messagingSenderId: "766611607574",
  appId: "1:766611607574:web:c0ee754f7324adc853a537",
  measurementId: "G-ZSZ13TYJQW"
};


// System Settings
const systemSettings = {
    centerName: "مركز الرعاية الصحية",
    screenCount: 5,
    screenPassword: "screen123",
    controlPassword: "control123",
    defaultClinics: [
        { name: "عيادة طب الأسرة", number: 1 },
        { name: "عيادة الباطنة", number: 2 },
        { name: "عيادة الأطفال", number: 3 },
        { name: "عيادة النساء", number: 4 },
        { name: "عيادة الجلدية", number: 5 }
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig, systemSettings };
}
