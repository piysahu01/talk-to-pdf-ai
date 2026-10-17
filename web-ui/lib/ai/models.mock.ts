import type {
  LanguageModelV2,
  LanguageModelV2StreamPart,
} from "@ai-sdk/provider";
import { simulateReadableStream } from "ai";

function createMockModel(
  modelId: string,
  response: string,
  chunkDelayInMs = 500,
  initialDelayInMs = 1000
): LanguageModelV2 {
  return {
    specificationVersion: "v2",
    provider: "mock",
    modelId,
    supportedUrls: {},
    doGenerate: async () => ({
      content: [{ type: "text", text: response }],
      finishReason: "stop",
      usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
      warnings: [],
    }),
    doStream: async () => ({
      stream: simulateReadableStream<LanguageModelV2StreamPart>({
        chunkDelayInMs,
        initialDelayInMs,
        chunks: [
          { type: "stream-start", warnings: [] },
          { type: "text-start", id: "1" },
          { type: "text-delta", id: "1", delta: response },
          { type: "text-end", id: "1" },
          {
            type: "finish",
            finishReason: "stop",
            usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
          },
        ],
      }),
    }),
  };
}

export const chatModel = createMockModel("chat-model", "Hello, world!");

export const reasoningModel = createMockModel(
  "chat-model-reasoning",
  "Let me reason through this. Hello, world!"
);

export const titleModel = createMockModel(
  "title-model",
  "This is a test title"
);

export const artifactModel = createMockModel(
  "artifact-model",
  "Hello, world!",
  50,
  100
);
