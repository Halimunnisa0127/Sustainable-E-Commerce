// ProposalGenerator.jsx
import { useState } from "react"
import API from "../services/api"

function ProposalGenerator() {
  const [eventType, setEventType] = useState("")
  const [budget, setBudget] = useState("")
  const [requirement, setRequirement] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const generateProposal = async () => {
    // Validate inputs
    if (!eventType || !budget || !requirement) {
      setError("Please fill in all fields")
      return
    }

    try {
      setLoading(true)
      setError("")
      
      const res = await API.post("/proposal/generate", {
        eventType,
        budget: Number(budget), // Convert to number
        requirement
      })

      console.log("API Response:", res.data) // For debugging

      // ✅ FIXED: Extract data from the new response format
      if (res.data.success) {
        setResult(res.data.data)
      } else {
        // Fallback for old format
        setResult(res.data)
      }

    } catch (err) {
      console.error("Error:", err)
      setError(err.response?.data?.error || "Failed to generate proposal")
    } finally {
      setLoading(false)
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div style={{ 
      padding: "40px",
      maxWidth: "800px",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif"
    }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "30px" }}>
        🌱 AI B2B Proposal Generator
      </h2>

      {/* Input Form */}
      <div style={{
        background: "#f8f9fa",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Event Type:
          </label>
          <input
            placeholder="e.g., Corporate Event, Conference, Wedding"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Budget (₹):
          </label>
          <input
            type="number"
            placeholder="e.g., 50000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Requirement:
          </label>
          <textarea
            placeholder="e.g., Eco gifts, Office supplies, Sustainable products"
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            rows="3"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              fontSize: "16px",
              resize: "vertical"
            }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            color: "#dc3545",
            marginBottom: "15px",
            padding: "10px",
            background: "#f8d7da",
            borderRadius: "5px"
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={generateProposal}
          disabled={loading}
          style={{
            background: loading ? "#6c757d" : "#28a745",
            color: "white",
            padding: "12px 30px",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.3s"
          }}
        >
          {loading ? "Generating..." : "🎯 Generate Proposal"}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div style={{
          marginTop: "40px",
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          border: "1px solid #28a745"
        }}>
          <h3 style={{ 
            color: "#28a745", 
            marginBottom: "20px",
            borderBottom: "2px solid #28a745",
            paddingBottom: "10px"
          }}>
            ✅ Proposal Result
          </h3>

          {/* Products List */}
          {result.products && result.products.length > 0 ? (
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ color: "#2c3e50", marginBottom: "10px" }}>
                Selected Products:
              </h4>
              <table style={{
                width: "100%",
                borderCollapse: "collapse"
              }}>
                <thead>
                  <tr style={{ background: "#f8f9fa" }}>
                    <th style={tableHeaderStyle}>Product</th>
                    <th style={tableHeaderStyle}>Qty</th>
                    <th style={tableHeaderStyle}>Unit Price</th>
                    <th style={tableHeaderStyle}>Total</th>
                    <th style={tableHeaderStyle}>Eco Features</th>
                  </tr>
                </thead>
                <tbody>
                  {result.products.map((product, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={tableCellStyle}>{product.name}</td>
                      <td style={tableCellStyle}>{product.quantity}</td>
                      <td style={tableCellStyle}>{formatCurrency(product.unitPrice)}</td>
                      <td style={tableCellStyle}>{formatCurrency(product.estimatedCost)}</td>
                      <td style={tableCellStyle}>
                        {product.sustainability?.map((tag, i) => (
                          <span key={i} style={{
                            background: "#e8f5e9",
                            color: "#28a745",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            margin: "0 2px",
                            display: "inline-block"
                          }}>
                            {tag}
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No products selected</p>
          )}

          {/* Budget Summary */}
          {result.budget && (
            <div style={{
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "5px",
              marginBottom: "20px"
            }}>
              <h4 style={{ color: "#2c3e50", marginBottom: "10px" }}>
                Budget Summary:
              </h4>
              <p><strong>Total Cost:</strong> {formatCurrency(result.totalCost)}</p>
              <p><strong>Budget:</strong> {formatCurrency(result.budget.total)}</p>
              <p><strong>Remaining:</strong> {formatCurrency(result.budget.remaining)}</p>
              <div style={{
                width: "100%",
                background: "#e9ecef",
                height: "20px",
                borderRadius: "10px",
                marginTop: "10px"
              }}>
                <div style={{
                  width: `${(result.budget.allocated / result.budget.total) * 100}%`,
                  background: result.budget.remaining > 0 ? "#28a745" : "#dc3545",
                  height: "20px",
                  borderRadius: "10px",
                  transition: "width 0.3s"
                }} />
              </div>
            </div>
          )}

          {/* Impact Summary */}
          <div style={{
            background: "#e8f5e9",
            padding: "20px",
            borderRadius: "5px",
            borderLeft: "4px solid #28a745"
          }}>
            <h4 style={{ color: "#2c3e50", marginBottom: "10px" }}>
              🌍 Environmental Impact:
            </h4>
            <p style={{ lineHeight: "1.6", color: "#2c3e50" }}>
              {result.impactSummary}
            </p>
          </div>

          {/* Summary Stats */}
          {result.summary && (
            <div style={{
              display: "flex",
              gap: "20px",
              marginTop: "20px",
              padding: "15px",
              background: "#f8f9fa",
              borderRadius: "5px"
            }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <strong style={{ color: "#28a745", fontSize: "24px" }}>
                  {result.summary.productCount}
                </strong>
                <p style={{ margin: "5px 0 0", color: "#6c757d" }}>Products</p>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <strong style={{ color: "#28a745", fontSize: "24px" }}>
                  {result.summary.totalItems}
                </strong>
                <p style={{ margin: "5px 0 0", color: "#6c757d" }}>Total Items</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Table styles
const tableHeaderStyle = {
  padding: "10px",
  textAlign: "left",
  fontWeight: "bold",
  color: "#2c3e50"
}

const tableCellStyle = {
  padding: "10px",
  color: "#2c3e50"
}

export default ProposalGenerator