import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin } from "lucide-react";
import { routes } from "@/lib/routes";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <span className="text-primary-foreground text-sm font-bold">
                  DL
                </span>
              </div>
              <span className="text-xl font-bold">DevLog</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              A modern blogging platform for developers and content creators.
              Share your knowledge and connect with the community.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="https://github.com/devrapture/devlog"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="https://x.com/devrappy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a
                  href="https://www.linkedin.com/in/rapture-godson/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold">Product</h3>
            <div className="space-y-2 text-sm">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground block transition-colors"
              >
                Home
              </Link>
              <Link
                href={routes.auth.signUp}
                className="text-muted-foreground hover:text-foreground block transition-colors"
              >
                Sign Up
              </Link>
              <Link
                href="/editor"
                className="text-muted-foreground hover:text-foreground block transition-colors"
              >
                Write
              </Link>
              <Link
                href="/pricing"
                className="text-muted-foreground hover:text-foreground block transition-colors"
              >
                Pricing
              </Link>
            </div>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="font-semibold">Community</h3>
            <div className="space-y-2 text-sm">
              <Link
                href="/guidelines"
                className="text-muted-foreground hover:text-foreground block transition-colors"
              >
                Guidelines
              </Link>
              <Link
                href="/help"
                className="text-muted-foreground hover:text-foreground block transition-colors"
              >
                Help Center
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-foreground block transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/feedback"
                className="text-muted-foreground hover:text-foreground block transition-colors"
              >
                Feedback
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <div className="space-y-2 text-sm">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground block transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground block transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-muted-foreground hover:text-foreground block transition-colors"
              >
                Cookie Policy
              </Link>
              <Link
                href="/dmca"
                className="text-muted-foreground hover:text-foreground block transition-colors"
              >
                DMCA
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">
            © 2024 DevLog. All rights reserved.
          </p>
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <span>Made with ❤️ for developers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
