$(document).ready(function(e) {
    //连连看图片
    var pg = new linkGame({
        img: [
              "#FF0000",
              "#B22400",
              "#FF6600",
              "#FFE500",
              "#B2B300",
              "#33FF00",
              "#008E00",
              "#009999",
              "#0033CC",
              "#330099",
              "#AA80FE",
              "#990099",
              "#80FFFE",
              "#FED9BF",
              "#D580FE"]
    });
});
//构造函数
var linkGame = function(options){
	//图片地址数组（共15张图片）
	this.imgSrc = options.img;
    //取得元素
	this.e_playArea = $("#play_area");
	this.e_startBtn = $("#play_btn_start");
	this.e_replayBtn = $("#play_btn_reset");
    this.e_playScore = $("#play_score");
	this.e_playScoreS = $("#play_score_s");  
    this.e_playB = $("#play_time_b");
	this.e_playT = $("#play_time_t");
	this.e_playP = $("#play_time_p");
	//取得游戏区域的长宽
	this.areaWidth = parseInt(this.e_playArea.css("width"));
	this.areaHeight = parseInt(this.e_playArea.css("height"));
	//游戏得分
	this.score = 0;
    //第一关、第二关、第三关、第四关、第五关
    this.lev=30;
    // this.twoLev=40;
    // this.thrLev=50;
    // this.fourLev=60;
    // this.fiveLev=72;

	//游戏区域：8行14列，其中四周空一圈，实际放置图片区域：6行12列
	this.cellRow = 8
	this.cellCol = 14
	//每个格子52*52，其中图片50*50，边框2*2
	this.cellWidth = 52;
	this.cellHeight = 52;
    //图片位置数组
	this.imgArr = [];
	this.ranArr = [];	
    //存放格子div元素
	this.cellArr = [];
    //seeArr存放图片在图片数组中的索引位置（1-15）
    this.seeArr = [];
    //记录点击元素图片的位置
    this.nextCell = [];
    //动画显示的类型
	this.easing = 'swing';
    //初始游戏时间
	this.playTime = 100;
    //计时
    this.showTimer = null;
    //0代表不放置图片，1代表放置图片，shapeArr[i]图片位置与数量都不同，代表级别（共112个格子）
    this.shapeArr = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]                     
                    ];
    //游戏刚开始为0级（关卡）
    this.shape = 0;
    
    this.testArr = [];
	//游戏开始
	this.start();
};
//函数原型
linkGame.prototype = {
	start:function(){
        //游戏初始化加载
		this.init();
        //游戏菜单
		this.menu();
        //this.testShape();
        //this.play();
	},
    // 生成随机数
    rnd:function(begin, end){
        return Math.floor(Math.random() * (end - begin)) + begin;
    },
    //关卡
    levCross:function(){
        //alert(this.shape);
        if (this.shape==0) {this.lev=30;}
        else if (this.shape==1) {this.lev=40;}
        else if (this.shape==2) {this.lev=50;}
        else if (this.shape==3) {this.lev=60;}
        else if (this.shape==4) {this.lev=72;}
        else
            return;
        var index = 0;
        //初始-一级为30个图片
        for (var i = 0; i < this.lev; i++) {
            index = this.rnd(14, 97);//在14-97之间生成随机数，空出上下两行
            if (!this.shapeArr[this.shape][index]&&index!=14&&index!=28&&index!=42&&index!=56&&index!=70&&index!=84&&index!=27&&index!=41&&index!=55&&index!=69&&index!=83&&index!=97) {
                this.shapeArr[this.shape][index]=1;
            }
            else{
                i--;
                continue;
            }
        }
    },
    //初始化加载
    init:function(){
        this.levCross();

        //每个格子元素div
        var _cell;
        
        this.cellArr = [];
        this.imgArr = [];
        //游戏区域使用html构造
        this.e_playArea.html("");
        //_arr存放游戏图片
        var _arr = [], 
        //klen为放置图片的数量
            klen = 0;
        //this.shape游戏级别
        for(var l = 0, llen = this.shapeArr[this.shape].length; l<llen; l++){
            //如果this.shapeArr=1，则klen++
            if(this.shapeArr[this.shape][l]) 
                klen ++;
            if(l == llen - 1){
                for(var k = 0; k < klen / 2; k++){
                    var kk = k < this.imgSrc.length ? k : k % this.imgSrc.length;
                    //一种图片放置两张，因此push两次
                    _arr.push(kk);
                    _arr.push(kk);
                }
            }
        }              
        //console.log(_arr);
        //cellRow游戏区域行数
        for(var i = 0; i<this.cellRow; i++){
            //seeArr存放图片在图片数组中的索引位置
            this.seeArr[i] = [];
            //存放格子div元素
            this.cellArr[i] = [];
            //cellCol游戏区域列数
            for(var j = 0; j<this.cellCol; j++){
                this.imgArr.push(i*this.cellCol + j);
                _cell = document.createElement("div");
                _cell.className = "play_cell";
                $(_cell).css({
                    //左右上下留1用于图片边框
                    "width": this.cellWidth-2,
                    "height": this.cellHeight-2,
                    "left": j * this.cellWidth,
                    "top": i * this.cellHeight
                });
                //如果shapeArr[]=1，则放置图片
                if(this.shapeArr[this.shape][i * this.cellCol + j]){//(i > 0 && i < this.cellRow - 1) && (j > 0 && j< this.cellCol - 1)
                    //随机取出图片数组_arr中的图片
                    var _ran = Math.floor(Math.random() * _arr.length);
                    var _img = _arr[_ran];
                    //splice() 方法向/从数组中添加/删除项目，然后返回被删除的项目，该方法会改变原始数组
                    //1则删除，0则不删除，即删除_arr中_arr[_ran]项目
                    _arr.splice(_ran,1);
                    //_cell加载游戏图片背景，且不显示出来，等到全部加载完后，一起显示
                    $(_cell).css({
                        "background": this.imgSrc[_img],
                        "opacity": 0
                    });
                    //seeArr存放当前图片在图片数组中的索引位置
                    this.seeArr[i][j] = _img;
                    $(_cell).addClass("img")
                }
                else{
                    this.seeArr[i][j] = -1;
                }
                //存放但前格子div元素
                this.cellArr[i][j] = $(_cell);
                //将当前格子div元素添加到游戏区域中
                this.e_playArea.append(_cell);
                //当游戏区域中图片全部加载完毕后，动画的显示出全部加载图片
                if(i == (this.cellRow - 1) && j == (this.cellCol - 1)){
                    $(".play_cell.img").animate({
                        "opacity": 1
                    },1000,'swing');
                }
            }
        }
    },
    //游戏菜单
    menu:function(){
        //将this赋予当前调用者，即谁调用menu，则self就是该调用者
        var self = this;
        //开始按钮
        this.e_startBtn.click(function(){
            //self.e_levelMenu.hide();
            //playing是否已经开始游戏
            if(self.playing) return;
            //如果还没开始游戏，则开始
            self.play();
            $("#play_btn_start").addClass("active");
        });
        //重新按钮
        this.e_replayBtn.click(function(){
            self.replay();
        });

        $(window).resize(function(){
            self.offX = self.e_playArea.offset().left;
            self.offY = self.e_playArea.offset().top;
        })
    },
    //开始游戏
    play:function(){
        //游戏已经开始
        this.playing = true;
        //绑定格子div元素事件
        this.bindCell();
        //开始计时
        this.showTime();
    },
    //重新开始游戏
    replay:function(){
        this.playing = true;
        
        this.playTime = 100;
        this.shape = 0;
        this.score = 0;
        //.html()读取元素的第一个内容
        this.e_playScoreS.html(this.score);
        this.init();
        this.bindCell();
        this.showTime();
    },
	set: function(options){
		//this.level = options.level === 0 ? 0 : (options.level || this.level);
		//this.imgSrc = options.img || this.imgSrc;
	},	
    //绑定元素
    bindCell:function(){
        //将this赋予当前调用者，即谁调用menu，则self就是该调用者
        var self = this;
        //this.isBind = true;
        //给每一个cellArr绑定自身当前的事件，i行j列
        //each方法中fn的具体调用方法，是采用了fn.call(val,i,val)，可以直接采用this指针引用数组或是对象的子元素
        $.each(this.cellArr, function(i){
            $.each(self.cellArr[i], function(j){
                self.cellArr[i][j].on({
                    //鼠标移触到时，如果当前元素有图片，则边框高亮提示
                    "mouseover": function(){
                        if(self.seeArr[i][j] == -1) return;
                        //此时的this指向当前的self.cellArr[i][j]元素
                        $(this).addClass("hover");
                    },
                    "mouseout": function(){
                        if(self.seeArr[i][j] == -1) return;
                        $(this).removeClass("hover");
                    },
                    //鼠标点击时，如果当前元素有图片，则边框高亮提示
                    "click": function(){
                        if(self.seeArr[i][j] == -1) return;
                        if(self.nextCell.length > 0){
                            //判断上一次点击的seeArr是否与本次点击的seeArr一样，且两次点击的不是同一个div元素
                            if(self.seeArr[self.nextCell[0]][self.nextCell[1]] == self.seeArr[i][j] && !(self.nextCell[0] == i && self.nextCell[1] == j)){
                                self.cellArr[self.nextCell[0]][self.nextCell[1]].removeClass("active");
                                //元素匹配
                                self.bePairs(i, j);
                            }
                            //如果两次点击元素不匹配，则更新记录第二次的元素图片位置
                            else{
                                self.cellArr[self.nextCell[0]][self.nextCell[1]].removeClass("active");
                                self.nextCell = [i,j];                               
                                $(this).addClass("active");
                            }
                        }
                        else{
                            //记录点击的元素图片的位置
                            self.nextCell = [i,j];
                            $(this).addClass("active");
                        }                        
                    }
                });
            })
        })
    },   	
    showTime:function(t){
        var self = this, 
            redNum = 0, 
            _stop = false;
        //清除计时器
        clearInterval(this.showTimer);
        //如果t值存在，则使用原有的时间t
        self.playTime = t == null ? self.playTime : t;
        //（动画-在这里没什么作用）
        // if(t){
        //     _stop = true;
        //     self.e_playP.animate({
        //         "width": self.playTime + "%"
        //     },500,'swing');
            
        //     self.e_playT.animate({
        //         "left": self.playTime + "%"
        //     },500,'swing',function(){
        //         _stop = false;
        //         //Math.ceil向上取整，更新时间
        //         self.e_playT.html(Math.ceil(self.playTime));
        //     });
        // }
        //游戏时间计时器
        this.showTimer = setInterval(function(){
            if(_stop) return;
            //由于每10ms更新一次，所以每次-0.01，正好是每秒-1
            self.playTime = self.playTime - 0.01;
            //如果游戏时间小于等于10s，e_playB添加红色警示
            if(self.playTime <= 10){
                redNum = redNum > 20 ? 0 : redNum + 1;
                if(redNum == 20){
                    if(self.e_playB.hasClass("red")){
                        self.e_playB.removeClass("red");
                    }
                    else{
                        self.e_playB.addClass("red");
                    }
                }
            }
            //时间到0，则游戏结束
            if(self.playTime <= 0){
                self.playTime = 0;
                self.e_playB.removeClass("red");
                clearInterval(self.showTimer);
                self.timeUp();
            }
            //每10ms更新一次e_playP的width、e_playT的left和html值           
            self.e_playP.css({
                "width": self.playTime + "%"
            });
            self.e_playT.css({
                "left": self.playTime + "%"
            }).html(Math.ceil(self.playTime));           
        },10);
    },
    //元素匹配操作
    bePairs:function(i, j){
        
        var self = this,
            //是否可以连接
            result = this.check(i, j);
        //如果返回false，说明不能连接，则将第二次点击的元素位置记录到this.nextCell中
        if(result == false){           
            this.nextCell = [i,j];
            this.cellArr[this.nextCell[0]][this.nextCell[1]].addClass("active");            
            return;
        }
        //如果返回字符串（x或y），说明可以直线连接
        else if( typeof(result) == "string"){
            this.showLine(i, j, this.nextCell[0], this.nextCell[1]);
        }
        //如果返回数组，且length=1，即一个拐点
        else if(result.length == 1){
            this.showLine(result[0][0], result[0][1], this.nextCell[0], this.nextCell[1]);
            this.showLine(result[0][0], result[0][1], i, j);
        }
        //如果返回数组，且length=2，即两个拐点
        else if(result.length == 2){           
            this.showLine(result[0][0], result[0][1], i, j);
            this.showLine(result[0][0], result[0][1], result[1][0], result[1][1]);
            this.showLine(result[1][0], result[1][1], this.nextCell[0], this.nextCell[1]);
        };
        //self.hideLine();
        //隐藏连接的div元素和图片
        this.hideImg(this.cellArr[i][j], this.imgSrc[this.seeArr[i][j]]);
        this.hideImg(this.cellArr[this.nextCell[0]][this.nextCell[1]], this.imgSrc[this.seeArr[this.nextCell[0]][this.nextCell[1]]]);
        
        this.seeArr[this.nextCell[0]][this.nextCell[1]] = this.seeArr[i][j] = -1;
        //得分
        this.getScore();
        
        //console.log(this.seeArr.join(",").replace(/,|-1/g, ""))
        if(this.seeArr.join(",").replace(/,|-1/g, "") == ""){ 
            //本关成功结束
            this.successed()
        }   
    },
    check:function(i, j){
        var self = this,
            maxFirst,
            findBlank,
            checkNoCross,
            inArray,
            _cross = 3,
            _s = [[self.nextCell[0],self.nextCell[1]]],
            _t = [];      
        //第一个最大，即如果a<b，则a与b交换
        maxFirst = function(a, b){
            if(a < b){
                a = a + b;
                b = a - b;
                a = a - b;
            }
        };
        //查找无图片的div元素位置
        findBlank = function(y, x){
            //a中存放当前元素四周（x、y方向）无图片的div元素位置
            var a = [],
                _x = __x = x,
                _y = __y = y;
            while(--_x >= 0){
                if(self.seeArr[y][_x] < 0){
                    a.push([y,_x])
                }
                else{
                    _x = -10;
                    break;
                }
            }
            while(++__x < self.cellCol){
                if(self.seeArr[y][__x] < 0){
                    a.push([y,__x])
                }
                else{
                    break;
                }
            }
            while(--_y >= 0){
                if(self.seeArr[_y][x] < 0){
                    a.push([_y,x])
                }
                else{
                    break;
                }
            }
            while(++__y < self.cellRow){
                if(self.seeArr[__y][x] < 0){
                    a.push([__y,x])
                }
                else{
                    break;
                }
            }
            return a;
        };
        //直线连接的情况（无拐点）
        checkNoCross = function(y1, x1, y2, x2){
            //alert("")
            //当同一列时
            if(x1 == x2){
                //如果y2小于y1，则y2与y1交换
                if(y2 < y1){
                    y2 = y2 + y1;
                    y1 = y2 - y1;
                    y2 = y2 - y1;
                }
                //alert("y2: " + y2 + " y1 :" + y1)
                //如果相邻，则返回true
                if(y2 == y1 + 1) return true;
                //如果不相邻，则沿y查找
                for(var i = y1+1; i<y2; i++ ){
                    //如果有图片阻挡，则无法连接，返回false
                    if(self.seeArr[i][x1] > -1){
                        return false;
                    }
                    else if(i == y2 - 1){
                        return true;
                    }
                }
                
            }
            //当同一行时
            else if(y1 == y2){
                //交换成x2大于x1
                 if(x2 < x1){
                    x2 = x2 + x1;
                    x1 = x2 - x1;
                    x2 = x2 - x1;
                }
                if(x2 == x1 + 1) return true;
                for(var i = x1+1; i<x2; i++ ){
                    if(self.seeArr[y1][i] > -1){
                        return false;
                    }
                    else if(i == x2 - 1){
                        return true;
                    }
                }
            }
        };
        //调用checkNoCross来判断同一行还是同一列（返回字符串x，y）
        if(checkNoCross(i, j, this.nextCell[0], this.nextCell[1])){
            //console.log("1")
            //如果同一列，则返回y
            if(i == this.nextCell[0]){
                return "y";
            }
            //如果同一行，则返回x
            else{
                return "x";
            }           
        }
        //如果不处在同一行或同一列
        else{
            var y1 = i,
                x1 = j,
                y2 = this.nextCell[0],
                x2 = this.nextCell[1];
            //一个拐点的情况（this.seeArr[y2][x1]拐点或this.seeArr[y1][x2]拐点），返回拐点坐标
            if(this.seeArr[y2][x1] < 0 && checkNoCross(y2, x1, this.nextCell[0], this.nextCell[1]) && checkNoCross(y2, x1, i, j)){
                //console.log("2")
                return [[y2,x1]];                
            }
            else if(this.seeArr[y1][x2] < 0 && checkNoCross(y1, x2, this.nextCell[0], this.nextCell[1]) && checkNoCross(y1, x2, i, j)){
                //console.log("2")
                return [[y1,x2]];               
            }
            //两个拐点的情况
            else{
                //console.log("3")
                //查找周围空白div元素位置
                var a1 = findBlank(y1, x1),
                    a2 = findBlank(y2, x2);
                for(var i = 0, ilen = a1.length; i<ilen; i++){
                    for(var j = 0, jlen = a2.length; j<jlen; j++){
                        //判断空白元素中有没可以直线连接的，如果可以则说明可以通过两个拐点连接
                        if(checkNoCross(a1[i][0], a1[i][1], a2[j][0], a2[j][1])){
                            //返回两个拐点的坐标位置数组
                            return [a1[i], a2[j]];
                        }
                    }
                }
            }
        
        }
       // console.log([i,j]);
        return false;
    },
    //显示连接线
    showLine:function(y1, x1, y2, x2){
        //return;
        var self = this;
        if(y1 == y2){
            if(x2 < x1){
                x2 = x2 + x1;
                x1 = x2 - x1;
                x2 = x2 - x1;
            }

            if(this.seeArr[y1][x1] < 0 ){
                this.cellArr[y1][x1].addClass("line")
            }
            if(this.seeArr[y1][x2] < 0 ){
                this.cellArr[y1][x2].addClass("line")
            }
            //空白处显示连线
            for(var i = x1 + 1; i<x2; i++){
                this.cellArr[y1][i].addClass("line")
            }
        }
        else if(x1 == x2){
            if(y2 < y1){
                y2 = y2 + y1;
                y1 = y2 - y1;
                y2 = y2 - y1;
            }
            if(this.seeArr[y1][x1] < 0 ){
                this.cellArr[y1][x1].addClass("line")
            }
            if(this.seeArr[y2][x2] < 0 ){
                this.cellArr[y2][x2].addClass("line")
            }
            for(var i = y1 + 1; i<y2; i++){
                this.cellArr[i][x1].addClass("line")
            }
        }                
        setTimeout(function(){
            self.hideLine();
        },10);       
    },
    timeUp:function(){
        this.playing = false;
        //停用.play_cell相关的所有事件
        $(".play_cell").off();
        alert("时间到-游戏结束！");
    },
    testShape:function(){
        var self = this;
        $(".play_cell").click(function(){
            //alert($(this).css("background"))
            if($(this).hasClass("img")){
                $(this).removeClass("img");
                $(this).css("background","");
            }
            else{
                $(this).addClass("img");
                 var _img = Math.floor(Math.random() * self.imgSrc.length);
                    $(this).css({
                        "background": "url(" + self.imgSrc[_img] + ")"
                    });
            }
        });
        this.e_resetBtn.click(function(){
            var _arr = [], _len = 0;
            $(".play_cell").each(function(){
                if($(this).hasClass("img")){
                    _arr.push(1);
                    _len ++;
                }else{
                    _arr.push(0);
                }
            })
            self.e_playCount.html(_arr.join(","));
            alert(_len)
            self.e_playScore.html(_len);
		});
    },
    //得分动画+10分       
    getScore:function(){
        var self = this;
        this.score += 10;
        var e = $("<p></p>").addClass("play_score_a").html("+10");
        this.e_playScore.append(e);
        e.animate({
            "top": "-10px",
            "opacity": 0
        },500,'swing',function(){
            e.remove();
            self.e_playScoreS.html(self.score);
        })       
    },
    //完成本关
    successed:function(){
        alert("游戏成功-进入下一关！");
        //总时间+10m
        this.showTime(this.playTime + 10);
        this.shape = this.shape >= this.shapeArr.length - 1 ? 0 : this.shape + 1;
        //alert(this.shape)
        //重新初始化加载，绑定事件
        this.init();
        this.bindCell();
    },
    //动画隐藏点击的两张图片和div元素（连接成功）
    hideImg: function(cell,src){
        var self = this,
            img = $("<img />").attr("background", src);//创建一个img标签，并可以设置相关的属性
        
        cell.append(img).removeClass("hover active img").off();
        //div元素消失
        setTimeout(function(){
            cell.css({
                "background": "",
                "zIndex": "199"
            });
        },10)
        //图片移除动画
        img.animate({
            "height": "120%",
            "width": "120%",
            "opacity": "0",
            "left": "10px",
            "top": "-25px",
            "borderColor": "rgba(255,255,255,0)"
        }, 400, 'swing', function(){
            img.remove();
            img = null;
            //self.hideLine();
        })
    },   
    hideLine:function(){
        $(".play_cell.line").animate({
            "opacity": "0.4"
        }, 300, 'swing', function(){                  
            $(".play_cell.line").removeClass("line");
            });
    }
    // hideLine:function(){
    //     $(".play_cell.line").animate({
    //         "opacity": "0.4"
    //     }, 100, 'swing', function(){
    //         $(".play_cell.line").animate({
    //             "opacity": "0.1"
    //         }, 100, 'swing', function(){               
    //             $(".play_cell.line").removeClass("line");
    //         });
    //     });
    // }
    
	
}