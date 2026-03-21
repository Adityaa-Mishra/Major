# MYHOME MISRTI 🚀

A full-stack web application designed to provide services through a user-friendly platform. The project includes authentication, session management, and file handling, making it suitable for real-world deployment.

---

## 📌 Features

* 🔐 User Authentication (Login/Register)
* 🧾 Session Management using Express Sessions
* 📁 File Upload support (via Multer)
* 🌐 REST API built with Express.js
* 🗄️ MongoDB Database Integration (Mongoose)
* 🔄 Full-stack structure (Frontend + Backend)
* 🚀 Deployment ready (Render compatible)

---

## 🛠️ Tech Stack

### Backend:

* Node.js
* Express.js
* MongoDB (Mongoose)
* bcrypt (Password hashing)
* express-session (Session handling)
* multer (File uploads)
* dotenv (Environment variables)

### Frontend:

* HTML / CSS / JavaScript 

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone <your-repo-link>
cd MYHOMEMISTRI
```

---

### 2. Backend Setup

```
cd backend
npm install
```

---

### 3. Create `.env` file inside backend

```
MONGODB_URL=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
PORT=5000
```

---

### 4. Run the server

```
npm start
```

Server will run on:

```
http://localhost:5000
```

---

## 🌍 Deployment

* Backend deployed on Render
* Make sure to:

  * Set environment variables on Render
  * Whitelist IP in MongoDB Atlas (`0.0.0.0/0`)
  * Encode special characters in DB password

---

## ⚠️ Known Issues / Notes

* MemoryStore warning in production (use MongoStore for scaling)
* Ensure MongoDB credentials are correct to avoid authentication errors

---

## 📈 Future Improvements

* 🔄 Replace MemoryStore with persistent session store
* 📱 Convert into mobile app / PWA
* 🎨 Improve frontend UI/UX
* 🔔 Add notifications system

---

## 🤝 Contributing

Feel free to fork this repo and improve it. Pull requests are welcome.

---

## 📜 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

Developed by **Aditya Mishra**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
