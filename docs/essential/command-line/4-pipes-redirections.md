---
title: '第 4 章：管道与重定向——Unix 哲学的基石'
createTime: 2025/12/20 10:00:00
permalink: /essential/command-line/pipes-redirections/
---

# 第 4 章：管道与重定向——Unix 哲学的基石

::: tip 本章目标
理解 stdin/stdout/stderr 三个标准流的概念，掌握管道（`|`）和重定向（`>`、`>>`、`<`）的用法，学会将简单命令组合成复杂的数据处理流水线。
:::

你已经学会了单独使用命令来操作文件系统。这一章你将学到命令行的核心超能力：让命令之间互相协作。一个命令的输出，直接变成另一个命令的输入——中间不需要临时文件，不需要手动复制粘贴。

假设你有一个 2GB 的服务器日志文件，你想找出所有包含 `ERROR` 的行，统计每种错误的出现次数，然后按频率从高到低排列。如果没有管道，你需要这样做：

1. 用编辑器打开日志，搜索 `ERROR`，复制结果到文件 A
2. 写一个小程序（或者用 Excel）统计文件 A 中每行的出现次数，结果写入文件 B
3. 对文件 B 排序，得到最终结果

三个中间文件，三次手动操作。对于 2GB 的日志，第一步就可能让编辑器卡死。

用管道，一行命令：

```bash
grep "ERROR" app.log | cut -d' ' -f4- | sort | uniq -c | sort -rn | head -10
```

没有中间文件，没有等待编辑器加载 2GB 数据的时间，结果直接出现在终端里。这就是管道的威力。

## 一、三个火枪手：stdin、stdout、stderr

在理解管道之前，需要先理解一个更基础的概念：每个程序启动时，操作系统会自动为它打开三个"文件"。

### 1.1 三个标准流

| 名称 | 缩写 | 文件描述符 | 默认目标 | 用途 |
|------|------|-----------|---------|------|
| 标准输入 | stdin | 0 | 键盘 | 程序读取数据的地方 |
| 标准输出 | stdout | 1 | 屏幕 | 程序输出正常结果的地方 |
| 标准错误 | stderr | 2 | 屏幕 | 程序输出错误信息的地方 |

当你运行 `cat file.txt` 时发生了什么？

- `cat` 没有从 stdin（键盘）读取，而是直接从参数中拿到了文件名
- `cat` 打开文件，将内容写入 stdout（屏幕）
- 如果文件不存在，`cat` 向 stderr（屏幕）写入错误信息：`cat: file.txt: No such file or directory`

你看到 stdout 和 stderr 都出现在终端里，但它们走的是两条独立的通道。

::: info 为什么"一切皆文件"在这里至关重要
在第 3 章你学到 Unix 把一切资源抽象为文件。stdin、stdout、stderr 也是文件——具体来说是文件描述符：三个整数 0、1、2，指向操作系统为当前进程打开的输入输出通道。

这套设计意味着：你不需要为键盘、屏幕、网络连接、硬盘文件各自学习不同的读写方式。所有输入输出都通过"文件描述符"操作。当你把 stdout 重定向到一个硬盘文件时，程序不需要知道输出目标从屏幕变成了文件——它只是继续向文件描述符 1 写入，操作系统在底层切换了目标。

这种抽象层是管道和重定向能够存在的基础。如果每个程序都需要感知输出目标的具体类型，就不可能无缝地在屏幕、文件、管道之间切换。
:::

### 1.2 stdout 和 stderr 为什么要分开

分开是为了让你能**选择性地处理错误**。假设你运行一个数据处理脚本，想把结果保存到文件：

```bash
python process_data.py > results.txt
```

`>` 只重定向 stdout。脚本正常输出的数据进入 `results.txt`，但运行中的错误信息仍然打印在屏幕上。如果你把错误信息也混进了结果文件，你可能在事后分析数据时才发现数据里掺杂着 `FileNotFoundError: ...` 这样的报错行——而且你已经无法重现这个错误了。

## 二、管道：`|` ——命令之间的水管

### 2.1 基本概念

管道符号 `|` 连接两个命令：左侧命令的 stdout 直接进入右侧命令的 stdin。

```bash
command1 | command2
```

数据流向：`command1` 产生输出 -> 通过管道传输 -> `command2` 读取并处理。

一个具体例子：

```bash
ls -l | grep ".txt"
```

这里发生了什么：

