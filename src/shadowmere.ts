interface SMProxy {
  id: number;
  url: string;
  location: string;
  location_country_code: string;
  location_country: string;
  ip_address: string;
  is_active: boolean;
  last_checked: string;
  last_active: string;
  times_checked: number;
  times_check_succeeded: number;
  port: number;
}

interface SMProxyList {
  count: number;
  total_pages: number;
  current_page: number;
  results: SMProxy[];
}

// shadowmere.xyz/api/proxies/?format=api
export const getPage = async (page: number): Promise<SMProxyList> =>
  await (await fetch(process.env.API_URL || "" + page)).json();
