class Animatable
{
    constructor(dims, delayFactor = 1)
    {
        this.anim = [];
        this.animIndex = 0;
        this.acc = 0;
        this.animDelay = 2.5;
        this.interruptible = true;
        this.delayFactor = delayFactor;

        this.dims = dims.copy();
    }

    updateDims()
    {
        const texture = this.anim[this.animIndex];
        this.dims.x = this.dims.y * texture.width / texture.height;
    }

    updateAnim()
    {
        this.acc++;
        this.animDelay = (25 / this.anim.length) / this.delayFactor;
        this.acc %= (this.anim.length * this.animDelay) | 0;

        this.animIndex = (this.acc / this.animDelay) | 0;
    }
    
    setAnim(anim, interruptible = true)
    {
        if(anim === this.anim) return;

        if(this.interruptible || this.acc === 0)
        {
            if(anim != this.anim) {
                this.acc = this.animIndex = 0;
            }

            this.anim = anim;
            this.interruptible = interruptible;
        }

        this.updateDims();
    }
}