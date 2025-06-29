"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { HandHeart } from "lucide-react";

const formSchema = z.object({
  name: z.string().optional(),
  request: z.string().min(10, "Please share a bit more for us to pray for."),
});

export default function PrayerRequestForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      request: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Request Received",
      description: "Our prayer team will be lifting you up. Be blessed.",
    });
    form.reset();
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <HandHeart className="h-8 w-8 text-primary" />
          <CardTitle className="font-headline text-3xl">
            Prayer Requests
          </CardTitle>
        </div>
        <CardDescription>
          Share your requests with our prayer team. All submissions are
          confidential.
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
                  <FormLabel>Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="request"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prayer Request</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How can we pray for you today?"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit Request
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
