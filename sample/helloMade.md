![](http://git.oschina.net/uploads/images/2016/1126/141745_d4135c13_856793.png) 
## A markdown slide presentation application.
---

# 飞机上的父母

一个邻居的文章

>我的父母坐在飞机上，见了谁都报之以拙朴的微笑。他们打草香泥腥的乡土而来，误入灯红酒绿人模人样的城市,自觉的卑微到尘埃里，不开一朵花，也不发一个芽儿，像是犯了什么错。

---

# Sample - List

Instance Events:
- click
- blur

Static Methods Of BrowserWindow:
1. getAllWindows()
2. getFocusedWindow()
3. fromWebContents(webContents)

---

# Sample - code

单行代码：

`const {BrowserWindow} = require('electron')`

多行代码

```
// In the main process.
const {BrowserWindow} = require('electron')

let win = new BrowserWindow({width: 800, height: 600})
win.on('closed', () => {
  win = null
})
```