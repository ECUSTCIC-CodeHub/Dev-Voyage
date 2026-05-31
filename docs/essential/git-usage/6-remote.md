---
title: '第 6 章：社交编程Git 与 GitHub'
createTime: 2025/12/25 10:25:00
permalink: /essential/git-usage/6-remote/
---

# 第 6 章：社交编程Git 与 GitHub

::: tip 本章目标
学会将本地代码推送到云端（GitHub），并了解如何下载别人的代码。
:::

## 一、  问题引入

你已经在本地把代码管理得井井有条了——提交、分支、合并，一切都行云流水。

但你仔细想想：这些代码全在你一个人的电脑上。硬盘坏了怎么办？想和朋友一起写个项目，总不能把文件打包发 QQ 吧？你需要一个地方——一个既能备份代码、又能和别人协作的地方。

这就是 GitHub 要解决的问题。

## 二、  Git vs GitHub

很多新手分不清这两个，一句话讲清楚：**Git 是工具，GitHub 是平台。**

- **Git**：一个版本控制工具（好比 Photoshop）。它运行在你电脑上，负责记录每一次提交、管理每一个分支。
- **GitHub**：一个托管 Git 仓库的网站（好比 Instagram）。你把用 Git 管理好的代码传上去，别人就能看到、下载、甚至帮你一起改。

你用 Git（工具）处理代码，然后传到 GitHub（平台）上展示和备份。没有 Git，GitHub 就是个空壳；没有 GitHub，Git 也能用，只不过你得多费点劲自己搭服务器。

::: info Octocat——GitHub 的吉祥物
GitHub 的 Logo 是一只叫 **Octocat**（章鱼猫）的奇怪生物：猫头猫身，但长了五条章鱼腿。它的设计者是设计师 Simon Oxley，GitHub 团队在 iStock 上花几十美元买下了这张图，稍作修改后就成了今天的经典形象。

