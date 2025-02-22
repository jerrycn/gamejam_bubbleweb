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
class Cat {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.add.sprite(x, y, 'cat_walk_0');
        this.sprite.setScale(0.5);
        this.sprite.setDepth(2);
        
        this.stateMachine = new StateMachine();
        this.stateMachine.changeState(new CatIdleState(this));

        this.moveSound = scene.sound.add('cat_move', {
            volume: 0.3,
            loop: true
        });

        this.createAnimations();
        this.sprite.play('walk');

        // 初始化泡泡相关属性
        this.currentBubble = null;
        this.bubbles = bubbles;  // 引用全局泡泡数组
        this.lightBubbles = lightBubbles;  // 引用全局光效泡泡数组
    }

    static State = {
        IDLE: 'idle',
        WALKING: 'walking',
        BLOWING: 'blowing'
    };

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

    update(cursors, wasdKeys) {
        // 更新移动输入
        this.updateMovement(cursors, wasdKeys);
        
        // 更新状态机
        this.stateMachine.update();
    }

    updateMovement(cursors, wasdKeys) {
        if (this.stateMachine.getCurrentState() instanceof CatBlowingState) {
            return;
        }

        const speed = 2;
        this.moving = false;

        if (cursors.left.isDown || wasdKeys.left.isDown) {
            this.sprite.x -= speed;
            this.sprite.setFlipX(false);
            this.moving = true;
        }
        if (cursors.right.isDown || wasdKeys.right.isDown) {
            this.sprite.x += speed;
            this.sprite.setFlipX(true);
            this.moving = true;
        }
        if (cursors.up.isDown || wasdKeys.up.isDown) {
            this.sprite.y -= speed;
            this.moving = true;
        }
        if (cursors.down.isDown || wasdKeys.down.isDown) {
            this.sprite.y += speed;
            this.moving = true;
        }
    }

    isMoving() {
        return this.moving;
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
        const MAX_BUBBLES = 20;  // 最大泡泡数量
        const position = this.getPosition();
        
        // 创建新泡泡
        this.currentBubble = new Bubble(this.scene, position.x, position.y);
        this.currentBubble.startGrowing(position.x, position.y);
        
        // 如果超过最大数量，移除最早的泡泡
        if (this.bubbles.length >= MAX_BUBBLES) {
            const oldBubble = this.bubbles.shift();
            oldBubble.destroy();
            if (this.lightBubbles.length > 0) {
                const oldLight = this.lightBubbles.shift();
                oldLight.destroy();
            }
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
            
            // 如果超过最大数量，确保光效泡泡数量与普通泡泡一致
            if (this.lightBubbles.length >= MAX_BUBBLES) {
                const oldLight = this.lightBubbles.shift();
                oldLight.destroy();
            }
            this.lightBubbles.push(lightBubble);
            
            this.currentBubble = null;
        }
    }
} 