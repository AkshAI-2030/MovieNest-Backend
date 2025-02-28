# ✨ MovieNest

MovieNest is a **movie curation app** that allows users to search for movies using the **TMDB API**, add them to a watchlist, wishlist, or curated lists, and provide reviews and ratings. Users can also sort, search by genre, actor, or director, and view top-rated movies. Built with **Express, Sequelize-ORM, and Supabase(PostgreSQL)**, it ensures a seamless movie discovery experience.

---

## 🚀 Live Demo

🔗 **Live URL**: [MovieNest](#)  
🔗 **API Documentation**: [Postman Collection](#)  

---

## ⚡ Features

👉 **Search Movies** using the TMDB API  
👉 **Add Movies to Watchlist, Wishlist & Curated Lists**  
👉 **Rate & Review Movies**  
👉 **Sort Movies** by popularity, rating, or release date  
👉 **Filter Movies** by genre, actor, or director  
👉 **View Top-Rated Movies**  
👉 **User-Friendly RESTful API** for smooth integration  
👉 **Secure & Scalable Architecture** with PostgreSQL  

---

## 🔥 API Endpoints

| Method  | Endpoint                                      | Description                                      |
|---------|----------------------------------------------|--------------------------------------------------|
| `GET`   | `/api/movies/search`                        | Search for movies                               |
| `POST`  | `/api/curated-lists`                        | Create a curated list                          |
| `PUT`   | `/api/curated-lists/:curatedListId`         | Update a curated list                          |
| `POST`  | `/api/movies/watchlist`                     | Add a movie to the watchlist                   |
| `POST`  | `/api/movies/wishlist`                      | Add a movie to the wishlist                    |
| `POST`  | `/api/movies/curated-list`                  | Add a movie to a curated list                  |
| `POST`  | `/api/movies/:movieId/reviews`              | Add a review and rating to a movie             |
| `POST`  | `/api/movies/searchByGenreAndActor`         | Search movies by genre and actor               |
| `GET`   | `/api/movies/sort`                          | Sort movies by rating or release year          |
| `GET`   | `/api/movies/top5`                          | Get the top 5 movies by rating                 |

---

## 💪 Sample API Responses

### 🎬 Search Movies (`GET /api/movies/search`)

<img width="978" alt="Image" src="https://github.com/user-attachments/assets/91baf8ce-accb-41df-b1a2-b8244b7bc296" />

---

### 📋 Create Curated List (`POST /api/curated-lists`)

<img width="973" alt="Image" src="https://github.com/user-attachments/assets/2112b5fe-caaa-43ff-b339-29a3829e1037" />

---

### 🎦 Add Movie to Watchlist (`POST /api/movies/watchlist`)

<img width="972" alt="Image" src="https://github.com/user-attachments/assets/2da36478-ac5c-4b91-a759-ad857e907663" />

---

### 💬 Add Review (`POST /api/movies/:movieId/reviews`)

<img width="968" alt="Image" src="https://github.com/user-attachments/assets/a00d1020-116c-4a30-97d7-9cee2fc43ca9" />

---

### 🌟 View Top-Rated Movies (`GET /api/movies/top5`)

<img width="983" alt="Image" src="https://github.com/user-attachments/assets/ad8462df-a36c-48fd-b3ae-eeec366ad471" />

---

## 🛠 Tech Stack

- **Backend**: Node, Express  
- **Database**: Supabase,PostgreSQL
- **ORM**: Sequelize
- **External API**: TMDB API  
- **Authentication**: JWT
- **Hosting**: Render

---

## 📉 Installation & Setup

Clone the repository:

```bash
git clone https://github.com/AkshAI-2030/MovieNest-Backend
cd MovieNest
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
node index.js
```

Run tests:

```bash
npm run test
```
---

## 🔧 Configuration

To run this project locally, create a `.env` file in the root directory and include the following environment variables:

```ini
# TMDB API Key (Required for movie search)
TMDB_API_KEY="your_tmdb_api_key"
TMDB_API_SECRET="your_tmdb_api_secret"

# Database Configuration (PostgreSQL)
DB_USER="your_db_user"
DB_PASSWORD="your_db_password"
DB_NAME="your_db_name"
DB_HOST="your_db_host"
DB_PORT=5432

# Server Configuration
PORT=3000
MICROSERVICE_BASE_URL="https://api.themoviedb.org"
```

## 📚 License

This project is licensed under the **MIT License**.

---

Feel free to contribute, report issues, or suggest improvements! 🚀

