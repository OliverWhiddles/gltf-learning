
import './App.css';

import ReactDOM from 'react-dom'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import * as influence from 'influence-utils'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Suspense } from 'react'
import { OrbitControls } from "@react-three/drei";

function App() {

  const SystemGridModel = () => {
    const gltf = useLoader(GLTFLoader, "./data/system_grid.gltf");
    return (
      <> 
        <primitive object={gltf.scene} scale={1.0} />
      </>
    );
  };

  // load the roid data
  const owned_asteroids = require("./data/owned_asteroids.json");
  //owned_asteroids.forEach(roid => {
  //  console.log(`${roid.baseName}`);
  //});


  const roid_orbit = new influence.KeplerianOrbit( owned_asteroids[0] )
  const roid_orbit_points = roid_orbit.getSmoothOrbit(100);
  const points = []
  
  for( let i = 0; i < roid_orbit_points.length;i++)
  {
    points.push(new THREE.Vector3(roid_orbit_points[i].x, roid_orbit_points[i].y, roid_orbit_points[i].y));
    console.log( roid_orbit_points[i].x );
  }

  points.push( points[0] );

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <div id="canvas-container">
        <Canvas>
          <Suspense fallback={null}>
            <ambientLight intensity={0.1} />
            <SystemGridModel />
            <OrbitControls />
          </Suspense>  
        </Canvas>
    </div>
  );
}

export default App;
