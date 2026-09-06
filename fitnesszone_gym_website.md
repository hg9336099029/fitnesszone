# FitnessZone India — Full-Stack Gym Management Platform Build Prompt

## Objective

Build a production-ready full-stack web application for **FitnessZone**, an Indian gym/fitness business. The application should support both **administration/staff** and **gym members/customers**.

The current UI reference shows a clean, premium fitness-management dashboard with a strong navy, blue, orange, white, and light-gray visual system. Use the provided FitnessZone logo and screenshots as visual references, but improve the UX where appropriate.

This is not only a landing page. Build the foundation for a real gym-management product with authentication, member management, memberships, payments, goals, progress, schedules, and role-based access.

## Target Users and Roles

1. **Admin**
   - Full system access.
   - Register/manage staff and members.
   - Manage plans, memberships, payments, goals, schedules, and reports.
   - View business analytics.

2. **Staff**
   - Manage assigned members.
   - View/update member progress.
   - Manage attendance, goals, schedules, and relevant member information.
   - Limited administrative permissions.

3. **Customer / Member**
   - Sign up primarily using a mobile number.
   - Maintain a basic profile.
   - View membership and payment status.
   - Track fitness goals and progress.
   - View schedules/classes/trainers.
   - View personal dashboard.

## Authentication

### Admin / Staff

Admin should be able to create/register users with:
- Full name
- Mobile number
- Email
- Role
- Password
- Optional profile information

Implement secure authentication and role-based authorization.

### Customer Signup

Customer signup should be simple and mobile-first:
- Mobile number
- Name
- Basic profile details
- OTP-based verification can be added as the production-ready flow
- Do not require a complicated registration form

After successful signup, take the user to the member dashboard.

## Main Application Areas

### Public Website

Create a professional Indian gym website with:

- Home
- About
- Membership Plans
- Trainers
- Programs / Classes
- Facilities
- Testimonials
- Contact
- Login
- Join Now / Signup

The website should feel like a real Indian fitness brand rather than a generic template.

Include clear CTAs:
- Join Now
- View Membership Plans
- Book a Trial
- Contact Gym

Use INR (₹) wherever pricing is displayed.

## Admin Portal

### Admin Login
Route:
`/admin/login`

Create a polished login page matching the reference design.

### Admin Dashboard
Route:
`/admin/dashboard`

Show:
- Total members
- Active members
- Staff count
- Customer count
- Monthly revenue
- Membership renewals
- Attendance summary
- Sales performance
- Membership distribution
- Recent activity
- Important alerts

Use charts where they improve decision-making.

### Members
Route:
`/admin/members`

Features:
- Search by name, mobile number, member ID, or email
- Filter by membership level
- Filter by active/inactive status
- Add member
- Edit member
- View member
- Deactivate member
- Export member data

Member cards/table should show:
- Name
- Member ID
- Mobile
- Email
- Membership level
- Membership status
- Progress
- Renewal date

### Member Details
Route:
`/admin/members/:memberId`

Show:
- Personal information
- Membership details
- Payment history
- Attendance
- Fitness goals
- Progress
- Measurements
- Workout plan
- Assigned trainer
- Upcoming sessions
- Activity history

## Member Portal

### Member Home
Route:
`/member/home`

The member dashboard should include:

- Personalized greeting
- Membership level
- Membership expiry/renewal date
- Current progress
- Fitness goal
- Progress percentage
- Attendance streak
- Upcoming workout/class
- Assigned trainer
- Recent activity
- Monthly goal
- Achievement/badge section

Use the reference style of the dashboard:
- Strong navy hero/card
- Orange progress indicators
- Blue primary actions
- Clean white cards
- Rounded components
- Mobile-friendly bottom navigation

### Member Navigation

Desktop:
- Home
- My Goals
- Progress
- Schedule
- Profile

Mobile:
Use a bottom navigation bar with the most important sections.

## Membership System

Create configurable membership plans.

Example plans:
- Starter
- Builder
- Pro
- Elite

Do not hard-code the plans into the architecture. Admin should eventually be able to manage them.

Each plan can contain:
- Name
- Price in INR
- Duration
- Features
- Access level
- Personal training availability
- Class access
- Status

