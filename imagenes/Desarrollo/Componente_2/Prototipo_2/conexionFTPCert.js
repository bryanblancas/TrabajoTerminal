// Librería de FTP para establecer conexión
var FTPClient = require('ftp');
// Crea una nueva instancia del objeto FTP
var cliente = new FTPClient();
// Se establece conexión donde se establecen
// Host, nombre de usuario y contrasena 
// del servidor FTP
cliente.connect({
    host: IP.dir,
    user: "diegoarturomg",
    password: "211096"
});
var certificado = '';
var ruta = pathUsuario+'/'+hash+'.crt';
// Se inicia la conexión al servidor FTP
c.on('ready', function(err) {
// Si existe un error al intentar 
// conexión regresa estatus 0
    if(err){
        res.json({status: 0, email: email});
    }else{
// Si se establece la conexión, se obtiene 
// el certificado en la ruta especificada
        c.get(ruta, function(err, stream) {
// Si existe error al intentar obtener 
// el certificado se regresa estatus 0
            if(err){
                res.json({status: 0, email: email});
            }else{
// Si se obtiene el certificado 
// del servidor FTP correctamente
                stream.on('data', function(datos) {
                    certificado += datos.toString();
                });
// Una vez que el certificado se 
// obtiene por completo
                stream.on('end', function() {
//console.log(content);
// SI el certificado no es nulo, 
// se regresa estatus 1
                    if (certificado != null) {
                        res.json({status: 1, certificado: certificado});
                    } else {
// Si el certificado obtenido es nulo 
// se regresa estatus 0
                        res.json({status: 0, email: email});
                    }
                });
            }
        })
    }
});