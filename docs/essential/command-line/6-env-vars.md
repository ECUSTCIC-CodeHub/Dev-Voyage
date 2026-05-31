---
title: '第 6 章：环境变量'
createTime: 2025/12/20 10:00:00
permalink: /essential/command-line/env-vars/
---

# 第 6 章：环境变量

::: tip 本章目标
彻底搞懂环境变量是什么、PATH 为什么那么重要、如何设置和修改环境变量。从此告别「command not found」的困扰。
:::

## 一、一个常见的困惑

你是否遇到过这样的情况？

```bash
$ python --version
Python 3.11.5

$ python3.12 --version
python3.12: command not found
```

明明安装了 Python 3.12，为什么找不到？

或者：

```bash
$ node --version
node: command not found
```

刚装完 Node.js，怎么就不认识了？

答案往往是：**环境变量没配好**。

## 二、什么是环境变量

**环境变量（Environment Variables）** 是操作系统为每个运行中的进程维护的一组键值对（key-value pairs）。每个进程启动时，操作系统会为它准备一个"环境块"——一块内存区域，里面存放着当前生效的所有环境变量及其值。进程可以读取这些变量来决定自己的行为，也可以修改自己的环境块（但修改只影响该进程自身及其子进程）。

这个机制起源于 Unix，现在所有主流操作系统都支持。它的核心思想是：**将配置信息从代码中分离出来，放在运行环境中。** 同一个程序，在不同的环境变量设置下，可以表现出不同的行为——不需要重新编译，不需要修改配置文件。

环境变量覆盖了从系统级到应用级的各种配置需求：

- **系统级**：当前用户是谁（`USER`）、用户的主目录在哪（`HOME`）、系统语言是什么（`LANG`）
- **应用级**：Java 装在哪个目录（`JAVA_HOME`）、Python 模块去哪找（`PYTHONPATH`）、AWS 用哪个配置文件（`AWS_PROFILE`）

环境变量的另一个关键特性是**继承**。当一个进程启动另一个进程（称为创建子进程）时，子进程会收到父进程环境变量的完整副本。这条继承链从操作系统内核开始——内核在启动第一个用户态进程（在 Unix 上是 `init`，在现代系统上是 `systemd` 或 `launchd`）时提供初始环境，之后每一层进程都从它的父进程继承环境。你在终端中 `export` 的变量之所以能被你接下来运行的命令读取到，正是因为 Shell 在启动每个命令时，将自己当前的环境复制了一份传给子进程。

::: note Shell 变量与环境变量的区别
在 Bash/Zsh 中，你可能会看到两种变量定义方式：

```bash
MY_LOCAL="only in this shell"      # Shell 变量：只在当前 Shell 内部可见
export MY_ENV="visible to children" # 环境变量：会传递给子进程
```

不带 `export` 定义的变量是 **Shell 变量**——Shell 自己知道它，但它不会被复制到子进程的环境块中。带 `export` 的变量才是真正的**环境变量**——它会出现在子进程的 `env` 输出中。

判断一个变量是否为环境变量的简单方法：运行 `env | grep VARNAME`。能找到的就是环境变量，找不到的就是 Shell 变量。
:::

### 2.1 查看所有环境变量

**Linux/Mac/PowerShell：**
```bash
env
# 或者
printenv
```

**Windows CMD：**
```cmd
set
```

你会看到一长串类似这样的输出：

```
HOME=/Users/username
PATH=/usr/local/bin:/usr/bin:/bin
LANG=en_US.UTF-8
SHELL=/bin/zsh
USER=username
...
```

### 2.2 查看单个环境变量

**Linux/Mac：**
```bash
echo $HOME
echo $PATH
```

**Windows CMD：**
```cmd
echo %HOME%
echo %PATH%
```

**PowerShell：**
```powershell
$env:HOME
$env:PATH
```

## 三、PATH：最重要的环境变量

在所有环境变量中，**PATH** 绝对是最重要的一个。理解了它，你就理解了环境变量的精髓。

### 3.1 PATH 是什么

当你在命令行输入一个命令（比如 `python`），系统是怎么找到这个程序的？

1. 系统不会搜索整个硬盘——那太慢了
2. 系统只在 **PATH 变量指定的目录** 中查找
3. 按顺序查找，找到第一个匹配的就执行

PATH 是一个目录列表。当你输入 `python` 并回车，Shell 遍历这个列表中的每一个目录，在每个目录中查找名为 `python` 的可执行文件。在第一个包含该文件的目录中停止搜索，执行那个文件。如果遍历完所有目录都没找到，Shell 返回 `command not found`。

