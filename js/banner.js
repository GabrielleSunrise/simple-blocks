const BANNER_MAX = 12;

function createContentFieldsForBanner(index) {
    const blockNum = index + 1;
    const blockDiv = document.createElement('div');
    blockDiv.className = 'settings-group collapsed';

    blockDiv.innerHTML = `
        <div class="settings-group-header">Контент баннера №${blockNum}</div>
        <div class="settings-group-body">
            <div class="control-group">
                <label for="b-block-${index}-link-url">Адрес ссылки (для всего баннера или кнопки):</label>
                <input type="text" id="b-block-${index}-link-url" value="#" placeholder="Например, /page/ или https://example.com">
            </div>
            <div class="control-group">
                <label for="b-block-${index}-img-src">Ссылка на фоновое изображение (десктоп):</label>
                <input type="text" id="b-block-${index}-img-src" value="https://gabriellesunrise.github.io/simple-blocks/bg-img.jpg" placeholder="URL изображения">
            </div>
            <div class="control-group">
                <label for="b-block-${index}-img-src-mobile">Изображение для мобильных (необязательно):</label>
                <input type="text" id="b-block-${index}-img-src-mobile" value="" placeholder="https://example.com/mobile-photo.jpg">
            </div>
            <div class="control-group">
                <label for="b-block-${index}-title-text">Заголовок баннера:</label>
                <input type="text" id="b-block-${index}-title-text" value="Заголовок баннера ${blockNum}" placeholder="Заголовок баннера">
            </div>
            <div class="control-group">
                <label for="b-block-${index}-main-text">Дополнительный текст:</label>
                <textarea id="b-block-${index}-main-text" rows="2" placeholder="Короткое описание, слоган.">Дополнительное описание баннера ${blockNum}. Небольшой текст для привлечения внимания.</textarea>
            </div>
            <div class="control-group">
                <label for="b-block-${index}-btn-text">Текст кнопки:</label>
                <input type="text" id="b-block-${index}-btn-text" value="Подробнее" placeholder="Текст кнопки">
            </div>
            <div class="control-group">
                <label><input type="checkbox" id="b-block-${index}-overlay" checked> Оверлей (затемнение поверх фона)</label>
            </div>
            <div class="control-group full-width">
                <label for="b-block-${index}-overlay-gradient">CSS-строка градиента (оверлей):</label>
                <input type="text" id="b-block-${index}-overlay-gradient" value="linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)" class="full-width-input">
            </div>
            <div class="control-group">
                <label>Выравнивание по горизонтали:</label>
                <select id="b-block-${index}-align">
                    <option value="left" selected>Влево</option>
                    <option value="center">По центру</option>
                    <option value="right">Вправо</option>
                </select>
            </div>
            <div class="control-group">
                <label>Выравнивание по вертикали:</label>
                <select id="b-block-${index}-valign">
                    <option value="flex-start" selected>Сверху</option>
                    <option value="center">По центру</option>
                    <option value="flex-end">Снизу</option>
                </select>
            </div>
            <div class="control-group">
                <label>Цвет заголовка:</label>
                <input type="color" id="b-block-${index}-title-color" value="#ffffff">
            </div>
            <div class="control-group">
                <label>Цвет подзаголовка:</label>
                <input type="color" id="b-block-${index}-subtitle-color" value="#f0f0f0">
            </div>
            <div class="control-group">
                <label>Цвет текста кнопки:</label>
                <input type="color" id="b-block-${index}-btn-text-color" value="#000000">
            </div>
            <div class="control-group">
                <label>Фон кнопки:</label>
                <input type="color" id="b-block-${index}-btn-color" value="#ffffff">
            </div>
        </div>
    `;
    return blockDiv;
}

function updateBannerContentFields() {
    const count = parseInt(document.getElementById('b-count').value);
    const container = document.getElementById('b-content-fields-container');
    if (!container) return;

    const fieldIds = [
        'link-url', 'img-src', 'img-src-mobile', 'title-text', 'main-text', 'btn-text',
        'overlay', 'overlay-gradient', 'align', 'valign',
        'title-color', 'subtitle-color', 'btn-text-color', 'btn-color'
    ];

    const existingContent = {};
    for (let i = 0; i < BANNER_MAX; i++) {
        const p = {};
        let complete = true;
        for (const f of fieldIds) {
            const el = document.getElementById(`b-block-${i}-${f}`);
            if (!el) { complete = false; break; }
            p[f] = f === 'overlay' ? el.checked : el.value;
        }
        if (complete) existingContent[i] = p;
    }

    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const blockFields = createContentFieldsForBanner(i);
        container.appendChild(blockFields);

        if (existingContent[i]) {
            for (const f of fieldIds) {
                const el = document.getElementById(`b-block-${i}-${f}`);
                if (!el) continue;
                if (f === 'overlay') el.checked = !!existingContent[i][f];
                else el.value = existingContent[i][f];
            }
        }
    }
}

