module.exports = {
	apps: [
		{
			name: "bitcoin-puzzle",
			script: "/home/username/applications/nodejs/bitcoin-puzzle/launcher.js",
			watch: true,
			env: {
				NODE_ENV: "development"
			},
			env_production: {
				NODE_ENV: "production"
			},
			instances: 1,
			exec_mode: "fork"
		}
	]
}