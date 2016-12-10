![](http://git.oschina.net/uploads/images/2016/1126/141745_d4135c13_856793.png) 
## A markdown slide application.
---

# Sample - List

Instance Events:
- page-title-updated
- unresponsive
- responsive
- blur
- ...

Static Methods:
1. BrowserWindow.getAllWindows()
2. BrowserWindow.getFocusedWindow()
3. BrowserWindow.fromWebContents(webContents)
4. ...

---

# Sample - code

单行代码：

`public class DslTemplateService implements TemplateService {}`

多行代码

```
// In the main process.
const {BrowserWindow} = require('electron')

// Or use `remote` from the renderer process.
// const {BrowserWindow} = require('electron').remote

let win = new BrowserWindow({width: 800, height: 600})
win.on('closed', () => {
  win = null
})
```

