/**
 * CatBlowingState 类 - 猫咪吹泡泡状态
 */
class CatBlowingState extends CatState {
    enter() {
        this.cat.sprite.play('blow');
        this.cat.startBlowingBubble();
    }

    update(input) {
        const { mouseKeys } = input;
        
        // 在更新时检查泡泡碰撞
        this.cat.checkBubbleCollisions();

        // 检查是否需要切换回待机状态
        if (!mouseKeys.down) {
            this.cat.stateMachine.changeState(new CatIdleState(this.cat));
        }
    }

    exit() {
        this.cat.stopBlowingBubble();
    }
} 