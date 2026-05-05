let copyJsCodeExtensionInitialized = false;

const initializeBlockDisableExtension = vm => {
    if (copyJsCodeExtensionInitialized) return;
    copyJsCodeExtensionInitialized = true;

    console.log('[CopyJSCode] Initializing Copy JS Code extension with VM:', vm);
    
    const tryInitialize = () => {
        const ScratchBlocks = window.ScratchBlocks || window.Blockly;
        console.log('[CopyJSCode] Checking ScratchBlocks/Blockly:', {
            hasScratchBlocks: !!window.ScratchBlocks,
            hasBlockly: !!window.Blockly,
            ScratchBlocks: ScratchBlocks
        });

        if (!ScratchBlocks) {
            console.warn('[CopyJSCode] ScratchBlocks/Blockly not available yet, retrying...');
            setTimeout(tryInitialize, 100);
            return;
        }

        if (!ScratchBlocks.ContextMenu || !ScratchBlocks.ContextMenu.show) {
            console.warn('[CopyJSCode] ContextMenu not available yet, retrying...');
            setTimeout(tryInitialize, 100);
            return;
        }

        console.log('[CopyJSCode] Patching ScratchBlocks.ContextMenu.show');
        const originalShow = ScratchBlocks.ContextMenu.show;
        ScratchBlocks.ContextMenu.show = function (event, items, rtl) {
            console.log('[CopyJSCode] Patched ContextMenu.show called');
            
            const gesture = ScratchBlocks.mainWorkspace && ScratchBlocks.mainWorkspace.currentGesture_;
            const block = gesture && gesture.targetBlock_;
            
            if (block) {
                console.log('[CopyJSCode] Context menu for block:', {
                    blockId: block.id,
                    blockType: block.type
                });

                const isHatBlock = !block.getPreviousBlock();
                console.log('[CopyJSCode] Checking conditions:', {
                    isHatBlock: isHatBlock,
                    hasGetBlockCompiledSource: !!vm.getBlockCompiledSource
                });
                
                if (isHatBlock && vm.getBlockCompiledSource) {
                    console.log('[CopyJSCode] Adding Copy JS Code menu item');
                    items.push({
                        enabled: true,
                        text: 'Copy JS Code',
                        callback: () => {
                            try {
                                const jsCode = vm.getBlockCompiledSource(block.id);
                                if (jsCode) {
                                    navigator.clipboard.writeText(jsCode).then(() => {
                                        console.log('[CopyJSCode] JavaScript code copied to clipboard:', jsCode);
                                        if (window.addon && window.addon.tab && window.addon.tab.redux && window.addon.tab.redux.dispatch) {
                                            window.addon.tab.redux.dispatch({
                                                type: 'alerts/addAlert',
                                                message: 'JavaScript code copied to clipboard',
                                                alertType: 'info'
                                            });
                                        }
                                    }).catch(err => {
                                        console.error('[CopyJSCode] Failed to copy to clipboard:', err);
                                    });
                                } else {
                                    console.warn('[CopyJSCode] No compiled JavaScript code available for block:', block.id);
                                }
                            } catch (error) {
                                console.error('[CopyJSCode] Error getting compiled JavaScript code:', error);
                            }
                        },
                        separator: true
                    });
                }
            }
            
            return originalShow.call(this, event, items, rtl);
        };

        console.log('[CopyJSCode] Extension initialized successfully');
    };

    tryInitialize();
};

export default initializeBlockDisableExtension;