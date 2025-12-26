---
title: "MySQL基础操作"
description: "MySQL数据库基础命令和操作指南"
date: "2024-01-18"
category: "数据库"
tags: ["mysql", "database", "sql"]
---

# MySQL基础操作

## 基本连接

```bash
# 连接MySQL
mysql -u root -p

# 退出MySQL
exit;
# 或者
quit;
```

## 数据库操作

### 查看数据库

```sql
SHOW DATABASES;
```

### 创建数据库

```sql
CREATE DATABASE database_name;
```

### 选择数据库

```sql
USE database_name;
```

### 删除数据库

```sql
DROP DATABASE database_name;
```

## 表操作

### 查看表

```sql
SHOW TABLES;
```

### 查看表结构

```sql
DESCRIBE table_name;
# 或者
SHOW COLUMNS FROM table_name;
```

### 创建表

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 删除表

```sql
DROP TABLE table_name;
```