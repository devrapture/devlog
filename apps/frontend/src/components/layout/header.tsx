"use client";

import type React from "react";

import Link from "next/link";
import { useState } from "react";
// import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/logic/use-toast";
import { routes } from "@/lib/routes";
import {
  Bookmark,
  FileText,
  LogOut,
  Menu,
  PenTool,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { getInitials } from "@/lib/utils";

export function Header() {
  const { data: session, status } = useSession();

  //   const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: routes.auth.login,
      });
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="text-primary-foreground text-sm font-bold">
                DL
              </span>
            </div>
            <span className="text-xl font-bold">DevLog</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="mx-8 hidden max-w-md flex-1 md:flex">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                type="search"
                placeholder="Search posts, authors, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-4 md:flex">
            {session?.user ? (
              <>
                <Link href="/editor">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <PenTool className="h-4 w-4" />
                    Write
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session?.user.avatar ?? "/placeholder-user.jpg"}
                        />
                        <AvatarFallback>
                          {session?.user.avatar
                            ? getInitials(session?.user.avatar)
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">
                          {session?.user?.displayName}
                        </p>
                        <p className="text-muted-foreground w-[200px] truncate text-sm">
                          {session?.user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={routes.profile}
                        className="flex items-center gap-2"
                      >
                        <User className="h-4 w-4 text-current" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/drafts" className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-current" />
                        My Drafts
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/bookmarks"
                        className="flex items-center gap-2"
                      >
                        <Bookmark className="h-4 w-4 text-current" />
                        Bookmarks
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile/edit"
                        className="flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4 text-current" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4 text-current" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href={routes.auth.login}>
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href={routes.auth.signUp}>
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="space-y-4 border-t py-4 md:hidden">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </form>

            {/* Mobile Navigation */}
            {session?.user ? (
              <div className="space-y-2">
                <Link href="/editor" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <PenTool className="h-4 w-4" />
                    Write
                  </Button>
                </Link>
                <Link
                  href={routes.profile}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Link href="/drafts" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    My Drafts
                  </Button>
                </Link>
                <Link
                  href="/bookmarks"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <Bookmark className="h-4 w-4" />
                    Bookmarks
                  </Button>
                </Link>
                <Link
                  href="/profile/edit"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={async () => {
                    await handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
