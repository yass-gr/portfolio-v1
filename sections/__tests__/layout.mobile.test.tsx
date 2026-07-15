import { describe, it, expect, beforeAll, beforeEach, afterEach, vi, type Mock } from "vitest";
import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import gsap from "gsap";
import Page from "@/app/page";
import { BottomNav } from "@/components/BottomNav";
import DownloadCvButton from "@/components/download-cv";
import { TooltipProvider } from "@/components/ui/tooltip";

beforeAll(() => {
  global.innerWidth = 375;
  global.innerHeight = 812;
  window.dispatchEvent(new Event("resize"));
  document.documentElement.className = "h-full antialiased overflow-x-hidden";

  window.matchMedia = (query: string) => {
    const width = window.innerWidth;
    const matches =
      (query === "(min-width: 640px)" && width >= 640) ||
      (query === "(max-width: 639px)" && width < 640);
    return {
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };
  };
});

function TestWrapper({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <div className="flex min-h-full flex-col px-[3%] max-sm:px-0 overflow-x-hidden">
        {children}
      </div>
      <div className="fixed inset-x-0 bottom-6 z-[9999] flex items-center justify-center gap-4">
        <DownloadCvButton />
        <BottomNav />
      </div>
    </TooltipProvider>
  );
}

function renderPage() {
  return render(
    <TestWrapper>
      <Page />
    </TestWrapper>,
  );
}

