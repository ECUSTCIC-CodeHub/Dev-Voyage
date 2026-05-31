---
title: '第 8 章：脚本入门'
createTime: 2025/12/20 10:00:00
permalink: /essential/command-line/scripts/
---

# 第 8 章：脚本入门

::: tip 本章目标
学会编写简单的 Shell 脚本，将重复的命令自动化。这是命令行学习路径的最后一站——从逐条手动输入命令，到让机器按照你编写的逻辑自动运行。
:::

## 一、为什么需要脚本？

前七章我们一直在命令行中逐条输入命令：`cd`、`ls`、`grep`、`git commit`。每一条命令都是你手动敲进去的——你在指挥，电脑在执行，一条一条来。

这种交互模式适合探索性工作——你边看输出边决定下一步。但当你需要重复执行一组固定的操作时，手动逐条输入就变成了纯粹的体力劳动。

想象这个场景：你每天都要执行这些命令来部署项目：

```bash
cd ~/projects/myapp
git pull
npm install
npm run build
npm run deploy
```

5 条命令，每天一次。一个月就是 150 次重复输入。半年呢？一年呢？

**脚本（Script）** 就是把这些命令保存到一个文件里，然后一次性执行。你写一次逻辑，机器执行无数次。这是从"手动操作计算机"到"编程控制计算机"的转折点——也是命令行的终极生产力形态。

本质上，脚本是你和计算机之间的一次分工升级：你把"做什么"的决策权保留在自己手中，把"怎么做"的执行过程委托给机器。一个好的脚本就像一个好的员工——你交代一次，它反复执行，不抱怨，不出错（除非你写错了）。

## 二、你的第一个 Bash 脚本

### 2.1 创建脚本文件

在 Linux/Mac 上，创建一个文件叫 `hello.sh`：

```bash
#!/bin/bash
# 这是我的第一个脚本

echo "Hello, World!"
echo "当前时间是：$(date)"
echo "你在：$(pwd)"
```

### 2.2 脚本结构解析

```bash
#!/bin/bash              # Shebang：告诉系统用什么解释器运行
# 这是注释              # 井号开头的是注释（除了第一行的 shebang）

echo "Hello, World!"    # 实际的命令
```

::: note 什么是 Shebang？
`#!` 叫做 **Shebang**（也叫 hashbang），后面跟的是解释器的路径。当你在终端中执行一个脚本文件时，操作系统读取文件的第一行——如果前两个字节是 `#!`，就把后面的路径作为解释器程序，把脚本文件作为参数传给解释器。

常见的 Shebang：
- `#!/bin/bash` —— 使用 Bash
- `#!/bin/sh` —— 使用系统默认 Shell
- `#!/usr/bin/env python3` —— 使用 Python 3
- `#!/usr/bin/env node` —— 使用 Node.js

`/usr/bin/env` 是一个更灵活的写法：它不硬编码解释器路径，而是在 PATH 环境变量中查找。这在不同的系统上都能正常工作——你的 Python 可能装在 `/usr/bin/python3`，别人的可能装在 `/usr/local/bin/python3`。`/usr/bin/env python3` 两种情况下都能找到。

Shebang 的设计可以追溯到 1980 年 Unix 第 8 版，由 Dennis Ritchie 引入。这一行看似简单的注释语法（`#` 开头的行在脚本语言中通常是注释），被操作系统内核赋予了特殊含义——用注释语法承载系统级指令，是 Unix 实用主义设计哲学的经典体现。
:::

### 2.3 运行脚本

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
直接输入 `hello.sh` 不行，因为当前目录（通常是 `.`）默认不在 PATH 环境变量中。这是一个安全设计：如果当前目录自动在 PATH 里，攻击者只需要在你的家目录放一个名为 `ls` 的恶意脚本，你每次输入 `ls` 就会执行它。

`./` 明确指定「当前目录下的 hello.sh」，绕过了 PATH 查找机制。
:::

