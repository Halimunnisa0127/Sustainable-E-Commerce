// CategoryGenerator.jsx
import { useState } from "react"
import API from "../services/api"

function CategoryGenerator() {
  const [productName, setProductName] = useState("")
  const [description, setDescription] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [bulkMode, setBulkMode] = useState(false)
  const [bulkProducts, setBulkProducts] = useState("")

  const generateCategories = async () => {
    if (!productName) {
      setError("Product name is required")
      return
    }

    try {
      setLoading(true)
      setError("")
      
      const res = await API.post("/category/generate", {
        productName,
        description: description || undefined
      })

      if (res.data.success) {
        setResult(res.data.data)
      } else {
        setError(res.data.error)
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate categories")
    } finally {
      setLoading(false)
    }
  }

  const bulkGenerate = async () => {
    try {
      setLoading(true)
      setError("")
      
      // Parse bulk input (one product per line, format: "Product Name | Description")
      const lines = bulkProducts.split('\n').filter(line => line.trim())
      const products = lines.map(line => {
        const [name, ...descParts] = line.split('|')
        return {
          productName: name.trim(),
          description: descParts.join('|').trim() || undefined
        }
      })

      const res = await API.post("/category/bulk-generate", { products })

      if (res.data.success) {
        setResult(res.data.data)
      }
    } catch (err) {
      setError(err.response?.data?.error || "Bulk generation failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "30px" }}>
        🏷️ AI Auto-Category & Tag Generator
      </h2>

      {/* Mode Toggle */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setBulkMode(false)}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            background: !bulkMode ? "#007bff" : "#f8f9fa",
            color: !bulkMode ? "white" : "#2c3e50",
            border: "1px solid #dee2e6",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Single Product
        </button>
        <button
          onClick={() => setBulkMode(true)}
          style={{
            padding: "10px 20px",
            background: bulkMode ? "#007bff" : "#f8f9fa",
            color: bulkMode ? "white" : "#2c3e50",
            border: "1px solid #dee2e6",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Bulk Upload
        </button>
      </div>

      {!bulkMode ? (
        // Single Product Mode
        <div style={{
          background: "#f8f9fa",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Product Name *
            </label>
            <input
              placeholder="e.g., Bamboo Toothbrush"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
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
              Description (Optional)
            </label>
            <textarea
              placeholder="Product description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                fontSize: "16px"
              }}
            />
          </div>

          <button
            onClick={generateCategories}
            disabled={loading}
            style={{
              background: loading ? "#6c757d" : "#007bff",
              color: "white",
              padding: "12px 30px",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Generating..." : "🎯 Generate Categories"}
          </button>
        </div>
      ) : (
        // Bulk Mode
        <div style={{
          background: "#f8f9fa",
          padding: "30px",
          borderRadius: "10px"
        }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Enter Products (one per line, format: "Product Name | Description")
            </label>
            <textarea
              placeholder="Bamboo Toothbrush | Natural bamboo toothbrush&#10;Cotton Bag | Organic cotton tote bag&#10;Steel Water Bottle | 500ml stainless steel"
              value={bulkProducts}
              onChange={(e) => setBulkProducts(e.target.value)}
              rows="8"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                fontSize: "14px",
                fontFamily: "monospace"
              }}
            />
          </div>

          <button
            onClick={bulkGenerate}
            disabled={loading}
            style={{
              background: loading ? "#6c757d" : "#28a745",
              color: "white",
              padding: "12px 30px",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Processing..." : "📦 Bulk Generate"}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          color: "#dc3545",
          marginTop: "20px",
          padding: "10px",
          background: "#f8d7da",
          borderRadius: "5px"
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{ marginTop: "30px" }}>
          {bulkMode ? (
            // Bulk Results
            <div>
              <h3 style={{ color: "#28a745" }}>✅ Bulk Generation Complete</h3>
              <div style={{
                display: "flex",
                gap: "20px",
                marginBottom: "20px"
              }}>
                <div style={{ flex: 1, textAlign: "center", padding: "20px", background: "#d4edda", borderRadius: "5px" }}>
                  <strong style={{ fontSize: "24px", color: "#28a745" }}>{result.successful}</strong>
                  <p>Successful</p>
                </div>
                <div style={{ flex: 1, textAlign: "center", padding: "20px", background: "#f8d7da", borderRadius: "5px" }}>
                  <strong style={{ fontSize: "24px", color: "#dc3545" }}>{result.failed}</strong>
                  <p>Failed</p>
                </div>
              </div>
              
              {result.results?.map((item, index) => (
                <div key={index} style={{
                  background: "#f8f9fa",
                  padding: "20px",
                  marginBottom: "15px",
                  borderRadius: "5px",
                  borderLeft: "4px solid #28a745"
                }}>
                  <h4>{item.productName}</h4>
                  <p><strong>Category:</strong> {item.primaryCategory} → {item.subCategory}</p>
                  <p><strong>Tags:</strong> {item.seoTags?.join(', ')}</p>
                  <p><strong>Sustainability:</strong> {item.sustainabilityFilters?.join(', ')}</p>
                </div>
              ))}
            </div>
          ) : (
            // Single Product Results
            <div style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              border: "1px solid #007bff"
            }}>
              <h3 style={{ color: "#007bff", marginBottom: "20px" }}>
                ✅ Generated Categories for: {result.productName}
              </h3>

              <div style={{ marginBottom: "20px" }}>
                <strong>Primary Category:</strong>
                <span style={{
                  background: "#007bff",
                  color: "white",
                  padding: "5px 15px",
                  borderRadius: "20px",
                  marginLeft: "10px"
                }}>
                  {result.primaryCategory}
                </span>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <strong>Sub-Category:</strong> {result.subCategory}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <strong>SEO Tags:</strong>
                <div style={{ marginTop: "10px" }}>
                  {result.seoTags?.map((tag, i) => (
                    <span key={i} style={{
                      background: "#e9ecef",
                      padding: "5px 12px",
                      borderRadius: "15px",
                      margin: "0 5px 5px 0",
                      display: "inline-block"
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <strong>Sustainability Filters:</strong>
                <div style={{ marginTop: "10px" }}>
                  {result.sustainabilityFilters?.map((filter, i) => (
                    <span key={i} style={{
                      background: "#d4edda",
                      color: "#28a745",
                      padding: "5px 12px",
                      borderRadius: "15px",
                      margin: "0 5px 5px 0",
                      display: "inline-block",
                      fontWeight: "bold"
                    }}>
                      🌱 {filter}
                    </span>
                  ))}
                </div>
              </div>

              {result.reasoning && (
                <div style={{
                  background: "#f8f9fa",
                  padding: "15px",
                  borderRadius: "5px",
                  marginTop: "20px"
                }}>
                  <strong>AI Reasoning:</strong>
                  <p style={{ marginTop: "5px", color: "#6c757d" }}>{result.reasoning}</p>
                </div>
              )}

              <div style={{
                marginTop: "20px",
                fontSize: "12px",
                color: "#6c757d",
                textAlign: "right"
              }}>
                Confidence: {(result.confidence * 100).toFixed(0)}% | 
                Generated: {new Date(result.metadata?.generatedAt).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CategoryGenerator