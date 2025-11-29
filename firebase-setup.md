# Firebase Setup Documentation

## Firebase Configuration

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "queue-management-system")
4. Enable Google Analytics (optional)
5. Click "Create Project"

### 2. Enable Firebase Services

#### Authentication
1. Go to "Authentication" > "Get Started"
2. Enable "Email/Password" provider
3. Enable "Anonymous" provider (optional)

#### Realtime Database
1. Go to "Realtime Database" > "Create Database"
2. Choose "Start in test mode" (for development)
3. Select region (choose closest to your location)

#### Firestore Database
1. Go to "Firestore Database" > "Create Database"
2. Choose "Start in production mode" (recommended)
3. Select region (choose closest to your location)

### 3. Database Structure

#### Realtime Database Structure
```json
{
  "settings": {
    "centerName": "مركز الرعاية الصحية",
    "screenCount": 5,
    "screenPassword": "screen123",
    "controlPassword": "control123",
    "newsTicker": "أهلاً وسهلاً بكم في مركز الرعاية الصحية",
    "alertDuration": 5,
    "speechRate": 1,
    "audioPath": "./audio",
    "mediaPath": "./media",
    "instantPath": "./instant"
  },
  "screens": {
    "1": {
      "id": 1,
      "name": "شاشة 1",
      "password": "screen123",
      "isActive": true,
      "currentClinics": [1, 2, 3, 4],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "clinics": {
    "1": {
      "number": 1,
      "name": "عيادة طب الأسرة",
      "currentNumber": 0,
      "lastCalled": null,
      "isActive": true,
      "screenId": 1,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "calls": {
    "callId": {
      "type": "normal",
      "number": 25,
      "clinicId": 1,
      "clinicName": "عيادة طب الأسرة",
      "screenId": 1,
      "message": "على العميل رقم 25 التوجه إلى عيادة طب الأسرة",
      "timestamp": "2024-01-01T10:30:00.000Z"
    }
  }
}
```

#### Firestore Database Structure
```javascript
// Users Collection
collection("users").doc("userId").set({
  email: "admin@center.com",
  role: "admin", // admin, doctor, staff
  name: "مدير النظام",
  createdAt: new Date().toISOString()
});

// Doctors Collection
collection("doctors").doc("doctorId").set({
  doctorNumber: 1,
  name: "د. أحمد محمد",
  specialty: "طب أسرة",
  phone: "01234567890",
  nationalId: "12345678901234",
  email: "doctor@center.com",
  clinicId: 1,
  workingDays: ["sun", "mon", "tue", "wed", "thu"],
  shift: "morning", // morning, evening
  status: "active",
  createdAt: new Date().toISOString()
});

// Appointments Collection
collection("appointments").doc("appointmentId").set({
  fullName: "أحمد محمد",
  nationalId: "12345678901234",
  phoneNumber: "01234567890",
  email: "patient@example.com",
  clinicId: 1,
  clinicName: "عيادة طب الأسرة",
  date: "2024-01-15",
  time: "10:00",
  status: "confirmed", // pending, confirmed, completed, cancelled
  bookingNumber: "HC240115001",
  timestamp: new Date().toISOString()
});

// Consultations Collection
collection("consultations").doc("consultationId").set({
  patientId: "patientId",
  patientName: "أحمد خالد",
  specialty: "family",
  complaint: "صداع مستمر",
  symptoms: "أعاني من صداع مستمر منذ أسبوع",
  priority: "urgent", // urgent, normal
  status: "open", // open, closed
  doctorId: null,
  reply: null,
  timestamp: new Date().toISOString()
});
```

### 4. Firebase Security Rules

