---
title: CopyOnWriteArrayList的实现原理
date: 2022-06-02 11:18:17
lock: false
permalink: /pages/CopyOnWriteArrayList%E7%9A%84%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86
categories: 
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - Java进阶
tags: 
  - CopyOnWriteArrayList
  - 实现原理
---
我们常用的ArrayList是线程不安全的，所以在高并发的场景下，我们会使用 CopyOnWriteArrayList 作为替代方案。