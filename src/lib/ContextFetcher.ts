import { error } from 'console';
import { Context } from './Context';

export default class ContextFetcher {
  constructor(public url: string) {}

  static computeCharLimit(tokenLimit: number) {
    return tokenLimit * 3;
  }

  static buildKeywords(question: string) {
    return question.split(' ');
  }

  static buildUrl(baseUrl: string, provider: string) {
    return `${baseUrl}/context/${provider}`;
  }

  async fetchContext(
    keywords: string[],
    charLimit: number
  ): Promise<Context.ContextResult | undefined> {
    const { url } = this;
    console.warn(`Requesting context from ${url}`);

    const response = await fetch(url, {
      body: JSON.stringify({ charLimit, keywords }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.warn(`Response from ${url}: ${response.status}`);
    const { body } = response;
    if (body === null) {
      error(`No body in response from ${url}`);
      return;
    }

    const reader = body.getReader();

    var contextStr = '';
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      contextStr += chunk;
    }
    contextStr += decoder.decode();
    console.warn(`Fetched ${contextStr.length} characters from ${url}`);
    return JSON.parse(contextStr);
  }
}
