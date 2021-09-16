const express = require('express')
const routes = require('./routes')
const path = require('path')

const server = express()
const port = 3000

// abilitar arquivos estaticos  (Criar rotas para cada arquivo)
server.use(express.static('public'))

//configurando view engine com ejs
server.set('view engine', 'ejs')

// mudando a localizacao da pasta views
server.set('views', path.join(__dirname, 'views'))

// configurando decode dos formularios
server.use(express.urlencoded({urlencoded: true})) 


server.use(routes)


server.listen(port, () => console.log(`Servidor rodando na porta ${port}`))
