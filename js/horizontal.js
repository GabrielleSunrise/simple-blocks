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
        'count', 'link', 'reverse', 'title', 'text', 'btn', 'img-width'
    ];
    const settings = getSettings('h', horizontalSettingNames);

    const {
        count, link: linkType, reverse: startReverse,
        title: hasTitle, text: hasText, btn: hasBtn,
        'img-width': imgWidth
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

    const contentWidth = 100 - parseInt(imgWidth, 10);

    let css = `.h-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 20px 0;
}
.custom-card-row {
    display: flex;
    align-items: center;
    gap: 30px;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-sizing: border-box;
    width: 100%;
    transition: 0.2s;
}
a.custom-card-row:hover {
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
.custom-card-row.reverse {
    flex-direction: row-reverse;
}
.custom-card-row-content {
    flex-grow: 1;
}
.custom-card-row .custom-card-row-img {
    margin-bottom: 0;
    flex: 0 0 ${imgWidth}%;
    width: ${imgWidth}%;
}
.custom-card-row-img {
    width: 100%;
    height: auto;
    display: block;
    margin-bottom: 15px;
    border-radius: 4px;
    aspect-ratio: 3/2;
    object-fit: cover;
}
.custom-card-row-title {
    font-size: 1.25rem;
    margin: 0 0 10px 0;
    color: #333;
    font-weight: 600;
}
.custom-card-row-text {
    font-size: 1rem;
    margin-bottom: 15px;
    color: #666;
}
.custom-card-row-btn {
    display: inline-block;
    padding: 10px 20px;
    background: #3498db;
    color: #fff;
    text-decoration: none;
    border-radius: 4px;
    border: none;
    text-align: center;
}
.custom-card-row-btn:hover {
    background: #2980b9;
}
a.custom-card-row, a.custom-card-row-btn-link {
    text-decoration: none;
    color: inherit;
}

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

    let html = `<div class="h-container">\n`;
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
        html += `  <${tag}${attr} class="custom-card-row${reverseClass}">\n`;

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
    updateHorizontalContentFields();
    document.getElementById('h-count').addEventListener('blur', updateHorizontalContentFields);
});