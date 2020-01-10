const $api = require('./api/Api');

module.exports = application => {
	application.get('/state/restart/', async (request, response) => {
		console.log('Restarting game');
		return response.status(200).json((await $api.restart()) || true);
	});

	application.post('/user/', async (request, response) => {
		console.log('Logging user in: %s', request.body.username);
		return response.status(200).json((await $api.login(request.body.username)) || true);
	});

	application.delete('/user/:username', async (request, response) => {
		console.log('Logging user out: %s', request.params.username);
		return response.status(200).json((await $api.logout(request.params.username)) || true);
	});

	application.post('/card/', async (request, response) => {
		const row = request.body.row;
		const column = request.body.column;
		console.log('Choosing card: row %s, column %s', row, column);
		return response.status(200).json((await $api.choose(row, column)) || true);
	});

	application.get('/state/', async (request, response) => {
		return response.status(200).json((await $api.getState()) || {});
	});

	application.delete('/state/:group', async (request, response) => {
		const group = parseInt(request.params.group);
		if (isNaN(group)) {
			console.warn('Could not revert to matched group, malformed parameter: %s', group);
			response.status(400).json(false);
			return;
		}

		console.log('Reverting to matched group: ' + group);
		return response.status(200).json((await $api.revert(group)) || true);
	});

	application.delete('/', async (request, response) => {
		console.log('Ending game');
		return response.status(200).json((await $api.end()) || true);
	});
};