#### Realtime Database Rules
```json
{
  "rules": {
    "settings": {
      ".read": "auth != null && auth.token.admin === true",
      ".write": "auth != null && auth.token.admin === true"
    },
    "screens": {
      ".read": true,
      ".write": "auth != null && auth.token.admin === true"
    },
    "clinics": {
      ".read": true,
      ".write": "auth != null && (auth.token.admin === true || auth.token.doctor === true)"
    },
    "calls": {
      ".read": true,
      ".write": "auth != null && (auth.token.admin === true || auth.token.doctor === true)"
    },
    "attendance": {
      ".read": "auth != null && auth.token.admin === true",
      ".write": "auth != null && auth.token.doctor === true"
    },
    "transfers": {
      ".read": "auth != null && auth.token.admin === true",
      ".write": "auth != null && (auth.token.admin === true || auth.token.doctor === true)"
    },
    "emergencies": {
      ".read": true,
      ".write": "auth != null && (auth.token.admin === true || auth.token.doctor === true)"
    }
  }
}
```

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId || 
                     request.auth.token.admin == true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Doctors collection
    match /doctors/{doctorId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Appointments collection
    match /appointments/{appointmentId} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow create: if true; // Allow public booking
      allow update: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Consultations collection
    match /consultations/{consultationId} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow create: if true; // Allow public consultation requests
      allow update: if request.auth != null && 
                       (request.auth.token.admin == true || 
                        request.auth.token.doctor == true);
    }
    
    // Requests collection
    match /requests/{requestId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.doctorId || 
                     request.auth.token.admin == true;
      allow write: if request.auth != null && request.auth.token.doctor == true;
    }
  }
}
```

### 5. Configuration File

Create `config.js` file in your project root:

```javascript
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
```

### 6. Deployment to GitHub Pages

1. **Create GitHub Repository**
   - Create new repository on GitHub
   - Name it `queue-management-system`

2. **Upload Files**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/queue-management-system.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

4. **Access Your Site**
   - Your site will be available at: `https://YOUR_USERNAME.github.io/queue-management-system/`

### 7. Audio Files Structure

Create the following folder structure for audio files:

```
/audio/
  ├── ding.mp3
  ├── 1.mp3 ("على العميل رقم واحد")
  ├── 2.mp3 ("على العميل رقم اثنين")
  ├── ... (up to 200.mp3)
  └── clinic1.mp3 ("التوجه إلى عيادة طب الأسرة")
  └── clinic2.mp3 ("التوجه إلى عيادة الباطنة")
  └── ... (for each clinic)

/instant/
  ├── instant1.mp3 ("اهلا وهلا بكم فى المركز رجاء الانتظار بالاستراحه")
  └── instant2.mp3 ("جارى النداء على الطرف التالى")
  └── ... (other instant messages)

/media/
  ├── video1.mp4 (educational videos)
  ├── video2.mp4
  └── ... (other media content)
```

### 8. Environment Variables

For security, create `.env` file (not included in repository):

```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_DATABASE_URL=your_database_url
FIREBASE_PROJECT_ID=your_project_id
```

### 9. Important Notes

1. **Security**: Never expose your Firebase configuration in public repositories
2. **SSL**: GitHub Pages provides HTTPS by default
3. **CORS**: Firebase handles CORS automatically
4. **Performance**: Use Firebase CDN for better performance
5. **Backup**: Regular backup of database is recommended

### 10. Troubleshooting

#### Common Issues

1. **Authentication Errors**
   - Check if Email/Password provider is enabled
   - Verify Firebase configuration

2. **Database Permission Errors**
   - Check security rules
   - Ensure proper authentication

3. **CORS Errors**
   - Firebase handles this automatically
   - Check if domain is authorized in Firebase Console

4. **Deployment Issues**
   - Ensure all files are committed
   - Check GitHub Pages settings
   - Verify repository is public

### 11. Testing

Before deployment, test all features:

1. **Authentication**: Test admin and doctor login
2. **Queue Management**: Test number calling and display
3. **Printing**: Test ticket printing functionality
4. **Appointments**: Test booking system
5. **Consultations**: Test consultation workflow

### 12. Maintenance

Regular maintenance tasks:

1. **Database Cleanup**: Remove old data periodically
2. **Security Updates**: Keep Firebase SDK updated
3. **Performance Monitoring**: Monitor database usage
4. **Backup**: Regular database backups
5. **User Support**: Provide technical support

---

## Support

For technical support, contact:
- Email: support@healthsystem.com
- Phone: 0123456789
- Working Hours: 9 AM - 5 PM (Sunday - Thursday)