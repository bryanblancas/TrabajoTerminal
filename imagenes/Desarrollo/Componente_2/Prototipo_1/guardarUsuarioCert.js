// Obtiene y se lee la llave privada de la autoridad certificadora
fs.readFile(path.join(__dirname,'../Certificados/llavePrivada_Servidor.key'), function(contents) {
// Importamos la llave privada
    openssl.importRSAPrivateKey(contents, 'servidorPass', function(key) {
// Se genera el request del certificado con la llave privada de la autoridad
        openssl.generateCSR(csroptions, key, 'servidorPass', async function(csr){
// Se genera certificado con request y llave privada de la autoridad certificadora
            openssl.selfSignCSR(csr, csroptions, key, 'servidorPass', async function(crt){
// Debemos verificar que no exista un usuario (email) en la
// base de datos con el email proporcionado por el usuario
                const existeUsuario = await User.find({email: nuevoUsuario.email});
// Creamos el archivo .crt (certificado) del usuario
                fs.writeFile(pathUsuario+'/'+hash+'.crt', crt, async function (){
                    await nuevoUsuario.save();
                });
            });
        });
    });
});
