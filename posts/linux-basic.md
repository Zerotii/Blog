---
title: "Linux基础"
description: "Linux系统基础知识和常用命令"
date: "2024-01-15"
category: "Linux"
tags: ["linux", "command", "基础"]
---

# Linux基础

## Linux的目录结构

- abc
  - def
    - hello.txt
  - g
- home（用户目录）
  - root
  - zeroti
- etc（配置文件）
- lib（依赖库）
- bin（所有用户都能使用的基本命令）
- boot（启动文件，内核等）
- dev（设备文件，比如磁盘分区等）
- sbin（系统命令管理员使用）
- usr（unix software resource，存放可分享与不可变动的数据）
  - bin（绝大部分用户可使用的命令，与开机无关）
  - sbin（非系统正常运行所需的系统命令）
  - lib（依赖库）
- mnt（挂载文件系统）
- var（常态化可变文件，比如缓存、log等）

## Linux的磁盘挂载和逻辑分区

例：

```bash
sudo mount /dev/sda1 /home
```

则将sda1分区挂载到home

此时若再使用

```bash
sudo mount /dev/sdc2 /home
```

就会把原来的挂在摘下来，此时再访问home时，访问的就是sdc2分区

## 环境变量的设置

### 永久设置

1. 打开~/.bashrc把以下添加到行尾

```bash
export PATH=${PATH}:/<想要添加的路径>
```

2. 使用source命令使其生效

```bash
source ~/.bashrc
```

### 临时设置

```bash
export PATH=${PATH}:/<想要添加的路径>
```