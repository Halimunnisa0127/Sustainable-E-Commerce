import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

function Home() {
  const [stats, setStats] = useState({
    products: 0,
    proposals: 0,
    categories: 0
  })
  const [loading, setLoading] = useState(true)

  // Simulate loading stats
  useEffect(() => {
    setTimeout(() => {
      setStats({
        products: 7,
        proposals: 24,
        categories: 6
      })
      setLoading(false)
    }, 1000)
  }, [])

  const containerStyle = {
    minHeight: "calc(100vh - 80px)",
    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
    padding: "40px"
  }

  const headerStyle = {
    textAlign: "center",
    marginBottom: "50px"
  }

  const titleStyle = {
    fontSize: "48px",
    color: "#2d6a4f",
    marginBottom: "10px",
    fontWeight: "bold",
    textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
  }

  const subtitleStyle = {
    fontSize: "20px",
    color: "#495057",
    marginBottom: "30px"
  }

  const statsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    maxWidth: "800px",
    margin: "0 auto 50px auto"
  }

  const statCardStyle = {
    background: "white",
    padding: "25px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer"
  }

  const statNumberStyle = {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#2d6a4f",
    marginBottom: "5px"
  }

  const statLabelStyle = {
    fontSize: "14px",
    color: "#6c757d",
    textTransform: "uppercase",
    letterSpacing: "1px"
  }

  const cardsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "30px",
    maxWidth: "900px",
    margin: "0 auto"
  }

  const cardStyle = {
    background: "white",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    cursor: "pointer"
  }

  const cardHoverStyle = {
    transform: "translateY(-10px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
  }

  const cardIconStyle = {
    fontSize: "60px",
    marginBottom: "20px"
  }

  const cardTitleStyle = {
    fontSize: "28px",
    color: "#2d6a4f",
    marginBottom: "15px",
    fontWeight: "bold"
  }

  const cardDescStyle = {
    color: "#6c757d",
    marginBottom: "25px",
    lineHeight: "1.6"
  }

  const featureListStyle = {
    textAlign: "left",
    marginBottom: "30px",
    paddingLeft: "20px"
  }

  const featureItemStyle = {
    marginBottom: "8px",
    color: "#495057",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  }

  const buttonStyle = {
    background: "linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)",
    color: "white",
    border: "none",
    padding: "12px 30px",
    borderRadius: "25px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    width: "100%",
    boxShadow: "0 4px 6px rgba(45,106,79,0.2)"
  }

  const badgeStyle = {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "#ffd60a",
    color: "#2d6a4f",
    padding: "5px 15px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "bold"
  }

  const loadingStyle = {
    width: "50px",
    height: "50px",
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #2d6a4f",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "20px auto"
  }

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.2);
          }
          
          .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          }
          
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(45,106,79,0.3);
          }
        `}
      </style>

      <div style={headerStyle}>
        <h1 style={titleStyle}>🌱 Rayeva AI Dashboard</h1>
        <p style={subtitleStyle}>Intelligent AI tools for sustainable commerce</p>
      </div>

      {/* Stats Section */}
      <div style={statsGridStyle}>
        <div 
          className="stat-card"
          style={statCardStyle}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={statNumberStyle}>
            {loading ? <div style={loadingStyle}></div> : stats.products}
          </div>
          <div style={statLabelStyle}>Eco Products</div>
        </div>

        <div 
          className="stat-card"
          style={statCardStyle}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={statNumberStyle}>
            {loading ? <div style={loadingStyle}></div> : stats.proposals}
          </div>
          <div style={statLabelStyle}>Proposals Generated</div>
        </div>

        <div 
          className="stat-card"
          style={statCardStyle}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={statNumberStyle}>
            {loading ? <div style={loadingStyle}></div> : stats.categories}
          </div>
          <div style={statLabelStyle}>Categories</div>
        </div>
      </div>

      {/* Main Cards */}
      <div style={cardsGridStyle}>
        {/* Category Generator Card */}
        <Link to="/category" style={{ textDecoration: "none" }}>
          <div 
            className="feature-card"
            style={cardStyle}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, cardHoverStyle)
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'
            }}
          >
            <span style={badgeStyle}>AI-POWERED</span>
            <div style={cardIconStyle}>🏷️</div>
            <h2 style={cardTitleStyle}>Category Generator</h2>
            <p style={cardDescStyle}>
              Automatically categorize products with AI. Generate SEO tags and sustainability filters in seconds.
            </p>
            
            <div style={featureListStyle}>
              <div style={featureItemStyle}>
                <span style={{color: "#2d6a4f"}}>✓</span> Auto primary category
              </div>
              <div style={featureItemStyle}>
                <span style={{color: "#2d6a4f"}}>✓</span> 5-10 SEO tags
              </div>
              <div style={featureItemStyle}>
                <span style={{color: "#2d6a4f"}}>✓</span> Sustainability filters
              </div>
              <div style={featureItemStyle}>
                <span style={{color: "#2d6a4f"}}>✓</span> Bulk processing
              </div>
            </div>

            <button 
              className="btn"
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #40916c 0%, #52b788 100%)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)'
              }}
            >
              Try Category Generator →
            </button>
          </div>
        </Link>

        {/* Proposal Generator Card */}
        <Link to="/proposal" style={{ textDecoration: "none" }}>
          <div 
            className="feature-card"
            style={cardStyle}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, cardHoverStyle)
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'
            }}
          >
            <span style={badgeStyle}>B2B FOCUSED</span>
            <div style={cardIconStyle}>💼</div>
            <h2 style={cardTitleStyle}>Proposal Generator</h2>
            <p style={cardDescStyle}>
              Create sustainable B2B proposals instantly. AI-powered product selection within your budget.
            </p>
            
            <div style={featureListStyle}>
              <div style={featureItemStyle}>
                <span style={{color: "#2d6a4f"}}>✓</span> Smart product mix
              </div>
              <div style={featureItemStyle}>
                <span style={{color: "#2d6a4f"}}>✓</span> Budget optimization
              </div>
              <div style={featureItemStyle}>
                <span style={{color: "#2d6a4f"}}>✓</span> Impact summary
              </div>
              <div style={featureItemStyle}>
                <span style={{color: "#2d6a4f"}}>✓</span> Cost breakdown
              </div>
            </div>

            <button 
              className="btn"
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #40916c 0%, #52b788 100%)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)'
              }}
            >
              Try Proposal Generator →
            </button>
          </div>
        </Link>
      </div>

      {/* Footer Note */}
      <div style={{
        textAlign: "center",
        marginTop: "50px",
        color: "#6c757d",
        fontSize: "14px"
      }}>
        <p>✨ Powered by AI • Sustainable Commerce • Real-time Processing</p>
      </div>
    </div>
  )
}

export default Home