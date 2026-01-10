
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ShieldAlert, Trash2 } from "lucide-react";
import { deleteAccount } from "~/app/actions/user";
import { db } from "~/server/db"; // 1. Import Prisma DB
import { auth } from "~/server/better-auth";
import { DeleteAccountButton } from "~/components/settings/delete-account-button";
import { getApiKey } from "~/app/actions/user";
import { ApiKeySettings } from "~/components/settings/api-key-settings";

export default async function SettingsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) return redirect("/login");

    const user = session.user;


    const monitorCount = await db.monitor.count({
        where: { userId: user.id }
    });

    return (
        <div className="min-h-screen bg-[#020817] text-slate-300 p-8">
            <div className="max-w-2xl mx-auto space-y-8">


                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
                    <p className="text-slate-400">Manage your account and preferences.</p>
                </div>
                {/* Profile Card */}
                <Card className="bg-[#0B1121] border-slate-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-white">Profile</CardTitle>
                        <CardDescription className="text-slate-500">
                            Your personal information from the provider.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-2 border-slate-700">
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback className="bg-slate-800 text-white text-xl">
                                    {user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-white font-medium text-lg">{user.name}</p>
                                <p className="text-slate-500 text-sm">{user.email}</p>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-slate-300">Display Name</Label>
                            <Input
                                value={user.name}
                                disabled
                                className="bg-slate-950/50 border-slate-800 text-slate-400"
                            />
                            <p className="text-[10px] text-slate-600">
                                To change your name, please update it on your login provider (GitHub/Discord).
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-slate-300">Email Address</Label>
                            <Input
                                value={user.email}
                                disabled
                                className="bg-slate-950/50 border-slate-800 text-slate-400"
                            />
                        </div>
                    </CardContent>
                </Card>
                <ApiKeySettings initialKey={await getApiKey()} />
                {/* Danger Zone */}
                <Card className="bg-[#0B1121] border-red-900/30 shadow-sm overflow-hidden p-0">
                    <CardHeader className="bg-red-950/10  border-b border-red-900/20 py-4">
                        <CardTitle className="text-red-500 flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5" /> Danger Zone
                        </CardTitle>
                        <CardDescription className="text-red-400/60">
                            Irreversible actions. Tread carefully.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-white font-medium">Delete Account</p>
                                <p className="text-sm text-slate-500">
                                    Permanently remove your account and all {monitorCount} monitors.
                                </p>
                            </div>
                            <DeleteAccountButton monitorCount={monitorCount} />
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}