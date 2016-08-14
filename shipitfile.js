
module.exports = function (shipit) {
	
	var app = {
		name: "gdetus",
		folder: "gdetus",
		repository: "https://github.com/eventengine/777777"
	};
	
	require('shipit-deploy')(shipit);

	shipit.initConfig({
		default: {
			workspace: `/tmp/${app.folder}`,
			deployTo: `/${app.folder}`,
			repositoryUrl: app.repository,
			ignores: ['.git', 'shipitfile.js'],
			keepReleases: 3,
			key: '/home/ubuntu/.ssh/id_rsa',
			shallowClone: true
		},
		gdetus: {
			servers: 'gdetus@141.8.194.121'
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
	 * Внимание, пользователь должен иметь доступ к команде sudo без ввода пароля
	 * либо необходимо заходить под суперпользователем root.
	 */
	shipit.task("gdetus-stop", function() {
		return shipit.remote(`sudo pm2 delete "${app.name}"`).catch(function() {});
	});
	
	/**
	 * Задача: Подготовка приложения перед запуском.
	 * Восстановление папки node_modules командой npm install.
	 */
	shipit.blTask("gdetus-prepare", function() {
		return shipit.remote(`cd ${shipit.config.deployTo}/current && sudo npm install`);
		//return shipit.remote(`cd ${shipit.config.deployTo}/current && npm install --link --production`);
		
		// Для нерутовского пользователя нет доступа в папку /usr/lib/node_modules
		// Поэтому он туда не может ставить линки (командой npm install --link)
		
	});
	
	/**
	 * Задача: Запуск приложения при помощи PM2.
	 * Внимание, пользователь должен иметь доступ к команде sudo без ввода пароля
	 * либо необходимо заходить под суперпользователем root.
	 */
	shipit.blTask("gdetus-start", function() {
		var options = {
			pm2: [`--name="${app.name}"`],
			gdetus: [`-c ${shipit.config.deployTo}/config.yaml`]
		};
		var commands = [
			`cd ${shipit.config.deployTo}/current`, 
			`sudo pm2 start ${options.pm2.join(" ")} server.js -- ${options.gdetus.join(" ")}`
		];
		return shipit.remote(commands.join(" && "));
	});
	
};
