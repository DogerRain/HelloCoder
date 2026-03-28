## 背景

公司在多个可用区自建机房，为满足内部资源统一纳管及对外提供云服务的能力，主导将自建机房改造为公有云平台，面向第三方企业提供标准云产品与底层云底座能力。

## 核心职责与成果

- **云产品体系建设**：主导设计并落地了涵盖 **ACK 容器服务、CICD 流水线发布平台、RDS（Redis/MySQL/Elasticsearch/ClickHouse）、RMQ（RocketMQ/Kafka/RabbitMQ）、可观测（类似 ARMS）、监控大盘与告警、ECS 虚拟机、ALB 微服务网关** 等完整云产品矩阵，支撑用户按需购买与自助使用。
- **云底座能力构建**：基于 **K8s 与 OpenStack** 构建统一资源池，实现 **网络隔离、租户鉴权、规格划分、资源池管理、计费与账单系统、云管后台** 等底层能力，保障平台多租户隔离、高可用与可扩展性。
- **多可用区高可用架构**：利用多可用区自建机房资源，设计并落地 **跨可用区容灾与调度机制**，确保云服务在单可用区故障时仍具备持续服务能力。
- **统一网关与可观测性**：构建 **统一网关路由与鉴权体系**，集成 **告警引擎与可观测平台**，实现对全链路服务状态、资源使用、业务指标的实时监控与智能告警。

## 项目价值

- 成功将自建机房能力产品化，形成标准公有云服务体系，支持多租户接入与按量计费。
- 提升了资源利用率与运维效率，实现 **基础设施即服务（IaaS）+ 容器平台（PaaS）+ 数据与中间件服务** 的全栈云能力输出。
- 为公司在云服务商业化方向上奠定坚实基础，支撑多个外部企业客户平稳上云。





### “做平台”如何上升到“如何规模化交付云产品”？

公有云子产品

![](http://rainyudianxx.baimuxym.cn/HelloCoder/blog/image-20260313110217877.png)

可观测：

![](http://rainyudianxx.baimuxym.cn/HelloCoder/blog/image-20260313105507071.png)



![](http://rainyudianxx.baimuxym.cn/HelloCoder/blog/image-20260313110311454.png)





![](http://rainyudianxx.baimuxym.cn/HelloCoder/blog/image-20260313171311917.png)

![](http://rainyudianxx.baimuxym.cn/HelloCoder/blog/image-20260313171427255.png)