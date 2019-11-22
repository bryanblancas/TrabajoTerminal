//console.log("Background");


// Variable que guarda el valor actual del botón "activar"
var btnActivar = "";


// Funcion de la API de Google Chrome
// Se ejecuta en cuando los encabezados de la petición HTTP se han creado
chrome.webRequest.onBeforeSendHeaders.addListener(
	function(details){
		// Función del API de Google Chrome que obtiene el valor guardado en el Storage
		chrome.storage.local.get(['Activo'],function(result){
			if(result.Activo == null){
				btnActivar = true;
			}else{
				btnActivar = result.Activo;
			}
		});

		if (btnActivar == true){
			let detailsComplete = details;
			let requestid = details.requestId;
			let method = details.method;
			let frameid = details.frameId;
			let parentframeid = details.parentFrameId;
			let tabid = details.tabId;
			let initiator = details.initiator;
			let timestamp = details.timeStamp;
			let url = details.url;
			let httpheaders = details.requestHeaders;
			let tipo = details.type;

			if(tipo.includes("main_frame")){
				
				let cabeceraInyectar = "";

				for(let i = 0; i < httpheaders.length; i++){
					if(httpheaders[i].name.includes("Accept")){
						cabeceraInyectar = httpheaders[i].value;
					}
				}
				getCertificateFromStorage(cabeceraInyectar, detailsComplete);
				//Bloquea petición
				return {cancel: true};
			}
		}
		},
	{urls: ["*://25.7.126.53/login"]},
	["blocking", "requestHeaders"]
);


// Función que obtiene el certificado del Storage e inicia el proceso de software
function getCertificateFromStorage(cabeceraInyectar, details) {
	
	let certificadoCharArray = [];

	// Función del API de Google Chrome que obtiene el valor guardado en el Storage
	chrome.storage.local.get(['cert'],function(result){
		
		if(result.cert != null){
			
			certificadoCharArray = result.cert;

			chaffingProcess(certificadoCharArray, cabeceraInyectar, details);
		}

	});	
}


// Función que realiza el proceso de chaffing
function chaffingProcess(certificadoCharArray, cabeceraInyectar, details) {
	let patternChaffing = getPatternBite(certificadoCharArray.length , cabeceraInyectar.length);
	
	let newHeader = makeChaffingBite(patternChaffing,certificadoCharArray,cabeceraInyectar,details);	

	//Liberación de la petición
	setFreeRequest(newHeader);
}


// Función que crea el patrón aleatoriamente, cuya longitud es la longitud 
// del certificado más la longitud de la cabecera a inyectar por ocho puesto que es bite a bite 
function getPatternBite(LenCertificadoCharArray, LenCabeceraInyectar){

	let lengthPc = (LenCabeceraInyectar+LenCertificadoCharArray)*8;	

	let pcArray = new Array(lengthPc);
	pcArray.fill(1,0,lengthPc);
	
	let n_0 = 0;
	while(n_0 < LenCertificadoCharArray*8){

		let random = getSecureRandomNumber() % lengthPc; 
		if(pcArray[random] == 1){
			pcArray[random] = 0;
			n_0++;
		}

	}

	return pcArray;
}


// Función que retorna un número aleatorio seguro (SecureRandom)
// RandomSourse.getRandomValues()
// Utiliza un arraglo que puede ser Int8Array, Uint8Array, 
// Int16Array, Uint16Array, Int32Array o Uint32Array
// Todos los elementos del array son escritos con números aleatorios seguros
// Se utiliza un random normal para elegir la posición del número aleatorio a retornar
function getSecureRandomNumber() {
    var array = new Uint16Array(10);
    window.crypto.getRandomValues(array);
    return array[Math.floor(Math.random() * 10)];
}


// Función que realiza el chaffing con base a el patrón (patternChaffing)
// si hay un 0 en el patrón, se coloca un carácter del certificado
// si hay un 1 en el patrón, se coloca un carácter de la cabecera 
function makeChaffingBite(patternChaffing, certArray, cabeceraInyectar, details){
	let stringChaffingCertificado = "";
	let stringCabeceraInyectar = stringToBinaryString(cabeceraInyectar);
	let stringCertArray = stringToBinaryString(certArray);

	let contPcCharTot = 0; 
	let contCertificado = 0; 
	let contEncabezado = 0; 
	
	while(contPcCharTot < patternChaffing.length){
		if(patternChaffing[contPcCharTot] == 0)
			stringChaffingCertificado += stringCertArray[contCertificado++]
		else
			stringChaffingCertificado += stringCabeceraInyectar[contEncabezado++];
		contPcCharTot++;
	}


	/*
		
		PARA CHAFFING

	*/

	let stringBytesChaffingCertificado = arrayBytesToBites(stringChaffingCertificado, false);

	//Se pasa el CHAFFING a Base64
	stringBytesChaffingCertificado = base64_encode(stringBytesChaffingCertificado);
	details.requestHeaders.push({name:"Chaffing",value: stringBytesChaffingCertificado});

	let patroninBytes = arrayBytesToBites(patternChaffing, false);
	
	var key = getKey();
	var options = { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 };

	patroninBytes_aes = CryptoJS.AES.encrypt(patroninBytes, key, options);
	patroninBytes = patroninBytes_aes.toString()

	var encrypt = new JSEncrypt();
	encrypt.setPublicKey(p_key);
	var encrypted = encrypt.encrypt(key);

	patroninBytes += " ";
	patroninBytes += encrypted.toString();

	//Se agrega el nuevo HEADER
	details.requestHeaders.push({name:"Pattern",value: patroninBytes});

	return details;
}


