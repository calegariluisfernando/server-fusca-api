#!/bin/bash
MYSQLDCONFBKP="/etc/mysql/mysql.conf.d/mysqld.cnf.bak"
MYSQLDCONF="/etc/mysql/mysql.conf.d/mysqld.cnf"

MONGODCONFBKP="/etc/mongod.conf.bak"
MONGODCONF="/etc/mongod.conf"

if ! [ -f "$MYSQLDCONFBKP" ]
then

    debconf-set-selections <<< 'mysql-server mysql-server/root_password password toor'
    debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password toor'

    apt-get update

    apt-get -y install curl
    apt-get -y install mysql-server

    # Realizando Backup do arquvo
    cp $MYSQLDCONF "$MYSQLDCONF".bak
    `sed -i 's/mysqlx-bind-address/# mysqlx-bind-address/g' "$MYSQLDCONF"`
    `sed -i 's/bind-address/# bind-address/g' "$MYSQLDCONF"`

    echo "bind-address            = 0.0.0.0" >> $MYSQLDCONF
    echo "mysqlx-bind-address     = 0.0.0.0" >> $MYSQLDCONF

    mysql -uroot -ptoor -e \
        "CREATE DATABASE fusca; CREATE DATABASE fuscaTest; CREATE USER 'root'@'%' IDENTIFIED BY 'toor'; GRANT ALL PRIVILEGES ON *.* TO 'root'@'%'; ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'toor'"

    systemctl restart mysql

fi

if ! [ -f "$MONGODCONFBKP" ]
then

    cp $MONGODCONF "$MONGODCONF".bak

    curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
    apt update
    apt install mongodb-org -y
    systemctl start mongod.service
    systemctl enable mongod

    `sed -i 's/bindIp: 127.0.0.1/bindIp: 0.0.0.0/g' "$MONGODCONF"`

    systemctl restart mongod.service

fi