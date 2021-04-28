window.onload = main;

const $ = name => document.querySelector(name);

let cvs, ctx, joystick;
let ratio;

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

const [ width, height ] = resolutions[2];

function main()
{
    cvs = $("#c");
    cvs.width = height;
    cvs.height = width;

    adjustCanvas();

    ctx = cvs.getContext("2d");
    
    joystick = new Joystick(new Vec2(width / 2, height / 2));

    setupEvents();

    requestAnimationFrame(render);
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

function render(time)
{
    ctx.save();

    ctx.translate(width / 2, height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.translate(-width / 2, -height / 2);
    ctx.translate(175 * ratio, 175 * ratio); // idk why 175, but it seems to work

    ctx.fillStyle = "#00ff00";
    ctx.fillRect(0, 0, width, height);

    joystick.render();

    $("#info").innerHTML = [joystick.dir().angle()];


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
        }
    });

    addEventListener("touchmove", e => {
        for(let i = 0; i < e.touches.length; ++i)
        {
            const touch = e.touches[i];
            const pos = adjustVec(new Vec2(touch.pageX, touch.pageY));

            if(joystick.touchID === touch.identifier) {
                joystick.update(pos);
            }
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
    });
}