'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CharacterCreate() {
  const router = useRouter();
  const [skin, setSkin] = useState('#f5d0c5');
  const [hair, setHair] = useState('#3b2417');

  return (
    <main className="min-h-screen grid md:grid-cols-2">
      <div className="relative h-[60vh] md:h-screen">
        <Canvas camera={{ position: [0, 1.5, 3] }}>
          <color attach="background" args={['#0a0a0a']} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 5, 3]} />
          <Environment preset="studio" />
          <mesh position={[0, 1, 0]}>
            <capsuleGeometry args={[0.35, 1.3, 4, 16]} />
            <meshStandardMaterial color={skin} />
          </mesh>
          <mesh position={[0, 1.9, 0]}>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial color={hair} />
          </mesh>
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>
      <div className="p-8 flex flex-col justify-center space-y-6">
        <h1 className="text-4xl font-serif">Create yourself</h1>
        <div>
          <label className="text-sm text-white/60">Skin tone</label>
          <input type="color" value={skin} onChange={(e) => setSkin(e.target.value)} className="w-full h-12 mt-2 rounded" />
        </div>
        <div>
          <label className="text-sm text-white/60">Hair color</label>
          <input type="color" value={hair} onChange={(e) => setHair(e.target.value)} className="w-full h-12 mt-2 rounded" />
        </div>
        <button
          onClick={() => router.push('/interview')}
          className="bg-white text-black py-3 rounded-full"
        >
          Continue
        </button>
      </div>
    </main>
  );
}