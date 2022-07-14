---
title: MySQL如何行转列？
date: 2022-06-02 11:18:18
lock: false
permalink: /pages/MySQL%E5%A6%82%E4%BD%95%E8%A1%8C%E8%BD%AC%E5%88%97%EF%BC%9F
categories: 
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - MySQL
tags: 
  - MySQL
  - 如何行转列
---
MySQL不像Oracle有行转列的函数，但是可以通过一些语法获取。

先来个例子

```sql
-- 创建表  学生表
CREATE TABLE `student` (
    `stuid` VARCHAR(16) NOT NULL COMMENT '学号',
    `stunm` VARCHAR(20) NOT NULL COMMENT '学生姓名',
    PRIMARY KEY (`stuid`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB; 


-- 课程表 

CREATE TABLE `courses` (
    `courseno` VARCHAR(20) NOT NULL,
    `coursenm` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`courseno`)
)
COMMENT='课程表'
COLLATE='utf8_general_ci'
ENGINE=InnoDB;


-- 成绩表
CREATE TABLE `score` (
    `stuid` VARCHAR(16) NOT NULL,
    `courseno` VARCHAR(20) NOT NULL,
    `scores` FLOAT NULL DEFAULT NULL,
    PRIMARY KEY (`stuid`, `courseno`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

-- 插入数据

-- 学生表数据

Insert Into student (stuid, stunm) Values('1001', '张三');
Insert Into student (stuid, stunm) Values('1002', '李四');
Insert Into student (stuid, stunm) Values('1003', '赵二');
Insert Into student (stuid, stunm) Values('1004', '王五');
Insert Into student (stuid, stunm) Values('1005', '刘青');
Insert Into student (stuid, stunm) Values('1006', '周明');

-- 课程表数据 
Insert Into courses (courseno, coursenm) Values('C001', '大学语文');
Insert Into courses (courseno, coursenm) Values('C002', '新视野英语');
Insert Into courses (courseno, coursenm) Values('C003', '离散数学');
Insert Into courses (courseno, coursenm) Values('C004', '概率论与数理统计');
Insert Into courses (courseno, coursenm) Values('C005', '线性代数');
Insert Into courses (courseno, coursenm) Values('C006', '高等数学(一)');
Insert Into courses (courseno, coursenm) Values('C007', '高等数学(二)');

-- 成绩表数据

Insert Into score(stuid, courseno, scores) Values('1001', 'C001', 67);
Insert Into score(stuid, courseno, scores) Values('1002', 'C001', 68);
Insert Into score(stuid, courseno, scores) Values('1003', 'C001', 69);
Insert Into score(stuid, courseno, scores) Values('1004', 'C001', 70);
Insert Into score(stuid, courseno, scores) Values('1005', 'C001', 71);
Insert Into score(stuid, courseno, scores) Values('1006', 'C001', 72);
Insert Into score(stuid, courseno, scores) Values('1001', 'C002', 87);
Insert Into score(stuid, courseno, scores) Values('1002', 'C002', 88);
Insert Into score(stuid, courseno, scores) Values('1003', 'C002', 89);
Insert Into score(stuid, courseno, scores) Values('1004', 'C002', 90);
Insert Into score(stuid, courseno, scores) Values('1005', 'C002', 91);
Insert Into score(stuid, courseno, scores) Values('1006', 'C002', 92);
Insert Into score(stuid, courseno, scores) Values('1001', 'C003', 83);
Insert Into score(stuid, courseno, scores) Values('1002', 'C003', 84);
Insert Into score(stuid, courseno, scores) Values('1003', 'C003', 85);
Insert Into score(stuid, courseno, scores) Values('1004', 'C003', 86);
Insert Into score(stuid, courseno, scores) Values('1005', 'C003', 87);
Insert Into score(stuid, courseno, scores) Values('1006', 'C003', 88);
Insert Into score(stuid, courseno, scores) Values('1001', 'C004', 88);
Insert Into score(stuid, courseno, scores) Values('1002', 'C004', 89);
Insert Into score(stuid, courseno, scores) Values('1003', 'C004', 90);
Insert Into score(stuid, courseno, scores) Values('1004', 'C004', 91);
Insert Into score(stuid, courseno, scores) Values('1005', 'C004', 92);
Insert Into score(stuid, courseno, scores) Values('1006', 'C004', 93);
Insert Into score(stuid, courseno, scores) Values('1001', 'C005', 77);
Insert Into score(stuid, courseno, scores) Values('1002', 'C005', 78);
Insert Into score(stuid, courseno, scores) Values('1003', 'C005', 79);

-- 三个表单独情况
select st.stuid,st.stunm  from student  st ;

select sc.stuid , sc.courseno,sc.scores  from score sc ;

select  cs.courseno,cs.coursenm   from courses cs;
 

-- 正常连表查询，结果见图一
select   st.stuid ID ,  st.stunm 姓名, cs.coursenm 课程名 ,sc.scores 成绩     from  student st, score sc ,courses cs
where st.stuid = sc.stuid and sc.courseno = cs.courseno  ;

-- 结果看下图二
select st.stuid 编号, st.stunm 姓名 ,
Max(case c.coursenm when '大学语文' then s.scores else 0 end ) '大学语文',
max(case c.coursenm when '新视野英语' then IFNULL(s.scores,0)else 0 end) '新视野英语',
Max(case c.coursenm when '离散数学' then IFNULL(s.scores,0) ELSE 0 END) '离散数学',
MAX(case c.coursenm when '概率论与数理统计' then IFNULL(s.scores,0) else 0 end) '概率论与数理统计',
MAX(case c.coursenm  when '线性代数' then IFNULL(s.scores,0) else 0 END) '线性代数',
MAX(case c.coursenm when '高等数学(一)' THEN IFNULL(s.scores,0) else 0 end) '高等数学(一)',
MAX(case c.coursenm when '高等数学(二)' THEN IFNULL(s.scores,0) else 0 end) '高等数学(二)',
round(AVG(s.scores),2) as 平均分,
SUM(s.scores) as 总分
from  student st 
LEFT JOIN score s on st.stuid = s.stuid
LEFT JOIN courses c on c.courseno = s.courseno
GROUP BY st.stuid;

-- 结果看图三
select   s.stuid 编号 , GROUP_CONCAT(courseno) 课程号 , GROUP_CONCAT(s.scores)  成绩  from score s GROUP BY  s.stuid;
```



