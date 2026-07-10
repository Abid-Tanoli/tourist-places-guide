import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mountain, Mail, CheckCircle } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("If the email exists, a reset link has been sent.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-sand-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Mountain className="size-8 text-primary" />
            <span className="font-heading text-2xl font-bold text-foreground">Pakistan Explorer</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
          <p className="text-muted-foreground mt-1">Enter your email and we&apos;ll send you a reset link</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            {sent ? (
              <div className="text-center space-y-4 py-4">
                <div className="size-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="size-8 text-primary" />
                </div>
                <p className="text-foreground">Check your email for the password reset link.</p>
                <Button asChild variant="outline">
                  <Link to="/login">Back to Sign In</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  <Link to="/login" className="text-primary hover:underline">
                    Back to Sign In
                  </Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
