window.onload = main;

const $ = name => document.querySelector(name);

let cvs, ctx, joystick, player, ratio, playerDead = false, scoreBoard;
const offset = new Vec2(0, 0);
let zombies = [];
let healings = [];
const buttons = [];
const projectiles = [];

const resolutions = [
    [ 640, 360 ],
    [ 854, 480 ],
    [ 960, 540 ],
    [ 1024, 576 ],
    [ 1280, 720 ],
    [ 1366, 768 ],
    [ 1600, 900 ],
    [ 1920, 1080 ]
];

const [ width, height ] = resolutions[7];

const adapt = val => width / 960 * val;
const random = (min, max) => Math.random() * (max - min) + min;

const textures = {
  player: {
    idle: [],
    run: [],
    attack: [],
    throw: [],
    dead: [],
  },
  zombie: {
    male: {
        idle: [],
        walk: [],
        attack: [],
        dead: [],
    },
    female: {
        idle: [],
        walk: [],
        attack: [],
        dead: [],
    },
  },
  background: null,
  projectile: null,
  heart: null,
};

const sounds = {
    music: null,
};

function loadAudio(filename)
{
    return new Promise(resolve => {
        const audio = new Audio(`./assets/audio/${filename}`);
    
        audio.addEventListener("canplaythrough", () => resolve(audio));
    });
}

function loadTexture(filename)
{
  return new Promise(resolve => {
    const img = new Image();
    img.src = `./assets/${filename}`;
    img.onload = () => resolve(img);
  });
}

async function loadAnimations(options)
{
  for(const option of options)
  {
    const [ name, container, count ] = option;
    for(let i = 0; i < count; ++i)
    {
        const filename = name + `${i}.png`;
        const img = await loadTexture(filename, container);
        container.push(img);
    }
  }
}

function adjustCanvas()
{
    if(innerHeight / innerWidth > 16 / 9) {
        cvs.style.width = "100vw";
        ratio = height / innerWidth;
    } else {
        cvs.style.height = "100vh";
        ratio = width / innerHeight;
    }
}

async function main()
{
    cvs = $("#c");
    cvs.width = height;
    cvs.height = width;

    adjustCanvas();

    const options = [
        ["player/Idle__00", textures.player.idle, 10],
        ["player/Run__00", textures.player.run, 10],
        ["player/Attack__00", textures.player.attack, 10],
        ["player/Throw__00", textures.player.throw, 10],
        ["player/Dead__00", textures.player.dead, 10],
        ["zombie/male/Idle", textures.zombie.male.idle, 15],
        ["zombie/male/Walk", textures.zombie.male.walk, 10],
        ["zombie/male/Attack", textures.zombie.male.attack, 8],
        ["zombie/male/Dead", textures.zombie.male.dead, 12],
        ["zombie/female/Idle", textures.zombie.female.idle, 15],
        ["zombie/female/Walk", textures.zombie.female.walk, 10],
        ["zombie/female/Attack", textures.zombie.female.attack, 8],
        ["zombie/female/Dead", textures.zombie.female.dead, 12],
    ];
      
    await loadAnimations(options);
    textures.background = await loadTexture("Background.png");
    textures.projectile = await loadTexture("player/Kunai.png");
    textures.heart = await loadTexture("heart.png");

    sounds.music = await loadAudio("suspense.mp3");
    sounds.music.loop = true;

    $(".loader").style.display = "none";
    $(".start").style.display = "block";

    ctx = cvs.getContext("2d");
    setupEvents();
    
    joystick = new Joystick(new Vec2(adapt(150), height - adapt(150)));
    buttons.push(new Button(new Vec2(width - adapt(150), height - adapt(200)), "A"));
    buttons.push(new Button(new Vec2(width - adapt(210), height - adapt(100)), "B"));
    buttons.push(new Button(new Vec2(width - adapt(90), height - adapt(100)), "C"));
    
    player = new Player(new Vec2(width / 2, height / 2 + adapt(60)));

    scoreBoard = new ScoreBoard(new Vec2(50, 50).modify(adapt));
    
    for(let i = 0; i < 4; ++i)
        zombies.push(spawnZombie());

    offset.x = -(height * textures.background.width / textures.background.height) / 2;
    
    $(".start").addEventListener("click", () => {
        cvs.style.display = "block";
        $(".start").style.display = "none";
        sounds.music.play().catch(e => {});

        requestAnimationFrame(render);
    });
}

function spawnZombie()
{
    const tex = Math.random() > 0.5 ? textures.zombie.male : textures.zombie.female;
    const x = Math.random() > 0.5 ? adapt(-50) : height * textures.background.width / textures.background.height + adapt(50);
    const pos = new Vec2(x, height / 2 + adapt(60));
    const zombie = new Zombie(pos, tex);
    return zombie;
}

