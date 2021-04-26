class Joystick extends Interactive
{
    constructor(pos)
    {
        const r = 50;
    
        super(pos.x - r, pos.y - r, r * 2, r * 2);
        
        this.r = r;
        this.pos = pos || new Vec2();
        this.ballPos = this.pos.copy();
        this.touchID = null;
    }

    setTouch(id, pos)
    {
        if(this.touchID === null) {
            this.touchID = id;
            this.update(pos);
        }
    }

    removeTouch()
    {
        this.touchID = null;
        this.ballPos = this.pos.copy();
    }
    
    update(pos)
    {
        this.ballPos = pos.copy();

        const dist = ...;

        if(dist > this.r) {
            
        }
    }
    
    render()
    {
        ctx.strokeStyle = "#00ccff";
        ctx.lineWidth = 5;
        ctx.fillStyle = "rgba(0, 255, 255, 0.2)";
        ctx.beginPath();
        ctx.arc(...this.pos, this.r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        
        ctx.beginPath();
        ctx.fillStyle = "#1c6ae8";
        ctx.arc(...this.ballPos, this.r / 2, 0, 2 * Math.PI);
        ctx.fill();
        
    }
};