"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function MessageCard({ message, onMessageDelete }) {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(`/api/delete-message/${message._id}`);
      toast.success(response?.data?.message);
      onMessageDelete(message._id); // notify parent to remove from state
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete message");
    }
  };

  return (
    <Card
      className="mb-4 border border-gray-200 shadow-sm w-80 break-words hover:scale-105 transition-transform duration-300 ease-in-out"
      style={{ minWidth: "320px", maxWidth: "320px" }} // fixed width for all cards
    >
      <CardHeader className="flex justify-between items-start">
        <div className="flex-1 pr-2">
          <CardTitle className="text-lg break-words">{message.title}</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            {message.received}
          </CardDescription>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <X className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                feedback and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      <CardContent>
        <p className="text-gray-700 break-words">{message.content}</p>
      </CardContent>

      {message.extraInfo && (
        <CardFooter>
          <p className="text-sm text-gray-500 break-words">
            {message.extraInfo}
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
