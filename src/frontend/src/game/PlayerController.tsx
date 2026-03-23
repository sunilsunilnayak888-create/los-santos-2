import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type * as THREE from "three";
import {
  activeVehicleId,
  camera,
  input,
  nearVehicleId,
  player,
  vehicles,
} from "./gameState";
import { useGameStore } from "./gameStore";

const WALK_SPEED = 6;
const SPRINT_SPEED = 11;
const PLAYER_HEIGHT = 0.9;
const CAMERA_DIST = 8;
const CAMERA_HEIGHT = 2.5;
const ENTER_DIST = 5;
const CITY_BOUNDS = 155;

const VEHICLE_SPECS: Record<
  string,
  { maxSpeed: number; accel: number; turnRate: number; brake: number }
> = {
  sedan: { maxSpeed: 28, accel: 12, turnRate: 1.8, brake: 20 },
  sports: { maxSpeed: 45, accel: 22, turnRate: 2.2, brake: 28 },
  police: { maxSpeed: 35, accel: 16, turnRate: 2.0, brake: 24 },
  ambulance: { maxSpeed: 25, accel: 10, turnRate: 1.6, brake: 18 },
  bike: { maxSpeed: 38, accel: 20, turnRate: 2.8, brake: 25 },
};

export default function PlayerController() {
  const playerGroupRef = useRef<THREE.Group>(null);
  const storeRef = useRef(useGameStore.getState());
  const posUpdateTimer = useRef(0);
  const wantedTimer = useRef(0);
  const { gl } = useThree();

  useEffect(() => {
    const unsub = useGameStore.subscribe((s) => {
      storeRef.current = s;
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyW" || e.code === "ArrowUp") input.forward = true;
      if (e.code === "KeyS" || e.code === "ArrowDown") input.back = true;
      if (e.code === "KeyA" || e.code === "ArrowLeft") input.left = true;
      if (e.code === "KeyD" || e.code === "ArrowRight") input.right = true;
      if (e.code === "ShiftLeft") input.sprint = true;
      if (e.code === "KeyE") {
        const nv = nearVehicleId.value;
        if (nv && !activeVehicleId.value) {
          activeVehicleId.value = nv;
          const v = vehicles.get(nv);
          useGameStore.getState().enterVehicle(v?.type ?? "sedan");
        }
      }
      if (e.code === "KeyF") {
        if (activeVehicleId.value) {
          const v = vehicles.get(activeVehicleId.value!)!;
          player.x = v.x + 4;
          player.z = v.z;
          activeVehicleId.value = null;
          useGameStore.getState().exitVehicle();
        }
      }
      if (e.code === "KeyM") {
        if (!storeRef.current.paused) useGameStore.getState().toggleMissions();
      }
      if (e.code === "Tab") {
        e.preventDefault();
        if (!storeRef.current.paused)
          useGameStore.getState().toggleCustomization();
      }
      if (e.code === "Escape") {
        if (document.pointerLockElement) {
          document.exitPointerLock();
        } else {
          useGameStore.getState().setPaused(!storeRef.current.paused);
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "KeyW" || e.code === "ArrowUp") input.forward = false;
      if (e.code === "KeyS" || e.code === "ArrowDown") input.back = false;
      if (e.code === "KeyA" || e.code === "ArrowLeft") input.left = false;
      if (e.code === "KeyD" || e.code === "ArrowRight") input.right = false;
      if (e.code === "ShiftLeft") input.sprint = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === gl.domElement) {
        camera.yaw -= e.movementX * 0.003;
        camera.pitch = Math.max(
          -0.15,
          Math.min(0.7, camera.pitch + e.movementY * 0.003),
        );
      }
    };
    const handleClick = () => {
      if (
        !storeRef.current.paused &&
        !storeRef.current.showMissions &&
        !storeRef.current.showCustomization
      ) {
        gl.domElement.requestPointerLock();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    document.addEventListener("mousemove", handleMouseMove);
    gl.domElement.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("mousemove", handleMouseMove);
      gl.domElement.removeEventListener("click", handleClick);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const store = storeRef.current;
    if (store.paused || store.showMissions || store.showCustomization) return;

    const dt = Math.min(delta, 0.05);

    if (activeVehicleId.value) {
      const v = vehicles.get(activeVehicleId.value)!;
      const spec = VEHICLE_SPECS[v.type] ?? VEHICLE_SPECS.sedan;

      if (input.forward)
        v.speed = Math.min(v.speed + spec.accel * dt, spec.maxSpeed);
      else if (input.back)
        v.speed = Math.max(v.speed - spec.brake * dt, -spec.maxSpeed * 0.4);
      else v.speed *= 0.92 ** (dt * 60);

      const turnAmount = (input.left ? 1 : 0) - (input.right ? 1 : 0);
      if (Math.abs(v.speed) > 0.5) {
        v.angle += turnAmount * spec.turnRate * dt * (v.speed > 0 ? 1 : -1);
      }

      v.x += -Math.sin(v.angle) * v.speed * dt;
      v.z += -Math.cos(v.angle) * v.speed * dt;
      v.x = Math.max(-CITY_BOUNDS, Math.min(CITY_BOUNDS, v.x));
      v.z = Math.max(-CITY_BOUNDS, Math.min(CITY_BOUNDS, v.z));

      player.x = v.x;
      player.z = v.z;
      player.angle = v.angle;
      camera.yaw = v.angle + Math.PI;

      if (Math.abs(v.speed) > 30) {
        wantedTimer.current += dt;
        if (wantedTimer.current > 8) {
          wantedTimer.current = 0;
          if (store.wantedLevel < 5)
            useGameStore.getState().setWantedLevel(store.wantedLevel + 1);
        }
      }
    } else {
      const speed = input.sprint ? SPRINT_SPEED : WALK_SPEED;
      let dx = 0;
      let dz = 0;

      if (input.forward) {
        dx += -Math.sin(camera.yaw) * speed * dt;
        dz += -Math.cos(camera.yaw) * speed * dt;
      }
      if (input.back) {
        dx += Math.sin(camera.yaw) * speed * dt;
        dz += Math.cos(camera.yaw) * speed * dt;
      }
      if (input.left) {
        dx += -Math.cos(camera.yaw) * speed * dt;
        dz += Math.sin(camera.yaw) * speed * dt;
      }
      if (input.right) {
        dx += Math.cos(camera.yaw) * speed * dt;
        dz += -Math.sin(camera.yaw) * speed * dt;
      }

      player.x += dx;
      player.z += dz;
      player.x = Math.max(-CITY_BOUNDS, Math.min(CITY_BOUNDS, player.x));
      player.z = Math.max(-CITY_BOUNDS, Math.min(CITY_BOUNDS, player.z));

      if (dx !== 0 || dz !== 0) player.angle = Math.atan2(dx, dz) + Math.PI;
    }

    if (playerGroupRef.current) {
      playerGroupRef.current.position.set(player.x, PLAYER_HEIGHT, player.z);
      playerGroupRef.current.rotation.y = player.angle;
      playerGroupRef.current.visible = !activeVehicleId.value;
    }

    const camX =
      player.x + Math.sin(camera.yaw) * Math.cos(camera.pitch) * CAMERA_DIST;
    const camY =
      PLAYER_HEIGHT + CAMERA_HEIGHT + Math.sin(camera.pitch) * CAMERA_DIST;
    const camZ =
      player.z + Math.cos(camera.yaw) * Math.cos(camera.pitch) * CAMERA_DIST;
    state.camera.position.set(camX, camY, camZ);
    state.camera.lookAt(player.x, PLAYER_HEIGHT + 1, player.z);

    let closest = null as string | null;
    let closestDist = ENTER_DIST;
    vehicles.forEach((v, id) => {
      if (id === activeVehicleId.value) return;
      const dist = Math.sqrt((v.x - player.x) ** 2 + (v.z - player.z) ** 2);
      if (dist < closestDist) {
        closestDist = dist;
        closest = id;
      }
    });
    if (closest !== nearVehicleId.value) {
      nearVehicleId.value = closest;
      useGameStore.getState().setNearVehicle(closest);
    }

    if (
      activeVehicleId.value &&
      !store.completedMissions.includes("first_ride")
    ) {
      if (store.activeMissionId === "first_ride") {
        useGameStore.getState().completeMission("first_ride");
      }
    }

    posUpdateTimer.current += dt;
    if (posUpdateTimer.current > 0.05) {
      posUpdateTimer.current = 0;
      useGameStore
        .getState()
        .updatePlayerPosition(player.x, player.z, player.angle);
    }
  });

  const { customization } = useGameStore();
  const skinColors = ["#f5deb3", "#e6b89c", "#c68642", "#8d5524", "#4a3728"];
  const outfitColors = ["#2c3e50", "#2c2c4e", "#1a1a1a", "#1a3a1a", "#1a1a3a"];
  const hairColors = ["#1a0800", "#2c1a08", "#a0522d", "#f0e68c"];

  return (
    <group ref={playerGroupRef} position={[player.x, PLAYER_HEIGHT, player.z]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.35, 1, 8, 12]} />
        <meshStandardMaterial
          color={outfitColors[customization.outfit] ?? "#1a1a3a"}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>
      <mesh castShadow position={[0, 1, 0]}>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshStandardMaterial
          color={skinColors[customization.skinTone] ?? "#c68642"}
          roughness={0.6}
        />
      </mesh>
      <mesh position={[0, 1.22, 0]}>
        <sphereGeometry args={[0.29, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={hairColors[customization.hairStyle] ?? "#1a0800"}
          roughness={0.8}
        />
      </mesh>
      <mesh castShadow position={[-0.45, 0.2, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
        <meshStandardMaterial
          color={outfitColors[customization.outfit] ?? "#1a1a3a"}
          roughness={0.5}
        />
      </mesh>
      <mesh castShadow position={[0.45, 0.2, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
        <meshStandardMaterial
          color={outfitColors[customization.outfit] ?? "#1a1a3a"}
          roughness={0.5}
        />
      </mesh>
      {customization.outfit === 4 && (
        <mesh position={[0, 0.3, 0.36]}>
          <boxGeometry args={[0.5, 0.6, 0.05]} />
          <meshStandardMaterial
            color="#c9a85c"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      )}
    </group>
  );
}
