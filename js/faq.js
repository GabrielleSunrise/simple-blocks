function createContentFieldsForFaq(index) {
    const blockNum = index + 1;
    const blockDiv = document.createElement('div');
    blockDiv.className = 'block-content-inputs';

    blockDiv.innerHTML = `
        <h4>Вопрос №${blockNum}</h4>
        <div class="control-group">
            <label for="f-block-${index}-title">Вопрос:</label>
            <input type="text" id="f-block-${index}-title" value="Частый вопрос номер ${blockNum}?" placeholder="Текст вопроса">
        </div>
        <div class="control-group">
            <label for="f-block-${index}-text">Ответ:</label>
            <textarea id="f-block-${index}-text" rows="3" placeholder="Текст ответа.">Подробный ответ на вопрос номер ${blockNum}. Здесь вы можете описать детали, условия работы, гарантии или любую другую важную информацию.</textarea>
        </div>
    `;
    return blockDiv;
}

function updateFaqContentFields() {
    const countInput = document.getElementById('f-count');
    if (!countInput) return;
    const count = parseInt(countInput.value) || 1;
    const container = document.getElementById('f-content-fields-container');
    if (!container) return;

    const existingContent = {};
    for (let i = 0; i < 20; i++) {
        const titleEl = document.getElementById(`f-block-${i}-title`);
        const textEl = document.getElementById(`f-block-${i}-text`);
        if (titleEl && textEl) {
            existingContent[i] = {
                title: titleEl.value,
                text: textEl.value
            };
        }
    }

    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        container.appendChild(createContentFieldsForFaq(i));
        if (existingContent[i]) {
            document.getElementById(`f-block-${i}-title`).value = existingContent[i].title;
            document.getElementById(`f-block-${i}-text`).value = existingContent[i].text;
        }
    }
}

