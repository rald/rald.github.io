class PointerHandler {
	constructor(element) {
		this.element = element;
		this.isDragging = false;

		// Bind methods to preserve 'this' context
		this.onPointerDown = this.onPointerDown.bind(this);
		this.onPointerMove = this.onPointerMove.bind(this);
		this.onPointerUp = this.onPointerUp.bind(this);

		// Attach listeners
		this.element.addEventListener('pointerdown', this.onPointerDown);
		window.addEventListener('pointermove', this.onPointerMove);
		window.addEventListener('pointerup', this.onPointerUp);
		window.addEventListener('pointercancel', this.onPointerUp);

		// Prevent default touch behaviors like scrolling/zooming on the element
		this.element.style.touchAction = 'none';
	}

	onPointerDown(event) {
		this.isDragging = true;

		// Capture pointer so we keep receiving events even if the cursor leaves the element
		this.element.setPointerCapture(event.pointerId);

		const coords = this.getCoordinates(event);

		// TODO: Add your start/down logic here (e.g., store starting position)

		pointer.x=coords.x;
		pointer.y=coords.y;
		pointer.isDown=true;

		if(inrect(pointer.x,pointer.y, 32,256,32,32)) {
			handleDirection("ArrowUp");
		}

		if(inrect(pointer.x,pointer.y, 64,288,32,32)) {
			handleDirection("ArrowRight");
		}

		if(inrect(pointer.x,pointer.y, 32,320,32,32)) {
			handleDirection("ArrowDown");
		}

		if(inrect(pointer.x,pointer.y,  0,288,32,32)) {
			handleDirection("ArrowLeft");
		}

		if(inrect(pointer.x,pointer.y,160,288,32,32)) {
			handleDirection("Z");
		}

		if(inrect(pointer.x,pointer.y,224,288,32,32)) {
			handleDirection("X");
		}

	}

	onPointerMove(event) {
		if (!this.isDragging) return;

		const coords = this.getCoordinates(event);

		// TODO: Add your move/drag logic here (e.g., update element position)
		pointer.x=coords.x;
		pointer.y=coords.y;
	}

	onPointerUp(event) {
		if (!this.isDragging) return;

		this.isDragging = false;

		try {
			this.element.releasePointerCapture(event.pointerId);
		} catch (e) {
		// Ignore if pointer capture was already lost
		}

		const coords = this.getCoordinates(event);

		// TODO: Add your end/release logic here
		pointer.x=coords.x;
		pointer.y=coords.y;
		pointer.isDown=false;
	}

	getCoordinates(event) {
		// Returns coordinates relative to the target element
		const rect = this.element.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
			clientX: event.clientX,
			clientY: event.clientY
		};
	}

	// Clean up event listeners if needed
	destroy() {
		this.element.removeEventListener('pointerdown', this.onPointerDown);
		window.removeEventListener('pointermove', this.onPointerMove);
		window.removeEventListener('pointerup', this.onPointerUp);
		window.removeEventListener('pointercancel', this.onPointerUp);
	}
}

function rnd(x) {
	return Math.floor(Math.random()*x);
}

function inrect(x,y,rx,ry,rw,rh) {
	return x>=rx && x<rx+rw && y>=ry && y<ry+rh;
}

function clrscr(ctx) {
	ctx.fillStyle = palette[0];
	ctx.fillRect(0,0,canvas.width,canvas.height);
}


function initCode() {
	var code = {
		ox: 0,
		oy: 0,
		w: 10,
		h: 10,
		x:  0,
		y:  0,
		fn: 0,
		ip: 0,
		d: [
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
		],
	};
	return code;
}

function initCommandMenu() {
	var commandMenu = {
		ox:     3,
		oy: 11*16,
		x: 0,
		y: 0,
		d: [
			[ 9,10,11,12, 1, 2, 3,23,24,25, 0],
			[13,14,15,16,17,18,19,20,21,22,33],
		],
	}
	return commandMenu;
}

