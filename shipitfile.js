
module.exports = function (shipit) {
	
	var app = {
		name: "Gdetus Application",
		folder: "gdetus2"
	};
	
	require('shipit-deploy')(shipit);

	shipit.initConfig({
		default: {
			workspace: `/tmp/${app.folder}`,
			deployTo: `/${app.folder}`,
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
		//return shipit.remote(`pm2 stop "${app.name}" && exit 0`);
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
		var options = {
			pm2: [`--name="${app.name}"`],
			gdetus: [`-c ${shipit.config.deployTo}/config.yaml`]
		};
		var commands = [
			`cd ${shipit.config.deployTo}/current`, 
			`pm2 start ${options.pm2.join(" ")} server.js -- ${options.gdetus.join(" ")}`
		];
		return shipit.remote(commands.join(" && "));
	});
	
};
