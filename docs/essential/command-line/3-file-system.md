---
title: '第 3 章：文件系统探索'
createTime: 2025/12/20 10:00:00
permalink: /essential/command-line/file-system/
---

# 第 3 章：文件系统探索

::: tip 本章目标
学会用命令行在文件系统中浏览目录、创建文件和文件夹、复制、移动、删除，以及查看文件内容。掌握这些，你就能用命令行完成大部分日常文件操作。
:::

## 一、理解文件系统的结构

在开始操作之前，先理解文件系统是如何组织的。

### 1.1 树形结构

文件系统是一棵倒过来的树：

```
/（根目录）
├── home/
│   └── username/
│       ├── Documents/
│       ├── Downloads/
│       └── Pictures/
├── etc/
├── var/
└── usr/
```

- **根目录（Root）** 是树的起点。在 Linux 和 macOS 上统一用 `/` 表示，在 Windows 上用盘符如 `C:\` 表示。所有文件路径都在根目录之下。
- **目录（文件夹）** 是树的枝干，可以包含文件和其他目录。目录嵌套没有硬性上限，但过深的层级会让你迷失方向。
- **文件** 是树的叶子，实际存储数据的地方。

::: info Unix "一切皆文件" 哲学
在 Unix 的设计中，文件的概念远不止硬盘上的 .txt 和 .jpg。键盘是一个可读的文件，屏幕是一个可写的文件，网络连接是文件，硬盘分区是文件，进程信息也是文件。所有资源统一用"打开、读取、写入、关闭"这套接口操作。

这套设计的实用价值在后续章节会逐渐显现：当你学会用管道（`|`）和重定向（`>`）把命令串联起来时，你操作的对象可能根本不是传统意义上的文件。管道左侧可以是程序的输出，右侧可以是另一个程序的输入，中间没有硬盘读写。但对你来说，操作方式和读写一个文本文件完全一样。

这种一致性是命令行高效的核心原因之一——你只需要学会一套操作范式，就能操作系统中的一切资源。
:::

### 1.2 路径：文件系统的地址

路径描述了文件在文件系统中的位置。类比现实中的地址：

> 中国 > 上海市 > 某某区 > 某某路 > 某某号

映射到文件系统：

> `/home/username/Documents/report.txt`

路径分隔符在不同系统上有差异。Linux 和 macOS 使用正斜杠 `/`，Windows 使用反斜杠 `\`。这个差异源于历史原因：MS-DOS（Windows 的前身）在 1981 年选择 `\` 作为路径分隔符，因为 `/` 已经被用作命令行选项的前缀（如 `dir /?`）。Unix 则从第一版起就使用 `/` 作为路径分隔符。

大小写敏感性是另一个关键差异：在 Linux 和 macOS 上，`Documents` 和 `documents` 是两个不同的目录——可以同时存在于同一个父目录下。在 Windows 上，它们是同一个目录。从 Windows 迁移到 macOS 或 Linux 时，大小写差异是新手最容易踩的坑之一。

在 PowerShell 和现代 Windows 终端中，正斜杠 `/` 通常也能被识别，这给跨平台操作提供了便利。

### 1.3 绝对路径 vs 相对路径

**绝对路径**：从根目录开始的完整路径，无论当前在哪个目录，指向的都是同一个位置。

```bash
/home/username/Documents/report.txt     # Linux/Mac
C:\Users\username\Documents\report.txt   # Windows
```

**相对路径**：从当前工作目录开始的路径，指向的位置取决于你站在哪里。

```bash
Documents/report.txt        # 假设当前在 /home/username
../Downloads/file.zip       # 上一级目录下的 Downloads 文件夹
```

::: tip 两个关键符号
- `.`（一个点）：当前目录。为什么需要它？Shell 出于安全考虑不会自动在当前目录查找可执行文件。执行当前目录下的脚本时需要写成 `./script.sh`，明确告诉 Shell"在当前目录下查找"。
- `..`（两个点）：上一级目录。`cd ../..` 向上走两级，`cd ../../sibling` 走到当前目录的兄弟目录。

这两个符号在所有路径语境中通用，理解它们意味着你在任何目录中都能精确导航。
:::

## 二、在目录间移动

### 2.1 cd 命令：切换目录

`cd` 是 Change Directory 的缩写，改变当前工作目录。在图形界面里，这等同于双击进入一个文件夹。

```bash
# 进入当前目录下的 Documents
cd Documents

