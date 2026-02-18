# Immersion Enrollment App

A modern, responsive web application designed to streamline student enrollment for immersion tracks. Built with a focus on user experience, real-time feedback, and professional documentation generation.

- **Multi-Step Enrollment**: A fluid, step-by-step wizard (Credentials → Track Selection → Review → Success).
- **Track Selection & Capacity Tracking**: Real-time tracking of enrollment slots for various tracks (e.g., AI, Game Design, Psychology, etc.) using Supabase.
- **Dynamic Capacity Indicators**: Visual badges indicating track availability and disabling tracks once they reach maximum capacity.
- **PDF Export**: Instant generation of professional enrollment confirmation PDFs for students.
- **Polished UI/UX**: Responsive layout built with Tailwind CSS, featuring smooth GSAP micro-animations and Lucide icons.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database/Backend**: [Supabase](https://supabase.com/)
- **Animations**: [GSAP](https://gsap.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Generation**: [react-to-pdf](https://github.com/Arギリ/react-to-pdf)

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**:

   ```bash
   git clone [repository-url]
   cd immersion_enrollment
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

---

Developed by [KymRhys](https://github.com/KymRhys)
