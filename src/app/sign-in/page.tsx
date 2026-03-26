import SignInClient from "./sign-in-client";

export default function LoginPage() {
  const hasGithub = Boolean(
    process.env.BETTER_AUTH_GITHUB_CLIENT_ID &&
      process.env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
  );
  const hasDiscord = Boolean(
    process.env.BETTER_AUTH_DISCORD_CLIENT_ID &&
      process.env.BETTER_AUTH_DISCORD_CLIENT_SECRET,
  );

  return <SignInClient hasGithub={hasGithub} hasDiscord={hasDiscord} />;
}
