/**
 * AudioManager 类 - 音频管理器
 * 
 * 功能：
 * - 管理背景音乐
 * - 控制音乐播放状态
 * - 提供音乐控制接口
 * 
 * @class AudioManager
 */
class AudioManager {
    constructor(scene) {
        this.scene = scene;
        
        // 创建背景音乐
        this.bgMusic = scene.sound.add('bgm', {
            volume: 0.5,
            loop: true
        });

        // 音乐播放状态
        this.isMusicPlaying = true;

        // 在音频系统解锁时开始播放
        scene.sound.once('unlocked', () => {
            this.bgMusic.play();
            console.log('BGM started playing');
        });
    }

    // 切换音乐播放状态
    toggleMusic() {
        if (this.isMusicPlaying) {
            this.bgMusic.pause();
            this.isMusicPlaying = false;
        } else {
            this.bgMusic.resume();
            this.isMusicPlaying = true;
        }
        return this.isMusicPlaying;
    }

    // 获取音乐播放状态
    isPlaying() {
        return this.isMusicPlaying;
    }

    // 恢复音乐播放
    resumeMusic() {
        if (!this.bgMusic.isPlaying) {
            this.bgMusic.resume();
            this.isMusicPlaying = true;
        }
    }

    // 停止音乐
    stopMusic() {
        this.bgMusic.stop();
        this.isMusicPlaying = false;
    }
} 