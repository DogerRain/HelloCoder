---
title: （3）部署静态网站到Tomcat服务器
date: 2022-07-14 16:13:16
permalink: /pages/%EF%BC%883%EF%BC%89%E9%83%A8%E7%BD%B2%E9%9D%99%E6%80%81%E7%BD%91%E7%AB%99%E5%88%B0Tomcat%E6%9C%8D%E5%8A%A1%E5%99%A8
categories: 
  - 专栏
  - 《从0到1搭建服务器》
tags: 
  - Tomcat
  - 服务器
lock: need
---
上一篇文章[【教你搭建服务器系列】（2）搭建服务器环境，安装JDK、MySQL、Redis、Tomcat、Nginx](https://blog.csdn.net/yudianxiaoxiao/article/details/109589101)我们已经部署好了服务器的环境，那么接下来我们就可以部署我们的项目了。

本篇文章准备了一个静态的HTML网页，手把手从0开始教你部署一个网站。

本篇文章部署的网站成品： [https://www.baimuxym.cn](https://www.baimuxym.cn/)

> 本篇文章演示的是部署在Centos7、Tomcat8.0的服务器

## 1、准备项目

通过ftp把**项目**上传到服务器。上传到  `/var/www/web/HaCresume`

如果你没有网站，可以在这里找到：[https://github.com/DogerRain/HaCresume](https://github.com/DogerRain/HaCresume)

clone 到本地即可。

目录结构如下：

![ ](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201012145731521.png)

找到tomcat目录下的`conf/server.xml`文件，在末尾  `<host> </host>`标签之间添加上：

```xml
<Context path="" docBase="/var/www/web/HaCresume/" debug="0" reloadable="true"/>
```

表示Tomcat的根目录就是这个了，不再是webapps下面了。

找到tomcat目录下的conf/web.xml文件，修改首页：

```xml
<welcome-file-list>
        <welcome-file>index.html</welcome-file>
        <welcome-file>index.htm</welcome-file>
        <welcome-file>index.jsp</welcome-file>
    </welcome-file-list>
```

表示我的 首页 就是  `/var/www/web/HaCresume/index.html` 了。

然后重启Tomcat，浏览器输入 你的服务器IP + 端口`http://81.71.16.134:8080/`

即可访问了：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201012150846031-11.png)

**注意：如果你开启了Nginx，需要把Nginx的80端口放开监听，或者关闭Nginx**

```bash
/usr/local/nginx/sbin//nginx -s stop
```



**虽然现在访问没有问题，但是还有几个问题：**

1、 网站提示连接是不安全的。

2、 能不能访问的时候不需要带端口？

3、能不能通过域名访问，就像 [www.baidu.com](www.baidu.com) 这样直接访问网站？。



如果你想深入的了解，那么就继续往下看。



## 2、域名注册、解析



一个域名只能对应一个ip地址，而一个ip地址可以对应多个域名。

现在我们已经有了IP，还需要买个域名。

腾讯云、阿里云都可以购买域名，以腾讯云为例，登入腾讯云后台，购买符合自己的域名。

以腾讯云新用户为例，一般只需要1块钱一年：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210513145741018.png)

购买完成、然后实名认证（否则不能使用80端口），域名就可以绑定你的IP了，专业术语叫 **解析**，我这里购买的域名是`baimuxym.cn`

[https://cloud.tencent.com/act/domainsales](https://cloud.tencent.com/act/cps/redirect?redirect=10010&cps_key=664b44b4e8e43b579d07036bf1c71060)

**解析：**

以腾讯云为例，登入后台，点击解析

> 解析：**解析的意思就是 把这个域名和你的服务器IP绑定

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201011231404960.png)

点击 **添加记录** ，你的域名还可以生成子域名，比如说 `baimuxym.cn` 是我的一级域名，默认分配了`www.baimuxym.cn`作为二级域名；`www.a.baimuxym.cn`、`www.b.baimuxym.cn` 也是可以的，表示三级域名。

我这里添加了一个 rain，`rain.baimuxym.cn` 就是我的二级域名了，如图所示：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201011231636181.png)

自此  `www.baimuxym.cn`  `rain.baimuxym.cn`  已经申请完成了，都是指向 `81.71.16.134` 这台服务器。

怎么知道有没有解析成功呢？我们ping一下就知道了：

```shell
C:\Users\Administrator>ping www.baimuxym.cn

正在 Ping www.baimuxym.cn [81.71.16.134] 具有 32 字节的数据:
来自 81.71.16.134 的回复: 字节=32 时间=8ms TTL=54
来自 81.71.16.134 的回复: 字节=32 时间=8ms TTL=54
来自 81.71.16.134 的回复: 字节=32 时间=8ms TTL=54
来自 81.71.16.134 的回复: 字节=32 时间=13ms TTL=54

81.71.16.134 的 Ping 统计信息:
    数据包: 已发送 = 4，已接收 = 4，丢失 = 0 (0% 丢失)，
往返行程的估计时间(以毫秒为单位):
    最短 = 8ms，最长 = 13ms，平均 = 9ms
```

