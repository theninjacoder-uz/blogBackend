const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const config = require('./config/default.json');


const app = express();

// Use Middlewares
app.use(express.json());
app.use(cookieParser());

//connect to mongodb
const db = config.mongoURI;
mongoose.connect(db, {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// routes

app.use('/auth', require('./routes/authRoute'));
app.use('/', require('./routes/postRoute'));

// PORT env variable
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server is listening on port ${port}`));