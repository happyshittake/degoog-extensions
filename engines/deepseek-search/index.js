import { SETTINGS_SCHEMA } from "./settings.js";

const API_URL = "https://api.deepseek.com/v1/tools/search";

export default class DeepSeekSearchEngine {
  isClientExposed = false;
  name = "DeepSeek Search";
  bangShortcut = "deepseek";
  settingsSchema = SETTINGS_SCHEMA;

  apiKey = "";
  needContent = false;
  resultCount = 10;

  configure(settings) {
    this.apiKey = settings.apiKey || "";
    this.needContent = settings.needContent === "true";
    this.resultCount = Math.min(Math.max(parseInt(settings.resultCount) || 10, 1), 50);
  }

  async executeSearch(query, page = 1, timeFilter, context) {
    if (!this.apiKey) return [];

    const doFetch = context?.fetch ?? fetch;

    try {
      const response = await doFetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          query,
          count: this.resultCount,
          need_content: this.needContent,
        }),
      });

      if (!response.ok) {
        console.error(`DeepSeek Search API error: ${response.status} ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      context?.sentinel?.(response, this.name);

      return (data?.results ?? []).map((item) => ({
        title: item.title ?? "",
        url: item.url ?? "",
        snippet: item.snippet ?? "",
        source: this.name,
        score: Math.round((item.rerank_score ?? 0) * 20),
        content: item.content ?? "",
      }));
    } catch (e) {
      if (e?.name === "SentinelBreach") throw e;
      console.error("DeepSeek Search error:", e?.message);
      return [];
    }
  }
}