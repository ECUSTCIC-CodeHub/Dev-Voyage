---
title: Amadeus Gate 大纲 v4
createTime: 2026/05/31
permalink: /amadeus-gate/outline/
---

# Amadeus Gate：命运石之门 —— 大纲 v4

> 主线 = 金色路径（最小必读）。分支链 = 可选深度探索（可单篇可多篇，链内可再分叉）。

---

## 阅读约定

| 图例 | 含义 |
|------|------|
| 金色粗线 | **主线 (Golden Path)** —— 最小必读路径 |
| α(青)/β(紫)/γ(绿)/δ(金) | **平行世界线** —— 可选分支链，与主线并行 |
| 橙色虚线 | **分支** —— 单篇或链式，完成后汇入 |
| 紫色双层 | **收束点** —— 多路径汇聚 |
| 橙色虚线箭头 | **交叉连接** —— 分支之间可以互跳 |

---

## 主线 (Golden Path)

> 如果你只想走最少的路理解 ML 全貌，只读这些。

```
Ch0 → Ch1 → Ch2 → Ch3 → Ch4 → Ch5 → Ch8 → Ch11 → Ch12 → Ch13 → Ch14 → Ch15 → Ch18
(13章)
```

- Ch5(CNN) 被选为推荐的视觉路线，因为 CNN 是理解后续架构的基础
- RNN(Ch6)、GNN(Ch7) 降为分支链——你可以从 Ch4 后拐进去
- 生成模型(Ch9)、自监督(Ch10)、RL(Ch16)、多模态(Ch17) 全部降为分支链

---

## DAG 全图

