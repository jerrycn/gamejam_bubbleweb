/**
 * UIScene 类 - 用户界面场景
 * 
 * 功能：
 * - 显示版本信息
 * - 管理暂停菜单
 * - 处理UI交互
 * 
 * 组件：
 * - 版本显示
 * - 暂停按钮
 * - 暂停菜单
 * 
 * @class UIScene
 */
class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
        this.version = '1.0.0'; // 初始版本号
    }

    create() {
        // 左下角版本信息
        this.versionText = this.add.text(10, this.game.config.height - 30, `版本: ${this.version}`, {
            fontSize: '20px',
            fill: '#ffffff'
        });

        // 右上角暂停按钮
        this.pauseButton = this.add.text(this.game.config.width - 100, 10, '暂停', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.pauseButton.setInteractive();

        // 创建暂停菜单（初始隐藏）
        this.createPauseMenu();

        // 添加点击事件
        this.pauseButton.on('pointerdown', () => {
            this.showPauseMenu();
        });
    }

    createPauseMenu() {
        // 创建半透明黑色背景
        this.pauseBackground = this.add.rectangle(
            this.game.config.width / 2,
            this.game.config.height / 2,
            this.game.config.width,
            this.game.config.height,
            0x000000,
            0.7
        );
        
        // 创建暂停菜单面板
        this.pausePanel = this.add.container(this.game.config.width / 2, this.game.config.height / 2);
        
        // 暂停菜单背景
        const panelBg = this.add.rectangle(0, 0, 400, 300, 0x333333);
        
        // 版本信息
        const versionInfo = this.add.text(0, -100, `版本: ${this.version}`, {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // 继续按钮
        const resumeButton = this.add.text(0, 0, '继续游戏', {
            fontSize: '32px',
            fill: '#ffffff',
            backgroundColor: '#444444',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        resumeButton.setInteractive();
        resumeButton.on('pointerdown', () => {
            this.hidePauseMenu();
        });

        // 添加音乐控制按钮
        const musicButton = this.add.text(0, 50, '音乐: 开', {
            fontSize: '32px',
            fill: '#ffffff',
            backgroundColor: '#444444',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        musicButton.setInteractive();
        musicButton.on('pointerdown', () => {
            const gameScene = this.scene.get('GameScene');
            const isPlaying = gameScene.audioManager.toggleMusic();
            musicButton.setText(isPlaying ? '音乐: 开' : '音乐: 关');
        });

        // 将所有元素添加到容器中
        this.pausePanel.add([panelBg, versionInfo, resumeButton, musicButton]);
        
        // 初始隐藏暂停菜单
        this.pauseBackground.setVisible(false);
        this.pausePanel.setVisible(false);
    }

    showPauseMenu() {
        this.pauseBackground.setVisible(true);
        this.pausePanel.setVisible(true);
        // 暂停主游戏场景
        this.scene.pause('GameScene');
    }

    hidePauseMenu() {
        this.pauseBackground.setVisible(false);
        this.pausePanel.setVisible(false);
        // 恢复主游戏场景
        this.scene.resume('GameScene');
        // 恢复音乐
        const gameScene = this.scene.get('GameScene');
        gameScene.audioManager.resumeMusic();
    }
} 