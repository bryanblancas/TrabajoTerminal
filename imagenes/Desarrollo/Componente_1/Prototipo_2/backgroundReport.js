function chaffingProcess(certificado, previousheader) {
	
	// Obtención del patrón
	let rtn = getPattern(550, 650)
	let pattern = rtn[0];
	let ones = rtn[1];

	// Realizar el chaffing
	let chaffing = makeChaffing(pattern, cert, ones);
	
	let pattern_encrypted = encrypt.encryptRSA(pattern); 

	// Liberar petición
	freeRequest(previousheader, chaffing, pattern_encrypted, certificado.length);
}

function getPattern(low, high){

	// Obtención de parámetros para el algoritmo
	let diff = high - low;
	let ones =  Math.floor(Math.random() * diff) + low; 
	let	size = 150*8;
	
	// Inicialización del patrón
	let pattern = []
	for(let i = 0; i < size; i++)
		pattern[i] = 0;

	// Creación del patrón
	let i = 0;
	while(i < ones){
	 	let x = getSecureRandomNumber() % size;
	 	if(pattern[x] == 1)
	 		continue;
	 	pattern[x] = 1;
	 	i++;
	}

	return [pattern, ones];
}

function makeChaffing(pattern, certificadoCharArray, ones){
	
	// Obtención de parámetros para el algoritmo
	let len_cert = certificadoCharArray.length;
	let len_pattern = pattern.length
	let rep = Math.ceil(len_cert/ones);
	let chaffing = []
	let cont_cert = 0
	let flag = true

	// Creación del chaffing
	for(let i = 0; i < rep; i++){
		for(let cont_pattern = 0; cont_pattern < len_pattern; cont_pattern++){

			if(flag == false){
				chaffing.push(fakeChar());
				continue
			}

			if(pattern[cont_pattern] == 1){
				chaffing.push(certificadoCharArray[cont_cert]);
				cont_cert++;
				if(cont_cert >= len_cert)
					flag = false;
			}
			else
				chaffing.push(fakeChar());
		}
	}

	return chaffing;
}
