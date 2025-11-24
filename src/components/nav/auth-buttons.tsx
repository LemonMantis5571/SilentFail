"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";

import { Loader2, LogOut, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { authClient } from "~/server/better-auth/client";

export function AuthButtons() {
    const router = useRouter();
    

    const { data: session, isPending } = authClient.useSession();

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/"); 
                    router.refresh();
                },
            },
        });
    };

    const handleSignIn = async () => {
        router.push("/login");
    }


    if (isPending) {
        return <Button variant="ghost" size="sm" disabled><Loader2 className="h-4 w-4 animate-spin" /></Button>;
    }


    if (session) {
        return (
            <div className="flex items-center gap-4">
                 <Button asChild size="sm" className="hidden sm:inline-flex shadow-md shadow-primary/20  text-white bg-blue-600 hover:bg-blue-500">
                    <Link href="/dashboard">Dashboard</Link>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8 border border-border/50">
                                <AvatarImage src={session.user.image || ""} alt={session.user.name} />
                                <AvatarFallback>{session.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {session.user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard" className="cursor-pointer ">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Dashboard
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }


    return (
        <div className="flex items-center gap-4">
            <Button 
                variant="ghost" 
                onClick={handleSignIn}
                className="text-sm font-medium hover:text-primary transition-colors hidden sm:block"
            >
                Log in
            </Button>
            <Button size="sm" className="font-semibold shadow-md text-neutral-300 shadow-primary/20 bg-blue-600" onClick={handleSignIn}>
                Get Started
            </Button>
        </div>
    );
}