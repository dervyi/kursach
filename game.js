import { Pipe } from './pipe.js';
import { loadImage } from './utils.js';
import { Ground } from './ground.js';
import { Bird } from './bird.js';
import { checkCollision } from './collision.js';



export class Game {
  SPEED = 3;
  DISTANCE_BETWEEN_PIPES = 3.5 * Pipe.width;
  frameCount = 0;
  score = 0;
  isGameStarted = false;
  isGameOver = false

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.menuButton = document.querySelector('.menuButton')
    this.menu = document.querySelector('.menu')
    this.toggleMenuOpen = false

    this.handleToggleMenu = ()=>{
      this.toggleMenuOpen = !this.toggleMenuOpen 
  
      this.toggleMenuOpen && this.stop()
      !this.toggleMenuOpen && this.start()
      this.toggleMenuOpen && this.menu.setAttribute('style', 'margin-left: 0')
      !this.toggleMenuOpen && this.menu.setAttribute('style', 'margin-left: -200px')
  
    }

    document.addEventListener('click', ()=>{
      this.handleToggleMenu()
    })
    document.addEventListener('keydown', (e)=>{
      if(e.key==='Escape'){
        this.handleToggleMenu()
      }
    })
    const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const width = window.visualViewport ? Math.min(window.visualViewport.width, height * 0.6) : Math.min(window.innerWidth, height * 0.6);
    this.canvas.height = 1080;
    this.canvas.width = 1920

    this.BG_IMG = new Image();
    this.pipes = [new Pipe(this.canvas)];
    this.ground = new Ground(this.canvas);
    this.bird = new Bird(this.canvas);
  }

  async loadAssets() {
    await Promise.all([
      loadImage(this.BG_IMG, './assets/bg.png'),
      Pipe.preloadImages(),
      Ground.preloadImage(),
      Bird.preloadImage()
    ]);
  }

  
  start() {
    this.initializeControls();
    this.intervalId = setInterval(() => this.draw(), 10);
  }

  
  
  stop() {
    clearInterval(this.intervalId);
    // this.canvas.addEventListener('click', ()=>{
    //   location.reload()
    // })
    // document.addEventListener('keydown', ()=>{
    //   location.reload()    
    // })
    // document.addEventListener('mousedown', ()=>{location.reload()});
    // location.reload()
    // console.log('stop')
  }


  draw() {
    this.ctx.drawImage(this.BG_IMG, 0, 0, this.canvas.width, this.canvas.height);

    if (!this.isGameStarted) {
      this.ground.update(this.SPEED);
      this.bird.draw();
      this.displayScore();
      return;
    }

    if (this.frameCount * this.SPEED > this.DISTANCE_BETWEEN_PIPES) {
      this.pipes.push(new Pipe(this.canvas));
      this.frameCount = 0;
    }

    this.updatePipes();
    this.ground.update(this.SPEED);
    this.bird.update();
    this.displayScore();

    if (checkCollision(this.bird, this.pipes, this.ground)){
      this.stop();
      this.isGameOver = true
    } 
    this.frameCount++;
  }

  updatePipes() {
    for (let i = 0; i < this.pipes.length; i++) {
      this.pipes[i].update(this.SPEED);
      if (this.pipes[i].isOffscreen()) {
        this.pipes.shift();
        i--;
        this.score++;
      }
    }
  }

  initializeControls() {
    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', this.handleFlap);
    } else {
      document.addEventListener('mousedown', this.handleFlap);
    }
    document.addEventListener('keydown', this.handleFlap);
  }

  handleFlap = (event) => {
    if (event.type === 'keydown' && event.code !== 'Space') return;
    if (!this.isGameStarted) this.isGameStarted = true;
    this.bird.flap();
  }

  displayScore() {
    this.ctx.font = '60px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';

    this.ctx.lineWidth = 8;
    this.ctx.strokeStyle = '#533846';
    this.ctx.textBaseline = 'top';
    this.ctx.strokeText(this.score, this.canvas.width / 2, 15);
    this.ctx.fillText(this.score, this.canvas.width / 2, 15);
  }
}