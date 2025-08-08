"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface OAuthButtonsProps {
  mode: "login" | "signup";
  isLoading?: boolean;
}

export default function OAuthButtons({ mode, isLoading }: OAuthButtonsProps) {
  return (
    <>
      <div className="relative mb-4 mt-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-muted-foreground/30"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-muted-foreground">OR</span>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="secondary"
          className="flex-1 gap-2 py-7 bg-muted rounded-full"
          onClick={() => {}}
          disabled={isLoading}
        >
          <img
            src="https://www.svgrepo.com/show/380993/google-logo-search-new.svg"
            alt="Google logo"
            className="w-10 h-10"
          />
          {/* Google */}
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="flex-1 gap-2 py-7 bg-muted rounded-full"
          onClick={() => {}}
          disabled={isLoading}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
            alt="Facebook logo"
            className="w-10 h-10"
          />
          {/* Facebook */}
        </Button>
      </div>

      <div className="text-center mt-4">
        {mode === "login" ? (
          <Link
            href="/signup"
            className="text-primary hover:underline"
            prefetch={false}
          >
            Don&apos;t Have an Account? Sign Up
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-primary hover:underline"
            prefetch={false}
          >
            I Already Have an Account
          </Link>
        )}
      </div>
    </>
  );
}
