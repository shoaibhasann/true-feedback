"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatTime } from "@/helpers/formatTime";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function VerificationPage() {
  const [loading, setLoading] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [expiry, setExpiry] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchInfo = async () => {
      if (params.username) {
        try {
          const response = await axios.get(
            `/api/get-info?username=${params.username}`
          );
          const expiryTime = new Date(response?.data?.data?.codeExpiry);
          setExpiry(expiryTime);
          setMaskedEmail(response.data?.data?.maskedEmail);

          // set initial time left
          setTimeLeft(expiryTime - new Date());
        } catch (error) {
          toast.error(error.response?.data?.message);
        }
      }
    };
    fetchInfo();
  }, [params.username]);

  // Countdown interval
  useEffect(() => {
    if (!expiry) return;

    const interval = setInterval(() => {
      const diff = expiry - new Date();
      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiry]);

  // Resend verification code
  const handleResendCode = async () => {
    setResendLoading(true);
    setResendMessage("");
    try {
      const response = await axios.post(`/api/resend-verification-code`, {
        username: params.username,
      });

      // Update expiry and timer
      const newExpiry = new Date(response.data?.data?.newExpiry);
      setExpiry(newExpiry);
      setTimeLeft(newExpiry - new Date());

      setResendMessage("Verification code sent! Please check your email.");
      toast.success("Verification code sent!");
    } catch (error) {
      setResendMessage(
        error?.response?.data?.message || "Something went wrong"
      );
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setResendLoading(false);
    }
  };

  // defining form
  const form = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  // on submit
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: values.code,
      });
      toast.success(response?.data?.message);
      router.replace("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Verify your account
          </CardTitle>
          <p className="text-sm text-gray-500 mt-2">
            {`Please enter the code we just sent to ${maskedEmail} to continue.`}
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Verification code */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter your verification code</FormLabel>
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

              {/* Countdown */}
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-500 text-center">
                  Code expires in: <strong>{formatTime(timeLeft)}</strong>
                </p>
              ) : (
                <p className="text-sm text-red-500 text-center">
                  Code expired. You can request a new one.
                </p>
              )}

              {/* Resend Message */}
              {resendMessage && (
                <p className="text-sm text-green-600 text-center">
                  {resendMessage}
                </p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={timeLeft <= 0 || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>

              {/* Resend Button */}
              <Button
                type="button"
                className="w-full mt-2"
                variant="outline"
                onClick={handleResendCode}
                disabled={resendLoading || timeLeft > 0} // Disable while waiting for expiry
              >
                {resendLoading ? "Sending..." : "Resend Verification Code"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