function drawCanvas(ctx,cvs,x,y,s,f) {
	var hex="0123456789ABCDEF";
	for(var j=0;j<cvs.h;j++) {
		for(var i=0;i<cvs.w;i++) {
			var k=cvs.p[f][j][i];
			var c=hex.indexOf(k);
			if(c!=-1) {
				ctx.fillStyle=palette[c];
				ctx.fillRect(x+i*s,y+j*s,s,s);
			}
		}
	}
}

function drawPad(ctx,pad) {
	drawCanvas(ctx,pad, 32,256,2,0);
	drawCanvas(ctx,pad, 64,288,2,1);
	drawCanvas(ctx,pad, 32,320,2,2);
	drawCanvas(ctx,pad,  0,288,2,3);

	drawCanvas(ctx,pad,160,288,2,4);
	drawCanvas(ctx,pad,224,288,2,5);

/*
	drawCanvas(ctx,pad,192,256,2,6);
	drawCanvas(ctx,pad,192,320,2,7);
*/

	drawBorder(ctx);

	drawText(ctx,font,"ABE'S STAR WORLD",(canvas.width-16*12)/2,canvas.height-14,2);
}

function drawText(ctx,fnt,txt,x,y,s) {
	var chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789[].:'/";
	var a=x,b=y;
	for(var k=0;k<txt.length;k++) {
		var l=chars.indexOf(txt[k]);
		if(l!=-1) {
			drawCanvas(ctx,fnt,a,b,s,l);
			a+=(fnt.w+1)*s;
			if(a+(fnt.w+1)*s>=canvas.width) {
				a=0;
				b+=(fnt.h+1)*s;
			}
		}
	}
}

function loadLevel(lvl) {
	var hex="01234567";
	var level={};
	level.w=lvl.w;
	level.h=lvl.h;
	level.x=lvl.x;
	level.y=lvl.y;
	level.f=lvl.f;
	level.d=[];
	for(var j=0;j<lvl.h;j++) {
		level.d.push([]);
		for(var i=0;i<lvl.w;i++) {
			var k=lvl.d[j][i];
			var c=hex.indexOf(k);
			if(c==-1) {
				level.d[j].push(0);
			} else {
				level.d[j].push(c);
			}
		}
	}
	return level;
}


function hideLevelInfo(ctx) {
	ctx.fillStyle=palette[0];
	ctx.fillRect(1,14*16,255,16);
}

function showLevelInfo(ctx,lvl,font) {
	drawText(ctx,font,"LEVEL: "+currentLevel.toString()+" STARS: "+lvl.stars.toString(),3,14*16,2);
}

function drawLevel(ctx,lvl,spr,font) {
	lvl.stars=0;
	for(var j=0;j<lvl.h;j++) {
		for(var i=0;i<lvl.w;i++) {
			var k=lvl.d[j][i];
	        var clr=k & 3;
	        var str=k & 4;
			drawCanvas(ctx,spr,i*16,j*16,1,clr);
			if(str) {
			  drawCanvas(ctx,spr,i*16,j*16,1,4);
			  lvl.stars++;
			}
		}
	}

	drawCanvas(ctx,spr,lvl.x*16,lvl.y*16,1,lvl.f+5);
	drawGrid(ctx,lvl.w,lvl.h,0,0,16,palette[1]);
}

function drawBorder(ctx) {
	ctx.strokeStyle=palette[12];
	ctx.strokeRect(0.5,0.5,256,256);

	ctx.strokeStyle=palette[12];
	ctx.strokeRect(0,0,canvas.width,canvas.height);
	ctx.strokeRect(0,0,canvas.width,256);
}

function drawGrid(ctx,w,h,x,y,s,c) {
	for(var i=0;i<=w;i++) {
		ctx.beginPath();
		ctx.strokeStyle=c;
		ctx.moveTo(x+i*s,y);
		ctx.lineTo(x+i*s,y+h*s);
		ctx.stroke();
		ctx.closePath();
	}
	for(var i=0;i<=h;i++) {
		ctx.beginPath();
		ctx.strokeStyle=c;
		ctx.moveTo(x,y+i*s);
		ctx.lineTo(x+w*s,y+i*s);
		ctx.stroke();
		ctx.closePath();
	}
}

