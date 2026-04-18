import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";


function CraneModel({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/crane.glb") as any;

  // cria material UMA vez por cor
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.55,
      metalness: 0.05,
      flatShading: true,
    });
  }, [color]);

  // aplica material quando necessário
  useEffect(() => {
    scene.traverse((obj: any) => {
      if (obj.isMesh) {
        obj.material = material;
      }
    });
  }, [scene, material]);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.6;
    }
  });

  // centraliza o modelo
  return (
    <group ref={group}>
      <Center>
        <group position={[0, 0, 0]}>
          <primitive object={scene} scale={0.015} />
        </group>
      </Center>
    </group>
  );
}

useGLTF.preload("/crane.glb");

export function Crane3D({ color }: { color: string }) {
  return (
    <Canvas 
      camera={{ position: [0, 0.5, 3.2], fov: 35 }} dpr={[1, 2]}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 2]} intensity={1.1} />
      <directionalLight position={[-3, -2, -2]} intensity={0.4} />

      <Suspense fallback={null}>
        <CraneModel color={color} />
      </Suspense>
    </Canvas>
  );
}