---
title: '第 4 章：时光穿梭——查看历史与回滚'
createTime: 2025/12/25 10:15:00
permalink: /essential/git-usage/4-time-travel/
---

# 第 4 章：时光穿梭——查看历史与回滚

::: tip 本章目标
学会查看 Git 的提交历史，在需要时回到过去的版本——无论是临时看看，还是彻底回退。
:::

## 一、问题场景

你昨天提交了一次代码，今天发现那段代码有 bug。你想回到昨天的版本看看当时到底写了什么，甚至直接回退到那个版本，假装今天的烂代码从未存在过。

Git 的版本管理本质上是一台时光机——每一次 `git commit` 都是一张快照，你需要做的只是学会翻阅这本相册，然后决定要不要回到其中某一页。

## 二、翻阅相册：git log

想知道自己走过哪些路，先看日记本。

```bash
git log
```

输出类似：

```
commit ca82a6dff817ec66f44342007202690a93763949 (HEAD -> main)
Author: Your Name <your_email@example.com>
Date:   Wed Dec 25 10:00:00 2025 +0800

    第一次提交：创建了 README 文件
```

各字段的含义：

- **commit ID**：那一长串十六进制字符（`ca82a6...`），是这次提交的全球唯一标识，由 SHA-1 哈希算法根据文件内容和元数据计算得出。你只需要用它前几位就能在本地仓库里唯一定位一次提交。
- **Author**：谁提交的。
- **Date**：什么时候提交的。
- **Message**：提交时写了什么说明。

::: tip 一行模式
如果 `git log` 的输出太长，加上 `--oneline` 参数，每条提交只占一行：

```bash
git log --oneline
```

效果：
```
ca82a6d 第一次提交：创建了 README 文件
b3e4f12 添加了用户登录功能
7a8d9c0 修复了首页样式问题
```

配合 `--graph` 还能看到分支拓扑图，不过那是后话了。
:::

::: info HEAD 名字的来历
在 Git 的输出里，你经常会看到 `HEAD` 这个词。它就是一个**指针**，指向当前你正在工作的版本。

这个名字来源于早期的**磁带机**（Tape Drive）。磁带机有一个"读取/写入头"（Read/Write Head），读头指到哪里，数据就从哪里开始。Git 借用了这个概念：当你切换版本时，Git 把 `HEAD` 这个指针移动到目标版本上，你的工作目录瞬间就变成了那个版本的样子。

在 Git 内部，`HEAD` 通常指向一个分支引用（比如 `refs/heads/main`），而分支引用又指向某个具体的 commit。所以 `HEAD` 是"指针的指针"——它告诉你：你现在在哪，归属于哪个分支。
:::

## 三、只是看看：git checkout

回到开头的问题——你想看看昨天的版本长什么样，但还不确定要不要真的回退。这时候 `git checkout` 就是最安全的选择。

```bash
git checkout <Commit ID>
```

执行后，Git 把工作目录切换到那个历史版本的状态。终端会提示：

```
You are in 'detached HEAD' state.
```

别慌，**Detached HEAD（分离头指针）** 不是报错，只是说明 `HEAD` 现在直接指向了一个具体的 commit，不再跟在某个分支后面。换句话说：你正站在一个历史节点上"观光"，不属于任何分支。

在这个状态下，你可以翻看文件、复制代码、运行测试——做什么都行。看完之后，回到最新的正常状态：

```bash
git checkout main
# 或者 master，取决于你的主分支叫什么
```

`HEAD` 重新挂回 `main` 分支，一切恢复原样。

::: tip 经典段子：rm -rf 之后
程序员社区流传着一个经典故事：某开发者不小心在项目根目录执行了 `rm -rf *`，所有文件瞬间蒸发，回收站里也找不到。绝望之际，他突然想起自己用的是 Git——

```bash
git checkout .
```

所有文件完好无损地回来了。因为 `git checkout .` 会用仓库中最新提交的内容覆盖工作区，相当于把被删的文件从 Git 数据库里"捞"了出来。

这个故事告诉我们两件事：
1. 频繁提交是个好习惯。
2. Git 的所有历史都安全地存在 `.git` 目录里。`rm -rf *` 删的只是工作区，仓库本身没事——只要 `.git` 还在，天就塌不下来。
:::

## 四、真回退：git reset --hard

如果 `git checkout` 是翻相册，那 `git reset --hard` 就是**撕掉不想要的页**——让项目彻底回到某个历史状态，之后的所有提交和修改全部丢弃。

::: caution 危险操作
`git reset --hard` 是不可逆的——至少表面上看起来是。请在清醒状态下使用这条命令，不要在凌晨三点困得睁不开眼的时候执行。不过也不用太害怕，Git 有一个叫 `reflog` 的"黑匣子"可以兜底（见下一节）。
:::

### 4.1 基本用法

```bash
git reset --hard <Commit ID>
```

这句话的效果：**把 HEAD 和当前分支指针都移动到目标 commit，同时把工作区和暂存区的内容全部替换成那个版本的样子。** 之后的所有提交，在 `git log` 里就看不到了——仿佛从未存在过。

### 4.2 实战演示

假设你做了一次令人后悔的提交：

