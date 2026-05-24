export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  screen: 20, // standard horizontal screen padding
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

// Refined premium-flat shadows. Soft, slightly offset, low-opacity — the
// kind of lift you see on Linear / Notion / Stripe cards rather than the
// dramatic drop shadows of a more decorative app.
export const shadow = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 5,
  },
  softLight: {
    shadowColor: '#0F1F4B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 2,
  },
  glow: {
    shadowColor: '#5B9BE3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.32,
    shadowRadius: 24,
    elevation: 8,
  },
  glowGold: {
    shadowColor: '#F7DD9C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.42,
    shadowRadius: 22,
    elevation: 8,
  },
  glowFire: {
    shadowColor: '#FF8B4A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    elevation: 8,
  },
  // Premium 3D shadow — kept slightly heavier than `soft` but elevation
  // bumped down from 14 → 8 so Android doesn't promote every depth card to
  // its own render layer. Visual depth is mostly carried by iOS shadow
  // values (offset + radius); Android elevation just needs to register
  // "this lifts" without fragmenting the compositor.
  depth: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.26,
    shadowRadius: 26,
    elevation: 8,
  },
  depthLight: {
    shadowColor: '#0F1F4B',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.10,
    shadowRadius: 26,
    elevation: 4,
  },
  // Subtle accent glow — elevation bumped from 6 → 3 so multiple `glowSoft`
  // cards on the same screen don't each become a separate compositor layer.
  glowSoft: {
    shadowColor: '#5B9BE3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.20,
    shadowRadius: 18,
    elevation: 3,
  },
};
