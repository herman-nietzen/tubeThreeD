import "./styles.css";
import React, { Suspense, useState } from "react";
import { Canvas } from "react-three-fiber";
import { Model } from "./Model";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
// The model path needs to be available here since we can
// not pass the literal variable ?!
import adapterTc from "./assets/adapter_tc.stl";
import adapterWeld from "./assets/adapter_weld2.stl";

function App() {
  const [adapterType, setInput] = useState(adapterTc);
  const [hoseType, setHose] = useState("PTFE");

  let outerDiameter = 19 * 2;

  return (
    <div className="App">
      <h1>{adapterType}</h1>

      <button type="button" onClick={() => setInput(adapterTc)}>
        TC END
      </button>

      <button type="button" onClick={() => setInput(adapterWeld)}>
        WELDING END
      </button>

      <br />

      <button type="button" onClick={() => setHose("EXT")}>
        EXT
      </button>

      <button type="button" onClick={() => setHose("SIL")}>
        SIL
      </button>

      <button type="button" onClick={() => setHose("PTFE")}>
        PTFE
      </button>

      <button type="button" onClick={() => setHose("PTFEFC")}>
        PTFEFC
      </button>

      <Canvas orthographic camera={{ zoom: 2, position: [0, 30, 100] }}>
        <Suspense fallback={null}>
          <Model
            stlmodel={adapterType}
            hoseselection={hoseType}
            outerdiameter={outerDiameter}
          />

          <ContactShadows
            rotation-x={Math.PI / 2}
            position={[0, -0.8, 0]}
            opacity={0.25}
            width={10}
            height={10}
            blur={1.5}
            far={0.8}
          />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
