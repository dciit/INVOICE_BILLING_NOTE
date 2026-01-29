import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type DonutData = {
  name: string;
  value: number;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A855F7"];

const DonutCard = ({
  title,
  data,
}: {
  title: string;
  data: DonutData[];
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        height: 320,
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
        {title}
      </div>

      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={105}
              paddingAngle={2}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />

            {/* ข้อความตรงกลาง */}
            <text
              x="50%"
              y="48%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: 18, fontWeight: 700 }}
            >
              {total}
            </text>
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: 12, fill: "#666" }}
            >
              Total
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

function EBilling_DashboardAC() {
  // 🔥 ตัวอย่างข้อมูล 4 กราฟ (ปรับตามจริงได้เลย)
  const chart1: DonutData[] = [
    { name: "IOT", value: 40 },
    { name: "ALPHA", value: 25 },
    { name: "MANUAL", value: 20 },
    { name: "GENERAL", value: 15 },
  ];

  const chart2: DonutData[] = [
    { name: "Paid", value: 60 },
    { name: "Unpaid", value: 30 },
    { name: "Cancel", value: 10 },
  ];

  const chart3: DonutData[] = [
    { name: "Success", value: 75 },
    { name: "Reject", value: 20 },
    { name: "Pending", value: 5 },
  ];

  const chart4: DonutData[] = [
    { name: "Vendor A", value: 30 },
    { name: "Vendor B", value: 25 },
    { name: "Vendor C", value: 20 },
    { name: "Vendor D", value: 25 },
  ];

  return (
    <div style={{ padding: 20, background: "#f5f6f8", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: 16 }}>EBilling Dashboard</h2>

      {/* Grid 4 กราฟ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        <DonutCard title="Invoice by Category" data={chart1} />
        <DonutCard title="Payment Status" data={chart2} />
        <DonutCard title="Confirm Result" data={chart3} />
        <DonutCard title="Top Vendors" data={chart4} />
      </div>
    </div>
  );
}

export default EBilling_DashboardAC;
