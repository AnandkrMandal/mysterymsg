'use client';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import ShimmerButton from "@/components/magicui/shimmer-button";



export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Verification Failed',
        description:
          axiosError.response?.data.message ??
          'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gray-900 flex flex-col items-center overflow-hidden justify-center relative w-full">
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-gray-200 dark:bg-zinc-900">
      <div className="w-full max-w-md p-8  z-10 space-y-8 bg-gray-200 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-xl font-extrabold tracking-tight lg:text-2xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
        
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                 
                  <Input {...field}  className='border border-blue-950 rounded-full'/>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            <ShimmerButton className=" w-full shadow-2xl " type="submit">
            <span className="text-white">Verify</span>
            </ShimmerButton>
          </form>
        </Form>
      </div>
      </BackgroundGradient>
      <ShootingStars />
      <StarsBackground />
    </div>
    </>
  );
}
