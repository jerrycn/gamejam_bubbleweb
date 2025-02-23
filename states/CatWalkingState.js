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

    update(input) {
        const { cursors, wasdKeys, mouseKeys } = input;
        const speed = 2;
        let isMoving = false;

        // 处理移动
        if (cursors.left.isDown || wasdKeys.left.isDown) {
            this.cat.sprite.x -= speed;
            this.cat.sprite.setFlipX(false);
            isMoving = true;
        }
        if (cursors.right.isDown || wasdKeys.right.isDown) {
            this.cat.sprite.x += speed;
            this.cat.sprite.setFlipX(true);
            isMoving = true;
        }
        if (cursors.up.isDown || wasdKeys.up.isDown) {
            this.cat.sprite.y -= speed;
            isMoving = true;
        }
        if (cursors.down.isDown || wasdKeys.down.isDown) {
            this.cat.sprite.y += speed;
            isMoving = true;
        }

        // 检查吹泡泡输入
        if (mouseKeys.down && !this.cat.isInBubble(this.cat.bubbles)) {
            this.cat.stateMachine.changeState(new CatBlowingState(this.cat));
            return;
        }

        // 如果没有移动输入，切换到待机状态
        if (!isMoving) {
            this.cat.stateMachine.changeState(new CatIdleState(this.cat));
        }
    }

    exit() {
        this.cat.moveSound.stop();
    }
} 