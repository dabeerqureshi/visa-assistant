import os
import sys

# Make the parent directory importable so `from nl_visit_visa...` works
# regardless of where this file is run from (e.g. `python nl_visit_visa/run.py`
# from the project root, or `python run.py` from inside this package).
_PARENT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _PARENT_DIR not in sys.path:
    sys.path.insert(0, _PARENT_DIR)

from flask import Flask, render_template, redirect, url_for, flash, send_from_directory, request
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session

from nl_visit_visa.models import (
    Base, User, Case, ChecklistItem, STANDARD_CHECKLIST,
)
from nl_visit_visa.forms import (
    AdminLoginForm, CandidateRegisterForm, CandidateLoginForm,
    ApplicationStartForm, ApplicationDetailsForm,
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'nl_visit_visa.db')
os.makedirs(BASE_DIR, exist_ok=True)


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret')

    engine = create_engine(
        f'sqlite:///{DB_PATH}',
        echo=False,
        future=True,
        pool_size=5,
        max_overflow=5,
        pool_timeout=10,
        pool_recycle=1800,
    )
    Base.metadata.create_all(engine)

    SessionLocal = scoped_session(
        sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    )

    def get_db():
        return SessionLocal()

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        SessionLocal.remove()

    login_manager = LoginManager()
    login_manager.login_view = 'candidate_login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        db = get_db()
        return db.get(User, int(user_id))

    def sync_case_checklist(db, case):
        """Ensure every case has one checklist item for each standard document."""
        existing = {item.document_name: item for item in case.checklist_items or []}
        created = False
        for name in STANDARD_CHECKLIST:
            if name not in existing:
                item = ChecklistItem(case_id=case.id, document_name=name)
                db.add(item)
                db.flush()
                case.checklist_items.append(item)
                existing[name] = item
                created = True
        if created:
            db.commit()
            db.refresh(case)
        return existing

    # Seed the admin account (idempotent).
    with app.app_context():
        db = get_db()
        admin = db.query(User).filter_by(username='admin').first()
        if not admin:
            admin = User(
                username='admin',
                role='admin',
                password_hash=generate_password_hash('admin123'),
            )
            db.add(admin)
            db.commit()

    # ------------------------------------------------------------------ auth

    @app.route('/')
    def index():
        return redirect(url_for('candidate_login'))

    @app.route('/admin/login', methods=['GET', 'POST'])
    def admin_login():
        form = AdminLoginForm()
        if form.validate_on_submit():
            db = get_db()
            user = db.query(User).filter_by(
                username=form.username.data, role='admin'
            ).first()
            if user and check_password_hash(user.password_hash, form.password.data):
                login_user(user)
                return redirect(url_for('admin_dashboard'))
            flash('Invalid credentials', 'danger')
        return render_template('admin_login.html', form=form)

    @app.route('/admin/dashboard')
    @login_required
    def admin_dashboard():
        if current_user.role != 'admin':
            return redirect(url_for('index'))
        db = get_db()
        cases = db.query(Case).order_by(Case.id.desc()).all()
        return render_template('admin_dashboard.html', cases=cases)

    @app.route('/admin/case/<int:case_id>')
    @login_required
    def admin_view_case(case_id):
        if current_user.role != 'admin':
            return redirect(url_for('index'))
        db = get_db()
        case = db.get(Case, case_id)
        if not case:
            flash('Case not found', 'warning')
            return redirect(url_for('admin_dashboard'))
        return render_template('case_view.html', case=case)

    @app.route('/admin/case/<int:case_id>/review', methods=['POST'])
    @login_required
    def admin_review_case(case_id):
        if current_user.role != 'admin':
            return redirect(url_for('index'))
        db = get_db()
        case = db.get(Case, case_id)
        if not case:
            flash('Case not found', 'warning')
            return redirect(url_for('admin_dashboard'))

        action = request.form.get('action')
        if action == 'approve':
            case.status = 'approved'
            flash('Application approved.', 'success')
        elif action == 'reject':
            case.status = 'rejected'
            flash('Application rejected.', 'warning')
        elif action == 'review':
            case.status = 'under_review'
            flash('Application marked for review.', 'info')
        else:
            flash('Invalid action.', 'warning')
            return redirect(url_for('admin_view_case', case_id=case_id))

        db.add(case)
        db.commit()
        return redirect(url_for('admin_view_case', case_id=case_id))

    @app.route('/candidate/register', methods=['GET', 'POST'])
    def candidate_register():
        form = CandidateRegisterForm()
        if form.validate_on_submit():
            db = get_db()
            existing = db.query(User).filter_by(username=form.username.data).first()
            if existing:
                flash('Username exists', 'warning')
                return render_template('candidate_register.html', form=form)
            user = User(
                username=form.username.data,
                role='candidate',
                password_hash=generate_password_hash(form.password.data),
            )
            db.add(user)
            db.commit()
            login_user(user)
            return redirect(url_for('application_start'))
        return render_template('candidate_register.html', form=form)

    @app.route('/candidate/login', methods=['GET', 'POST'])
    def candidate_login():
        form = CandidateLoginForm()
        if form.validate_on_submit():
            db = get_db()
            user = db.query(User).filter_by(
                username=form.username.data, role='candidate'
            ).first()
            if user and check_password_hash(user.password_hash, form.password.data):
                login_user(user)
                return redirect(url_for('candidate_dashboard'))
            flash('Invalid credentials', 'danger')
        return render_template('candidate_login.html', form=form)

    @app.route('/logout')
    @login_required
    def logout():
        logout_user()
        return redirect(url_for('candidate_login'))

    # ------------------------------------------------------------- candidate

    @app.route('/candidate')
    @login_required
    def candidate_dashboard():
        db = get_db()
        cases = db.query(Case).filter_by(user_id=current_user.id).all()
        return render_template('dashboard.html', cases=cases)

    @app.route('/candidate/application/start', methods=['GET', 'POST'])
    @login_required
    def application_start():
        form = ApplicationStartForm()
        if form.validate_on_submit():
            db = get_db()
            case = Case(user_id=current_user.id, status='draft', title=form.title.data)
            # Pre-seed the standard document checklist.
            case.checklist_items = [
                ChecklistItem(document_name=name, has_document=False)
                for name in STANDARD_CHECKLIST
            ]
            db.add(case)
            db.commit()
            return redirect(url_for('application_details', case_id=case.id))
        return render_template('application_start.html', form=form)

    @app.route('/candidate/application/<int:case_id>/details', methods=['GET', 'POST'])
    @login_required
    def application_details(case_id):
        db = get_db()
        case = db.get(Case, case_id)
        if not case or case.user_id != current_user.id:
            flash('Not found', 'warning')
            return redirect(url_for('candidate_dashboard'))
        form = ApplicationDetailsForm(obj=case)
        if form.validate_on_submit():
            # --- Personal ---
            case.full_name = form.full_name.data
            case.age = form.age.data
            case.nationality = form.nationality.data
            case.marital_status = form.marital_status.data
            # --- Professional ---
            case.job_status = form.job_status.data
            case.job_title = form.job_title.data
            case.employer_name = form.employer_name.data
            case.work_experience_years = form.work_experience_years.data
            case.business_name = form.business_name.data
            case.business_experience_years = form.business_experience_years.data
            case.education = form.education.data
            case.monthly_salary = form.monthly_salary.data
            # --- Travel & financial ---
            case.travel_history = form.travel_history.data
            case.bank_statement_available = bool(form.bank_statement_available.data)
            case.bank_statement_notes = form.bank_statement_notes.data
            case.health_insurance_provider = form.health_insurance_provider.data
            case.health_insurance_policy = form.health_insurance_policy.data
            case.health_insurance_coverage = form.health_insurance_coverage.data
            # --- Other ---
            case.details = form.details.data
            db.add(case)
            db.commit()
            flash('Details saved', 'success')
            return redirect(url_for('checklist', case_id=case_id))
        return render_template('application_details.html', form=form, case=case)

    @app.route('/candidate/application/<int:case_id>/checklist', methods=['GET', 'POST'])
    @login_required
    def checklist(case_id):
        db = get_db()
        case = db.get(Case, case_id)
        if not case or case.user_id != current_user.id:
            flash('Not found', 'warning')
            return redirect(url_for('candidate_dashboard'))

        sync_case_checklist(db, case)

        if request.method == 'POST':
            for item in case.checklist_items:
                item.has_document = request.form.get(f'has_{item.id}') == 'on'
                item.notes = (request.form.get(f'notes_{item.id}') or '').strip()
            db.commit()
            flash('Checklist updated', 'success')
            return redirect(url_for('candidate_dashboard'))

        return render_template('checklist.html', case=case)

    @app.route('/candidate/application/<int:case_id>/submit', methods=['POST'])
    @login_required
    def submit_case(case_id):
        db = get_db()
        case = db.get(Case, case_id)
        if case and case.user_id == current_user.id:
            sync_case_checklist(db, case)
            for item in case.checklist_items:
                item.has_document = request.form.get(f'has_{item.id}') == 'on'
                item.notes = (request.form.get(f'notes_{item.id}') or '').strip()
            if not case.profile_complete():
                db.commit()
                flash('Please complete your personal details before submitting.', 'warning')
                return redirect(url_for('application_details', case_id=case_id))
            case.status = 'submitted'
            db.add(case)
            db.commit()
            flash('Application submitted', 'success')
        return redirect(url_for('candidate_dashboard'))

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
