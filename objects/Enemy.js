/**
 * Enemy 类 - 敌人基类
 * 
 * 功能：
 * - 提供敌人的基础属性和方法
 * - 处理基础的移动和碰撞逻辑
 * 
 * @class Enemy
 */
class Enemy {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = null;
        this.speed = 0;
        this.isActive = true;
    }

    update() {
        // 基类的更新方法
    }

    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
        }
    }
} 