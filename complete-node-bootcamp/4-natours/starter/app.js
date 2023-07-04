const express = require('express');
const app = express();

const port = 8080;

app.get('/', (req, res) => {
    res.status(200)
        .json({message: 'Hello from the server side!', app: 'Natours'});
});

app.post('/', (req, res) => {
    res.send('You can post to this endpoint');
});

app.listen(port, () => {
    console.log(`App running on ${port}...`);
})