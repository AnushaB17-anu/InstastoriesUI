import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Stories | Experience",
  description: "A modern, high-performance Instagram Stories clone built with Next.js and Tailwind CSS.",
  openGraph: {
    title: "Instagram Stories Clone",
    description: "Responsive story navigation with progress indicators and view tracking.",
    url: "https://your-social-app.com",
    siteName: "InstaStories",
    images: [
      {
        url: "https://images.unsplash.com/photo-1611262588024-d12170493a0f?auto=format&fit=crop&w=1200&h=630",
        width: 1200,
        height: 630,
        alt: "Instagram Stories Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Stories Clone",
    description: "Built with Next.js 14 and SSR.",
    images: ["https://images.unsplash.com/photo-1611262588024-d12170493a0f"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Injecting Tailwind script */}
        <script src="https://cdn.tailwindcss.com"></script>
        <style dangerouslySetInnerHTML={{ __html: `
          @layer utilities {
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          }
          body {
            background-color: #fafafa;
            color: #262626;
            -webkit-font-smoothing: antialiased;
            margin: 0;
          }
          @media (prefers-color-scheme: dark) {
            body {
              background-color: #000;
              color: #fff;
            }
          }
        `}} />
      </head>
      <body className="antialiased selection:bg-purple-200">
        {/* Next.js renders the page content (children) here */}
        {children}
      </body>
    </html>
  );
}