图一：

这是正常的连表查询

```sql
+------+------+------------------+------+
| ID   | 姓名 | 课程名           | 成绩 |
+------+------+------------------+------+
| 1001 | 张三 | 大学语文         |   67 |
| 1001 | 张三 | 新视野英语       |   87 |
| 1001 | 张三 | 离散数学         |   83 |
| 1001 | 张三 | 概率论与数理统计  |   88 |
| 1001 | 张三 | 线性代数         |   77 |
| 1002 | 李四 | 大学语文         |   68 |
| 1002 | 李四 | 新视野英语       |   88 |
| 1002 | 李四 | 离散数学         |   84 |
| 1002 | 李四 | 概率论与数理统计  |   89 |
| 1002 | 李四 | 线性代数         |   78 |
| 1003 | 赵二 | 大学语文         |   69 |
| 1003 | 赵二 | 新视野英语       |   89 |
| 1003 | 赵二 | 离散数学         |   85 |
| 1003 | 赵二 | 概率论与数理统计  |   90 |
| 1003 | 赵二 | 线性代数         |   79 |
| 1004 | 王五 | 大学语文         |   70 |
| 1004 | 王五 | 新视野英语       |   90 |
| 1004 | 王五 | 离散数学         |   86 |
| 1004 | 王五 | 概率论与数理统计  |   91 |
| 1005 | 刘青 | 大学语文         |   71 |
| 1005 | 刘青 | 新视野英语       |   91 |
| 1005 | 刘青 | 离散数学         |   87 |
| 1005 | 刘青 | 概率论与数理统计  |   92 |
| 1006 | 周明 | 大学语文         |   72 |
| 1006 | 周明 | 新视野英语       |   92 |
| 1006 | 周明 | 离散数学         |   88 |
| 1006 | 周明 | 概率论与数理统计  |   93 |
+------+------+------------------+------+
```

图二：

```sql
+------+------+----------+------------+----------+------------------+----------+--------------+--------------+--------+------+
| 编号 | 姓名 | 大学语文 | 新视野英语 | 离散数学 | 概率论与数理统计 | 线性代数 | 高等数学(一) | 高等数学(二) | 平均分 | 总分 |
+------+------+----------+------------+----------+------------------+----------+--------------+--------------+--------+------+
| 1001 | 张三 |       67 |         87 |       83 |               88 |       77 |            0 |            0 |  80.40 |  402 |
| 1002 | 李四 |       68 |         88 |       84 |               89 |       78 |            0 |            0 |  81.40 |  407 |
| 1003 | 赵二 |       69 |         89 |       85 |               90 |       79 |            0 |            0 |  82.40 |  412 |
| 1004 | 王五 |       70 |         90 |       86 |               91 |        0 |            0 |            0 |  84.25 |  337 |
| 1005 | 刘青 |       71 |         91 |       87 |               92 |        0 |            0 |            0 |  85.25 |  341 |
| 1006 | 周明 |       72 |         92 |       88 |               93 |        0 |            0 |            0 |  86.25 |  345 |
+------+------+----------+------------+----------+------------------+----------+--------------+--------------+--------+------+
```

这是行转列后的结果。

> 很多人可能不知道为什么要用MAX函数

如果不使用聚合函数（max、sum这些）：

