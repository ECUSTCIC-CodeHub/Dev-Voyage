---
title: '第 2 章：安装与配置——5 分钟搞定 Git'
createTime: 2025/12/25 10:05:00
permalink: /essential/git-usage/2-install-config/
---

# 第 2 章：安装与配置——5 分钟搞定 Git

你想开始用 Git，但面对 Windows/macOS/Linux 三套系统，不知道从哪里入手。本章 5 分钟带你搞定安装和基础配置。

::: tip 本章目标
在你的电脑上安装 Git，配置好你的身份信息。
:::

## 一、安装 Git

### 1.1 Windows

1. 访问 [Git 官网下载页面](https://git-scm.com/download/win)。
2. 下载 **"64-bit Git for Windows Setup"**。
3. 安装过程大部分一路 **Next** 即可，但有一个选项值得关注：
   - 在选择编辑器时，如果你装了 VS Code，选择 **"Use Visual Studio Code as Git's default editor"**。这样 Git 的默认编辑器就和你的主力编辑器统一了，比如 `git commit` 写提交信息时会自动打开 VS Code。

   安装完成后，在桌面或任意文件夹右键，如果菜单中出现了 **"Git Bash Here"**，说明安装成功！

### 1.2 macOS

1. 打开终端（Terminal），输入 `git --version`。
2. 如果未安装，系统通常会弹窗提示安装 **Xcode Command Line Tools**，点击安装即可。
3. 或者用 Homebrew 一步到位：`brew install git`。

### 1.3 Linux（Ubuntu / Debian）

```bash
sudo apt update
sudo apt install git
```

其他发行版使用对应包管理器即可，比如 Fedora 用 `dnf`，Arch 用 `pacman`。

## 二、第一次配置：自报家门

安装好 Git 后，第一件事就是告诉 Git **你是谁**。Git 的每一次提交都会记录作者信息，就像考试卷子上必须写名字一样。

打开终端（Windows 用户右键选择 **"Git Bash Here"**），输入以下命令：

```bash
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"
```

- `--global` 表示全局配置，这台电脑上所有 Git 仓库都默认使用这个身份。
- 把 `"Your Name"` 和 `"your_email@example.com"` 替换成你自己的信息，**保留双引号**。
- 名字建议用英文名或拼音；邮箱建议用真实邮箱，GitHub 会通过邮箱关联你的提交记录和账号头像。

::: info 冷知识：Commit ID 为什么包含作者信息？
Git 的每一次提交（Commit）都会生成一个唯一的 SHA-1 哈希值作为标识。这个 ID 不是随机生成的，它由以下内容计算得出：

1. 代码快照的内容
2. 提交时间戳
3. **你的名字和邮箱**
4. 父提交的 ID（即上一次提交是谁）

这意味着，**如果你改了邮箱，哪怕代码一个字都没动，生成的 Commit ID 也会完全不同。** 这是 Git 保证历史严谨性的核心设计——在 Git 的世界里，身份信息是历史的一部分，不可篡改。你的每一次提交，都和你这个人绑定在一起。

这也解释了为什么 `git rebase` 会改变 Commit ID：不是因为代码变了，而是因为重排后的"父提交"变了，导致重新计算哈希值。
:::

::: tip 扩展：SHA-1 到 SHA-256 的迁移
从 Git 2.29 开始，Git 正式支持了 SHA-256 哈希算法来替代 SHA-1。背景是 SHA-1 已被证明存在碰撞攻击的可能——Google 和荷兰 CWI 研究所在 2017 年成功构造了世界上第一个 SHA-1 碰撞。

虽然对 Git 来说，利用 SHA-1 碰撞伪造恶意提交在现实中难度极高，但长远来看迁移到 SHA-256 是必要的安全升级。目前这个迁移还在推进中，绝大多数仓库仍使用 SHA-1，你暂时不需要操心这件事——知道它在发生就够了。
:::

### 验证配置

输入以下命令查看当前配置是否生效：

```bash
git config --list
```

在输出中看到 `user.name` 和 `user.email`，就说明配置成功了。

## 三、推荐工具

Git 的命令行是核心，但配合图形化工具能让操作更直观：

- **VS Code（强烈推荐）**：内置了强大的 Git 支持，可以直接在编辑器里查看变更、暂存、提交、解决冲突。后续教程也会结合 VS Code 来演示。
- **Git Bash（Windows）**：模拟了 Linux 的命令行环境，比 Windows 自带的 CMD 或 PowerShell 更适合 Git 操作。你也可以在 VS Code 里把终端默认设为 Git Bash，一举两得。

## 四、常见问题

**"我配好了，为什么 `git push` 还要输密码？"**

这是一个经典的新手困惑。`user.name` 和 `user.email` 只告诉 Git "这次提交是谁写的"，相当于你在试卷上签名。但你能不能把试卷交到老师手里（推送到远程仓库），那是另一回事——身份验证通过 Token 或 SSH 密钥完成。这两个话题会在后续章节详细讲解。这里先记住：配置身份（本章）和配置认证（后续章节）是两件不同的事。

::: tip 准备好了吗？
下一章，我们将创建你的第一个 Git 仓库，开始真正的实操。
:::
