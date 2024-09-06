Vue.component('help', {
    template: `
        <div class="help">
            <h2>使用帮助</h2>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="如何更换头像？" name="1">
                    <div>1. 点击个人中心顶部的头像</div>
                    <div>2. 选择"更换头像"按钮</div>
                    <div>3. 选择您想要的图片并上传</div>
                    <div>4. 调整裁剪区域，然后点击确定</div>
                </el-collapse-item>
                <el-collapse-item title="如何编辑个人信息？" name="2">
                    <div>1. 在个人中心页面，点击"编辑"按钮</div>
                    <div>2. 在弹出的对话框中修改您的个人信息</div>
                    <div>3. 点击"保存"按钮来保存您的更改</div>
                </el-collapse-item>
                <el-collapse-item title="如何查看我的粉丝和关注？" name="3">
                    <div>在个人中心顶部，您可以看到您的粉丝数和关注数</div>
                    <div>点击"粉丝"或"关注"数字可以查看详细列表</div>
                </el-collapse-item>
            </el-collapse>
        </div>
    `,
    data() {
        return {
            activeNames: ['1']
        };
    }
});
