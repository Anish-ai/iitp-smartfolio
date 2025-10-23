# IITP SmartFolio - Development Roadmap & Technical Documentation

**Project**: SmartFolio - Professional Portfolio Platform for IIT Patna Students  
**Date**: October 23, 2025  
**Status**: Phase 1 Complete (Frontend + IITP Auth Gateway Integration)

---

## 📋 Table of Contents

1. [Current Status](#current-status)
2. [Pending Work](#pending-work)
3. [Database Schema](#database-schema)
4. [Implementation Plan](#implementation-plan)
5. [Technical Stack](#technical-stack)
6. [Security Considerations](#security-considerations)
7. [Development Guidelines](#development-guidelines)

---

## 🎯 Current Status

### ✅ Completed Features

- **Frontend Application**
  - Beautiful landing page with feature showcase
  - Dashboard with sidebar navigation
  - Portfolio management pages (Education, Projects, Skills, Achievements, Positions, Courses)
  - Profile management interface
  - Resume preview and template selection

- **Authentication System**
  - Integrated with IITP Auth Gateway (https://iitp-auth.vercel.app)
  - OTP-based authentication for @iitp.ac.in emails
  - JWT token handling
  - User session management via localStorage
  - Callback handling with Suspense boundary

- **Data Storage (Current)**
  - Client-side localStorage implementation
  - CRUD operations for all portfolio sections
  - Type-safe data structures

- **UI/UX**
  - Responsive design (mobile to desktop)
  - Dark mode support
  - Professional Radix UI components
  - Smooth animations and transitions

---

## 🚀 Pending Work

### 1. Database Integration with Neon + Prisma + PostgreSQL

**Objective**: Replace localStorage with a production-ready, real-time PostgreSQL database hosted on Neon.

**Key Tasks**:
- Set up Neon PostgreSQL database
- Configure Prisma ORM
- Create database schema matching current structure
- Implement real-time data synchronization
- Add database migration scripts
- Implement secure API routes for CRUD operations
- Add data validation and sanitization
- Implement error handling and rollback mechanisms

**Benefits**:
- Real-time data sync across devices
- Data persistence and reliability
- Better security and access control
- Scalability for multiple users
- Transaction support

---

### 2. Professional PDF Resume Generation

**Objective**: Generate high-quality, professional resumes in PDF format using JavaScript libraries.

**Key Tasks**:
- Implement PDF generation using modern JS libraries
- Create multiple professional resume templates
- Support customization (colors, fonts, sections)
- Enable download functionality
- Optimize for print quality (A4 size, proper margins)
- Add support for multiple resume formats
- Implement resume preview before download

**Recommended Libraries**:
- **@react-pdf/renderer** - React components for PDF generation
- **jsPDF** (already installed) - PDF creation
- **html2canvas** (already installed) - HTML to canvas conversion
- **pdfmake** - Alternative for more control

**Features to Include**:
- Multiple templates (Modern, Classic, ATS-friendly)
- Section toggling (show/hide sections)
- Color scheme customization
- Font selection
- Export as PDF or PNG
- QR code generation for portfolio link
- Print optimization

---

## 🗄️ Database Schema

### Detailed Schema Structure

#### 1. **profiles** Table
Primary user profile information extracted from IITP Auth Gateway.

```prisma
model Profile {
  userId            String   @id @default(uuid())
  azureOid          String?  @unique // For future Azure AD integration
  email             String   @unique
  name              String
  rollNumber        String?  // From IITP email
  admissionYear     Int?     // From IITP email
  degree            String?  // From IITP email (B.Tech, Dual Degree, etc.)
  branch            String?  // From IITP email (CS, MC, EE, etc.)
  phone             String?
  portfolioWebsite  String?
  githubLink        String?
  linkedinLink      String?
  photoURL          String?
  verified          Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  projects          Project[]
  education         Education[]
  courses           Course[]
  achievements      Achievement[]
  skills            Skill[]
  positions         PositionOfResponsibility[]
  certifications    Certification[]
  
  @@index([email])
  @@index([rollNumber])
}
```

**Notes**:
- `userId` is the primary identifier
- `azureOid` reserved for future Azure AD integration
- IITP-specific fields (rollNumber, admissionYear, degree, branch) populated from auth gateway
- All portfolio items linked via foreign keys

---

#### 2. **projects** Table
Technical projects and research work.

```prisma
model Project {
  projectId     String   @id @default(uuid())
  userId        String
  title         String
  description   String   @db.Text
  techStack     String[] // Array of technologies used
  projectLink   String?
  githubRepo    String?
  startDate     DateTime
  endDate       DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  profile       Profile  @relation(fields: [userId], references: [userId], onDelete: Cascade)
  
  @@index([userId])
  @@index([startDate])
}
```

**Validation Rules**:
- `title`: Required, max 200 characters
- `description`: Required, rich text support
- `techStack`: Array, min 1 item
- `startDate`: Must be valid date
- `endDate`: Optional, must be after startDate if provided

---

#### 3. **education** Table
Academic records and qualifications.

```prisma
model Education {
  eduId             String   @id @default(uuid())
  userId            String
  institute         String   // Default: "Indian Institute of Technology Patna"
  degree            String   // B.Tech, M.Tech, Dual Degree, PhD
  branch            String   // CS, MC, EE, EC, ME, CE, CH, MM, AI, DS
  startYear         Int
  endYear           Int?
  cgpaOrPercentage  Float
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  profile           Profile  @relation(fields: [userId], references: [userId], onDelete: Cascade)
  
  @@index([userId])
  @@index([startYear])
}
```

**Validation Rules**:
- `startYear`: Between 1950 and current year + 10
- `endYear`: Must be >= startYear
- `cgpaOrPercentage`: Between 0 and 10 (CGPA) or 0-100 (Percentage)

---

#### 4. **courses** Table
Online courses and certifications.

```prisma
model Course {
  courseId         String   @id @default(uuid())
  userId           String
  title            String
  provider         String   // Udemy, Coursera, edX, NPTEL, etc.
  certificateLink  String?
  completionDate   DateTime
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  
  // Relations
  profile          Profile  @relation(fields: [userId], references: [userId], onDelete: Cascade)
  
  @@index([userId])
  @@index([completionDate])
}
```

---

#### 5. **achievements** Table
Awards, recognitions, and accomplishments.

```prisma
model Achievement {
  achievementId  String   @id @default(uuid())
  userId         String
  title          String
  description    String   @db.Text
  date           DateTime
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  // Relations
  profile        Profile  @relation(fields: [userId], references: [userId], onDelete: Cascade)
  
  @@index([userId])
  @@index([date])
}
```

---

#### 6. **skills** Table
Technical and soft skills grouped by category.

```prisma
model Skill {
  skillId    String   @id @default(uuid())
  userId     String
  category   String   // "Development", "Databases", "AI/ML", "Tools", "Soft Skills"
  skills     Json     // [{ name: "React", level: "Intermediate" }, ...]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  // Relations
  profile    Profile  @relation(fields: [userId], references: [userId], onDelete: Cascade)
  
  @@index([userId])
  @@index([category])
}
```

**JSON Structure for skills field**:
```json
[
  { "name": "React", "level": "Expert" },
  { "name": "Node.js", "level": "Advanced" },
  { "name": "PostgreSQL", "level": "Intermediate" }
]
```

**Skill Levels**: Beginner, Intermediate, Advanced, Expert

---

#### 7. **positionsOfResponsibility** Table
Leadership roles and responsibilities.

```prisma
model PositionOfResponsibility {
  posId        String   @id @default(uuid())
  userId       String
  title        String
  organization String
  description  String?  @db.Text
  startDate    DateTime
  endDate      DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  // Relations
  profile      Profile  @relation(fields: [userId], references: [userId], onDelete: Cascade)
  
  @@index([userId])
  @@index([startDate])
}
```

---

#### 8. **certifications** Table
Professional certifications and credentials.

```prisma
model Certification {
  certId          String   @id @default(uuid())
  userId          String
  title           String
  description     String?  @db.Text
  issuer          String
  issueDate       DateTime
  certificateLink String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  profile         Profile  @relation(fields: [userId], references: [userId], onDelete: Cascade)
  
  @@index([userId])
  @@index([issueDate])
}
```

---

## 📐 Implementation Plan

### Phase 2: Database Integration (Estimated: 2-3 weeks)

#### Week 1: Setup & Schema
1. **Day 1-2**: Neon Database Setup
   - Create Neon account and project
   - Configure database connection
   - Set up environment variables
   - Test database connectivity

2. **Day 3-4**: Prisma Configuration
   - Install Prisma CLI and client
   - Create `schema.prisma` file with all models
   - Generate Prisma client
   - Create initial migration
   - Test migrations locally

3. **Day 5-7**: API Routes Development
   - Create Next.js API routes for each model
   - Implement CRUD operations
   - Add request validation using Zod
   - Implement error handling
   - Add authentication middleware

#### Week 2: Data Migration & Integration
1. **Day 1-3**: Data Migration
   - Create migration script from localStorage to DB
   - Test data migration with sample data
   - Implement rollback mechanism
   - Add data validation checks

2. **Day 4-5**: Frontend Integration
   - Replace localStorage calls with API calls
   - Update React hooks to use API endpoints
   - Implement loading states and error handling
   - Add optimistic updates

3. **Day 6-7**: Testing & Optimization
   - Test all CRUD operations
   - Add database indexes for performance
   - Implement caching strategy
   - Load testing and optimization

#### Week 3: Real-time & Security
1. **Day 1-2**: Real-time Features
   - Implement WebSocket or polling for real-time updates
   - Add optimistic UI updates
   - Handle concurrent edits

2. **Day 3-4**: Security Implementation
   - Add row-level security policies
   - Implement rate limiting
   - Add input sanitization
   - SQL injection prevention

3. **Day 5-7**: Final Testing & Documentation
   - End-to-end testing
   - Performance testing
   - Security audit
   - Update API documentation

---

### Phase 3: PDF Resume Generation (Estimated: 1-2 weeks)

#### Week 1: PDF Implementation
1. **Day 1-2**: Library Setup & Testing
   - Evaluate and choose PDF library
   - Set up development environment
   - Create proof of concept
   - Test rendering performance

2. **Day 3-4**: Template Development
   - Design 3-4 professional templates
   - Implement template components
   - Add section customization
   - Implement color schemes

3. **Day 5-7**: Features & Optimization
   - Add download functionality
   - Implement print optimization
   - Add template preview
   - QR code generation
   - Export to PNG/JPG

#### Week 2: Polish & Testing
1. **Day 1-3**: Advanced Features
   - Section toggling
   - Font customization
   - Multiple page support
   - ATS-friendly formatting

2. **Day 4-5**: Testing
   - Cross-browser testing
   - Print quality testing
   - Mobile responsiveness
   - Performance optimization

3. **Day 6-7**: Documentation & Deployment
   - User guide for resume generation
   - Template documentation
   - Deploy to production
   - Monitor performance

---

## 🛠️ Technical Stack

### Current Stack
- **Frontend**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Component Library**: Radix UI
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form + Zod
- **State Management**: SWR
- **Authentication**: IITP Auth Gateway (JWT-based)
- **Icons**: Lucide React
- **Charts**: Recharts
- **PDF Tools**: jsPDF, html2canvas

### To Be Added

#### Database Layer
- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: Prisma
- **Connection Pooling**: Built-in with Neon
- **Migration Tool**: Prisma Migrate

#### Backend/API
- **API Routes**: Next.js API Routes (serverless)
- **Validation**: Zod schemas
- **Authentication**: JWT verification middleware
- **Rate Limiting**: @upstash/ratelimit or vercel rate limiting

#### PDF Generation
- **Primary Library**: @react-pdf/renderer
- **Fallback**: jsPDF + html2canvas
- **QR Code**: qrcode.react

---

## 🔒 Security Considerations

### Database Security
1. **Row-Level Security (RLS)**
   - Users can only access their own data
   - Enforce `userId` matching in all queries
   - Admin role for future management features

2. **Connection Security**
   - Use connection pooling
   - Environment variable for connection string
   - SSL/TLS encryption enforced
   - No direct database access from client

3. **Input Validation**
   - Validate all inputs using Zod schemas
   - Sanitize HTML/text inputs
   - Prevent SQL injection via Prisma
   - Type checking with TypeScript

4. **API Security**
   - JWT token verification on all protected routes
   - Rate limiting per user/IP
   - CORS configuration
   - Request size limits

### Authentication Flow
1. User logs in via IITP Auth Gateway
2. Gateway returns signed JWT with user data
3. App stores JWT in localStorage
4. Every API request includes JWT in Authorization header
5. API route verifies JWT signature
6. Extract userId from token, not request body
7. Enforce userId matching in database queries

### Data Privacy
1. **GDPR Compliance**
   - User data export functionality
   - Account deletion option
   - Data retention policies

2. **Encryption**
   - Data in transit: HTTPS/TLS
   - Data at rest: Neon automatic encryption
   - Sensitive fields: Consider additional encryption

3. **Audit Logging**
   - Log authentication events
   - Track data modifications
   - Monitor suspicious activity

---

## 👥 Development Guidelines

### Git Workflow
```bash
# Feature branches
feature/database-integration
feature/pdf-generation

# Bug fixes
fix/authentication-callback

# Hotfixes
hotfix/security-patch
```

### Commit Messages
```
feat: Add Prisma schema for user profiles
fix: Resolve PDF generation margin issue
docs: Update database schema documentation
refactor: Optimize API route performance
test: Add unit tests for profile API
```

### Code Style
- Use TypeScript strict mode
- Follow Prettier configuration
- ESLint rules enforcement
- Component naming: PascalCase
- File naming: kebab-case
- API routes: RESTful conventions

### Testing Strategy
1. **Unit Tests**: Utility functions, helpers
2. **Integration Tests**: API routes
3. **E2E Tests**: Critical user flows
4. **Performance Tests**: Database queries, PDF generation

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Authentication
NEXT_PUBLIC_IITP_AUTH_GATEWAY="https://iitp-auth.vercel.app"
JWT_SECRET="..."

# Application
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# Optional
UPLOADTHING_SECRET="..." # For file uploads
RATE_LIMIT_TOKEN="..." # For rate limiting
```

---

## 📊 Database Migration Strategy

### From localStorage to PostgreSQL

#### Step 1: Parallel Running
- Keep localStorage as fallback
- Implement feature flag for database usage
- Test with small user group first

#### Step 2: Migration Script
```typescript
// Migration utility
async function migrateUserData(userId: string) {
  const localData = {
    profile: JSON.parse(localStorage.getItem('sf_table_profiles') || '[]'),
    projects: JSON.parse(localStorage.getItem('sf_table_projects') || '[]'),
    // ... other tables
  }
  
  // Validate data
  // Transform to Prisma format
  // Insert into database
  // Verify migration success
}
```

#### Step 3: Gradual Rollout
1. 10% of users (beta testers)
2. Monitor for issues
3. 50% of users
4. All users
5. Deprecate localStorage

---

## 🎨 PDF Resume Templates

### Template Categories

#### 1. Modern Template
- Clean design with accent colors
- Icon integration
- Two-column layout
- Best for: Tech roles, startups

#### 2. Classic Template
- Traditional format
- Black and white
- Single column
- Best for: Academia, research

#### 3. ATS-Friendly Template
- Simple formatting
- No graphics/images
- Clear section headers
- Best for: Job applications via portals

#### 4. Creative Template
- Unique layout
- Color accents
- Visual elements
- Best for: Design, marketing roles

### Template Features
- Section reordering (drag & drop)
- Show/hide sections
- Color scheme picker (5-6 options)
- Font selection (3-4 professional fonts)
- Spacing adjustment
- Page break control

---

## 📝 API Endpoints Documentation

### Authentication Required: Yes (All routes)
Header: `Authorization: Bearer <JWT_TOKEN>`

### Profile Endpoints
```
GET    /api/profile          - Get user profile
PUT    /api/profile          - Update profile
DELETE /api/profile          - Delete account
```

### Projects Endpoints
```
GET    /api/projects         - Get all projects
POST   /api/projects         - Create project
GET    /api/projects/[id]    - Get single project
PUT    /api/projects/[id]    - Update project
DELETE /api/projects/[id]    - Delete project
```

### Education Endpoints
```
GET    /api/education        - Get all education records
POST   /api/education        - Create education record
PUT    /api/education/[id]   - Update education record
DELETE /api/education/[id]   - Delete education record
```

### Similar patterns for:
- `/api/courses`
- `/api/achievements`
- `/api/skills`
- `/api/positions`
- `/api/certifications`

### Resume Endpoints
```
POST   /api/resume/generate  - Generate PDF resume
GET    /api/resume/preview   - Get resume preview
GET    /api/resume/templates - List available templates
```

---

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Build passes without errors
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance optimization done

### Production Environment
- [ ] Neon database provisioned
- [ ] Connection pooling configured
- [ ] CDN for static assets
- [ ] Error monitoring (Sentry)
- [ ] Analytics setup
- [ ] Backup strategy in place

### Post-deployment
- [ ] Smoke tests
- [ ] Monitor error rates
- [ ] Check database performance
- [ ] Verify authentication flow
- [ ] Test PDF generation
- [ ] Monitor user feedback

---

## 📈 Performance Targets

### Database
- Query response time: < 100ms (p95)
- Connection pool: 10-20 connections
- Index coverage: > 90%

### API
- Response time: < 200ms (p95)
- Rate limit: 100 req/min per user
- Concurrent users: 1000+

### PDF Generation
- Generation time: < 3 seconds
- File size: < 500KB
- Quality: 300 DPI

### Frontend
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

---

## 🆘 Support & Resources

### Documentation Links
- [Prisma Docs](https://www.prisma.io/docs)
- [Neon Docs](https://neon.tech/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [@react-pdf/renderer](https://react-pdf.org/)

### Team Contacts
- **Tech Lead**: [Your name]
- **Backend**: [Team member]
- **Frontend**: [Team member]
- **DevOps**: [Team member]

### Issue Tracking
- GitHub Issues for bug tracking
- GitHub Projects for sprint planning
- Slack/Discord for real-time communication

---

## 📅 Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Phase 1 (✅ Complete) | 2 weeks | Frontend + Auth Integration |
| Phase 2 | 2-3 weeks | Database Integration |
| Phase 3 | 1-2 weeks | PDF Generation |
| Testing & QA | 1 week | Production Ready |
| **Total** | **6-8 weeks** | Full Launch |

---

## 🎯 Success Metrics

### User Metrics
- User registration rate
- Profile completion rate
- Resume generation count
- User retention rate

### Technical Metrics
- API uptime: > 99.9%
- Error rate: < 0.1%
- Database query performance
- PDF generation success rate

### Business Metrics
- Active users (daily/monthly)
- Feature adoption rate
- User satisfaction score
- Support ticket volume

---

**Document Version**: 1.0  
**Last Updated**: October 23, 2025  
**Next Review**: After Phase 2 completion

---

## Notes for Team

1. **Priority**: Database integration should be prioritized as it's the foundation for all other features
2. **Testing**: Allocate sufficient time for testing, especially for data migration
3. **Documentation**: Keep API documentation updated as you implement
4. **Communication**: Daily standups to track progress and blockers
5. **Code Review**: All PRs require at least one approval
6. **Security**: Regular security audits, especially after database integration

Good luck with the development! 🚀
