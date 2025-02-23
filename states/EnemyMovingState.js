/**
 * EnemyMovingState 类 - 敌人移动状态
 */
class EnemyMovingState extends EnemyState {
    enter() {
        // 使用基类的动画方法
        this.enemy.playMoveAnimation();
        
        // 计算移动向量
        this.calculateMoveVector();
    }

    calculateMoveVector() {
        // 计算与猫咪的位置向量
        const dx = cat.sprite.x - this.enemy.sprite.x;
        const dy = cat.sprite.y - this.enemy.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 标准化向量
        this.moveVectorX = dx / distance;
        this.moveVectorY = dy / distance;
    }

    update() {
        // 如果在泡泡中，切换到空闲状态并反转移动方向
        if (this.enemy.checkBubbleCollision(bubbles)) {
            // 反转移动向量
            this.moveVectorX = -this.moveVectorX;
            this.moveVectorY = -this.moveVectorY;
            
            // 稍微移动一下以避免立即再次检测到碰撞
            this.enemy.sprite.x += this.moveVectorX * this.enemy.speed * 2;
            this.enemy.sprite.y += this.moveVectorY * this.enemy.speed * 2;
            
            this.enemy.stateMachine.changeState(new EnemyIdleState(this.enemy));
            return;
        }

        // 执行移动逻辑
        this.enemy.sprite.x += this.moveVectorX * this.enemy.speed;
        this.enemy.sprite.y += this.moveVectorY * this.enemy.speed;
        
        // 根据移动方向设置精灵朝向
        if (this.moveVectorX > 0) {
            this.enemy.sprite.setFlipX(true);
        } else {
            this.enemy.sprite.setFlipX(false);
        }
    }
} 