// ═══════════════════════════════════════════════════════════════
// app.js — Hulash Chand Portfolio
// Vanilla JS rewrite — no jQuery, no dependencies
// Replaces: jquery-3.6.0, jquery.bez, jquery.easing, app.min8a54.js
// ═══════════════════════════════════════════════════════════════

var sitename = 'Hulash Chand';
var view = {};
var events = {};
var utils = {};
var windowObj = {};
var mouseObj = {};
var scrollPos = 0;
var themeOptions = ['mono', 'dark', 'light'];
var themeCurrent;
var projects;
var indexProject = 0;
var projectScrollTimer = 0;

// ────────────────────────────────────────────────────────────────
// VIEW
// ────────────────────────────────────────────────────────────────

view.init = function () {
    if ('/' !== location.pathname) {
        history.pushState({
            url: location.pathname
        }, sitename + ' ' + location.pathname, location.pathname);
    } else {
        history.pushState({
            url: '/'
        }, sitename, '/');
    }

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    window.addEventListener('resize', function () {
        view.resizer();
    });
    view.resizer();
    view.themeGet();

    setTimeout(function () {
        document.body.classList.remove('init');
    }, 50);

    view.indexGet();

    if (document.body.classList.contains('project')) {
        events.projectInit();
        if (!('ontouchstart' in document.documentElement)) events.setProjectCursor();
        events.projectColor();
        events.projectVideo();
    }

    if (document.body.classList.contains('info')) events.infoListAnimate();
};

view.resizer = function () {
    windowObj.w = window.innerWidth;
    windowObj.h = window.innerHeight;
    var vh = 0.01 * window.innerHeight;
    document.documentElement.style.setProperty('--vh', vh + 'px');
};

view.themeGet = function () {
    if (localStorage.getItem('themeColor') === null) {
        localStorage.setItem('themeColor', themeOptions[0]);
    }
    themeCurrent = localStorage.getItem('themeColor');
    view.themeSet(themeCurrent);
};

view.themeSet = function (a) {
    themeOptions.forEach(function (opt) {
        document.body.classList.remove(opt);
    });
    document.body.classList.add(a);
    localStorage.setItem('themeColor', a);
    themeCurrent = a;

    if (document.body.classList.contains('project')) {
        events.projectColor();
    } else {
        events.projectColorReset();
    }
};

view.indexGet = function () {
    var a;
    if (localStorage.getItem('indexView') === null) {
        a = 'list';
        localStorage.setItem('indexView', a);
    } else {
        a = localStorage.getItem('indexView');
    }
    document.body.classList.add(a);

    if (localStorage.getItem('indexSort') === null) {
        a = 'date';
        localStorage.setItem('indexSort', a);
    } else {
        a = localStorage.getItem('indexSort');
        if (a === 'a_z') view.indexSort('title', false);
    }
    document.body.classList.add(a);
};

view.indexSort = function (a, c) {
    var nav = document.querySelector('nav');
    if (!nav) return;
    var items = Array.from(nav.children);
    items.sort(function (e, f) {
        return c ?
            f.getAttribute('data-' + a).localeCompare(e.getAttribute('data-' + a)) :
            e.getAttribute('data-' + a).localeCompare(f.getAttribute('data-' + a));
    });
    items.forEach(function (el) {
        nav.appendChild(el);
    });

    if (projects) {
        if (a === 'date') {
            projects.sort(function (e, f) {
                return f[1].localeCompare(e[1]);
            });
        } else if (a === 'title') {
            projects.sort(function (e, f) {
                return e[5].localeCompare(f[5]);
            });
        }
    }
};

view.inViewport = function (a, c, d) {
    var rect = a.getBoundingClientRect();
    var html = document.documentElement;
    return rect.top >= 0 - c &&
        rect.left >= 0 - d &&
        rect.bottom <= (window.innerHeight || html.clientHeight) + c &&
        rect.right <= (window.innerWidth || html.clientWidth) + d;
};

// ────────────────────────────────────────────────────────────────
// EVENTS
// ────────────────────────────────────────────────────────────────

