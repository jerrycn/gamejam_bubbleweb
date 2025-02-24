//碰撞检测

class CollisionManager {
    constructor(scene) {
        this.scene = scene;
        // 碰撞处理策略映射
        this.collisionHandlers = new Map();
        // 注册碰撞处理器
        this.registerCollisionHandlers();
    }

    
    // 注册所有碰撞处理策略
    registerCollisionHandlers() {
        // 注册泡泡之间的碰撞处理
        this.collisionHandlers.set('bubble_bubble', {
            check: (currentBubble, otherBubble) => {
                if (!currentBubble || !otherBubble) return false;
                if (currentBubble === otherBubble) return false;
                if (currentBubble.state !== Bubble.State.GROWING) return false;
                if (otherBubble.state !== Bubble.State.FLOATING) return false;

                return this.checkCircleCollision(
                    currentBubble.sprite.x,
                    currentBubble.sprite.y,
                    currentBubble.getRadius(),
                    otherBubble.sprite.x,
                    otherBubble.sprite.y,
                    otherBubble.getRadius()
                );
            },
            handle: (currentBubble, otherBubble) => {
                this.scene.cat.stopBlowingBubble();
            }
        });

        // 注册泡泡和敌人的碰撞处理
        this.collisionHandlers.set('bubble_enemy', {
            check: (bubble, enemy) => {
                return this.checkCircleCollision(
                    bubble.sprite.x, bubble.sprite.y, bubble.getRadius(),
                    enemy.sprite.x, enemy.sprite.y, enemy.getRadius()
                );
            },
            handle: (bubble, enemy) => {
                if (bubble.state === Bubble.State.FLOATING) {
                    //enemy.die();
                    //bubble.pop();
                    enemy.onCollision(bubble);
                    this.scene.events.emit('enemyDefeated', enemy);
                }
            }
        });

        // 注册猫咪和敌人的碰撞处理
        this.collisionHandlers.set('cat_enemy', {
            check: (cat, enemy) => {
                return this.checkCircleCollision(
                    cat.sprite.x, cat.sprite.y, cat.getRadius(),
                    enemy.sprite.x, enemy.sprite.y, enemy.getRadius()
                );
            },
            handle: (cat, enemy) => {
                if (!cat.isInvincible) {
                    cat.hurt();
                    enemy.onCollision(cat);
                    this.scene.events.emit('playerHurt', cat);
                }
            }
        });
    }

    // 更新所有碰撞检测
    update() {
        this.checkBubbleCollisions();
        this.checkBubblesEnemiesCollision();
        this.checkCatEnemiesCollision();
    }

    // 圆形碰撞检测
    checkCircleCollision(x1, y1, r1, x2, y2, r2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (r1 + r2);
    }

    // 检查泡泡之间的碰撞
    checkBubbleCollisions() {
        const currentBubble = this.scene.cat.currentBubble;
        const bubbles = this.scene.bubbles;
        const handler = this.collisionHandlers.get('bubble_bubble');

        if (currentBubble) {
            for (const bubble of bubbles) {
                if (handler.check(currentBubble, bubble)) {
                    handler.handle(currentBubble, bubble);
                    break;
                }
            }
        }
    }

    // 检查所有泡泡和敌人的碰撞
    checkBubblesEnemiesCollision() {
        const bubbles = this.scene.bubbles;    
        const enemies = this.scene.enemies;
        const handler = this.collisionHandlers.get('bubble_enemy');
        
        for (const bubble of bubbles) {
            for (const enemy of enemies) {
                if (handler.check(bubble, enemy)) {
                    handler.handle(bubble, enemy);
                }
            }
        }
    }

    // 检查猫咪和敌人的碰撞
    checkCatEnemiesCollision() {
        const cat = this.scene.cat;
        const enemies = this.scene.enemies;
        const handler = this.collisionHandlers.get('cat_enemy');
        
        for (const enemy of enemies) {
            if (handler.check(cat, enemy)) {
                handler.handle(cat, enemy);
            }
        }
    }
} 