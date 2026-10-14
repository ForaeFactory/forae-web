// Shared, mutable pointer state for the Work strip. Written by DOM event
// handlers and read every frame by the WebGL layer, so it lives outside React
// state to avoid re-rendering on each mouse move.
export const stripPointer = {
  hovered: null as string | null,
  clientX: 0,
  clientY: 0,
};