describe("Layout on mobile (375x812)", () => {
  let toSpy: Mock;

  beforeEach(() => {
    toSpy = vi.spyOn(gsap, "to");
  });

  afterEach(() => {
    toSpy.mockRestore();
  });

  /* ── Hero section ── */
  it("hero section switches to auto height with justify-start on mobile", () => {
    renderPage();
    const hero = document.getElementById("about")!;
    expect(hero).toBeInTheDocument();
    expect(hero.className).toContain("max-sm:h-auto");
    expect(hero.className).toContain("max-sm:min-h-dvh");
    expect(hero.className).toContain("max-sm:justify-start");
    expect(hero.className).toContain("max-sm:pt-4");
    expect(hero.className).toContain("max-sm:pb-0");
  });

  it("hero title is full width, bigger font, centered, tight leading on mobile", () => {
    renderPage();
    const h1 = document.querySelector('[class*="hero-title-wrap"] h1')!;
    expect(h1.className).toContain("max-sm:w-full");
    expect(h1.className).toContain("max-sm:text-[12vw]");
    expect(h1.className).toContain("max-sm:text-center");
    expect(h1.className).toContain("max-sm:leading-[0.9]");
  });

  it("hero glass card becomes relative, 92% width, centered on mobile", () => {
    renderPage();
    const card = document.querySelector('[class*="glass-card-wrap"]')!;
    expect(card.className).toContain("max-sm:!relative");
    expect(card.className).toContain("max-sm:!w-[92%]");
    expect(card.className).toContain("max-sm:!left-auto");
    expect(card.className).toContain("max-sm:!top-auto");
    expect(card.className).toContain("max-sm:mx-auto");
  });

  it("hero card inner grid becomes single column on mobile", () => {
    renderPage();
    const grid = document.querySelector('[class*="glass-card-wrap"] [class*="grid"]')!;
    expect(grid.className).toContain("max-sm:grid-cols-1");
    expect(grid.className).toContain("max-sm:gap-6");
    expect(grid.className).toContain("max-sm:py-8");
    expect(grid.className).toContain("max-sm:px-6");
  });

  it("hero avatar collapses to single row on mobile", () => {
    renderPage();
    const grid = document.querySelector('[class*="glass-card-wrap"] [class*="grid"]')!;
    const avatarCol = grid.firstElementChild!;
    expect(avatarCol.className).toContain("max-sm:row-span-1");
    expect(avatarCol.className).toContain("max-sm:mb-2");
  });

  it("hero description text is base size and centered on mobile", () => {
    renderPage();
    const p = document.querySelector('[class*="glass-card-wrap"] p')!;
    expect(p.className).toContain("max-sm:text-base");
    expect(p.className).toContain("max-sm:text-center");
    expect(p.className).toContain("max-sm:px-2");
  });

  it("github wrapper restricts overflow on mobile", () => {
    renderPage();
    const wraps = document.querySelectorAll('[class*="glass-card-wrap"] [class*="flex-col"][class*="gap-3"]');
    const githubWrap = wraps[wraps.length - 1];
    expect(githubWrap.className).toContain("max-sm:overflow-hidden");
    expect(githubWrap.className).toContain("max-sm:w-full");
  });

  it("scroll indicator is positioned higher on mobile", () => {
    renderPage();
    const el = document.querySelector('[class*="bottom-8"][class*="left-1/2"]')!;
    expect(el).toBeInTheDocument();
    expect(el.className).toContain("max-sm:bottom-24");
  });

  /* ── Projects section ── */
  it("projects inner grid becomes single column on mobile", () => {
    renderPage();
    const inner = document.querySelector("#projects [class*='grid-cols-12']")!;
    expect(inner.className).toContain("max-sm:grid-cols-1");
    expect(inner.className).toContain("max-sm:py-6");
    expect(inner.className).toContain("max-sm:p-3");
  });

  it("projects sticky column becomes static with smaller text on mobile", () => {
    renderPage();
    const sticky = document.querySelector("#projects [class*='col-span-3']")!;
    expect(sticky.className).toContain("max-sm:col-span-1");
    expect(sticky.className).toContain("max-sm:static");
    expect(sticky.className).toContain("max-sm:text-lg");
    expect(sticky.className).toContain("max-sm:mb-6");
  });

  it("projects card grid becomes single column on mobile", () => {
    renderPage();
    const grid = document.querySelector("#projects [class*='col-span-9']")!;
    expect(grid.className).toContain("max-sm:col-span-1");
    expect(grid.className).toContain("max-sm:grid-cols-1");
    expect(grid.className).toContain("max-sm:gap-4");
  });

  it("project cards become smaller with rounded-[30px] on mobile", () => {
    renderPage();
    const cards = document.querySelectorAll("#projects [class*='rounded-\\[60px\\]']");
    cards.forEach((c) => {
      expect(c.className).toContain("max-sm:rounded-[30px]");
    });
  });

  it("project card images switch to 4/3 aspect ratio on mobile", () => {
    renderPage();
    const imgs = document.querySelectorAll("#projects img[class*='aspect-square']");
    imgs.forEach((img) => {
      expect(img.className).toContain("max-sm:aspect-[4/3]");
    });
  });

  it("project card title shrinks to text-2xl on mobile", () => {
    renderPage();
    const titles = document.querySelectorAll("#projects [class*='rounded-\\[60px\\]'] h3");
    titles.forEach((t) => {
      expect(t.className).toContain("max-sm:text-2xl");
    });
  });

  it("project card overlay always has blur on mobile", () => {
    renderPage();
    const overlays = document.querySelectorAll("#projects [class*='rounded-\\[60px\\]'] [class*='inset-0']");
    overlays.forEach((o) => {
      const el = o as HTMLElement;
      expect(el.style.backdropFilter).toBe("blur(60px)");
    });
  });

  /* ── Tools section ── */
  it("tools subtitle is smaller on mobile", () => {
    renderPage();
    const subtitle = document.querySelector("#tools p")!;
    expect(subtitle.className).toContain("max-sm:text-base");
    expect(subtitle.className).toContain("max-sm:pl-2");
  });

  it("tools inner container has reduced padding on mobile", () => {
    renderPage();
    const subtitle = document.querySelector("#tools p")!;
    const inner = subtitle.closest("[class*='px-10']") || subtitle.parentElement!;
    expect(inner.className).toContain("max-sm:pt-8");
    expect(inner.className).toContain("max-sm:pb-6");
    expect(inner.className).toContain("max-sm:px-4");
  });

  /* ── Footer ── */
  it("footer glass card has reduced padding on mobile", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const card = sections[sections.length - 1].querySelector('[class*="flex-col"]')!;
    expect(card.className).toContain("max-sm:px-6");
    expect(card.className).toContain("max-sm:py-16");
  });

  it("footer heading is smaller on mobile", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const h2 = sections[sections.length - 1].querySelector("h2")!;
    expect(h2.className).toContain("max-sm:text-5xl");
  });

  it("footer body text is smaller on mobile", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const allP = sections[sections.length - 1].querySelectorAll("p");
    const bodyP = allP[1]!;
    expect(bodyP.className).toContain("max-sm:text-base");
    expect(bodyP.className).toContain("max-sm:leading-7");
  });

  it("footer buttons reduce size on mobile", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const buttons = sections[sections.length - 1].querySelectorAll("a, button");
    const glassBtns = Array.from(buttons).filter(
      (b) => b.className.includes("rounded-full") && b.className.includes("px-8"),
    );
    expect(glassBtns.length).toBe(4);
    glassBtns.forEach((b) => {
      expect(b.className).toContain("max-sm:px-5");
      expect(b.className).toContain("max-sm:py-3");
    });
  });

  it("footer button row stacks vertically on mobile", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const footer = sections[sections.length - 1];
    const row = footer.querySelector('[class*="mt-14"]')!;
    expect(row.className).toContain("max-sm:flex-col");
    expect(row.className).toContain("max-sm:items-stretch");
    expect(row.className).toContain("max-sm:gap-3");
  });

  /* ── Bottom nav ── */
  it("bottom nav GlassSurface shrinks padding on mobile", () => {
    renderPage();
    const nav = document.querySelector("nav")!;
    const glass = nav.firstElementChild!;
    expect(glass.className).toContain("max-sm:px-1.5");
    expect(glass.className).toContain("max-sm:py-1");
  });

  it("bottom nav flex reduces gap on mobile", () => {
    renderPage();
    const inner = document.querySelector("nav [class*='gap-1\\.5']")!;
    expect(inner.className).toContain("max-sm:gap-1");
  });

  it("download cv button shrinks padding on mobile", () => {
    renderPage();
    const links = document.querySelectorAll('a[download]');
    expect(links.length).toBe(1);
    const link = links[0]!;
    const glass = link.closest('[class*="cursor-pointer"]')!;
    expect(glass.className).toContain("max-sm:p-1");
  });

  /* ── Global content wrapper ── */
  it("content wrapper removes horizontal padding on mobile", () => {
    renderPage();
    const wrapper = document.querySelector('[class*="flex-col"][class*="px-\\[3%\\]"]')!;
    expect(wrapper.className).toContain("max-sm:px-0");
  });

  /* ── GSAP matchMedia animation configs ── */
  it("hero title scroll animation uses mobile-friendly values", () => {
    renderPage();

    const titleAnim = toSpy.mock.calls.find(
      (call: unknown[]) =>
        (call[0] as Element | null)?.classList?.contains?.("hero-title-wrap") ||
        (call[0] as { className?: string } | null)?.className?.includes?.("hero-title-wrap"),
    )!;

    expect(titleAnim).toBeDefined();
    const vars = titleAnim[1] as Record<string, unknown>;
    expect(vars.yPercent).toBe(-15);
    expect(vars.scale).toBe(0.85);
    expect(vars.ease).toBe("none");
    const st = vars.scrollTrigger as Record<string, unknown>;
    expect(st).toBeDefined();
    expect(st.start).toBe("top top");
    expect(st.end).toBe("bottom top");
    expect(st.scrub).toBe(0.5);
  });

  it("hero glass card scroll animation omits yPercent on mobile", () => {
    renderPage();

    const cardAnims = toSpy.mock.calls.filter(
      (call: unknown[]) =>
        (call[0] as Element | null)?.classList?.contains?.("glass-card-wrap") ||
        (call[0] as { className?: string } | null)?.className?.includes?.("glass-card-wrap"),
    );

    expect(cardAnims.length).toBe(1);
    const vars = cardAnims[0][1] as Record<string, unknown>;
    expect(vars.yPercent).toBeUndefined();
    expect(vars.opacity).toBe(0);
    expect(vars.scrollTrigger).toBeDefined();
  });
});
