<template>
  <div id="app">
    <!-- 主体部分 -->
    <el-row type="flex" justify="space-around">
      <!-- 侧边楼层导航 -->
      <el-col class="hidden-sm-and-down" :sm="1" :md="2">
        <div class="sidebar">
          <div class="nav" v-for="(item, index) in siteList" :key="item.ftitle" @click="setFloorNavMountClick(index)">{{ item.ftitle }}</div>
        </div>
      </el-col>
      <!-- 站点主体部分 -->
      <el-col :xs="22" :sm="22" :md="20">
        <el-row type="flex" justify="space-around" style="margin-top: 32px;position: sticky;top: 0;z-index: 100;">
          <el-col class="hidden-sm-and-down" :sm="24" :md="12">
            <el-input ref="searchInput" placeholder="请输入搜索内容" v-model="formSearch.searchKey" clearable>
              <el-button slot="prepend" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <siteList :siteList="siteList" :typeList="typeList" :code="code" @refresh="getSiteList"></siteList>
      </el-col>
      <!-- 联系我 -->
      <el-col class="hidden-md-and-down" :md="1">
        <div class="contact">
          <transition name="el-fade-in-linear">
            <div class="item" id="to-top" v-show="showBackTop" @click="toTop()">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-huojian" />
              </svg>
            </div>
          </transition>
          <div class="contact-item">
            <!-- <div class="item" id="qq" @click="goToQQ()" @mouseover="icon.qq = '#icon-qq-color'" @mouseout="icon.qq = '#icon-qq'">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="icon.qq" />
              </svg>
            </div> -->
            <!-- <div
              id="weixin"
              class="item weixin-btn"
              @mouseover="
                showWeixin = true
                icon.weixin = '#icon-weixin-color'
              "
              @mouseout="
                showWeixin = false
                icon.weixin = '#icon-weixin'
              "
            >
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="icon.weixin" />
              </svg>
              <div>
                <transition name="el-zoom-in-center">
                  <img src="https://qiniuyun.zhichi921.com/weixin1.jpg" alt v-show="showWeixin" />
                </transition>
              </div>
            </div> -->
            <div class="item" v-if="accessToken" id="" @click="handleLogout">登出</div>
            <div class="item" v-if="accessToken" id="">
              <a href="https://navigation.authing.cn/u" style="display: block;" target="_blank" rel="noopener noreferrer">我</a>
            </div>
            <div class="item" id="" @click.prevent.stop="onContextmenu" @contextmenu.prevent="onContextmenu">菜单</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="other">
      <div class="u-flex u-row-center other-item">
        <div class=""><img src="../src/assets/注册完成.svg" alt=""></div>
        <div class="text">注册后你将可以收藏自己喜欢的网址!</div>
      </div>
      <div class="u-flex u-row-center other-item">
        <div class="">如果你愿意你可以把你的专属链接分享给他人!</div>
        <div class="text"><img src="../src/assets/数据分享.svg" alt=""></div>
      </div>
      <div class="u-flex u-row-center other-item">
        <div class=""><img src="../src/assets/问题.svg" alt=""></div>
        <div class="text">
          <ul>
            <li>链接右下角为点击数</li>
            <li>对右下角菜单点击右键,可以选择注册或登录,新增网址(<b>必须先有类别</b>)等!</li>
            <li>对网址点击右键可以进行编辑、删除操作.</li>
            <li>Ctrl+F激活搜索框</li>
            <li>可以通过更改个人资料的昵称，修改网页的标题</li>
          </ul>
        </div>
      </div>
      <div class="u-flex u-row-center other-item">
        <div class="">
          <p>制作此网站的目的:一是学习练习所用,二是收藏的网址太多需要工作和娱乐分开书签不够用.<br />开发出来方便大家(虽然目前只有自己在用~~)</p>
          <p>希望大家不要用来传播违法不良信息,否则后果自负!!!</p>
        </div>
        <div class="text"><img src="../src/assets/编辑规则.svg" alt=""></div>
      </div>
    </div>


    <!-- 底部 -->
    <!-- <div class="footer">
      <div class="footer-inner">
        <el-input placeholder="权限密钥" v-model="code" @change="codeChange" style="width:300px">
            <template slot="prepend">密钥</template>
        </el-input>
      </div>
    </div> -->

    <!-- 新增类型 -->
    <el-dialog title="新增分类" :visible.sync="typeDialog">
      <el-form :model="typeForm" :rules="typeRules" ref="typeFormRef">
        <el-form-item label="分类名称" prop="type">
          <el-input type="textarea" :rows="4" placeholder="请输入类型名称" v-model="typeForm.type"></el-input>
        </el-form-item>
        <el-form-item class="form-footer">
          <el-button size="medium" @click="typeDialog = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="addType">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 新增链接 -->
    <el-dialog title="新增网址" :visible.sync="linkDialog" :close-on-click-modal="false">
      <el-form :model="linkForm" :rules="linkRules" ref="linkFormRef" label-position="left"  label-width="90px">
        <el-form-item label="网址URL" prop="url">
          <el-input type="input" placeholder="请输入网址URL" v-model="linkForm.url"></el-input>
        </el-form-item>
        <el-form-item label="网址标题" prop="title">
          <el-input type="input" :rows="4" placeholder="请输入网址标题" v-model="linkForm.title"></el-input>
        </el-form-item>
        <el-form-item label="网址简介" prop="desc">
          <el-input type="input" :rows="4" placeholder="请输入网址简介" v-model="linkForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="网址分类" prop="type">
          <el-select v-model="linkForm.type" placeholder="请选分类">
            <el-option :label="item.type" :value="item.type" v-for="item in typeList" :key="item._id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="网址图标">
          <el-input type="input" :rows="4" placeholder="请输入网站图标地址" v-model="linkForm.icon"></el-input>
        </el-form-item>
        <el-form-item class="form-footer">
          <el-button size="medium" @click="linkDialog = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="addLink">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>
