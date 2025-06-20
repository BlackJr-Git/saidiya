"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { authClient } from "@/lib/shared/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
// Définir le schéma de validation
const signupSchema = z
  .object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Format d'email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps extends React.ComponentProps<"form"> {
  redirectAfterSignup?: boolean;
  callbackURL?: string;
  onSuccess?: () => void;
}

export function SignupForm({
  className,
  redirectAfterSignup = true,
  callbackURL = "/dashboard",
  onSuccess,
  ...props
}: SignupFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      // Créer le compte
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
          callbackURL: callbackURL,
        },
        {
          onRequest: () => {
            //show loading
            toast.loading("Inscription en cours...");
          },
          onSuccess: () => {
            toast.success("Compte créé avec succès");
            
            // Appeler le callback si défini
            if (onSuccess) {
              onSuccess();
            }
            
            // Rediriger si demandé
            if (redirectAfterSignup) {
              router.push(callbackURL);
              router.refresh();
            }
          },
          onError: (ctx) => {
            console.log("Erreur d'inscription:", ctx.error);
            toast.error(ctx.error.message);
          },
        }
      );
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Créez votre compte</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Entrez vos informations ci-dessous pour créer un compte
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            type="text"
            placeholder="Junior Asosa"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="juniorasosa@gmail.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full">
          S&apos;inscrire
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Ou continuez avec
          </span>
        </div>
        <Button variant="outline" className="w-full">
          <GitHubLogoIcon className="mr-2 h-4 w-4" />
          S&apos;inscrire avec GitHub
        </Button>
      </div>
      <div className="text-center text-sm">
        Vous avez déjà un compte ?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Se connecter
        </Link>
      </div>
    </form>
  );
}
