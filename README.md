# FirstApp Node.js API

A simple HTTPS Node.js server application with RESTful API endpoints for user management.

## Features

- 🔐 HTTPS server with SSL certificates
- 🚀 RESTful API endpoints
- 👥 User management (CRUD operations)
- 🧪 Test suite included
- 📦 Build and deployment scripts
- 🔧 CORS support

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Home page with API documentation |
| GET | `/api/health` | Health check endpoint |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

## Prerequisites

- Node.js (v14.0.0 or higher)
- OpenSSL (for SSL certificate generation)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd devops2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Generate SSL certificates (if not already present):
   ```bash
   openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/C=US/ST=CA/L=San Francisco/O=MyOrg/CN=localhost"
   ```

## Usage

### Start the server
```bash
npm start
```

The server will start at `https://localhost:443/`

### Run tests
```bash
npm test
```

### Build the application
```bash
npm run build
```

This will create a `build` directory and generate `firstapp-build.zip`

### Clean build files
```bash
npm run build:clean
```

## API Examples

### Get all users
```bash
curl -k https://localhost:443/api/users
```

### Create a new user
```bash
curl -k -X POST https://localhost:443/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

### Update a user
```bash
curl -k -X PUT https://localhost:443/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Updated"}'
```

### Delete a user
```bash
curl -k -X DELETE https://localhost:443/api/users/1
```

### Health check
```bash
curl -k https://localhost:443/api/health
```

## Project Structure

```
devops2/
├── firstapp.node.js    # Main application file
├── package.json        # Project configuration and dependencies
├── cert.pem           # SSL certificate
├── key.pem            # SSL private key
├── test/
│   └── test.js        # Test suite
├── build/             # Build output directory (generated)
├── .gitignore         # Git ignore file
└── README.md          # Project documentation
```

## Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server
- `npm test` - Run the test suite
- `npm run build` - Build the application for deployment
- `npm run build:clean` - Clean build artifacts

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
