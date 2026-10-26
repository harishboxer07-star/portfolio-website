import os
import sys
from app import create_app, db
from app.models.user import User
from app.models.profile import Profile
from app.models.project import Project
from app.models.skill import Skill
from app.models.education import Education
from app.models.certificate import Certificate

app = create_app()

def init_db_with_defaults():
    with app.app_context():
        db.create_all()
        print("-> Database tables verified/created successfully.")

        # Ensure default Admin account exists
        default_user = os.getenv('ADMIN_DEFAULT_USERNAME', 'harishuu')
        default_pass = os.getenv('ADMIN_DEFAULT_PASSWORD', 'harishuu07')

        user = User.query.filter_by(username=default_user).first()
        if not user:
            user = User(username=default_user)
            user.set_password(default_pass)
            db.session.add(user)
            print(f"-> Created default admin user: '{default_user}' (password: '{default_pass}')")
        else:
            print(f"-> Admin user '{default_user}' already exists.")

        # Ensure Profile exists
        profile = Profile.query.first()
        if not profile:
            profile = Profile(
                full_name="Harish Kumar",
                qualification="M.Sc. Data Science",
                role="Data Science Student | Aspiring Full-Stack Developer",
                mobile="6380178269",
                email="",
                location="",
                bio="Passionate M.Sc. Data Science student and aspiring developer focused on machine learning, predictive modeling, and scalable full-stack web architectures. Committed to turning data into real-world impact.",
                github_url="",
                linkedin_url="",
                photo_url="/uploads/images/harish_kumar.jpg",
                resume_url="",
                career_interests="Machine Learning, Data Analytics, Full-Stack Web Development, Natural Language Processing, Cloud & Data Engineering",
                professional_goals="To build intelligent, data-driven software solutions and contribute to impactful technology teams while mastering modern full-stack and AI stacks.",
                personal_strengths="Analytical problem solving, rapid adaptation to new frameworks, dedication to high code quality, and strong collaborative communication."
            )
            db.session.add(profile)
            print("-> Initialized profile for Harish Kumar with profile photo.")
        else:
            if not profile.photo_url:
                profile.photo_url = "/uploads/images/harish_kumar.jpg"

        db.session.commit()