```sql
select st.stuid 编号, st.stunm 姓名 ,
(case c.coursenm when '大学语文' then s.scores else 0 end ) '大学语文',
(case c.coursenm when '新视野英语' then IFNULL(s.scores,0)else 0 end) '新视野英语',
(case c.coursenm when '离散数学' then IFNULL(s.scores,0) ELSE 0 END) '离散数学',
(case c.coursenm when '概率论与数理统计' then IFNULL(s.scores,0) else 0 end) '概率论与数理统计',
(case c.coursenm  when '线性代数' then IFNULL(s.scores,0) else 0 END) '线性代数',
(case c.coursenm when '高等数学(一)' THEN IFNULL(s.scores,0) else 0 end) '高等数学(一)',
(case c.coursenm when '高等数学(二)' THEN IFNULL(s.scores,0) else 0 end) '高等数学(二)'
from  student st 
LEFT JOIN score s on st.stuid = s.stuid
LEFT JOIN courses c on c.courseno = s.courseno;
```

它的结果是这样的：

```sql
+------+------+----------+------------+----------+------------------+----------+--------------+--------------+
| 编号 | 姓名 | 大学语文 | 新视野英语 | 离散数学 | 概率论与数理统计 | 线性代数 | 高等数学(一) | 高等数学(二) |
+------+------+----------+------------+----------+------------------+----------+--------------+--------------+
| 1001 | 张三 |       67 |          0 |        0 |                0 |        0 |            0 |            0 |
| 1001 | 张三 |        0 |         87 |        0 |                0 |        0 |            0 |            0 |
| 1001 | 张三 |        0 |          0 |       83 |                0 |        0 |            0 |            0 |
| 1001 | 张三 |        0 |          0 |        0 |               88 |        0 |            0 |            0 |
| 1001 | 张三 |        0 |          0 |        0 |                0 |       77 |            0 |            0 |
| 1002 | 李四 |       68 |          0 |        0 |                0 |        0 |            0 |            0 |
| 1002 | 李四 |        0 |         88 |        0 |                0 |        0 |            0 |            0 |
| 1002 | 李四 |        0 |          0 |       84 |                0 |        0 |            0 |            0 |
| 1002 | 李四 |        0 |          0 |        0 |               89 |        0 |            0 |            0 |
| 1002 | 李四 |        0 |          0 |        0 |                0 |       78 |            0 |            0 |
| 1003 | 赵二 |       69 |          0 |        0 |                0 |        0 |            0 |            0 |
| 1003 | 赵二 |        0 |         89 |        0 |                0 |        0 |            0 |            0 |
| 1003 | 赵二 |        0 |          0 |       85 |                0 |        0 |            0 |            0 |
| 1003 | 赵二 |        0 |          0 |        0 |               90 |        0 |            0 |            0 |
| 1003 | 赵二 |        0 |          0 |        0 |                0 |       79 |            0 |            0 |
| 1004 | 王五 |       70 |          0 |        0 |                0 |        0 |            0 |            0 |
| 1004 | 王五 |        0 |         90 |        0 |                0 |        0 |            0 |            0 |
| 1004 | 王五 |        0 |          0 |       86 |                0 |        0 |            0 |            0 |
| 1004 | 王五 |        0 |          0 |        0 |               91 |        0 |            0 |            0 |
| 1005 | 刘青 |       71 |          0 |        0 |                0 |        0 |            0 |            0 |
| 1005 | 刘青 |        0 |         91 |        0 |                0 |        0 |            0 |            0 |
| 1005 | 刘青 |        0 |          0 |       87 |                0 |        0 |            0 |            0 |
| 1005 | 刘青 |        0 |          0 |        0 |               92 |        0 |            0 |            0 |
| 1006 | 周明 |       72 |          0 |        0 |                0 |        0 |            0 |            0 |
| 1006 | 周明 |        0 |         92 |        0 |                0 |        0 |            0 |            0 |
| 1006 | 周明 |        0 |          0 |       88 |                0 |        0 |            0 |            0 |
| 1006 | 周明 |        0 |          0 |        0 |               93 |        0 |            0 |            0 |
+------+------+----------+------------+----------+------------------+----------+--------------+--------------+
```

上面 case 匹配如果没有该字段，那只能是0，所以如果不用max，那拿到的只能说默认的第一行，也就是0.

> 如果还不明白
>
> 可以参考：https://blog.csdn.net/u014180504/article/details/79150492



图三：

```sql
+------+--------------------------+----------------+
| 编号 | 课程号                   | 成绩           |
+------+--------------------------+----------------+
| 1001 | C001,C002,C003,C004,C005 | 67,87,83,88,77 |
| 1002 | C001,C002,C003,C004,C005 | 68,88,84,89,78 |
| 1003 | C001,C002,C003,C004,C005 | 69,89,85,90,79 |
| 1004 | C001,C002,C003,C004      | 70,90,86,91    |
| 1005 | C001,C002,C003,C004      | 71,91,87,92    |
| 1006 | C001,C002,C003,C004      | 72,92,88,93    |
+------+--------------------------+----------------+
```

图三是个新函数`GROUP_CONCAT`的测试，可以略过~