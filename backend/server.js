const express = require("express");
const f = require('./index.js');
const cors = require('cors');

const app = express();
app.use(cors())
const PORT = 3000;

app.use(express.json());
app.post('/api', async (req, res)=>{
    res.status(200);
    const {prompt} = req.body;
    const response = await f.response(prompt);

    res.send(JSON.stringify(response.answer));
});

  
app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);