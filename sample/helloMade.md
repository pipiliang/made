# Made 
***
### A markdown slide presentation application.

|功能项|描述|
|----|:----|
|演示|`F7` 支持全屏演示|
|显示页号|`P` 显示或者隐藏页号|
|退出|`ESC` 退出全屏|
|调试模式|`F8` 调试APP|

create by [liangwei](https://github.com/pipiliang)

---
# 特性
- 使用`Markdown`写幻灯片
- 支持全屏演示
- 支持实时预览
- 跨平台，支持`Windows`和`Linux`
- 可演示Wiz笔记

---

# 例子

一个邻居的文章

>我的父母坐在飞机上，见了谁都报之以拙朴的微笑。他们打草香泥腥的乡土而来，误入灯红酒绿人模人样的城市,自觉的卑微到尘埃里，不开一朵花，也不发一个芽儿，像是犯了什么错。

---

# 例子

```
// In the main process.
const {BrowserWindow} = require('electron')

let win = new BrowserWindow({width: 800, height: 600})
win.on('closed', () => {
  win = null
})
```