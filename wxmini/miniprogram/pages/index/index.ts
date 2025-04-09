// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Component({
  data: {
    // 用户信息
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    
    // 天气数据
    currentDate: '',
    currentTemp: '25°C',
    weatherDesc: '晴朗',
    userData: {
      city: '北京',
      gender: 'male',
      description: '喜欢简约风格，偏好舒适的休闲装，平时以黑白灰为主。'
    },
    
    // 天气预报数据
    forecastData: [
      { day: '今天', tempPercent: 80, icon: '☀️', temp: '18°C / 25°C' },
      { day: '明天', tempPercent: 75, icon: '🌤️', temp: '16°C / 23°C' },
      { day: '周五', tempPercent: 70, icon: '☁️', temp: '15°C / 22°C' },
      { day: '周六', tempPercent: 60, icon: '🌧️', temp: '14°C / 20°C' },
      { day: '周日', tempPercent: 65, icon: '🌤️', temp: '16°C / 21°C' },
      { day: '周一', tempPercent: 75, icon: '☀️', temp: '17°C / 24°C' },
      { day: '周二', tempPercent: 80, icon: '☀️', temp: '18°C / 25°C' }
    ],
    
    // 穿搭风格选项
    styleOptions: [],
    selectedStyleIndex: -1,
    
    // 弹出层
    showPopup: false,
    ootdAdvice: '',
    outfitExamples: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=720&q=80',
        caption: '搭配示例 1'
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=720&q=80',
        caption: '搭配示例 2'
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=720&q=80',
        caption: '搭配示例 3'
      }
    ]
  },
  
  lifetimes: {
    attached() {
      // 初始化日期
      this.initDate();
      
      // 加载用户数据
      this.loadUserData();
      
      // 生成穿搭风格选项
      this.generateStyleOptions();
    }
  },
  
  methods: {
    // 初始化日期
    initDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
      
      this.setData({
        currentDate: `${year}年${month}月${day}日 星期${weekDay}`
      });
    },
    
    // 加载用户数据
    loadUserData() {
      const userData = wx.getStorageSync('userData');
      if (userData) {
        this.setData({
          userData: JSON.parse(userData)
        });
      } else {
        wx.navigateTo({
          url: '/pages/onboarding/onboarding'
        });
      }
    },
    
    // 生成穿搭风格选项
    generateStyleOptions() {
      const styleOptions = {
        male: ['运动休闲风', '商务精英风', '日韩潮流风', '韩系简约风', '学院风', '街头嘻哈风', '户外机能风', '复古文艺风', '极简主义风', '工装风'],
        female: ['甜酷风', '温柔风', '学院风', '韩系简约风', '设计师品牌风', '复古文艺风', '小香风', '森女风', '运动休闲风', 'Y2K风']
      };
      
      const gender = this.data.userData.gender || 'male';
      const styles = styleOptions[gender].map(name => ({ name, active: false }));
      
      this.setData({
        styleOptions: styles
      });
    },
    
    // 选择穿搭风格
    selectStyle(e) {
      const index = e.currentTarget.dataset.index;
      const styleOptions = this.data.styleOptions.map((item, i) => {
        return {
          ...item,
          active: i === index
        };
      });
      
      this.setData({
        styleOptions,
        selectedStyleIndex: index
      });
    },
    
    // 生成OOTD
    generateOOTD() {
      if (this.data.selectedStyleIndex === -1) {
        wx.showToast({
          title: '请先选择一种穿搭风格',
          icon: 'none'
        });
        return;
      }
      
      const selectedStyle = this.data.styleOptions[this.data.selectedStyleIndex].name;
      const weatherDesc = this.data.weatherDesc;
      const temp = this.data.currentTemp;
      
      let advice = `根据今天${weatherDesc}的天气（${temp}）和您选择的${selectedStyle}，`;
      
      // 根据温度和风格生成不同的建议
      const tempNum = parseInt(temp);
      if (tempNum > 20) {
        if (this.data.userData.gender === 'male') {
          if (selectedStyle === '运动休闲风') {
            advice += '建议您穿着轻薄的运动T恤，搭配舒适的运动短裤或休闲裤，既清爽又符合您的风格。';
          } else if (selectedStyle === '商务精英风') {
            advice += '建议您选择轻薄的衬衫，搭配修身的西裤，可以不系领带，保持干练又不失商务感。';
          } else {
            advice += '建议您选择轻薄透气的上衣，搭配舒适的裤装，既能应对温暖天气，又符合您的风格偏好。';
          }
        } else {
          if (selectedStyle === '甜酷风') {
            advice += '建议您穿着短款T恤或吊带上衣，搭配高腰短裤或半身裙，既清凉又能展现甜酷风格。';
          } else if (selectedStyle === '温柔风') {
            advice += '建议您选择飘逸的连衣裙或轻薄的上衣搭配半身长裙，柔和的色调会让您在温暖的天气中依然保持温柔气质。';
          } else {
            advice += '建议您选择轻薄透气的上衣，搭配舒适的裙装或裤装，既能应对温暖天气，又符合您的风格偏好。';
          }
        }
      } else {
        // 温度较低的建议
        advice += '建议您穿着轻薄的上衣，搭配舒适的牛仔裤，外搭一件轻便的夹克，既能应对温差变化，又符合您的风格偏好。';
      }
      
      this.setData({
        ootdAdvice: advice,
        showPopup: true
      });
    },
    
    // 关闭弹出层
    closePopup() {
      this.setData({
        showPopup: false
      });
    },
    
    // 导航到个人页面
    navigateToProfile() {
      // 使用switchTab跳转到profile页面
      wx.switchTab({
        url: '/pages/profile/profile'
      });
    },
    
    // 以下是原有的用户信息相关方法
    bindViewTap() {
      wx.navigateTo({
        url: '../logs/logs',
      })
    },
    
    onChooseAvatar(e: any) {
      const { avatarUrl } = e.detail
      const { nickName } = this.data.userInfo
      this.setData({
        "userInfo.avatarUrl": avatarUrl,
        hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })
    },
    
    onInputChange(e: any) {
      const nickName = e.detail.value
      const { avatarUrl } = this.data.userInfo
      this.setData({
        "userInfo.nickName": nickName,
        hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })
    },
    
    getUserProfile() {
      wx.getUserProfile({
        desc: '展示用户信息',
        success: (res) => {
          console.log(res)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    },
  },
})
