import { describe, it, expect, beforeAll, beforeEach, afterEach, vi, type Mock } from "vitest";
import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import gsap from "gsap";
import Page from "@/app/page";
import Footer from "@/components/footer";
import { BottomNav } from "@/components/BottomNav";
import DownloadCvButton from "@/components/download-cv";
import { TooltipProvider } from "@/components/ui/tooltip";

beforeAll(() => {
  global.innerWidth = 768;
  global.innerHeight = 1024;
  window.dispatchEvent(new Event("resize"));
  document.documentElement.className = "h-full antialiased overflow-x-hidden";

  window.matchMedia = (query: string) => {
    const width = window.innerWidth;
    const matches =
      (query === "(min-width: 640px)" && width >= 640) ||
      (query === "(max-width: 639px)" && width < 640) ||
      (query === "(min-width: 1024px)" && width >= 1024) ||
      (query === "(max-width: 1023px)" && width < 1024) ||
      (query === "(min-width: 640px) and (max-width: 1023px)" && width >= 640 && width < 1024);
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
    <div className="flex min-h-dvh flex-col overflow-hidden">
      <TooltipProvider>
        <div className="flex-1 px-[3%] max-sm:px-0 max-lg:px-0">
          {children}
        </div>
        <Footer />
      </TooltipProvider>
      <div className="fixed inset-x-0 bottom-6 z-[9999] flex items-center justify-center gap-4">
        <DownloadCvButton />
        <BottomNav />
      </div>
    </div>
  );
}

function renderPage() {
  return render(
    <TestWrapper>
      <Page />
    </TestWrapper>,
  );
}

describe("Layout on tablet (768x1024)", () => {
  let toSpy: Mock;

  beforeEach(() => {
    toSpy = vi.spyOn(gsap, "to");
  });

  afterEach(() => {
    toSpy.mockRestore();
  });

  /* ── Hero section ── */
  it("hero section is auto height with justify-start on tablet", () => {
    renderPage();
    const hero = document.getElementById("about")!;
    expect(hero).toBeInTheDocument();
    expect(hero.className).toContain("max-lg:h-auto");
    expect(hero.className).toContain("max-lg:min-h-dvh");
    expect(hero.className).toContain("max-lg:justify-start");
    expect(hero.className).toContain("max-lg:pt-4");
    expect(hero.className).toContain("max-lg:pb-0");
  });

  it("hero title is full width, big font, centered on tablet", () => {
    renderPage();
    const h1 = document.querySelector("#about h1")!;
    expect(h1.className).toContain("max-lg:w-full");
    expect(h1.className).toContain("max-lg:text-[12vw]");
    expect(h1.className).toContain("max-lg:text-center");
    expect(h1.className).toContain("max-lg:leading-[0.9]");
  });

  it("hero glass card becomes relative, 92% width, centered on tablet", () => {
    renderPage();
    const card = document.querySelector('[class*="glass-card-wrap"]')!;
    expect(card.className).toContain("max-lg:!relative");
    expect(card.className).toContain("max-lg:!w-[92%]");
    expect(card.className).toContain("max-lg:!left-auto");
    expect(card.className).toContain("max-lg:!top-auto");
    expect(card.className).toContain("max-lg:mx-auto");
  });

  it("hero card inner grid becomes single column on tablet", () => {
    renderPage();
    const grid = document.querySelector('[class*="glass-card-wrap"] [class*="grid"]')!;
    expect(grid.className).toContain("max-lg:grid-cols-1");
    expect(grid.className).toContain("max-lg:gap-6");
    expect(grid.className).toContain("max-lg:py-8");
    expect(grid.className).toContain("max-lg:px-6");
  });

  it("hero avatar collapses to single row on tablet", () => {
    renderPage();
    const grid = document.querySelector('[class*="glass-card-wrap"] [class*="grid"]')!;
    const avatarCol = grid.firstElementChild!;
    expect(avatarCol.className).toContain("max-lg:row-span-1");
    expect(avatarCol.className).toContain("max-lg:mb-2");
  });

  it("hero description text is base size and centered on tablet", () => {
    renderPage();
    const p = document.querySelector('[class*="glass-card-wrap"] p')!;
    expect(p.className).toContain("max-lg:text-base");
    expect(p.className).toContain("max-lg:text-center");
    expect(p.className).toContain("max-lg:px-2");
  });

  it("github wrapper restricts overflow on tablet", () => {
    renderPage();
    const wraps = document.querySelectorAll('[class*="glass-card-wrap"] [class*="flex-col"][class*="gap-3"]');
    const githubWrap = wraps[wraps.length - 1];
    expect(githubWrap.className).toContain("max-lg:overflow-hidden");
    expect(githubWrap.className).toContain("max-lg:w-full");
  });

  /* ── Projects section ── */
  it("projects section has top padding on tablet", () => {
    renderPage();
    const section = document.querySelector("#projects")!;
    expect(section.className).toContain("max-lg:pt-[15vh]");
  });

  it("projects inner grid becomes single column on tablet", () => {
    renderPage();
    const inner = document.querySelector("#projects [class*='grid-cols-12']")!;
    expect(inner.className).toContain("max-lg:grid-cols-1");
    expect(inner.className).toContain("max-lg:py-6");
    expect(inner.className).toContain("max-lg:p-3");
  });

  it("projects sticky column becomes static with smaller text on tablet", () => {
    renderPage();
    const sticky = document.querySelector("#projects [class*='col-span-3']")!;
    expect(sticky.className).toContain("max-lg:col-span-1");
    expect(sticky.className).toContain("max-lg:static");
    expect(sticky.className).toContain("max-lg:text-lg");
    expect(sticky.className).toContain("max-lg:mb-6");
  });

  it("projects card grid becomes single column on tablet", () => {
    renderPage();
    const grid = document.querySelector("#projects [class*='col-span-9']")!;
    expect(grid.className).toContain("max-lg:col-span-1");
    expect(grid.className).toContain("max-lg:grid-cols-1");
    expect(grid.className).toContain("max-lg:gap-4");
  });

  it("project cards become smaller with rounded-[20px] on tablet", () => {
    renderPage();
    const cards = document.querySelectorAll("#projects [class*='rounded-\\[60px\\]']");
    cards.forEach((c) => {
      expect(c.className).toContain("max-lg:rounded-[60px]");
    });
  });

  it("project card images stay square on tablet", () => {
    renderPage();
    const imgs = document.querySelectorAll("#projects img[class*='aspect-square']");
    expect(imgs.length).toBe(8);
    imgs.forEach((img) => {
      expect(img.className).not.toContain("max-lg:aspect-[4/3]");
    });
  });

  it("project card title is text-3xl on tablet", () => {
    renderPage();
    const titles = document.querySelectorAll("#projects [class*='rounded-\\[60px\\]'] h3");
    titles.forEach((t) => {
      expect(t.className).toContain("max-lg:text-3xl");
    });
  });

  it("project card overlay has gradient background on tablet", () => {
    renderPage();
    const overlays = document.querySelectorAll("#projects [class*='rounded-\\[60px\\]'] [class*='inset-0']");
    overlays.forEach((o) => {
      const el = o as HTMLElement;
      expect(el.style.backdropFilter).toBe("blur(0px)");
      expect(o.className).toContain("max-lg:bg-gradient-to-t");
      expect(o.className).toContain("max-lg:from-black/80");
      expect(o.className).toContain("max-lg:to-transparent");
    });
  });

  it("project card gh and pv icons are larger on tablet", () => {
    renderPage();
    const svgs = document.querySelectorAll("#projects svg");
    expect(svgs.length).toBe(17);
    const iconSvgs = Array.from(svgs).filter((s) => s.getAttribute("class")?.includes("max-lg:w-8"));
    expect(iconSvgs.length).toBe(16);
  });

  /* ── Tools section ── */
  it("tools subtitle is smaller on tablet", () => {
    renderPage();
    const subtitle = document.querySelector("#tools p")!;
    expect(subtitle.className).toContain("max-lg:text-base");
    expect(subtitle.className).toContain("max-lg:pl-2");
  });

  it("tools inner container has reduced padding on tablet", () => {
    renderPage();
    const subtitle = document.querySelector("#tools p")!;
    const inner = subtitle.closest("[class*='px-10']") || subtitle.parentElement!;
    expect(inner.className).toContain("max-lg:pt-8");
    expect(inner.className).toContain("max-lg:pb-6");
    expect(inner.className).toContain("max-lg:px-4");
  });

  it("tools section has top padding on tablet", () => {
    renderPage();
    const section = document.querySelector("#tools")!;
    expect(section.className).toContain("max-lg:pt-[15vh]");
  });

  it("tools glass card adjusts translate-y on tablet", () => {
    renderPage();
    const card = document.querySelector("#tools [class*='-translate-y-']")!;
    expect(card.className).toContain("max-lg:-translate-y-[5%]");
  });

  it("tools gravity container keeps min-h-[600px] on tablet with reduced padding", () => {
    renderPage();
    const container = document.querySelector("#tools [class*='min-h-\\[600px\\]']")!;
    expect(container).toBeInTheDocument();
    expect(container.className).toContain("min-h-[600px]");
    expect(container.className).toContain("max-lg:px-4");
  });

  it("tool pills are larger on tablet", () => {
    renderPage();
    const pills = document.querySelectorAll("#tools [class*='rounded-full']");
    expect(pills.length).toBeGreaterThan(10);
    pills.forEach((p) => {
      expect(p.className).toContain("max-lg:gap-4");
      expect(p.className).toContain("max-lg:px-7");
      expect(p.className).toContain("max-lg:py-4");
      expect(p.className).toContain("max-lg:text-lg");
    });
  });

  it("tool pill icons are larger on tablet", () => {
    renderPage();
    const icons = document.querySelectorAll("#tools [class*='rounded-full'] img");
    expect(icons.length).toBeGreaterThan(10);
    icons.forEach((icon) => {
      expect(icon.className).toContain("max-lg:w-8");
      expect(icon.className).toContain("max-lg:h-8");
    });
  });

  it("bucket cards render as flex column with aspect-square on tablet", () => {
    renderPage();
    const container = document.querySelector("#tools [class*='flex-col']")!;
    expect(container.className).toContain("flex");
    expect(container.className).toContain("flex-col");
    expect(container.className).toContain("items-center");
    const cards = container.querySelectorAll('[class*="aspect-square"]');
    expect(cards.length).toBe(3);
    cards.forEach((c) => {
      expect(c.className).toContain("rounded-[60px]");
      expect(c.className).toContain("max-lg:rounded-[60px]");
    });
  });

  /* ── Footer ── */
  it("footer glass card has reduced padding on tablet", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const card = sections[sections.length - 1].querySelector('[class*="flex-col"]')!;
    expect(card.className).toContain("max-lg:px-6");
    expect(card.className).toContain("max-lg:py-12");
  });

  it("footer heading is smaller on tablet", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const h2 = sections[sections.length - 1].querySelector("h2")!;
    expect(h2.className).toContain("max-lg:text-4xl");
  });

  it("footer body text is smaller on tablet", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const allP = sections[sections.length - 1].querySelectorAll("p");
    const bodyP = allP[1]!;
    expect(bodyP.className).toContain("max-lg:text-base");
    expect(bodyP.className).toContain("max-lg:leading-7");
  });

  it("footer buttons reduce size on tablet", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const buttons = sections[sections.length - 1].querySelectorAll("a, button");
    const glassBtns = Array.from(buttons).filter(
      (b) => b.className.includes("rounded-full") && b.className.includes("px-8"),
    );
    expect(glassBtns.length).toBe(4);
    glassBtns.forEach((b) => {
      expect(b.className).toContain("max-lg:px-5");
      expect(b.className).toContain("max-lg:py-3");
    });
  });

  it("footer button row stacks vertically on tablet", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const footer = sections[sections.length - 1];
    const row = footer.querySelector('[class*="mt-14"]')!;
    expect(row.className).toContain("max-lg:flex-col");
    expect(row.className).toContain("max-lg:items-stretch");
    expect(row.className).toContain("max-lg:gap-3");
  });

  it("footer section has reduced top padding on tablet", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const footer = sections[sections.length - 1];
    expect(footer.className).toContain("max-lg:pt-8");
  });

  it("footer thanks text is smaller on tablet", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const footer = sections[sections.length - 1];
    const allP = footer.querySelectorAll("p");
    const thanks = allP[allP.length - 1]!;
    expect(thanks.className).toContain("max-lg:text-sm");
  });

  it("footer copyright row stacks vertically on tablet", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const footer = sections[sections.length - 1];
    const row = footer.querySelector('[class*="justify-between"]')!;
    expect(row.className).toContain("max-lg:flex-col");
    expect(row.className).toContain("max-lg:items-center");
    expect(row.className).toContain("max-lg:gap-1");
  });

  /* ── Bottom nav ── */
  it("bottom nav GlassSurface is larger on tablet", () => {
    renderPage();
    const nav = document.querySelector("nav")!;
    const glass = nav.firstElementChild!;
    expect(glass.className).toContain("max-lg:px-4");
    expect(glass.className).toContain("max-lg:py-2.5");
  });

  it("bottom nav flex gap is larger on tablet", () => {
    renderPage();
    const inner = document.querySelector("nav [class*='gap-2']")!;
    expect(inner.className).toContain("max-lg:gap-3");
  });

  it("download cv button shrinks padding on tablet", () => {
    renderPage();
    const links = document.querySelectorAll('a[download]');
    expect(links.length).toBe(1);
    const link = links[0]!;
    const glass = link.closest('[class*="cursor-pointer"]')!;
    expect(glass.className).toContain("max-lg:p-1");
  });

  /* ── Global content wrapper ── */
  it("content wrapper removes horizontal padding on tablet", () => {
    renderPage();
    const wrapper = document.querySelector('[class*="flex-1"][class*="px-\\[3%\\]"]')!;
    expect(wrapper.className).toContain("max-lg:px-0");
  });

  /* ── GSAP matchMedia animation configs ── */
  it("hero glass card scroll animation uses yPercent -15 on tablet", () => {
    renderPage();

    const cardAnims = toSpy.mock.calls.filter(
      (call: unknown[]) =>
        (call[0] as Element | null)?.classList?.contains?.("glass-card-wrap") ||
        (call[0] as { className?: string } | null)?.className?.includes?.("glass-card-wrap"),
    );

    expect(cardAnims.length).toBe(1);
    const vars = cardAnims[0][1] as Record<string, unknown>;
    expect(vars.yPercent).toBe(-15);
    expect(vars.opacity).toBe(0);
    expect(vars.scrollTrigger).toBeDefined();
  });
});
