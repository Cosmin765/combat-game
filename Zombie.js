class Zombie extends Animatable
{
    constructor(pos, tex)
    {
        super(new Vec2(adapt(200), adapt(200)), 0.5);
        this.pos = pos.copy();
        this.setAnim(tex.idle);
        this.dir = 1;
        this.textures = tex;
        this.speed = random(1, 3);
    }

    update()
    {
        this.updateAnim();

        const dirVec = player.pos.copy().sub(offset).sub(this.pos);

        if(dirVec.dist() > adapt(100)) {
            this.setAnim(this.textures.walk);
            const vel = dirVec.copy().normalize().mult(this.speed).modify(adapt);
            this.setDir(vel.x);
            this.pos.add(vel);
        } else {
            this.setAnim(this.textures.attack);
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