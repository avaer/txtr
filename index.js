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
Rect.fromJson = j => new Rect(j.x, j.y, j.w, j.h);
class AtlasNode {
  constructor(left, right, rect, filled) {
    this.left = left;
    this.right = right;
    this.rect = rect;
    this.filled = filled;
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
      this.left = new AtlasNode(null, null, new Rect(this.rect.x, this.rect.y, rect.w, this.rect.h), false);
      this.right = new AtlasNode(null, null, new Rect(this.rect.x + rect.w, this.rect.y, this.rect.w - rect.w, this.rect.h), false);
    }
    else {
      this.left = new AtlasNode(null, null, new Rect(this.rect.x, this.rect.y, this.rect.w, rect.h), false);
      this.right = new AtlasNode(null, null, new Rect(this.rect.x, this.rect.y + rect.h, this.rect.w, this.rect.h - rect.h), false);
    }
    return this.left.pack(rect);
  }
}
AtlasNode.fromJson = j => new AtlasNode(
  j.left ? AtlasNode.fromJson(j.left) : null,
  j.right ? AtlasNode.fromJson(j.right) : null,
  Rect.fromJson(j.rect),
  j.filled
);
class Atlas {
  constructor() {
    if (typeof arguments[0] === 'number') {
      const [width, height] = arguments;
      this.root = new AtlasNode(null, null, new Rect(0, 0, width, height), false);
    } else {
      const [atlasNode] = arguments;
      this.root = atlasNode;
    }
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
  toJson() {
    return this.root;
  }
}
Atlas.fromJson = j => new Atlas(AtlasNode.fromJson(j));
const txtr = (width, height) => new Atlas(width, height);
txtr.fromJson = Atlas.fromJson;
module.exports = txtr;
