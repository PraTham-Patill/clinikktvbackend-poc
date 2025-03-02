# Clinikk TV Backend Service Design

## High-Level Design (HLD)

### System Architecture
- API Gateway
- Media Service
- Metadata Database (MongoDB)
- File Storage (Local for POC, cloud for production)
- Authentication (Future)
- Streaming Service (Basic streaming, CDN for production)

### Scalability
- Stateless Media Service
- Sharded MongoDB
- Cloud storage

## Low-Level Design (LLD)

### API Endpoints
- POST /media: Upload media
- GET /media/{id}: Retrieve media
- GET /media: List media

### Database Schema
- Media collection with fields: _id, title, description, type, duration, uploadDate, filePath, mimetype

### Error Handling
- Validation for required fields
- HTTP status codes for errors

### Security
- Path validation
- Input sanitization
- Future authentication

## Known Issues
- **Vulnerability in `dicer`**: A high-severity issue exists in `dicer` (via `busboy` and `multer`). No fix is available as of February 23, 2025. For production, consider replacing `multer` with an alternative like `express-fileupload`.