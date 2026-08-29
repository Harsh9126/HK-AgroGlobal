import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, Globe, Phone } from 'lucide-react'
import { FirebaseService } from '../services/firebaseService'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [categories, setCategories] = useState([])
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    async function fetchCategories() {
      const data = await FirebaseService.getCategories();
      if (data && data.length > 0) {
        setCategories(data);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(null)
  }, [location])

  const navLinks = [
    { label: 'Home', path: '/' },
    {
      label: 'Products', path: '/products',
      children: categories.length > 0 
        ? categories.map(cat => ({
            label: cat.name,
            path: `/products?category=${cat.slug}`
          }))
        : [
            { label: 'All Products', path: '/products' }
          ]
    },
    { label: 'Export', path: '/export' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ]

  return (
    <>
      {/* Top Bar */}
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-left">
            <Globe size={14} />
            <span>Exporting to 10+ Countries Worldwide</span>
          </div>
          <div className="topbar-right">
            <a href="tel:+919999999999">
              <Phone size={14} />
              +91 99999 99999
            </a>
            <a href="mailto:info@agroglobal.in">info@agroglobal.in</a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <div className="logo-icon">
              <span>AG</span>
            </div>
            <div className="logo-text">
              <span className="logo-primary">HK Agro</span>
              <span className="logo-accent">Global</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.label} className={`nav-item ${link.children ? 'has-dropdown' : ''}`}
                onMouseEnter={() => link.children && setDropdownOpen(link.label)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <NavLink to={link.path} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                  {link.label}
                  {link.children && <ChevronDown size={14} />}
                </NavLink>

                {link.children && (
                  <div className={`dropdown ${dropdownOpen === link.label ? 'open' : ''}`}>
                    <div className="dropdown-inner">
                      {link.children.map((child) => (
                        <Link key={child.path} to={child.path} className="dropdown-link">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="nav-cta">
            <Link to="/request-quote" className="btn btn-accent btn-sm">Request Quote</Link>
          </div>

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle Menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <div key={link.label}>
              <NavLink to={link.path} className="mobile-link">
                {link.label}
              </NavLink>
              {link.children && (
                <div className="mobile-sub">
                  {link.children.map((child) => (
                    <Link key={child.path} to={child.path} className="mobile-sub-link">
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link to="/request-quote" className="btn btn-accent" style={{margin:'16px'}}>Request Quote</Link>
        </div>
      </nav>
    </>
  )
}
