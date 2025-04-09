// pages/onboarding/onboarding.ts

Page({
  data: {
    currentStep: 1,
    progressWidth: 33,
    userData: {
      city: '',
      gender: '',
      description: ''
    },
    cityError: false
  },

  onLoad() {
    // 检查是否已有用户数据，如果有则跳转到首页
    const userData = wx.getStorageSync('userData');
    if (userData) {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  // 城市输入事件
  onCityInput(e: any) {
    this.setData({
      'userData.city': e.detail.value
    });
  },

  // 城市输入框获取焦点事件
  onCityFocus() {
    if (this.data.cityError) {
      this.setData({
        cityError: false
      });
    }
  },

  // 描述输入事件
  onDescriptionInput(e: any) {
    this.setData({
      'userData.description': e.detail.value
    });
  },

  // 选择性别 - 男
  selectMale() {
    this.setData({
      'userData.gender': 'male'
    });
  },

  // 选择性别 - 女
  selectFemale() {
    this.setData({
      'userData.gender': 'female'
    });
  },

  // 前往第二步
  goToStep2() {
    // 验证城市输入
    if (!this.data.userData.city.trim()) {
      this.setData({
        cityError: true
      });
      return;
    }

    this.setData({
      currentStep: 2,
      progressWidth: 66
    });
  },

  // 返回第一步
  goToStep1() {
    this.setData({
      currentStep: 1,
      progressWidth: 33
    });
  },

  // 前往第三步
  goToStep3() {
    // 验证性别选择
    if (!this.data.userData.gender) {
      wx.showToast({
        title: '请选择您的性别',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    this.setData({
      currentStep: 3,
      progressWidth: 100
    });
  },

  // 完成引导
  finishOnboarding() {
    const { userData } = this.data;
    
    // 如果描述为空，设置默认值
    if (!userData.description.trim()) {
      userData.description = '喜欢简约风格，偏好舒适的休闲装。';
    }
    
    // 保存用户数据到本地存储
    wx.setStorageSync('userData', JSON.stringify(userData));
    
    // 跳转到首页
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});