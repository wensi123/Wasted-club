Vue.component('onlineTime', {
    template: `
        <div class="online-time">
            <h2>在线时长统计</h2>
            <el-card v-for="(stat, index) in stats" :key="index" class="box-card">
                <template #header>
                    <div class="clearfix">
                        <span>{{ stat.title }}</span>
                    </div>
                </template>
                <el-progress 
                    :percentage="stat.percentage" 
                    :format="formatPercentage"
                    :color="customColors"
                ></el-progress>
                <p>{{ stat.description }} {{ stat.hours }} 小时</p>
            </el-card>
        </div>
    `,
    data() {
        return {
            weeklyHours: 0,
            monthlyHours: 0,
            HOURS_IN_WEEK: 168,
            HOURS_IN_MONTH: 720,
            customColors: [
                {color: '#f56c6c', percentage: 20},
                {color: '#e6a23c', percentage: 40},
                {color: '#5cb87a', percentage: 60},
                {color: '#1989fa', percentage: 80},
                {color: '#6f7ad3', percentage: 100}
            ]
        }
    },
    computed: {
        stats() {
            return [
                {
                    title: '本周在线时长',
                    hours: this.weeklyHours,
                    percentage: this.calculatePercentage(this.weeklyHours, this.HOURS_IN_WEEK),
                    description: '本周已在线'
                },
                {
                    title: '本月在线时长',
                    hours: this.monthlyHours,
                    percentage: this.calculatePercentage(this.monthlyHours, this.HOURS_IN_MONTH),
                    description: '本月已在线'
                }
            ];
        }
    },
    mounted() {
        this.loadOnlineTime();
    },
    methods: {
        async loadOnlineTime() {
            try {
                const data = await API.getOnlineTime();
                this.weeklyHours = data.weeklyHours;
                this.monthlyHours = data.monthlyHours;
            } catch (error) {
                console.error('Failed to load online time:', error);
            }
        },
        formatPercentage(percentage) {
            return percentage.toFixed(1) + '%';
        },
        calculatePercentage(hours, totalHours) {
            return Math.min((hours / totalHours) * 100, 100);
        }
    }
});

