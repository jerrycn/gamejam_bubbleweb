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
        this.speed = 0;
        this.isActive = true;

        // 初始化状态机
        this.stateMachine = new StateMachine();
    }

    // 初始化敌人（由子类调用）
    init() {
        // 设置初始状态为移动
        this.stateMachine.changeState(new EnemyMovingState(this));
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
} 