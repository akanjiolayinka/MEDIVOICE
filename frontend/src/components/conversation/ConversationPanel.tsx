import Message, { type DisplayMessage } from "@/components/conversation/Message";

export default function ConversationPanel({ messages }: { messages: DisplayMessage[] }) {
  if (messages.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-500">
        Your conversation will appear here once you start speaking.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
}
