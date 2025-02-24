// 基础游戏对象类
class GameObject {
    constructor(scene) {
        this.scene = scene;
        this.sprite = null;
    }

    getRadius() {
        return this.sprite.displayWidth / 4;
    }

    getPosition() {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        };
    }
} 