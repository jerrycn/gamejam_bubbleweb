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

        // 创建泡泡特效动画
        if (!scene.anims.exists('bubble_effect')) {
            const effectFrames = [];
            for (let i = 0; i <= 5; i++) {
                effectFrames.push({ key: `bubble_effect_${i}` });
            }
            
            scene.anims.create({
                key: 'bubble_effect',
                frames: effectFrames,
                frameRate: 12,
                repeat: 0,  // 只播放一次
                hideOnComplete: true  // 播放完成后自动隐藏
            });
        }
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
        
        if (this.lightBubble) {
            this.lightBubble.destroy();
            this.lightBubble = null;
        }

        if (this.sprite) {
            this.scene.removeBubble(this);
            this.sprite.destroy();
        }
    }

    //设置光效泡泡
    setLightBubble(lightBubble){
        this.lightBubble = lightBubble;
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
        console.log("---playEffect start");
        
        // 每次播放时创建新的特效精灵
        const effectSprite = this.scene.add.sprite(this.sprite.x, this.sprite.y, 'bubble_effect_0');
        effectSprite.setScale(this.sprite.scale);
        effectSprite.setDepth(101);
        
        // 检查动画是否存在
        const anim = this.scene.anims.get('bubble_effect');
        console.log("Animation exists:", !!anim);
        
        // 播放动画并在完成后销毁
        effectSprite.play('bubble_effect');
        
        // 添加更多事件监听以便调试
        effectSprite.on('animationstart', () => {
            console.log("---Animation started");
        });
        
        effectSprite.on('animationupdate', () => {
            console.log("---Animation frame updated");
        });
        
        effectSprite.on('animationcomplete', () => {
            console.log("---Animation completed");
            effectSprite.destroy();
        });
        
        effectSprite.on('destroy', () => {
            console.log("---Sprite destroyed");
        });
    }

    // 修改 setPosition 方法，移除特效位置更新
    setPosition(x, y) {
        this.sprite.setPosition(x, y);
    }

    //爆炸
    explosion(){
        this.playDeadAnimation();

        this.destroy();
    }

    // 播放死亡动画
    playDeadAnimation() {
        console.log('播放泡泡爆炸动画');
        
        // 检查是否已经创建了爆炸动画
        if (!this.scene.anims.exists('bubble-explosion')) {
            console.log('创建泡泡爆炸动画');
            
            // 创建爆炸动画帧序列
            const frames = [];
            
            // 加载爆炸帧 (baozha0000.png 到 baozha0016.png)
            for (let i = 0; i <= 16; i++) {
                const frameNumber = i.toString().padStart(4, '0');
                const key = `baozha${frameNumber}`;
                
                if (this.scene.textures.exists(key)) {
                    frames.push({ key: key });
                }
            }
            
            // 记录找到的帧数
            console.log(`找到 ${frames.length} 个泡泡爆炸动画帧`);
            
            // 确保有足够的帧创建动画
            if (frames.length > 0) {
                this.scene.anims.create({
                    key: 'bubble-explosion',
                    frames: frames,
                    frameRate: 20,
                    repeat: 0
                });
            } else {
                console.error('没有可用的泡泡爆炸动画帧');
            }
        }
        
        // 创建一个新的精灵来显示爆炸效果
        // 这样可以让泡泡消失的同时播放爆炸动画
        const explosionSprite = this.scene.add.sprite(this.sprite.x, this.sprite.y, 'baozha0000');
        explosionSprite.setScale(this.sprite.scale * 1.2); // 略大于泡泡
        explosionSprite.setDepth(102);
        
        // 如果爆炸动画存在，播放它
        if (this.scene.anims.exists('bubble-explosion')) {
            // 添加爆炸特效
            explosionSprite.play('bubble-explosion');
            
            // 动画播放完成后销毁
            explosionSprite.once('animationcomplete', () => {
                console.log('泡泡爆炸动画播放完成');
                explosionSprite.destroy();
            });
        } else {
            // 如果动画不存在，使用简单的缩放效果
            console.warn('使用备用爆炸效果');
            this.scene.tweens.add({
                targets: explosionSprite,
                alpha: 0,
                scale: { from: this.sprite.scale * 1.5, to: this.sprite.scale * 0.2 },
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    explosionSprite.destroy();
                }
            });
        }
        
        // 让原泡泡立即消失
        this.sprite.setVisible(false);
        this.state = Bubble.State.HIDDEN;
    }
} 