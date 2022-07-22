const canvas = document.querySelector('#app');
const context = canvas.getContext("2d");
const backgroundImage = document.createElement("img");
backgroundImage.src = 'images/background-game-design-vector.jpg';

const coin = document.createElement('img');
coin.src = 'images/coin.png';

const scoreImg = document.createElement('img');
scoreImg.src = 'images/board.png';

const heroImg = document.createElement("img");
heroImg.src = 'images/itachi.png';

const ninjaImg1 = document.createElement("img");
ninjaImg1.src = 'images/mu.png';

const stabAudio = document.createElement("audio");
stabAudio.src = "https://soundbible.com//mp3/Stab-SoundBible.com-766875573.mp3";

const suricen = document.createElement("img");
suricen.src = 'images/star.png';

const katon = document.createElement("img");
katon.src = 'images/katon.png';

const amaterasu = document.createElement("img");
amaterasu.src = 'images/black-fire.png';

const suricenAudio = document.createElement("audio");
suricenAudio.src = "sounds/Sword.mp3";

const katonAudio = document.createElement("audio");
katonAudio.src = "sounds/Katon.mp3";

const amaterasuAudio = document.createElement("audio");
amaterasuAudio.src = "sounds/Sharingan.mp3";
let requestId;
data = {
	score: 0,
	coints: 0,
	speedPoint: {
		speed: 1,
		point : 20
	},
	bullets: [],
	ninjas: [],
}
function random(min,max){
	return Math.floor(Math.random()*(max - min))+ min;
}
function intersect(rect1, rect2) {
    const x = Math.max(rect1.x, rect2.x),
        num1 = Math.min(rect1.x + rect1.width, rect2.x + rect2.width),
        y = Math.max(rect1.y, rect2.y),
        num2 = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);
    return (num1 >= x && num2 >= y);
};
class Character {
	constructor(x,y,width,height,img,audio){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.speed = 1;
		this.xDelta = 0;
		this.yDelta = 0;
		this.audio = audio;
		this.img = img;
		this.jumpPoint = 0;
	}
	getBoundingBox(){
		return {
			x: this.x,
			y:  this.y,
			width: this.width,
			height: this.height
		};

	}
	colition(check){
		if(check === true){
			if(this.x < 0){
  				this.x = 0;
	  		}
	  		if (this.x > canvas.width) {
	  			this.x = canvas.width;
	  		}
	  		if (this.y < 120) {
	  			this.y = 120;
	  		}
	  		if (this.y >370) {
	  			this.y = 370;
	  		}
		}
		else{
			return false;
		}
	}
	update(){
		this.x += this.xDelta;
		this.y += this.yDelta;
		this.colition(true);
	}
	render(){
		context.drawImage(this.img, this.x, this.y, this.width, this.height);
	}
	fire(px,py,width,height,img,audio){
		const x = this.x + this.width - px;
		const y = this.y + this.height / 2 - py;

		const bullet = new Bullet(x,y,width,height,img,audio);
		bullet.goRight();
		if (data.bullets.length < 3) {
			data.bullets.push(bullet);
			bullet.audio.currentTime = 0;
			bullet.audio.play();
		}
	}
	goRight(){
		return this.xDelta = this.speed;
	}

	goLeft(){
		return this.xDelta = this.speed*-1;
	}
	jump(){
		return this.yDelta = this.speed*-5;
	}
	jumpDown(){
		return this.yDelta = this.speed*5;
	}
	stop(){
		return this.xDelta = 0;
	}
}

