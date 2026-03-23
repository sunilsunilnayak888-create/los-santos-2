import { useMemo } from "react";

const GRID = 10;
const BLOCK = 22;
const ROAD = 8;
const CELL = BLOCK + ROAD;
const HALF = (GRID * CELL) / 2;

function seededRand(n: number) {
  const x = Math.sin(n + 1.5) * 93758.3;
  return x - Math.floor(x);
}

const BLDG_COLORS = [
  "#182030",
  "#1c1c2a",
  "#241818",
  "#182420",
  "#242424",
  "#152035",
  "#20152a",
  "#252018",
  "#141528",
  "#1e1e20",
];

const NEON_EMISSIVE = ["#004488", "#440088", "#004422", "#883300"];

const LANDMARK_BUILDINGS = [
  {
    id: "lspd",
    x: -100,
    z: -100,
    w: 28,
    d: 28,
    h: 12,
    color: "#1a1a3e",
    emissive: "#0000ff",
  },
  {
    id: "hospital",
    x: 100,
    z: 100,
    w: 24,
    d: 24,
    h: 10,
    color: "#2e1a1a",
    emissive: "#cc0000",
  },
  {
    id: "jail",
    x: -100,
    z: 100,
    w: 30,
    d: 25,
    h: 8,
    color: "#2a2a2a",
    emissive: "#444444",
  },
];

interface BuildingData {
  key: string;
  cx: number;
  cz: number;
  h: number;
  w: number;
  d: number;
  color: string;
  emissive: string | null;
}

interface MarkData {
  key: string;
  x: number;
  z: number;
  w: number;
  d: number;
}

export function generateStreetlightPositions(): Array<
  [number, number, number]
> {
  const positions: Array<[number, number, number]> = [];
  for (let i = 0; i <= GRID; i++) {
    for (let j = 0; j <= GRID; j++) {
      const x = i * CELL - HALF;
      const z = j * CELL - HALF;
      positions.push([x, 0, z]);
    }
  }
  return positions;
}

