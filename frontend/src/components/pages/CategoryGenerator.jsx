import { useState } from "react"
import API from "../../services/api"
import { Tag, Package, Sparkles, AlertTriangle } from "lucide-react"

function CategoryGenerator() {

  const [productName,setProductName] = useState("")
  const [description,setDescription] = useState("")
  const [result,setResult] = useState(null)
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")
  const [bulkMode,setBulkMode] = useState(false)
  const [bulkProducts,setBulkProducts] = useState("")

  const generateCategories = async () => {

    if(!productName){
      setError("Product name is required")
      return
    }

    try{

      setLoading(true)
      setError("")

      const res = await API.post("/category/generate",{
        productName,
        description:description || undefined
      })

      if(res.data.success){
        setResult(res.data.data)
      }

    }catch(err){

      setError(err.response?.data?.error || "Failed to generate")

    }finally{

      setLoading(false)

    }

  }


  const bulkGenerate = async () => {

    try{

      setLoading(true)
      setError("")

      const lines = bulkProducts.split("\n").filter(l=>l.trim())

      const products = lines.map(line=>{
        const [name,...desc] = line.split("|")

        return{
          productName:name.trim(),
          description:desc.join("|").trim() || undefined
        }

      })

      const res = await API.post("/category/bulk-generate",{products})

      if(res.data.success){
        setResult(res.data.data)
      }

    }catch(err){

      setError(err.response?.data?.error || "Bulk failed")

    }finally{

      setLoading(false)

    }

  }

  return(

  <div className="max-w-5xl mx-auto px-6 py-10">

    <h2 className="text-3xl font-bold text-green-700 flex items-center gap-2 mb-8">

      <Tag className="text-green-500"/>
      AI Auto Category & Tag Generator

    </h2>


    {/* Toggle Buttons */}

    <div className="flex gap-4 mb-6">

      <button
      onClick={()=>setBulkMode(false)}
      className={`px-4 py-2 rounded-md border font-medium
      ${!bulkMode
      ? "bg-green-600 text-white border-green-600"
      : "bg-white border-gray-300 text-gray-700"}`}
      >

      Single Product

      </button>


      <button
      onClick={()=>setBulkMode(true)}
      className={`px-4 py-2 rounded-md border flex items-center gap-2 font-medium
      ${bulkMode
      ? "bg-green-600 text-white border-green-600"
      : "bg-white border-gray-300 text-gray-700"}`}
      >

      <Package size={16}/>
      Bulk Upload

      </button>

    </div>


    {/* Single Mode */}

    {!bulkMode && (

    <div className="bg-white p-8 rounded-xl shadow-md">

      <div className="mb-5">

        <label className="font-semibold block mb-2">
        Product Name *
        </label>

        <input
        value={productName}
        onChange={(e)=>setProductName(e.target.value)}
        placeholder="Bamboo Toothbrush"
        className="w-full border border-gray-300 p-3 rounded-md"
        />

      </div>


      <div className="mb-6">

        <label className="font-semibold block mb-2">
        Description
        </label>

        <textarea
        rows="3"
        value={description}
        onChange={(e)=>setDescription(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded-md"
        />

      </div>


      <button
      onClick={generateCategories}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold
      ${loading
      ? "bg-gray-400 text-white cursor-not-allowed"
      : "bg-green-600 text-white hover:bg-green-700"}`}
      >

      {loading ? "Generating..." : (
      <>
      <Sparkles size={18}/>
      Generate Categories
      </>
      )}

      </button>

    </div>

    )}


    {/* Bulk Mode */}

    {bulkMode && (

    <div className="bg-white p-8 rounded-xl shadow-md">

      <textarea
      rows="8"
      value={bulkProducts}
      onChange={(e)=>setBulkProducts(e.target.value)}
      placeholder="Bamboo Toothbrush | Natural bamboo brush"
      className="w-full border border-gray-300 p-3 rounded-md mb-6 font-mono"
      />

      <button
      onClick={bulkGenerate}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold
      ${loading
      ? "bg-gray-400 text-white"
      : "bg-green-600 text-white hover:bg-green-700"}`}
      >

      {loading ? "Processing..." : (
      <>
      <Sparkles size={18}/>
      Bulk Generate
      </>
      )}

      </button>

    </div>

    )}


    {/* Error */}

    {error && (

    <div className="mt-6 flex items-center gap-2 text-red-600 bg-red-100 p-3 rounded-md">

    <AlertTriangle size={18}/>
    {error}

    </div>

    )}


    {/* Results */}

    {result && !bulkMode && (

    <div className="mt-8 bg-white p-8 rounded-xl shadow-md border border-green-400">

      <h3 className="text-xl font-bold text-green-700 mb-4">

      Generated for {result.productName}

      </h3>


      <span className="bg-green-600 text-white px-4 py-1 rounded-full">

      {result.primaryCategory}

      </span>


      <p className="mt-3 text-gray-600">

      {result.subCategory}

      </p>


      <div className="flex flex-wrap gap-2 mt-4">

      {result.seoTags?.map((tag,i)=>(
      <span key={i} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
      #{tag}
      </span>
      ))}

      </div>


      <div className="flex flex-wrap gap-2 mt-4">

      {result.sustainabilityFilters?.map((filter,i)=>(
      <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
      🌱 {filter}
      </span>
      ))}

      </div>

    </div>

    )}

  </div>

  )

}

export default CategoryGenerator