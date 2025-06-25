const express = require('express');

require('dotenv').config();

const regRoute = require('./routes/authRoutes/register');

const loginRoute = require('./routes/authRoutes/login');

const logoutRoute = require('./routes/authRoutes/logout')

const protectedRoute = require('./routes/authRoutes/protected');

const mongoose = require('mongoose');

const cors = require('cors');

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use('/auth',regRoute);
app.use('/auth',loginRoute);
app.use('/auth',protectedRoute);
app.use('/auth',logoutRoute);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err));

app.get('/',(req,res)=>{
    res.send("Hello");
})

app.listen(port,()=>{
    console.log('Connected to the server '+port);
})

