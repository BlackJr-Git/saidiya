"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { fileToBase64, fileToPreviewUrl } from "@/utils/file";
// import { useAuth } from "@/features/auth/hooks";
import { AuthDialog } from "@/features/auth/components/auth-dialog";
import * as z from "zod";
import { Check, Loader2, BookOpen, Heart, Leaf, Palette, Laptop, Users, Trophy, Brush, Music, Building2, HelpCircle } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
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
// import { useEffect } from "react";
import {useConnectionStore} from "@/store/connection";
// Catégories disponibles avec leurs icônes
const categories = [
  { id: "education", label: "Éducation", icon: BookOpen },
  { id: "health", label: "Santé", icon: Heart },
  { id: "environment", label: "Environnement", icon: Leaf },
  { id: "culture", label: "Culture", icon: Palette },
  { id: "tech", label: "Technologie", icon: Laptop },
  { id: "community", label: "Communauté", icon: Users },
  { id: "sport", label: "Sport", icon: Trophy },
  { id: "art", label: "Art", icon: Brush },
  { id: "music", label: "Musique", icon: Music },
  { id: "business", label: "Entreprise", icon: Building2 },
  { id: "other", label: "Autre", icon: HelpCircle },
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
    "Décrivez votre projet en détail, son objectif et son impact",
    "Expliquez pourquoi votre projet mérite d'être financé",
    "Soyez transparent sur l'utilisation des fonds",
  ],
  4: [
    "Choisissez une image attrayante qui représente bien votre projet",
    "Une bonne image augmente considérablement l'attrait de votre campagne",
  ],
};

// Composant de conseils
function TipSection({ tips }: { tips: string[] }) {
  return (
    <div className="bg-muted/50 p-4 rounded-lg mt-6">
      <h4 className="text-sm font-medium mb-2">Conseils:</h4>
      <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
        {tips.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}

// Schéma de validation du formulaire
const formSchema = z.object({
  title: z.string().min(10, "Le titre doit contenir au moins 10 caractères").max(100, "Le titre ne doit pas dépasser 100 caractères"),
  targetAmount: z.coerce.number().positive("Le montant cible doit être positif").min(100, "Le montant minimum est de 100"),
  localisation: z.string().min(2, "La localisation est requise"),
  category: z.string().min(1, "Veuillez sélectionner une catégorie"),
  description: z.string().min(50, "La description doit contenir au moins 50 caractères").max(5000, "La description ne doit pas dépasser 5000 caractères"),
  coverImage: z.string().nullable().optional(),
  status: z.enum(["draft", "active", "completed", "cancelled"]),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
});

// Type du formulaire basé sur le schéma
type FormValues = z.infer<typeof formSchema>;

// Composant principal du formulaire
export function CampagneCreateForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  // Vérifier si l'utilisateur est authentifié
  // const { isAuthenticated, isLoading, user } = useAuth();
  const {isConnected} = useConnectionStore();
  
  // Log pour débogage
  // useEffect(() => {
  //   console.log("Auth state:", { isAuthenticated, isLoading, user, showAuthDialog });
  // }, [isAuthenticated, isLoading, user, showAuthDialog]);

  // Utiliser le hook de création de campagne
  const createCampagneMutation = useCreateCampagne();

  // Initialiser le formulaire avec les valeurs par défaut
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      targetAmount: undefined,
      localisation: "",
      category: "",
      description: "",
      coverImage: null,
      status: "draft",
      startDate: null,
      endDate: null,
    },
  });

  // Navigation entre les étapes
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Gestionnaire de changement d'image
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

  // Gestionnaire d'authentification réussie
  const handleAuthenticated = () => {
    console.log("Authentication successful");
    // Fermer explicitement le dialogue
    setShowAuthDialog(false);
    // Attendre un peu pour que l'état d'authentification soit mis à jour
    setTimeout(() => {
      console.log("Submitting form after auth");
      form.handleSubmit(onSubmit)();
    }, 500);
  };

  // Gestionnaire de soumission du formulaire
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // Vérifier si l'utilisateur est authentifié avant de soumettre
    if (!isConnected) {
      console.log("User is not authenticated, showing auth dialog");
      setShowAuthDialog(true);
      console.log("showAuthDialog set to:", true);
      return;
    }
    
    console.log("User is authenticated, proceeding with submission");

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
        startDate: data.startDate || null, // Garantir Date | null
        endDate: data.endDate || null,     // Garantir Date | null
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

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de clôture</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      setDate={(date) => field.onChange(date)}
                      placeholder="Choisir la date de clôture"
                      fromDate={new Date()} // Date minimale = aujourd'hui
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
                          <Laptop className="w-10 h-10 mb-3 text-muted-foreground" />
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
      
      default:
        return null;
    }
  };

  return (
    <>
      {/* Dialogue d'authentification */}
      <AuthDialog 
        trigger={<span style={{ display: 'none' }} />}
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onAuthenticated={handleAuthenticated}
        redirectAfterAuth={false}
        callbackUrl="" // Laisser vide pour éviter toute redirection
        defaultTab="login"
      />
      
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
    </>
  );
}
