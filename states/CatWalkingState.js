/**
 * CatWalkingState 类 - 猫咪行走状态
 */
class CatWalkingState extends CatState {
    enter() {
        // 播放行走动画
        this.cat.sprite.play('walk');
        // 播放移动音效
        this.cat.playMoveSound();
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
            this.cat.stopMoveSound();  // 停止移动音效
            this.cat.stateMachine.changeState(new CatBlowingState(this.cat));
            return;
        }

        // 如果没有移动输入，切换到待机状态
        if (!isMoving) {
            this.cat.stopMoveSound();  // 停止移动音效
            this.cat.stateMachine.changeState(new CatIdleState(this.cat));
        }
    }

    exit() {
        // 停止行走动画
        this.cat.sprite.stop();
        // 停止移动音效
        this.cat.stopMoveSound();
    }
} 