class Bullet extends Character{
	constructor(x,y,width,height,img,audio){
		super(x,y,width,height,img);

		this.speed = 5;
		this.img = img;
		this.audio = audio;
	}
	colition(){
		super.colition();
	}
	update(){
		super.update();
		this.colition(false);
		if((this.xDelta < 0 && this.x + this.width < 0) || (this.xDelta > 0 && this.x > canvas.width)){
			this.deleteMe = true;
		}
		data.ninjas.forEach((ninja) =>{
			if (intersect(this.getBoundingBox(),ninja.getBoundingBox())) {
				ninja.die();
				stabAudio.currentTime = 0;
				stabAudio.play();
				data.score += 1;
				data.coints += 1;
				this.deleteMe = true;
			}
		});	
	}
}
class Ninja extends Character{
	constructor(x,y,width,height,img,audio){
		super(x,y,width,height,img);
		this.speed = data.speedPoint.speed;
		this.img = img;
		this.audio = audio;
	}
	colition(){
		super.colition();
	}
	update(){
		if(this.x < 0){
  			this.deleteMe = true;
	  	}
		super.update();
		this.colition(false);
		if (data.score === data.speedPoint.point) {
			data.speedPoint.speed +=0.1;
			data.speedPoint.point+= 20;
		}
	}
	die(){
		this.deleteMe  = true;
	}
}
let hero = new Character(10,370,100,120,heroImg);
function update(){
	hero.update();
	data.bullets.forEach((bullet) => bullet.update());
	data.ninjas.forEach((ninja) => ninja.update());

	data.bullets = data.bullets.filter((bullet) => bullet.deleteMe !== true);
	data.ninjas = data.ninjas.filter((ninja) => ninja.deleteMe !== true);

}
setInterval(function(){
if (data.ninjas.length < 8) {
		const ninja = new Ninja(canvas.width,random(120,370),80,120,ninjaImg1);
		ninja.goLeft();
		data.ninjas.push(ninja);
	}
},500)
function draw(){
	context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
	context.drawImage(scoreImg,5,5,250,110);
	context.font = "20px Arial";
	context.fillStyle = "#ff5704";
	context.fillText(data.score,30,100);
	context.fillText(data.coints,190,100);
	hero.render();
	data.bullets.forEach((bullet) => bullet.render());
	data.ninjas.forEach((ninja) => ninja.render());

	//Bullets count drawing
	context.drawImage(suricen,10,canvas.height-50,50,50);
	context.font = "20px Arial";
	context.fillStyle = "white";
	context.fillText('X infinity',70,canvas.height-18);
	if (data.coints >= 10) {
		let useCount = 0;
		context.drawImage(katon,180,canvas.height-50,100,50);
		context.font = "20px Arial";
		context.fillStyle = "white";
		useCount = Math.floor(data.coints/10);
		context.fillText('X'+useCount,280,canvas.height-18);
	}
	if (data.coints >= 20) {
		let useCount = 0;
		context.drawImage(amaterasu,320,canvas.height-50,80,45);
		context.font = "20px Arial";
		context.fillStyle = "white";
		useCount = Math.floor(data.coints/20);
		context.fillText('X'+useCount,410,canvas.height-18);
	}
}
function loop() {
 requestId = requestAnimationFrame(loop);
  update();
  draw();
}
loop();
document.addEventListener("keydown", function(evt) {
	if(evt.code === 'KeyD'){
		hero.goRight();
	}
	else if(evt.code === 'KeyA'){
		hero.goLeft();
	}
	else if(evt.code === 'KeyW'){
		hero.jump();
	}
	else if(evt.code === 'KeyI'){
		hero.fire(40,50,20,20,suricen,suricenAudio);
	}
	else if(evt.code === 'KeyO'){
		if (data.coints >= 10) {
			hero.fire(40,100,200,150,katon,katonAudio);
			data.coints -= 10;
		}
	}
	else if(evt.code === 'KeyP'){
		if (data.coints >= 20) {
			hero.fire(40,100,200,150,amaterasu,amaterasuAudio);
			data.coints -= 20;
		}
	}
});
document.addEventListener("keyup", function(evt) {
  hero.stop();
  if(evt.code === 'KeyW'){
		hero.jumpDown();
	}
});