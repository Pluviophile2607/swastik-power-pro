# Swastik Power Pro Private Limited
## Website Functionality Specification — Vibe-Coding Document

> **Date:** March 30, 2026
> **Purpose:** Complete functional blueprint for all pages, features, workflows, and user interactions.

---

## 1. Project Overview

A web platform for **Swastik Power Pro Private Limited** to manage Solar Home Installation requests submitted by registered local vendors on behalf of end consumers.

**Core Workflow:**
```
Consumer approaches Vendor
→ Vendor submits request on platform
→ Company reviews & processes
→ Installation executed
→ Vendor uploads invoice
→ Company verifies & pays vendor
```

**User Roles:**

| Role | Description |
|---|---|
| Vendor | Local authorized partner who submits consumer requests |
| Admin | Full platform control — approves vendors, manages requests, payments |
| Finance | Views invoices, processes payments, generates financial reports |
| Manager | Reviews projects, updates status, handles escalations |

---

## 2. Public Pages (No Login Required)

### 2.1 Home / Landing Page

**Hero Section**
- Company name and tagline
- Two prominent buttons: "Vendor Login" and "Register as Vendor"

**About Section**
- Company background and story
- Mission statement and Vision statement

**Services Section**
- Display all 11 services as individual cards:
  1. Proud Jeevan Mission — Government welfare program execution
  2. Green Energy & Solar Energy — Renewable energy solutions and installations
  3. Elevated Water Tanks — Water infrastructure development
  4. PPMS Building — Project management and construction
  5. Water Distribution Line — Water supply network infrastructure
  6. Solar Installation — Residential and commercial solar setup
  7. IT & HT Work — Electrical infrastructure and management
  8. Wind Power — Wind energy project development
  9. Water Tank Projects — Storage and distribution systems
  10. CHP (Combined Heat & Power) — Energy efficiency solutions
  11. Pump House — Water pumping and circulation systems

**Proud Jeevan Mission Highlight**
- Dedicated section with key initiative details and green energy goals

**Leadership Section**
- Cards for each leadership team member: name, role, contact

**Testimonials / Case Studies**
- Carousel or grid of completed project highlights and client feedback

**Contact Section**
- Company address, phone, email
- Embedded map
- Contact enquiry form: Name, Phone, Message → sends email to company

**Footer**
- All page links, social media links, copyright notice

---

### 2.2 Login Page

- Email and password fields
- "Forgot Password" link
- Link to registration page
- On successful login, redirect by role:
  - Vendor → Vendor Dashboard
  - Admin / Manager / Finance → Admin Dashboard

---

### 2.3 Vendor Registration — Multi-Step Form (5 Steps)

Progress bar shows current step. Data is held across steps. Submitted only at Step 5.

**Step 1 — Account Creation**
- Full Name
- Email Address + OTP verification before proceeding
- Password + Confirm Password
- Phone Number

**Step 2 — Company Details**
- Company Name
- GST Number (validate Indian GST format)
- Company Registration Number
- Years of Experience
- Service Areas (multi-select cities/districts)
- Certifications (add multiple as tags)

**Step 3 — Bank Details**
- Account Holder Name (as per bank records)
- Bank Account Number + Confirm Account Number (must match)
- IFSC Code → auto-fetch and display Bank Name and Branch
- Account Type: Current / Savings
- Aadhar Number (optional)
- PAN Number (mandatory)

**Step 4 — Document Upload**
- Business Registration Certificate
- Tax Document / GST Certificate
- ID Proof (Aadhar / Passport / Driving License)
- Insurance Certificate
- Bank Passbook or Cancelled Cheque
- Beneficiary Photo ID
- Each upload shows filename and size; remove/re-upload option per file

**Step 5 — Terms & Agreement**
- Full scrollable Terms & Conditions text
- Checkbox: "I agree to all terms and conditions"
- Checkbox: "I confirm all uploaded documents are authentic"
- Submit button (disabled until both boxes checked)

**After Submission:**
- Success screen: "Registration submitted. Awaiting admin approval."
- Confirmation email sent to vendor
- Admin receives internal notification about new pending registration

---

### 2.4 Forgot Password

