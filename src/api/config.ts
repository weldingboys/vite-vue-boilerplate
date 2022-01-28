import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from "axios";
// import Qs from "qs";

const { NODE_ENV, VITE_PROD_API } = process.env;

const baseUrl = NODE_ENV === "development" ? "/web-api" : VITE_PROD_API;

// 旧有接口使用cookie进行验证
const axiosBase = axios.create({
	baseURL: baseUrl,
});

// 本地mock接口 无需权限
const axiosMock = axios.create({});

// 新版接口，使用 bearer token 进行鉴权
const axiosV4 = axios.create({
	baseURL: baseUrl,
});

interface IHttp<T> {
	requestInterceptorGenerator: () => Function[];
	responseInterceptorGenerator: () => Function[];
	responseHandler: (res: AxiosResponse<T>) => T;
	responseErrorHandler: (res: AxiosError) => void;
}

class AbstractHttp<T> implements IHttp<T> {
	/**
	 * @description 请求拦截器
	 * @author xujx
	 * @date 2022-01-28
	 * @returns {Function[]}
	 * @memberof Http
	 */
	requestInterceptorGenerator() {
		const requestHandler = function (
			config: AxiosRequestConfig
		): AxiosRequestConfig {
			return config;
		};
		const requestErrorHandler = function (error: AxiosError) {
			return Promise.reject(error);
		};
		return [requestHandler, requestErrorHandler];
	}

	responseInterceptorGenerator() {
		const responseHandler = this.responseHandler;
		const responseErrorHandler = this.responseErrorHandler;
		return [responseHandler, responseErrorHandler];
	}

	responseHandler(res: AxiosResponse<T>): T {
		return res.data;
	}

	responseErrorHandler(err: AxiosError) {
		console.log(err);
	}
}

class BaseHttp<T> extends AbstractHttp<T> {}
class MockHttp<T> extends AbstractHttp<T> {}
class V4Http<T> extends AbstractHttp<T> {}

class AxiosFactory {}