function drawCode(ctx,code,spr,x,y,s) {

	for(var i=0;i<code.h;i++) {
		drawCanvas(ctx,spr,x,y+i*16,s,26);
		drawCanvas(ctx,spr,x,y+i*16,s,34);
		drawCanvas(ctx,spr,x+16,y+i*16,s,26);
		drawCanvas(ctx,spr,x+16,y+i*16,s,13+i);
	}

	for(var j=0;j<code.h;j++) {
		for(var i=0;i<code.w;i++) {
			drawIns(ctx,code,spr,i,j);
		}
	}

	drawGrid(ctx,code.w+2,code.h,x,y,16,palette[1]);

}

function drawCodeTile(ctx,code,spr) {
	drawCanvas(ctx,spr,code.x*16+16+16,code.y*16,1,0);
	drawIns(ctx,code,spr,code.x,code.y);
	drawGrid(ctx,code.w+2,code.h,0,0,16,palette[1]);
}

function drawCodeCursor(ctx,code,spr) {
	drawCodeTile(ctx,code,spr);
	drawCanvas(ctx,spr,code.x*16+16+16,code.y*16,1,31);
}

function eraseCodeCursor(ctx,code,spr) {
	drawCanvas(ctx,spr,code.x*16+16+16,code.y*16,1,32);
	drawCodeTile(ctx,code,spr);
}

function drawCommandMenu(ctx,menu,spr) {
	for(var j=0;j<menu.d.length;j++) {
		for(var i=0;i<menu.d[j].length;i++) {
			drawCanvas(ctx,spr,menu.ox+i*16,menu.oy+j*16,1,menu.d[j][i]);
		}
	}
	for(var j=0;j<menu.d.length;j++) {
		drawGrid(ctx,menu.d[j].length,1,menu.ox,menu.oy+j*16,16,palette[1]);
	}
}

function drawCommandMenuTile(ctx,menu,spr) {
	drawCanvas(ctx,spr,menu.ox+menu.x*16,menu.oy+menu.y*16,1,menu.d[menu.y][menu.x]);
	for(var j=0;j<menu.d.length;j++) {
		drawGrid(ctx,menu.d[j].length,1,menu.ox,menu.oy+j*16,16,palette[1]);
	}
}

function drawCommandMenuCursor(ctx,menu,spr) {
	drawCommandMenuTile(ctx,menu,spr);
	drawCanvas(ctx,spr,menu.x*16+menu.ox,menu.y*16+menu.oy,1,31);
}

function eraseCommandMenuCursor(ctx,menu,spr) {
	drawCanvas(ctx,spr,menu.x*16+menu.ox,menu.y*16+menu.oy,1,32);
	drawCommandMenuTile(ctx,menu,spr);
}

function drawIns(ctx,code,spr,x,y) {
	var clr = code.d[y][x] & 0b11;
	var ins = (code.d[y][x]>>2) & 0b11111;

  switch(ins) {
    case 0b00000: cmd=32; break;
    case 0b00001: cmd=9; break;
    case 0b00010: cmd=10; break;
    case 0b00011: cmd=11; break;
    case 0b00100: cmd=12; break;
    case 0b00101: cmd=23; break;
    case 0b00110: cmd=24; break;
    case 0b00111: cmd=25; break;
    case 0b01000: cmd=13; break;
    case 0b01001: cmd=14; break;
    case 0b01010: cmd=15; break;
    case 0b01011: cmd=16; break;
    case 0b01100: cmd=17; break;
    case 0b01101: cmd=18; break;
    case 0b01110: cmd=19; break;
    case 0b01111: cmd=20; break;
    case 0b10000: cmd=21; break;
    case 0b10001: cmd=22; break;
  }

	drawCanvas(ctx,spr,x*16+16+16,y*16,1,0);
	drawCanvas(ctx,spr,x*16+16+16,y*16,1,clr);
	drawCanvas(ctx,spr,x*16+16+16,y*16,1,cmd);
}

