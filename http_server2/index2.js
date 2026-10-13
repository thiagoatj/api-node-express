// INTRODUÇÃO-1 AO EXPRESS
// Não esquecer npm i express
const express = require('express')
const app = express();
// Ou simplesmente
// const app = require('express')();
// OBS.: __dirname é uma variável de ambiente do Node que informa o caminho
// absoluto do diretório que contém o arquivo em execução no momento
// ROTAS dos arquivos html
app.get("/", (req, res) => {
res.sendFile(__dirname + '/home.html');
})
app.get("/fale_conosco", (req, res) => {
res.sendFile(__dirname + '/fale_conosco.html');
})
app.get("/quem_somos", (req, res) => {
res.sendFile(__dirname + '/quem_somos.html');
})
// Especificando um função de middleware para o caso de rota inexistente
function midNotFound(req, res, next) {
// res.status(404);
// res.sendFile(__dirname + '/not_found_404.html');
// Ou simplesmente
res.status(404).sendFile(__dirname + '/not_found_404.html');
};
// Setando o middleware a ser executado
// antes de qualquer rota a partir da raiz
// app.use('/', midNotFound);
// Ou simplesmente
app.use(midNotFound); // Se omitir a rota, significa a partir da raiz
const port = 3001;
app.listen( port, () => {
console.log( `Servidor rodando na porta ${port}` ); }
)