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

// 定义状态机的状态
const CatState = {
    IDLE: 'idle',
    WALKING: 'walking',
    BLOWING: 'blowing'
};

const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        {
            key: 'GameScene',
            preload: preload,
            create: create,
            update: update
        },
        UIScene
    ]
};

let game = new Phaser.Game(config);
let cat;
let currentBubble; // 当前正在吹的泡泡
let bubbles = []; // 存储所有场景中的泡泡
let lightBubbles = []; // 存储所有场景中的光效泡泡
let currentState = CatState.IDLE;
let currentLightBubble; // 当前的光泡泡实例

function preload() {
    this.load.image('background', 'assets/background.jpeg');
    
    // 加载行走动画的所有帧
    for (let i = 0; i <= 14; i++) {
        const frameNumber = i.toString().padStart(2, '0');
        this.load.image(`cat_walk_${i}`, `assets/cat/cat_walk00_${frameNumber}.png`);
    }
    
    // 加载吹气动画的所有帧
    for (let i = 0; i <= 9; i++) {
        const frameNumber = i.toString().padStart(2, '0');
        this.load.image(`cat_blow_${i}`, `assets/cat/cat_chuiqi00_${frameNumber}.png`);
    }
    
    // 加载泡泡纹理，更新路径到 bubble 目录
    this.load.image('bubble', 'assets/bubble/bubble.png');
    this.load.image('bubblelight', 'assets/bubble/bubblelight.png');
    
    // 加载泡泡特效动画的所有帧
    for (let i = 0; i <= 5; i++) {
        const frameNumber = i.toString().padStart(3, '0');
        this.load.image(`bubble_effect_${i}`, `assets/bubble/sc${frameNumber}.png`);
    }

    // 加载背景音乐
    this.load.audio('bgm', 'assets/audio/bgm.mp3', {
        instances: 1  // 只允许一个实例
    });

    // 加载背景音乐和音效
    this.load.audio('cat_move', 'assets/audio/cat_move.mp3', {
        instances: 2  // 允许多个实例以防音效重叠
    });

    // 加载泡泡音效
    this.load.audio('bubble_blowing', 'assets/audio/bubble_blowing.mp3', {
        instances: 2
    });

    // 加载泡泡结束音效
    this.load.audio('bubble_blowing_end', 'assets/audio/bubble_blowing_end.mp3', {
        instances: 2
    });
}