# 使用绝对路径进入
cd /home/username/Documents        # Linux/Mac
cd C:\Users\username\Documents     # Windows CMD

# 返回上一级
cd ..

# 返回上两级
cd ../..

# 回到用户主目录
cd ~                               # Linux/Mac/PowerShell
cd %USERPROFILE%                   # Windows CMD
```

::: warning 路径中有空格怎么办？
如果目录名包含空格，需要用引号将整个路径包裹：

```bash
cd "My Documents"
```

在 Linux/Mac 上也可以用反斜杠转义空格：

```bash
cd My\ Documents
```

养成避免在文件名和目录名中使用空格的习惯——用下划线 `_` 或连字符 `-` 代替——可以省去大量这类麻烦。这不仅对命令行友好，对编程和跨平台协作都有好处。
:::

### 2.2 pwd：你在哪里

`pwd` 是 Print Working Directory 的缩写——打印当前工作目录。当你在多层目录间穿梭后忘记位置，或在多个终端窗口之间切换时，这是最快的定位方式。

```bash
pwd
# 输出：/home/username/Documents
```

Windows CMD 中没有 `pwd`。输入 `cd`（不带任何参数）同样显示当前目录。PowerShell 支持 `pwd`。

## 三、查看目录内容

### 3.1 ls 命令

`ls` 是 list 的缩写——列出目录内容。等同于在文件管理器中打开一个文件夹看到的文件列表，但以纯文本呈现。

```bash
# 列出当前目录的内容
ls

# 详细格式：权限、大小、修改时间
ls -l

# 显示隐藏文件（以 . 开头的文件）
ls -a

# 组合选项
ls -la

# 列出指定目录
ls /home/username
```

**详细列表解读：**

```
-rw-r--r--  1 user  group  4096 Dec 20 10:00 document.txt
drwxr-xr-x  2 user  group  4096 Dec 20 09:00 folder
```

| 字段 | 含义 |
|------|------|
| `d` 或 `-` | `d` 表示目录（directory），`-` 表示普通文件 |
| `rwxr-xr-x` | 权限位：所有者权限、组权限、其他人权限 |
| `1` 或 `2` | 硬链接数 |
| `user` | 文件所有者 |
| `group` | 所属用户组 |
| `4096` | 文件大小（字节），目录大小通常是 4096 字节的倍数 |
| `Dec 20 10:00` | 最后修改时间 |
| `document.txt` | 文件名 |

`ls` 默认不列出以 `.` 开头的隐藏文件——这是 Unix 的命名惯例：`.gitconfig`、`.bashrc`、`.ssh` 都是隐藏文件/目录。用 `ls -a` 显示所有文件（包括 `.` 和 `..`），用 `ls -A` 显示所有文件但不包括 `.` 和 `..`。

::: tip Rust 重写运动：新一代命令行工具
近年来，Rust 社区推动了一场"命令行工具重写"运动——用更好的默认值和更现代的设计重新实现经典命令，保留原版精神的同时全方位升级用户体验：

- **`eza`** 替代 `ls`：默认彩色输出，显示图标，集成 Git 状态（标记修改、暂存、未跟踪的文件），支持树状视图，无需额外参数
- **`bat`** 替代 `cat`：语法高亮，行号显示，Git 集成（标记增删行），文件过长时自动调用分页器
- **`fd`** 替代 `find`：默认忽略 .gitignore 中的文件，语法更直观（`fd pattern` 比 `find . -name "pattern"` 简洁得多），搜索速度更快
- **`zoxide`** 替代 `cd`：记住你访问过的目录，支持模糊匹配。（`z project` 跳转到 `/home/username/projects`，不需要输入完整路径）

这些工具共享一套设计哲学：更好的默认值，更快的速度，更直观的输出。建议先掌握原版命令，再尝试这些替代品——你会切身体会到"默认值"对使用体验的影响有多大。
:::

### 3.2 dir 命令

Windows CMD 使用 `dir` 而不是 `ls`：

```cmd
:: 列出当前目录的内容
dir