function updateCode(code,menu) {
	var cmd = menu.d[menu.y][menu.x];
	var clr = code.d[code.y][code.x] & 0b11;
	var ins = (code.d[code.y][code.x]>>2) & 0b11111;

  switch(cmd) {
    case 0: clr=0b00; break;
    case 1: clr=0b01; break;
    case 2: clr=0b10; break;
    case 3: clr=0b11; break;
    case  9: ins=0b00001; break;
    case 10: ins=0b00010; break;
    case 11: ins=0b00011; break;
    case 12: ins=0b00100; break;
    case 23: ins=0b00101; break;
    case 24: ins=0b00110; break;
    case 25: ins=0b00111; break;
    case 13: ins=0b01000; break;
    case 14: ins=0b01001; break;
    case 15: ins=0b01010; break;
    case 16: ins=0b01011; break;
    case 17: ins=0b01100; break;
    case 18: ins=0b01101; break;
    case 19: ins=0b01110; break;
    case 20: ins=0b01111; break;
    case 21: ins=0b10000; break;
    case 22: ins=0b10001; break;
    case 33: ins=0b00000; clr=0b00; break;
  }

  code.d[code.y][code.x]=(ins<<2) | clr;
}

function showMenuInfo(ctx,font,menu) {
  var cmd=menu.d[menu.y][menu.x];
  switch(cmd) {
    case 0: drawText(ctx,font,"ON ANY COLOR",3,13*16,2); break;
    case 1: drawText(ctx,font,"IF ON RED",3,13*16,2); break;
    case 2: drawText(ctx,font,"IF ON GREEN",3,13*16,2); break;
    case 3: drawText(ctx,font,"IF ON BLUE",3,13*16,2); break;
    case 9: drawText(ctx,font,"FORWARD",3,13*16,2); break;
    case 10: drawText(ctx,font,"TURN RIGHT",3,13*16,2); break;
    case 11: drawText(ctx,font,"TURN LEFT",3,13*16,2); break;
    case 12: drawText(ctx,font,"RETURN",3,13*16,2); break;
    case 23: drawText(ctx,font,"PAINT RED",3,13*16,2); break;
    case 24: drawText(ctx,font,"PAINT GREEN",3,13*16,2); break;
    case 25: drawText(ctx,font,"PAINT BLUE",3,13*16,2); break;
    case 13: drawText(ctx,font,"CALL F0",3,13*16,2); break;
    case 14: drawText(ctx,font,"CALL F1",3,13*16,2); break;
    case 15: drawText(ctx,font,"CALL F2",3,13*16,2); break;
    case 16: drawText(ctx,font,"CALL F3",3,13*16,2); break;
    case 17: drawText(ctx,font,"CALL F4",3,13*16,2); break;
    case 18: drawText(ctx,font,"CALL F5",3,13*16,2); break;
    case 19: drawText(ctx,font,"CALL F6",3,13*16,2); break;
    case 20: drawText(ctx,font,"CALL F7",3,13*16,2); break;
    case 21: drawText(ctx,font,"CALL F8",3,13*16,2); break;
    case 22: drawText(ctx,font,"CALL F9",3,13*16,2); break;
    case 33: drawText(ctx,font,"ERASE",3,13*16,2); break;
  }
}

function hideMenuInfo(ctx) {
  ctx.fillStyle=palette[0];
  ctx.fillRect(1,13*16,255,16);
}

function hideHelp(ctx) {
  ctx.fillStyle=palette[0];
  ctx.fillRect(1,15*16,255,16);
}

function showHelp(ctx,font) {
  switch(gameState) {
    case GameState.SELECT:
      drawText(ctx,font,"SELECT [X] CHANGE [LEFT] [RIGHT]",3,15*16,1);
      break;
    case GameState.PLAY:
      drawText(ctx,font,"CODE [X] RUN [O]",3,15*16,1);
      break;
    case GameState.CODE:
      switch(codeState) {
        case CodeState.EDIT:
      drawText(ctx,font,"MENU [O] PLAY [X]",3,15*16,1);
      drawText(ctx,font,"MOVE ARROWS",3,15*16+8,1);
        break;
        case CodeState.MENU:
      drawText(ctx,font,"CODE [O] PLAY [X]",3,15*16,1);
      drawText(ctx,font,"MOVE ARROWS",3,15*16+8,1);
        break;
      }
      break;
  }
}

