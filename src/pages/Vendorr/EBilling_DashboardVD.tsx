import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type DonutData = {
  name: string;
  value: number;
};

type BarData = {
  name: string;
  value: number;
};

// สีใช้กับทั้ง Donut และ Bar
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A855F7"];

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: 16,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        width: "100%",
        height: 360,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
        {title}
      </div>
      <div style={{ flex: 1, width: "100%" }}>{children}</div>
    </div>
  );
};

function EBilling_DashboardVD() {
  // ✅ Donut Chart
  const donutData: DonutData[] = [
    { name: "Paid", value: 60 },
    { name: "Unpaid", value: 30 },
    { name: "Cancel", value: 10 },
  ];
  const donutTotal = donutData.reduce((sum, item) => sum + item.value, 0);

  // ✅ Bar Chart
  const barData: BarData[] = [
    { name: "Mon", value: 12 },
    { name: "Tue", value: 18 },
    { name: "Wed", value: 9 },
    { name: "Thu", value: 22 },
    { name: "Fri", value: 15 },
    { name: "Sat", value: 7 },
    { name: "Sun", value: 10 },
  ];

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        padding: 20,
        background: "#f5f6f8",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ marginBottom: 16 }}>EBilling Dashboard VD</h2>

      {/* 2 กราฟ responsive */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(520px, 1fr))",
          gap: 16,
          width: "100%",
        }}
      >
        {/* Donut Chart */}
        <Card title="Payment Status (Donut)">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                innerRadius="45%" 
                outerRadius="80%"
                paddingAngle={2}
              >
                {donutData.map((_, index) => (
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
                {donutTotal}
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
        </Card>

        {/* Bar Chart */}
        <Card title="Invoice per Day (Bar)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />

              {/* 🔥 แต่ละแท่งสีต่างกัน */}
              <Bar dataKey="value">
                {barData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

export default EBilling_DashboardVD;
