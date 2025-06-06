import "./globals.css";
import { Poppins, Anton } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
})

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
})

// app/layout.tsx
export const metadata = {
  title: 'Sehat Food',
  description: 'Sehat Food helps you live healthier by making smart eating simple.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${anton.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
