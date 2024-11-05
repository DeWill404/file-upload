# Container Setup

This project uses Docker Compose to manage a multi-container application. Below is a description of each service and how to set up the environment.

## Services

### Database

- **Image:** postgres
- **Ports:** 5432:5432
- **Volumes:** `db-data:/var/lib/postgresql/data/pgdata`
- **Environment File:** `.env`

### TUS

- **Build Context:** `./tus`
- **Ports:** 8080:8080
- **Volumes:** `tus-local-file-storage:/srv/tus-data`
- **Command:** `["-port=8080", "-hooks-dir=/srv/tus-hooks", "-upload-dir=/srv/tus-data"]`

### Backend

- **Build Context:** `./backend`
- **Ports:** 80:80
- **Depends On:** `database`, `tus`
- **Environment File:** `.env`

### Frontend

- **Build Context:** `./frontend`
- **Ports:** 3000:3000
- **Environment File:** `.env`
- **Environment Variables:**
  - `NEXT_PUBLIC_API_BACKEND_URL: ${BACKEND_URL}`
  - `NEXT_PUBLIC_API_FRONTEND_URL: ${FRONTEND_URL}`
  - `NEXT_PUBLIC_API_TUS_SERVER_PATH: ${TUS_SERVER_PATH}`
- **Depends On:** `backend`

## Volumes

- `db-data`
- `tus-local-file-storage`

## Setup Instructions

1. **Clone the repository:**

   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Create a `.env` file in the root directory and add the necessary environment variables:**

   ```
   TUS_SERVER_PATH=http://localhost:8080/files
   POSTGRES_PASSWORD=
   POSTGRES_USER=
   POSTGRES_DB=
   PGPORT=
   DATABASE_URL=
   SECRET_KEY=
   ALGORITHM=
   ACCESS_TOKEN_EXPIRE_MINUTES=
   BACKEND_URL=http://localhost:80
   FRONTEND_URL==http://localhost:3000
   ```

3. **Build and start the containers:**

   ```
   docker-compose up --build
   ```

4. **To configure cloud storeage services like S3, Minio**
   - Add following command under tus container in `docker-compose.yml`
   ```
   tus:
   build: ./tus
   ports:
     - 8080:8080
   volumes:
     - tus-local-file-storage:/srv/tus-data
   command:
     ["-port=8080", "-s3-bucket=<bucket>", "-s3-endpoint=<api>"]
   ```

- In this application I am using [TUS Protocol](https://tus.github.io/tusd/) to upload file in storage.
- It provides a layer of abstraction to upload files in chunk, allow user to pause them any time & resume it again.
- Postgres hold information of user & files and its upload status based on that user select files again to upload after closing the window.

A short demo of application
[![DEMO](https://cdn.loom.com/sessions/thumbnails/54c42ebb7526445e87c3dd4fad530955-1203772fc0015b14-full-play.gif)](https://www.loom.com/share/54c42ebb7526445e87c3dd4fad530955)
