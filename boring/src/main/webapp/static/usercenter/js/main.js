Vue.prototype.$eventBus = new Vue();

new Vue({
    el: '#app',
    data: {
        currentView: 'info',
        isCurrentUser: true,
        isFollowing: false,
        avatar: '/MyWebApp/static/img/userpicture/user1.png',
        username: '',
        v: 0,
        bio: '',
        cropperVisible: false,
        cropper: null
    },
    methods: {
        changeView(view) {
            this.currentView = view;
        },
        toggleFollow() {
            if (this.isFollowing) {
                API.unfollow().then(() => {
                    this.isFollowing = false;
                    this.$message.success('已取消关注');
                });
            } else {
                API.follow().then(() => {
                    this.isFollowing = true;
                    this.$message.success('关注成功');
                });
            }
        },
        triggerFileUpload() {
            document.getElementById('avatar-upload').click();
        },
        onFileChange(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                this.$refs.cropperImage.src = event.target.result;
                this.cropperVisible = true;
                this.$nextTick(() => {
                    if (this.cropper) {
                        this.cropper.destroy();
                    }
                    this.cropper = new Cropper(this.$refs.cropperImage, {
                        aspectRatio: 1,
                        viewMode: 1,
                    });
                });
            };
            reader.readAsDataURL(file);
        },
        cropImage() {
            if (!this.cropper) return;
            
            const canvas = this.cropper.getCroppedCanvas();
            if (canvas) {
                canvas.toBlob((blob) => {
                    API.uploadAvatar(blob).then(() => {
                        this.avatar = canvas.toDataURL();
                        this.cropperVisible = false;
                        this.$message.success('头像上传成功');
                    }).catch((error) => {
                        console.error('Failed to upload avatar:', error);
                        this.$message.error('头像上传失败');
                    });
                });
            }
        },
        
        myfan() {
            // 实现查看粉丝列表的逻辑
        },
        myfollow() {
            // 实现查看关注列表的逻辑
        }
    },
    mounted() {
        API.getUserInfo().then(data => {
            this.username = data.username;
            this.v = data.v;
            this.bio = data.bio;
            this.password = data.password;
            
        });

        this.$eventBus.$on('user-info-updated', (data) => {
            this.username = data.username;
            this.bio = data.bio;
        });
    }
});