import "../../styles/global.css";
import Header from "../../components/common/Header/Header";
import Footer from "../../components/common/Footer";
import { Providers } from "../(providers)/providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amit Suthar",
  description: "Generated by Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Amit Suthar</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link rel="icon" href="/gopher.png" />
      </head>
      <body>
        <Providers>
          <Header />
          <div className="layout">
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
