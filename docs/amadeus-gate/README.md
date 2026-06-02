---
layout: AmadeusGateLayout
title: Amadeus Gate
dag:
  title: "Amadeus Gate · ML 知识体系 DAG"
  nodes:
    # ═══════════ 主线 Golden Path ═══════════
    - id: ch0
      label: "Ch0\n序章"
      type: main
      path: goal/
      bgImage: /img/amadeus-gate/atom.jpg
    - id: ch1
      label: "Ch1\nML基础"
      type: main
      path: recognition/
    - id: ch2
      label: "Ch2\n经典分类器"
      type: main
      path: classifiers/
    - id: ch3
      label: "Ch3\n神经网络入门"
      type: main
      path: neural-networks/
    - id: ch4
      label: "Ch4\n优化理论"
      type: main
      path: optimization/
    - id: ch5
      label: "Ch5\nCNN 视觉之门"
      type: main
      path: cnn/
    - id: ch8
      label: "Ch8\nTransformer基础"
      type: main
      path: transformer/
    - id: ch11
      label: "Ch11 ⚡\n注意力收束"
      type: converge
      path: attention-convergence/
    - id: ch12
      label: "Ch12\n预训练"
      type: main
      path: pretraining/
    - id: ch13
      label: "Ch13\n后训练与对齐"
      type: main
      path: post-training/
    - id: ch14
      label: "Ch14\n评估与基准"
      type: main
      path: evaluation/
    - id: ch15
      label: "Ch15\n规模化涌现"
      type: main
      path: scaling/
    - id: ch18
      label: "Ch18 ◆\nSteins Gate"
      type: converge
      path: steins-gate/

    # ═══════════ 早期分支 (Ch1-4) ═══════════
    - id: b-kernel
      label: "核方法\nSVM·核技巧"
      type: branch
      path: branches/kernel-methods/
    - id: b-pgm
      label: "概率图模型\n贝叶斯·HMM·CRF"
      type: branch
      path: branches/pgm/
    - id: b-recsys
      label: "推荐系统\n协同过滤→双塔"
      type: deadend
      path: branches/recsys/
    - id: b-info
      label: "信息论\n熵·KL·率失真"
      type: branch
      path: branches/information-theory/
    - id: b-causal
      label: "因果ML\ndo-calculus·Double ML"
      type: branch
      path: branches/causal-ml/

    # ═══════════ 分叉期分支 (Ch5-7) ═══════════
    - id: b-advml
      label: "对抗ML\nFGSM·PGD"
      type: branch
      path: branches/adv-ml/
    - id: b-rnn
      label: "β线 RNN链 (3篇)\nLSTM→GRU→Attention起源"
      type: branch
      path: branches/rnn/
    - id: b-mamba
      label: "Mamba/SSM\nS4→Mamba→Mamba2"
      type: branch
      path: branches/mamba/
    - id: b-ts
      label: "时序预测\nPatchTST·TimesFM"
      type: branch
      path: branches/timeseries/
    - id: b-gnn
      label: "δ线 GNN链 (3篇)\nGCN→GAT→GIN"
      type: branch
      path: branches/gnn/
    - id: b-geom
      label: "几何深度学习\n群等变·流形·拓扑"
      type: branch
      path: branches/geometric-dl/

    # ═══════════ 交汇期分支 (Ch8-10) ═══════════
    - id: b-vit
      label: "ViT\n视觉Transformer"
      type: branch
      path: branches/vit/
    - id: b-audio
      label: "音频ML\nWhisper·HuBERT"
      type: branch
      path: branches/audio-ml/
    - id: b-titans
      label: "Titans\n记忆增强架构"
      type: branch
      path: branches/titans/
    - id: b-gen
      label: "γ线 生成模型链 (4篇)\nVAE→GAN→Diffusion→FM"
      type: branch
      path: branches/generative/
    - id: b-ae
      label: "自编码器\n稀疏·降噪·收缩"
      type: branch
      path: branches/autoencoders/
    - id: b-3dgen
      label: "3D生成\nNeRF·3DGS"
      type: branch
      path: branches/3d-generation/
    - id: b-jepa
      label: "JEPA/世界模型\nI-JEPA→LeWorldModel"
      type: branch
      path: branches/jepa/
    - id: b-ssl
      label: "ε线 自监督链 (3篇)\nSimCLR→DINO→MAE"
      type: branch
      path: branches/self-supervised/
    - id: b-contrast
      label: "对比学习深入\nInfoNCE·多视图理论"
      type: branch
      path: branches/contrastive-deep/
    - id: b-neuro
      label: "神经符号AI\nRiJEPA·EBC逻辑约束"
      type: branch
      path: branches/neurosymbolic/

    # ═══════════ 收束后分支 (Ch11后) ═══════════
    - id: b-interp
      label: "机制可解释性\nSAE→Circuit Tracing"
      type: branch
      path: branches/interpretability/
    - id: b-kd
      label: "知识蒸馏\nHinton→LLM蒸馏"
      type: branch
      path: branches/knowledge-distillation/

    # ═══════════ 大模型分支 (Ch12-15) ═══════════
    - id: b-deploy
      label: "推理与部署\n量化·vLLM·KV Cache"
      type: deadend
      path: branches/inference-deployment/
    - id: b-data
      label: "数据工程\n飞轮·合成·去重"
      type: branch
      path: branches/data-engineering/
    - id: b-oss
      label: "开源生态\nHF·许可·Open Weights"
      type: branch
      path: branches/open-source-eco/
    - id: b-safety
      label: "AI安全\n涌现错位·CoT监控"
      type: branch
      path: branches/ai-safety/
    - id: b-dist
      label: "分布式训练\nDP·TP·PP·ZeRO"
      type: branch
      path: branches/distributed-training/
    - id: b-moe
      label: "MoE\n稀疏门控→Mixtral"
      type: branch
      path: branches/moe/
    - id: b-nas
      label: "神经架构搜索\nDARTS→Once-for-All"
      type: branch
      path: branches/nas/
    - id: b-fed
      label: "联邦学习\nFedAvg·差分隐私"
      type: branch
      path: branches/federated-learning/

    # ═══════════ 终章分支 (Ch15后) ═══════════
    - id: b-rl
      label: "ζ线 强化学习链 (3篇)\nMDP→DQN→PPO→SAC"
      type: branch
      path: branches/reinforcement-learning/
    - id: b-agent
      label: "Agent深入\nMulti-Agent·MCP/A2A"
      type: branch
      path: branches/agent/
    - id: b-multimodal
      label: "η线 多模态链 (3篇)\nCLIP→BLIP→LLaVA"
      type: branch
      path: branches/multimodal/
    - id: b-video
      label: "视频理解\nTimeSformer·VideoLLM"
      type: branch
      path: branches/video-understanding/
    - id: b-embodied
      label: "具身智能\nVLA·RT-2·扩散策略"
      type: branch
      path: branches/embodied-ai/

  edges:
    # ── 第一幕：基石 ──
    - from: ch0
      to: ch1
    - from: ch1
      to: ch2
    - from: ch1
      to: b-kernel
      dashed: true
    - from: b-kernel
      to: ch2
      dashed: true
    - from: ch1
      to: b-pgm
      dashed: true
    - from: b-pgm
      to: ch3
      dashed: true
    - from: ch2
      to: ch3
    - from: ch2
      to: b-recsys
      dashed: true
    - from: ch3
      to: ch4

    # ── 第二幕：分叉 ──
    - from: ch4
      to: ch5
    - from: ch4
      to: b-info
      dashed: true
    - from: ch4
      to: b-causal
      dashed: true
    - from: ch4
      to: b-rnn
      dashed: true
    - from: ch4
      to: b-gnn
      dashed: true
    - from: ch5
      to: b-advml
      dashed: true
    - from: b-advml
      to: ch8
      dashed: true
    - from: b-rnn
      to: b-mamba
      dashed: true
    - from: b-rnn
      to: b-ts
      dashed: true
    - from: b-mamba
      to: ch8
      dashed: true
    - from: b-ts
      to: ch8
      dashed: true
    - from: b-gnn
      to: b-geom
      dashed: true
    - from: b-geom
      to: ch8
      dashed: true
    - from: ch5
      to: ch8
    - from: b-rnn
      to: ch8
      dashed: true
    - from: b-gnn
      to: ch8
      dashed: true

    # ── 第三幕：交汇 ──
    - from: ch8
      to: b-vit
      dashed: true
    - from: ch8
      to: b-audio
      dashed: true
    - from: ch8
      to: b-titans
      dashed: true
    - from: ch8
      to: b-gen
      dashed: true
    - from: ch8
      to: b-ssl
      dashed: true
    - from: b-info
      to: b-gen
      dashed: true
    - from: b-gen
      to: b-ae
      dashed: true
    - from: b-gen
      to: b-3dgen
      dashed: true
    - from: b-gen
      to: b-jepa
      dashed: true
    - from: b-ssl
      to: b-contrast
      dashed: true
    - from: b-ssl
      to: b-neuro
      dashed: true

    # ── 第四幕：收束 ──
    - from: ch8
      to: ch11
    - from: b-gen
      to: ch11
      dashed: true
    - from: b-ssl
      to: ch11
      dashed: true
    - from: b-vit
      to: ch11
      dashed: true
    - from: b-audio
      to: ch11
      dashed: true
    - from: b-titans
      to: ch11
      dashed: true
    - from: b-ae
      to: ch11
      dashed: true
    - from: b-3dgen
      to: ch11
      dashed: true
    - from: b-jepa
      to: ch11
      dashed: true
    - from: b-contrast
      to: ch11
      dashed: true
    - from: b-causal
      to: ch11
      dashed: true

    # ── 第五幕：大模型时代 ──
    - from: ch11
      to: ch12
    - from: ch11
      to: b-interp
      dashed: true
    - from: ch11
      to: b-kd
      dashed: true
    - from: ch12
      to: ch13
    - from: ch12
      to: b-deploy
      dashed: true
    - from: ch12
      to: b-data
      dashed: true
    - from: b-data
      to: ch13
      dashed: true
    - from: ch13
      to: ch14
    - from: ch13
      to: b-oss
      dashed: true
    - from: ch13
      to: b-safety
      dashed: true
    - from: b-oss
      to: ch14
      dashed: true
    - from: ch14
      to: ch15

    # ── 第六幕：终章 ──
    - from: ch15
      to: b-dist
      dashed: true
    - from: ch15
      to: b-moe
      dashed: true
    - from: ch15
      to: b-nas
      dashed: true
    - from: ch15
      to: b-fed
      dashed: true
    - from: ch15
      to: b-rl
      dashed: true
    - from: ch15
      to: b-multimodal
      dashed: true
    - from: b-rl
      to: b-agent
      dashed: true
    - from: b-multimodal
      to: b-video
      dashed: true
    - from: b-multimodal
      to: b-embodied
      dashed: true

    # ── 终局收束 ──
    - from: ch15
      to: ch18
    - from: b-rl
      to: ch18
      dashed: true
    - from: b-multimodal
      to: ch18
      dashed: true
    - from: b-neuro
      to: ch18
      dashed: true
    - from: b-interp
      to: ch18
      dashed: true
    - from: b-kd
      to: ch18
      dashed: true
    - from: b-safety
      to: ch18
      dashed: true
    - from: b-dist
      to: ch18
      dashed: true
    - from: b-moe
      to: ch18
      dashed: true
    - from: b-nas
      to: ch18
      dashed: true
    - from: b-fed
      to: ch18
      dashed: true
    - from: b-agent
      to: ch18
      dashed: true
    - from: b-video
      to: ch18
      dashed: true
    - from: b-embodied
      to: ch18
      dashed: true
