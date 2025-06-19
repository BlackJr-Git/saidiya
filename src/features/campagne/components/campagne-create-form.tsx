"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  Image as ImageIcon,
  Loader2,
  AlertTriangle,
  GraduationCap,
  Leaf,
  Heart,
  Handshake,
  Palette,
  Lightbulb,
  Building,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
// Imports de select supprimés car remplacés par des cartes
import { Label } from "@/components/ui/label";
import Image from "next/image";

// Schéma de validation pour tout le formulaire
const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Le titre doit contenir au moins 5 caractères" })
    .max(100, { message: "Le titre ne doit pas dépasser 100 caractères" }),
  targetAmount: z.coerce
    .number()
    .min(100, { message: "Le montant minimum est de 100 $" })
    .max(1000000, { message: "Le montant maximum est de 1 000 000 $" }),
  category: z
    .string()
    .min(1, { message: "Veuillez sélectionner une catégorie" }),
  description: z
    .string()
    .min(100, {
      message: "La description doit contenir au moins 100 caractères",
    })
    .max(5000, {
      message: "La description ne doit pas dépasser 5 000 caractères",
    }),
  coverImage: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Liste des catégories disponibles avec icônes
const categories = [
  { id: "education", label: "Éducation", icon: GraduationCap },
  { id: "environment", label: "Environnement", icon: Leaf },
  { id: "health", label: "Santé", icon: Heart },
  { id: "social", label: "Action sociale", icon: Handshake },
  { id: "culture", label: "Culture & Arts", icon: Palette },
  { id: "tech", label: "Innovation & Technologie", icon: Lightbulb },
  { id: "community", label: "Développement local", icon: Building },
];

// Composant pour afficher les conseils
function TipSection({ tips }: { tips: string[] }) {
  return (
    <div className="bg-muted/50 p-4 rounded-lg border">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle size={16} className="text-muted-foreground" />
        <h3 className="text-sm font-medium">Conseils</h3>
      </div>
      <ul className="space-y-1">
        {tips.map((tip, index) => (
          <li
            key={index}
            className="text-xs text-muted-foreground flex gap-2 items-start"
          >
            <span className="text-muted-foreground mt-0.5">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CampagneCreateForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Définir les conseils pour chaque étape
  const stepTips = {
    1: [
      "Choisissez un titre clair et accrocheur qui résume votre projet.",
      "Définissez un objectif financier réaliste et justifiable.",
    //   "Pensez à inclure une marge pour les frais de gestion (environ 5%).",
    ],
    2: [
      "Sélectionnez la catégorie qui correspond le mieux à l'objectif principal de votre projet.",
      "La catégorie aide les donateurs potentiels à trouver votre campagne.",
      "Elle influence également l'algorithme de mise en avant des campagnes.",
    ],
    3: [
      "Expliquez clairement pourquoi votre projet est important.",
      "Détaillez comment les fonds seront utilisés.",
      "Partagez votre histoire personnelle et votre motivation.",
      "Incluez des informations sur votre équipe si pertinent.",
    ],
    4: [
      "Utilisez une image de haute qualité au format 16:9.",
      "Choisissez une image percutante qui illustre votre projet.",
      "Évitez les textes dans l'image principale.",
      "Assurez-vous d'avoir le droit d'utiliser cette image.",
    ],
  };

  // Form initialization with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      targetAmount: undefined,
      category: "",
      description: "",
      coverImage: undefined,
    },
    mode: "onChange",
  });

  // Gestionnaire de changement d'étape
  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Gestionnaire de sélection d'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("coverImage", file);

      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Gestionnaire de soumission du formulaire
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Données de campagne soumises:", data);

      // TODO: Appeler l'API pour créer une nouvelle campagne
      // const response = await createCampagne(data);

      // Simulation d'une requête API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Rediriger vers la page de succès ou la campagne créée
      router.push("/campagnes");
    } catch (error) {
      console.error("Erreur lors de la création de la campagne:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Vérifier si l'étape courante est valide
  const validateCurrentStep = async () => {
    let isValid = false;

    switch (step) {
      case 1:
        isValid = await form.trigger(["title", "targetAmount"]);
        break;
      case 2:
        isValid = await form.trigger(["category"]);
        break;
      case 3:
        isValid = await form.trigger(["description"]);
        break;
      case 4:
        // L'image est optionnelle, donc cette étape est valide par défaut
        isValid = true;
        break;
    }

    if (isValid) {
      if (step < 4) {
        nextStep();
      } else {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  // Rendu conditionnel des étapes du formulaire
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
                  <FormLabel>Nom de la campagne</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Rénovation de l'école primaire Victor Hugo"
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
                  <FormLabel>Objectif de financement ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="10000"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || "")
                      }
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
