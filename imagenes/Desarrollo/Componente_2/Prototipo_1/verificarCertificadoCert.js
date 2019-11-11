function verificarCertificado(usuario, res) {
// Se obtiene archivo .crt del usuario
    fs.readFile(pathUsuario+'/'+usuario+'.crt', {encoding: 'utf-8'}, async function(err,crt){
// Si no ocurre error al leer el archivo
        if (!err) {
// Se limpia el certificado
            crtSinEspacios = crt.split("\n").join("");
            crtSinEscape = crtSinEspacios.split("\r").join("");
            crtSinEncabezados = crtSinEscape.split('-----BEGIN CERTIFICATE-----')[1];
            crtSinEncabezados = crtSinEncabezados.split('-----END CERTIFICATE-----')[0]; 
// Se obteiene hash 256 del certificado
            cert = crypto.createHash('sha256').update(crtSinEncabezados).digest('hex').toLowerCase();
// Se regresa como respuesta el hash 256 del certificado del usuario
            res.send(cert);
        }else{
// Si ocurre error se envia estatus 0
            res.send('0');
        }
    });
}