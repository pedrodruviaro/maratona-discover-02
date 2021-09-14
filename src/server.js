const express = require('express')
const routes = require('./routes')

const server = express()
const port = 3000

// abilitar arquivos estaticos  (Criar rotas para cada arquivo)
server.use(express.static('public'))

//configurando view engine com ejs
server.set('view engine', 'ejs')


server.use(routes)

server.listen(port, () => console.log(`Servidor rodando na porta ${port}`))
