class Healing
{
    constructor(pos)
    {
        this.pos = pos.copy();
        this.dims = new Vec2(50, 50).modify(adapt);
    }

    getTopLeft()
    {
        const halfdims = this.dims.copy().div(2);
        const pos = this.pos.copy().sub(halfdims);

        return pos;
    }

    collided(pos, dims)
    {
        const healingPos = this.getTopLeft();

        const [ x1, y1 ] = [...healingPos];
        const [ w1, h1 ] = [...this.dims];

        const [ x2, y2 ] = [...pos];
        const [ w2, h2 ] = [...dims];

        return (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2);
    }

    render()
    {
        ctx.save();

        const pos = this.getTopLeft();

        ctx.translate(...pos);
        ctx.drawImage(textures.heart, 0, 0, ...this.dims);

        ctx.restore();
    }
}