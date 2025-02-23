/**
 * Enemy 类 - 敌人基类
 * 
 * 功能：
 * - 提供敌人的基础属性和方法
 * - 处理基础的移动和碰撞逻辑
 * 
 * @class Enemy
 */
class Enemy {
    // 敌人的状态枚举
    static State = {
        MOVING: 'moving',
        IDLE: 'idle',
        DEAD: 'dead'
    };

    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = null;
        this.speed = 2; // 设置默认移动速度
        this.isActive = true;

        // 初始化状态机
        this.stateMachine = new StateMachine();
    }

    // 初始化敌人（由子类调用）
    init() {
        // 设置初始状态为移动
        //this.stateMachine.changeState(new EnemyMovingState(this));
        this.stateMachine.changeState(new EnemyIdleState(this));

    }

    // 检查是否与泡泡碰撞
    checkBubbleCollision(bubbles) {
        const enemyX = this.sprite.x;
        const enemyY = this.sprite.y;
        const enemyRadius = this.sprite.displayWidth / 4;

        for (const bubble of bubbles) {
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
    }

    update() {
        // 更新状态机
        this.stateMachine.update();
    }

    // 切换到死亡状态
    die() {
        this.stateMachine.changeState(new EnemyDeadState(this));
    }

    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
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
} 