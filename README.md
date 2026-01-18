# AI Resume Analyzer

A powerful, AI-driven application that analyzes resumes against job descriptions to provide detailed feedback, scoring, and improvement tips. Built with the latest web technologies including React Router v7 and Gemini 2.5 Flash.

## 🚀 Features

- **AI-Powered Analysis**: Utilizes Google's Gemini 2.5 Flash model to deeply analyze resumes.
- **Detailed Scoring**: Provides an overall score and breakdowns for ATS compatibility, Content, Structure, and Skills.
- **Actionable Feedback**: Offers specific "Good" and "Improve" tips for each section.
- **PDF Parsing**: Precise text extraction from PDF resumes using `pdf-parse`.
- **User Authentication**: Secure login and signup to save your analysis history.
- **Resume History**: View past analyses and track your improvements over time.
- **Modern UI**: Clean, responsive interface built with Tailwind CSS v4.

## � Screenshots

![Dashboard](/public/Dashboard.png)
![Analysis](/public/Analysis.png)
![Resume](/public/resumes.png)
![Login](/public/Login.png)
![Register](/public/sign-up.png)
![Welcome](/public/Welcome.png)
![Scan](/public/Scan.png)

## �🛠️ Tech Stack

- **Framework**: [React Router v7](https://reactrouter.com/)
- **Frontend**: React 19, Tailwind CSS v4
- **Backend**: Node.js, Prisma ORM
- **Database**: SQLite (default)
- **AI**: Google Generative AI (Gemini 2.5 Flash)
- **Authentication**: Bcryptjs (Custom implementation)

## 🏁 Getting Started

### Prerequisites

- Node.js (v20 or later recommended)
- A Google Cloud API Key with access to Gemini API.

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd AI-resume-analyzer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add the following:

   ```env
   DATABASE_URL="file:./dev.db"
   GEMINI_API_KEY="your_gemini_api_key_here"
   SESSION_SECRET="your_super_secret_session_key"
   ```

4. **Setup Database**
   Initialize the SQLite database with Prisma:

   ```bash
   npx prisma db push
   ```

5. **Run the Application**
   Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173).

## 📄 License

This project is licensed under the MIT License.
