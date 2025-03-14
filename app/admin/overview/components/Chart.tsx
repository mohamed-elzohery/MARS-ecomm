"use client";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import React from "react";

const Chart: React.FC<{
  data: {
    month: string;
    total: number;
  }[];
}> = ({ data }) => {
  // Create a reversed copy of the data array
  const reversedData = [...data].reverse();

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={reversedData}
        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="month" tick={{ fill: "#333" }} />
        <YAxis tickFormatter={(value) => `$${value}`} tick={{ fill: "#333" }} />
        <Tooltip
          formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
          labelFormatter={(label) => `Month: ${label}`}
          contentStyle={{ backgroundColor: "#fff", border: "1px solid #444" }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          name="Monthly Revenue"
          stroke="#000"
          activeDot={{ r: 6, stroke: "#000", strokeWidth: 1, fill: "#fff" }}
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 1, fill: "#fff", stroke: "#000" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
