const express = require('express');
const authRoute = require('./routes/auth');

const app = express();

app.use(express.json());
app.use('/auth',authRoute);

app.listen(3000, ()=> console.log("let's go 300"));