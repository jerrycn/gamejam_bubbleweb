/**
 * Bubble 类 - 普通泡泡
 * 
 * 功能：
 * - 创建可放大的泡泡
 * - 管理泡泡的状态（隐藏、放大中、漂浮）
 * - 处理泡泡的动画效果
 * 
 * 状态：
 * - HIDDEN: 隐藏状态
 * - GROWING: 放大中
 * - FLOATING: 漂浮状态
 * 
 * @class Bubble
 */
class Bubble {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.add.image(x, y, 'bubble');
        this.sprite.setVisible(false);
        this.sprite.setScale(0.1);
        this.sprite.setDepth(100);
        // 泡泡状态
        this.state = Bubble.State.HIDDEN;
        this.currentTween = null;
    }

    // 泡泡的状态枚举
    static State = {
        HIDDEN: 'hidden',    // 隐藏状态
        GROWING: 'growing',  // 正在放大
        FLOATING: 'floating' // 放大完成，漂浮状态
    };

    // 开始放大动画
    startGrowing(x, y) {
        this.sprite.setPosition(x, y);
        this.sprite.setVisible(true);
        this.sprite.setScale(0.1);
        this.state = Bubble.State.GROWING;

        this.currentTween = this.scene.tweens.add({
            targets: this.sprite,
            scale: 2,
            alpha: { from: 1, to: 0.7 },
            duration: 3000,
            ease: 'Linear',
            onComplete: () => {
                this.state = Bubble.State.FLOATING;
            }
        });
    }

    // 停止放大动画
    stopGrowing() {
        if (this.currentTween) {
            this.currentTween.stop();
            this.currentTween = null;
            
            // 获取当前泡泡的位置和大小
            const x = this.sprite.x;
            const y = this.sprite.y;
            const radius = this.sprite.displayWidth / 2; // 获取实际显示大小的半径
            
            // 创建光效泡泡
            const lightBubble = new LightBubble(this.scene, x, y, radius);
            lightBubble.setVisible(true);
            lightBubble.setDepth(1); // 确保在适当的层级
        }
        this.state = Bubble.State.FLOATING;
    }

    // 隐藏泡泡
    hide() {
        this.sprite.setVisible(false);
        this.state = Bubble.State.HIDDEN;
        if (this.currentTween) {
            this.currentTween.stop();
            this.currentTween = null;
        }
    }

    // 获取当前状态
    getState() {
        return this.state;
    }
} 