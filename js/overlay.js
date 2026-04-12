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

function generateOverlayCards(buttonElement) {
    const currentSection = buttonElement.closest('.section');
    if (!currentSection) {
        console.error('Parent section not found for the button.');
        return;
    }

    const overlaySettingNames = [
        'count', 'link', 'ratio', 'align', 'valign', 'radius',
        'title', 'text', 'btn'
    ];
    const settings = getSettings('o', overlaySettingNames);

    const {
        count, link: linkType, ratio, align: alignH, valign: alignV, radius,
        title: hasTitle, text: hasText, btn: hasBtn
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

    let gradient = "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)";

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
    } else if (alignV === 'flex-start') {
        gradient = "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)";
    } else if (alignV === 'center') {
        gradient = "rgba(0,0,0,0.4)";
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

.custom-o-card-content {
    position: relative;
    z-index: 3;
    padding: 25px;
    text-align: ${alignH};
    box-sizing: border-box;
    ${contentFlexProperties}
}

.custom-o-card-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0 0 10px 0;
    line-height: 1.2;
}

.custom-o-card-title+.custom-o-card-btn {
    margin-top: 10px;
}

.custom-o-card-description {
    font-size: 1rem;
    margin-bottom: 20px;
    opacity: 0.9;
    line-height: 1.4;
}

.custom-o-card-btn {
    display: inline-block;
    padding: 10px 24px;
    background-color: #ffffff;
    color: #000000;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 600;
    transition: all 0.3s;
}

.custom-o-card-btn:hover {
    background-color: #f0f0f0;
}
${buttonSpecificCss}

@media (max-width: 1024px) {
    .custom-o-cards-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
}`;


    let html = `<div class="custom-o-cards-grid">\n`;
    for (let i = 0; i < count; i++) {
        const blockData = blocksContent[i];
        const isBlockLink = linkType === 'block';
        const tag = isBlockLink ? 'a' : 'div';
        const href = isBlockLink ? ` href="${blockData.linkUrl}"` : '';

        html += `  <${tag}${href} class="custom-o-card-item${itemClassForHTML}">\n`;
        html += `    <div class="custom-o-card-bg" style="background-image: url('${blockData.imgSrc}');" role="img"></div>\n`;
        html += `    <div class="custom-o-card-overlay"></div>\n`;
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
    document.getElementById('o-count').addEventListener('blur', updateOverlayContentFields);
});