function updateLiveDemoPreview(currentSection, css, html) {
    const outputsDiv = currentSection.querySelector('.outputs');
    if (!outputsDiv) {
        console.error('Элемент .outputs не найден в секции.', currentSection);
        return;
    }

    const sectionId = currentSection.id;
    const demoSectionId = `live-demo-section-${sectionId}`;

    let existingDemoSection = document.getElementById(demoSectionId);
    if (existingDemoSection) {
        existingDemoSection.remove();
    }

    const liveDemoSection = document.createElement('div');
    liveDemoSection.id = demoSectionId;
    liveDemoSection.className = 'live-demo-wrapper';

    const demoHeader = document.createElement('h3');
    demoHeader.textContent = 'Предварительный просмотр:';
    liveDemoSection.appendChild(demoHeader);

    const styleElement = document.createElement('style');
    styleElement.textContent = css;
    liveDemoSection.appendChild(styleElement); 

    const demoContainer = document.createElement('div');
    demoContainer.innerHTML = html;
    liveDemoSection.appendChild(demoContainer);

    currentSection.insertBefore(liveDemoSection, outputsDiv);
}     

function getSettings(prefix, settingNames) {
    const settings = {};
    settingNames.forEach(name => {
        const element = document.getElementById(`${prefix}-${name}`);
        if (element) {
            if (element.type === 'checkbox') {
                settings[name] = element.checked;
            } else {
                settings[name] = element.value;
            }
        } else {
            console.warn(`Element with ID '${prefix}-${name}' not found.`);
        }
    });
    return settings;
}

function sanitizeCustomClasses(value) {
    return (value || '').trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, ' ').trim();
}

function appendCustomClass(baseClasses, customClass) {
    const sanitized = sanitizeCustomClasses(customClass);
    if (!sanitized) return baseClasses;
    return `${baseClasses} ${sanitized}`;
}

function copyToClipboard(elementId, btn) {
    const textArea = document.getElementById(elementId);
    
    navigator.clipboard.writeText(textArea.value).then(() => {
        const originalText = btn.innerText;
        btn.innerText = 'Скопировано';
        btn.style.backgroundColor = '#2ecc71';
        btn.style.color = '#fff';

        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = '';
            btn.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Ошибка при копировании: ', err);
    });
}

function setupLivePreview(sectionId, generateFunction) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    section.addEventListener('input', (e) => {
        if (e.target.type !== 'checkbox' && e.target.type !== 'radio' && e.target.type !== 'color' && !e.target.id.includes('count')) {
            generateFunction();
        }
    });
    section.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox' || e.target.type === 'color' || e.target.tagName === 'SELECT') {
            generateFunction();
        }
    });
}

function setupStickyNav() {
    const stickyNav = document.getElementById('sticky-nav');
    if (!stickyNav) return;

    const menu = document.getElementById('menu');
    const sections = document.querySelectorAll('.section');
    const mainTextField = document.getElementById('main-text-field');

    function updateStickyNavVisibility() {
        const anySectionVisible = Array.from(sections).some(s => s.style.display === 'block');
        if (anySectionVisible) {
            stickyNav.classList.add('visible');
        } else {
            stickyNav.classList.remove('visible');
        }
    }

    const observer = new MutationObserver(() => updateStickyNavVisibility());
    sections.forEach(s => observer.observe(s, { attributes: true, attributeFilter: ['style'] }));
    updateStickyNavVisibility();

    document.getElementById('nav-back')?.addEventListener('click', (e) => {
        e.preventDefault();
        sections.forEach(s => s.style.display = 'none');
        menu.style.display = 'flex';
        if (mainTextField) mainTextField.style.display = 'block';
        history.replaceState(null, '', window.location.pathname);
    });

    document.getElementById('nav-settings')?.addEventListener('click', (e) => {
        e.preventDefault();
        const visibleSection = Array.from(sections).find(s => s.style.display === 'block');
        if (visibleSection) {
            const controls = visibleSection.querySelector('.controls');
            if (controls) controls.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    document.getElementById('nav-preview')?.addEventListener('click', (e) => {
        e.preventDefault();
        const visibleSection = Array.from(sections).find(s => s.style.display === 'block');
        if (visibleSection) {
            const demo = visibleSection.querySelector('.live-demo-wrapper');
            if (demo) demo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    document.getElementById('nav-code')?.addEventListener('click', (e) => {
        e.preventDefault();
        const visibleSection = Array.from(sections).find(s => s.style.display === 'block');
        if (visibleSection) {
            const outputs = visibleSection.querySelector('.outputs');
            if (outputs) outputs.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    document.getElementById('nav-top')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function setupAccordion() {
    const groups = document.querySelectorAll('.settings-group');
    groups.forEach((group) => {
        group.classList.add('collapsed');
    });

    document.addEventListener('click', (e) => {
        const header = e.target.closest('.settings-group-header');
        if (header) {
            const group = header.closest('.settings-group');
            if (group) {
                group.classList.toggle('collapsed');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {

    setupStickyNav();
    setupAccordion();

    document.addEventListener('click', (e) => {
        if (!e.target.classList.contains('tab-btn')) return;

        const button = e.target;
        const container = button.closest('.settings-tabs-container');
        const tabName = button.getAttribute('data-tab');
        const targetContent = container.querySelector(tabName === 'content' ? '.content-settings' : '.advanced-settings');
        
        const isAlreadyActive = button.classList.contains('active');

        container.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        container.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));

        if (!isAlreadyActive) {
            button.classList.add('active');
            targetContent.classList.remove('hidden');
        }
    });

    const menu = document.getElementById('menu');
    const mainTextField = document.getElementById('main-text-field');
    const menuLinks = document.querySelectorAll('.menu-item > a'); 
    const sections = document.querySelectorAll('.section');

    function hideAllSections() {
        sections.forEach(section => {
            section.style.display = 'none';
        });
    }

    function showMenu() {
        menu.style.display = 'flex';
        if (mainTextField) mainTextField.style.display = 'block';
    }

    function hideMenu() {
        menu.style.display = 'none';
        if (mainTextField) mainTextField.style.display = 'none';
    }

    function showMenuAndClearHash() {
        hideAllSections();
        showMenu();
        history.replaceState(null, '', window.location.pathname); 
    }

    function showSection(sectionId) {
        hideAllSections();
        hideMenu();
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            window.location.hash = sectionId;
        } else {
            console.error(`Секция с ID "${sectionId}" не найдена.`);
            showMenuAndClearHash();
        }
    }

    hideAllSections();

    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        showSection(initialHash);
    } else {
        showMenu();
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetSectionId = link.getAttribute('href').substring(1);
            showSection(targetSectionId);
        });
    });

    window.addEventListener('hashchange', () => {
        const currentHash = window.location.hash.substring(1);
        if (currentHash) {
            showSection(currentHash);
        } else {
            showMenuAndClearHash();
        }
    });
});

function validateNumberInput(inputElement) {
    let value = parseFloat(inputElement.value);
    const min = parseFloat(inputElement.min);
    const max = parseFloat(inputElement.max);

    if (isNaN(value)) {
        inputElement.value = min;
        return;
    }

    if (value < min) {
        inputElement.value = min;
    } else if (value > max) {
        inputElement.value = max;
    }
}

const validatedInputs = document.querySelectorAll('.js-number-validate');

validatedInputs.forEach(inputElement => {

    inputElement.addEventListener('blur', function() {
        validateNumberInput(this);
    });

    validateNumberInput(inputElement);
});

const DEFAULT_HOVER_SHADOW_VALUE = "0 5px 15px rgba(0,0,0,0.1)";

function updateHoverShadowInputDefault(prefix) {
    const linkSelect = document.getElementById(`${prefix}-link`);
    const shadowHoverInput = document.getElementById(`${prefix}-shadow-hover-value`);
    const hasShadowHoverCheckbox = document.getElementById(`${prefix}-has-shadow-hover`);

    if (!linkSelect || !shadowHoverInput || !hasShadowHoverCheckbox) return;

    const isLinkBlock = linkSelect.value === 'block';

    if (isLinkBlock) {
        if (shadowHoverInput.value.trim() === '' || shadowHoverInput.value === '0 5px 15px rgba(0,0,0,0.2)') {
            shadowHoverInput.value = DEFAULT_HOVER_SHADOW_VALUE;
            if (!hasShadowHoverCheckbox.checked) {
                hasShadowHoverCheckbox.checked = true;
                hasShadowHoverCheckbox.dispatchEvent(new Event('change'));
            }
        }
    } else {
        if (shadowHoverInput.value === DEFAULT_HOVER_SHADOW_VALUE) {
            shadowHoverInput.value = '';
            if (hasShadowHoverCheckbox.checked) {
                hasShadowHoverCheckbox.checked = false;
                hasShadowHoverCheckbox.dispatchEvent(new Event('change'));
            }
        }
    }
}

function setupShadowToggles(prefix) {
    const enableShadowCheckbox = document.getElementById(`${prefix}-enable-shadow`);
    const shadowSettingsGroup = document.getElementById(`${prefix}-shadow-settings-group`);
    
    const hasShadowAlwaysCheckbox = document.getElementById(`${prefix}-has-shadow-always`);
    const shadowAlwaysValueInput = document.getElementById(`${prefix}-shadow-always-value`);

    const hasShadowHoverCheckbox = document.getElementById(`${prefix}-has-shadow-hover`);
    const shadowHoverValueInput = document.getElementById(`${prefix}-shadow-hover-value`);

    const updateVisibility = (checkbox, targetElement) => {
        if (targetElement) {
            if (checkbox && checkbox.checked) {
                targetElement.classList.remove('hidden');
            } else {
                targetElement.classList.add('hidden');
            }
        }
    };

    if (enableShadowCheckbox && shadowSettingsGroup) {
        enableShadowCheckbox.addEventListener('change', () => updateVisibility(enableShadowCheckbox, shadowSettingsGroup));
        updateVisibility(enableShadowCheckbox, shadowSettingsGroup);
    }
    if (hasShadowAlwaysCheckbox && shadowAlwaysValueInput) {
        hasShadowAlwaysCheckbox.addEventListener('change', () => updateVisibility(hasShadowAlwaysCheckbox, shadowAlwaysValueInput));
        updateVisibility(hasShadowAlwaysCheckbox, shadowAlwaysValueInput);
    }
    if (hasShadowHoverCheckbox && shadowHoverValueInput) {
        hasShadowHoverCheckbox.addEventListener('change', () => updateVisibility(hasShadowHoverCheckbox, shadowHoverValueInput));
        updateVisibility(hasShadowHoverCheckbox, shadowHoverValueInput);
    }

    const linkSelect = document.getElementById(`${prefix}-link`);
    if (linkSelect) {
        linkSelect.addEventListener('change', () => {
            updateHoverShadowInputDefault(prefix);
        });
    }

    updateHoverShadowInputDefault(prefix);
}