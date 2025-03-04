/**
 * LightEnemy 类 - 闪电球敌人
 * 
 * 功能：
 * - 在屏幕四周随机出现
 * - 向主角移动
 * - 碰撞后反弹
 * - 播放闪电球动画
 * 
 * @class LightEnemy
 * @extends Enemy
 */
class LightEnemy extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.speed = 2.9;  // 初始速度
        this.createSprite(x, y);
        this.isChasing = true;  // 追逐状态
        this.moveVectorX = 0;   // 移动向量
        this.moveVectorY = 0;
        this.maxSpeed = 3;      // 最大速度（反弹时使用）

        this.init();
    }

    createSprite(x, y) {
        this.sprite = this.scene.add.sprite(x, y, 'dianqiu0001');
        this.sprite.setDepth(50);  // 设置渲染层级
        
        // 创建动画
        if (!this.scene.anims.exists('lightEnemy_move')) {
            const frames = [];
            for (let i = 1; i <= 19; i++) {
                frames.push({
                    key: `dianqiu${i.toString().padStart(4, '0')}`
                });
            }
            
            this.scene.anims.create({
                key: 'lightEnemy_move',
                frames: frames,
                frameRate: 24,
                repeat: -1
            });
        }
    }

    // 播放空闲动画
    playIdleAnimation(){
        // 播放动画
        this.sprite.play('lightEnemy_move');
    }

    update() {
        if (!this.isActive) return;
        
        // 更新状态机
        super.update();
    }

    // 重写碰撞回调
    onCollision(bubble) {

        // 2. constructor.name
        if (bubble.constructor.name === 'Cat') {
            super.onCollision(bubble);
            return;
        }

        if (!bubble || !bubble.sprite) return;

        this.calculateBounceMoveVector(bubble);
        // 切换到反弹状态
        this.isChasing = false;
        this.speed = this.maxSpeed;  // 使用最大速度

    }

    // 重写移动向量计算
    calculateMoveVector() {
        if (!this.isChasing) {
            // 如果不是追逐状态，保持当前反弹向量
            return;
        }

        // 调用父类的计算方法
        super.calculateMoveVector();
    }


    // 销毁泡泡
    destroy() {
        if (this.sprite) {
            super.destroy();
        }
    }

} 