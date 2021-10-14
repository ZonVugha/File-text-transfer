
# File-text-transfer

基于NodeJS 构建的文件文本传输工具  
简单易用




## 配置环境和运行

如果你没有安装NodeJS的话首先请安装[NodeJS](https://nodejs.org/en/download/)  
然后到[releases](https://github.com/ZonVugha/File-text-transfer/releases)
下载最新的压缩包，解压，然后进入解压后的文件夹  
打开配置文件`config.json`根据下面的提示做出相应的配置  
打开控制台进入文件根目录运行命令
```bash
    npm install
    node start
```
打开浏览器输入  
你部署机器的本地ip加你设置的端口 例如`192.168.1.1:8080`开始使用  
记得开放对应端口


  
## 配置文件config.json


```bash
{
    "server": {
        "post": 8080,//运行端口
        "https": false,//是否启用https协议默认关闭启用需要相应的证书可以选择自签名证书，在局域网使用建议关闭
        "key": "server.key",//key文件名如果不使用https不用管
        "cert": "server.cert"//cert文件名如果不使用https不用管
    },
    "private": {
        "useVerify": false,//是否启用登录验证默认关闭在局域网使用建议关闭
        "username": "username",//登录账号
        "password": "password"//登录密码
    },
    "fileMaxSize": "209715200"//上传的文件大小最大值单位为byte 默认200MB(200*1024*1024)
}
```
    
## 生成自签名证书

打开控制台进入根目录运行以下命令

```bash
  openssl req -nodes -new -x509 -keyout server.key -out server.cert
```
填写对应的信息
```bash
  Country Name (2 letter code) []:             //国家名

  State or Province Name (full name) []:        //州/省名字

  Locality Name (eg, city) []:            //地/市名

  Organization Name (eg, company) []:           //组织/公司名字

  Organizational Unit Name (eg, section) []:      //单位名

  Common Name (eg, your name or your server's hostname) []:         //服务器名或个人名

  Email Address []:          //邮箱地址可不填

```
