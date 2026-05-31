import "./globals.css";
import { Toaster } from "react-hot-toast";
import {
  ThemeProvider,
} from "@/context/ThemeContext";

export const metadata = {
  title: "FinSight AI",
  description:
    "Smart expense tracking and financial analytics platform",
};

export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body
        className="min-h-full flex flex-col"
      >
        <ThemeProvider>
          {children}

          <Toaster
            position="top-right"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
