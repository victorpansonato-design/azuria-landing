import { test } from "node:test";
import assert from "node:assert/strict";
import {
  galleryProgress,
  railPosition,
} from "../src/shared/motion/scroll-math";
test("galeria começa e termina nos limites, nos dois sentidos", () => {
  assert.equal(galleryProgress(100, 900), 0);
  assert.equal(galleryProgress(-450, 900), 0.5);
  assert.equal(galleryProgress(-950, 900), 1);
  assert.equal(galleryProgress(-900, 900), 1);
  assert.equal(galleryProgress(-450, 900), 0.5);
  assert.equal(galleryProgress(0, 0), 0);
});
test("trilho mapeia o centro do thumb e limita arrasto fora da página", () => {
  assert.equal(railPosition(120, 100, 600, 40, 5000), 0);
  assert.equal(railPosition(400, 100, 600, 40, 5000), 2500);
  assert.equal(railPosition(680, 100, 600, 40, 5000), 5000);
  assert.equal(railPosition(900, 100, 600, 40, 5000), 5000);
  assert.equal(railPosition(-20, 100, 600, 40, 5000), 0);
  assert.equal(railPosition(400, 100, 600, 40, -50), 0);
  // Grabbing either end of the thumb keeps the current scroll position.
  assert.equal(railPosition(380, 100, 600, 40, 5000, 0), 2500);
  assert.equal(railPosition(420, 100, 600, 40, 5000, 40), 2500);
});
