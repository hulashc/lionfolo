// ═════════════════════════════════════════════════════════════════
// app.min8a54.js — Hulash Chand Portfolio
// Project page engine: slides, themes, video, keyboard nav
//
// Removed from original:
//   - view.load()     → dead WordPress AJAX loader, not used on static site
//   - view.intro()    → never called anywhere
//   - utils.svg()     → no img.svg elements in any project page
//   - view.direct()   → empty function
//   - sitename        → was "Benjamin Wilkerson Tousley", now "Hulash Chand"
// ═════════════════════════════════════════════════════════════════

var sitename = 'Hulash Chand',
    view     = view     || {},
    events   = events   || {},
    utils    = utils    || {},
    windowObj        = {},
    mouseObj         = {},
    scrollPos        = 0,
    themeOptions     = ['mono', 'dark', 'light'],
    themeCurrent,
    projects,
    indexProject     = 0,
    projectScrollTimer = 0,
    customEasing     = $.bez([.45, .05, .125, 1]);

// ────────────────────────────────────────────────────────────────
// VIEW — page state, theme, window, history
// ────────────────────────────────────────────────────────────────

view.init = function () {
    // Push current path into history with correct sitename
    if ('/' !== location.pathname) {
        history.pushState({ url: location.pathname }, sitename + ' ' + location.pathname, location.pathname);
    } else {
        history.pushState({ url: '/' }, sitename, '/');
    }

    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    $(window).resize(function () { view.resizer(); });
    view.resizer();
    view.themeGet();

    // Remove init class after brief delay to trigger CSS entrance animations
    setTimeout(function () { $('body').removeClass('init'); }, 50);

    view.indexGet();

    // Route to correct initialiser based on page type
    if ($('body').hasClass('project')) {
        events.projectInit();
        if (!('ontouchstart' in document.documentElement)) events.setProjectCursor();
        events.projectColor();
        events.projectVideo();
    }

    if ($('body').hasClass('info')) events.infoListAnimate();
};

view.resizer = function () {
    windowObj.w = $(window).width();
    windowObj.h = $(window).height();
    // Fix for mobile 100vh including browser chrome
    var vh = 0.01 * window.innerHeight;
    document.documentElement.style.setProperty('--vh', vh + 'px');
};

view.themeGet = function () {
    if (null === localStorage.getItem('themeColor')) {
        localStorage.setItem('themeColor', themeOptions[0]);
    }
    themeCurrent = localStorage.getItem('themeColor');
    var themeIndex = themeOptions.indexOf(themeCurrent);
    view.themeSet(themeOptions[themeIndex]);
};

view.themeSet = function (a) {
    for (var i = 0; i < themeOptions.length; i++) {
        if (a !== themeOptions[i]) {
            $('body').removeClass(themeOptions[i]);
        } else {
            $('body').addClass(a);
            localStorage.setItem('themeColor', a);
            themeCurrent = a;
        }
    }
    $('body').hasClass('project') ? events.projectColor() : events.projectColorReset();
};

view.indexGet = function () {
    var a;
    if (null === localStorage.getItem('indexView')) {
        a = 'list';
        localStorage.setItem('indexView', a);
    } else {
        a = localStorage.getItem('indexView');
    }
    $('body').addClass(a);

    if (null === localStorage.getItem('indexSort')) {
        a = 'date';
        localStorage.setItem('indexSort', a);
    } else {
        a = localStorage.getItem('indexSort');
        if ('a_z' === a) view.indexSort('title', false);
    }
    $('body').addClass(a);
};

view.indexSort = function (a, c) {
    var d = $('nav');
    d.children().detach().sort(function (e, f) {
        return c
            ? $(f).get(0).getAttribute('data-' + a).localeCompare($(e).get(0).getAttribute('data-' + a))
            : $(e).get(0).getAttribute('data-' + a).localeCompare($(f).get(0).getAttribute('data-' + a));
    }).appendTo(d);

    if (a === 'date') {
        projects.sort(function (e, f) { return f[1].localeCompare(e[1]); });
    } else if (a === 'title') {
        projects.sort(function (e, f) { return e[5].localeCompare(f[5]); });
    }
};

view.inViewport = function (a, c, d) {
    var rect = a.getBoundingClientRect();
    var html = document.documentElement;
    return rect.top    >= 0 - c &&
           rect.left   >= 0 - d &&
           rect.bottom <= (window.innerHeight || html.clientHeight) + c &&
           rect.right  <= (window.innerWidth  || html.clientWidth)  + d;
};

// ────────────────────────────────────────────────────────────────
// EVENTS — all user interactions
// ────────────────────────────────────────────────────────────────

