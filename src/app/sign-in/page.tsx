import SignInClient from "./sign-in-client";

export default function LoginPage() {
  const hasDiscord = !!(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET);

  return <SignInClient hasDiscord={hasDiscord} />;
}