### 3.2 查看你的 PATH

**Linux/Mac：**
```bash
echo $PATH
# 输出类似：/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

PATH 是一个由冒号 `:` 分隔的目录列表。

**Windows：**
```cmd
echo %PATH%
```

Windows 上是由分号 `;` 分隔的。

::: info PATH 分隔符之争
Linux/Mac 使用 `:` 分隔 PATH 中的目录条目。Windows 使用 `;`。

原因出在 Windows 的驱动器号上。`C:`、`D:` 这些驱动器号的表示法来自 1981 年的 MS-DOS 1.0——当时的设计者用单个字母加冒号来标识软盘驱动器。如果 Windows 也用 `:` 作为 PATH 分隔符，`C:\Windows` 中的 `C:` 就会被误解析为一个独立的 PATH 条目。所以 Windows 选择了 `;` 作为分隔符，避开这个歧义。

一个 1981 年为软盘驱动器做出的设计决策，至今仍在制造跨平台开发的麻烦。每一个需要在 Windows 和 Linux 上同时处理 PATH 的构建脚本、CI 配置、安装程序，都必须处理这个分隔符差异。
:::

### 3.3 为什么「command not found」

当你看到 `command not found` 错误时，原因几乎总是以下之一：

1. **程序没有安装** —— 最直接的原因
2. **程序安装了，但不在 PATH 里** —— 这是最常见的「坑」
3. **命令拼写错误** —— 检查一下吧

::: tip 调试技巧：which 命令
想知道系统在哪找到某个命令？

**Linux/Mac：**
```bash
which python
# 输出：/usr/bin/python

which nonexistent
# 输出：（空，或者报错）
```

**Windows PowerShell：**
```powershell
Get-Command python
# 或者
where.exe python
```

如果找不到，说明该命令不在 PATH 里。
:::

### 3.4 PATH 的查找顺序

PATH 中的目录是**按顺序搜索**的。这意味着：

```bash
PATH=/usr/local/bin:/usr/bin:/bin
```

系统会先找 `/usr/local/bin`，再找 `/usr/bin`，最后找 `/bin`。

::: warning PATH 优先级陷阱
如果你在 `/usr/local/bin` 和 `/usr/bin` 中都有一个叫 `python` 的程序，系统会执行哪一个？答案是 `/usr/local/bin/python`——PATH 中先出现的那个。

把目录加到 PATH 很容易。管理 PATH 的**顺序**才是关键。

这解释了「我明明装了新版本，怎么运行的还是旧版本」的困惑：新版本装到了 `/usr/bin`，但 `/usr/local/bin` 里还有一个更旧的版本排在 PATH 前面。`which python` 会告诉你实际运行的是哪一个——在怀疑安装出问题之前，先检查 PATH 顺序。
:::

## 四、其他常用环境变量

| 变量 | 含义 | 例子 |
|------|------|------|
| `HOME` | 用户主目录 | `/Users/username` |
| `USER` / `USERNAME` | 当前用户名 | `username` |
| `SHELL` | 默认 Shell | `/bin/zsh` |
| `LANG` | 系统语言/编码 | `en_US.UTF-8` |
| `TERM` | 终端类型 | `xterm-256color` |
| `EDITOR` | 默认编辑器 | `vim` 或 `nano` |
| `PWD` | 当前工作目录 | `/home/username/projects` |

::: note HOME 的命名哲学
在 Unix 早期，每个用户都有一个存放个人文件的目录。Ken Thompson 选择了 `HOME` 这个词——简单、直接、符合人对"家"的直觉。命名决策没有经过委员会评审，没有需求文档，就是一个人觉得这个名字够清楚。

Windows 选择了 `USERPROFILE`——更正式、更具体、更像一份行政表格上的字段名。

这两种命名风格反映了两个操作系统的设计哲学差异：Unix 倾向于简短、接近人类自然语言的命名（`HOME`、`SHELL`、`TERM`、`PWD`），Windows 倾向于长而精确的描述性命名（`USERPROFILE`、`ProgramFiles`、`CommonProgramFiles`）。两种风格各有道理：短名字打字快，长名字自文档化程度高。理解了这个差异，你在两个平台之间切换时就不会再对命名的不同感到困惑。
:::

### 4.1 程序专用的环境变量

很多程序也会使用自己的环境变量：

| 变量 | 用途 |
|------|------|
| `JAVA_HOME` | Java 安装目录 |
| `PYTHONPATH` | Python 模块搜索路径 |
| `NODE_PATH` | Node.js 模块搜索路径 |
| `GOPATH` | Go 语言工作目录 |
| `AWS_PROFILE` | AWS 配置文件名 |
| `HTTP_PROXY` | HTTP 代理设置 |

::: note JAVA_HOME 与语言生态的惯例
为什么 Java 需要一个专门的 `JAVA_HOME` 环境变量，而不是直接把 `java` 放进 PATH 就完事？

答案是历史惯性。早期的 Java 工具（如 Ant、Tomcat、Maven）在内部需要知道 Java 的安装根目录——不仅是为了找到 `java` 这个可执行文件，还要访问 `lib/tools.jar`、`jre/lib/rt.jar` 等支撑文件。PATH 只能定位可执行文件，无法回答"Java 装在哪"这个问题。于是 `JAVA_HOME` 成为了约定——指向 JDK 的安装根目录，工具链通过它找到整个 Java 运行时环境。

这个模式被后来的语言生态系统逐层复制：Python 有了 `PYTHONPATH`，Go 有了 `GOPATH`，Node.js 有了 `NODE_PATH`，Android 开发有了 `ANDROID_HOME`。一个语言在 1995 年做出的设计选择，演变成了整个行业的环境变量命名惯例。
:::

## 五、设置环境变量

### 5.1 临时设置（当前终端会话）

**Linux/Mac：**
```bash
export MY_VAR="Hello World"
echo $MY_VAR  # 输出：Hello World
```

**Windows CMD：**
```cmd
set MY_VAR=Hello World
echo %MY_VAR%
```

**PowerShell：**
```powershell
$env:MY_VAR = "Hello World"
$env:MY_VAR
```

::: note 注意
临时设置的环境变量**只在当前终端窗口有效**。关掉窗口就没了。
:::

::: tip 一次性环境变量：env 命令
有时你只想在运行某一个命令时临时设置一个环境变量，而不希望它污染当前 Shell 的环境。这时可以用 `env` 命令：

```bash
# 只在运行 node 时设置 NODE_ENV，运行结束后该变量就消失了
env NODE_ENV=production node server.js

