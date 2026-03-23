import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import City from "./City";
import NPCs from "./NPCs";
import PlayerController from "./PlayerController";
import Vehicles from "./Vehicles";
import { useGameStore } from "./gameStore";

function Scene() {
  const gameTime = useGameStore((s) => s.gameTime);
  const hour = (gameTime / 60) % 24;

  const isNight = hour < 6 || hour > 20;
  const isDawn = hour >= 5.5 && hour < 8;
  const isDusk = hour >= 18 && hour < 21;

  const ambientIntensity = isNight ? 0.15 : isDawn || isDusk ? 0.4 : 0.8;
  const ambientColor = isNight
    ? "#1a2040"
    : isDawn
      ? "#ff8844"
      : isDusk
        ? "#ff6633"
        : "#aaccff";
  const fogColor = isNight ? "#050810" : "#1a2040";
  const moonIntensity = isNight ? 0.6 : 0.1;

  return (
    <>
      <color
        attach="background"
        args={[isNight ? "#050810" : isDawn || isDusk ? "#1a0a20" : "#0a1830"]}
      />
      <fog attach="fog" args={[fogColor, 60, 280]} />

      <ambientLight intensity={ambientIntensity} color={ambientColor} />
      <directionalLight
        position={[80, 120, 60]}
        intensity={moonIntensity}
        color="#c8d8ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={400}
        shadow-camera-left={-200}
        shadow-camera-right={200}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
      />
      <pointLight
        position={[0, 2, 0]}
        intensity={3}
        color="#203060"
        distance={300}
      />

      <Stars
        radius={250}
        depth={60}
        count={4000}
        factor={5}
        saturation={0.3}
        fade
        speed={0.5}
      />

      <City />
      <PlayerController />
      <Vehicles />
      <NPCs />
    </>
  );
}

export default function Game() {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ fov: 65, near: 0.1, far: 400, position: [10, 8, 18] }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
