/**
 * 游戏主文件
 * 
 * 功能：
 * - 初始化游戏配置
 * - 加载游戏资源
 * - 创建游戏场景
 * - 管理游戏状态
 * - 处理用户输入
 * 
 * 主要组件：
 * - 猫咪角色
 * - 泡泡系统
 * - 状态机
 * - 场景管理
 */

// 使用配置管理器获取配置
let config = GameConfig.getConfig();
let game = new Phaser.Game(config);

function preload() {
    // 使用资源管理器加载所有资源
    AssetManager.loadAssets(this);
}

function create() {
    // 初始化碰撞管理器
    this.collisionManager = new CollisionManager(this);

    // 添加背景
    this.add.tileSprite(0, 0, 1920, 1080, 'background').setOrigin(0, 0);
    
    // 初始化输入控制（包含键盘和鼠标）
    this.inputManager = new InputManager(this);

    // 初始化泡泡数组
    this.bubbles = [];
    this.lightBubbles = [];

    // 创建猫咪实例
    this.cat = new Cat(this, 960, 540);
    
    // 初始化敌人数组
    this.enemies = [];
    
    // 绑定 spawnLightEnemy 到场景实例
    this.spawnLightEnemy = () => {
        const spawnPoint = LightEnemy.getRandomSpawnPoint(this);
        const enemy = new LightEnemy(this, spawnPoint.x, spawnPoint.y);
        this.enemies.push(enemy);
    };
    
    // 立即生成第一个闪电球
    this.spawnLightEnemy();
    
    // 设置敌人生成定时器
    this.time.addEvent({
        delay: 20000,  // 20秒
        callback: () => {
            if (this.enemies.length < 5) {
                this.spawnLightEnemy();
            }
        },
        callbackScope: this,
        loop: true
    });

    
    // 清理所有泡泡
    this.clearAllBubbles = () => {
        this.bubbles.forEach(bubble => bubble.destroy());
        this.lightBubbles.forEach(lightBubble => lightBubble.destroy());
        this.bubbles = [];
        this.lightBubbles = [];
    };

    // 添加回泡泡数量限制
    const MAX_BUBBLES = 20; // 增加最大泡泡数量

    // 初始化音频管理器
    this.audioManager = new AudioManager(this);

    // 启动UI场景
    this.scene.launch('UIScene');

    // 监听游戏结束事件
    this.events.on('gameOver', () => {
        // 暂停所有更新
        this.scene.pause();
        
        // 显示游戏结束UI
        const width = this.game.config.width;
        const height = this.game.config.height;
        
        // 添加半透明黑色背景
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        overlay.setOrigin(0, 0);
        overlay.setDepth(1000);
        
        // 添加游戏结束文本
        const gameOverText = this.add.text(width/2, height/2 - 50, 'Game Over', {
            fontSize: '64px',
            fill: '#fff'
        });
        gameOverText.setOrigin(0.5);
        gameOverText.setDepth(1001);
        
        // 添加重试按钮
        const retryButton = this.add.text(width/2, height/2 + 50, 'Click to Retry', {
            fontSize: '32px',
            fill: '#fff'
        });
        retryButton.setOrigin(0.5);
        retryButton.setDepth(1001);
        retryButton.setInteractive();
        
        // 点击重试按钮重启游戏
        retryButton.on('pointerdown', () => {
            this.scene.restart();
        });
    });
}

function update() {
    // 更新猫咪，传入所有输入控制
    this.cat.update(
        this.inputManager.getCursors(), 
        this.inputManager.getWASDKeys(),
        this.inputManager.getMouseKeys()
    );

    // 更新所有敌人并
    if (this.enemies && this.enemies.length > 0) {
        this.enemies.forEach(enemy => {
            if (enemy && enemy.update) {
                enemy.update();
            }
        });
    }

    this.collisionManager.update();
}

// 生成闪电球敌人
function spawnLightEnemy() {
    const spawnPoint = LightEnemy.getRandomSpawnPoint(this);
    const enemy = new LightEnemy(this, spawnPoint.x, spawnPoint.y);
    this.enemies.push(enemy);
} 