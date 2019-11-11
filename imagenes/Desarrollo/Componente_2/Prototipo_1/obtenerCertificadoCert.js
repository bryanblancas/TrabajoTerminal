// Se busca el usuario en la base de datos
const existe = await User.find({email: email, password: password});
if(existe){
// Se lee el archivo .crt del usuario
    fs.readFile(pathUsuario+'/'+hash+'.crt', {encoding: 'utf-8'}, function(err,crt){
// Si no existe error al leer archivo
        if (!err) {
// Se regresa como respuesta un objeto JSON
// con status 1 y el certificado del usuario
            res.json({status: 1, certificado: crt});    
        }else{
// Si existe un error se regresa estatus: 0 y 
// el email del usuario quien realizo la petición
            res.json({status: 0, email: email});
        }
    });
}else{
// Si existe un error se regresa estatus: 0 y 
// el email del usuario quien realizo la petición
    res.json({status: 0, email: email});
}