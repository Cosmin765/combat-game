class Vec2
{
    constructor(x = 0, y = 0)
    {
        this.x = x; this.y = y;
    }
    
    add(v)
    {
        this.x += v.x; this.y += v.y; return this;
    }
    
    sub(v)
    {
        this.x -= v.x; this.y -= v.y; return this;
    }
    
    mult(n)
    {
        this.x *= n; this.y *= n; return this;
    }

    div(n)
    {
        return this.mult(1 / n);
    }
    
    copy()
    {
        return new Vec2(...this);
    }

    equals(v)
    {
        return this.x === v.x && this.y == v.y;
    }

    dist(v)
    {
        return Math.sqrt(Math.pow(v.x - this.x, 2) + Math.pow(v.y - this.y, 2));
    }
    
    [Symbol.iterator] = function*() {
        yield this.x; yield this.y;
    }
};