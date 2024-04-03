'use client';

import { useClientOnce } from '@/lib/useClientOnce';
import { useState } from 'react';

export default function Conversation({
  matchIterationId,
  contestantId,
}: {
  matchIterationId: string;
  contestantId: string;
}) {
  const [messages, setMessages] = useState(new Array<string>());

  useClientOnce(() => {
    console.log(`Invoking SSE`);
    const eventSource = new EventSource(
      `/api/completion?matchIterationId=${matchIterationId}&contestantId=${contestantId}`
    );
    eventSource.onmessage = (event) => {
      const str = event.data as string;
      setMessages((prevMessages) => [...prevMessages, str]);
    };
    eventSource.onopen = function (event) {
      // Reset reconnect frequency upon successful connection
      console.log(`Opened connection: ${event}`);
    };
    eventSource.onerror = function (event) {
      console.error(`Error: ${event}`);
      eventSource.close();
    };
  });

  return (
    <div>
      <p>
        Contestant Id: <strong>{contestantId}</strong>
      </p>
      <p>
        Match Iteration Id: <strong>{matchIterationId}</strong>
      </p>
      <p>
        {messages.map((message, index) => (
          <span key={index}>{message}</span>
        ))}
      </p>
    </div>
  );
}
