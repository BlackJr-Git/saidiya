"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { LogIn, UserPlus } from "lucide-react";

interface AuthDialogProps {
  trigger?: React.ReactNode;
  defaultTab?: "login" | "signup";
  onAuthenticated?: () => void;
  triggerClassName?: string;
  redirectAfterAuth?: boolean;
  callbackUrl?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AuthDialog({
  trigger,
  defaultTab = "login",
  onAuthenticated,
  triggerClassName,
  redirectAfterAuth = true,
  callbackUrl = "/campagnes",
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: AuthDialogProps) {
  // Gérer l'état d'ouverture en mode contrôlé ou non contrôlé
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Déterminer si nous utilisons l'état contrôlé ou interne
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  
  // Fonction pour mettre à jour l'état d'ouverture
  const setOpen = (newOpen: boolean) => {
    if (isControlled && setControlledOpen) {
      setControlledOpen(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };
  
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);

  const handleAuthenticated = () => {
    if (onAuthenticated) {
      onAuthenticated();
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className={triggerClassName}>
        {trigger || (
          <Button variant="default" className="cursor-pointer">
            <LogIn className="mr-2 h-4 w-4" />
            Se connecter
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {activeTab === "login" ? "Connexion" : "Créer un compte"}
          </DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")} className="pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">
              <LogIn className="mr-2 h-4 w-4" />
              Connexion
            </TabsTrigger>
            <TabsTrigger value="signup">
              <UserPlus className="mr-2 h-4 w-4" />
              Inscription
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4">
            <LoginForm 
              className="space-y-4" 
              redirectAfterLogin={redirectAfterAuth} 
              callbackURL={callbackUrl}
              onSuccess={handleAuthenticated}
            />
          </TabsContent>
          <TabsContent value="signup" className="mt-4">
            <SignupForm 
              className="space-y-4" 
              redirectAfterSignup={redirectAfterAuth}
              callbackURL={callbackUrl}
              onSuccess={handleAuthenticated}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
