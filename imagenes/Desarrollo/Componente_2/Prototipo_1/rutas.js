// Routes
app.use('/api/Aviso',require('./routes/Aviso'));
app.use('/api/ObtenerCertificado',require('./routes/ObtenerCertificado'));
app.use('/api/revocarCertificado',require('./routes/revocarCertificado'));
app.use('/api/guardarUsuario',require('./routes/guardarUsuario'));
app.use('/api/verificarCertificado',require('./routes/verificarCertificado'));