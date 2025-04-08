// custom-tab-bar/index.js
Component({
  data: {
    selected: 0,
    color: "#888888",
    selectedColor: "#4F8EF7",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/images/icon-tshirt.png",
      selectedIconPath: "/images/icon-tshirt-active.png",
      text: "OOTD"
    }, {
      pagePath: "/pages/profile/profile",
      iconPath: "/images/icon-user.png",
      selectedIconPath: "/images/icon-user-active.png",
      text: "我的"
    }]
  },
  attached() {
    // 获取当前页面路径
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const route = currentPage.route;
    
    // 根据当前页面路径设置选中状态
    const list = this.data.list;
    for (let i = 0; i < list.length; i++) {
      if (list[i].pagePath === "/" + route) {
        this.setData({
          selected: i
        });
        break;
      }
    }
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      
      // 切换到对应页面
      wx.switchTab({
        url
      });
      
      // 更新选中状态
      this.setData({
        selected: data.index
      });
    }
  }
});