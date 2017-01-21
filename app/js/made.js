"use strcit";
const electron = require('electron');
const {app, Menu, MenuItem, dialog, BrowserWindow, ipcMain, globalShortcut, shell, nativeImage} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

var Made = {
  startup: function () {
    let mainWindow

    app.on('ready', () => {
      console.log("current platform : " + process.platform)
      mainWindow = WindowMediator.createNew()
      ShortCutRegister.instance().reg()
      MenuBuilder.windowIs(mainWindow).createMenu()
      MessageMediator.windowIs(mainWindow).listen()
    })

    app.on('window-all-closed', () => { if (process.platform !== 'darwin') { app.quit() } })
    app.on('activate', () => { if (mainWindow === null) { mainWindow = MainWindow.creatNew() } })
  }
};

var ShortCutRegister = {
  instance: () => {
    var register = {}
    register.reg = () => {
      let win = BrowserWindow.getFocusedWindow();
      if (!win) return
      globalShortcut.register('F8', () => { win.webContents.toggleDevTools() })
      globalShortcut.register('F5', () => { win.reload() })
    }
    return register
  }
}

var loadUrl = function (win, u) {
  win.loadURL(url.format({ pathname: path.join(__dirname, u), protocol: 'file:', slashes: true }));
}

var WindowMediator = {
  createNew: () => {
    icon = nativeImage.createFromPath(path.join(__dirname, '../images/made.png'))
    var win = new BrowserWindow({ width: 1000, height: 685, minWidth: 500, minHeight: 300, icon: icon, frame: true })
    loadUrl(win, './../main.html');

    win.on('closed', function () { win = null; })

    win.on('close', function (e) {
      var sel = MessageBoxCamp.confirmQuit(win);
      if (sel === 1) {
        e.preventDefault();
      }
    })

    return win
  }
}

var MessageMediator = {
  windowIs: (win) => {
    var mediator = {}

    var send = (cmd, arg) => { win.webContents.send(cmd, arg) }

    mediator.send = (cmd, arg) => { send(cmd, arg) }

    mediator.listen = () => {
      ipcMain.on('asynchronous-message', (event, arg) => {
        switch (arg[0]) {
          case "showLineNumbers":
            send('editor-showLineNumbers', arg[1])
            break
        }
        event.sender.send('asynchronous-reply', 'success')
      })
    }

    return mediator
  }
}

var MenuBuilder = {
  windowIs: (mainWindow) => {
    var builder = {}
    builder.createMenu = () => {
      var fileDlg = FileDialog.new(mainWindow)
      var msgMediator = MessageMediator.windowIs(mainWindow)
      const template = [{
        label: '文件', submenu: [
          { label: "新建", accelerator: 'Ctrl+N', click() { shell.openItem(app.getPath("exe")) } },
          { label: "打开...", accelerator: 'Ctrl+O', click() { fileDlg.openFile() } },
          { label: "最近使用的", submenu: [{ label: "清除", enabled: false, click() { RecentFiles.clear() } }] },
          { type: 'separator' },
          { label: "保存", accelerator: 'Ctrl+S', click() { fileDlg.saveFile(false) } },
          { label: "另存为...", click() { fileDlg.saveFile(true) } },
          { type: 'separator' },
          // { label: '偏好设置', click() { PreferencesWindow.show(mainWindow) } },
          // { type: 'separator' },
          { label: "退出", role: "quit" }]
      },
        {
          label: '编辑', submenu: [
            { label: '撤销', click() { msgMediator.send("edit", "undo") }, accelerator: 'Ctrl+Z' },
            { label: '重做', click() { msgMediator.send("edit", "redo") }, accelerator: 'Ctrl+Shift+O' },
            { type: 'separator' },
            { label: '剪切', role: "cut", accelerator: 'Ctrl+X' },
            { label: '复制', role: "copy", accelerator: 'Ctrl+C' },
            { label: '粘贴', role: "paste", accelerator: 'Ctrl+V' },
            { label: '删除', click() { msgMediator.send("edit", "delCharBefore") }, accelerator: 'Delete' },
            { type: 'separator' },
            { label: '全选', click() { msgMediator.send("edit", "selectAll") }, accelerator: 'Ctrl+A' }]
        },
        {
          label: '视图', submenu: [
            { label: '演示模式', accelerator: 'F7', click() { msgMediator.send("view", "showslide") } },
            { label: '全屏', click() { mainWindow.setFullScreen(!mainWindow.isFullScreen()) } }]
        },
        {
          label: '帮助', submenu: [
            {
              label: '样例', submenu: [
                { label: 'Hello Made', click() { msgMediator.send('open', app.getAppPath() + "/sample/helloMade.md") } }]
            },
            { type: 'separator' },
            { label: 'Made首页', click() { shell.openExternal('https://github.com/pipiliang') } },
            { label: '关于', click() { MessageBoxCamp.showAbout(mainWindow) } }]
        }]

      Menu.setApplicationMenu(Menu.buildFromTemplate(template));
      RecentFiles.load(mainWindow);
    }
    return builder
  }
}

