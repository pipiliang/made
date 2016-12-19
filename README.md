## Made 
**Markdown幻灯片应用**

![输入图片说明](http://git.oschina.net/uploads/images/2016/1216/172110_923f2fb4_856793.png "在这里输入图片标题")

## 使用说明
### 安装

- Windows
- Ubuntu


### 写幻灯片
```
![](http://git.oschina.net/uploads/images/2016/1126/141745_d4135c13_856793.png) 
## A markdown slide application.

---

# Sample - List

Events:
- click
- blur
- ...

```

## 开发环境

### electron安装
获取项目
```
git clone git@github.com:pipiliang/made.git
```
在项目根目录，使用npm安装electron
```
npm install --save-dev electron
```
如果无法安装，可以使用taobao镜像
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install --save-dev electron
```

### 启动Made
在项目根目录下，执行以下命令
```
electron .
```
或
```
npm start
```

### 调试

使用vs code开发和调试，在.vscode目录下创建`launch.json`文件，内容如下
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Electron",
            "type": "node",
            "request": "launch",
            "cwd": "${workspaceRoot}",
            "runtimeExecutable": "/usr/local/bin/electron",
            "program": "${workspaceRoot}/app.js"
        }
    ]
}
```
根据实际情况配置参数，使用vscode调试模式便可进行调试，应用内部调试也可使用开发者工具，快捷键`F8`

### 打包

使用asar进行打包，安装asar
```
npm install -g asar
```
打包应用，在项目根目录执行asar
```
asar pack . app.asar
```

### 发布

安装electron-packager
```
npm install --save-dev electron-packager
```
在项目根目录执行
```
npm run-script packager
```

## 使用开源组件

- Markdown使用[**marked**](https://github.com/chjj/marked)解析
- 基于[**electron**](https://github.com/electron/electron)开发