:: 显示隐藏文件
dir /a

:: 按修改时间排序
dir /od
```

PowerShell 同时支持 `ls` 和 `dir`，两者都是 `Get-ChildItem` 的别名。

## 四、创建目录和文件

### 4.1 mkdir：创建目录

`mkdir` 是 make directory 的缩写，创建一个或多个空目录。

```bash
# 创建单个目录
mkdir new_folder

# 一次创建多个目录
mkdir folder_a folder_b folder_c

# 创建嵌套目录（Linux/Mac/PowerShell 需要 -p 选项）
mkdir -p parent/child/grandchild

# Windows CMD 创建多级目录（自动创建父目录，不需要 -p）
mkdir parent\child\grandchild
```

`-p` 选项（parents）的作用：如果父目录不存在，自动创建沿途所有需要的目录。没有 `-p` 时，`mkdir parent/child/grandchild` 会因为 `parent` 不存在而报错。

::: tip mkdir 命名趣事：如果 Unix 能重来
Ken Thompson（Unix 联合创始人）曾被问到一个问题：如果能重新设计 Unix，你会改变什么？他的回答是："I would spell `creat` correctly."

Unix 早期有一个创建文件的系统调用叫 `creat`——它本应是 `create`，末尾的 `e` 因为当时内存和存储空间的限制被省掉了。在每 KB 内存都要精打细算的 1970 年代，一个字符也是字符。

这种精简传统在命令行界延续至今：`ls` 而不是 `list`，`cd` 而不是 `chdir`，`cp` 而不是 `copy`，`mv` 而不是 `move`。每个短促的命令名背后都藏着半个世纪前存储紧缺的记忆。这些名字从未改变，因为一旦一个命令进入全球程序员的肌肉记忆，改变它的代价远大于忍受它的简洁。
:::

### 4.2 touch：创建空文件

`touch` 在 Linux、macOS 和 PowerShell 上都可用：

```bash
# 创建空文件
touch newfile.txt

# 一次创建多个文件
touch file1.txt file2.txt file3.txt
```

::: note touch 的本意
`touch` 的本意是更新文件的修改时间——"触碰"文件使其时间戳变为当前时刻。如果指定的文件不存在，它会顺便创建一个空文件。这个"副作用"逐渐取代了本意，成为 touch 最常见的用途。

你可以动手验证：对一个已存在的文件执行 `touch existing.txt`，内容不会改变，但 `ls -l` 显示的修改时间会更新。
:::

Windows CMD 中没有 `touch`。替代方法是利用重定向（第 4 章详述）：

```cmd
:: 创建空文件
type nul > newfile.txt

:: 或用 echo
echo. > newfile.txt
```

PowerShell：
```powershell
New-Item newfile.txt
# 简写为
ni newfile.txt
```

## 五、复制、移动、重命名

### 5.1 cp：复制

`cp` 是 copy 的缩写，复制文件和目录。

```bash
# 复制文件（指定新文件名）
cp source.txt destination.txt

# 复制到目录（保留原文件名）
cp file.txt /path/to/directory/

# 复制整个目录及其内容（-r 表示递归）
cp -r source_folder destination_folder
```

`-r`（recursive）是一个必须显式指定的选项——没有它，`cp` 拒绝复制目录并报错。这个设计是有意为之：目录可能包含大量子文件，让你显式确认意图。

Windows CMD：
```cmd
:: 复制文件
copy source.txt destination.txt

