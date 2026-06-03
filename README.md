# VisaAssistant 🛂

**A comprehensive visa preparation system for UK, Netherlands, and USA — supporting Visit, Student, and Work visa applications.**

VisaAssistant helps applicants prepare strong visa applications by collecting detailed personal, financial, educational, and travel information through an intelligent multi-step wizard, generating a personalized document checklist, and providing admin review with real-time feedback.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Multi-Step Wizard** | Separate screens per visa type (Visit/Student/Work) with adaptive questions |
| 🎓 **Student Visa** | University details, course info, IELTS/TOEFL scores, education history with marks |
| 💼 **Work Visa** | Job offer, experience, qualifications, certifications, contract details |
| 💰 **PKR Conversion** | Enter income/balance in PKR — auto-converts to USD/GBP/EUR using live rates (1$=280PKR, 1£=370PKR, 1€=330PKR) |
| 📋 **Document Checklist** | Checkboxes to confirm document availability — no uploads needed |
| 📤 **Submit for Review** | One-click submission triggers admin review workflow |
| 👨‍💼 **Admin Review** | Per-document verification (Verified/Needs Clarification/Missing) + overall review |
| 🔄 **Real-time Updates** | Polling system — user sees admin decisions (Ready/Needs Changes) instantly |
| 🏠 **Assets Tracking** | Own house, rental properties, businesses — generates relevant document requirements |
| ⚠️ **Rejection History** | Track previous visa rejections with "I Don't Know" option for reasons |
| 🧑‍🎓 **Education History** | Dynamic table for adding degrees, institutions, years, and marks/grades |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/visa-assistant.git
cd visa-assistant

# Install dependencies
npm install

# Set up the database
npx prisma db push

