import { SuccessResponse } from "@/lib/apiResponse";
import { generateText, streamText } from "ai";
import { createGeminiProvider } from "ai-sdk-provider-gemini-cli";

export async function POST(request){
    try {
        const prompt =
          "Generate 3 unique, open-ended, and engaging questions that spark curiosity and encourage friendly conversation for an anonymous social messaging platform like Qooh.me. Avoid personal, sensitive, or controversial topics. Keep the tone welcoming, light, and thought-provoking. Format all 3 questions as a single string, separated by '||'. Ensure the questions are suitable for a diverse audience and designed to make people feel comfortable sharing their thoughts. Always Remember questions should be short and concise not look like paragraph";


        const gemini = createGeminiProvider({
          authType: "api-key",
          apiKey: process.env.GEMINI_API_KEY,
        });

        const { text, usage } = await generateText({
          model: gemini("gemini-2.5-flash"),
          prompt
        });

        // Both v4 and v5 use the same streaming API
        // for await (const chunk of result.textStream) {
        //   process.stdout.write(chunk);
        // }

        return Response.json(SuccessResponse("Gemini responded successfully!", {
            response: text,
            tokenUsage: usage
        }), {status: 200});
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}
