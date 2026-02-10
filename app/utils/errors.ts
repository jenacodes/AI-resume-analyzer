import {z} from "zod";

export function getFriendlyErrorMessage(error: unknown): string {

    
    // 1. Handle Gemini API Errors (e.g., rate limits, service issues)
    if (error instanceof Error && error.message.includes("GEMINI")) {
    return "The AI is a bit overwhelmed right now. Please try again in a moment.";
    }

    // 2. Handle Zod Validation Errors (AI output mismatch)
  if (error instanceof z.ZodError) {
    return "The AI generated a response we couldn't parse. Let's try one more time.";
  }

    // 3.Handle PDF Upload Errors
    if (error instanceof Error && error.message.includes("PDF")) {
        return "We had trouble reading that PDF. Ensure it isn't password protected. Try uploading a different file or check the format.";
    }

    // 4. Default Fallback
  return "Something went wrong on our end. We're looking into it!";
}