Example pricing can be based around realistic Indian gym pricing, but keep the values configurable.

## Payments

Design the system for Indian payments.

Track:
- Amount
- Currency
- Payment method
- Payment status
- Transaction ID
- Payment date
- Membership reference
- Customer reference

Use INR (₹).

For the architecture, keep payment integration replaceable so Razorpay/UPI/card/net-banking integration can be added cleanly later.

Do not expose secret payment credentials in frontend code.

## Goals and Progress

Members should be able to:
- Set fitness goals
- View goal progress
- Track weight
- Track body measurements
- Track workouts
- Track attendance
- View progress history

Admin/staff should be able to update relevant progress information according to permissions.

Use charts for progress when useful.

## Attendance

Include an attendance system with:
- Check-in
- Check-out
- Attendance history
- Daily attendance count
- Member attendance streak
- Monthly attendance analytics

Design the data model so QR-based check-in can be added later.

## Trainers

Create trainer profiles containing:
- Name
- Profile image
- Specialization
- Experience
- Certifications
- Availability
- Assigned members

Members should be able to see their assigned trainer.

## Schedule / Classes

Include:
- Class name
- Trainer
- Date
- Start time
- End time
- Capacity
- Available seats
- Location
- Status

Members should be able to view upcoming classes/sessions.

Design the system so class booking can be added cleanly.


## Trainer / Staff Customer Target and Monthly Performance Logic

Implement a monthly customer-acquisition target system for trainers/staff.

Each trainer can have an assigned monthly customer target.

### Target Rules

For example:

- Month 1 target = **1,000 customers**
- If the trainer completes exactly 1,000:
  - Month 2 target = **2,000 customers**
- If the trainer exceeds the target:
  - The extra customers achieved are carried forward as a reduction from the doubled target.
  - Month 2 target = `(previous target × 2) - previous month extra`

Example:

- Month 1 target = 1,000
- Month 1 achieved = 1,250
- Month 1 extra = 250
- Month 2 base target = 2,000
- Month 2 actual target = **2,000 - 250 = 1,750**

Display:
- Previous target: 1,000
- Previous achieved: 1,250
- Extra achieved: +250
- Next month base target: 2,000
- Next month adjusted target: **1,750**
- Current month progress: 0 / 1,750

The UI should make it immediately clear whether the trainer:
- Missed the target
- Exactly completed the target
- Exceeded the target

### Performance Calculation

For every trainer and month, store:

- Target
- Actual customers achieved
- Difference from target
- Achievement percentage
- Overachievement amount
- Month
- Trainer ID

Calculations:

`difference = achieved - target`

`achievement_percentage = (achieved / target) * 100`

`overachievement = max(achieved - target, 0)`

`remaining = max(target - achieved, 0)`

### Next-Month Target

The target progression should be configurable rather than hard-coded.

Default business rule:

`base_next_month_target = previous_month_target * 2`

`overachievement = max(previous_month_achieved - previous_month_target, 0)`

`next_month_target = base_next_month_target - overachievement`

Example:

- Month 1 target = 1,000
- Month 1 achieved = 1,250
- Extra = 250
- Month 2 base target = 2,000
- Month 2 adjusted target = **1,750**

If Month 2 target is 1,750 and the trainer achieves 2,000:

- Month 2 extra = 250
- Month 3 base target = 3,500
- Month 3 adjusted target = **3,250**

The target calculation should be implemented in the Django backend service/business-logic layer so it remains easy to change later.

Do not calculate this only in the frontend. The Django backend must be the source of truth for target calculations.

### Trainer Dashboard

Add a trainer performance section showing:

- Current month target
- Customers achieved
- Remaining customers
- Achievement percentage
- Extra customers achieved
- Previous month target
- Previous month achievement
- Next month target
- Target progression
- Monthly performance history

Use visual progress bars and charts where useful.

Example status messages:

- `72% of target completed`
- `280 customers remaining`
- `Target achieved`
- `+250 customers above target`
- `Next month target: 2,000`

### Admin Controls

Admins should be able to:

- Assign a target to a trainer
- Set the starting target
- View monthly targets
- View actual customer acquisition
- View overachievement
- Override the automatically calculated target when necessary
- See target history
- Compare trainer performance
- View top-performing trainers

