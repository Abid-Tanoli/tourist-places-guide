import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mountain, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-sand-50 px-4">
      <div className="text-center">
        <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Mountain className="size-10 text-primary" />
        </div>
        <h1 className="text-8xl font-bold text-primary mb-4 font-heading">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link to="/">
            <ArrowLeft className="size-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
