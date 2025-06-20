"use client";

import { useState } from "react";
// import { Button } from "@/components/ui/button"
import { useAuth } from "../hooks/use-auth";
import { AuthDialog } from "./auth-dialog";

interface LoginButtonProps {
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function LoginButton({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  className,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  variant = "default",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  size = "default",
}: LoginButtonProps) {
  const { isAuthenticated } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Ne rien afficher si l'utilisateur est déjà connecté
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* <Button 
        variant={variant} 
        size={size}
        className={className}
        onClick={() => setShowAuthDialog(true)}
      >
        Se connecter
      </Button> */}

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        redirectAfterAuth={false}
      />
    </>
  );
}
