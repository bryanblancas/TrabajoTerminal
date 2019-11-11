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
// Se obtiene el path donde se 
// enuentra el certificado del usuario
var pathUsuario = '/Usuarios_CRT/'+hash;
var rutaCRT = pathUsuario;
var rutaCSR = pathUsuario;
// Se inicia la conexión al servidor FTP
c.on('ready', function(err) {
// Si existe un error al intentar 
// conexión regresa estatus 0
    if(err){
        res.json({status: 0, email: nuevoUsuario.email});
    }else{
// Se crea ruta donde se almacenará 
// .csr y .crt del usuario
        c.mkdir(rutaCRT,true, async function (err) {
// Se almacena archivo .crt del usuario
            c.put(crt, rutaCRT+'/'+hash+'.crt',function(err) {
// Si existe un error al crear el 
// archivo .crt se regresa estatus 0
                if(err){
                    res.json({status: 0, email: nuevoUsuario.email});
                }
            });
// Se almacena archivo .csr del usuario
            c.put(csr, rutaCSR+'/'+hash+'.csr',function(err) {
// Si existe un error al crear el 
// archivo .csr se regresa estatus 0
                if(err){
                    res.json({status: 0, email: nuevoUsuario.email});
                }
            });
// Se guarda usuario en la base de datos de MongoDB
            await nuevoUsuario.save();
// Se regresa estatus 1 de exito
            res.json({status:1, email: nuevoUsuario.email});
        });
    }
});