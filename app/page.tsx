"use client";

import { useState } from "react";

const RATES_HOME = [
  { max: 150, rate: 3.2484 },
  { max: 400, rate: 4.2218 },
  { max: Infinity, rate: 4.4217 },
];

const FT_RATE = 0.3972;

function calcElectric(units: number) {
  let remaining = units;
  let prev = 0;
  let base = 0;
  const rows: { range: string; units: number; rate: number; cost: number }[] = [];

  for (const b of RATES_HOME) {
    if (remaining <= 0) break;
    const u = Math.min(remaining, b.max - prev);
    const cost = u * b.rate;
    base += cost;
    rows.push({
      range: `${prev + 1} - ${b.max === Infinity ? "∞" : b.max}`,
      units: u,
      rate: b.rate,
      cost,
    });
    remaining -= u;
    prev = b.max;
  }

  const ft = units * FT_RATE;
  const beforeVat = base + ft;
  const vat = beforeVat * 0.07;
  const total = beforeVat + vat;

  return { rows, base, ft, beforeVat, vat, total };
}

export default function Page() {
  const [units, setUnits] = useState("");
  const [type, setType] = useState("home");
  const [result, setResult] = useState<ReturnType<typeof calcElectric> | null>(null);

  function calculate() {
    const u = Number(units);
    if (u <= 0) return alert("กรุณากรอกหน่วยไฟฟ้า");
    setResult(calcElectric(u));
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">คำนวณค่าไฟฟ้า</h1>
      <div className="space-y-3">
        <input className="border p-2 w-full" type="number" placeholder="หน่วยไฟฟ้า (kWh)" value={units} onChange={(e) => setUnits(e.target.value)} />
        <select className="border p-2 w-full" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="home">บ้านอยู่อาศัย</option>
          <option value="business">กิจการขนาดเล็ก</option>
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 w-full" onClick={calculate}>คำนวณ</button>
      </div>
      {result && (
        <div className="mt-6 space-y-2">
          <table className="w-full border text-sm">
            <thead><tr className="bg-gray-100"><th className="border p-1">ช่วง</th><th className="border p-1">หน่วย</th><th className="border p-1">อัตรา</th><th className="border p-1">ค่าไฟ</th></tr></thead>
            <tbody>
              {result.rows.map((r, i) => (
                <tr key={i}><td className="border p-1">{r.range}</td><td className="border p-1">{r.units.toFixed(0)}</td><td className="border p-1">{r.rate}</td><td className="border p-1">{r.cost.toFixed(2)}</td></tr>
              ))}
            </tbody>
          </table>
          <p>ค่าไฟฐาน: {result.base.toFixed(2)} บาท</p>
          <p>ค่า Ft: {result.ft.toFixed(2)} บาท</p>
          <p>ก่อน VAT: {result.beforeVat.toFixed(2)} บาท</p>
          <p>VAT 7%: {result.vat.toFixed(2)} บาท</p>
          <p className="text-2xl font-bold text-red-600">ยอดรวม: {result.total.toFixed(2)} บาท</p>
        </div>
      )}
    </div>
  );
}
