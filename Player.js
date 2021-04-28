class Player
{
    constructor(pos, tex)
    {
        this.pos = pos.copy();
        this.dims = new Vec2(100, 100);
        this.textures = tex;
        this.animIndex = 0;
        this.anim = this.textures.run;
    }
    
    updateDims()
    {
      const texture = this.anim[this.animIndex];
      this.dims.y = this.dims.x * texture.height / texture.width;
    }
    
    updateAnim()
    {
      this.animIndex++;
      this.animIndex %= 10;
    }
    
    changeAnim()
    {
      this.updateDims();
    }

    render()
    {
      const texture = this.anim[this.animIndex];
      this.updateDims();
      this.updateAnim();
      
      const pos = this.pos.copy().sub(this.dims.copy().div(2));
      ctx.drawImage(texture, ...pos, ...this.dims);
    }
}