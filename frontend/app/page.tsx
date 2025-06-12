import { BenefitsSection } from "@/components/layout/sections/benefits";
import { CommunitySection } from "@/components/layout/sections/community";
import { ContactSection } from "@/components/layout/sections/contact";
import { FAQSection } from "@/components/layout/sections/faq";
import { FooterSection } from "@/components/layout/sections/footer";
import { HeroSection } from "@/components/layout/sections/hero";
import { PricingSection } from "@/components/layout/sections/pricing";
import { ServicesSection } from "@/components/layout/sections/services";
import { SponsorsSection } from "@/components/layout/sections/sponsors";
import { TeamSection } from "@/components/layout/sections/team";
import { TestimonialSection } from "@/components/layout/sections/testimonial";

export const metadata = {
  title: "Stellar Crowdfunding",
  description: "Decentralized crowdfunding platform built on Stellar (XLM) blockchain",
  openGraph: {
    type: "website",
    url: "https://github.com/wiredwiredwired/xlm-crowdfunding.git",
    title: "Stellar Crowdfunding - Decentralized Platform",
    description: "Create and fund innovative projects using Stellar blockchain",
    images: [
      {
        url: "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
        width: 1200,
        height: 630,
        alt: "Stellar Crowdfunding Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://github.com/yourrepo/stellar-crowdfunding.git",
    title: "Stellar Crowdfunding - Decentralized Platform",
    description: "Create and fund innovative projects using Stellar blockchain",
    images: [
      "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
    ],
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <SponsorsSection />
      <BenefitsSection />
      <TeamSection />
      <FooterSection />
    </>
  );
}
