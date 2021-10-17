
import './App.css';

import ReactDOM from 'react-dom'
import { extend, Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import * as influence from 'influence-utils'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Suspense } from 'react'
import { OrbitControls } from "@react-three/drei";

//const THREE = require('three');
const MeshLine = require('three.meshline').MeshLine;
const MeshLineMaterial = require('three.meshline').MeshLineMaterial;
const MeshLineRaycast = require('three.meshline').MeshLineRaycast;

//import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';
//import * as meshline from 'threejs-meshline'

extend({ MeshLine, MeshLineMaterial })

function Line({ points, width, color}) {
  return (
    <mesh>
      <meshLine attach="geometry" vertices={points} />
      <meshLineMaterial attach="material" transparent depthTest={false} lineWidth={width} color={color} />
    </mesh>
  )
}

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
            {/* <line geometry={lineGeometry}>
              <lineBasicMaterial attach="material" color={'#9c88ff'} linewidth={10} />
            </line> */}
            {/* <DrawMeshLine curve={points} width={1} color="red" /> */}
            <mesh raycast={MeshLineRaycast}>
              <meshLine attach="geometry" points={points} />
              <meshLineMaterial
                attach="material"
                transparent
                depthTest={false}
                sizeAttenuation={0}
                lineWidth={0.01}
                color={'#9c88ff'}
              />
            </mesh>
            <OrbitControls />
          </Suspense>  
        </Canvas>
    </div>
  );
}

export default App;