:: 复制到目录
copy file.txt C:\path\to\directory\
```

### 5.2 mv：移动与重命名

`mv` 是 move 的缩写。移动和重命名在文件系统层面是同一回事——都是改变文件的路径标识。所以一个命令完成两件事。

```bash
# 移动文件到另一个目录
mv file.txt /new/location/

# 重命名：移动到同一个目录，换个名字
mv oldname.txt newname.txt

# 移动整个目录（不需要 -r）
mv old_folder /new/location/
```

Windows CMD 中移动和重命名是两个命令：

```cmd
:: 移动
move file.txt C:\new\location\

:: 重命名
ren oldname.txt newname.txt
```

PowerShell 支持 `mv` 和 `move`。

::: warning 覆盖无提示
`mv` 和 `cp` 在目标文件已存在时会**直接覆盖**，不弹出确认对话框。这是命令行"信任用户"哲学的体现——命令假设你知道自己在做什么。

如果你不确定目标文件是否已存在，可以在命令后加 `-i`（interactive）选项，系统会在覆盖前询问确认。某些 Linux 发行版甚至把 `-i` 设为了 `cp` 和 `mv` 的默认行为——用别名改写的。
:::

## 六、删除文件和目录

::: caution 命令行删除不经过回收站
图形界面中删除文件默认进入回收站——你可以随时恢复。命令行删除直接绕过回收站，文件数据在文件系统中被标记为可覆盖。没有提示，没有恢复机会。

在执行删除命令之前，确认你指对了目标。花两秒确认，省去数小时的懊悔。
:::

### 6.1 rm 命令

```bash
# 删除单个文件
rm file.txt

# 删除多个文件
rm file1.txt file2.txt file3.txt

# 删除目录（-r 递归删除目录内所有内容）
rm -r folder

# 强制删除（不提示确认）
rm -f file.txt

# 删除目录且不提示（-r 递归 + -f 强制）
rm -rf folder
```

### 6.2 Windows CMD 的 del 和 rmdir

```cmd
:: 删除文件
del file.txt

:: 删除空目录
rmdir folder

:: 删除目录及其所有内容
rmdir /s folder

