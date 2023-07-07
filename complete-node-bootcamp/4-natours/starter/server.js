const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(conn => {
    console.log(conn.connections);
    console.log('DB Connection Successful')
});

const app = require('./app');

const port = process.env.PORT;
// console.log(process.env);

app.listen(port, () => {
    console.log(`App running on ${port}...`);
});