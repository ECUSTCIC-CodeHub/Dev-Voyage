---
title: '第 6 章：脚本入门'
createTime: 2025/12/20 10:00:00
permalink: /essential/command-line/scripts/
---

# 第 6 章：脚本入门

::: tip 本章目标
学会编写简单的 Shell 脚本，把重复的命令自动化。让电脑帮你打工！
:::

## 一、 🤖 为什么需要脚本？

想象这个场景：你每天都要执行这些命令：

```bash
cd ~/projects/myapp
git pull
npm install
npm run build
npm run deploy
```

每天都要敲这么多命令，是不是很烦？

**脚本** 就是把这些命令保存到一个文件里，然后一次性执行。写一次，用无数次！

## 二、 📝 你的第一个 Bash 脚本

### 2.1. 创建脚本文件

在 Linux/Mac 上，创建一个文件叫 `hello.sh`：

```bash
#!/bin/bash
# 这是我的第一个脚本

echo "Hello, World!"
echo "当前时间是：$(date)"
echo "你在：$(pwd)"
```

### 2.2. 脚本结构解析

```bash
#!/bin/bash              # Shebang：告诉系统用什么解释器运行
# 这是注释              # 井号开头的是注释（除了第一行的 shebang）

echo "Hello, World!"    # 实际的命令
```

::: note 什么是 Shebang？
`#!` 叫做 **Shebang**（也叫 hashbang），后面跟的是解释器的路径。

常见的 Shebang：
- `#!/bin/bash` —— 使用 Bash
- `#!/bin/sh` —— 使用系统默认 Shell
- `#!/usr/bin/env python3` —— 使用 Python 3
- `#!/usr/bin/env node` —— 使用 Node.js

`/usr/bin/env` 是一个更灵活的写法，它会在 PATH 中查找解释器。
:::

### 2.3. 运行脚本

**方法一：直接指定解释器**
```bash
bash hello.sh
```

**方法二：给脚本添加执行权限**
```bash
chmod +x hello.sh    # 添加执行权限
./hello.sh           # 运行脚本
```

::: warning 为什么要 ./？
直接输入 `hello.sh` 不行，因为当前目录不在 PATH 里。`./` 明确指定「当前目录下的 hello.sh」。
:::

## 三、 🪟 Windows 批处理脚本

Windows CMD 使用 `.bat` 文件（批处理文件）。

### 3.1. 创建批处理文件

创建 `hello.bat`：

```batch
@echo off
REM 这是注释

echo Hello, World!
echo 当前时间是：%date% %time%
echo 你在：%cd%

pause
```

### 3.2. 批处理语法解析

| 语法 | 含义 |
|------|------|
| `@echo off` | 不显示命令本身，只显示输出 |
| `REM` | 注释 |
| `%变量名%` | 引用变量 |
| `%date%` `%time%` | 系统日期和时间 |
| `%cd%` | 当前目录 |
| `pause` | 暂停，按任意键继续 |

### 3.3. 运行批处理

双击 `.bat` 文件，或在 CMD 中输入：
```cmd
hello.bat
```

## 四、 💎 PowerShell 脚本

PowerShell 使用 `.ps1` 文件。

### 4.1. 创建 PowerShell 脚本

创建 `hello.ps1`：

```powershell
# 这是注释

Write-Host "Hello, World!"
Write-Host "当前时间是：$(Get-Date)"
Write-Host "你在：$(Get-Location)"
```

### 4.2. 运行 PowerShell 脚本

```powershell
.\hello.ps1
```

::: warning 执行策略
默认情况下，Windows 可能不允许运行 PowerShell 脚本。需要先修改执行策略：

```powershell
# 以管理员身份运行
Set-ExecutionPolicy RemoteSigned
```

`RemoteSigned` 允许运行本地脚本，但要求从网上下载的脚本必须有签名。
:::

## 五、 🔢 脚本中的变量

### 5.1. Bash 变量

```bash
#!/bin/bash

# 定义变量（等号两边不能有空格！）
name="张三"
age=20

# 使用变量
echo "姓名：$name"
echo "年龄：$age"

# 命令输出赋值给变量
current_dir=$(pwd)
file_count=$(ls | wc -l)

echo "当前目录：$current_dir"
echo "文件数量：$file_count"
```

::: caution Bash 变量的坑
```bash
# 错误！等号两边不能有空格
name = "张三"

# 正确
name="张三"
```
这是很多新手踩的坑。记住：**等号两边不能有空格**！
:::

### 5.2. Windows 批处理变量

```batch
@echo off

REM 定义变量
set name=张三
set age=20

REM 使用变量
echo 姓名：%name%
echo 年龄：%age%

REM 获取用户输入
set /p username=请输入你的名字：
echo 你好，%username%！
```

### 5.3. PowerShell 变量

