class Player
{
    constructor(pos)
    {
        this.pos = pos.copy();
        this.dims = new Vec2(adapt(200), adapt(200));
        this.animIndex = 0;
        this.anim = [];
        this.dir = 1;
        this.acc = 0;
        this.animDelay = 2.5;

        this.interruptible = true;
    }
    
    updateDims()
    {
        const texture = this.anim[this.animIndex];
        this.dims.x = adapt(this.dims.y * texture.width / texture.height);
    }
    
    updateAnim()
    {
        this.acc++;
        this.acc %= (10 * this.animDelay) | 0;

        this.animIndex = (this.acc / this.animDelay) | 0;
    }
    
    setAnim(anim, interruptible = true)
    {
        if(this.interruptible || this.acc === 0)
        {
            if(anim != this.anim)
                this.acc = 0;

            this.anim = anim;
            this.interruptible = interruptible;
        }

        this.updateDims();
    }

    update()
    {
        this.updateAnim();
    }

    setDir(dir)
    {
        if(dir === 0) return;
        this.dir = dir < 0 ? -1 : 1;
    }

    render()
    {
        ctx.save();
        const texture = this.anim[this.animIndex];
        const dims = this.dims.copy().div(2);
        dims.x *= this.dir;
        const pos = this.pos.copy().sub(dims);

        ctx.translate(...pos);
        ctx.scale(this.dir, 1);
        ctx.translate(-pos.x, -pos.y);

        ctx.drawImage(texture, ...pos, ...this.dims);
        ctx.restore();
    }
}