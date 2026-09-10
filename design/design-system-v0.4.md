# Web Presentation Design System V0.4

## 1. Grid
- Canvas: 1920×1080
- Safe area: L/R 88, T 68, B 60
- 12 columns, 24px gutter
- Content height: max 900px

## 2. Typography
- H1: 52/1.15, 700
- H2: 42/1.2, 700
- Lead: 22/1.55, 500
- Body: 18/1.6, 400
- UI body: 15–16/1.5
- Metric: 56–72/1.0, 700

## 3. Color tokens
```css
:root{
  --bg-deep:#0C1714;
  --ink-deep:#16372E;
  --herb:#3F8069;
  --mint:#62B99C;
  --ai:#51B9DB;
  --gold:#C8A46A;
  --paper:#F3F5F0;
  --text:#16221E;
  --muted:#66736E;
  --line:rgba(22,55,46,.14);
  --glass:rgba(255,255,255,.72);
}
```

## 4. Component language
- `TalentCard`: avatar + identity + OPC badge + skills + evidence metrics.
- `ProjectCard`: project title + scene tags + cycle + delivery + status.
- `CourseCard`: course family + lesson progress + current task + mentor feedback.
- `DemandCard`: raw problem vs standardized requirement.
- `Milestone`: index + state + date + deliverable.
- `OPCBadge`: 初级/中级/高级，only 高级 may use gold emphasis.
- `StatusChip`: neutral/active/success/warning; no neon.
- `Metric`: number + label + source/“示意” state.
- `WorkspaceNav`: narrow vertical stage navigation.
- `ArchitectureModule`: title + concise capability; hover exposes detail.

## 5. Geometry
- Primary panel radius: 22px
- Secondary panel radius: 16px
- Chips: 999px
- Border: 1px rgba(22,55,46,.12)
- Shadow: 0 18px 55px rgba(6,20,15,.10), only for primary floating panel
- Avoid more than 3 visible shadow layers per screen.

## 6. Product UI principles
1. Screen 08/09/10/11/12/13/16 share the same product component language.
2. UI must look like one future platform, not seven separate mockups.
3. Primary navigation, chip, status and spacing tokens must be reused.
4. Every mock value not in source must show “示意” when it could be interpreted as real data.

## 7. Motion
- Page enter: 650ms ease-out; opacity 0→1, y 20→0, blur 8→0.
- Focus hover: scale 1.0→1.035, 220ms.
- Flow line: moving gradient, 1.8–2.8s loop.
- Count-up only on known targets (50, 5, 3) or clearly labeled demo metrics.
- Respect `prefers-reduced-motion`.
