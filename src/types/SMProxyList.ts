import { SMProxy } from "./SMProxy";

export interface SMProxyList {
  count: number;
  total_pages: number;
  current_page: number;
  results: SMProxy[];
}
