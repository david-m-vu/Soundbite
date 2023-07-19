
import { Configuration, OpenAIApi } from "openai";
import { parseLineSeparatedList } from "../util/parseText.js";

class OpenAI {
  constructor(apiKey) {
    const configuration = new Configuration({
      organization: "org-BFTVdEg4mIp8j6GznLLJ4PTl",
      apiKey
    });
    this.openai = new OpenAIApi(configuration);
  }

  async getPlaylistRecommendation(message, temperature) {
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "system",
            "content": "You will be provided with an activity or a mood, and you task is to generate a playlist that fits the vibe. Write each song in the format \'artist title\' and write nothing but the songs."
          },
          {
            "role": "user",
            "content": message
          }
        ],
        temperature
      });

      let content = response.data.choices[0].message.content;
      return parseLineSeparatedList(content);

    } catch (err) {
      console.log(err.message);
    }
  }
}

export default OpenAI;



