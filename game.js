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
let currentBubble; // 当前的泡泡实例
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
    
    // 加载泡泡纹理
    this.load.image('bubble', 'assets/bubble.png');
    
    // 加载光泡泡纹理
    this.load.image('bubblelight', 'assets/bubblelight.png');
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

    this.startBlowingBubble = () => {
        currentBubble.startGrowing(cat.x, cat.y);
    };

    this.stopBlowingBubble = () => {
        currentBubble.stopGrowing();
    };

    // 状态机
    this.stateMachine = {
        current: CatState.IDLE,
        
        change: (newState) => {
            if (this.stateMachine.current === newState) return;
            
            // 退出当前状态
            switch (this.stateMachine.current) {
                case CatState.IDLE:
                case CatState.WALKING:
                    this.hideThinkBubble();
                    break;
                case CatState.BLOWING:
                    this.stopBlowingBubble();  // 停止泡泡动画
                    break;
            }
            
            // 进入新状态
            this.stateMachine.current = newState;
            switch (newState) {
                case CatState.IDLE:
                    cat.play('walk');
                    this.showThinkBubble();
                    break;
                case CatState.WALKING:
                    cat.play('walk');
                    break;
                case CatState.BLOWING:
                    cat.play('blow');
                    this.startBlowingBubble();
                    break;
            }
        }
    };

    // 修改鼠标事件监听
    this.input.on('pointerdown', () => {
        // 只有在UI场景未暂停时才允许产生新泡泡
        if (!this.scene.isPaused('GameScene')) {
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

    // 启动UI场景
    this.scene.launch('UIScene');
}

function update() {
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