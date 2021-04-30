class Player extends Animatable
{
    constructor(pos)
    {
        super(new Vec2(adapt(200), adapt(200)));
        this.pos = pos.copy();
        this.dir = 1;
    }

    update()
    {
        this.updateAnim();

        if(this.anim === textures.player.run) {
            if((player.dir < 0 && adapt(-offset.x) > adapt(20)) || (this.dir > 0 && adapt(-offset.x) < adapt(height) * textures.background.width / textures.background.height - adapt(width + 20)))
                offset.x -= adapt(this.dir * 8);
        }
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