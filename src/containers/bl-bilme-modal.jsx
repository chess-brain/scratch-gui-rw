import {connect} from 'react-redux';
import {closeBilmeModal, MODAL_WARPTHEME} from '../reducers/modals';
import {setTheme} from '../reducers/theme';
import {applyTheme} from '../lib/themes/themePersistance';
import {CustomTheme, customThemeManager} from '../lib/themes/custom-themes';
import BilmeModal from '../components/bl-bilme/bilme-modal.jsx';

const mapStateToProps = state => ({
    visible: state.scratchGui.modals[MODAL_WARPTHEME]
});

const mapDispatchToProps = dispatch => ({
    onClose: () => {
        dispatch(closeBilmeModal());
    },
    onThemeApply: async themeData => {
        try {
            console.log('Applying theme:', themeData);
            
            // 验证主题数据格式
            if (!themeData || typeof themeData !== 'object') {
                throw new Error('Invalid theme data format');
            }
            
            // 处理 Bilme API 返回的主题数据格式：{ themes: [{ accent, gui, blocks, ... }] }
            let themeConfig = themeData;
            if (themeData.themes && Array.isArray(themeData.themes) && themeData.themes.length > 0) {
                themeConfig = themeData.themes[0];
                console.log('Using theme config from themes array:', themeConfig);
            }
            
            // 验证主题配置
            if (!themeConfig || typeof themeConfig !== 'object') {
                throw new Error('Invalid theme config format');
            }
            
            // 检查是否缺少必要属性，如果缺少则设置默认值
            if (!themeConfig.name) {
                themeConfig.name = 'Bilme Theme';
                console.log('Added default name: Bilme Theme');
            }
            
            if (!themeConfig.gui) {
                themeConfig.gui = 'light'; // 默认使用 light GUI
                console.log('Added default gui: light');
            }
            
            if (!themeConfig.blocks) {
                themeConfig.blocks = 'three'; // 默认使用 three blocks
                console.log('Added default blocks: three');
            }
            
            // 确保 accent 数据格式正确
            if (themeConfig.accent && typeof themeConfig.accent === 'object' && Array.isArray(themeConfig.accent.colors)) {
                console.log('Processing gradient theme');
            }
            
            // 创建自定义主题
            const customTheme = CustomTheme.import(themeConfig);
            console.log('Custom theme created:', customTheme);
            
            // 应用主题
            applyTheme(customTheme);
            console.log('Theme applied to DOM');
            
            // 分发主题更新
            dispatch(setTheme(customTheme));
            console.log('Theme update dispatched');
            
            // 关闭模态窗口
            dispatch(closeBilmeModal());
            
            console.log('Theme applied successfully');
        } catch (error) {
            console.error('Error applying theme:', error);
            console.error('Error stack:', error.stack);
            // 显示错误提示
            alert(`主题应用失败: ${error.message}`);
        }
    },
    onPixelThemeApply: async theme => {
        try {
            console.log('[DEBUG] onPixelThemeApply called for:', theme.name, 'UUID:', theme.uuid);
            
            // 关闭主题商店模态窗口
            dispatch(closeBilmeModal());
            
            // 获取像素主题数据
            const response = await fetch(
                `https://theme.bilup.org/api/theme/export?uuid=${theme.uuid}&platform=bilup`
            );
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch theme: ${response.status} ${response.statusText} - ${errorText}`);
            }
            
            const themeData = await response.json();
            
            // 直接导入主题，和"导入像素主题"按钮功能一致
            console.log('[DEBUG] Importing pixel theme data');
            const results = customThemeManager.importThemes(themeData, false);
            
            // 显示导入结果
            let message = '导入完成！\n';
            message += `已导入: ${results.imported} 个主题\n`;
            if (results.skipped > 0) {
                message += `跳过: ${results.skipped} 个主题（已存在）\n`;
            }
            if (results.errors.length > 0) {
                message += `错误: ${results.errors.length} 个\n${results.errors.join('\n')}`;
            }
            
            alert(message);
            
            // 应用导入的第一个主题
            if (results.imported > 0) {
                const updatedThemes = customThemeManager.getAllThemes();
                const latestTheme = updatedThemes[updatedThemes.length - 1];
                if (latestTheme) {
                    console.log('[DEBUG] Applying imported theme:', latestTheme.name);
                    dispatch(setTheme(latestTheme));
                }
            }
        } catch (error) {
            console.error('Error applying pixel theme:', error);
            console.error('Error stack:', error.stack);
            alert(`像素主题导入失败: ${error.message}`);
        }
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BilmeModal);