1. 修改 `README.md`，加了一行 "我写的代码像一坨意大利面"。
2. 提交：`git add . && git commit -m "添加了不太优雅的代码"`。
3. 后悔了。先看日志，找到上一次正常提交的 ID：

   ```bash
   git log --oneline
   # ca82a6d 第一次提交：创建了 README 文件
   # 7d3e9f1 添加了不太优雅的代码  ← 就是这个，想删掉
   ```

4. 回退到上一次正常提交：

   ```bash
   git reset --hard ca82a6d
   ```

5. 打开 `README.md`，意大利面没了。再跑 `git log --oneline`，那条糟糕的提交也消失了。

::: warning 注意
`--hard` 会同时清空工作区和暂存区中所有**未提交**的修改。如果你有还没 `commit` 的改动，执行 `git reset --hard` 后它们就永久丢失了（reflog 也救不了未提交的内容）。
:::

## 五、后悔药：git reflog

万一 `git reset --hard` 之后你又后悔了——回退之后才发现，那个版本里有一段你后来需要用的代码——怎么办？

答案是 **`git reflog`**。很多人第一次用它都是在 `reset --hard` 之后手心冒汗的时候，然后发出那句经典感叹——**"git reflog 救我一命"**。

### 5.1 什么是 reflog

`reflog`（Reference Log，引用日志）是 Git 的"黑匣子"。它记录了**所有 HEAD 移动的历史**——每一次 `commit`、`checkout`、`reset`、`merge`、`rebase`，都会被记在 reflog 里。

Git 默认保留 **90 天**的 reflog 记录（对于不可达的提交是 30 天，可通过 `gc.reflogExpire` 配置调整）。只要在有效期内，你就能通过 reflog 找回"丢失"的 commit ID。

```bash
git reflog
```

输出类似：

```
ca82a6d HEAD@{0}: reset: moving to ca82a6d
7d3e9f1 HEAD@{1}: commit: 添加了不太优雅的代码
ca82a6d HEAD@{2}: commit (initial): 第一次提交：创建了 README 文件
```

每一条记录有一个 `HEAD@{n}` 编号，n 越大表示越久远。你既可以用 commit ID，也可以用 `HEAD@{n}` 来引用某次历史状态。

### 5.2 实战救援

假设你刚执行了 `git reset --hard ca82a6d`，回退了那个意大利面提交。随后发现里面有一段代码其实写得还不错。

1. 查看 reflog，找到被回退的那条 commit：

   ```bash
   git reflog
   # 找到：7d3e9f1 HEAD@{1}: commit: 添加了不太优雅的代码
   ```

2. 恢复那个 commit：

   ```bash
   git reset --hard 7d3e9f1
   ```

   这样一来，项目又回到了"意大利面"版本，相当于撤销了你的撤销。

   如果你只想找回其中几个文件，不想整体回退：

   ```bash
   git checkout 7d3e9f1 -- README.md
   ```

   这会把 `README.md` 恢复到那个版本的样子，其他文件不受影响。然后你可以重新提交。

::: tip 查看 reflog 的更多用法
```bash
# 查看某个具体引用的日志（比如 main 分支）
git reflog show main

# 查看最近 5 条记录
git reflog -5

# 按时间过滤（比如查看昨天下午的操作）
git reflog --since="yesterday 12:00" --until="yesterday 18:00"
```
:::

::: caution reflog 也不是万能的
`git reflog` 只能恢复**曾经被 commit 过、且被 HEAD 引用过**的内容。如果你从来没 commit 过的修改被 `--hard` 清掉了，或者 reflog 超过了保留期限被 Git 自动清理了，那就真的找不回来了。

所以：勤提交，多备份。`git stash` 也可以帮你临时保存未提交的修改。
:::

## 六、三种"回到过去"的方式

Git 提供了多种回到历史版本的方法，它们的关键区别在于"有没有改写历史"。

::: important 核心区别
| 命令 | 本质 | 适用场景 |
|------|------|---------|
| **`git checkout <ID>`** | 临时移动 HEAD 到历史版本，不动任何分支指针。看完就回来，历史纹丝不动。 | "我就看看，不买东西" |
| **`git reset --hard <ID>`** | 把当前分支指针强行拖回历史版本，丢弃之后的提交。**改写了历史。** | "后面的提交全是垃圾，我要重新来过" |
| **`git revert <ID>`** | 创建一个**新的提交**来反向抵消某个历史提交的改动。不删除任何历史记录。 | "那次提交有问题，但已经推送了，不能改历史" |
:::

三句话讲清楚：

- **reset** —— 改指针，历史真的变了。适合本地还没推送的提交。
- **checkout** —— 临时看，看完还得回来。最安全，零副作用。
- **revert** —— 反向提交，历史完整保留。适合已经推送到远程、多人协作的场景。

`git revert` 具体怎么用，后面的章节会详细展开。

## 七、总结

- **`git log` / `git log --oneline`**：查看提交历史，找到你想去的时间点。
- **`git checkout <ID>`**：临时切换到历史版本查看，安全无副作用。用 `git checkout main` 回来。
- **`git reset --hard <ID>`**：彻底回退，丢弃之后的提交和修改。危险但有用，请清醒时使用。
- **`git reflog`**：Git 的"后悔药"，记录 90 天内所有 HEAD 移动。`reset --hard` 之后还能通过它救回来。
- **`git revert <ID>`**：用一次新提交来撤销历史提交的效果，适合已推送的代码。

Git 的时光机比你想象的更可靠——它不仅让你回到过去，还让你能从"回到过去"这件事本身再反悔回来。
