const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();

// разрешаем cors
app.use(cors());

// middleware для чтения x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// /login/
app.get('/login/', (req, res) => {
    res.type('text/plain');
    res.send('krander');
});

// /insert/
app.post('/insert/', async (req, res) => {

    let client;

    try {

        const { login, password, URL } = req.body;

        client = await new MongoClient(URL).connect();

        const db = client.db();

        await db.collection('users').insertOne({
            login,
            password
        });

        res.type('text/plain');
        res.send('ok');

    } catch (e) {

        console.error(e);

        res.status(500).send('error');

    } finally {

        if (client) {
            await client.close();
        }
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});