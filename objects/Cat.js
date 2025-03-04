/**
 * Cat 类 - 猫咪角色
 * 
 * 功能：
 * - 管理猫咪的状态和动画
 * - 处理移动逻辑
 * - 处理吹泡泡动作
 * 
 * 状态：
 * - IDLE: 待机状态
 * - WALKING: 行走状态
 * - BLOWING: 吹泡泡状态
 * 
 * @class Cat
 */
class Cat extends GameObject {
    // 添加静态常量
    static MAX_BUBBLES = 20;  // 最大泡泡数量

    // 已有的静态状态枚举
    static State = {
        IDLE: 'idle',
        WALKING: 'walking',
        BLOWING: 'blowing'
    };

    constructor(scene, x, y) {
        super(scene);
        this.scene = scene;
        this.sprite = scene.add.sprite(x, y, 'cat_walk_0');
        this.sprite.setScale(0.5);
        this.sprite.setDepth(10);
        
        this.stateMachine = new StateMachine();
        this.stateMachine.changeState(new CatIdleState(this));

        // 初始化音频管理器
        this.audioManager = new AudioManager(this.scene);
        this.moveSound = null;  // 存储移动音效的引用

        this.createAnimations();
        this.sprite.play('walk');

        // 初始化泡泡相关属性
        this.currentBubble = null;
        this.bubbles = this.scene.bubbles;  

        // 初始化属性
        this.isInvincible = false;
        this.isDead = false;
    }

    createAnimations() {
        // 创建行走动画
        const walkFrames = [];
        for (let i = 0; i <= 14; i++) {
            walkFrames.push({ key: `cat_walk_${i}` });
        }
        
        this.scene.anims.create({
            key: 'walk',
            frames: walkFrames,
            frameRate: 12,
            repeat: -1
        });

        // 创建吹气动画
        const blowFrames = [];
        for (let i = 0; i <= 9; i++) {
            blowFrames.push({ key: `cat_blow_${i}` });
        }
        
        this.scene.anims.create({
            key: 'blow',
            frames: blowFrames,
            frameRate: 12,
            repeat: -1
        });
    }
    // 受伤
    hurt() {
        if (this.isDead) return;  // 如果已经死亡，不再处理

        if (!this.isInvincible) {
            this.isDead = true;  // 设置死亡状态
            this.stateMachine.changeState(new CatDeadState(this));
            
            // 播放死亡音效（如果有）
            if (this.scene.audioManager) {
                // this.scene.audioManager.playSound('cat_death');
            }
        }
    }

    // 重生/重置
    reset() {
        this.isDead = false;
        this.isInvincible = false;
        this.sprite.setAlpha(1);
        this.stateMachine.changeState(new CatIdleState(this));
    }

    update(cursors, wasdKeys, mouseKeys) {
        // 将所有输入参数作为对象传入状态机
        const input = {
            cursors,
            wasdKeys,
            mouseKeys
        };
        this.stateMachine.update(input);
    }

    getPosition() {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        };
    }

    isInBubble(bubbles) {
        const catX = this.sprite.x;
        const catY = this.sprite.y;
        const catRadius = this.sprite.displayWidth / 4;

        for (const bubble of bubbles) {
            if (bubble.state === Bubble.State.FLOATING) {
                const dx = catX - bubble.sprite.x;
                const dy = catY - bubble.sprite.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < bubble.getRadius()) {
                    return true;
                }
            }
        }
        return false;
    }

    // 开始吹泡泡
    startBlowingBubble() {
        const position = this.getPosition();
        
        // 创建新泡泡
        this.currentBubble = new Bubble(this.scene, position.x, position.y);
        this.currentBubble.startGrowing(position.x, position.y);
        
        // 如果超过最大数量，移除最早的泡泡
        if (this.bubbles.length >= Cat.MAX_BUBBLES) {  // 使用类的静态常量
            const oldBubble = this.bubbles.shift();
            oldBubble.destroy();
        }
        
        this.bubbles.push(this.currentBubble);
    }

    // 停止吹泡泡
    stopBlowingBubble() {
        if (this.currentBubble) {
            this.currentBubble.stopGrowing();
            
            // 创建光效泡泡并保存
            const x = this.currentBubble.sprite.x;
            const y = this.currentBubble.sprite.y;
            const radius = this.currentBubble.sprite.displayWidth / 2;
            
            const lightBubble = new LightBubble(this.scene, x, y, radius);
            lightBubble.setVisible(true);
            lightBubble.setDepth(1);
            this.currentBubble.setLightBubble(lightBubble);
            
            
            this.currentBubble = null;
        }
    }

    // 播放移动音效
    playMoveSound() {
        if (!this.moveSound) {
            this.moveSound = this.audioManager.playSound('cat_move', {
                volume: 0.3,
                loop: true
            });
        }
    }

    // 停止移动音效
    stopMoveSound() {
        if (this.moveSound) {
            this.audioManager.stopSound('cat_move');
            this.moveSound = null;
        }
    }

    // 在销毁时清理音频资源
    destroy() {
        this.stopMoveSound();
        if (this.audioManager) {
            this.audioManager.destroy();
        }
        super.destroy();
    }
} 