Any manual target override should be recorded with:
- Admin/user who changed it
- Previous target
- New target
- Reason
- Timestamp

### Target History

Never overwrite historical monthly targets.

Store each month's target and actual achievement as a separate performance record so the system can show historical progression.

Example:

| Month | Target | Achieved | Extra | Achievement |
|---|---:|---:|---:|---:|
| Month 1 | 1,000 | 1,250 | +250 | 125% |
| Month 2 | 1,750 | 2,000 | +250 | 114.3% |
| Month 3 | 3,250 | 3,000 | 0 | 92.3% |

This historical data should be available to both the admin analytics dashboard and the trainer's performance view.

## Indian Context

The application is specifically intended for India.

Use:
- INR (₹)
- Indian mobile number format (+91)
- Indian date/time conventions where appropriate
- Indian payment concepts such as UPI
- Indian address fields
- Indian-style names/examples where appropriate

Avoid making the UI feel like a US-only SaaS product.

## Visual Design

Use the supplied FitnessZone logo as the primary brand asset.

Visual direction:
- Navy: primary dark brand color
- Blue: primary action color
- Orange: FitnessZone accent
- White/light gray: backgrounds
- Green: success/progress states
- Red: warnings/destructive states

Design characteristics:
- Premium
- Modern
- Athletic
- Clean
- Professional
- Responsive
- Strong typography
- Generous spacing
- Rounded cards
- Subtle shadows
- Clear hierarchy
- Accessible contrast

Avoid:
- Excessive gradients
- Overly flashy animations
- Generic template appearance
- Excessive glassmorphism
- Cluttered dashboards

## Responsive Design

The application must work well on:
- Desktop
- Laptop
- Tablet
- Mobile

Admin dashboard:
- Desktop sidebar
- Collapsible/mobile navigation

Member portal:
- Desktop navigation
- Mobile bottom navigation

Tables should become cards or horizontally scrollable layouts on small screens.

## Technical Architecture

Use a clean separation between frontend and backend.

### Frontend

Use:

- Next.js
- TypeScript
- Tailwind CSS
- Vanilla Tailwind CSS utilities and custom CSS only where necessary
- Next.js App Router
- Server Components by default where appropriate
- Client Components only when interactivity/state requires them
- Fetch or Axios for backend API communication
- Recharts or an equivalent charting library for analytics

Do NOT use a separate React/Vite frontend.

Do NOT introduce another UI framework unless there is a strong reason. Keep the visual system primarily based on Tailwind CSS and reusable custom components.

Use reusable components and a scalable folder structure.

### Backend

Use:

- Python
- Django
- Django REST Framework
- PostgreSQL

Backend responsibilities:
- Authentication
- Authorization
- User/member management
- Memberships
- Payments
- Attendance
- Goals
- Progress
- Trainers
- Schedules
- Analytics
- API validation
- Business logic

Use:
- Pydantic schemas
- Service layer
- Repository/data-access layer where useful
- Environment variables
- Centralized error handling
- Logging

### Database

Use:

- PostgreSQL
- Django ORM
- Django migrations

Design normalized relational models for:
- users
- roles
- members
- staff
- membership_plans
- memberships
- payments
- attendance
- goals
- progress_records
- trainers
- classes
- bookings
- notifications

Use migrations rather than creating production tables manually.

## Security

Implement:
- Password hashing
- JWT or secure session-based authentication
- Role-based access control
- Input validation
- CORS configuration
- Secure cookies where appropriate
- Environment-based secrets
- Protection against unauthorized API access
- No secrets committed to Git
- Proper authorization on every protected backend operation

Do not rely only on frontend route protection.

## API Design

Create REST APIs using Django REST Framework with clear naming.

Use Django REST Framework serializers, API views/viewsets, permissions, authentication classes, pagination, filtering, and validation where appropriate.

For authentication, use a secure token-based approach such as JWT with HTTP-only cookies where appropriate. Keep authentication logic centralized and make the Next.js frontend consume the Django API cleanly.

Example:

`POST /api/auth/login/`
`POST /api/auth/signup/`
`POST /api/auth/logout/`
`POST /api/auth/refresh/`

