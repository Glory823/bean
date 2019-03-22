require.config({
	paths: {
		"mui": "./libs/mui.min",
		"jsonp": "./libs/mui.jsonp"
	},
	shim: {
		"jsonp": {
			deps: ['mui']
		}
	}
})


require(["mui", "jsonp"], function(mui, jsonp) {
	var picImg = document.querySelector(".picImg");
	var url = "https://api.douban.com/v2/movie/in_theaters";
	var page = 0;
	var pageSize = 5;

	function init() {
		mui.init({
			pullRefresh: {
				container: '#pullrefresh',
				// 				down: {//下拉刷新
				// 					callback: pulldownRefresh
				// 				},
				up: { //上拉加载
					contentrefresh: '正在加载...', //可选
					contentnomove: '没有更多数据了', //可选
					callback: allData //调用可以不用加括号
				}
			}
		});

		allData();

		click();

		search();
	}


	//获取全部数据
	function allData() {
		setTimeout(function() {
			mui.getJSONP(url, {
				start: page++,
				count: pageSize
			}, function(data) {
				const res = data.subjects;
				if (res.length === 0) {
					mui("#pullrefresh").pullRefresh().endPullupToRefresh(true);
				} else {
					mui("#pullrefresh").pullRefresh().endPullupToRefresh(false);
					rander(res);
				}
			});
		}, 1500)
	}


	//渲染数据
	function rander(data) {
		var str = "";
		data.map(item => {
			str +=
				`<div class="picList">
							<div class="left">
								<img src="${item.images.small}" alt="">
							</div>
							<div class="right">
								<p class="span imgList">
									<span>${item.title}</span>
									<b>${item.rating.average}</b>
								</p>
								<p class="imgList">类型：`;
			item.genres.map(val => {
				str += `<span>${val}</span>`;
			})
			str += `</p>
						<p class="imgList">导演：`;
			item.directors.map(val => {
				str += `<span>${val.name}</span>`;
			})
			str += `</p>
						<p class="imgList">演员：`;
			item.casts.map(ind => {
				str += `<span>${ind.name}</span>`;
			})
			str += `</p>
		                <p class="imgList">${item.year}月作品</p>
						</div>
						</div>`;
		})
		picImg.innerHTML += str;
	}


	//点击list  tab切换
	function click() {
		mui(".list").on("tap", "li", function() {
			if (this.classList.contains("active")) {
				return;
			}
			var lists = [...document.querySelectorAll(".list li")];
			for (var i = 0; i < lists.length; i++) {
				lists[i].classList.remove("active");
			}
			this.classList.add("active");

			const attr = this.getAttribute("data-id");
			if (attr == 1) {
				picImg.innerHTML = "";
				url = "https://api.douban.com/v2/movie/in_theaters";
				allData();
			} else if (attr == 2) {
				picImg.innerHTML = "";
				url = "https://api.douban.com/v2/movie/coming_soon";
				allData();
			} else {
				picImg.innerHTML = "";
				url = "http://api.douban.com/v2/movie/top250";
				allData();
			}
		})
	}



	//模糊搜索
	function search() {
		var timer = null;
		const search = document.querySelector(".search");
		clearTimeout(timer);
		search.oninput = function() {
			timer = setTimeout(() => {
				mui.getJSONP('http://api.douban.com/v2/movie/search', {
					"start": 3,
					"count": 7,
					"q": this.value
				}, function(data) {
					rander(data.subjects);
				});
			}, 1000)
		}


	}

	//上拉加载
	function pullupRefresh() {


	}
	init();
})
