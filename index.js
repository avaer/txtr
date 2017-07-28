class Rect {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  fitsIn(outer) {
    return outer.w >= this.w && outer.h >= this.h;
  }
  sameSizeAs(other) {
    return this.w === other.w && this.h === other.h;
  }
}
class AtlasNode {
  constructor(rect) {
    this.left = this.right = null;
    this.rect = rect;
    this.filled = false;
  }
  pack(rect) {
    if (this.left !== null) {
      return this.left.pack(rect) || this.right.pack(rect);
    }
    // if atlas filled or wont fit
    if (this.filled || !rect.fitsIn(this.rect)) {
      return null;
    }
    // if this atlas has been filled
    if (rect.sameSizeAs(this.rect)) {
      this.filled = true;
      return this;
    }
    if ((this.rect.w - rect.w) > (this.rect.h - rect.h)) {
      this.left = new AtlasNode(new Rect(this.rect.x, this.rect.y, rect.w, this.rect.h));
      this.right = new AtlasNode(new Rect(this.rect.x + rect.w, this.rect.y, this.rect.w - rect.w, this.rect.h));
    }
    else {
      this.left = new AtlasNode(new Rect(this.rect.x, this.rect.y, this.rect.w, rect.h));
      this.right = new AtlasNode(new Rect(this.rect.x, this.rect.y + rect.h, this.rect.w, this.rect.h - rect.h));
    }
    return this.left.pack(rect);
  }
}
class Atlas {
  constructor(width, height) {
    this.root = new AtlasNode(new Rect(0, 0, width, height));
  }

  pack(width, height) {
    return this.root.pack(new Rect(0, 0, width, height)).rect;
  }

  uv(rect) {
    return [
      rect.x / this.root.rect.w,
      rect.y / this.root.rect.h,
      (rect.x + rect.w) / this.root.rect.w,
      (rect.y + rect.h) / this.root.rect.h
    ];
  }
}
const txtr = (width, height) => new Atlas(width, height);
module.exports = txtr;
