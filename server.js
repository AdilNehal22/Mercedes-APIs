const app = require('./mercedes');

//server listening
const port = 2000
app.listen(port, () => {
     console.log(`listening at port ${port}`);
})
