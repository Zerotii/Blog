---
title: "Makefile基础教程"
description: "Makefile语法和常用编写规则"
date: "2024-01-25"
category: "Linux"
tags: ["makefile", "build", "automation"]
---

# Makefile基础教程

## 什么是Makefile

Makefile是一个构建自动化工具，用于管理项目的编译、链接等构建过程。它可以定义规则来自动构建目标文件。

## 基本语法

### 变量定义

```makefile
# 定义变量
CC = gcc
CFLAGS = -Wall -O2
TARGET = program
```

### 目标规则

```makefile
# 基本格式: 目标: 依赖
#         命令

main.o: main.c header.h
    $(CC) -c main.c $(CFLAGS)

program: main.o utils.o
    $(CC) -o program main.o utils.o $(LDFLAGS)
```

### 特殊变量

```makefile
# $@ - 目标文件名
# $< - 第一个依赖文件名
# $^ - 所有依赖文件名

%.o: %.c
    $(CC) -c $< -o $@ $(CFLAGS)
```

## 常用函数

### 字符串处理

```makefile
# 替换后缀
SRCS = main.c utils.c
OBJS = $(SRCS:.c=.o)

# 目录搜索
VPATH = src include
```

### 文件操作

```makefile
# 遍历目录
SOURCES = $(wildcard src/*.c)
OBJECTS = $(patsubst %.c,%.o,$(SOURCES))
```

## 完整示例

```makefile
# 编译器设置
CC = gcc
CFLAGS = -Wall -O2 -I./include
LDFLAGS = -lm

# 目标和依赖
TARGET = myprogram
SOURCES = $(wildcard src/*.c)
OBJECTS = $(patsubst %.c,%.o,$(SOURCES))

# 默认目标
all: $(TARGET)

# 链接目标
$(TARGET): $(OBJECTS)
    $(CC) -o $@ $^ $(LDFLAGS)

# 编译规则
%.o: %.c
    $(CC) -c $< -o $@ $(CFLAGS)

# 清理
clean:
    rm -f $(OBJECTS) $(TARGET)

# 安装
install: $(TARGET)
    cp $(TARGET) /usr/local/bin/

.PHONY: all clean install
```