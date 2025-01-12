import React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { adminSidebarMenu } from "~/lib/constants";
import { Button } from "~/components/ui/button";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface SidebarItemProps {
  name: string;
  icon: React.ReactNode;
  isActive: boolean;
  link: string;
}

const SidebarItem = ({ name, icon, link, isActive }: SidebarItemProps) => (
  <Link
    href={link}
    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "border bg-slate-500/30 text-gray-700"
        : "text-gray-700 hover:bg-accent/5 hover:text-gray-500"
    }`}
  >
    {icon}
    <span>{name}</span>
  </Link>
);

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <div className="relative">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex min-h-screen w-72 flex-col shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between border-b p-4">
          <Link href="/dashboard" className="flex w-full items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={60}
              className="mx-auto"
            />
          </Link>
          <Button
            onClick={() => setSidebarOpen(false)}
            className="rounded-full p-1 text-muted-foreground hover:bg-accent/10 hover:text-accent lg:hidden"
          >
            <X />
          </Button>
        </div>

        {/* Sidebar content */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {adminSidebarMenu.map((item, index) => (
            <SidebarItem
              key={index}
              name={item.name}
              icon={item.icon}
              link={item.link}
              isActive={pathname === item.link}
            />
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t p-4">
          <p className="text-xs text-muted-foreground">
            © 2024 Kishan Kumar Sah. All rights reserved.
          </p>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-4 left-4 z-40 rounded-full bg-accent p-3 text-accent-foreground shadow-lg lg:hidden"
      >
        <Menu size={24} />
      </button>
    </div>
  );
};

export default Sidebar;
