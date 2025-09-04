"use client";

import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { sampleMessages } from "@/helpers/messages"
import MessageCard from "@/components/MessageCard";
import { Loader2 } from "lucide-react";

export default function DashBoard() {
  const [messages, setMessages] = useState(sampleMessages);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [copy, setCopy] = useState(false);

  const { data: session, status } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  // field to watch
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get("/api/accept-messages");
      console.log("reponse", response);
      const flag = response?.data?.data?.isAcceptingMessage;
      setValue("acceptMessages", flag);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  // fetching messages
  // const fetchMessages = useCallback(
  //   async (refresh = false) => {
  //     setLoading(true);
  //     setIsSwitchLoading(false);

  //     try {
  //       const response = await axios.get("/api/get-messages");
  //       setMessages(response?.data?.data?.messages || []);
  //       if (refresh) {
  //         toast.info("Refreshed messages");
  //       }
  //     } catch (error) {
  //       // toast.error(error?.response?.data?.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [setLoading, setMessages]
  // );

  useEffect(() => {
    if (!session || !session.user) return;

    // fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage]);

  // handle toggling switch
  const handleToggleSwitch = async () => {
    try {
      await axios.post("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(response?.data?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const username = session?.user?.username;
  // TODO: do more research
  const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 3000);
  };

  const handleDeleteConfirm = () => {};

  if (status === "unauthenticated") {
    return <p>Please, login first</p>;
  }

  if(status === "loading"){
    return (
      <div className="h-dvh flex items-center justify-center">
        <Loader2 className="w-13 h-13 animate-spin"/>
      </div>
    )
  }

  return (
    <section>
      <div className="mt-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Copy your unique link
        </h3>
        <div className="relative">
          <input
            className="w-full border-2 rounded-md px-6 h-10 bg-gray-100"
            type="text"
            value={profileUrl}
            disabled
          />
          <Button
            onClick={() => copyToClipboard()}
            className="absolute right-0 h-10 cursor-pointer"
          >
            {copy ? "✓ copied" : "Copy"}
          </Button>

          <div>
            <div className="flex items-center gap-3">
              <Switch
                {...register("acceptMessages")}
                className="my-6"
                checked={acceptMessages}
                onCheckedChange={handleToggleSwitch}
                disabled={isSwitchLoading}
              />
              <span className="text-base font-medium">Accept messages : {acceptMessages ? "on" : "off"}</span>
            </div>
            <Separator className="bg-gray-300" />
          </div>
        </div>
      </div>

      {/* Rendering messages  */}
      <div className="flex flex-wrap items-center justify-center mt-10 gap-3 md:gap-5">
        {messages &&
          messages.map((message) => (
            <MessageCard
              message={message}
              onMessageDelete={handleDeleteConfirm}
            />
          ))}
      </div>
    </section>
  );
}
