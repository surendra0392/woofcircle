# WoofCircle Premium Design System

## 1. Visual Language: "The Cinematic Sanctuary"
The design should feel like a high-end luxury lifestyle magazine. It's not just a directory; it's a curated experience for pet parents who want the absolute best.

### Color Palette
- **Color 1**: `#deb893` (Woof Pearl) - Soft warm beige, used for borders, inputs, and muted backgrounds.
- **Color 2**: `#c89d74` (Woof Champagne) - Muted champagne gold, used for secondary elements and components.
- **Color 3**: `#bb8b62` (Woof Gold) - Antique Gold accent, used for prominent accents, links, and highlights.
- **Color 4 (Dark)**: `#24221c` (Woof Charcoal) - Deep dark brand charcoal, used for primary text, active/primary backgrounds, and core layout containers.
- **Color 5 (Gradient)**: Linear gradient from `#bb8b62` to `#deb893` - Used for premium titles, gradient buttons, and visual overlays.
- **Base Background**: `#f9f6f2` (Woof Cream) - Premium cream color for application background base.
- **Border/Stroke**: `#deb893` (Woof Pearl) for structural lines, or subtle transparent glass borders.

### Typography
- **Headings (Display)**: `Playfair Display`. Use Italic for "secondary" heading words to add a cinematic flair.
- **Body/UI**: `Instrument Sans`. Tight tracking for buttons, generous tracking for body copy.
- **Metadata**: All-caps, tracked-out (0.2em) for small labels.

## 2. Layout & Consistency
- **Max Width**: Exactly `1440px` for all content containers.
- **Hero Sections**: Always `pt-48 pb-32` to allow the navigation to breathe.
- **Card Design**: 
    - Radius: Strict `0px` (Sharp geometric boxes). No rounded borders.
    - Shadow: Custom `shadow-premium` (Soft, deep blur, very subtle opacity) or clean high-contrast flat layout.
    - Interaction: The **entire card** must be clickable if it represents a link.

## 3. Navigation (The "Command Center")
- The Navbar should be a floating glass element (`glass-premium`) with a slight blur.
- Active states should be a subtle dot or a slight weight change, not a heavy underline.
- It must maintain a consistent height and padding across all routes.

## 4. Components & UX
- **Buttons**:
    - Primary: Dark background (`bg-woof-charcoal`), light text (`text-white`), high tracking, strict `0px` radius (sharp corners).
    - Secondary: Clear/Glass/Background-transparent with a 1px border (`border-woof-pearl`), strict `0px` radius (sharp corners).
- **Blur Usage**: Use `backdrop-blur-xl` only for floating overlays or navbars. Avoid using it for large background sections that might conflict with text colors.
- **Animations**: Use "Reveal" animations (fade-in + slight slide-up) for all page transitions.
