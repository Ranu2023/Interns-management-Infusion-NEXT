
'use client';

import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';
import type { IMessage } from '@/lib/models/Message';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
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

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
        setIsLoading(false);
        newSocket.emit('register', user.id);
    });

    newSocket.on('privateMessage', (message: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user && socket) {
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
          <div className="flex flex-col h-full">
              <div className="flex-1 p-6 space-y-4">
                  <Skeleton className="h-12 w-2/3" />
                  <Skeleton className="h-12 w-1/2 self-end" />
                  <Skeleton className="h-16 w-3/4" />
              </div>
              <div className="p-4 border-t">
                  <Skeleton className="h-10 w-full" />
              </div>
          </div>
      )
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={messagesEndRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={cn('flex items-end gap-2', {
              'justify-end': msg.senderId.toString() === user?.id,
            })}
          >
            {msg.senderId.toString() !== user?.id && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={otherUser.avatar} />
                <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                'max-w-xs rounded-lg p-3 lg:max-w-md',
                msg.senderId.toString() === user?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              <p className="text-sm">{msg.message}</p>
              <p className="mt-1 text-right text-xs opacity-70">
                {format(new Date(msg.timestamp), 'h:mm a')}
              </p>
            </div>
             {msg.senderId.toString() === user?.id && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
      <div className="border-t p-4">
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
