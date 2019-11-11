// Obtiene y se lee la llave privada de la autoridad certificadora
fs.readFile(path.join(__dirname,'../Certificados/llavePrivada_Servidor.key'), function(contents) {
    // Importamos la llave privada
    openssl.importRSAPrivateKey(contents, 'servidorPass', function(err, key) {
        // Si existe un error al importar la llave se manda un error como status = -1
        if(err) {
            res.json({status: -1});
        } else {	
            // Se genera el request del certificado con la llave privada de la autoridad
            openssl.generateCSR(csroptions, key, 'servidorPass', async function(err, csr) {
                // Si existe un error al generar el request del certificado se manda un error como status = -1 
                if(err) {
                    res.json({status: -1});
                } else {
                    // Se genera certificado con request y llave privada de la autoridad certificadora
                    openssl.selfSignCSR(csr, csroptions, key, 'servidorPass', async function(err, crt, cmd) {
                        // Si existe un error al generar el certificado se manda un error como status = -1
                        if(err) {
                            res.json({status: -1});
                        } else {
                            // Debemos verificar que no exista un usuario (email) en la
                            // base de datos con el email proporcionado por el usuario
                            const existe = await User.find({email: nuevoUsuario.email});
                            // Si no existe el usuario (email) en la base de datos
                            if(existe.length == 0){
                                // Obtenemos un hash 256 del email del usuario
                                var hash = crypto.createHash('sha256').update(nuevoUsuario.email).digest('hex');
                                // Obtenemos el path donde se guardará el certificado y el request del 
                                // certificado del usuario
                                var pathUsuario = path.join(__dirname,'../../Usuarios_CRT/'+hash);
                                // Debemos verificar que no exista una carpeta con el nombre 
                                // del hash 256 del email del usuario
                                if (!fs.existsSync(pathUsuario)){
                                    // Creamos la carpeta donde se almacenara el request y el 
                                    // certificado del usuario
                                    fs.mkdirSync(pathUsuario);
                                    // Creamos el archivo .csr (request) del usuario
                                    fs.writeFile(pathUsuario+'/'+hash+'.csr', csr, async function (err){
                                        // Si existe un error al generar el archivo .csr 
                                        // se manda un error como status = -1
                                        if(err) {
                                            res.json({status: -1});
                                        } else {
                                            // Creamos el archivo .crt (certificado) del usuario
                                            fs.writeFile(pathUsuario+'/'+hash+'.crt', crt, async function (err) {
                                                // Si existe un error al generar el archivo .crt 
                                                // se manda un error como status = -1
                                                if(err) {
                                                    res.json({status: -1});
                                                } else {
                                                    // Se guarda en la base de datos el usuario
                                                    // El cual tendra nombre de usuario
                                                    // email, contraseña (hash 256) y el path
                                                    // donde se almaceno el archivo .csr y .crt 
                                                    // del usuario
                                                    nuevoUsuario.path = pathUsuario;
                                                    await nuevoUsuario.save();
                                                    // Se regresa como respuesta un status 1, el cual significa 
                                                    // que la inserción se hizo correctamente, se regresa también 
                                                    // el email con el que se creo la cuenta en la autoridad certificado
                                                    res.json({status:1, email: nuevoUsuario.email});
                                                }
                                            });
                                        }
                                    });
                                }else{
                                    // Si ya existen los archivos .csr y .crt del usuario (email) 
                                    // quien solicita la creación de nuevo usuario, se responde 
                                    // con status 0 y el email del usuario
                                    res.json({status: 0, email: nuevoUsuario.email});
                                }
                            }else{
                                // Si ya existe un usuario en la base de datos con email 
                                // quien solicita la creación de nuevo usuario, se responde 
                                // con status 0 y el email del usuario
                                res.json({status: 0, email: nuevoUsuario.email});
                            }
                        }
                    });
                }
            });
        }
    });
});