```powershell
# 定义变量（$ 开头）
$name = "张三"
$age = 20

# 使用变量
Write-Host "姓名：$name"
Write-Host "年龄：$age"

# 命令输出赋值给变量
$currentDir = Get-Location
$fileCount = (Get-ChildItem).Count

Write-Host "当前目录：$currentDir"
Write-Host "文件数量：$fileCount"
```

## 六、 🔀 条件判断

### 6.1. Bash if 语句

```bash
#!/bin/bash

age=18

if [ $age -ge 18 ]; then
    echo "你是成年人"
else
    echo "你是未成年人"
fi

# 判断文件是否存在
if [ -f "myfile.txt" ]; then
    echo "文件存在"
else
    echo "文件不存在"
fi

# 判断目录是否存在
if [ -d "mydir" ]; then
    echo "目录存在"
fi
```

Bash 条件表达式：

| 表达式 | 含义 |
|--------|------|
| `-eq` | 等于 |
| `-ne` | 不等于 |
| `-gt` | 大于 |
| `-ge` | 大于等于 |
| `-lt` | 小于 |
| `-le` | 小于等于 |
| `-f file` | 文件存在 |
| `-d dir` | 目录存在 |
| `-z str` | 字符串为空 |
| `-n str` | 字符串非空 |

### 6.2. Windows 批处理 if 语句

```batch
@echo off

set age=18

if %age% GEQ 18 (
    echo 你是成年人
) else (
    echo 你是未成年人
)

REM 判断文件是否存在
if exist "myfile.txt" (
    echo 文件存在
) else (
    echo 文件不存在
)
```

### 6.3. PowerShell if 语句

```powershell
$age = 18

if ($age -ge 18) {
    Write-Host "你是成年人"
} else {
    Write-Host "你是未成年人"
}

# 判断文件是否存在
if (Test-Path "myfile.txt") {
    Write-Host "文件存在"
} else {
    Write-Host "文件不存在"
}
```

## 七、 🔄 循环

### 7.1. Bash 循环

```bash
#!/bin/bash

# for 循环
for i in 1 2 3 4 5; do
    echo "数字：$i"
done

# 遍历文件
for file in *.txt; do
    echo "处理文件：$file"
done

# while 循环
count=1
while [ $count -le 5 ]; do
    echo "计数：$count"
    count=$((count + 1))
done
```

### 7.2. Windows 批处理循环

```batch
@echo off

REM for 循环
for %%i in (1 2 3 4 5) do (
    echo 数字：%%i
)

REM 遍历文件
for %%f in (*.txt) do (
    echo 处理文件：%%f
)
```

::: note 批处理循环的 %%
在批处理文件中，循环变量用 `%%`（两个百分号）。
在命令行直接输入时，用 `%`（一个百分号）。

这是历史遗留问题，因为 `%` 在批处理里也用来引用变量。
:::

### 7.3. PowerShell 循环

```powershell
# for 循环
for ($i = 1; $i -le 5; $i++) {
    Write-Host "数字：$i"
}

# foreach 循环
foreach ($file in Get-ChildItem *.txt) {
    Write-Host "处理文件：$($file.Name)"
}

# while 循环
$count = 1
while ($count -le 5) {
    Write-Host "计数：$count"
    $count++
}
```

## 八、 📥 脚本参数

脚本可以接收命令行参数，让它更加灵活。

### 8.1. Bash 参数

```bash
#!/bin/bash

# $0 是脚本名称
# $1, $2, $3... 是参数
# $# 是参数个数
# $@ 是所有参数

echo "脚本名称：$0"
echo "第一个参数：$1"
echo "第二个参数：$2"
echo "参数个数：$#"
echo "所有参数：$@"
```

运行：
```bash
./myscript.sh hello world
# 输出：
# 脚本名称：./myscript.sh
# 第一个参数：hello
# 第二个参数：world
# 参数个数：2
# 所有参数：hello world
```

### 8.2. Windows 批处理参数

```batch
@echo off

echo 脚本名称：%0
echo 第一个参数：%1
echo 第二个参数：%2
echo 所有参数：%*
```

### 8.3. PowerShell 参数

```powershell
# 方式一：使用 $args
Write-Host "第一个参数：$($args[0])"
Write-Host "所有参数：$args"

# 方式二：定义参数（推荐）
param(
    [string]$Name,
    [int]$Age = 18  # 默认值
)

Write-Host "姓名：$Name"
Write-Host "年龄：$Age"
```

## 九、 🛠️ 实用脚本示例

### 9.1. 示例 1：项目初始化脚本（Bash）

