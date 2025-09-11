import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowLeft, Github, Linkedin, Mail, Palette, Code, Lightbulb } from "lucide-react";
import Image from "next/image";
// Use public/assets/03bcad6d91cea8e9e84f8bf987f3efc26ab8eb42.png for Next.js static asset
const teamLogo = "/assets/03bcad6d91cea8e9e84f8bf987f3efc26ab8eb42.png";

interface TeamPageProps {
  onBack: () => void;
}

export function TeamPage({ onBack }: TeamPageProps) {
  const teamMembers = [
    {
      name: "Bhvayaa Bansal",
      role: "UI/UX Designer",
      category: "Design",
      bio: "Creative visionary who transforms complex ideas into intuitive user experiences. Bhvayaa specializes in modern interface design, user psychology, and creating seamless digital journeys that users love.",
      expertise: ["UI/UX Design", "User Research", "Prototyping", "Design Systems"],
      personality: "Passionate about human-centered design, Bhvayaa believes that great design should be invisible - it should just work beautifully.",
      avatar: "BB",
      color: "bg-purple-500",
      icon: Palette,

      social: {
        linkedin: "#",
        email: "bhvayaa@codesquad.com",
        portfolio: "#"
      }
    },
    {
      name: "Vinay Kumar",
      role: "Creative Designer", 
      category: "Design",
      bio: "Master of visual storytelling and brand identity. Vinay brings ideas to life through compelling graphics, illustrations, and visual narratives that capture the essence of every project.",
      expertise: ["Graphic Design", "Brand Identity", "Visual Communication", "Illustration"],
      personality: "A creative perfectionist who finds inspiration everywhere - from architecture to nature, bringing fresh perspectives to every design challenge.",
      avatar: "VK",
      color: "bg-pink-500",
      icon: Lightbulb,

      social: {
        linkedin: "#",
        email: "vinay@codesquad.com",
        portfolio: "#"
      }
    },
    {
      name: "Ishu",
      role: "Full-Stack Developer",
      category: "Development", 
      bio: "Code wizard who turns design dreams into digital reality. Ishu excels at building scalable, performant web applications with clean, maintainable code and cutting-edge technologies.",
      expertise: ["React & TypeScript", "Node.js", "Database Design", "Cloud Architecture"],
      personality: "Problem-solver extraordinaire with a passion for clean code and innovative solutions. Believes that good code is poetry in motion.",
      avatar: "IS",
      color: "bg-blue-500",
      icon: Code,

      social: {
        github: "#",
        linkedin: "#",
        email: "ishu@codesquad.com"
      }
    }
  ];

  const companyStats = [
    { label: "Projects Delivered", value: "150+" },
    { label: "Happy Clients", value: "80+" },
    { label: "Technologies Mastered", value: "25+" },
    { label: "Team Members", value: "3" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="mb-8 text-white border-white/20 hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Website
          </Button>
          
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              Meet the Team
            </Badge>
            
            {/* Team Logo */}
            <div className="mb-8 flex justify-center">
              <Image 
                src={teamLogo} 
                alt="CodeSquad Logo" 
                height={128}
                width={256}
                className="h-32 w-auto object-contain"
                priority
              />
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              CodeSquad Creative Studio
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              We are a passionate team of designers and developers crafting exceptional digital experiences. 
              From concept to code, we transform ideas into powerful, user-centric solutions.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-white/10 px-4 py-2 rounded-full">Based in Delhi, India 🇮🇳</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">Remote-Friendly Team</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">Creative &amp; Technical Excellence</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Company Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {companyStats.map((stat, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Members */}
        <div className="space-y-16">
          {teamMembers.map((member, index) => {
            const Icon = member.icon;
            const isEven = index % 2 === 0;
            
            return (
              <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                {/* Member Image/Avatar - appears first on mobile, alternates on desktop */}
                <div className={`${!isEven ? 'lg:order-2' : ''}`}>
                  <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <div className={`${member.color} h-96 flex items-center justify-center relative`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
                      <div className="text-center text-white relative z-10">
                        <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                          <span className="text-4xl font-bold">{member.avatar}</span>
                        </div>
                        <Icon className="w-12 h-12 mx-auto mb-4 opacity-80" />
                        <Badge className="bg-white/20 text-white border-white/30">
                          {member.category}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Member Info */}
                <div className={`${!isEven ? 'lg:order-1' : ''} space-y-6`}>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{member.name}</h2>
                    <p className="text-xl text-blue-600 mb-4">{member.role}</p>
                    <p className="text-gray-600 leading-relaxed mb-6">{member.bio}</p>
                    <p className="text-gray-700 italic border-l-4 border-blue-200 pl-4 bg-blue-50 p-4 rounded-r-lg">
                      &quot;{member.personality}&quot;
                    </p>
                  </div>

                  {/* Expertise */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="bg-gray-50">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>



                  {/* Social Links */}
                  <div className="flex gap-3">
                    {member.social.github && (
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        GitHub
                      </Button>
                    )}
                    {member.social.linkedin && (
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Company CTA */}
        <div className="mt-20 text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Work with CodeSquad?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Let&apos;s bring your digital vision to life. We specialize in creating beautiful, 
            functional web applications that users love and businesses thrive on.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
              Start a Project
            </Button>
            <Button variant="outline" className="px-8 py-3">
              View Portfolio
            </Button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center text-gray-500">
          <p>Built with ❤️ in Delhi, India • Crafted by the CodeSquad team</p>
        </div>
      </div>
    </div>
  );
}