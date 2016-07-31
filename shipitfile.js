// подключение ключа деплоя
module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/github-monitor',
      deployTo: '/tmp/deploy_to',
      repositoryUrl: 'https://github.com/user/repo.git',
      ignores: ['.git', 'node_modules'],
      rsync: ['--del'],
      keepReleases: 2,
      key: '/id_rsa_deploy.pub',
      shallowClone: true
    },
    staging: {
      servers: 'user@myserver.com'
    }
  });
  
};


