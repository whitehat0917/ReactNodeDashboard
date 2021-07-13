# ProxyBotAdmin
This is MERN project for Proxy bot admin panel.
This project must be in same server with Proxy bot, SquidAPI project.

## How to run this project
1. Run SquidAPI Project
    - git clone https://github.com/amshandev/SquidApi.git
    - cd SquidApi/sh
    - bash initialize.sh (please set password as root)
2. Run ProxyBot Project
    - git clone https://github.com/amshandev/ProxyBot.git
    - sudo npm install(node version 12.2.0)
    - cd paypal/payPqlClient.js
        clientId = your discord bot's clientId 
        clientSecret = your discord bot's clientSecret
    - cd config/config.js
        squidAddress = Your SquidAPI address: example - 141.138.142.163:8080
    - node index.js
3. Run Proxy Admin Portal Project
    - install mysql and import initdb.sql
    - git clone https://github.com/amshandev/TokeProxies.git
    - cd server
    - sudo npm install(node version 12.2.0)
    - node server.js
    (If mysql error occurs, in mysql command, please run <ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';flush privileges;SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));>)

    - cd client
    - sudo npm install(node version 12.2.0)
    - cd src/config.js
    - serverAddress = Your server address: example - 141.138.142.163:8000
    - npm start


live site example: http://141.138.142.163:4000

If you find the errors when you install npm, please convert node version to 12.2.0

*Requirements
In order to run this project you need to run SquidApi project.
And then you have to change SquidAPI's IP address in server/app/config/auth.config.js
You can find SquidAPI project in this git account.