export default function City() {
  const buildings = useMemo<BuildingData[]>(() => {
    const result: BuildingData[] = [];
    for (let i = 0; i < GRID; i++) {
      for (let j = 0; j < GRID; j++) {
        const seed = i * 100 + j;
        const cx = i * CELL - HALF + BLOCK / 2;
        const cz = j * CELL - HALF + BLOCK / 2;
        const h = 5 + seededRand(seed) * 60;
        const w = BLOCK * (0.55 + seededRand(seed + 1) * 0.35);
        const d = BLOCK * (0.55 + seededRand(seed + 2) * 0.35);
        const colorIdx = Math.floor(seededRand(seed + 3) * BLDG_COLORS.length);
        const isNeon = seededRand(seed + 4) < 0.1;
        const neonIdx = Math.floor(seededRand(seed + 5) * NEON_EMISSIVE.length);
        result.push({
          key: `b${i}_${j}`,
          cx,
          cz,
          h,
          w,
          d,
          color: BLDG_COLORS[colorIdx] ?? "#1c1c2a",
          emissive: isNeon ? (NEON_EMISSIVE[neonIdx] ?? null) : null,
        });
      }
    }
    return result;
  }, []);

  const roadMarkings = useMemo<MarkData[]>(() => {
    const marks: MarkData[] = [];
    for (let j = 0; j <= GRID; j++) {
      const z = j * CELL - HALF - ROAD / 2;
      marks.push({ key: `hmark${j}`, x: 0, z, w: GRID * CELL, d: 0.3 });
    }
    for (let i = 0; i <= GRID; i++) {
      const x = i * CELL - HALF - ROAD / 2;
      marks.push({ key: `vmark${i}`, x, z: 0, w: 0.3, d: GRID * CELL });
    }
    return marks;
  }, []);

  const streetlights = useMemo(
    () =>
      generateStreetlightPositions().map((pos, idx) => ({
        pos,
        key: `sl${idx}`,
        idx,
      })),
    [],
  );

  const neonBuildings = useMemo(
    () => buildings.filter((b) => b.emissive).slice(0, 5),
    [buildings],
  );

  return (
    <group>
      {/* Ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <planeGeometry args={[GRID * CELL + 60, GRID * CELL + 60]} />
        <meshStandardMaterial color="#111418" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Block surfaces */}
      {buildings.map((b) => (
        <mesh
          key={`block_${b.key}`}
          position={[b.cx, 0.01, b.cz]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[BLOCK, BLOCK]} />
          <meshStandardMaterial color="#161c20" roughness={0.95} />
        </mesh>
      ))}

      {/* Road markings */}
      {roadMarkings.map((m) => (
        <mesh
          key={m.key}
          position={[m.x, 0.02, m.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[m.w, m.d]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.8} />
        </mesh>
      ))}

      {/* Buildings */}
      {buildings.map((b) => (
        <group key={`bldg_${b.key}`} position={[b.cx, 0, b.cz]}>
          <mesh castShadow receiveShadow position={[0, b.h / 2, 0]}>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial
              color={b.color}
              roughness={0.7}
              metalness={0.3}
              emissive={b.emissive ?? "#000000"}
              emissiveIntensity={b.emissive ? 0.4 : 0}
            />
          </mesh>
          <mesh position={[0, b.h + 0.15, 0]}>
            <boxGeometry args={[b.w + 0.4, 0.3, b.d + 0.4]} />
            <meshStandardMaterial
              color="#0a0e12"
              roughness={0.5}
              metalness={0.5}
            />
          </mesh>
          {b.emissive && b.h > 25 && (
            <mesh position={[0, b.h * 0.7, b.d / 2 + 0.1]}>
              <boxGeometry args={[b.w * 0.6, 1, 0.2]} />
              <meshStandardMaterial
                color={b.emissive}
                emissive={b.emissive}
                emissiveIntensity={2}
                roughness={0.3}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Landmark buildings */}
      {LANDMARK_BUILDINGS.map((lb) => (
        <group key={`landmark_${lb.id}`} position={[lb.x, 0, lb.z]}>
          <mesh castShadow position={[0, lb.h / 2, 0]}>
            <boxGeometry args={[lb.w, lb.h, lb.d]} />
            <meshStandardMaterial
              color={lb.color}
              emissive={lb.emissive}
              emissiveIntensity={0.5}
              roughness={0.6}
              metalness={0.4}
            />
          </mesh>
          <mesh position={[0, lb.h + 1.5, lb.d / 2 + 0.2]}>
            <boxGeometry args={[lb.w * 0.7, 2, 0.3]} />
            <meshStandardMaterial
              color={lb.emissive}
              emissive={lb.emissive}
              emissiveIntensity={3}
            />
          </mesh>
        </group>
      ))}

      {/* Streetlights */}
      {streetlights.map(({ pos: [x, , z], key, idx }) => (
        <group key={key} position={[x + 2, 0, z + 2]}>
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 6, 6]} />
            <meshStandardMaterial
              color="#303030"
              roughness={0.6}
              metalness={0.8}
            />
          </mesh>
          <mesh position={[0, 6.2, 0]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshStandardMaterial
              color="#ffe8a0"
              emissive="#ffe8a0"
              emissiveIntensity={3}
            />
          </mesh>
          {idx % 4 === 0 && (
            <pointLight
              position={[0, 6, 0]}
              intensity={15}
              distance={20}
              color="#ffe8a0"
            />
          )}
        </group>
      ))}

      {/* Neon accent lights */}
      {neonBuildings.map((b) => (
        <pointLight
          key={`neon_${b.key}`}
          position={[b.cx, b.h * 0.7, b.cz]}
          intensity={20}
          distance={30}
          color={b.emissive!}
        />
      ))}
    </group>
  );
}