1. `ls -l` 生成长格式的目录列表，写入 stdout
2. Shell 截获这些数据，通过内存中的管道缓冲区传给 `grep`
3. `grep ".txt"` 从 stdin 读取数据，筛选出包含 `.txt` 的行，写入 stdout
4. `grep` 的 stdout 仍然连接到屏幕，所以你看到筛选结果

磁盘上不存在任何临时文件。所有传输在内存中完成。

### 2.2 常见管道路径

```bash
# 统计某个目录下有多少个文件
ls | wc -l

# 查看某个进程是否在运行
ps aux | grep node

# 查看文件行数（cat 输出文件内容，wc -l 计数）
cat data.txt | wc -l

# 查看最近的 5 条 git 提交
git log --oneline | head -5
```

### 2.3 管道链：不止两两连接

管道可以串联任意多个命令，形成数据处理流水线：

```bash
cat access.log | grep "ERROR" | cut -d' ' -f1 | sort | uniq -c | sort -rn | head -10
```

逐节解读这条命令：

| 环节 | 命令 | 作用 | 数据形态变化 |
|------|------|------|-------------|
| 1 | `cat access.log` | 读取日志文件 | 全文 |
| 2 | `grep "ERROR"` | 只保留含 ERROR 的行 | 缩小到错误行 |
| 3 | `cut -d' ' -f1` | 提取每行第一个字段（IP 地址） | 只剩 IP 列表 |
| 4 | `sort` | 排序（`uniq -c` 要求相同项相邻） | 排序后的 IP |
| 5 | `uniq -c` | 合并相同行并计数 | IP + 出现次数 |
| 6 | `sort -rn` | 按数字降序排列 | 按频率从高到低 |
| 7 | `head -10` | 取前十行 | Top 10 |

每一步的输出直接成为下一步的输入，像工厂流水线一样将原始数据逐步精炼为答案。

::: important 1964 年的一页备忘录：管道的诞生
"管道"这个概念出自 Doug McIlroy 在 1964 年写的一份内部备忘录。当时的背景是：Bell Labs 的研究人员正在开发 Multics 操作系统（Unix 的前辈），McIlroy 对已有的"将程序输出保存为文件再传给下一个程序"的笨重方式感到不满。

他在备忘录中写道：

> "We should have some ways of connecting programs like garden hose — screw in another segment when it becomes necessary to massage data in another way."

翻译过来："我们应该有某种连接程序的方法，就像连接花园里的水管一样——当需要用另一种方式处理数据时，拧上另一截水管就行了。"

这份备忘录在 Bell Labs 内部流传多年，影响了 Ken Thompson 和 Dennis Ritchie。1973 年，Thompson 在 Unix 第三版中实现了管道。Pipe 这个名字直译就是"水管"——McIlroy 的比喻被一字不差地变成了技术术语。

管道不是某个产品需求文档的产物，而是一个研究者在 60 年前对"程序之间如何协作"这一问题的优雅解答。今天你每输入一次 `|`，都是在复现半个多世纪前一个工程师在纸上画的设计草图。
:::

## 三、输出重定向：`>` 与 `>>`

管道把 stdout 传给另一个程序。重定向把 stdout 写入文件。

### 3.1 `>` ：覆盖写入

```bash
# 将命令的输出写入文件（文件不存在则创建，存在则覆盖）
echo "Hello, World!" > greeting.txt

# 将目录列表保存到文件
ls -l > file_list.txt

# 创建空文件（利用重定向的副作用）
> empty.txt
```

`>` 的行为是"先清空文件，再写入新内容"。如果目标文件已有数据，旧数据全部消失。

::: warning `>` 是沉默且不可逆的
当使用 `>` 重定向到一个已存在的文件时，Shell 不会弹出任何确认对话框。文件原有内容被立即清空，不会经过回收站。没有 `undo` 命令可以撤销。

```bash
# 假设 important_data.txt 里有你一周的工作成果
echo "oops" > important_data.txt
# important_data.txt 原来的内容消失了，只剩 "oops"
```

如果你不确定目标文件是否可以覆盖，有两种保护方式：

1. **先用 `cat` 确认文件内容**，再决定是否覆盖
2. **使用 `set -o noclobber`**（bash/zsh 均支持），开启后 Shell 会拒绝对已存在文件使用 `>`；需要强制覆盖时用 `>|` 代替。建议在服务器环境中将此设置写入你的 `.bashrc`
:::

### 3.2 `>>` ：追加写入

```bash
# 追加内容到文件末尾（文件不存在则创建）
echo "第二行内容" >> greeting.txt

# 持续记录日志
echo "$(date): 备份完成" >> backup.log
```

