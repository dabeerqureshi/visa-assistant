# NL Visit Visa (Flask)

Simple Flask app focused on Netherlands visit visa flow. Contains admin and candidate flows.

Quick start:

```bash
# from the project root (E:\visa-assistant)
python -m venv .venv
.venv\Scripts\activate            # Windows
# source .venv/bin/activate       # macOS / Linux

pip install -r nl_visit_visa/requirements.txt

# Either of these works (run.py bootstraps sys.path internally):
python nl_visit_visa/run.py
# or, from inside the package:
cd nl_visit_visa && python run.py
```

The app listens on http://127.0.0.1:5000/.

Admin credentials: `admin` / `admin123`
