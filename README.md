# URL Shortening Service

This is a simple RESTful API that allows users to shorten long URLs. It provides endpoints to create, retrieve, update, delete, and get statistics for shortened URLs.

## Project URL

-   https://roadmap.sh/projects/url-shortening-service

## Tech Stack

-   Node.js (v19.9.0)
-   Express.js
-   PostgreSQL (for database)
-   Docker (for database container)

## Requirements

-   Node.js (v19.9.0)
-   Docker (for PostgreSQL)

## Features

-   **Create Short URL:** Shortens a given URL.
-   **Retrieve Original URL:** Retrieves the original URL from a short URL.
-   **Update Short URL:** Updates an existing short URL.
-   **Delete Short URL:** Deletes a short URL.
-   **Get URL Statistics:** Retrieves statistics about a short URL, including the number of times accessed.

## Setup

### Clone the Repository

Clone the project repository:

```bash
git clone https://github.com/yourusername/url-shortening-service.git
cd url-shortening-service
```

### Clone the `.env.template`

Clone the `.env.template` file to create your environment variables file:

```bash
cp .env.template .env
```

Make sure to update the `.env` file with your database configuration and any other necessary environment variables.

### Install Dependencies

Install the necessary Node.js dependencies:

```bash
npm install
```

### Docker Setup for PostgreSQL

Ensure that you have Docker installed. This project uses Docker to run PostgreSQL. Follow these steps to set up and run the database:

1. **Run the PostgreSQL Docker container:**

```bash
docker-compose up -d
```

This will start a PostgreSQL container as defined in the `docker-compose.yml` file.

2. **Database Migration:**

If you have a migration file (e.g., `migration.sql`), you can ignore it by adding it to `.gitignore` to avoid committing it to the repository. When you're ready to run the migrations, execute the following command to restore the database schema:

```bash
# Run migration commands here (for example, using Sequelize CLI)
npx sequelize-cli db:migrate
```

### Running the Application

Start the server:

```bash
npm start
```

This will run the URL shortening service locally.

## API Endpoints

### Create Short URL

**POST** `/shorten`

```json
{
	"url": "https://www.example.com/some/long/url"
}
```

Response:

```json
{
	"id": "1",
	"url": "https://www.example.com/some/long/url",
	"shortCode": "abc123",
	"createdAt": "2021-09-01T12:00:00Z",
	"updatedAt": "2021-09-01T12:00:00Z"
}
```

### Retrieve Original URL

**GET** `/shorten/:shortCode`

```json
{
	"id": "1",
	"url": "https://www.example.com/some/long/url",
	"shortCode": "abc123",
	"createdAt": "2021-09-01T12:00:00Z",
	"updatedAt": "2021-09-01T12:00:00Z"
}
```

### Update Short URL

**PUT** `/shorten/:shortCode`

```json
{
	"url": "https://www.example.com/some/updated/url"
}
```

Response:

```json
{
	"id": "1",
	"url": "https://www.example.com/some/updated/url",
	"shortCode": "abc123",
	"createdAt": "2021-09-01T12:00:00Z",
	"updatedAt": "2021-09-01T12:30:00Z"
}
```

### Delete Short URL

**DELETE** `/shorten/:shortCode`

Response:

```json
{
	"message": "URL deleted successfully"
}
```

### Get URL Statistics

**GET** `/shorten/:shortCode/stats`

```json
{
	"id": "1",
	"url": "https://www.example.com/some/long/url",
	"shortCode": "abc123",
	"createdAt": "2021-09-01T12:00:00Z",
	"updatedAt": "2021-09-01T12:00:00Z",
	"accessCount": 10
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
