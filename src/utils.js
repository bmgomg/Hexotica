import { DASH } from './const';

export const windowSize = () => {
    const d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        w = e.clientWidth || g.clientWidth,
        h = e.clientHeight || g.clientHeight;

    return { w, h };
};

export const clientRect = obid => {
    const ob = document.getElementById(obid);
    const r = ob?.getBoundingClientRect();

    return r;
};

export const xy = obid => {
    const ob = document.getElementById(obid);
    const r = ob?.getBoundingClientRect();
    return { x: r?.left, y: r?.top };
};

export const rectCenter = obid => {
    const ob = document.getElementById(obid);
    const r = ob?.getBoundingClientRect();

    return r ? {
        x: r.left + r.width / 2,
        y: r.top + r.height / 2
    } : null;
};

export const underMouse = (event, selectors) => {
    for (const selector of selectors) {
        const ob = document.querySelector(selector);
        const r = ob?.getBoundingClientRect();

        if (!r) {
            continue;
        }

        const x = event.clientX;
        const y = event.clientY;

        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
            return true;
        }
    }

    return false;
};

export const focusOnApp = () => {
    document.querySelector('.app')?.focus();
};

export const isTouchable = () => navigator.maxTouchPoints > 0;

export const tapOrClick = (lower = false) => {
    const verb = isTouchable() ? 'Tap' : 'Click';
    return lower ? verb.toLowerCase() : verb;
};

export const isAppleDevice = () => /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export const scrollClass = () => `root-scroll ${isTouchable() ? 'root-scroll-mobile' : ''}`;

export const post = (fn, ms) => setTimeout(fn, ms);

export const _range = (start, end) => Array.from({ length: end + 1 - start }, (_, i) => start + i);

export const inView = ob => {
    if (!ob) {
        return;
    }

    const e = document.getElementById(ob.id);

    if (!e) {
        return;
    }

    const r1 = { x1: e.offsetLeft, y1: e.offsetTop };
    r1.x2 = r1.x1 + e.offsetWidth;
    r1.y2 = r1.y1 + e.offsetHeight;

    const b = document.getElementById('board');
    const r2 = { x1: b.offsetLeft + b.scrollLeft, y1: b.offsetTop + b.scrollTop };
    r2.x2 = r2.x1 + b.offsetWidth;
    r2.y2 = r2.y1 + b.offsetHeight;

    return r1.x1 >= r2.x1 && r1.x2 <= r2.x2 && r1.y1 >= r2.y1 && r1.y2 <= r2.y2;
};

export const scrollTo = ob => {
    if (!ob) {
        return;
    }

    if (inView(ob)) {
        return false;
    }

    const e = document.getElementById(ob.id);

    if (!e) {
        return false;
    }

    e.scrollIntoView({ behavior: 'smooth' });

    return true;
};

export const isScrollable = obid => {
    const ob = document.getElementById(obid);
    const horz = ob.scrollWidth > ob.clientWidth;
    const vert = ob.scrollHeight > ob.clientHeight;

    return { horz, vert };
};

export const scrollIntoView = (ob) => {
    if (!ob) {
        return;
    }

    const e = document.getElementById(ob.id);

    if (!e) {
        return;
    }

    const r1 = { x1: e.offsetLeft, y1: e.offsetTop };
    r1.x2 = r1.x1 + e.offsetWidth;
    r1.y2 = r1.y1 + e.offsetHeight;

    const b = document.getElementById('board');
    const r2 = { x1: b.offsetLeft + b.scrollLeft, y1: b.offsetTop + b.scrollTop };
    r2.x2 = r2.x1 + b.offsetWidth;
    r2.y2 = r2.y1 + b.offsetHeight;

    let top = 0;
    let left = 0;

    if (r1.x1 > r2.x1) {
        top = r1.x1 - r2.x1;
    } else if (r1.x2 < r2.x2) {
        top = r1.x2 - r2.x2;
    }

    if (r1.y1 > r2.y1) {
        left = r1.y1 - r2.y1;
    } else if (r1.y2 < r2.y2) {
        left = r1.y2 - r2.y2;
    }

    b.scrollBy({ top, left, behavior: 'smooth' });
};

export const dashes = (length = 10) => console.log(DASH.repeat(length));
