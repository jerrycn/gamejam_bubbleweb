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
        scene.load.audio('bgm', 'assets/audio/bgm.mp3');  // 开始场景音乐
        scene.load.audio('game_bgm', 'assets/audio/game_bgm.mp3');  // 游戏场景音乐
        scene.load.audio('cat_move', 'assets/audio/cat_move.mp3', {
            instances: 2
        });
        scene.load.audio('bubble_blowing', 'assets/audio/bubble_blowing.mp3');
        scene.load.audio('bubble_blowing_end', 'assets/audio/bubble_blowing_end.mp3');

        // 加载闪电球动画帧
        for (let i = 1; i <= 19; i++) {
            const frameNumber = i.toString().padStart(4, '0');
            scene.load.image(`dianqiu${frameNumber}`, `assets/enemy/lightning/dianqiu${frameNumber}.png`);
        }

        // 加载Boss动画帧 - 修改文件名格式
        for (let i = 0; i <= 19; i++) {
            const frameNumber = i.toString().padStart(2, '0');
            scene.load.image(`boss${i}`, `assets/enemy/boss/boss_walk00_${frameNumber}.png`);
        }

        // 加载小怪物动画帧 - 调整为调试模式
        for (let i = 0; i <= 14; i++) {
            const frameNumber = i.toString().padStart(2, '0');
            const key = `monster${i}`;
            const path = `assets/enemy/monster/guaiwu01_walk00_${frameNumber}.png`;
            
            // 添加回调以检查加载是否成功
            scene.load.image(key, path).on('filecomplete', () => {
                console.log(`已加载: ${key} (${path})`);
            }).on('loaderror', () => {
                console.error(`加载失败: ${key} (${path})`);
            });
        }

        // 加载Boss死亡动画帧
        for (let i = 0; i <= 13; i++) {
            const frameNumber = i.toString().padStart(2, '0');
            scene.load.image(`boss_zibao00_${frameNumber}`, `assets/enemy/boss/boss_zibao00_${frameNumber}.png`);
        }

        // 加载Boss爆炸动画附加帧 (zibao00100.png 到 zibao00117.png)
        for (let i = 100; i <= 117; i++) {
            const frameNumber = i.toString();
            scene.load.image(`zibao${frameNumber}`, `assets/enemy/zibao00${frameNumber}.png`);
        }

        // 加载泡泡爆炸动画帧
        for (let i = 0; i <= 16; i++) {
            const frameNumber = i.toString().padStart(4, '0');
            scene.load.image(`baozha${frameNumber}`, `assets/bubble/baozha${frameNumber}.png`);
        }
    }
} 