// HideYandexLogo — скрывает цветное лого Яндекс Музыки
// Стили лого реализованы в style.css, скрипт управляет настройкой «Скрыть кнопку сайдбара»

// ─── PulseSync Settings API ───────────────────────────────────────────────────

function getAddonSettings(addonName) {
    return (
        window.pulsesyncApi?.getSettings(addonName) ?? {
            getCurrent: () => ({}),
            onChange: () => () => {},
        }
    );
}

function transformSettings(raw) {
    const result = {};

    for (const [key, entry] of Object.entries(raw)) {
        if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
            result[key] = {
                value: entry?.value ?? entry?.default ?? null,
                default: entry?.default ?? null,
            };
        } else {
            result[key] = { value: entry, default: entry };
        }
    }

    return result;
}

// ─── Текущее состояние ────────────────────────────────────────────────────────

let currentHideCollapse = null;

// ─── Apply-функции ────────────────────────────────────────────────────────────

function applyCollapseButton() {
    const btn = document.querySelector('.NavbarDesktop_collapseButton__XQh9d');
    if (!btn) return;

    if (currentHideCollapse) {
        btn.style.setProperty('display', 'none', 'important');
    } else {
        btn.style.removeProperty('display');
    }
}

// ─── Применение настроек ──────────────────────────────────────────────────────

function applySettings(settings) {
    const hideCollapse = settings?.hideCollapseButton?.value ?? false;

    if (hideCollapse !== currentHideCollapse) {
        currentHideCollapse = hideCollapse;
        applyCollapseButton();
    }
}

// ─── MutationObserver — восстанавливает стили при изменениях DOM ──────────────

const observer = new MutationObserver(() => {
    applyCollapseButton();
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class'],
});

// ─── Инициализация ────────────────────────────────────────────────────────────

const settingsStore = getAddonSettings('HideYandexLogo');

applySettings(transformSettings(settingsStore.getCurrent()));

settingsStore.onChange(rawSettings => {
    applySettings(transformSettings(rawSettings));
});
