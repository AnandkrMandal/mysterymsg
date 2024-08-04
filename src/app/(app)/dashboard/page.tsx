"use client";

import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { BackgroundGradient } from "@/components/ui/background-gradient";

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [inputUsername, setInputUsername] = useState("");
  const [profileUrl, setProfileUrl] = useState("");

  const { toast } = useToast();
  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ?? "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  useEffect(() => {
    if (session && session.user) {
      fetchMessages();
      fetchAcceptMessages();

      const username = (session.user as User).username;
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${baseUrl}/u/${username}`);
    }
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to update message settings",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: "URL Copied!",
        description: "Profile URL has been copied to clipboard.",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUsername(e.target.value);
  };

  const SendMessage = () => {
    const fullUrl = `${profileUrl}/${inputUsername}`;
    window.open(fullUrl, "_blank");
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  if (!session || !session.user) {
    return <div><span>Gest</span></div>;
  }

  return (
    <div className="bg-slate-800 w-full h-screen">
      <div className="my-8 px-4 md:px-8 lg:mx-auto p-6 rounded w-full max-w-6xl">
        <h1 className="text-2xl sm:text-2xl md:text-2xl lg:text-4xl font-bold mb-4 text-white">User Dashboard</h1>
        <div className="mb-4">
          <h2 className="text-base mb-2 text-white">
            Send an Anonymous Message
          </h2>
          <div className="flex items-center ">
            <input
              type="text"
              placeholder="username"
              className="input input-bordered w-full p-2 mr-2"
              value={inputUsername}
              onChange={handleInputChange}
              required
            />
            <Button
              onClick={SendMessage}
              className="bg-cyan-300 text-black hover:bg-cyan-700"
            >
              Open
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
            className="bg-teal-500 z-10"
          />
          <span className="ml-2 text-white">
            Accept Messages: {acceptMessages ? "On" : "Off"}
          </span>
        </div>
        <Separator />

        <Button
          className="mt-4"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <BackgroundGradient key={message._id} className="rounded-[22px] p-3 sm:p-3 bg-slate-500 dark:bg-zinc-900">
                <MessageCard
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              </BackgroundGradient>
            ))
          ) : (
            <p className="text-white">No messages to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
