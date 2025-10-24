import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const AnimatedHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background waves */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-neon opacity-50 animate-wave-flow" />
        <div className="absolute top-1/4 left-0 w-full h-2 bg-gradient-neon opacity-30 animate-wave-flow" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-1/2 left-0 w-full h-2 bg-gradient-neon opacity-20 animate-wave-flow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-3/4 left-0 w-full h-2 bg-gradient-neon opacity-10 animate-wave-flow" style={{ animationDelay: "1.5s" }} />
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-glow blur-3xl opacity-30 animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-gold blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/30">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">100% Risk-Free Demo Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-tight">
            Redefining
            <span className="block bg-gradient-neon bg-clip-text text-transparent animate-pulse">
              Financial Awareness
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Learn, Invest, and Experience the Markets — Risk-Free
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" variant="neon" className="text-lg" asChild>
              <Link to="/invest">
                Start Demo Investing
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="glass" className="text-lg" asChild>
              <Link to="/learn">
                Learn Basics
                <Sparkles className="ml-2" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-heading font-bold text-primary">
                ₹1L
              </div>
              <p className="text-sm text-muted-foreground">Demo Credits</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-heading font-bold text-gold">
                Real-Time
              </div>
              <p className="text-sm text-muted-foreground">Market Data</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-heading font-bold text-primary">
                24/7
              </div>
              <p className="text-sm text-muted-foreground">Trading</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
