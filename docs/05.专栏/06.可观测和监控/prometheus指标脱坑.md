## 1、max



常见到的 gauge max 指标，只是表示一段时间内的最大值，一般都是 5 min 左右内的最大值，然后形成一个区间一个区间的点，这样才是符合prometheus的思想。

> 而不是一直都是最大值，这样的话就是一条趋势向上的线了，相当于累计值了

```
agent_redis_metrics_seconds_max{application="cloud-policy-web",exception="None",job="flyme-op/cloud-policy-web",redis_cmd="EXISTS",redis_host="10.128.9.100",redis_opt="other",redis_port="6378",redis_type="Redisson",tenant="flyme-op"} 0.049710105
```



最后上报的指标，很明细就是区间内 最大值：



![](./picture/image-20251023093543196.png)



## 2、increase vs increase_prometheus 



在数据点缺失的时候，如何解决单调递增的数量问题？



这就需要涉及到 **`increase_prometheus`**  函数了