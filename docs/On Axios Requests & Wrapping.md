## why axios？

前后端交互最常见的就是 `http` 请求，为了提高效率，需要对 `http` 请求进行封装，目前的现代开发过程中，可以使用 Axios，一种对于 `http` 请求的封装，或者是`fetch`，全新的异步请求`api`，本文主要是介绍我们项目中是如何根据后端返回的类型，对请求进行封装。

[Axios](https://www.axios-http.cn/) 是一个基于 promise 的网络请求库，可以用于浏览器和 `node.js`。`api` 简单，返回一个 `Promise` 对象，以供异步的处理。
[Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API) 提供了一个 JavaScript 接口，用于访问和操纵 `HTTP` 管道的一些具体部分，例如请求和响应。它还提供了一个全局 [fetch()](https://developer.mozilla.org/zh-CN/docs/Web/API/fetch) 方法，该方法提供了一种简单，合理的方式来跨网络异步获取资源。
事实上两种都可以，相信你看了这篇文章之后也可以自己封装一下 `fetch`，甚至可以使用适配器模式去一统两种 api。那下面就看看是怎么对 `axios` 进行封装的。

## Requests

首先先看看实际生产中，`axios` 需要做什么工作:

### 拦截器，错误处理

`axios` 在使用的过程中需要生成一个 `axiosBase` 实例，从开始发送请求到收到响应可以分成以下几个过程：

1. 发起请求 `axiosInstance.get()`
1. 进入请求拦截器 `axiosBase.interceptors.request.use(...requestIntercepter);`
1. (server) 服务端进行响应
1. 进入响应拦截器 `axiosBase.interceptors.response.use(responseIntercepter);`
1. 返回响应，在业务中进行使用。

可以看出除了请求和响应之外，`axios` 提供的最多的配置就是请求拦截和响应拦截，程序设计的目的就是写出可维护并且能复用的代码，因此在两个拦截器中类似管道做通用的处理。

### 请求和响应

1. 业务中常见的有 `GET/POST/PUT` 请求，`post` 请求又会根据 `content-type` 分成两种，针对这些变化的量，锚定住代码中不变的量，需要进行设计。
2. 在常见的业务中，可能会是使用 `access-token` 的方式进行鉴权，在请求的拦截器中，可以拿到 `config` 参数，可以添加认证信息
3. 对于返回的响应报文，由于一般的返回报文是一样的，在响应拦截器中对响应进行第一步的通用处理，减少业务端的重复代码。

### 业务异常 VS Http 异常

响应拦截中，最常见的就是对异常情况进行处理，由于 `axios` 返回的是一个 `Promise`对象，因此要对返回的结果进行处理判断，之后返回 `Promise.reject` / `Promise.resolve`; 对于 `http` 的异常来说，由于本身就是一个 error，一般会放在 `Promise.catch` 里面去处理。

## Wrapping

### 生成实例

一般来说 baseURL 是不太会改变的,如果项目如果是比较稳定的话，可以把全局的设置也写上，如： `withCredentials`

```typescript
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;
const baseURL = NODE_ENV === "development" ? "/api" : VUE_APP_PROD_API;

// 基本的axios实例
const axiosBase = axios.create({
	baseURL: baseURL,
});
```
如果项目中依赖多个api，那么这里可以生成多个实例，配置不同的 baseURL (开发中需要配置对于的proxies).

```typescript
// next.js 之类的 jamstack，可以自己生成 api routes 的，具有不同的 backend
const axioRoutes = axios.create({
  baseURL: "/api-routes"
});
```
### 拦截器

对于不同的实例，其拦截器也是大不相同的，但是又会存在类似的功能，考虑到这种变与不变，思考使用一个 AxiosFactory 进行调度，同时将拦截器中的功能原子化拆分，在工厂中进行组装。

## More

### 设计模式？

## References

1. [比较 fetch()和 Axios](https://segmentfault.com/a/1190000021071492)
2. [完整的 Axios 封装-单独 API 管理层、参数序列化、取消重复请求、Loading、状态码...](https://juejin.cn/post/6968630178163458084)
3. [封装 Axios 只看这一篇文章就行了](https://juejin.cn/post/7053471988752318472)
4. [错误处理 - 最后的完善](https://juejin.cn/post/6969070102868131853#heading-4)
5. [vue+ts下对axios的封装](https://segmentfault.com/a/1190000021769678)
6. [TS 泛型接口](https://www.cnblogs.com/double-W/p/12875623.html)