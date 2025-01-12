"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { LucideMenu } from "lucide-react";
import { type MenuItem } from "~/types/MenuItem";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";

const menuItems: MenuItem[] = [
  {
    id: 10,
    title: "Services",
    link: "/services",
  },
  {
    id: 13,
    title: "Pricing",
    link: "/pricing",
  },
  {
    id: 14,
    title: "Blog",
    link: "/blog",
  },
  {
    id: 15,
    title: "Contact Us",
    link: "/contact-us",
  },
];

const Navbar = () => {
  return (
    <nav className="relative flex items-center justify-center px-20 py-5 md:justify-between">
      <Image src="/logo.png" height={20} width={100} alt="logo" />
      <Button
        className="absolute left-10 md:hidden"
        variant={"ghost"}
        size={"icon"}
      >
        <LucideMenu className="h-6 w-6" />
      </Button>
      <NavigationMenu className="hidden md:block">
        <NavigationMenuList>
          {menuItems.map((ni, index) => {
            return (
              <>
                {typeof ni.submenus === "undefined" ? (
                  <NavigationMenuLink
                    href={ni.link}
                    key={index}
                    className={navigationMenuTriggerStyle()}
                  >
                    {ni.title}
                  </NavigationMenuLink>
                ) : (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuTrigger>{ni.title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      {
                        // TODO: Add the content with the submenu's here
                      }
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )}
              </>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};

export default Navbar;
