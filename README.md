# Currency Converter (MEAN Stack)

A modern, mobile-first currency converter app using Angular, Express, and TypeScript. Supports all currencies from FreeCurrencyAPI, with conversion history and persistent storage.

---

## Features
- Convert between any supported currencies (live rates)
- Mobile-first, responsive UI (Angular Material + Bootstrap)
- Loader and error handling for all requests
- Conversion history with date/time, persisted in browser
- Secure backend proxy for API key
- Modern, beautiful UI with custom icons

---

## Tech Stack
- **Frontend:** Angular 17, Angular Material, Bootstrap, SCSS
- **Backend:** Node.js, Express, TypeScript, Axios
- **API:** [FreeCurrencyAPI](https://freecurrencyapi.com/docs/)

---

## Getting Started

### 1. Clone the Repository
```sh
git clone https://github.com/mahadhussaini/currency-converter-MEAN.git
cd full-stack-assessment-MEAN
```

### 2. Setup Backend
```sh
cd currency-converter-backend
npm install
# Create .env file with your API key:
echo CURRENCY_API_KEY=your_api_key_here > .env
npm run dev
```
- The backend runs on `http://localhost:3000`

### 3. Setup Frontend
```sh
cd ../currency-converter-frontend
npm install
npm start
```
- The frontend runs on `http://localhost:4200`
- Proxy is set up for `/api` requests to the backend

---

## Deployment
- Deploy backend and frontend separately (e.g., Vercel, Netlify, Heroku)
- Set `CURRENCY_API_KEY` as an environment variable in your backend deployment
- Update frontend API URLs if deploying to production domains

---

## License
MIT 
