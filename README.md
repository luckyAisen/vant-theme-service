# vant-theme-service

### 简介

这是一个服务于 [vant-theme](https://github.com/Aisen60/vant-theme) 的 API 。用于将自定义组件的样式进行编译，并且返回编译过后的结果。该 API 支持 [Vant UI 2.x](https://vant-contrib.gitee.io/vant/#/zh-CN/) 版本。

`vant` 在 `3.x`版本使用了 [CSS 变量](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties) 来组织样式，修改后的结果不需要通过后端的编译。

### 如何使用

```json
{
  "url": {
    "raw": "https://vant-theme-service.vercel.app/update-theme",
    "protocol": "https",
    "host": ["vant-theme-service", "vercel", "app"],
    "path": ["update-theme"]
  },
  "method": "POST",
  "header": [],
  "body": {
    "mode": "raw",
    // "raw": "{\n    \"@red\": \"#ee0a24\"\n}",
    "raw": "{}",
    "options": {
      "raw": {
        "language": "json"
      }
    }
  }
}
```
