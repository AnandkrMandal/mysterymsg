"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { useCompletion } from "ai/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { ShootingStars } from "@/components/ui/shooting-stars";
import {StarsBackground} from '@/components/ui/stars-background';
import ShimmerButton from "@/components/magicui/shimmer-button";
import { ConfettiButton } from "@/components/magicui/confetti";
import { BorderBeam } from "@/components/magicui/border-beam";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete("");
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Handle error appropriately
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center overflow-hidden relative w-full">
      <div className="container mx-auto p-10 z-50 rounded max-w-4xl">
        <h1 className=" text-4xl sm:text-4xl md:text-4xl lg:text-6xl whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80  font-bold bg-clip-text mb-6 text-center text-transparent dark:from-white dark:to-slate-900/10">
          Public Profile Link
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Send Anonymous Message to @{username}</FormLabel>
                  <FormControl>
                    <NeonGradientCard className="w-lg items-center justify-center text-center">
                      <Textarea
                        placeholder="Write your anonymous message here"
                        className="resize-none hover:border-2"
                        {...field}
                      />
                    </NeonGradientCard>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center z-10">
            <BorderBeam size={250} duration={12} delay={9} />
              {isLoading ? (
                <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
                </Button>
              ) : (
                <ConfettiButton type="submit" className="bg-white text-black hover:bg-slate-300"
                 disabled={isLoading || !messageContent}
                > Send It
                </ConfettiButton>
              )}
            </div>
          </form>
        </Form>
        <div className="space-y-4 my-8">
          <div className=" space-y-2">
            <Button
              onClick={fetchSuggestedMessages}
              className="my-4 bg-white text-black  hover:bg-slate-200"
              disabled={isSuggestLoading}
            >
            Suggest Messages
            </Button>
            <p className="text-white">Click on any message below to select it.</p>
          </div>
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Messages</h3>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              {error ? (
                <p className="text-red-500">{error.message}</p>
              ) : (
                parseStringMessages(completion).map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="mb-2"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        </div>
        <Separator className="my-6" />
        <div className="text-center flex  justify-center">
          
          <div>
            
            <div className="mb-4 text-white">
            Get Your Message Board
            </div>
            
          <Link href={"/sign-up"}>
            <ShimmerButton className="">Create Your Account</ShimmerButton>
          </Link>
          </div>
        </div>
       </div>
      <ShootingStars />
      <StarsBackground />
    </div>
  );
}
