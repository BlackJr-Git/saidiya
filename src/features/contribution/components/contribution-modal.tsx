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
import { Loader2, Check, CreditCard, Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
// import { 
//   Card, 
//   CardContent, 
//   CardDescription, 
//   CardFooter, 
//   CardHeader, 
//   CardTitle 
// } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define the form schema
const formSchema = z.object({
  amount: z
    .number({ required_error: "Le montant est requis" })
    .positive("Le montant doit être positif"),
  message: z.string().optional(),
  anonymous: z.boolean(),
  paymentMethod: z.enum(["card", "mobile"]),
  mobileProvider: z.enum(["airtel", "mpesa", "orange", "afrimoney"]).optional(),
  // Card payment fields
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  cardholderName: z.string().optional(),
  // Mobile money fields
  phoneNumber: z.string().optional(),
});

// Define the form data type
type FormData = z.infer<typeof formSchema>;

interface ContributionModalProps {
  campaignId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  minAmount?: number;
  maxAmount?: number;
}

export function ContributionModal({
  campaignId,
  isOpen,
  onClose,
  onSuccess,
  minAmount = 5,
  maxAmount = 10000,
}: ContributionModalProps) {
  // Toast is imported directly from sonner
  const createContributionMutation = useCreateContribution();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"amount" | "payment" | "success">("amount");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"card" | "mobile">("card");
  const [selectedProvider, setSelectedProvider] = useState<"airtel" | "mpesa" | "orange" | "afrimoney">("mpesa");

  // Initialize form with react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: minAmount,
      message: "",
      anonymous: false,
      paymentMethod: "card",
    },
  });

  // Reset the form and close modal
  const resetAndClose = () => {
    form.reset();
    setStep("amount");
    onClose();
  };

  // Go to payment step
  const handleContinueToPayment = () => {
    const amount = form.getValues("amount");
    if (!amount || amount < minAmount || amount > maxAmount) {
      form.setError("amount", { 
        type: "manual", 
        message: `Le montant doit être entre ${minAmount}$ et ${maxAmount}$` 
      });
      return;
    }
    setStep("payment");
  };

  const handlePaymentMethodChange = (value: "card" | "mobile") => {
    setSelectedPaymentMethod(value);
    form.setValue("paymentMethod", value);
  };

  const handleProviderChange = (value: "airtel" | "mpesa" | "orange" | "afrimoney") => {
    setSelectedProvider(value);
    form.setValue("mobileProvider", value);
  };

  // Handle form submission
  const handleSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Send contribution data
      await createContributionMutation.mutateAsync({
        amount: data.amount,
        message: data.message,
        anonymous: data.anonymous,
        campaignId,
      });

      setStep("success");
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch {
      toast.error("Erreur", {
        description: "Une erreur est survenue lors du traitement du paiement."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render payment form based on selected method
  const renderPaymentForm = () => {
    if (selectedPaymentMethod === "card") {
      return (
        <div className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="cardholderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du titulaire</FormLabel>
                <FormControl>
                  <Input placeholder="Jean Dupont" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de carte</FormLabel>
                <FormControl>
                  <Input placeholder="4242 4242 4242 4242" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="cardExpiry"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Date d&apos;expiration</FormLabel>
                  <FormControl>
                    <Input placeholder="MM/AA" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardCvc"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>CVC</FormLabel>
                  <FormControl>
                    <Input placeholder="123" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4 mt-4">
          <FormItem className="space-y-3">
            <FormLabel>Choisissez votre fournisseur</FormLabel>
            <RadioGroup 
              defaultValue={selectedProvider} 
              onValueChange={(value) => handleProviderChange(value as "airtel" | "mpesa" | "orange" | "afrimoney")} 
              className="grid grid-cols-2 gap-4"
            >
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="airtel" id="airtel" />
                    <label htmlFor="airtel" className="flex items-center cursor-pointer">
                      <div className="ml-2 text-sm font-medium">Airtel Money</div>
                    </label>
                  </div>
                </FormControl>
              </FormItem>
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mpesa" id="mpesa" />
                    <label htmlFor="mpesa" className="flex items-center cursor-pointer">
                      <div className="ml-2 text-sm font-medium">M-Pesa</div>
                    </label>
                  </div>
                </FormControl>
              </FormItem>
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="orange" id="orange" />
                    <label htmlFor="orange" className="flex items-center cursor-pointer">
                      <div className="ml-2 text-sm font-medium">Orange Money</div>
                    </label>
                  </div>
                </FormControl>
              </FormItem>
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="afrimoney" id="afrimoney" />
                    <label htmlFor="afrimoney" className="flex items-center cursor-pointer">
                      <div className="ml-2 text-sm font-medium">Afrimoney</div>
                    </label>
                  </div>
                </FormControl>
              </FormItem>
            </RadioGroup>
          </FormItem>
          
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="+243 123 456 789" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="sm:max-w-[500px]">
        {step === "amount" && (
          <>
            <DialogHeader>
              <DialogTitle>Soutenir cette campagne</DialogTitle>
              <DialogDescription>
                Entrez le montant de votre contribution et un message optionnel.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form className="space-y-4 py-4">
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
              </form>
            </Form>

            <DialogFooter>
              <Button variant="outline" onClick={resetAndClose}>
                Annuler
              </Button>
              <Button onClick={handleContinueToPayment}>
                Continuer au paiement
              </Button>
            </DialogFooter>
          </>
        )}
        
        {step === "payment" && (
          <>
            <DialogHeader>
              <DialogTitle>Méthode de paiement</DialogTitle>
              <DialogDescription>
                Choisissez votre méthode de paiement préférée
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
                <Tabs
                  defaultValue="card"
                  value={selectedPaymentMethod}
                  onValueChange={(value) => handlePaymentMethodChange(value as "card" | "mobile")}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="card" className="flex items-center gap-2">
                      <CreditCard size={16} />
                      Carte Bancaire
                    </TabsTrigger>
                    <TabsTrigger value="mobile" className="flex items-center gap-2">
                      <Smartphone size={16} />
                      Mobile Money
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="card">
                    {renderPaymentForm()}
                  </TabsContent>
                  <TabsContent value="mobile">
                    {renderPaymentForm()}
                  </TabsContent>
                </Tabs>
              </form>
            </Form>

            <DialogFooter className="sm:justify-between">
              <Button variant="outline" onClick={() => setStep("amount")}>
                Retour
              </Button>
              <Button 
                onClick={form.handleSubmit(handleSubmit)} 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  "Payer maintenant"
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Check className="h-6 w-6 text-green-500" />
                Paiement réussi
              </DialogTitle>
              <DialogDescription>
                Merci pour votre soutien à cette campagne!
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-6">
              <div className="rounded-md bg-green-50 p-4 text-center">
                <p className="text-green-800">
                  Votre contribution de <span className="font-bold">{form.getValues("amount")}$</span> a 
                  été traitée avec succès.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={resetAndClose}>
                Fermer
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
