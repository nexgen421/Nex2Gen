import "~/styles/globals.css";
import { DM_Sans } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "sonner";

const manrope = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "100", "200", "300", "800", "900"],
});

export const metadata = {
  title: "Nex Gen Courier Service",
  description: "Aapki Delivery, Hamari Priority",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.className}`}>
      <body className="">
        <Toaster richColors />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
