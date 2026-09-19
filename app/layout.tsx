import "@mantine/core/styles.css";
import "@/styles/tokens.css";
import "@/styles/globals.css";

import { MantineProvider } from "@mantine/core";
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
    <html lang="en">
      <body>
        <MantineProvider theme={amplienceTheme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
