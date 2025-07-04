# Talky - Modern Chat App

A full-stack chat application with a modern UI, built with React, Node.js, Express, and MongoDB.

## Features

- Real-time chat with Socket.io
- User authentication and avatars
- Responsive, glassmorphic UI
- Emoji support, message editing, and unsend

## Project Structure

- `public/` - Frontend (React)
- `server/` - Backend (Node.js/Express)

---

## 1. Environment Setup

### Frontend (.env)

Copy `.env.example` to `.env` in the `public/` folder and set your API URL:

```
REACT_APP_API_URL=http://localhost:5000
```

### Backend (.env)

Copy `.env.example` to `.env` in the `server/` folder and set your secrets:

```
MONGO_URL=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

---

## 2. Local Development

### Frontend

```
cd public
npm install
npm start
```

### Backend

```
cd server
npm install
npm run dev
```

---

## 3. Production Build & Deployment

### Frontend

```
cd public
npm run build
```

- Deploy the `build/` folder to your static hosting (Vercel, Netlify, etc.) or serve with Nginx/Apache.

### Backend

```
cd server
npm install --production
npm start
```

- Use a process manager like PM2 or Docker for production.

---

## 4. Docker Deployment

### Build and run both services:

```
docker-compose up --build
```

- Or use the provided Dockerfiles in `public/` and `server/` for separate containers.

---

## 5. Notes

- Ensure your MongoDB is accessible from your backend.
- Update CORS and environment variables for your production domain.
- For advanced deployment, see the Dockerfiles and adjust as needed.

---

## License

MIT
