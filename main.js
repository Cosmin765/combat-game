window.onload = main;

const $ = name => document.querySelector(name);

let cvs, ctx, joystick, player;
let ratio;

const buttons = [];

const resolutions = [
    [ 640, 360 ],
    [ 854, 480 ],
    [ 960, 540 ],
    [ 1024, 576 ],
    [ 1280, 720 ],
    [ 1366, 768 ],
    [ 1600, 900 ],
    [ 1920, 1080]
];

const [ width, height ] = resolutions[3];

const adapt = val => width / 960 * val;

let textures = {
  player: {
    idle: [],
    slide: [],
    run: [],
    attack: [],
    throw: [],
  },
  background: null,
};

function loadTexture(filename)
{
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = `./assets/${filename}`;
    img.onload = () => resolve(img);
  });
}

async function loadAnimations(options)
{
  for(const option of options)
  {
    const [ name, container ] = option;
    for(let i = 0; i < 10; ++i)
    {
        const filename = name + `__00${i}.png`;
        const img = await loadTexture(filename, container);
        container.push(img);
    }
  }
}

async function main()
{
    cvs = $("#c");
    cvs.width = height;
    cvs.height = width;

    adjustCanvas();

    ctx = cvs.getContext("2d");
    
    joystick = new Joystick(new Vec2(adapt(150), height - adapt(150)));
    buttons.push(new Button(new Vec2(width - adapt(150), height - adapt(220)), "A"));
    buttons.push(new Button(new Vec2(width - adapt(210), height - adapt(120)), "B"));
    buttons.push(new Button(new Vec2(width - adapt(90), height - adapt(120)), "C"));
    
    player = new Player(new Vec2(width / 2, height / 2 + adapt(60)));
    
    setupEvents();
    
    const options = [
      ["player/Idle", textures.player.idle],
      ["player/Run", textures.player.run],
      ["player/Attack", textures.player.attack],
      ["player/Throw", textures.player.throw],
    ];
    
    await loadAnimations(options);
    textures.background = await loadTexture("Background.png");
    
    requestAnimationFrame(render);
}

function adjustCanvas()
{
    if(innerHeight / innerWidth > 16 / 9) {
        cvs.style.width = "100vw";
        ratio = innerWidth / height;
    } else {
        cvs.style.height = "100vh";
        ratio = innerHeight / width;
    }
}

function update()
{
    const dir = joystick.dir();

    if(dir.dist() > 0) {
        player.setAnim(textures.player.run);
    } else {
        player.setAnim(textures.player.idle);
    }

    if(player.anim === textures.player.run) {
        if((player.dir < 0 && -offset.x > 0) || (player.dir > 0 && adapt(-offset.x) < height * textures.background.width / textures.background.height - adapt(width * 3 / 4)))
            offset.x -= player.dir * 8;
    }

    if(buttons[0].pressed)
        player.setAnim(textures.player.attack, false);

    if(buttons[1].pressed)
        player.setAnim(textures.player.throw, false);

    player.setDir(dir.x);

    player.update();
}

let offset = new Vec2(0, 0);

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
        const tex = textures.background;
        ctx.drawImage(tex, 0 + offset.x, 0, height * tex.width / tex.height, height);
    }

    joystick.render();

    for(const btn of buttons)
        btn.render();

    player.render();

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
    v.div(ratio).multMat(getRot(-Math.PI / 2));
    v.y = cvs.width + v.y;

    return v;
}

function setupEvents()
{
    addEventListener("touchstart", e => {
        for(let i = 0; i < e.touches.length; ++i)
        {
            const touch = e.touches[i];
            const pos = adjustVec(new Vec2(touch.pageX, touch.pageY));
            
            if(joystick.clicked(pos))
                joystick.setTouch(touch.identifier, pos);

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
}