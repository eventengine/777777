
Ссылка на документацию по фронтэнд фреймворку:
http://pages.revox.io/dashboard/latest/doc/
http://pages.revox.io/dashboard/latest/html/

Ссылка на документацию по nvm:
https://github.com/creationix/nvm



Команды управления деплоем
---------

`npm run start`  
запуск приложения в режиме отладки.

`npm run deploy`
разворачивание проекта на боевом сервере.

`npm run rollback`  
откат на предыдущую версию.



Команды управления гитом
---------


`git status`
проверить статус и то, какие файлы были изменены

`git add .`  
добавить файлы в "отслеживаемые"

`git commit -m "коммент"`  
добавить свой комментарий в качестве пометки

`git push`  
отправить всё на гитхаб

`git diff`  
узнать - что мы изменили, но ещё не проиндексировали,
 и что уже проиндексировали и собираемся фиксировать
                         
`git mv app2.0.js app2.1.js`  
если нужно переименовать файл в Git'е

`git commit --amend`  
если закоммитив, забыл внести в коммит какой-либо
файл, или неверно указал коментарий, вернет коммит
и можно добавить файл и сделать коммит как обычно


Команды управления nvm
---------

`npm update npm -g`  
обновить NPM до последней версии

`nvm install v6.3.1`  
поставить последнюю версию ноды

`nvm use v6.3.1`  
выставить ту версию ноды, которую будем использовать

`nvm alias default v6.3.1`  
приравнивает значение алиаса к версии ноды 6.3.1

`nvm run v6.3.1`
для запуска версии 6.3.1

`nvm ls`
какие версии Node.JS уже установлены

`nvm ls-remote`
просмотр всех доступных для установки версий

`nvm help`
получить справку по всем помандам

`nvm deactivate`
деактивировать nvm



Команды управления MySQL (в консоли боевого сервера)
---------
`service mysql stop`

`service mysql restart`


софт для установки на боевом сервере
---------
apt-get install mc
apt-get install htop
apt-get install mysql (точная команда требует уточнений)
apt-get install ncdu (команда ncdu /)


команды для нпм
---------
`npm install --link --production` - зависимости ставятся командой 


про создание поддоменов при работе с NodeJS
---------
В конце поддомена обязательно должна быть точка, например:
beta.gdetus.io.	A 141.8.194.121

или (без точки):

beta A 141.8.194.121

После обновления записей необходимо подождать от 2 до 8 часов.