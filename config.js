// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
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
