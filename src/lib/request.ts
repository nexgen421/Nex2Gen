import * as https from "https";
import * as http from "http";
import { URL } from "url";

type RequestParams = unknown;

class Request {
  private apiBaseUrl: string;
  private apiVersion: string;
  private timeout: number;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiBaseUrl = "https://api.trackingmore.com";
    this.apiVersion = "v4";
    this.timeout = 10000;
    this.apiKey = apiKey;
  }

  private getBaseUrl(path: string): string {
    return `${this.apiBaseUrl}/${this.apiVersion}/${path}`;
  }

  private getRequestHeader(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Tracking-Api-Key": this.apiKey,
    };
  }

  public static sendApiRequest(
    apiPath: string,
    apiKey: string,
    method: string,
    params: RequestParams = null,
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const instance = new Request(apiKey);
      const url = instance.getBaseUrl(apiPath);
      const parsedUrl = new URL(url);
      const headers = instance.getRequestHeader();
      const isHttps = parsedUrl.protocol === "https:";
      const client = isHttps ? https : http;
      method = method.toUpperCase();

      const requestOptions: http.RequestOptions = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname,
        method: method,
        port: isHttps ? 443 : 80,
        headers: headers,
        timeout: instance.timeout,
      };

      const req = client.request(requestOptions, (res) => {
        let responseData = "";

        res.on("data", (chunk) => {
          responseData += chunk;
        });

        res.on("end", () => {
          const parsedData = JSON.parse(responseData) as unknown;
          resolve(parsedData);
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      if (params) {
        const requestData = JSON.stringify(params);
        req.setHeader("Content-Type", "application/json");
        req.setHeader("Content-Length", Buffer.byteLength(requestData));
        req.write(requestData);
      }

      req.end();
    });
  }
}

export default Request;
