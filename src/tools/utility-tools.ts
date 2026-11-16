import { jsonSchema } from "ai";

export const weatherTool = {
  description: "查询指定城市的天气",
  inputSchema: jsonSchema({
    type: "object",
    properties: {
      city: {
        type: "string",
        description: "要查询的城市名称",
      },
    },
    required: ["city"],
    additionalProperties: false,
  }),
  execute: async ({ city }: { city: string }) => {
    const mockWeather: Record<string, string> = {
      北京: "晴天,气温20°C",
      上海: "多云,气温18°C",
      广州: "小雨,气温22°C",
      深圳: "晴天,气温25°C",
    };

    return mockWeather[city] || "暂无数据";
  },
};

export const calculatorTool = {
  description: "计算数学表达式的结果",
  inputSchema: jsonSchema({
    type: "object",
    properties: {
      expression: {
        type: "string",
        description: "数学表达式,如 2 + 2",
      },
    },
    required: ["expression"],
    additionalProperties: false,
  }),
  execute: async ({ expression }: { expression: string }) => {
    try {
      // 生产环境不要用 eval，这里纯粹为了演示
      const result = new Function(`return ${expression}`)();
      return `${expression} = ${result}`;
    } catch {
      return `无法计算: ${expression}`;
    }
  },
};
