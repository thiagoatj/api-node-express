const http = require('http');
let PORTA = 3000;
const server = http.createServer(
(req,res)=> {
console.log('URL: ' + req.url);
console.log('IP REMOTO: ' + req.connection.remoteIP);
console.log('PORTA REMOTA: ' + req.connection.remotePort);
res.end('<h1>BEM-VINDO AO MEU SITE!</h1>');
}
);
server.listen(PORTA);
console.log('*** Olá, Startando Servidor Web com Node ***');