import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Schema de validation pour le formulaire de campagne
const campaignFormSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  description: z.string().min(20, "La description doit contenir au moins 20 caractères"),
  targetAmount: z.coerce
    .number()
    .positive("Le montant cible doit être supérieur à 0"),
  status: z.enum(["draft", "pending", "active", "completed", "rejected"]),
  category: z.string().min(1, "Veuillez sélectionner une catégorie"),
  thumbnailUrl: z.string().optional(),
  deadline: z.string().optional(),
});

// Type depuis le schema zod
type CampaignFormValues = z.infer<typeof campaignFormSchema>;

// Props du composant
interface CampaignFormProps {
  initialData?: Partial<CampaignFormValues>;
  onSubmit: (data: CampaignFormValues) => void;
  isSubmitting?: boolean;
  categories: { id: string; name: string }[];
}

export function CampaignForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  categories = [],
}: CampaignFormProps) {
  // Créer le formulaire avec les valeurs initiales et le schéma de validation
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      targetAmount: initialData?.targetAmount || 0,
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: (initialData?.status as any) || "draft",
      category: initialData?.category || "",
      thumbnailUrl: initialData?.thumbnailUrl || "",
      deadline: initialData?.deadline || "",
    },
  });

  // Gérer la soumission du formulaire
  const handleSubmit = (values: CampaignFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre de la campagne</FormLabel>
              <FormControl>
                <Input placeholder="Titre de la campagne" {...field} />
              </FormControl>
              <FormDescription>
                Choisissez un titre accrocheur qui décrit bien la campagne.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description détaillée de la campagne..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Décrivez votre campagne en détail pour informer les contributeurs.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="targetAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Montant cible ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Le montant que vous souhaitez collecter en euros.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Complétée</SelectItem>
                    <SelectItem value="rejected">Rejetée</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Le statut actuel de la campagne.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                La catégorie principale de la campagne.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date limite</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                La date de fin de la campagne (optionnelle).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnailUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de l&apos;image principale</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>
                URL de l&apos;image principale de la campagne (optionnelle).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline">
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                Enregistrement...
              </>
            ) : initialData?.status === "draft" ? (
              "Mettre à jour"
            ) : (
              "Créer la campagne"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
