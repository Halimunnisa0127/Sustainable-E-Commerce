import { useState } from "react"
import API from "../../services/api"
import { Leaf, Sparkles, AlertTriangle } from "lucide-react"
import "./ProposalGenerator.css"

function ProposalGenerator() {

  const [eventType, setEventType] = useState("")
  const [budget, setBudget] = useState("")
  const [requirement, setRequirement] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const generateProposal = async () => {

    if (!eventType || !budget || !requirement) {
      setError("Please fill in all fields")
      return
    }

    try {

      setLoading(true)
      setError("")

      const res = await API.post("/proposal/generate", {
        eventType,
        budget: Number(budget),
        requirement
      })

      if (res.data.success) {
        setResult(res.data.data)
      } else {
        setResult(res.data)
      }

    } catch (err) {

      setError(err.response?.data?.error || "Failed to generate proposal")

    } finally {

      setLoading(false)

    }

  }

  const formatCurrency = (amount) => {

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0
    }).format(amount)

  }

  return (

    <div className="proposal-container">

      {/* Title */}

      <h2 className="proposal-title">

        <Leaf className="text-green-500" size={32}/>
        AI B2B Proposal Generator

      </h2>


      {/* Form */}

      <div className="proposal-card">

        <div className="input-group">

          <label>Event Type</label>

          <input
            placeholder="Corporate Event, Conference..."
            value={eventType}
            onChange={(e)=>setEventType(e.target.value)}
          />

        </div>


        <div className="input-group">

          <label>Budget (₹)</label>

          <input
            type="number"
            placeholder="50000"
            value={budget}
            onChange={(e)=>setBudget(e.target.value)}
          />

        </div>


        <div className="input-group">

          <label>Requirement</label>

          <textarea
            rows="3"
            placeholder="Eco gifts, sustainable products..."
            value={requirement}
            onChange={(e)=>setRequirement(e.target.value)}
          />

        </div>


        {error && (

          <div className="error-box">

            <AlertTriangle size={18}/>
            {error}

          </div>

        )}


        <button
          className="generate-btn"
          disabled={loading}
          onClick={generateProposal}
        >

          {loading ? "Generating..." : (
            <>
              <Sparkles size={18}/>
              Generate Proposal
            </>
          )}

        </button>

      </div>


      {/* Results */}

      {result && (

        <div className="result-card">

          <h3 className="result-title">

            Proposal Result

          </h3>


          {/* Products */}

          {result.products?.length > 0 && (

            <div className="table-container">

              <table>

                <thead>

                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Eco</th>
                  </tr>

                </thead>

                <tbody>

                  {result.products.map((p,i)=>(
                    <tr key={i}>
                      <td>{p.name}</td>
                      <td>{p.quantity}</td>
                      <td>{formatCurrency(p.unitPrice)}</td>
                      <td>{formatCurrency(p.estimatedCost)}</td>

                      <td className="eco-tags">

                        {p.sustainability?.map((tag,i)=>(
                          <span key={i}>
                            {tag}
                          </span>
                        ))}

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          )}


          {/* Budget */}

          {result.budget && (

            <div className="budget-box">

              <p>Total Cost: {formatCurrency(result.totalCost)}</p>
              <p>Budget: {formatCurrency(result.budget.total)}</p>
              <p>Remaining: {formatCurrency(result.budget.remaining)}</p>

              <div className="budget-bar">

                <div
                  style={{
                    width:`${(result.budget.allocated/result.budget.total)*100}%`
                  }}
                />

              </div>

            </div>

          )}


          {/* Impact */}

          <div className="impact-box">

            <h4>Environmental Impact</h4>

            <p>{result.impactSummary}</p>

          </div>

        </div>

      )}

    </div>

  )

}

export default ProposalGenerator