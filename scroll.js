gsap.registerPlugin(ScrollTrigger);

// ── 1. LENIS ────────────────────────────────────────────
const lenis = new Lenis({
    duration: 1.4,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

lenis.on('scroll', () => ScrollTrigger.update());
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);


// ── 2. HERO — cinematic zoom out + fade ─────────────────
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

gsap.to('.flagship-banner__txt', {
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


// ── 3. ABOUT — word split reveal ────────────────────────
const aboutText = document.querySelector('#about .content p');
if (aboutText) {
    const words = aboutText.innerText.split(' ');
    aboutText.innerHTML = words.map(w => `<span class="word" style="display:inline-block; overflow:hidden"><span class="word-inner" style="display:inline-block">${w}</span></span>`).join(' ');

    gsap.from('#about .word-inner', {
        y: '100%',
        opacity: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#about',
            start: 'top 75%',
        }
    });
}


// ── 4. SECTION-2 — image parallax + text pin ────────────
gsap.to('#section-2 .content-over-img__img', {
    yPercent: -15,
    ease: 'none',
    scrollTrigger: {
        trigger: '#section-2',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
    }
});

gsap.from('#section-2 .content-over-img__top', {
    y: 60,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '#section-2',
        start: 'top 70%',
    }
});


// ── 5. SKILLS — stagger slide up ────────────────────────
gsap.from('.link-cards__item', {
    y: 80,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '#skills',
        start: 'top 75%',
    }
});


// ── 6. PROJECTS — heading + list items ──────────────────
gsap.from('.projects-section__heading', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '#projects',
        start: 'top 80%',
    }
});

gsap.from('.project-list-item', {
    y: 30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '#projects',
        start: 'top 70%',
    }
});


// ── 7. TESTIMONIALS ─────────────────────────────────────
gsap.from('#section-5 .flickity__item-quote', {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '#section-5',
        start: 'top 80%',
    }
});



// ── 9. SECTION-10 — word reveal ─────────────────────────
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


// ── 10. SECTION-9 IMAGE CARDS ───────────────────────────
gsap.from('.img-links__item', {
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '#section-9',
        start: 'top 80%',
    }
});


// ── 11. FOOTER CTA ──────────────────────────────────────
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

// ── MAGNETIC BUTTONS ────────────────────────────────────
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

// ── BACKGROUND COLOUR TRANSITIONS ───────────────────────
const sections = [{
        trigger: '#banner-1',
        color: '#0a1628'
    },
    {
        trigger: '#about',
        color: '#1a1410'
    },
    {
        trigger: '#section-2',
        color: '#0d1f1a'
    },
    {
        trigger: '#skills',
        color: '#f0ece4'
    },
    {
        trigger: '#projects',
        color: '#0d0d0f'
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
        trigger: '#footer-1',
        color: '#f0ece4'
    },
];

sections.forEach(({
    trigger,
    color
}) => {
    ScrollTrigger.create({
        trigger,
        start: 'top 60%',
        onEnter: () => gsap.to('body', {
            backgroundColor: color,
            duration: 0.8,
            ease: 'power2.out'
        }),
        onLeaveBack: () => {
            const prev = sections[sections.indexOf(sections.find(s => s.trigger === trigger)) - 1];
            if (prev) gsap.to('body', {
                backgroundColor: prev.color,
                duration: 0.8,
                ease: 'power2.out'
            });
        }
    });
});

// ── HORIZONTAL SCROLL SKILLS ────────────────────────────
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

// ── CUSTOM CURSOR ────────────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

let mouseX = 0,
    mouseY = 0;
let followerX = 0,
    followerY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .btn, .link-cards__item, .project-list-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hovering');
        follower.classList.add('is-hovering');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hovering');
        follower.classList.remove('is-hovering');
    });
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
});

animateFollower();
cursor.style.opacity = '1'; // ← add this
follower.style.opacity = '1'; // ← and this