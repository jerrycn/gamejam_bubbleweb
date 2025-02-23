/**
 * EnemyIdleState 类 - 敌人空闲状态
 */
class EnemyIdleState extends EnemyState {
    enter() {
        // 设置被困在泡泡中的视觉效果
        this.enemy.sprite.setTint(0x8888ff);
    }

    update() {
        // 如果不在泡泡中，切换回移动状态
        if (!this.enemy.checkBubbleCollision(bubbles)) {
            this.enemy.stateMachine.changeState(new EnemyMovingState(this.enemy));
        }
    }

    exit() {
        // 清除视觉效果
        this.enemy.sprite.clearTint();
    }
} 