Vue.component('feedback', {
    template: `
        <div class="feedback">
            <h2>意见反馈</h2>
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="反馈类型">
                    <el-select v-model="form.type" placeholder="请选择反馈类型">
                        <el-option label="功能建议" value="feature"></el-option>
                        <el-option label="问题报告" value="bug"></el-option>
                        <el-option label="其他" value="other"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="反馈内容">
                    <el-input type="textarea" v-model="form.content" :rows="4"></el-input>
                </el-form-item>
                <el-form-item label="联系方式">
                    <el-input v-model="form.contact" placeholder="选填，方便我们联系您"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交反馈</el-button>
                </el-form-item>
            </el-form>
        </div>
    `,
    data() {
        return {
            form: {
                type: '',
                content: '',
                contact: ''
            }
        }
    },
    methods: {
        onSubmit() {
            if (!this.form.type || !this.form.content) {
                this.$message.error('请填写反馈类型和内容');
                return;
            }
            API.submitFeedback(this.form).then(() => {
                this.$message({
                    message: '感谢您的反馈！',
                    type: 'success'
                });
                this.form = {
                    type: '',
                    content: '',
                    contact: ''
                };
            }).catch(error => {
                console.error('Error submitting feedback:', error);
                this.$message.error('提交失败，请稍后重试');
            });
        }
    }
});
