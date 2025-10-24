import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Bitcoin, TrendingUp, PiggyBank } from "lucide-react";
import { CryptoQuizBot } from "@/components/CryptoQuizBot";

const topics = [
  {
    id: "gold",
    icon: Coins,
    title: "Gold Investment",
    color: "gold",
    front: "Why invest in Gold?",
    back: "Gold is a safe-haven asset that retains value during economic uncertainty. It's been a store of wealth for thousands of years and acts as a hedge against inflation.",
  },
  {
    id: "crypto",
    icon: Bitcoin,
    title: "Cryptocurrency",
    color: "primary",
    front: "What is Cryptocurrency?",
    back: "Digital or virtual currency secured by cryptography. Bitcoin, the first crypto, enables peer-to-peer transactions without intermediaries like banks.",
  },
  {
    id: "stocks",
    icon: TrendingUp,
    title: "Stock Market",
    color: "primary",
    front: "How do Stocks work?",
    back: "Stocks represent ownership in a company. When you buy stocks, you become a shareholder and can profit from the company's growth through capital appreciation and dividends.",
  },
  {
    id: "mutual",
    icon: PiggyBank,
    title: "Mutual Funds",
    color: "gold",
    front: "What are Mutual Funds?",
    back: "Investment vehicles that pool money from multiple investors to invest in diversified portfolios of stocks, bonds, or other securities, managed by professionals.",
  },
];

export const Learn = () => {
  const [flipped, setFlipped] = useState<string[]>([]);

  const toggleFlip = (id: string) => {
    setFlipped(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">
            Learn & Master
            <span className="block text-primary">Crypto Knowledge</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Test your knowledge with our AI-powered quiz bot and interactive flashcards
          </p>
        </div>

        {/* AI Quiz Bot Section */}
        <div className="mb-20 animate-fade-in">
          <CryptoQuizBot />
        </div>

        {/* Flashcards Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-heading font-bold text-center mb-8">
            Quick Learning Flashcards
          </h2>
        </div>

        {/* Flashcards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {topics.map((topic, index) => {
            const isFlipped = flipped.includes(topic.id);
            
            return (
              <div
                key={topic.id}
                className="perspective-1000 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card
                  className={`relative h-80 cursor-pointer transition-all duration-500 preserve-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                  } glass border-${topic.color}/30 hover:border-${topic.color}/50 hover:shadow-${topic.color === 'gold' ? 'gold' : 'neon'}`}
                  onClick={() => toggleFlip(topic.id)}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                  }}
                >
                  {/* Front */}
                  <CardContent
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className={`w-20 h-20 rounded-2xl glass border-${topic.color}/30 flex items-center justify-center mb-6`}>
                      <topic.icon className={`w-10 h-10 text-${topic.color}`} />
                    </div>
                    <h3 className="text-2xl font-heading font-bold mb-4 text-center">
                      {topic.title}
                    </h3>
                    <p className="text-lg text-center text-muted-foreground">
                      {topic.front}
                    </p>
                    <div className="absolute bottom-6 text-sm text-muted-foreground">
                      Click to flip
                    </div>
                  </CardContent>

                  {/* Back */}
                  <CardContent
                    className="absolute inset-0 flex items-center justify-center p-8 backface-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <div className="text-center space-y-4">
                      <div className={`text-${topic.color} mb-4`}>
                        <topic.icon className="w-12 h-12 mx-auto" />
                      </div>
                      <p className="text-lg leading-relaxed">
                        {topic.back}
                      </p>
                    </div>
                    <div className="absolute bottom-6 text-sm text-muted-foreground">
                      Click to flip back
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Additional Learning Resources */}
        <div className="mt-20 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Card className="glass border-white/10">
            <CardContent className="p-8">
              <h2 className="text-3xl font-heading font-bold mb-6 text-center">
                Your Learning Journey
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-heading font-bold text-primary">50</div>
                  <p className="text-muted-foreground">Quiz Questions</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-heading font-bold text-gold">4</div>
                  <p className="text-muted-foreground">Learning Topics</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-heading font-bold text-primary">24/7</div>
                  <p className="text-muted-foreground">AI Quiz Bot Access</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Learn;