`>` 和 `>>` 的区别只在于打开文件后的初始位置：`>` 从文件开头写入（截断旧内容），`>>` 从文件末尾写入（保留旧内容）。这二者的选择决定了旧数据是被丢弃还是被保留。

## 四、输入重定向：`<`

### 4.1 从文件读取 stdin

`<` 把文件内容作为命令的 stdin：

```bash
# 排序 names.txt 的内容（文件内容进入 sort 的 stdin）
sort < names.txt

# 与 sort names.txt 结果相同，但机制不同
```

这两种写法的区别：

- `sort names.txt`：`sort` 自己打开文件并读取
- `sort < names.txt`：Shell 打开文件，将文件内容送入 `sort` 的 stdin

对于 `sort`，两种写法结果一样。但对于某些只读 stdin、不接受文件参数的命令，`<` 是唯一选项。

### 4.2 Here Document：脚本中的多行输入

Here Document 让你在脚本中嵌入多行文本，直接传给命令的 stdin：

```bash
cat << EOF
这是第一行
这是第二行
这是第三行
EOF
```

`<< EOF` 的意思是：从下一行开始读取，直到遇到单独一行的 `EOF` 为止，把中间的所有内容作为 stdin 传给命令。`EOF` 是惯例标记（End Of File 的缩写），你可以用任何不出现在文本中的词代替。

一个实际的脚本场景：

```bash
# 通过命令行创建配置文件，不依赖编辑器
cat << 'EOF' > ~/.myapp/config.yml
server:
  port: 3000
  host: 0.0.0.0
database:
  url: postgresql://localhost:5432/myapp
EOF
```

`'EOF'`（加引号）告诉 Shell 不展开内容中的变量和特殊字符——这在配置文件中通常是需要的。

## 五、/dev/null：数据的黑洞

### 5.1 它是什么

`/dev/null` 是 Unix/Linux 系统中的一个特殊文件。它的行为很简单：

- **写入**：所有数据被丢弃，写入总是成功，但不存储任何东西
- **读取**：立即返回 EOF（文件结束标记），仿佛文件是空的

::: note /dev/null 的名字是故意的
`null` 在拉丁语中意为"无"或"零"，在编程中表示"不存在"。`/dev/null` 的字面意思就是"通向虚无的设备"。

这个名字不是工程术语中的巧合——它是有意选择的带有黑色幽默色彩的名称。Unix 的创造者们把一个通向虚无的数据通道命名为"虚无设备"，这个笑话已经运行了五十多年，每次有人输入 `/dev/null` 都在为这个梗续命一秒钟。
:::

### 5.2 实际用途

最常见的用途是抑制不需要的输出：

```bash
# 丢弃 stdout（把正常输出扔进黑洞）
command > /dev/null

# 丢弃 stderr（把错误信息扔进黑洞）
command 2> /dev/null

# stdout 和 stderr 全部丢弃
command > /dev/null 2>&1
```

场景：你写了一个脚本，每 5 分钟自动检查网站是否在线。你关心的是脚本的退出码（成功或失败），不需要看到输出。

```bash
# 在 crontab 定时任务中常见这种写法
curl -s https://example.com > /dev/null 2>&1
```

### 5.3 `2>&1` 的顺序陷阱

这条写法有一个隐藏的坑，让无数有经验的程序员也踩过。

```bash
# 正确：stdout 和 stderr 都进入 /dev/null
command > /dev/null 2>&1

# 错误：stderr 仍然打印在屏幕上
command 2>&1 > /dev/null
```

::: warning 顺序为什么重要
Shell 从左到右处理重定向。逐句解读：

**正确的版本** `command > /dev/null 2>&1`

1. `> /dev/null`：把 stdout（文件描述符 1）指向 `/dev/null`
2. `2>&1`：把 stderr（文件描述符 2）指向"stdout 当前的目标"——也就是 `/dev/null`

两个流都进入了黑洞。

**错误的版本** `command 2>&1 > /dev/null`

1. `2>&1`：把 stderr 指向"stdout 当前的目标"——此时 stdout 还指向终端屏幕
2. `> /dev/null`：把 stdout 指向 `/dev/null`

结果：stdout 进入黑洞，但 stderr 在第一步已经被固定指向终端，后续 stdout 的变更不影响 stderr。`2>&1` 复制的是重定向那一瞬间 stdout 的目标，不是建立一个"跟随 stdout"的动态链接。

这个陷阱的教训是：**先确定主目标，再让其他流跟随。** `> /dev/null 2>&1` 记住这个固定顺序就能避开坑。
:::

