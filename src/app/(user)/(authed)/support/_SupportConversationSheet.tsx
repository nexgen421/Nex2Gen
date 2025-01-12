"use client";

import { MessageSquare, Loader2 } from "lucide-react";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";
import MessageBubble from "./_MessageBubble";
import { type Message } from "@prisma/client";
import { type Session } from "next-auth";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

const SupportConversationSheet = ({
  conversationId,
  issueTitle,
  supportTicketId,
  session,
}: {
  conversationId: number | undefined;
  issueTitle: string;
  supportTicketId: number;
  session: Session | null;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { mutateAsync: createConversation } =
    api.supportConversation.createConversationUser.useMutation();
  const { data: conversationMessages, isLoading: areMessagesLoading } =
    api.supportConversation.getConversationUser.useQuery({ conversationId });
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { mutateAsync: sendUserMessage, isPending } =
    api.supportConversation.createMessageUser.useMutation();

  const createConversationHandler = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createConversation({ supportTicketId });
      router.refresh();
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (conversationMessages) {
      setMessages(conversationMessages);
    }
    return () => {
      setMessages([]);
    };
  }, [conversationMessages]);

  const sendMessageHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Message cannot be empty!");
      return;
    }
    try {
      if (!conversationId) {
        toast.error("No Conversation to send message!");
        return;
      }

      const messageSent = await sendUserMessage({
        conversationId,
        content: message,
      });

      setMessages((prev) => [...prev, messageSent]);
      setMessage("");
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      }
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl border">
        <DialogHeader>
          <DialogTitle>
            {conversationId
              ? `Conversation #${conversationId}`
              : "Start Conversation"}
          </DialogTitle>
          <DialogDescription className="w-full truncate">
            {issueTitle}
          </DialogDescription>
        </DialogHeader>
        <div className="relative my-4 flex h-[60vh] w-full items-center justify-center">
          {loading ? (
            <Loader2 className="mx-auto h-6 w-6 animate-spin duration-500" />
          ) : (
            <>
              {conversationId ? (
                <div className="relative flex h-full w-full flex-col justify-end">
                  {areMessagesLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin duration-500" />
                  ) : (
                    <ScrollArea
                      className="w-full flex-1 overflow-auto"
                      scrollHideDelay={0}
                    >
                      <div className="flex flex-col gap-2 p-4">
                        {messages?.length === 0 ? (
                          <Badge className="mx-auto" variant={"outline"}>
                            No Messages Yet
                          </Badge>
                        ) : (
                          messages?.map((message) => (
                            <MessageBubble
                              session={session}
                              key={message.id}
                              message={message}
                            />
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  )}
                  <div className="absolute bottom-0 left-0 flex w-full items-center gap-2 border-t bg-white p-4">
                    <textarea
                      rows={2}
                      cols={4}
                      className="flex-1 resize-none rounded-lg border-muted-foreground text-sm"
                      onChange={(e) => setMessage(e.target.value)}
                      value={message}
                    />
                    <Button
                      onClick={sendMessageHandler}
                      variant="outline"
                      disabled={isPending}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={createConversationHandler}
                  variant="outline"
                  disabled={loading}
                >
                  Start Conversation
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportConversationSheet;
