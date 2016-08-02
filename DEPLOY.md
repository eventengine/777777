
Инструкция как настраивать deploy для Шипита
===========================================

Папка куда разворачивается проект
deployTo: '/gdetus2',

Малопонятная временная папка, которую можно создать только в /tmp боевого сервера. Почему пока не ясно.
workspace: '/tmp/gdetus2/github-monitor',

Путь к приватному ключу на сервере разработки
key: '/home/ubuntu/.ssh/id_rsa',

Создание ключей
1) Ключи создаются на сервере разработки (внимание, не на боевом!)
2) Инструкцию создания ключей аналогична как для гитхаба
3) Публичный ключ, который создается вместе с приватным, нужно скопировать в файл ~/.ssh/authorized_keys на боевом сервере.
здесь ~ домашняя папка того пользователя, под которым мы заходим с сервера разработки при помощи шипита на боевой.

Здесь указываем логин того пользователя, для которого копировали публичный ключ
servers: 'insomakarma@141.8.194.121'


Ссылки по теме:
-----------------

https://www.npmjs.com/package/shipit-pm2
http://pm2.keymetrics.io/docs/usage/deployment/
http://pm2.keymetrics.io/docs/tutorials/capistrano-like-deployments
https://github.com/shipitjs/shipit-deploy
https://github.com/shipitjs/shipit

https://github.com/mattanglin/shipit-pm2-nginx