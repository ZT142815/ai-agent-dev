import "dotenv/config";
import { createOpenAI } from "@ai-sdk/openai";
import { ModelMessage, streamText, stepCountIs } from "ai";
import { createInterface } from "readline";
import { weatherTool, calculatorTool } from "./tools/utility-tools";
import { agentLoop } from "./agent/loop";

const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

const model = deepseek.chat("deepseek-flash");

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const SYSTEM = `你是 Super Agent，一个有工具调用能力的 AI 助手。
需要查询信息时，主动使用工具，不要编造数据。
回答要简洁直接。`;

const tools = {
  weather: weatherTool,
  calculator: calculatorTool,
};
const messages: ModelMessage[] = [];

function ask() {
  rl.question("\nYou: ", async (input) => {
    const trimmed = input.trim();
    if (!trimmed || trimmed === "exit") {
      console.log("Bye!");
      rl.close();
      return;
    }

    messages.push({ role: "user", content: trimmed });

    await agentLoop(model, tools, messages, SYSTEM);

    ask();
  });
}

ask();
