import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import {
  BookOpen, User, MessageSquare, Calendar,
  LogOut, Menu, X, ChevronDown, Search, Bell, GraduationCap
} from 'lucide-react'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
    setIsUserMenuOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '0 24px',
          transition: 'all 0.4s ease',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          background: isScrolled
            ? 'var(--glass-bg)'
            : 'transparent',
          borderBottom: isScrolled
            ? '1px solid var(--color-border)'
            : '1px solid transparent',
        }}
      >
        <nav style={{
          maxWidth: '95%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
          gap: '20px',
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <div style={{
                width: '36px', height: '36px',
                background: 'var(--color-accent-primary)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(108,126,114,0.2)',
              }}>
                <GraduationCap size={20} color="#FAF6F0" />
              </div>
              <span className="serif-title" style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.02em',
              }}>
                Nexus Academy
              </span>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flex: 1,
            justifyContent: 'center',
          }}
            className="hide-mobile"
          >
            <Link to="/tutors" className="nav-link">
              <Search size={15} />
              Найти репетитора
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                  <User size={15} />
                  Кабинет
                </Link>
                <Link
                  to="/bookings"
                  className={`nav-link ${location.pathname === '/bookings' ? 'active' : ''}`}
                >
                  <Calendar size={15} />
                  Уроки
                </Link>
                <Link
                  to="/messages"
                  className={`nav-link ${location.pathname.startsWith('/messages') ? 'active' : ''}`}
                >
                  <MessageSquare size={15} />
                  Сообщения
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            {isAuthenticated ? (
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 16px',
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <div style={{
                    width: '32px', height: '32px',
                    borderRadius: '50%',
                    background: 'var(--color-accent-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: '700', flexShrink: 0,
                    overflow: 'hidden',
                    color: '#FAF6F0',
                  }}>
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      user?.first_name?.[0] || 'U'
                    )}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '500', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.first_name}
                  </span>
                  <ChevronDown size={14} style={{
                    transition: 'transform 0.2s',
                    transform: isUserMenuOpen ? 'rotate(180deg)' : 'none',
                    opacity: 0.7,
                  }} />
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        width: '220px',
                        background: 'var(--glass-strong-bg)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '16px',
                        padding: '8px',
                        boxShadow: 'var(--shadow-elevated)',
                        zIndex: 200,
                      }}
                    >
                      <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid var(--color-border)', marginBottom: '6px' }}>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>{user?.full_name}</p>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{user?.email}</p>
                        <span className="badge badge-primary" style={{ marginTop: '8px', fontSize: '10px' }}>
                          {user?.role === 'tutor' ? 'Репетитор' : 'Студент'}
                        </span>
                      </div>

                      {[
                        { to: '/dashboard', icon: User, label: 'Личный кабинет' },
                        { to: '/bookings', icon: Calendar, label: 'Мои уроки' },
                        { to: '/messages', icon: MessageSquare, label: 'Сообщения' },
                      ].map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '10px 14px', borderRadius: '10px',
                            color: 'var(--color-text-secondary)', textDecoration: 'none',
                            fontSize: '14px', fontWeight: '500',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = 'var(--color-bg-secondary)'
                            ;(e.currentTarget as HTMLElement).style.color = 'var(--color-text-primary)'
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = ''
                            ;(e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'
                          }}
                        >
                          <item.icon size={15} />
                          {item.label}
                        </Link>
                      ))}

                      <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '6px', paddingTop: '6px' }}>
                        <button
                          onClick={handleLogout}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            width: '100%', padding: '10px 14px', borderRadius: '10px',
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#c98b82', fontSize: '14px', fontWeight: '500',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(201,139,130,0.1)'
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = ''
                          }}
                        >
                          <LogOut size={15} />
                          Выйти
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost hide-mobile">Войти</Link>
                <Link to="/register" className="btn-primary">Регистрация</Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="show-mobile"
              style={{
                background: 'none', border: 'none', color: 'var(--color-text-primary)',
                cursor: 'pointer', padding: '8px', borderRadius: '8px',
              }}
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '72px',
              left: 0,
              right: 0,
              zIndex: 99,
              background: 'var(--glass-strong-bg)',
              backdropFilter: 'blur(30px)',
              borderBottom: '1px solid var(--color-border)',
              padding: '20px 24px 30px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px', margin: '0 auto' }}>
              <Link to="/tutors" className="nav-link" style={{ fontSize: '16px', padding: '14px 16px' }}>
                <Search size={18} /> Найти репетитора
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/dashboard" className="nav-link" style={{ fontSize: '16px', padding: '14px 16px' }}>
                    <User size={18} /> Личный кабинет
                  </Link>
                  <Link to="/bookings" className="nav-link" style={{ fontSize: '16px', padding: '14px 16px' }}>
                    <Calendar size={18} /> Мои уроки
                  </Link>
                  <Link to="/messages" className="nav-link" style={{ fontSize: '16px', padding: '14px 16px' }}>
                    <MessageSquare size={18} /> Сообщения
                  </Link>
                  <button onClick={handleLogout} className="btn-ghost" style={{ fontSize: '16px', color: '#c98b82', justifyContent: 'flex-start', padding: '14px 16px' }}>
                    <LogOut size={18} /> Выйти
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <Link to="/login" className="btn-secondary" style={{ flex: 1 }}>Войти</Link>
                  <Link to="/register" className="btn-primary" style={{ flex: 1 }}>Регистрация</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  )
}
