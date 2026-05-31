---
title: Git 基础命令使用指南（全到爆炸版）
createTime: 2025-12-20
permalink: /essential/git-usage/999-git-basic-commands/
---

# Git 命令速查手册

> 这不是教程，这是你的 Git 命令速查手册。教程在 1-6 章，这里让你在需要时快速找到命令。

## 常用命令速查表

### 日常三板斧

| 命令 | 说明 | 典型示例 |
| --- | --- | --- |
| `git status` | 查看工作区状态 | `git status -s` |
| `git add` | 将修改加入暂存区 | `git add .` / `git add <file>` |
| `git commit` | 将暂存区提交到本地仓库 | `git commit -m "feat: 登录功能"` |

### 查看历史

| 命令 | 说明 | 典型示例 |
| --- | --- | --- |
| `git log` | 查看完整提交历史 | `git log` |
| `git log --oneline` | 一行一条，精简输出 | `git log --oneline -10` |
| `git log --graph --all` | 图形化展示所有分支 | `git log --oneline --graph --all` |
| `git show` | 查看某次提交的详细信息 | `git show HEAD` / `git show <hash>` |
| `git reflog` | 查看 HEAD 的移动记录（救命命令） | `git reflog` |
| `git blame` | 查看文件每一行的修改者 | `git blame <file>` |

### 回滚操作

| 命令 | 说明 | 典型示例 |
| --- | --- | --- |
| `git reset <file>` | 将文件从暂存区撤回到工作区 | `git reset HEAD <file>` |
| `git checkout -- <file>` | 撤销工作区文件的修改 | `git checkout -- <file>` |
| `git reset <hash>` | 回退到指定版本（保留修改） | `git reset HEAD~1` |
| `git reset --hard <hash>` | 回退到指定版本（丢弃所有修改） | `git reset --hard HEAD~1` |
| `git revert <hash>` | 新建一个"反向"提交来撤销 | `git revert HEAD` |

::: warning reset --hard 不可逆
`git reset --hard` 会丢弃工作区和暂存区的所有修改。执行前请确认 `git status` 是干净的，或者你已经清楚自己在做什么。
:::

### 分支管理

| 命令 | 说明 | 典型示例 |
| --- | --- | --- |
| `git branch` | 列出本地分支 | `git branch -a` |
| `git branch <name>` | 创建新分支 | `git branch feat/login` |
| `git checkout -b <name>` | 创建并切换到新分支 | `git checkout -b feat/login` |
| `git switch -c <name>` | 创建并切换到新分支（新版） | `git switch -c feat/login` |
| `git merge <branch>` | 合并指定分支到当前分支 | `git merge feat/login` |
| `git branch -d <name>` | 删除已合并的分支 | `git branch -d feat/login` |
| `git branch -D <name>` | 强制删除分支（即使未合并） | `git branch -D feat/login` |

### 远程同步

| 命令 | 说明 | 典型示例 |
| --- | --- | --- |
| `git clone <url>` | 克隆远程仓库到本地 | `git clone git@github.com:user/repo.git` |
| `git remote -v` | 查看远程仓库地址 | `git remote -v` |
| `git fetch` | 拉取远程更新但不合并 | `git fetch origin` |
| `git pull` | 拉取远程更新并自动合并 | `git pull origin main` |
| `git push` | 推送本地提交到远程 | `git push origin main` |
| `git push -u origin <branch>` | 推送并设置上游跟踪分支 | `git push -u origin feat/login` |

### 储藏与清理

| 命令 | 说明 | 典型示例 |
| --- | --- | --- |
| `git stash` | 临时保存当前工作区修改 | `git stash` |
| `git stash save "msg"` | 带备注的储藏 | `git stash save "用户模块写一半"` |
| `git stash list` | 查看储藏列表 | `git stash list` |
| `git stash pop` | 恢复最近的储藏并删除记录 | `git stash pop` |
| `git stash apply` | 恢复储藏但不删除记录 | `git stash apply stash@{1}` |
| `git clean -n` | 预览将被删除的未跟踪文件 | `git clean -n` |
| `git clean -f` | 删除未跟踪的文件 | `git clean -fd` |

### 差异比较

| 命令 | 说明 |
| --- | --- |
| `git diff` | 工作区 vs 暂存区 |
| `git diff --cached` | 暂存区 vs 最新提交 |
| `git diff HEAD` | 工作区 vs 最新提交 |

## 常见场景速查

::: tip 使用说明
以"我想……"开头定位你的场景，直接复制命令即可。涉及 `<file>` 或 `<hash>` 的地方，替换为你的实际文件名或 commit hash。
:::

### 我要撤销

**我想撤销工作区某个文件的修改**
```bash
git checkout -- <file>
```

**我想把暂存区的文件撤回来**
```bash
git reset HEAD <file>
```

