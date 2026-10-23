"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Sparkles } from "@react-three/drei";
import * as THREE from "three";

export default function SceneCanvas({ stability }: { stability: number }) {
  // Determine the lighting color based on emotional stability
  const lightColor = stability > 50 ? "#4f46e5" : stability > 25 ? "#b45309" : "#dc2626";
  const ambientIntensity = stability > 25 ? 0.5 : 0.2;

  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
        <color attach="background" args={["#050505"]} />
        
        {/* Dynamic Lighting based on Stability */}
        <ambientLight intensity={ambientIntensity} />
        <pointLight position={[0, 2, 2]} intensity={2} color={lightColor} />
        <spotLight position={[5, 5, 5]} intensity={1} color="#ffffff" />

        {/* The Partner Avatar (A stylized, elegant placeholder) */}
        <group position={[0, 0.5, 0]}>
          <mesh>
            <capsuleGeometry args={[0.3, 1.2, 8, 32]} />
            <meshStandardMaterial color="#e5e5e5" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <sphereGeometry args={[0.25, 32, 32]} />
            <meshStandardMaterial color="#e5e5e5" roughness={0.2} metalness={0.8} />
          </mesh>
        </group>

        {/* Cinematic floating particles (Dopamine visual) */}
        <Sparkles count={50} scale={5} size={2} speed={0.4} opacity={0.3} color={lightColor} />

        <Environment preset="city" />
        <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
}