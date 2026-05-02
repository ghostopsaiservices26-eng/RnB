import {
  Component,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  NgZone,
  ChangeDetectionStrategy,
} from '@angular/core';
import gsap from 'gsap';

type AnimationPhase = 'scatter' | 'line' | 'circle';

interface CardState {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}

const TOTAL_IMAGES = 20;
const MAX_SCROLL = 3000;

// Curated India & group travel imagery — all personally verified, no stock clichés
const IMAGES = [
  'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=300&q=80', // Goa beach
  'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=300&q=80', // Himalayas
  'https://images.unsplash.com/photo-1544085701-4d6cf45f0c44?w=300&q=80', // Taj Mahal
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80', // Rajasthan dunes
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&q=80', // India street
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=300&q=80', // Kerala backwaters
  'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=300&q=80', // heritage palace
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&q=80', // Villa pool
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&q=80', // Mountain stay
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&q=80', // Friends travel
  'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=300&q=80', // Sunset camp
  'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=300&q=80', // Beach group
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80', // Mountain view
  'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=300&q=80', // Road trip
  'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=300&q=80', // Group adventure
  'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=300&q=80', // Hostel vibes
  'https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?w=300&q=80', // Forest trail
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300&q=80', // Luxury resort
  'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=300&q=80', // Lakeside
  'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=300&q=80', // Hammock relax
];

function lerp(a: number, b: number, t: number) {
  return a * (1 - t) + b * t;
}

