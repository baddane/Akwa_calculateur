"use client";

import { useState } from "react";
import Wizard from "./Wizard";
import Calculators from "./Calculators";

export default function Home() {
  const [expert, setExpert] = useState(false);
  if (!expert) return <Wizard onExpert={() => setExpert(true)} />;
  return (
    <>
      <p className="wiz-esc" style={{ textAlign: "left", margin: "22px 0 0" }}>
        <button className="lnk lnk-u" onClick={() => setExpert(false)}>Revenir à l&apos;assistant guidé</button>
      </p>
      <Calculators />
    </>
  );
}