IP正是我的服务器IP，说明解析成功。



然后我在浏览器输入 `http://www.baimuxym.cn:8080/` ，发现一样可以访问我的服务器了，和`http://81.71.16.134:8080/`是一样的效果。



## 3、修改Tomcat端口

`http://www.baimuxym.cn:8080` 访问还需要带端口，实在是麻烦。

我们知道Tomcat的默认端口是8080，那修改Tomcat额默认端口就行了。



找到tomcat目录下的conf/server.xml文件，修改端口：

```xml
    <Connector port="80" protocol="HTTP/1.1"

               connectionTimeout="20000"

               redirectPort="8443" />
```

重启Tomcat，输入 `http://www.baimuxym.cn`，就能访问了。因为`http://`默认就是 80 端口，而我的服务器80端口恰好就是Tomcat的端口，那么自然就能访问我的项目了。

> 要使用端口，需要先在后台先开放，不然无法访问。



## 4、申请SSL证书

我们访问自己的服务器，发现只能使用`http://`访问，还**提示连接不安全**，而使用 `https://` 是无法访问的。

即`https://www.baimuxym.cn`可以访问，而`http://www.baimuxym.cn`无法访问。



我们知道`http://` 是不安全的，端口为80；而`https://` 是安全的，端口为443。

要想使用`https://` ，我们就需要有SSL证书，证书可以通过两个渠道获得: 

- **自己生成**
- **商用证书**



在使用前，先把端口改了。

我们知道，8443是Tomcat **https://**的默认端口，就像8080是Tomcat的默认 **http://** 端口一样。

先把Tomcat的8843端口改了：

80跳转到443：

```xml
<Connector port="80" protocol="HTTP/1.1"

           connectionTimeout="20000"

           redirectPort="443" />
```
8009跳转到443：

```xml
 <!-- Define an AJP 1.3 Connector on port 8009 -->

 <Connector port="8009" protocol="AJP/1.3" redirectPort="443" />
```



#### 	1、自己生成

虽然安全性不是那么高,但胜在成本低。



下面演示一下在Tomcat下使用jdk自带的工具生成证书。



##### 	1.1、 生成keystore证书

进入jdk的bin目录

执行：

```
keytool -genkey -v -alias testKey -keyalg RSA -validity 3650 -keystore ~/cert/HaC.keystore
```

- alias: 别名 这里起名HaC.keystore
- keyalg: 证书算法，RSA
- validity：证书有效时间 3650，即10年
- keystore：证书生成的目标路径和文件名,替换成你自己的路径即可,我定义的是 ~/cert/HaC.keystore

```shell
[root@VM-8-8-centos ~]# cd /var/www/web/jdk/jdk1.8.0_261/bin/
[root@VM-8-8-centos bin]# mkdir ~/cert
[root@VM-8-8-centos bin]# keytool -genkey -v -alias testKey -keyalg RSA -validity 3650 -keystore ~/cert/HaC.keystore
Enter keystore password:
Re-enter new password:
What is your first and last name?
  [Unknown]:  HaC
What is the name of your organizational unit?
  [Unknown]:  baimuTel
What is the name of your organization?
  [Unknown]:  yudianxx
What is the name of your City or Locality?
  [Unknown]:  guangzhou
What is the name of your State or Province?
  [Unknown]:  guangdong
What is the two-letter country code for this unit?
  [Unknown]:  86
Is CN=HaC, OU=baimuTel, O=yudianxx, L=guangzhou, ST=guangdong, C=86 correct?
  [no]:  y

Generating 2,048 bit RSA key pair and self-signed certificate (SHA256withRSA) with a validity of 3,650 days
        for: CN=HaC, OU=baimuTel, O=yudianxx, L=guangzhou, ST=guangdong, C=86
Enter key password for <testKey>
        (RETURN if same as keystore password):
Re-enter new password:
[Storing /root/cert/HaC.keystore]

Warning:
The JKS keystore uses a proprietary format. It is recommended to migrate to PKCS12 which is an industry standard format using "keytool -importkeystore -srckeystore /root/cert/HaC.keystore -destkeystore /root/cert/HaC.keystore -deststoretype pkcs12".
```



信息可以随便填，但是密码要记得，下面要用到。



##### 	1.2、 tomcat配置https

tomcat的conf目录下,打开server.xml文件



修改，加入刚才生成的证书路径，keystoreFile 你的keystore路径，keystorePass 是刚才生成时输入的密码。把Tomcat的默认的`https://`端口8443修改为443，不然你只能通过 `https://www.baimuxym.cn:8443` 访问了

