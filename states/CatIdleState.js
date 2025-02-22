/**
 * CatIdleState 类 - 猫咪待机状态
 */
class CatIdleState extends CatState {
    enter() {
        this.cat.sprite.play('walk');
    }

    update() {
        // 检查是否需要切换到其他状态
        if (this.cat.isMoving()) {
            this.cat.stateMachine.changeState(new CatWalkingState(this.cat));
        }
    }
} 