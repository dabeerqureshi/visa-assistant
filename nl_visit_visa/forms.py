from flask_wtf import FlaskForm
from wtforms import (
    StringField, PasswordField, SubmitField, TextAreaField,
    IntegerField, SelectField, BooleanField,
)
from wtforms.validators import DataRequired, Length, NumberRange, Optional


JOB_STATUS_CHOICES = [
    ('', '— select —'),
    ('employed', 'Employed'),
    ('self_employed', 'Self-employed'),
    ('business', 'Business owner'),
    ('unemployed', 'Unemployed'),
    ('student', 'Student'),
    ('retired', 'Retired'),
]

MARITAL_STATUS_CHOICES = [
    ('', '— select —'),
    ('single', 'Single'),
    ('married', 'Married'),
    ('divorced', 'Divorced'),
    ('widowed', 'Widowed'),
    ('separated', 'Separated'),
]


class AdminLoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')


class CandidateRegisterForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    submit = SubmitField('Register')


class CandidateLoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')


class ApplicationStartForm(FlaskForm):
    title = StringField('Application Title', validators=[DataRequired()])
    submit = SubmitField('Start')


class ApplicationDetailsForm(FlaskForm):
    # --- Personal ---
    full_name = StringField(
        'Full name (as on passport)',
        validators=[DataRequired(), Length(max=255)],
    )
    age = IntegerField('Age', validators=[Optional(), NumberRange(min=0, max=120)])
    nationality = StringField(
        'Nationality',
        validators=[DataRequired(), Length(max=255)],
    )
    marital_status = SelectField(
        'Marital status',
        choices=MARITAL_STATUS_CHOICES,
        validators=[Optional()],
    )

    # --- Professional ---
    job_status = SelectField(
        'Job status',
        choices=JOB_STATUS_CHOICES,
        validators=[Optional()],
    )
    job_title = StringField('Job title / designation', validators=[Optional(), Length(max=255)])
    employer_name = StringField('Employer / company name', validators=[Optional(), Length(max=255)])
    work_experience_years = IntegerField(
        'Work experience (years)',
        validators=[Optional(), NumberRange(min=0, max=80)],
    )
    business_name = StringField('Business name (if applicable)', validators=[Optional(), Length(max=255)])
    business_experience_years = IntegerField(
        'Business experience (years)',
        validators=[Optional(), NumberRange(min=0, max=80)],
    )
    education = StringField('Highest education', validators=[Optional(), Length(max=255)])
    monthly_salary = IntegerField(
        'Monthly salary (PKR)',
        validators=[Optional(), NumberRange(min=0)],
    )

    # --- Travel & financial ---
    travel_history = TextAreaField(
        'Travel history (countries visited in last 5 years)',
        validators=[Optional()],
    )
    bank_statement_available = BooleanField('Bank statement available (last 3–6 months)')
    bank_statement_notes = StringField(
        'Bank statement notes (bank name, branch, etc.)',
        validators=[Optional(), Length(max=500)],
    )
    health_insurance_provider = StringField(
        'Health insurance provider',
        validators=[Optional(), Length(max=255)],
    )
    health_insurance_policy = StringField(
        'Policy number',
        validators=[Optional(), Length(max=255)],
    )
    health_insurance_coverage = StringField(
        'Coverage amount (e.g. €30,000)',
        validators=[Optional(), Length(max=100)],
    )

    # --- Other ---
    details = TextAreaField(
        'Additional details / cover letter',
        validators=[Optional()],
    )

    submit = SubmitField('Save & continue')
