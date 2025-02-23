/**
 * EnemyState 类 - 敌人状态基类
 * 
 * 功能：
 * - 定义状态接口
 * - 提供基础实现
 * 
 * @class EnemyState
 */
class EnemyState {
    constructor(enemy) {
        this.enemy = enemy;
    }

    enter() {}
    
    update() {}
    
    exit() {}
} 