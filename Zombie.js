class Zombie extends Animatable
{
    constructor(pos, tex)
    {
        super(new Vec2(adapt(200), adapt(200)), 0.5);
        this.pos = pos.copy();
        this.setAnim(tex.idle);
        this.dir = 1;
        this.textures = tex;
        this.speed = random(1, 4);
        this.hb = new HealthBar(5);
        this.vel = new Vec2();
        this.elevation = this.pos.y;
        this.hit = false;
    }

    update()
    {
        this.updateAnim();

        const dirVec = player.pos.copy().sub(offset).sub(this.pos);

        if(dirVec.dist() > adapt(100)) {
            if(this.vel.dist() < 1 && this.pos.y >= this.elevation) {
                this.setAnim(this.textures.walk);
                const vel = dirVec.copy().normalize().mult(this.speed).modify(adapt);
                this.setDir(vel.x);
                this.pos.add(vel);
                this.hit = false;
            } else {
                this.setAnim(this.textures.idle);
            }
        } else if(this.anim !== this.textures.dead) {
            if(!player.charging) {
                this.setAnim(this.textures.attack);
                player.damage(0.03);
            } else {
                this.damage(1);
            }
        }

        this.pos.add(this.vel);
        this.vel.mult(0.85);

        if(this.pos.y < this.elevation) {
            const gravity = adapt(2);
            this.pos.y += gravity;
        }
    }

    setDir(dir)
    {
        if(dir === 0) return;
        this.dir = dir < 0 ? -1 : 1;
    }

    damage(amount)
    {
        this.hb.decrease(amount);

        if(this.hb.dead) {
            this.setAnim(this.textures.dead, { interruptible: false, priority: true, callback: () => {
                zombies.push(spawnZombie());
                if(Math.random() < 0.3)
                    zombies.push(spawnZombie());

                if(Math.random() < 0.5)
                    healings.push(new Healing(new Vec2(this.pos.x, height - adapt(150))));
                
                scoreBoard.add(20);

                zombies.splice(zombies.indexOf(this), 1);
            } })
        }
    }

    getTopLeft()
    {
        const halfdims = this.dims.copy().div(2);
        const pos = this.pos.copy().sub(halfdims);

        return pos;
    }

    collided(pos, dims)
    {
        const zombiePos = this.getTopLeft();

        const [ x1, y1 ] = [...zombiePos];
        const [ w1, h1 ] = [...this.dims];

        const [ x2, y2 ] = [...pos];
        const [ w2, h2 ] = [...dims];

        return (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2);
    }

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

        // ctx.strokeStyle = "red";
        // ctx.strokeRect(0, 0, ...this.dims);

        ctx.restore();

        ctx.save();
        ctx.translate(...this.pos.copy().add(new Vec2(0, adapt(-120))));
        this.hb.render();
        ctx.restore();
    }
}