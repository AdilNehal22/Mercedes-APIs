const mongoose = require('mongoose');
const app = require('./mercedes');
const dotenv = require('dotenv');
dotenv.config({path: './.env'});


//setting database
const dataBase = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(dataBase).then(()=>console.log('connected to database'));


//server listening
const port = process.env.PORT || 2000;
app.listen(port, () => {
     console.log(`listening at port ${port}`);
})

