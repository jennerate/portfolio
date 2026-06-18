// The assets you want to cycle through
const metaAssets = [
    'assets/v3_transparent.gif',
    'assets/VerificationCenterLargeScreens.png',
];

let metaIndex = 0;
const metaProjectBlock = document.getElementById('verification');
const nextVerificationBtn = document.getElementById('meta-carousel-btn');

// Only run if the elements actually exist on the page
if (nextVerificationBtn && metaProjectBlock) {
    nextVerificationBtn.addEventListener('click', () => {
        metaIndex = (metaIndex + 1) % metaAssets.length;
        metaProjectBlock.style.backgroundImage = `url('${metaAssets[metaIndex]}')`;
    });
}


const designSystemAssets = [
    'assets/phonev1_transparent.gif', 
    'assets/TileV7.png'  
];

let systemIndex = 0;
const systemProjectBlock = document.getElementById('design-systems');
const nextDesignSystemsBtn = document.getElementById('design-system-carousel-btn');

if (nextDesignSystemsBtn && systemProjectBlock) {
    nextDesignSystemsBtn.addEventListener('click', () => {
        // Move to the next image
        systemIndex = (systemIndex + 1) % designSystemAssets.length;
        systemProjectBlock.style.backgroundImage = `url('${designSystemAssets[systemIndex]}')`;
        
        // Forcefully apply the correct class and strip the wrong one
        if (systemIndex === 0) {
            // We are on the GIF
            systemProjectBlock.classList.add('is-gif');
            systemProjectBlock.classList.remove('is-png');
        } else {
            // We are on the PNG
            systemProjectBlock.classList.add('is-png');
            systemProjectBlock.classList.remove('is-gif');
        }
    });
}


const illustrationAssets = [
    'assets/Frank.png',
    'assets/Donald.png',
];

let illoIndex = 0;
const illustrationBlock = document.getElementById('illustrations');

// BUG 1: Removed the accidental quote mark inside the ID string ('"illustration...')
const nextIllustrationBtn = document.getElementById('illustration-carousel-btn');

// BUG 2: Replaced the mangled variable name (systemPillustrationBlockrojectBlock)
if (nextIllustrationBtn && illustrationBlock) {
    nextIllustrationBtn.addEventListener('click', () => {
        illoIndex = (illoIndex + 1) % illustrationAssets.length;
        illustrationBlock.style.backgroundImage = `url('${illustrationAssets[illoIndex]}')`;
        illustrationBlock.classList.toggle('repeat-pattern', illoIndex === 1);
    });
}

