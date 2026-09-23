const http = require('http');
/* importando abaixo o módulo/pacote nativo "file system"
para manipular arquivos e pastas */
const fs = require('fs');
//Lendo (carregando) os arquivos das páginas html estáticas para memória
const home = fs.readFileSync('home.html');
const quem_somos = fs.readFileSync('quem_somos.html');
const fale_conosco = fs.readFileSync('fale_conosco.html');
const not_found_404 = fs.readFileSync('not_found_404.html');
//Criando o programa servidor
const server = http.createServer(
//função handler das rotas
(req, res) => {
console.log('IP: ' + req.remoteAddress);
console.log(req.url);
switch (req.url) {
case '/':
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(home);
    break;
case '/quem_somos':
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(quem_somos);
    break;
case '/fale_conosco':
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fale_conosco);
    break;
default:
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
//res.end('Error 404 - Page Not Found')
res.end(not_found_404);
break;
}
}
);
server.listen(3000,()=>{
console.log('*** Iniciando Aplicação Servidora ***');
console.log('*** Digite CTRL+C para tirar o servidor do ar! ***)');
});