## 六、xargs：当管道不够用

### 6.1 管道传输的是什么

管道传输 stdin——一连串的文本数据。但很多命令不接受 stdin 作为操作目标：

```bash
# 这些命令期望的是命令行参数，不是 stdin
rm file1.txt file2.txt       # 参数
mkdir new_folder              # 参数
mv source.txt dest.txt        # 参数
```

这导致一个常见困境：

```bash
# 你想删除找到的所有 .tmp 文件，这样写是行不通的
find . -name "*.tmp" | rm
# rm 需要文件名作为参数，不是 stdin 的一堆文字。这条命令什么都不会删除。
```

### 6.2 xargs 的连接作用

`xargs` 负责将 stdin 转换为命令行参数：

```bash
# 正确做法：xargs 将 stdin 的每一行变成 rm 的参数
find . -name "*.tmp" | xargs rm
```

xargs 读取 stdin，将每一行（或每一段）作为参数拼接到它后面的命令上，然后执行。上面的命令等价于：

```bash
rm ./a.tmp ./subdir/b.tmp ./build/c.tmp ...
```

### 6.3 处理文件名中的空格

如果文件名包含空格，默认的 xargs 行为会出问题——它将空格视为参数分隔符。解决办法是配合 `find -print0` 和 `xargs -0`：

```bash
# -print0 用空字符（\0）分隔文件名，-0 告诉 xargs 按空字符解析
find . -name "*.tmp" -print0 | xargs -0 rm
```

### 6.4 精确放置参数位置：`-I {}`

有些命令需要参数出现在特定位置，不是末尾：

```bash
# 将所有 .jpg 文件复制到 backup 目录，保留原名
find . -name "*.jpg" | xargs -I {} cp {} ./backup/
```

`-I {}` 的含义：把 stdin 的每一行放到 `{}` 所在的位置，然后执行命令。`{}` 可以出现在命令中的任意位置，可以出现多次。

## 七、Rust 重写运动：搜索与监控工具

::: tip 下一代工具推荐
第 3 章介绍了 Rust 重写运动中的文件操作工具（`eza`、`bat`、`fd`、`zoxide`）。本章的管道和重定向领域同样有一批优秀的现代替代品：

- **`ripgrep`（`rg`）** 替代 `grep`：默认递归搜索，自动遵循 `.gitignore` 规则（跳过 `node_modules`、`target` 等生成目录），5 到 10 倍于 grep 的速度，彩色高亮输出。搜索一个百万行代码的项目，rg 在毫秒级完成，grep 可能需要数秒。安装：`brew install ripgrep`（macOS）、`apt install ripgrep`（Linux）、`scoop install ripgrep`（Windows）。
- **`dust`** 替代 `du`：用树状图和直观的颜色标注磁盘占用。不需要记忆 `du` 那些繁琐的参数组合，`dust` 默认就是人类可读的层级图，一眼看出哪个目录吃了最多的磁盘空间。
- **`bottom`（`btm`）** 替代 `top`：GPU 加速的系统监控界面，带实时图表——CPU 使用曲线、内存消耗趋势、磁盘 I/O 波形。比 top 的信息密度高出几个量级，且不依赖终端颜色表，所有外观都是内置渲染的。

这些工具共享同一设计哲学：更聪明的默认值，更直观的输出，更现代的代码基础。先用原版理解原理，再切换到这些替代品——你可以亲自感受"默认值的精心设计"对日常效率的提升有多大。
:::

## 八、实战案例

以下案例将本章学到的概念组合应用。不必一次全部理解，可以把这一节当作"参考食谱"——遇到对应场景时回来翻阅。

### 8.1 找出目录中最大的 10 个文件

```bash
du -h | sort -h | tail -10
```

`du -h` 用人类可读格式（K/M/G）列出当前目录下所有子目录的大小，`sort -h`（human numeric sort）按人类可读的数字排序（知道 1G > 500M），`tail -10` 取最大 10 个。

### 8.2 统计代码行数

```bash
find . -name "*.js" | xargs cat | wc -l
```

或使用 ripgrep（自动忽略 .gitignore 目录，用 `\.js$` 确保匹配文件后缀）：

```bash
rg --files | rg '\.js$' | xargs cat | wc -l
```

### 8.3 实时监控日志中的错误

```bash
tail -f app.log | grep --color "ERROR"
```

`tail -f` 持续追踪文件末尾的新增行，管道将新增行实时交给 `grep` 筛选，`--color` 高亮匹配的关键词。`Ctrl + C` 停止监控。适合一边调试程序一边关注错误输出。

