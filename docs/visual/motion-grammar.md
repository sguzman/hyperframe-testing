# Motion Grammar: Causal Animation

In this style, motion is **disciplined**. We avoid "floating" or "drifting" unless it serves a specific historical zoom.

## 1. The Core Easing: Snappy Precision
All primary entrances should use high-impact easing that starts fast and settles into place with zero bounce.

- **Recommended Easing**: `expo.out` or `power4.out`.
- **Entrance Duration**: 1.2s to 1.8s for large elements.
- **The "Hit"**: Use a `from` animation with `y: 50` and `opacity: 0` to make words "slam" onto the screen.

## 2. Transition Types as Narrative Logic
Do not use random wipes. Each transition should represent a logical connection.

### The Panel Wipe (Causal Replacement)
A solid block of color sweeps the screen (Left to Right or Bottom to Top).
- **Meaning**: One era or idea is physically pushing out the previous one.
- **Implementation**: GSAP timeline with two overlapping rectangles.

### The Historic Zoom (Narrowing Focus)
A very slow (10s+) scale increase of 1.1x.
- **Meaning**: Constant analytical pressure. Looking deeper into the artifact.

### The Geometric Reveal (Structural Unfolding)
Shapes mask other shapes. A circle expands to reveal a map. A rectangle splits to reveal internal components.
- **Meaning**: Uncovering the "truth" or the inner workings of a system.

## 3. Pacing: Synchronized Editorial
- **Narration Lock**: Every major visual shift must land on a spoken word.
- **Stagger**: Use `stagger: 0.1` for list items or grid elements to create a "controlled ripple" effect.
- **Stillness**: Allow the frame to be completely still for at least 0.5s after a "hit" to let the information sink in.
