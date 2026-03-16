import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { Home, Tag, Briefcase, Sprout } from "lucide-react"

function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Navigation items
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/category", label: "Category Generator", icon: Tag },
    { path: "/proposal", label: "Proposal Generator", icon: Briefcase },
  ]

  const linkClasses = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-full transition-all
    ${location.pathname === path
      ? "text-yellow-400 bg-white/10 border border-yellow-300 font-semibold"
      : "text-white"
    }
    hover:bg-white/20 hover:-translate-y-0.5`

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300
      ${scrolled
          ? "bg-gradient-to-r from-green-900 to-green-700 shadow-lg py-3"
          : "bg-gradient-to-r from-green-700 to-green-600 py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-2 text-white font-bold text-xl">
          <Sprout className="animate-spin text-green-400" size={26} />
          Rayeva AI System
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path} className={linkClasses(path)}>
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-4 pt-2 bg-green-800">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={linkClasses(path)}
              onClick={() => setMenuOpen(false)}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar