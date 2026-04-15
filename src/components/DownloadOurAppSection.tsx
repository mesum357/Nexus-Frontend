import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PLAY_STORE_URL = import.meta.env.VITE_PLAY_STORE_URL as string | undefined;

function GlowOrbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
    </div>
  );
}

function StoreCard({
  kind,
}: {
  kind: "android" | "ios";
}) {
  const isAndroid = kind === "android";
  const href = isAndroid ? PLAY_STORE_URL : undefined;
  const isDisabled = isAndroid ? !href : false;

  const shell =
    "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.35)]";

  const inner =
    "relative flex h-full flex-col justify-between gap-6 p-7 sm:p-8";

  const header =
    "text-sm font-semibold text-white/70 tracking-wide";

  const title = "text-2xl sm:text-3xl font-bold text-white tracking-tight";

  const cta =
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white transition-all";

  const badge =
    "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80";

  const Icon = isAndroid ? GooglePlayIcon : AppleIcon;
  const accent = isAndroid
    ? "from-emerald-500/25 via-cyan-500/15 to-transparent"
    : "from-indigo-500/25 via-fuchsia-500/15 to-transparent";

  const ctaAccent = isAndroid
    ? "bg-emerald-500/20 hover:bg-emerald-500/28 border border-emerald-300/20"
    : "bg-indigo-500/20 hover:bg-indigo-500/28 border border-indigo-300/20";

  const content = (
    <div className={shell}>
      <div className={`absolute inset-0 bg-gradient-to-br ${accent}`} />
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute -bottom-14 -left-14 h-44 w-44 rounded-full bg-white/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className={inner}>
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className={header}>{isAndroid ? "Android" : "iPhone"}</div>
            <div className={title}>
              {isAndroid ? "Get it on Google Play" : "Install on iPhone"}
            </div>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/20 text-white/90">
            <Icon />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={badge}>
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            {isAndroid ? "Fast download" : "Step-by-step guide"}
          </span>
          <span className={badge}>
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            Secure
          </span>
          <span className={badge}>
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            Local services
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm text-white/70">
          <div>
            {isAndroid
              ? "Install the app for the smoothest experience — store, education, feed, and marketplace in your pocket."
              : "Use our quick instructions to install on iPhone. It takes a minute and works great."}
          </div>
          {isDisabled ? (
            <div className="text-amber-200/90 text-xs">
              Play Store link not set. Add `VITE_PLAY_STORE_URL` to enable downloads.
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`${cta} ${ctaAccent} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isAndroid ? "Download" : "View instructions"}
          </span>
          <span className="text-xs text-white/50">
            {isAndroid ? "Opens in a new tab" : "Opens on this site"}
          </span>
        </div>
      </div>
    </div>
  );

  if (isAndroid) {
    return (
      <motion.a
        href={href || "#"}
        target={href ? "_blank" : undefined}
        rel={href ? "noreferrer" : undefined}
        aria-disabled={isDisabled}
        onClick={(e) => {
          if (isDisabled) e.preventDefault();
        }}
        whileHover={{ y: -6, rotate: -0.5 }}
        whileTap={{ scale: 0.99 }}
        className="block"
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div whileHover={{ y: -6, rotate: 0.35 }} whileTap={{ scale: 0.99 }}>
      <Link to="/iphone-app" className="block">
        {content}
      </Link>
    </motion.div>
  );
}

function GooglePlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.8 3.4c-.6.3-.8.8-.8 1.5v14.2c0 .7.2 1.2.8 1.5l9-9.1-9-8.1Z"
        fill="currentColor"
        className="text-white/90"
      />
      <path
        d="M14.6 12 20 6.9c.6.4 1 .9 1 1.4 0 .5-.4 1-1 1.4L14.6 12Z"
        fill="currentColor"
        className="text-white/65"
      />
      <path
        d="M14.6 12 20 17.1c.6-.4 1-.9 1-1.4 0-.5-.4-1-1-1.4L14.6 12Z"
        fill="currentColor"
        className="text-white/65"
      />
      <path
        d="M4.8 20.6c.4.2.9.2 1.6-.2l10.6-6.2L13.8 12l-8.9 8.6Z"
        fill="currentColor"
        className="text-white/80"
      />
      <path
        d="M6.4 3.6c-.7-.4-1.2-.4-1.6-.2l9 8.5 3.2-2.2L6.4 3.6Z"
        fill="currentColor"
        className="text-white/80"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16.2 2.5c-.9.6-1.5 1.6-1.4 2.7 1.1.1 2.1-.6 2.7-1.2.6-.7 1.1-1.7 1-2.8-1 .1-2 .6-2.3 1.3Z"
        fill="currentColor"
        className="text-white/85"
      />
      <path
        d="M20.7 17.2c-.5 1.2-1.1 2.3-1.9 3.3-.9 1.1-1.7 1.9-3 1.9-1.2 0-1.6-.7-3.1-.7-1.5 0-2 .7-3.2.7-1.2 0-2-.7-3.1-2-2-2.5-3.5-7.1-1.5-10.2 1-1.5 2.7-2.5 4.6-2.5 1.2 0 2.3.8 3.1.8.8 0 2.2-.9 3.7-.8.6 0 2.3.2 3.4 1.8-.1.1-2 .9-2 3.2 0 2.7 2.4 3.6 2.5 3.7Z"
        fill="currentColor"
        className="text-white/90"
      />
    </svg>
  );
}

export function DownloadOurAppSection() {
  return (
    <section className="relative py-20 bg-black">
      <GlowOrbs />
      <div className="relative container mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            Download Our App
          </div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white tracking-tight">
            Take E‑Dunia with you.
          </h2>
          <p className="mt-3 text-lg text-white/70">
            Get faster checkout, smoother browsing, and instant access to your services — optimized for mobile.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StoreCard kind="android" />
          <StoreCard kind="ios" />
        </div>
      </div>
    </section>
  );
}