createTime: 2025/12/29 19:23:57
permalink: /amadeus-gate/
---

# Amadeus Gate：命运石之门

> **"一切都是命运石之门的选择。"**

## 探索指南

本页面采用 **DAG 交互式导航**。每个节点代表一个章节或分支链：

| 图例 | 含义 |
|------|------|
| 🟡 金色节点 | **主线 (Golden Path)** — 13 章最小必读路径 |
| 🔵 青色 / 🟣 紫色 / 🟢 绿色 / 🟠 金色 | **平行世界线** — 可选分支链，与主线并行 |
| 🟠 橙色虚线节点 | **分支** — 单篇或链式，完成后汇入 |
| 🟣 紫色节点 | **收束点** — 多路径汇聚（Ch11、Ch18） |
| 🟢 绿色虚线节点 | **独立终点** — 不汇入主线 |
| 🔗 橙色虚线箭头 | **交叉连接** — 分支之间可以互跳 |

**操作：** 拖动节点自由探索 | 滚轮缩放 | 右键平移画布 | 点击节点进入章节

## Golden Path

> 如果你只想走最少的路理解 ML 全貌，只读这 13 章。

```
Ch0 → Ch1 → Ch2 → Ch3 → Ch4 → Ch5 → Ch8 → Ch11 → Ch12 → Ch13 → Ch14 → Ch15 → Ch18
```