```mermaid
graph TB
    classDef main fill:#1a1a2e,color:#ffd700,stroke:#ffd700,stroke-width:3px
    classDef branchSingle fill:#2a1a0d,color:#ffd4a8,stroke:#d97706,stroke-width:1px,stroke-dasharray:5
    classDef branchChain fill:#2a1a0d,color:#ffd4a8,stroke:#f59e0b,stroke-width:2px,stroke-dasharray:5
    classDef converge fill:#1a0d2a,color:#c4b5fd,stroke:#7c3aed,stroke-width:3px
    classDef deadend fill:#162a0d,color:#a8ffa8,stroke:#16a34a,stroke-width:2px,stroke-dasharray:5

    %% ═══════════ 第一幕：基石 (主线) ═══════════
    C0["Ch0 序章"]:::main
    C1["Ch1 ML基础"]:::main
    C2["Ch2 经典分类器"]:::main
    C3["Ch3 神经网络入门"]:::main
    C4["Ch4 优化理论"]:::main

    C0 --> C1 --> C2 --> C3 --> C4

    %% 早期分支
    B_KERNEL["分支: 核方法 (1篇)<br/>SVM · 核技巧<br/>Ch1→Ch2"]:::branchSingle
    B_PGM["分支链: 概率图模型 (2篇)<br/>贝叶斯网→HMM/CRF<br/>Ch1→Ch3"]:::branchChain
    B_REC["分支链: 推荐系统 (2篇)<br/>协同过滤→双塔/多任务<br/>Ch2→独立"]:::branchChain

    C1 --> B_KERNEL --> C2
    C1 --> B_PGM --> C3
    C2 --> B_REC

    %% ═══════════ 第二幕：主线路 + 平行世界线 ═══════════
    B_INFO["分支链: 信息论 (2篇)<br/>熵/KL→率失真/信道<br/>Ch4→Ch9入口"]:::branchChain
    B_CAUSAL["分支链: 因果ML (2篇)<br/>do-calculus→Double ML<br/>Ch4→Ch11"]:::branchChain

    C4 --> B_INFO
    C4 --> B_CAUSAL

    %% 主线走 CNN
    C4 --> C5
    C5["Ch5 主线 CNN<br/>卷积→ResNet→EfficientNet"]:::main

    %% 平行世界线
    C4 --> C6_START
    C6_START["β线: RNN链 (3篇)<br/>RNN/LSTM → GRU/Seq2Seq → Attention起源"]:::branchChain
    C6_START --> C6_MID
    C6_MID["β-2: GRU/Seq2Seq"]:::branchChain
    C6_MID --> C6_END
    C6_END["β-3: Attention起源<br/>(Bahdanau 2014)"]:::branchChain

    C4 --> C7_START
    C7_START["δ线: GNN链 (3篇)<br/>消息传递/GCN → GAT/GIN → 图应用"]:::branchChain
    C7_START --> C7_MID
    C7_MID["δ-2: GAT/GIN/WL-test"]:::branchChain
    C7_MID --> C7_END
    C7_END["δ-3: 图分类/链接预测"]:::branchChain

    %% 分支链内部的子分支
    B_ADVML["分支: 对抗ML (1篇)<br/>FGSM→PGD<br/>Ch5→Ch8"]:::branchSingle
    B_MAMBA["分支链: SSM (2篇)<br/>S4/Mamba→Mamba2/LrcSSM<br/>β-2→Ch8"]:::branchChain
    B_TS["分支: 时序预测 (1篇)<br/>PatchTST→TimesFM<br/>β-1→Ch8"]:::branchSingle
    B_GEOM["分支: 几何DL (1篇)<br/>群等变·流形·拓扑<br/>δ-2→Ch8"]:::branchSingle

    C5 --> B_ADVML
    C6_MID --> B_MAMBA
    C6_START --> B_TS
    C7_MID --> B_GEOM

    %% ═══════════ 第三幕：交汇 ═══════════
    C5 --> C8
    C6_END --> C8
    C7_END --> C8
    B_ADVML --> C8
    B_MAMBA --> C8
    B_TS --> C8
    B_GEOM --> C8

    C8["Ch8 主线 Transformer基础<br/>自回归·Encoder-Decoder·推理策略"]:::main

    %% 从 Ch8 分出的分支链
    C8 --> C9_START
    C9_START["γ线: 生成模型链 (4篇)<br/>VAE→GAN→Diffusion→Flow Matching"]:::branchChain
    C9_START --> C9_MID1
    C9_MID1["γ-2: GAN/WGAN/StyleGAN"]:::branchChain
    C9_MID1 --> C9_MID2
    C9_MID2["γ-3: Diffusion/Score-based"]:::branchChain
    C9_MID2 --> C9_END
    C9_END["γ-4: Flow Matching/统一视角"]:::branchChain

    C8 --> C10_START
    C10_START["ε线: 自监督链 (3篇)<br/>对比学习→无负样本→掩码自编码"]:::branchChain
    C10_START --> C10_MID
    C10_MID["ε-2: BYOL/DINO/自蒸馏"]:::branchChain
    C10_MID --> C10_END
    C10_END["ε-3: MAE/BEiT/多模态预训练"]:::branchChain

    B_INFO --> C9_START

    %% 分支链内部的子分支
    B_VIT["分支: ViT (1篇)<br/>Ch8→Ch11"]:::branchSingle
    B_AUDIO["分支: 音频ML (1篇)<br/>Ch8→Ch11"]:::branchSingle
    B_TITANS["分支: Titans (1篇)<br/>Ch8→Ch11"]:::branchSingle
    B_AE["分支: 自编码器 (1篇)<br/>γ-1→Ch11"]:::branchSingle
    B_3DG["分支: 3D生成 (1篇)<br/>γ-3→Ch11"]:::branchSingle
    B_JEPA["分支链: JEPA (2篇)<br/>I-JEPA/V-JEPA→LeWorldModel<br/>γ-4→Ch11"]:::branchChain
    B_CONT["分支: 对比深入 (1篇)<br/>ε-1→Ch11"]:::branchSingle
    B_NEURO["分支链: 神经符号 (2篇)<br/>RiJEPA→EBC能量约束<br/>ε-3→Ch18"]:::branchChain

    C8 --> B_VIT
    C8 --> B_AUDIO
    C8 --> B_TITANS
    C9_START --> B_AE
    C9_MID2 --> B_3DG
    C9_END --> B_JEPA
    C10_START --> B_CONT
    C10_END --> B_NEURO

    %% 交叉连接
    B_CONT -.->|"交叉"| B_VIT
    B_MAMBA -.->|"交叉"| B_TITANS
    B_CAUSAL -.->|"交叉"| B_NEURO
    B_JEPA -.->|"交叉"| B_NEURO

    %% ═══════════ 第四幕：收束 ═══════════
    C8 --> C11
    C9_END --> C11
    C10_END --> C11
    B_VIT --> C11
    B_AUDIO --> C11
    B_TITANS --> C11
    B_AE --> C11
    B_3DG --> C11
    B_JEPA --> C11
    B_CONT --> C11
    B_CAUSAL --> C11

    C11["Ch11 ⚡ 注意力收束<br/>QKV→RoPE→FlashAttention<br/>全谱系·SSM对比"]:::converge

    %% 从收束点分出的分支
    B_INTERP["分支链: 可解释性 (2篇)<br/>SAE/Transcoder→Circuit Tracing<br/>Ch11→Ch18"]:::branchChain
    B_KD["分支链: 知识蒸馏 (2篇)<br/>Hinton→自蒸馏/LLM蒸馏<br/>Ch11→Ch18"]:::branchChain

    C11 --> B_INTERP
    C11 --> B_KD

    %% ═══════════ 第五幕：大模型 ═══════════
    C11 --> C12
    C12["Ch12 主线 预训练<br/>GPT→BERT→LLaMA·Tokenizer"]:::main

    B_DEPLOY["分支链: 推理部署 (2篇)<br/>量化/vLLM→投机解码/硬件<br/>Ch12→独立"]:::branchChain
    B_DATA["分支链: 数据工程 (2篇)<br/>数据飞轮→合成/去重/配比<br/>Ch12→Ch13"]:::branchChain

    C12 --> B_DEPLOY
    C12 --> B_DATA --> C13

    C12 --> C13
    C13["Ch13 主线 后训练与对齐<br/>SFT→RLHF→DPO·Constitutional AI"]:::main

    B_OSS["分支: 开源生态 (1篇)<br/>Ch13→Ch14"]:::branchSingle
    B_SAFETY["分支链: AI安全 (3篇)<br/>涌现错位→CoT监控→前沿安全框架<br/>Ch13→Ch18"]:::branchChain

    C13 --> B_OSS --> C14
    C13 --> B_SAFETY
    C13 --> C14

    C14["Ch14 主线 评估与基准<br/>MMLU→Arena Elo·Goodhart"]:::main

    %% 交叉连接
    B_SAFETY -.->|"交叉"| B_INTERP
    B_CAUSAL -.->|"交叉"| B_SAFETY

    C14 --> C15
    C15["Ch15 主线 规模化涌现<br/>Scaling Law→涌现→双下降"]:::main

    %% 从 Ch15 分出的分支
    B_DIST["分支链: 分布式训练 (2篇)<br/>DP/TP/PP→ZeRO/FSDP<br/>Ch15→Ch18"]:::branchChain
    B_MOE["分支链: MoE (2篇)<br/>稀疏门控→Mixtral/DeepSeekMoE<br/>Ch15→Ch18"]:::branchChain
    B_NAS["分支: NAS (1篇)<br/>Ch15→Ch18"]:::branchSingle
    B_FED["分支: 联邦学习 (1篇)<br/>Ch15→Ch18"]:::branchSingle

    C15 --> B_DIST
    C15 --> B_MOE
    C15 --> B_NAS
    C15 --> B_FED

    %% ═══════════ 第六幕：终章 ═══════════
    C15 --> C16_START
    C16_START["ζ线: 强化学习链 (3篇)<br/>MDP/DQN→PPO/SAC→离线RL"]:::branchChain
    C16_START --> C16_MID
    C16_MID["ζ-2: PPO/SAC/GRPO"]:::branchChain
    C16_MID --> C16_END
    C16_END["ζ-3: 离线RL/RL+LLM交叉"]:::branchChain

    C15 --> C17_START
    C17_START["η线: 多模态链 (3篇)<br/>CLIP/BLIP→LLaVA/Flamingo→多模态生成"]:::branchChain
    C17_START --> C17_MID
    C17_MID["η-2: LLaVA/指令微调"]:::branchChain
    C17_MID --> C17_END
    C17_END["η-3: DALL-E3/SD3/Sora"]:::branchChain

    %% 分支链子分支
    B_AGENT["分支链: Agent (2篇)<br/>Multi-Agent→MCP/A2A协议<br/>ζ-2→Ch18"]:::branchChain
    B_VIDEO["分支: 视频理解 (1篇)<br/>η-2→Ch18"]:::branchSingle
    B_EMBODIED["分支链: 具身智能 (2篇)<br/>VLA/RT-2→扩散策略/Sim2Real<br/>η-3→Ch18"]:::branchChain

    C16_MID --> B_AGENT
    C17_MID --> B_VIDEO
    C17_END --> B_EMBODIED

    %% ═══════════ 终局收束 ═══════════
    C15 --> C18
    C16_END --> C18
    C17_END --> C18
    B_NEURO --> C18
    B_INTERP --> C18
    B_KD --> C18
    B_SAFETY --> C18
    B_DIST --> C18
    B_MOE --> C18
    B_NAS --> C18
    B_FED --> C18
    B_AGENT --> C18
    B_VIDEO --> C18
    B_EMBODIED --> C18

    C18["Ch18 ◆ Steins Gate<br/>自由能→变分推断→AGI路径<br/>世界模型→对齐→可控<br/>El Psy Congroo"]:::converge
```

