function createContentFieldsForScrollBlock(index) {
    const blockNum = index + 1;
    const blockDiv = document.createElement('div');
    blockDiv.className = 'settings-group collapsed';

    blockDiv.innerHTML = `
        <div class="settings-group-header">Контент для карточки №${blockNum}</div>
        <div class="settings-group-body">
            <div class="control-group">
                <label for="s-block-${index}-link-url">Адрес ссылки (для всей карточки или кнопки):</label>
                <input type="text" id="s-block-${index}-link-url" value="#" placeholder="Например, /page/ или https://example.com">
            </div>
            <div class="control-group">
                <label for="s-block-${index}-img-src">Ссылка на изображение:</label>
                <input type="text" id="s-block-${index}-img-src" value="https://gabriellesunrise.github.io/simple-blocks/img.jpg" placeholder="URL изображения">
            </div>
            <div class="control-group">
                <label for="s-block-${index}-img-alt">Alt текст для изображения (по умолчанию заголовок):</label>
                <input type="text" id="s-block-${index}-img-alt" value="" placeholder="Описание изображения для SEO">
            </div>
            <div class="control-group">
                <label for="s-block-${index}-title-text">Заголовок:</label>
                <input type="text" id="s-block-${index}-title-text" value="Заголовок карточки ${blockNum}" placeholder="Заголовок карточки">
            </div>
            <div class="control-group">
                <label for="s-block-${index}-main-text">Текст:</label>
                <textarea id="s-block-${index}-main-text" rows="3" placeholder="Пример текста для наполнения карточки.">Пример текста для наполнения карточки ${blockNum}. Пример текста для наполнения карточки.</textarea>
            </div>
        </div>
    `;
    return blockDiv;
}

function updateScrollContentFields() {
    const count = parseInt(document.getElementById('s-count').value);
    const container = document.getElementById('s-content-fields-container');
    if (!container) return;

    const existingContent = {};
    for (let i = 0; i < 24; i++) {
        const linkUrlEl = document.getElementById(`s-block-${i}-link-url`);
        const imgSrcEl = document.getElementById(`s-block-${i}-img-src`);
        const imgAltEl = document.getElementById(`s-block-${i}-img-alt`);
        const titleEl = document.getElementById(`s-block-${i}-title-text`);
        const textEl = document.getElementById(`s-block-${i}-main-text`);

        if (linkUrlEl && imgSrcEl && imgAltEl && titleEl && textEl) {
            existingContent[i] = {
                linkUrl: linkUrlEl.value,
                imgSrc: imgSrcEl.value,
                imgAlt: imgAltEl.value,
                titleText: titleEl.value,
                mainText: textEl.value
            };
        }
    }

    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const blockFields = createContentFieldsForScrollBlock(i);
        container.appendChild(blockFields);

        if (existingContent[i]) {
            document.getElementById(`s-block-${i}-link-url`).value = existingContent[i].linkUrl;
            document.getElementById(`s-block-${i}-img-src`).value = existingContent[i].imgSrc;
            document.getElementById(`s-block-${i}-img-alt`).value = existingContent[i].imgAlt;
            document.getElementById(`s-block-${i}-title-text`).value = existingContent[i].titleText;
            document.getElementById(`s-block-${i}-main-text`).value = existingContent[i].mainText;
        }
    }
}

