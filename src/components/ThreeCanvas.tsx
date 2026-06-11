'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Helper to create smooth, rounded 3D boxes for the monitor's physical casing
function createRoundedBox(width: number, height: number, depth: number, radius: number): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  
  const extrudeSettings = {
    depth: depth,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 2,
    bevelSize: 0.3,
    bevelThickness: 0.3,
  };
  
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center(); // Ensures position.set() acts on the exact center
  return geo;
}

function createMonitorObject(): { group: THREE.Group, bodyGroup: THREE.Group, screenMesh: THREE.Mesh } {
  const group = new THREE.Group();
  const bodyGroup = new THREE.Group(); // Holds the swiveling parts (screen, casing)
  
  // Theme Colors
  const casingColor = 0xE1DDD5; // Soft beige
  const outlineColor = 0x604D67; // Muted plum
  const bezelColor = 0x5E5F84; // Soft purple/gray
  const btnColor = 0xEF690B; // Soft orange
  
  const casingMat = new THREE.MeshStandardMaterial({
    color: casingColor,
    roughness: 0.8,
    metalness: 0.1,
  });
  
  const lineMat = new THREE.LineBasicMaterial({ color: outlineColor, linewidth: 2 });

  // 1. Main Casing (Smooth, rounded exterior)
  const casingGeo = createRoundedBox(18, 14, 12, 1.5);
  const casing = new THREE.Mesh(casingGeo, casingMat);
  casing.add(new THREE.LineSegments(new THREE.EdgesGeometry(casingGeo, 15), lineMat));
  bodyGroup.add(casing);

  // 2. The Back Tube Housing (tapered retro back, very rounded)
  const backGeo = createRoundedBox(12, 10, 8, 2.5);
  const backMesh = new THREE.Mesh(backGeo, casingMat);
  backMesh.position.set(0, 0, -10);
  backMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(backGeo, 15), lineMat));
  bodyGroup.add(backMesh);

  // 3. Front Bezel (Smooth frame)
  const bezelGeo = createRoundedBox(16.5, 12.5, 1.5, 1.2);
  const bezelMat = new THREE.MeshStandardMaterial({
    color: bezelColor,
    roughness: 0.9,
  });
  const bezel = new THREE.Mesh(bezelGeo, bezelMat);
  bezel.position.set(0, 0, 6.5);
  bodyGroup.add(bezel);

  // 4. Curved CRT Glass Screen
  // Create a high-res plane and push the center vertices outward to form a convex glass bulge
  const screenGeo = new THREE.PlaneGeometry(14.5, 10.5, 32, 32);
  const posAttr = screenGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    
    // Normalize coordinates (-1 to 1)
    const xNorm = x / 7.25; 
    const yNorm = y / 5.25;
    
    // Parabolic curve equation for the CRT bulge
    const z = (1 - (xNorm * xNorm * 0.4 + yNorm * yNorm * 0.4)) * 1.5; 
    posAttr.setZ(i, z);
  }
  screenGeo.computeVertexNormals();

  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.1, // Shiny glass reflection
    metalness: 0.8,
    transparent: true,
    alphaTest: 0.5, // Discards the sharp corners, leaving a rounded screen shape
  });
  
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(0, 0, 7.3); // Positioned slightly in front of the bezel hole
  bodyGroup.add(screenMesh);

  // 6. Details (Power Button)
  const btnGeo = new THREE.BoxGeometry(1.5, 0.8, 0.5);
  const btnMesh = new THREE.Mesh(btnGeo, new THREE.MeshStandardMaterial({ color: btnColor }));
  // Moved down to -5.75 so it sits perfectly on the bottom bezel, below the screen (-5.25)
  // Moved left to 5.5 to prevent it from clipping into the outer rounded corner curve
  btnMesh.position.set(5.5, -5.75, 7.4);
  bodyGroup.add(btnMesh);

  // Attach swiveling body to the main group, shifted up to sit on the neck
  bodyGroup.position.set(0, 1, 0);
  group.add(bodyGroup);

  // 5. Stand / Neck (Attached directly to main group so it stays flat)
  const neckGeo = new THREE.CylinderGeometry(2, 3, 4, 16);
  const neckMesh = new THREE.Mesh(neckGeo, casingMat);
  neckMesh.position.set(0, -7, 0);
  group.add(neckMesh);

  // Fix: Base height is 1.5, so max corner radius is 0.75. Using 0.5 prevents geometry mangling!
  const baseGeo = createRoundedBox(12, 1.5, 10, 0.5);
  const baseMesh = new THREE.Mesh(baseGeo, casingMat);
  baseMesh.position.set(0, -9.5, 0);
  baseMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(baseGeo, 15), lineMat));
  group.add(baseMesh);

  // Scale to fit background nicely
  group.scale.set(1.0, 1.0, 1.0);
  return { group, bodyGroup, screenMesh };
}

