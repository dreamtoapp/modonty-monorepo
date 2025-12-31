export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="container mx-auto max-w-[1128px]">
        <div className="bg-card border border-border rounded-lg shadow-sm p-8 md:p-12 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Logo/Brand Mark */}
            <div className="flex justify-center mb-8">
              <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-2xl">M</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight text-foreground">
              Coming Soon
            </h1>

            {/* Description */}
            <p className="text-base leading-relaxed text-muted-foreground max-w-md mx-auto">
              We're working on something amazing. Stay tuned for updates and be the first to know when we launch.
            </p>

            {/* Additional Info */}
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Thank you for your patience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
