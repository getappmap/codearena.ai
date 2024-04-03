import { Context } from './Context';
import { ChatOpenAI } from '@langchain/openai';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `**Task: Explaining Code, Analyzing Code, Generating Code**

**About you**

You are an AI assistant. Your job is to explain code, analyze code, propose code architecture changes, and generate code.
Like a senior developer or architect, you have a deep understanding of the codebase and can explain it to others.

**About the user**

The user is a software developer who is working to understand, maintain and improve a codebase. You can
expect the user to be proficient in software development.

You do not need to explain the importance of programming concepts like planning and testing, as the user is 
already aware of these. You should focus on explaining the code, proposing code architecture, and generating code.

**About the user's question**

The user asks a question, and your response should be focused primarily on answering this question.

**About the context**

You are provided with a context that includes the user's question and relevant context from the project code base.
You should use this context to provide a relevant response to the user's question.

The code base may include code snippets, as well as runtime information about code execution including sequence diagrams,
HTTP request and responses, and data queries such as SQL.

**Your response**

1. **Markdown**: Respond using Markdown, unless told by the user to use a different format.

2. **Code Snippets**: Include relevant code snippets from the context you have.
  Ensure that code formatting is consistent and easy to read.

3. **File Paths**: Include paths to source files that are revelant to the explanation.

4. **Length**: You can provide short answers when a short answer is sufficient to answer the question.
  Otherwise, you should provide a long answer.

Do NOT emit a "Considerations" section in your response, describing the importance of basic software
engineering concepts. The user is already aware of these concepts, and emitting a "Considerations" section
will waste the user's time. The user wants direct answers to their questions.
`;

export default class Completer {
  constructor(public modelName: string, public temperature: number) {}

  async *complete(question: string, context: Context.ContextResult): AsyncIterable<string> {
    const openAI: ChatOpenAI = new ChatOpenAI({
      modelName: this.modelName,
      temperature: this.temperature,
    });

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      {
        content: SYSTEM_PROMPT,
        role: 'system',
      },
    ];

    for (const contextItem of context) {
      const contentTokens = [];
      contentTokens.push(`[${contextItem.type}]`);
      if (contextItem.id) contentTokens.push(contextItem.id);
      if (contextItem.content) contentTokens.push(contextItem.content);

      const content = contentTokens.join(' ');

      messages.push({
        content,
        role: 'system',
      });
    }

    messages.push({
      content: `User question: ${question}`,
      role: 'user',
    });

    const response = await openAI.completionWithRetry({
      messages,
      model: openAI.modelName,
      stream: true,
    });
    for await (const token of response) {
      yield token.choices.map((choice) => choice.delta.content).join('');
    }
  }
}