// Función que retorna la llave a utilizar para el AES
function getKey(){
	return "Super llave de prueba";
}


// Función que retorna una cadena de caracteres 0 y 1
function stringToBinaryString(string){
	let i = 0;
	let binaryString = ""
	for(i; i < string.length; i++)
		binaryString += charToBinaryString(string[i]);
	return binaryString;
}


// Funcion que retorna una cadena de 0 y 1
function charToBinaryString(char){
	let num = char.charCodeAt(0);
	return intToBinaryString(num);
}


//Function que retorna una cadena de 0 y 1
function intToBinaryString(int){
	let mask = 0x80;
	let string = "";
	while(mask > 0){
		if((int & mask) != 0)
			string += '1';
		else
			string += '0';
		mask = mask >> 1;
	}

	return string;
}


// Función que libera la nueva petición (newHeader)
function setFreeRequest(newHeader){
	var pattern = "";
    var chaff = "";
    const url = newHeader.url;

    for(i = 0; i < newHeader.requestHeaders.length; i++){
        if(newHeader.requestHeaders[i].name.includes("Chaffing")){
            chaff = newHeader.requestHeaders[i].value;
            break;
        }
    }

    for(i = 0; i < newHeader.requestHeaders.length; i++){
        if(newHeader.requestHeaders[i].name.includes("Pattern")){
            pattern = newHeader.requestHeaders[i].value;
            break;
        }
    }

    console.log(newHeader);

	//Liberación de la petición por medio de AJAX 
	$.ajax({
		url: url,
		type: "GET",
		contentType: "text/plain;charset=UTF-8",
		datatype: 'text/plain',
		headers: {
			"Chaffing" : chaff,
			"Pattern" : pattern
		},
		success:function(result){
			console.log("ÉXITO AL ENVIAR PETICIÓN, IMPRIMIENDO RESPUESTA: ");
            console.log(result);
            window.open(result);
		},
		error:function(result){
			console.log("ERROR AL ENVIAR PETICIÓN, IMPRIMIENDO RESPUESTA: ");
			console.log(result);
		}
	})
}


// Función que pasa una cadena de 0 y 1 que representan bites a bytes
// "00101111" -> "/"
function arrayBytesToBites(array, patron){
	//PASAR EL ARREGLOS DE BYTES A BITES   -> 1 BYTE -> 1 BITE

	let charCreado = 0;
	let stringInBites = "";
	let count = 0;
	let i = 0;
	if(patron == true)
		i = 1


	for(i; i < array.length; i++){
		
		if(count == 8){
			stringInBites += String.fromCharCode(charCreado);
			charCreado = 0;
			count = 0;
		}

		charCreado = charCreado << 1;
		if(array[i] == '1')
			charCreado = charCreado | 1; 
		count ++;
	}

	//ÚLTIMO CHAR CREADO
	stringInBites += String.fromCharCode(charCreado);

	return stringInBites;
}



// Función de codifica la cadena s dada a base64.
function base64_encode (s){
  // the result/encoded string, the padding string, and the pad count
  var base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var r = ""; 
  var p = ""; 
  var c = s.length % 3;

  // add a right zero pad to make this string a multiple of 3 characters
  if (c > 0) { 
    for (; c < 3; c++) { 
      p += '='; 
      s += "\0"; 
    } 
  }

  // increment over the length of the string, three characters at a time
  for (c = 0; c < s.length; c += 3) {

    // we add newlines after every 76 output characters, according to the MIME specs
    /*if (c > 0 && (c / 3 * 4) % 76 == 0) { 
      r += "\r\n"; 
    }*/

    // these three 8-bit (ASCII) characters become one 24-bit number
    var n = (s.charCodeAt(c) << 16) + (s.charCodeAt(c+1) << 8) + s.charCodeAt(c+2);

    // this 24-bit number gets separated into four 6-bit numbers
    n = [(n >>> 18) & 63, (n >>> 12) & 63, (n >>> 6) & 63, n & 63];

    // those four 6-bit numbers are used as indices into the base64 character list
    r += base64chars[n[0]] + base64chars[n[1]] + base64chars[n[2]] + base64chars[n[3]];
  }
   // add the actual padding string, after removing the zero pad
  return r.substring(0, r.length - p.length) + p;
}
