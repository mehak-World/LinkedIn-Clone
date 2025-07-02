# 🔗 Linkify – AI-Integrated LinkedIn-Like Platform

[🌐 View Live Project](https://linkify-frontend.onrender.com/)

Linkify is a full-stack social media platform inspired by LinkedIn, enhanced with AI capabilities. Users can connect, post, chat, and generate content using AI—all in real-time.

---

## ✨ Features

- 🔍 **Smart Search**: Find people with auto-suggested search results based on user input.
- 🔐 **Secure Authentication**: Login with Google using OAuth.
- 👤 **Guest Mode**: Explore the platform without needing to log in.
- 📝 **Social Interaction**: Create and delete posts, update your profile (including profile and background images), and view personal activity.
- 🤝 **Networking**: Send and accept connection requests, and chat with your connections.
- 🤖 **AI Content Generator**: Generate posts and relevant images by entering keywords.
- 🔔 **Real-Time Notifications**: Get notified instantly when connection requests are sent or accepted, or when you receive messages.

---

## 🚀 Run Locally

### 📦 With Docker

1. In the `backend/` folder, create a `.env` file with the following:

   ```env
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_SECRET=your_secret
   MONGO_URL=your_mongo_url
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   

- Change the VITE_BACKEND_URL arg to http://localhost:3000 in docker-compose.yaml
- Then, you can run docker-compose build.
- Then, run docker-compose up

###  Without Docker
- Create a .env file in the backend folder and add credentials for your CLOUDINARY_API_KEY, CLOUDINARY_SECRET, MONGO_URL (mongo atlas url), JWT_SECRET, and GEMINI_API_KEY
- Create a .env file in the frontend folder with VITE_BACKEND_URL where your backend is running on localhost http://localhost:3000
- cd backend -> npm install -> nodemon app.js (or node app.js)
- cd "LinkedIn Clone" -> npm install -> npm run dev

### 📸 Screenshots

![image](https://github.com/user-attachments/assets/d9e6f8b2-1326-4a79-a1d1-59fe29f84f8e)

![image](https://github.com/user-attachments/assets/75429017-2ae7-4661-bc8c-7810f308bbad)

![image](https://github.com/user-attachments/assets/aba769fd-7252-4538-a8db-d4281ea60575)

![image](https://github.com/user-attachments/assets/f4b76193-b7ed-4d92-a571-f2114d86eb32)

![image](https://github.com/user-attachments/assets/7df2a097-0477-435c-ac98-22adb88ece93)

![image](https://github.com/user-attachments/assets/0550db31-66d3-4ce6-a7d7-cb715f2e6db2)

![image](https://github.com/user-attachments/assets/3faf101d-1f62-449e-8aba-e9af1b021c57)









  
