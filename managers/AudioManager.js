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
        this.bgMusic = null;
        this.sounds = new Map();  // 存储所有音效
    }

    playMusic(key, config = { volume: 0.5, loop: true }) {
        // 如果已经有音乐在播放，先停止它
        this.stopMusic();
        
        // 播放新的音乐
        this.bgMusic = this.scene.sound.add(key, config);
        this.bgMusic.play();
        
        // 根据全局音乐状态设置
        if (!GameStateManager.isMusicEnabled()) {
            this.bgMusic.pause();
        }
    }

    stopMusic() {
        if (this.bgMusic) {
            this.bgMusic.stop();
            this.bgMusic.destroy();
            this.bgMusic = null;
        }
    }

    pauseMusic() {
        if (this.bgMusic) {
            this.bgMusic.pause();
        }
    }

    resumeMusic() {
        if (this.bgMusic) {
            this.bgMusic.resume();
        }
    }

    // 播放音效
    playSound(key, config = { volume: 1, loop: false }) {
        // 如果已经有这个音效在播放，先停止它
        this.stopSound(key);
        
        // 创建新的音效实例
        const sound = this.scene.sound.add(key, config);
        this.sounds.set(key, sound);
        sound.play();
        
        // 如果不是循环播放，播放完成后自动清理
        if (!config.loop) {
            sound.once('complete', () => {
                this.sounds.delete(key);
                sound.destroy();
            });
        }
        
        return sound;
    }

    // 停止指定音效
    stopSound(key) {
        if (this.sounds.has(key)) {
            const sound = this.sounds.get(key);
            sound.stop();
            sound.destroy();
            this.sounds.delete(key);
        }
    }

    // 停止所有音效
    stopAllSounds() {
        this.sounds.forEach((sound, key) => {
            sound.stop();
            sound.destroy();
        });
        this.sounds.clear();
    }

    // 销毁时清理所有音频资源
    destroy() {
        this.stopMusic();
        this.stopAllSounds();
    }
} 