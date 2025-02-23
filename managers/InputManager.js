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

        // 创建鼠标输入控制
        this.mouseKeys = {
            down: false,
            x: 0,
            y: 0
        };

        // 添加鼠标事件监听
        scene.input.on('pointerdown', () => {
            this.mouseKeys.down = true;
        });

        scene.input.on('pointerup', () => {
            this.mouseKeys.down = false;
        });

        scene.input.on('pointermove', (pointer) => {
            this.mouseKeys.x = pointer.x;
            this.mouseKeys.y = pointer.y;
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

    // 获取鼠标输入
    getMouseKeys() {
        return this.mouseKeys;
    }
} 