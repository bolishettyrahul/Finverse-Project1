import { AnimatedHero } from "@/components/home/AnimatedHero";
import { FeatureCards } from "@/components/home/FeatureCards";
import { LiveCharts } from "@/components/home/LiveCharts";

const Index = () => {
  return (
    <div className="min-h-screen">
      <AnimatedHero />
      <FeatureCards />
      <LiveCharts />
    </div>
  );
};

export default Index;
