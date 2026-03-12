// seedProducts.js

const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect(process.env.DB_URL);

async function seedProducts() {

await Product.deleteMany({});

await Product.insertMany([
{
 name: "Bamboo Toothbrush",
 price: 60,
 category: "Personal Care",
 sustainability: ["plastic-free","biodegradable"],
 description: "Eco friendly bamboo toothbrush"
},
{
 name: "Steel Water Bottle",
 price: 300,
 category: "Lifestyle",
 sustainability: ["reusable"],
 description: "Reusable stainless steel bottle"
},
{
 name: "Recycled Notebook",
 price: 120,
 category: "Stationery",
 sustainability: ["recycled"],
 description: "Notebook made from recycled paper"
},
{
 name: "Organic Cotton Tote Bag",
 price: 180,
 category: "Lifestyle",
 sustainability: ["organic","reusable"],
 description: "Eco friendly cotton tote bag"
}
]);

console.log("Products seeded");

process.exit();

}

seedProducts();