```bash
#!/bin/bash
# setup.sh - 项目初始化脚本

PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]; then
    echo "用法：./setup.sh <项目名>"
    exit 1
fi

echo "创建项目：$PROJECT_NAME"

mkdir -p "$PROJECT_NAME"/{src,docs,tests}
touch "$PROJECT_NAME/README.md"
touch "$PROJECT_NAME/src/main.py"

cd "$PROJECT_NAME"
git init

echo "# $PROJECT_NAME" > README.md
echo "项目创建完成！"
```

### 9.2. 示例 2：备份脚本（Bash）

```bash
#!/bin/bash
# backup.sh - 简单备份脚本

SOURCE="$HOME/Documents"
BACKUP_DIR="$HOME/Backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_$DATE.tar.gz"

echo "开始备份 $SOURCE ..."
mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/$BACKUP_FILE" "$SOURCE"

echo "备份完成：$BACKUP_DIR/$BACKUP_FILE"
echo "文件大小：$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)"
```

### 9.3. 示例 3：批量重命名（PowerShell）

```powershell
# rename-photos.ps1 - 批量重命名照片

$folder = "C:\Users\YourName\Pictures"
$counter = 1

Get-ChildItem -Path $folder -Filter "*.jpg" | ForEach-Object {
    $newName = "photo_{0:D3}.jpg" -f $counter
    Rename-Item $_.FullName -NewName $newName
    Write-Host "重命名：$($_.Name) -> $newName"
    $counter++
}

Write-Host "完成！共重命名 $($counter - 1) 个文件"
```

### 9.4. 示例 4：开发环境启动脚本（批处理）

```batch
@echo off
REM dev-start.bat - 启动开发环境

echo 启动开发环境...

REM 启动后端
start cmd /k "cd backend && npm run dev"

REM 启动前端
start cmd /k "cd frontend && npm run dev"

REM 打开 VS Code
code .

echo 开发环境已启动！
```

## 十、 🎯 脚本最佳实践

### 10.1. 添加帮助信息

```bash
#!/bin/bash

show_help() {
    echo "用法：$0 [选项] <参数>"
    echo ""
    echo "选项："
    echo "  -h, --help     显示帮助信息"
    echo "  -v, --verbose  详细输出"
    echo ""
    echo "示例："
    echo "  $0 -v myfile.txt"
}

if [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
    show_help
    exit 0
fi
```

### 10.2. 错误处理

```bash
#!/bin/bash

# 遇到错误立即退出
set -e

# 使用未定义变量时报错
set -u

# 管道中任一命令失败则整体失败
set -o pipefail

# 检查必要的命令
command -v git >/dev/null 2>&1 || { echo "需要安装 git"; exit 1; }
```

### 10.3. 使用函数

```bash
#!/bin/bash

# 定义函数
log_info() {
    echo "[INFO] $1"
}

log_error() {
    echo "[ERROR] $1" >&2
}

# 使用函数
log_info "开始执行..."
log_error "出错了！"
```

## 十一、 📜 脚本的历史趣事

::: note 批处理的「古董」语法
Windows 批处理的语法来自 1980 年代的 DOS。那时候计算机内存以 KB 计算，所以语法设计得非常「节省」。

比如 `for %%i in (...)` 中的 `%%`，是为了和 `%变量%` 区分开来。这种设计在今天看来很奇怪，但在当时是有道理的。
:::

::: note Bash 的「陷阱」
Bash 脚本中等号两边不能有空格，这让很多从其他语言转来的程序员困惑不已。

原因是 Bash 把空格作为命令和参数的分隔符。`name = "张三"` 会被解析为执行 `name` 命令，参数是 `=` 和 `"张三"`。

这种设计可以追溯到 Unix 的极简主义哲学，但确实给新手挖了不少坑。
:::

## 十二、 📝 本章小结

| 类型 | 扩展名 | 运行方式 | 特点 |
|------|--------|----------|------|
| Bash 脚本 | `.sh` | `bash script.sh` 或 `./script.sh` | Linux/Mac 默认，功能强大 |
| 批处理 | `.bat` | 双击或 `script.bat` | Windows 老式，兼容性好 |
| PowerShell | `.ps1` | `.\script.ps1` | Windows 现代，功能强大 |

::: important 动手任务
1. **创建一个简单的问候脚本**
   - 接收用户名作为参数
   - 输出问候语和当前时间

2. **创建一个文件整理脚本**
   - 在当前目录创建 `images`、`documents`、`others` 文件夹
   - 把 `.jpg`、`.png` 移到 `images`
   - 把 `.pdf`、`.doc` 移到 `documents`
   - 其他文件移到 `others`

3. **创建一个项目模板脚本**
   - 接收项目名作为参数
   - 创建项目目录结构
   - 初始化 git 仓库
   - 创建基础文件（README.md 等）
:::

---

**下一章：[AI 辅助与自主探索](./7-exploration.md)** →

在最后一章，我们将学习如何借助 AI 工具和官方文档，成为一个能够自主探索、不断进步的命令行老手！
