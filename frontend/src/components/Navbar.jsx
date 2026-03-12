import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  // Change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navStyle = {
    padding: scrolled ? "10px 40px" : "15px 40px",
    margin: "0",
    background: scrolled 
      ? "linear-gradient(135deg, #1a472a 0%, #2d6a4f 100%)" 
      : "linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: scrolled 
      ? "0 4px 20px rgba(0,0,0,0.2)" 
      : "0 2px 10px rgba(0,0,0,0.1)",
    position: "sticky",
    top: "0",
    left: "0",
    right: "0",
    width: "100vw", // Full viewport width
    minHeight: scrolled ? "60px" : "70px", // Adjust height as needed
    boxSizing: "border-box", // Ensures padding doesn't add to width
    zIndex: 1000,
    transition: "all 0.3s ease"
  }

  const logoStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  }

  const logoIconStyle = {
    fontSize: "28px",
    animation: "spin 4s linear infinite"
  }

  const navLinksStyle = {
    display: "flex",
    gap: "30px",
    alignItems: "center"
  }

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#ffd60a" : "#fff",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: location.pathname === path ? "600" : "400",
    padding: "8px 16px",
    borderRadius: "20px",
    background: location.pathname === path ? "rgba(255,255,255,0.1)" : "transparent",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: location.pathname === path ? "1px solid rgba(255,214,10,0.3)" : "1px solid transparent",
    cursor: "pointer"
  })

  const linkHoverStyle = {
    background: "rgba(255,255,255,0.15)",
    transform: "translateY(-2px)"
  }

  const badgeStyle = {
    background: "#ffd60a",
    color: "#2d6a4f",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
    marginLeft: "5px"
  }

  // Add this to remove default body margin
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    
    return () => {
      // Cleanup (optional - if you want to restore when component unmounts)
      document.body.style.margin = "";
      document.body.style.padding = "";
    };
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .nav-link:hover {
            background: rgba(255,255,255,0.15) !important;
            transform: translateY(-2px);
          }
          
          /* Remove default body margin */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 0;
            overflow-x: hidden; /* Prevent horizontal scroll */
          }
        `}
      </style>
      
      <nav style={navStyle}>
        <div style={logoStyle}>
          <span style={logoIconStyle}>🌱</span>
          <span>Rayeva AI System</span>
          <span style={badgeStyle}>v2.0</span>
        </div>

        <div style={navLinksStyle}>
          <Link 
            to="/" 
            style={linkStyle('/')}
            className="nav-link"
            onMouseEnter={(e) => Object.assign(e.target.style, linkHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.target.style, linkStyle('/'))}
          >
            <span>🏠</span> Home
          </Link>

          <Link 
            to="/category" 
            style={linkStyle('/category')}
            className="nav-link"
            onMouseEnter={(e) => Object.assign(e.target.style, linkHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.target.style, linkStyle('/category'))}
          >
            <span>🏷️</span> Category Generator
          </Link>

          <Link 
            to="/proposal" 
            style={linkStyle('/proposal')}
            className="nav-link"
            onMouseEnter={(e) => Object.assign(e.target.style, linkHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.target.style, linkStyle('/proposal'))}
          >
            <span>💼</span> Proposal Generator
          </Link>
        </div>
      </nav>
    </>
  )
}

export default Navbar