# 验证：NODE_ENV 没有残留
echo $NODE_ENV  # 输出为空
```

等价的做法是：
```bash
export NODE_ENV=production
node server.js
unset NODE_ENV  # 手动清理
```

但 `env` 一行搞定，更简洁。这种模式在运行开发服务器、执行数据库迁移、启动不同配置的应用实例时非常常见。
:::

### 5.2 临时修改 PATH

想把一个目录临时加入 PATH？

**Linux/Mac：**
```bash
# 添加到 PATH 开头（高优先级）
export PATH="/my/custom/path:$PATH"

# 添加到 PATH 末尾（低优先级）
export PATH="$PATH:/my/custom/path"
```

**Windows CMD：**
```cmd
set PATH=C:\my\custom\path;%PATH%
```

**PowerShell：**
```powershell
$env:PATH = "C:\my\custom\path;$env:PATH"
```

### 5.3 永久设置

要让环境变量永久生效，需要修改配置文件。

#### 5.3.1 Linux/Mac

修改你的 Shell 配置文件：
- **Bash**：`~/.bashrc` 或 `~/.bash_profile`
- **Zsh**：`~/.zshrc`

```bash
# 用编辑器打开配置文件
nano ~/.zshrc  # 或者用你喜欢的编辑器

# 在文件末尾添加
export MY_VAR="Hello World"
export PATH="$HOME/my-tools/bin:$PATH"

# 保存退出后，让配置生效
source ~/.zshrc
```

::: tip .bashrc vs .bash_profile
- **`.bashrc`**：每次打开新终端都会执行
- **`.bash_profile`**：只在登录时执行一次

建议在 `.bash_profile` 中加一行 `source ~/.bashrc`，这样所有配置都写在 `.bashrc` 就行了。
:::

#### 5.3.2 Windows

Windows 提供了图形界面设置环境变量：

1. 按 `Win + R`，输入 `sysdm.cpl`，回车
2. 点击「高级」选项卡
3. 点击「环境变量」按钮
4. 在「用户变量」或「系统变量」中添加/编辑

::: warning 用户变量 vs 系统变量
- **用户变量**：只对当前用户生效
- **系统变量**：对所有用户生效（需要管理员权限）

一般情况下，修改用户变量就够了。
:::

也可以用命令行设置（PowerShell，管理员）：

```powershell
# 设置用户环境变量
[Environment]::SetEnvironmentVariable("MY_VAR", "Hello", "User")

