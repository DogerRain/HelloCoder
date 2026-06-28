---
title: Hermes多agent设置
date: 2026-06-21 23:40:20
lock: false
permalink: /pages/Hermes%E5%A4%9Aagent%E8%AE%BE%E7%BD%AE
categories:
  - 随笔
  - AI相关
tags:
  - Hermes
  - agent
  - 设置
---
Hermes Agent 在运行时极其依赖它在宿主机上生成的配置文件、长期记忆数据库（FTS5 全文检索）以及本地 Skills 缓存。如果都在同一台机器上直接裸跑，由于它们默认都会去读写 `~/.hermes` 目录，必然会导致配置冲突、Token 覆盖以及多租户数据污染。



所以默认的Hermes Agent 在运行的时候，区分不同的配置文件是很重要的。



就像你在使用deepseek一样，所有东西都通过一个对话，难免会产生混乱和污染，分工明细让每个对话处理特定的事情，才是最好的。



通过 Docker 隔离部署，你可以为每一个飞书机器人（Bot）创建一套完全独立的容器环境，实现**配置隔离、数据隔离和环境隔离**。



本文将介绍一下如何使用飞书接入多个 Hermes agent，并使用一个agent指挥它们干活。

> Hermes Agent版本： v0.16.0 (2026.6.5) 



## 1、先设置一个agent

首先，我们模拟启动一个Hermes agent，因为不同的模型，它的配置可能不一样。

> 我在这里踩了不少坑，不同的模型其实它的key是不一样的，我也不懂为什么



启动命令：

```bash
docker run -it - d \
  -v /data/hermes/bot_base:/opt/data \
  --name hermes-docker-base \
  nousresearch/hermes-agent:latest
```



进入终端：

```bash
 docker exec -it hermes-docker-base sh
```

输入

```bash
hermes setup
```



选择`Full setup`， `Quick Setup`   这里选择 `Custom` 倒数第四个。

```bash
How would you like to set up Hermes?
  ↑↓ navigate  ENTER/SPACE select  ESC cancel

   (●) Quick Setup (Nous Portal) — free OAuth login, no API keys, model + tools (recommended)
 → (○) Full setup — configure every provider, tool & option yourself (bring your own keys)
 
 Select provider:
  ↑↓ navigate  ENTER/SPACE select  ESC cancel

   (○) Nous Portal (Everything your agent needs, 300+ models with bundled tool use)
   (○) OpenRouter (Pay-per-use API aggregator)
   (○) NovitaAI (Cloud: Model API, Agent Sandbox, GPU Cloud)
   (○) LM Studio (Local desktop app with built-in model server)
   (○) Anthropic (Claude models via API key or Claude Code)
   (○) OpenAI ▸ (Codex CLI or direct OpenAI API)
   (○) Qwen Cloud / DashScope (Qwen + multi-provider)
   (○) xAI Grok ▸ (Direct API or SuperGrok / Premium+ OAuth)
   (○) Xiaomi MiMo (MiMo-V2.5 and V2 models: pro, omni, flash)
   (○) Tencent TokenHub (Hy3 Preview via tokenhub.tencentmaas.com)
   (○) NVIDIA NIM (Nemotron models via build.nvidia.com or local NIM)
   (○) GitHub Copilot ▸ (GitHub token API or copilot --acp process)
   (○) Hugging Face Inference Providers
   (○) Google Gemini ▸ (AI Studio API or OAuth + Code Assist)
   (○) DeepSeek (V3, R1, coder, direct API)
   (○) Z.AI / GLM (Zhipu direct API)
   (○) Kimi / Moonshot ▸ (Coding Plan, Moonshot global & China endpoints)
   (○) StepFun Step Plan (Agent / coding models via Step Plan API)
   (○) MiniMax ▸ (Global, OAuth Coding Plan & China endpoints)
   (○) Ollama Cloud (Cloud-hosted open models, ollama.com)
   (○) Arcee AI (Trinity models, direct API)
   (○) GMI Cloud (Multi-model direct API)
   (○) Kilo Code (Kilo Gateway API)
   (○) OpenCode ▸ (Zen pay-as-you-go or Go subscription)
   (○) AWS Bedrock (Claude, Nova, Llama, DeepSeek; IAM or API key)
   (○) Azure Foundry (OpenAI-style or Anthropic-style endpoint, your Azure AI deployment)
   (○) Qwen OAuth (Reuses local Qwen CLI login)
   (○) Alibaba Cloud Coding Plan (Dedicated coding tier)
   	(●) custom (direct API)
   (○) Custom endpoint (enter URL manually)
   (○) Configure auxiliary models...
   (○) Leave unchanged
```

