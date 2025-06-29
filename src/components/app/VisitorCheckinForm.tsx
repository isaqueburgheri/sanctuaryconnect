"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Sparkles } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50),
  contact: z.string().email("Please enter a valid email address."),
  interests: z.string().optional(),
});

export default function VisitorCheckinForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact: "",
      interests: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Welcome!",
      description: `Thank you for checking in, ${values.name}. We're glad you're here!`,
    });
    form.reset();
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <UserPlus className="h-8 w-8 text-primary" />
          <CardTitle className="font-headline text-3xl">
            New Here? Check In!
          </CardTitle>
        </div>
        <CardDescription>
          We'd love to connect with you. Please fill out the form below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interests or Prayer Requests</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us what you're looking for in a church, or any prayer requests you have."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Check In
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
