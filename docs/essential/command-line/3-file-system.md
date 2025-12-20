---
title: '第 3 章：文件系统探索'
createTime: 2025/12/20 10:00:00
permalink: /essential/command-line/file-system/
---

# 第 3 章：文件系统探索

::: tip 本章目标
学会用命令行在文件系统中「逛街」—— 浏览目录、创建文件和文件夹、复制、移动、删除。掌握这些，你就能用命令行完成大部分日常文件操作！
:::

## 一、 🗺️ 理解文件系统的结构

在开始之前，让我们先了解一下文件系统是如何组织的。

### 1.1. 树形结构

文件系统就像一棵倒过来的树：

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

- **根目录（Root）** 是树的「根」，在 Linux/Mac 上是 `/`，在 Windows 上是 `C:\`
- **目录（文件夹）** 是树的「枝干」，可以包含文件和其他目录
- **文件** 是树的「叶子」，是实际存储数据的地方

### 1.2. 路径（Path）

路径就是描述文件位置的「地址」。就像现实中的地址一样：

> 中国 > 上海市 > 某某区 > 某某路 > 某某号

在文件系统里：

> `/home/username/Documents/report.txt`

::: note Windows 和 Linux/Mac 的路径差异

| 特点 | Windows | Linux/Mac |
|------|---------|-----------|
| 根目录 | `C:\`、`D:\` 等 | `/` |
| 分隔符 | `\`（反斜杠） | `/`（正斜杠） |
| 大小写 | 不敏感 | 敏感 |

在 Windows 上，`Documents` 和 `documents` 是同一个文件夹。
在 Linux/Mac 上，它们是**两个不同的文件夹**！
:::

### 1.3. 绝对路径 vs 相对路径

**绝对路径**：从根目录开始的完整路径
```bash
/home/username/Documents/report.txt  # Linux/Mac
C:\Users\username\Documents\report.txt  # Windows
```

**相对路径**：从当前目录开始的路径
```bash
Documents/report.txt  # 假设当前在 /home/username
../Downloads/file.zip  # 上一级目录的 Downloads 文件夹
```

::: tip 两个特殊符号
- `.`（一个点）：表示当前目录
- `..`（两个点）：表示上一级目录

这两个符号在命令行中非常常用！
:::

## 二、 🚶 在目录间移动

### 2.1. cd 命令：切换目录

`cd` 是 **C**hange **D**irectory 的缩写，用来切换当前工作目录。

```bash
# 进入 Documents 目录
cd Documents

# 进入绝对路径
cd /home/username/Documents  # Linux/Mac
cd C:\Users\username\Documents  # Windows CMD

# 返回上一级目录
cd ..

# 返回上两级目录
cd ../..

# 回到用户主目录
cd ~  # Linux/Mac/PowerShell
cd %USERPROFILE%  # Windows CMD
```

::: warning 路径中有空格？
如果目录名包含空格，需要用引号包起来：
```bash
cd "My Documents"
# 或者使用转义（Linux/Mac）
cd My\ Documents
```
:::

### 2.2. pwd 命令：显示当前目录

忘记自己在哪了？用 `pwd`（Print Working Directory）：

```bash
pwd
# 输出：/home/username/Documents
```

在 Windows CMD 中，直接输入 `cd`（不带参数）也能显示当前目录。

## 三、 👀 查看目录内容

### 3.1. ls 命令（Linux/Mac/PowerShell）

```bash
# 列出当前目录内容
ls

# 列出详细信息
ls -l

# 显示隐藏文件（以 . 开头的文件）
ls -a

# 组合使用
ls -la

# 列出指定目录内容
ls /home/username
```

**详细列表的解读：**

```
-rw-r--r--  1 user  group  4096 Dec 20 10:00 document.txt
drwxr-xr-x  2 user  group  4096 Dec 20 09:00 folder
```

| 字段 | 含义 |
|------|------|
| `d` 或 `-` | `d` 表示目录，`-` 表示文件 |
| `rwxr-xr-x` | 权限（读、写、执行） |
| `1` 或 `2` | 链接数 |
| `user` | 所有者 |
| `group` | 所属组 |
| `4096` | 文件大小（字节） |
| `Dec 20 10:00` | 修改时间 |
| `document.txt` | 文件/目录名 |

### 3.2. dir 命令（Windows CMD）

```cmd
:: 列出当前目录内容
dir