输入你的模型key，api 地址。



配置完毕后，后面根据自己的需要自己配置，一般直接跳过即可。



启动后，显示





### config.yaml 配置



最终你可以把 `/data/hermes/bot_base/config.yaml` 的文件内容保存下来，文件太长了下面这几个是重要的：

```yaml
model:
  default: mimo-v2.5
  provider: custom
  base_url: https://token-plan-cn.xiaomimimo.com/v1
  api_key: tp-
```



#### 命令执行模式

```yaml
  approvals:
  	mode: off    # manual | smart | off
```

命令执行模式可以自行指定。

| 模式               | 行为                                                         |
| ------------------ | ------------------------------------------------------------ |
| **manual**（默认） | 始终提示用户审批危险命令                                     |
| **smart**          | 使用辅助 LLM 评估风险。低风险命令（如 `python -c "print('hello')"` ）自动批准，真正危险的命令自动拒绝，不确定的情况升级为手动提示。 |
| **off**            | 禁用所有审批检查——等同于使用 `--yolo` 运行。所有命令无需提示即可执行。 |

如果是manual，会弹出 `Command Approval Required`，你需要点击运行才能运行。

![](http://rainyudianxx.baimuxym.cn/hellocoder/image-20260612212653141.png)



#### 队列 vs 中断 vs 引导

默认情况下，向繁忙的 agent 发送消息会中断它。另有两种模式可用：

- `queue` — 后续消息等待，在当前任务完成后作为下一轮运行。
- `steer` — 后续消息通过 `/steer` 注入当前运行，在下一次工具调用后到达 agent。不中断，不开新轮次。如果 agent 尚未开始，则回退为 `queue` 行为。

```yaml
display:
  busy_input_mode: queue   # 或 steer，或 interrupt（默认）
```



## 2、飞书机器人权限

在飞书的后台 [https://open.feishu.cn/app](https://open.feishu.cn/app)， 创建自己智能体。

![](http://rainyudianxx.baimuxym.cn/hellocoder/image-20260613113553066.png)



特别注意的是智能体权限，可以参考我的，一键复制导入：

```json
{
  "scopes": {
    "tenant": [
      "application:application:self_manage",
      "application:bot.menu:write",
      "cardkit:card:read",
      "cardkit:card:write",
      "contact:contact.base:readonly",
      "docs:document.comment:create",
      "docs:document.comment:delete",
      "docs:document.comment:read",
      "docs:document.comment:update",
      "docs:document.comment:write_only",
      "docx:document.block:convert",
      "docx:document:create",
      "docx:document:readonly",
      "docx:document:write_only",
      "drive:drive.metadata:readonly",
      "im:chat.members:bot_access",
      "im:chat:read",
      "im:chat:readonly",
      "im:chat:update",
      "im:message.group_at_msg:readonly",
      "im:message.p2p_msg:readonly",
      "im:message.pins:read",
      "im:message.pins:write_only",
      "im:message.reactions:read",
      "im:message.reactions:write_only",
      "im:message:readonly",
      "im:message:recall",
      "im:message:send_as_bot",
      "im:message:send_multi_users",
      "im:message:send_sys_msg",
      "im:message:update",
      "im:resource"
    ],
    "user": [
      "contact:user.employee_id:readonly",
      "offline_access"
    ]
  }
}
```



## 3、一个agent一个网关

要让各自的 profile 各自管理，核心在于**将宿主机上不同的数据目录，挂载到对应容器的 `/opt/data`（或内定数据目录）中**。

我们可以通过多套环境变量和目录来实现：

```shell
宿主机挂载点                         Docker 容器
/data/hermes/bot_A  =========>  [ Container: hermes-bot-a ] (接入飞书 A)
/data/hermes/bot_B  =========>  [ Container: hermes-bot-b ] (接入飞书 B)
```



**Hermes 读取配置的优先级是**：`.env` 文件中的环境变量 > `config.yaml` 中的配置项 > 内置默认值。密钥一律放在 `.env` 中，不要直接写在 `config.yaml` 里，以防文件被意外分享或上传到公开仓库。



但是我不搞这么复杂了，直接配置在 `config.yaml`，把上面的配置文件放在 `/data/hermes/config.yaml`



使用 docker compose 指定多个飞书机器人，`docker-compose.yaml` 文件如下

```yaml
services:
  # 飞书 Bot A：HR 助手
  hermes-docker-A:
    image: nousresearch/hermes-agent:latest
    container_name: hermes-docker-A
    restart: unless-stopped
    command: gateway run
    ports:
      - "8643:8642" # 宿主机端口改到 8643，避免和 Bot A 冲突
      - "9120:9119" # Dashboard 宿主机端口改到 9120
    volumes:
      - /data/hermes/bot_A:/opt/data
      - /data/hermes/config.yaml:/opt/data/config.yaml   # 挂载主配置
      - /data/hermes/.env:/opt/data/.env
      - /mnt:/mnt                                        # 挂载win本地挂载盘
    environment:
      - HERMES_DASHBOARD=1 # 建议开启，方便可视化管理
      - HERMES_DASHBOARD_INSECURE=1
      - FEISHU_CONNECTION_MODE=websocket
      - FEISHU_AUTO_APPROVE=true
      # 💥 填入 HR 助手的飞书身份证
      - FEISHU_APP_ID=cli_a96a11b732781bd3         # 填 HR 的 App ID
      - FEISHU_APP_SECRET=fqzlnhmtUUG6oMH78zfvIgMpJvzv0460    # 填 HR 的 App Secret

    deploy:
      resources:
        limits:
          memory: 4G  # 限制资源，防止失控
          cpus: "2.0"

  # 飞书 Bot B：技术支持助手
  hermes-docker-B:
    image: nousresearch/hermes-agent:latest
    container_name: hermes-docker-B
    restart: unless-stopped
    command: gateway run
  
    ports:
      - "8644:8642" # 宿主机端口改到 8643，避免和 Bot A 冲突
      - "9121:9119" # Dashboard 宿主机端口改到 9120
      - "3001:3001" # 
      - "5174:5174" # 
    volumes:
      - /data/hermes/bot_B:/opt/data
      - /data/hermes/config.yaml:/opt/data/config.yaml   # 挂载主配置
      - /data/hermes/.env:/opt/data/.env
      - /mnt:/mnt
    environment:
      - HERMES_DASHBOARD=1
      - HERMES_DASHBOARD_INSECURE=1
      - FEISHU_CONNECTION_MODE=websocket
      - FEISHU_AUTO_APPROVE=true
      # 💥 填入 HR 助手的飞书身份证
      - FEISHU_APP_ID=cli_a96a1704aa399bc0         # 填 HR 的 App ID
      - FEISHU_APP_SECRET=cOGsrdYXjEh2hcmByKkuMbK3cqfcPNAN    # 填 HR 的 App Secret

    deploy:
      resources:
        limits:
          memory: 4G
          cpus: "2.0"
          
  hermes-docker-manager:
    image: nousresearch/hermes-agent:latest
    container_name: hermes-docker-manager
    restart: unless-stopped
    command: gateway run
    network_mode: "host" # 使用 host 模式
    volumes:
      - /data/hermes/bot_manager:/opt/data
      - /data/hermes/config.yaml:/opt/data/config.yaml   # 挂载主配置
      - /data/hermes/.env:/opt/data/.env
      - /mnt:/mnt
    environment:
      - HERMES_DASHBOARD=1
      - HERMES_DASHBOARD_INSECURE=1
      - FEISHU_CONNECTION_MODE=websocket
      - FEISHU_AUTO_APPROVE=true
      # 💥 飞书身份证
      - FEISHU_APP_ID=cli_a92eef29c8389cd2         # 填 HR 的 App ID
      - FEISHU_APP_SECRET=NBNAIbjEo1uIcW5Ae1mHQdBsRl2dBHgb    # 填 HR 的 App Secret
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: "2.0"          
```



你喜欢建多少个都可以。



## 4、启动

重启docker

```shell
docker compose down && docker compose -f docker-compose.yaml up -d
```

拉取 `nousresearch/hermes-agent:latest` 镜像可能存在网络问题，需要注意一下。

输出：

```shell
root@HelloCoder:/data/hermes# docker compose -f docker-compose.yaml  up -d
WARN[0000] /data/hermes/docker-compose.yaml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion
[+] up 31/35
 ⠏ Image nousresearch/hermes-agent:latest [⣿⣿⣿⣿⣄⣿⣿⣿⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿] 615.4MB / 1.143GB Pulling           19.0s
[+] up 38/38
 ✔ Image nousresearch/hermes-agent:latest Pulled                                                                   82.1s
 ✔ Network hermes_default                 Created                                                                  0.4s
 ✔ Container hermes-docker-B              Started                                                                  2.7s
 ✔ Container hermes-docker-A              Started                                                                  2.3s                                                      2.3s
```

可以看到这两个镜像已经拉起来了。



可以使用`docker ps -a`命令看看：

```shell
root@HelloCoder:/data/hermes# docker ps -a
CONTAINER ID   IMAGE                              COMMAND                  CREATED          STATUS          PORTS                                                                                      NAMES
d76af87ff77a   nousresearch/hermes-agent:latest   "/init /opt/hermes/d…"   53 minutes ago   Up 53 minutes   0.0.0.0:8642->8642/tcp, [::]:8642->8642/tcp, 0.0.0.0:9119->9119/tcp, [::]:9119->9119/tcp   hermes-docker-A
15e09f30b61f   nousresearch/hermes-agent:latest   "/init /opt/hermes/d…"   53 minutes ago   Up 53 minutes   0.0.0.0:8643->8642/tcp, [::]:8643->8642/tcp, 0.0.0.0:9120->9119/tcp, [::]:9120->9119/tcp   hermes-docker-B
```





那么我们现在回到飞书，首次和机器人对话，它会弹出一个配对码：



![](http://rainyudianxx.baimuxym.cn/hellocoder/image-20260611210911656.png)



我们去对应的终端里面执行即可，**千万不要搞错了agent**

1. 进入终端

   ```
    docker exec -it hermes-docker-A sh
   ```

2. 执行配对码

   ```
   hermes pairing approve feishu HGEHME62
   ```

   

```shell
root@HelloCoder:/data/hermes# docker exec -it hermes-docker-A sh
# hermes pairing approve feishu HGEHME62

  Approved! User ou_ff36dd8afd2342821df9bb3de442e3a9 on feishu can now use the bot~
  They'll be recognized automatically on their next message.
```



再回到对话框，就可以了：

 ![](http://rainyudianxx.baimuxym.cn/hellocoder/image-20260612124430887.png)





agentB 同理。





## 注意点

- docker 挂载的问题，如果你是要宿主机访问到docker里面的服务，记得要开启端口映射，同时要注意Hermes端口冲突问题
- 要访问你的宿主机，必须要挂载你的工作目录