<script>
import SiteList from '@/components/SiteList'
import { getSiteList, addType, getTypeList, addLink } from '@/api'
import utils from '@/utils/index.js'
export default {
  name: 'app',
  inject: ['$authing'],
  data() {
    return {
      accessToken:'',
      code:'',
      keyword: '',
      siteList: [],
      linkData:[],
      element: {
        nav_item: null,
        floor_item: null,
      },
      showBackTop: false,
      showWeixin: false,
      rules: {
        content: [{ required: true, message: '请填写反馈内容', trigger: 'blur' }],
      },
      timer: null,
      icon: {
        qq: '#icon-qq',
        weixin: '#icon-weixin',
      },
      loading: null,
      searchTimer: null, 
      qq: '1843544121',
      typeDialog:false,
      typeForm:{
        type: '',
        code: '',
      },
      typeRules: {
        type: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
      },
      typeList:[],
      linkDialog:false,
      defaultLinkForm:{
        url: '',
        title: '',
        desc: '',
        type: '',
        icon: '',
        clicks: 1,
        code: '',
      },
      linkForm:{
        url: '',
        title: '',
        desc: '',
        type: '',
        icon: '',
        clicks: 1,
        code: '',
      },
      linkRules: {
        url: [{ required: true, message: '请输入网址', trigger: 'blur' }],
        title: [{ required: true, message: '请输入网址标题', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入网址简介', trigger: 'blur' }],
        type: [{ required: true, message: '请选择网址类别', trigger: 'blur' }],
        
      },
      formSearch: {
				searchKey: '',
				timer: null
			},
    }
  },
  components: {
    SiteList,
    // Cute,
  },
  created() {
    this.code = utils.getQueryVariable('u') || localStorage.getItem('code') ||'';
    // console.log('u',utils.getQueryVariable('u'));
    // let dataCode = utils.getQueryVariable('u');
    this.loading = this.$loading({ fullscreen: true })
    if(!utils.getQueryVariable('u')){
      this.getSiteList()
     this.getTypeList();
    }
    

    this.accessToken = localStorage.getItem('accessToken');

    
  },
  methods: {
    onContextmenu(event) {
      this.$contextmenu({
        items: [
          {
            label: "新增网址",
            onClick: () => {
              this.linkDialog = true;
            }
          },
          { label: "重新加载", divided: true, icon: "el-icon-refresh",
            onClick: () => {
              location.reload();
            }
          },
          {
            label: "新增类别",
            divided: true,
            onClick: () => {
              this.typeDialog = true;
              // this.$message("新增类别");
            }
          },
          {
            label: "登录",
            onClick: () => {
              // this.typeDialog = true;
              // this.$message("觉得没必要，还没写！");
              
              // PKCE 场景使用示例
              // 生成一个 code_verifier
              let codeChallenge = this.$authing.generateCodeChallenge();
              localStorage.setItem('codeChallenge', codeChallenge);
              // 计算 code_verifier 的 SHA256 摘要
              let codeChallengeDigest = this.$authing.getCodeChallengeDigest({ codeChallenge, method: 'S256' });
              // 构造 OIDC 授权码 + PKCE 模式登录 URL
              let url = this.$authing.buildAuthorizeUrl({ codeChallenge: codeChallengeDigest, codeChallengeMethod: 'S256' });
              window.location.href = url;
            }
          },
        ],
        event,
        //x: event.clientX,
        //y: event.clientY,
        customClass: "menu-custom-class",
        zIndex: 100,
        minWidth: 230
      });
      return false;
    },
    addType(){
      let that = this;
      this.$refs['typeFormRef'].validate((valid) => {
        if (valid) {
          let hasType = this.typeList.some(function(item){
            // console.log('item',item);
            return item.type == that.typeForm.type
          });
          console.log('hasType',hasType);
          if (hasType){this.$message.error('已经有了');return false};
          this.typeForm.code = this.code;
          addType(this.typeForm).then(res => {
            this.$message.success(res.msg);
            this.typeDialog = false;
            this.typeForm.type = '';
            this.getTypeList();
          }).catch(err => {
            console.log('addType err',err);
          })
        } else {
          this.$message('请填写完整');
          return false;
        }
      });
      
    },
    addLink(){
      let that = this;
      this.linkForm.code = this.code;
      this.$refs['linkFormRef'].validate((valid) => {
        if (valid) {
          addLink(this.linkForm).then(res => {
            this.$message.success(res.msg);
            this.linkDialog = false;
            this.linkForm = this.defaultLinkForm;
            this.getSiteList();
          }).catch(err => {
            console.log('addType err',err);
          })
        } else {
          this.$message('请填写完整');
          return false;
        }
      });
      
    },
    async getTypeList() {
      // console.log('this.code',this.code);
      const res = await getTypeList({code:this.code})
      this.typeList = res.data;
    },
    async getSiteList() {
      const res = await getSiteList({code:this.code})
      // console.log('getSiteList',res)
      let siteArr = res.data;
      this.linkData = res.data;
      this.siteList = this.groupArr(siteArr);
      console.log('this.siteList',this.siteList)
      this.sitetotalnum = res.totalCount
    },
    groupArr(arr) {
      var map = {},
        result = [];
      for (var i = 0; i < arr.length; i++) {
        var ai = arr[i];
        if (!map[ai.type]) {
          result.push({
            ftitle: ai.type,
            list: [ai]
          });
          map[ai.type] = ai;
        } else {
          for (var j = 0; j < result.length; j++) {
            var dj = result[j];
            if (dj.ftitle == ai.type) {
              dj.list.push(ai);
              break;
            }
          }
        }
      }
      return result;
    },
    codeChange(e){
      localStorage.setItem('code',e);
    },
    goToQQ() {
      window.open('http://wpa.qq.com/msgrd?v=3&uin=' + this.qq + '&site=qq&menu=yes', '_blank')
    },
    /**
     * 监听窗口滚动楼层导航动态定位
     */
    floorSrcollEventListener() {
      const { nav_item, floor_item } = this.element
      const window_scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      for (let i = 0, len = floor_item.length; i < len; i++) {
        let floor_offsetTop = floor_item[i].offsetTop - floor_item[0].offsetTop
        if (window_scrollTop >= floor_offsetTop) {
          for (let n = 0, len = nav_item.length; n < len; n++) {
            const current_classList = nav_item[n].classList
            i === n ? current_classList.add('active') : current_classList.remove('active')
          }
        }
      }
    },
    /**
     * 设置楼层导航事件驱动方法
     * @param {Number} index  楼层下标
     */
    setFloorNavMountClick(index) {
      const { floor_item } = this.element
      let floor_offsetTop = floor_item[index].offsetTop - floor_item[0].offsetTop + 72,
        window_scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
        timer = {
          step: 60,
          times: 16,
          FLOOR_OFFSETTOP: floor_offsetTop,
        }
        //尝试修复bug
        // let availHeight = window.screen.availHeight;
        // let scrollHeight = document.body.scrollHeight;
        // let ah = scrollHeight - availHeight;
        // if(floor_offsetTop>ah){floor_offsetTop=ah}
        // console.log('floor_offsetTop',floor_offsetTop);
        //  console.log('window_scrollTop',window_scrollTop);
        // console.log(' document.body.scrollHeight', document.body.scrollHeight);
        // console.log(' window.screen.availHeight',  window.screen.availHeight);
         //尝试修复bug

      if (window_scrollTop > floor_offsetTop) {
        this.setFloorScrollArrowUp(timer)
      } else if (window_scrollTop == floor_offsetTop) {
        return false
      } else {
        this.setFloorScrollArrowDown(timer)
      }
    },
    /**
     * 设置楼层向上滚动
     * @param {Object} timer 定时器配置
     */
    setFloorScrollArrowUp(timer) {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        let window_scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        if (window_scrollTop <= timer.FLOOR_OFFSETTOP) {
          document.documentElement.scrollTop = timer.FLOOR_OFFSETTOP
          document.body.scrollTop = timer.FLOOR_OFFSETTOP
          clearInterval(this.timer)
        } else {
          document.documentElement.scrollTop = window_scrollTop - timer.step
          document.body.scrollTop = window_scrollTop - timer.step
        }
      }, timer.times)
    },
    /**
     * 设置楼层向下滚动
     * @param {Object} timer 定时器配置
     */
    setFloorScrollArrowDown(timer) {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        let window_scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        if (window_scrollTop >= timer.FLOOR_OFFSETTOP) {
          document.documentElement.scrollTop = timer.FLOOR_OFFSETTOP
          document.body.scrollTop = timer.FLOOR_OFFSETTOP
          clearInterval(this.timer)
        } else {
          document.documentElement.scrollTop = window_scrollTop + timer.step
          document.body.scrollTop = window_scrollTop - timer.step
        }
      }, timer.times)
    },
    // 显示返回顶部按钮
    handleScroll() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop >= 120) {
        this.showBackTop = true
      } else if (scrollTop < 120) {
        this.showBackTop = false
      }
    },
    // 返回顶部
    toTop() {
      let top = document.documentElement.scrollTop || document.body.scrollTop
      console.log('top',top);
      // 实现滚动效果
      const timeTop = setInterval(() => {
        document.body.scrollTop = document.documentElement.scrollTop = top -= 80
        if (top <= 0) {
          clearInterval(timeTop)
        }
      }, 10)
    },
    getToken: async function(code, codeChallenge) {
			let tokenSet = await this.$authing.getAccessTokenByCode(code, { codeVerifier: codeChallenge });
			const { access_token, id_token } = tokenSet;
			let userInfo = await this.$authing.getUserInfoByAccessToken(tokenSet.access_token);
      this.code = userInfo.sub;
      localStorage.setItem('code',this.code);
			localStorage.setItem('accessToken', access_token);
			localStorage.setItem('idToken', id_token);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      let url = 'http://'+window.location.host+'?u='+this.code;
      window.location.href = url;

		},
    handleLogout(){
      let idToken = localStorage.getItem('idToken')
      this.$authing.buildLogoutUrl({
        expert: true,
        redirectUri: window.location.host,
        idToken,
      })
      localStorage.clear()
      window.location.href = 'http://'+window.location.host
    },
    search(){
      let that = this;
      this.siteList = [
        {
          ftitle:'搜索结果',
          list:[]
        }
      ];
      this.linkData.map((link)=>{
          if(link.title.indexOf(this.formSearch.searchKey)!=-1    || link.desc.indexOf(this.formSearch.searchKey)!=-1 || link.url.indexOf(this.formSearch.searchKey)!=-1){
              that.siteList[0].list.push(link);
          }
      })
    },
    searchKey(e) {     
      var key = window.event.keyCode ? window.event.keyCode : window.event.which;
      if (key === 70 && e.ctrlKey) {
        this.$refs['searchInput'].focus()
        e.preventDefault()
      }
    }
  },
  watch: {
    code:{
      handler(val, oldVal){
          this.getTypeList();
          this.getSiteList();
      },
		},
    'formSearch.searchKey': {
      handler(value) {
        console.log('value',value);
        if(!value) {
          this.siteList = this.groupArr(this.linkData);
          return;
        };
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.search();
          this.toTop();
        }, 500)
      },
      deep: true
    }
    
  },
  mounted() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log('userInfo',userInfo);
    if(userInfo){
      let webTitle = userInfo.nickname || '导航';
      document.title = webTitle;
    }
    
    // 获取楼层及导航元素
    setTimeout(() => {
      this.element = {
        nav_item: document.getElementsByClassName('nav'),
        floor_item: document.getElementsByClassName('floor-item'),
      }
      this.element.nav_item[0].classList.add('active')
      window.addEventListener('scroll', this.floorSrcollEventListener)
    }, 200)
    // 添加监听屏幕滚动事件
    window.addEventListener('scroll', this.handleScroll)
    this.loading.close();

    document.addEventListener('keydown', this.searchKey)

    // function getQueryVariable(variable)
    // {
    //       var query = window.location.search.substring(1);
    //       var vars = query.split("&");
    //       for (var i=0;i<vars.length;i++) {
    //               var pair = vars[i].split("=");
    //               if(pair[0] == variable){return pair[1];}
    //       }
    //       return(false);
    // }

    const code = utils.getQueryVariable('code');
	  const codeChallenge = localStorage.getItem('codeChallenge');
    if(code&&codeChallenge){
      this.getToken(code, codeChallenge);
    }
    // console.log('userInfo',localStorage.getItem('userInfo'));
    // 添加百度统计
    let _hmt = _hmt || []
    ;(function() {
      let hm = document.createElement('script')
      hm.src = 'https://hm.baidu.com/hm.js?b77f0ca4f2ff4960338c95760b7efb11'
      let s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(hm, s)
    })()

  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.floorSrcollEventListener)
  },
}
</script>

