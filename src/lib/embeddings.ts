import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
    try {
      const response = await openai.createEmbedding({
        model: "text-embedding-3-small", // Update model if "text-embedding-3-small" is incorrect
        input: text.replace(/\n/g, ""),
      });
  
      const result = await response.json();
  
      if (!result.data || !Array.isArray(result.data) || result.data.length === 0) {
        throw new Error("Unexpected API response format: No data found");
      }
  
      return result.data[0].embedding as number[];
    } catch (error) {
      console.error("Error calling OpenAI embeddings API:", error);
      throw error;
    }
  }
