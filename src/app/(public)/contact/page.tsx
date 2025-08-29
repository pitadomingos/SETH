'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendMessageToGAAction } from "@/app/actions/messaging-actions";

const contactSchema = z.object({
    name: z.string().min(3, "Please enter your name."),
    email: z.string().email("Please enter a valid email address."),
    subject: z.string().min(5, "Subject must be at least 5 characters long."),
    message: z.string().min(20, "Message must be at least 20 characters long."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
    const { toast } = useToast();
    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: '', email: '', subject: '', message: '' },
    });

    async function onSubmit(values: ContactFormValues) {
        const result = await sendMessageToGAAction(values.name, values.email, values.subject, values.message);

        if (result.success) {
            toast({
                title: "Message Sent!",
                description: "Thank you for contacting us. We will get back to you shortly.",
            });
            form.reset();
        } else {
            toast({
                variant: 'destructive',
                title: "Failed to Send Message",
                description: result.error || "An unexpected error occurred. Please try again.",
            });
        }
    }

    return (
        <div className="container py-12 md:py-24 lg:py-32">
            <div className="mx-auto max-w-2xl">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl">Contact Us</CardTitle>
                        <CardDescription>
                            Have a question or want to request a demo? Fill out the form below and we'll get in touch.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Your Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem> )} />
                                    <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Your Email</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
                                </div>
                                <FormField control={form.control} name="subject" render={({ field }) => ( <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="e.g., Demo Request for My School" {...field} /></FormControl><FormMessage /></FormItem> )} />
                                <FormField control={form.control} name="message" render={({ field }) => ( <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea rows={6} placeholder="Tell us more about your school or your question..." {...field} /></FormControl><FormMessage /></FormItem> )} />
                                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send Message
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
