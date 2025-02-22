/**
 * InputManager 类 - 输入控制管理器
 * 
 * 功能：
 * - 管理键盘输入
 * - 管理鼠标输入
 * - 提供按键状态
 * - 初始化控制配置
 * 
 * @class InputManager
 */
class InputManager {
    constructor(scene) {
        this.scene = scene;
        
        // 创建方向键控制
        this.cursors = scene.input.keyboard.createCursorKeys();
        
        // 创建WASD控制
        this.wasdKeys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // 初始化鼠标事件
        this.initMouseEvents();
    }

    // 初始化鼠标事件监听
    initMouseEvents() {
        this.scene.input.on('pointerdown', () => {
            if (!this.scene.scene.isPaused('GameScene') && !cat.isInBubble(bubbles)) {
                cat.setState(Cat.State.BLOWING);
                this.scene.startBlowingBubble();
            }
        });

        this.scene.input.on('pointerup', () => {
            if (!this.scene.scene.isPaused('GameScene')) {
                cat.setState(Cat.State.IDLE);
                this.scene.stopBlowingBubble();
            }
        });
    }

    // 获取方向键
    getCursors() {
        return this.cursors;
    }

    // 获取WASD键
    getWASDKeys() {
        return this.wasdKeys;
    }
} 