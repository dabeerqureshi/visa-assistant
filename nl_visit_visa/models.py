from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import declarative_base, relationship
from flask_login import UserMixin

Base = declarative_base()

# ---------------------------------------------------------------------------
# Standard document checklist for a Netherlands short-stay (Schengen) visit
# visa. Each item is pre-seeded into a new Case as an unchecked
# ChecklistItem. The candidate ticks the ones they have and adds optional
# notes. Health insurance is included as a required item per IND guidance.
# ---------------------------------------------------------------------------
STANDARD_CHECKLIST = [
    "Valid passport (6+ months validity beyond trip end date, 2 blank pages)",
    "Recent passport-size photographs (2x, white background, ICAO compliant)",
    "International health insurance (minimum €30,000 coverage, Schengen-wide)",
    "Bank statements (last 3-6 months, stamped by bank)",
    "Employment letter / No Objection Certificate (NOC) from employer",
    "Income Tax Returns (last 2-3 years)",
    "Salary slips (last 3-6 months)",
    "Hotel booking confirmation or accommodation proof",
    "Flight reservation / round-trip itinerary",
    "Invitation letter from host in Netherlands (if visiting family/friend)",
    "Marriage certificate (if applicable)",
    "Birth certificates of accompanying children (if applicable)",
    "Property / asset ownership documents (strengthens file, optional)",
    "Previous Schengen / NL visa copies (if any)",
    "Cover letter explaining purpose of visit",
]


class User(Base, UserMixin):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    role = Column(String(50), default='candidate')


class Case(Base):
    __tablename__ = 'cases'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))

    # Application meta
    title = Column(String(255))
    status = Column(String(50), default='draft')  # draft, submitted, approved, rejected

    # --- Personal info ---
    full_name = Column(String(255))
    age = Column(Integer)
    nationality = Column(String(255))
    marital_status = Column(String(50))  # single, married, divorced, widowed, separated

    # --- Professional info ---
    job_status = Column(String(50))  # employed, self_employed, business, unemployed, student, retired
    job_title = Column(String(255))
    employer_name = Column(String(255))
    work_experience_years = Column(Integer)
    business_name = Column(String(255))
    business_experience_years = Column(Integer)
    education = Column(String(255))
    monthly_salary = Column(Integer)  # stored in PKR (or any currency code entered by user)

    # --- Travel & financial ---
    travel_history = Column(Text)  # countries visited in last 5 years
    bank_statement_available = Column(Boolean, default=False)
    bank_statement_notes = Column(String(500))
    health_insurance_provider = Column(String(255))
    health_insurance_policy = Column(String(255))
    health_insurance_coverage = Column(String(100))  # e.g. "€30,000"

    # --- Free-form ---
    details = Column(Text)

    # --- Timestamps ---
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    checklist_items = relationship(
        'ChecklistItem',
        back_populates='case',
        cascade='all, delete-orphan',
    )

    def checklist_progress(self):
        """Return (checked, total) for the document checklist."""
        items = self.checklist_items or []
        total = len(STANDARD_CHECKLIST)
        checked = sum(1 for i in items if i.has_document)
        return checked, total

    def profile_complete(self):
        """Heuristic: is the personal details section filled in?"""
        required = [
            self.full_name, self.age, self.nationality, self.marital_status,
            self.job_status, self.education, self.monthly_salary,
            self.travel_history, self.health_insurance_provider,
        ]
        return all(v not in (None, '', 0) for v in required)


class ChecklistItem(Base):
    __tablename__ = 'checklist_items'
    id = Column(Integer, primary_key=True)
    case_id = Column(Integer, ForeignKey('cases.id'))
    document_name = Column(String(255))
    has_document = Column(Boolean, default=False)
    notes = Column(String(500))
    case = relationship('Case', back_populates='checklist_items')
