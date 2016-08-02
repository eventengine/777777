
module.exports = function (shipit) {
	
	var projectName = "gdetus2";
	
	require('shipit-deploy')(shipit);

	shipit.initConfig({
		default: {
			workspace: `/tmp/${projectName}`,
			deployTo: `/${projectName}`,
			repositoryUrl: 'https://github.com/eventengine/777777',
			ignores: ['.git', 'shipitfile.js'],
			keepReleases: 3,
			key: '/home/ubuntu/.ssh/id_rsa',
			shallowClone: true
		},
		gdetus: {
			servers: 'insomakarma@141.8.194.121'
		}
	});
	
	/**
	 * Задачи перед началом развертывания приложения.
	 */
	shipit.on('deploy', function () {
		shipit.start('gdetus-stop');
	});
	
	/**
	 * Задачи после развертывания приложения.
	 */
	shipit.on('deployed', function () {
		shipit.start(['gdetus-prepare', 'gdetus-start']);
	});
	
	/**
	 * Задача: Останов приложения при помощи PM2.
	 */
	shipit.task("gdetus-stop", function() {
		
	});
	
	/**
	 * Задача: Подготовка приложения перед запуском.
	 * Восстановление папки node_modules командой npm install.
	 */
	shipit.blTask("gdetus-prepare", function() {
		return shipit.remote(`cd ${shipit.config.deployTo}/current && npm install`);
	});
	
	/**
	 * Задача: Запуск приложения при помощи PM2.
	 */
	shipit.blTask("gdetus-start", function() {
		var pm2Options = [];
		for (var option in {
			"--name": "Gdetus Application",
			"--": `-c ${shipit.config.deployTo}/config.yaml`
		}) {
			pm2Options.push(`${option} ${pm2Options[option]}`);
		}
		var commands = [
			`cd ${shipit.config.deployTo}/current`, 
			`pm2 startOrRestart server.js ${pm2Options.join(" ")}`
		];
		return shipit.remote(commands.join(" && "));
	});
	
};