events.init = function () {
    // Browser back/forward navigation
    window.onpopstate = function (a) {
        if (a.state) window.location.href = a.state.url;
    };

    $(window).scroll(function () { events.scroll(); });

    // Theme toggle
    $('header').on('click', '.js-theme', function (a) {
        a.preventDefault();
        var themeIndex = themeOptions.indexOf(themeCurrent);
        themeIndex < themeOptions.length - 1 ? themeIndex++ : themeIndex = 0;
        view.themeSet(themeOptions[themeIndex]);
    });

    // Index view toggle (grid / list)
    $('header').on('click', '.js-index > li:eq(0) > a', function (a) {
        a.preventDefault();
        if (0 === $(this).index()) {
            $('body').removeClass('list').addClass('grid');
            localStorage.setItem('indexView', 'grid');
        } else {
            $('body').removeClass('grid').addClass('list');
            localStorage.setItem('indexView', 'list');
        }
        (760 <= windowObj.w || $('body').hasClass('grid'))
            ? events.projectListAnimate()
            : events.scroll();
    });

    // Index sort toggle (A–Z / date)
    $('header').on('click', '.js-index > li:eq(1) > a', function (a) {
        a.preventDefault();
        if (0 === $(this).index()) {
            $('body').removeClass('date').addClass('a_z');
            localStorage.setItem('indexSort', 'a_z');
            view.indexSort('title', false);
        } else {
            $('body').removeClass('a_z').addClass('date');
            localStorage.setItem('indexSort', 'date');
            view.indexSort('date', true);
        }
        (760 <= windowObj.w || $('body').hasClass('grid'))
            ? events.projectListAnimate()
            : events.scroll();
    });

    // Slide click — left half = previous, right half = next
    $('main').on('click', '#project-slides', function () {
        if ($('#project').hasClass('details')) {
            $('#project-info-details a').click();
        } else {
            mouseObj.x < windowObj.w / 2 ? events.goPrevious() : events.goNext();
        }
    });

    // Project details expand/collapse
    $('main').on('click', '#project-info-details > a', function (a) {
        a.preventDefault();
        var p = $('#project');
        if (p.hasClass('details')) {
            p.removeClass('details');
            $('#project-info-details p').slideUp({ duration: 600, easing: 'easeOutCubic' });
        } else {
            p.addClass('details');
            $('#project-info-details p').slideDown({ duration: 600, easing: 'easeOutCubic' });
        }
    });

    events.projectScroll();

    // Desktop-only: mouse tracking and keyboard nav
    if (!('ontouchstart' in document.documentElement)) {
        $(document).mousemove(function (a) {
            mouseObj.x = a.pageX;
            mouseObj.y = a.pageY;
        });

        $('main').on('mousemove', '#project-slides', function () {
            events.setProjectCursor();
        });

        // Keyboard arrow navigation + Escape to close
        $(document).keydown(function (a) {
            var key = a.keyCode || a.which;
            if (key === 37 && $('#project').length) {
                a.preventDefault();
                if (!$('body').hasClass('loading') && !$('#project-slides').hasClass('disableSnapping')) {
                    events.goPrevious();
                }
            } else if (key === 39 && $('#project').length) {
                a.preventDefault();
                if (!$('body').hasClass('loading') && !$('#project-slides').hasClass('disableSnapping')) {
                    events.goNext();
                }
            } else if (key === 27) {
                if ($('body').hasClass('project') || $('body').hasClass('info')) {
                    window.location.href = '/';
                }
            }
        });
    }
};

events.scroll = function () {
    scrollPos = $(window).scrollTop();
    if (760 > windowObj.w) {
        var active = -1;
        $('main section nav a').each(function (d) {
            var t = $(this).offset().top - windowObj.h / 2;
            var b = t + $(this).outerHeight(true);
            if (scrollPos > t && scrollPos < b) {
                active = $(this).index();
                if (!$(this).hasClass('img')) {
                    $(this).addClass('img');
                    if ($('body').hasClass('mono')) {
                        var col = $(this).data('color');
                        document.querySelector(':root').style.setProperty('--background', col);
                        col = utils.color(col, '#FFFFFF', '#000000');
                        document.querySelector(':root').style.setProperty('--color', col);
                    }
                }
            } else {
                $(this).removeClass('img');
            }
        });
        if ($('body').hasClass('mono') && active === -1) {
            var mono = document.querySelector(':root').style.getPropertyValue('--mono');
            document.querySelector(':root').style.setProperty('--background', mono);
            document.querySelector(':root').style.setProperty('--color', '#000');
        }
    }
};

