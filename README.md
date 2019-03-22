## Made 

Made(**Ma**rkdown Sli**de**),一个简单的Markdown幻灯片应用，基于[**electron**](https://github.com/electron/electron)开发。

[![Build Status](https://travis-ci.org/pipiliang/made.svg?branch=master)](https://travis-ci.org/pipiliang/made)  [![Build status](https://ci.appveyor.com/api/projects/status/j9pljllxa7q4ehx9?svg=true)](https://ci.appveyor.com/project/pipiliang/made)  [![Code Climate](https://codeclimate.com/github/pipiliang/made/badges/gpa.svg)](https://codeclimate.com/github/pipiliang/made)  [![npm](https://img.shields.io/npm/l/express.svg)](https://github.com/pipiliang/made/blob/master/LICENSE)

- github： [https://github.com/pipiliang/made](https://github.com/pipiliang/made)
- oschina：[https://git.oschina.net/liangw/made](https://git.oschina.net/liangw/made)

## 使用说明

**Made**支持两种运行方式：
- Chrome扩展应用

![](http://git.oschina.net/uploads/images/2017/0407/230058_52a39095_856793.png "在这里输入图片标题")
- Electron应用

![](http://git.oschina.net/uploads/images/2017/0114/165416_30101a16_856793.png "在这里输入图片标题")

### 安装

Chrome扩展应用，下载源码通过开发者模式安装Chrome扩展

Electron应用，目前支持Windows、Ubuntu，[下载](https://github.com/pipiliang/made/releases)对应zip解压即可使用


### 写幻灯片
使用`---`做分页符
```
# Slide 1 : A markdown slide application.

---

# Slide 2 

```

## 开发环境

### 环境搭建
获取项目
```
git clone git@github.com:pipiliang/made.git
```
在项目根目录，使用npm安装electron
```
cd made
```
安装依赖
```
npm i
```
如果无法安装，可以使用taobao镜像
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```
```
cnpm install
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
使用vscode调试模式便可进行调试，应用内部调试也可使用开发者工具，快捷键`F8`

### 打包
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
- **jquery**