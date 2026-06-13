import { Geist, Geist_Mono } from "next/font/google";
import { BASE_PATH } from "./lib/asset";
import DataProvider from "./Components/DataProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://organicheritage.store/grains"),
  title: "Organic Grains",
  description: "Organic Grains - Premium Quality Grains",
  icons: {
    icon: `${BASE_PATH}/logo11.png`,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <DataProvider>{children}</DataProvider>
      </body>
    </html>
  );
}
