/**
 * BossEnemy 类 - 游戏Boss敌人
 * 
 * 功能：
 * - 继承自Enemy基类
 * - 实现更强大的Boss敌人
 * - 特殊的移动和攻击模式
 * 
 * @class BossEnemy
 */
class BossEnemy extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.scene = scene;
        this.speed = 1.0; // 设置移动速度
        this.health = 3;  // 设置生命值
        this.radius = 60; // 碰撞半径
        
        // 创建精灵
        this.createSprite(x, y);
        
        // 初始化敌人
        this.init();
        
        console.log('Boss敌人创建完成');
    }
    
    // 创建精灵
    createSprite(x, y) {
        // 创建动画帧
        if (!this.scene.anims.exists('boss_move')) {
            const frames = [];
            for (let i = 0; i <= 19; i++) {
                frames.push({ key: `boss${i}` });
            }
            
            this.scene.anims.create({
                key: 'boss_move',
                frames: frames,
                frameRate: 10,
                repeat: -1
            });
        }
        
        // 创建精灵并设置动画
        this.sprite = this.scene.add.sprite(x, y, 'boss0');
        //this.sprite.setScale(1.5); // Boss更大
        this.sprite.setDepth(5);
        this.sprite.play('boss_move');
    }
    
    // 获取碰撞半径
    getRadius() {
        return this.radius;
    }
    
    // 受到伤害
    takeDamage() {
        this.health--;
        console.log('Boss受到伤害，剩余生命：', this.health);
        
        // 闪烁效果
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 3
        });
        
        if (this.health <= 0) {
            this.die();
        }
    }
    
    // 重写碰撞回调
    onCollision(other) {
        // 与泡泡碰撞时减少生命值而不是直接进入空闲状态
        if (other instanceof Bubble) {
            this.takeDamage();
            // 如果还活着，继续追逐
            if (this.health > 0) {
                // 短暂停止后继续移动
                this.stateMachine.changeState(new EnemyIdleState(this));
                this.scene.time.delayedCall(1000, () => {
                    if (this.stateMachine.getCurrentState() instanceof EnemyIdleState) {
                        this.stateMachine.changeState(new EnemyMovingState(this));
                    }
                });
            }
        } else {
            super.onCollision(other);
        }
    }
    
    // 特殊的Boss攻击
    specialAttack() {
        console.log('Boss发动特殊攻击');
        // 循环攻击动画
        this.scene.tweens.add({
            targets: this.sprite,
            scale: 1.8,
            duration: 500,
            yoyo: true,
            onComplete: () => {
                // 在这里可以生成攻击物体
                //this.createAttackProjectiles();
            }
        });
    }
    
    // 创建攻击投射物
    createAttackProjectiles() {
        const projectileCount = 8;
        const angleStep = (2 * Math.PI) / projectileCount;
        
        for (let i = 0; i < projectileCount; i++) {
            const angle = i * angleStep;
            const offsetX = Math.cos(angle) * 50;
            const offsetY = Math.sin(angle) * 50;
            
            // 创建并发射投射物
            if (this.scene.spawnLightEnemy) {
                const spawnPoint = {
                    x: this.sprite.x + offsetX,
                    y: this.sprite.y + offsetY
                };
                const enemy = new LightEnemy(this.scene, spawnPoint.x, spawnPoint.y);
                this.scene.enemies.push(enemy);
            }
        }
    }
    
    // 更新方法
    update() {
        super.update();
        
        // // 随机触发特殊攻击
        // if (Math.random() < 0.003) { // 每次更新有0.3%的几率触发
        //     this.specialAttack();
        // }
    }
    
} 