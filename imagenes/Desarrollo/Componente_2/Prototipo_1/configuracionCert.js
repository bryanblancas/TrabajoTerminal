// Configuraciones de certificado
app.set('port', process.env.PORT || 3001);
var options = {
    key: fs.readFileSync('src/Certificados/llavePrivada_Servidor.key'),
    cert: fs.readFileSync('src/Certificados/certificado_Servidor.crt'),
    ca: fs.readFileSync('src/Certificados/request_Servidor.csr')
}

https.createServer(options, app).listen(3000);