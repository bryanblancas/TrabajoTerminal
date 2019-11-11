public String makeWinnowing() {

	// Decodificar el chaffing de base 64
	String chaffingDecode = base64.decode(chaffing);

 	// Obtener llave del AES (decifrado RSA)
	String aesKey = cryptoService.decryptAESKey(aesKeyEncrypted);

 	//Obtener patrón (decifrado AES)
 	String pattern = cryptoService.decryptPattern(
						patternEncrypted, 
						aesKey
					);
	
	// Proceso de Winnowing
	boolean[] patt = stringtoBoolean(pattern);
	boolean[] chaffingByte = stringtoBoolean(chaffingDecode);

	String cab = "";
	String cert = "";
	
	for(int i = 0 ; i<patt.length ;i++) {
		if(patt[i])
			cab+=chaffingByte[i] == true ? '1' : '0';
		else
			cert+=chaffingByte[i] == true ? '1' : '0';
	}
	
	
	// Obtener certificado como Byte array		
	byte[] certificado = arraybytetoBite(cert);

	// Eliminar carácteres inválidos
	String certificate = arraybytetoString(certificado).replace("\r\n", "");
	
	// Obtener datos del certificado
	String[] dataCert = getDataCert(certificado);	
	
	// Verificar firma del certificado
	if(	
		dataCert != null && 
		cryptoService.verifyCertificate(getCert(certificate)) == 1 
	){

		// Obtener email del usuario del certificado
		String email = dataCert[0].split("=")[1];

		// Realizar SHA256 al email del certificado
		String shaEmail = cryptoService.doSHA(email);
		
		// Realizar SHA256 al certificado local del usuario
		String shaCert = cryptoService.doSHA(certificate);			

		// Conexión con el Componenete II para checar si el certificado no ha sido revocado
		String response = validateCert(shaEmail);
		
		// Máquina de estados de retorno para el Servicio WEB
		if(response.equals("0")) 
			//	El usuario no existe
			return "0 0";
		else if(response.equals(shaCert)) 
			// Certificado Válido
			return certificate+" 1";
		else 
			// Certificado Revocado
			return"0 2";
	}

	// Error en el certificado
	return "0 0";

}