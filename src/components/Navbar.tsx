"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User } from "next-auth";

function Navbar() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const user: User = session?.user;

  const username = user?.username;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;


  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <nav className="p-4 md:p-6 w-full shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          MysteryMsg
        </a>
        {session ? (
          <>
            <span className="mr-4">Welcome, {user.username || user.email}</span>
            <div className=" mt-4 flex flex-row justify-evenly">
            <Button
            onClick={copyToClipboard}
            className="w-full md:w-auto bg-cyan-300 text-black mr-2 hover:bg-cyan-700"
            >
            Copy url
            </Button>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-cyan-300 text-black hover:bg-cyan-700"
              variant="outline"
            >
              Logout
            </Button>
            </div>
          </>
        ) : (
          <>
          <div className="flex ">
          <Link href="/sign-in">
              <Button
                className="w-full md:w-auto rounded-sm bg-slate-100 mr-2  text-black"
                variant={"outline"}
              >
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                className="w-full md:w-auto rounded-sm bg-slate-100  ml-2 text-black" 
                variant={"outline"}
              >
                Sign up
              </Button>
            </Link>
          </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
