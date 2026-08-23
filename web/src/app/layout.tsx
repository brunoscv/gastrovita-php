import type { Metadata } from "next";
import { Maven_Pro, Mulish, Open_Sans, Poppins } from "next/font/google";
import "./globals.css";

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-mulish",
});
const mavenPro = Maven_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-maven",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});
// Fonte do admin, no estilo Argon Dashboard (Open Sans é a fonte oficial do template)
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Hospital Gastrovita",
  description: "Hospital Gastrovita — referência em gastroenterologia em Teresina/PI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${mulish.variable} ${mavenPro.variable} ${poppins.variable} ${openSans.variable} font-body antialiased text-slate-800`}
      >
        {children}
      </body>
    </html>
  );
}
