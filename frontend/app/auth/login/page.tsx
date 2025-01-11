"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-md">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link href="/auth/homepage" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8" />
              <span className="text-2xl font-bold">OkuYorum</span>
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to access your account
            </p>
          </div>
          <div className="grid gap-6 mt-8">
            <form>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" />
                </div>
                <Button className="w-full">Sign In</Button>
              </div>
            </form>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Link className="text-sm underline underline-offset-4" href="#">
                  Forgot password?
                </Link>
              </div>
              <Link className="text-sm underline underline-offset-4" href="/auth/signup">
                Don&apos;t have an account? Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 OkuYorum. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