@Component({
  selector: 'app-scroll-morph-hero',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #container class="smh-container">
      <!-- Static structure — Angular renders once, RAF animates directly via DOM refs -->

      <!-- Intro text -->
      <div #introText class="smh-intro-text">
        <div class="smh-wordmark">RnB</div>
        <div class="smh-wordmark-sub">ROAM &amp; BEYOND</div>
        <h1 class="smh-h1">Go Beyond Usual.</h1>
        <p class="smh-scroll-hint">SCROLL TO EXPLORE</p>
      </div>

      <!-- Arc content -->
      <div #arcContent class="smh-arc-content">
        <div class="smh-tag">India's First Intentional Group Travel Brand</div>
        <h2 class="smh-h2">We Plan It.<br/>You Live It.</h2>
        <p class="smh-arc-body">
          12 people. One destination. No randoms.<br />
          We design the right group, handle every detail,<br/>
          and create experiences worth becoming stories.
        </p>
        <div class="smh-cta-row">
          <button class="smh-btn-primary">Explore Trips</button>
          <button class="smh-btn-ghost">How It Works</button>
        </div>
      </div>

      <!-- Card stage -->
      <div class="smh-stage">
        @for (src of images; track $index) {
          <div class="flip-card-wrapper smh-card">
            <div class="flip-card-inner smh-card-inner">
              <div class="smh-face smh-front">
                <img [src]="src" [alt]="'photo-' + $index" class="smh-img" loading="lazy" />
                <div class="smh-front-overlay"></div>
              </div>
              <div class="smh-face smh-back">
                <p class="smh-back-label">View</p>
                <p class="smh-back-detail">Details</p>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    /* ── RnB brand tokens ─────────────────────────────── */
    :host {
      display: block; width: 100%; height: 100%;
      --rnb-bg:        #F7F4EF;
      --rnb-ink:       #1A1A18;
      --rnb-amber:     #C8622A;
      --rnb-amber-lt:  #E8845A;
      --rnb-forest:    #2C4A3E;
      --rnb-muted:     #7A7167;
      --rnb-card-back: #1A2E26;
    }

    .smh-container {
      position: relative;
      width: 100%;
      height: 100%;
      background: var(--rnb-bg);
      overflow: hidden;
      touch-action: none;
      perspective: 1000px;
    }

    /* ── Intro centre block ───────────────────────────── */
    .smh-intro-text {
      position: absolute;
      z-index: 2;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      pointer-events: none;
    }

    .smh-wordmark {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 800;
      letter-spacing: -0.04em;
      color: var(--rnb-forest);
      line-height: 1;
      margin-bottom: 2px;
    }

    .smh-wordmark-sub {
      font-size: clamp(0.55rem, 1.2vw, 0.7rem);
      font-weight: 600;
      letter-spacing: 0.22em;
      color: var(--rnb-amber);
      text-transform: uppercase;
      margin-bottom: 1rem;
    }

    .smh-h1 {
      font-size: clamp(1.1rem, 3vw, 2rem);
      font-weight: 500;
      letter-spacing: -0.01em;
      color: var(--rnb-ink);
      margin: 0;
      line-height: 1.2;
    }

    .smh-scroll-hint {
      margin-top: 1.25rem;
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.22em;
      color: var(--rnb-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .smh-scroll-hint::before,
    .smh-scroll-hint::after {
      content: '';
      display: inline-block;
      width: 24px;
      height: 1px;
      background: var(--rnb-muted);
      opacity: 0.5;
    }

    /* ── Arc content (fades in on scroll) ────────────── */
    .smh-arc-content {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      z-index: 10;
      text-align: center;
      pointer-events: none;
      opacity: 0;
      width: 90%;
      max-width: 580px;
    }

    .smh-tag {
      display: inline-block;
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--rnb-amber);
      background: rgba(200, 98, 42, 0.08);
      border: 1px solid rgba(200, 98, 42, 0.25);
      border-radius: 100px;
      padding: 4px 14px;
      margin-bottom: 1rem;
    }

    .smh-h2 {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 700;
      color: var(--rnb-ink);
      letter-spacing: -0.04em;
      line-height: 1.05;
      margin: 0 0 1rem;
    }

    .smh-arc-body {
      font-size: clamp(0.82rem, 1.8vw, 1rem);
      color: var(--rnb-muted);
      line-height: 1.75;
      margin: 0 0 1.5rem;
    }

    .smh-cta-row {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
      pointer-events: auto;
    }

    .smh-btn-primary {
      padding: 11px 28px;
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      color: #fff;
      background: var(--rnb-amber);
      border: none;
      border-radius: 100px;
      cursor: pointer;
      transition: background 0.2s, transform 0.15s;
    }

    .smh-btn-primary:hover {
      background: var(--rnb-amber-lt);
      transform: translateY(-1px);
    }

    .smh-btn-ghost {
      padding: 11px 28px;
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      color: var(--rnb-forest);
      background: transparent;
      border: 1.5px solid var(--rnb-forest);
      border-radius: 100px;
      cursor: pointer;
      transition: background 0.2s, transform 0.15s;
    }

    .smh-btn-ghost:hover {
      background: rgba(44, 74, 62, 0.07);
      transform: translateY(-1px);
    }

    /* ── Card stage ───────────────────────────────────── */
    .smh-stage {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .smh-card {
      position: absolute;
      width: 60px;
      height: 85px;
      top: 50%;
      left: 50%;
      transform-style: preserve-3d;
      cursor: pointer;
      will-change: transform, opacity;
    }

    .smh-card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
    }

    .smh-face {
      position: absolute;
      inset: 0;
      border-radius: 10px;
      box-shadow: 0 6px 18px rgba(26,26,24,0.18);
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      overflow: hidden;
    }

    .smh-front { background: #d6cfc5; }

    .smh-img { width: 100%; height: 100%; object-fit: cover; }

    .smh-front-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.04), rgba(0,0,0,0.14));
    }

    .smh-back {
      background: var(--rnb-card-back);
      border: 1px solid rgba(200,98,42,0.35);
      transform: rotateY(180deg);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
    }

    .smh-back-label {
      font-size: 7px;
      font-weight: 700;
      color: var(--rnb-amber);
      text-transform: uppercase;
      letter-spacing: 0.18em;
      margin: 0;
    }

    .smh-back-detail {
      font-size: 10px;
      font-weight: 500;
      color: #fff;
      margin: 0;
    }
  `],
})
export class ScrollMorphHeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('introText') introTextRef!: ElementRef<HTMLDivElement>;
  @ViewChild('arcContent') arcContentRef!: ElementRef<HTMLDivElement>;

  images = IMAGES;

  private phase: AnimationPhase = 'scatter';
  private virtualScroll = 0;
  private snapping = false;
  private mouseX = 0;
  private smoothMorph = 0;
  private smoothRotate = 0;
  private smoothParallax = 0;
  private touchStartY = 0;
  private animFrameId?: number;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private resizeObserver?: ResizeObserver;
  private containerW = 0;
  private containerH = 0;
  private cardEls: HTMLElement[] = [];

  private scatterPositions: CardState[] = Array.from({ length: TOTAL_IMAGES }, () => ({
    x: (Math.random() - 0.5) * 1400,
    y: (Math.random() - 0.5) * 800,
    rotation: (Math.random() - 0.5) * 160,
    scale: 0.7,
    opacity: 0,
  }));

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    const container = this.containerRef.nativeElement;

    this.cardEls = Array.from(container.querySelectorAll<HTMLElement>('.flip-card-wrapper'));

    this.resizeObserver = new ResizeObserver(() => {
      this.containerW = container.offsetWidth;
      this.containerH = container.offsetHeight;
    });
    this.resizeObserver.observe(container);
    this.containerW = container.offsetWidth;
    this.containerH = container.offsetHeight;

    // Listen at window level so native scroll always works when we don't preventDefault
    window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('touchstart', this.onTouchStart, { passive: false });
    window.addEventListener('touchmove', this.onTouchMove, { passive: false });
    container.addEventListener('mousemove', this.onMouseMove);

    // Flip-card hover via GSAP
    this.cardEls.forEach((card) => {
      const inner = card.querySelector<HTMLElement>('.smh-card-inner');
      if (!inner) return;
      card.addEventListener('mouseenter', () =>
        gsap.to(inner, { rotateY: 180, duration: 0.5, ease: 'back.out(1.4)' })
      );
      card.addEventListener('mouseleave', () =>
        gsap.to(inner, { rotateY: 0, duration: 0.5, ease: 'back.out(1.4)' })
      );
    });

    // Intro sequence (phase changes only, no zone.run needed since we use direct DOM)
    // scatter → line (fast), line → circle (quick so users don't stall in strip view)
    this.timers.push(setTimeout(() => { this.phase = 'line'; }, 200));
    this.timers.push(setTimeout(() => { this.phase = 'circle'; }, 900));

    // All animation runs outside Angular zone — zero change detection overhead
    this.zone.runOutsideAngular(() => this.renderLoop());
  }

  ngOnDestroy() {
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    const c = this.containerRef?.nativeElement;
    if (c) {
      c.removeEventListener('mousemove', this.onMouseMove);
    }
    this.resizeObserver?.disconnect();
    this.timers.forEach(clearTimeout);
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
  }

  private onWheel = (e: WheelEvent) => {
    // Already scrolled past hero — never interfere, native scroll takes over
    if (window.scrollY > 0) return;

    if (this.virtualScroll >= 600 && e.deltaY > 0) {
      // Arc complete, drive page scroll explicitly.
      // The hero container has overflow:hidden so the browser won't auto-scroll —
      // we must call scrollTop directly (bypasses CSS scroll-behavior queuing).
      e.preventDefault();
      document.documentElement.scrollTop += e.deltaY;
      return;
    }

    // Building the hero animation
    e.preventDefault();
    this.virtualScroll = Math.min(Math.max(this.virtualScroll + e.deltaY, 0), MAX_SCROLL);
  };

  private onTouchStart = (e: TouchEvent) => {
    this.touchStartY = e.touches[0].clientY;
  };

  private onTouchMove = (e: TouchEvent) => {
    // Only intercept touches that originate on the hero container
    const isOnHero = this.containerRef.nativeElement.contains(e.target as Node);
    if (!isOnHero) return;

    e.preventDefault(); // Always prevent default on hero (touch-action: none requires explicit control)
    const delta = this.touchStartY - e.touches[0].clientY;
    this.touchStartY = e.touches[0].clientY;

    // Arc formed + swiping up, OR already scrolled past hero → drive page scroll manually
    if ((this.virtualScroll >= 600 && delta > 0) || window.scrollY > 0) {
      document.documentElement.scrollTop += delta;
      return;
    }

    // Drive hero animation
    this.virtualScroll = Math.min(Math.max(this.virtualScroll + delta, 0), MAX_SCROLL);
  };
  private onMouseMove = (e: MouseEvent) => {
    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    this.mouseX = ((e.clientX - rect.left) / rect.width * 2 - 1) * 100;
  };

  private renderLoop() {
    this.animFrameId = requestAnimationFrame(() => this.renderLoop());

    const F = 0.10;
    const targetMorph = Math.min(Math.max(this.virtualScroll / 600, 0), 1);
    const targetRotate = Math.min(Math.max((this.virtualScroll - 600) / (MAX_SCROLL - 600), 0), 1) * 360;

    this.smoothMorph += (targetMorph - this.smoothMorph) * F;
    this.smoothRotate += (targetRotate - this.smoothRotate) * F;
    this.smoothParallax += (this.mouseX - this.smoothParallax) * F;

    // Update text layers directly — no Angular zone touch
    const introEl = this.introTextRef?.nativeElement;
    const arcEl = this.arcContentRef?.nativeElement;
    if (introEl && arcEl) {
      const introOpacity = this.phase === 'circle' ? Math.max(0, 1 - this.smoothMorph * 2.5) : (this.phase === 'scatter' ? 0 : 0);
      const arcOpacity = Math.min(Math.max((this.smoothMorph - 0.75) / 0.25, 0), 1);
      const arcY = lerp(20, 0, Math.min(this.smoothMorph / 0.9, 1));
      introEl.style.opacity = String(introOpacity);
      arcEl.style.opacity = String(arcOpacity);
      arcEl.style.transform = `translateX(-50%) translateY(${arcY}px)`;
    }

    this.positionCards();
  }

  private positionCards() {
    const morph = this.smoothMorph;
    const rotateVal = this.smoothRotate;
    const parallax = this.smoothParallax;
    const W = this.containerW;
    const H = this.containerH;
    if (!W || !H) return;

    const isMobile = W < 768;
    const centerY = H / 2;

    this.cardEls.forEach((el, i) => {
      let target: CardState;

      if (this.phase === 'scatter') {
        target = this.scatterPositions[i];
      } else if (this.phase === 'line') {
        const spacing = 70;
        const totalW = TOTAL_IMAGES * spacing;
        target = { x: i * spacing - totalW / 2, y: 0, rotation: 0, scale: 1, opacity: 1 };
      } else {
        // Circle
        const minDim = Math.min(W, H);
        const cr = Math.min(minDim * 0.35, 320);
        const ca = (i / TOTAL_IMAGES) * 360;
        const cRad = (ca * Math.PI) / 180;
        const circle: CardState = {
          x: Math.cos(cRad) * cr,
          y: Math.sin(cRad) * cr,
          rotation: ca + 90,
          scale: 1,
          opacity: 1,
        };

        // Arc
        const arcR = Math.min(W, H * 1.5) * (isMobile ? 1.4 : 1.1);
        const arcCenterY = H * (isMobile ? 0.35 : 0.25) + arcR;
        const spread = isMobile ? 100 : 130;
        const startA = -90 - spread / 2;
        const step = spread / (TOTAL_IMAGES - 1);
        const scrollProg = Math.min(Math.max(rotateVal / 360, 0), 1);
        const angleOffset = startA + i * step - scrollProg * spread * 0.8;
        const aRad = (angleOffset * Math.PI) / 180;
        const arcScale = isMobile ? 1.4 : 1.8;
        const arc: CardState = {
          x: Math.cos(aRad) * arcR + parallax,
          y: Math.sin(aRad) * arcR + arcCenterY - centerY,
          rotation: angleOffset + 90,
          scale: arcScale,
          opacity: 1,
        };

        target = {
          x: lerp(circle.x, arc.x, morph),
          y: lerp(circle.y, arc.y, morph),
          rotation: lerp(circle.rotation, arc.rotation, morph),
          scale: lerp(1, arc.scale, morph),
          opacity: 1,
        };
      }

      el.style.transform =
        `translate(calc(-50% + ${target.x}px), calc(-50% + ${target.y}px)) rotate(${target.rotation}deg) scale(${target.scale})`;
      el.style.opacity = String(target.opacity);
    });
  }
}
