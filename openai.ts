import OpenAI from 'openai';

const openai = new OpenAI({
  // apiKey: process.env.OPENAI_API_KEY, // Ensure you have your API key set
});
export default openai;