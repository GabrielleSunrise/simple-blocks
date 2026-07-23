function createContentFieldsForBlock(index) {
    const blockNum = index + 1;
    const blockDiv = document.createElement('div');
    blockDiv.className = 'block-content-inputs';

    blockDiv.innerHTML = `
        <h4>Контент для блока №${blockNum}</h4>
        <div class="control-group">
            <label for="v-block-${index}-link-url">Адрес ссылки (для всей карточки или кнопки):</label>
            <input type="text" id="v-block-${index}-link-url" value="#" placeholder="Например, /page/ или https://example.com">
        </div>
        <div class="control-group">
            <label for="v-block-${index}-img-src">Ссылка на изображение:</label>
            <input type="text" id="v-block-${index}-img-src" value="https://gabriellesunrise.github.io/simple-blocks/img.jpg" placeholder="URL изображения">
        </div>
        <div class="control-group">
            <label for="v-block-${index}-img-alt">Alt текст для изображения (по умолчанию заголовок):</label>
            <input type="text" id="v-block-${index}-img-alt" value="" placeholder="Описание изображения для SEO">
        </div>
        <div class="control-group">
            <label for="v-block-${index}-title-text">Заголовок:</label>
            <input type="text" id="v-block-${index}-title-text" value="Заголовок блока ${blockNum}" placeholder="Заголовок блока">
        </div>
        <div class="control-group">
            <label for="v-block-${index}-main-text">Текст:</label>
            <textarea id="v-block-${index}-main-text" rows="3" placeholder="Пример текста для наполнения блока.">Пример текста для наполнения блока ${blockNum}. Пример текста для наполнения блока.</textarea>
        </div>
    `;
    return blockDiv;
}

function updateVerticalContentFields() {
    const count = parseInt(document.getElementById('v-count').value);
    const container = document.getElementById('v-content-fields-container');
    if (!container) return;

    const existingContent = {};
    for (let i = 0; i < 5; i++) { 
        const imgEl = document.getElementById(`v-block-${i}-img-src`);
        const altTextEl = document.getElementById(`v-block-${i}-img-alt`);
        const titleEl = document.getElementById(`v-block-${i}-title-text`);
        const textEl = document.getElementById(`v-block-${i}-main-text`);
        const linkUrlEl = document.getElementById(`v-block-${i}-link-url`);
        if (imgEl && altTextEl && titleEl && textEl) {
            existingContent[i] = {
                img: imgEl.value,
                alt: altTextEl.value,
                title: titleEl.value,
                text: textEl.value,
                linkUrl: linkUrlEl.value
            };
        }
    }

    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const blockFields = createContentFieldsForBlock(i);
        container.appendChild(blockFields);

        if (existingContent[i]) {
            document.getElementById(`v-block-${i}-img-src`).value = existingContent[i].img;
            document.getElementById(`v-block-${i}-img-alt`).value = existingContent[i].alt;
            document.getElementById(`v-block-${i}-title-text`).value = existingContent[i].title;
            document.getElementById(`v-block-${i}-main-text`).value = existingContent[i].text;
            document.getElementById(`v-block-${i}-link-url`).value = existingContent[i].linkUrl;
        }
    }
}

