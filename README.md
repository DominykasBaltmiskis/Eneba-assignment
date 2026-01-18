# Eneba Assignment – Full Stack Web Application

The project uses a React frontend, a Node.js backend, an SQL database, and implements a live search feature matching the provided Eneba design.

Included content:
- FIFA 23
- Red Dead Redemption 2
- Split Fiction
- Elden Ring

---

## Run the Project Locally

Clone the repository and enter the project directory:

git clone https://github.com/DominykasBaltmiskis/Eneba-assignment.git
cd Eneba-assignment

Start the backend server:

cd ~/eneba-assignment/backend
npm install
npm run start

The backend will run on http://localhost:3001

Available backend endpoints:
GET /list
GET /list?search=<gamename>

Open a new terminal and start the frontend:

cd Eneba-assignment/frontend
npm install
npm run dev

The frontend will run on http://localhost:5173

Open this URL in your browser to use the application.

---

## Application Features

- Live search while typing
- Search works on both Home and Games pages
- Backend-powered search using /list?search=
- Eneba-style UI

---

## Author

Dominykas Baltmiškis  
