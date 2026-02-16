<script setup lang="ts">
useHead({
    title: '服务条款 - 简序智能 INTJsys'
});
</script>

<template>
    <div class="legal-page">
        <!-- Header -->
        <SiteHeader />

        <main class="container">
            <h1>服务条款</h1>
            <p class="update-date">更新日期：2026年1月</p>

            <p class="agreement-notice"><strong>请仔细阅读并理解本服务条款。通过注册账户或使用本服务，即表示您已阅读、理解并同意接受本条款的约束。如您不同意本条款的任何内容，请勿使用我们的服务。</strong></p>

            <section>
                <h2>一、服务说明</h2>
                <p><strong>深圳市简序智能科技有限责任公司</strong>（品牌名：简序智能/INTJsys，以下简称"我们"）通过官方网站及相关产品为您提供人工智能驱动的企业级服务。我们的服务包括但不限于：</p>
                <ul>
                    <li><strong>TalentAI</strong>：智能招聘匹配与人才评估</li>
                    <li><strong>MindAI</strong>：MBTI 人格分析与职业建议</li>
                    <li><strong>定制服务</strong>：企业级 AI 解决方案咨询与开发</li>
                </ul>
                <p><strong>重要声明</strong>：我们的 AI 服务提供的分析结果仅供参考，不应作为任何商业决策的唯一依据。用户应结合实际情况做出独立判断。</p>
            </section>

            <section>
                <h2>二、账户与认证</h2>
                <ul>
                    <li>您需要注册账户才能使用部分服务功能</li>
                    <li>请提供真实、准确的注册信息</li>
                    <li>您应妥善保管账户凭据，对账户下的所有活动负责</li>
                    <li>发现账户异常或未授权使用，请立即联系我们</li>
                    <li>我们保留对违规账户采取限制或终止服务的权利</li>
                    <li><strong>年龄要求</strong>：您确认您已年满 18 周岁，或已取得监护人同意使用本服务。如您未满 14 周岁，您不应使用本服务</li>
                </ul>
            </section>

            <section>
                <h2>三、服务使用规范</h2>
                <h3>3.1 允许的使用</h3>
                <ul>
                    <li>按照产品设计目的正常使用服务功能</li>
                    <li>上传合法获取的、您有权使用的内容</li>
                    <li>用于正当的商业或个人目的</li>
                </ul>
                
                <h3>3.2 禁止的行为</h3>
                <ul>
                    <li>上传含有恶意代码、病毒或非法内容的文件</li>
                    <li>尝试绕过系统安全限制或进行 API 滥用</li>
                    <li>侵犯他人隐私权、知识产权或其他合法权益</li>
                    <li>将服务用于违法违规目的</li>
                    <li>对服务进行逆向工程、反编译或破解</li>
                    <li>转售、转租或未经授权分发服务访问权</li>
                    <li>干扰服务的正常运行或其他用户的使用</li>
                </ul>
            </section>

            <section>
                <h2>四、计费与付款</h2>
                <h3>4.1 计费模式</h3>
                <ul>
                    <li>部分服务采用按用量计费（如 Token 消耗）</li>
                    <li>部分服务采用订阅制或一次性付费</li>
                    <li>具体费用以产品页面或订单确认为准</li>
                </ul>
                
                <h3>4.2 免费额度</h3>
                <ul>
                    <li>新用户可能获得免费试用额度</li>
                    <li>免费额度不可提现、不可转让，可能设有有效期</li>
                </ul>
                
                <h3>4.3 退款政策</h3>
                <ul>
                    <li>已消费的服务费用不予退还</li>
                    <li>未消费的预充值余额，可申请退款（扣除已产生的支付渠道费用后）</li>
                    <li>因我方原因导致服务无法使用的，可申请全额退款</li>
                </ul>
            </section>

            <section>
                <h2>五、数据与隐私</h2>
                <p>我们重视您的隐私。有关数据收集、使用和保护的详细信息，请参阅
                    <NuxtLink to="/privacy">《隐私政策》</NuxtLink>。
                </p>
                <p>特别说明：</p>
                <ul>
                    <li>您上传的业务内容可能被发送至 AI 服务进行分析处理</li>
                    <li>我们不会将您的数据用于训练 AI 模型</li>
                    <li>您可随时申请导出或删除个人数据</li>
                </ul>
            </section>

            <section>
                <h2>六、知识产权</h2>
                <ul>
                    <li>我们的服务界面、代码、算法、商标等知识产权归简序智能所有</li>
                    <li>您上传的内容，其知识产权归您或原权利人所有</li>
                    <li>服务生成的分析报告，您有权在合法范围内使用</li>
                    <li>您授予我们处理您上传内容以提供服务所必需的有限许可</li>
                </ul>
            </section>

            <section>
                <h2>七、免责声明</h2>
                <ul>
                    <li><strong>结果参考性</strong>：AI 分析结果仅供参考，不保证 100% 准确性</li>
                    <li><strong>服务可用性</strong>：我们努力保障服务稳定，但不承诺 100% 可用率</li>
                    <li><strong>第三方依赖</strong>：服务依赖第三方 AI 接口，其不可用可能影响本服务</li>
                    <li><strong>用户责任</strong>：用户须对上传内容的合法性和使用结果负责</li>
                    <li><strong>间接损失</strong>：我们不对因使用服务导致的间接损失、预期利润损失承担责任</li>
                    <li><strong>责任限额</strong>：如因我方原因导致您遭受直接经济损失，我们的赔偿责任以您实际支付的服务费用（或过去 12 个月累计支付费用，取较低者）为上限</li>
                    <li><strong>不可抗力</strong>：因自然灾害、战争、罢工、政府行为、网络攻击、电信或电力中断等不可抗力事件导致服务中断或延误的，我们不承担责任</li>
                </ul>
            </section>

            <section>
                <h2>八、服务变更与终止</h2>
                <ul>
                    <li>我们可能根据业务发展调整、升级或终止部分服务功能</li>
                    <li>重大变更会提前 <strong>7 个工作日</strong> 通知用户</li>
                    <li>您可随时停止使用服务并申请注销账户</li>
                    <li><strong>账户注销后的数据处理</strong>：账户注销后，我们将在 30 天内删除您的个人数据（法律法规要求保留的除外）。您可在注销前通过联系客服申请导出业务数据</li>
                    <li>违反本条款的用户，我们有权暂停或终止其服务使用权</li>
                </ul>
            </section>

            <section>
                <h2>九、条款更新</h2>
                <p>我们可能根据法律法规或业务需要更新本服务条款。重大变更时将通过网站公告或其他方式通知您。继续使用服务即表示接受变更后的条款。</p>
            </section>

            <section>
                <h2>十、争议解决</h2>
                <p>本条款的解释和执行适用中华人民共和国法律（不含冲突法规则）。如发生争议，双方应首先友好协商解决；协商不成的，任何一方均可向<strong>深圳市南山区人民法院</strong>提起诉讼。</p>
            </section>

            <section>
                <h2>十一、联系方式</h2>
                <p>如有疑问，请通过以下方式联系：</p>
                <ul>
                    <li><strong>公司名称</strong>：深圳市简序智能科技有限责任公司</li>
                    <li><strong>统一社会信用代码</strong>：91440300MAK40P7857</li>
                    <li><strong>注册地址</strong>：深圳市南山区粤海街道高新区社区高新南四道025号高新工业村W2-B栋284</li>
                    <li><strong>电子邮箱</strong>：<a href="mailto:reallier@intjsys.com">reallier@intjsys.com</a></li>
                    <li><strong>官方网站</strong>：<a href="https://intjsys.com" target="_blank">intjsys.com</a></li>
                </ul>
            </section>
        </main>

        <SiteFooter />
    </div>
</template>

<style scoped>
.legal-page {
    min-height: 100vh;
    background: #fff;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 80px 24px 120px;
}

h1 {
    font-size: 2.5rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 8px;
}

.update-date {
    color: #666;
    margin-bottom: 24px;
    font-size: 14px;
}

.agreement-notice {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-left: 4px solid #000;
    padding: 16px 20px;
    margin-bottom: 48px;
    line-height: 1.7;
    font-size: 14px;
}

section {
    margin-bottom: 40px;
}

h2 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
}

h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 20px 0 12px;
    color: #333;
}

p {
    line-height: 1.8;
    color: #444;
    margin-bottom: 12px;
}

ul, ol {
    padding-left: 24px;
    margin: 12px 0;
}

li {
    line-height: 1.8;
    margin: 6px 0;
    color: #444;
}

a {
    color: #000;
    text-decoration: underline;
}

a:hover {
    opacity: 0.7;
}

strong {
    font-weight: 600;
    color: #000;
}

@media (max-width: 768px) {
    .container {
        padding: 60px 20px 80px;
    }
    
    h1 {
        font-size: 2rem;
    }
}
</style>
