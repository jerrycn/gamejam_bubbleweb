/**
 * EnemyMovingState 类 - 敌人移动状态
 */
class EnemyMovingState extends EnemyState {
    enter() {
        // 可以添加进入移动状态的动画或效果
        this.enemy.sprite.play('move');
    }

    update() {
        // 如果在泡泡中，切换到空闲状态
        if (this.enemy.checkBubbleCollision(bubbles)) {
            this.enemy.stateMachine.changeState(new EnemyIdleState(this.enemy));
            return;
        }

        // 执行移动逻辑
        const dx = cat.sprite.x - this.enemy.sprite.x;
        const dy = cat.sprite.y - this.enemy.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            const speed = this.enemy.speed;
            this.enemy.sprite.x += (dx / distance) * speed;
            this.enemy.sprite.y += (dy / distance) * speed;
        }
    }
} 