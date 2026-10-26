var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");

canvas.width=256;
canvas.height=256+128;
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

var gameState = GameState.SELECT;
var codeState = CodeState.EDIT;

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
	var chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789[].:'";
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

function drawLevel(ctx,lvl,spr,x,y,s) {
	var hex="0123456789ABCDEF";
	for(var j=0;j<lvl.h;j++) {
		for(var i=0;i<lvl.w;i++) {
			var k=lvl.d[j][i];
			var c=hex.indexOf(k);
			if(c!=-1) {
		        var color=c & 3;
		        var star=c & 4;
				drawCanvas(ctx,spr,x+i*16,y+j*16,1,color);
				if(star)drawCanvas(ctx,spr,x+i*16,y+j*16,1,4);
			}
		}
	}
	drawCanvas(ctx,spr,lvl.x*16,lvl.y*16,1,5+lvl.f);
	drawGrid(ctx,16,16,x,y,16,palette[1]);
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

	for(var i=0;i<code.w;i++) {
		drawCanvas(ctx,spr,x+i*16+16,y,s,26);
		drawCanvas(ctx,spr,x+i*16+16,y,s,13+i);
	}

	for(var i=0;i<code.h;i++) {
		drawCanvas(ctx,spr,x,y+i*16+16,s,26);
		drawCanvas(ctx,spr,x,y+i*16+16,s,13+i);
	}

	for(var j=0;j<code.h;j++) {
		for(var i=0;i<code.w;i++) {
			drawCanvas(ctx,spr,x+i*16+16,y+j*16+16,s,code.d[j][i]);
		}
	}

	drawGrid(ctx,code.w+1,code.h+1,x,y,16,palette[1]);
}

function drawCodeTile(ctx,code,spr) {
	drawCanvas(ctx,spr,code.x*16+16,code.y*16+16,1,0);
	drawCanvas(ctx,spr,code.x*16+16,code.y*16+16,1,code.d[code.y][code.x]);
	drawGrid(ctx,code.w+1,code.h+1,0,0,16,palette[1]);
}

function drawCodeCursor(ctx,code,spr) {
	drawCodeTile(ctx,code,spr);
	drawCanvas(ctx,spr,code.x*16+16,code.y*16+16,1,31);
}

