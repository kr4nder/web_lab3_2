const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

const LOGIN = 'krander';

// чтобы читать x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// схема
const UserSchema = new mongoose.Schema({
    login: String,
    password: String
});

// модель
const User = mongoose.model('User', UserSchema, 'users');

// /login/
app.get('/login/', (req, res) => {
    res.type('text/plain');
    res.send(LOGIN);
});

// /insert/
app.post('/insert/', async (req, res) => {
    try {
        const { login, password, URL } = req.body;

        // подключение к mongodb
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // создание документа
        const user = new User({
            login,
            password
        });

        await user.save();

        res.type('text/plain');
        res.send('ok');

    } catch (e) {
        console.error(e);

        res.status(500).send('error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});