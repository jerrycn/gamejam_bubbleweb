/**
 * StartScene 类 - 游戏开始场景
 */
class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
        console.log('StartScene constructor');
    }

    preload() {
        console.log('StartScene preload');
        // 加载开始界面资源
        this.load.image('startbg', 'assets/startbg.jpeg');
        this.load.audio('bgm', 'assets/audio/bgm.mp3');
    }

    create() {
        console.log('StartScene create');
        // 添加背景并设置大小以填充整个场景
        const bg = this.add.image(0, 0, 'startbg').setOrigin(0, 0);
        bg.displayWidth = this.game.config.width;
        bg.displayHeight = this.game.config.height;

        // 播放背景音乐
        this.audioManager = new AudioManager(this);
        this.audioManager.playMusic('bgm');

        // 创建开始按钮
        const buttonWidth = 200;
        const buttonHeight = 60;
        const centerX = this.game.config.width / 2;
        const centerY = this.game.config.height / 2;

        // 创建按钮背景
        const startButton = this.add.graphics();
        startButton.lineStyle(2, 0xffffff);  // 白色边框
        startButton.fillStyle(0x000000, 0.5);  // 半透明黑色背景
        startButton.fillRect(centerX - buttonWidth/2, centerY - buttonHeight/2, buttonWidth, buttonHeight);
        startButton.strokeRect(centerX - buttonWidth/2, centerY - buttonHeight/2, buttonWidth, buttonHeight);

        // 添加文本并使其可交互
        const startText = this.add.text(centerX, centerY, '开始游戏', {
            fontSize: '32px',
            fill: '#ffffff',
            backgroundColor: 'transparent'  // 添加透明背景
        })
        .setOrigin(0.5)
        .setInteractive()  // 直接让文本可交互
        .setPadding(buttonWidth/2, buttonHeight/2);  // 增加点击区域

        console.log('Button created with interactive area');

        // 添加鼠标悬停效果
        startText.on('pointerover', () => {
            console.log('Button pointerover');
            startText.setStyle({ fill: '#ffff00' });
        });

        startText.on('pointerout', () => {
            console.log('Button pointerout');
            startText.setStyle({ fill: '#ffffff' });
        });

        // 点击事件
        startText.on('pointerdown', () => {
            console.log('Button clicked - Starting GameScene');
            // 停止开始场景的背景音乐
            this.audioManager.stopMusic();
            // 切换到游戏场景
            this.scene.start('GameScene');
        });

        // 添加调试信息
        console.log('Text position:', startText.x, startText.y);
        console.log('Text interactive:', startText.input.enabled);
        console.log('Text hitArea:', startText.input.hitArea);
    }
} 