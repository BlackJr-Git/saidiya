"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateContribution } from "@/features/contribution/hooks/use-create-contribution";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Define the form schema
const formSchema = z.object({
  amount: z
    .number({ required_error: "Le montant est requis" })
    .positive("Le montant doit être positif"),
  message: z.string().optional(),
  anonymous: z.boolean(),
});

// Define the form data type
type FormData = z.infer<typeof formSchema>;

interface ContributionFormProps {
  campaignId: string;
  onSuccess?: () => void;
  minAmount?: number;
  maxAmount?: number;
}

export function ContributionForm({
  campaignId,
  onSuccess,
  minAmount = 5,
  maxAmount = 10000,
}: ContributionFormProps) {
  // Toast is imported directly from sonner
  const createContributionMutation = useCreateContribution();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: minAmount,
      message: "",
      anonymous: false,
    },
  });

  // Handle form submission
  const handleSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await createContributionMutation.mutateAsync({
        amount: data.amount,
        message: data.message,
        anonymous: data.anonymous,
        campaignId,
      });

      toast.success("Contribution réussie", {
        description: "Merci pour votre soutien à cette campagne!"
      });

      // Reset form
      form.reset();
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch {
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la contribution."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border">
      <h3 className="text-xl font-semibold mb-4">Soutenir cette campagne</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Montant ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={minAmount}
                    max={maxAmount}
                    step="1"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Montant minimum: {minAmount}$, maximum: {maxAmount}$
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message (optionnel)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Laissez un message de soutien"
                    className="resize-none"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="anonymous"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Contribution anonyme</FormLabel>
                  <FormDescription>
                    Votre nom ne sera pas affiché publiquement
                  </FormDescription>
              </div>
            </FormItem>
          )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Contribution en cours...
              </>
            ) : (
              "Contribuer maintenant"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
