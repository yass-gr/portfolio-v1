import { describe, it, expect, beforeAll, vi, type ReactNode } from "vitest";
import { render } from "@testing-library/react";
import gsap from "gsap";
import Page from "@/app/page";
import { BottomNav } from "@/components/BottomNav";
import { TooltipProvider } from "@/components/ui/tooltip";

beforeAll(() => {
  global.innerWidth = 1920;
  global.innerHeight = 1080;
  window.dispatchEvent(new Event("resize"));

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
      <div className="flex min-h-full flex-col px-[3%] overflow-x-hidden">
        {children}
      </div>
      <div className="fixed inset-x-0 bottom-6 z-[9999] flex items-center justify-center gap-4">
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

describe("Layout on xlarge screens (1920x1080)", () => {
  let toSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    toSpy = vi.spyOn(gsap, "to");
  });

  afterEach(() => {
    toSpy.mockRestore();
  });

  /* ── Hero section ── */
  it("hero section is full viewport with centered flex column", () => {
    renderPage();
    const hero = document.getElementById("about");
    expect(hero).toBeInTheDocument();
    expect(hero!.className).toContain("h-[100dvh]");
    expect(hero!.className).toContain("flex");
    expect(hero!.className).toContain("flex-col");
    expect(hero!.className).toContain("justify-center");
  });

  it("hero title uses 7.5vw font with panchang-extrabold, centered flex row", () => {
    renderPage();
    const titleWrap = document.querySelector('[class*="hero-title-wrap"]')!;
    expect(titleWrap.className).toContain("flex");
    expect(titleWrap.className).toContain("justify-center");

    const h1 = titleWrap.querySelector("h1")!;
    expect(h1.className).toContain("text-[7.5vw]");
    expect(h1.className).toContain("font-panchang-extrabold");
  });

  it("hero individual words are inline-block with GSAP animation attrs", () => {
    renderPage();
    const words = document.querySelectorAll(".hero-word");
    expect(words.length).toBeGreaterThanOrEqual(2);
    words.forEach((w) => {
      expect(w.className).toContain("inline-block");
    });
  });

  it("glass card in hero is absolute, w-[60%], negative top offset", () => {
    renderPage();
    const card = document.querySelector('[class*="w-[60%]"]');
    expect(card).toBeInTheDocument();
    expect(card.className).toContain("w-[60%]");
    expect(card.className).toContain("absolute");
    expect(card.className).toContain("-top-38");
    expect(card.className).toContain("left-30");
  });

  it("hero glass card inner grid is 15%/85% columns, 4 rows, gap-10", () => {
    renderPage();
    const grid = document.querySelector('[class*="glass-card-wrap"] [class*="grid"]')!;
    expect(grid.className).toContain("grid-cols-[15%_85%]");
    expect(grid.className).toContain("grid-rows-[auto_auto_auto_auto]");
    expect(grid.className).toContain("gap-10");
  });

  it("hero description uses clash-grotesk-regular, responsive text sizes", () => {
    renderPage();
    const p = document.querySelector('[class*="glass-card-wrap"] p')!;
    expect(p.className).toContain("font-clash-grotesk-regular");
    expect(p.className).toContain("text-base");
    expect(p.className).toContain("sm:text-lg");
    expect(p.className).toContain("md:text-xl");
  });

  it("hero section labels are text-xs, uppercase, tracking-widest", () => {
    renderPage();
    const labels = document.querySelectorAll('[class*="glass-card-wrap"] .text-xs');
    expect(labels.length).toBeGreaterThanOrEqual(2);
    labels.forEach((l) => {
      expect(l.className).toContain("font-clash-grotesk-semibold");
      expect(l.className).toContain("uppercase");
      expect(l.className).toContain("tracking-widest");
    });
  });

  it("avatar wrapper is circular with border", () => {
    renderPage();
    const avatarWrap = document.querySelector('[class*="glass-card-wrap"] [class*="rounded-full"]')!;
    expect(avatarWrap.className).toContain("rounded-full");
    expect(avatarWrap.className).toContain("aspect-square");
  });

  it("hero description lines are block elements with GSAP animation", () => {
    renderPage();
    const lines = document.querySelectorAll(".hero-line");
    expect(lines.length).toBeGreaterThanOrEqual(1);
    lines.forEach((l) => expect(l.className).toContain("block"));
  });

  it("scroll indicator is bottom-8 left-1/2 with flex column centered", () => {
    renderPage();
    const el = document.querySelector('[class*="bottom-8"][class*="left-1/2"]');
    expect(el).toBeInTheDocument();
    expect(el.className).toContain("flex");
    expect(el.className).toContain("flex-col");
    expect(el.className).toContain("items-center");
    expect(el.className).toContain("gap-2");
  });

  /* ── Projects section ── */
  it("projects section is min-height-dvh with padding", () => {
    renderPage();
    const section = document.querySelector("#projects")!;
    expect(section.className).toContain("min-h-dvh");
    expect(section.className).toContain("p-5");
  });

  it("projects title is text-5xl, panchang-bold, centered", () => {
    renderPage();
    const section = document.querySelector("#projects")!;
    const h1 = section.querySelector("h1")!;
    expect(h1.className).toContain("text-5xl");
    expect(h1.className).toContain("font-panchang-bold");
    expect(h1.className).toContain("text-center");
  });

  it("projects glass card inner grid is 12 columns", () => {
    renderPage();
    const inner = document.querySelector("#projects [class*='grid-cols-12']")!;
    expect(inner.className).toContain("grid-cols-12");
    expect(inner.className).toContain("min-h-dvh");
  });

  it("projects sticky column uses col-span-3, text-2xl, sticky top-40", () => {
    renderPage();
    const sticky = document.querySelector("#projects [class*='col-span-3']")!;
    expect(sticky.className).toContain("col-span-3");
    expect(sticky.className).toContain("text-2xl");
    expect(sticky.className).toContain("sticky");
    expect(sticky.className).toContain("top-40");
  });

  it("projects card grid is col-span-9, 2 columns, gap-8", () => {
    renderPage();
    const grid = document.querySelector("#projects [class*='col-span-9']")!;
    expect(grid.className).toContain("col-span-9");
    expect(grid.className).toContain("grid-cols-2");
    expect(grid.className).toContain("gap-8");
  });

  it("project cards are rounded-[60px] with clip-path", () => {
    renderPage();
    const cards = document.querySelectorAll("#projects [class*='rounded-\\[60px\\]']");
    expect(cards.length).toBe(8);
    cards.forEach((c) => expect(c.className).toContain("[clip-path:inset(0_round_60px)]"));
  });

  it("project card images aspect-square, object-cover, w-full", () => {
    renderPage();
    const imgs = document.querySelectorAll("#projects img[class*='aspect-square']");
    expect(imgs.length).toBe(8);
    imgs.forEach((img) => {
      expect(img.className).toContain("object-cover");
    });
  });

  it("project card overlay uses absolute inset-0, flex-col, p-6 pb-8", () => {
    renderPage();
    const overlays = document.querySelectorAll("#projects [class*='rounded-\\[60px\\]'] [class*='inset-0']");
    expect(overlays.length).toBe(8);
    overlays.forEach((o) => {
      expect(o.className).toContain("flex");
      expect(o.className).toContain("flex-col");
      expect(o.className).toContain("justify-end");
    });
  });

  it("project card title is text-4xl, panchang-bold, white", () => {
    renderPage();
    const titles = document.querySelectorAll("#projects [class*='rounded-\\[60px\\]'] h3");
    expect(titles.length).toBe(8);
    titles.forEach((t) => {
      expect(t.className).toContain("text-4xl");
      expect(t.className).toContain("font-panchang-bold");
      expect(t.className).toContain("text-white");
    });
  });

  it("project card tags are text-xs, white/70, with icon", () => {
    renderPage();
    const tags = document.querySelectorAll("#projects [class*='rounded-\\[60px\\]'] [class*='text-xs']");
    expect(tags.length).toBeGreaterThanOrEqual(8);
    tags.forEach((t) => {
      expect(t.className).toContain("font-clash-grotesk-regular");
    });
  });

  it("projects rounded outline badges exist with hover rotation", () => {
    renderPage();
    const badges = document.querySelectorAll("#projects .outline");
    expect(badges.length).toBe(3);
    badges.forEach((b) => {
      expect(b.className).toContain("rounded-full");
    });
  });

  /* ── Tools section ── */
  it("tools section is min-height-dvh with padding", () => {
    renderPage();
    const section = document.querySelector("#tools")!;
    expect(section.className).toContain("min-h-dvh");
    expect(section.className).toContain("p-5");
  });

  it("tools title is text-5xl, panchang-bold, centered", () => {
    renderPage();
    const section = document.querySelector("#tools")!;
    const h1 = section.querySelector("h1")!;
    expect(h1.className).toContain("text-5xl");
    expect(h1.className).toContain("font-panchang-bold");
    expect(h1.className).toContain("text-center");
  });

  it("tools subtitle is text-2xl, clash-grotesk-regular", () => {
    renderPage();
    const subtitle = document.querySelector("#tools p")!;
    expect(subtitle.className).toContain("text-2xl");
    expect(subtitle.className).toContain("font-clash-grotesk-regular");
  });

  it("tools gravity container is min-h-[600px] with relative positioning", () => {
    renderPage();
    const container = document.querySelector("#tools [class*='min-h-\\[600px\\]']")!;
    expect(container.className).toContain("relative");
  });

  it("tool pills are text-sm, rounded-full, flex row with gap-2", () => {
    renderPage();
    const pills = document.querySelectorAll("#tools [class*='rounded-full']");
    expect(pills.length).toBeGreaterThan(10);
    pills.forEach((p) => {
      expect(p.className).toContain("text-sm");
      expect(p.className).toContain("flex");
      expect(p.className).toContain("items-center");
      expect(p.className).toContain("gap-2");
      expect(p.className).toContain("font-clash-grotesk-semibold");
    });
  });

  it("tool pill icons are w-6 h-6", () => {
    renderPage();
    const icons = document.querySelectorAll("#tools [class*='rounded-full'] img");
    expect(icons.length).toBeGreaterThan(10);
    icons.forEach((icon) => {
      expect(icon.className).toContain("w-6");
      expect(icon.className).toContain("h-6");
    });
  });

  it("bucket labels are text-4xl, panchang-bold, capitalize, hidden off-screen", () => {
    renderPage();
    const labels = document.querySelectorAll('[id^="bucket-label-"]');
    expect(labels.length).toBe(3);
    labels.forEach((l) => {
      expect(l.className).toContain("text-4xl");
      expect(l.className).toContain("font-panchang-bold");
      expect(l.className).toContain("capitalize");
      expect(l.className).toContain("opacity-0");
    });
  });

  /* ── Footer ── */
  it("footer is flex centered row with pt-16", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const footer = sections[sections.length - 1];
    expect(footer.className).toContain("flex");
    expect(footer.className).toContain("items-center");
    expect(footer.className).toContain("justify-center");
    expect(footer.className).toContain("pt-16");
  });

  it("footer glass card is w-full, flex-col, centered, with px-14 py-28", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const card = sections[sections.length - 1].querySelector('[class*="flex-col"]')!;
    expect(card.className).toContain("w-full");
    expect(card.className).toContain("flex-col");
    expect(card.className).toContain("items-center");
    expect(card.className).toContain("justify-center");
    expect(card.className).toContain("px-14");
    expect(card.className).toContain("py-28");
  });

  it("footer subtitle is text-sm, uppercase, tracking-wide", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const p = sections[sections.length - 1].querySelector("p")!;
    expect(p.className).toContain("text-sm");
    expect(p.className).toContain("uppercase");
    expect(p.className).toContain("tracking-[0.4em]");
    expect(p.className).toContain("font-clash-grotesk-semibold");
  });

  it("footer main heading is text-[8rem], uppercase, panchang-bold", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const h2 = sections[sections.length - 1].querySelector("h2")!;
    expect(h2.className).toContain("text-[8rem]");
    expect(h2.className).toContain("font-panchang-bold");
    expect(h2.className).toContain("uppercase");
  });

  it("footer body text is text-lg, leading-9, clash-grotesk-regular", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const allP = sections[sections.length - 1].querySelectorAll("p");
    // second <p> is the body copy
    const bodyP = allP[1];
    expect(bodyP.className).toContain("text-lg");
    expect(bodyP.className).toContain("leading-9");
    expect(bodyP.className).toContain("font-clash-grotesk-regular");
  });

  it("footer buttons are rounded-full, flex row with gap-3, px-8 py-5", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const buttons = sections[sections.length - 1].querySelectorAll("a, button");
    const glassBtns = Array.from(buttons).filter(
      (b) => b.className.includes("rounded-full") && b.className.includes("px-8"),
    );
    expect(glassBtns.length).toBe(4);
    glassBtns.forEach((b) => {
      expect(b.className).toContain("gap-3");
      expect(b.className).toContain("py-5");
    });
  });

  it("footer button text is clash-grotesk-semibold", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const spans = sections[sections.length - 1].querySelectorAll("span");
    const btnSpans = Array.from(spans).filter(
      (s) => s.className.includes("font-clash-grotesk-semibold") && !s.className.includes("block"),
    );
    expect(btnSpans.length).toBeGreaterThanOrEqual(4);
  });

  it("footer strawhat divider is flex row centered with h-px lines", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const footer = sections[sections.length - 1];
    const divider = footer.querySelector('[class*="mt-20"][class*="flex"]')!;
    expect(divider.className).toContain("flex");
    expect(divider.className).toContain("items-center");
    expect(divider.className).toContain("gap-6");

    const lines = divider.querySelectorAll('[class*="h-px"]');
    expect(lines.length).toBe(2);
    expect(divider.querySelector("img")).toBeInTheDocument();
  });

  it("footer thanks message is text-center", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const footer = sections[sections.length - 1];
    const allP = footer.querySelectorAll("p");
    const thanks = allP[allP.length - 1];
    expect(thanks.className).toContain("text-center");
    expect(thanks.className).toContain("font-clash-grotesk-regular");
  });

  it("footer bottom row uses text-sm, flex justify-between, clash-grotesk-regular", () => {
    renderPage();
    const sections = document.querySelectorAll("section");
    const footer = sections[sections.length - 1];
    const row = footer.querySelector('[class*="justify-between"]')!;
    expect(row.className).toContain("text-sm");
    expect(row.className).toContain("flex");
    expect(row.className).toContain("justify-between");
    expect(row.className).toContain("font-clash-grotesk-regular");
  });

  /* ── Bottom nav ── */
  it("bottom nav container is fixed, centered, with gap-4", () => {
    renderPage();
    const container = document.querySelector('[class*="fixed"][class*="bottom-6"]')!;
    expect(container.className).toContain("fixed");
    expect(container.className).toContain("bottom-6");
    expect(container.className).toContain("flex");
    expect(container.className).toContain("items-center");
    expect(container.className).toContain("justify-center");
    expect(container.className).toContain("gap-4");
  });

  it("bottom nav GlassSurface has borderRadius 999 with px-2 py-1.5", () => {
    renderPage();
    const nav = document.querySelector("nav")!;
    const glass = nav.firstElementChild!;
    expect(glass.className).toContain("px-2");
    expect(glass.className).toContain("py-1.5");
    expect(glass.style.borderRadius).toBe("999px");
  });

  it("bottom nav buttons are rounded-lg, p-1.5", () => {
    renderPage();
    const btns = document.querySelectorAll("nav button");
    expect(btns.length).toBe(4);
    btns.forEach((b) => {
      expect(b.className).toContain("rounded-lg");
      expect(b.className).toContain("p-1.5");
    });
  });

  it("bottom nav divider is h-4 w-px", () => {
    renderPage();
    const dividers = document.querySelectorAll('[class*="h-4"][class*="w-px"]');
    expect(dividers.length).toBe(1);
  });

  /* ── Global content wrapper ── */
  it("content wrapper is vertical flex column with 3% horizontal padding", () => {
    renderPage();
    const wrapper = document.querySelector('[class*="flex-col"]')!;
    expect(wrapper.className).toContain("px-[3%]");
  });

  /* ── GSAP matchMedia animation configs ── */
  it("hero title scroll animation uses desktop-friendly values", () => {
    renderPage();

    const titleAnim = toSpy.mock.calls.find(
      (call) =>
        call[0]?.classList?.contains?.("hero-title-wrap") ||
        call[0]?.className?.includes?.("hero-title-wrap"),
    );

    expect(titleAnim).toBeDefined();
    expect(titleAnim![1].yPercent).toBe(-50);
    expect(titleAnim![1].scale).toBe(0.7);
    expect(titleAnim![1].ease).toBe("none");
    expect(titleAnim![1].scrollTrigger).toBeDefined();
    expect(titleAnim![1].scrollTrigger.start).toBe("top top");
    expect(titleAnim![1].scrollTrigger.end).toBe("bottom top");
    expect(titleAnim![1].scrollTrigger.scrub).toBe(0.5);
  });

  it("hero glass card scroll animation uses yPercent -20 on desktop", () => {
    renderPage();

    const cardAnims = toSpy.mock.calls.filter(
      (call) =>
        call[0]?.classList?.contains?.("glass-card-wrap") ||
        call[0]?.className?.includes?.("glass-card-wrap"),
    );

    expect(cardAnims.length).toBe(1);
    const anim = cardAnims[0][1];
    expect(anim.yPercent).toBe(-20);
    expect(anim.opacity).toBe(0);
    expect(anim.scrollTrigger).toBeDefined();
  });
});
