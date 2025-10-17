import { PageWithCursor } from "puppeteer-real-browser";
import { SMProxyList } from "./types/SMProxyList";
import { SMProxy } from "./types/SMProxy";

export class ShadowmereProvider {
  sm_url: string;
  #page: PageWithCursor;
  #initialized = false;
  constructor(shadowmereUrl: string, page: PageWithCursor) {
    this.sm_url = shadowmereUrl;
    this.#page = page;
  }

  async init() {
    await this.#page.setViewport({ width: 1920, height: 1080 });

    this.#initialized = true;
  }

  async getPage(page = 1): Promise<SMProxyList> {
    if (!this.#initialized) throw "Call init first";

    await this.#page.goto(this.sm_url + page, {
      waitUntil: "networkidle0",
    });

    const content = (await this.#page.content()).match(/<pre>(.*)<\/pre>/) || [
      null,
      "{}",
    ];

    return JSON.parse(content[1]);
  }

  async getPages(startPage = 1, pageCount = 10): Promise<SMProxy[]> {
    const pages = [];
    for (let i = startPage; i < startPage + pageCount; i++)
      pages.push((await this.getPage(i)).results);

    return pages.flat();
  }
}
