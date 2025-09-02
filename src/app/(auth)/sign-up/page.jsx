"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const debouncedUsername = useDebounce(username, 500);
  const router = useRouter();

  // Defining form
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (!debouncedUsername.trim()) {
        setUsernameMessage("");
        return;
      }

      setUsernameMessage("");
      setIsCheckingUsername(true);

      if (debouncedUsername) {
        try {
          const response = await axios.get(
            `/api/username-unique?username=${debouncedUsername}`
          );
          setUsernameMessage(response?.data?.message);
        } catch (error) {
          setUsernameMessage(error?.response?.data?.message);
          console.log(error);
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsername();
  }, [debouncedUsername]);

  const onSubmit = async (values) => {
    setIsSubmiting(true);
    try {
      const response = await axios.post("/api/sign-up", values);
      toast.success(response?.data?.message);
      router.replace(`/verify-code/${username}`);
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create Your Account
          </CardTitle>
          <p className="text-sm text-gray-500 mt-2">
            Join <span className="font-bold">True Feedback</span> and start
            sharing ideas today.
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Userame */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setUsername(e.target.value);
                        }}
                      />
                    </FormControl>

                    <div className="flex items-center gap-2">
                      {isCheckingUsername && (
                        <Loader2 className="mr-2 ml-3 h-4 w-4 animate-spin text-gray-500" />
                      )}
                      <p
                        className={`text-sm ${usernameMessage === "✅ Username is available" ? "text-green-500" : "text-red-500"}`}
                      >
                        {usernameMessage}
                      </p>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                {isSubmiting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Submitting....
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-blue-600 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
