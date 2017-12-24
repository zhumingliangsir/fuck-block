var codeGame={
	LINE:5,//行数
	COL:10,//列数
	WIDTH:75,//砖块宽
	HEIGHT:30,//砖块高度
	MARGINLEFT:13.5,//砖块间外边距
	MARGINTOP:15,//砖块间外边距
	left:0,//砖块left值
	top:0,//砖块top值
	rcLeft:0,//球拍的left值
	blLeft:1,//球的left值
	blBottom:1,//球的bottom值
	s:null,//保存空格状态
	$racket:null,//保存球拍
	racketwidth:0,//保存球拍的宽
	$ball:null,//保存球
	ballwidth:0,//保存球的直径
	l:null,//控制小球水平方向
	b:null,//控制小球垂直方向
	count:null,//打落砖块的数量
	score:null,//打落砖块分数
	level:null,
	code:null,//数组，用于保存砖块
	$GAMEBOX:$("#gamebox"),//保存容器
	boxwidth:0,//保存容器宽
	boxheight:0,//保存容器高
	BGCOLOR:[],//用于保存砖块颜色的数组
	status:0,//保存状态
	GAMEOVER:0,
	RUNNING:1,
	PAUSE:2,
	hash:[],//保存砖块状态，为后续颜色改变做准备
	start:function(){//初始化
		this.l=1;this.b=1;this.score=0;this.count=0;this.level=1,this.s=0;
		this.status=this.RUNNING;
		//创建LINE行COL列的二维数组，用于保存砖块
		this.code=[
			new Array(10),	
			new Array(10),
			new Array(10),
			new Array(10),
			new Array(10)
		];
		//为每块砖添加状态，为后续颜色改变做准备
		for(var r=0;r<this.code.length;r++){
			for(var c=0,cl=0;c<this.code[r].length;c++){
				this.hash["0"+c]=4;
				this.hash["1"+c]=3;
				this.hash["2"+c]=2;
				this.hash["3"+c]=1;
				this.hash["4"+c]=0;
			}
		};
		//为BGCOLOR数组添加颜色值
			this.BGCOLOR=["#FF0000","#FF4000","#FF8000","#FFB000","#FFFF00"];
		//遍历数组中每个元素，动态生成砖块div，并设置砖块的颜色，top，left值，并更新dom树
		var $frag=$(document.createDocumentFragment());
		this.top=this.MARGINTOP;
		for(var r=0;r<this.code.length;r++){
			this.left=this.MARGINLEFT;
			for(var c=0;c<this.code[r].length;c++){
				this.code[r][c]=$("<div></div>").addClass("code");
				//console.log(this.code[r][c]);
				this.code[r][c].css({left:this.left,top:this.top,background:this.BGCOLOR[this.code.length-1-r]});
				$frag.append(this.code[r][c]);
				this.left+=this.WIDTH+this.MARGINLEFT;
			}
			this.top+=this.HEIGHT+this.MARGINTOP;
		};
		this.$GAMEBOX.append($frag);
		//动态生成击落砖块数
		$("span.count").html(this.count);
		//动态生成分数
		$("span.score").html(this.score);
		//动态生成level
		$("span.level").html(this.level);
		//获取容器的宽和高
		this.boxwidth=parseFloat(this.$GAMEBOX.css("width"));
		this.boxheight=parseFloat(this.$GAMEBOX.css("height"));
		//动态生成球拍recket
		this.$racket=$("<div></div>").addClass("racket");//保存球拍
		this.$GAMEBOX.append(this.$racket);
		this.racketwidth=parseFloat(this.$racket.css("width"));//保存球拍的宽
		this.racketheight=parseFloat(this.$racket.css("height"));//保存球拍的高
		this.rcLeft=this.boxwidth/2-this.racketwidth/2;
		this.$racket.css({left:this.rcLeft,bottom:0});
		//动态生成球
		this.$ball=$("<div></div>").addClass("ball");//保存球
		this.$GAMEBOX.append(this.$ball);
		this.ballwidth=parseFloat(this.$ball.css("width"));//保存球的半径
		this.blLeft=this.boxwidth/2-this.ballwidth/2;
		this.blBottom=parseFloat(this.$racket.css("height"));
		this.$ball.css({left:this.blLeft,bottom:this.blBottom});
		//键盘事件
			document.onkeydown=function(e){
                var isie=(document.all)?true:false;
                var key;
                if(isie){
                    key=window.event.keyCode;
                }else{
                    key=e.keyCode;
                }
				switch(key){
					case 37:
						if(this.status==this.RUNNING)
							this.moveLeft();break;//左移
					case 39:
						if(this.status==this.RUNNING)
							this.moveRight();break;//右移
					case 32:
						if(this.status==this.RUNNING)
							this.shoot();break;//发球//空格启动游戏
					case 83:
						if(this.status==this.GAMEOVER||this.status==this.PAUSE)
						reStart();break;
					case 80:
						this.stop();break;
					case 67:
						if(this.status==this.PAUSE)
						this.myContinue();
				}
			}.bind(this);
			
		//this.isGameOver();
		
	},
	moveLeft:function(){//球拍左移
		if(this.rcLeft>=70){
			this.rcLeft-=70;
			if(!this.s)
				this.blLeft-=70;
		}else if(this.rcLeft<70&&this.rcLeft>=0){
			this.rcLeft=0;
			if(!this.s)
				this.blLeft=this.racketwidth/2-this.ballwidth/2;
		};
		this.$racket.css({left:this.rcLeft});
		this.$ball.css({left:this.blLeft});
	},
	moveRight:function(){//球拍右移
		if(this.rcLeft<=this.boxwidth-50-this.racketwidth){
			this.rcLeft+=50;
			if(!this.s)
				this.blLeft+=50;
		}else if(this.rcLeft>this.boxwidth-50-this.racketwidth&&this.rcLeft<=this.boxwidth-this.racketwidth){
			this.rcLeft=this.boxwidth-this.racketwidth;
			if(!this.s)
				this.blLeft=this.rcLeft+this.racketwidth/2-this.ballwidth/2;
		};
		this.$racket.css({left:this.rcLeft});
		this.$ball.css({left:this.blLeft});
	},
	running:function(){//撞击
		this.s=1;
		//this.x=1*Math.cos((2*Math.PI/360)*30)*this.l;
		//this.y=1*Math.sin((2*Math.PI/360)*30)*this.b;
		this.blLeft+=1*this.l;
		this.blBottom+=1*this.b;
		this.$ball.css({left:this.blLeft,bottom:this.blBottom});
		//撞左右墙反弹
		if(this.blLeft>=this.boxwidth-this.ballwidth||this.blLeft<=0)
			this.l*=-1;
		//球拍接球反弹和撞上墙反弹
		if(this.racketdown()||this.blBottom>=this.boxheight-this.ballwidth)
			this.b*=-1;
		//球碰到砖块反弹
		if(this.codeDown()){
			if(this.blLeft>=this.arr[0]-this.ballwidth&&this.blLeft<=this.arr[0]-this.ballwidth+1||this.blLeft>=this.arr[0]+this.WIDTH-1&&this.blLeft<=this.arr[0]+this.WIDTH){
				this.l*=-1;}
			else this.b*=-1;
		}
		//游戏结束	
		if(this.blBottom<=0){	
			clearInterval(this.timer);
			this.status=this.GAMEOVER;
			$("#gameover").css("display","block");
		}
	},
	racketdown:function(){//判断球拍与球是否撞击，如接住球，则返回true
		if((this.blBottom==this.racketheight)&&(this.blLeft>=this.rcLeft-this.ballwidth)&&(this.blLeft<=this.rcLeft+this.racketwidth)){
			return true;
		};
	},
	shoot:function(){//发球
		if(this.blBottom>0){
			clearInterval(this.timer);
			this.timer=null;
			this.timer=setInterval(this.running.bind(this),7);
		}
	},
	codeDown:function(){//球与砖块撞击事件//  bug: 球会与球拍发生重叠！！！
		//遍历每块砖
		//var a=0;
		//var $frag=$(document.createDocumentFragment());
		
		for(var r=0;r<this.code.length;r++){
			for(var c=0,cl=0;c<this.code[r].length;c++){			
				
				cl=parseFloat($(this.code[r][c]).css("left"));//砖块left值
				ct=parseFloat($(this.code[r][c]).css("top"));
				//if球在砖块范围内，则移除当前砖块，且球反弹
				if(this.blLeft>=cl-this.ballwidth
					&&this.blLeft<=cl+this.WIDTH
					&&this.blBottom>=this.boxheight-ct-this.HEIGHT-this.ballwidth
					&&this.blBottom<=this.boxheight-ct+this.ballwidth){
						//console.log(r,c,String(r)+c);
						this.arr=[cl,ct];
						if(this.hash[String(r)+c]==4){
							$(this.code[r][c]).css("background",this.BGCOLOR[3]);
							this.hash[String(r)+c]=3;
							this.score+=10;
							$("span.score").html(this.score);
						}else if(this.hash[String(r)+c]==3){
							$(this.code[r][c]).css("background",this.BGCOLOR[2]);
							this.hash[String(r)+c]=2;
							this.score+=10;
							$("span.score").html(this.score);
						}else if(this.hash[String(r)+c]==2){
							$(this.code[r][c]).css("background",this.BGCOLOR[1]);
							this.hash[String(r)+c]=1;
							this.score+=10;
							$("span.score").html(this.score);
						}else if(this.hash[String(r)+c]==1){
							$(this.code[r][c]).css("background",this.BGCOLOR[0]);
							this.hash[String(r)+c]=0;
							this.score+=10;
							$("span.score").html(this.score);
						}else if(this.hash[String(r)+c]==0){
							this.count+=1;
							$("span.count").html(this.count);
							this.score+=10;
							$("span.score").html(this.score);
							$(this.code[r][c]).remove();
							this.code[r][c]=null;
							//console.log(this.code[r][c]);
						}
					return 1;
				}
			}
		}
	},
	stop:function(){
		this.status=this.PAUSE;
		clearInterval(this.timer);
		$("#gamePause").css("display","block");
	},
	myContinue:function(){
		this.status=this.RUNNING;
		$("#gamePause").css("display","none");
		this.timer=setInterval(this.running.bind(this),7);
	}
	/*level实现思路。。。如果score=200则level+1，timer速度加1  如果score=600则level+1，timer速度加1   如果score=1200则level+1，timer速度加1*/
}
codeGame.start();
var reStart=function(){
	$("#gameover").css("display","none");
	$("#gamePause").css("display","none");
	$("#gamebox").html("");
	codeGame.start();
}
$("#gameover a").click(function(e){
	e.preventDefault();
	reStart();
});