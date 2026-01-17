const f = {
    WIDGET_URL: `https://52f38c355685.ngrok-free.app/`,
    DEFAULT_TYPE: "bubble",
  },
  E =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-icon lucide-message-square"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/></svg>',
  T =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
(function () {
  let o = null,
    e = null,
    i = null,
    r = f.DEFAULT_TYPE,
    l = null,
    d = !1,
    c = "#fb2c36",
    p = "rgba(251, 44, 54, 0.35)",
    h = "bottom-right";
  const n = document.currentScript;
  if (
    (n &&
      ((r = n.getAttribute("data-type") || r),
      (l = n.getAttribute("veterinary-clinic-id"))),
    !l)
  ) {
    const t = document.querySelector("script[veterinary-clinic-id]");
    t &&
      ((r = t.getAttribute("data-type") || r),
      (l = t.getAttribute("veterinary-clinic-id")));
  }
  if (!l) {
    const s = Array.from(document.getElementsByTagName("script"))
      .reverse()
      .find((a) => {
        try {
          return /widget|embed/i.test(a.src || "");
        } catch {
          return !1;
        }
      });
    s &&
      ((r = s.getAttribute("data-type") || r),
      (l = s.getAttribute("veterinary-clinic-id")));
  }
  function g() {
    document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", w)
      : w();
  }
  function w() {
    if (r === "bubble") {
      (i = document.createElement("button")),
        (i.id = "echo-widget-button"),
        (i.innerHTML = E),
        (i.style.cssText = `
      position: fixed;
      ${h === "bottom-right" ? "right: 20px;" : "left: 20px;"}
      bottom: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${c};
      color: white;
      border: none;
      cursor: pointer;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 24px ${p};
      transition: all 0.2s ease;
    `),
        i.addEventListener("click", k),
        i.addEventListener("mouseenter", () => {
          i && (i.style.transform = "scale(1.05)");
        }),
        i.addEventListener("mouseleave", () => {
          i && (i.style.transform = "scale(1)");
        }),
        document.body.appendChild(i),
        (e = document.createElement("div")),
        (e.id = "echo-widget-container");
      const t = window.matchMedia("(min-width: 640px)").matches;
      (e.style.cssText = `

      border: 1px solid oklch(0.92 0.004 286.32);

      position: fixed;
      ${h === "bottom-right" ? "right: 20px;" : "left: 20px;"}
      bottom: 90px;
      z-index: 999998;

    
      display: none; /* will be set to flex when opened */
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;

      flex: 1 1 0%;

      background-color: #ffffff;

      ${t ? "min-width: 24rem;" : "min-width: 0;"}
      ${t ? "width: 32%;" : "width: 24rem;"}
      ${t ? "max-width: 40rem;" : "max-width: calc(100vw - 1rem);"}

      ${t ? "min-height: 43.75rem;" : ""}
      ${t ? "height: 88%;" : "height: 43.75rem;"}
      max-height: calc(100vh - 6rem);

      overflow: hidden;

      border-radius: 1rem;
    `),
        (o = document.createElement("iframe")),
        (o.src = b()),
        (o.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
    `),
        (o.allow =
          "microphone; clipboard-read; clipboard-write; storage-access"),
        (o.referrerPolicy = "strict-origin-when-cross-origin"),
        (o.allowFullscreen = !0),
        e.appendChild(o),
        document.body.appendChild(e),
        window.addEventListener("message", u);
    } else if (r === "section") {
      (e = document.createElement("div")), (e.id = "echo-widget-container");
      const t = (n && n.getAttribute("data-height")) || "600px",
        s = n && n.getAttribute("data-target");
      (e.style.cssText = `
        border: 1px solid oklch(0.92 0.004 286.32);
        background-color: #ffffff;
        width: 100%;
        max-width: 100%;
        height: ${t};
        overflow: hidden;
        display: block;
        border-radius: 12px;
      `),
        (o = document.createElement("iframe")),
        (o.src = b()),
        (o.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
      `),
        (o.allow =
          "microphone; clipboard-read; clipboard-write; storage-access"),
        (o.referrerPolicy = "strict-origin-when-cross-origin"),
        (o.allowFullscreen = !0),
        e.appendChild(o);
      let a = !1;
      if (s) {
        const v = document.querySelector(s);
        v && (v.appendChild(e), (a = !0));
      }
      a ||
        (n && n.parentElement
          ? n.insertAdjacentElement("afterend", e)
          : document.body.appendChild(e)),
        window.addEventListener("message", u),
        (d = !0);
    }
  }
  function b() {
    const t = new URLSearchParams();
    return l && t.append("veterinary-clinic-id", l), `${f.WIDGET_URL}?${t.toString()}`;
  }
  function u(t) {
    if (t.origin !== new URL(f.WIDGET_URL).origin) return;
    const { type: s, payload: a } = t.data;
    switch (s) {
      case "close":
        m();
        break;
      case "resize":
        a.height && e && (e.style.height = `${a.height}px`);
        break;
    }
  }
  function k() {
    d ? m() : y();
  }
  function y() {
    e &&
      ((d = !0),
      r === "bubble"
        ? ((e.style.display = "block"),
          setTimeout(() => {
            e &&
              ((e.style.opacity = "1"), (e.style.transform = "translateY(0)"));
          }, 10),
          i && (i.innerHTML = T))
        : (e.style.display = "block"));
  }
  function m() {
    e &&
      ((d = !1),
      r === "bubble"
        ? ((e.style.opacity = "0"),
          (e.style.transform = "translateY(10px)"),
          setTimeout(() => {
            e && (e.style.display = "none");
          }, 300),
          i && ((i.innerHTML = E), (i.style.background = c)))
        : (e.style.display = "none"));
  }
  function x() {
    window.removeEventListener("message", u),
      e && (e.remove(), (e = null), (o = null)),
      i && (i.remove(), (i = null)),
      (d = !1),
      (c = ""),
      (p = "");
  }
  function L(t) {
    x(), t.position && (h = t.position), g();
  }
  (window.OlemissWidget = {
    init: L,
    show: y,
    hide: m,
    destroy: x,
  }),
    g();
})();
