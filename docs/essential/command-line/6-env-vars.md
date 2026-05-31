---
title: '第 5 章：环境变量大揭秘'
createTime: 2025/12/20 10:00:00
permalink: /essential/command-line/env-vars/
---

# 第 5 章：环境变量大揭秘

::: tip 本章目标
彻底搞懂环境变量是什么、PATH 为什么那么重要、如何设置和修改环境变量。从此告别「command not found」的困扰！
:::

## 一、 🤔 一个常见的困惑

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

## 二、 📦 什么是环境变量？

**环境变量（Environment Variables）** 是操作系统中的一组「全局设置」，它们像小纸条一样，告诉系统和程序一些重要的信息。

### 2.1. 打个比方

想象你是一个快递员：
- **HOME**：你的家庭地址（回家的路）
- **PATH**：你认识的所有街道列表（能送达的地方）
- **LANG**：你说的语言（和客户交流用什么语言）

环境变量就是这些「小纸条」的集合。每个程序启动时，都会收到这些信息的副本。

### 2.2. 查看所有环境变量

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

### 2.3. 查看单个环境变量

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

## 三、 🛤️ PATH：最重要的环境变量

在所有环境变量中，**PATH** 绝对是最重要的一个。理解了它，你就理解了环境变量的精髓。

### 3.1. PATH 是什么？

当你在命令行输入一个命令（比如 `python`），系统是怎么找到这个程序的呢？

1. 系统不会搜索整个硬盘（那太慢了）
2. 系统只在 **PATH 变量指定的目录** 中查找
3. 按顺序查找，找到第一个匹配的就执行

### 3.2. 查看你的 PATH

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

### 3.3. 为什么「command not found」？

当你看到 `command not found` 错误时，原因几乎总是以下之一：

1. **程序没有安装** —— 最直接的原因
2. **程序安装了，但不在 PATH 里** —— 这是最常见的「坑」
3. **命令拼写错误** —— 检查一下吧！

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

### 3.4. PATH 的查找顺序

PATH 中的目录是**按顺序搜索**的。这意味着：

```bash
PATH=/usr/local/bin:/usr/bin:/bin
```

系统会先找 `/usr/local/bin`，再找 `/usr/bin`，最后找 `/bin`。

::: warning 优先级陷阱
如果你在 `/usr/local/bin` 和 `/usr/bin` 都有一个叫 `python` 的程序，系统会执行 `/usr/local/bin/python`（先找到的那个）。

这可能导致「我明明装了新版本，怎么运行的还是旧版本」的困惑。
:::

## 四、 🏠 其他常用环境变量

| 变量 | 含义 | 例子 |
|------|------|------|
| `HOME` | 用户主目录 | `/Users/username` |
| `USER` / `USERNAME` | 当前用户名 | `username` |
| `SHELL` | 默认 Shell | `/bin/zsh` |
| `LANG` | 系统语言/编码 | `en_US.UTF-8` |
| `TERM` | 终端类型 | `xterm-256color` |
| `EDITOR` | 默认编辑器 | `vim` 或 `nano` |
| `PWD` | 当前工作目录 | `/home/username/projects` |

### 4.1. 程序专用的环境变量

很多程序也会使用自己的环境变量：

| 变量 | 用途 |
|------|------|
| `JAVA_HOME` | Java 安装目录 |
| `PYTHONPATH` | Python 模块搜索路径 |
| `NODE_PATH` | Node.js 模块搜索路径 |
| `GOPATH` | Go 语言工作目录 |
| `AWS_PROFILE` | AWS 配置文件名 |
| `HTTP_PROXY` | HTTP 代理设置 |

## 五、 ⚙️ 设置环境变量

### 5.1. 临时设置（当前终端会话）

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

### 5.2. 临时修改 PATH

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

### 5.3. 永久设置（推荐方法）

要让环境变量永久生效，需要修改配置文件。

#### 5.3.1. Linux/Mac

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

#### 5.3.2. Windows

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

::: caution 修改后需要重启终端
修改永久环境变量后，需要**重新打开终端**才能看到效果。已经打开的终端窗口不会自动更新。
:::

## 六、 🔧 实战：配置一个新安装的程序

假设你刚下载了一个程序到 `~/tools/awesome-tool/`，它的可执行文件在 `~/tools/awesome-tool/bin/awesome`。

### 6.1. 步骤 1：确认程序位置

```bash
ls ~/tools/awesome-tool/bin/
# 输出：awesome
```

### 6.2. 步骤 2：测试用绝对路径运行

```bash
~/tools/awesome-tool/bin/awesome --version
# 如果能运行，说明程序本身没问题
```

### 6.3. 步骤 3：添加到 PATH

**Linux/Mac（永久生效）：**
```bash
echo 'export PATH="$HOME/tools/awesome-tool/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 6.4. 步骤 4：验证

```bash
which awesome
# 输出：/Users/username/tools/awesome-tool/bin/awesome

awesome --version
# 成功！
```

## 七、 🐛 常见问题排查

### 7.1. 问题 1：配置了但不生效

**检查清单：**
1. 是否重新打开了终端？
2. 配置文件名是否正确（`.bashrc` vs `.zshrc`）？
3. 语法是否正确（`export VAR=value`，等号两边没有空格）？

### 7.2. 问题 2：PATH 顺序问题

```bash
which python
# 输出：/usr/bin/python  （不是你想要的版本）
```

**解决方法：** 把你想要的路径放到 PATH 的**前面**：
```bash
export PATH="/usr/local/bin:$PATH"  # 而不是 "$PATH:/usr/local/bin"
```

### 7.3. 问题 3：Windows PATH 太长

Windows 有 PATH 长度限制（约 2048 字符）。如果 PATH 太长，可能导致奇怪的问题。

**解决方法：**
- 清理不需要的路径
- 使用 PATHEXT 等替代方案
- 考虑使用工具如 Rapid Environment Editor

## 八、 📜 环境变量的历史趣事

::: note 为什么 HOME 叫 HOME？
在 Unix 早期，每个用户都有一个「家目录」，用来存放个人文件。Ken Thompson 觉得 `HOME` 这个词简单明了，于是就这么定了。

有趣的是，Windows 用的是 `USERPROFILE`（用户配置文件），更加「官僚」，而 Unix 风格的 `HOME` 更加「居家」。
:::

::: note PATH 分隔符之争
为什么 Linux/Mac 用 `:`，Windows 用 `;`？

因为 Windows 的路径里有冒号！`C:` 是驱动器号，如果用 `:` 分隔 PATH，就会产生歧义。所以 Windows 选择了 `;`。

这个差异给跨平台开发带来了不少麻烦……
:::

## 九、 📝 本章小结

1. **环境变量是全局设置** —— 告诉系统和程序重要信息
2. **PATH 是最重要的** —— 决定了系统在哪里找命令
3. **设置方式** —— 临时（export/set）vs 永久（配置文件）
4. **排查技巧** —— `which`、`echo $PATH`、重启终端

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

**下一章：[脚本入门](./6-scripts.md)** →

在下一章，我们将学习如何把多条命令组合成脚本，让电脑帮你自动完成重复任务！
