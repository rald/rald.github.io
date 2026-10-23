var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");

canvas.width=256;
canvas.height=256+128;
canvas.style.border = "1px solid white";

const GameState = {
	SELECT: "SELECT",
	PLAY:   "PLAY",
	CODE:   "CODE",
};

var gameState=GameState.SELECT;

function rnd(x) {
	return Math.floor(Math.random()*x);
}

function inrect(x,y,rx,ry,rw,rh) {
	return x>=rx && x<rx+rw && y>=ry && y<ry+rh;
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

//	drawCanvas(ctx,spr,lvl.x*16,lvl.y*16,1,5+lvl.f);

	drawCanvas(ctx,spr,lvl.x*16,lvl.y*16,1,5+lvl.f);

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
			case GameState.SELECT: break;
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

function clrscr(ctx) {
	ctx.fillStyle=palette[0];
	ctx.fillRect(0,0,canvas.width,canvas.height);
}

// Disables right-click context menu on the entire website
window.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

clrscr(ctx);

ctx.strokeStyle=palette[12];
ctx.strokeRect(0,0,canvas.width,canvas.height);
ctx.strokeRect(0,0,canvas.width,256);



var level={...levels[0]};

drawLevel(ctx,level,sprites,0,0,1);



/*
for(var i=0;i<10;i++) {
	drawCanvas(ctx,sprites,i*16+16,0,1,26);
	drawCanvas(ctx,sprites,i*16+16,0,1,i+13);
	drawCanvas(ctx,sprites,0,i*16+16,1,26);
	drawCanvas(ctx,sprites,0,i*16+16,1,i+13);
}

for(var j=0;j<10;j++) {
	for(var i=0;i<10;i++) {
		drawCanvas(ctx,sprites,i*16+16,j*16+16,1,rnd(4));
		drawCanvas(ctx,sprites,i*16+16,j*16+16,1,rnd(17)+9);
	}
}

*/

drawPad(ctx,pad);

ctx.strokeStyle="#FFFFFF";
ctx.strokeRect(0.5,0.5,256,256);

drawText(ctx,font,"ABE'S STAR WORLD",(canvas.width-16*12)/2,canvas.height-14,2);
