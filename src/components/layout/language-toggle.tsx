
"use client"

import * as React from "react"
import { Languages } from "lucide-react"
import { usePathname, useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1];

  const handleLanguageChange = (nextLocale: string) => {
    // This functionality is disabled for now.
    // To re-enable, the routing logic in middleware.ts needs to be restored.
    console.log(`Language change to ${nextLocale} disabled.`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
            <Languages className="h-[1.2rem] w-[1.2rem]"/>
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange("en")} disabled>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange("pt")} disabled>
          Português
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
