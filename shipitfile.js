
module.exports = function (shipit) {
	
	require('shipit-deploy')(shipit);

	shipit.initConfig({
		default: {
			workspace: '/tmp/gdetus2/github-monitor',
			deployTo: '/gdetus2',
			repositoryUrl: 'https://github.com/eventengine/777777',
			ignores: ['.git'],
			keepReleases: 3,
			key: '/home/ubuntu/.ssh/id_rsa',
			shallowClone: true
		},
		staging: {
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
	shipit.task("gdetus-prepare", function() {
		
	});
	
	/**
	 * Задача: Запуск приложения при помощи PM2.
	 */
	shipit.task("gdetus-start", function() {
		
	});
	
};


