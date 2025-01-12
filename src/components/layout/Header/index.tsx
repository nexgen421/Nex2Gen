import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import DropdownUser from "./DropdownUser";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm dark:bg-gray-900">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden">
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2"
            variant="ghost"
          >
            <div className="space-y-1.5">
              <div
                className={`h-0.5 w-6 bg-current transition-all ${sidebarOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <div
                className={`h-0.5 w-6 bg-current transition-all ${sidebarOpen ? "opacity-0" : ""}`}
              />
              <div
                className={`h-0.5 w-6 bg-current transition-all ${sidebarOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </div>
          </Button>

          <Link href="/" className="ml-3">
            <Image width={32} height={32} src="/logo.png" alt="Logo" />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden flex-1 px-4 sm:block">
          <div className="relative max-w-xs">
            <input
              type="search"
              className="w-full rounded-lg border px-4 py-2 pl-10 focus:outline-none focus:ring-2"
              placeholder="Search..."
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
          </div>
        </div>

        {/* User Menu */}
        <DropdownUser />
      </div>
    </header>
  );
};

export default Header;
