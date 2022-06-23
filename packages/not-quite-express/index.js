class Express {
	constructor() {
		this.handlers = [];
	}

	use(callback) {
		this.handlers.push({
			type: "middleware",
			callback
		});
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

			let _status = 200;
			let _headers = {"Content-Type": "text/plain", "Server": "not-quite-express"};

			res.status = (status) => {
				_status = status;
				return res;
			};

			res.send = (data) => {
				if (typeof data == "object") {
					_headers["Content-Type"] = "application/json";
					res.writeHead(_status, _headers);
					res.end(JSON.stringify(data));
					return;
				}
				
				res.writeHead(_status, _headers);
				res.end(data);
			};

			// Find handlers for the route

			let i = 0;

			const next = () => {
				if (i == _handlers.length) {
					_headers["Content-Type"] = "text/html";
					res.status(404).send(`<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot ${req.method} ${req.url}</pre>\n</body>\n</html>\n`);
					return;
				}

				const handler = _handlers[i];
				
				if (handler.type == "middleware") {
					i++;
					handler.callback(req, res, next);
					return;
				}

				if (handler.type == req.method && handler.route == req.url) {
					handler.callback(req, res);
					return;
				}

				i++;
				next();
			};

			req.body = "";

			req.on("data", chunk => {
				req.body += chunk;
			});

			req.on("end", () => {
				next();
			});
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

module.exports.json = () => {
	return (req, res, next) => {
		try {
			req.body = JSON.parse(req.body);
		} catch (e) {
			req.body = {};
		}

		next();
	};
}

module.exports.default = module.exports;