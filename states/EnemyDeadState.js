/**
 * EnemyDeadState 类 - 敌人死亡状态
 */
class EnemyDeadState extends EnemyState {
    enter() {
        // 播放死亡动画
        this.enemy.sprite.play('dead');
        
        // 设置定时器在动画播放完后销毁敌人
        this.enemy.scene.time.delayedCall(1000, () => {
            this.enemy.destroy();
        });
    }

    update() {
        // 死亡状态不需要更新
    }
} 