:: 删除目录且不提示
rmdir /s /q folder
```

::: caution rm -rf /：现在你能读懂这条命令了
在第 1 章中你第一次见到了 `rm -rf /`。现在你能逐部分理解它：

- `rm`：remove，删除
- `-r`：recursive，递归——如果目标是目录，进入目录删除所有内容
- `-f`：force，强制——不询问任何确认
- `/`：根目录，整个文件系统的起点

组合结果：**强制递归删除根目录下的一切**——操作系统、你的所有文档、所有安装的软件。一个字不剩。

现代 GNU coreutils 版本会拒绝 `rm -rf /` 这行精确命令，必须添加 `--no-preserve-root` 才能执行。但这个保护有漏洞：`rm -rf /*`（注意末尾的通配符 `*`）不受保护——Shell 先将通配符展开为根目录下的所有文件名（`/bin`、`/etc`、`/home` 等），然后逐一传给 `rm`。保护机制看到的是分散的子路径，没有一条等于 `/` 本身。

这条命令早已超出技术范畴，成为程序员文化的一部分。当你在论坛或聊天中看到有人回复 `sudo rm -rf /`，这是一个冷笑话——在嘲讽命令行"绝对服从"的特性。但这也恰恰说明了命令行的本质：它是你手中最锋利的工具，效率极高，代价也可能极高。

**教训只有一条**：敲回车之前，读你的命令两次。
:::

## 七、查看文件内容

### 7.1 cat：查看文件全部内容

```bash
cat file.txt
```

文件内容完整显示在终端中。如果文件很大，内容会快速刷过屏幕，这时候就该换 `less` 上场了。

::: info cat 的全称是 concatenate
`cat` 与猫无关。它是 concatenate（串联、连接）的缩写。cat 的本职工作是把多个文件的内容串联在一起输出：

```bash
cat chapter1.txt chapter2.txt chapter3.txt
```

这条命令把三个文件的内容按顺序拼接，输出到终端。cat 可以接受任意数量的文件参数。

单独查看一个文件只是 cat 的"副业"——把"连接一个文件"理解为"连接只有一个文件的列表"就可以了。知道这个名字的来源后，每次输入 `cat` 你脑子里浮现的不应该是一只猫，而是一串文件内容被依次拼接的画面。
:::

### 7.2 less：分页浏览

当文件内容超过一个屏幕的高度时，`cat` 会让你盯着飞速滚动的文本却什么也读不到。`less` 正是为这个场景设计的。

```bash
less longfile.txt
```

进入 less 后的常用操作键：

| 按键 | 功能 |
|------|------|
| `空格` / `Page Down` / `f` | 向下翻一页 |
| `b` / `Page Up` | 向上翻一页 |
| `↓` / `j` | 向下滚一行 |
| `↑` / `k` | 向上滚一行 |
| `/关键词` | 向前搜索关键词，`n` 跳到下一个匹配 |
| `?关键词` | 向后搜索关键词 |
| `g` | 跳到文件开头 |
| `G` | 跳到文件末尾 |
| `q` | 退出 less |

::: note less is more：一个持续了四十余年的双关
在 `less` 之前，有一个更老的命令叫 `more`——功能是分页查看文件，但只能向前翻页，不能后退。

1983 年，Mark Nudelman 写了一个 `more` 的增强版，增加了向后翻页、搜索、跳转等功能。他为这个"比 more 更强的 more"取名为 `less`——一个精妙的双关：

- 字面上：less 比 more"更少"（一个谦虚的名字）
- 功能上：less 能做到 more 的所有功能，甚至更多（less does more）

这个双关在 Unix 圈流传了四十多年，是程序员幽默的经典教材——用最少的字符表达最多的含义。less 至今仍在维护，你使用的很可能就是 Nudelman 四十多年前开始写的那段代码的后代。
:::

### 7.3 head 和 tail：看头看尾

很多时候你不需要看完整文件——只需要开头几行确认格式，或结尾几行查看最近的日志。

```bash
# 查看前 10 行（默认）
head file.txt

# 查看前 20 行
head -n 20 file.txt

# 查看后 10 行（默认）
tail file.txt

# 查看后 50 行
tail -n 50 file.txt

# 实时追踪文件末尾的新增内容（常用于监控日志）
tail -f logfile.log
```

`tail -f`（follow）会持续监控文件，一旦有新内容追加到末尾，立即在终端中显示。在查看服务器日志、调试程序输出时非常实用。按 `Ctrl + C` 停止追踪。

### 7.4 Windows 查看文件

Windows CMD 的对应命令：

```cmd
:: 显示文件全部内容
type file.txt

:: 分页显示
more file.txt
```

PowerShell 支持 `cat` 和 `more`，也可以使用 `Get-Content`。

## 八、实用技巧

### 8.1 通配符

通配符让你一次性描述多个文件。Shell 在命令执行前将模式展开为实际的文件名列表。

| 通配符 | 含义 | 示例 | 匹配结果 |
|--------|------|------|----------|
| `*` | 匹配任意数量字符（包括零个） | `*.txt` | `a.txt`、`report.txt`，也包括 `.txt`（零个字符在 `.` 前面） |
| `?` | 匹配恰好一个字符 | `file?.txt` | `file1.txt`、`fileA.txt`，不匹配 `file10.txt` |
| `[abc]` | 匹配括号内的任意一个字符 | `file[123].txt` | `file1.txt`、`file2.txt`、`file3.txt` |

实际使用：

```bash
# 删除所有临时文件
rm *.tmp

# 将所有图片复制到备份目录
cp *.jpg /backup/images/

# 列出所有以 report 开头的文件
ls report*

# 匹配 2025 年任意月份的报告
ls report_2025-[0-9][0-9].pdf
```

::: note 通配符由 Shell 展开，而非命令本身
值得理解的一个细节：`rm *.tmp` 中展开通配符的不是 `rm`，而是 Shell。Shell 在当前目录找到所有匹配 `*.tmp` 的文件，将文件名列表传给 `rm`。`rm` 收到的参数已经是一个个具体的文件名，它根本不知道 `*` 的存在。

这引出两个推论：
1. 通配符在所有命令中通用——Shell 替所有命令承担了展开工作
2. 如果一个目录有上万个匹配 `*.log` 的文件，Shell 展开后的参数字符串可能超过系统允许的长度上限。这种情况用 `find` 命令（后续章节介绍）更合适
:::

### 8.2 命令串联

多个命令可以在同一行执行，有两种串联方式：

```bash
# 分号：依次执行，不关心前一个命令是否成功
mkdir test; cd test; touch file.txt

# &&：前一个命令成功（退出码为 0）才执行下一个
mkdir test && cd test && touch file.txt
```

推荐使用 `&&`：如果 `mkdir test` 因为权限不足而失败，后续的 `cd test` 和 `touch file.txt` 都不会执行，避免在错误的位置创建文件。用 `;` 时，即使目录创建失败，Shell 也会继续执行后面的命令。

## 九、练习任务

::: important 动手练习
完成以下任务来巩固本章知识：

1. **创建实验目录**
   ```bash
   mkdir cli_practice
   cd cli_practice
   ```

2. **创建几个文件**
   ```bash
   touch file1.txt file2.txt file3.txt
   ```

3. **创建子目录并移动文件**
   ```bash
   mkdir backup
   mv file1.txt backup/
   ```

4. **复制文件并查看**
   ```bash
   cp file2.txt file2_copy.txt
   ```

5. **查看目录结构和内容**
   ```bash
   ls -la
   ls backup/
   cat file2.txt
   ```

6. **用 less 浏览长文件**（找一个你电脑上的文本文件试试）
   ```bash
   less some_long_file.txt
   ```

7. **用通配符批量操作**
   ```bash
   touch test_a.txt test_b.txt test_c.txt
   ls test_*.txt
   rm test_*.txt
   ```

8. **清理实验**
   ```bash
   cd ..
   rm -r cli_practice
   ```

9. **尝试通配符组合**（选做）
   ```bash
   touch report_2025-01.txt report_2025-02.txt report_2025-12.txt
   ls report_2025-0[1-9].txt
   ```
:::

## 十、本章小结

| 操作 | Linux/Mac | Windows CMD | PowerShell |
|------|-----------|-------------|------------|
| 切换目录 | `cd` | `cd` | `cd` |
| 显示当前目录 | `pwd` | `cd` | `pwd` |
| 列出目录内容 | `ls` | `dir` | `ls` / `dir` |
| 创建目录 | `mkdir` | `mkdir` | `mkdir` |
| 创建文件 | `touch` | `type nul >` | `ni` |
| 复制 | `cp` | `copy` | `cp` / `copy` |
| 移动/重命名 | `mv` | `move` / `ren` | `mv` / `move` |
| 删除文件 | `rm` | `del` | `rm` / `del` |
| 删除目录 | `rm -r` | `rmdir /s` | `rm -r` |
| 查看文件 | `cat` / `less` | `type` / `more` | `cat` / `more` |

本章你学到的不仅是十个命令的用法，还有它们背后的设计思想：

- **"一切皆文件"** 使所有操作遵循统一的接口——你学会了操作文件，等于学会了操作设备、管道、网络连接。一套范式，应对所有场景。
- **"一个命令做一件事"** 让每个工具小而精——复杂任务通过组合简单命令完成。命令的数量是线性的，组合的可能性是指数级的。
- **"信任用户，不设护栏"** 给了你最高的效率，也要求你对操作负责。`rm -rf /` 的警示会伴随你的整个编程生涯——它提醒你，权力与责任从不分离。

---

在下一章，我们将学习管道（`|`）和重定向（`>`）——把本章学到的命令像积木一样组合起来，让它们协作完成更复杂的任务。命令行真正的威力，从这里开始展现。
