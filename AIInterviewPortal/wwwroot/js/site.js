// site.js — Professional Dark Glassmorphism

document.addEventListener('DOMContentLoaded', () => {

    // ── Mobile Sidebar ──────────────────────────────────────
    const hamburger = document.getElementById('hamburger-btn');
    const sidebar   = document.querySelector('.sidebar');
    const overlay   = document.getElementById('sidebar-overlay');

    if (hamburger && sidebar) {
        hamburger.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay?.classList.toggle('active');
        });
        overlay?.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }

    // ── Active sidebar link + breadcrumb ─────────────────────
    const path = window.location.pathname.toLowerCase();
    const breadcrumb = document.getElementById('page-breadcrumb');

    const navMap = [
        { match: '/dashboard',  label: 'Dashboard' },
        { match: '/interview',  label: 'Practice' },
        { match: '/progress/leaderboard', label: 'Leaderboard' },
        { match: '/progress',   label: 'Progress' },
        { match: '/account',    label: 'Account' },
    ];

    document.querySelectorAll('.sidebar-link').forEach(link => {
        const href = (link.getAttribute('href') ?? '').toLowerCase().split('#')[0];
        if (href && (path === href || (href.length > 1 && path.startsWith(href)))) {
            link.classList.add('active');
        }
    });

    if (breadcrumb) {
        for (const { match, label } of navMap) {
            if (path.startsWith(match)) { breadcrumb.textContent = label; break; }
        }
    }

    // ── Scroll-reveal ────────────────────────────────────────
    const observer = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                e.target.style.transitionDelay = `${i * 0.05}s`;
                e.target.classList.add('in-view');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.07 });

    document.querySelectorAll(
        '.stat-card, .glass-card, .feature-card, .tech-card, .step-card, .chart-card'
    ).forEach(el => {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(12px)';
        el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = `.in-view { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);

    // ── Animated counters ─────────────────────────────────────
    document.querySelectorAll('[data-count]').forEach(el => {
        const raw       = el.getAttribute('data-count');
        const target    = parseFloat(raw);
        const isPercent = raw.includes('%');
        const duration  = 1000;

        const cObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const start = performance.now();
                    function step(now) {
                        const t = Math.min((now - start) / duration, 1);
                        const ease = 1 - Math.pow(1 - t, 3);
                        el.textContent = isPercent ? `${Math.floor(target * ease)}%` : Math.floor(target * ease);
                        if (t < 1) requestAnimationFrame(step);
                    }
                    requestAnimationFrame(step);
                    cObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        cObserver.observe(el);
    });

    // ── Ripple on buttons ─────────────────────────────────────
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const r = document.createElement('span');
            r.classList.add('btn-ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
            if (getComputedStyle(this).position === 'static') this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(r);
            setTimeout(() => r.remove(), 500);
        });
    });

    // ── Text Reveal (Blur Animation) ─────────────────────────
    const textRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                textRevealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    function splitTextElement(element, mode, staggerDelay, duration, state = { count: 0 }) {
        const childNodes = Array.from(element.childNodes);
        childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.nodeValue;
                if (!text.trim() && text.includes('\n')) return;

                const parent = node.parentNode;
                const fragmentContainer = document.createDocumentFragment();
                let parts = [];

                if (mode === 'characters') {
                    parts = text.split('');
                } else {
                    parts = text.split(/(\s+)/);
                }

                parts.forEach(part => {
                    if (part === '') return;
                    if (/^\s+$/.test(part)) {
                        fragmentContainer.appendChild(document.createTextNode(part));
                        return;
                    }

                    const span = document.createElement('span');
                    span.classList.add('reveal-fragment');
                    span.textContent = part;
                    span.style.transitionDuration = `${duration}s`;
                    span.style.transitionDelay = `${state.count * staggerDelay}s`;

                    fragmentContainer.appendChild(span);
                    state.count++;
                });

                parent.replaceChild(fragmentContainer, node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName !== 'BR') {
                    splitTextElement(node, mode, staggerDelay, duration, state);
                }
            }
        });
    }

    document.querySelectorAll('[data-text-reveal]').forEach(el => {
        const mode = el.getAttribute('data-text-reveal') || 'words';
        const staggerDelay = parseFloat(el.getAttribute('data-stagger-delay') || '0.04');
        const duration = parseFloat(el.getAttribute('data-duration') || '0.5');

        splitTextElement(el, mode, staggerDelay, duration);
        textRevealObserver.observe(el);
    });

    // ── Text Shimmer Phrase Cycler ───────────────────────────
    document.querySelectorAll('.shimmer-cycle').forEach(el => {
        const phrases = JSON.parse(el.getAttribute('data-phrases') || '[]');
        if (phrases.length === 0) return;

        const container = el.closest('.shimmer-container');
        let index = 0;

        setInterval(() => {
            if (container) {
                container.classList.add('fade-out');
                setTimeout(() => {
                    index = (index + 1) % phrases.length;
                    el.textContent = phrases[index];
                    container.classList.remove('fade-out');
                    container.classList.add('fade-in');
                    container.offsetHeight; // trigger reflow
                    container.classList.remove('fade-in');
                }, 280);
            } else {
                index = (index + 1) % phrases.length;
                el.textContent = phrases[index];
            }
        }, 3000);
    });

});
