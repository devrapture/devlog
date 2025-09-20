"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import { useAuth } from "@/hooks/use-auth"
import { BookOpen, PenTool, Users, Zap } from "lucide-react";
import Link from "next/link";

export function WelcomeHero() {
    //   const { isAuthenticated, user } = useAuth()

    //   if (isAuthenticated) {
    //     return (
    //       <Card className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border-primary/20 mb-8">
    //         <CardContent className="p-8">
    //           <div className="flex items-center justify-between">
    //             <div>
    //               <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.displayName}!</h2>
    //               <p className="text-muted-foreground mb-4">Ready to share your latest insights with the community?</p>
    //             </div>
    //             <Link href="/editor">
    //               <Button size="lg" className="flex items-center gap-2">
    //                 <PenTool className="h-5 w-5" />
    //                 Write New Post
    //               </Button>
    //             </Link>
    //           </div>
    //         </CardContent>
    //       </Card>
    //     )
    //   }

    return (
        <div className="mb-12 text-center">
            <h1 className="mb-6 text-4xl font-bold text-balance md:text-6xl">
                Share Your Developer Journey
            </h1>
            <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl text-balance">
                Join thousands of developers sharing knowledge, experiences, and
                insights. Build your audience, connect with peers, and grow your career.
            </p>

            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/auth">
                    <Button size="lg" className="flex items-center gap-2">
                        <PenTool className="h-5 w-5" />
                        Start Writing
                    </Button>
                </Link>
                <Button variant="outline" size="lg" asChild>
                    <a href="#explore" className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Explore Posts
                    </a>
                </Button>
            </div>

            {/* Feature highlights */}
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
                <Card className="p-6 text-center">
                    <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                        <PenTool className="text-primary h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-semibold">Rich Editor</h3>
                    <p className="text-muted-foreground text-sm">
                        Write with our powerful editor supporting markdown, code blocks, and
                        media
                    </p>
                </Card>

                <Card className="p-6 text-center">
                    <div className="bg-secondary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                        <Users className="text-secondary h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-semibold">Community</h3>
                    <p className="text-muted-foreground text-sm">
                        Connect with fellow developers, follow your favorites, and build
                        your network
                    </p>
                </Card>

                <Card className="p-6 text-center">
                    <div className="bg-accent/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                        <Zap className="text-accent h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-semibold">Engagement</h3>
                    <p className="text-muted-foreground text-sm">
                        Like, bookmark, and share posts. Track your analytics and grow your
                        audience
                    </p>
                </Card>
            </div>
        </div>
    );
}
