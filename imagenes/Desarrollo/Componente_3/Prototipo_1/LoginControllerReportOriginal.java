@RequestMapping(value = "/login", method = RequestMethod.GET)
public String login(ModelMap model){
		return "/login";	
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
	model.addAttribute("user_data_session", userdatasession);		
	return "redirect:/welcome";
}