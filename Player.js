class Player
{
    constructor(pos, tex)
    {
        this.pos = pos.copy();
        this.texture = tex;
    }

    render()
    {
        ctx.drawImage(this.texture, ...this.pos);
    }
}