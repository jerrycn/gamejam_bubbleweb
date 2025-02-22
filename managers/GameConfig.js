/**
 * GameConfig 类 - 游戏配置管理器
 * 
 * 功能：
 * - 管理游戏配置
 * - 提供游戏配置参数
 * - 初始化游戏场景
 * 
 * @class GameConfig
 */
class GameConfig {
    static getConfig() {
        return {
            type: Phaser.AUTO,
            width: 1920,
            height: 1080,
            parent: 'game',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: [
                {
                    preload: preload,
                    create: create,
                    update: update
                },
                UIScene
            ]
        };
    }
} 