function generateScrollSlider() {
    const currentSection = document.getElementById('scroll-section');
    if (!currentSection) {
        console.error('Section "scroll-section" not found.');
        return;
    }

    const scrollSettingNames = [
        'count', 'link', 'img', 'title', 'text', 'btn',
        'card-width', 'show-arrows', 'overlay-arrows', 'hide-arrows-mobile', 'snap',
        'gap', 'padding', 'radius', 'align', 'flex-align', 'card-layout', 'wide-btn', 'bold-btn', 'bg-color',
        'has-border', 'border-width', 'border-style', 'border-color',
        'img-aspect-ratio', 'img-radius', 'img-margin',
        'bold-title', 'title-font-size', 'title-color', 'title-margin',
        'text-font-size', 'text-color', 'text-margin',
        'btn-text-color', 'btn-hover-text-color', 'btn-color', 'btn-hover-color',
        'btn-font-size', 'btn-radius',
        'enable-shadow', 'has-shadow-always', 'shadow-always-value',
        'has-shadow-hover', 'shadow-hover-value',
        'custom-wrapper-class', 'custom-item-class',
        'mobile-card-width', 'mobile-percent-width', 'mobile-card-width-percent', 'mobile-vertical-layout',
        'mobile-title-font-size', 'mobile-text-font-size', 'mobile-btn-font-size'
    ];

    const settings = getSettings('s', scrollSettingNames);

    const {
        count, link, img: hasImg, title: hasTitle, text: hasText, btn: hasBtn,
        'card-width': cardWidth, 'show-arrows': showArrows, 'overlay-arrows': overlayArrows,
        'hide-arrows-mobile': hideArrowsMobile, 'snap': useSnap,
        gap, padding, radius, align, 'flex-align': flexAlign, 'card-layout': cardLayout,
        'wide-btn': wideBtn, 'bold-btn': boldBtn, 'bg-color': bgColor,
        'has-border': hasBorder, 'border-width': borderWidth, 'border-style': borderStyle, 'border-color': borderColor,
        'img-aspect-ratio': imgAspectRatio, 'img-radius': imgRadius, 'img-margin': imgMargin,
        'bold-title': boldTitle, 'title-font-size': titleFontSize, 'title-color': titleColor, 'title-margin': titleMargin,
        'text-font-size': textFontSize, 'text-color': textColor, 'text-margin': textMargin,
        'btn-text-color': btnTextColor, 'btn-hover-text-color': btnHoverTextColor,
        'btn-color': btnColor, 'btn-hover-color': btnHoverColor,
        'btn-font-size': btnFontSize, 'btn-radius': btnRadius,
        'enable-shadow': enableShadow, 'has-shadow-always': hasShadowAlways,
        'shadow-always-value': shadowAlwaysValue, 'has-shadow-hover': hasShadowHover,
        'shadow-hover-value': shadowHoverValue,
        'custom-wrapper-class': customWrapperClass, 'custom-item-class': customItemClass,
        'mobile-card-width': mobileCardWidth, 'mobile-percent-width': mobilePercentWidth,
        'mobile-card-width-percent': mobileCardWidthPercent, 'mobile-vertical-layout': mobileVerticalLayout,
        'mobile-title-font-size': mobileTitleFontSize,
        'mobile-text-font-size': mobileTextFontSize,
        'mobile-btn-font-size': mobileBtnFontSize
    } = settings;

    const generalBtnText = document.getElementById('s-btn-general-text').value;

    const blocksContent = [];
    for (let i = 0; i < count; i++) {
        const linkUrlEl = document.getElementById(`s-block-${i}-link-url`);
        const imgSrcEl = document.getElementById(`s-block-${i}-img-src`);
        const imgAltEl = document.getElementById(`s-block-${i}-img-alt`);
        const titleTextEl = document.getElementById(`s-block-${i}-title-text`);
        const mainTextEl = document.getElementById(`s-block-${i}-main-text`);

        blocksContent.push({
            linkUrl: (linkUrlEl?.value || '').trim() || '#',
            imgSrc: imgSrcEl?.value || 'https://gabriellesunrise.github.io/simple-blocks/img.jpg',
            imgAlt: (imgAltEl?.value || '').trim(),
            titleText: (titleTextEl?.value || '').trim(),
            mainText: mainTextEl?.value || `Пример текста для наполнения карточки ${i + 1}. Пример текста для наполнения карточки.`
        });
    }

    let borderPropertyCss = '';
    if (hasBorder) {
        borderPropertyCss = `\n    border: ${borderWidth}px ${borderStyle} ${borderColor};`;
    }

    let titleBoldPropertyCss = '';
    if (boldTitle) {
        titleBoldPropertyCss = '\n    font-weight: 600;';
    }

    let btnPropertyCss = '';
    if (wideBtn) {
        btnPropertyCss = '\n    width: 100%;';
    }

    let btnBoldPropertyCss = '';
    if (boldBtn) {
        btnBoldPropertyCss = '\n    font-weight: 600;';
    }

    let overlayArrowsCss = '';
    if (overlayArrows) {
        overlayArrowsCss = `
.custom-slider-cards-arrow {
    position: absolute;
    top: 50%;
    margin-top: -20px;
    z-index: 2;
}
.custom-slider-cards-arrow--prev {
    left: 4px;
}
.custom-slider-cards-arrow--next {
    right: 4px;
}`;
    }

    let hideArrowsMobileCss = '';
    if (hideArrowsMobile) {
        hideArrowsMobileCss = `
@media (max-width: 768px) {
    .custom-slider-cards-arrow {
        display: none !important;
    }
}`;
    }

    let mobileItemWidthCss = `    flex: 0 0 ${mobileCardWidth}px;
    width: ${mobileCardWidth}px;`;
    if (mobilePercentWidth) {
        mobileItemWidthCss = `    flex: 0 0 ${mobileCardWidthPercent}%;
    width: ${mobileCardWidthPercent}%;`;
    }

    let shadowAlwaysCss = '';
    let shadowHoverCss = '';

    if (enableShadow) {
        if (hasShadowAlways && shadowAlwaysValue.trim()) {
            shadowAlwaysCss = `\n    box-shadow: ${shadowAlwaysValue.trim()};`;
        }

        if (hasShadowHover) {
            let finalHoverShadowValue = shadowHoverValue.trim();

            if (!finalHoverShadowValue && link === 'block') {
                finalHoverShadowValue = DEFAULT_HOVER_SHADOW_VALUE;
            }

            if (finalHoverShadowValue) {
                shadowHoverCss = `\n.custom-slider-cards-item:hover { \n    box-shadow: ${finalHoverShadowValue}; \n    transition: box-shadow 0.2s; \n}\n`;
            }
        }
    }

    let linkStylesCss = '';
    if (link === 'block') {
        linkStylesCss = `\na.custom-slider-cards-item { \n    text-decoration: none; \n    color: inherit; \n}`;
    } else if (link === 'button') {
        let btnLinkExtra = wideBtn ? `\n    display: block;\n    width: 100%;` : `\n    display: inline-block;`;
        linkStylesCss = `\na.custom-slider-cards-btn-link { \n    text-decoration: none; \n    color: inherit;${btnLinkExtra}\n}`;
    }

    const snapCss = useSnap ? `\n    scroll-snap-type: x mandatory;` : '';
    const snapAlignCss = useSnap ? `\n    scroll-snap-align: start;` : '';
    let trackShadowPaddingCss = '';
    if (enableShadow) {
        trackShadowPaddingCss = `
    padding: 14px 0;`;
    }

    let mobileVerticalLayoutCss = '';
    if (mobileVerticalLayout) {
        mobileVerticalLayoutCss = `
@media (max-width: 768px) {
    .custom-slider-cards-item--row {
        flex-direction: column;
    }
    .custom-slider-cards-item--row .custom-slider-cards-img {
        flex: 0 0 auto;
        width: 100%;
        margin-right: 0;
        margin-bottom: ${imgMargin}px;
    }
}`;
    }

    const wrapperClass = appendCustomClass('custom-slider-cards', customWrapperClass);
    const itemClass = appendCustomClass('custom-slider-cards-item', customItemClass);

    const layoutRowClass = cardLayout === 'horizontal' ? ' custom-slider-cards-item--row' : '';

    let html = `<div class="${wrapperClass}">\n`;
    if (showArrows) {
        html += `  <button type="button" class="custom-slider-cards-arrow custom-slider-cards-arrow--prev" aria-label="Предыдущие карточки">\n      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>\n  </button>\n`;
    }
    html += `  <div class="custom-slider-cards-track">\n`;
    for (let i = 0; i < count; i++) {
        const blockData = blocksContent[i];
        const tag = link === 'block' ? 'a' : 'div';
        const attr = link === 'block' ? ` href="${blockData.linkUrl}"` : '';

        let finalAlt = '';
        if (blockData.imgAlt !== '') {
            finalAlt = blockData.imgAlt;
        } else if (hasTitle && blockData.titleText !== '') {
            finalAlt = blockData.titleText;
        }

        html += `    <${tag}${attr} class="${itemClass}${layoutRowClass}">\n`;

        if (hasImg) html += `      <img src="${blockData.imgSrc}" alt="${finalAlt}" class="custom-slider-cards-img">\n`;
        html += `      <div class="custom-slider-cards-content">\n`;
        if (hasTitle) html += `        <div class="custom-slider-cards-title">${blockData.titleText}</div>\n`;
        if (hasText) html += `        <div class="custom-slider-cards-text">${blockData.mainText}</div>\n`;

        if (hasBtn) {
            if (link === 'button') {
                html += `        <a href="${blockData.linkUrl}" class="custom-slider-cards-btn-link"><span class="custom-slider-cards-btn">${generalBtnText}</span></a>\n`;
            } else {
                html += `        <span class="custom-slider-cards-btn">${generalBtnText}</span>\n`;
            }
        }
        html += `      </div>\n`;
        html += `    </${tag}>\n`;
    }
    html += `  </div>\n`;
    if (showArrows) {
        html += `  <button type="button" class="custom-slider-cards-arrow custom-slider-cards-arrow--next" aria-label="Следующие карточки">\n      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M9 5 L16 12 L9 19" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>\n  </button>\n`;
    }
    html += `</div>`;

    let css = `.${wrapperClass.split(' ')[0]} {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 0;
    position: relative;
}
.custom-slider-cards-track {
    display: flex;
    gap: ${gap}px;
    overflow-x: auto;
    flex: 1;${trackShadowPaddingCss}${snapCss}
}
.custom-slider-cards-item {
    box-sizing: border-box;
    flex: 0 0 ${cardWidth}px;
    width: ${cardWidth}px;
    padding: ${padding}px;
    background: ${bgColor};
    border-radius: ${radius}px;
    display: flex;
    flex-direction: column;
    transition: 0.2s;
    text-align: ${align};${borderPropertyCss}${shadowAlwaysCss}${snapAlignCss}
}
.custom-slider-cards-item--row {
    flex-direction: row;
    align-items: stretch;
}
.custom-slider-cards-item--row .custom-slider-cards-img {
    flex: 0 0 40%;
    width: 40%;
    align-self: flex-start;
    margin-right: ${imgMargin}px;
}
.custom-slider-cards-content {
    display: flex;
    flex-direction: column;
    align-items: ${flexAlign};
    width: 100%;
    flex: 1;
}
.custom-slider-cards-item--row .custom-slider-cards-content {
    width: auto;
}
.custom-slider-cards-content .custom-slider-cards-btn,
.custom-slider-cards-content .custom-slider-cards-btn-link {
    margin-top: auto;
}
${shadowHoverCss}
.custom-slider-cards-arrow {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #d0d0d0;
    background: #ffffff;
    color: #555555;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
    user-select: none;
}
.custom-slider-cards-arrow svg {
    display: block;
}
.custom-slider-cards-arrow:hover {
    background: ${btnColor};
    border-color: ${btnColor};
    color: #ffffff;
}
${overlayArrowsCss}
.custom-slider-cards-img {
    width: 100%;
    height: auto;
    display: block;
    margin-bottom: ${imgMargin}px;
    border-radius: ${imgRadius}px;
    aspect-ratio: ${imgAspectRatio};
    object-fit: cover;
}
.custom-slider-cards-title {
    font-size: ${titleFontSize}px;
    margin-bottom: ${titleMargin}px;
    color: ${titleColor};${titleBoldPropertyCss}
}
.custom-slider-cards-text {
    font-size: ${textFontSize}px;
    margin-bottom: ${textMargin}px;
    color: ${textColor};
}
.custom-slider-cards-btn {
    display: inline-block;
    padding: 10px 20px;
    background: ${btnColor};
    color: ${btnTextColor};
    text-decoration: none;
    border-radius: ${btnRadius}px;
    border: none;
    text-align: center;
    box-sizing: border-box;${btnPropertyCss}${btnBoldPropertyCss}
    font-size: ${btnFontSize}px;
}
.custom-slider-cards-btn:hover {
    background: ${btnHoverColor};
    color: ${btnHoverTextColor};
}
.custom-slider-cards-track::-webkit-scrollbar {
    display: none;
}
.custom-slider-cards-track {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
${linkStylesCss}

@media (max-width: 768px) {
    .custom-slider-cards-item {
${mobileItemWidthCss}
    }
    .custom-slider-cards-title {
        font-size: ${mobileTitleFontSize}px;
    }
    .custom-slider-cards-text {
        font-size: ${mobileTextFontSize}px;
    }
    .custom-slider-cards-btn {
        font-size: ${mobileBtnFontSize}px;
    }
}
${hideArrowsMobileCss}
${mobileVerticalLayoutCss}`;

    let js = '';
    if (showArrows) {
        js = `document.addEventListener('click', function (e) {
    var btn = e.target.closest('.custom-slider-cards-arrow');
    if (!btn) return;
    var track = btn.parentElement.querySelector('.custom-slider-cards-track');
    if (!track) return;
    var step = track.querySelector('.custom-slider-cards-item');
    var distance = step ? step.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 20) : 260;
    track.scrollBy({ left: btn.classList.contains('custom-slider-cards-arrow--prev') ? -distance : distance, behavior: 'smooth' });
});

function updateSliderArrows(slider) {
    var track = slider.querySelector('.custom-slider-cards-track');
    var prev = slider.querySelector('.custom-slider-cards-arrow--prev');
    var next = slider.querySelector('.custom-slider-cards-arrow--next');
    if (!track || !prev || !next) return;
    var show = true;
    if (track.clientWidth > 0) {
        show = track.scrollWidth > track.clientWidth + 1;
    }
    prev.style.display = show ? '' : 'none';
    next.style.display = show ? '' : 'none';
}
function initSliderArrows() {
    document.querySelectorAll('.custom-slider-cards').forEach(function (slider) {
        updateSliderArrows(slider);
    });
}
initSliderArrows();
window.addEventListener('resize', initSliderArrows);
window.addEventListener('load', initSliderArrows);
setTimeout(initSliderArrows, 300);`;
    }

    const cssEl = document.getElementById('s-css');
    const htmlEl = document.getElementById('s-html');
    const jsEl = document.getElementById('s-js');
    if (!cssEl || !htmlEl || !jsEl) return;

    cssEl.value = css;
    htmlEl.value = html;
    jsEl.value = js;

    const jsOutputWrapper = document.getElementById('s-js')?.closest('.outputs');
    if (jsOutputWrapper) {
        jsOutputWrapper.classList.toggle('hidden', !showArrows);
    }

    updateLiveDemoPreview(currentSection, css, html, js);
}

document.addEventListener('DOMContentLoaded', () => {
    setupShadowToggles('s');
    updateScrollContentFields();

    const countInput = document.getElementById('s-count');
    if (countInput) {
        countInput.addEventListener('change', () => {
            updateScrollContentFields();
            generateScrollSlider();
        });
        countInput.addEventListener('blur', () => {
            updateScrollContentFields();
            generateScrollSlider();
        });
    }

    setupLivePreview('scroll-section', () => generateScrollSlider());

    setTimeout(() => {
        generateScrollSlider();
    }, 100);
});