function update()
{
    const dir = joystick.dir();
    
    if(!playerDead) {
        if(dir.dist() > 0) player.setAnim(textures.player.run);
        else player.setAnim(textures.player.idle);
        
        if(buttons[0].pressed)
            player.setAnim(textures.player.attack, { interruptible: false });
    
        if(buttons[1].pressed)
            if(player.ableToThrow) {
                player.setAnim(textures.player.throw, { interruptible: false, callback: () => {
                    const projectile = new Projectile(new Vec2(player.pos.x - offset.x, height / 2), player.dir, textures.projectile);
                    projectiles.push(projectile);
                    player.ableToThrow = false;
                    buttons[1].disabled = true;
        
                    setTimeout(() => {
                        player.ableToThrow = true;
                        buttons[1].disabled = false;
                    }, 1000);
                } });
            }
        
        if(buttons[2].pressed && player.ableToCharge) {
            player.charging = true;
            player.ableToCharge = false;
            buttons[2].disabled = true;
            setTimeout(() => {
                player.charging = false;
                setTimeout(() => {
                    player.ableToCharge = true;
                    buttons[2].disabled = false;
                }, 5000);
            }, 250);
        }
    
        player.setDir(dir.x);
    
        player.update();
    }


    for(const projectile of projectiles)
        projectile.update();

    for(const zombie of zombies)
        zombie.update();
}

function render(time)
{
    ctx.save();

    update();

    ctx.translate(width / 2, height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.translate(-width / 2, -height / 2);
    ctx.translate(adapt(210), adapt(210)); // 210, because its a hard-coded value, specific to the third resolution

    ctx.fillStyle = "#00ff00";
    ctx.fillRect(0, 0, width, height);
    
    {
        ctx.save();
        ctx.translate(offset.x, 0);
        const tex = textures.background;
        ctx.drawImage(tex, 0, 0, height * tex.width / tex.height, height);

        for(const zombie of zombies)
            zombie.render();
        
        for(const projectile of projectiles)
            projectile.render();

        for(const healing of healings)
            healing.render();

        ctx.restore();
    }

    player.render();

    scoreBoard.render();

    joystick.render();

    for(const btn of buttons)
        btn.render();

    ctx.restore();
    
    requestAnimationFrame(render);
}

function getRot(angle)
{
    return [
        [ Math.cos(angle), -Math.sin(angle) ],
        [ Math.sin(angle),  Math.cos(angle) ]
    ];
}

function adjustVec(v)
{
    v.mult(ratio).multMat(getRot(-Math.PI / 2));
    v.y = height + v.y;

    return v;
}

function setupEvents()
{
    addEventListener("touchstart", e => {
        for(let i = 0; i < e.touches.length; ++i)
        {
            const touch = e.touches[i];
            const pos = adjustVec(new Vec2(touch.pageX, touch.pageY));
            
            if(joystick.clicked(pos)) {
                joystick.setTouch(touch.identifier, pos);
                continue;
            }

            for(const btn of buttons)
            {
                if(btn.clicked(pos)) {
                    btn.press();
                }
            }
        }
    });

    addEventListener("touchmove", e => {
        for(let i = 0; i < e.touches.length; ++i)
        {
            const touch = e.touches[i];
            const pos = adjustVec(new Vec2(touch.pageX, touch.pageY));

            if(joystick.touchID === touch.identifier)
                joystick.update(pos);
        }
    });

    addEventListener("touchend", e => {
        let present = false;

        for(let i = 0; i < e.touches.length; ++i)
        {
            const touch = e.touches[i];
            const pos = adjustVec(new Vec2(touch.pageX, touch.pageY));

            if(pos.equals(joystick.lastPos)) {
                present = true;
                break;
            }
        }

        if(!present) {
            joystick.removeTouch();
        }

        for(const btn of buttons)
        {
            let present = false;

            for(let i = 0; i < e.touches.length; ++i)
            {
                const touch = e.touches[i];
                const pos = adjustVec(new Vec2(touch.pageX, touch.pageY));

                if(btn.clicked(pos)) {
                    present = true;
                    break;
                }
            }

            if(!present) {
                btn.release();
            }
        }
    });

    $(".panel button").addEventListener("click", () => {
        zombies = [];
        healings = [];
        for(let i = 0; i < 4; ++i)
            zombies.push(spawnZombie());
        
        scoreBoard.update(0);
        playerDead = false;
        player.hb.set(1);
        offset.x = -(height * textures.background.width / textures.background.height) / 2;
        $(".panel").style.transform = "scale(0, 0) rotate(90deg)";
    });
}