events.projectListAnimate = function () {
    $('#projects nav a').each(function (a) {
        $(this).stop(true, false).css({ opacity: 0 })
            .delay(20 * a)
            .animate({ opacity: 1 }, {
                duration: 600,
                easing: customEasing,
                complete: function () { $(this).removeAttr('style'); }
            });
    });
};

events.projectInit = function () {
    // Find the next project after the current one (wraps around)
    var currentId = $('#project').data('id');
    var nextIndex = 0;
    for (var i = 0; i < projects.length; i++) {
        if (projects[i][0] === currentId) {
            nextIndex = i < projects.length - 1 ? i + 1 : 0;
            break;
        }
    }
    var nextAuthor = projects[nextIndex][2];
    var nextName   = projects[nextIndex][3];
    $('#project-info-counter span.next').html('<span>' + nextAuthor + '</span> <span>' + nextName + '</span>');
};

events.projectColor = function () {
    if ($('body').hasClass('light')) {
        if ($('#project').data('color')) {
            $('header a.color').css({ background: $('#project').data('color') });
        } else {
            $('header a.color').removeAttr('style');
        }
    } else {
        $('header a.color').removeAttr('style');
    }

    if ($('body').hasClass('mono')) {
        var col = '';
        if ($('#project-slides > div:eq(' + indexProject + ')').data('color')) {
            col = $('#project-slides > div:eq(' + indexProject + ')').data('color');
        } else if ($('#project').data('color')) {
            col = $('#project').data('color');
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
    if ($('body').hasClass('mono')) {
        var mono = document.querySelector(':root').style.getPropertyValue('--mono');
        document.querySelector(':root').style.setProperty('--background', mono);
        document.querySelector(':root').style.setProperty('--color', '#000');
    }
    $('header a.color').removeAttr('style');
};

events.goPrevious = function () {
    var total = $('#project-slides > div').length;
    indexProject = (indexProject - 1 + total) % total;
    $('#project-info-counter span.next').stop(true, false).animate({ width: 0 }, { duration: 300, easing: customEasing });
    $('#project').removeClass('next');
    events.setProject();
};

events.goNext = function () {
    var total = $('#project-slides > div').length;
    indexProject = (indexProject + 1) % total;
    $('#project-info-counter span.next').stop(true, false).animate({ width: 0 }, { duration: 300, easing: customEasing });
    $('#project').removeClass('next');
    events.setProject();
};

events.projectScroll = function () {
    $('#project-slides').scroll(function () {
        var el    = $(this);
        var left  = el.scrollLeft();
        var total = $('#project-slides > div').length;
        var width = el.get(0).scrollWidth;
        clearTimeout(projectScrollTimer);
        projectScrollTimer = setTimeout(function () {
            indexProject = Math.round(left / width * total);
            $('#project-info-counter span:eq(0)').text(indexProject + 1);
            events.projectColor();
            events.projectVideo();
        }, 100);
    });
};

events.projectVideo = function () {
    // Pause all videos first
    $('#project-slides video').each(function () {
        var v = $(this).get(0);
        if (!v.paused) v.pause();
    });
    // Play only the active slide's video
    $('#project-slides > div:eq(' + indexProject + ')').find('video').each(function () {
        var v = $(this).get(0);
        if (!(v.currentTime > 0 && !v.paused && !v.ended && v.readyState > 2)) v.play();
    });
};

events.setProject = function () {
    $('#project-info-counter span:eq(0)').text(indexProject + 1);
    events.projectColor();
    $('#project-slides').addClass('disableSnapping');
    $('#project-slides').stop(true, false).animate(
        { scrollLeft: indexProject * windowObj.w },
        {
            duration: 1200,
            easing: customEasing,
            complete: function () { $('#project-slides').removeClass('disableSnapping'); }
        }
    );
};

events.setProjectCursor = function () {
    if ($('#project').hasClass('details')) return;
    var $obj = $('#project-slides');
    if (mouseObj.x < windowObj.w / 2) {
        if (!$obj.hasClass('left'))  { $obj.addClass('left').removeClass('right'); }
    } else {
        if (!$obj.hasClass('right')) { $obj.addClass('right').removeClass('left'); }
    }
};

events.infoListAnimate = function () {
    $('main ul li').each(function (a) {
        var opacity = $(this).css('opacity');
        $(this).stop(true, false).css({ opacity: 0 })
            .delay(20 * a)
            .animate({ opacity: opacity }, {
                duration: 600,
                easing: customEasing,
                complete: function () { $(this).removeAttr('style'); }
            });
    });
};

// ────────────────────────────────────────────────────────────────
// UTILS — helper functions
// ────────────────────────────────────────────────────────────────

// Returns white or black depending on which has better contrast against bg
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
$(document).ready(function () {
    view.init();
    events.init();
});
