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
    
    // 创建猫咪实例
    cat = new Cat(this, 960, 540);
    
    // 初始化输入控制（包含键盘和鼠标）
    this.inputManager = new InputManager(this);

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

    // // 创建泡泡放大音效
    // this.bubbleBlowingSound = this.sound.add('bubble_blowing', {
    //     volume: 0.4,
    //     loop: true  // 循环播放直到泡泡停止放大
    // });

    // // 创建泡泡结束音效
    // this.bubbleEndSound = this.sound.add('bubble_blowing_end', {
    //     volume: 0.4,
    //     loop: false  // 只播放一次
    // });

    // 修改开始吹泡泡的函数
    this.startBlowingBubble = () => {
        // 获取猫咪的实际位置
        const catPos = cat.getPosition();
        currentBubble = new Bubble(this, catPos.x, catPos.y);
        currentBubble.startGrowing(catPos.x, catPos.y);
        
        // 如果超过最大数量，移除最早的泡泡
        if (bubbles.length >= MAX_BUBBLES) {
            const oldBubble = bubbles.shift();
            oldBubble.destroy();
            if (lightBubbles.length > 0) {
                const oldLight = lightBubbles.shift();
                oldLight.destroy();
            }
        }
        
        bubbles.push(currentBubble);
    };

    // 修改停止吹泡泡的函数
    this.stopBlowingBubble = () => {
        if (currentBubble) {
            currentBubble.stopGrowing();
            
            // 停止泡泡放大音效并播放结束音效
            this.bubbleBlowingSound.stop();
            this.bubbleEndSound.play();
            
            // 创建光效泡泡并保存
            const x = currentBubble.sprite.x;
            const y = currentBubble.sprite.y;
            const radius = currentBubble.sprite.displayWidth / 2;
            
            const lightBubble = new LightBubble(this, x, y, radius);
            lightBubble.setVisible(true);
            lightBubble.setDepth(1);
            
            // 如果超过最大数量，确保光效泡泡数量与普通泡泡一致
            if (lightBubbles.length >= MAX_BUBBLES) {
                const oldLight = lightBubbles.shift();
                oldLight.destroy();
            }
            lightBubbles.push(lightBubble);
            
            currentBubble = null;
        }
    };

    // 创建移动音效
    this.moveSound = this.sound.add('cat_move', {
        volume: 0.3,  // 设置适当的音量
        loop: true    // 循环播放
    });

    // 修改状态机的状态切换逻辑
    this.stateMachine = {
        current: Cat.State.IDLE,
        
        change: (newState) => {
            if (this.stateMachine.current === newState) return;
            
            // 退出当前状态
            switch (this.stateMachine.current) {
                case Cat.State.IDLE:
                    break;
                case Cat.State.WALKING:
                    this.moveSound.stop();
                    break;
                case Cat.State.BLOWING:
                    this.stopBlowingBubble();
                    this.bubbleBlowingSound.stop();  // 确保音效停止
                    break;
            }
            
            // 进入新状态
            this.stateMachine.current = newState;
            switch (newState) {
                case Cat.State.IDLE:
                    cat.play('walk');
                    break;
                case Cat.State.WALKING:
                    cat.play('walk');
                    if (!this.moveSound.isPlaying) {
                        this.moveSound.play();  // 播放移动音效
                    }
                    break;
                case Cat.State.BLOWING:
                    cat.play('blow');
                    this.startBlowingBubble();
                    break;
            }
        }
    };
/*
    // 添加检测猫咪是否在泡泡内的函数
    this.isCatInBubble = () => {
        const catX = cat.x;
        const catY = cat.y;
        const catRadius = cat.displayWidth / 4; // 猫咪碰撞半径，可以调整

        // 检查所有泡泡
        for (const bubble of bubbles) {
            if (bubble.state === Bubble.State.FLOATING) {
                const dx = catX - bubble.sprite.x;
                const dy = catY - bubble.sprite.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // 如果猫咪中心点到泡泡中心点的距离小于泡泡半径，说明猫咪在泡泡内
                if (distance < bubble.getRadius()) {
                    return true;
                }
            }
        }
        return false;
    };*/
/*
    // 创建吹气动画
    const blowFrames = [];
    for (let i = 0; i <= 9; i++) {
        blowFrames.push({ key: `cat_blow_${i}` });
    }
    
    this.anims.create({
        key: 'blow',
        frames: blowFrames,
        frameRate: 12,
        repeat: -1
    });
*/

    // 添加碰撞检测更新函数
    // this.checkBubbleCollisions = () => {
    //     if (currentBubble && currentBubble.state === Bubble.State.GROWING) {
    //         // 检查与其他所有泡泡的碰撞
    //         for (const bubble of bubbles) {
    //             if (bubble !== currentBubble && 
    //                 bubble.state === Bubble.State.FLOATING) {
    //                 if (currentBubble.checkCollision(bubble)) {
    //                     // 如果发生碰撞，停止当前泡泡的放大
    //                     this.stopBlowingBubble();
    //                     break;
    //                 }
    //             }
    //         }
    //     }
    // };
/*
    // 创建泡泡特效动画
    const effectFrames = [];
    for (let i = 0; i <= 5; i++) {
        effectFrames.push({ key: `bubble_effect_${i}` });
    }
    
    this.anims.create({
        key: 'bubble_effect',
        frames: effectFrames,
        frameRate: 12,
        repeat: 0  // 只播放一次
    });
*/
    // 初始化音频管理器
    this.audioManager = new AudioManager(this);

    // 启动UI场景
    this.scene.launch('UIScene');
/*
    // 修改鼠标事件监听
    this.input.on('pointerdown', () => {
        if (!this.scene.isPaused('GameScene') && !cat.isInBubble(bubbles)) {
            cat.setState(Cat.State.BLOWING);
            cat.startBlowingBubble();
        }
    });

    this.input.on('pointerup', () => {
        if (!this.scene.isPaused('GameScene')) {
            cat.setState(Cat.State.IDLE);
            cat.stopBlowingBubble();
        }
    });*/
}

function update() {
    // 更新猫咪，传入输入控制
    cat.update(this.inputManager.getCursors(), this.inputManager.getWASDKeys());
    
    // 在更新函数中检查碰撞
    //this.checkBubbleCollisions();
    
    // 更新所有敌人并检查碰撞
    if (this.enemies && this.enemies.length > 0) {
        this.enemies.forEach(enemy => {
            if (enemy && enemy.update) {
                enemy.update();
                
                // 检查与猫咪的碰撞
                if (enemy.checkCollision && enemy.checkCollision(cat)) {
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