# Start the development server
npx next dev
```

The app will be available at **http://localhost:3000**.

## 🧭 User Guide

### 1. Create an Account
- Visit `/register`
- Enter your name, email, and password

### 2. Create a New Visa Case (Multi-Step Wizard)
Click **"+ New Case"** on the dashboard and go through the steps:

#### Step 1: Country
- Select **United Kingdom** 🇬🇧, **Netherlands** 🇳🇱, or **United States** 🇺🇸
- Exchange rate shown under each flag

#### Step 2: Visa Type
- **Visit / Tourism** — Tourism, family visits, business meetings
- **Student** — Study abroad, university programs
- **Work** — Employment, job transfer, work permit

#### Step 3: Personal Information
- Age, Marital Status (Single/Married/Divorced/Widowed), City
- **Assets**: Own house, rental properties, businesses (toggle switches)
- **Previous Visa Rejection**: Optional with reason dropdown ("I Don't Know" option)

#### Step 4: Financial & Employment
- Employment Type: Salaried / Business Owner / Student / Unemployed / Retired
- **Monthly Income (PKR)** — auto-converts to destination currency
- **Bank Balance (PKR)** — auto-converts to destination currency
- Bank Statement Status, Monthly Expenses

#### Step 5: Travel Details
- Travel History (None/Limited/Moderate/Extensive)
- Purpose of Visit

#### Step 6: Visa-Specific Details (shown based on visa type)

**Visit Visa:**
- Duration (days), Sponsor Name/Relation
- Return Ticket / Accommodation / Travel Insurance toggles

**Student Visa:**
- University Name, Country, Course Name, Course Level
- IELTS/TOEFL Scores, Tuition Fee, Scholarship Amount
- Financial Sponsor, Gap Years, Accommodation Plan
- **Education History** — Add multiple degrees with institution, year, marks

**Work Visa:**
- Company Name, Job Title, Contract Duration
- Years of Experience, Salary Offered (PKR)
- Highest Qualification, Professional Certifications
- Work Permit Sponsorship toggle

#### Step 7: Review & Submit
- Review all entered data across categories
- Click **"Create Case"** to submit

### 3. Complete Your Document Checklist
After creating the case, you'll land on the case detail page with:

- **Document Checklist** — Each required document shown with:
  - ✅ Checkbox — toggle "Have it" / "Need it"
  - 📝 Notes field — add comments about each document
  - Progress counter (e.g., "3/7 checked")
- Click **"📤 Submit for Admin Review"** when ready

### 4. Real-time Updates
Once submitted:
- 🔄 **"Under Review"** banner appears
- Every 8 seconds the page polls for updates
- ✅ **"Ready to Submit"** green banner appears instantly when admin approves
- ⚠️ **"Needs Changes"** banner shows if admin flags issues
- Admin comments and suggestions shown directly on your page

## 🔐 Admin Panel

The admin panel is accessible at **`/admin/login`**.

### Admin Credentials
```
Username: admin
Password: admin123
```

> ⚠️ The admin page is hidden from main navigation. Access directly at `/admin/login`.

### Admin Features
- **Dashboard** — Overview of all cases with stats
- **Case Review** — View complete applicant profile with all 40+ fields organized by category
- **Per-Document Verification** — Each checklist item has dropdown: Pending / ✅ Verified / ⚠️ Needs Clarification / ❌ Missing
- **Admin Notes** — Add notes per document visible to applicant
- **Overall Review** — Status (Approved/Flagged/Needs Changes), Severity (Info/Warning/Critical), Comments
- **Mark as Ready** — Toggle "Ready to Submit" flag — user sees it in real-time

## 💱 Currency Conversion

Users enter financial figures in PKR. The system converts automatically:

| Destination | Rate | Symbol |
|------------|------|--------|
| United Kingdom | 1 GBP = 370 PKR | £ |
| Netherlands | 1 EUR = 330 PKR | € |
| United States | 1 USD = 280 PKR | $ |

Live conversion shown as user types in the form. Data stored in USD equivalent in database.

## 🏗️ Architecture

```
visa-assistant/
├── prisma/              # Database schema & migrations
├── src/
│   ├── app/
│   │   ├── (auth)/      # Login, Register pages
│   │   ├── admin/       # Admin portal (password-protected)
│   │   ├── cases/       # Multi-step creation wizard + detail with checklist
│   │   ├── dashboard/   # User dashboard
│   │   └── api/         # REST API routes
│   ├── lib/             # Requirements engine, cost calculator, auth
│   └── types/           # TypeScript types & Zod schemas
└── public/uploads/      # Document file storage
```

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS with custom design system |
| Database | SQLite (via Prisma 6) |
| Auth | JWT tokens (httpOnly cookies) + Admin auth |
| Validation | Zod schemas |
| State | React hooks with polling for real-time updates |

## 🌐 API Reference

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/logout` | Logout user |
| POST | `/api/cases` | Create visa case |
| GET | `/api/cases` | List user's cases |
| GET | `/api/cases/[id]` | Get case detail with checklist |
| PUT | `/api/cases/[id]` | Update case |
| PATCH | `/api/cases/[id]` | Update case status (e.g., submit for review) |
| DELETE | `/api/cases/[id]` | Delete case |
| PUT | `/api/checklist` | User updates checklist item (hasDocument, notes) |
| POST | `/api/checklist` | Admin reviews checklist item (status, notes) |
| GET | `/api/checklist/[country]` | Get requirements & cost breakdown |
| POST | `/api/upload` | Upload document |
| GET | `/api/documents/[caseId]` | List case documents |
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/cases` | List all cases (admin) |
| GET | `/api/admin/cases/[id]` | Get case with full details (admin) |
| POST | `/api/admin/review` | Submit review (admin) |
| POST | `/api/admin/ready-to-submit` | Toggle ready-to-submit flag (admin) |
| GET | `/api/report/[caseId]` | Generate report |

## 📋 Database Models

### VisaCase — 60+ fields organized by category:
- **Common**: Country, Visa Type, Job Type, Status
- **Personal**: Age, Marital Status, City, Own House, Rental Properties, Businesses
- **Financial**: Income, Bank Balance, Bank Statement Status, Monthly Expenses
- **Travel**: Travel History, Purpose, Previous Visa Rejection (+ reasons)
- **Visit-specific**: Sponsor, Duration, Insurance, Accommodation, Return Ticket
- **Student-specific**: University, Course, Level, IELTS/TOEFL, Education History (JSON), Tuition, Scholarship, Gap Years, Student Loan
- **Work-specific**: Company, Job Title, Contract, Experience, Qualifications, Certifications, Salary, Work Permit Sponsorship

### DocumentChecklist — Per-item tracking:
- hasDocument (user), notes (user), adminStatus, adminNotes

### AdminReview — Overall review:
- Comment, Suggestions, Severity, Status, ReadyToSubmit flag

## 🛡️ Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens in httpOnly cookies (7-day expiry)
- Admin panel protected with separate auth flow
- Zod validation on all API inputs
- Checklist ownership verified against user ID

## 📝 License

MIT