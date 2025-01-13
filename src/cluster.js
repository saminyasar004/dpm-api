require("colors");
const cluster = require("cluster");
const os = require("os");

if (cluster.isMaster) {
	const numCPUs = os.cpus().length;

	console.log(`Master process is running (PID: ${process.pid})`.blue);
	console.log(`Forking ${numCPUs} workers...`.blue);

	// Fork workers
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	// Log worker events
	cluster.on("exit", (worker, code, signal) => {
		console.log(`Worker ${worker.process.pid} died. Restarting...`.red);
		cluster.fork();
	});

	cluster.on("online", (worker) => {
		console.log(`Worker ${worker.process.pid} is online`.blue);
	});
} else {
	// Start worker logic
	require("./server");
}