def seed_sample_data():
    with app.app_context():
        init_db_with_defaults()

        # Seed Skills if empty
        if Skill.query.count() == 0:
            sample_skills = [
                # Programming Languages
                ("Python", "Programming Languages", 90),
                ("SQL", "Programming Languages", 85),
                ("JavaScript (ES6+)", "Programming Languages", 80),
                ("C / C++", "Programming Languages", 70),
                ("R Programming", "Programming Languages", 75),

                # Data Science and Machine Learning
                ("Machine Learning Algorithms", "Data Science and Machine Learning", 88),
                ("Pandas & NumPy", "Data Science and Machine Learning", 92),
                ("Scikit-Learn", "Data Science and Machine Learning", 86),
                ("Exploratory Data Analysis (EDA)", "Data Science and Machine Learning", 90),
                ("Statistical Modeling & Testing", "Data Science and Machine Learning", 82),
                ("Data Visualization (Matplotlib, Seaborn)", "Data Science and Machine Learning", 88),

                # Frontend Development
                ("React.js", "Frontend Development", 82),
                ("Tailwind CSS", "Frontend Development", 88),
                ("HTML5 & Responsive CSS3", "Frontend Development", 90),
                ("Modern UI / UX Principles", "Frontend Development", 80),

                # Backend Development
                ("Python Flask REST API", "Backend Development", 85),
                ("Flask-SQLAlchemy ORM", "Backend Development", 84),
                ("JWT Authentication & Security", "Backend Development", 82),

                # Databases
                ("SQLite", "Databases", 88),
                ("PostgreSQL", "Databases", 80),
                ("MySQL", "Databases", 82),

                # Tools and Technologies
                ("Git & GitHub", "Tools and Technologies", 85),
                ("Jupyter Notebook", "Tools and Technologies", 92),
                ("VS Code", "Tools and Technologies", 90),
                ("Postman API Testing", "Tools and Technologies", 84)
            ]

            for name, cat, level in sample_skills:
                db.session.add(Skill(name=name, category=cat, proficiency_level=level))
            print(f"-> Seeded {len(sample_skills)} skills across 6 categories.")

        # Seed Education if empty
        if Education.query.count() == 0:
            sample_edu = [
                Education(
                    degree="Master of Science (M.Sc.)",
                    institution="Postgraduate Institute of Data Science",
                    field_of_study="Data Science & Big Data Analytics",
                    start_year="2024",
                    end_year="Present (2026)",
                    grade="First Class with Distinction",
                    description="Specializing in advanced machine learning, predictive modeling, statistical learning, big data technologies, and algorithmic problem solving.",
                    display_order=1
                ),
                Education(
                    degree="Bachelor of Science (B.Sc.)",
                    institution="Undergraduate College of Science & Technology",
                    field_of_study="Computer Science / Mathematics",
                    start_year="2021",
                    end_year="2024",
                    grade="Graduated with High Honors",
                    description="Built solid foundations in software engineering, database management systems, data structures, calculus, and discrete mathematics.",
                    display_order=2
                )
            ]
            for edu in sample_edu:
                db.session.add(edu)
            print("-> Seeded education records.")

        # Seed Projects if empty
        if Project.query.count() == 0:
            sample_projects = [
                Project(
                    title="Predictive Customer Churn Analysis & ML Pipeline (Sample)",
                    description="Engineered an end-to-end machine learning pipeline to detect customer churn probability. Implemented data preprocessing, feature engineering, and trained Random Forest & XGBoost classifiers achieving 89% recall.",
                    image_url="",
                    tech_stack="Python, Scikit-Learn, Pandas, Matplotlib, Flask, Seaborn",
                    github_url="",
                    live_demo_url="",
                    category="Data Science",
                    is_featured=True
                ),
                Project(
                    title="Intelligent Stock Sentiment & Trend Predictor (Sample)",
                    description="Developed a financial trend forecasting tool combining time-series historical price movements with NLP sentiment analysis from financial news headlines.",
                    image_url="",
                    tech_stack="Python, NLP, NLTK, Pandas, Streamlit, Statsmodels",
                    github_url="",
                    live_demo_url="",
                    category="Machine Learning",
                    is_featured=True
                ),
                Project(
                    title="Student Performance & Academic Analytics Hub (Sample)",
                    description="A modern full-stack web application for academic institutions to track student progression, visualize metrics across terms, and identify students requiring early academic intervention.",
                    image_url="",
                    tech_stack="React.js, Tailwind CSS, Python Flask, SQLite, Chart.js",
                    github_url="",
                    live_demo_url="",
                    category="Full-Stack Web",
                    is_featured=True
                )
            ]
            for p in sample_projects:
                db.session.add(p)
            print("-> Seeded sample projects (editable via Admin Dashboard).")

        # Seed Certificates if empty
        if Certificate.query.count() == 0:
            sample_certs = [
                Certificate(
                    title="Data Science & Machine Learning Masterclass (Sample)",
                    issuer="Coursera / DeepLearning.AI",
                    issue_date="2024",
                    credential_url="",
                    image_url=""
                ),
                Certificate(
                    title="Applied Statistical Modeling & Python Analytics (Sample)",
                    issuer="NPTEL Specialization",
                    issue_date="2024",
                    credential_url="",
                    image_url=""
                )
            ]
            for c in sample_certs:
                db.session.add(c)
            print("-> Seeded sample certificates (editable via Admin Dashboard).")

        db.session.commit()
        print("-> Sample data successfully populated!")

if __name__ == '__main__':
    if len(sys.argv) > 1:
        cmd = sys.argv[1].lower()
        if cmd == 'init-db':
            init_db_with_defaults()
            print("Database initialized successfully.")
            sys.exit(0)
        elif cmd == 'seed-data':
            seed_sample_data()
            print("Sample data seeded successfully.")
            sys.exit(0)
        elif cmd == 'create-admin':
            with app.app_context():
                db.create_all()
                username = input("Enter admin username: ").strip() or "admin"
                password = input("Enter admin password: ").strip()
                if not password:
                    print("Password cannot be empty.")
                    sys.exit(1)
                u = User.query.filter_by(username=username).first()
                if not u:
                    u = User(username=username)
                    db.session.add(u)
                u.set_password(password)
                db.session.commit()
                print(f"Admin '{username}' successfully configured.")
                sys.exit(0)

    # Auto initialize DB and default seed if empty on start
    seed_sample_data()

    port = int(os.getenv('PORT', 5000))
    print(f"Starting Harish Kumar Portfolio Backend on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
