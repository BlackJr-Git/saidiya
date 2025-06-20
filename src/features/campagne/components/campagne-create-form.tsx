"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { fileToBase64, fileToPreviewUrl } from "@/utils/file";
import * as z from "zod";
import { Check, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useCreateCampagne } from "@/features/campagne/hooks";
import { CampagneCreate } from "@/types/campagne";

// Catégories disponibles avec leurs icônes
const categories = [
  { id: "education", label: "Éducation", icon: ImageIcon },
  { id: "health", label: "Santé", icon: ImageIcon },
  { id: "environment", label: "Environnement", icon: ImageIcon },
  { id: "culture", label: "Culture", icon: ImageIcon },
  { id: "tech", label: "Technologie", icon: ImageIcon },
  { id: "community", label: "Communauté", icon: ImageIcon },
  { id: "other", label: "Autre", icon: ImageIcon },
];

// Conseils pour chaque étape du formulaire
const stepTips = {
  1: [
    "Choisissez un titre accrocheur qui décrit clairement votre projet",
    "Le montant cible doit être réaliste et justifiable",
    "Une localisation précise aide à attirer les soutiens locaux",
  ],
  2: [
    "Sélectionnez la catégorie qui correspond le mieux à votre projet",
    "Une bonne catégorisation permet aux utilisateurs de trouver votre campagne plus facilement",
  ],
  3: [
    "Décrivez votre projet en détail : objectifs, impact attendu, utilisation des fonds",
    "Soyez transparent et authentique pour instaurer la confiance",
    "5000 caractères maximum pour garder votre description concise",
  ],
  4: [
    "Une image de qualité attire l'attention et favorise l'engagement",
    "Choisissez une image en lien direct avec votre projet",
    "Résolution recommandée : 1200x630 pixels",
  ],
};

