
import { Configuration, OpenAIApi } from "openai";
// import { parseLineSeparatedList } from "../util/parseText.js";

class OpenAI {
  constructor(apiKey) {
    const configuration = new Configuration({
      apiKey
    });
    this.openai = new OpenAIApi(configuration);
  }

  async getPlaylistRecommendation(theme, songs, artists, genre, duration, temperature) {
    try {
      let gptSystemContent = 
      `Your task is to generate a playlist that fits a provided theme/vibe and write absolutely nothing but the palylist` +
      `Write each song in the format artist - title. ` + 
      `Make sure the total playtime of the songs reach the duration of ${duration} minutes` + 
      `, but make sure all the songs are unique.`

      let gptUserContent = `The theme is: ${theme}. `;

      if (songs) {
        gptUserContent += `Please include songs similar to ${songs}. `;
      }

      if (artists) {
        gptUserContent += `Please include artists similar to ${artists}. `;
      }

      if (genre) {
        gptUserContent += `Make the genre ${genre}. `;
      }

      console.log(gptUserContent);
      
      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "system",
            "content": gptSystemContent
          },
          {
            "role": "user",
            "content": gptUserContent
          }
        ],
        temperature
      });

      let content = response.data.choices[0].message.content;
      console.log(content);
      return content

    } catch (err) {
      console.log(err.message);
    }
  }
}

export default OpenAI;



