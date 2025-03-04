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
        this.radius = 120; // 碰撞半径
        this.life = 1;    //生命
        // 创建精灵
        this.createSprite(x, y);
        
        // 初始化敌人
        this.init();
        
        console.log('Boss敌人创建完成');
        this.stateMachine.changeState(new EnemyIdleState(this));
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
    
    
    // 重写碰撞回调
    onCollision(other) {

        // 2. constructor.name
        if (other.constructor.name === 'Cat') {
            super.onCollision(other);
            return
        }

        if (!other || !other.sprite) return;

        if (this.life <= 0) return;
        this.life--;

        // 短暂停止后继续移动
        this.stateMachine.changeState(new EnemyIdleState(this));
        this.scene.time.delayedCall(1000, () => {
            if (this.stateMachine.getCurrentState() instanceof EnemyIdleState) {
                this.stateMachine.changeState(new EnemyDeadState(this));

                if (other.constructor.name === 'Bubble') {
                    other.explosion();
                }
            }
        });
    }

    //播放死亡动画
    playDeadAnimation() {
        console.log('播放Boss死亡动画');
        
        // 检查是否已经创建了爆炸动画
        if (!this.scene.anims.exists('boss-dead')) {
            console.log('创建Boss爆炸动画');
            
            // 创建爆炸动画帧序列
            const frames = [];
            
            // 尝试加载第一种格式的帧 (boss_zibao00_XX)
            for (let i = 0; i <= 13; i++) {
                const frameNumber = i.toString().padStart(2, '0');
                const key = `boss_zibao00_${frameNumber}`;
                
                if (this.scene.textures.exists(key)) {
                    frames.push({ key: key });
                }
            }
            
            // 尝试加载第二种格式的帧 (zibaoXXXXX)
            for (let i = 100; i <= 117; i++) {
                const frameNumber = i.toString();
                const key = `zibao${frameNumber}`;
                
                if (this.scene.textures.exists(key)) {
                    frames.push({ key: key });
                }
            }
            
            // 记录找到的帧数
            console.log(`找到 ${frames.length} 个爆炸动画帧`);
            
            // 确保有足够的帧创建动画
            if (frames.length > 0) {
                this.scene.anims.create({
                    key: 'boss-dead',
                    frames: frames,
                    frameRate: 12,
                    repeat: 0
                });
            } else {
                console.error('没有可用的爆炸动画帧');
            }
        }
        
        // 停止当前动画
        this.sprite.stop();
        
        // 如果爆炸动画存在，播放它
        if (this.scene.anims.exists('boss-dead')) {
            // 添加爆炸特效
            this.sprite.play('boss-dead');
            
            // 动画播放完成后销毁
            this.sprite.once('animationcomplete', () => {
                console.log('Boss死亡动画播放完成');
                this.destroy();
            });
        } else {
            // 如果动画不存在，使用备用方案（渐变消失效果）
            console.warn('使用备用死亡效果');
            this.scene.tweens.add({
                targets: this.sprite,
                alpha: 0,
                scale: 0.5,
                duration: 800,
                ease: 'Power2',
                onComplete: () => {
                    this.destroy();
                }
            });
            
            // 添加闪烁效果
            this.scene.tweens.add({
                targets: this.sprite,
                alpha: { from: 1, to: 0.2 },
                duration: 100,
                yoyo: true,
                repeat: 4
            });
        }
    }
    
    // 更新方法
    update() {
        super.update();
        
        // 输出状态和位置信息
        // console.log('Boss状态:', this.state);
        // console.log('Boss位置:', {
        //     x: this.sprite.x,
        //     y: this.sprite.y
        // });
    }
    
} 