---

## 主线 (Golden Path) 定义

> 最小必读路径，13 章。走完就能理解 ML 全貌。

| # | 章节 | 累积基础 |
|---|------|----------|
| 0 | 序章 | - |
| 1 | ML基础 | 三范式、偏差-方差 |
| 2 | 经典分类器 | KNN、树、集成 |
| 3 | 神经网络入门 | MLP、反向传播 |
| 4 | 优化理论 | SGD→AdamW、正则化 |
| 5 | CNN | 卷积→ResNet |
| 8 | Transformer基础 | Encoder-Decoder |
| 11 | 注意力收束 ⚡ | QKV、FlashAttention、全谱系 |
| 12 | 预训练 | GPT、BERT、LLaMA |
| 13 | 后训练与对齐 | SFT、RLHF、DPO |
| 14 | 评估与基准 | MMLU、Arena Elo |
| 15 | 规模化涌现 | Scaling Law、涌现 |
| 18 | Steins Gate ◆ | AGI路径、对齐、可控 |

---

## 分支链目录

> 每个分支链可以是 **1-N 篇文章**。链内可以有自己的子分支。标注 "(N篇)"。

### 早期分支 (Ch1-4)

| 分支链 | 入口 | 汇入 | 篇数 | 内容 |
|--------|------|------|------|------|
| 核方法 | Ch1 | Ch2 | 1 | SVM深度、核技巧、RKHS |
| 概率图模型 | Ch1 | Ch3 | 2 | ①贝叶斯网 ②HMM/CRF |
| 推荐系统 | Ch2 | 独立 | 2 | ①协同过滤→双塔 ②MMOE→工业实践 |
| 信息论 | Ch4 | γ线入口 | 2 | ①熵/KL/互信息 ②率失真/信道容量 |
| 因果ML | Ch4 | Ch11 | 2 | ①do-calculus/Pearl阶梯 ②Double ML/因果发现 |

