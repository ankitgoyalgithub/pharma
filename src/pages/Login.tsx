import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Zap, BarChart3, Brain } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple credential check
    if (email === "kewal@upsynq.com" && password === "kewal@123") {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      navigate("/");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Use kewal@upsynq.com / kewal@123",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-l from-primary/15 to-secondary/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-t from-accent/10 to-primary/5 rounded-full blur-2xl animate-pulse [animation-delay:2s]" />
        
        {/* Moving Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] animate-[move-grid_20s_ease-in-out_infinite]" />
        
        {/* Floating Icons */}
        <div className="absolute top-1/4 left-1/4 animate-float">
          <Zap className="w-8 h-8 text-primary/20" />
        </div>
        <div className="absolute top-3/4 left-1/3 animate-float [animation-delay:1.5s]">
          <BarChart3 className="w-10 h-10 text-accent/20" />
        </div>
        <div className="absolute top-1/2 right-1/4 animate-float [animation-delay:0.5s]">
          <Brain className="w-12 h-12 text-primary/25" />
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content Section */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium text-primary">Decision Intelligence Platform</span>
              </div>
              
              <h1 className="text-5xl font-bold text-foreground leading-tight">
                Transform Data Into
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Intelligent Decisions
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Harness the power of AI-driven analytics to unlock insights, 
                optimize operations, and make data-driven decisions at scale.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: Zap, title: "Real-time Analytics", desc: "Process data instantly" },
                { icon: BarChart3, title: "Advanced Forecasting", desc: "Predict future trends" },
                { icon: Brain, title: "AI-Powered Insights", desc: "Smart recommendations" }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Login Section */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md backdrop-blur-xl bg-card/80 border-border/50 shadow-2xl">
              <CardHeader className="text-center pb-6">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-primary-foreground font-bold text-xl">U</span>
                  </div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    UpSynq
                  </CardTitle>
                </div>
                <CardDescription className="text-base">
                  Welcome back! Please sign in to continue
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Social Login Options */}
                <div className="space-y-3">
                  <Button variant="outline" className="w-full h-12 text-base hover:bg-accent/5" type="button">
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M23.5 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
                      <path fill="currentColor" d="M12.01 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.32 21.13 7.36 24 12.01 24z"/>
                      <path fill="currentColor" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.3C.47 8.24 0 10.06 0 12.01s.47 3.77 1.3 5.38l3.98-3.1z"/>
                      <path fill="currentColor" d="M12.01 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.96 1.19 15.73 0 12.01 0 7.36 0 3.32 2.87 1.3 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
                    </svg>
                    Continue with Outlook
                  </Button>
                  <Button variant="outline" className="w-full h-12 text-base hover:bg-accent/5" type="button">
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Continue with Okta
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-sm uppercase">
                    <span className="bg-card px-4 text-muted-foreground font-medium">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <Button 
                        variant="link" 
                        className="px-0 font-normal text-sm text-primary hover:underline"
                        type="button"
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 text-base pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;