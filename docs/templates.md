# starter 介绍

管理后台渐进式升级 vue3 ts monorepo 

## 微应用架构

分成主应用+微应用架构，

1. 渲染问题

2. 微应用之间通信，状态保存问题

3. 打包部署问题

## 主应用

1. 微应用编排
2. 微应用部署
3. 主应用需要解决的问题

## 微应用

### 技术栈

1. vue3 + setup api
2. vite
3. element plus
4. vue-use, 
5. axios, useRequest, nprogress
6. vuex vue-router
7. typescript: auto import

### 特点

1. 自动的类型声明
2. 全局tree shaking 组件库
3. esm 导出 build
4. 渐进式 ts, composition-api
5. 自带utils，完全的单元测试

## shared app

1. 共享二次封装组件库
2. 共享 utils 工具方法
3. axios 请求