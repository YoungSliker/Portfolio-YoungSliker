"""Bake the supplied Grainient fine-grain hash into a reusable transparent tile.

Only the grain pass is needed: no gradient, WebGL context or animation loop.
"""
from pathlib import Path
from PIL import Image


def fract(value):
    return value % 1


def noise(x, y):
    q = [fract(x * .1031), fract(y * .1031), fract(x * .1031)]
    dot = sum(q[i] * (q[(i + 1) % 3] + 33.33) for i in range(3))
    q = [v + dot for v in q]
    return fract((q[0] + q[1]) * q[2])


image = Image.new('RGBA', (256, 256))
pixels = []
for y in range(256):
    for x in range(256):
        grain = noise(x + .5, y + .5) + noise(x + 7.63, y + 7.63) - 1
        shade = 255 if grain > 0 else 0
        pixels.append((shade, shade, shade, round(abs(grain) * .11 * 255)))
image.putdata(pixels)
image.save(Path(__file__).resolve().parents[1] / 'assets' / 'background-grain.png', optimize=True)
