const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
    console.log(err);
    process.exit(1);
    
});

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(conn => {
    // console.log(conn.connections);
    console.log('DB Connection Successful')
}).catch(e => console.log(e));

const app = require('./app');

const port = process.env.PORT;
// console.log(process.env);

const server = app.listen(port, () => {
    console.log(`App running on ${port}...`);
});

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});