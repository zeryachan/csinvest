import { Navigation } from "@/components/Navigation";
import { RealTimeDashboard } from "@/components/RealTimeDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <RealTimeDashboard />
    </div>
  );
};

export default Index;
