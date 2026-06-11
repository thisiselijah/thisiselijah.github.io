'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import iconsData from '../icons.json';

type IconData = {
  github: number[][];
  linkedin: number[][];
  gmail: number[][];
  cv: number[][];
};

const iconGrids = iconsData as IconData;

export default function ThreeIcon({ type }: { type: 'github' | 'linkedin' | 'email' | 'cv' }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    
    // Orthographic Camera for a perfectly flat 2D projection
    // Frustum is exactly matched to our new 16x16 chunky pixel grid
    const camera = new THREE.OrthographicCamera(-8, 8, 8, -8, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(22, 22);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const grid = type === 'email' ? iconGrids.gmail : iconGrids[type];
    const size = grid.length; // 16
    
    let count = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (grid[y][x] !== -1) count++;
      }
    }

    const geometry = new THREE.PlaneGeometry(0.9, 0.9);
    const material = new THREE.MeshBasicMaterial();
    
    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    instancedMesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    
    let index = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let hex = grid[y][x];
        if (hex !== -1) {
          dummy.position.set(x - size/2 + 0.5, -y + size/2 - 0.5, 0);
          dummy.updateMatrix();
          instancedMesh.setMatrixAt(index, dummy.matrix);
          
          // Convert the original pixel color to grayscale
          color.setHex(hex);
          const gray = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
          color.setRGB(gray, gray, gray);
          instancedMesh.setColorAt(index, color);
          index++;
        }
      }
    }
    
    scene.add(instancedMesh);

    const element = mountRef.current;
    let frameId: number;
    const render = () => {
      frameId = requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frameId);
      if (renderer.domElement && element.contains(renderer.domElement)) {
        element.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [type]);

  return <div ref={mountRef} className="header-icon" style={{ width: 22, height: 22 }} />;
}
