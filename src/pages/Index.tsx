
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import VirtualMatchesPage from "./VirtualMatchesPage";

const Index = () => {
  return (
    <div>
      <div className="container mx-auto py-4">
        <div className="flex justify-end mb-4">
          <Button asChild variant="outline">
            <Link to="/vsports-analyzer">V-Sports Enigma Analyzer</Link>
          </Button>
        </div>
      </div>
      <VirtualMatchesPage />
    </div>
  );
};

export default Index;
