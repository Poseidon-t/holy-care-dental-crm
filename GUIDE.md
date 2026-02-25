# Holy Care Dental & Orthodontic Clinic — Quick Guide

## Website

**Live URL:** https://patient-rejoicing-production-8ead.up.railway.app

A bilingual (English + Tamil) website for Holy Care Dental Clinic with two locations.

### What's on the website
- Hero section with both clinic locations
- Featured services: Orthodontics & Braces, Root Canal, Dental Implants & Crowns
- Additional services: Gum Treatments, Oral Surgery, Pediatric Dentistry, Cosmetic Dentistry, Full Mouth Rehab
- Google Reviews section (5.0 rating, 122+ reviews)
- Before & After smile transformations (4 real cases)
- Clinic gallery photos
- Contact details & hours for both locations

### Clinic Locations

| | Kavalkinaru (HQ) | Mumbai (Branch) |
|---|---|---|
| **Doctor** | Dr. Pinky Vijay MDS | Dr. Ruby |
| **Phone** | 079772 57779 | 086556 32732 |
| **Hours** | Mon-Fri: 10:30 AM - 1:30 PM, 5:30 - 8 PM; Sat: 10:30 AM - 1:30 PM | Mon-Sat: 9 AM - 9 PM |
| **Address** | Kavalkinaru Rd, Tamil Nadu 627105 | Shop 10, Nilkamal Society, Dharavi, Mumbai 400019 |

---

## Admin Dashboard

**Login URL:** https://patient-rejoicing-production-8ead.up.railway.app/login

**Credentials:**
- Username: `admin`
- Password: *(set via ADMIN_PASSWORD on Railway)*

### Dashboard Features
- **Patient List** — Search by name, OP number, or phone; filter by date range
- **Approval Status** — Green check (approved) / Amber clock (awaiting) next to each patient
- **Patient Details** — View full patient record, medical history, signatures, treatment records
- **Doctor Approval** — One-click "Approve & Sign" adds Dr. Pinky's signature to patient record
- **Treatment Tracking** — Add treatments with descriptions and billing amounts
- **Print/Export** — Generate printable A4 patient report
- **QR Code** — Generate a registration QR code to display in the clinic

---

## Patient Registration

Two ways patients can register:

### 1. In-Clinic (Tablet Mode)
- URL: `/register`
- Patient fills form on clinic tablet
- Auto-resets after submission (ready for next patient)

### 2. Remote (Shared Link)
- Admin generates a registration link/QR from the dashboard
- Share via WhatsApp or SMS
- Patient fills form on their own phone
- Link is single-use for security

### What the form collects
- Name, Age, Sex, Phone, Address, Occupation
- Chief Complaint
- Medical History (13 conditions with Yes/No)
- Previous Dental History, Diagnosis, Treatment Plan
- Patient consent (bilingual English + Tamil)
- Patient signature (drawn on screen)

---

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Database:** SQLite (persistent volume on Railway)
- **Hosting:** Railway
- **Languages:** TypeScript, Tailwind CSS
