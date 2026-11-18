/** The public origin of the site (from AUTH_URL), validated so a bad value can never break rendering. */
export function siteUrl(): string {
  try {
    return new URL(process.env.AUTH_URL ?? "").origin;
  } catch {
    return "http://localhost:3000";
  }
}

export const SITE_NAME = "GoodLoop";
export const SITE_TAGLINE = "Do good, close to home.";
export const SITE_DESCRIPTION =
  "Find and join local volunteering opportunities: blood donation camps, food and clothes drives, clean-ups, teaching and more. Organisers list events and see who is coming.";
