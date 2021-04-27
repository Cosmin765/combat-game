window.onload = main;

const $ = name => document.querySelector(name);

let cvs, ctx, joystick;
let ratio;

function main()
{
    cvs = $("#c");
    cvs.width = 450;
    cvs.height = 800;

    // adjusting the canvas
    if(innerHeight / innerWidth < 16 / 9) {
        cvs.style.height = "100vh";
        ratio = innerHeight / 800;
    } else {
        cvs.style.width = "100vw";
        ratio = innerWidth / 450;
    }

    ctx = cvs.getContext("2d");
    
    joystick = new Joystick(new Vec2(cvs.width / 2, cvs.height / 2));

    setupEvents();
    requestAnimationFrame(render);
}

function render(time)
{
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    
    joystick.render();
    
    requestAnimationFrame(render);
}

function setupEvents()
{
    addEventListener("touchstart", e => {
        for(let i = 0; i < e.touches.length; ++i)
        {
            const touch = e.touches[i];
            const pos = new Vec2(touch.pageX, touch.pageY);
            pos.div(ratio); // adjusting the vector
            if(joystick.clicked(pos))
                joystick.setTouch(touch.identifier, pos);
        }
    });

    addEventListener("touchmove", e => {
        for(let i = 0; i < e.touches.length; ++i)
        {
            const touch = e.touches[i];
            const pos = new Vec2(touch.pageX, touch.pageY);
            pos.div(ratio);

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
            const pos = new Vec2(touch.pageX, touch.pageY);
            if(pos.equals(joystick.ballPos)) {
                present = true;
                break;
            }
        }

        if(!present) {
            joystick.removeTouch();
        }
    });
}