const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
	console.log("LOGGED");
	next();
});

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

app.post("/api/helloworld", (req, res) => {
	if (!Object.keys(req.body).includes("world")) {
		res.send({hello: "world"});
		return;
	}

	res.send({hello: req.body.world});
});

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});