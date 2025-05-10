"use client";

import React from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

export const RatingChart = ({
  totalRatings,
  averageRating,
}: {
  totalRatings: number;
  averageRating: number;
}) => {
  const negative = 5 - averageRating;

  const data = [
    { name: "Positive", value: averageRating, fill: "#2ecc71" },
    { name: "Negative", value: negative, fill: "#e74c3c" },
  ];

  return (
    <div className="bg-white p-4 rounded-md h-80 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Ratings</h1>
      </div>

      <ResponsiveContainer width={"100%"} height={"100%"}>
        <PieChart>
          <Pie
            dataKey={"value"}
            startAngle={180}
            endAngle={0}
            data={data}
            cx={"50%"}
            cy={"50%"}
            innerRadius={70}
            fill="#8884d8"
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-2xl font-bold">{averageRating?.toFixed(1)}</h1>
        <p className="text-xs text-gray-500">of max ratings</p>
      </div>

      <h2 className="font-medium absolute bottom-16 left-0 right-0 m-auto text-center">
        Rated by {totalRatings} patients
      </h2>
    </div>
  );
};
