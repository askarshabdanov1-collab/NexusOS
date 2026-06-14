import { Link } from 'react-router-dom'
import { GraduationCap, Mail, Phone, MapPin, Globe, Send } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      background: 'var(--color-bg-secondary)',
      padding: '80px 24px 40px',
    }}>
      <div style={{ maxWidth: '95%', margin: '0 auto' }}>
        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '48px',
          marginBottom: '64px',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{
                width: '40px', height: '40px',
                background: 'var(--color-accent-primary)',
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(108,126,114,0.15)',
              }}>
                <GraduationCap size={22} color="#FAF6F0" />
              </div>
              <span className="serif-title" style={{
                fontSize: '22px', fontWeight: '700',
                color: 'var(--color-text-primary)',
              }}>
                Nexus Academy
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.7', maxWidth: '260px' }}>
              Премиальная платформа для поиска репетиторов в Кыргызстане. Найдите своего идеального наставника сегодня.
            </p>
            {/* Socials */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              {[
                { icon: Send, label: 'Telegram', href: '#' },
                { icon: Globe, label: 'Сайт', href: '#' },
                { icon: Mail, label: 'Email', href: 'mailto:info@nexusacademy.kg' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  title={label}
                  style={{
                    width: '40px', height: '40px',
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(76, 157, 176, 0.15)'
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent-primary)'
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--color-accent-primary)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--color-bg-secondary)'
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '20px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Платформа
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { to: '/tutors', label: 'Найти репетитора' },
                { to: '/register?role=tutor', label: 'Стать репетитором' },
                { to: '/how-it-works', label: 'Как это работает' },
                { to: '/pricing', label: 'Тарифы' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} style={{
                    fontSize: '14px', color: 'var(--color-text-secondary)',
                    textDecoration: 'none', transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-accent-primary)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '20px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Предметы
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Математика', 'Английский язык', 'Физика', 'Химия', 'Программирование', 'История'].map((subj) => (
                <li key={subj}>
                  <a href={`/tutors?subject=${subj.toLowerCase()}`} style={{
                    fontSize: '14px', color: 'var(--color-text-secondary)',
                    textDecoration: 'none', transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-accent-primary)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'}
                  >
                    {subj}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '20px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Контакты
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icon: Mail, text: 'info@nexusacademy.kg' },
                { icon: Phone, text: '+996 (312) 00-00-00' },
                { icon: MapPin, text: 'Бишкек, Кыргызстан' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px', height: '32px',
                    background: 'rgba(108,126,114,0.08)',
                    border: '1px solid rgba(108,126,114,0.15)',
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={14} color="var(--color-accent-primary)" />
                  </div>
                  <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--color-border)', marginBottom: '32px' }} />

        {/* Bottom */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'space-between', alignItems: 'center', gap: '16px',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
            © 2026 Nexus Academy. Все права защищены.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Политика конфиденциальности', 'Условия использования', 'Оферта'].map((text) => (
              <a key={text} href="#" style={{
                fontSize: '13px', color: 'var(--color-text-tertiary)',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-text-tertiary)'}
              >
                {text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
