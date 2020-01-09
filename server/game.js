module.exports = application => {
	application.get('/user/', (request, response) => {
		response.write();
	});
};