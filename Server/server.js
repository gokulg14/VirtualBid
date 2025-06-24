const express = require('express');

const regRoute = require('./routes/authRoutes/register');

const mongoose = require('mongoose');

const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use('/auth',regRoute)

mongoose.connect('mongodb+srv://mernStack:mernStack123@cluster0.lppysbf.mongodb.net/VirtualBid?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>{
    console.log('Connected to MongoDB')
})
.catch((err)=>console.log(err));

app.get('/',(req,res)=>{
    res.send("Hello");
})

app.listen(port,()=>{
    console.log('Connected to the server '+port);
})

