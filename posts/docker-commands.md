---
title: "Docker基本命令"
description: "Docker容器化技术基础命令和操作"
date: "2024-01-20"
category: "Docker"
tags: ["docker", "容器", "command"]
---

# Docker基本命令

## 帮助命令

```bash
docker version				# 显示docker版本信息
docker info					# 显示docker系统信息，包括镜像和容器数量
docker 命令 --help		# 帮助命令
```

## 镜像命令

### docker images

- 查看所有本地主机上的镜像

```bash
zeroti@zeroti_PC:~$ docker images
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
hello-world   latest    feb5d9fea6a5   7 months ago   13.3kB

# 解释
REPOSITORY	镜像的仓库源
TAG			镜像的标签
IMAGE ID	镜像的id
CREATED		镜像的创建时间
SIZE		镜像的大小

# 可选项
  -a, --all             # 列出所有的镜像
  -q, --quiet           # 只显示id
```

### docker search

- 搜索镜像

```bash
zeroti@zeroti_PC:~$ docker search mysql
NAME                             DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
mysql                            MySQL is a widely used, open-source relation…   12491     [OK]
mariadb                          MariaDB Server is a high performing open sou…   4808      [OK]

# 可选项，通过收藏来过滤
--filter=STARS=3000   # 搜索出来的镜像STARS大于3000
```

### docker pull

- 下载镜像

```bash
# 下载最新版本
docker pull mysql

# 下载指定版本
docker pull mysql:8.0

# 下载并重命名
docker pull mysql/mysql-server:latest
```