Octocat 已经有上百种变体，穿宇航服的、拿光剑的、扮成马里奥的……GitHub 官方的 [Octodex](https://octodex.github.com/) 收录了这些创作，全部开源，随意使用。
:::

::: info 商业传奇：GitHub 的崛起
2008 年，三个年轻人——Tom Preston-Werner、Chris Wanstrath 和 PJ Hyett——觉得 Git 虽然强大，但在线协作的门槛太高了。他们在一个周末写出了 GitHub 的原型。

他们的关键发明是 **Pull Request（PR）**。在此之前，给开源项目贡献代码的流程极其痛苦：你得把改动做成补丁文件，发邮件给维护者，维护者手动审查、手动合并。PR 把这个流程变成了"点一下按钮"——任何人都可以 Fork（复制）一份代码，改完后发起 Pull Request，原作者一键审查、一键合并。

这彻底改变了开源世界。如今，GitHub 被微软以 75 亿美元收购，拥有超过 1 亿注册开发者，是全球最大的代码托管平台。

顺便说一句，"Fork me on GitHub"那个经典缎带按钮，曾经是 GitHub 早期最出圈的广告——几乎所有热门开源项目的主页上都挂着它。
:::

## 三、  推送代码（Push）

假设你已经在 GitHub 上注册了账号。接下来的目标：把本地项目推到 GitHub。

::: warning 经典格言
程序员圈有一条流传已久的铁律：**"Don't push to production on Friday."**

为什么？因为周五下午推代码，一旦出事，要么加班修到深夜，要么带着 Bug 过周末。`git push` 之前请三思，尤其是周五。
:::

### 3.1 创建远程仓库

1. 登录 GitHub，点击右上角的 `+` → `New repository`。
2. 起个名字，比如 `my-first-repo`。
3. 点击 `Create repository`。

### 3.2 关联远程仓库

GitHub 会给你一串命令，找到 **"or push an existing repository from the command line"** 那一栏。

在你的本地项目终端里输入：

```bash
# 添加远程仓库地址（origin 是给远程仓库起的别名）
git remote add origin https://github.com/你的用户名/my-first-repo.git

# 把本地的 main 分支推送到 origin 的 main 分支
git push -u origin main
```

- **`git remote add`**：给 GitHub 仓库地址起个别名叫 `origin`。`origin` 只是惯例，你愿意叫 `xiaoming` 也行（别）。一个本地仓库可以关联多个远程仓库，比如同时推到 GitHub 和 Gitee。
- **`git push -u origin main`**：把本地 `main` 分支推送到 `origin` 对应的远程仓库。`-u`（`--set-upstream`）的作用是记住这个对应关系，以后在这个分支上只需要敲 `git push` 就够了。
- 第一次推送可能需要认证——GitHub 现在推荐用 **Personal Access Token** 或浏览器 OAuth 授权，不再支持纯密码。

刷新 GitHub 页面，你的代码已经在上面了。

### 3.3 后续推送

有了 `-u` 的绑定，后续推送简单到极致：

```bash
git add .
git commit -m "feat: 新功能"
git push
```

三步走，代码就上云端了。

::: info 趣闻：node_modules 惨案
曾经有新手把整个 `node_modules` 目录（可能几百 MB、几万个文件）推到了 GitHub 仓库。消息传开后，评论区一片"兄弟你认真的吗"。

这就是 `.gitignore` 文件的用武之地——告诉 Git 哪些文件不用管。创建项目时，第一件事就是写好 `.gitignore`，把 `node_modules/`、`dist/`、`.env` 等不需要版本控制的内容列进去。GitHub 甚至提供了各语言的 `.gitignore` 模板，`git init` 之后直接去 GitHub 搜 "gitignore node" 复制粘贴就行。
:::

## 四、  克隆代码（Clone）

你想下载别人的开源项目（比如 Vue.js），或者换了台电脑想拉取自己的代码。

### 4.1 基本用法

1. 在 GitHub 项目页面点击绿色的 `Code` 按钮，复制 URL。
2. 在终端输入：

```bash
git clone https://github.com/vuejs/core.git
```

Git 会自动把整个项目下载到当前目录，**自带完整的提交历史**——也就是说你 clone 下来的不仅仅是一堆代码文件，还包括这个项目从创建到现在的每一次 commit 记录。你可以直接 `git log` 看它的历史。

### 4.2 Clone 和下载 ZIP 的区别

GitHub 页面上也提供了 "Download ZIP" 按钮，但那只是下载当前版本的代码快照——没有 `.git` 目录，没有历史，无法和远程仓库同步。Clone 才是正确的打开方式。

::: tip 小技巧：浅克隆
如果一个项目历史很长（比如 Linux 内核，几十万个 commit），完整 clone 会非常慢。你可以用浅克隆只拉最近几次提交：

```bash
git clone --depth 1 https://github.com/torvalds/linux.git
```

`--depth 1` 表示只拉取最近 1 次提交记录，下载速度飞快。之后需要完整历史时再 `git fetch --unshallow`。
:::

## 五、  拉取更新（Pull）

你和队友一起开发，队友推送了新代码到 GitHub，你需要把它同步到本地。

```bash
git pull
```

`git pull` 实际上是两个操作的组合：`git fetch`（下载远程更新）+ `git merge`（合并到当前分支）。大多数时候直接用 `git pull` 就够了。

::: warning 常见坑：Pull 前先 Commit
如果你本地有未提交的修改，直接 `git pull` 可能会冲突。Git 会提示你先 commit 或 stash（暂存）。养成好习惯：**pull 之前，先 commit（或 stash）本地改动。**
:::

::: tip 开源项目的正确姿势：Fork + PR
如果你想去给开源项目贡献代码，直接 `git push` 是行不通的——你不是项目的成员，没有写入权限。

正确的流程是：
1. 在 GitHub 上 **Fork** 那个项目（相当于把别人的仓库复制一份到你自己的账号下）
2. `git clone` 你自己 Fork 后的仓库
3. 新建分支，写代码，`git push` 到你自己的仓库
4. 在 GitHub 上发起 **Pull Request**，等待原作者审核合并

这整个流程就是 GitHub 为开源协作设计的标准模式。提交 PR 之后，记得保持礼貌，耐心等待。如果原作者迟迟不回复……**"给 ⭐ 了吗？"** ——先 Star 一下人家的项目，表达你的认可，这是开源社区的基本礼仪。
:::

## 六、  完整工作流回顾

恭喜你！从第 1 章到现在，你已经学完了 Git 的核心操作。让我们把整个日常工作流串联起来，看一个项目从零到云端的完整过程：

### 从零开始一个项目

```bash
# 第 2 章：初始化仓库，开始追踪代码
git init
git add .
git commit -m "chore: 初始化项目"

# 第 3 章：查看状态和历史——随时了解项目发生了什么
git status
git log --oneline
```

### 日常开发

```bash
# 第 2 章：修改代码后存档
git add .
git commit -m "feat: 添加登录功能"

# 第 3 章：看看刚才提交了什么
git log -1
```

### 开发新功能（分支协作）

```bash
# 第 4 章：开一个独立分支，不影响主分支
git branch feat-login
git switch feat-login

# 写了代码，存档
git add .
git commit -m "feat: 实现登录接口"

# 切回主分支，把功能合并进来
git switch main
git merge feat-login

# 功能完成，删除用完的分支
git branch -d feat-login
```

### 同步到云端

```bash
# 第 6 章：关联 GitHub，推送到远程
git remote add origin https://github.com/用户名/项目名.git
git push -u origin main

# 队友推送了新代码？拉下来
git pull
```

### 一张图记住全部

| 场景 | 命令 | 章节 |
|------|------|------|
| 初始化仓库 | `git init` | 第 2 章 |
| 添加到暂存区 | `git add` | 第 2 章 |
| 提交到本地仓库 | `git commit` | 第 2 章 |
| 查看状态 | `git status` | 第 3 章 |
| 查看历史 | `git log` | 第 3 章 |
| 创建分支 | `git branch` | 第 4 章 |
| 切换分支 | `git switch` | 第 5 章 |
| 合并分支 | `git merge` | 第 5 章 |
| 关联远程仓库 | `git remote add` | 第 6 章 |
| 推送到云端 | `git push` | 第 6 章 |
| 克隆项目 | `git clone` | 第 6 章 |
| 拉取更新 | `git pull` | 第 6 章 |

你用这 12 条命令，已经可以覆盖日常开发 95% 的 Git 使用场景。从今天起，你不是那个只会复制粘贴备份的小白了——你掌握了一套完整的工作流：**本地存档（commit）→ 分支协作（branch）→ 云端同步（push/pull）**。

去 GitHub 上探索广阔的开源世界吧。记得先 Star 你喜欢的项目，Fork 一份代码，说不定你的第一个 PR 就在今天。
