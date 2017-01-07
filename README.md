## Made 

一个简单的Markdown幻灯片应用，基于[**electron**](https://github.com/electron/electron)开发。

[![Build Status](https://travis-ci.org/pipiliang/made.svg?branch=master)](https://travis-ci.org/pipiliang/made)  [![codecov](https://codecov.io/gh/pipiliang/made/branch/master/graph/badge.svg)](https://codecov.io/gh/pipiliang/made)  [![Code Climate](https://codeclimate.com/github/pipiliang/made/badges/gpa.svg)](https://codeclimate.com/github/pipiliang/made)  [![npm](https://img.shields.io/npm/l/express.svg)](https://github.com/pipiliang/made/blob/master/LICENSE)

github： [https://github.com/pipiliang/made](https://github.com/pipiliang/made)
oschina：[https://git.oschina.net/liangw/made](https://git.oschina.net/liangw/made)

## 使用说明

### 安装

目前支持Windows、Ubuntu，[点击下载](https://github.com/pipiliang/made/releases)对应zip解压即可使用


### 写幻灯片
```
![](http://git.oschina.net/uploads/images/2016/1126/141745_d4135c13_856793.png) 
## A markdown slide application.

---

# List

Events:
- click
- blur

```

## 开发环境

### 环境搭建
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
```
```
cnpm install --save-dev electron
```

### 启动
在根目录下，执行以下命令
```
npm start
```

### 调试

使用vscode开发和调试，在.vscode目录下创建`launch.json`文件，内容如下
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
使用vscode调试模式便可进行调试，应用内部调试也可使用开发者工具，快捷键`F8`，頁面刷新`F5`

### 打包

安装依赖
```
npm install
```
默认打包Linux版本
```
gulp pack
```
打包Windows版本
```
gulp pack --platform win32
```

## 依赖

- [**electron**](https://github.com/electron/electron)
- [**CodeMirror**](http://codemirror.net/)
- [**marked**](https://github.com/chjj/marked)
- [**FontAwesome**](http://fontawesome.io/)