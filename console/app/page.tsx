import { Lock, BarChart3, Shield, Clock, Activity } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Main Content */}
          <div className="bg-card border border-border rounded-lg shadow-sm p-8 md:p-12 text-center md:text-left">
            <div className="space-y-6">
              {/* Logo/Brand Mark */}
              <div className="flex justify-center md:justify-start mb-8">
                <div className="h-20 w-20 rounded-xl bg-primary flex items-center justify-center shadow-lg transition-transform hover:scale-105">
                  <span className="text-white font-bold text-3xl">M</span>
                </div>
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Clock className="h-4 w-4" />
                <span>Coming Soon</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                Client Portal
                <br />
                <span className="text-primary">Launching Soon</span>
              </h1>

              {/* Description */}
              <p className="text-lg leading-relaxed text-muted-foreground max-w-lg">
                We're building a secure client portal where you can access your account, view your dashboard, and manage your services.
              </p>

              {/* Features Preview */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-sm text-foreground mb-1">Secure Login</h3>
                    <p className="text-xs text-muted-foreground">Safe account access</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-sm text-foreground mb-1">Your Dashboard</h3>
                    <p className="text-xs text-muted-foreground">Track everything</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-sm text-foreground mb-1">Account Security</h3>
                    <p className="text-xs text-muted-foreground">Protected data</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-sm text-foreground mb-1">Real-time Updates</h3>
                    <p className="text-xs text-muted-foreground">Stay informed</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Thank you for your patience. We'll notify you as soon as it's ready.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Visual Element */}
          <div className="hidden md:block relative">
            <div className="relative h-[500px]">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-2xl blur-3xl"></div>
              
              {/* Card stack visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative space-y-6">
                  {/* Card 1 */}
                  <div className="w-64 h-40 bg-card border-2 border-border rounded-lg shadow-lg rotate-3 transform hover:rotate-6 transition-transform">
                    <div className="p-6 h-full flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="h-2 bg-muted rounded w-3/4"></div>
                        <div className="h-2 bg-muted rounded w-1/2"></div>
                      </div>
                      <div className="h-8 bg-primary/20 rounded"></div>
                    </div>
                  </div>
                  
                  {/* Card 2 */}
                  <div className="w-64 h-40 bg-card border-2 border-primary/30 rounded-lg shadow-lg -rotate-3 transform hover:-rotate-6 transition-transform absolute top-12 left-12">
                    <div className="p-6 h-full flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="h-2 bg-muted rounded w-full"></div>
                        <div className="h-2 bg-muted rounded w-2/3"></div>
                      </div>
                      <div className="h-8 bg-primary/30 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
