/**
 * SmallMonsterEnemy 类 - 小型怪物敌人
 * 
 * 功能：
 * - 继承自Enemy基类
 * - 外观为小型怪物
 * - 比Boss弱但比普通敌人强
 * 
 * @class SmallMonsterEnemy
 */
class SmallMonsterEnemy extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.scene = scene;
        this.speed = 2.0; // 设置移动速度（比Boss快）
        this.health = 2;  // 设置生命值（比Boss少）
        this.radius = 60; // 增加碰撞半径，原来是40
        
        // 创建精灵
        this.createSprite(x, y);
        
        // 初始化敌人
        this.init();
        
        console.log('小怪物创建完成');
    }
    
    // 创建精灵
    createSprite(x, y) {
        // 检查第一个纹理是否存在
        if (this.scene.textures.exists('monster0')) {
            console.log("monster0 纹理存在");
        } else {
            console.error("monster0 纹理不存在！使用替代纹理");
            // 使用一个确定存在的纹理作为替代
            this.sprite = this.scene.add.sprite(x, y, 'dianqiu0001');
            this.sprite.setScale(1.2);
            this.sprite.setDepth(4);
            return;
        }
        
        try {
            // 创建动画帧
            if (!this.scene.anims.exists('monster_move')) {
                const frames = [];
                for (let i = 0; i <= 14; i++) {
                    if (this.scene.textures.exists(`monster${i}`)) {
                        frames.push({ key: `monster${i}` });
                    } else {
                        console.warn(`monster${i} 纹理不存在`);
                    }
                }
                
                if (frames.length > 0) {
                    this.scene.anims.create({
                        key: 'monster_move',
                        frames: frames,
                        frameRate: 10,
                        repeat: -1
                    });
                } else {
                    console.error("没有有效的怪物纹理！");
                }
            }
            
            // 创建精灵并设置动画
            this.sprite = this.scene.add.sprite(x, y, 'monster0');
            this.sprite.setScale(1.2); // 小怪物比Boss小
            this.sprite.setDepth(4);
            
            // 如果动画存在，才播放
            if (this.scene.anims.exists('monster_move')) {
                this.sprite.play('monster_move');
            }
        } catch (error) {
            console.error("创建小怪物时出错:", error);
            // 创建一个基本精灵作为备用
            this.sprite = this.scene.add.rectangle(x, y, 50, 50, 0xff0000);
            this.sprite.setDepth(4);
        }
    }
    
    // 获取碰撞半径
    getRadius() {
        return this.radius;
    }
    
    // 受到伤害
    takeDamage() {
        this.health--;
        console.log('小怪物受到伤害，剩余生命：', this.health);
        
        // 闪烁效果
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 2
        });
        
        if (this.health <= 0) {
            this.die();
        }
    }
    
    // 重写碰撞回调
    onCollision(other) {
        // 与泡泡碰撞时减少生命值且改变方向
        if (other instanceof Bubble) {
            this.takeDamage();
            
            // 如果还活着，改变方向
            if (this.health > 0) {
                // 计算当前移动方向与泡泡的夹角
                const bubbleX = other.sprite.x;
                const bubbleY = other.sprite.y;
                const monsterX = this.sprite.x;
                const monsterY = this.sprite.y;
                
                // 计算从泡泡到怪物的向量（反弹方向）
                const dx = monsterX - bubbleX;
                const dy = monsterY - bubbleY;
                
                // 随机偏移角度，避免直线反弹
                const randomAngle = Math.random() * Math.PI / 4 - Math.PI / 8; // -22.5到+22.5度
                
                // 计算新方向
                const angle = Math.atan2(dy, dx) + randomAngle;
                this.moveVectorX = Math.cos(angle);
                this.moveVectorY = Math.sin(angle);
                
                console.log('小怪物改变方向:', {x: this.moveVectorX, y: this.moveVectorY});
                
                // 短暂停止后继续移动
                this.stateMachine.changeState(new EnemyIdleState(this));
                this.scene.time.delayedCall(300, () => { // 减少停顿时间
                    if (this.isActive && this.stateMachine.getCurrentState() instanceof EnemyIdleState) {
                        this.stateMachine.changeState(new EnemyMovingState(this));
                    }
                });
            }
        } else {
            super.onCollision(other);
        }
    }
    
    // 重写计算移动向量方法，使其保留当前方向（如果已有方向）
    calculateMoveVector() {
        // 如果已经有方向，就不重新计算了
        if (Math.abs(this.moveVectorX) > 0.01 || Math.abs(this.moveVectorY) > 0.01) {
            return;
        }
        
        // 否则执行父类的计算方法（追逐玩家）
        super.calculateMoveVector();
    }
    
    // 更新方法
    update() {
        // 检查边界碰撞
        this.checkBoundaryCollision();
        
        // 继续父类的update
        super.update();
    }
    
    // 检查边界碰撞并反弹
    checkBoundaryCollision() {
        if (!this.sprite) return;
        
        const width = this.scene.game.config.width;
        const height = this.scene.game.config.height;
        const margin = 20;
        let bounced = false;
        
        // 检查水平边界
        if (this.sprite.x < margin) {
            this.moveVectorX = Math.abs(this.moveVectorX); // 向右移动
            bounced = true;
        } else if (this.sprite.x > width - margin) {
            this.moveVectorX = -Math.abs(this.moveVectorX); // 向左移动
            bounced = true;
        }
        
        // 检查垂直边界
        if (this.sprite.y < margin) {
            this.moveVectorY = Math.abs(this.moveVectorY); // 向下移动
            bounced = true;
        } else if (this.sprite.y > height - margin) {
            this.moveVectorY = -Math.abs(this.moveVectorY); // 向上移动
            bounced = true;
        }
        
        // 如果发生边界碰撞，添加一个短暂的停顿
        if (bounced) {
            // 轻微随机化反弹方向
            const randomAngle = Math.random() * Math.PI / 6 - Math.PI / 12; // -15到+15度
            const magnitude = Math.sqrt(this.moveVectorX * this.moveVectorX + this.moveVectorY * this.moveVectorY);
            const angle = Math.atan2(this.moveVectorY, this.moveVectorX) + randomAngle;
            
            this.moveVectorX = Math.cos(angle) * magnitude;
            this.moveVectorY = Math.sin(angle) * magnitude;
            
            console.log('小怪物在边界反弹:', {x: this.moveVectorX, y: this.moveVectorY});
        }
    }
    
    // 静态方法：获取随机生成点
    static getRandomSpawnPoint(scene) {
        const width = scene.game.config.width;
        const height = scene.game.config.height;
        
        // 使用负的偏移量，让大部分身体在屏幕外
        const offset = -30; // 只显示一小部分
        
        // 在屏幕边缘随机选择一点
        let x, y;
        const side = Math.floor(Math.random() * 4); // 0-上, 1-右, 2-下, 3-左
        
        switch (side) {
            case 0: // 上边 - 只露出底部
                x = Phaser.Math.Between(100, width - 100);
                y = offset;
                break;
            case 1: // 右边 - 只露出左侧
                x = width - offset;
                y = Phaser.Math.Between(100, height - 100);
                break;
            case 2: // 下边 - 只露出顶部
                x = Phaser.Math.Between(100, width - 100);
                y = height - offset;
                break;
            case 3: // 左边 - 只露出右侧
                x = offset;
                y = Phaser.Math.Between(100, height - 100);
                break;
        }
        
        return { x, y };
    }
} 