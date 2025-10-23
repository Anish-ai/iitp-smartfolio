# API Documentation - IITP SmartFolio

## Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

All API endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

The token is obtained from the IITP Auth Gateway after successful login.

---

## API Endpoints

### Profile

#### `GET /api/profile`
Get the authenticated user's profile.

**Response**: `200 OK`
```json
{
  "userId": "uuid",
  "email": "2101CS01@iitp.ac.in",
  "name": "John Doe",
  "rollNumber": "2101CS01",
  "admissionYear": 2021,
  "degree": "B.Tech",
  "branch": "CS",
  "phone": "+91 9876543210",
  "portfolioWebsite": "https://johndoe.com",
  "githubLink": "https://github.com/johndoe",
  "linkedinLink": "https://linkedin.com/in/johndoe",
  "photoURL": "https://...",
  "verified": true,
  "createdAt": "2025-10-23T...",
  "updatedAt": "2025-10-23T..."
}
```

#### `POST /api/profile`
Create a new profile (called automatically on first login).

**Request Body**:
```json
{
  "name": "John Doe",
  "rollNumber": "2101CS01",
  "admissionYear": 2021,
  "degree": "B.Tech",
  "branch": "CS",
  "phone": "+91 9876543210"
}
```

**Response**: `201 Created` or `409 Conflict` if profile already exists

#### `PUT /api/profile`
Update the user's profile.

**Request Body**: Partial profile object (only fields to update)

**Response**: `200 OK`

#### `DELETE /api/profile`
Delete the user's account and all related data.

**Response**: `200 OK`

---

### Projects

#### `GET /api/projects`
Get all projects for the authenticated user.

**Response**: `200 OK` - Array of projects

#### `POST /api/projects`
Create a new project.

**Request Body**:
```json
{
  "title": "Portfolio Website",
  "description": "A personal portfolio built with Next.js",
  "techStack": ["Next.js", "TypeScript", "Tailwind CSS"],
  "projectLink": "https://myportfolio.com",
  "githubRepo": "https://github.com/user/portfolio",
  "startDate": "2024-01-01",
  "endDate": "2024-06-01"
}
```

**Response**: `201 Created`

#### `GET /api/projects/[id]`
Get a single project by ID.

**Response**: `200 OK`

#### `PUT /api/projects/[id]`
Update a project.

**Request Body**: Partial project object

**Response**: `200 OK`

#### `DELETE /api/projects/[id]`
Delete a project.

**Response**: `200 OK`

---

### Education

#### `GET /api/education`
Get all education records.

**Response**: `200 OK` - Array of education records

#### `POST /api/education`
Create a new education record.

**Request Body**:
```json
{
  "institute": "Indian Institute of Technology Patna",
  "degree": "B.Tech",
  "branch": "Computer Science and Engineering",
  "startYear": 2021,
  "endYear": 2025,
  "cgpaOrPercentage": 8.5
}
```

**Response**: `201 Created`

#### `GET /api/education/[id]`
#### `PUT /api/education/[id]`
#### `DELETE /api/education/[id]`

---

### Courses

#### `GET /api/courses`
Get all courses.

**Response**: `200 OK` - Array of courses

#### `POST /api/courses`
Create a new course.

**Request Body**:
```json
{
  "title": "Machine Learning Specialization",
  "provider": "Coursera",
  "certificateLink": "https://coursera.org/verify/...",
  "completionDate": "2024-03-15"
}
```

**Response**: `201 Created`

#### `GET /api/courses/[id]`
#### `PUT /api/courses/[id]`
#### `DELETE /api/courses/[id]`

---

### Achievements

#### `GET /api/achievements`
Get all achievements.

**Response**: `200 OK` - Array of achievements

#### `POST /api/achievements`
Create a new achievement.

**Request Body**:
```json
{
  "title": "Winner - Hackathon 2024",
  "description": "Won first prize in the national level hackathon",
  "date": "2024-05-20"
}
```