function generateVertical(buttonElement) {
    const currentSection = buttonElement.closest('.section');
    if (!currentSection) {
        console.error('Parent section not found for the button.');
        return;
    }

    const verticalSettingNames = [
        'count', 'link', 'img', 'title', 'text', 'btn',
        'gap', 'align', 'flex-align', 'wide-btn', 'title-font-size', 'text-font-size', 'padding', 'radius',
        'has-border', 'border-color', 'border-width', 'border-style', 'btn-font-size', 'btn-color', 'btn-hover-color', 'btn-text-color', 'btn-hover-text-color', 'bold-btn', 'btn-radius', 'img-aspect-ratio', 'img-radius', 'img-margin', 'title-color', 'title-margin', 'bold-title', 'text-color', 'text-margin', 'enable-shadow',
        'has-shadow-always', 'shadow-always-value',
        'has-shadow-hover', 'shadow-hover-value',
        'custom-wrapper-class', 'custom-item-class'
    ];

    const settings = getSettings('v', verticalSettingNames);

    const {
        count, link, img: hasImg, title: hasTitle, text: hasText, btn: hasBtn, gap, align, radius,
        'flex-align': flexAlign,
        'wide-btn': wideBtn,
        'title-font-size': titleFontSize, 
        'text-font-size': textFontSize, 
        padding,
        'has-border': hasBorder,      
        'border-color': borderColor, 
        'border-width': borderWidth, 
        'border-style': borderStyle,
        'btn-font-size': btnFontSize,
        'btn-color': btnColor, 
        'btn-hover-color': btnHoverColor, 
        'btn-text-color': btnTextColor, 
        'btn-hover-text-color': btnHoverTextColor, 
        'bold-btn': boldBtn,
        'btn-radius': btnRadius,
        'img-aspect-ratio': imgAspectRatio,
        'img-radius': imgRadius,
        'img-margin': imgMargin,
        'title-color': titleColor, 
        'title-margin': titleMargin, 
        'bold-title': boldTitle, 
        'text-color': textColor, 
        'text-margin': textMargin,
        'enable-shadow': enableShadow,
        'has-shadow-always': hasShadowAlways,
        'shadow-always-value': shadowAlwaysValue,
        'has-shadow-hover': hasShadowHover,
        'shadow-hover-value': shadowHoverValue,
        'custom-wrapper-class': customWrapperClass,
        'custom-item-class': customItemClass
    } = settings;

    const generalBtnText = document.getElementById('v-btn-general-text').value;

    const blocksContent = [];
    for (let i = 0; i < count; i++) {
        const imgSrcEl = document.getElementById(`v-block-${i}-img-src`);
        const altTextEl = document.getElementById(`v-block-${i}-img-alt`);
        const titleTextEl = document.getElementById(`v-block-${i}-title-text`);
        const mainTextEl = document.getElementById(`v-block-${i}-main-text`);
        const linkUrlEl = document.getElementById(`v-block-${i}-link-url`);

        blocksContent.push({
            imgSrc: imgSrcEl?.value || 'https://gabriellesunrise.github.io/simple-blocks/img.jpg',
            altText: (altTextEl?.value || '').trim(),
            titleText: (titleTextEl?.value || '').trim(),
            mainText: mainTextEl?.value || `Пример текста для наполнения блока ${i + 1}.`,
            linkUrl: (linkUrlEl?.value || '').trim() || '#'
        });
    }

    let borderPropertyCss = '';
    if (hasBorder) {
        borderPropertyCss = `\n    border: ${borderWidth}px ${borderStyle} ${borderColor};`;
    }

    let btnPropertyCss = '';
    if (wideBtn) {
        btnPropertyCss = `\n    width: 100%;`;
    }

    let titleBoldPropertyCss = '';
    if (boldTitle) {
        titleBoldPropertyCss = `\n    font-weight: 600;`;
    }

    let btnBoldPropertyCss = '';
    if (boldBtn) {
        btnBoldPropertyCss = `\n    font-weight: 600;`;
    }

    let shadowAlwaysCss = '';
    let shadowHoverCss = '';

    if (enableShadow) { 
        if (hasShadowAlways && shadowAlwaysValue.trim()) { 
            shadowAlwaysCss = `\n    box-shadow: ${shadowAlwaysValue.trim()};\n`;
        }
        
        if (hasShadowHover) {
            let finalHoverShadowValue = shadowHoverValue.trim();

            if (!finalHoverShadowValue && link === 'block') {
                finalHoverShadowValue = DEFAULT_HOVER_SHADOW_VALUE;
            }

            if (finalHoverShadowValue) {
                shadowHoverCss = `\n.custom-card-item:hover { \n    box-shadow: ${finalHoverShadowValue}; \n    transition: box-shadow 0.2s; \n}\n`;
            }
        }
    }

    let linkStylesCss = '';
    if (link === 'block') {
        linkStylesCss = `\na.custom-card-item { \n    text-decoration: none; \n    color: inherit; \n}`;
    } else if (link === 'button') {
        let btnLinkExtra = wideBtn ? `\n    display: block;\n    width: 100%;` : `\n    display: inline-block;`;
        linkStylesCss = `\na.custom-card-btn-link { \n    text-decoration: none; \n    color: inherit;${btnLinkExtra}\n}`;
    }

    const wrapperClass = appendCustomClass('v-container', customWrapperClass);
    const itemClass = appendCustomClass('custom-card-item', customItemClass);

    let html = `<div class="${wrapperClass}">\n`;
    for (let i = 0; i < count; i++) {
        const blockData = blocksContent[i];
        const tag = link === 'block' ? 'a' : 'div';
        const attr = link === 'block' ? ` href="${blockData.linkUrl}"` : '';

        let finalAlt = '';
        if (blockData.altText !== '') { 
            finalAlt = blockData.altText;
        } else if (hasTitle && blockData.titleText !== '') { 
            finalAlt = blockData.titleText;
        }

        html += `  <${tag}${attr} class="${itemClass}">\n`;

        if (hasImg) html += `    <img src="${blockData.imgSrc}" alt="${finalAlt}" class="custom-card-img">\n`;
        if (hasTitle) html += `    <div class="custom-card-title">${blockData.titleText}</div>\n`;
        if (hasText) html += `    <div class="custom-card-text">${blockData.mainText}</div>\n`;

        if (hasBtn) {
            if (link === 'button') {
                html += `    <a href="${blockData.linkUrl}" class="custom-card-btn-link"><span class="custom-card-btn">${generalBtnText}</span></a>\n`;
            } else {
                html += `    <div class="custom-card-btn">${generalBtnText}</div>\n`;
            }
        }
        html += `  </${tag}>\n`;
    }
    html += `</div>`;

            let css = `.v-container {
    display: grid;
    grid-template-columns: repeat(${count}, 1fr);
    gap: ${gap}px;
    padding: 20px 0;
}
.custom-card-item {
    box-sizing: border-box;
    padding: ${padding}px;${borderPropertyCss}
    border-radius: ${radius}px;
    display: flex;
    flex-direction: column;
    background: #fff;
    transition: 0.2s;
    text-align: ${align};
    align-items: ${flexAlign};
    overflow: hidden;${shadowAlwaysCss}
}
${shadowHoverCss}
.custom-card-item .custom-card-btn {
    margin-top: auto;
}
.custom-card-img { 
    width: 100%; 
    height: auto; 
    display: block; 
    margin-bottom: ${imgMargin}px; 
    border-radius: ${imgRadius}px; 
    aspect-ratio: ${imgAspectRatio}; 
    object-fit: cover;
}
.custom-card-title { 
    font-size: ${titleFontSize}px; 
    margin-bottom: ${titleMargin}px; 
    color: ${titleColor};${titleBoldPropertyCss}
}
.custom-card-text { 
    font-size: ${textFontSize}px;
    margin-bottom: ${textMargin}px; 
    color: ${textColor}; 
}
.custom-card-btn { 
    display: inline-block; 
    padding: 10px 20px; 
    background: ${btnColor}; 
    color: ${btnTextColor}; 
    text-decoration: none; 
    border-radius: ${btnRadius}px; 
    border: none; 
    text-align: center; 
    box-sizing: border-box;${btnPropertyCss}
    font-size: ${btnFontSize}px;${btnBoldPropertyCss}
}
.custom-card-btn:hover { 
    background: ${btnHoverColor}; 
    color: ${btnHoverTextColor};
}${linkStylesCss}

@media (max-width: 1024px) {
    .v-container {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
}

@media (max-width: 768px) {
    .custom-card-item { 
        flex: 1 1 100%; 
    }
}`;

    document.getElementById('v-css').value = css;
    document.getElementById('v-html').value = html;

    updateLiveDemoPreview(currentSection, css, html);
}

document.addEventListener('DOMContentLoaded', () => {
    setupShadowToggles('v');
    updateVerticalContentFields();
    document.getElementById('v-count').addEventListener('blur', updateVerticalContentFields);
});
