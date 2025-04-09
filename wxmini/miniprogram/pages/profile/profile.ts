// pages/profile/profile.ts

Page({
  data: {
    userData: {
      city: '北京',
      gender: 'male',
      description: '喜欢简约风格，偏好舒适的休闲装，平时以黑白灰为主。'
    },
    isEditing: false,
    showToast: false,
    toastMessage: ''
  },

  onLoad() {
    // 从本地存储加载用户数据
    const userData = wx.getStorageSync('userData');
    if (userData) {
      this.setData({
        userData: JSON.parse(userData)
      });
    }
  },

  // 切换编辑区域显示/隐藏
  toggleEdit() {
    this.setData({
      isEditing: !this.data.isEditing
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

  // 城市输入事件
  onCityInput(e: any) {
    this.setData({
      'userData.city': e.detail.value
    });
  },

  // 描述输入事件
  onDescriptionInput(e: any) {
    this.setData({
      'userData.description': e.detail.value
    });
  },

  // 保存个人资料
  saveProfile() {
    const { userData } = this.data;
    
    // 确保城市和描述不为空
    if (!userData.city.trim()) {
      userData.city = '北京';
    }
    
    if (!userData.description.trim()) {
      userData.description = '喜欢简约风格，偏好舒适的休闲装，平时以黑白灰为主。';
    }
    
    // 更新数据
    this.setData({
      userData,
      isEditing: false
    });
    
    // 保存到本地存储
    wx.setStorageSync('userData', JSON.stringify(userData));
    
    // 显示保存成功提示
    this.showToast('保存成功');
  },

  // 显示提示信息
  showToast(message: string) {
    this.setData({
      showToast: true,
      toastMessage: message
    });
    
    setTimeout(() => {
      this.setData({
        showToast: false
      });
    }, 2000);
  },

  // 导航到首页
  navigateToIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});