function eraseLevelTile(ctx,lvl,spr) {
	var clr = lvl.d[lvl.y][lvl.x] & 0b11;
	drawCanvas(ctx,spr,lvl.x*16,lvl.y*16,1,0);
	drawCanvas(ctx,spr,lvl.x*16,lvl.y*16,1,clr);
}

function drawLevelTile(ctx,lvl,spr) {
	var clr = lvl.d[lvl.y][lvl.x] & 0b011;
	drawCanvas(ctx,spr,lvl.x*16,lvl.y*16,1,0);
	drawCanvas(ctx,spr,lvl.x*16,lvl.y*16,1,clr);
	drawCanvas(ctx,spr,lvl.x*16,lvl.y*16,1,lvl.f+5);
}

function pickStar(ctx,lvl,font) {
	var str = (lvl.d[lvl.y][lvl.x] >> 2) & 0b1;
	if(str == 0) return;
	lvl.d[lvl.y][lvl.x] &= 0b11;
	lvl.stars--;
	hideLevelInfo(ctx,lvl,font);
	showLevelInfo(ctx,lvl,font);
}

function runCode(ctx,code,lvl,spr) {
	var cmd = code.d[code.fn][code.ip];
	var clr = cmd & 0b11;
	var ins = (cmd>>2) & 0b11111;

	var lclr = lvl.d[lvl.y][lvl.x] & 0b11;
	var lstr = (lvl.d[lvl.y][lvl.x]>>2) & 0b1;

	if(clr==0 || clr==lclr) {
		switch(ins) {
			case 0b00001:
				switch(lvl.f) {
					case 0:
						eraseLevelTile(ctx,lvl,spr);
						lvl.y--;
						pickStar(ctx,lvl,font);
						drawLevelTile(ctx,lvl,spr);
						drawGrid(ctx,lvl.w,lvl.h,0,0,16,palette[1]);
						break;
					case 1:
						eraseLevelTile(ctx,lvl,spr);
						lvl.x++;
						pickStar(ctx,lvl,font);
						drawLevelTile(ctx,lvl,spr);
						drawGrid(ctx,lvl.w,lvl.h,0,0,16,palette[1]);
						break;
					case 2:
						eraseLevelTile(ctx,lvl,spr);
						lvl.y++;
						pickStar(ctx,lvl,font);
						drawLevelTile(ctx,lvl,spr);
						drawGrid(ctx,lvl.w,lvl.h,0,0,16,palette[1]);
						break;
					case 3:
						eraseLevelTile(ctx,lvl,spr);
						lvl.x--;
						pickStar(ctx,lvl,font);
						drawLevelTile(ctx,lvl,spr);
						drawGrid(ctx,lvl.w,lvl.h,0,0,16,palette[1]);
						break;
					default: break;
				}
				break;
			case 0b00010:
				eraseLevelTile(ctx,lvl,spr);
				lvl.f++;
				if(lvl.f>3) lvl.f=0;
				drawLevelTile(ctx,lvl,spr);
				drawGrid(ctx,lvl.w,lvl.h,0,0,16,palette[1]);
				break;
			case 0b00011:
				eraseLevelTile(ctx,lvl,spr);
				lvl.f--;
				if(lvl.f<0) lvl.f=3;
				drawLevelTile(ctx,lvl,spr);
				drawGrid(ctx,lvl.w,lvl.h,0,0,16,palette[1]);
				break;
			case 0b00100:
				break;
			case 0b00101:
				console.log("paint red");
				lvl.d[lvl.y][lvl.x]=1;
				drawLevelTile(ctx,lvl,spr);
				drawGrid(ctx,lvl.w,lvl.h,0,0,16,palette[1]);
				break;
			case 0b00110:
				console.log("paint green");
				lvl.d[lvl.y][lvl.x]=2;
				drawLevelTile(ctx,lvl,spr);
				drawGrid(ctx,lvl.w,lvl.h,0,0,16,palette[1]);
				break;
			case 0b00111:
				console.log("paint blue");
				lvl.d[lvl.y][lvl.x]=3;
				drawLevelTile(ctx,lvl,spr);
				drawGrid(ctx,lvl.w,lvl.h,0,0,16,palette[1]);
				break;
			default: break;
		}
	}

	if(code.ip<9) code.ip++;

}

