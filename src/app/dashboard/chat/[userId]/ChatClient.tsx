
'use client';

import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';
import type { IMessage } from '@/lib/models/Message';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type ChatUser = {
  _id: string;
  name: string;
  avatar?: string;
}

export function ChatClient({ otherUser, initialMessages }: { otherUser: ChatUser, initialMessages: IMessage[] }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<IMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    // Use NEXT_PUBLIC_SOCKET_URL which should be http://localhost:4000
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000');
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
        setIsLoading(false);
        newSocket.emit('register', user.id);
    });

    newSocket.on('privateMessage', (message: IMessage) => {
      // Only add message if it's part of the current conversation
      const isRelevant = (message.senderId.toString() === user.id && message.receiverId.toString() === otherUser._id) ||
                         (message.senderId.toString() === otherUser._id && message.receiverId.toString() === user.id);
      
      if(isRelevant) {
        setMessages((prevMessages) => {
            // Avoid adding duplicates from optimistic update.
            // When real message comes from server, replace the optimistic one.
            const optimisticMessageId = `${message.senderId}-${message.receiverId}-${message.timestamp}`; // This won't match exactly but we need a better way
            
            // A more robust way to handle optimistic updates:
            // The server-sent message has a real _id. The optimistic one does not.
            // We can check if an optimistic message with the same content and rough timestamp exists.
            
            // For now, let's just check if we have a message with the same _id. If we do, don't add.
            if (prevMessages.some(m => m._id === message._id)) return prevMessages;

            // This is a simple way to replace an optimistic message.
            // A better way would be to assign a temporary ID on the client, send it to the server, and have the server return it.
            // For simplicity, we find a message with the same sender and text that doesn't have a final `_id`.
            const optimisticIndex = prevMessages.findIndex(
              (m) =>
                m.senderId.toString() === message.senderId.toString() &&
                !m._id.toString().match(/^[0-9a-fA-F]{24}$/) && // Not a valid ObjectId
                m.message === message.message
            );

            if (optimisticIndex > -1) {
                const newMessages = [...prevMessages];
                newMessages[optimisticIndex] = message;
                return newMessages;
            }

            return [...prevMessages, message];
        });
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user, otherUser._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user && socket) {
      
      const newTimestamp = new Date();
      // Create an optimistic message to show in the UI instantly
      const optimisticMessage: IMessage = {
        _id: `optimistic-${Date.now()}`, // Temporary unique ID
        senderId: user.id as any,
        receiverId: otherUser._id as any,
        message: newMessage,
        timestamp: newTimestamp,
        read: false,
      };

      setMessages(prev => [...prev, optimisticMessage]);

      socket.emit('privateMessage', {
        senderId: user.id,
        receiverId: otherUser._id,
        message: newMessage,
      });
      setNewMessage('');
    }
  };
  
  if (isLoading) {
      return (
          <div className="flex flex-col h-full p-6">
              <div className="flex-1 space-y-4">
                  <Skeleton className="h-12 w-2/3 rounded-lg" />
                  <div className="flex justify-end w-full">
                    <Skeleton className="h-12 w-1/2 self-end rounded-lg" />
                  </div>
                  <Skeleton className="h-16 w-3/4 rounded-lg" />
              </div>
              <div className="mt-4">
                  <Skeleton className="h-10 w-full rounded-md" />
              </div>
          </div>
      )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageSquare className="h-12 w-12" />
            <p className="mt-4 text-lg">No messages yet.</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages?.map((msg) => (
            <div
              key={msg?._id?.toString()}
              className={cn('flex items-end gap-2', {
                'justify-end': msg?.senderId?.toString() === user?.id,
              })}
            >
              {msg?.senderId?.toString() !== user?.id && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={otherUser.avatar} />
                  <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xs rounded-lg p-3 lg:max-w-md',
                  msg?.senderId?.toString() === user?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p className="text-sm">{msg.message}</p>
                <p className="mt-1 text-right text-xs opacity-70">
                  {format(new Date(msg.timestamp), 'h:mm a')}
                </p>
              </div>
               {msg?.senderId?.toString() === user?.id && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))
        )}
         <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4 bg-background">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            autoComplete="off"
          />
          <Button type="submit">
            <Send />
          </Button>
        </form>
      </div>
    </div>
  );
}
