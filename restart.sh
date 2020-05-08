# 第一步
systemctl restart docker

# 第二步
docker start mysqlFR tomcatFR nginxFR

#创建容器
#1、创建mysql 容器
#docker run -d -p 3306:3306 --privileged=true --name mysqlFR  -v $PWD/data/mysql:/etc/mysql  -e MYSQL_ROOT_PASSWORD=dp2015  mysql:5.7

#2、创建tomcat 容器
#docker run -itd -p 8080:8082 --privileged=true --link mysqlFR:mysqlcontainer --name tomcatFR -v $PWD/data/runtime:/home/user/faren/data/runtime -v $PWD/service/java/webapps:/usr/local/tomcat/webapps  tomcat

#7、创建nginx容器
#docker run -d -p 80:80 --privileged=true --name nginxFR  -v $PWD/client/dist:/usr/share/nginx/html  nginx:1.17.3