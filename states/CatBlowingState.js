/**
 * CatBlowingState 类 - 猫咪吹泡泡状态
 */
class CatBlowingState extends CatState {
    enter() {
        this.cat.sprite.play('blow');
        this.cat.startBlowingBubble();
    }

    exit() {
        this.cat.stopBlowingBubble();
    }
} 