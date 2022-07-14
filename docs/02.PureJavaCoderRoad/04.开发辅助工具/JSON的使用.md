---
title: JSON的使用
date: 2022-05-26 17:04:06
permalink: /pages/JSON%E7%9A%84%E4%BD%BF%E7%94%A8
lock: false
categories: 
  - PureJavaCoderRoad
  - 开发辅助工具
tags: 
  - JSON
  - 使用
---
## 1、什么是 JSON ？

- JSON 指的是 JavaScript 对象表示法（*J*ava*S*cript *O*bject *N*otation）
- JSON 是轻量级的文本数据交换格式
- JSON 独立于语言 
- JSON 具有自我描述性，更易理解

JSON 使用 JavaScript 语法来描述数据对象，但是 JSON 仍然独立于语言和平台。JSON 解析器和 JSON 库支持许多不同的编程语言。

JSON 值可以是：

- 数字（整数或浮点数）
- 字符串（在双引号中）
- 逻辑值（true 或 false）
- 数组（在中括号中）
- 对象（在大括号中）
- null

**eg1：**

普通的JSON，而且key可以继续嵌套JSON和数组

```json
{
    "id":1,
    "name":"HaC",
    "isPersonal":true,
    "regions":[
        "cn-guangzhou",
        "cn-shenzhen"
    ],
    "weChat":{
        "wxName":"HelloCoder",
        "wxAuthor":[
            "HaC",
            "HaC200"
        ]
    }
}
```

**eg2：**

JSON也可以是一个数组，称为JSONArray

```
[
    "HaC",
    "HaC200"
]
```

> 注意：JSON的最后的key是没有逗号结尾的
>
> 日常开发大部分遇到的都是以上这两种JSON格式，所以在开发中要和定义好JSON的格式

大家可以在 https://www.json.cn/ 这个网站进行JSON进行校验和格式化。



## 2、JSON可以用来做什么？

- JSON 是用于存储和传输数据的格式。

- JSON 通常用于服务端向网页传递数据 。

  

例如：

打开Chrome浏览器，访问CSDN的文章，点击`NetWork`，左侧的Name就是这次请求的**URL和资源**，右侧的红框就是你点击的某个URL的返回数据，可以看到这是个json。

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210312101356615.png)

使用JSON无法就是：

- 把JSON格式的数据返回给前端
- 接收前端传过来的JSON，然后解析，拿到Key和Value
- Http请求，得到返回的JSON参数，然后解析，拿到Key和Value

可以在Postman工具新建一个request进行测试，然后输入你需要测试的接口URL，填上参数。

选择body，点击raw，再点击右侧的选用JSON就行了。

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210407154548005.png)



## 3、Java中使用JSON

目前最受欢迎的JSON组件就是：

- [Gson](https://github.com/google/gson): 谷歌开发的 JSON 库，功能十分全面。
- [FastJson](https://github.com/alibaba/fastjson): 阿里巴巴开发的 JSON 库，性能十分优秀。
- [Jackson](https://github.com/FasterXML/jackson): 社区十分活跃且更新速度很快。



我比较喜欢使用阿里巴巴的FastJson，在maven的pom文件引入即可：

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.62</version>
</dependency>
```

FastJson可以让JSON和Java对象、字符串、Map 进行互相转换。

## 4、列举一些我常用的FastJson的API

还是以上面这个JSON为例：

```java
public class FastJsonTest {
    public static void main(String[] args) {
        String jsonStr = "{\n" +
                "    \"id\":1,\n" +
                "    \"name\":\"HaC\",\n" +
                "    \"isPersonal\":true,\n" +
                "    \"regions\":[\n" +
                "        \"cn-guangzhou\",\n" +
                "        \"cn-shenzhen\"\n" +
                "    ],\n" +
                "    \"weChat\":{\n" +
                "        \"wxName\":\"HelloCoder\",\n" +
                "        \"wxAuthor\":[\n" +
                "            \"HaC\",\n" +
                "            \"HaC200\"\n" +
                "        ]\n" +
                "    }\n" +
                "}";

   
    }
}
@Data
class HaC {
    Integer id;
    String name;
    boolean isPersonal;
    String[] regions;
    WeChat weChat;
    @Data
    class WeChat{
        String wxName;
        List wxAuthor;
    }
}
}
```



### 1、JSONString 转 Java对象

```java
 HaC haCObject = JSON.parseObject(jsonStr, HaC.class);
```

这里JSONArray可以自动转为数组或者List。

### 2、java对象转JSONObject 

```java
JSONObject jsonObj = (JSONObject) JSON.toJSON(haCObject);
System.out.println(jsonObj.get("weChat"));
JSONObject jsonObj = (JSONObject) JSON.toJSON(haCObject);
JSONObject jsonObjWeChat = (JSONObject)jsonObj.get("weChat");
System.out.println(jsonObjWeChat.get("wxName")); //HelloCoder
jsonObj.put("sex","男");
```

转为JSONObject 可以根据某个key获取值，也可以自定义添加key。

### 3、JSONObject 对象转json

```java
JSON json = (JSON) JSON.toJSON(jsonObj);
```

### 4、转为jsonString

```java
String jsonStr1 =  jsonObj.toJSONString();
String jsonStr2 =  json.toJSONString();
```

### 5、对象转json字符串

```java
String s = JSON.toJSONString(haCObject)
```

如果对象参数存在null，则变成空串：

```java
String jsonStr = JSON.toJSONString(haCObject,SerializerFeature.WriteMapNullValue);
```

SerializerFeature这个类有很多参数，大家可以点击跳转过去了解一下



### 6、 转为JSONArray 

```java
HaC haCObject = JSON.parseObject(jsonStr, HaC.class);
JSONObject jsonObj = (JSONObject) JSON.toJSON(haCObject);
JSONObject jsonObjWeChat = (JSONObject) jsonObj.get("weChat");
//        wxAuthor 是个数组
JSONArray jsonArray = jsonObjWeChat.getJSONArray("wxAuthor");
// 遍历jsonArray
for (int i = 0; i < jsonArray.size(); i++) {
  //  报错java.lang.String cannot be cast to com.alibaba.fastjson.JSONObject
  //  System.out.println(jsonArray.getJSONObject(i));
	System.out.println(jsonArray.getString(i));
}
```

`jsonArray.getString(i)` 和 `jsonArray.getJSONObject(i)` 的选择，要看这个数组里面的数据，用getString可以替代getJSONObject，反之不能。

如果 wxAuthor 里面还有一层 JSON：

```json
{
    "id":1,
    "name":"HaC",
    "isPersonal":true,
    "regions":[
        "cn-guangzhou",
        "cn-shenzhen"
    ],
    "weChat":{
        "wxName":"HelloCoder",
        "wxAuthor":[
            {
                "AuthorName":"HaC"
            },
            {
                "AuthorName":"HaC200"
            }
        ]
    }
}
```

此时应该用：

```java
for (int i = 0; i < jsonArray.size(); i++) {
    System.out.println(jsonArray.getJSONObject(i));
}
```

打印为：

```
{"AuthorName":"HaC"}
{"AuthorName":"HaC200"}
```



以上就是JSON的一些简单用法。