const GALLERY_MAX_ITEMS = 24;

function createContentFieldsForGallery(index) {
    const blockNum = index + 1;
    const blockDiv = document.createElement('div');
    blockDiv.className = 'settings-group collapsed';

    blockDiv.innerHTML = `
        <div class="settings-group-header">Изображение №${blockNum}</div>
        <div class="settings-group-body">
            <div class="control-group">
                <label for="g-block-${index}-src">URL изображения:</label>
                <input type="text" id="g-block-${index}-src" value="https://gabriellesunrise.github.io/simple-blocks/img.jpg" placeholder="https://example.com/photo.jpg">
            </div>
            <div class="control-group">
                <label for="g-block-${index}-caption">Подпись (alt):</label>
                <input type="text" id="g-block-${index}-caption" value="Фото ${blockNum}" placeholder="Подпись под фото">
            </div>
        </div>
    `;
    return blockDiv;
}

function updateGalleryContentFields() {
    const count = parseInt(document.getElementById('g-count')?.value) || 1;
    const container = document.getElementById('g-content-fields-container');
    if (!container) return;

    const existingContent = {};
    for (let i = 0; i < GALLERY_MAX_ITEMS; i++) {
        const srcEl = document.getElementById(`g-block-${i}-src`);
        const capEl = document.getElementById(`g-block-${i}-caption`);
        if (srcEl && capEl) existingContent[i] = { src: srcEl.value, caption: capEl.value };
    }

    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        container.appendChild(createContentFieldsForGallery(i));
        if (existingContent[i]) {
            document.getElementById(`g-block-${i}-src`).value = existingContent[i].src;
            document.getElementById(`g-block-${i}-caption`).value = existingContent[i].caption;
        }
    }
}

