# 🚀 AI-Powered ATS Scorer

An intelligent Applicant Tracking System (ATS) that evaluates resumes against job descriptions using advanced Natural Language Processing (NLP) and Large Language Models (LLMs). This project provides a comprehensive end-to-end pipeline, from extracting text from resumes to generating a compatibility score and detailed feedback for candidates.

## 🌟 Key Features

- **Automated Resume Parsing:** Extracts skills, experience, and key information from resumes (PDFs) and Job Descriptions.
- **Semantic Matching:** Utilizes Sentence Transformers (`all-MiniLM-L6-v2`) to compute semantic similarity between candidate profiles and job requirements.
- **LLM-Powered Insights:** Integrates with the **Groq API** (running Llama 3 models) to generate detailed, actionable feedback, identifying missing skills and formatting improvements.
- **Secure Authentication:** User authentication and profile management powered by **Clerk**.
- **Interactive Dashboard:** A responsive, modern frontend built with React, Vite, and TailwindCSS, featuring visual analytics via Recharts.
- **History Tracking:** Saves user analysis history securely in **MongoDB** for future reference.

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework:** React (Vite)
- **Styling:** TailwindCSS
- **Authentication:** Clerk
- **Data Visualization:** Recharts
- **Routing:** React Router

### Backend
- **Framework:** FastAPI (Python)
- **AI / LLM integration:** Groq API (`llama-3.3-70b-versatile`)
- **NLP Models:** Hugging Face `SentenceTransformers` 
- **PDF Processing:** PyPDF2
- **Database:** MongoDB (AsyncIOMotorClient)

### Machine Learning (Research & Fine-Tuning)
- **Notebooks:** Jupyter Notebooks for BERT fine-tuning and dataset preparation.
- **Data:** Custom cleaned ATS pair datasets.

### Deployment
- **Cloud Provider:** AWS Elastic Beanstalk
- **Process Manager:** Gunicorn + Uvicorn (`Procfile`)

---

## ⚙️ Local Development Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd ATS_SCORER
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt # Note: generate your requirements.txt if not present
```

Create a `.env` file in the `backend/` directory with the following variables:
```env
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=resume_ats
SENTENCE_TRANSFORMER_MODEL=all-MiniLM-L6-v2
FRONTEND_URL=http://localhost:5173
```

Run the backend server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_BASE_URL=http://localhost:8000
```

Start the frontend development server:
```bash
npm run dev
```

---

## 🔒 Security Best Practices

> **Note to Contributors:** 
> Do not commit `.env` files to source control. They contain sensitive keys (Groq, MongoDB, Clerk) that should remain private. Ensure `.env` is listed in your `.gitignore` and `.ebignore`.

---

## 📂 Project Structure

```
ATS_SCORER/
├── backend/                # FastAPI Application & AI Services
├── frontend/               # React Vite UI Application
├── jupyter notebooks/      # ML Research, Dataset Cleaning, BERT Finetuning
├── ml model/               # Exported ML artifacts
├── .ebextensions/          # AWS Elastic Beanstalk configurations
├── .ebignore               # Files to ignore during AWS deployment
├── Procfile                # Gunicorn startup configuration for AWS
└── Readme.md               # Project documentation
```

## 📜 License
This project is proprietary. Please check with the author before distributing.
