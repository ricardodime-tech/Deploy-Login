const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();

// Configurações
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // Serve seus arquivos CSS/JS

// Conexão com o MongoDB
const MONGODB_URI = "mongodb+srv://ricardodime_db_user:VRm9WGOwTzKb1fiq@cluster0.wxgj33t.mongodb.net/RichardFieldDB?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Conectado ao MongoDB com sucesso!'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Modelo de Usuário
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Rota para Processar o Cadastro
app.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email: email,
            password: hashedPassword
        });

        await newUser.save();
        res.send("<h1>Conta criada com sucesso!</h1><a href='/'>Voltar</a>");
    } catch (error) {
        res.status(500).send("Erro ao criar conta: " + error.message);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});