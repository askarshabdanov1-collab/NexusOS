import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import { useLenis } from './hooks/useLenis'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TutorsPage from './pages/TutorsPage'
import TutorProfilePage from './pages/TutorProfilePage'
import DashboardPage from './pages/DashboardPage'
import BookingsPage from './pages/BookingsPage'
import MessagesPage from './pages/MessagesPage'
import Navbar from './components/layout/Navbar'
import CustomCursor from './components/ui/CustomCursor'

// Protected Route
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}

// Page transition wrapper
function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

function AppRoutes() {
  const { loadUser, isAuthenticated } = useAuthStore()
  const location = useLocation()

  useLenis() // 🌊 Global Smooth Scroll Physics

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token && !isAuthenticated) {
      loadUser()
    }
  }, [])

  // Pages that need their own Navbar (already have it in component)
  const hasOwnNav = ['/tutors', '/dashboard', '/bookings', '/messages'].some(p => location.pathname.startsWith(p))

  return (
    <>
      {!hasOwnNav && location.pathname !== '/' && <Navbar />}

      <PageTransition>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/tutors" element={<TutorsPage />} />
          <Route path="/tutors/:id" element={<TutorProfilePage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute><BookingsPage /></ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute><MessagesPage /></ProtectedRoute>
          } />
          <Route path="/messages/:convId" element={
            <ProtectedRoute><MessagesPage /></ProtectedRoute>
          } />
          <Route path="*" element={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
              <Navbar />
              <div style={{ marginTop: '80px' }}>
                <div style={{ fontSize: '80px', marginBottom: '16px', color: 'var(--color-accent-primary)' }}>404</div>
                <h1 className="serif-title" style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>Страница не найдена</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '28px' }}>Запрошенная страница не существует.</p>
                <a href="/" className="btn-primary">На главную</a>
              </div>
            </div>
          } />
        </Routes>
      </PageTransition>

      {/* 🔴 Premium Custom Magnetic Cursor */}
      <CustomCursor />

      {/* Noise texture overlay for premium feel */}
      <div className="noise-overlay" />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            fontFamily: 'var(--font-primary)',
            fontSize: '14px',
            boxShadow: 'var(--shadow-elevated)',
          },
          success: {
            iconTheme: { primary: 'var(--color-accent-emerald)', secondary: 'var(--color-bg-secondary)' },
          },
          error: {
            iconTheme: { primary: 'var(--color-accent-rose)', secondary: 'var(--color-bg-secondary)' },
          },
        }}
      />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
