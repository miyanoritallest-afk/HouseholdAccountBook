"use client";

type Props = {
  messages: string[];
};

export default function ErrorMessage({ messages }: Props) {
  if (messages.length === 0) return null;
  return (
    <div className="rounded-md bg-red-50 border border-red-200 p-3">
      {messages.length === 1 ? (
        <p className="text-sm text-red-700">{messages[0]}</p>
      ) : (
        <ul className="list-disc list-inside space-y-1">
          {messages.map((msg, i) => (
            <li key={i} className="text-sm text-red-700">
              {msg}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
