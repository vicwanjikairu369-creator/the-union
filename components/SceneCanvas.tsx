"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Sparkles, Float } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { motion } from "framer-motion";

export default function SceneCanvas({ stability }: { stability: number }) {
  // Dynamic Colors based on Stability
  const isAngry = stability <= 25;
  const isTense = stability > 25 && stability <= 50;
  
  const ambientColor = isAngry ? "#ef4444" : isTense ? "#f59e0b" : "#3b82f6";
  const rimColor = isAngry ? "#7f1d1d" : isTense ? "#78350f" : "#1e3a8a";

  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Canvas camera={{ position: [0, 1.2, 4.5], fov: 35 }}>
        
        {/* MOODY BACKGROUND COLOR */}
        <color attach="background" args={[isAngry ? "#1a0505" : "#050505"]} />

        {/* LIGHTING SETUP (Cinematic) */}
        <ambientLight intensity={0.2} color={ambientColor} />
        
        {/* Key Light (Warm) */}
        <spotLight 
          position={[3, 4, 2]} 
          intensity={isAngry ? 4 : 2} 
          color={isAngry ? "#ff4444" : "#ffffff"} 
          angle={0.5} 
          penumbra={1} 
          castShadow 
        />
        
        {/* Rim Light (Cold) */}
        <spotLight 
          position={[-3, 2, -2]} 
          intensity={3} 
          color={rimColor} 
          angle={0.5} 
          penumbra={1} 
        />

        {/* THE PARTNER AVATAR */}
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
          <group position={[0, 1, 0]}>
            {/* Body */}
            <mesh castShadow>
              <capsuleGeometry args={[0.35, 1.2, 16, 32]} />
              <meshStandardMaterial 
                color="#d4d4d8" 
                roughness={0.1} 
                metalness={0.9} 
                envMapIntensity={1.5} 
              />
            </mesh>
            {/* Head */}
            <mesh position={[0, 1.1, 0]} castShadow>
              <sphereGeometry args={[0.28, 32, 32]} />
              <meshStandardMaterial 
                color="#d4d4d8" 
                roughness={0.1} 
                metalness={0.9} 
                envMapIntensity={1.5} 
              />
            </mesh>
            {/* Glowing Eyes (Emotion Indicator) */}
            <mesh position={[0.1, 1.15, 0.25]}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshBasicMaterial color={isAngry ? "#ff0000" : "#ffffff"} />
            </mesh>
            <mesh position={[-0.1, 1.15, 0.25]}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshBasicMaterial color={isAngry ? "#ff0000" : "#ffffff"} />
            </mesh>
          </group>
        </Float>

        {/* ENVIRONMENT & FLOOR */}
        <Environment preset={isAngry ? "sunset" : "night"} />
        <ContactShadows position={[0, -0.5, 0]} opacity={0.8} scale={10} blur={2} far={4} color={isAngry ? "#ff0000" : "#000000"} />
        
        {/* VOLUMETRIC PARTICLES */}
        <Sparkles 
          count={isAngry ? 150 : 40} 
          scale={8} 
          size={isAngry ? 4 : 2} 
          speed={isAngry ? 2 : 0.5} 
          opacity={0.4} 
          color={ambientColor} 
        />

        {/* POST-PROCESSING (The Konami "Film Look") */}
        <EffectComposer>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={isAngry ? 2 : 0.5} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>

        {/* Gentle Camera Movement */}
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={isAngry ? 2.0 : 0.5} 
          maxPolarAngle={Math.PI / 2} 
        />
      </Canvas>
    </div>
  );
}