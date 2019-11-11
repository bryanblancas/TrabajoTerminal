@RequestMapping(
	value = "/winnowing",
	method = RequestMethod.POST,
	consumes = {
		MediaType.APPLICATION_JSON_VALUE, 
		MediaType.APPLICATION_XML_VALUE
	}
)
public String makeWinnowing(
	@RequestBody WinnowingModel data
){
	winnowingService.setChaffing(data.getChaffing());
	winnowingService.setPattern(data.getPattern());
	return winnowingService.makeWinnowing();
}