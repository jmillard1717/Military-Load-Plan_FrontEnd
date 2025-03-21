import DragDropGrid from "../components/DragDropGrid";

import { useState } from "react";
import jsPDF from "jspdf";

const aircraftTypes = {
  "C-130J": 155000,
  "C-17": 585000,
  "C-5": 840000,
};

export default function Home() {
  const [aircraft, setAircraft] = useState("C-130J");
  const [cargoItems, setCargoItems] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [newCargo, setNewCargo] = useState({ name: "", weight: "", length: "", width: "", height: "" });
  const [newPerson, setNewPerson] = useState({ name: "", weight: "" });

  const totalCargoWeight = cargoItems.reduce((sum, item) => sum + parseFloat(item.weight || 0), 0);
  const totalPersonnelWeight = personnel.reduce((sum, p) => sum + parseFloat(p.weight || 0), 0);
  const totalWeight = totalCargoWeight + totalPersonnelWeight;
  const maxWeight = aircraftTypes[aircraft];
  const overLimit = totalWeight > maxWeight;

  const addCargo = () => {
    setCargoItems([...cargoItems, newCargo]);
    setNewCargo({ name: "", weight: "", length: "", width: "", height: "" });
  };

  const addPersonnel = () => {
    setPersonnel([...personnel, newPerson]);
    setNewPerson({ name: "", weight: "" });
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Load Plan for ${aircraft}`, 10, 10);
    doc.text(`Total Cargo Weight: ${totalCargoWeight} lbs`, 10, 20);
    doc.text(`Total Personnel Weight: ${totalPersonnelWeight} lbs`, 10, 30);
    doc.text(`Combined Weight: ${totalWeight} lbs`, 10, 40);
    doc.text(`Limit: ${maxWeight} lbs`, 10, 50);
    if (overLimit) doc.text("WARNING: OVERWEIGHT!", 10, 60);

    doc.save("load_plan.pdf");
  };

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Military Airlift Load Planner</h1>

      <div className="space-y-4">
        <label>Aircraft:
          <select value={aircraft} onChange={e => setAircraft(e.target.value)} className="ml-2 border">
            {Object.keys(aircraftTypes).map(type => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <div>
          <strong>Total Weight:</strong> {totalWeight} lbs / {maxWeight} lbs
          {overLimit && <span className="text-red-600 ml-4">Overweight!</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold">Cargo</h2>
          {cargoItems.map((item, i) => (
            <div key={i} className="border p-2">{item.name} - {item.weight} lbs</div>
          ))}
          <input placeholder="Name" value={newCargo.name} onChange={e => setNewCargo({...newCargo, name: e.target.value})} className="border p-1 mr-2"/>
          <input placeholder="Weight" value={newCargo.weight} onChange={e => setNewCargo({...newCargo, weight: e.target.value})} className="border p-1 mr-2"/>
          <button onClick={addCargo} className="bg-blue-500 text-white px-2 py-1">Add Cargo</button>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Personnel</h2>
          {personnel.map((p, i) => (
            <div key={i} className="border p-2">{p.name} - {p.weight} lbs</div>
          ))}
          <input placeholder="Name" value={newPerson.name} onChange={e => setNewPerson({...newPerson, name: e.target.value})} className="border p-1 mr-2"/>
          <input placeholder="Weight" value={newPerson.weight} onChange={e => setNewPerson({...newPerson, weight: e.target.value})} className="border p-1 mr-2"/>
          <button onClick={addPersonnel} className="bg-green-500 text-white px-2 py-1">Add Personnel</button>
        </div>
      </div>

      <button onClick={exportPDF} className="bg-black text-white px-4 py-2 mt-6">Export Load Plan PDF</button>
    <div className="mt-10">
  <h2 className="text-xl font-bold mb-2">Aircraft Layout: {aircraft}</h2>
  <DragDropGrid aircraft={aircraft} />
</div>
</main>
  );
}
