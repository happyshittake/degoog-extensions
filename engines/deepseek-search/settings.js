export const SETTINGS_SCHEMA = [
  {
    key: "apiKey",
    label: "API Key",
    type: "password",
    secret: true,
    required: true,
    placeholder: "sk-...",
    description: "Get your API key at platform.deepseek.com",
  },
  {
    key: "needContent",
    label: "Fetch page content",
    type: "toggle",
    default: "false",
    description: "Return full page content in results (slower but richer).",
  },
  {
    key: "resultCount",
    label: "Results per page",
    type: "number",
    default: "10",
    description: "Number of results to return (1-50).",
  },
];