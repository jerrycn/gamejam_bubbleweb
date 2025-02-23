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
let cat;
let currentBubble; // 当前正在吹的泡泡
let bubbles = []; // 存储所有场景中的泡泡
let lightBubbles = []; // 存储所有场景中的光效泡泡

function preload() {
    // 使用资源管理器加载所有资源
    AssetManager.loadAssets(this);
}

function create() {
    // 添加背景
    this.add.tileSprite(0, 0, 1920, 1080, 'background').setOrigin(0, 0);
    
    // 初始化输入控制（包含键盘和鼠标）
    this.inputManager = new InputManager(this);

    // 创建猫咪实例
    cat = new Cat(this, 960, 540);
    
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
        bubbles.forEach(bubble => bubble.destroy());
        lightBubbles.forEach(lightBubble => lightBubble.destroy());
        bubbles = [];
        lightBubbles = [];
    };

    // 添加回泡泡数量限制
    const MAX_BUBBLES = 20; // 增加最大泡泡数量

    // 初始化音频管理器
    this.audioManager = new AudioManager(this);

    // 启动UI场景
    this.scene.launch('UIScene');

}

function update() {
    // 更新猫咪，传入所有输入控制
    cat.update(
        this.inputManager.getCursors(), 
        this.inputManager.getWASDKeys(),
        this.inputManager.getMouseKeys()
    );
    
    // 更新所有敌人并检查碰撞
    if (this.enemies && this.enemies.length > 0) {
        this.enemies.forEach(enemy => {
            if (enemy && enemy.update) {
                enemy.update();
                

                if (enemy.checkBubbleCollision(bubbles)) {
                    console.log('Enemy in bubble!');
                }
                
                // 检查与猫咪的碰撞
                if (!enemy.checkBubbleCollision(bubbles) &&  // 只有不在泡泡中才检查与猫的碰撞
                    enemy.checkCollision && 
                    enemy.checkCollision(cat)) {
                    // 处理碰撞逻辑
                    console.log('Enemy hit cat!');
                }
            }
        });
    }
}

// 生成闪电球敌人
function spawnLightEnemy() {
    const spawnPoint = LightEnemy.getRandomSpawnPoint(this);
    const enemy = new LightEnemy(this, spawnPoint.x, spawnPoint.y);
    this.enemies.push(enemy);
} 