# 添加到 PATH（用户级别）
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
[Environment]::SetEnvironmentVariable("PATH", "$currentPath;C:\my\path", "User")
```

::: warning 重启终端
修改永久环境变量（Shell 配置文件或 Windows 系统设置）后，**必须重新打开终端**才能看到效果。已经打开的终端窗口不会自动检测变更——它们在启动时读取过一次环境变量，之后一直使用那份快照。

这是「我明明加到 PATH 了，怎么还是 command not found」的第一大原因。检查步骤：先确认是否重启了终端。
:::

## 六、实战：配置一个新安装的程序

假设你刚下载了一个程序到 `~/tools/awesome-tool/`，它的可执行文件在 `~/tools/awesome-tool/bin/awesome`。

### 6.1 步骤 1：确认程序位置

```bash
ls ~/tools/awesome-tool/bin/
# 输出：awesome
```

### 6.2 步骤 2：测试用绝对路径运行

```bash
~/tools/awesome-tool/bin/awesome --version
# 如果能运行，说明程序本身没问题
```

### 6.3 步骤 3：添加到 PATH

**Linux/Mac（永久生效）：**
```bash
echo 'export PATH="$HOME/tools/awesome-tool/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 6.4 步骤 4：验证

```bash
which awesome
# 输出：/Users/username/tools/awesome-tool/bin/awesome

awesome --version
# 成功！
```

## 七、常见问题排查

### 7.1 问题 1：配置了但不生效

**检查清单：**
1. 是否重新打开了终端？
2. 配置文件名是否正确（`.bashrc` vs `.zshrc`）？
3. 语法是否正确（`export VAR=value`，等号两边没有空格）？

### 7.2 问题 2：PATH 顺序导致运行了错误的版本

```bash
which python
# 输出：/usr/bin/python  （不是你想要的版本）
```

**解决方法：** 把你想要的路径放到 PATH 的**前面**：
```bash
export PATH="/usr/local/bin:$PATH"  # 而不是 "$PATH:/usr/local/bin"
```

### 7.3 问题 3：Windows PATH 太长

Windows 有 PATH 长度限制（约 2048 字符）。如果 PATH 太长，可能导致奇怪的问题。

**解决方法：**
- 清理不需要的路径
- 使用 PATHEXT 等替代方案
- 考虑使用工具如 Rapid Environment Editor

### 7.4 问题 4：`sudo` 后环境变量丢失

在 Linux/Mac 上，你可能会遇到这种情况：普通用户下 `echo $MY_VAR` 能正常输出，但 `sudo echo $MY_VAR` 为空。

原因是 `sudo` 默认会重置环境变量——出于安全考虑，它以最小化的环境运行命令，避免特权进程继承用户环境中可能被篡改的变量（如 `LD_PRELOAD`、`LD_LIBRARY_PATH`）。这是有意为之的安全设计。

**解决方法：**
- 使用 `sudo -E` 保留当前环境：`sudo -E echo $MY_VAR`
- 或者将变量定义写在 `/etc/environment`（系统级，所有用户生效）
- 在 `sudo` 调用的命令内部显式设置变量，而不是依赖继承

## 八、本章小结

1. **环境变量是进程级别的键值对配置** —— 操作系统在启动每个进程时为其准备环境块，进程从中读取配置信息
2. **PATH 是最重要的环境变量** —— 它决定了 Shell 在哪些目录中查找命令。理解了 PATH 的查找顺序，就理解了「command not found」的根源
3. **设置方式有两种** —— 临时（`export`/`set`，仅当前终端有效）与永久（写入 Shell 配置文件或系统设置，重启终端后生效）
4. **排查从 which 开始** —— 遇到「command not found」，先用 `which` 确认命令是否在 PATH 中，再检查 PATH 顺序

::: important 动手任务
1. **查看你的 PATH**
   ```bash
   echo $PATH  # Linux/Mac
   echo %PATH%  # Windows CMD
   ```

2. **创建一个临时环境变量**
   ```bash
   export HELLO="World"
   echo $HELLO
   ```

3. **找出 `python`/`node`/`git` 在哪**
   ```bash
   which python
   which node
   which git
   ```

4. **挑战：把一个自定义脚本添加到 PATH**
   - 创建一个简单的脚本
   - 把它的目录添加到 PATH
   - 直接用脚本名运行它
:::

---

**下一章：[脚本入门](./8-scripts.md)** →

在下一章，我们将学习如何把多条命令组合成脚本，让电脑帮你自动完成重复任务！
