# V3 视频制作说明

视频基于 V2 可交互演示导出的 800 个已渲染动态帧（20 FPS、40 秒），使用色彩通道转换和暗部蓝色平衡进行品牌蓝白调色，并替换原有音轨为本次新合成的企业氛围配乐。与 V3 浏览器源文件相比，网络节点数量与交互行为未变；视频为演示用后期版本，不作为网页逐帧渲染的一致性依据。

FFmpeg 技术参数：

```text
-filter:v 'colorchannelmixer=rr=-0.2:rg=1.2:gr=0.45:gg=0.55:br=0.95:bb=0.05,colorbalance=bs=0.12:gs=0.02,eq=saturation=1.2:gamma=1.02'
-video libx264, 1280x800, 20 fps, 800 frames
-audio AAC 192 kb/s, AMBIENT 40.000 seconds
```
