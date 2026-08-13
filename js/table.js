const TABLE_MAX_COLS = 6;
const TABLE_MAX_ROWS = 12;

function createContentFieldsForTableRow(rowIndex, cols) {
    const blockNum = rowIndex + 1;
    const isHead = rowIndex === 0;
    const blockDiv = document.createElement('div');
    blockDiv.className = 'settings-group collapsed';

    let cellsHtml = '';
    for (let c = 0; c < cols; c++) {
        const defaultVal = isHead ? `Заголовок ${c + 1}` : `Значение ${c + 1}`;
        cellsHtml += `
            <div class="control-group">
                <label for="t-cell-${c}-${rowIndex}">${isHead ? 'Заголовок' : 'Ячейка'} ${c + 1}:</label>
                <input type="text" id="t-cell-${c}-${rowIndex}" value="${defaultVal}" placeholder="${defaultVal}">
            </div>`;
    }

    blockDiv.innerHTML = `
        <div class="settings-group-header">Строка №${blockNum}${isHead ? ' (шапка)' : ''}</div>
        <div class="settings-group-body">
            ${cellsHtml}
        </div>
    `;
    return blockDiv;
}

function updateTableContentFields() {
    const cols = parseInt(document.getElementById('t-cols')?.value) || 1;
    const rows = parseInt(document.getElementById('t-rows')?.value) || 1;
    const container = document.getElementById('t-content-fields-container');
    if (!container) return;

    const existingContent = {};
    for (let r = 0; r < TABLE_MAX_ROWS; r++) {
        for (let c = 0; c < TABLE_MAX_COLS; c++) {
            const el = document.getElementById(`t-cell-${c}-${r}`);
            if (el) existingContent[`${c}-${r}`] = el.value;
        }
    }

    container.innerHTML = '';
    for (let r = 0; r < rows; r++) {
        const rowDiv = createContentFieldsForTableRow(r, cols);
        container.appendChild(rowDiv);
        for (let c = 0; c < cols; c++) {
            const el = document.getElementById(`t-cell-${c}-${r}`);
            if (el && existingContent[`${c}-${r}`] !== undefined) {
                el.value = existingContent[`${c}-${r}`];
            }
        }
    }
}