**我想回到上一个版本**
```bash
git reset --hard HEAD~1
```

**我刚 reset --hard 错了，想找回来**
```bash
git reflog                      # 找到丢失的 commit hash
git reset --hard HEAD@{1}       # 或者用 reflog 里显示的具体 hash
```

::: important reflog 是你的后悔药
只要 commit 过，`git reflog` 几乎总能帮你找回"丢失"的提交。reset、rebase、commit --amend 操作都会在 reflog 里留下记录。
:::

**我想撤销某次提交，但保留历史记录**
```bash
git revert <hash>
```

**我想修改上一次提交的 message**
```bash
git commit --amend -m "新的提交信息"
```

**我想往上一次提交里追加文件**
```bash
git add <遗漏的文件>
git commit --amend --no-edit
```

### 我要临时切换任务

**手头工作写了一半，要先去修个 bug**
```bash
git stash save "用户模块开发中"
# ... 去修 bug、提交 ...
git stash pop      # 回来继续
```

**我想查看 stash 里存了什么**
```bash
git stash list
git stash show -p stash@{0}
```

### 我要调试

**我想看某行代码是谁写的、什么时候写的**
```bash
git blame <file> -L <起始行>,<结束行>
```

**我想找哪个 commit 引入了 bug**
```bash
git bisect start          # 开始二分查找
git bisect bad            # 标记当前版本有问题
git bisect good <hash>    # 标记某个旧版本没问题
# Git 会自动切换到中间版本，你测试后标记 good 或 bad
# 重复直到找到引入 bug 的 commit
git bisect reset          # 查找结束，回到原来的状态
```

**我想看某个文件某次提交前的样子**
```bash
git show <hash>:<file>
```

### 我要整理提交

**我想把一个分支上的多个 commit 合并成一个**
```bash
git rebase -i HEAD~3     # 把最近 3 个 commit 压缩
```

**我想把某个分支变基到 main 上（保持提交历史线性）**
```bash
git checkout feat/login
git rebase main
```

### 我要操作标签

**打一个版本标签**
```bash
git tag -a v1.0.0 -m "第一个正式版本"
git push origin v1.0.0
```

**删除标签**
```bash
git tag -d v1.0.0                    # 删本地
git push origin --delete v1.0.0       # 删远程
```

### 我要操作远程

**我想看看本地分支和远程分支的对应关系**
```bash
git branch -vv
```

**我推送到远程时提示 rejected（远程有我没拉取的新提交）**
```bash
git pull --rebase origin main   # 先拉取并变基
git push origin main            # 再推送
```

**我想撤回已经推送到远程的 commit**
```bash
git revert <hash>       # 用 revert，而不是 reset
git push origin main
```

::: warning 已经 push 的提交不要 reset
`git reset` 改写本地历史，`git push --force` 会覆盖远程。在共享分支上这是灾难。用 `git revert` 安全地"撤销"已推送的提交。
:::

## .gitignore 模板

在项目根目录创建 `.gitignore` 文件：

```gitignore
# 依赖
node_modules/
vendor/

# 构建产物
dist/
build/
*.pyc
__pycache__/

# 环境变量 & 密钥
.env
.env.local
*.pem
credentials.json

# IDE 配置
.vscode/
.idea/
*.swp
*.swo

# 系统文件
.DS_Store
Thumbs.db
desktop.ini

# 日志
*.log
logs/

# 测试覆盖率
coverage/
.nyc_output/
```

::: tip 什么时候写 .gitignore
项目初始化后就立刻创建 `.gitignore`，在第一次 `git add` 之前。如果已经 commit 了一些不该提交的文件（比如 `node_modules`），需要先 `git rm -r --cached` 再从 `.gitignore` 里排除。
:::

## 最佳实践

1. **不确定先 `git status`** -- 任何时候拿不准当前状态，先跑这个命令
2. **小步提交，写好 message** -- 每个 commit 只做一件事，message 说清楚做了什么
3. **在分支上开发** -- 不要直接在 main 上写代码，用 feature 分支
4. **push 前先 pull** -- 避免出现不必要的合并冲突
5. **不要 `push --force` 到共享分支** -- 这是 Git 使用的底线，会覆盖别人的提交
6. **善用 `git stash`** -- 临时切任务时先 stash，别带着半成品提交

## 速查索引

需要更深入理解某个命令？跳转到对应章节：

| 想了解什么 | 去看哪里 |
| --- | --- |
| Git 是什么、为什么用 | 第 1 章 版本控制基础 |
| 工作区/暂存区/仓库的概念 | 第 3 章 基础工作流 |
| 查看历史与回滚操作 | 第 4 章 时光穿梭 |
| 分支策略与合并冲突 | 第 5 章 分支管理 |
| 远程协作与 Pull Request | 第 6 章 远程协作 |
