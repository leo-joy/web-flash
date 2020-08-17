# 第一步
systemctl restart docker

# 第二步
docker start mysqlFR tomcatFR nginxFR nodeFRInterface

#正式服务器 创建容器
#1、创建mysql 容器
#docker run -d -p 3306:3306 --privileged=true --name mysqlFR  -v $PWD/data/mysql:/etc/mysql  -e MYSQL_ROOT_PASSWORD=dp2015  mysql:5.7

#2、创建tomcat 容器
#docker run -itd -p 8080:8082 --privileged=true --link mysqlFR:mysqlcontainer --name tomcatFR -v $PWD/data/runtime:/home/user/faren/data/runtime -v $PWD/service/java/webapps:/usr/local/tomcat/webapps  tomcat

#3、创建nginx容器
#docker run -d -p 80:80 --privileged=true --name nginxFR  -v $PWD/client/dist:/usr/share/nginx/html  nginx:1.17.3
docker run --name nginxFRHTTPS \
        -p 443:443\
        -v $PWD/client/dist:/usr/share/nginx/html:rw\
        -v $PWD/client/nginx/ssl:/ssl/:rw\
        -d nginx:1.17.3

#4、接口服务
#docker run -itd -p 5008:3000 --privileged=true --name nodeFRInterface -v $PWD/service/nodeInterface:/usr/src/app -w /usr/src/app  node:10.16.3 npm start



#测试服务器 创建容器
#1、创建mysql 容器
#docker run -d -p 3306:3306 --privileged=true --name mysqlFR  -v $PWD/data/mysql:/etc/mysql  -e MYSQL_ROOT_PASSWORD=dp2015  mysql:5.7

#2、创建tomcat 容器
#docker run -itd -p 8090:8082 --privileged=true --link mysqlFR:mysqlcontainer --name tomcatFRTEST -v $PWD/data/runtime:/home/user/faren/data/runtime -v $PWD/service/java/webapps:/usr/local/tomcat/webapps  tomcat

#3、创建nginx容器
#docker run -d -p 4010:80 --privileged=true --name nginxFRTEST  -v $PWD/client/dist:/usr/share/nginx/html  nginx:1.17.3

#4、接口服务
#docker run -itd -p 5008:3000 --privileged=true --name nodeFRInterface -v $PWD/service/nodeInterface:/usr/src/app -w /usr/src/app  node:10.16.3 npm start