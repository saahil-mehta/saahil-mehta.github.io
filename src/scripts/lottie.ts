// Loads the Lottie player the first time an animation scrolls near the viewport, then plays
// each animation only while it is on screen. The 380 KB player script never competes with
// first paint, and off-screen animations cost nothing. Without JavaScript the icon slot is
// simply empty.
type Player = HTMLElement & { play?: () => void; pause?: () => void };

let loading: Promise<void> | null = null;

function loadPlayer(): Promise<void> {
  if (customElements.get("lottie-player")) return Promise.resolve();
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/vendor/lottie-player.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("lottie player failed to load"));
    document.head.appendChild(script);
  });
  return loading;
}

let observer: IntersectionObserver | undefined;

function observe(players: Player[]): void {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as Player;
        if (entry.isIntersecting) el.play?.();
        else el.pause?.();
      }
    },
    { rootMargin: "80px 0px" },
  );
  for (const p of players) observer.observe(p);
}

export function initLottie(): void {
  const players = Array.from(document.querySelectorAll<Player>("lottie-player:not([data-managed])"));
  if (players.length === 0) return;
  players.forEach((p) => (p.dataset.managed = "1"));
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // Wait until the first animation is within 300px of the viewport before fetching the player.
  const trigger = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      trigger.disconnect();
      loadPlayer()
        .then(() => observe(players))
        .catch(() => {
          /* icons stay empty */
        });
    },
    { rootMargin: "300px 0px" },
  );
  players.forEach((p) => trigger.observe(p));
}
