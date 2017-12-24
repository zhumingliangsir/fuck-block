var codeGame={
	LINE:5,//����
	COL:10,//����
	WIDTH:75,//ש���
	HEIGHT:30,//ש��߶�
	MARGINLEFT:13.5,//ש�����߾�
	MARGINTOP:15,//ש�����߾�
	left:0,//ש��leftֵ
	top:0,//ש��topֵ
	rcLeft:0,//���ĵ�leftֵ
	blLeft:1,//���leftֵ
	blBottom:1,//���bottomֵ
	s:null,//����ո�״̬
	$racket:null,//��������
	racketwidth:0,//�������ĵĿ�
	$ball:null,//������
	ballwidth:0,//�������ֱ��
	l:null,//����С��ˮƽ����
	b:null,//����С��ֱ����
	count:null,//����ש�������
	score:null,//����ש�����
	level:null,
	code:null,//���飬���ڱ���ש��
	$GAMEBOX:$("#gamebox"),//��������
	boxwidth:0,//����������
	boxheight:0,//����������
	BGCOLOR:[],//���ڱ���ש����ɫ������
	status:0,//����״̬
	GAMEOVER:0,
	RUNNING:1,
	PAUSE:2,
	hash:[],//����ש��״̬��Ϊ������ɫ�ı���׼��
	start:function(){//��ʼ��
		this.l=1;this.b=1;this.score=0;this.count=0;this.level=1,this.s=0;
		this.status=this.RUNNING;
		//����LINE��COL�еĶ�ά���飬���ڱ���ש��
		this.code=[
			new Array(10),	
			new Array(10),
			new Array(10),
			new Array(10),
			new Array(10)
		];
		//Ϊÿ��ש���״̬��Ϊ������ɫ�ı���׼��
		for(var r=0;r<this.code.length;r++){
			for(var c=0,cl=0;c<this.code[r].length;c++){
				this.hash["0"+c]=4;
				this.hash["1"+c]=3;
				this.hash["2"+c]=2;
				this.hash["3"+c]=1;
				this.hash["4"+c]=0;
			}
		};
		//ΪBGCOLOR���������ɫֵ
			this.BGCOLOR=["#FF0000","#FF4000","#FF8000","#FFB000","#FFFF00"];
		//����������ÿ��Ԫ�أ���̬����ש��div��������ש�����ɫ��top��leftֵ��������dom��
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
		//��̬���ɻ���ש����
		$("span.count").html(this.count);
		//��̬���ɷ���
		$("span.score").html(this.score);
		//��̬����level
		$("span.level").html(this.level);
		//��ȡ�����Ŀ�͸�
		this.boxwidth=parseFloat(this.$GAMEBOX.css("width"));
		this.boxheight=parseFloat(this.$GAMEBOX.css("height"));
		//��̬��������recket
		this.$racket=$("<div></div>").addClass("racket");//��������
		this.$GAMEBOX.append(this.$racket);
		this.racketwidth=parseFloat(this.$racket.css("width"));//�������ĵĿ�
		this.racketheight=parseFloat(this.$racket.css("height"));//�������ĵĸ�
		this.rcLeft=this.boxwidth/2-this.racketwidth/2;
		this.$racket.css({left:this.rcLeft,bottom:0});
		//��̬������
		this.$ball=$("<div></div>").addClass("ball");//������
		this.$GAMEBOX.append(this.$ball);
		this.ballwidth=parseFloat(this.$ball.css("width"));//������İ뾶
		this.blLeft=this.boxwidth/2-this.ballwidth/2;
		this.blBottom=parseFloat(this.$racket.css("height"));
		this.$ball.css({left:this.blLeft,bottom:this.blBottom});
		//�����¼�
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
							this.moveLeft();break;//����
					case 39:
						if(this.status==this.RUNNING)
							this.moveRight();break;//����
					case 32:
						if(this.status==this.RUNNING)
							this.shoot();break;//����//�ո�������Ϸ
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
	moveLeft:function(){//��������
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
	moveRight:function(){//��������
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
	running:function(){//ײ��
		this.s=1;
		//this.x=1*Math.cos((2*Math.PI/360)*30)*this.l;
		//this.y=1*Math.sin((2*Math.PI/360)*30)*this.b;
		this.blLeft+=1*this.l;
		this.blBottom+=1*this.b;
		this.$ball.css({left:this.blLeft,bottom:this.blBottom});
		//ײ����ǽ����
		if(this.blLeft>=this.boxwidth-this.ballwidth||this.blLeft<=0)
			this.l*=-1;
		//���Ľ��򷴵���ײ��ǽ����
		if(this.racketdown()||this.blBottom>=this.boxheight-this.ballwidth)
			this.b*=-1;
		//������ש�鷴��
		if(this.codeDown()){
			if(this.blLeft>=this.arr[0]-this.ballwidth&&this.blLeft<=this.arr[0]-this.ballwidth+1||this.blLeft>=this.arr[0]+this.WIDTH-1&&this.blLeft<=this.arr[0]+this.WIDTH){
				this.l*=-1;}
			else this.b*=-1;
		}
		//��Ϸ����	
		if(this.blBottom<=0){	
			clearInterval(this.timer);
			this.status=this.GAMEOVER;
			$("#gameover").css("display","block");
		}
	},
	racketdown:function(){//�ж����������Ƿ�ײ�������ס���򷵻�true
		if((this.blBottom==this.racketheight)&&(this.blLeft>=this.rcLeft-this.ballwidth)&&(this.blLeft<=this.rcLeft+this.racketwidth)){
			return true;
		};
	},
	shoot:function(){//����
		if(this.blBottom>0){
			clearInterval(this.timer);
			this.timer=null;
			this.timer=setInterval(this.running.bind(this),7);
		}
	},
	codeDown:function(){//����ש��ײ���¼�//  bug: ��������ķ����ص�������
		//����ÿ��ש
		//var a=0;
		//var $frag=$(document.createDocumentFragment());
		
		for(var r=0;r<this.code.length;r++){
			for(var c=0,cl=0;c<this.code[r].length;c++){			
				
				cl=parseFloat($(this.code[r][c]).css("left"));//ש��leftֵ
				ct=parseFloat($(this.code[r][c]).css("top"));
				//if����ש�鷶Χ�ڣ����Ƴ���ǰש�飬���򷴵�
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
	/*levelʵ��˼·���������score=200��level+1��timer�ٶȼ�1  ���score=600��level+1��timer�ٶȼ�1   ���score=1200��level+1��timer�ٶȼ�1*/
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