### 平行世界线 (Ch4后分叉)

| 分支链 | 入口 | 汇入 | 篇数 | 内容 | 子分支 |
|--------|------|------|------|------|--------|
| **β线: RNN** | Ch4 | Ch8 | 3 | ①RNN/LSTM ②GRU/Seq2Seq ③Attention起源 | Mamba(②→Ch8)、时序预测(①→Ch8) |
| **δ线: GNN** | Ch4 | Ch8 | 3 | ①消息传递/GCN ②GAT/GIN/WL-test ③图应用 | 几何DL(②→Ch8) |

### 交汇期分支 (Ch8后分叉)

| 分支链 | 入口 | 汇入 | 篇数 | 内容 | 子分支 |
|--------|------|------|------|------|--------|
| 对抗ML | Ch5 | Ch8 | 1 | FGSM→PGD→对抗训练→LLM越狱 | - |
| ViT | Ch8 | Ch11 | 1 | ViT→Swin→DeiT→DINOv2 | - |
| 音频ML | Ch8 | Ch11 | 1 | Whisper→HuBERT→Wav2Vec | - |
| Titans | Ch8 | Ch11 | 1 | 长期记忆→惊喜度量→adaptive forgetting | - |
| **γ线: 生成模型** | Ch8 | Ch11 | 4 | ①VAE/β-VAE ②GAN/WGAN/StyleGAN ③Diffusion/Score-based ④Flow Matching/统一视角 | 自编码器(①→Ch11)、3D生成(③→Ch11)、JEPA(④→Ch11) |
| **ε线: 自监督** | Ch8 | Ch11 | 3 | ①SimCLR/MoCo/InfoNCE ②BYOL/DINO/自蒸馏 ③MAE/BEiT/多模态预训练 | 对比深入(①→Ch11)、神经符号(③→Ch18) |

