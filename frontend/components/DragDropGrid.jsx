
import { useState, useEffect } from "react";

export default function DragDropGrid({ aircraft }) {
  const [items, setItems] = useState([
    { id: 1, label: "Cargo 1", weight: 1000, x: 10, y: 10, type: "cargo" },
    { id: 2, label: "Personnel A", weight: 200, x: 80, y: 10, type: "personnel" },
  ]);
  const [cgStatus, setCgStatus] = useState(null);

  const onDrag = (e, id) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, x: e.clientX - 100, y: e.clientY - 50 } : item
    );
    setItems(updated);
  };

  useEffect(() => {
    const payload = {
      aircraft: aircraft,
      cargo: items.filter(i => i.type === "cargo").map(i => ({
        name: i.label,
        weight: i.weight,
        length: 1,
        width: 1,
        height: 1,
        position: i.x / 10
      })),
      personnel: items.filter(i => i.type === "personnel").map(i => ({
        name: i.label,
        weight: i.weight,
        position: i.x / 10
      }))
    };

    fetch("http://localhost:10000/check-cg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).then(res => res.json()).then(data => {
      setCgStatus(data);
    }).catch(err => console.error("CG Error:", err));
  }, [items, aircraft]);

  const layoutFile = {
    "C-130J": "/layouts/c130.svg",
    "C-17": "/layouts/c17.svg",
    "C-5": "/layouts/c5.svg"
  }[aircraft];

  return (
    <div className="relative border bg-white shadow-md p-4">
      <img src={layoutFile} alt="Layout" className="w-full h-auto mb-4"/>
      <div className="relative -mt-[100px] h-[100px]">
        {items.map(item => (
          <div
            key={item.id}
            onMouseDown={e => onDrag(e, item.id)}
            className={\`absolute p-2 rounded cursor-move \${item.type === "cargo" ? "bg-blue-500" : "bg-green-500"} text-white text-xs\`}
            style={{ left: item.x, top: item.y }}
          >
            {item.label} ({item.weight} lbs)
          </div>
        ))}
      </div>
      {cgStatus && (
        <div className="mt-4 p-2 border rounded bg-gray-100">
          <p><strong>CG:</strong> {cgStatus.cg.toFixed(2)} ft</p>
          <p><strong>Limits:</strong> {cgStatus.limits[0]}–{cgStatus.limits[1]} ft</p>
          <p>
            <strong>Status:</strong> {cgStatus.within_limits ? (
              <span className="text-green-600">Safe</span>
            ) : (
              <span className="text-red-600">Outside Safe Zone!</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
