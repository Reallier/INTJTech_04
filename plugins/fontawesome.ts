/**
 * Font Awesome 插件
 * 注册常用图标到全局
 */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faRocket,           // 服务平台
    faComments,         // 智能客服
    faStar,             // MBTI判型
    faFileSignature,    // 合同审查
    faBook,             // 知乎知识库
    faBriefcase,        // 求职助手
    faFileAlt,          // 简历优化
    faChartBar,         // 资源监控
    faMagnet,           // 简历匹配
    faClipboardList,    // 了解更多
    faUsers,            // 用户
    faWallet,           // 余额
    faChartLine,        // 增长
    faExchangeAlt,      // 交易
    faGift,             // 礼物
    faCheckCircle,      // 成功
    faExclamationTriangle, // 警告
    faShieldAlt,        // 安全
    faPlug,             // 对接
    faMagic,            // 闪耀 (使用 magic 替代 sparkles)
    faPen,              // 编辑
    faEnvelope,         // 邮件
    faAt,               // @符号
    faTachometerAlt,    // 仪表盘
    faHand,             // 欢迎手势
    faCubes,            // 服务管理
    faExternalLinkAlt,  // 外部链接
    faBullseye,         // 靶心 - 智能匹配
    faBolt,             // 闪电 - 快速
    faFileLines,        // 文件 - 报告
    faShieldHalved,     // 盾牌 - 安全
} from '@fortawesome/free-solid-svg-icons'

// 注册图标到库
library.add(
    faRocket, faComments, faStar, faFileSignature, faBook, faBriefcase,
    faFileAlt, faChartBar, faMagnet, faClipboardList, faUsers, faWallet,
    faChartLine, faExchangeAlt, faGift, faCheckCircle, faExclamationTriangle,
    faShieldAlt, faPlug, faMagic, faPen, faEnvelope, faAt,
    faTachometerAlt, faHand, faCubes, faExternalLinkAlt,
    faBullseye, faBolt, faFileLines, faShieldHalved
)

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
    // 简写别名
    nuxtApp.vueApp.component('FaIcon', FontAwesomeIcon)
})