function handleDirection(key) {

	switch(gameState) {

		case GameState.SELECT:

		    switch (key) {
		        case 'ArrowLeft':
		        	if(currentLevel>0) {
		        		currentLevel--;
		        		level=loadLevel(levels[currentLevel]);
		        		clrscr(ctx);
						drawLevel(ctx,level,sprites);
						showLevelInfo(ctx,level,font);
						showHelp(ctx,font);
		        		drawPad(ctx,pad);
		        	}
					break;
		        case 'ArrowRight':
		        	if(currentLevel<levels.length-1) {
		        		currentLevel++;
		        		level=loadLevel(levels[currentLevel]);
		        		clrscr(ctx);
						drawLevel(ctx,level,sprites);
						showLevelInfo(ctx,level,font);
  						showHelp(ctx,font);
		        		drawPad(ctx,pad);
		        	}
					break;
		        case 'ArrowDown':
					break;
		        case 'ArrowUp':
		 			break;
				case 'Z':
				case 'z':
		        	gameState=GameState.PLAY;
				    clrscr(ctx);
					drawLevel(ctx,level,sprites);
					showLevelInfo(ctx,level,font);
					showHelp(ctx,font);
					drawPad(ctx,pad);
					break;
				case 'X':
				case 'x':
					break;
			}
			break;

		case GameState.PLAY:

			switch(key) {
		        case 'ArrowLeft':
					break;
		        case 'ArrowRight':
					break;
		        case 'ArrowDown':
					break;
		        case 'ArrowUp':
					break;
				case 'Z':
				case 'z':
		    		codeState=CodeState.EDIT;
		        	gameState=GameState.CODE;
		        	clrscr(ctx);
		        	drawCode(ctx,code,sprites,0,0,1);
		        	drawCodeCursor(ctx,code,sprites);
		        	drawCommandMenu(ctx,commandMenu,sprites,0,14*16);
		        	showHelp(ctx,font);
		        	drawPad(ctx,pad);
					break;
				case 'X':
				case 'x':
					runCode(ctx,code,level,sprites);
					break;
				default: break;
			}
			break;

		case GameState.CODE:

			switch(codeState) {
				case CodeState.EDIT:
					switch(key) {
				        case 'ArrowLeft':
							eraseCodeCursor(ctx,code,sprites);
				        	if(code.x>0) code.x--;
				        	drawCodeCursor(ctx,code,sprites);
							break;
				        case 'ArrowRight':
							eraseCodeCursor(ctx,code,sprites);
				        	if(code.x<code.w-1) code.x++;
				        	drawCodeCursor(ctx,code,sprites);
							break;
				        case 'ArrowDown':
							eraseCodeCursor(ctx,code,sprites);
				        	if(code.y<code.h-1) code.y++;
				        	drawCodeCursor(ctx,code,sprites);
							break;
				        case 'ArrowUp':
							eraseCodeCursor(ctx,code,sprites);
				        	if(code.y>0) code.y--;
				        	drawCodeCursor(ctx,code,sprites);
							break;
						case 'Z':
						case 'z':
							codeState=CodeState.EDIT;
							gameState=GameState.PLAY;
							clrscr(ctx);
				        	level=loadLevel(levels[currentLevel]);
				        	code.fn=0;
				        	code.ip=0;
							drawLevel(ctx,level,sprites);
							showLevelInfo(ctx,level,font);
							showHelp(ctx,font);
							drawPad(ctx,pad);
							break;
						case 'X':
						case 'x':
							codeState=CodeState.MENU;
					      	hideMenuInfo(ctx);
					      	hideHelp(ctx);
				        	eraseCodeCursor(ctx,code,sprites);
				        	drawCommandMenuCursor(ctx,commandMenu,sprites);
				        	showMenuInfo(ctx,font,commandMenu);
				        	showHelp(ctx,font);
							break;
					}
					break;
				case CodeState.MENU:
					switch(key) {
				        case 'ArrowLeft':
				        	hideMenuInfo(ctx);
				        	eraseCommandMenuCursor(ctx,commandMenu,sprites);
				        	if(commandMenu.x>0) commandMenu.x--;
				        	drawCommandMenuCursor(ctx,commandMenu,sprites);
				        	showMenuInfo(ctx,font,commandMenu);
							break;
				        case 'ArrowRight':
					        hideMenuInfo(ctx);
			        		eraseCommandMenuCursor(ctx,commandMenu,sprites);
				        	if(commandMenu.x<commandMenu.d[commandMenu.y].length-1) commandMenu.x++;
				        	drawCommandMenuCursor(ctx,commandMenu,sprites);
				        	showMenuInfo(ctx,font,commandMenu);												break;
				        case 'ArrowDown':
						   	hideMenuInfo(ctx);
				        	eraseCommandMenuCursor(ctx,commandMenu,sprites);
					       	if(commandMenu.y<commandMenu.d.length-1) commandMenu.y++;
					        drawCommandMenuCursor(ctx,commandMenu,sprites);
						    showMenuInfo(ctx,font,commandMenu);
					    break;
				        case 'ArrowUp':
						    hideMenuInfo(ctx);
	        				eraseCommandMenuCursor(ctx,commandMenu,sprites);
				        	if(commandMenu.y>0) commandMenu.y--;
				        	drawCommandMenuCursor(ctx,commandMenu,sprites);
				        	showMenuInfo(ctx,font,commandMenu);												break;
						case 'Z':
						case 'z':
							codeState=CodeState.EDIT;
				        	gameState=GameState.PLAY;
				        	clrscr(ctx);
				        	level=loadLevel(levels[currentLevel]);
				        	code.fn=0;
				        	code.ip=0;
							drawLevel(ctx,level,sprites);
							showLevelInfo(ctx,level,font);
							showHelp(ctx,font);
				        	drawPad(ctx,pad);
							break;
						case 'X':
						case 'x':
							codeState=CodeState.EDIT;
						  	hideMenuInfo(ctx);
						  	hideHelp(ctx);
							updateCode(code,commandMenu);
				        	eraseCommandMenuCursor(ctx,commandMenu,sprites);
							drawCodeTile(ctx,code,sprites);
							drawCodeCursor(ctx,code,sprites);
							showHelp(ctx,font);
							break;
					}
					break;
				default: break;
			}

			break;
		default: break;
	}
}

// Disables right-click context menu on the entire website
window.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

window.addEventListener('keydown', (event) => {
    // Check if the pressed key is one of the arrow keys
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'X', 'x', 'Z', 'z'].includes(event.key)) {
        event.preventDefault();
        handleDirection(event.key);
    }
});

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = 256;
canvas.height = 256+128;
canvas.style.border = "1px solid white";

// Disable smoothing inside the canvas context (for drawImage)
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false; // Safari fallback
ctx.mozImageSmoothingEnabled = false;    // Firefox fallback

const GameState = {
	SELECT: "SELECT",
	PLAY:   "PLAY",
	CODE:   "CODE",
};

const CodeState = {
	EDIT: "EDIT",
	MENU: "MENU",
}

var pointer = {
	x:0,
	y:0,
	isDown:false
};

var gameState = GameState.SELECT;
var codeState = CodeState.EDIT;

const handler = new PointerHandler(canvas);

var code = initCode();
var commandMenu = initCommandMenu();

var currentLevel=0;
var level=loadLevel(levels[currentLevel]);
clrscr(ctx);
drawLevel(ctx,level,sprites);
showLevelInfo(ctx,level,font);
showHelp(ctx,font);
drawPad(ctx,pad);
