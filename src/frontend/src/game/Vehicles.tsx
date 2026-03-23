import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { activeVehicleId, vehicles } from "./gameState";

interface VehicleMeshProps {
  id: string;
}

function Wheel({ pos }: { pos: [number, number, number] }) {
  return (
    <mesh position={pos} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.35, 0.35, 0.25, 12]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
    </mesh>
  );
}

function VehicleMesh({ id }: VehicleMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const v = vehicles.get(id);
    if (!v) return;
    groupRef.current.position.set(v.x, 0.4, v.z);
    groupRef.current.rotation.y = v.angle;
    // Hide if player is currently driving this vehicle
    groupRef.current.visible = activeVehicleId.value !== id;
  });

  const v = vehicles.get(id)!;
  const { type, color } = v;

  const isPolice = type === "police";
  const isAmbulance = type === "ambulance";
  const isBike = type === "bike";
  const isSports = type === "sports";

  const bodyLen = isBike ? 1.8 : isSports ? 3.8 : 4.2;
  const bodyW = isBike ? 0.6 : isSports ? 1.9 : 2.0;
  const bodyH = isBike ? 0.5 : isAmbulance ? 1.2 : isSports ? 0.5 : 0.65;
  const bodyY = isBike ? 0.45 : 0.3;
  const cabH = isBike ? 0 : isAmbulance ? 0.8 : 0.5;

  return (
    <group ref={groupRef} position={[v.x, 0.4, v.z]} rotation={[0, v.angle, 0]}>
      {/* Body */}
      <mesh castShadow position={[0, bodyY, 0]}>
        <boxGeometry args={[bodyW, bodyH, bodyLen]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Cab / roof */}
      {!isBike && (
        <mesh
          castShadow
          position={[0, bodyY + bodyH / 2 + cabH / 2, isSports ? 0.2 : 0]}
        >
          <boxGeometry
            args={[bodyW * 0.85, cabH, bodyLen * (isSports ? 0.55 : 0.65)]}
          />
          <meshStandardMaterial
            color={isAmbulance ? "#f0f0f0" : color}
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
      )}

      {/* Windows */}
      {!isBike && (
        <mesh
          position={[
            0,
            bodyY + bodyH / 2 + cabH / 2,
            isSports ? 0.5 : bodyLen * 0.28,
          ]}
        >
          <boxGeometry args={[bodyW * 0.84, cabH * 0.6, 0.06]} />
          <meshStandardMaterial
            color="#88ccee"
            transparent
            opacity={0.6}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
      )}

      {/* Police light bar */}
      {isPolice && (
        <group position={[0, bodyY + bodyH / 2 + cabH + 0.15, 0.2]}>
          <mesh>
            <boxGeometry args={[1.2, 0.2, 0.4]} />
            <meshStandardMaterial color="#111122" roughness={0.5} />
          </mesh>
          <pointLight
            position={[-0.3, 0.2, 0]}
            color="#ff2222"
            intensity={8}
            distance={15}
          />
          <pointLight
            position={[0.3, 0.2, 0]}
            color="#2233ff"
            intensity={8}
            distance={15}
          />
        </group>
      )}

      {/* Ambulance cross */}
      {isAmbulance && (
        <group position={[0, bodyY + bodyH / 2 + 0.05, bodyLen / 2 + 0.01]}>
          <mesh>
            <boxGeometry args={[0.8, 0.2, 0.06]} />
            <meshStandardMaterial
              color="#ee0000"
              emissive="#ee0000"
              emissiveIntensity={1}
            />
          </mesh>
          <mesh>
            <boxGeometry args={[0.2, 0.8, 0.06]} />
            <meshStandardMaterial
              color="#ee0000"
              emissive="#ee0000"
              emissiveIntensity={1}
            />
          </mesh>
        </group>
      )}

      {/* Headlights */}
      <mesh position={[bodyW * 0.35, bodyY, -bodyLen / 2 - 0.01]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial
          color="#ffffcc"
          emissive="#ffffcc"
          emissiveIntensity={3}
        />
      </mesh>
      <mesh position={[-bodyW * 0.35, bodyY, -bodyLen / 2 - 0.01]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial
          color="#ffffcc"
          emissive="#ffffcc"
          emissiveIntensity={3}
        />
      </mesh>
      {/* Tail lights */}
      <mesh position={[bodyW * 0.35, bodyY, bodyLen / 2 + 0.01]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial
          color="#ff2200"
          emissive="#ff2200"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[-bodyW * 0.35, bodyY, bodyLen / 2 + 0.01]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial
          color="#ff2200"
          emissive="#ff2200"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Wheels */}
      {!isBike ? (
        <>
          <Wheel pos={[-bodyW / 2 - 0.13, 0.35, bodyLen * 0.33]} />
          <Wheel pos={[bodyW / 2 + 0.13, 0.35, bodyLen * 0.33]} />
          <Wheel pos={[-bodyW / 2 - 0.13, 0.35, -bodyLen * 0.33]} />
          <Wheel pos={[bodyW / 2 + 0.13, 0.35, -bodyLen * 0.33]} />
        </>
      ) : (
        <>
          <Wheel pos={[0, 0.35, 0.7]} />
          <Wheel pos={[0, 0.35, -0.7]} />
          {/* Handlebar */}
          <mesh position={[0, 0.85, -0.6]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.9, 6]} />
            <meshStandardMaterial
              color="#333333"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

export default function Vehicles() {
  return (
    <group>
      {Array.from(vehicles.keys()).map((id) => (
        <VehicleMesh key={id} id={id} />
      ))}
    </group>
  );
}
