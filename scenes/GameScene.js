/**
 * GameScene 类 - 游戏主场景
 */
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        console.log('GameScene constructor');
        this.totalArea = 1920 * 1080; // 总面积
        this.bubbleArea = 0; // 当前泡泡覆盖面积
    }

    preload() {
        console.log('GameScene preload');
        // 使用资源管理器加载所有资源
        AssetManager.loadAssets(this);
    }

    create() {
        console.log('GameScene create');
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

        // 添加Boss生成函数
        this.spawnBossEnemy = () => {
            const spawnPoint = BossEnemy.getRandomSpawnPoint(this);
            const boss = new BossEnemy(this, spawnPoint.x, spawnPoint.y);
            this.enemies.push(boss);
            console.log('Boss生成于', spawnPoint.x, spawnPoint.y);
        };
        
        // 立即生成一个Boss
        //this.spawnBossEnemy();

        // 在游戏进行一段时间后生成Boss
        this.time.addEvent({
            delay: 10000,  // 60秒后生成Boss
            callback: this.spawnBossEnemy,
            callbackScope: this
        });

        // 添加小怪物生成函数
        this.spawnSmallMonsterEnemy = () => {
            const spawnPoint = SmallMonsterEnemy.getRandomSpawnPoint(this);
            const monster = new SmallMonsterEnemy(this, spawnPoint.x, spawnPoint.y);
            this.enemies.push(monster);
            console.log('小怪物生成于', spawnPoint.x, spawnPoint.y);
        };

        // 设置小怪物生成定时器
        this.time.addEvent({
            delay: 5000,  // 15秒生成一次
            callback: this.spawnSmallMonsterEnemy,
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

        // 初始化音频管理器并播放背景音乐
        this.audioManager = new AudioManager(this);
        this.audioManager.playMusic('bgm');  // 暂时使用相同的背景音乐

        // 启动UI场景
        this.scene.launch('UIScene');

        // 监听游戏结束事件
        this.events.on('gameOver', () => {
            console.log('Game Over event triggered');
            try {
                // 先停止音乐
                if (this.audioManager) {
                    this.audioManager.stopMusic();
                }
                // 暂停当前场景
                this.scene.pause('GameScene');
                // 启动游戏结束场景
                this.scene.launch('GameOverScene');
            } catch (error) {
                console.error('Error in gameOver event:', error);
            }
        });

        // 监听胜利事件
        this.events.on('victory', () => {
            console.log('Victory achieved!');
            try {
                // 先停止音乐
                if (this.audioManager) {
                    this.audioManager.stopMusic();
                }
                // 暂停当前场景
                this.scene.pause('GameScene');
                // 启动胜利场景
                this.scene.launch('VictoryScene');
            } catch (error) {
                console.error('Error in victory event:', error);
            }
        });
    }

    update() {
        // 更新猫咪，传入所有输入控制
        this.cat.update(
            this.inputManager.getCursors(), 
            this.inputManager.getWASDKeys(),
            this.inputManager.getMouseKeys()
        );

        // 更新所有敌人
        if (this.enemies && this.enemies.length > 0) {
            this.enemies.forEach(enemy => {
                if (enemy && enemy.update) {
                    enemy.update();
                }
            });
        }

        this.collisionManager.update();

        // 计算泡泡覆盖面积
        this.calculateBubbleArea();
    }

    calculateBubbleArea() {
        console.log('----calculateBubbleArea----');
        let totalBubbleArea = 0;
        const sceneArea = this.game.config.width * this.game.config.height;
        
        // 计算所有泡泡的面积
        this.bubbles.forEach(bubble => {
            const radius = (bubble.sprite.displayWidth / 2) * bubble.sprite.scaleX;
            const area = Math.PI * radius * radius;
            totalBubbleArea += area;
            console.log('Bubble radius:', radius, 'area:', area);
        });
        

        // 调整目标面积比例（改为5%的场景面积作为100%进度）
        const targetArea = sceneArea * 0.60;  // 降低到5%
        const progress = (totalBubbleArea / targetArea) * 100;
        const clampedProgress = Math.min(progress, 100);

        console.log('targetArea:', targetArea);

        console.log('Emitting progress update:', clampedProgress);
        this.events.emit('progressUpdate', clampedProgress);

        // 调试输出
        if (this._lastDebugTime === undefined || Date.now() - this._lastDebugTime > 1000) {
            this._lastDebugTime = Date.now();
            //console.log('Total bubble area:', totalBubbleArea);
            console.log('Scene area:', sceneArea);
            console.log('Target area:', targetArea);
            console.log('Progress:', clampedProgress + '%');
        }
    }

    // 在场景销毁时停止音乐
    shutdown() {
        if (this.audioManager) {
            this.audioManager.stopMusic();
        }
    }
} 