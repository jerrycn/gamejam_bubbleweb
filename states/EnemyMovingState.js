/**
 * EnemyMovingState 类 - 敌人移动状态
 */
class EnemyMovingState extends EnemyState {
    enter() {
        // 使用基类的动画方法
        this.enemy.playMoveAnimation();
        
        // 计算移动向量
        this.enemy.calculateMoveVector();
    }

    

    update() {
        // 执行移动逻辑
        this.enemy.sprite.x += this.enemy.moveVectorX * this.enemy.speed;
        this.enemy.sprite.y += this.enemy.moveVectorY * this.enemy.speed;
        
        // 根据移动方向设置精灵朝向
        if (this.enemy.moveVectorX > 0) {
            this.enemy.sprite.setFlipX(true);
        } else {
            this.enemy.sprite.setFlipX(false);
        }
    }
} 