function generateGallery() {
    const currentSection = document.getElementById('gallery-section');
    if (!currentSection) return;

    const settingsNames = [
        'count', 'columns', 'gap', 'aspect-ratio', 'radius', 'hover-zoom',
        'show-caption', 'caption-font-size', 'caption-color',
        'lightbox', 'lb-arrows', 'lb-arrows-mobile', 'lb-counter', 'lb-thumbs', 'lb-swipe',
        'custom-wrapper-class', 'custom-item-class',
        'mobile-columns', 'mobile-caption-font-size',
        'heading-show', 'heading-text', 'heading-level', 'heading-align', 'heading-align-mobile', 'heading-margin', 'heading-margin-mobile', 'heading-bold'
    ];
    const settings = getSettings('g', settingsNames);

    const count = Math.min(Math.max(parseInt(settings.count) || 1, 1), GALLERY_MAX_ITEMS);
    const columns = Math.min(Math.max(parseInt(settings.columns) || 3, 1), 5);
    const lightbox = !!settings.lightbox;
    const showCaption = !!settings['show-caption'];
    const lbArrows = !!settings['lb-arrows'];
    const lbCounter = !!settings['lb-counter'];
    const lbThumbs = !!settings['lb-thumbs'];
    const lbSwipe = !!settings['lb-swipe'];
    const lbArrowsMobileCss = lightbox && settings['lb-arrows-mobile'] ? `
    .custom-gallery-lb-btn {
        display: none;
    }` : '';
    const defaultSrc = 'https://gabriellesunrise.github.io/simple-blocks/img.jpg';

    const wrapperClass = appendCustomClass('custom-gallery', settings['custom-wrapper-class']);
    const itemClass = appendCustomClass('custom-gallery-item', settings['custom-item-class']);

    const itemsContent = [];
    for (let i = 0; i < count; i++) {
        const srcEl = document.getElementById(`g-block-${i}-src`);
        const capEl = document.getElementById(`g-block-${i}-caption`);
        itemsContent.push({
            src: (srcEl?.value || '').trim() || defaultSrc,
            caption: (capEl?.value || '').trim()
        });
    }

    const heading = buildBlockHeading(settings, 'g-section-heading');

    let html = heading.html + `<div class="${wrapperClass}">\n`;
    for (let i = 0; i < count; i++) {
        const item = itemsContent[i];
        html += `    <figure class="${itemClass}" data-caption="${item.caption}">\n`;
        html += `        <img src="${item.src}" alt="${item.caption || `Фото ${i + 1}`}">\n`;
        if (showCaption) html += `        <figcaption class="custom-gallery-caption">${item.caption}</figcaption>\n`;
        html += `    </figure>\n`;
    }
    if (lightbox) {
        html += `    <div class="custom-gallery-lightbox" hidden>\n`;
        html += `        <div class="custom-gallery-lb-view">\n`;
        html += `            <div class="custom-gallery-lb-stage">\n`;
        html += `                <img class="custom-gallery-lb-img" src="" alt="">\n`;
        if (lbArrows) {
            html += `                <button type="button" class="custom-gallery-lb-btn custom-gallery-lb-btn--prev" aria-label="Предыдущее фото"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 5 L8 12 L15 19" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>\n`;
            html += `                <button type="button" class="custom-gallery-lb-btn custom-gallery-lb-btn--next" aria-label="Следующее фото"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 5 L16 12 L9 19" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>\n`;
        }
        html += `            </div>\n`;
        if (showCaption) html += `            <div class="custom-gallery-lb-caption"></div>\n`;
        if (lbCounter) html += `            <div class="custom-gallery-lb-counter"></div>\n`;
        html += `        </div>\n`;
        html += `        <button type="button" class="custom-gallery-lb-close" aria-label="Закрыть"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6 L18 18 M18 6 L6 18" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/></svg></button>\n`;
        if (lbThumbs) {
            html += `        <div class="custom-gallery-lb-thumbs">\n`;
            for (let i = 0; i < count; i++) {
                html += `            <button type="button" class="custom-gallery-lb-thumb" data-index="${i}"><img src="${itemsContent[i].src}" alt=""></button>\n`;
            }
            html += `        </div>\n`;
        }
        html += `    </div>\n`;
    }
    html += `</div>\n`;

    const hoverZoomCss = settings['hover-zoom'] ? `\n.custom-gallery-item:hover img {\n    transform: scale(1.05);\n}` : '';

    let css = `.custom-gallery {
    display: grid;
    grid-template-columns: repeat(${columns}, 1fr);
    gap: ${settings.gap}px;
    padding: 20px 0;
}
.custom-gallery-item {
    margin: 0;
    position: relative;
    border-radius: ${settings.radius}px;
    overflow: hidden;
    cursor: ${lightbox ? 'zoom-in' : 'default'};
    background: #f2f2f2;
}
.custom-gallery-item img {
    width: 100%;
    height: auto;
    display: block;
    aspect-ratio: ${settings['aspect-ratio']};
    object-fit: cover;
    transition: transform 0.3s ease;
}${hoverZoomCss}
.custom-gallery-caption {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    padding: 8px 10px;
    font-size: ${settings['caption-font-size']}px;
    color: ${settings['caption-color']};
    background: rgba(0, 0, 0, 0.55);
}`;

    if (lightbox) {
        css += `
.custom-gallery-lightbox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.92);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}
.custom-gallery-lightbox[hidden] {
    display: none;
}
.custom-gallery-lb-view {
    max-width: 90vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}
.custom-gallery-lb-stage {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}
.custom-gallery-lb-img {
    max-width: 86vw;
    max-height: 74vh;
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    display: block;
}
.custom-gallery-lb-caption {
    margin-top: 10px;
    font-size: ${settings['caption-font-size']}px;
    color: #ffffff;
}
.custom-gallery-lb-counter {
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
    background: rgba(0, 0, 0, 0.4);
    border-radius: 12px;
    padding: 2px 10px;
}
.custom-gallery-lb-btn {
    position: absolute;
    top: 50%;
    margin-top: -24px;
    box-sizing: border-box;
    width: 48px;
    height: 48px;
    padding: 0;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transition: background 0.2s;
}
.custom-gallery-lb-btn svg {
    display: block;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}
.custom-gallery-lb-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}
.custom-gallery-lb-btn--prev {
    left: -56px;
}
.custom-gallery-lb-btn--next {
    right: -56px;
}
.custom-gallery-lb-close {
    position: absolute;
    top: 16px;
    right: 16px;
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transition: background 0.2s;
}
.custom-gallery-lb-close svg {
    display: block;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}
.custom-gallery-lb-close:hover {
    background: rgba(255, 255, 255, 0.3);
}
.custom-gallery-lb-thumbs {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    max-width: 90%;
    overflow-x: auto;
    padding: 6px;
}
.custom-gallery-lb-thumb {
    flex-shrink: 0;
    width: 60px;
    height: 44px;
    padding: 0;
    border: 2px solid transparent;
    border-radius: 4px;
    background: #ffffff;
    cursor: pointer;
}
.custom-gallery-lb-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 2px;
}
.custom-gallery-lb-thumb.is-active {
    border-color: #7e5daf;
}
.custom-gallery-lock {
    overflow: hidden;
}`;
    }

    css += `
@media (max-width: 768px) {
    .custom-gallery {
        grid-template-columns: repeat(${settings['mobile-columns'] || 2}, 1fr);
    }
    .custom-gallery-caption {
        font-size: ${settings['mobile-caption-font-size']}px;
    }
    .custom-gallery-lb-btn {
        width: 40px;
        height: 40px;
        margin-top: -20px;
    }
    .custom-gallery-lb-btn svg {
        width: 16px;
        height: 16px;
    }
    .custom-gallery-lb-btn--prev {
        left: 8px;
    }
    .custom-gallery-lb-btn--next {
        right: 8px;
    }
    .custom-gallery-lb-view {
        width: 100%;
        max-width: 100vw;
    }
    .custom-gallery-lb-stage {
        width: 100%;
    }
    .custom-gallery-lb-img {
        width: 100%;
        max-width: 100%;
        max-height: 74vh;
    }${lbArrowsMobileCss}
}`;

    let js = '';
    if (lightbox) {
        js += `if (!window.__customGalleryInit) {
    window.__customGalleryInit = true;
    document.addEventListener('click', function (e) {
        var item = e.target.closest('.custom-gallery-item');
        if (item) {
            var g = item.closest('.custom-gallery');
            var lb = g.querySelector('.custom-gallery-lightbox');
            if (!lb) return;
            var items = g.querySelectorAll('.custom-gallery-item');
            g._glIndex = Array.prototype.indexOf.call(items, item);
            lb.hidden = false;
            document.body.classList.add('custom-gallery-lock');
            updateGalleryView(g);
            return;
        }
        var lbEl = e.target.closest('.custom-gallery-lightbox');
        if (!lbEl) return;
        var gEl = lbEl.closest('.custom-gallery');
        if (e.target.closest('.custom-gallery-lb-close')) {
            closeGallery(gEl);
            return;
        }
        if (e.target === lbEl) {
            closeGallery(gEl);
            return;
        }
        if (e.target.closest('.custom-gallery-lb-btn--prev')) {
            moveGallery(gEl, -1);
            return;
        }
        if (e.target.closest('.custom-gallery-lb-btn--next')) {
            moveGallery(gEl, 1);
            return;
        }
        var thumb = e.target.closest('.custom-gallery-lb-thumb');
        if (thumb) {
            gEl._glIndex = parseInt(thumb.getAttribute('data-index'), 10);
            updateGalleryView(gEl);
        }
    });
    document.addEventListener('keydown', function (e) {
        var lb = document.querySelector('.custom-gallery-lightbox:not([hidden])');
        if (!lb) return;
        var g = lb.closest('.custom-gallery');
        if (e.key === 'Escape') {
            closeGallery(g);
        } else if (e.key === 'ArrowLeft') {
            moveGallery(g, -1);
        } else if (e.key === 'ArrowRight') {
            moveGallery(g, 1);
        }
    });
}
function moveGallery(g, step) {
    var items = g.querySelectorAll('.custom-gallery-item');
    var n = items.length;
    if (!n) return;
    g._glIndex = (g._glIndex + step + n) % n;
    updateGalleryView(g);
}
function closeGallery(g) {
    if (!g) return;
    var lb = g.querySelector('.custom-gallery-lightbox');
    lb.hidden = true;
    document.body.classList.remove('custom-gallery-lock');
}
function updateGalleryView(g) {
    var items = g.querySelectorAll('.custom-gallery-item');
    var lb = g.querySelector('.custom-gallery-lightbox');
    var img = lb.querySelector('.custom-gallery-lb-img');
    var captionEl = lb.querySelector('.custom-gallery-lb-caption');
    var counterEl = lb.querySelector('.custom-gallery-lb-counter');
    var thumbs = lb.querySelectorAll('.custom-gallery-lb-thumb');
    var item = items[g._glIndex];
    var src = item.querySelector('img').src;
    var caption = item.getAttribute('data-caption') || '';
    img.src = src;
    img.alt = caption || ((g._glIndex + 1) + '');
    if (captionEl) captionEl.textContent = caption;
    if (counterEl) counterEl.textContent = (g._glIndex + 1) + ' / ' + items.length;
    thumbLoop(thumbs, g._glIndex);
    if (items.length > 1) {
        var nextSrc = items[(g._glIndex + 1) % items.length].querySelector('img').src;
        var prevSrc = items[(g._glIndex - 1 + items.length) % items.length].querySelector('img').src;
        new Image().src = nextSrc;
        new Image().src = prevSrc;
    }
}
function thumbLoop(thumbs, active) {
    for (var i = 0; i < thumbs.length; i++) {
        var idx = parseInt(thumbs[i].getAttribute('data-index'), 10);
        if (idx === active) {
            thumbs[i].classList.add('is-active');
        } else {
            thumbs[i].classList.remove('is-active');
        }
    }
}`;
        if (lbSwipe) {
            js += `
if (!window.__customGallerySwipe) {
    window.__customGallerySwipe = true;
    var touchX = null;
    document.addEventListener('touchstart', function (e) {
        if (!e.target.closest('.custom-gallery-lightbox')) { touchX = null; return; }
        touchX = e.touches[0].clientX;
    });
    document.addEventListener('touchend', function (e) {
        if (touchX === null) return;
        var dx = e.changedTouches[0].clientX - touchX;
        touchX = null;
        var lb = document.querySelector('.custom-gallery-lightbox:not([hidden])');
        if (!lb) return;
        if (Math.abs(dx) > 50) {
            moveGallery(lb.closest('.custom-gallery'), dx < 0 ? 1 : -1);
        }
    });
}`;
        }
    }

    const cssEl = document.getElementById('g-css');
    const htmlEl = document.getElementById('g-html');
    const jsEl = document.getElementById('g-js');
    if (!cssEl || !htmlEl || !jsEl) return;

    css = heading.css + css;
    cssEl.value = css;
    htmlEl.value = html;
    jsEl.value = js;

    const jsOutputWrapper = document.getElementById('g-js')?.closest('.outputs');
    if (jsOutputWrapper) jsOutputWrapper.classList.toggle('hidden', !lightbox);

    updateLiveDemoPreview(currentSection, css, html, js);
}

document.addEventListener('DOMContentLoaded', () => {
    updateGalleryContentFields();

    const countInput = document.getElementById('g-count');
    if (countInput) {
        countInput.addEventListener('change', () => { updateGalleryContentFields(); generateGallery(); });
        countInput.addEventListener('blur', () => { updateGalleryContentFields(); generateGallery(); });
    }

    setupLivePreview('gallery-section', () => generateGallery());

    setTimeout(() => {
        generateGallery();
    }, 100);
});