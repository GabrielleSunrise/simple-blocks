function createContentFieldsForOverlayBlock(index) {
    const blockNum = index + 1;
    const blockDiv = document.createElement('div');
    blockDiv.className = 'block-content-inputs';

    blockDiv.innerHTML = `
        <h4>Контент для карточки №${blockNum}</h4>
        <div class="control-group">
            <label for="o-block-${index}-link-url">Адрес ссылки (для всей карточки или кнопки):</label>
            <input type="text" id="o-block-${index}-link-url" value="#" placeholder="Например, /page/ или https://example.com">
        </div>
        <div class="control-group">
            <label for="o-block-${index}-img-src">Ссылка на фоновое изображение:</label>
            <input type="text" id="o-block-${index}-img-src" value="https://gabriellesunrise.github.io/simple-blocks/bg-img.jpg" placeholder="URL изображения">
        </div>
        <div class="control-group">
            <label for="o-block-${index}-title-text">Заголовок:</label>
            <input type="text" id="o-block-${index}-title-text" value="Заголовок карточки ${blockNum}" placeholder="Заголовок блока">
        </div>
        <div class="control-group">
            <label for="o-block-${index}-main-text">Текст:</label>
            <textarea id="o-block-${index}-main-text" rows="3" placeholder="Пример описания, которое располагается поверх фонового изображения.">Пример описания, которое располагается поверх фонового изображения для карточки ${blockNum}.</textarea>
        </div>
    `;
    return blockDiv;
}


function updateOverlayContentFields() {
    const count = parseInt(document.getElementById('o-count').value);
    const container = document.getElementById('o-content-fields-container');
    if (!container) return;

    const existingContent = {};
    for (let i = 0; i < 6; i++) {
        const linkUrlEl = document.getElementById(`o-block-${i}-link-url`);
        const imgSrcEl = document.getElementById(`o-block-${i}-img-src`);
        const titleEl = document.getElementById(`o-block-${i}-title-text`);
        const textEl = document.getElementById(`o-block-${i}-main-text`);

        if (linkUrlEl && imgSrcEl && titleEl && textEl) {
            existingContent[i] = {
                linkUrl: linkUrlEl.value,
                imgSrc: imgSrcEl.value,
                titleText: titleEl.value,
                mainText: textEl.value
            };
        }
    }

    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const blockFields = createContentFieldsForOverlayBlock(i);
        container.appendChild(blockFields);

        if (existingContent[i]) {
            document.getElementById(`o-block-${i}-link-url`).value = existingContent[i].linkUrl;
            document.getElementById(`o-block-${i}-img-src`).value = existingContent[i].imgSrc;
            document.getElementById(`o-block-${i}-title-text`).value = existingContent[i].titleText;
            document.getElementById(`o-block-${i}-main-text`).value = existingContent[i].mainText;
        }
    }
}