:: 显示隐藏文件
dir /a

:: 按时间排序
dir /od
```

::: note PowerShell 的兼容性
在 PowerShell 中，`ls` 和 `dir` 都能用！PowerShell 为了方便从其他系统转来的用户，内置了很多别名。
:::

## 四、 📁 创建目录和文件

### 4.1. mkdir 命令：创建目录

```bash
# 创建单个目录
mkdir new_folder

# 创建多级目录（Linux/Mac/PowerShell）
mkdir -p parent/child/grandchild

# Windows CMD 创建多级目录
mkdir parent\child\grandchild
```

::: tip mkdir 的历史趣事
`mkdir` 这个命令自 Unix 诞生以来就存在了，已经超过 50 年历史。有趣的是，Ken Thompson（Unix 创始人之一）曾被问到如果能重新设计 Unix，会改变什么。他说：「我会把 `creat` 系统调用拼写完整（应该是 `create`）」。

是的，Unix 早期为了节省存储空间，很多命令都被缩写得很短。这个「传统」一直延续到今天。
:::

### 4.2. touch 命令：创建空文件（Linux/Mac）

```bash
# 创建空文件
touch newfile.txt

# 创建多个文件
touch file1.txt file2.txt file3.txt
```

::: note touch 的本意
`touch` 命令的本意是「触摸」文件——更新文件的修改时间。如果文件不存在，它会顺便创建一个空文件。这个「副作用」反而成了它最常用的功能。
:::

### 4.3. Windows 创建文件

Windows CMD 没有 `touch` 命令，但可以用其他方式：

```cmd
:: 创建空文件
type nul > newfile.txt

:: 或者用 echo
echo. > newfile.txt
```

PowerShell：
```powershell
New-Item newfile.txt
# 或者
ni newfile.txt
```

## 五、 📋 复制、移动、重命名

### 5.1. cp 命令：复制（Linux/Mac/PowerShell）

```bash
# 复制文件
cp source.txt destination.txt

# 复制到目录
cp file.txt /path/to/directory/

# 复制整个目录（需要 -r 选项）
cp -r source_folder destination_folder
```

### 5.2. copy 命令（Windows CMD）

```cmd
:: 复制文件
copy source.txt destination.txt

:: 复制到目录
copy file.txt C:\path\to\directory\
```

### 5.3. mv 命令：移动/重命名（Linux/Mac/PowerShell）

```bash
# 移动文件
mv file.txt /new/location/

# 重命名文件（移动到同一目录，但换个名字）
mv oldname.txt newname.txt

# 移动目录
mv old_folder /new/location/
```

### 5.4. move 命令（Windows CMD）

```cmd
:: 移动文件
move file.txt C:\new\location\

:: 重命名
ren oldname.txt newname.txt
```

## 六、 🗑️ 删除文件和目录

::: caution 删除是不可逆的！
命令行删除文件**不会进入回收站**，而是直接永久删除！在执行删除命令前，请三思而后行！
:::

### 6.1. rm 命令（Linux/Mac/PowerShell）

```bash
# 删除文件
rm file.txt

# 删除多个文件
rm file1.txt file2.txt file3.txt

# 删除目录（需要 -r 选项）
rm -r folder

# 强制删除（不提示确认）
rm -f file.txt

# 删除目录及其内容（危险！）
rm -rf folder
```

### 6.2. del 和 rmdir 命令（Windows CMD）

```cmd
:: 删除文件
del file.txt

:: 删除目录（必须是空目录）
rmdir folder

:: 删除目录及其内容
rmdir /s folder

