Vue.component('info', {
    template: `
        <div class="info">
            <h2>个人简介</h2>
            <el-form :model="userInfo" label-width="80px" v-if="isEditing">
                <el-form-item label="用户名">
                    <el-input v-model="userInfo.username"></el-input>
                </el-form-item>
                <el-form-item label="用户邮箱">
                     <el-input v-model="userInfo.email"></el-input>
                </el-form-item>
                <el-form-item label="个性签名">
                    <el-input type="textarea" v-model="userInfo.bio"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="userInfo.password" placeholder="留空表示不修改"></el-input>
                </el-form-item>
            </el-form>
            <el-descriptions :column="2" border v-else>
                <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
                <el-descriptions-item label="用户邮箱">{{ userInfo.email }}</el-descriptions-item>
                <el-descriptions-item label="个性签名">{{ userInfo.bio }}</el-descriptions-item>
            </el-descriptions>
            <div class="info-actions">
                <el-button v-if="!isEditing" type="primary" @click="startEdit">编辑</el-button>
                <template v-else>
                    <el-button type="success" @click="saveEdit">保存</el-button>
                    <el-button @click="cancelEdit">取消</el-button>
                </template>
            </div>
        </div>
    `,
    data() {
        return {
            isEditing: false,
            userInfo: {
                username: '',
                email: '',
                bio: '',
                password: ''
            },
            originalInfo: {}
        }
    },
    mounted() {
        this.loadInfo();
    },
    methods: {
        async loadInfo() {
            try {
                const data = await API.getUserInfo();
                this.userInfo = { ...data, password: '' };
                this.originalInfo = { ...data, password: '' };
            } catch (error) {
                console.error('Failed to load user info:', error);
                this.$message.error('加载用户信息失败');
            }
        },
        startEdit() {
            this.isEditing = true;
        },
        async saveEdit() {
            try {
                const response = await API.updateUserInfo(this.userInfo);
                if (response.success) {
                    this.isEditing = false;
                    this.originalInfo = { ...this.userInfo, password: '' };
                    
                    // 发送事件通知主组件更新信息
                    this.$eventBus.$emit('user-info-updated', {
                        username: this.userInfo.username,
                        email: this.userInfo.email,
                        bio: this.userInfo.bio
                    });
                    
                    this.$message.success('个人信息更新成功');
                } else {
                    this.$message.error(response.message || '更新用户信息失败');
                }
            } catch (error) {
                console.error('Failed to update user info:', error);
                this.$message.error('更新用户信息失败');
            }
        },
        cancelEdit() {
            this.userInfo = { ...this.originalInfo };
            this.isEditing = false;
        }
    }
});

