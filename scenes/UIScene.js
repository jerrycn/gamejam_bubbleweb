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
        this.progress = 0; // 当前进度（0-100）
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

        // 创建进度条容器
        const progressContainer = this.add.container(0, this.game.config.height);
        
        // 进度条背景 - 添加透明度
        const progressBg = this.add.rectangle(
            0,
            0,
            this.game.config.width,
            30,
            0x333333,
            0.5
        ).setOrigin(0, 1);

        // 进度条填充 - 添加透明度
        this.progressBar = this.add.rectangle(
            0,
            0,
            0,
            30,
            0x00ff00,
            0.5
        ).setOrigin(0, 1);

        // 进度文本
        this.progressText = this.add.text(
            this.game.config.width / 2,
            -15,
            '0%',
            {
                fontSize: '24px',
                fill: '#ffffff'
            }
        ).setOrigin(0.5, 0.5);

        // 添加到容器
        progressContainer.add([progressBg, this.progressBar, this.progressText]);

        // 监听进度更新事件
        const gameScene = this.scene.get('GameScene');
        if (gameScene) {
            console.log('Setting up progress update listener');
            gameScene.events.on('progressUpdate', this.updateProgress, this);
        }
    }

    createPauseMenu() {
        const width = this.game.config.width;
        const height = this.game.config.height;

        // 创建半透明黑色背景
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        overlay.setOrigin(0, 0);
        overlay.setDepth(100);

        // 创建UI容器
        const container = this.add.container(width/2, height/2);
        container.setDepth(101);

        // 创建暂停标题
        const pauseTitle = this.add.text(0, -200, '游戏暂停', {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 创建操作说明
        const instructions = [
            '操作说明：',
            '- WASD或方向键：移动',
            '- 鼠标左键：吹泡泡'
        ];

        const instructionText = this.add.text(0, -120, instructions, {
            fontSize: '24px',
            fill: '#ffffff',
            lineSpacing: 10,
            align: 'left'
        }).setOrigin(0.5);

        // 按钮样式
        const buttonStyle = {
            width: 200,
            height: 50,
            padding: 10,
            backgroundColor: '#4a4a4a',
            color: '#ffffff',
            hoverColor: '#666666'
        };

        // 创建音乐开关按钮
        const musicButton = this.createButton(0, 50, 
            `音乐: ${GameStateManager.isMusicEnabled() ? '开' : '关'}`, 
            buttonStyle, 
            () => {
                const isEnabled = GameStateManager.toggleMusic();
                musicButton.getAt(1).setText(`音乐: ${isEnabled ? '开' : '关'}`);
                
                // 更新所有场景的音乐状态
                const gameScene = this.scene.get('GameScene');
                const startScene = this.scene.get('StartScene');
                
                if (isEnabled) {
                    // 开启音乐
                    if (gameScene && gameScene.audioManager) {
                        gameScene.audioManager.resumeMusic();
                    }
                    if (startScene && startScene.audioManager) {
                        startScene.audioManager.resumeMusic();
                    }
                } else {
                    // 关闭音乐
                    if (gameScene && gameScene.audioManager) {
                        gameScene.audioManager.pauseMusic();
                    }
                    if (startScene && startScene.audioManager) {
                        startScene.audioManager.pauseMusic();
                    }
                }
            }
        );

        // 创建继续按钮
        const continueButton = this.createButton(0, 120, '继续游戏', buttonStyle, () => {
            this.resumeGame();
        });

        // 创建重新开始按钮
        const restartButton = this.createButton(0, 190, '重新开始', buttonStyle, () => {
            // 停止当前场景的音乐
            const gameScene = this.scene.get('GameScene');
            if (gameScene.audioManager) {
                gameScene.audioManager.stopMusic();
            }
            this.scene.get('GameScene').scene.restart();
            this.resumeGame();
        });

        // 创建返回主菜单按钮
        const returnButton = this.createButton(0, 260, '返回主菜单', buttonStyle, () => {
            // 停止当前场景的音乐
            const gameScene = this.scene.get('GameScene');
            if (gameScene.audioManager) {
                gameScene.audioManager.stopMusic();
            }
            
            // 停止并隐藏UI场景
            this.scene.stop('UIScene');  // 停止UI场景
            this.scene.stop('GameScene');  // 停止游戏场景
            this.scene.start('StartScene');  // 启动开始场景
        });

        // 将所有元素添加到容器
        container.add([
            pauseTitle,
            instructionText,
            musicButton,
            continueButton,
            restartButton,
            returnButton
        ]);

        // 保存引用以便后续移除
        this.pauseMenu = container;
        this.pauseOverlay = overlay;

        // 隐藏暂停菜单
        this.pauseMenu.setVisible(false);
        this.pauseOverlay.setVisible(false);
    }

    // 添加创建按钮的辅助函数（与 GameScene 中的相同）
    createButton(x, y, text, style, callback) {
        const button = this.add.container(x, y);
        
        // 创建按钮背景
        const bg = this.add.rectangle(0, 0, style.width, style.height, 
            parseInt(style.backgroundColor.replace('#', '0x')), 1);
        bg.setOrigin(0.5);
        
        // 创建按钮文本
        const buttonText = this.add.text(0, 0, text, {
            fontSize: '24px',
            fill: style.color
        }).setOrigin(0.5);

        // 组合按钮
        button.add([bg, buttonText]);
        
        // 添加交互
        bg.setInteractive()
            .on('pointerover', () => {
                bg.setFillStyle(parseInt(style.hoverColor.replace('#', '0x')));
            })
            .on('pointerout', () => {
                bg.setFillStyle(parseInt(style.backgroundColor.replace('#', '0x')));
            })
            .on('pointerdown', callback);

        return button;
    }

    showPauseMenu() {
        this.pauseOverlay.setVisible(true);
        this.pauseMenu.setVisible(true);
        // 暂停主游戏场景
        this.scene.pause('GameScene');
    }

    hidePauseMenu() {
        this.pauseOverlay.setVisible(false);
        this.pauseMenu.setVisible(false);
        // 恢复主游戏场景
        this.scene.resume('GameScene');
        // 恢复音乐
        const gameScene = this.scene.get('GameScene');
        gameScene.audioManager.resumeMusic();
    }

    resumeGame() {
        this.hidePauseMenu();
    }

    updateProgress(progress) {
        console.log('Progress update received:', progress);
        this.progress = progress;
        // 更新进度条宽度
        this.progressBar.width = (this.game.config.width * progress) / 100;
        // 更新进度文本
        this.progressText.setText(`${Math.floor(progress)}%`);

        // 检查胜利条件
        if (progress >= 100) {
            const gameScene = this.scene.get('GameScene');
            if (gameScene) {
                gameScene.events.emit('victory');
            }
        }
    }

    // 在场景关闭时清理事件监听
    shutdown() {
        const gameScene = this.scene.get('GameScene');
        if (gameScene) {
            gameScene.events.off('progressUpdate', this.updateProgress, this);
        }
    }
} 