function generateBanner() {
    const currentSection = document.getElementById('banner-section');
    if (!currentSection) return;

    const bannerSettingNames = [
        'count', 'mode',
        'show-arrows', 'show-arrows-mobile', 'show-dots', 'show-dots-mobile',
        'autoplay', 'autoplay-delay', 'aspect-ratio', 'aspect-ratio-mobile', 'breakpoint',
        'title-font-size', 'subtitle-font-size',
        'btn-radius', 'btn-font-size',
        'mobile-title-font-size', 'mobile-subtitle-font-size',
        'custom-wrapper-class'
    ];
    const settings = getSettings('b', bannerSettingNames);

    const count = Math.min(Math.max(parseInt(settings.count) || 1, 1), BANNER_MAX);
    const mode = settings.mode === 'full' ? 'full' : 'button';

    const showArrows = !!settings['show-arrows'];
    const showArrowsMobile = !!settings['show-arrows-mobile'];
    const showDots = !!settings['show-dots'];
    const showDotsMobile = !!settings['show-dots-mobile'];
    const autoplay = !!settings.autoplay;
    const autoplayDelay = Math.max(parseInt(settings['autoplay-delay']) || 5000, 1000);
    const aspectRatio = settings['aspect-ratio'] || '16/9';
    const aspectRatioMobile = settings['aspect-ratio-mobile'] || '16/9';
    const breakpoint = Math.max(parseInt(settings.breakpoint) || 768, 320);

    const titleFontSize = Math.max(parseInt(settings['title-font-size']) || 42, 10);
    const subtitleFontSize = Math.max(parseInt(settings['subtitle-font-size']) || 18, 8);
    const mobileTitleFontSize = Math.max(parseInt(settings['mobile-title-font-size']) || 28, 10);
    const mobileSubtitleFontSize = Math.max(parseInt(settings['mobile-subtitle-font-size']) || 16, 8);

    const btnRadius = Math.max(parseInt(settings['btn-radius']) || 4, 0);
    const btnFontSize = Math.max(parseInt(settings['btn-font-size']) || 16, 7);

    const wrapperClass = appendCustomClass('custom-banner-slider', settings['custom-wrapper-class']);

    const arrowDesktopDisplay = showArrows ? 'flex' : 'none';
    const arrowMobileDisplay = showArrowsMobile ? 'flex' : 'none';
    const dotsDesktopDisplay = showDots ? 'flex' : 'none';
    const dotsMobileDisplay = showDotsMobile ? 'flex' : 'none';

    const defaultGradient = 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)';
    const alignMap = { left: 'flex-start', center: 'center', right: 'flex-end' };
    const valignList = ['flex-start', 'center', 'flex-end'];

    const blocksContent = [];
    for (let i = 0; i < count; i++) {
        const g = (id) => document.getElementById(id);
        const linkUrlEl = g(`b-block-${i}-link-url`);
        const imgSrcEl = g(`b-block-${i}-img-src`);
        const imgSrcMobileEl = g(`b-block-${i}-img-src-mobile`);
        const titleEl = g(`b-block-${i}-title-text`);
        const textEl = g(`b-block-${i}-main-text`);
        const btnTextEl = g(`b-block-${i}-btn-text`);
        const overlayEl = g(`b-block-${i}-overlay`);
        const gradientEl = g(`b-block-${i}-overlay-gradient`);
        const alignEl = g(`b-block-${i}-align`);
        const valignEl = g(`b-block-${i}-valign`);
        const titleColorEl = g(`b-block-${i}-title-color`);
        const subtitleColorEl = g(`b-block-${i}-subtitle-color`);
        const btnTextColorEl = g(`b-block-${i}-btn-text-color`);
        const btnColorEl = g(`b-block-${i}-btn-color`);

        const align = ['left', 'center', 'right'].indexOf(alignEl?.value) !== -1 ? alignEl.value : 'left';
        const valign = valignList.indexOf(valignEl?.value) !== -1 ? valignEl.value : 'flex-start';

        blocksContent.push({
            linkUrl: (linkUrlEl?.value || '').trim() || '#',
            imgSrc: imgSrcEl?.value || 'https://gabriellesunrise.github.io/simple-blocks/bg-img.jpg',
            imgSrcMobile: (imgSrcMobileEl?.value || '').trim(),
            titleText: (titleEl?.value || '').trim(),
            mainText: (textEl?.value || '').trim(),
            btnText: (btnTextEl?.value || '').trim() || 'Подробнее',
            overlay: !!(overlayEl && overlayEl.checked),
            overlayGradient: gradientEl?.value || defaultGradient,
            align: align,
            alignFlex: alignMap[align],
            valign: valign,
            titleColor: titleColorEl?.value || '#ffffff',
            subtitleColor: subtitleColorEl?.value || '#f0f0f0',
            btnTextColor: btnTextColorEl?.value || '#000000',
            btnColor: btnColorEl?.value || '#ffffff'
        });
    }

    let css = `.custom-banner-slider {
    position: relative;
    overflow: hidden;
    width: 100%;
}
.custom-banner-track {
    display: flex;
    will-change: transform;
    transition: transform 0.6s ease;
    touch-action: pan-y;
}
.custom-banner-slide {
    position: relative;
    flex: 0 0 100%;
    width: 100%;
    aspect-ratio: ${aspectRatio};
    box-sizing: border-box;
}
.custom-banner-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
}
.custom-banner-slide--has-mobile .custom-banner-bg--mobile {
    display: none;
}
.custom-banner-overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
}
.custom-banner-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 6% 8%;
    box-sizing: border-box;
}
.custom-banner-title {
    margin: 0 0 14px 0;
    font-size: ${titleFontSize}px;
    line-height: 1.15;
    max-width: 720px;
}
.custom-banner-subtitle {
    margin: 0 0 24px 0;
    font-size: ${subtitleFontSize}px;
    line-height: 1.4;
    max-width: 640px;
}
.custom-banner-btn {
    display: inline-block;
    padding: 12px 28px;
    font-size: ${btnFontSize}px;
    text-decoration: none;
    border-radius: ${btnRadius}px;
    font-weight: 600;
    transition: opacity 0.2s;
}
.custom-banner-btn:hover {
    opacity: 0.85;
}`;

    css += `
.custom-banner-slider .custom-banner-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 3;
    width: 46px;
    height: 46px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: rgba(0,0,0,0.35);
    color: #ffffff;
    cursor: pointer;
    display: ${arrowDesktopDisplay};
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}
.custom-banner-arrow--prev {
    left: 12px;
}
.custom-banner-arrow--next {
    right: 12px;
}
.custom-banner-slider .custom-banner-arrow:hover {
    transform: translateY(-50%);
    background: rgba(0,0,0,0.6);
    color: #ffffff;
}
.custom-banner-arrow svg {
    display: block;
}
.custom-banner-slider .custom-banner-dots {
    position: absolute;
    bottom: 14px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    display: ${dotsDesktopDisplay};
    gap: 8px;
}
.custom-banner-dot {
    width: 10px;
    height: 10px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: rgba(255,255,255,0.5);
    cursor: pointer;
    box-sizing: border-box;
}
.custom-banner-dot.is-active {
    background: #ffffff;
}
@media (max-width: ${breakpoint}px) {
    .custom-banner-slide--has-mobile .custom-banner-bg--desktop {
        display: none;
    }
    .custom-banner-slide--has-mobile .custom-banner-bg--mobile {
        display: block;
    }
    .custom-banner-slide {
        aspect-ratio: ${aspectRatioMobile};
    }
    .custom-banner-slider .custom-banner-arrow {
        display: ${arrowMobileDisplay};
    }
    .custom-banner-slider .custom-banner-dots {
        display: ${dotsMobileDisplay};
    }
    .custom-banner-title {
        font-size: ${mobileTitleFontSize}px;
    }
    .custom-banner-subtitle {
        font-size: ${mobileSubtitleFontSize}px;
    }
}`;

    const slidesHtml = [];
    for (let i = 0; i < count; i++) {
        const d = blocksContent[i];
        const tag = mode === 'full' ? 'a' : 'div';
        const attr = mode === 'full' ? ` href="${d.linkUrl}"` : '';

        const slideCls = d.imgSrcMobile ? 'custom-banner-slide custom-banner-slide--has-mobile' : 'custom-banner-slide';
        let sh = `        <${tag}${attr} class="${slideCls}">\n`;
        sh += `            <div class="custom-banner-bg custom-banner-bg--desktop" style="background-image: url('${d.imgSrc}');"></div>\n`;
        if (d.imgSrcMobile) sh += `            <div class="custom-banner-bg custom-banner-bg--mobile" style="background-image: url('${d.imgSrcMobile}');"></div>\n`;
        if (d.overlay) sh += `            <div class="custom-banner-overlay" style="background: ${d.overlayGradient};"></div>\n`;
        if (mode !== 'full') {
            sh += `            <div class="custom-banner-content" style="justify-content: ${d.valign}; align-items: ${d.alignFlex}; text-align: ${d.align};">\n`;
            if (d.titleText) sh += `                <div class="custom-banner-title" style="color: ${d.titleColor};">${d.titleText}</div>\n`;
            if (d.mainText) sh += `                <div class="custom-banner-subtitle" style="color: ${d.subtitleColor};">${d.mainText}</div>\n`;
            sh += `                <a href="${d.linkUrl}" class="custom-banner-btn" style="background: ${d.btnColor}; color: ${d.btnTextColor};">${d.btnText}</a>\n`;
            sh += `            </div>\n`;
        }
        sh += `        </${tag}>\n`;
        slidesHtml.push(sh);
    }

    let html = `<div class="${wrapperClass}" data-count="${count}"${autoplay ? ` data-autoplay="${autoplayDelay}"` : ''}>\n`;
    if (showArrows || showArrowsMobile) {
        html += `    <button type="button" class="custom-banner-arrow custom-banner-arrow--prev" aria-label="Предыдущий баннер">\n        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>\n    </button>\n`;
    }
    html += `    <div class="custom-banner-track">\n`;
    if (count > 1) html += slidesHtml[count - 1];
    html += slidesHtml.join('');
    if (count > 1) html += slidesHtml[0];
    html += `    </div>\n`;
    if (showArrows || showArrowsMobile) {
        html += `    <button type="button" class="custom-banner-arrow custom-banner-arrow--next" aria-label="Следующий баннер">\n        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 5 L16 12 L9 19" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>\n    </button>\n`;
    }
    if (showDots || showDotsMobile) {
        html += `    <div class="custom-banner-dots">\n`;
        for (let i = 0; i < count; i++) {
            html += `        <button type="button" class="custom-banner-dot" data-index="${i}" aria-label="Баннер ${i + 1}"></button>\n`;
        }
        html += `    </div>\n`;
    }
    html += `</div>`;

    let autoplayInitJs = '';
    if (autoplay) {
        autoplayInitJs = `
        slider.addEventListener('mouseenter', function () { slider.__bannerHover = true; });
        slider.addEventListener('mouseleave', function () { slider.__bannerHover = false; });`;
    }

    let js = `(function () {
    var TRANSITION_MS = 600;
    var BOUND = window.__customHeroBannerBound;
    if (!BOUND) {
        window.__customHeroBannerBound = true;
        document.addEventListener('click', function (e) {
            var arrow = e.target.closest('.custom-banner-arrow');
            if (arrow) {
                e.preventDefault();
                if (arrow.classList.contains('custom-banner-arrow--next')) {
                    nextSlide(arrow.closest('.custom-banner-slider'));
                } else {
                    prevSlide(arrow.closest('.custom-banner-slider'));
                }
                return;
            }
            var dot = e.target.closest('.custom-banner-dot');
            if (dot) {
                var slider = dot.closest('.custom-banner-slider');
                var idx = parseInt(dot.getAttribute('data-index'), 10);
                setSlider(slider, idx + 1, true);
            }
        });
        document.addEventListener('touchstart', function (e) {
            var slider = e.target.closest('.custom-banner-slider');
            if (!slider) return;
            slider.__bannerTouchX = e.changedTouches[0].clientX;
        }, { passive: true });
        document.addEventListener('touchend', function (e) {
            var slider = e.target.closest('.custom-banner-slider');
            if (!slider || slider.__bannerTouchX === undefined) return;
            var dx = e.changedTouches[0].clientX - slider.__bannerTouchX;
            delete slider.__bannerTouchX;
            if (Math.abs(dx) > 40) {
                if (dx < 0) nextSlide(slider); else prevSlide(slider);
            }
        }, { passive: true });
        setInterval(function () {
            var as = document.querySelectorAll('.custom-banner-slider[data-autoplay]');
            var now = Date.now();
            for (var i = 0; i < as.length; i++) {
                var a = as[i];
                if (a.__bannerHover) continue;
                var delay = parseInt(a.getAttribute('data-autoplay'), 10) || 5000;
                if (now - (a.__bannerLast || 0) >= delay) {
                    a.__bannerLast = now;
                    nextSlide(a);
                }
            }
        }, 250);
    }
    function getPos(slider) {
        return parseInt(slider.getAttribute('data-pos') || '1', 10);
    }
    function updateDots(slider) {
        var n = parseInt(slider.getAttribute('data-count'), 10) || 1;
        var pos = getPos(slider);
        var idx;
        if (n > 1) {
            if (pos === 0) idx = n - 1;
            else if (pos === n + 1) idx = 0;
            else idx = pos - 1;
        } else {
            idx = 0;
        }
        var dots = slider.querySelectorAll('.custom-banner-dot');
        for (var i = 0; i < dots.length; i++) dots[i].classList.toggle('is-active', i === idx);
        slider.setAttribute('data-index', idx);
    }
    function setSlider(slider, pos, animate) {
        var track = slider.querySelector('.custom-banner-track');
        if (!track) return;
        if (animate) {
            track.style.transition = 'transform ' + TRANSITION_MS + 'ms ease';
        } else {
            track.style.transition = 'none';
        }
        track.style.transform = 'translateX(-' + (pos * 100) + '%)';
        if (!animate) {
            void track.offsetWidth;
            track.style.transition = 'transform ' + TRANSITION_MS + 'ms ease';
        }
        slider.setAttribute('data-pos', pos);
        updateDots(slider);
    }
    function afterTransition(slider, cb) {
        var track = slider.querySelector('.custom-banner-track');
        if (!track) { cb(); return; }
        var done = false;
        function finish() {
            if (done) return;
            done = true;
            track.removeEventListener('transitionend', finish);
            cb();
        }
        track.addEventListener('transitionend', finish);
        setTimeout(finish, TRANSITION_MS + 200);
    }
    function nextSlide(slider) {
        var n = parseInt(slider.getAttribute('data-count'), 10) || 1;
        if (n <= 1) return;
        var pos = getPos(slider);
        if (pos >= n + 1) { settleNext(slider); return; }
        setSlider(slider, pos + 1, true);
        if (pos + 1 === n + 1) settleNext(slider);
    }
    function settleNext(slider) {
        afterTransition(slider, function () { setSlider(slider, 1, false); });
    }
    function prevSlide(slider) {
        var n = parseInt(slider.getAttribute('data-count'), 10) || 1;
        if (n <= 1) return;
        var pos = getPos(slider);
        if (pos === 1) {
            setSlider(slider, 0, true);
            afterTransition(slider, function () { setSlider(slider, n, false); });
        } else {
            setSlider(slider, pos - 1, true);
        }
    }
    function init(slider) {
        setSlider(slider, 1, false);
        slider.__bannerLast = Date.now();
        ${autoplayInitJs}
    }
    function start() {
        var sliders = document.querySelectorAll('.custom-banner-slider');
        for (var i = 0; i < sliders.length; i++) {
            if (sliders[i].__bannerInit) continue;
            sliders[i].__bannerInit = true;
            init(sliders[i]);
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();`;

    const cssEl = document.getElementById('b-css');
    const htmlEl = document.getElementById('b-html');
    const jsEl = document.getElementById('b-js');
    if (!cssEl || !htmlEl || !jsEl) return;

    cssEl.value = css;
    htmlEl.value = html;
    jsEl.value = js;

    updateLiveDemoPreview(currentSection, css, html, js);
}

document.addEventListener('DOMContentLoaded', () => {
    updateBannerContentFields();

    const countInput = document.getElementById('b-count');
    if (countInput) {
        countInput.addEventListener('change', () => { updateBannerContentFields(); generateBanner(); });
        countInput.addEventListener('blur', () => { updateBannerContentFields(); generateBanner(); });
    }

    setupLivePreview('banner-section', () => generateBanner());

    setTimeout(() => {
        generateBanner();
    }, 100);
});