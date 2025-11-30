import argparse
from PIL import Image

def slice_frames(img, rows, cols):
    w, h = img.size
    fw = w // cols
    fh = h // rows
    frames = []
    for r in range(rows):
        for c in range(cols):
            left = c * fw
            top = r * fh
            frame = img.crop((left, top, left + fw, top + fh))
            frames.append(frame)
    return frames

def apply_scale(frames, scale):
    if scale == 1.0:
        return frames
    out = []
    for f in frames:
        nw = int(f.size[0] * scale)
        nh = int(f.size[1] * scale)
        out.append(f.resize((nw, nh), resample=Image.NEAREST))
    return out

def build_sequence(frames, reverse=False, pingpong=False):
    seq = frames[::-1] if reverse else frames[:]
    if pingpong:
        tail = seq[-2:0:-1] if len(seq) > 2 else seq[::-1]
        seq = seq + tail
    return seq

def save_gif(frames, output, duration, loop, optimize):
    first, rest = frames[0], frames[1:]
    first.save(
        output,
        save_all=True,
        append_images=rest,
        format="GIF",
        duration=duration,
        loop=loop,
        disposal=2,
        optimize=optimize,
    )

def main():
    p = argparse.ArgumentParser(description="Convert a spritesheet (rows x cols) into an animated GIF")
    p.add_argument("input", help="Path to spritesheet image")
    p.add_argument("output", help="Output GIF path")
    p.add_argument("--rows", type=int, default=4, help="Number of rows")
    p.add_argument("--cols", type=int, default=4, help="Number of columns")
    p.add_argument("--duration", type=int, default=80, help="Frame duration in ms")
    p.add_argument("--loop", type=int, default=0, help="GIF loop count, 0 for infinite")
    p.add_argument("--reverse", action="store_true", help="Play frames in reverse order")
    p.add_argument("--pingpong", action="store_true", help="Play forward then backward")
    p.add_argument("--scale", type=float, default=1.0, help="Scale factor for frames")
    p.add_argument("--no-optimize", action="store_true", help="Disable GIF optimization")
    args = p.parse_args()

    img = Image.open(args.input).convert("RGBA")
    frames = slice_frames(img, args.rows, args.cols)
    frames = apply_scale(frames, args.scale)
    seq = build_sequence(frames, reverse=args.reverse, pingpong=args.pingpong)
    if not seq:
        raise SystemExit("No frames produced")
    save_gif(seq, args.output, args.duration, args.loop, optimize=not args.no_optimize)

if __name__ == "__main__":
    main()

