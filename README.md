<div align="center">
  <img src="/exam_review.png" alt="Exam Review Logo" width="200" height="200">
  <h1>Exam Review</h1>
  <p>
     A platform for students to review their exam sheets and submit grading claims,
     while enabling professors to review and manage those claims.
  </p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
    <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
    <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django">
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  </div>
</div>

---

## Functionalities

- **Session Scheduling:** Professors can schedule online exam review sessions.
- **Student Participation:** Students can join scheduled review sessions and view their exam results.
- **Exam Sheet Viewing:** Students can view their exam sheets alongside official corrections. *(TODO)*
- **Real-Time Updates:** Live notifications for session updates and claim status changes. *(TODO)*
- **Claims Management:** Professors can manage student review claims and update grades directly. *(TODO)*
- **Automated Reminders:** Email notifications to remind students prior to scheduled review sessions. *(TODO)*

---

## Tech Stack

- **Frontend:** Next.js (App Router), React, TailwindCSS
- **Backend:** Django, Django REST Framework
- **Database:** PostgreSQL (with dynamic multi-database routing)

---

## Getting Started

### Prerequisites

Ensure you have the following installed locally:
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL

---

### 1. Frontend Setup (Next.js)

1. Install dependencies:
   npm install

2. Run the development server:
   npm run dev

3. Open http://localhost:3000 in your browser to view the application.

---

### 2. Backend Setup (Django)

1. Navigate to the backend directory:
   cd backend/ExamReview

2. Create and activate a virtual environment:
   # Windows (PowerShell)
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv .venv
   source .venv/bin/activate

3. Install dependencies:
   pip install -r requirements.txt

4. Set up Environment Variables:
   Create a .env file inside backend/ExamReview/ containing:
   SECRET_KEY=your-django-secret-key
   DEBUG=True
   USER=your_db_user
   PASSWORD=your_db_password
   DB_NAME=exam_review_db
   DB_HOST=127.0.0.1
   DB_PORT=5432

5. Apply migrations and start the server:
   python manage.py migrate
   python manage.py runserver

The Django API server will be available at http://127.0.0.1:8000.

---

## Running Tests

To run the Django test suite with isolated settings:

python manage.py test