- Enter registered email → OTP sent
- Enter OTP → set new password + confirm → redirect to login

---

### 2.5 Email Verification

- Auto-verify when vendor lands from email link
- Show success message → redirect to login

---

## 3. Vendor Portal (Vendor Role Only)

### 3.1 Vendor Dashboard

**Summary Cards:**
- Total Requests Submitted
- Requests In Progress
- Requests Completed
- Invoices Pending Approval
- Total Payments Received (INR)

**Vendor License Card (prominent):**
- License ID (e.g. SPPL-VND-2026-00042)
- Issue Date and Expiry Date
- Status badge: Active / Suspended
- "Download License as PDF" button

**Quick Actions:**
- Submit New Solar Request
- Upload Invoice
- View Notifications

**Recent Activity Feed:**
- Last 10 events: request status changes, invoice updates, payments
- Each shows: event type, description, time ago

---

### 3.2 Vendor Profile Page

**Sections (view + edit):**
- Personal: Name, Phone, Alternate Phone (email read-only)
- Company: Company Name, GST, Reg Number, Experience, Service Areas, Certifications
- Bank Details: Account Holder Name, Account Number (masked), IFSC, Bank, Branch, Account Type, PAN, Aadhar

**Edit behaviour:**
- "Edit" button enables a section for editing
- Save and Cancel appear
- Bank detail changes require re-upload of bank proof
- Changes to GST or bank account flagged for admin re-verification

**Documents Section:**
- List of all uploaded documents with upload date
- View button (opens file) + Re-upload button per document

---

### 3.3 Submit Solar Request Form

Supports single or multiple consumer submissions in one session.

**Section A — Consumer Information**
- Consumer Full Name (required)
- Consumer Phone Number (required, 10-digit)
- Consumer Email (optional)
- Address Line 1 (required), Address Line 2 (optional)
- City/Town, State (all Indian states dropdown), PIN Code (required)

**Section B — Property Details**
- Roof Type: Flat RCC / Sloped RCC / Sheet Roof / Terrace
- Available Roof Space in sq. ft.
- Building Age in years
- Ownership Type: Own / Rented / Government

**Section C — Energy Requirements**
- Current Monthly Electricity Bill (INR)
- Desired Solar Capacity: 1kW / 2kW / 3kW / 5kW / 10kW / Custom
  - If Custom: text field for value
- Budget Constraint (INR, optional)
- Preferred Timeline: ASAP / Within 1 Month / 1–3 Months / Flexible

**Section D — Additional Information**
- Special Requirements (text area, optional)
- Consumer KYC Document — Aadhar / Voter ID (optional file upload)
- Property Photo (optional image upload, shows preview thumbnail)

**Bulk Submission:**
- "Add Another Consumer" button adds a new form instance numbered Consumer 1, 2, 3...
- Each consumer form is collapsible by clicking its header
- Remove button on every consumer except the first
- Counter shows: "X consumer requests ready to submit"
- "Submit All (X)" submits everything at once
- On success: table of generated Request Codes for all consumers submitted

---

### 3.4 My Requests (List)

**Table columns:**
- Request Code, Consumer Name, City/State, Capacity (kW), Submitted Date, Status badge, View button

**Filters:**
- Search by Request Code or Consumer Name
- Filter by Status (all 13 stages)
- Filter by Date Range
- Filter by State

- 20 requests per page
- Export filtered list as CSV

---

### 3.5 Request Detail + Timeline Tracker

**Cards displayed:**
- Consumer Info: Name, Phone, Email, Address
- Property & Energy Info: all property and energy fields
- Documents: clickable View links for uploaded KYC and property photo

**Project Timeline — Vertical Stepper (13 stages):**

Each stage shows:
- Stage name and description
- Completed → green check + timestamp + admin note
- Active → pulsing blue indicator
- Upcoming → grey/locked

Extra info shown per stage when set by admin:
- Stage 4 (Site Survey Scheduled): survey date, time, engineer name
- Stage 7 (Quotation Generated): quotation amount
- Stage 8 (Purchase Order Issued): PO number

