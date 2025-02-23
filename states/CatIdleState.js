/**
 * CatIdleState 类 - 猫咪待机状态
 */
class CatIdleState extends CatState {
    enter() {
        this.cat.sprite.play('walk');
    }

    update(input) {
        const { cursors, wasdKeys, mouseKeys } = input;
        
        // 检查移动输入
        const isMoving = cursors.left.isDown || wasdKeys.left.isDown ||
            cursors.right.isDown || wasdKeys.right.isDown ||
            cursors.up.isDown || wasdKeys.up.isDown ||
            cursors.down.isDown || wasdKeys.down.isDown;

        if (isMoving) {
            this.cat.stateMachine.changeState(new CatWalkingState(this.cat));
            return;
        }
        
        // 检查吹泡泡输入
        if (mouseKeys.down && !this.cat.isInBubble(this.cat.bubbles)) {
            this.cat.stateMachine.changeState(new CatBlowingState(this.cat));
        }
    }
} 