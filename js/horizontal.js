function createContentFieldsForHorizontalBlock(index) {
    const blockNum = index + 1;
    const blockDiv = document.createElement('div');
    blockDiv.className = 'block-content-inputs';

    blockDiv.innerHTML = `
        <h4>Контент для горизонтального блока №${blockNum}</h4>
        <div class="control-group">
            <label for="h-block-${index}-link-url">Адрес ссылки (для всей карточки или кнопки):</label>
            <input type="text" id="h-block-${index}-link-url" value="#" placeholder="Например, /page/ или https://example.com">
        </div>
        <div class="control-group">
            <label for="h-block-${index}-img-src">Ссылка на изображение:</label>
            <input type="text" id="h-block-${index}-img-src" value="https://gabriellesunrise.github.io/simple-blocks/img.jpg" placeholder="URL изображения">
        </div>
        <div class="control-group">
            <label for="h-block-${index}-img-alt">Alt текст для изображения (по умолчанию заголовок):</label>
            <input type="text" id="h-block-${index}-img-alt" value="" placeholder="Описание изображения для SEO">
        </div>
        <div class="control-group">
            <label for="h-block-${index}-title-text">Заголовок:</label>
            <input type="text" id="h-block-${index}-title-text" value="Заголовок блока ${blockNum}" placeholder="Заголовок блока">
        </div>
        <div class="control-group">
            <label for="h-block-${index}-main-text">Текст:</label>
            <textarea id="h-block-${index}-main-text" rows="3" placeholder="Пример текста для наполнения блока.">Пример текста для наполнения блока ${blockNum}. Пример текста для наполнения блока.</textarea>
        </div>
    `;
    return blockDiv;
}

function updateHorizontalContentFields() {
    const count = parseInt(document.getElementById('h-count').value);
    const container = document.getElementById('h-content-fields-container');
    if (!container) return;

    const existingContent = {};
    for (let i = 0; i < 10; i++) {
        const linkUrlEl = document.getElementById(`h-block-${i}-link-url`);
        const imgSrcEl = document.getElementById(`h-block-${i}-img-src`);
        const altTextEl = document.getElementById(`h-block-${i}-img-alt`);
        const titleEl = document.getElementById(`h-block-${i}-title-text`);
        const textEl = document.getElementById(`h-block-${i}-main-text`);

        if (linkUrlEl && imgSrcEl && altTextEl && titleEl && textEl) {
            existingContent[i] = {
                linkUrl: linkUrlEl.value,
                imgSrc: imgSrcEl.value,
                altText: altTextEl.value,
                titleText: titleEl.value,
                mainText: textEl.value
            };
        }
    }

    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const blockFields = createContentFieldsForHorizontalBlock(i);
        container.appendChild(blockFields);

        if (existingContent[i]) {
            document.getElementById(`h-block-${i}-link-url`).value = existingContent[i].linkUrl;
            document.getElementById(`h-block-${i}-img-src`).value = existingContent[i].imgSrc;
            document.getElementById(`h-block-${i}-img-alt`).value = existingContent[i].altText;
            document.getElementById(`h-block-${i}-title-text`).value = existingContent[i].titleText;
            document.getElementById(`h-block-${i}-main-text`).value = existingContent[i].mainText;
        }
    }
}

