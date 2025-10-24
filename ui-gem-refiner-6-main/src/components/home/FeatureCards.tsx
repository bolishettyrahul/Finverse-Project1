import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Activity, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: TrendingUp,
    title: "Demo Invest",
    description: "Practice trading with ₹1,00,000 virtual credits. Experience real market dynamics without any risk.",
    link: "/invest",
    color: "primary",
  },
  {
    icon: Activity,
    title: "Live Market",
    description: "Track real-time Gold and Bitcoin prices with AI-powered analytics and predictions.",
    link: "/market",
    color: "gold",
  },
  {
    icon: BookOpen,
    title: "Learn Basics",
    description: "Master financial concepts through interactive lessons and flashcard-style learning.",
    link: "/learn",
    color: "primary",
  },
];

export const FeatureCards = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="glass border-white/10 hover:border-primary/50 transition-all hover:shadow-neon group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8 space-y-4">
                <div className={`w-16 h-16 rounded-xl glass border-${feature.color}/30 flex items-center justify-center group-hover:shadow-${feature.color === 'gold' ? 'gold' : 'neon'} transition-all group-hover:scale-110`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}`} />
                </div>
                
                <h3 className="text-2xl font-heading font-bold">{feature.title}</h3>
                
                <p className="text-muted-foreground">{feature.description}</p>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-between group-hover:text-primary group-hover:bg-primary/10"
                  asChild
                >
                  <Link to={feature.link}>
                    Explore
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