`GET /api/members`
`POST /api/members`
`GET /api/members/{member_id}`
`PUT /api/members/{member_id}`
`DELETE /api/members/{member_id}`

`GET /api/members/{member_id}/progress`
`POST /api/members/{member_id}/progress`

`GET /api/members/{member_id}/attendance`
`POST /api/attendance/check-in`

`GET /api/memberships/plans`
`POST /api/memberships`
`GET /api/payments`

`GET /api/trainers`
`GET /api/classes`
`POST /api/classes/{class_id}/book`

Add pagination, filtering, sorting, and validation where appropriate.

## Data and Mock Mode

Initially, development can use mock/seed data so the UI can be developed quickly.

However:
- Keep mock data isolated.
- Do not mix mock data directly into UI components.
- Create API/service abstractions so mock services can later be replaced with real FastAPI APIs.
- Seed realistic Indian gym data.

Example members:
- Maya/Meera-style names
- Indian mobile numbers
- Indian cities
- INR membership amounts

Do not use real people's personal information.

## Dashboard Data

The visual prototype may use values such as:
- Total members
- Staff count
- Customer count
- Total sales
- Monthly sales
- Membership progress

Treat these as sample/mock values only until connected to the backend.

## Project Structure

Prefer a structure similar to:

frontend/
  app/
    (public)/
    admin/
      login/
      dashboard/
      members/
      memberships/
      payments/
      attendance/
      trainers/
      classes/
      reports/
    member/
      home/
      goals/
      progress/
      schedule/
      profile/
    layout.tsx
    page.tsx
  components/
    ui/
    admin/
    member/
    public/
  lib/
    api/
    auth/
    utils/
  hooks/
  types/
  public/
    images/

backend/
  manage.py
  config/
    settings/
    urls.py
    asgi.py
    wsgi.py
  apps/
    accounts/
    members/
    memberships/
    payments/
    attendance/
    goals/
    trainers/
    classes/
    reports/
  common/

Do not create an unnecessarily complex architecture for the first version.

## Development Priorities

Build in this order:

1. Global design system and branding
2. Public website
3. Authentication
4. Admin dashboard
5. Member management
6. Member dashboard
7. Membership plans
8. Payments data model
9. Attendance
10. Goals/progress
11. Trainers
12. Classes/schedules
13. Reports and analytics
14. Security hardening
15. Responsive/mobile polish

## Important Product Requirement

The system should be designed as a real product, not just a collection of visually attractive screens.

Every important UI action should eventually map to:
- a backend endpoint,
- a database operation,
- or a clearly defined service abstraction.

Use realistic empty states, loading states, error states, success states, confirmation dialogs, and form validation.

## Current Reference UI

The supplied screenshots demonstrate the desired visual direction:
- FitnessZone branding
- Admin login
- Admin dashboard
- Member directory
- Admin navigation
- Member home dashboard
- Mobile navigation
- Sales/progress cards

Use these references as the baseline, but improve usability and consistency where necessary.

## Logo

Use the supplied FitnessZone logo asset in the application. Keep the logo proportions intact and provide a suitable fallback if the image is unavailable.

## Technology Constraints

The required stack is fixed for this project:

**Frontend**
- Next.js
- TypeScript
- Tailwind CSS
- Vanilla Tailwind CSS styling

**Backend**
- Django
- Django REST Framework
- PostgreSQL
- Django ORM

**Architecture**
- Next.js frontend communicates with Django REST APIs.
- PostgreSQL is the primary persistent database.
- Keep frontend and backend independently deployable.
- Do not replace Django with FastAPI, Flask, Node.js, or Express.
- Do not replace Next.js with Vite or plain React.
- Do not introduce a second CSS framework.

## Build Instructions

Start by creating the frontend foundation and core pages.

Do not wait for every backend detail before creating the UI. Use a clean mock/service layer initially.

After the first working version:
- verify all routes,
- verify responsive layouts,
- verify forms,
- verify navigation,
- verify role-based UI,
- verify API boundaries,
- identify broken or incomplete functionality,
- fix issues before moving to the next feature.

When a requirement is ambiguous, choose the simplest production-sensible implementation and keep it modular so it can be changed later.
