import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

/**
Premium glassmorphic navigation bar with scroll-spy and mobile responsiveness.
Transitions from transparent to a frosted glass effect on scroll, and highlights
the active section based on the user's viewport position.
*/
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const navigate = useNavigate();
  const { theme, setTheme } = useSettings();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    sections.forEach(section => observer.observe(section));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleLinkClick = () => setMobileOpen(false);

  return (
    <nav className={`ax-navbar ${scrolled ? 'ax-navbar--scrolled' : ''}`}>
      <div className="ax-navbar__brand">
        <span className="ax-navbar__logo">◈</span>
        <span>Axios</span>
      </div>

      <div className={`ax-navbar__links ${mobileOpen ? 'open' : ''}`}>
        <a href="#features" className={activeSection === 'features' ? 'active' : ''} onClick={handleLinkClick}>Capabilities</a>
        <a href="#proof" className={activeSection === 'proof' ? 'active' : ''} onClick={handleLinkClick}>Live Verification</a>
        <a href="#observability" className={activeSection === 'observability' ? 'active' : ''} onClick={handleLinkClick}>Observability</a>
        <a href="#architecture" className={activeSection === 'architecture' ? 'active' : ''} onClick={handleLinkClick}>Architecture</a>
      </div>

      <div className="ax-navbar__actions">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="ax-btn-ghost flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 hover:border-cyan-500 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button className="ax-btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
        <button className="ax-btn-primary-sm" onClick={() => navigate('/register')}>Register</button>
      </div>

      <button className="ax-navbar__mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
        <span className={`hamburger ${mobileOpen ? 'open' : ''}`}></span>
      </button>
    </nav>
  );
};

export default Navbar;