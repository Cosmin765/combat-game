class Projectile
{
    constructor(pos, dir, tex)
    {
        this.pos = pos.copy();
        this.dir = dir;
        this.vel = new Vec2(adapt(this.dir * 10), 0);
        this.texture = tex;
        this.dims = new Vec2(adapt(100), adapt(100) * tex.height / tex.width);
    }

    getTopLeft(dims = this.dims)
    {
        const halfdims = dims.copy().div(2);
        const pos = this.pos.copy().sub(halfdims);

        return pos;
    }

    update()
    {
        this.pos.add(this.vel);

        for(const zombie of zombies)
        {
            const projectilePos = this.getTopLeft();

            if(zombie.collided(projectilePos, this.dims.copy())) {
                zombie.damage(3);
                this.remove();
                break;
            }
        }

        if(this.pos.x + offset.x < 0 || this.pos.x + offset.x > width)
            this.remove();
    }

    remove()
    {
        projectiles.splice(projectiles.indexOf(this), 1);
    }

    render()
    {
        ctx.save();
        const halfdims = this.dims.copy().div(2);
        halfdims.x *= this.dir;
        const pos = this.pos.copy().sub(halfdims);

        ctx.translate(...pos);
        ctx.scale(this.dir, 1);

        ctx.drawImage(this.texture, 0, 0, ...this.dims);
        ctx.restore();
    }
}