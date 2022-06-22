class Express {
	constructor() {
		this.handlers = [];
	}

	get(route, callback) {
		this.handlers.push({
			type: "GET",
			route,
			callback
		});
	}

	post(route, callback) {
		this.handlers.push({
			type: "POST",
			route,
			callback
		});
	}

	listen(port, callback) {
		const _handlers = this.handlers;

		const listener = (req, res) => {
			// express stuff

			res.status = (status) => {
				res.writeHead(status);
				return res;
			};

			res.send = (data) => {
				res.end(data);
			};

			// Find handlers for the route

			for (let i = 0; i < _handlers.length; i++) {
				const handler = _handlers[i];

				if (handler.type == req.method && handler.route == req.url) {
					handler.callback(req, res);
					return;
				}
			}

			// If nothing could be found, give the client a 404 response

			res.writeHead(404);
			res.end(`Cannot ${req.method} ${req.url}`);
		}

		const server = (require('http')).createServer(listener).listen(port);

		if (typeof callback != "undefined") {
			callback();
		}
	}
}

module.exports = () => {
	return new Express();
};