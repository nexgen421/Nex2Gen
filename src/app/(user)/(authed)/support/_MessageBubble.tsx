import React from "react";
import { type Message } from "@prisma/client";
import { cn } from "~/lib/utils";
import { type Session } from "next-auth";
import { format } from "date-fns";

const MessageBubble = ({
  message,
  session,
}: {
  message: Message;
  session: Session | null;
}) => {
  const isMine = message.senderId === session?.user.id;
  
  return (
    <div
      className={cn(
        "group relative my-1.5 w-fit max-w-xs p-2.5 rounded-md text-sm",
        isMine
          ? "self-end bg-blue-50 text-blue-800"
          : "self-start bg-gray-50 text-gray-800"
      )}
    >
      <span className="break-words">{message.content}</span>
      <span className="absolute -bottom-4 right-0 text-[10px] text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">
        {format(new Date(message.sentAt), "h:mm a")}
      </span>
    </div>
  );
};

export default MessageBubble;