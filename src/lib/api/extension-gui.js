import LazyScratchBlocks from '../tw-lazy-scratch-blocks';
import AddonHooks from '../../addons/hooks';

import WindowManager from '../../addons/window-system/window-manager';
import * as BrowserGit from '../git/browser-git';
import twExtensionTranslations from '../libraries/extensions/tw-extension-translations';

/**
 * Collect all block-level translations from tw-extension-translations.
 * Returns a map of locale → { translationId: translatedText }
 * @returns {object}
 */
const collectBlockTranslations = () => {
    const result = {};
    for (const extId of Object.keys(twExtensionTranslations)) {
        const ext = twExtensionTranslations[extId];
        if (!ext.blockTranslations) continue;
        for (const locale of Object.keys(ext.blockTranslations)) {
            if (!result[locale]) result[locale] = {};
            Object.assign(result[locale], ext.blockTranslations[locale]);
        }
    }
    return result;
};

// Pre-compute the merged block translations
const allBlockTranslations = collectBlockTranslations();

/**
 * Implements Scratch.gui API for unsandboxed extensions.
 * @param {any} Scratch window.Scratch, mutated in place.
 */
const implementGuiAPI = Scratch => {
    Scratch.gui = {
        /**
         * Lazily get the internal ScratchBlocks object when it becomes available. It may never be
         * available if, for example, the user never enters the editor.
         *
         * You should not assume that ScratchBlocks becoming available means the user is actually
         * in the editor or that a workspace has been created already.
         *
         * @returns {Promise<any>} Promise that may eventually resolve to ScratchBlocks
         */
        getBlockly: () => {
            if (AddonHooks.blockly) {
                return Promise.resolve(AddonHooks.blockly);
            }
            return new Promise(resolve => {
                AddonHooks.blocklyCallbacks.push(() => resolve(AddonHooks.blockly));
            });
        },

        /**
         * Get the internal ScratchBlocks object as soon as possible. This lets you access it even
         * if the user never enters the editor.
         *
         * This method is VERY SLOW and will cause A LOT OF CPU AND NETWORK ACTIVITY because it
         * downloads and evaluates all of scratch-blocks, a multi-megabyte JavaScript bundle.
         *
         * @returns {Promise<any>} Promise that will resolve to ScratchBlocks.
         */
        getBlocklyEagerly: () => LazyScratchBlocks.load(),

        // Expose the window manager on the VM for addons/integration.
        wm: WindowManager,

        // Expose MistWarp's browser git integration on the VM.
        git: BrowserGit
    };

    // Inject block-level translations for TurboWarp extensions.
    // The extensions use Scratch.translate() which creates IDs like '_fill sprite with camera'.
    // We wrap translate.setup to merge our translations with whatever the extension provides.
    if (Scratch.translate && Scratch.translate.setup) {
        const originalSetup = Scratch.translate.setup;
        Scratch.translate.setup = (newTranslations) => {
            const locale = (Scratch.translate.language || '').toLowerCase();
            const ourTranslations = allBlockTranslations[locale] || {};

            let merged = newTranslations;
            if (Object.keys(ourTranslations).length > 0) {
                merged = Object.assign({}, ourTranslations, newTranslations || {});
            }

            originalSetup.call(Scratch.translate, merged !== newTranslations ? merged : newTranslations);
        };
    }
};

export default implementGuiAPI;