<style scoped lang="scss">
.sidebar {
  position: sticky;
  top: 32px;
  left: 1.5%;
  margin-top: 32px;
  height: 480px;
  border-radius: 10px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-align: center;
  padding: 10px 0;
  color: #444;
  .nav {
    cursor: pointer;
    font-size: 15px;
  }
}
.active {
  color: #ff5a00;
}
.contact {
  position: fixed;
  bottom: 80px;
  right: 25px;
  width: 46px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 192px;
  .item {
    width: 46px;
    height: 40px;
    background-color: #e1e9ee;
    margin-top: 8px;
    line-height: 40px;
    text-align: center;
    color: #4e46aa;
    font-size: 13px;
    border-radius: 4px;
    transition: 0.3s;
    cursor: pointer;
    &:hover {
      color: #ffa617;
    }
    .icon {
      font-size: 20px;
    }
  }
  .contact-item {
    position: absolute;
    bottom: 0;
  }
  #fankui {
    background-color: #99aebc;
    &:hover {
      color: #222222;
    }
  }
  #to-top {
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      width: 24px;
      height: 24px;
    }
  }
}
.weixin-btn {
  position: relative;
  & > div {
    position: absolute;
    left: -190px;
    top: -150px;
    img {
      width: 160px;
      height: 284px;
      border-radius: 10px;
    }
  }
}
.form-footer {
  display: flex;
  flex-direction: row-reverse;
  margin-top: 20px;
}
.footer {
  text-align: center;
  height:60px;
  .footer-inner{
    position:fixed;
    left:0;
    right:0;
    bottom:0;
    background-color: #e5e5e5;
  }

}
::v-deep .el-textarea__inner {
  font-family: 'Pingfang-Medium';
}
.other{
  padding: 24px;
  color: #fff;
  margin-top: 24px;
  background: linear-gradient(180deg,#4f48ad,#1d185e);
  &-item{
    line-height: 1.5;
    margin-bottom: 24px;
    img{
      width: 30vw;
    }
    .text{
      padding: 24px;
    }
  }
}
</style>
