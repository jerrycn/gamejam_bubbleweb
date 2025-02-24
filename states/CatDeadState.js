/**
 * CatDeadState 类 - 猫咪死亡状态
 */
class CatDeadState extends CatState {
    enter() {
        // 停止其他动画
        this.cat.sprite.stop();
        
        // 创建闪烁效果
        this.flashTween = this.cat.scene.tweens.add({
            targets: this.cat.sprite,
            alpha: 0.2,
            duration: 200,
            ease: 'Linear',
            yoyo: true,
            repeat: 4,
            onComplete: () => {
                // 闪烁结束后显示游戏结束UI或重启游戏
                this.cat.scene.scene.pause();  // 暂停当前场景
                // 可以在这里触发游戏结束事件
                this.cat.scene.events.emit('gameOver');
            }
        });
    }

    update(input) {
        // 死亡状态下不响应任何输入
    }

    exit() {
        if (this.flashTween) {
            this.flashTween.stop();
        }
        this.cat.sprite.setAlpha(1);
    }
} 