**Response**: `201 Created`

#### `GET /api/achievements/[id]`
#### `PUT /api/achievements/[id]`
#### `DELETE /api/achievements/[id]`

---

### Skills

#### `GET /api/skills`
Get all skill categories.

**Response**: `200 OK` - Array of skill categories

#### `POST /api/skills`
Create a new skill category.

**Request Body**:
```json
{
  "category": "Development",
  "skills": [
    { "name": "React", "level": "Advanced" },
    { "name": "Node.js", "level": "Intermediate" },
    { "name": "Python", "level": "Expert" }
  ]
}
```

**Skill Levels**: `Beginner`, `Intermediate`, `Advanced`, `Expert`

**Response**: `201 Created`

#### `GET /api/skills/[id]`
#### `PUT /api/skills/[id]`
#### `DELETE /api/skills/[id]`

---

### Positions of Responsibility

#### `GET /api/positions`
Get all positions.

**Response**: `200 OK` - Array of positions

#### `POST /api/positions`
Create a new position.

**Request Body**:
```json
{
  "title": "President",
  "organization": "Computer Science Society",
  "description": "Led a team of 50+ members...",
  "startDate": "2023-07-01",
  "endDate": "2024-06-30"
}
```

**Response**: `201 Created`

#### `GET /api/positions/[id]`
#### `PUT /api/positions/[id]`
#### `DELETE /api/positions/[id]`

---

### Certifications

#### `GET /api/certifications`
Get all certifications.

**Response**: `200 OK` - Array of certifications

#### `POST /api/certifications`
Create a new certification.

**Request Body**:
```json
{
  "title": "AWS Certified Solutions Architect",
  "description": "Professional level certification",
  "issuer": "Amazon Web Services",
  "issueDate": "2024-08-15",
  "certificateLink": "https://aws.amazon.com/verification/..."
}
```

**Response**: `201 Created`

#### `GET /api/certifications/[id]`
#### `PUT /api/certifications/[id]`
#### `DELETE /api/certifications/[id]`

---

## Error Responses

### `401 Unauthorized`
```json
{
  "error": "Missing or invalid Authorization header"
}
```

### `403 Forbidden`
```json
{
  "error": "You do not have permission to access this resource"
}
```

### `404 Not Found`
```json
{
  "error": "Resource not found"
}
```

### `400 Bad Request`
```json
{
  "error": "Missing required fields: title, description"
}
```

### `500 Internal Server Error`
```json
{
  "error": "Internal Server Error"
}
```

---

## Usage Example (JavaScript/TypeScript)

```typescript
// Get auth token from localStorage
const token = localStorage.getItem('sf_auth_token')

// Fetch user profile
const response = await fetch('/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

const profile = await response.json()

// Create a new project
const newProject = await fetch('/api/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'My Project',
    description: 'Project description',
    techStack: ['React', 'Node.js'],
    startDate: '2024-01-01'
  })
})

// Update a project
const updatedProject = await fetch(`/api/projects/${projectId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Updated Project Title'
  })
})

// Delete a project
await fetch(`/api/projects/${projectId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

---

## Security Notes

1. **Authentication**: All routes verify JWT tokens
2. **Authorization**: Users can only access/modify their own data
3. **Rate Limiting**: Consider implementing rate limiting in production
4. **HTTPS**: Always use HTTPS in production
5. **Input Validation**: All inputs are validated server-side
6. **SQL Injection**: Prevented by Prisma ORM parameterized queries

---

## Database Schema

All models have automatic `createdAt` and `updatedAt` timestamps.

Foreign key cascading: Deleting a profile will automatically delete all related records (projects, education, etc.).

---

## Testing the API

Use tools like:
- **Postman**: Import the endpoints and test
- **curl**: Command-line testing
- **Thunder Client**: VS Code extension
- **Insomnia**: API client

Example curl command:
```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
