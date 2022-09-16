const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { response } = require('express');
require('dotenv').config();
const app = express();


const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@jsxwarehouse.vhkoedh.mongodb.net/test`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }); 

async function run(){


  
  
  




    try{
        await client.connect();
        const productCollection = client.db('product').collection('product-collection')


        app.get('/products',  async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const product = await cursor.toArray();
            res.send(product);
        });

       
        app.get("/product/:id", async (req, resp) => {
          let result = await productCollection.findOne();
         if(result){
          resp.send(result)
         }else{
          resp.send({result: "No Record Found."})
         }
        })







      
        app.post("/products", async(req, res) => {
          const pressureData = req.body;
          const result = await productCollection.insertOne(pressureData);
          res.send({success: true,  result});
        })
        
        //Delete Product
        app.delete('/products/:id', async(req, res) => {
       const result = productCollection.deleteOne({_id:req.params.id})
       res.send(result);
        })


       //update the services
       app.put('/products/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const updatedQuantity = req.body;
        console.log(updatedQuantity);
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updatedValue = {
            "$inc": {
                  "sold": -updatedQuantity.sold ,"available": updatedQuantity.available, "amount" : updatedQuantity.amount
            }
        };
        console.log(updatedValue);
        const result = await productCollection.findOneAndUpdate(filter, updatedValue, options);
        res.send(result);

    })



    }





finally{

}

}
run().catch(console.dir);







app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`jsxWarehouse app listening on port ${port}`)
})