## 章节总览

| 幕 | 主线 | 核心内容 |
|----|------|----------|
| 第一幕：基石 | Ch0-4 | ML基础 → 经典分类器 → 神经网络 → 优化理论 |
| 第二幕：分叉 | Ch5 | CNN 视觉之门（β线 RNN / δ线 GNN 为分支链） |
| 第三幕：交汇 | Ch8 | Transformer 基础（γ线生成 / ε线自监督 为分支链） |
| 第四幕：收束 | Ch11 | 注意力收束 — 所有架构在此统一 |
| 第五幕：大模型 | Ch12-15 | 预训练 → 后训练 → 评估 → 规模化涌现 |
| 第六幕：终章 | Ch18 | Steins Gate — AGI 路径、对齐、可控 |

## 分支链

| 入口 | 分支链 | 篇数 | 汇入 |
|------|--------|------|------|
| Ch1 | 核方法 | 1 | Ch2 |
| Ch1 | 概率图模型 | 2 | Ch3 |
| Ch2 | 推荐系统 | 2 | 独立终点 |
| Ch4 | 信息论 | 2 | Ch9 |
| Ch4 | 因果ML | 2 | Ch11 |
| Ch4 | β线 RNN | 3 | Ch8 |
| Ch4 | δ线 GNN | 3 | Ch8 |
| Ch5 | 对抗ML | 1 | Ch8 |
| Ch8 | γ线 生成模型 | 4 | Ch11 |
| Ch8 | ε线 自监督 | 3 | Ch11 |
| Ch11 | 机制可解释性 | 2 | Ch18 |
| Ch11 | 知识蒸馏 | 2 | Ch18 |
| Ch12 | 推理与部署 | 2 | 独立终点 |
| Ch13 | AI安全 | 3 | Ch18 |
| Ch15 | ζ线 强化学习 | 3 | Ch18 |
| Ch15 | η线 多模态 | 3 | Ch18 |
| Ch15 | MoE / 分布式 / NAS / 联邦学习 | 各1-2 | Ch18 |

完整分支目录见 [DAG 大纲 v4](./大纲new.md)。

## 阅读路径示例

| 路径 | 章节数 | 内容 |
|------|--------|------|
| **极简路线** | 13 章 | Golden Path，最小必读 |
| **视觉+生成** | ~17 篇 | 主线 + γ线（VAE→GAN→Diffusion→Flow Matching） |
| **序列+表征** | ~16 篇 | 主线 + β线（RNN）+ ε线（自监督） |
| **全收集** | ~55 篇 | 所有主线 + 20 条分支链 + 9 条子分支 |

---

> *"El Psy Congroo."*
