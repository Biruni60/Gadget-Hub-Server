const express=require('express')
require('dotenv').config()
const app=express();
const cors = require('cors')
const port=process.env.PORT||5000;

app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjhyf9f.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const productCollection=client.db('productDB').collection('products');
    const cartCollection=client.db('productDB').collection('cart')


      app.get('/allproduct',async(req,res)=>{
      const result= await productCollection.find().toArray();
      res.send(result)
  })
      app.get('/cart',async(req,res)=>{
      const result= await cartCollection.find().toArray();
      res.send(result)
  })

      app.get('/products/:id',async(req,res)=>{
        const brand=req.params.id;
        
        const query={brandName:brand};
        const result=await productCollection.find(query).toArray();
        res.send(result);

      })
      app.get('/brand/:id',async(req,res)=>{
        const id=req.params.id;
        
        const query={_id:new ObjectId(id)};
        const result=await productCollection.findOne(query);
        res.send(result);

      })
      app.get('/update/:id',async(req,res)=>{
        const id=req.params.id;
        
        const query={_id:new ObjectId(id)};
        const result=await productCollection.findOne(query);
        res.send(result);

      })



      app.post('/allproduct',async(req,res)=>{
        const product=req.body;
        const result=await productCollection.insertOne(product)
        res.send(result)
      })
      app.post('/cart',async(req,res)=>{
        const product=req.body;
        const result=await cartCollection.insertOne(product)
        res.send(result)
      })
    
      app.put('/update/:id',async(req,res)=>{
        const id=req.params.id ;
        const product=req.body;
        const filter={_id:new ObjectId(id)};
        const options = { upsert: true };
      const updateProduct={
        $set:{
          name:product.name,
          image:product.image,
          brandName:product.brandName,
          type:product.type,
          price:product.price,
          rating:product.rating
        }
      }
        const result=await productCollection.updateOne(filter,updateProduct,options)
        res.send(result)
        
      })
      app.delete("/cart/:id",async(req,res)=>{
        const id=req.params.id
        const query={_id:new ObjectId(id)};
        const result=await cartCollection.deleteOne(query)
        res.send(result)
      })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('gadgethub is running');
})
app.listen(port,()=>{
    console.log(`running on ${port}`);
})