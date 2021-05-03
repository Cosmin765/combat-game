class ScoreBoard
{
    constructor(pos)
    {
        this.pos = pos.copy();
        this.value = 0;
    }

    update(val)
    {
        this.value = val;
    }

    add(amount)
    {
        this.value += amount;
    }

    remove(amount)
    {
        if(this.value >= amount)
            this.value -= amount;
    }

    render()
    {
        ctx.fillStyle = "white";
        ctx.font = "50px Arial";
        ctx.fillText(this.value, ...this.pos);
    }
}