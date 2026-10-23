'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

export default function SceneCanvas({
  scene,
  stability,
  heartRate,
}: {
  scene: any;
  stability: number;
  heartRate: number;
}) {
  // Background hue reflects stability
  const hue = Math.max(0, (stability / 100) * 120);

  return (
    <Canvas camera={{ position: [0, 1.6, 4], fov: 50 }}>
      <color attach="background" args={[`hsl(${hue}, 40%, 8%)`]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Environment preset="apartment" />
      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={2} maxDistance={8} />
      {/* Partner model placeholder — replace with a .glb loaded via useGLTF */}
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.3, 1.2, 4, 16]} />
        <meshStandardMaterial color="#f5d0c5" />
      </mesh>
    </Canvas>
  );
}