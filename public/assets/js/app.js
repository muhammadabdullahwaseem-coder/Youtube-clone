function parseHash() {
  const raw = window.location.hash || "#/";
  const cleaned = raw.startsWith("#") ? raw.slice(1) : raw; // "/watch?id=..."
  const [pathPart, queryPart] = cleaned.split("?");
  const path = pathPart || "/";
  const params = new URLSearchParams(queryPart || "");
  return { path, params };
}

function showHomeView() {
  const watchView = document.getElementById("watchView");
  if (watchView) watchView.style.display = "none";

  const grid1 = document.getElementById("videoGrid");
  if (grid1) grid1.style.display = "";

  const shelf = document.querySelector(".shorts-shelf");
  if (shelf) shelf.style.display = "";

  const grid2 = document.getElementById("videoGrid2");
  if (grid2) grid2.style.display = "";
}

function showWatchView(id) {
  const watchView = document.getElementById("watchView");
  const watchPlayer = document.getElementById("watchPlayer");

  if (!watchView || !watchPlayer) {
    console.error("Missing #watchView or #watchPlayer in index.html");
    return;
  }

  watchView.style.display = "";

  const grid1 = document.getElementById("videoGrid");
  if (grid1) grid1.style.display = "none";

  const shelf = document.querySelector(".shorts-shelf");
  if (shelf) shelf.style.display = "none";

  const grid2 = document.getElementById("videoGrid2");
  if (grid2) grid2.style.display = "none";

  watchPlayer.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${id}?autoplay=1"
      allow="autoplay; encrypted-media"
      allowfullscreen>
    </iframe>
  `;
}

function handleRoute() {
  const { path, params } = parseHash();

  // DEBUG PROOF: if this log doesn't appear, app.js isn't running
  console.log("ROUTE:", path, "id:", params.get("id"));

  if (path === "/watch") {
    const id = params.get("id");
    if (id) showWatchView(id);
    else showHomeView();
    return;
  }

  showHomeView();
}

window.addEventListener("hashchange", handleRoute);
window.addEventListener("DOMContentLoaded", handleRoute);
window.addEventListener("hashchange", handleRoute);
window.addEventListener("load", handleRoute);
/* Home Feed Data */
const items = [
 { type: "short", url: "https://youtube.com/shorts/6Y6C86zRvdI?si=tT9NnhbQxsrQin_n", cleanThumb: false, cleanThumbSrc: "/assets/img/thumbs/shorts.svg" },
  { type: "short", url: "https://www.youtube.com/shorts/g8-EVsySHXg", cleanThumb: false, cleanThumbSrc: "/assets/img/thumbs/shorts.svg" },
  { type: "short", url: "https://youtube.com/shorts/qC-Yadx3O4A?si=tAXzguIZlmy71pZp", cleanThumb: false, cleanThumbSrc: "/assets/img/thumbs/shorts.svg" },
  { type: "short", url: "https://youtube.com/shorts/BVyxC68kHdc?si=vYz2OjiPipyaxuf4", cleanThumb: false, cleanThumbSrc: "/assets/img/thumbs/shorts.svg" },
  { type: "short", url: "https://youtube.com/shorts/XbbBbL8R3rI?si=WwvXl0c7p5FCFlN9", cleanThumb: false, cleanThumbSrc: "/assets/img/thumbs/shorts.svg" },
  { type: "video", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", cleanThumb: false },
  { type: "video", url: "https://youtu.be/S8-7XpudcpE?si=GAma0tGepku88jRD", cleanThumb: false },
  { type: "video", url: "https://www.youtube.com/watch?v=Oe421EPjeBE", cleanThumb: false },
  { type: "video", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", cleanThumb: false },
  { type: "video", url: "https://youtu.be/jDdg_v4k7UE?si=ls6cCojMlrt9Eh9m", cleanThumb: false, cleanThumbSrc: "/assets/img/thumbs/code.svg" },
  { type: "video", url: "https://youtu.be/INEdZ-CfInA?si=2no2fIpWpEzxqE82", cleanThumb: false, cleanThumbSrc: "/assets/img/thumbs/code.svg" },
  { type: "video", url: "https://youtu.be/-AzSRHiV9Cc?si=jKI-_MymBns91UUg", cleanThumb: false },
  { type: "video", url: "https://www.youtube.com/watch?v=5fb2aPlgoys", cleanThumb: false },
  { type: "video", url: "https://youtu.be/g60MMFB1Oq8?si=zKbM41OEzvvk2E02", cleanThumb: false, cleanThumbSrc: "/assets/img/thumbs/code.svg" },
  { type: "video", url: "https://youtu.be/umw13y8zr4Y?si=NAmQxLwWpRt33ele", cleanThumb: false, cleanThumbSrc: "/assets/img/thumbs/code.svg" },
  { type: "video", url: "https://www.youtube.com/watch?v=pQN-pnXPaVg", cleanThumb: false },
  { type: "video", url: "https://youtu.be/VZTEww6GaLM?si=86VFe6xFHWnE-ozs", cleanThumb: false },
  { type: "video", url: "https://www.youtube.com/watch?v=_7UQPve99r4", cleanThumb: false },
  { type: "video", url: "https://youtu.be/Mus_vwhTCq0?si=kyAWqgdRDBuN0bBS", cleanThumb: false },
];

/* Helpers */
function getYouTubeId(link) {
  const u = new URL(link);
  if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
  if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/shorts/")[1].split("?")[0];
  return u.searchParams.get("v");
}

function escapeHtml(str = "") {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
async function fetchMeta(url) {
  const o = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  const res = await fetch(o);
  if (!res.ok) throw new Error("oEmbed failed");
  const data = await res.json();
  return { title: data.title, channel: data.author_name, thumb: data.thumbnail_url };
}
/* Data Hydration */
async function hydrateAll(list) {
  const valid = list.filter(x => x.url && x.url.trim());
  const out = await Promise.allSettled(
    valid.map(async (it) => {
      const id = getYouTubeId(it.url);
      const meta = await fetchMeta(it.url);
      return { ...it, id, ...meta };
    })
  );
  return out
    .filter(r => r.status === "fulfilled" && r.value?.id)
    .map(r => r.value);
}

/* UI Renderers */
function renderShorts(shorts) {
  const row = document.getElementById("shortsRow");
  if (!row) return;
  row.innerHTML = "";

  shorts.forEach(v => {
    const card = document.createElement("div");
    card.className = "short-card";
    card.innerHTML = `
      <div class="short-thumb">
        <img src="${v.thumb}" alt="${escapeHtml(v.title)}" loading="lazy">
      </div>
      <div class="short-meta">
        <div class="short-title">${escapeHtml(v.title)}</div>
        <div class="short-sub">${escapeHtml(v.channel)}</div>
      </div>
    `;
    card.addEventListener("click", () => {
      window.location.hash = `/#/short?id=${v.id}`;
    });
    row.appendChild(card);
  });
}