## 三、Windows 批处理脚本

Windows CMD 使用 `.bat` 文件（批处理文件）。批处理的历史可以追溯到 1981 年的 MS-DOS 1.0——它是 Windows 命令行生态中最古老的部分。

### 3.1 创建批处理文件

创建 `hello.bat`：

```batch
@echo off
REM 这是注释

echo Hello, World!
echo 当前时间是：%date% %time%
echo 你在：%cd%

pause
```

### 3.2 批处理语法解析

| 语法 | 含义 |
|------|------|
| `@echo off` | 不显示命令本身，只显示输出 |
| `REM` | 注释 |
| `%变量名%` | 引用变量 |
| `%date%` `%time%` | 系统日期和时间 |
| `%cd%` | 当前目录 |
| `pause` | 暂停，按任意键继续 |

`@echo off` 中的 `@` 符号用来抑制单条命令的回显，而 `echo off` 抑制之后所有命令的回显。为什么需要两者同时出现？因为如果不加 `@`，`echo off` 这行命令本身也会被显示出来。这个微妙的细节体现了批处理语法设计中"功能是一层层打补丁加上去的"这一历史特征。

### 3.3 运行批处理

双击 `.bat` 文件，或在 CMD 中输入：

```cmd
hello.bat
```

## 四、PowerShell 脚本

PowerShell 是微软在 2006 年推出的新一代 Shell，使用 `.ps1` 文件。它吸收了 Unix Shell 和 .NET 框架各自的优点，是 Windows 平台上功能最强大的脚本环境。

### 4.1 创建 PowerShell 脚本

创建 `hello.ps1`：

```powershell
# 这是注释

Write-Host "Hello, World!"
Write-Host "当前时间是：$(Get-Date)"
Write-Host "你在：$(Get-Location)"
```

### 4.2 运行 PowerShell 脚本

```powershell
.\hello.ps1
```

::: warning 执行策略
默认情况下，Windows 可能不允许运行 PowerShell 脚本。需要先修改执行策略：

```powershell
# 以管理员身份运行
Set-ExecutionPolicy RemoteSigned
```

`RemoteSigned` 允许运行本地创建的脚本，但要求从互联网下载的脚本必须有数字签名。这是一个安全机制——PowerShell 的脚本能力极为强大（可以调用 Windows API、操作注册表、管理系统服务），不加限制的运行权限会带来严重的安全风险。
:::

## 五、脚本中的变量

变量是脚本从"固定流程"走向"灵活逻辑"的第一步。有了变量，脚本就可以根据不同的输入产生不同的输出。

### 5.1 Bash 变量

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

::: caution Bash 等号陷阱
```bash
# 错误！等号两边不能有空格
name = "Zhang"
# Bash 会将这行解析为：执行 name 命令，参数是 = 和 "Zhang"

# 正确
name="Zhang"
```

这是 Bash 新手的第一大坑——从任何其他编程语言（C、Java、Python、JavaScript）转过来的程序员都会在这里踩坑。在那些语言中，等号周围的空格是代码风格甚至语言规范的一部分。但在 Bash 中，空格的含义完全不同：**空格是命令和参数的分隔符**。

`name = "Zhang"` 在 Bash 眼中不是一个赋值语句。Bash 的解析器从左到右扫描这行文本：遇到 `name`，判断这是一个命令名；遇到空格，开始解析下一个参数；遇到 `=`，这是一个参数；再空格，再参数 `"Zhang"`。所以整行的语义是"以 `=` 和 `"Zhang"` 为参数运行 `name` 命令"——这显然不是你的意图。

这个设计的根源是 Unix 的极简主义哲学。Bash 的语法解析器不做复杂的上下文分析——它用一套统一的规则（空格分隔、首词为命令）处理所有输入，无论你是在赋值还是在启动一个进程。这种一致性让解析器的实现极为简洁，代价是赋值的语法与其他语言完全不同。Ken Thompson 和 Stephen Bourne 在设计 Unix Shell 时选择了实现简洁性而非用户直觉——在 1970 年代，以 KB 为单位计算内存的时代，这是一个完全合理的取舍。
:::

