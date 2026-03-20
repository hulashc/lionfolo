gsap.registerPlugin(ScrollTrigger);

// ── 1. LENIS ────────────────────────────────────────────
const lenis = new Lenis({
    duration: 1.4,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

lenis.on('scroll', () => ScrollTrigger.update());
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ── HELPER ──────────────────────────────────────────────
function gsapIf(selector, fn) {
    if (document.querySelector(selector)) fn();
}

// ── 2. HERO — cinematic zoom out + fade ─────────────────
gsapIf('.flagship-banner__title', () => {
    gsap.to('.flagship-banner__title', {
        scale: 0.5,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '#banner-1',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
        }
    });
});

// NEW: replaces .flagship-banner__txt (role columns removed)
gsapIf('.flagship-banner__about', () => {
    gsap.to('.flagship-banner__about', {
        y: 80,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '#banner-1',
            start: 'top top',
            end: '50% top',
            scrub: 1,
        }
    });
});

gsapIf('.flagship-banner__header-txt', () => {
    gsap.to('.flagship-banner__header-txt', {
        y: -40,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '#banner-1',
            start: 'top top',
            end: '40% top',
            scrub: 1,
        }
    });
});

// ── 3. WHAT I DO — replaces old section-2 ───────────────
gsapIf('.what-i-do-section', () => {
    gsap.from('.wid-headline', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.what-i-do-section',
            start: 'top 70%',
        }
    });
});

// ── 4. SECTION-10 — word reveal ─────────────────────────
gsapIf('#section-10 .txt-script', () => {
    gsap.from('#section-10 .txt-script', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#section-10',
            start: 'top 75%',
        }
    });
});

gsapIf('#section-10 h3', () => {
    gsap.from('#section-10 h3', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.2,
        scrollTrigger: {
            trigger: '#section-10',
            start: 'top 70%',
        }
    });
});

gsapIf('#section-10 .btn', () => {
    gsap.from('#section-10 .btn', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.4,
        scrollTrigger: {
            trigger: '#section-10',
            start: 'top 65%',
        }
    });
});

// ── 5. FOOTER CTA ────────────────────────────────────────
gsapIf('#footer-1 .cta__content', () => {
    gsap.from('#footer-1 .cta__content', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#footer-1',
            start: 'top 85%',
        }
    });
});

// ── 6. MAGNETIC BUTTONS ──────────────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(this, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    btn.addEventListener('mouseleave', function () {
        gsap.to(this, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
        });
    });
});

// ── 7. BACKGROUND COLOUR TRANSITIONS ────────────────────
const sections = [{
        trigger: '#banner-1',
        color: '#0a1628'
    },
    {
        trigger: '#section-2',
        color: '#0d1f1a'
    }, // what-i-do (if you kept id)
    {
        trigger: '#skills',
        color: '#f0ece4'
    },
    {
        trigger: '#section-5',
        color: '#ffffff'
    },
    {
        trigger: '#blog',
        color: '#f0ece4'
    },
    {
        trigger: '#section-9',
        color: '#0d0d0f'
    },
    {
        trigger: '#section-10',
        color: '#0d0d0f'
    },
    {
        trigger: '#footer-1',
        color: '#f0ece4'
    },
];

sections.forEach(({
    trigger,
    color
}, i) => {
    if (!document.querySelector(trigger)) return; // guard
    ScrollTrigger.create({
        trigger,
        start: 'top 60%',
        onEnter: () => gsap.to('body', {
            backgroundColor: color,
            duration: 0.8,
            ease: 'power2.out'
        }),
        onLeaveBack: () => {
            const prev = sections[i - 1];
            if (prev && document.querySelector(prev.trigger)) {
                gsap.to('body', {
                    backgroundColor: prev.color,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            }
        }
    });
});

// ── 8. HORIZONTAL SCROLL SKILLS ─────────────────────────
const skillsTrack = document.querySelector('.skills-horizontal-wrap .link-cards');
if (skillsTrack) {
    const scrollAmount = skillsTrack.scrollWidth - window.innerWidth;
    gsap.to(skillsTrack, {
        x: -scrollAmount,
        ease: 'none',
        scrollTrigger: {
            trigger: '#skills',
            start: 'top top',
            end: () => `+=${scrollAmount}`,
            scrub: 1,
            pin: true,
        }
    });
}