// Composant de conseils
const TipSection = ({ tips }: { tips: string[] }) => {
  return (
    <div className="mt-6 bg-muted/50 rounded-lg p-4">
      <h4 className="font-medium text-sm mb-2">Conseils</h4>
      <ul className="space-y-1">
        {tips.map((tip, index) => (
          <li key={index} className="text-xs text-muted-foreground flex items-start">
            <span className="mr-2">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Schéma de validation du formulaire
const formSchema = z.object({
  title: z.string().min(10, "Le titre doit contenir au moins 10 caractères").max(100, "Le titre ne doit pas dépasser 100 caractères"),
  targetAmount: z.coerce.number().positive("Le montant cible doit être positif").min(100, "Le montant minimum est de 100"),
  localisation: z.string().min(3, "Veuillez indiquer une localisation valide"),
  category: z.string().min(1, "Veuillez sélectionner une catégorie"),
  description: z.string().min(50, "La description doit contenir au moins 50 caractères").max(5000, "La description ne doit pas dépasser 5000 caractères"),
  coverImage: z.string().optional(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  status: z.enum(["draft", "active", "completed", "cancelled"]),
});

// Type du formulaire basé sur le schéma
type FormValues = z.infer<typeof formSchema>;

// Composant principal du formulaire
export function CampagneCreateForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Utiliser le hook de création de campagne
  const createCampagneMutation = useCreateCampagne();

  // Initialisation du formulaire avec le schéma de validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      targetAmount: 100,
      localisation: "",
      category: "",
      description: "",
      coverImage: undefined,
      startDate: null,
      endDate: null,
      status: "draft",
    },
  });

  // Gestionnaire de changement d'image
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Convertir le fichier en base64 pour l'API
        const base64Data = await fileToBase64(file);
        
        // Mettre à jour le champ coverImage dans le formulaire avec la string base64
        form.setValue("coverImage", base64Data);
        
        // Créer une URL pour la prévisualisation uniquement
        setImagePreview(fileToPreviewUrl(file));
      } catch (error) {
        console.error("Erreur lors de la conversion de l'image:", error);
      }
    }
  };

  // Navigation entre les étapes
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Validation de l'étape actuelle avant de passer à la suivante
  const validateCurrentStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ["title", "targetAmount", "localisation"];
        break;
      case 2:
        fieldsToValidate = ["category"];
        break;
      case 3:
        fieldsToValidate = ["description"];
        break;
      case 4:
        // Dernière étape : soumettre le formulaire
        await form.handleSubmit(onSubmit)();
        return;
    }

    // Valider uniquement les champs de l'étape actuelle
    const result = await form.trigger(fieldsToValidate);
    if (result) nextStep();
  };

  // Gestionnaire de soumission du formulaire
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      // Convertir les données du formulaire au format attendu par l'API
      const campaignData: CampagneCreate = {
        title: data.title,
        targetAmount: data.targetAmount,
        localisation: data.localisation,
        category: data.category,
        description: data.description,
        coverImage: data.coverImage || null, // Déjà en base64 depuis handleImageChange
        startDate: data.startDate, // Date | null est maintenant compatible
        endDate: data.endDate,     // Date | null est maintenant compatible
        status: data.status || "draft", // Garantir une valeur pour le statut
      };

      // Appeler la mutation pour créer la campagne
      await createCampagneMutation.mutateAsync(campaignData);

      // Rediriger vers la page de succès ou la campagne créée
      router.push("/campagnes");
    } catch (error) {
      console.error("Erreur lors de la création de la campagne:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rendu de l'étape actuelle
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de la campagne</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Titre de la campagne"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant cible</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Montant cible"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="localisation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localisation</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Localisation"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <TipSection tips={stepTips[1]} />
          </>
        );

      case 2:
        return (
          <>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      {categories.map((category) => {
                        const Icon = category.icon;
                        const isSelected = field.value === category.id;
                        return (
                          <div
                            key={category.id}
                            className={`flex flex-col items-center border rounded-lg p-4 cursor-pointer transition-all ${isSelected ? "border-primary bg-primary/10 shadow-sm" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-accent"}`}
                            onClick={() => field.onChange(category.id)}
                          >
                            <div className={`mb-2 p-2 rounded-full ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                              <Icon size={24} className={isSelected ? "text-primary-foreground" : "text-muted-foreground"} />
                            </div>
                            <span className="text-sm font-medium">{category.label}</span>
                            {isSelected && (
                              <Check size={16} className="text-primary absolute top-2 right-2" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <TipSection tips={stepTips[2]} />
          </>
        );

      case 3:
        return (
          <>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description du projet</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez votre projet en détail..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    {field.value.length} / 5000 caractères
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <TipSection tips={stepTips[3]} />
          </>
        );

      case 4:
        return (
          <>
            <div className="space-y-4">
              <div>
                <FormLabel htmlFor="coverImage">Image principale</FormLabel>
                <div className="mt-2">
                  <div className="flex items-center justify-center w-full">
                    <Label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      {imagePreview ? (
                        <div className="w-full h-full relative">
                          <Image
                            src={imagePreview}
                            alt="Aperçu"
                            className="w-full h-full object-cover rounded-lg"
                            width={500}
                            height={500}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">
                              Cliquez pour charger
                            </span>{" "}
                            ou glissez-déposez
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG (MAX. 5MB)
                          </p>
                        </div>
                      )}
                    </Label>
                    <input
                      id="image-upload"
                      name="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      aria-label="Upload d'image pour la campagne"
                    />
                  </div>
                </div>
              </div>

              <TipSection tips={stepTips[4]} />
            </div>
          </>
        );
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Créer une campagne</CardTitle>
        <div className="flex items-center justify-between mt-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 mx-1 rounded-full ${
                s < step
                  ? "bg-primary"
                  : s === step
                  ? "bg-primary/70"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
          <span className={step === 1 ? "text-primary font-medium" : ""}>
            Informations
          </span>
          <span className={step === 2 ? "text-primary font-medium" : ""}>
            Catégorie
          </span>
          <span className={step === 3 ? "text-primary font-medium" : ""}>
            Description
          </span>
          <span className={step === 4 ? "text-primary font-medium" : ""}>
            Image
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">{renderStep()}</form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 1 || isSubmitting}
        >
          Précédent
        </Button>
        <Button onClick={validateCurrentStep} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : step < 4 ? (
            "Suivant"
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Créer la campagne
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