### 5.2 Windows 批处理变量

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

批处理的变量引用使用 `%` 包裹——如 `%name%`。这个语法来自 DOS 时代的设计：`%` 符号在键盘上容易输入（Shift+5），而且在日常文本中出现频率低，减少了误匹配的可能。

### 5.3 PowerShell 变量

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

PowerShell 的变量以 `$` 开头——这个设计来自 Perl 语言，微软在设计 PowerShell 时有意识地借鉴了 Unix 脚本语言中经过验证的设计模式。

## 六、条件判断

条件判断让脚本可以做出选择——根据不同的情况执行不同的逻辑。

### 6.1 Bash if 语句

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

::: note `[` 是一个命令
你可能会好奇为什么 `[ $age -ge 18 ]` 中 `[` 两边必须有空格。原因出人意料：`[` 在 Bash 中不是一个语法符号——**它是一个命令**。

在 Unix 系统上，`/usr/bin/[` 是一个真实存在的可执行文件。当你写 `[ $age -ge 18 ]` 时，Bash 执行的是 `[` 命令，把 `$age`、`-ge`、`18`、`]` 作为参数传给这个命令。`]` 是语法要求（`[` 命令的最后一个参数必须是 `]`），但它实际上被 `[` 命令忽略。这个设计让条件判断完全融入 Unix 的"一切皆命令"哲学——不需要语法糖，不需要关键字，一个普通的命令就完成了所有工作。
:::

### 6.2 Windows 批处理 if 语句

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

### 6.3 PowerShell if 语句

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

## 七、循环

循环让脚本能够对一组数据重复执行相同的操作——这是计算机最擅长的能力。

### 7.1 Bash 循环

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

### 7.2 Windows 批处理循环

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

::: note 批处理循环的 %%：一个 1980 年代的 DOS 遗产
在批处理文件中，循环变量使用 `%%i`（两个百分号）。在命令行直接输入时，使用 `%i`（一个百分号）。

为什么需要这个重复？因为 `%` 在 DOS 批处理中已经被用于变量引用——`%PATH%`、`%USERNAME%`。当 MS-DOS 的设计者在 1980 年代为批处理添加 `FOR` 循环时，他们需要一个方式来区分"循环变量 `i`"和"名为 `i` 的普通变量 `%i%`"。

解决方案是用 `%%` 标记循环变量：`%%i` 明确告诉解析器"这是一个循环变量，不要和普通变量混淆"。但在命令行交互模式下，循环通常只有一行，解析器的上下文足够区分两者，所以只需一个 `%`。

这是一个典型的向后兼容性设计：在既有语法上增加新功能时，选择一种不破坏现有脚本的区分方式，即使这种区分让语法看起来不一致。三十多年后，所有写批处理脚本的 Windows 开发者仍然在承受这个 1980 年代设计决策的成本——也是计算机历史中"向前兼容"代价的一个生动例证。
:::

### 7.3 PowerShell 循环

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

## 八、脚本参数

脚本可以接收命令行参数，让同一份脚本在不同输入下完成不同的工作。命令行参数是你和脚本之间最直接的通信通道。

### 8.1 Bash 参数

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

### 8.2 Windows 批处理参数

```batch
@echo off

echo 脚本名称：%0
echo 第一个参数：%1
echo 第二个参数：%2
echo 所有参数：%*
```

### 8.3 PowerShell 参数

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

## 九、实用脚本示例

以下四个示例涵盖了日常开发中最常见的脚本使用场景。它们不是玩具示例——去掉注释和错误提示，每一个都可以直接在真实项目中投入使用。

### 9.1 示例 1：项目初始化脚本（Bash）

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

### 9.2 示例 2：备份脚本（Bash）

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

### 9.3 示例 3：批量重命名（PowerShell）

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

