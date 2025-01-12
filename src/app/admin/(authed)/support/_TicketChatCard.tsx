import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, SendHorizontalIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/trpc/react";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { TRPCClientError } from "@trpc/client";
import { toast } from "sonner";

interface TicketChatCardProps {
  ticketId: number;
}

const TicketChatCard: React.FC<TicketChatCardProps> = ({ ticketId }) => {
  const { data, isLoading } =
    api.supportConversation.getConversationAdmin.useQuery({ ticketId });
  const { mutateAsync } =
    api.supportConversation.createMessageAdmin.useMutation();
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessages] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data?.messages]);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No conversation found</div>;

  const sendMessageHandler = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (message.length === 0) return;
    setSendingMessages(true);
    mutateAsync({ content: message, conversationId: data.id })
      .then(() => {
        setMessage("");
      })
      .catch((e) => {
        if (e instanceof TRPCClientError) {
          toast.error(e.message);
        } else {
          toast.error("An error occurred while sending message");
        }
      })
      .finally(() => {
        setSendingMessages(false);
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="group flex items-center space-x-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600 transition-all hover:bg-gray-200">
          <MessageCircle className="h-4 w-4 transition-transform group-hover:scale-110" />
          <span className="font-medium">View Chat</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-gray-800">
            {data.supportTicket.reason.supportReason.title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea
          className="h-[60vh] w-full rounded-md border p-4"
          ref={scrollRef}
        >
          <div className="space-y-2">
            {data.messages.map((message) => {
              const isUserMessage =
                message.senderId === data.supportTicket.userId;
              return (
                <div
                  key={message.id}
                  className={`flex ${isUserMessage ? "justify-start" : "justify-end"} animate-fadeIn`}
                >
                  <div
                    className={`group max-w-[70%] rounded-md p-2 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md ${
                      isUserMessage
                        ? "bg-gray-100 text-gray-800"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="absolute bottom-1 right-2 hidden text-xs text-gray-600 opacity-0 transition-opacity duration-200 group-hover:block group-hover:opacity-100">
                      {/* Time appears subtly on hover without affecting layout */}
                      {new Date(message.sentAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <div className="mt-4 flex items-end space-x-2">
          <Textarea
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[60px] resize-none rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <Button
            size="icon"
            variant="outline"
            onClick={sendMessageHandler}
            disabled={sendingMessage || message.length === 0}
            className="h-[60px] w-[60px] rounded-full transition-all hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <SendHorizontalIcon className="h-5 w-5 text-blue-500" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketChatCard;
