/**
 * LightBubble 类 - 圆形裁剪的光效泡泡
 * 
 * 功能：
 * - 在指定位置创建一个圆形裁剪的光效泡泡
 * - 使用 bubblelight.png 纹理
 * - 通过圆形遮罩实现裁剪效果
 * 
 * 属性：
 * - scene: Phaser场景实例
 * - sprite: 泡泡精灵对象
 * - radius: 圆形裁剪半径
 * 
 * 主要方法：
 * - setPosition: 设置泡泡位置
 * - setVisible: 控制可见性
 * - setDepth: 设置渲染深度
 * 
 * @class LightBubble
 */
class LightBubble {
    /**
     * 创建一个圆形裁剪的光泡泡
     * @param {Phaser.Scene} scene - Phaser场景实例
     * @param {number} x - 泡泡的X坐标
     * @param {number} y - 泡泡的Y坐标
     * @param {number} radius - 圆形裁剪的半径
     */
    constructor(scene, x, y, radius) {
        // 保存引用以便后续使用
        this.scene = scene;
        this.radius = radius;
        
        // 创建一个圆形遮罩用于裁剪纹理
        const circle = new Phaser.GameObjects.Graphics(scene);
        circle.clear();  // 清除任何现有的绘图
        circle.fillStyle(0xffffff);  // 设置填充颜色为白色
        // 在指定位置绘制圆形，用于裁剪
        circle.fillCircle(x, y, radius);
        
        const centerX = scene.game.config.width*0.5
        const centerY = scene.game.config.height*0.5
        // 创建光泡泡精灵，使用 'bubblelight' 纹理
        this.sprite = scene.add.image(centerX, centerY, 'bubblelight');
        //this.sprite.setTextureKey('bubblelight', true); // true 表示启用共享纹理
    
        // 应用圆形遮罩，实现圆形裁剪效果
        this.sprite.setMask(circle.createGeometryMask());
    }

    /**
     * 设置泡泡位置，同时更新遮罩位置
     * @param {number} x - 新的X坐标
     * @param {number} y - 新的Y坐标
     */
    setPosition(x, y) {
        // 更新精灵位置
        this.sprite.setPosition(x, y);
        // 重新创建遮罩在新位置
        const circle = new Phaser.GameObjects.Graphics(this.scene);
        circle.clear();
        circle.fillStyle(0xffffff);
        circle.fillCircle(x, y, this.radius);
        // 应用新的遮罩
        this.sprite.setMask(circle.createGeometryMask());
    }

    /**
     * 设置泡泡的可见性
     * @param {boolean} visible - 是否可见
     */
    setVisible(visible) {
        this.sprite.setVisible(visible);
    }

    /**
     * 设置泡泡的渲染深度
     * @param {number} depth - 渲染层级，数值越大越靠前
     */
    setDepth(depth) {
        this.sprite.setDepth(depth);
    }

    /**
     * 获取泡泡的精灵对象
     * @returns {Phaser.GameObjects.Image} 泡泡精灵
     */
    getSprite() {
        return this.sprite;
    }

    /**
     * 销毁泡泡对象，释放资源
     */
    destroy() {
        this.sprite.destroy();
    }
} 