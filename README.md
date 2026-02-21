# Holy Care Dental CRM

Patient Management System for **Holy Care Dental & Orthodontic Clinic**

**Dr. Pinky Vijay MDS** | Orthodontics & Dentofacial Orthopedics | Reg. No: A-34195

---

## Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Admin Login

- **Username:** `admin`
- **Password:** `holycare2026`

To change the password, update the `ADMIN_PASSWORD` in the seed logic or add a new admin directly in the database.

---

## Features

### Patient Registration (Form 1)

- Full bilingual form (English + Tamil)
- Auto-generated OP No., Invoice No., X-ray ID No.
- 13 medical history conditions with Yes/No selection
- Touch-friendly signature capture
- Consent form with Tamil translation

### Treatment Records & Billing (Form 2)

- Dynamic table with add/remove rows
- Date picker, description, and amount fields
- Auto-calculated grand total
- Signature capture

### Admin Dashboard

- Search by name, OP number, or phone
- Date range filtering
- Patient list with total billing
- Quick actions: View details, Add treatment

### Printable Reports

- Professional A4 layout
- Complete patient registration details
- Medical history summary
- Treatment records with billing
- Print-optimized CSS (browser Print → Save as PDF)

---

## How to Use

### 1. In-Clinic Tablet Mode

Open this URL on the clinic tablet:

```
http://localhost:3000/register
```

- Patients fill the registration form on the tablet
- After submission, a "Thank you, please take a seat" message appears
- Form auto-resets after 5 seconds for the next patient

### 2. Remote Form (Share via WhatsApp/SMS)

1. Log in to the dashboard
2. Click **"Generate Shareable Link"**
3. Link is automatically copied to clipboard
4. Share via WhatsApp or SMS
5. Patient fills the form on their phone
6. Each link is single-use

### 3. Adding Treatment Records

1. From the dashboard, click **"+ Treatment"** next to a patient
2. Or from patient details, click **"Add New Treatment"**
3. Add treatment entries with date, description, and amount
4. Click **"Save Treatment Records"**

### 4. Viewing & Printing Reports

1. Open a patient's detail page
2. Click **"View Printable Report"**
3. A new tab opens with the formatted report
4. Click **"Print Report"** to print or save as PDF

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite (via better-sqlite3)
- **Authentication:** JWT (via jose)
- **Tamil Font:** Noto Sans Tamil (Google Fonts)

---

## Project Structure

```
holy-care-dental-crm/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Login/logout endpoints
│   │   │   ├── patients/     # Patient CRUD
│   │   │   ├── treatments/   # Treatment records
│   │   │   └── links/        # Shareable link generation
│   │   ├── dashboard/        # Admin dashboard pages
│   │   │   ├── patient/[id]/ # Patient detail view
│   │   │   └── treatment/    # Add treatment page
│   │   ├── login/            # Login page
│   │   ├── register/         # Patient registration
│   │   │   └── [token]/      # Remote registration
│   │   └── report/[id]/      # Printable report
│   ├── components/
│   │   ├── ClinicHeader.tsx   # Clinic branding header
│   │   ├── PatientForm.tsx    # Form 1 component
│   │   ├── TreatmentForm.tsx  # Form 2 component
│   │   └── SignatureCanvas.tsx # Touch-friendly signature
│   └── lib/
│       ├── auth.ts            # JWT & password utilities
│       └── db.ts              # SQLite database setup
├── data/                      # SQLite database file
├── .env.local                 # Environment variables
└── package.json
```

---

## Database

### Tables

1. **patients** - Patient registration data, medical history, signatures
2. **treatments** - Treatment records linked to patients
3. **admin_users** - Admin login credentials
4. **registration_links** - Shareable link tokens

### Sample Data

The app comes pre-loaded with 3 sample patients:

1. **Rajesh Kumar** (OP-001) - Root canal treatment, diabetic
2. **Lakshmi Devi** (OP-002) - Orthodontic treatment, allergy & thyroid
3. **Mohammed Farooq** (OP-003) - Periodontal treatment, high BP & diabetes

### Database Backup

The SQLite database is stored at `data/holycare.db`. To backup:

```bash
cp data/holycare.db data/holycare-backup-$(date +%Y%m%d).db
```

---

## Environment Variables

```env
JWT_SECRET=your-secret-key-here
DATABASE_PATH=./data/holycare.db
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production, change `JWT_SECRET` to a strong random string and update `NEXT_PUBLIC_APP_URL` to your domain.

---

## Deployment

### Railway

1. Push code to a GitHub repository
2. Connect the repo to Railway
3. Add environment variables
4. Add a persistent volume mounted at `/app/data`
5. Deploy

### Render

1. Push code to a GitHub repository
2. Create a new Web Service on Render
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add a persistent disk mounted at `/app/data`
6. Add environment variables

### VPS (DigitalOcean, etc.)

```bash
git clone <your-repo>
cd holy-care-dental-crm
npm install
npm run build
npm start
```

> **Note:** SQLite requires a persistent filesystem. Vercel's serverless functions don't support persistent SQLite. Use Railway, Render, or a VPS for deployment.

---

## Adding New Admin Users

Currently, admin users are seeded in the database initialization. To add a new admin:

1. Open the SQLite database with any SQLite client
2. Or modify the seed function in `src/lib/db.ts`
3. Restart the application

---

## Changing Admin Password

1. Delete the existing database: `rm data/holycare.db`
2. Update the password in `src/lib/db.ts` (in the `initializeDatabase` function)
3. Restart the application (database will be recreated with new credentials)

Or use a SQLite client to update the `admin_users` table directly.
