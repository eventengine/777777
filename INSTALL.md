
Инсталяция на боевом сервере (16.04.1)
============================

Установка Node.js версии 6.х.х
-----------------------

Для Убунты инструкция тут:  
https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions

```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Установка MySQL
-----------------------

http://dev.mysql.com/doc/mysql-apt-repo-quick-guide/en/

```
sudo apt-get update
sudo apt-get install mysql-server 
```

```
sudo service mysql status
sudo service mysql stop
sudo service mysql start
sudo service mysql restart
```

Дать удаленный доступ к MySQL
-----------------------

```
/etc/mysql/my.cnf
```

```
[mysqld]
bind-address = 0.0.0.0
# skip-networking

mysql -uroot -p
use mysql
SELECT Host,User FROM user;
CREATE USER 'root'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
FLUSH PRIVILEGES;
```

Проверка порта
```
netstat -an | grep 3306
```

Установка вебмин
-----------------------

http://help.ubuntu.ru/wiki/webmin
http://www.webmin.com/deb.html