events.init = function () {
    window.onpopstate = function (a) {
        if (a.state) window.location.href = a.state.url;
    };

    window.addEventListener('scroll', function () {
        events.scroll();
    });

    // Theme toggle
    var header = document.querySelector('header');
    if (header) {
        header.addEventListener('click', function (a) {
            if (a.target.closest('.js-theme')) {
                a.preventDefault();
                var themeIndex = themeOptions.indexOf(themeCurrent);
                themeIndex = themeIndex < themeOptions.length - 1 ? themeIndex + 1 : 0;
                view.themeSet(themeOptions[themeIndex]);
            }

            // Index view toggle (grid / list)
            var jsGrid = a.target.closest('.js-grid');
            var jsList = a.target.closest('.js-list');
            if (jsGrid) {
                a.preventDefault();
                document.body.classList.remove('list');
                document.body.classList.add('grid');
                localStorage.setItem('indexView', 'grid');
                (windowObj.w >= 760 || document.body.classList.contains('grid')) ?
                events.projectListAnimate(): events.scroll();
            }
            if (jsList) {
                a.preventDefault();
                document.body.classList.remove('grid');
                document.body.classList.add('list');
                localStorage.setItem('indexView', 'list');
                (windowObj.w >= 760 || document.body.classList.contains('grid')) ?
                events.projectListAnimate(): events.scroll();
            }

            // Index sort toggle
            var jsAlpha = a.target.closest('.js-sort-alpha');
            var jsDate = a.target.closest('.js-sort-date');
            if (jsAlpha) {
                a.preventDefault();
                document.body.classList.remove('date');
                document.body.classList.add('a_z');
                localStorage.setItem('indexSort', 'a_z');
                view.indexSort('title', false);
                (windowObj.w >= 760 || document.body.classList.contains('grid')) ?
                events.projectListAnimate(): events.scroll();
            }
            if (jsDate) {
                a.preventDefault();
                document.body.classList.remove('a_z');
                document.body.classList.add('date');
                localStorage.setItem('indexSort', 'date');
                view.indexSort('date', true);
                (windowObj.w >= 760 || document.body.classList.contains('grid')) ?
                events.projectListAnimate(): events.scroll();
            }
        });
    }

    // Slide click — left half prev, right half next
    var main = document.querySelector('main');
    if (main) {
        main.addEventListener('click', function (a) {
            var slides = a.target.closest('#project-slides');
            if (!slides) return;
            var details = document.querySelector('#project-info-details a');
            if (document.getElementById('project') && document.getElementById('project').classList.contains('details')) {
                if (details) details.click();
            } else {
                mouseObj.x < windowObj.w / 2 ? events.goPrevious() : events.goNext();
            }
        });

        // Project details expand/collapse
        main.addEventListener('click', function (a) {
            var detailLink = a.target.closest('#project-info-details > a');
            if (!detailLink) return;
            a.preventDefault();
            var p = document.getElementById('project');
            var detailsEl = document.querySelector('#project-info-details p');
            if (!p || !detailsEl) return;

            if (p.classList.contains('details')) {
                // Collapse: animate from current height back to 0
                p.classList.remove('details');
                detailsEl.style.maxHeight = detailsEl.scrollHeight + 'px'; // set explicit start point
                detailsEl.style.overflow = 'hidden';
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () { // double rAF forces browser to register the start value
                        detailsEl.style.transition = 'max-height 0.5s ease, opacity 0.4s ease';
                        detailsEl.style.maxHeight = '0';
                        detailsEl.style.opacity = '0';
                    });
                });
            } else {
                // Expand: measure real height then animate to it
                p.classList.add('details');
                detailsEl.style.maxHeight = '0';
                detailsEl.style.overflow = 'hidden';
                detailsEl.style.opacity = '0';
                detailsEl.style.display = 'block';
                var targetHeight = detailsEl.scrollHeight + 'px';
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        detailsEl.style.transition = 'max-height 0.6s ease, opacity 0.4s ease';
                        detailsEl.style.maxHeight = targetHeight;
                        detailsEl.style.opacity = '1';
                    });
                });
            }
        });

    }

    events.projectScroll();

    if (!('ontouchstart' in document.documentElement)) {
        document.addEventListener('mousemove', function (a) {
            mouseObj.x = a.pageX;
            mouseObj.y = a.pageY;
        });

        var projectSlides = document.getElementById('project-slides');
        if (projectSlides) {
            projectSlides.addEventListener('mousemove', function () {
                events.setProjectCursor();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', function (a) {
            var key = a.keyCode || a.which;
            var proj = document.getElementById('project');
            var slides = document.getElementById('project-slides');
            if (key === 37 && proj) {
                a.preventDefault();
                if (!document.body.classList.contains('loading') && slides && !slides.classList.contains('disableSnapping')) {
                    events.goPrevious();
                }
            } else if (key === 39 && proj) {
                a.preventDefault();
                if (!document.body.classList.contains('loading') && slides && !slides.classList.contains('disableSnapping')) {
                    events.goNext();
                }
            } else if (key === 27) {
                if (document.body.classList.contains('project') || document.body.classList.contains('info')) {
                    window.location.href = '/';
                }
            }
        });
    }
};

