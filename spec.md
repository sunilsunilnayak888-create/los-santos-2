# Los Santos 2 - 3D Open World Game

## Current State
New project, no existing game code.

## Requested Changes (Diff)

### Add
- Splash screen: "Made with SN" on game load
- 3D open world city called "Los Santos 2" using Three.js / React Three Fiber
- Roads, buildings (tall skyscrapers + smaller buildings), sidewalks, streetlights
- Third-person character controller for "Sunil" (male character, stylish look)
- Character customization panel (outfit, hair, skin tone)
- Vehicles: cars, bikes, police car, ambulance - enter/exit with E key
- Smooth vehicle driving physics
- On-foot movement with WASD + mouse look
- NPC pedestrians walking around
- Police, hospital, and jail locations on map
- Mission mode: list of missions with objectives, rewards, completion tracking
- HUD: health bar, money counter, wanted stars (police level), minimap
- Minimap showing player position in city
- Day/night cycle
- "Los Santos 2" city name displayed in-game

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Set up Three.js / React Three Fiber + Drei + Cannon.js physics
2. Splash screen component with "Made with SN" branding
3. City generator: grid-based roads, procedural buildings with varied heights
4. Character "Sunil" with capsule collider, WASD movement, third-person camera
5. Vehicle system: enter/exit mechanic, driving physics
6. HUD overlay: health, money, wanted stars, minimap canvas
7. Mission system: 5 starter missions with objectives and rewards
8. Character customization modal
9. NPC system: simple walking pedestrians
10. Police/hospital/jail landmark buildings with markers
11. Backend: save high scores and mission progress