**All 13 Stages:**
1. Form Submitted
2. Under Review
3. Approved
4. Site Survey Scheduled
5. Site Survey Completed
6. Design Prepared
7. Quotation Generated
8. Purchase Order Issued
9. Materials Procured
10. Installation In Progress
11. Installation Completed
12. Inspection & Commissioning
13. Completed ✅

**Invoice Section (bottom of page):**
- "Upload Invoice" button appears only when stage is 11 (Installation Completed) or later
- List of all invoices linked to this request: Invoice #, Amount, Status, Date, View

---

### 3.6 Invoice Management

**Invoice List Page — Table columns:**
- Invoice Number, Request Code, Consumer Name, Amount (INR), Upload Date, Status badge, View / Download

Status options: Uploaded / Under Review / Approved / Rejected / Paid

Filters: Invoice Number or Request Code search, Status filter, Date Range filter

**Upload Invoice Page:**
- Select linked Solar Request (only requests at stage 11+)
- Invoice Number (unique)
- Invoice Date
- Invoice Amount (before GST)
- GST Amount
- Total Amount (auto-calculated)
- Upload invoice file (PDF or image) with preview
- Submit

**Invoice Detail Page:**
- Full invoice info + file preview
- Status change history (date, who changed)
- If Rejected: red banner with rejection reason
- If Paid: payment details — date, transaction reference, mode, amount

---

### 3.7 Payment History

**Summary:** Total Amount Received (INR), total number of payments

**Table:** Payment Date, Invoice #, Request Code, Amount, Transaction Reference, Mode (NEFT/RTGS/IMPS), Status

Filters: Date range, Status

Export: CSV and PDF

---

### 3.8 Notifications

**Header bell icon** with unread count badge

**Dropdown preview:** top 5 latest — icon, title, short message, time ago + "View All" link

**Full Notifications Page:**
- All notifications newest first
- Each: type icon, title, full message, date/time, read/unread dot
- Click → marks read + navigates to related page
- "Mark All as Read" button
- Filter: All / Unread / by Type (Status Update / Payment / Document / General)

**Notification triggers:**

| Trigger | Message shown |
|---|---|
| Request status updated | "Your request [Code] moved to [Stage]" |
| Invoice approved | "Invoice [#] has been approved" |
| Invoice rejected | "Invoice [#] was rejected — [reason]" |
| Payment initiated | "Payment of ₹[amount] for Invoice [#] initiated" |
| Payment completed | "₹[amount] credited to your account" |
| Vendor approved | "Registration approved. License ID: [ID]" |
| Vendor rejected | "Registration not approved — [reason]" |
| General broadcast | Custom title and message from admin |

---

## 4. Admin Panel (Admin / Manager / Finance Roles)

### 4.1 Admin Dashboard

**KPI Cards:**
- Total Vendors: Pending / Approved / Suspended counts
- Total Solar Requests: New / In Progress / Completed counts
- Invoices Pending Approval
- Payments Processed This Month (INR)
- Projects Completed This Month

**Charts:**
- Monthly solar requests submitted (bar chart, last 12 months)
- Requests by current status (pie chart)
- Vendor registrations over time (line chart)

**Quick Actions:** Review Pending Vendors, Review Pending Invoices, View All Requests

---

### 4.2 Vendor Management (Admin Only)

**Pending Vendors Page:**
- Table: Vendor Name, Company, GST, Phone, Registered Date
- Actions per row: View Profile / Approve / Reject
- Badge showing count of pending registrations

**All Vendors Page:**
- Columns: License ID, Name, Company, Phone, Service Areas, Registration Date, Status badge, Actions (View / Suspend / Revoke)
- Search by name, company, license ID, phone
- Filter by Status, Service Area, Registration Date range
- Export as CSV

**Vendor Detail Page (Admin):**
- Full read-only profile
- Document list with View button per file
- Bank details section
- License section (ID, issue date, expiry)
- Status change history log

**Approve:**
- Confirmation dialog
- System generates License ID: `SPPL-VND-YYYY-XXXXX`
- License issue date = today; expiry set per policy
- Approval email sent to vendor with License ID and login link
- In-app notification sent to vendor

**Reject:**
- Dialog: enter rejection reason (required)
- Rejection email + in-app notification sent to vendor

