/**
 * Enemy 类 - 敌人基类
 * 
 * 功能：
 * - 提供敌人的基础属性和方法
 * - 处理基础的移动和碰撞逻辑
 * 
 * @class Enemy
 */
class Enemy extends GameObject {
    // 敌人的状态枚举
    static State = {
        MOVING: 'moving',
        IDLE: 'idle',
        DEAD: 'dead'
    };

    constructor(scene, x, y) {
        super(scene);
        this.scene = scene;
        this.sprite = null;
        this.speed = 2; // 设置默认移动速度
        this.isActive = true;
        this.isChasing = true;  // 添加追逐状态
        this.moveVectorX = 0;   // 移动向量
        this.moveVectorY = 0;

        // 初始化状态机
        this.stateMachine = new StateMachine();
    }

    // 初始化敌人（由子类调用）
    init() {
        // 设置初始状态为移动
        //this.stateMachine.changeState(new EnemyMovingState(this));
        this.stateMachine.changeState(new EnemyIdleState(this));

    }

    // 计算移动向量
    calculateMoveVector() {
        // 确保 cat 存在
        if (!this.scene.cat) {
            console.warn('Cat not found in scene');
            return;
        }

        // 计算与猫咪的位置向量
        const dx = this.scene.cat.sprite.x - this.sprite.x;
        const dy = this.scene.cat.sprite.y - this.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) {
            this.moveVectorX = 0;
            this.moveVectorY = 0;
            return;
        }
        
        // 标准化向量
        this.moveVectorX = dx / distance;
        this.moveVectorY = dy / distance;
    }

    //计算反弹移动向量
    calculateBounceMoveVector(other){

        // 确保 cat 存在
        if (!this.scene.cat) {
            console.warn('Cat not found in scene');
            return;
        }

        // // 计算与猫咪的位置向量
        // const dx = this.scene.cat.sprite.x - this.sprite.x;
        // const dy = this.scene.cat.sprite.y - this.sprite.y;
        // const distance = Math.sqrt(dx * dx + dy * dy);

        // 计算碰撞点的法线向量（从泡泡中心指向敌人）
        const nx = this.sprite.x - other.sprite.x;
        const ny = this.sprite.y - other.sprite.y;
        const len = Math.sqrt(nx * nx + ny * ny);
        const normalX = nx / len;
        const normalY = ny / len;

        // 计算反弹向量（反射定律：r = d - 2(d·n)n）
        const dot = this.moveVectorX * normalX + this.moveVectorY * normalY;
        this.moveVectorX = this.moveVectorX - 2 * dot * normalX;
        this.moveVectorY = this.moveVectorY - 2 * dot * normalY;
        
    }

    // 碰撞回调
    onCollision(other) {
        this.stateMachine.changeState(new EnemyIdleState(this));
        console.log('Enemy onCollision', other);
    }

    /*
    // 检查是否与泡泡碰撞
    checkBubbleCollision(bubbles) {
        const enemyX = this.sprite.x;
        const enemyY = this.sprite.y;
        const enemyRadius = this.sprite.displayWidth / 4;

        // 使用场景实例中的 bubbles
        const sceneBubbles = this.scene.bubbles;
        
        for (const bubble of sceneBubbles) {
            if (bubble.state === Bubble.State.FLOATING) {
                const dx = enemyX - bubble.sprite.x;
                const dy = enemyY - bubble.sprite.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < (bubble.getRadius() + enemyRadius)) {
                    return true;
                }
            }
        }
        return false;
    }*/

    update() {
        // 更新状态机
        this.stateMachine.update();

        // 检查是否超出屏幕边界
        this.checkScreenBounds();
    }

    // 切换到死亡状态
    die() {
        this.stateMachine.changeState(new EnemyDeadState(this));
    }

    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
            this.scene.removeEnemy(this);
        }
    }

    // 播放移动动画
    playMoveAnimation() {
        if (this.sprite && this.sprite.anims) {
            // 检查动画是否存在
            if (this.scene.anims.exists('enemy_move')) {
                this.sprite.play('enemy_move', true); // true 表示如果已经在播放则强制重新开始
            }
        }
    }

    // 播放空闲动画
    playIdleAnimation() {
        if (this.sprite && this.sprite.anims) {
            // 检查动画是否存在
            if (this.scene.anims.exists('enemy_idle')) {
                this.sprite.play('enemy_idle', true);
            }
        }
    }

    // 播放死亡动画
    playDeadAnimation() {
        if (this.sprite && this.sprite.anims) {
            // 检查动画是否存在
            if (this.scene.anims.exists('enemy_dead')) {
                // 播放一次性的死亡动画
                this.sprite.play('enemy_dead', true).once('animationcomplete', () => {
                    // 动画播放完成后可以触发其他事件
                    this.onDeathAnimationComplete();
                });
            }
        }
    }

    // 死亡动画完成后的回调
    onDeathAnimationComplete() {
        // 基类中的空实现，子类可以重写此方法
    }


    
    // 检查是否超出屏幕边界
    checkScreenBounds() {
        const bounds = {
            x: this.scene.physics.world.bounds.x - 100,
            y: this.scene.physics.world.bounds.y - 100,
            width: this.scene.physics.world.bounds.width + 200,
            height: this.scene.physics.world.bounds.height + 200
        };

        if (this.sprite.x < bounds.x || 
            this.sprite.x > bounds.width ||
            this.sprite.y < bounds.y || 
            this.sprite.y > bounds.height) {
                this.destroy();
                console.log('敌人超出屏幕边界--destroy');
                return true;
        }

        
    }



    // 获取随机出生点
    static getRandomSpawnPoint(scene) {
        const width = scene.game.config.width;
        const height = scene.game.config.height;
        const side = Math.floor(Math.random() * 4);  // 0-3分别代表上右下左
        
        switch(side) {
            case 0: // 上
                return { x: Math.random() * width, y: 0 };
            case 1: // 右
                return { x: width, y: Math.random() * height };
            case 2: // 下
                return { x: Math.random() * width, y: height };
            case 3: // 左
                return { x: 0, y: Math.random() * height };
        }
    }

    
} 