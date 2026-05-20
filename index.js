const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();

// middleware для чтения x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// /login/
app.get('/login/', (req, res) => {

    res.type('text/plain');
    res.send('krander');
});

// /insert/
app.post('/insert/', async (req, res) => {

    // переменная для подключения к mongodb
    let client;

    try {

        // получаем данные из тела запроса
        const { login, password, URL } = req.body;

        // подключаемся к mongodb
        client = await new MongoClient(URL).connect();

        // получаем базу данных
        const db = client.db();

        // добавляем документ в коллекцию users
        await db.collection('users').insertOne({
            login,
            password
        });

        // отправляем успешный ответ
        res.type('text/plain');
        res.send('ok');

    } catch (e) {
        console.error(e);
        res.status(500).send('error');

    } finally {

        // закрываем подключение к mongodb
        if (client) {
            await client.close();
        }
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});