**Suspend:**
- Dialog: enter suspension reason
- Vendor login blocked while suspended
- Suspension email + notification sent

**Revoke License:**
- Confirmation with reason
- License marked revoked, vendor account deactivated

---

### 4.3 Solar Request Management (Admin + Manager)

**All Requests Page:**
- Columns: Request Code, Consumer Name, Consumer Phone, City/State, Capacity, Vendor Name, Submitted Date, Status, View
- Search: Request Code, Consumer Name, Vendor Name
- Filters: Status, State, Date Range, Capacity Range
- Export as CSV

**Request Detail Page (Admin):**
- Consumer info card
- Property & energy info card
- Vendor info card (link to vendor profile)
- Consumer documents with View button
- Full 13-stage timeline (same visual as vendor side)

**Admin Action Panel (right side):**
- "Update Status" dropdown → select new stage
- Note field: optional admin note for this stage
- Confirm saves: new status + note + timestamp + admin name

- Extra fields by stage:
  - Stage 4: Survey Date, Survey Time, Engineer Name
  - Stage 7: Quotation Amount (INR)
  - Stage 8: Purchase Order Number
  - Stage 6: Upload design document file
- All changes visible to vendor in their timeline

---

### 4.4 Invoice Management (Admin + Finance)

**Pending Invoices Page:**
- Columns: Invoice #, Vendor Name, Request Code, Amount, Upload Date, Actions (View / Approve / Reject)

**Invoice Detail Page (Admin):**
- Invoice file preview (PDF or image viewer)
- Invoice info + linked request summary
- Vendor bank details shown (for reference)
- Approve → invoice moves to payment queue + vendor notified
- Reject → dialog for reason → vendor notified

**All Invoices Page:**
- Full list filterable by status, vendor, date range
- Summary row: total approved, pending, paid amounts

---

### 4.5 Payment Processing (Finance Only)

**Payment Queue Page:**
- Approved invoices awaiting payment
- Columns: Vendor Name, Invoice #, Amount, Account Number, IFSC
- Checkbox to select multiple for batch payment
- "Initiate Payment" button

**Initiate Payment Dialog:**
- Lists selected invoices and total
- Payment Date, Transaction Reference Number, Payment Mode (NEFT / RTGS / IMPS)
- Confirm → marks each invoice Paid + creates payment record + notifies each vendor

**Payment History Page:**
- Full ledger: Payment Date, Vendor, Invoice #, Amount, Transaction Ref, Mode, Status
- Filters: Vendor, Date Range, Mode, Status
- Export: CSV and PDF

---

### 4.6 Reports & Analytics (Admin + Manager + Finance)

All reports have: Date Range filter, optional Vendor filter, optional State filter, Generate button, Download as PDF, Download as CSV.

**1. Vendor Performance Report**
- Requests submitted per vendor
- Completion rate per vendor
- Average completion time per vendor
- Rejection/cancellation count per vendor

**2. Project Status Report**
- Total requests per stage
- Average days spent per stage
- Requests overdue (stuck beyond expected days)

**3. Financial Summary Report**
- Invoice count and value: pending / approved / paid
- Monthly payment outflow

**4. Consumer Request Report**
- Requests by state and city
- Requests by capacity (kW)
- Requests by roof type
- Requests by timeline preference

**5. Timeline Efficiency Report**
- Average total days: Form Submitted → Completed
- Average days per stage
- On-time vs delayed projects

---

### 4.7 Communication Center (Admin Only)

**Send Notification Page:**
- Recipient: All Vendors / Specific Vendor (searchable) / By Service Area
- Type: General / Urgent
- Title (required) + Message body (required)
- Delivery Channels (checkboxes): In-App / Email / SMS
- Preview button → shows final notification appearance
- Send button

**Notification History:**
- Table: Date, Recipient, Title, Type, Channels, Sent By
- Click to view full message

---

## 5. Business Logic Rules

**Vendor Registration:**
- Login blocked until admin approves
- License ID auto-generated only on approval: `SPPL-VND-{YEAR}-{5-digit}` e.g. `SPPL-VND-2026-00042`
- Bank or GST changes trigger admin re-verification flag