### 9.4 示例 4：开发环境启动脚本（批处理）

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

## 十、脚本最佳实践

写好一个能跑的脚本不难。写好一个出了问题不会造成灾难、别人能看懂、三个月后你自己也还能看懂的脚本——需要一些纪律。

### 10.1 添加帮助信息

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

### 10.2 安全配置

```bash
#!/bin/bash

# 遇到错误立即退出
set -e

# 使用未定义变量时报错
set -u

# 管道中任一命令失败则整体失败
set -o pipefail
```

::: important Shell 安全三重设置
对于任何非平凡的脚本，建议在文件开头（shebang 之后、实际逻辑之前）加上这三行：

```bash
set -euo pipefail
```

这是三个独立选项的合并写法。它们各自解决一类常见的安全隐患：

**`set -e`（exit on error）**：任何一条命令返回非零退出码时，脚本立即终止。Bash 的默认行为是继续执行下一条命令——这在你手动交互时很合理（一条命令失败了你还可以重试），但在脚本中可能导致灾难性后果。想象一个备份脚本：`cd /backup/dir` 失败了（目录不存在），但脚本继续执行 `rm -rf *`——清空的可能是当前目录而非备份目录。`set -e` 阻止了这种链式崩溃。

**`set -u`（undefined variable is an error）**：引用未定义的变量时立即报错并退出。默认行为是静默地将未定义变量展开为空字符串。一个拼写错误——`echo "删除目录：$IMPORTANT_DIR"` 写成了 `$IMPORTANT_DIRR`——脚本会静默地操作一个空字符串路径，后果不可预测。

**`set -o pipefail`**：管道中任何一个命令失败，整个管道被视为失败。默认情况下，管道的退出码是最后一个命令的退出码。这意味着 `failing_command | tee output.log` 会报告成功——因为 `tee` 成功了。在生产环境的日志收集脚本中，这种静默失败可能让你完全不知道数据已经丢失。

这三行代码是脚本安全的最低底线。它们不能阻止所有错误，但可以阻止最常见的几类——且成本为零。
:::

### 10.3 错误处理

```bash
#!/bin/bash

set -euo pipefail

# 检查必要的命令
command -v git >/dev/null 2>&1 || { echo "需要安装 git"; exit 1; }
```

### 10.4 使用函数

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

函数让你的脚本拥有和程序一样的分层结构——底层函数处理具体细节，高层函数编排整体流程。当脚本超过 50 行时，不用函数会让逻辑变得难以追踪。

### 10.5 AI 辅助脚本编写

::: tip 用 AI 加速，而非绕过理解
AI 工具（ChatGPT、Claude、Copilot）在生成脚本骨架方面表现优异——样板代码、循环结构、错误处理模板。你描述需求，AI 给出一个大致可用的脚本框架。

但在运行 AI 生成的脚本之前，请遵守三条规则：

1. **逐行阅读每一条命令。** 理解脚本在做什么，而不仅仅是"看起来应该能跑"。
2. **特别关注涉及以下命令的行：** `rm`（删除文件）、`sudo`（提权操作）、`chmod`（修改权限）、`curl | bash`（从网络下载并执行）、任何包含 IP 地址或网络请求的命令。
3. **AI 脚本可能包含在视觉上看起来正确但逻辑上有微妙错误的代码。** 例如，路径拼接缺少引号、循环边界差一位、exit 条件写反。这些错误在快速扫读时非常容易被忽略。

AI 在脚本编写领域的角色和其他领域一样：它是一个加速器。如果你已经理解脚本的工作原理，AI 能帮你更快地写出代码。如果你还不理解，AI 会让你更快地写出有问题的代码，同时给你一种"应该没问题"的错觉。
:::

## 十一、延伸思考：脚本世界的两条边界

在结束这一章之前，有两个故事值得了解。它们分别代表了脚本生态中的一条边界——一条在"重写"这条路上，一条在"自动化"这条路上。