### 收束后分支 (Ch11后分叉)

| 分支链 | 入口 | 汇入 | 篇数 | 内容 |
|--------|------|------|------|------|
| 机制可解释性 | Ch11 | Ch18 | 2 | ①SAE/Transcoder ②Circuit Tracing/Anthropic解密 |
| 知识蒸馏 | Ch11 | Ch18 | 2 | ①Hinton/FitNet ②自蒸馏/数据集蒸馏/LLM蒸馏 |

### 大模型分支 (Ch12-15)

| 分支链 | 入口 | 汇入 | 篇数 | 内容 |
|--------|------|------|------|------|
| 推理与部署 | Ch12 | 独立 | 2 | ①量化/vLLM/KV Cache ②投机解码/硬件/边缘 |
| 数据工程 | Ch12 | Ch13 | 2 | ①数据飞轮/合成数据 ②去重(MinHash)/配比/污染 |
| 开源生态 | Ch13 | Ch14 | 1 | HF生态/许可证/Open Weights vs API |
| AI安全深度 | Ch13 | Ch18 | 3 | ①涌现错位/模型有机体 ②CoT监控/"最禁忌技术" ③前沿安全框架/红队 |
| 分布式训练 | Ch15 | Ch18 | 2 | ①DP/TP/PP ②ZeRO/FSDP/通信优化 |
| MoE | Ch15 | Ch18 | 2 | ①稀疏门控/Switch ②Mixtral/DeepSeekMoE/负载均衡 |
| NAS | Ch15 | Ch18 | 1 | ENAS→DARTS→ProxylessNAS→Once-for-All |
| 联邦学习 | Ch15 | Ch18 | 1 | FedAvg→差分隐私→安全聚合→联邦LLM |

### 终章分支 (Ch15后分叉)

| 分支链 | 入口 | 汇入 | 篇数 | 内容 | 子分支 |
|--------|------|------|------|------|--------|
| **ζ线: 强化学习** | Ch15 | Ch18 | 3 | ①MDP/DQN ②PPO/SAC/GRPO ③离线RL/RL+LLM交叉 | Agent(②→Ch18) |
| **η线: 多模态** | Ch15 | Ch18 | 3 | ①CLIP/BLIP/Q-Former ②LLaVA/指令微调 ③DALL-E3/SD3/Sora | 视频理解(②→Ch18)、具身智能(③→Ch18) |