function create() {
    // 修改背景图片的显示方式，使用 tileSprite 来平铺
    this.add.tileSprite(0, 0, 1920, 1080, 'background').setOrigin(0, 0);
    
    // 添加猫咪精灵，使用第一帧作为初始图片
    cat = this.add.sprite(960, 540, 'cat_walk_0');
    cat.setScale(0.5); // 根据实际图片大小调整缩放比例
    
    // 创建行走动画
    const walkFrames = [];
    for (let i = 0; i <= 14; i++) {
        walkFrames.push({ key: `cat_walk_${i}` });
    }
    
    this.anims.create({
        key: 'walk',
        frames: walkFrames,
        frameRate: 12,
        repeat: -1
    });
    
    // 默认就开始播放动画
    cat.play('walk');
    cat.setDepth(2);
    
    // 创建泡泡实例
    currentBubble = new Bubble(this, 0, 0);
    

    /*
    // 创建光泡泡实例并放在场景中间
    currentLightBubble = new LightBubble(
        this, 
        this.game.config.width / 2,  // x 坐标：屏幕中心
        this.game.config.height / 2,  // y 坐标：屏幕中心
        100  // 增大半径到100像素，使其更容易看到
    );
    currentLightBubble.setVisible(true);
    currentLightBubble.setDepth(1); // 确保在猫咪和其他元素之上
*/
    // 添加键盘控制
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasdKeys = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // 修改状态相关的函数
    this.showThinkBubble = () => {
        // 空函数，不再显示思考泡泡
    };

    this.hideThinkBubble = () => {
        // 空函数，不再需要隐藏思考泡泡
    };

    // 清理所有泡泡
    this.clearAllBubbles = () => {
        bubbles.forEach(bubble => bubble.destroy());
        lightBubbles.forEach(lightBubble => lightBubble.destroy());
        bubbles = [];
        lightBubbles = [];
    };

    // 添加回泡泡数量限制
    const MAX_BUBBLES = 20; // 增加最大泡泡数量

    // 创建泡泡放大音效
    this.bubbleBlowingSound = this.sound.add('bubble_blowing', {
        volume: 0.4,
        loop: true  // 循环播放直到泡泡停止放大
    });

    // 创建泡泡结束音效
    this.bubbleEndSound = this.sound.add('bubble_blowing_end', {
        volume: 0.4,
        loop: false  // 只播放一次
    });

    // 修改开始吹泡泡的函数
    this.startBlowingBubble = () => {
        // 创建新泡泡
        currentBubble = new Bubble(this, cat.x, cat.y);
        currentBubble.startGrowing(cat.x, cat.y);
        
        // 播放泡泡放大音效
        if (!this.bubbleBlowingSound.isPlaying) {
            this.bubbleBlowingSound.play();
        }
        
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
        current: CatState.IDLE,
        
        change: (newState) => {
            if (this.stateMachine.current === newState) return;
            
            // 退出当前状态
            switch (this.stateMachine.current) {
                case CatState.IDLE:
                    break;
                case CatState.WALKING:
                    this.moveSound.stop();
                    break;
                case CatState.BLOWING:
                    this.stopBlowingBubble();
                    this.bubbleBlowingSound.stop();  // 确保音效停止
                    break;
            }
            
            // 进入新状态
            this.stateMachine.current = newState;
            switch (newState) {
                case CatState.IDLE:
                    cat.play('walk');
                    break;
                case CatState.WALKING:
                    cat.play('walk');
                    if (!this.moveSound.isPlaying) {
                        this.moveSound.play();  // 播放移动音效
                    }
                    break;
                case CatState.BLOWING:
                    cat.play('blow');
                    this.startBlowingBubble();
                    break;
            }
        }
    };

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
    };

    // 修改鼠标事件监听
    this.input.on('pointerdown', () => {
        // 只有在UI场景未暂停且猫咪不在泡泡内时才允许产生新泡泡
        if (!this.scene.isPaused('GameScene') && !this.isCatInBubble()) {
            this.stateMachine.change(CatState.BLOWING);
        }
    });

    this.input.on('pointerup', () => {
        // 只有在UI场景未暂停时才改变状态
        if (!this.scene.isPaused('GameScene')) {
            this.stateMachine.change(CatState.IDLE);
        }
    });

    // 设置初始状态
    this.stateMachine.change(CatState.IDLE);

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

    // 添加碰撞检测更新函数
    this.checkBubbleCollisions = () => {
        if (currentBubble && currentBubble.state === Bubble.State.GROWING) {
            // 检查与其他所有泡泡的碰撞
            for (const bubble of bubbles) {
                if (bubble !== currentBubble && 
                    bubble.state === Bubble.State.FLOATING) {
                    if (currentBubble.checkCollision(bubble)) {
                        // 如果发生碰撞，停止当前泡泡的放大
                        this.stopBlowingBubble();
                        break;
                    }
                }
            }
        }
    };

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

    // 创建并播放背景音乐
    this.bgMusic = this.sound.add('bgm', {
        volume: 0.5,
        loop: true
    });

    // 确保音频系统已解锁
    this.sound.once('unlocked', () => {
        this.bgMusic.play();
        console.log('BGM started playing');  // 添加调试日志
    });

    // 添加音乐控制，并记录状态
    this.isMusicPlaying = true;  // 跟踪音乐状态
    this.toggleMusic = () => {
        if (this.isMusicPlaying) {
            this.bgMusic.pause();
            this.isMusicPlaying = false;
            console.log('BGM paused');  // 调试日志
        } else {
            this.bgMusic.resume();
            this.isMusicPlaying = true;
            console.log('BGM resumed');  // 调试日志
        }
    };

    // 启动UI场景
    this.scene.launch('UIScene');
}

function update() {
    // 在更新函数中检查碰撞
    this.checkBubbleCollisions();
    
    // 只在非吹气状态下处理移动
    if (this.stateMachine.current !== CatState.BLOWING) {
        const speed = 2;
        let moving = false;

        // 处理移动输入
        if (this.cursors.left.isDown || this.wasdKeys.left.isDown) {
            cat.x -= speed;
            cat.setFlipX(false);
            moving = true;
        }
        if (this.cursors.right.isDown || this.wasdKeys.right.isDown) {
            cat.x += speed;
            cat.setFlipX(true);
            moving = true;
        }
        if (this.cursors.up.isDown || this.wasdKeys.up.isDown) {
            cat.y -= speed;
            moving = true;
        }
        if (this.cursors.down.isDown || this.wasdKeys.down.isDown) {
            cat.y += speed;
            moving = true;
        }

        // 更新状态
        this.stateMachine.change(moving ? CatState.WALKING : CatState.IDLE);
    }
} 