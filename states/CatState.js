/**
 * CatState 类 - 猫咪状态基类
 * 
 * 功能：
 * - 定义状态接口
 * - 提供基础实现
 * 
 * @class CatState
 */
class CatState {
    constructor(cat) {
        this.cat = cat;
    }

    enter() {}
    
    update(input) {}
    
    exit() {}
} 