(function initStickerGallery() {
    const gallery = document.getElementById('sticker-gallery');
    if (!gallery) return;

    const STICKERS = [
        { id: 's1', image: 'assets/frankmagnet.png', label: 'Frank magnet' },
        { id: 's3', image: 'assets/sf.png', label: 'San Francisco' },
        { id: 's2', image: 'assets/stamp.png', label: 'Stamp' },
        { id: 's4', image: 'assets/grandma.png', label: 'Grandma' },
    ];

    const LONG_PRESS_MS = 200;
    const MOVE_CANCEL_PX = 10;
    const TRASH_ICON = 'assets/trash.svg';
    const CLOSE_ICON = 'assets/close.svg';

    const galleryTrack = document.getElementById('sticker-gallery-track');
    const placedRoot = document.getElementById('sticker-placed-root');
    const headerBtn = document.querySelector('.site-header .dark-btn');
    const sheetBackdrop = document.getElementById('sticker-sheet-backdrop');
    const bottomSheet = document.getElementById('sticker-bottom-sheet');
    const sheetStickers = document.getElementById('sticker-sheet-stickers');
    const trashCan = document.getElementById('sticker-trash-can');

    let isMobile = false;
    let isGalleryHovered = false;
    let dragState = null;
    let sheetOpen = false;
    let pressState = null;
    let placedIdCounter = 0;

    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const dragListenerOpts = { passive: false };

    window.addEventListener('touchmove', (e) => {
        if (dragState) {
            e.preventDefault(); 
        }
    }, { passive: false });

    function detectMobile() {
        isMobile = mobileQuery.matches;
    }

    function syncGalleryLayout() {
        if (!headerBtn) return;
        const rect = headerBtn.getBoundingClientRect();
        document.documentElement.style.setProperty('--sticker-thumb-height', `${rect.height}px`);
        document.documentElement.style.setProperty(
            '--sticker-expanded-height',
            `${Math.max(rect.height * 1.75, 88)}px`
        );
    }

    function releasePointerCaptureSafe(el, pointerId) {
        try {
            if (el.hasPointerCapture(pointerId)) el.releasePointerCapture(pointerId);
        } catch (_) {
            // Pointer may already be released.
        }
    }

    function applyStickerLook(el, sticker) {
        el.style.background = '';
        el.textContent = '';

        if (sticker.image) {
            let img = el.querySelector('img');
            if (!img) {
                img = document.createElement('img');
                img.draggable = false;
                el.appendChild(img);
            }
            img.src = sticker.image;
            img.alt = sticker.label || 'sticker';
            img.style.display = '';
        } else {
            const img = el.querySelector('img');
            if (img) img.style.display = 'none';
            el.style.background = `radial-gradient(circle at 35% 35%, ${lighten(sticker.color, 30)}, ${sticker.color})`;
            el.textContent = sticker.emoji || '';
        }
    }

    function lighten(hex, pct) {
        const n = parseInt(hex.slice(1), 16);
        const r = Math.min(255, ((n >> 16) & 0xff) + pct);
        const g = Math.min(255, ((n >> 8) & 0xff) + pct);
        const b = Math.min(255, (n & 0xff) + pct);
        return `rgb(${r},${g},${b})`;
    }

    function createStickerEl(sticker, { forSheet = false } = {}) {
        const el = document.createElement('div');
        el.className = 'sticker';
        el.dataset.id = sticker.id;
        applyStickerLook(el, sticker);
        el.title = sticker.label || sticker.emoji || 'sticker';

        if (!isMobile && !forSheet) {
            el.addEventListener('pointerdown', (e) => startDesktopDrag(e, sticker, el));
        }

        if (forSheet) {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                dropStickerFromSheet(sticker, el);
            });
        }

        return el;
    }

    function renderGallery() {
        galleryTrack.innerHTML = '';
        STICKERS.forEach((sticker) => {
            galleryTrack.appendChild(createStickerEl(sticker));
        });
        updateGalleryState();
        syncGalleryLayout();
    }

    function renderSheetStickers() {
        sheetStickers.innerHTML = '';
        STICKERS.forEach((sticker) => {
            sheetStickers.appendChild(createStickerEl(sticker, { forSheet: true }));
        });
    }

    function updateGalleryState() {
        if (isMobile) return;
        const expanded = isGalleryHovered || dragState !== null;
        gallery.classList.toggle('is-expanded', expanded);
        gallery.classList.toggle('is-minified', !expanded);
    }

    function openSheet() {
        sheetOpen = true;
        sheetBackdrop.classList.add('is-open');
        bottomSheet.classList.add('is-open');
    }

    function closeSheet() {
        sheetOpen = false;
        sheetBackdrop.classList.remove('is-open');
        bottomSheet.classList.remove('is-open');
    }

    function showTrash() {
        trashCan.classList.add('is-visible');
        trashCan.setAttribute('aria-hidden', 'false');
    }

    function hideTrash() {
        trashCan.classList.remove('is-visible', 'is-over');
        trashCan.setAttribute('aria-hidden', 'true');
    }

    function isOverTrash(x, y) {
        const rect = trashCan.getBoundingClientRect();
        const pad = 24;
        return (
            x >= rect.left - pad &&
            x <= rect.right + pad &&
            y >= rect.top - pad &&
            y <= rect.bottom + pad
        );
    }

    function updateTrashHighlight(x, y) {
        const over = isOverTrash(x, y);
        trashCan.classList.toggle('is-over', over);

        if (isMobile || !dragState?.ghost) return;

        const img = dragState.ghost.querySelector('img');
        if (!img) return;

        if (over) {
            img.src = TRASH_ICON;
            img.alt = 'Delete sticker';
        } else {
            img.src = dragState.sticker.image;
            img.alt = dragState.sticker.label || 'sticker';
        }
    }

    function getDropCoords(e) {
        if (dragState?.ghost) {
            const clientX = parseFloat(dragState.ghost.style.left);
            const clientY = parseFloat(dragState.ghost.style.top);
            if (Number.isFinite(clientX) && Number.isFinite(clientY)) {
                return {
                    clientX,
                    clientY,
                    pageX: clientX + window.scrollX,
                    pageY: clientY + window.scrollY,
                };
            }
        }

        const clientX = dragState?.lastClientX ?? e.clientX ?? 0;
        const clientY = dragState?.lastClientY ?? e.clientY ?? 0;
        const pageX = e.pageX > 0 ? e.pageX : clientX + window.scrollX;
        const pageY = e.pageY > 0 ? e.pageY : clientY + window.scrollY;

        return { clientX, clientY, pageX, pageY };
    }

    function createGhost(sticker, x, y) {
        const ghost = document.createElement('div');
        ghost.className = 'drag-ghost';
        applyStickerLook(ghost, sticker);
        ghost.style.left = `${x}px`;
        ghost.style.top = `${y}px`;
        document.body.appendChild(ghost);
        return ghost;
    }

    function placeSticker(sticker, pageX, pageY, { animate = true } = {}) {
        const el = document.createElement('div');
        el.className = 'placed-sticker' + (animate ? ' is-dropping' : '');
        el.dataset.placedId = String(++placedIdCounter);
        applyStickerLook(el, sticker);
        el.style.left = `${pageX}px`;
        el.style.top = `${pageY}px`;
        el.title = sticker.label || sticker.emoji || 'sticker';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'placed-sticker-close';
        closeBtn.type = 'button';
        closeBtn.setAttribute('aria-label', 'Remove sticker');
        const closeImg = document.createElement('img');
        closeImg.src = CLOSE_ICON;
        closeImg.alt = '';
        closeBtn.appendChild(closeImg);
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            el.remove();
        });
        closeBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
        el.appendChild(closeBtn);

        if (isMobile) {
            el.addEventListener('pointerdown', (e) => {
                if (e.target.closest('.placed-sticker-close')) return;
                startLongPress(e, sticker, el, { isPlaced: true });
            });
        } else {
            el.addEventListener('pointerdown', (e) => {
                if (e.target.closest('.placed-sticker-close')) return;
                startPlacedDrag(e, sticker, el);
            });
        }

        el.addEventListener('animationend', () => el.classList.remove('is-dropping'), { once: true });
        placedRoot.appendChild(el);
        placedRoot.setAttribute('aria-hidden', 'false');
        return el;
    }

    function dropStickerFromSheet(sticker, sourceEl) {
        const sourceRect = sourceEl.getBoundingClientRect();
        const startX = sourceRect.left + sourceRect.width / 2;
        const startY = sourceRect.top + sourceRect.height / 2;
        const targetClientX = window.innerWidth / 2;
        const targetClientY = window.innerHeight * 0.45;
        const targetPageX = targetClientX + window.scrollX;
        const targetPageY = targetClientY + window.scrollY;

        closeSheet();

        const flyer = document.createElement('div');
        flyer.className = 'drop-flyer';
        applyStickerLook(flyer, sticker);
        flyer.style.left = `${startX}px`;
        flyer.style.top = `${startY}px`;
        document.body.appendChild(flyer);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                flyer.style.left = `${targetClientX}px`;
                flyer.style.top = `${targetClientY}px`;
            });
        });

        flyer.addEventListener('transitionend', () => {
            flyer.remove();
            placeSticker(sticker, targetPageX, targetPageY);
        }, { once: true });
    }

    function cleanupDragListeners() {
        window.removeEventListener('pointermove', onDragMove, dragListenerOpts);
        window.removeEventListener('pointerup', onDragEnd);
        window.removeEventListener('pointercancel', onDragEnd);
    }

    function cancelLongPress() {
        if (!pressState) return;
        clearTimeout(pressState.timer);
        pressState.sourceEl.classList.remove('is-press-pending');
        releasePointerCaptureSafe(pressState.sourceEl, pressState.pointerId);
        window.removeEventListener('pointermove', onPressMove);
        window.removeEventListener('pointerup', onPressEnd);
        window.removeEventListener('pointercancel', onPressEnd);
        pressState = null;
    }

    function startLongPress(e, sticker, sourceEl, { isPlaced = false } = {}) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        sourceEl.setPointerCapture(e.pointerId);
        sourceEl.classList.add('is-press-pending');

        pressState = {
            sticker,
            sourceEl,
            isPlaced,
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            timer: setTimeout(() => {
                const x = pressState.lastX ?? pressState.startX;
                const y = pressState.lastY ?? pressState.startY;
                const placed = pressState.isPlaced;
                const pointerId = pressState.pointerId;
                sourceEl.classList.remove('is-press-pending');
                pressState = null;
                releasePointerCaptureSafe(sourceEl, pointerId);
                if (navigator.vibrate) navigator.vibrate(12);
                beginMobileDrag(sticker, sourceEl, x, y, { isPlaced: placed });
            }, LONG_PRESS_MS),
        };

        window.addEventListener('pointermove', onPressMove);
        window.addEventListener('pointerup', onPressEnd);
        window.addEventListener('pointercancel', onPressEnd);
    }

    function onPressMove(e) {
        if (!pressState || e.pointerId !== pressState.pointerId) return;
        pressState.lastX = e.clientX;
        pressState.lastY = e.clientY;
        const dx = e.clientX - pressState.startX;
        const dy = e.clientY - pressState.startY;
        if (Math.hypot(dx, dy) > MOVE_CANCEL_PX) cancelLongPress();
    }

    function onPressEnd(e) {
        if (!pressState || e.pointerId !== pressState.pointerId) return;
        cancelLongPress();
    }

    function beginMobileDrag(sticker, sourceEl, x, y, { isPlaced = false } = {}) {
        window.removeEventListener('pointermove', onPressMove);
        window.removeEventListener('pointerup', onPressEnd);
        window.removeEventListener('pointercancel', onPressEnd);

        if (!isPlaced) closeSheet();
        sourceEl.classList.add(isPlaced ? 'is-dragging' : 'is-dragging-source');
        if (isPlaced) sourceEl.style.zIndex = '100';
        document.body.classList.add('is-mobile-dragging');

        const ghost = createGhost(sticker, x, y);
        showTrash();
        updateTrashHighlight(x, y);

        dragState = {
            sticker,
            ghost,
            sourceEl,
            isMobile: true,
            mode: isPlaced ? 'placed' : 'gallery',
            placedEl: isPlaced ? sourceEl : null,
        };

        window.addEventListener('pointermove', onDragMove, dragListenerOpts);
        window.addEventListener('pointerup', onDragEnd);
        window.addEventListener('pointercancel', onDragEnd);
    }

    function startPlacedDrag(e, sticker, placedEl) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        e.preventDefault();
        placedEl.setPointerCapture(e.pointerId);
        placedEl.classList.add('is-dragging');
        placedEl.style.zIndex = '100';
        document.body.classList.add('is-grabbing');

        const ghost = createGhost(sticker, e.clientX, e.clientY);

        dragState = {
            sticker,
            ghost,
            sourceEl: placedEl,
            isMobile: false,
            mode: 'placed',
            placedEl,
        };

        window.addEventListener('pointermove', onDragMove, dragListenerOpts);
        window.addEventListener('pointerup', onDragEnd);
        window.addEventListener('pointercancel', onDragEnd);
    }

    function startDesktopDrag(e, sticker, sourceEl) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        e.preventDefault();
        sourceEl.setPointerCapture(e.pointerId);
        sourceEl.classList.add('is-dragging-source');
        document.body.classList.add('is-grabbing');

        const ghost = createGhost(sticker, e.clientX, e.clientY);

        dragState = {
            sticker,
            ghost,
            sourceEl,
            isMobile: false,
            mode: 'gallery',
        };
        updateGalleryState();

        window.addEventListener('pointermove', onDragMove, dragListenerOpts);
        window.addEventListener('pointerup', onDragEnd);
        window.addEventListener('pointercancel', onDragEnd);
    }

    function onDragMove(e) {
        if (!dragState) return;
        if (dragState.isMobile) e.preventDefault();
        dragState.lastClientX = e.clientX;
        dragState.lastClientY = e.clientY;
        dragState.ghost.style.left = `${e.clientX}px`;
        dragState.ghost.style.top = `${e.clientY}px`;
        if (dragState.isMobile) updateTrashHighlight(e.clientX, e.clientY);
    }

    function onDragEnd(e) {
        if (!dragState) return;

        const { sticker, ghost, sourceEl, isMobile: fromMobile, mode, placedEl } = dragState;
        const { clientX, clientY, pageX, pageY } = getDropCoords(e);
        const droppedOnTrash = fromMobile && isOverTrash(clientX, clientY);

        ghost.remove();
        sourceEl.classList.remove('is-dragging-source', 'is-dragging', 'is-press-pending');
        releasePointerCaptureSafe(sourceEl, e.pointerId);

        if (fromMobile) {
            hideTrash();
            document.body.classList.remove('is-mobile-dragging');
        } else {
            document.body.classList.remove('is-grabbing');
            isGalleryHovered = gallery.matches(':hover');
            updateGalleryState();
        }

        if (mode === 'placed') {
            if (droppedOnTrash) {
                placedEl.remove();
            } else {
                placedEl.style.left = `${pageX}px`;
                placedEl.style.top = `${pageY}px`;
                placedEl.style.zIndex = '';
            }
        } else if (!droppedOnTrash) {
            placeSticker(sticker, pageX, pageY);
        }

        dragState = null;
        cleanupDragListeners();
    }

    gallery.addEventListener('pointerenter', () => {
        if (isMobile) return;
        isGalleryHovered = true;
        updateGalleryState();
    });

    gallery.addEventListener('pointerleave', () => {
        if (isMobile || dragState) return;
        isGalleryHovered = false;
        updateGalleryState();
    });

    gallery.addEventListener('click', () => {
        if (isMobile) openSheet();
    });

    sheetBackdrop.addEventListener('click', closeSheet);

    detectMobile();
    renderGallery();
    renderSheetStickers();
    syncGalleryLayout();

    window.addEventListener('resize', syncGalleryLayout);
    window.addEventListener('load', syncGalleryLayout);

    mobileQuery.addEventListener('change', () => {
        detectMobile();
        closeSheet();
        hideTrash();
        cancelLongPress();
        if (dragState) {
            dragState.ghost.remove();
            dragState.sourceEl.classList.remove('is-dragging-source');
            dragState = null;
            cleanupDragListeners();
            document.body.classList.remove('is-grabbing', 'is-mobile-dragging');
        }
        renderGallery();
        renderSheetStickers();
        syncGalleryLayout();
    });
})();
