const express = require("express")
const app = express()
const mysql = require("mysql2")
const { check, validationResult } = require('express-validator');
require('dotenv').config()
app.use(express.json())
const banco = mysql.createPool({
    host: process.env.db_host, user: process.env.db_user, password: process.env.db_password, database: process.env.DB_DB
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.get('/contas', (req, res) => {
    banco.query("SELECT * FROM `clientes`", (err, resp) => {
        err = null ? console.log(err) : res.send(resp);
    })
})



app.post('/cadastrar', [check('nome').isLength({ max: 3 })] ,(req, res) => {
    const erros = validationResult(req)
    if(erros.isEmpty()){
        return res.send('o nome deve conter no minimo 3 letras');
    }

    const { nome, contato, endereco, descricao } = req.body
    banco.query("INSERT INTO `clientes` (nome,contato,endereco,descricao) VALUES (?,?,?,?)", [nome, contato, endereco, descricao], (err, resp) => {
        err = null ? console.log(err) : res.send(nome + " foi cadastrado com sucesso");
    })
})

app.delete('/deletar', (req, res) => {
    const { nome } = req.body
    banco.query("DELETE FROM clientes WHERE nome=(?)", [nome], (err, resp) => {
        err = null ? console.log(err) : res.send('O usuario ' + nome + ' foi deletado com sucesso');
    })
})

app.put('/editar', (req, res) => {
    const { descricao, nome } = req.body
    banco.query("UPDATE clientes SET descricao=? WHERE nome=?", [descricao, nome], (err, resp) => {
        err = null ? console.log(err) : res.send("Decriçao do usuario " + nome + " foi alterada com sucesso");
        console.log(resp);
    })
})



app.listen(5000)