window.onload = function() {
	var content = document.getElementById('content');
	var firstDiv = document.getElementById('first');
	var endDiv = document.getElementById('end');
	var scoreP = document.getElementById('p1');

	var gameContent = document.getElementById('gamecontent');
	var leftDiv = document.getElementById('leftdiv');
	var middleDiv = document.getElementById('middlediv');
	var rightDiv = document.getElementById('rightdiv');
	var man = document.getElementById('man');
	var stick = document.getElementById('stick');

	//点击start按钮开始游戏
	var start = firstDiv.querySelector('.start');
	start.onclick = function() {
		firstDiv.style.display = 'none';
		gameContent.style.display = 'block';
		
		au.src = "audio/Brand X Music - Dogs of War.mp3";
	}
	
	//点击重来按钮
	var again = endDiv.getElementsByTagName('button')[0];
	again.onclick = function(){
		endDiv.style.display = 'none';
		firstDiv.style.display = 'block';
		
			//初始化
		man.style.left = 0;
		man.style.bottom = '200px';
		man.style.transition = 'none';
		stick.style.width = 0;
		stick.style.bottom = '200px';
		stick.style.transform = 'rotate(-90deg)';
		stick.style.transition = 'none';
		leftDiv.style.width = '80px';
		
		scoreNum = 0;
	}

	//音乐切换
	var au = document.getElementById('audio');
	var mp3 = document.getElementById('mp3');
	var auoff = true;
	mp3.onclick = function(ev){
		if(auoff){
			au.pause()
			mp3.src = "img/audio.png";
			auoff = false;
		}else{
			au.play();
			mp3.src = "img/audiooff.png";
			auoff = true;
		}
		
		var ev = ev || event;
		ev.cancelBubble = true;
	}
	
	
	//游戏开始
	/*1.小人自动走到方块边
	 2.长按出现棍子         3.判断棍子的长度，继续/结束游戏      4.middle和right的宽度以及位置随机*/

	//人物移动
	var manMoveoff = true;
	start.addEventListener('click', function(ev) {
		var ev = ev || event;
		
		clearInterval(man.timer);
		
		middleDiv.style.width = randomNum(man.offsetWidth,80) + 'px';
		middleDiv.style.left = randomNum(leftDiv.offsetWidth + 10, content.offsetWidth - middleDiv.offsetWidth) + 'px';
		
		man.timer = setInterval(function() {
			var speed = man.offsetLeft + 1;
			man.style.left = speed + 'px'
			
			if(speed == leftDiv.offsetWidth - man.offsetWidth) {
				clearInterval(man.timer);
				manMoveoff = false;
				mouseOff = false;
				
			}
		}, 20)
		
		ev.stopPropagation();
	})
	
	

	//鼠标持续按下时棍子的增长
	document.onmousedown = function() {
		if(manMoveoff || mouseOff) {
			return;
		}

		stick.style.left = man.offsetLeft + man.offsetWidth + 'px';

		stick.timer = setInterval(function() {
			var dir = stick.offsetWidth + 2;
			
			stick.style.width = dir + 'px';
			
			console.log(1)
		}, 20)
	}
	
	document.onmouseup = function() {
		if(manMoveoff || mouseOff) {
			return;
		}

		clearInterval(stick.timer);

		// 棍子动画
		stick.style.transform = 'rotate(0deg)';
		stick.style.transition = '1s';
		
		//右侧div块的随机位置以及随机宽度
		rightDiv.style.width = rightRandom()[0] + 'px';
		rightDiv.style.left = rightRandom()[1] + 'px';		

		mouseOff = true;

	}
	
	//获取分数p
	var score = document.getElementById('p1');
	var scoreNum = 0;
	
	//获取结束页面的计分处
	var endScore = endDiv.getElementsByTagName('span')[0];
	
	//棍子的变化结束后人物的移动
	var mouseOff = false;
	stick.addEventListener('transitionend', manMove)

	function manMove(ev) {
		var ev = ev|| event;
		
		if(stick.offsetLeft + stick.offsetWidth > middleDiv.offsetLeft && 　stick.offsetLeft + stick.offsetWidth < middleDiv.offsetLeft + middleDiv.offsetWidth) {
			clearInterval(man.moveTimer);

			man.moveTimer = setInterval(function() {
				var dir = man.offsetLeft + 1;

				man.style.left = dir + 'px';

				if(dir == middleDiv.offsetLeft + middleDiv.offsetWidth - man.offsetWidth) {
					clearInterval(man.moveTimer);
					
					scoreNum += 1;
					score.innerHTML = scoreNum;
					
					//人物移动后背景变化
					gameContent.style.left = -middleDiv.offsetLeft + 'px';
					gameContent.style.transition = '1s';

					//人物移动后棍子清零
					stick.style.width = 0;
					stick.style.transform = 'rotate(-90deg)';
					stick.style.transition = 'none';
				}
			}, 10)
		} else {
			var timer = null;
			
			clearInterval(timer)
			timer = setInterval(function() {
				var dis = man.offsetLeft + 1;

					man.style.left = dis + 'px';

				if(dis > stick.offsetLeft + stick.offsetWidth) {
					clearInterval(timer);
					clearInterval(man.endTimer);
					
					man.endTimer = setInterval(function(){
						var manBottom = parseInt(getStyle(man , 'bottom')) - 1;
						
						man.style.bottom = manBottom + 'px';
						
						var stickBottm = parseFloat(getStyle(stick,'bottom')) - 1;
						
						console.log(getStyle(stick,'bottom'))
						
						stick.style.bottom = stickBottm + 'px';
						stick.style.transition = 'none';
						stick.style.transform = 'rotate(60deg)';
						
						if(stickBottm < -stick.offsetWidth && manBottom < -man.offsetHeight) {
							clearInterval(man.endTimer);
						}
						
					},10)
				}
			},10)
			
			setTimeout(function(){
				endDiv.style.display = 'block';
				endScore.innerHTML = scoreNum;
				gameContent.style.display = 'none';
			},2900)
		}
		

		ev.stopPropagation();
	}
	
	//人物移动后的背景移动
	gameContent.addEventListener('transitionend', gameContentMove)
	
	function gameContentMove(){
		gameContent.style.left = 0;
		gameContent.style.transition = 'none';
		
		//画面移动后div块的变化
		leftDiv.style.width = middleDiv.offsetWidth + 'px';
		middleDiv.style.width = rightDiv.offsetWidth + 'px';
		middleDiv.style.left = rightDiv.offsetLeft - middleDiv.offsetLeft + 'px';
		
		//人物位置的变化
		man.style.left = leftDiv.offsetWidth - man.offsetWidth + 'px';
		
		mouseOff = false;
	}
	
	//右侧div的左边距以及宽度随机
	function rightRandom(){
		var iwidth = randomNum(man.offsetWidth,80);
		var ileft = randomNum(content.offsetWidth, middleDiv.offsetLeft + content.offsetWidth - iwidth);
		return [iwidth,ileft];
	}
	
	function randomNum(start,end){
		return parseInt(Math.random()*(end-start) + start)
	}
	
	//封装属性函数
	function getStyle(obj,attr){
		return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
	}
}