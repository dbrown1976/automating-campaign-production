import "@mantine/core/styles.css";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import "@/styles/campaign-production.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { amplienceTheme } from "@/styles/mantine-theme";

export const metadata = {
  title: "Campaign Production",
  description: "Campaign Production proof of concept",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-mantine-color-scheme="light" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=IBM+Plex+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <MantineProvider theme={amplienceTheme} defaultColorScheme="light">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