function eraseCodeCursor(ctx,code,spr) {
	drawCanvas(ctx,spr,code.x*16+16,code.y*16+16,1,32);
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

var pointer={
	x:0,
	y:0,
	isDown:false
};

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

		switch(gameState) {
			case GameState.SELECT:

				if(inrect(pointer.x,pointer.y, 32,256,32,32)) {
					console.log("up");
					handleDirection("ArrowUp");
				}

				if(inrect(pointer.x,pointer.y, 64,288,32,32)) {
					console.log("right");
					handleDirection("ArrowRight");
				}

				if(inrect(pointer.x,pointer.y, 32,320,32,32)) {
					console.log("down");
					handleDirection("ArrowDown");
				}

				if(inrect(pointer.x,pointer.y,  0,288,32,32)) {
					console.log("left");
					handleDirection("ArrowLeft");
				}

				if(inrect(pointer.x,pointer.y,160,288,32,32)) {
					console.log("X");
					handleDirection("Z");
				}

				if(inrect(pointer.x,pointer.y,224,288,32,32)) {
					console.log("O");
					handleDirection("X");
				}


			break;
			case GameState.CODE: break;
			case GameState.PLAY: break;
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

function handleDirection(key) {
	switch(gameState) {
		case GameState.SELECT:
		    switch (key) {
		        case 'ArrowLeft':
		        	console.log("ArrowLeft");
		        	if(currentLevel>0) {
		        		currentLevel--;
		        		level={...levels[currentLevel]};
		        		clrscr(ctx);
						drawLevel(ctx,level,sprites,0,0,1);
		        		drawPad(ctx,pad);
		        	}
					break;
		        case 'ArrowRight':
		        	console.log("ArrowRight");
		        	if(currentLevel<levels.length-1) {
		        		currentLevel++;
		        		level={...levels[currentLevel]};
		        		clrscr(ctx);
						drawLevel(ctx,level,sprites,0,0,1);
		        		drawPad(ctx,pad);
		        	}
					break;
		        case 'ArrowDown':
		        	console.log("ArrowDown");
					break;
		        case 'ArrowUp':
		        	console.log("ArrowUp");
					break;
				case 'Z':
				case 'z':
		        	console.log("X");
		        	gameState=GameState.PLAY;
					break;
				case 'X':
				case 'x':
		        	console.log("O");
					break;
			}
			break;
		case GameState.PLAY:
			switch(key) {
		        case 'ArrowLeft':
		        	console.log("ArrowLeft");
					break;
		        case 'ArrowRight':
		        	console.log("ArrowRight");
					break;
		        case 'ArrowDown':
		        	console.log("ArrowDown");
					break;
		        case 'ArrowUp':
		        	console.log("ArrowUp");
					break;
				case 'Z':
				case 'z':
		        	console.log("X");
		        	clrscr(ctx);
		        	drawPad(ctx,pad);
		        	drawCode(ctx,code,sprites,0,0,1);
		        	drawCodeCursor(ctx,code,sprites);
		        	drawCommandMenu(ctx,commandMenu,sprites,0,14*16);
		        	gameState=GameState.CODE;
					break;
				case 'X':
				case 'x':
		        	console.log("O");
					break;
				default: break;
			}
			break;
		case GameState.CODE:

			switch(codeState) {
				case CodeState.EDIT:
					switch(key) {
				        case 'ArrowLeft':
				        	console.log("ArrowLeft");
							eraseCodeCursor(ctx,code,sprites);
				        	if(code.x>0) code.x--;
				        	drawCodeCursor(ctx,code,sprites);
							break;
				        case 'ArrowRight':
				        	console.log("ArrowRight");
							eraseCodeCursor(ctx,code,sprites);
				        	if(code.x<code.w-1) code.x++;
				        	drawCodeCursor(ctx,code,sprites);
							break;
				        case 'ArrowDown':
				        	console.log("ArrowDown");
							eraseCodeCursor(ctx,code,sprites);
				        	if(code.y<code.h-1) code.y++;
				        	drawCodeCursor(ctx,code,sprites);
							break;
				        case 'ArrowUp':
				        	console.log("ArrowUp");
							eraseCodeCursor(ctx,code,sprites);
				        	if(code.y>0) code.y--;
				        	drawCodeCursor(ctx,code,sprites);
							break;
						case 'Z':
						case 'z':
				        	console.log("X");
				        	clrscr(ctx);
				        	drawPad(ctx,pad);
							drawLevel(ctx,level,sprites,0,0,1);
				        	gameState=GameState.PLAY;
							break;
						case 'X':
						case 'x':
				        	console.log("O");
				        	eraseCodeCursor(ctx,code,sprites);
				        	drawCommandMenuCursor(ctx,commandMenu,sprites);
							codeState=CodeState.MENU;
							break;
					}
					break;
				case CodeState.MENU:
					switch(key) {
				        case 'ArrowLeft':
				        	console.log("ArrowLeft");
				        	eraseCommandMenuCursor(ctx,commandMenu,sprites);
				        	if(commandMenu.x>0) commandMenu.x--;
				        	drawCommandMenuCursor(ctx,commandMenu,sprites);
							break;
				        case 'ArrowRight':
				        	console.log("ArrowRight");
				        	eraseCommandMenuCursor(ctx,commandMenu,sprites);
				        	if(commandMenu.x<commandMenu.d[commandMenu.y].length-1) commandMenu.x++;
				        	drawCommandMenuCursor(ctx,commandMenu,sprites);
							break;
				        case 'ArrowDown':
				        	console.log("ArrowDown");
				        	eraseCommandMenuCursor(ctx,commandMenu,sprites);
				        	if(commandMenu.y<commandMenu.d.length-1) commandMenu.y++;
				        	drawCommandMenuCursor(ctx,commandMenu,sprites);
							break;
				        case 'ArrowUp':
				        	console.log("ArrowUp");
				        	eraseCommandMenuCursor(ctx,commandMenu,sprites);
				        	if(commandMenu.y>0) commandMenu.y--;
				        	drawCommandMenuCursor(ctx,commandMenu,sprites);
							break;
						case 'Z':
						case 'z':
				        	console.log("X");
							break;
						case 'X':
						case 'x':
				        	console.log("O");
				        	code.d[code.y][code.x]=commandMenu.d[commandMenu.y][commandMenu.x];
				        	eraseCommandMenuCursor(ctx,commandMenu,sprites);
							drawCodeTile(ctx,code,sprites);
				        	drawCodeCursor(ctx,code,sprites);
							codeState=CodeState.EDIT;
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

//		console.log(event.key);

    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'X','x','Z','z'].includes(event.key)) {
        event.preventDefault();
        handleDirection(event.key);
    }
});

const handler = new PointerHandler(canvas);

var code = {
	w: 10,
	h: 10,
	x: 0,
	y: 0,
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

var commandMenu = {
	ox:     0,
	oy: 14*16,
	x: 0,
	y: 0,
	d: [
		[ 9,10,11,12, 1, 2, 3,23,24,25, 0],
		[13,14,15,16,16,18,19,20,21,22,33],
	],
}

var currentLevel=0;
var level={...levels[currentLevel]};
clrscr(ctx);
drawLevel(ctx,level,sprites,0,0,1);
drawPad(ctx,pad);
drawGrid(ctx);
