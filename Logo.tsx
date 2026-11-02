import Image from "next/image";

const LOGO_LIGHT = "/assets/landing/logo.png";
const LOGO_DARK = "/assets/landing/logo-white.png";

interface LogoProps {
  /**
   * "auto" swaps between the dark-text logo and the white logo based on the
   * `.dark` theme class. "dark" always renders the white logo, for surfaces
   * that are dark in both themes (sidebar, footer).
   */
  variant?: "auto" | "dark";
  className?: string;
  priority?: boolean;
}

const LIGHT_RATIO = 584 / 133;
const DARK_RATIO = 410 / 94;

export function Logo({ variant = "auto", className = "h-10 w-auto", priority }: LogoProps) {
  // Fixed height + aspect-derived width: w-auto alone lets the flex/anchor
  // parent size the box, and object-contain then letterboxes the bitmap
  // off-center.
  const style = (ratio: number) => ({ aspectRatio: `${ratio}` });
  if (variant === "dark") {
    return (
      <Image
        src={LOGO_DARK}
        alt="SocialWorks Pro"
        width={410}
        height={94}
        className={`object-contain ${className}`}
        style={style(DARK_RATIO)}
        priority={priority}
      />
    );
  }

  return (
    <>
      <Image
        src={LOGO_LIGHT}
        alt="SocialWorks Pro"
        width={584}
        height={133}
        className={`object-contain dark:hidden ${className}`}
        style={style(LIGHT_RATIO)}
        priority={priority}
      />
      <Image
        src={LOGO_DARK}
        alt="SocialWorks Pro"
        width={410}
        height={94}
        className={`hidden object-contain dark:block ${className}`}
        style={style(DARK_RATIO)}
        priority={priority}
      />
    </>
  );
}
