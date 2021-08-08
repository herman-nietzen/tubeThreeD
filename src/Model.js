import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { useLoader, useThree } from "react-three-fiber";
import {
  useHelper,
  useMatcapTexture,
  ContactShadows,
  Environment
} from "@react-three/drei";
import InnerHose from "./assets/inner_tube.stl";
import Textile from "./assets/textile.stl";
import OuterHose from "./assets/outer_tube.stl";
import Reinforcement from "./assets/reinforcement_medium.stl";
import Meter from "./assets/meter.stl";
import highside from "./assets/high_side.png";
import flatside from "./assets/flat_side.png";

import { TextureLoader } from "three/src/loaders/TextureLoader.js";

import adapterTc from "./assets/adapter_tc.stl";
import adapterWeld from "./assets/adapter_weld2.stl";
//(Math.PI / 2) --> 90 degrees

function Highsideplane() {
  const texture = useLoader(THREE.TextureLoader, highside);
  return (
    <mesh position={[0, 0, -100]} rotation={[0, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[235, 35]} />
      <meshBasicMaterial
        attach="material"
        map={texture}
        toneMapped={true}
        transparent={true}
        opacity={0.4}
      />
    </mesh>
  );
}

function Flatsideplane() {
  const texture = useLoader(THREE.TextureLoader, flatside);
  return (
    <mesh position={[0, 15, -107.5]} rotation={[1.5 * Math.PI, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[235, 15]} />
      <meshBasicMaterial
        attach="material"
        map={texture}
        toneMapped={false}
        transparent={true}
        opacity={0.4}
      />
    </mesh>
  );
}
export const Model = (props) => {
  //const texture_1 = useLoader(TextureLoader, 'textures/dice_1.jpg');
  const ref = useRef();
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(ref.current.position);
  });

  const [matcapStainless] = useMatcapTexture("525050_D4D3D3_959393_ACACAC");
  const geomAdapter = useLoader(STLLoader, props.stlmodel);

  const [matcapPTFE] = useMatcapTexture("C8C8C8_3F3F3F_787878_5C5C5C");
  const geomInnerhose = useLoader(STLLoader, InnerHose);

  const [matcapTextile] = useMatcapTexture("5B5428_C5A052_A28B46_ADA752");
  const geomTextile = useLoader(STLLoader, Textile);

  const geomOuterhose = useLoader(STLLoader, OuterHose);

  const ReinForcement = useLoader(STLLoader, Reinforcement);

  const [matcapSilicone] = useMatcapTexture("C4C6C6_4D5756_646463_7A8080");
  //C4C6C6_4D5756_646463_7A8080
  // this is the shiny material but lets use the mat one for now
  // same for silicone and ptfe

  const [matcapGrey] = useMatcapTexture("4F4F4F_9C9C9C_121212_7C7C7C");

  const [matcapBlack] = useMatcapTexture("050505_747474_4C4C4C_333333");

  let positionAdapter = [0, 0, 0];
  let scalingfactor;

  scalingfactor = props.outerdiameter / (19 * 2);

  if (props.stlmodel == adapterWeld) {
    positionAdapter = [120, 0, 0];
  }

  if (props.stlmodel == adapterTc) {
    positionAdapter = [110, 0, 0];
  }

  const HighSide = useLoader(TextureLoader, highside);
  const FlatSide = useLoader(TextureLoader, flatside);

  let reinforcementVisible = true;
  let innerHosemat = matcapSilicone;
  let outerHosemat = matcapSilicone;
  let transparency = false;

  if (props.hoseselection == "EXT") {
    reinforcementVisible = false;
    transparency = true;
  }

  if (props.hoseselection == "SIL") {
  }

  if (props.hoseselection == "PTFE") {
    innerHosemat = matcapPTFE;
  }

  if (props.hoseselection == "PTFEFC") {
    innerHosemat = matcapBlack;
    outerHosemat = matcapGrey;
  }

  return (
    <>
      <Highsideplane />
      <Flatsideplane />

      <mesh
        ref={ref}
        position={[0, 0, 0]}
        scale={[1, scalingfactor, scalingfactor]}
        visible={reinforcementVisible}
      >
        <primitive object={ReinForcement} attach="geometry" />
        <meshMatcapMaterial matcap={matcapStainless} />
      </mesh>

      <mesh
        ref={ref}
        position={[0, 0, 0]}
        scale={[1, scalingfactor, scalingfactor]}
      >
        <primitive object={geomInnerhose} attach="geometry" />
        <meshMatcapMaterial
          matcap={innerHosemat}
          transparent={transparency}
          opacity={0.6}
        />
      </mesh>

      <mesh
        ref={ref}
        position={[0, 0, 0]}
        scale={[1, scalingfactor, scalingfactor]}
        visible={reinforcementVisible}
      >
        <primitive object={geomTextile} attach="geometry" />
        <meshMatcapMaterial matcap={matcapTextile} />
      </mesh>

      <mesh
        ref={ref}
        position={[0, 0, 0]}
        scale={[1, scalingfactor, scalingfactor]}
      >
        <primitive object={geomOuterhose} attach="geometry" />
        <meshMatcapMaterial
          matcap={outerHosemat}
          transparent={transparency}
          opacity={0.6}
        />
      </mesh>

      <mesh
        ref={ref}
        position={positionAdapter}
        scale={[scalingfactor, scalingfactor, scalingfactor]}
        castShadow
      >
        <primitive object={geomAdapter} attach="geometry" castShadow />
        <meshMatcapMaterial matcap={matcapStainless} />
      </mesh>
      <Environment preset="city" />
      <ContactShadows
        rotation-x={Math.PI / 2}
        position={[0, -0.8, 0]}
        opacity={0.25}
        width={10}
        height={10}
        blur={1.5}
        far={0.8}
      />

      <pointLight position={[10, 10, 10]} castShadow />
    </>
  );
};