function renderLongVideos(gridEl, videos) {
  if (!gridEl) return;
  gridEl.innerHTML = "";

  videos.forEach(v => {
    const card = document.createElement("div");
    card.className = "video-card";
    card.innerHTML = `
      <div class="video-thumb">
        <img src="${v.thumb}" alt="${escapeHtml(v.title)}" loading="lazy">
      </div>

      <div class="video-meta">
        <div class="avatar"></div>
        <div>
          <div class="video-title">${escapeHtml(v.title)}</div>
          <div class="video-channel">${escapeHtml(v.channel)}</div>
          <div class="video-stats">—</div>
        </div>
      </div>
    `;
    card.addEventListener("click", () => {
      window.location.hash = `/watch?id=${id}`;;
    });
    gridEl.appendChild(card);
  });
}

/* Page Init */
(async function init() {
  const grid1 = document.getElementById("videoGrid");
  const grid2 = document.getElementById("videoGrid2");

  if (grid1) grid1.innerHTML = `<div style="color:#aaa">Loading...</div>`;

  const full = await hydrateAll(items);

  const shorts = full.filter(x => x.type === "short");
  const longs  = full.filter(x => x.type === "video");
  renderLongVideos(grid1, longs.slice(0, 9));
  renderShorts(shorts);
  renderLongVideos(grid2, longs.slice(9));
  const btn = document.getElementById("shortsNext");
  const row = document.getElementById("shortsRow");
  if (btn && row) {
    btn.addEventListener("click", () => row.scrollBy({ left: 420, behavior: "smooth" }));
  }
})();
const initials = (v.channel || "Y").trim().slice(0,1).toUpperCase();