### 8.4 按进程名批量终止进程

```bash
ps aux | grep "node" | grep -v grep | awk '{print $2}' | xargs kill
```

逐节解读：

- `ps aux`：列出所有进程的详细信息
- `grep "node"`：筛选出进程名或命令行参数包含 "node" 的行
- `grep -v grep`：排除掉 `grep "node"` 命令本身（它也会出现在进程列表里）
- `awk '{print $2}'`：提取第二列——进程 ID（PID）
- `xargs kill`：将 PID 列表传给 `kill` 命令逐一终止

::: warning 慎用批量 kill
`grep "node"` 会匹配到任何包含 "node" 字符串的进程，不只是你本意想杀的那个。在执行 `xargs kill` 之前，建议先去掉最后一段（`| xargs kill`），用前半段命令确认你要杀的是哪些进程。确认无误后，再加上 `| xargs kill`。
:::

### 8.5 分析访问日志中 Top N 访问者

```bash
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -20
```

获取访问日志中最活跃的 20 个 IP 地址。换一个日志格式，调整 `awk` 的字段索引即可复用。

## 九、本章小结

这一章你学到了命令行的核心设计模式——管道的威力不在于单个命令，而在于命令之间的组合方式。

1. **三个标准流**（stdin/stdout/stderr）是操作系统为每个程序自动建立的输入输出通道，文件描述符 0、1、2 分别对应三者
2. **管道（`|`）** 将前一个命令的 stdout 连接为后一个命令的 stdin，让数据在命令之间流动——Doug McIlroy 在 1964 年用"花园水管"的比喻画出了这个设计
3. **输出重定向（`>` 与 `>>`）** 将数据写入文件而非屏幕，设计哲学是信任用户不搞确认弹窗——后果自负
4. **输入重定向（`<` 与 Here Document）** 让文件内容或内嵌文本成为命令的 stdin
5. **`/dev/null`** 是数据的终极目的地——用于安静地丢弃不需要的输出，`2>&1` 的顺序规则值得特别记住
6. **`xargs`** 填补了管道和命令行参数之间的空缺——当命令不接受 stdin 作为操作目标时，xargs 负责中转
7. **现代工具**（ripgrep、dust、bottom）继承原版精神但提供更优的默认体验——先用原版理解原理，再用现代版提升效率

::: important 动手练习
完成以下任务来巩固本章知识：

1. **体验管道**
   ```bash
   # 列出当前目录下所有 .md 文件，按大小排序
   ls -l *.md 2>/dev/null | sort -k5 -n
   ```

2. **使用输出重定向保存结果**
   ```bash
   # 将当前目录的文件列表保存到 my_files.txt
   ls -l > my_files.txt
   cat my_files.txt
   ```

3. **使用追加重定向记录日志**
   ```bash
   # 模拟执行三次任务，每次记录时间
   echo "$(date): 任务执行完成" >> task.log
   echo "$(date): 任务执行完成" >> task.log
   cat task.log
   ```

4. **体验沉默的覆盖**
   ```bash
   echo "重要内容" > important.txt
   echo "覆盖了" > important.txt
   cat important.txt   # 只剩 "覆盖了"
   ```

5. **用管道链分析文本**
   ```bash
   # 创建一个测试文件，统计词频
   echo -e "apple\nbanana\napple\ncherry\nbanana\napple" > fruits.txt
   cat fruits.txt | sort | uniq -c | sort -rn
   ```

6. **使用 grep 和管道过滤进程**
   ```bash
   ps aux | grep bash
   # 观察输出中包含了 grep bash 进程本身
   ps aux | grep bash | grep -v grep
   # 这次只显示真正的 bash 进程
   ```

7. **将 stdout 和 stderr 合并到同一文件**
   ```bash
   # 正常输出和错误信息都进入 found.txt
   ls *.txt *.nonexist > found.txt 2>&1
   # 注意观察 found.txt 中同时包含了正常输出和错误信息
   ```

8. **使用 xargs 批量操作**
   ```bash
   # 创建几个测试文件，然后批量删除
   touch a.tmp b.tmp c.tmp
   find . -name "*.tmp" | xargs rm
   ls *.tmp 2>/dev/null   # 应该显示 "No such file or directory"
   ```

9. **清理实验文件**
   ```bash
   rm -f my_files.txt task.log important.txt fruits.txt found.txt
   ```
:::

---

在下一章，我们将学习环境变量和 Shell 配置——让你的命令行环境按照你的习惯工作，而不是反过来。
