import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";

export default function BarChartComponent() {
  const chartSetting = {
    yAxis: [
      {
        label: "Bolivares (K)",
      },
    ],
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-10px, 0)",
      },
    },
  };
  const barColors = ["yellow", "blue", "red", "green"];
  return (
    <div className="graph">
      <BarChart
        colors={barColors}
        series={[
          { data: [51, 5, 49, 31, 51, 45, 49, 31, 51, 19, 69, 41] },
          { data: [15, 25, 30, 50, 5, 54, 49, 31, 51, 40, 29, 21] },
          { data: [60, 50, 15, 25, 61, 35, 44, 24, 34, 51, 19, 11] },
          { data: [35, 44, 24, 34, 41, 25, 49, 31, 51, 60, 49, 61] },
        ]}
        height={290}
        xAxis={[
          {
            data: [
              "Enero",
              "Febrero",
              "Marzo",
              "Abril",
              "Mayo",
              "Junio",
              "Julio",
              "Agosto",
              "Septiembre",
              "Octubre",
              "Noviembre",
              "Diciembre",
            ],
            scaleType: "band",
          },
        ]}
        margin={{ top: 20, bottom: 20, left: 55, right: 10 }}
        {...chartSetting}
      />
      <div className="flex_colors">
        {barColors.map((item, index) => {
          return (
            <div key={index} className="d-flex">
              <div className="dot_color" style={{ background: item }}></div>
              <div className="text_color">Semana {index + 1} </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
