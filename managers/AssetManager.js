/**
 * AssetManager 类 - 游戏资源管理器
 * 
 * 功能：
 * - 集中管理所有游戏资源的加载
 * - 提供资源加载方法
 * - 处理资源加载状态
 * 
 * @class AssetManager
 */
class AssetManager {
    /**
     * 加载所有游戏资源
     * @param {Phaser.Scene} scene - 游戏场景实例
     */
    static loadAssets(scene) {
        // 加载背景
        scene.load.image('background', 'assets/background.jpeg');
        
        // 加载猫咪行走动画
        for (let i = 0; i <= 14; i++) {
            const frameNumber = i.toString().padStart(2, '0');
            scene.load.image(`cat_walk_${i}`, `assets/cat/cat_walk00_${frameNumber}.png`);
        }
        
        // 加载吹气动画
        for (let i = 0; i <= 9; i++) {
            const frameNumber = i.toString().padStart(2, '0');
            scene.load.image(`cat_blow_${i}`, `assets/cat/cat_chuiqi00_${frameNumber}.png`);
        }
        
        // 加载泡泡相关纹理
        scene.load.image('bubble', 'assets/bubble/bubble.png');
        scene.load.image('bubblelight', 'assets/bubble/bubblelight.png');
        
        // 加载泡泡特效动画
        for (let i = 0; i <= 5; i++) {
            const frameNumber = i.toString().padStart(3, '0');
            scene.load.image(`bubble_effect_${i}`, `assets/bubble/sc${frameNumber}.png`);
        }

        // 加载音频资源
        scene.load.audio('bgm', 'assets/audio/bgm.mp3', {
            instances: 1
        });
        scene.load.audio('cat_move', 'assets/audio/cat_move.mp3', {
            instances: 2
        });
        scene.load.audio('bubble_blowing', 'assets/audio/bubble_blowing.mp3', {
            instances: 2
        });
        scene.load.audio('bubble_blowing_end', 'assets/audio/bubble_blowing_end.mp3', {
            instances: 2
        });

        // 加载闪电球动画帧
        for (let i = 1; i <= 19; i++) {
            const frameNumber = i.toString().padStart(4, '0');
            scene.load.image(`dianqiu${frameNumber}`, `assets/enemy/lightning/dianqiu${frameNumber}.png`);
        }
    }
} 