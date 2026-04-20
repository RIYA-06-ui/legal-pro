import React, { useState } from 'react';

export default function ChatPanel() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi — ask me about the selected clause.' },
  ]);
  const [input, setInput] = useState('');

  function send() {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    // Mock reply
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'bot', text: 'Mocked reply: This clause may pose a medium risk.' }]);
    }, 700);
  }

  return (
    <div className="flex flex-col h-[60vh]">
      <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Chat</h3>
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 rounded ${m.from === 'bot' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white self-start' : 'bg-blue-600 text-white self-end'}`}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="mt-2 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded p-2" placeholder="Ask about this document..." />
        <button onClick={send} className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
      </div>

      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Quick: <button className="underline" onClick={() => { setMessages(m=>[...m, {from:'user', text:'What are the main risks?'}]); setTimeout(()=>setMessages(m=>[...m, {from:'bot', text:'Mocked reply: High risk on access clause.'}]),700); }}>What are the main risks?</button>
      </div>
    </div>
  );
}