:: 强制删除（不提示）
rmdir /s /q folder
```

::: danger 臭名昭著的 rm -rf /
现在你应该明白为什么 `rm -rf /` 这么危险了：

- `rm`：删除
- `-r`：递归（包括所有子目录）
- `-f`：强制（不询问）
- `/`：根目录

组合起来就是：**强制递归删除根目录下的所有内容** = **删除整个系统**

幸运的是，现代 Linux 系统已经加入了保护机制。但这个命令依然是程序员圈子里的经典警示：在命令行操作时，尤其是删除操作，一定要**看清楚再按回车**！
:::

## 七、 🔍 查看文件内容

### 7.1. cat 命令：显示文件全部内容

```bash
cat file.txt
```

::: tip cat 的来历
`cat` 是 con**cat**enate（连接）的缩写。它的本意是把多个文件内容连接起来输出：
```bash
cat file1.txt file2.txt file3.txt
```
单独查看一个文件只是它的「副业」。
:::

### 7.2. less 命令：分页查看

如果文件很长，用 `cat` 会刷屏。这时候可以用 `less`：

```bash
less longfile.txt
```

- 按 `空格` 或 `Page Down` 向下翻页
- 按 `b` 或 `Page Up` 向上翻页
- 按 `/` 然后输入关键词可以搜索
- 按 `q` 退出

::: note less is more
有个更老的命令叫 `more`，功能类似但不如 `less` 强大。程序员的幽默：`less` 比 `more` 更强（less is more 的双关）。
:::

### 7.3. head 和 tail：查看开头和结尾

```bash
# 查看前 10 行
head file.txt

# 查看前 20 行
head -n 20 file.txt

# 查看后 10 行
tail file.txt

# 查看后 50 行
tail -n 50 file.txt

# 实时查看文件更新（常用于看日志）
tail -f logfile.log
```

### 7.4. Windows 查看文件

```cmd
:: 显示文件内容
type file.txt

:: 分页显示
more file.txt
```

## 八、 🧭 实用技巧

### 8.1. 通配符

通配符让你能一次操作多个文件：

| 通配符 | 含义 | 例子 |
|--------|------|------|
| `*` | 匹配任意字符（包括空） | `*.txt` 匹配所有 txt 文件 |
| `?` | 匹配单个字符 | `file?.txt` 匹配 file1.txt, fileA.txt |
| `[abc]` | 匹配括号内任一字符 | `file[123].txt` 匹配 file1.txt, file2.txt, file3.txt |

```bash
# 删除所有 .tmp 文件
rm *.tmp

# 复制所有图片
cp *.jpg /backup/images/

# 列出所有以 test 开头的文件
ls test*
```

### 8.2. 命令组合

在 Linux/Mac 上，可以用分号或 `&&` 组合多个命令：

```bash
# 用分号：不管前一个命令是否成功，都执行下一个
mkdir test; cd test; touch file.txt

# 用 &&：只有前一个命令成功，才执行下一个
mkdir test && cd test && touch file.txt
```

## 九、 🎮 练习任务

::: important 动手练习
完成以下任务来巩固今天的知识：

1. **创建一个实验目录**
   ```bash
   mkdir cli_practice
   cd cli_practice
   ```

2. **在里面创建几个文件**
   ```bash
   touch file1.txt file2.txt file3.txt
   ```

3. **创建一个子目录并把文件移进去**
   ```bash
   mkdir backup
   mv file1.txt backup/
   ```

4. **复制一个文件**
   ```bash
   cp file2.txt file2_copy.txt
   ```

5. **查看目录结构**
   ```bash
   ls -la
   ls backup/
   ```

6. **清理实验**
   ```bash
   cd ..
   rm -r cli_practice
   ```
:::

## 十、 📝 本章小结

| 操作 | Linux/Mac | Windows CMD | PowerShell |
|------|-----------|-------------|------------|
| 切换目录 | `cd` | `cd` | `cd` |
| 显示当前目录 | `pwd` | `cd` | `pwd` |
| 列出内容 | `ls` | `dir` | `ls` 或 `dir` |
| 创建目录 | `mkdir` | `mkdir` | `mkdir` |
| 创建文件 | `touch` | `type nul >` | `ni` |
| 复制 | `cp` | `copy` | `cp` 或 `copy` |
| 移动/重命名 | `mv` | `move`/`ren` | `mv` 或 `move` |
| 删除文件 | `rm` | `del` | `rm` 或 `del` |
| 删除目录 | `rm -r` | `rmdir /s` | `rm -r` |
| 查看文件 | `cat`/`less` | `type`/`more` | `cat`/`more` |

::: tip 命令行的哲学
Unix 的设计哲学之一是「做一件事，并把它做好」。每个命令都专注于一个功能，简单而强大。当你需要完成复杂任务时，就把这些简单命令组合起来。

这和图形界面的「一个程序做所有事」的思路截然不同，但在很多场景下更加高效和灵活。
:::

---

在下一章，我们将深入了解 CMD、PowerShell、Bash 这些「Shell」的前世今生，以及它们各自的特点和使用场景。
