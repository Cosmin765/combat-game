class Button extends Interactive
{
    constructor(pos, letter)
    {
        const r = 30 * ratio;

        super(pos.x - r, pos.y - r, r * 2, r * 2);
        this.pos = pos.copy();
        this.r = r;
        this.letter = letter;
        this.pressed = false;
    }

    press()
    {
        this.pressed = true;
    }

    release()
    {
        this.pressed = false;
    }

    render()
    {
        ctx.strokeStyle = this.pressed ? "red" : "#00ccff";
        ctx.fillStyle = this.pressed ? "rgba(99, 159, 255, 0.8)" : "rgba(28, 106, 232, 0.5)";
        ctx.beginPath();
        ctx.arc(...this.pos, this.r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        ctx.font = `${adapt(30)}px Arial`;
        ctx.fillStyle = this.pressed ? "red" : "#000";
        ctx.fillText(this.letter, ...this.pos.copy().add(new Vec2(-adapt(10), adapt(10))));
    }
}