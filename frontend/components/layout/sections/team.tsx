import { Github, Linkedin, Twitter } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface TeamProps {
  imageUrl: string;
  nameKey: string;
  positionsKey: string;
  socialNetworks: SocialNetworkProps[];
}

interface SocialNetworkProps {
  name: string;
  url: string;
}

export function TeamSection() {

  
  const teamList: TeamProps[] = [
    {
      imageUrl: "https://github.com/byigitt.png",
      nameKey: "Barış Cem Bayburtlu",
      positionsKey: "Frontend Developer",
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/bbayburtlu/",
        },
        {
          name: "Github",
          url: "https://github.com/byigitt",
        },
      ],
    },
    {
      imageUrl: "https://github.com/phun333.png",
      nameKey: "Mehmet Ali Selvet",
      positionsKey: "Smart Contract Developer",
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/ali-selvet/",
        },
        {
          name: "Github",
          url: "https://github.com/phun333",
        },
      ],
    },
  ];
  
  const socialIcon = (socialName: string) => {
    switch (socialName) {
      case "LinkedIn":
        return <Linkedin className="w-5 h-5" />;
      case "Github":
        return <Github className="w-5 h-5" />;
      case "X":
        return <Twitter className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <section id="team" className="container lg:w-[85%] py-24 sm:py-32">
      <div className="text-center mb-8">

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Our Team
        </h2>
        <p className="text-xl text-muted-foreground mt-4 md:w-2/3 mx-auto">
          Building the future of decentralized crowdfunding
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 mx-auto">
        {teamList.map(
          ({ imageUrl, nameKey, positionsKey, socialNetworks }, index) => {
            const name = (nameKey);
            
            return (
              <Card
                key={index}
                className="bg-muted/60 dark:bg-card flex flex-col w-80 h-[480px] overflow-hidden group/hoverimg mx-auto"
              >
                <CardHeader className="p-0 gap-0">
                  <div className="w-full aspect-square overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={`${name} - Team Member`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover saturate-0 transition-all duration-200 ease-linear group-hover/hoverimg:saturate-100 group-hover/hoverimg:scale-[1.03]"
                    />
                  </div>
                  <div className="p-6">
                    <CardTitle className="text-2xl">
                      {name.split(' ').map((part, idx, parts) => {
                        if (parts.length >= 3 && idx === 2) {
                          return <span key={idx} className="text-primary ml-1.5">{part}</span>;
                        } else if (parts.length < 3 && idx === 1) {
                          return <span key={idx} className="text-primary ml-1.5">{part}</span>;
                        } else if (idx > 0) {
                          return <span key={idx} className="ml-1.5">{part}</span>;
                        }
                        return part;
                      })}
                    </CardTitle>
                    <p className="text-sm text-primary font-medium mt-1">
                      {(positionsKey)}
                    </p>
                  </div>
                </CardHeader>

                <CardFooter className="space-x-4 mt-auto p-6 pt-0">
                  {socialNetworks.map(({ name, url }, idx) => (
                    <Link
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-all"
                    >
                      {socialIcon(name)}
                    </Link>
                  ))}
                </CardFooter>
              </Card>
            );
          }
        )}
      </div>
    </section>
  );
}