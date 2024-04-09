'use client';

import { useMemo, useState } from 'react';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import { useClientOnce } from '@/lib/useClientOnce';
import 'highlight.js/styles/base16/snazzy.css';

export default function Conversation({
  matchIterationId,
  contestantId,
}: {
  matchIterationId: string;
  contestantId: string;
}) {
  const [message, setMessage] = useState('');
  const [marked] = useState(
    () =>
      new Marked(
        markedHighlight({
          langPrefix: 'hljs language-',
          highlight(code: string, lang: string) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
          },
        })
      )
  );

  useClientOnce(() => {
    const eventSource = new EventSource(
      `/api/completion?matchIterationId=${matchIterationId}&contestantId=${contestantId}`
    );
    eventSource.onmessage = (event) => {
      const str = decodeURIComponent(event.data) as string;
      setMessage((prevMessage) => prevMessage + str);
    };
    eventSource.onerror = function (event) {
      console.error(`Error: ${event}`);
      eventSource.close();
    };
  });

  const renderedMarkdown = useMemo(() => {
    const rawMarkdown = marked.parse(message) as string;
    // For some reason this is being called on both the client and server sides, and DOMPurify doesn't resolve properly on the server.
    return DOMPurify.sanitize ? DOMPurify.sanitize(rawMarkdown) : '';
  }, [marked, message]);

  return (
    <div>
      <h3 className="font-bold">Response</h3>
      {/* Use `dangerouslySetInnerHTML` for rendering raw HTML within React components */}
      <div dangerouslySetInnerHTML={{ __html: renderedMarkdown }} />
    </div>
  );
}
