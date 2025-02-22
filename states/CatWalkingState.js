/**
 * CatWalkingState 类 - 猫咪行走状态
 */
class CatWalkingState extends CatState {
    enter() {
        this.cat.sprite.play('walk');
        if (!this.cat.moveSound.isPlaying) {
            this.cat.moveSound.play();
        }
    }

    update() {
        if (!this.cat.isMoving()) {
            this.cat.stateMachine.changeState(new CatIdleState(this.cat));
        }
    }

    exit() {
        this.cat.moveSound.stop();
    }
} 