function generateOverlayCards() {
    const currentSection = document.getElementById('overlay-section');
    if (!currentSection) {
        console.error('Section "overlay-section" not found.');
        return;
    }

    const overlaySettingNames = [
        'count', 'link', 'ratio', 'align', 'valign', 'radius',
        'title', 'text', 'btn',
        'title-font-size', 'title-color', 'bold-title',
        'text-font-size', 'text-color',
        'btn-text-color', 'btn-hover-text-color', 'btn-color', 'btn-hover-color',
        'btn-font-size', 'btn-radius',
        'enable-custom-gradient', 'gradient-value',
        'custom-wrapper-class', 'custom-item-class',
        'mobile-title-font-size', 'mobile-text-font-size', 'mobile-btn-font-size'
    ];
    const settings = getSettings('o', overlaySettingNames);

    const {
        count, link: linkType, ratio, align: alignH, valign: alignV, radius,
        title: hasTitle, text: hasText, btn: hasBtn,
        'title-font-size': titleFS,
        'title-color': titleColor,
        'bold-title': boldTitle,
        'text-font-size': textFS,
        'text-color': textColor,
        'btn-text-color': btnTextColor,
        'btn-hover-text-color': btnHoverTextColor,
        'btn-color': btnColor,
        'btn-hover-color': btnHoverColor,
        'btn-font-size': btnFS,
        'btn-radius': btnRadius,
        'enable-custom-gradient': enableCustomGradient,
        'gradient-value': gradientValue,
        'custom-wrapper-class': customWrapperClass,
        'custom-item-class': customItemClass,
        'mobile-title-font-size': mobileTitleFS,
        'mobile-text-font-size': mobileTextFS,
        'mobile-btn-font-size': mobileBtnFS
    } = settings;

    const generalBtnText = document.getElementById('o-btn-general-text').value;

    const blocksContent = [];
    for (let i = 0; i < count; i++) {
        const linkUrlEl = document.getElementById(`o-block-${i}-link-url`);
        const imgSrcEl = document.getElementById(`o-block-${i}-img-src`);
        const titleTextEl = document.getElementById(`o-block-${i}-title-text`);
        const mainTextEl = document.getElementById(`o-block-${i}-main-text`);

        blocksContent.push({
            linkUrl: (linkUrlEl?.value || '').trim() || '#',
            imgSrc: imgSrcEl?.value || 'https://gabriellesunrise.github.io/simple-blocks/bg-img.jpg',
            titleText: (titleTextEl?.value || '').trim(),
            mainText: mainTextEl?.value || `Пример описания, которое располагается поверх фонового изображения для карточки ${i + 1}.`,
        });
    }

    let cardItemJustifyContent = alignV;
    let contentFlexProperties = '';
    let buttonSpecificCss = '';
    let itemClassForHTML = '';

    let gradient = '';
    let hasGradient = false;
    
    if (enableCustomGradient && gradientValue && gradientValue.trim()) {
        gradient = gradientValue.trim();
        hasGradient = true;
    } else if (!enableCustomGradient) {
        hasGradient = false;
        gradient = '';
    } else {
        if (alignV === 'flex-start') {
            gradient = "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)";
        } else if (alignV === 'center') {
            gradient = "rgba(0,0,0,0.4)";
        } else {
            gradient = "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)";
        }
        hasGradient = true;
    }

    if (alignV === 'stretch-bottom-button') {
        cardItemJustifyContent = 'flex-start';
        contentFlexProperties = `display: flex;
    flex-direction: column;
    flex-grow: 1;`;

        buttonSpecificCss = `
.custom-o-card-item.stretch-content .custom-o-card-content .custom-o-card-btn,
.custom-o-card-item.stretch-content .custom-o-card-content a.custom-o-card-btn {
    margin-top: auto;
}

.custom-o-card-item.stretch-content .custom-o-card-title + .custom-o-card-btn {
    margin-top: auto;
}
        `;
        itemClassForHTML = ' stretch-content';
    }

    let titleFontWeight = '';
    if (boldTitle) {
        titleFontWeight = '\n    font-weight: bold;';
    }

    let overlayHtml = '';
    if (hasGradient) {
        overlayHtml = `    <div class="custom-o-card-overlay"></div>\n`;
    }

    let overlayCss = '';
    if (hasGradient) {
        overlayCss = `
.custom-o-card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${gradient};
    z-index: 2;
    transition: opacity 0.3s;
}
`;
    }

    let css = `.custom-o-cards-grid {
    display: grid;
    grid-template-columns: repeat(${count}, 1fr);
    gap: 20px;
    padding: 20px 0;
}

.custom-o-card-item {
    position: relative;
    overflow: hidden;
    border-radius: ${radius};
    aspect-ratio: ${ratio};
    display: flex;
    flex-direction: column;
    justify-content: ${cardItemJustifyContent};
    text-decoration: none;
    color: #ffffff;
    -webkit-mask-image: -webkit-radial-gradient(white, black);
}

.custom-o-card-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    z-index: 1;
}

.custom-o-card-item:hover .custom-o-card-bg {
    transform: scale(1.1);
}
${overlayCss}
.custom-o-card-content {
    position: relative;
    z-index: 3;
    padding: 25px;
    text-align: ${alignH};
    box-sizing: border-box;
    ${contentFlexProperties}
}

.custom-o-card-title {
    font-size: ${titleFS}px;
    margin: 0 0 10px 0;
    line-height: 1.2;
    color: ${titleColor};${titleFontWeight}
}

.custom-o-card-title+.custom-o-card-btn {
    margin-top: 10px;
}

.custom-o-card-description {
    font-size: ${textFS}px;
    color: ${textColor};
    margin-bottom: 20px;
    opacity: 0.9;
    line-height: 1.4;
}

.custom-o-card-btn {
    display: inline-block;
    padding: 10px 24px;
    background-color: ${btnColor};
    color: ${btnTextColor};
    text-decoration: none;
    border-radius: ${btnRadius}px;
    font-weight: 600;
    font-size: ${btnFS}px;
    transition: all 0.3s;
}

.custom-o-card-btn:hover {
    background-color: ${btnHoverColor};
    color: ${btnHoverTextColor};
}
${buttonSpecificCss}

@media (max-width: 1024px) {
    .custom-o-cards-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
}

@media (max-width: 768px) {
    .custom-o-card-title {
        font-size: ${mobileTitleFS}px;
    }
    .custom-o-card-description {
        font-size: ${mobileTextFS}px;
    }
    .custom-o-card-btn {
        font-size: ${mobileBtnFS}px;
    }
}`;


    const wrapperClass = appendCustomClass('custom-o-cards-grid', customWrapperClass);

    let html = `<div class="${wrapperClass}">\n`;
    for (let i = 0; i < count; i++) {
        const blockData = blocksContent[i];
        const isBlockLink = linkType === 'block';
        const tag = isBlockLink ? 'a' : 'div';
        const href = isBlockLink ? ` href="${blockData.linkUrl}"` : '';
        const itemClass = appendCustomClass(`custom-o-card-item${itemClassForHTML}`, customItemClass);

        html += `  <${tag}${href} class="${itemClass}">\n`;
        html += `    <div class="custom-o-card-bg" style="background-image: url('${blockData.imgSrc}');" role="img"></div>\n`;
        html += overlayHtml;
        html += `    <div class="custom-o-card-content">\n`;

        if (hasTitle) html += `      <div class="custom-o-card-title">${blockData.titleText}</div>\n`;
        if (hasText)  html += `      <div class="custom-o-card-description">${blockData.mainText}</div>\n`;

        if (hasBtn) {
            if (linkType === 'button') {
                html += `      <a href="${blockData.linkUrl}" class="custom-o-card-btn">${generalBtnText}</a>\n`;
            } else {
                html += `      <span class="custom-o-card-btn">${generalBtnText}</span>\n`;
            }
        }

        html += `    </div>\n`;
        html += `  </${tag}>\n`;
    }
    html += `</div>`;

    document.getElementById('o-css').value = css;
    document.getElementById('o-html').value = html;
    updateLiveDemoPreview(currentSection, css, html);
}

document.addEventListener('DOMContentLoaded', () => {
    updateOverlayContentFields();
    
    const countInput = document.getElementById('o-count');
    if (countInput) {
        countInput.addEventListener('change', () => {
            updateOverlayContentFields();
            generateOverlayCards();
        });
        countInput.addEventListener('blur', () => {
            updateOverlayContentFields();
            generateOverlayCards();
        });
    }

    setupLivePreview('overlay-section', () => generateOverlayCards());

    setTimeout(() => {
        generateOverlayCards();
    }, 100);
});