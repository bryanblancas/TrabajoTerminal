// Obtenemos la llave privada de la autoridad certificadora
fs.readFile(path.join(__dirname,'../Certificados/llavePrivada_Servidor.key'), async function(contents) {
// Importamos la llave privada
    openssl.importRSAPrivateKey(contents, 'servidorPass', async function(key) {
// Si existe error se manda estatus 0
// Obtenemos el archivo .csr del usuario
        fs.readFile(pathUsuario+'/'+hash+'.csr', {encoding: 'utf-8'}, async function(csr){
// Se genera nuevo certifcado con .csr 
// del usuario vy .key de la autoridad
            openssl.selfSignCSR(csr, csroptions, key, 'servidorPass', async function(crt) {
// Se remplaza el archivo .crt y .csr
                fs.writeFile(pathUsuario+'/'+hash+'.csr', csr, async function (){
                    fs.writeFile(pathUsuario+'/'+hash+'.crt', crt, async function (err) {
// Se regresa estatus 1 si no hay error
                        if (!err) {
                            res.json({status: 1});
                        }else{
                            res.json({status:0});
                        }
                    });
                });
            });
        });
    });
});