**Solar Requests:**
- Request Code auto-generated: `SPPL-REQ-{YYYYMM}-{5-digit}` e.g. `SPPL-REQ-202603-00123`
- Only approved vendors can submit
- Bulk submissions each get unique codes
- Invoice upload available only at stage 11 (Installation Completed) or beyond

**Project Timeline:**
- Only Admin and Manager can update status
- Every update recorded: stage, note, timestamp, updated-by
- Vendor sees full history, cannot edit

**Invoices & Payments:**
- Invoice only uploadable by the vendor linked to that request
- Admin must approve before Finance can pay
- Payment terms: within 30 days of approval
- Paid records are locked (cannot be edited)

**Access Control:**
- Vendor: own data only
- Admin: full access
- Finance: invoices and payments only — no vendor approval, no status updates
- Manager: request status updates and viewing — no payments, no vendor approval

---

## 6. Form Validation Rules

| Field | Rule |
|---|---|
| Email | Valid format, unique in system |
| Password | Min 8 chars, 1 uppercase, 1 number, 1 special character |
| Phone | Exactly 10 digits |
| GST Number | 2 digits + 5 letters + 4 digits + 1 letter + 1 alphanumeric + Z + 1 alphanumeric |
| PAN Number | 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F) |
| IFSC Code | 4 letters + 0 + 6 alphanumeric |
| PIN Code | Exactly 6 digits |
| Bank Account | 9–18 digits; Confirm must match exactly |
| Aadhar | Exactly 12 digits (if provided) |
| File Uploads | PDF, JPG, JPEG, PNG only — max 10MB per file |
| All amount fields | Numeric, greater than 0 |
| Roof Space, Building Age, Capacity | Numeric, greater than 0 |

---

## 7. Email Notification Triggers

| Event | Recipient | Content |
|---|---|---|
| Vendor Registered | Vendor | Received, under review message |
| Vendor Approved | Vendor | License ID, login link |
| Vendor Rejected | Vendor | Rejection reason, reapply info |
| Vendor Suspended | Vendor | Suspension reason, contact info |
| New Vendor Pending | Admin | Alert with vendor name and review link |
| Request Submitted | Vendor | Request code(s) and summary |
| Request Status Updated | Vendor | New stage, admin note, link |
| Site Survey Scheduled | Vendor | Date, time, engineer name |
| Quotation Generated | Vendor | Quotation amount, link |
| Invoice Uploaded | Admin | Invoice details and review link |
| Invoice Approved | Vendor | Approved, payment within 30 days |
| Invoice Rejected | Vendor | Rejection reason, re-upload instructions |
| Payment Initiated | Vendor | Amount, transaction ref, credit date |
| Payment Completed | Vendor | Amount, transaction ID, date |
| General Broadcast | Selected Vendors | Custom title and message |

---

## 8. Page Access by Role

| Page | Vendor | Admin | Manager | Finance |
|---|---|---|---|---|
| Landing Page | ✅ | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ | ✅ |
| Vendor Registration | ✅ | — | — | — |
| Vendor Dashboard | ✅ | — | — | — |
| Vendor Profile | ✅ | — | — | — |
| Submit Solar Request | ✅ | — | — | — |
| My Requests (list) | ✅ | — | — | — |
| Request Detail + Timeline | ✅ | — | — | — |
| Upload Invoice | ✅ | — | — | — |
| Invoice List / Detail | ✅ | — | — | — |
| Payment History (vendor) | ✅ | — | — | — |
| Notifications (vendor) | ✅ | — | — | — |
| Admin Dashboard | — | ✅ | ✅ | ✅ |
| Vendor Management | — | ✅ | — | — |
| All Requests (admin) | — | ✅ | ✅ | — |
| Request Detail (admin) | — | ✅ | ✅ | — |
| Invoice Approval | — | ✅ | — | ✅ |
| Payment Processing | — | — | — | ✅ |
| Payment History (admin) | — | ✅ | — | ✅ |
| Reports | — | ✅ | ✅ | ✅ |
| Communication Center | — | ✅ | — | — |

---

*Document prepared for Swastik Power Pro Private Limited | March 30, 2026*
