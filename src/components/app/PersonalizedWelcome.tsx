"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Wand2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function PersonalizedWelcome() {
  const [name, setName] = useState("");
  const [interests, setInterests] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setIsLoading(true);
    setWelcomeMessage("");
    // Simulate AI call
    setTimeout(() => {
      let message = `Welcome, ${name}! We're so blessed to have you with us today. `;
      if (
        interests.toLowerCase().includes("youth") ||
        interests.toLowerCase().includes("kids")
      ) {
        message +=
          "We saw you're interested in youth activities. Our youth group is a vibrant community, and we'd love for you to join! They meet every Friday at 7 PM.";
      } else if (
        interests.toLowerCase().includes("music") ||
        interests.toLowerCase().includes("worship")
      ) {
        message +=
          "It's wonderful that you have a heart for music! Our worship team is always looking for passionate individuals. We believe you'll feel right at home in our services.";
      } else {
        message +=
          "We pray you feel the warmth of our community and the presence of God during your visit. Please don't hesitate to speak with one of our pastors.";
      }
      setWelcomeMessage(message);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Wand2 className="h-8 w-8 text-primary" />
          <CardTitle className="font-headline text-3xl">
            Personalized Welcome
          </CardTitle>
        </div>
        <CardDescription>
          Let us create a special welcome message just for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGenerateMessage} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            aria-label="Your Name"
          />
          <Textarea
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Any specific interests? (e.g., music, youth group)"
            aria-label="Your interests"
          />
          <Button type="submit" className="w-full" disabled={isLoading || !name}>
            {isLoading ? "Generating..." : "Create My Welcome"}
            <Sparkles className="ml-2 h-4 w-4" />
          </Button>
        </form>
        {isLoading && (
            <div className="mt-6 p-4 bg-secondary rounded-lg border border-border space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        )}
        {welcomeMessage && (
          <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
            <p className="text-secondary-foreground">{welcomeMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
