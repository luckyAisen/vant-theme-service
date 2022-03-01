# vant-theme-service

### 简介

这是一个服务于 [vant-theme](https://github.com/Aisen60/vant-theme) 的 API 。用于将自定义组件的样式进行编译，并且返回编译过后的结果。该 API 支持 [Vant 2](https://vant-contrib.gitee.io/vant/v2/#/zh-CN/) 版本。

`Vant 3` 版本使用了 [CSS 变量](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties) 来组织样式，修改后的结果不需要通过后端的编译。

### 如何使用

```js
var myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')

var raw = JSON.stringify({
  '@red': '#35e483',
  '@button-primary-background-color': '#35e483'
})

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
}

fetch('https://vant-theme-service.vercel.app/api/update-theme', requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error))
```
