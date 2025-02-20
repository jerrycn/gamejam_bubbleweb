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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let cat;
let bubble;
let blowBubble;
let currentState = CatState.IDLE;
let bubbleTimer;

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
    
    // 创建思考泡泡
    bubble = this.add.image(0, 0, 'bubble');
    bubble.setVisible(false);
    bubble.setScale(0.3); // 调整初始大小
    
    // 创建吹气泡泡
    blowBubble = this.add.image(0, 0, 'bubble');
    blowBubble.setVisible(false);
    blowBubble.setScale(0.1); // 设置初始大小

    // 添加键盘控制
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasdKeys = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // 绑定所有状态相关的函数到场景
    this.showThinkBubble = () => {
        if (bubbleTimer) clearTimeout(bubbleTimer);
        bubbleTimer = setTimeout(() => {
            bubble.setVisible(true);
            // 将思考泡泡放在猫咪正上方
            bubble.setPosition(cat.x, cat.y - cat.height * 0.3);
            this.tweens.add({
                targets: bubble,
                scale: { from: 0.1, to: 0.3 },
                alpha: { from: 0.2, to: 1 },
                duration: 1000,
                ease: 'Power1'
            });
        }, 500);
    };

    this.hideThinkBubble = () => {
        if (bubbleTimer) clearTimeout(bubbleTimer);
        bubble.setVisible(false);
    };

    this.startBlowingBubble = () => {
        blowBubble.setVisible(true);
        blowBubble.setScale(0.1); // 重置为初始大小
        
        // 将吹气泡泡放在猫咪中心点
        blowBubble.setPosition(cat.x, cat.y);
        
        // 持续放大的动画
        this.tweens.add({
            targets: blowBubble,
            scale: 2, // 最大放大倍数
            alpha: { from: 1, to: 0.5 },
            duration: 3000,
            ease: 'Linear',
            repeat: -1,
            onComplete: function() {
                blowBubble.setScale(0.1);
            }
        });
    };

    this.stopBlowingBubble = () => {
        blowBubble.setVisible(false);
        this.tweens.killTweensOf(blowBubble);
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
                    this.stopBlowingBubble();
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

    // 鼠标事件监听
    this.input.on('pointerdown', () => {
        this.stateMachine.change(CatState.BLOWING);
    });

    this.input.on('pointerup', () => {
        this.stateMachine.change(CatState.IDLE);
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