---

## 交叉连接

> 分支与分支之间可以互跳。这些连接在文章中通过 `::: tip 交叉连接` 块标注。

| 从 | 到 | 理由 |
|----|-----|------|
| 对比学习深入(ε-1) | ViT | DINO 用 ViT 做对比自蒸馏 |
| Mamba/SSM | Titans | 两者都是 Attention 替代方案 |
| 因果ML | AI安全 | 因果盲症是错位/幻觉的根因 |
| JEPA | 神经符号AI | RiJEPA = JEPA + 符号逻辑 |
| AI安全 | 机制可解释性 | SAE 是检测错位的工具 |
| 知识蒸馏 | 推理部署 | 蒸馏模型是部署优化的前置 |

---

## 统计

| 类型 | 数量 | 说明 |
|------|------|------|
| 主线 (Golden Path) | **13 章** | 最小必读 |
| 分支链 | **20 条** | 其中 12 条多篇(2-4篇)，8 条单篇 |
| 分支链内子分支 | **9 条** | 从分支链中途分叉 |
| 分支文章总数 | **~55 篇** | 全部主线+分支+子分支 |
| 交叉连接 | **6 条** | 分支间互跳 |
| 收束点 | **2 个** | Ch11(注意力) + Ch18(Steins Gate) |

---

## 阅读路径示例

```mermaid
graph TB
    classDef main fill:#1a1a2e,color:#ffd700,stroke:#ffd700,stroke-width:2px
    classDef branch fill:#2a1a0d,color:#ffd4a8,stroke:#f59e0b,stroke-width:1px

    subgraph 极简路线 [Golden Path: 13章]
        direction LR
        G1["0→1→2→3→4"]:::main --> G2["5 CNN"]:::main --> G3["8 Trans."]:::main --> G4["11 ⚡"]:::main --> G5["12→13→14→15"]:::main --> G6["18 ◆"]:::main
    end

    subgraph 视觉+生成 [γ线深度: +7篇]
        direction LR
        V1["...→8"]:::main --> V2["γ-1 VAE"]:::branch --> V3["γ-2 GAN"]:::branch --> V4["γ-3 Diff."]:::branch --> V5["γ-4 FM"]:::branch --> V6["11 ⚡"]:::main
    end

    subgraph 序列线 [β线+SSL: +6篇]
        direction LR
        S1["...→4"]:::main --> S2["β-1 RNN"]:::branch --> S3["β-2 GRU"]:::branch --> S4["β-3 Attn起源"]:::branch --> S5["8 Trans."]:::main --> S6["ε-1 对比"]:::branch --> S7["ε-2 DINO"]:::branch --> S8["ε-3 MAE"]:::branch --> S9["11 ⚡"]:::main
    end

    subgraph 全收集 [所有分支: ~55篇]
        direction LR
        direction LR
        F1["..."]:::main --> F2["全部主线"]:::main
        F2 --> F3["+20条分支链"]:::branch
        F3 --> F4["+9条子分支"]:::branch
        F4 --> F5["+6条交叉"]:::branch
    end
```

---

## 与 v3 的核心差异

| v3 | v4 |
|----|----|
| 19章主线，读者不知道怎么走 | **13章 Golden Path** 清晰标注 |
| 每分支 = 1篇文章 | 分支链 = **1-4篇**，链内可再分叉 |
| 分支之间无连接 | **6条交叉连接**，分支间可互跳 |
| Ch5/6/7都是主线 | 只有 **Ch5(CNN) 是主线**，RNN/GNN降为分支链 |
| Ch9/10/16/17是主线 | **全部降为分支链**，主线更精简 |
| 分支全从主线出 | 分支可从**分支链中途**分叉 |
