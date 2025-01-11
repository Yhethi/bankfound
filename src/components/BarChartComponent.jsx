import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";
import { useState } from "react";
import { useEffect } from "react";

export default function BarChartComponent({
  showGraph,
  user,
  users,
  setShowGraph,
}) {
  const [allTransactions, setAllTransactions] = useState([]);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    if (user?.transactions && users) {
      const transactions = user.transactions.map((element) => {
        const recipient = users.find((u) => u.email === element.email);
        return {
          user: {
            id: recipient?.id || null,
            name: recipient?.name || "",
            email: recipient?.email || "",
            saldo: recipient?.saldo || 0,
            currentAmount: recipient?.currentAmount || 0,
            transaction: element,
          },
        };
      });
      const reversedTransactions = [...transactions].reverse();
      setAllTransactions(reversedTransactions);
    }
  }, [user, users]);

  const getWeekOfMonth = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const diff = date.getDate() + startOfMonth.getDay() - 1;
    return Math.ceil(diff / 7);
  };

  const getWeeklyData = (transactions) => {
    let weeksData = Array.from({ length: 4 }, () => Array(12).fill(0));

    transactions.forEach((transaction) => {
      const transactionDate = new Date(
        transaction.user.transaction.date
          .split(" ")[0]
          .split("/")
          .reverse()
          .join("-")
      );

      const month = transactionDate.getMonth();
      const week = getWeekOfMonth(transactionDate) - 1;

      if (week >= 0 && week < 4) {
        weeksData[week][month] += transaction.user.transaction.amount || 0;
      }
    });
    weeksData = weeksData.map((weeks, weekIndex) =>
      weeks.map((value) => parseFloat(value).toFixed(2))
    );
    return weeksData;
  };

  const weeklyData = getWeeklyData(allTransactions);

  const barSeries = weeklyData.map((weekData) => ({
    data: weekData,
  }));

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
    <div className="global__graph">
      <div
        className={`modal-overlay ${showGraph ? "show" : ""}`}
        onClick={() => setShowGraph(false)}
      >
        <div
          className={`modal-content graph__container ${
            showGraph ? "show" : "hide"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="close-btn" onClick={() => setShowGraph(false)}>
            ✖
          </button>
          <div className="isDemo__buttons">
            <button onClick={() => setDemo(true)}>DEMO</button>
            <button onClick={() => setDemo(false)}>REAL</button>
          </div>
          <div className={`graph ${showGraph ? "graph-show" : "graph-hide"}`}>
            {demo ? (
              <>
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
              </>
            ) : (
              <>
                <BarChart
                  colors={barColors}
                  series={barSeries}
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
              </>
            )}

            <div className="flex_colors">
              {barColors.map((item, index) => (
                <div key={index} className="d-flex">
                  <div className="dot_color" style={{ background: item }}></div>
                  <div className="text_color">Semana {index + 1} </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