function generateTable() {
    const currentSection = document.getElementById('table-section');
    if (!currentSection) return;

    const settingsNames = [
        'cols', 'rows', 'first-header', 'featured-column', 'cell-padding', 'cell-gap',
        'radius', 'bg-color', 'header-bg-color', 'featured-color',
        'table-border', 'row-borders', 'border-width', 'column-borders', 'border-color', 'zebra', 'zebra-color', 'header-line',
        'header-font-size', 'bold-header', 'header-color',
        'cell-font-size', 'cell-color', 'align', 'bold-first-col',
        'custom-wrapper-class',
        'mobile-scroll', 'mobile-cards', 'mobile-header-font-size', 'mobile-cell-font-size'
    ];
    const settings = getSettings('t', settingsNames);

    const cols = Math.min(Math.max(parseInt(settings.cols) || 1, 1), TABLE_MAX_COLS);
    const rows = Math.min(Math.max(parseInt(settings.rows) || 1, 1), TABLE_MAX_ROWS);
    const firstHeader = !!settings['first-header'];
    let featuredColumn = parseInt(settings['featured-column']) || 0;
    if (featuredColumn > cols) featuredColumn = 0;
    const mobileCards = !!settings['mobile-cards'];
    const minRowWidth = Math.max(320, cols * 150);

    const wrapperClass = appendCustomClass('custom-table', settings['custom-wrapper-class']);

    const headerValues = [];
    for (let c = 0; c < cols; c++) {
        const hEl = document.getElementById(`t-cell-${c}-0`);
        headerValues[c] = (hEl?.value || '').trim() || `Колонка ${c + 1}`;
    }

    let html = `<div class="${wrapperClass}">\n`;
    html += `  <div class="custom-table-scroll">\n`;
    for (let r = 0; r < rows; r++) {
        const isHead = firstHeader && r === 0;
        const rowClass = isHead ? ' custom-table-row--head' : '';
        html += `    <div class="custom-table-row${rowClass}">\n`;
        for (let c = 0; c < cols; c++) {
            const el = document.getElementById(`t-cell-${c}-${r}`);
            const value = (el?.value || '').trim();
            let cellClass = 'custom-table-cell';
            if (isHead) cellClass += ' custom-table-cell--head';
            if (featuredColumn === c + 1) cellClass += ' custom-table-cell--featured';
            html += `      <div class="${cellClass}" data-label="${headerValues[c]}">${value || '&nbsp;'}</div>\n`;
        }
        html += `    </div>\n`;
    }
    html += `  </div>\n`;
    html += `</div>`;

    const headerWeight = settings['bold-header'] ? '600' : '400';
    const firstColWeight = settings['bold-first-col'] ? '600' : '400';
    const borderW = parseInt(settings['border-width']) || 1;
    const tableBorderCss = settings['table-border'] ? `\n    border: ${borderW}px solid ${settings['border-color']};` : '';
    const rowSepCss = settings['row-borders'] ? `
.custom-table-row:not(:last-child) {
    border-bottom: ${borderW}px solid ${settings['border-color']};
}` : '';
    const colSepCss = settings['column-borders'] ? `
.custom-table-cell:not(:last-child) {
    border-right: ${borderW}px solid ${settings['border-color']};
}` : '';

    let css = `.custom-table {
    border-radius: ${settings.radius}px;
    background: ${settings['bg-color']};
    overflow: hidden;${tableBorderCss}
}
.custom-table-scroll {
    overflow-x: auto;
}
.custom-table-scroll::-webkit-scrollbar {
    display: none;
}
.custom-table-row {
    display: grid;
    grid-template-columns: repeat(${cols}, 1fr);
    gap: ${settings['cell-gap']}px;
    background: ${settings['bg-color']};
}
.custom-table-cell {
    box-sizing: border-box;
    padding: ${settings['cell-padding']}px;
    font-size: ${settings['cell-font-size']}px;
    color: ${settings['cell-color']};
    text-align: ${settings.align};
}
.custom-table-row--head .custom-table-cell {
    font-size: ${settings['header-font-size']}px;
    font-weight: ${headerWeight};
    color: ${settings['header-color']};
    background: ${settings['header-bg-color']};
}
.custom-table-cell--featured,
.custom-table-row--head .custom-table-cell--featured {
    background: ${settings['featured-color']};
}${colSepCss}${rowSepCss}`;

    if (firstHeader && settings['header-line']) {
        css += `
.custom-table-row.custom-table-row--head {
    border-bottom: 2px solid ${settings['border-color']};
}`;
    }
    if (settings['bold-first-col']) {
        css += `
.custom-table-row .custom-table-cell:first-child {
    font-weight: ${firstColWeight};
}`;
    }
    if (settings.zebra) {
        css += `
.custom-table-row:nth-child(even):not(.custom-table-row--head) .custom-table-cell:not(.custom-table-cell--featured) {
    background: ${settings['zebra-color']};
}`;
    }
    if (mobileCards) {
        css += `
@media (max-width: 768px) {
    .custom-table {
        background: transparent;
        border-radius: 0;
        border: none;
        overflow: visible;
    }
    .custom-table-scroll {
        overflow-x: visible;
    }
    .custom-table-row {
        display: block;
        background: ${settings['bg-color']};
        border-bottom: none;
        border-radius: ${settings.radius}px;
        margin-bottom: 12px;
        overflow: hidden;
    }
    .custom-table-row--head {
        display: none;
    }
    .custom-table-cell {
        padding: 8px 12px;
        border-right: none;
        font-size: ${settings['mobile-cell-font-size']}px;
    }
    .custom-table-cell:not(:first-child)::before {
        content: attr(data-label) ': ';
        font-weight: 600;
        color: ${settings['header-color']};
    }
    .custom-table-row .custom-table-cell:first-child {
        font-weight: 600;
        color: ${settings['header-color']};
        font-size: ${settings['mobile-header-font-size']}px;
    }
}`;
    } else {
        css += `
@media (max-width: 768px) {
    .custom-table-row {
        min-width: ${minRowWidth}px;
    }
    .custom-table-row--head .custom-table-cell {
        font-size: ${settings['mobile-header-font-size']}px;
    }
    .custom-table-cell {
        font-size: ${settings['mobile-cell-font-size']}px;
    }
}`;
    }

    document.getElementById('t-css').value = css;
    document.getElementById('t-html').value = html;

    updateLiveDemoPreview(currentSection, css, html);
}

document.addEventListener('DOMContentLoaded', () => {
    updateTableContentFields();

    const colsInput = document.getElementById('t-cols');
    const rowsInput = document.getElementById('t-rows');
    if (colsInput) {
        colsInput.addEventListener('change', () => { updateTableContentFields(); generateTable(); });
        colsInput.addEventListener('blur', () => { updateTableContentFields(); generateTable(); });
    }
    if (rowsInput) {
        rowsInput.addEventListener('change', () => { updateTableContentFields(); generateTable(); });
        rowsInput.addEventListener('blur', () => { updateTableContentFields(); generateTable(); });
    }

    setupLivePreview('table-section', () => generateTable());

    setTimeout(() => {
        generateTable();
    }, 100);
});