---
title: "Git基本命令"
description: "Git版本控制系统的常用命令和使用方法"
date: "2024-01-10"
category: "Git"
tags: ["git", "version-control", "command"]
---

# Git基本命令

## 初始化和配置

### 初始化仓库

```bash
git init
```

### 配置用户信息

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 基本操作

### 添加文件

```bash
# 添加单个文件
git add filename.txt

# 添加所有文件
git add .

# 添加特定类型的文件
git add *.js
```

### 提交更改

```bash
git commit -m "提交信息"
```

### 查看状态

```bash
git status
```

### 查看历史

```bash
git log
git log --oneline
git log --graph --oneline
```

## 分支操作

### 创建分支

```bash
git branch new-branch
```

### 切换分支

```bash
git checkout new-branch
# 或者
git switch new-branch
```

### 创建并切换分支

```bash
git checkout -b new-branch
# 或者
git switch -c new-branch
```

### 合并分支

```bash
git merge branch-name
```

### 删除分支

```bash
git branch -d branch-name
```

## 远程操作

### 添加远程仓库

```bash
git remote add origin https://github.com/username/repository.git
```

### 推送到远程

```bash
git push -u origin main
```

### 从远程拉取

```bash
git pull
```

### 克隆仓库

```bash
git clone https://github.com/username/repository.git
```