events.scroll = function () {
    scrollPos = window.scrollY;
    if (windowObj.w < 760) {
        var active = -1;
        document.querySelectorAll('main section nav a').forEach(function (el, d) {
            var rect = el.getBoundingClientRect();
            var t = rect.top + scrollPos - windowObj.h / 2;
            var b = t + el.offsetHeight;
            if (scrollPos > t && scrollPos < b) {
                active = d;
                if (!el.classList.contains('img')) {
                    el.classList.add('img');
                    if (document.body.classList.contains('mono')) {
                        var col = el.dataset.color;
                        document.querySelector(':root').style.setProperty('--background', col);
                        col = utils.color(col, '#FFFFFF', '#000000');
                        document.querySelector(':root').style.setProperty('--color', col);
                    }
                }
            } else {
                el.classList.remove('img');
            }
        });
        if (document.body.classList.contains('mono') && active === -1) {
            var mono = document.querySelector(':root').style.getPropertyValue('--mono');
            document.querySelector(':root').style.setProperty('--background', mono);
            document.querySelector(':root').style.setProperty('--color', '#000');
        }
    }
};

events.projectListAnimate = function () {
    document.querySelectorAll('#projects nav a').forEach(function (el, a) {
        el.style.opacity = '0';
        setTimeout(function () {
            el.style.transition = 'opacity 0.6s ease';
            el.style.opacity = '1';
            setTimeout(function () {
                el.style.transition = '';
            }, 650);
        }, 20 * a);
    });
};

events.projectInit = function () {
    if (!projects) return;
    var currentId = parseInt(document.getElementById('project').dataset.id);
    var nextIndex = 0;
    for (var i = 0; i < projects.length; i++) {
        if (projects[i][0] === currentId) {
            nextIndex = i < projects.length - 1 ? i + 1 : 0;
            break;
        }
    }
    var nextAuthor = projects[nextIndex][2];
    var nextName = projects[nextIndex][3];
    var nextEl = document.querySelector('#project-info-counter span.next');
    if (nextEl) nextEl.innerHTML = '<span>' + nextAuthor + '</span> <span>' + nextName + '</span>';
};

events.projectColor = function () {
    var proj = document.getElementById('project');
    var colorBtn = document.querySelector('header a.color');
    if (document.body.classList.contains('light') && proj) {
        if (proj.dataset.color && colorBtn) {
            colorBtn.style.background = proj.dataset.color;
        } else if (colorBtn) {
            colorBtn.removeAttribute('style');
        }
    } else if (colorBtn) {
        colorBtn.removeAttribute('style');
    }

    if (document.body.classList.contains('mono')) {
        var col = '';
        var activeSlide = document.querySelector('#project-slides > div:nth-child(' + (indexProject + 1) + ')');
        if (activeSlide && activeSlide.dataset.color) {
            col = activeSlide.dataset.color;
        } else if (proj && proj.dataset.color) {
            col = proj.dataset.color;
        }
        if (col !== '') {
            document.querySelector(':root').style.setProperty('--background', col);
            col = utils.color(col, '#FFFFFF', '#000000');
            document.querySelector(':root').style.setProperty('--color', col);
        } else {
            events.projectColorReset();
        }
    }
};

events.projectColorReset = function () {
    if (document.body.classList.contains('mono')) {
        var mono = document.querySelector(':root').style.getPropertyValue('--mono');
        document.querySelector(':root').style.setProperty('--background', mono);
        document.querySelector(':root').style.setProperty('--color', '#000');
    }
    var colorBtn = document.querySelector('header a.color');
    if (colorBtn) colorBtn.removeAttribute('style');
};