export default function ThreeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(20, 30, 20);
    scene.add(dirLight);

    // 3. Spawn Monitor
    const { group: monitor, bodyGroup, screenMesh } = createMonitorObject();
    
    // Position the monitor in space
    monitor.position.set(24, 2, -15);
    
    // Negative Y turns the monitor face towards the left (-X axis).
    // Now it looks inward towards the center of the webpage where the user is!
    monitor.rotation.y = -0.6; 
    
    // X-rotation (Up/Down tilt) applies ONLY to the body, so the base stays flat on the desk!
    bodyGroup.rotation.x = 0.05;

    // Hide monitor entirely on small screens as requested
    if (window.innerWidth < 768) {
      monitor.visible = false;
    }

    scene.add(monitor);

    // 4. Terminal Effect Setup (Mapped onto curved CRT screen)
    const canvas2d = document.createElement('canvas');
    canvas2d.width = 1024; // High res for smooth curved rendering
    canvas2d.height = 768;
    const ctx = canvas2d.getContext('2d')!;
    
    const texture = new THREE.CanvasTexture(canvas2d);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    const mat = screenMesh.material as THREE.MeshStandardMaterial;
    mat.map = texture;
    mat.emissiveMap = texture;
    mat.emissive = new THREE.Color(0xffffff);
    mat.emissiveIntensity = 0.9;

    const terminalLines = [
      "SYSTEM BOOT SEQUENCE INITIATED...",
      "LOADING KERNEL MODULES... [OK]",
      "ESTABLISHING SECURE CONNECTION...",
      "ACCESS GRANTED.",
      "WELCOME ELIJAH.",
      "root@server:~# "
    ];
    let currentLine = 0;
    let currentChar = 0;
    let textRows: string[] = [];
    
    let lastTime = Date.now();
    let blinkState = true;
    
    const drawTerminal = () => {
      // Clear canvas to transparent so alphaTest can discard the corners
      ctx.clearRect(0, 0, canvas2d.width, canvas2d.height);
      
      ctx.save();
      
      // Create a retro rounded rectangle clipping mask for the screen
      const radius = 100;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(canvas2d.width - radius, 0);
      ctx.quadraticCurveTo(canvas2d.width, 0, canvas2d.width, radius);
      ctx.lineTo(canvas2d.width, canvas2d.height - radius);
      ctx.quadraticCurveTo(canvas2d.width, canvas2d.height, canvas2d.width - radius, canvas2d.height);
      ctx.lineTo(radius, canvas2d.height);
      ctx.quadraticCurveTo(0, canvas2d.height, 0, canvas2d.height - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      
      ctx.clip();

      // Background
      ctx.fillStyle = '#352323'; 
      ctx.fillRect(0, 0, canvas2d.width, canvas2d.height);
      
      // CRT Scanline effect overlaid via gradient
      const grad = ctx.createLinearGradient(0, 0, 0, canvas2d.height);
      for (let i = 0; i <= 1; i += 0.05) {
        grad.addColorStop(i, i % 0.1 === 0 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0)");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas2d.width, canvas2d.height);
      
      // Text
      ctx.fillStyle = '#EFAF16'; 
      ctx.font = '36px "Courier New", Courier, monospace';
      ctx.textBaseline = 'top';
      
      let y = 60; // Push text down to avoid being clipped by rounded corners
      for (let i = 0; i < textRows.length; i++) {
        ctx.fillText(textRows[i], 60, y);
        y += 50;
      }
      
      // Draw typing line
      if (currentLine < terminalLines.length) {
        let lineText = terminalLines[currentLine].substring(0, currentChar);
        if (blinkState) lineText += '█';
        ctx.fillText(lineText, 60, y);
      } else {
        if (blinkState) ctx.fillText('█', 60, y);
      }
      
      ctx.restore();
      texture.needsUpdate = true;
    };

    // 5. Render Loop
    let animationFrameId: number;
    let typeTimer = 0;
    let blinkTimer = 0;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      
      const now = Date.now();
      const dt = now - lastTime;
      lastTime = now;
      
      blinkTimer += dt;
      if (blinkTimer > 500) {
        blinkState = !blinkState;
        blinkTimer = 0;
        drawTerminal();
      }
      
      typeTimer += dt;
      if (typeTimer > 50 && currentLine < terminalLines.length) {
        typeTimer = 0;
        
        if (currentLine === terminalLines.length - 1) {
          textRows.push(terminalLines[currentLine]);
          currentLine++;
          drawTerminal();
        } else {
          currentChar++;
          if (currentChar > terminalLines[currentLine].length) {
            textRows.push(terminalLines[currentLine]);
            currentLine++;
            currentChar = 0;
            typeTimer = -300; 
            
            if (textRows.length > 10) {
              textRows.shift();
            }
          }
          drawTerminal();
        }
      }

      renderer.render(scene, camera);
    };
    drawTerminal();
    render();

    // 6. Handle Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      if (window.innerWidth < 768) {
        monitor.visible = false;
      } else {
        monitor.visible = true;
        monitor.position.set(24, 2, -15);
        monitor.rotation.y = -0.6;
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      texture.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: -2, pointerEvents: 'none', width: '100%', height: '100vh' }} />;
}