function generateFaq() {
    const currentSection = document.getElementById('faq-section');
    if (!currentSection) return;

    const settingsNames = [
        'count', 'gap', 'padding', 'radius',
        'has-border', 'border-color', 'border-width',
        'title-font-size', 'title-color', 'bold-title',
        'text-font-size', 'text-color',
        'icon-type', 'icon-color', 'custom-wrapper-class', 'custom-item-class',
        'title-bg-color', 'title-hover-bg-color', 'content-bg-color'
    ];

    const settings = getSettings('f', settingsNames);
    
    const count = settings.count || 1;
    const blocksContent = [];
    for (let i = 0; i < count; i++) {
        const titleEl = document.getElementById(`f-block-${i}-title`);
        const textEl = document.getElementById(`f-block-${i}-text`);
        blocksContent.push({
            title: (titleEl?.value || '').trim() || `Вопрос ${i + 1}`,
            text: (textEl?.value || '').trim() || `Ответ ${i + 1}`
        });
    }

    const borderCss = settings['has-border'] ? `\n    border: ${settings['border-width']}px solid ${settings['border-color']};` : '';
    const titleWeight = settings['bold-title'] ? 'bold' : 'normal';
    
    const wrapperClass = appendCustomClass('custom-faq-container', settings['custom-wrapper-class']);
    const itemClass = appendCustomClass('custom-faq-item', settings['custom-item-class']);

    let html = `<div class="${wrapperClass}">\n`;
    for (let i = 0; i < count; i++) {
        html += `  <div class="${itemClass}">\n`;
        html += `    <input type="checkbox" id="faq-${i}" class="custom-faq-input">\n`;
        html += `    <label for="faq-${i}" class="custom-faq-title">\n`;
        html += `      <span class="custom-faq-title-text">${blocksContent[i].title}</span>\n`;
        if (settings['icon-type'] === 'plus') {
            html += `      <span class="custom-faq-icon-plus"></span>\n`;
        } else {
            html += `      <span class="custom-faq-icon-chevron"></span>\n`;
        }
        html += `    </label>\n`;
        html += `    <div class="custom-faq-content">\n`;
        html += `      <div class="custom-faq-content-inner">\n`;
        html += `        ${blocksContent[i].text.replace(/\n/g, '<br>')}\n`; 
        html += `      </div>\n`;
        html += `    </div>\n`;
        html += `  </div>\n`;
    }
    html += `</div>`;

    let css = `.${wrapperClass.split(' ')[0]} {
    display: flex;
    flex-direction: column;
    gap: ${settings.gap}px;
    width: 100%;
    padding: 20px 0;
}
.${itemClass.split(' ')[0]} {
    ${borderCss}
    border-radius: ${settings.radius}px;
    overflow: hidden;
}
.custom-faq-input {
    position: absolute;
    opacity: 0;
    height: 0;
    width: 0;
    pointer-events: none;
}
.custom-faq-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${settings.padding}px;
    cursor: pointer;
    font-weight: ${titleWeight};
    font-size: ${settings['title-font-size']}px;
    color: ${settings['title-color']};
    margin: 0;
    user-select: none;
    transition: background-color 0.2s;
    background-color: ${settings['title-bg-color']};
}
.custom-faq-title:hover {
    background-color: ${settings['title-hover-bg-color']};
}
.custom-faq-title-text {
    padding-right: 15px;
}
`;
    if (settings['icon-type'] === 'plus') {
        css += `.custom-faq-icon-plus {
    position: relative;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}
.custom-faq-icon-plus::before, .custom-faq-icon-plus::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    background-color: ${settings['icon-color']};
    transform: translate(-50%, -50%);
    transition: transform 0.3s ease;
}
.custom-faq-icon-plus::before {
    width: 16px;
    height: 2px;
}
.custom-faq-icon-plus::after {
    width: 2px;
    height: 16px;
}
.custom-faq-input:checked + .custom-faq-title .custom-faq-icon-plus::after {
    transform: translate(-50%, -50%) rotate(90deg);
}
`;
    } else {
        css += `.custom-faq-icon-chevron {
    position: relative;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}
.custom-faq-icon-chevron::before {
    content: '';
    position: absolute;
    top: 40%;
    left: 50%;
    width: 8px;
    height: 8px;
    border-bottom: 2px solid ${settings['icon-color']};
    border-right: 2px solid ${settings['icon-color']};
    transform: translate(-50%, -50%) rotate(45deg);
    transition: transform 0.3s ease;
}
.custom-faq-input:checked + .custom-faq-title .custom-faq-icon-chevron::before {
    transform: translate(-50%, -10%) rotate(-135deg);
}
`;
    }
    
    css += `.custom-faq-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease, opacity 0.4s ease;
    opacity: 0;
    font-size: ${settings['text-font-size']}px;
    color: ${settings['text-color']};
    background-color: ${settings['content-bg-color']};
}
.custom-faq-content-inner {
    padding: ${settings.padding}px ${settings.padding}px ${settings.padding}px ${settings.padding}px;
}
.custom-faq-input:checked ~ .custom-faq-content {
    max-height: 2000px;
    opacity: 1;
}
`;

    document.getElementById('f-css').value = css;
    document.getElementById('f-html').value = html;

    updateLiveDemoPreview(currentSection, css, html);
}

document.addEventListener('DOMContentLoaded', () => {
    updateFaqContentFields();
    
    const countInput = document.getElementById('f-count');
    if (countInput) {
        countInput.addEventListener('change', () => {
            updateFaqContentFields();
            generateFaq();
        });
        countInput.addEventListener('blur', () => {
            updateFaqContentFields();
            generateFaq();
        });
    }
    
    const faqSection = document.getElementById('faq-section');
    if (faqSection) {
        faqSection.addEventListener('input', (e) => {
            if (e.target.id !== 'f-count' && e.target.type !== 'checkbox' && e.target.type !== 'radio' && e.target.type !== 'color') {
                generateFaq();
            }
        });
        faqSection.addEventListener('change', (e) => {
            if (e.target.closest('.live-demo-wrapper')) return;
            if (e.target.id !== 'f-count' && (e.target.type === 'checkbox' || e.target.type === 'color' || e.target.tagName === 'SELECT')) {
                generateFaq();
            }
        });
    }

    setTimeout(() => {
        generateFaq();
    }, 100);
});