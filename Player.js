class Player extends Animatable
{
    constructor(pos)
    {
        super(new Vec2(adapt(200), adapt(200)));
        this.pos = pos.copy();
        this.dir = 1;
        this.hb = new HealthBar(10);
    }

    update()
    {
        this.updateAnim();

        if(this.anim === textures.player.run) {
            if((player.dir < 0 && adapt(-offset.x) > adapt(20)) || (this.dir > 0 && adapt(-offset.x) < adapt(height) * textures.background.width / textures.background.height - adapt(width + 20)))
                offset.x -= adapt(this.dir * 8);
        }

        if(this.anim === textures.player.attack) {
            for(const zombie of zombies)
            {
                const halfdims = this.dims.copy().div(2);
                const playerPos = this.pos.copy().sub(halfdims).add(offset.copy().mult(-1));

                if(zombie.collided(playerPos, this.dims)) {
                    zombie.damage(0.1);
                }
            }
        }
    }

    setDir(dir)
    {
        if(dir === 0) return;
        this.dir = dir < 0 ? -1 : 1;
    }

    // push_back(dir) // C++ developers will understand
    // {

    // }

    render()
    {
        ctx.save();
        const texture = this.anim[this.animIndex];
        const halfdims = this.dims.copy().div(2);
        halfdims.x *= this.dir;
        const pos = this.pos.copy().sub(halfdims);

        ctx.translate(...pos);
        ctx.scale(this.dir, 1);

        ctx.drawImage(texture, 0, 0, ...this.dims);

        ctx.strokeStyle = "red";
        ctx.strokeRect(0, 0, ...this.dims);

        ctx.restore()

        ctx.save();
        ctx.translate(...this.pos.copy().add(new Vec2(0, adapt(-120))));
        this.hb.render();
        ctx.restore();
    }
}