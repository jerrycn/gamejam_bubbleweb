/**
 * EnemyIdleState 类 - 敌人空闲状态
 */
class EnemyIdleState extends EnemyState {
    enter() {
        // 使用基类的动画方法
        this.enemy.playIdleAnimation();
        // 设置被困在泡泡中的视觉效果
        this.enemy.sprite.setTint(0x8888ff);
        
        // 随机 3-5 秒后切换到移动状态
        const randomTime = Phaser.Math.Between(3000, 5000);
        this.enemy.scene.time.delayedCall(randomTime, () => {
            if (this.enemy.stateMachine.getCurrentState() instanceof EnemyIdleState) {
                this.enemy.stateMachine.changeState(new EnemyMovingState(this.enemy));
            }
        });
    }

    update() {
        // 如果在泡泡中，保持空闲状态
        if (this.enemy.checkBubbleCollision(bubbles)) {
            return;
        }
    }

    exit() {
        // 清除视觉效果
        this.enemy.sprite.clearTint();
    }
} 