<template>
	<div>
		<div class="part floor-item" v-for="item in siteList" :key="item.ftitle">
			<h2>
				<strong>{{ item.ftitle }}</strong>
			</h2>
			<el-row class="items">
				<div class="item" v-for="site in item.list" :key="site.title" ref="item" @click="clickItem(site._id)" @contextmenu.prevent="onContextmenu(site,$event)">
					<el-col :xs="12" :sm="8" :md="6" :lg="4" >
						<a :href="site.url" target="_blank">
							<span class="clicks">{{site.clicks}}</span>
							<img :src="defaultIcon" v-real-img="site.icon" :alt="site.title" />
							<h3>{{ site.title }}</h3>
							<p v-if="site.desc">{{ site.desc }}</p>
						</a>
					</el-col>
				</div>
			</el-row>
		</div>
		<div class="no-data" v-if="accessToken&&siteList.length < 1">
			<div class="til">还没有数据呦！</div>
			<ul class="con">
				<li>你可以在右侧“工具”上点击右键，新增‘导航类别’，此时不会有任何显示</li>
				<li>再对“工具”点击右键，新增网址就可以了</li>
			</ul>
		</div>
		<!-- <el-row>
			<el-col :xs="24" :sm="24" :md="24" class="hidden-sm-and-down">
				<div><img class="banner" src="../assets/banner.jpg" alt="" /></div>
			</el-col>
		</el-row> -->

		<!-- 编辑链接 -->
    <el-dialog title="编辑网址" :visible.sync="linkDialog" :close-on-click-modal="false">
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
          <el-button size="medium" type="primary" @click="editLink">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

	<el-dialog
		title="提示"
		:visible.sync="showDel"
		width="30%">
		<span>确认删除吗</span>
		<span slot="footer" class="dialog-footer">
			<el-button @click="showDel = false">取 消</el-button>
			<el-button type="primary" @click="doDel">确 定</el-button>
		</span>
	</el-dialog>

	</div>
</template>

<script>
import { getTypeList, editLink, delLink, clickLink } from '@/api'
export default {
	name: 'siteList',
	data(){
		return {
			accessToken:'',
			defaultIcon:require("../assets/default-ico.png"),
			// typeList:[],
			linkDialog:false,
			linkForm:{
				url: '',
				title: '',
				desc: '',
				type: '',
				icon: '',
				clicks: 1,
			},
			linkRules: {
				url: [{ required: true, message: '请输入网址', trigger: 'blur' }],
				title: [{ required: true, message: '请输入网址标题', trigger: 'blur' }],
				desc: [{ required: true, message: '请输入网址简介', trigger: 'blur' }],
				type: [{ required: true, message: '请选择网址类别', trigger: 'blur' }],
				
			},
			showDel:false,
		}
	},
	props: {
		siteList: Array,
		typeList:Array,
		code:String,
	},
	methods: {
		onContextmenu(site,$event) {
			console.log('site',site);
			this.linkForm = site;
			this.$contextmenu({
				items: [
				{
					label: "编辑",
					onClick: () => {
					this.linkDialog = true;
					console.log("返回(B)");
					}
				},
				{
					label: "删除",
					onClick: () => {
					this.showDel = true;
					// this.$message("新增类别");
					}
				},
				],
				$event,
				x: $event.clientX,
				y: $event.clientY,
				customClass: "link-custom-class",
				zIndex: 100,
				minWidth: 230
			});
			return false;
		},
		async getTypeList() {
			const res = await getTypeList()
			this.typeList = res.data;
		},
		editLink(){
			let userInfo = JSON.parse(localStorage.getItem('userInfo'));
			if(!userInfo){
				this.$message.error('你没有权限！');
				return false;
			}
			if(this.code!=userInfo.sub){
				this.$message.error('你没有权限！');
				return false;
			}
			let param = {
				code:this.code,
				param:this.linkForm
			};
			editLink(param).then(res => {
				this.$message.success(res.msg);
				this.linkDialog = false;
			}).catch(err => {
				console.log('addType err',err);
			})
		},
		doDel(){
			let userInfo = JSON.parse(localStorage.getItem('userInfo'));
			if(!userInfo){
				this.$message.error('你没有权限！');
				return false;
			}
			if(this.code!=userInfo.sub){
				this.$message.error('你没有权限！');
				return false;
			}
			delLink({id:this.linkForm._id,code:this.code}).then(res => {
				this.$message.success(res.msg);
				this.showDel = false;
				this.$emit('refresh')
			}).catch(err => {
				console.log('addType err',err);
			})
		},
		clickItem(id){
			console.log(id);
			// return false;
			clickLink(id).then(res => {
				// this.$message.success(res.msg);
			}).catch(err => {
				console.log('addType err',err);
			})
		}
	},
	created() {
		// this.getTypeList();
	},
	mounted() {
		//辅助判断是否有数据用的
		setTimeout(() => {
			this.accessToken = localStorage.getItem('accessToken');
		},200)
		
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.part {
	background: #fff;
	margin-top: 32px;
	border-radius: 10px;
	h2 {
		padding: 13px 36px;
		border-bottom: 1px solid #f1f4f9;
		font-size: 16px;
	}
	.items {
		// display: flex;
		// justify-content: flex-start;
		// flex-wrap: wrap;
		padding: 20px 16px;
		.item {
			a {
				position: relative;
				display: block;
				width: 100%;
				padding: 14px 8%;
				// padding: 12px 0px;
				box-sizing: border-box;
				transition: all 0.3s;
				border-radius: 6px;
				.clicks{
					position: absolute;
					right: 10px;
					bottom: 0;
					text-align: center;
					color: #ededed;
					font-size: 30px;
					z-index: 1;
					font-weight: 300;
				}
				&:hover {
					box-shadow: .5rem .875rem 2.375rem rgba(39,44,49,.06),.0625rem .1875rem .5rem rgba(39,44,49,.03);
					background-color: #f2f8fd;
					h3 {
						color: #ee521c;
					}
					p {
						color: #525252;
					}
				}
				img {
					float: left;
					width: 26px;
					height: 26px;
					border-radius: 100%;
				}
				h3 {
					position: relative;
					z-index: 10;
					margin-left: 32px;
					color: #3c3c3c;
					font-size: 14px;
					white-space: nowrap;
					height: 26px;
					line-height: 26px;
					margin-bottom: 4px;
					overflow: hidden;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				p {
					position: relative;
					z-index: 10;
					// margin-left: 32px;
					color: #8f8f8f;
					font-size: 12px;
					height: 3em;
					line-height: 1.5em;
					overflow: hidden;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
		}
	}
}
.banner {
	float: left;
	width: 100%;
	border-radius: 10px;
	cursor: pointer;
	margin-top: 50px;
	opacity: 0.9;
	&:hover {
		opacity: 1;
	}
}
.no-data{
	padding-top: 20vh;
	text-align: center;
	.til{
		font-size: 40px;
		margin-bottom: 25px;
	}
	.con{
		li{
			list-style: none;
			margin-bottom: 14px;
		}
	}
}
</style>
