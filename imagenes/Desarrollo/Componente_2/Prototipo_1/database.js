const mongoose = require('mongoose');
const {mongodb} = require('./keys');


mongoose.connect(mongodb.URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(db => console.log('Base de datos AutoridadCertificadora_Usuarios conectada'))
    .catch(err => console.log(err));