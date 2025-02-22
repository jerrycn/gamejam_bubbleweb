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
        this.speed = 2;  // 速度可以调整
        this.createSprite(x, y);
        this.velocity = { x: 0, y: 0 };
        // 添加缓动效果
        this.acceleration = 0.1;
        this.maxSpeed = 3;
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
        
        // 播放动画
        this.sprite.play('lightEnemy_move');
    }

    update() {
        if (!this.isActive) return;

        // 获取猫咪位置（从猫咪的sprite获取）
        const catPos = cat.getPosition();  // 使用 cat.getPosition()
        const dx = catPos.x - this.sprite.x;
        const dy = catPos.y - this.sprite.y;
        
        // 计算方向向量
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length > 0) {  // 防止除以0
            // 使用加速度平滑移动
            const targetVx = (dx / length) * this.maxSpeed;
            const targetVy = (dy / length) * this.maxSpeed;
            
            this.velocity.x += (targetVx - this.velocity.x) * this.acceleration;
            this.velocity.y += (targetVy - this.velocity.y) * this.acceleration;
        }

        // 更新位置
        this.sprite.x += this.velocity.x;
        this.sprite.y += this.velocity.y;

        // 检查边界碰撞
        this.checkBoundaryCollision();
    }

    checkBoundaryCollision() {
        const bounds = {
            left: 50,  // 留出一些边距
            right: this.scene.game.config.width - 50,
            top: 50,
            bottom: this.scene.game.config.height - 50
        };

        // 改进碰撞反弹逻辑
        if (this.sprite.x < bounds.left) {
            this.sprite.x = bounds.left;
            this.velocity.x = Math.abs(this.velocity.x);
        } else if (this.sprite.x > bounds.right) {
            this.sprite.x = bounds.right;
            this.velocity.x = -Math.abs(this.velocity.x);
        }

        if (this.sprite.y < bounds.top) {
            this.sprite.y = bounds.top;
            this.velocity.y = Math.abs(this.velocity.y);
        } else if (this.sprite.y > bounds.bottom) {
            this.sprite.y = bounds.bottom;
            this.velocity.y = -Math.abs(this.velocity.y);
        }
    }

    // 修改碰撞检测方法
    checkCollision(cat) {
        if (!this.isActive || !this.sprite) return false;
        
        const catPos = cat.getPosition();
        const dx = this.sprite.x - catPos.x;
        const dy = this.sprite.y - catPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (this.sprite.width + cat.sprite.width) * 0.4; // 可以调整碰撞范围
        
        return distance < minDistance;
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