var FileDialog = {
  new: (parent) => {
    var msgMediator = MessageMediator.windowIs(parent)
    var filePath = null;
    var dlg = {}
    dlg.openFile = () => {
      dialog.showOpenDialog(parent, {
        properties: ['openFile'],
        filters: [{ name: 'Made Files', extensions: ['md'] }],
        title: "打开"
      }, openCallBack)
    }

    dlg.saveFile = (saveAs = false) => {
      if (filePath === null || saveAs) {
        filePath = dialog.showSaveDialog(parent, { title: saveAs ? "另存为" : "保存", filters: [{ name: 'Made File', extensions: ['md'] }] })
        parent.setTitle("Made - " + filePath)
      }
      if (filePath != null) {
        console.log("save file > " + filePath)
        msgMediator.send('save', filePath)
      }
    }

    var openCallBack = (filePaths) => {
      if (filePaths != null && filePaths.length > 0) {
        filePath = filePaths[0]
        console.log("open file > " + filePath)
        msgMediator.send('open', filePath)
        parent.setTitle("Made - " + filePath)
        RecentFiles.add(filePath);
      }
    }

    return dlg
  }
}

var MessageBoxCamp = {
  showAbout: (parent) => {
    dialog.showMessageBox(parent, {
      type: "info", buttons: ['OK'], title: "Made",
      detail: "版本  : 0.0.1\n"
      + "Node.js : " + process.versions.node + "\n"
      + "Chromium: " + process.versions.chrome + "\n"
      + "Electron: " + process.versions.electron + "\n",
      message: "Made"
    })
  },
  confirmQuit: (parent, callBack = null) => {
    if (callBack === null)
      return dialog.showMessageBox(parent, { type: "question", buttons: ['确认', '取消'], title: "Made", message: '您确认退出Made？' })
    else
      return dialog.showMessageBox(parent, { type: "question", buttons: ['确认', '取消'], title: "Made", message: '您确认退出Made？' }, callBack)
  }
}

var PreferencesWindow = {
  show: (parent) => {
    var win = new BrowserWindow({
      width: 600, height: 400, parent: parent, modal: true, show: true, title: '偏好设置', resizable: false
    });
    win.setMenuBarVisibility(false);
    loadUrl(win, 'app/preferences.html');
  }
}

var RecentFiles = {
  clear: () => {
    //Utils.mkdir(Utils.getRecentDir())
    Utils.writeRecent(Utils.getRecentPath(), JSON.stringify({ "open": [] }));
    var recentSubmenu = RecentFiles.recentMenu()
    recentSubmenu.clear()
    recentSubmenu.append(new MenuItem({ label: "清除", enabled: false, click() { RecentFiles.clear() } }));
  },

  add: (path) => {
    var max = 10;
    if (!Utils.existsSync(Utils.getRecentPath())) {
      Utils.mkdir(Utils.getRecentDir())
      Utils.writeRecent(Utils.getRecentPath(), JSON.stringify({ "open": [] }));
    }
    var json = Utils.readRecent(Utils.getRecentPath())
    var recent = JSON.parse(json);
    var files = recent.open;
    if (files.length === 10) {
      files.shift();
    }
    files.push({ "path": path })
    Utils.mkdir(Utils.getRecentDir())
    Utils.writeRecent(Utils.getRecentPath(), JSON.stringify(recent));
  },

  load: (win) => {
    function invertedInsert(pos, item) {
      recentSubmenu.insert(recentSubmenu.items.length - pos, item);
    }

    if (Utils.existsSync(Utils.getRecentPath())) {
      var json = Utils.readRecent(Utils.getRecentPath())
      var recent = JSON.parse(json);
      var files = recent.open;

      var recentSubmenu = RecentFiles.recentMenu()
      if (files.length === 0) {
        recentSubmenu.items[0].enabled = false;
      } else {
        recentSubmenu.items[0].enabled = true;
        for (var i = 0; i < files.length; i++) {
          var p = files[i].path;
          invertedInsert(1, new MenuItem({
            label: p, click() {
              MessageMediator.windowIs(win).send('open', p)
              win.setTitle("Made - " + p)
            }
          }));
        }
        invertedInsert(1, new MenuItem({ type: 'separator' }));
      }
    }
  },

  recentMenu: () => {
    var menu = Menu.getApplicationMenu()
    var recentMenuItem = Menu.getApplicationMenu().items[0].submenu.items[2];
    return recentMenuItem.submenu;
  }
}

var Utils = {
  getRecentPath: () => {
    return Utils.getRecentDir() + "/recent.json";
  },

  getRecentDir: () => {
    return app.getPath("home") + "/.made";
  },

  mkdir: (path) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
      console.log('目录已创建成功\n');
    }
  },

  existsSync: (path) => {
    return fs.existsSync(path);
  },

  writeRecent: (path, content) => {
    fs.writeFileSync(path, content);
  },

  readRecent: (path) => {
    return fs.readFileSync(path)
  }
}

module.exports = Made;