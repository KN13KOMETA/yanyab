import { SMProxyList } from "./types/SMProxyList";

// shadowmere.xyz/api/proxies/?format=api
export const getPage = async (page: number): Promise<SMProxyList> =>
  await (await fetch(process.env.API_URL || "" + page)).json();
