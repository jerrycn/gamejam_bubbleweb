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
        
        // 添加音效
        this.blowingSound = scene.sound.add('bubble_blowing', {
            volume: 0.4,
            loop: true
        });
        
        this.blowingEndSound = scene.sound.add('bubble_blowing_end', {
            volume: 0.4,
            loop: false
        });

        // 泡泡状态
        this.state = Bubble.State.HIDDEN;
        this.currentTween = null;
        this.radius = 0;
        
        // 创建特效精灵（初始隐藏）
        this.effectSprite = scene.add.sprite(x, y, 'bubble_effect_0');
        this.effectSprite.setVisible(false);
        this.effectSprite.setDepth(101); // 确保特效显示在泡泡上层
        
        // 监听特效动画完成事件
        this.effectSprite.on('animationcomplete', () => {
            this.effectSprite.setVisible(false);
        });
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
        this.radius = this.sprite.displayWidth / 2;

        // 播放放大音效
        if (!this.blowingSound.isPlaying) {
            this.blowingSound.play();
        }

        this.currentTween = this.scene.tweens.add({
            targets: this.sprite,
            scale: 2,
            alpha: { from: 1, to: 0.7 },
            duration: 3000,
            ease: 'Linear',
            onUpdate: () => {
                this.radius = this.sprite.displayWidth / 2;
            },
            onComplete: () => {
                this.state = Bubble.State.FLOATING;
                this.stopGrowing();
            }
        });
    }

    // 停止放大动画
    stopGrowing() {
        if (this.currentTween) {
            this.currentTween.stop();
            this.currentTween = null;
        }
        
        // 停止放大音效并播放结束音效
        this.blowingSound.stop();
        this.blowingEndSound.play();
        
        this.state = Bubble.State.FLOATING;
        this.sprite.setAlpha(0.7);
        
        // 播放特效动画
        this.playEffect();
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

    // 销毁泡泡
    destroy() {
        if (this.currentTween) {
            this.currentTween.stop();
        }
        // 停止并销毁音效
        this.blowingSound.stop();
        this.blowingSound.destroy();
        this.blowingEndSound.destroy();
        
        this.sprite.destroy();
        this.effectSprite.destroy();
    }

    // 检查是否与其他泡泡碰撞
    checkCollision(otherBubble) {
        if (this.state !== Bubble.State.GROWING) return false;
        
        const dx = this.sprite.x - otherBubble.sprite.x;
        const dy = this.sprite.y - otherBubble.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 如果两个泡泡的半径之和大于它们中心点之间的距离，则发生碰撞
        return distance < (this.radius + otherBubble.radius);
    }

    // 获取当前半径
    getRadius() {
        return this.radius;
    }

    // 播放特效动画
    playEffect() {
        this.effectSprite.setPosition(this.sprite.x, this.sprite.y);
        this.effectSprite.setScale(this.sprite.scale);
        this.effectSprite.setVisible(true);
        this.effectSprite.play('bubble_effect');
    }

    // 修改 setPosition 方法，同时更新特效位置
    setPosition(x, y) {
        this.sprite.setPosition(x, y);
        this.effectSprite.setPosition(x, y);
    }
} 