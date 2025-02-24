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
        this.speed = 2;  // 初始速度
        this.createSprite(x, y);
        this.isChasing = true;  // 追逐状态
        this.moveVectorX = 0;   // 移动向量
        this.moveVectorY = 0;
        this.maxSpeed = 3;      // 最大速度（反弹时使用）
        this.checkScreenBoundsTimer = null;  // 用于存储边界检查定时器

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
        }

        if (!bubble || !bubble.sprite) return;

        // 计算碰撞点的法线向量（从泡泡中心指向敌人）
        const nx = this.sprite.x - bubble.sprite.x;
        const ny = this.sprite.y - bubble.sprite.y;
        const len = Math.sqrt(nx * nx + ny * ny);
        const normalX = nx / len;
        const normalY = ny / len;

        // 计算反弹向量（反射定律：r = d - 2(d·n)n）
        const dot = this.moveVectorX * normalX + this.moveVectorY * normalY;
        this.moveVectorX = this.moveVectorX - 2 * dot * normalX;
        this.moveVectorY = this.moveVectorY - 2 * dot * normalY;

        // 切换到反弹状态
        this.isChasing = false;
        this.speed = this.maxSpeed;  // 使用最大速度

        // 清除之前的定时器（如果存在）
        if (this.checkScreenBoundsTimer) {
            this.checkScreenBoundsTimer.remove();
        }

        // 设置新的定时器检查屏幕边界
        this.checkScreenBoundsTimer = this.scene.time.addEvent({
            delay: 100,
            callback: this.checkScreenBounds,
            callbackScope: this,
            loop: true
        });
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

    // 检查是否超出屏幕边界
    checkScreenBounds() {
        const bounds = this.scene.physics.world.bounds;
        if (this.sprite.x < bounds.x || 
            this.sprite.x > bounds.width ||
            this.sprite.y < bounds.y || 
            this.sprite.y > bounds.height) {
            
            // 清除定时器
            if (this.checkScreenBoundsTimer) {
                this.checkScreenBoundsTimer.remove();
                this.checkScreenBoundsTimer = null;
            }
            
            // 销毁敌人
            this.destroy();
        }
    }

    // 获取随机出生点
    static getRandomSpawnPoint(scene) {
        const width = scene.game.config.width;
        const height = scene.game.config.height;
        const side = Math.floor(Math.random() * 4);  // 0-3分别代表上右下左
        
        switch(side) {
            case 0: // 上
                return { x: Math.random() * width, y: 0 };
            case 1: // 右
                return { x: width, y: Math.random() * height };
            case 2: // 下
                return { x: Math.random() * width, y: height };
            case 3: // 左
                return { x: 0, y: Math.random() * height };
        }
    }
} 