events.goPrevious = function () {
    var slides = document.getElementById('project-slides');
    if (!slides) return;
    var total = slides.querySelectorAll(':scope > div').length;
    indexProject = (indexProject - 1 + total) % total;
    var nextEl = document.querySelector('#project-info-counter span.next');
    if (nextEl) nextEl.style.width = '0';
    var proj = document.getElementById('project');
    if (proj) proj.classList.remove('next');
    events.setProject();
};

events.goNext = function () {
    var slides = document.getElementById('project-slides');
    if (!slides) return;
    var total = slides.querySelectorAll(':scope > div').length;
    indexProject = (indexProject + 1) % total;
    var nextEl = document.querySelector('#project-info-counter span.next');
    if (nextEl) nextEl.style.width = '0';
    var proj = document.getElementById('project');
    if (proj) proj.classList.remove('next');
    events.setProject();
};

events.projectScroll = function () {
    var slides = document.getElementById('project-slides');
    if (!slides) return;
    slides.addEventListener('scroll', function () {
        var left = slides.scrollLeft;
        var total = slides.querySelectorAll(':scope > div').length;
        var width = slides.scrollWidth;
        clearTimeout(projectScrollTimer);
        projectScrollTimer = setTimeout(function () {
            indexProject = Math.round(left / width * total);
            var counter = document.querySelector('#project-info-counter span:first-child');
            if (counter) counter.textContent = indexProject + 1;
            events.projectColor();
            events.projectVideo();
        }, 100);
    });
};

events.projectVideo = function () {
    var slides = document.getElementById('project-slides');
    if (!slides) return;
    slides.querySelectorAll('video').forEach(function (v) {
        if (!v.paused) v.pause();
    });
    var activeSlide = slides.querySelector(':scope > div:nth-child(' + (indexProject + 1) + ')');
    if (activeSlide) {
        activeSlide.querySelectorAll('video').forEach(function (v) {
            if (!(v.currentTime > 0 && !v.paused && !v.ended && v.readyState > 2)) v.play();
        });
    }
};

events.setProject = function () {
    var counter = document.querySelector('#project-info-counter span:first-child');
    if (counter) counter.textContent = indexProject + 1;
    events.projectColor();
    var slides = document.getElementById('project-slides');
    if (!slides) return;
    slides.classList.add('disableSnapping');
    slides.scrollTo({
        left: indexProject * windowObj.w,
        behavior: 'smooth'
    });
    setTimeout(function () {
        slides.classList.remove('disableSnapping');
    }, 1200);
};

events.setProjectCursor = function () {
    var proj = document.getElementById('project');
    if (proj && proj.classList.contains('details')) return;
    var slides = document.getElementById('project-slides');
    if (!slides) return;
    if (mouseObj.x < windowObj.w / 2) {
        if (!slides.classList.contains('left')) {
            slides.classList.add('left');
            slides.classList.remove('right');
        }
    } else {
        if (!slides.classList.contains('right')) {
            slides.classList.add('right');
            slides.classList.remove('left');
        }
    }
};

events.infoListAnimate = function () {
    document.querySelectorAll('main ul li').forEach(function (el, a) {
        var originalOpacity = el.style.opacity || '1';
        el.style.opacity = '0';
        setTimeout(function () {
            el.style.transition = 'opacity 0.6s ease';
            el.style.opacity = originalOpacity;
            setTimeout(function () {
                el.style.transition = '';
            }, 650);
        }, 20 * a);
    });
};

// ────────────────────────────────────────────────────────────────
// UTILS
// ────────────────────────────────────────────────────────────────

utils.color = function (hex, light, dark) {
    var h = hex.charAt(0) === '#' ? hex.substring(1, 7) : hex;
    var r = parseInt(h.substring(0, 2), 16) / 255;
    var g = parseInt(h.substring(2, 4), 16) / 255;
    var b = parseInt(h.substring(4, 6), 16) / 255;
    var channels = [r, g, b].map(function (c) {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    var luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    return luminance > 0.179 ? dark : light;
};

// ────────────────────────────────────────────────────────────────
// INIT
// ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
    view.init();
    events.init();
});