```xml
 <Connector port="443" protocol="org.apache.coyote.http11.Http11NioProtocol"
               maxThreads="150" SSLEnabled="true" scheme="https" secure="true"
               clientAuth="false" sslProtocol="TLS" keystoreFile="/root/cert/HaC.keystore" keystorePass="123456"/>
```



##### 	1.3、 设置http自动跳转到https

把http的请求都转发到https

找到tomcat目录下的conf/web.xml文件，末尾 加入：

```xml
 <!-- ====================自动跳转——start ===================== -->
  <security-constraint>
    <web-resource-collection >
              <web-resource-name >SSL</web-resource-name>
              <url-pattern>/*</url-pattern>
       </web-resource-collection>                             
       <user-data-constraint>
       <transport-guarantee>CONFIDENTIAL</transport-guarantee>
       </user-data-constraint>
  </security-constraint>
<!-- ====================自动跳转——end ===================== -->
  <welcome-file-list>
        <welcome-file>index.html</welcome-file>
        <welcome-file>index.htm</welcome-file>
        <welcome-file>index.jsp</welcome-file>
  </welcome-file-list>
```



重启tomcat，访问我的域名。 [https://www.baimuxym.cn](https://www.baimuxym.cn/)

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201012095954123.png)



发现是提示证书存在安全问题 的，点击继续浏览 但是仍然 可以访问。



导出证书：

```shell
[root@VM-8-8-centos apache-tomcat-8.0.53]# keytool -exportcert -rfc -alias HaC -file  ~/cert/HaC.cer -keystore  ~/cert/HaC.keystore -storepass 123456      

Certificate stored in file </root/cert/HaC.cer>
```

给浏览器安装证书：

> 在ie浏览器下，进入“Internet选项”-“内容”-“证书”-在“受信任的根证书颁发机构”中导入tomcat.cer文件。

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/clipboard-1602490357282.png)

浏览器 一样提示 **不安全的连接**。

没办法了，浏览器也无法信任自定义的证书。

> 我看到网上也有人 添加了受信任的证书后就提示安全了，我这里试了确实不行，希望有小伙伴告诉我到底可不可以。
>
> 可能是以前可以，现在不行了？





#### 	2、公开可信认证机构

keyken生成的不行，那就用商用的。

但商用的SSL实在是太贵了，比如说赛门铁克、亚信，个人一般都难以承受；

**let's encrypt** 是一个免费的SSL组织，申请后有3个月的期限，到期可以续杯。

云厂商也可以申请证书，只要你购买了它们的域名。

##### 2.1、申请证书

腾讯云 可以免费申请 1年的免费证书（**到期可以继续 续**），我这里使用腾讯云为例子：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/clipboard-1602490419094.png)



申请完毕，点击下载 ， 解压看到这个压缩包有几种服务器的不同类型证书。

![img](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/clipboard-1602490530864.png)

我们是Tomcat的服务器，就把Tomcat的`.jks`文件证书上传到服务器。



##### 	2.2、tomcat配置https

替换server.xml的jks证书路径和密码即可：

```xml
<Connector port="443" protocol="org.apache.coyote.http11.Http11NioProtocol"

               maxThreads="150" SSLEnabled="true" scheme="https" secure="true"

               clientAuth="false" sslProtocol="TLS" keystoreFile="/root/cert/www.baimuxym.cn.jks" keystorePass="i24vj6841f1"/>
```



##### 	2.3、设置http自动跳转到https 

把http的请求都转发到https：

找到tomcat目录下的conf/web.xml文件，末尾 加入：

```xml
 <!-- ====================自动跳转——start ===================== -->
  <security-constraint>
    <web-resource-collection >
              <web-resource-name >SSL</web-resource-name>
              <url-pattern>/*</url-pattern>
       </web-resource-collection>                             
       <user-data-constraint>
       <transport-guarantee>CONFIDENTIAL</transport-guarantee>
       </user-data-constraint>
  </security-constraint>
<!-- ====================自动跳转——end ===================== -->
  <welcome-file-list>
        <welcome-file>index.html</welcome-file>
        <welcome-file>index.htm</welcome-file>
        <welcome-file>index.jsp</welcome-file>
  </welcome-file-list>
```



然后重启Tomcat。访问  [https://www.baimuxym.cn](https://www.baimuxym.cn/)

> 如果不生效，可以更换浏览器访问试试

现在就不会提示证书不安全了。完美！

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201011214916243-1602490397611.png)



到这里，一个项目就已经部署完成了，但只是一个静态网页。

部署JavaWeb项目，也是一样的操作，只不过要结合Redis、MySQL等等。



体验地址：

-  [https://www.baimuxym.cn](https://www.baimuxym.cn/)
- [https://rain.baimuxym.cn](https://rain.baimuxym.cn)

