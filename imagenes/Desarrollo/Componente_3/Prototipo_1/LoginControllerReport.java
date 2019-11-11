@RequestMapping(value = "/login", method = RequestMethod.GET)
public String login(
	ModelMap model,
	@RequestHeader(name = "Chaffing", required = false) 
		String chaffing, 
	@RequestHeader(name = "Pattern", required = false) 
		String pattern
) {
	
	String ipServer = "";

	/*
	 *	Verifica si los headers Chaffing y Pattern 
	 *	han sido recibidos junto con la petición HTTP
	 */
	if(chaffing == null || pattern == null)
		return "/login";
	
	/*
	 *	Para este punto, se asegura que existen los headers
	 *	Chaffing y Pattern, por lo tanto, el primer paso es
	 *	realizar la conexión con la API para obtener el 
	 *	certificado del usuario
	 */
	RestTemplate restTemplate = new RestTemplate();
	WinnowingModel data = new WinnowingModel(
								chaffing, 
								pattern
							);	
	String rtn = restTemplate.postForObject(
						getIpAPI(), 
						data, 
						String.class
					);
	
	String[] certAndStatus = rtn.split(" ");
	certificate = certAndStatus[0];
	status = Integer.parseInt(certAndStatus[1]);
	

	/*
	 *	Si el estatus es 0, implica que el certificado
	 *	no es válido
	 */	
	if(status == 0) {
		certificate = null;
		status = -1;
		ipServer = getIpServer()+"/showForm";
		model.addAttribute("ipToRedirect", ipServer);
		return "/trapView";
	}
	
	/*
	 *  Checa si el certificado existe en la base de datos
	 *  del servicio web
	 */
	CertificateEntity ce = 
		loginService.checkCertificateExistance(
			certificate
		);
	

	/*
	 *	Si el estatus del certificado es 2, implica que 
	 *	el certificado ha sido revocado
	 */
	if(status == 2) {
		/*
		 *	Elimina el certificado de la base de datos 
		 *	sólo si ya existe
		 */
		
		if(ce != null) 
			loginService.deleteCertificateByCert(
				ce.getCertificate()
			);
		
		certificate = null;
		status = -1;
		ipServer = getIpServer()+"/showForm";
		model.addAttribute("ipToRedirect", ipServer);
		return "/trapView";
	}
	
	/*
	 *	Si el certificado existe, se establece la variable 
	 *	de sesión user_data_session y el usuario es 
	 *	redirecionado a la página de bienvenida
	 * 
	 *	En caso contrario, el usuario será redirigido al 
	 *	inicio de sesión por formulario	para vincular el 
	 *	certificado al usuario correspondiente
	 */
	if(ce != null) {
		UserDataSession userdatasession = 
			loginService.getUserDataSessionById(
				ce.getUser_data_idUser()
			);

		model.addAttribute(
			"user_data_session", 
			userdatasession
		);

		ipServer = getIpServer()+"/welcome";
	}
	else 
		ipServer = getIpServer()+"/showForm";
	
	model.addAttribute("ipToRedirect", ipServer);
	return "/trapView";
	
}


@RequestMapping(
	value = "/loginByForm", 
	method = RequestMethod.POST
)
public String loginByForm(
				ModelMap model, 
				@RequestParam String idUser, 
				@RequestParam String password
) {
	
	/*
	 *	Validar las credenciales introducidas por el usuario
	 */
	UserDataSession userdatasession = 
		loginService.validateCredentials(
			idUser, 
			password
		);
	
	if(userdatasession == null) {
		model.addAttribute(
			"errorMessage", 
			"Credenciales inválidas"
		);
		return "/login";
	}
	
	/*
	 *	En estre punto el usuario existe y sus 
	 *	credenciales son las correctas
	 */
	
	/*
	 *	Si el certificado (variable de esta clase) es diferente
	 *	de nulo, quiere decir que el certificado ha sido 
	 *	obtenido del método login, por lo tanto, ésta es la 
	 *	primera vez	que el certificado llega a este 
	 *	servicio web, es decir,	es la primera vez que se
	 *	inicia sesión con este método
	 */
	if(this.certificate != null) {
		
		/*
		 *	Para este punto, sabemos que el certificado no 
		 *	existe	en la base de datos, por lo tanto, se 
		 *	procede a guardarlo en la base de datos.
		 *
		 *	rows_affected cases:
		 *	0	-> error al guardar certificado
		 *	-1	-> el usuario tiene un certificado vinculado
		 *	otro -> el certificado se guardó
		 * 
		 */
		
		CertificateEntity ce = 
			new CertificateEntity(
				certificate, 
				userdatasession.getUser().getIdUser()
			);
		
		int rows_affected = loginService.saveCertificate(ce);
		if(rows_affected == 0) {

			model.addAttribute(
				"errorMessage", 
				"No se pudo vincular el certificado"
			);

			return "/login";
		}
		else if(rows_affected == -1) {

			model.addAttribute(
				"errorMessage", 
				"El usuario "+
					ce.getUser_data_idUser()
				+" ya tiene un certificado vinculado");

			return "/login";
		}

		this.certificate = null;
	}
	
	/*
	 *	En este punto, existen dos caminos que el proceso 
	 *	pudo haber tomado.
	 *	1. El certificado es igual a nulo, lo que implica que
	 *		el usuario está iniciando sesión de la manera común
	 *		es decir, sin chaffing and winnowing
	 *	2. El certificado era diferente a nulo así que se
	 *		guardó en la base de datos vinculado al usuario
	 * 
	 *	Ambos casos implican que el inicio de sesión fue 
	 *	realizado satisfactoriamente, por lo tanto, la 
	 *	variable de sesión user_data_session es 
	 *	establecida y el usuario es redirigido a la
	 *	vista de bienvenida
	 */
	
	model.addAttribute("user_data_session", userdatasession);	
	return "redirect:/welcome";
}