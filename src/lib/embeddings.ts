import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  try {
    if (!text || text.trim() === "") {
      throw new Error("Input text cannot be empty");
    }

    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002", // Use a supported model
      input: text.trim().replace(/\n/g, ""), // Clean input
    });

    const result = await response.json();

    console.log("Raw response from OpenAI API:", result); // Debug the raw response

    if (result.error) {
      throw new Error(`OpenAI API Error: ${result.error.message}`);
    }

    if (
      !result.data ||
      !Array.isArray(result.data) ||
      result.data.length === 0
    ) {
      throw new Error("Unexpected API response format: No data found");
    }

    return result.data[0].embedding as number[];
  } catch (error) {
    handleAPIError(error);
    throw error; // Re-throw to preserve error flow
  }
}

// Error handling function
function handleAPIError(error: unknown): void {
  if (error instanceof Error) {
    console.error("Error message:", error.message);
  } else if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    console.error("Error message:", (error as { message: string }).message);
  } else {
    console.error("Unknown error:", error);
  }
}
