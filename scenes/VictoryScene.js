class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    create() {
        const width = this.game.config.width;
        const height = this.game.config.height;

        // 添加半透明黑色背景
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        overlay.setOrigin(0, 0);

        // 添加胜利文本
        const victoryText = this.add.text(width/2, height/2 - 100, '胜利！', {
            fontSize: '64px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 创建按钮
        const buttonWidth = 200;
        const buttonHeight = 60;
        const centerX = width/2;
        const centerY = height/2;

        // 重试按钮背景
        const retryButton = this.add.graphics();
        retryButton.lineStyle(2, 0xffffff);
        retryButton.fillStyle(0x000000, 0.5);
        retryButton.fillRect(centerX - buttonWidth/2, centerY - buttonHeight/2, buttonWidth, buttonHeight);
        retryButton.strokeRect(centerX - buttonWidth/2, centerY - buttonHeight/2, buttonWidth, buttonHeight);

        // 重试按钮文本
        const retryText = this.add.text(centerX, centerY, '重新开始', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // 返回按钮背景
        const returnButton = this.add.graphics();
        returnButton.lineStyle(2, 0xffffff);
        returnButton.fillStyle(0x000000, 0.5);
        returnButton.fillRect(centerX - buttonWidth/2, centerY + 70 - buttonHeight/2, buttonWidth, buttonHeight);
        returnButton.strokeRect(centerX - buttonWidth/2, centerY + 70 - buttonHeight/2, buttonWidth, buttonHeight);

        // 返回按钮文本
        const returnText = this.add.text(centerX, centerY + 70, '返回主菜单', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // 设置按钮交互
        retryText.setInteractive({ useHandCursor: true })
            .on('pointerover', () => retryText.setStyle({ fill: '#ffff00' }))
            .on('pointerout', () => retryText.setStyle({ fill: '#ffffff' }))
            .on('pointerdown', () => {
                this.scene.stop('VictoryScene');
                this.scene.stop('UIScene');
                this.scene.start('GameScene');
            });

        returnText.setInteractive({ useHandCursor: true })
            .on('pointerover', () => returnText.setStyle({ fill: '#ffff00' }))
            .on('pointerout', () => returnText.setStyle({ fill: '#ffffff' }))
            .on('pointerdown', () => {
                this.scene.stop('VictoryScene');
                this.scene.stop('UIScene');
                this.scene.stop('GameScene');
                this.scene.start('StartScene');
            });
    }
} 