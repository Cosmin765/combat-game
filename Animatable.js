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
        this.callback = () => {};

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
    
    setAnim(anim, options = { interruptible: true, priority: false, callback: () => {} })
    {
        const { interruptible, priority, callback } = options;

        if(anim === this.anim) return;

        if(this.interruptible || this.acc === 0 || priority)
        {
            this.acc = this.animIndex = 0;

            this.anim = anim;
            this.interruptible = interruptible;

            this.callback();

            if(callback) this.callback = callback;
            else this.callback = () => {};
        }

        this.updateDims();
    }
}