### 11.1 curl 与 Rust 重写之争

::: important curl：当 Rust 重写遭遇阻力
2020 年，Rust 社区的一些开发者提出将 curl 用 Rust 重写。论点很有力：curl 是一个用 C 语言编写的网络库，C 的内存安全问题在过去二十多年中导致了无数漏洞。Rust 的内存安全保证可以系统性地消除这类问题——这正是我们在第三章和第四章中看到的 Rust 成功故事。

但 curl 的作者兼唯一维护者 Daniel Stenberg 拒绝了。他在一篇博客文章中给出了自己的理由：

curl 已经经历了超过 22 年的使用、测试和审计。每一天，全球数十亿台设备在用它传输数据。这个过程中，安全研究人员已经对它进行了成千上万次渗透测试和代码审查。每一个被发现和修复的漏洞都是一次"实战打磨"——修复的不仅是那个具体的 bug，还包括同类问题不会再次出现的预防措施。curl 代码库中的每一行代码都经过了这种级别的实战检验。

Stenberg 的原话是：**"Nobody will pay for this work."** 将 curl 完整重写为 Rust 意味着丢弃 22 年积累的所有边缘情况处理、所有平台兼容性补丁、所有特殊协议适配——然后从头开始。谁来做这件事？谁为这个过程中引入的新 bug 负责？谁保证和所有现有系统的兼容性？

Rust 社区在这件事上产生了分裂。一部分人认为 Stenberg 在抗拒进步，另一部分人承认他的论证有道理。curl 至今仍然主要用 C 编写，同时在一些新功能中谨慎引入 Rust 组件。

这个故事提供了一个重要的平衡视角：重写为更安全的语言确实有真实价值，但"原始代码中积累的实战经验"也是一种不可忽视的资产。在编程世界里，"just rewrite it" 从来不是一个普适的答案。
:::

### 11.2 自动化的边界

脚本的本质是自动化。但自动化本身也有一条边界值得认识：**不是所有事情都应该自动化。**

判断标准很简单：如果一项任务你只做一次，手动执行就够了，写脚本的时间可能比手动操作还长。如果一项任务你做 3 次以上，并且每次的步骤完全一样，写一个脚本就是合理的投资。如果你每周都要做，脚本的价值就远远超过了编写成本。

更微妙的边界在于：自动化减少了重复劳动，但也减少了你对操作过程本身的感知。一个每天都手动部署项目的开发者，对部署流程中的每一个细节都了如指掌——哪个步骤慢、哪个容易出错、出错时的状态是什么。一旦完全自动化，这些感知会逐渐消失。当脚本在某一天突然失败时，排查问题的难度可能远高于当初手动操作时。

这不是反对自动化——自动化带来的效率和一致性优势是碾压级别的。而是在自动化之后，你仍然需要花时间理解脚本内部在发生什么。脚本是你的代理人，你也仍需知道代理人每天在做什么。

## 十二、本章小结

| 类型 | 扩展名 | 运行方式 | 特点 |
|------|--------|----------|------|
| Bash 脚本 | `.sh` | `bash script.sh` 或 `./script.sh` | Linux/Mac 默认，功能强大 |
| 批处理 | `.bat` | 双击或 `script.bat` | Windows 老式，兼容性好 |
| PowerShell | `.ps1` | `.\script.ps1` | Windows 现代，功能强大 |

回顾这八章的旅程：你从最基本的 `ls` 和 `cd` 出发，学会了浏览文件系统、使用管道组合命令、理解不同 Shell 的特性、配置环境变量、通过 SSH 操控远程机器——而脚本，是这一切能力的整合。它可以把你学到的每一条命令、每一个技巧，编排成一个自动化的流程。

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

命令行系列到此结束。你手里现在有一套可以应对日常开发中绝大多数命令行场景的技能组合——剩下的不是"学更多的命令"，而是在实际使用中让这些知识变成肌肉记忆。打开终端，开始写你的第一个脚本。
