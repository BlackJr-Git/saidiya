"use client";
import React from "react";
import Link from "next/link";
// import { LoginButton } from "@/features/auth/components";
import { ModeToggle } from "@/components/mode-toggle";
import { Logo } from "@/components/ui/logo";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { UserNav } from "../admin-panel/user-nav";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import siteConfig from "@/config";

const menuItems = [
  // { name: "Fonctionnalités", href: "/features" },
  // { name: "Solution", href: "/solution" },
  // { name: "Pricing", href: "/pricing" },
  { name: "Campagnes", href: "/campagnes" },
  { name: "Aides", href: "/aides" },
  { name: "Blog", href: "/blog" },
  { name: "FAQ", href: "/faq" },
  { name: "A propos", href: "/about" },
];

export default function Header() {
  const [menuState, setMenuState] = useState(false);
  return (
    <header className="z-[50] sticky top-0 w-full bg-background/95 border-b backdrop-blur-sm dark:bg-black/[0.6] border-border/40">
      <nav
        data-state={menuState && "active"}
        className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent"
      >
        <div className="m-auto container px-6">
          <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Logo />
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <MobileMenu
                  menuItems={menuItems}
                  className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200"
                />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:pr-4">
                <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                {/* <Link href="/projects">
                  <Button className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Mes Projets
                  </Button>
                </Link> */}
                {/* <LoginButton /> */}
                <UserNav />
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

const MobileMenu = ({
  menuItems,
  className,
}: {
  menuItems: { name: string; href: string }[];
  className?: string;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className={className} />
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] border-r">
        <SheetHeader className="text-left border-b pb-4 mb-5">
          <SheetTitle className="text-xl font-bold">
            <Logo />
          </SheetTitle>
          {/* <SheetDescription className="text-muted-foreground">
            Gérez vos prévisions financières en toute simplicité
          </SheetDescription> */}
        </SheetHeader>

        <div className="flex flex-col gap-4 py-4 border-b mb-4">
          <div className="flex items-center gap-2">
            {/* <LoginButton /> */}
            <UserNav />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Apparence</span>
            <ModeToggle />
          </div>
        </div>

        <nav className="mt-6">
          <ul className="space-y-3">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="flex items-center py-2 px-3 text-sm rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* <Link href="/projects">
          <Button className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Mes Projets
          </Button>
        </Link> */}

        <div className="absolute bottom-0 left-0 right-0 p-5 border-t mt-auto">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} {siteConfig.name}
            </p>
            <Link
              href="/contact"
              className="text-xs text-primary hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
