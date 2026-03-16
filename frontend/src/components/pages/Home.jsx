import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { Sprout, Tag, Briefcase } from "lucide-react"
import "./Home.css"

function Home() {

  const [stats, setStats] = useState({
    products: 0,
    proposals: 0,
    categories: 0
  })

  const [loading, setLoading] = useState(true)

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

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-10">

      {/* Header */}

      <div className="text-center mb-12">

        <h1 className="text-3xl md:text-5xl font-bold text-green-700 flex justify-center items-center gap-3">
          <Sprout size={40} className="text-green-500"/>
          Rayeva AI Dashboard
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          Intelligent AI tools for sustainable commerce
        </p>

      </div>


      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-14">

        <div className="stat-card">
          {loading ? <div className="loader"></div> : stats.products}
          <div className="stat-label">Eco Products</div>
        </div>

        <div className="stat-card">
          {loading ? <div className="loader"></div> : stats.proposals}
          <div className="stat-label">Proposals Generated</div>
        </div>

        <div className="stat-card">
          {loading ? <div className="loader"></div> : stats.categories}
          <div className="stat-label">Categories</div>
        </div>

      </div>


      {/* Feature Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

        {/* Category Generator */}

        <Link to="/category">

          <div className="feature-card">

            <span className="badge">AI POWERED</span>

            <Tag size={50} className="text-green-500 mb-4"/>

            <h2 className="card-title">
              Category Generator
            </h2>

            <p className="card-desc">
              Automatically categorize products with AI. Generate SEO tags and sustainability filters in seconds.
            </p>

            <ul className="feature-list">
              <li>✓ Auto primary category</li>
              <li>✓ 5-10 SEO tags</li>
              <li>✓ Sustainability filters</li>
              <li>✓ Bulk processing</li>
            </ul>

            <button className="primary-btn">
              Try Category Generator →
            </button>

          </div>

        </Link>


        {/* Proposal Generator */}

        <Link to="/proposal">

          <div className="feature-card">

            <span className="badge">B2B FOCUSED</span>

            <Briefcase size={50} className="text-green-500 mb-4"/>

            <h2 className="card-title">
              Proposal Generator
            </h2>

            <p className="card-desc">
              Create sustainable B2B proposals instantly. AI powered product selection within your budget.
            </p>

            <ul className="feature-list">
              <li>✓ Smart product mix</li>
              <li>✓ Budget optimization</li>
              <li>✓ Impact summary</li>
              <li>✓ Cost breakdown</li>
            </ul>

            <button className="primary-btn">
              Try Proposal Generator →
            </button>

          </div>

        </Link>

      </div>


      {/* Footer */}

      <div className="text-center mt-16 text-gray-500 text-sm">
        ✨ Powered by AI • Sustainable Commerce • Real-time Processing
      </div>

    </div>

  )
}

export default Home