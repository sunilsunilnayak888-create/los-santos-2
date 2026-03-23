import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { npcs } from "./gameState";

const CITY_BOUNDS = 150;

export default function NPCs() {
  const groupRefs = useRef<Array<THREE.Group | null>>([]);
  const timers = useRef<number[]>(npcs.map(() => Math.random() * 3));

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    npcs.forEach((npc, i) => {
      timers.current[i] -= dt;
      if (timers.current[i] <= 0) {
        npc.angle += (Math.random() - 0.5) * Math.PI * 0.8;
        timers.current[i] = 2 + Math.random() * 4;
      }

      npc.x += -Math.sin(npc.angle) * npc.speed * dt;
      npc.z += -Math.cos(npc.angle) * npc.speed * dt;

      // Bounce off bounds
      if (Math.abs(npc.x) > CITY_BOUNDS || Math.abs(npc.z) > CITY_BOUNDS) {
        npc.angle += Math.PI + (Math.random() - 0.5) * 0.5;
        npc.x = Math.max(-CITY_BOUNDS, Math.min(CITY_BOUNDS, npc.x));
        npc.z = Math.max(-CITY_BOUNDS, Math.min(CITY_BOUNDS, npc.z));
      }

      const ref = groupRefs.current[i];
      if (ref) {
        ref.position.set(npc.x, 0.9, npc.z);
        ref.rotation.y = npc.angle;
      }
    });
  });

  return (
    <group>
      {npcs.map((npc, i) => (
        <group
          key={npc.id}
          ref={(el) => {
            groupRefs.current[i] = el;
          }}
          position={[npc.x, 0.9, npc.z]}
          rotation={[0, npc.angle, 0]}
        >
          {/* NPC body */}
          <mesh castShadow>
            <capsuleGeometry args={[0.3, 0.8, 6, 8]} />
            <meshStandardMaterial color={npc.color} roughness={0.7} />
          </mesh>
          {/* NPC head */}
          <mesh castShadow position={[0, 0.85, 0]}>
            <sphereGeometry args={[0.22, 8, 8]} />
            <meshStandardMaterial color={npc.color} roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
