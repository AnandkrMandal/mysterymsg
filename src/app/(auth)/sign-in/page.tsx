'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';

import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/magicui/border-beam";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import ShimmerButton from "@/components/magicui/shimmer-button";

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: 'Login Failed',
          description: 'Incorrect username or password',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    }

    if (result?.url) {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen text-white bg-gray-900 ">
      <div className=" w-full max-w-md p-8 space-y-8 bg-gray-700  relative flex h-[500px] flex-col rounded-lg border border-black">
      <BorderBeam size={250} duration={12} delay={9} />
        <div className="text-center">
          <h1 className="text-xl font-extrabold tracking-tight  lg:text-3xl mb-6">
            <Link href=''>
            Welcome to MysteryMsg
            </Link>
          </h1>
          <p className="mb-1">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input {...field}  className='text-black rounded-full' required/>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field}  className='text-black rounded-full' required/>
                  <FormMessage />
                </FormItem>
              )}
            />
             <ShimmerButton className=" w-full shadow-2xl " type="submit">
              <span className="text-white">Sign In</span>
              </ShimmerButton>
              <div className="text-center mt-4 mb-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className=" underline text-red-600 hover:text-red-800">
              Sign up
            </Link>
          </p>
         </div>
          </form>
        </Form>
        </div>
        <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[100%] skew-y-12",
        )}
      />
    </div>
    
  );
}