function generateHorizontal(buttonElement) {
    const currentSection = buttonElement.closest('.section');
    if (!currentSection) {
        console.error('Parent section not found for the button.');
        return;
    }

    const horizontalSettingNames = [
        'count', 'link', 'reverse', 'title', 'text', 'btn', 'img-width',
        'gap', 'radius', 'padding', 'has-border', 'border-color', 'border-width',
        'title-font-size', 'text-font-size', 'btn-font-size', 'btn-color', 
        'btn-hover-color', 'btn-text-color', 'btn-hover-text-color',
        'title-color', 'text-color', 'img-radius', 'enable-shadow',
        'has-shadow-always', 'shadow-always-value',
        'has-shadow-hover', 'shadow-hover-value',
        'custom-wrapper-class', 'custom-item-class'
    ];
    const settings = getSettings('h', horizontalSettingNames);

    const {
        count, link: linkType, reverse: startReverse, title: hasTitle, text: hasText, 
        btn: hasBtn, 'img-width': imgWidth, gap, radius, padding,
        'has-border': hasBorder, 'border-color': borderColor, 'border-width': borderWidth,
        'title-font-size': titleFS, 'text-font-size': textFS, 'btn-font-size': btnFS,
        'btn-color': btnColor, 'btn-hover-color': btnHoverColor,
        'btn-text-color': btnTextColor, 'btn-hover-text-color': btnHoverTextColor,
        'title-color': titleColor, 'text-color': textColor,
        'img-radius': imgRadius, 'enable-shadow': enableShadow,
        'has-shadow-always': hasShadowAlways,
        'shadow-always-value': shadowAlwaysValue,
        'has-shadow-hover': hasShadowHover,
        'shadow-hover-value': shadowHoverValue,
        'custom-wrapper-class': customWrapperClass,
        'custom-item-class': customItemClass
    } = settings;

    const generalBtnText = document.getElementById('h-btn-general-text').value;

    const blocksContent = [];
    for (let i = 0; i < count; i++) {
        const linkUrlEl = document.getElementById(`h-block-${i}-link-url`);
        const imgSrcEl = document.getElementById(`h-block-${i}-img-src`);
        const altTextEl = document.getElementById(`h-block-${i}-img-alt`);
        const titleTextEl = document.getElementById(`h-block-${i}-title-text`);
        const mainTextEl = document.getElementById(`h-block-${i}-main-text`);

        blocksContent.push({
            linkUrl: (linkUrlEl?.value || '').trim() || '#',
            imgSrc: imgSrcEl?.value || 'https://gabriellesunrise.github.io/simple-blocks/img.jpg',
            altText: (altTextEl?.value || '').trim(),
            titleText: (titleTextEl?.value || '').trim(),
            mainText: mainTextEl?.value || `Пример текста для наполнения блока ${i + 1}. Пример текста для наполнения блока.`,
        });
    }

    let borderPropertyCss = '';
    if (hasBorder) {
        borderPropertyCss = `\n    border: ${borderWidth}px solid ${borderColor};`;
    }

    let shadowAlwaysCss = '';
    let shadowHoverCss = '';

    if (enableShadow) {
        if (hasShadowAlways && shadowAlwaysValue.trim()) {
            shadowAlwaysCss = `\n    box-shadow: ${shadowAlwaysValue.trim()};`;
        }

        if (hasShadowHover) {
            let finalHoverShadowValue = shadowHoverValue.trim();

            if (!finalHoverShadowValue && linkType === 'block') {
                finalHoverShadowValue = DEFAULT_HOVER_SHADOW_VALUE;
            }

            if (finalHoverShadowValue) {
                shadowHoverCss = `\n.custom-card-row:hover { \n    box-shadow: ${finalHoverShadowValue}; \n    transition: box-shadow 0.2s; \n}\n`;
            }
        }
    }

    let linkStylesCss = '';
    if (linkType === 'block') {
        linkStylesCss = `\na.custom-card-row { \n    text-decoration: none; \n    color: inherit; \n}`;
    } else if (linkType === 'button') {
        linkStylesCss = `\na.custom-card-row-btn-link { \n    text-decoration: none; \n    color: inherit; \n}`;
    }

    let css = `.h-container {
    display: flex;
    flex-direction: column;
    gap: ${gap}px;
    padding: 20px 0;
}
.custom-card-row {
    display: flex;
    align-items: center;
    gap: 30px;
    padding: ${padding}px;
    background: #fff;
    border-radius: ${radius}px;
    box-sizing: border-box;
    width: 100%;
    transition: 0.2s;${borderPropertyCss}${shadowAlwaysCss}
}
${shadowHoverCss}.custom-card-row.reverse {
    flex-direction: row-reverse;
}
.custom-card-row-img {
    flex: 0 0 ${imgWidth}%;
    width: ${imgWidth}%;
    border-radius: ${imgRadius}px;
    aspect-ratio: 3/2;
    object-fit: cover;
}
.custom-card-row-content {
    flex-grow: 1;
}
.custom-card-row-title {
    font-size: ${titleFS}px;
    color: ${titleColor};
    margin-bottom: 10px;
    font-weight: 600;
}
.custom-card-row-text {
    font-size: ${textFS}px;
    color: ${textColor};
    margin-bottom: 15px;
}
.custom-card-row-btn {
    display: inline-block;
    padding: 10px 20px;
    background: ${btnColor};
    color: ${btnTextColor};
    font-size: ${btnFS}px;
    border-radius: 4px;
    text-decoration: none;
    transition: 0.2s;
}
.custom-card-row-btn:hover {
    background: ${btnHoverColor};
    color: ${btnHoverTextColor};
}${linkStylesCss}

@media (max-width: 768px) {
    .custom-card-row {
        flex-direction: column;
        align-items: flex-start;
        padding: 0;
    }
    .custom-card-row.reverse {
        flex-direction: column-reverse;
    }
    .custom-card-row .custom-card-row-img {
        flex: 0 0 100%;
        width: 100%;
    }
}`;

    const wrapperClass = appendCustomClass('h-container', customWrapperClass);

    let html = `<div class="${wrapperClass}">\n`;
    for (let i = 0; i < count; i++) {
        const blockData = blocksContent[i];

        const tag = linkType === 'block' ? 'a' : 'div';
        const attr = (linkType) === 'block' ? ` href="${blockData.linkUrl}"` : '';
        let isReversedBlock = false;
        if (startReverse) {
            if ((i + 1) % 2 !== 0) {
                isReversedBlock = true;
            }
        } else {
            if ((i + 1) % 2 === 0) {
                isReversedBlock = true;
            }
        }

        const reverseClass = isReversedBlock ? ' reverse' : '';
        const itemClass = appendCustomClass(`custom-card-row${reverseClass}`, customItemClass);
        html += `  <${tag}${attr} class="${itemClass}">\n`;

        let finalAlt = '';
        if (blockData.altText !== '') {
            finalAlt = blockData.altText;
        } else if (hasTitle && blockData.titleText !== '') {
            finalAlt = blockData.titleText;
        }

        html += `    <img class="custom-card-row-img" src="${blockData.imgSrc}" alt="${finalAlt}">\n`;
        html += `    <div class="custom-card-row-content">\n`;

        if (hasTitle) html += `      <div class="custom-card-row-title">${blockData.titleText}</div>\n`;
        if (hasText) html += `      <div class="custom-card-row-text">${blockData.mainText}</div>\n`;

        if (hasBtn) {
            if (linkType === 'button') {
                html += `      <a href="${blockData.linkUrl}" class="custom-card-row-btn-link"><span class="custom-card-row-btn">${generalBtnText}</span></a>\n`;
            } else {
                html += `      <div class="custom-card-row-btn">${generalBtnText}</div>\n`;
            }
        }

        html += `    </div>\n`;
        html += `  </${tag}>\n`;
    }
    html += `</div>`;

    document.getElementById('h-css').value = css;
    document.getElementById('h-html').value = html;

    updateLiveDemoPreview(currentSection, css, html);
}

document.addEventListener('DOMContentLoaded', () => {
    setupShadowToggles('h');
    updateHorizontalContentFields();
    
    const countInput = document.getElementById('h-count');
    if (countInput) {
        countInput.addEventListener('change', () => {
            updateHorizontalContentFields();
            generateHorizontal(document.querySelector('#horizontal-section button'));
        });
        countInput.addEventListener('blur', () => {
            updateHorizontalContentFields();
            generateHorizontal(document.querySelector('#horizontal-section button'));
        });
    }

    setupLivePreview('horizontal-section', () => generateHorizontal(document.querySelector('#horizontal-section button')));

    setTimeout(() => {
        const btn = document.querySelector('#horizontal-section button');
        if(btn) generateHorizontal(btn);
    }, 100);
});