
import React, { useState } from "react";
import {
  Wallet,
  UserRound,
  BadgeCheck,
  Zap,
  FileDown,
  MoreVertical,
  Info,
  ChevronDown,
  ArrowUpRight,
  RefreshCw,
  TrendingUp,
  ChartNoAxesCombined,
  CircleDollarSign
} from "lucide-react";

import "./analytics.css";

const categories = [
  {
    name: "Electricity & Power",
    amount: "4,132.80",
    percent: 42,
    color: "#007e72"
  },
  {
    name: "Maintenance & Fixes",
    amount: "2,068.40",
    percent: 21,
    color: "#a65a00"
  },
  {
    name: "Water & Tankers",
    amount: "1,377.60",
    percent: 14,
    color: "#61d4c8"
  },
  {
    name: "Cleaning & Supplies",
    amount: "1,377.60",
    percent: 14,
    color: "#ffb27e"
  },
  {
    name: "High-Speed Fiber Net",
    amount: "885.60",
    percent: 9,
    color: "#727c9b"
  }
];

const monthlyData = [
  { month: "May", value: 1480 },
  { month: "Jun", value: 1570 },
  { month: "Jul", value: 2150 },
  { month: "Aug", value: 2090 },
  { month: "Sep", value: 1740 },
  { month: "Oct", value: 1845 }
];

const periods = [
  "Last 3 Months",
  "Last 6 Months",
  "Year to Date 2024"
];

export default function FinancialAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 6 Months");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const [categoryData, setCategoryData] = useState(categories);

  const totalSpend = categoryData.reduce(
    (total, item) => total + Number(item.amount.replaceAll(",", "")),
    0
  );

  const cumulativeSpend =
    selectedPeriod === "Last 3 Months"
      ? "Rs 5,420.00"
      : selectedPeriod === "Year to Date 2024"
      ? "Rs 18,640.00"
      : "Rs 9,840.00";

  const handleExport = () => {
    window.print();
  };

  const handleReallocate = () => {
    setCategoryData((previous) =>
      [...previous].sort((a, b) => b.percent - a.percent)
    );
    alert("Categories sorted by spending percentage.");
  };

  return (
    <div className="analytics-page">

      {/* HEADER */}

      <header className="analytics-header">

        <div className="analytics-heading">
          <div className="analytics-breadcrumb">
            <span>●</span>
            ROOM 402 FINANCIAL ANALYTICS & TRENDS
          </div>

          <h1>Master Financial Analytics & Trends</h1>

          <p>
            Hostel suite portfolio synthesis, multi-meter utility auditing,
            and settlement velocity metrics.
          </p>
        </div>

        <div className="analytics-header-actions">

          <div className="period-selector">
            {periods.map((period) => (
              <button
                key={period}
                className={
                  selectedPeriod === period ? "active-period" : ""
                }
                onClick={() => setSelectedPeriod(period)}
              >
                {period}
              </button>
            ))}
          </div>

          <button
            className="analytics-export"
            onClick={handleExport}
          >
            <FileDown size={14} />
            Export Executive PDF Report
          </button>

        </div>

      </header>

      {/* SUMMARY CARDS */}

      <section className="analytics-stats">

        <div className="analytics-stat-card">

          <div className="stat-top">
            <span>6-MONTH CUMULATIVE SPEND</span>
            <div className="stat-symbol spend-symbol">
              <Wallet size={16} />
            </div>
          </div>

          <div className="stat-value">
            <span>Rs</span>
            {cumulativeSpend.replace("Rs ", "")}
          </div>

          <div className="stat-bottom">
            <span>Avg Rs 1,640.00/mo</span>
            <strong className="positive-change">
              -4.2% vs H1
            </strong>
          </div>

          <div className="stat-progress">
            <span style={{ width: "73%" }}></span>
          </div>

        </div>

        <div className="analytics-stat-card">

          <div className="stat-top">
            <span>AVG EXPENSE / ROOMMATE</span>
            <div className="stat-symbol roommate-symbol">
              <UserRound size={16} />
            </div>
          </div>

          <div className="stat-value">
            Rs 273.33
            <small>/ mo</small>
          </div>

          <div className="stat-bottom">
            <span>Range Rs 210 - 340</span>
            <strong>Low Rs 210 • Peak Rs 340</strong>
          </div>

          <div className="stat-progress orange-progress">
            <span style={{ width: "58%" }}></span>
          </div>

        </div>

        <div className="analytics-stat-card">

          <div className="stat-top">
            <span>ON-TIME SETTLEMENT RATE</span>
            <div className="stat-symbol settlement-symbol">
              <BadgeCheck size={17} />
            </div>
          </div>

          <div className="stat-value">
            94.6%
            <small className="growth-badge">+1.8%</small>
          </div>

          <div className="stat-bottom">
            <span>Top Performers</span>
            <strong>Ali K. & Dani</strong>
          </div>

          <div className="stat-progress">
            <span style={{ width: "94.6%" }}></span>
          </div>

        </div>

        <div className="analytics-stat-card">

          <div className="stat-top">
            <span>UTILITY OPTIMIZATIONS</span>
            <div className="stat-symbol optimization-symbol">
              <Zap size={16} />
            </div>
          </div>

          <div className="stat-value">
            Rs 485.00
          </div>

          <div className="stat-bottom">
            <span>Direct Savings</span>
            <strong>LEDs & Sub-Meters</strong>
          </div>

          <div className="stat-progress orange-progress">
            <span style={{ width: "65%" }}></span>
          </div>

        </div>

      </section>

      {/* CHARTS SECTION */}

      <section className="analytics-charts">

        {/* CATEGORY BREAKDOWN */}

        <div className="analytics-panel category-panel">

          <div className="panel-heading">

            <div>
              <h2>Expense Category Breakdown</h2>
              <p>6-month consolidated expenditure weighting</p>
            </div>

            <div className="category-menu-wrapper">
              <button
                className="more-options"
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              >
                <MoreVertical size={17} />
              </button>

              {showCategoryMenu && (
                <div className="category-menu">
                  <button onClick={handleReallocate}>
                    <RefreshCw size={12} />
                    Sort by spending
                  </button>

                  <button onClick={handleExport}>
                    <FileDown size={12} />
                    Export breakdown
                  </button>
                </div>
              )}
            </div>

          </div>

          <div className="category-content">

            {/* DONUT CHART */}

            <div className="donut-section">

              <div className="donut-chart">
                <div className="donut-center">
                  <span>TOTAL SPEND</span>
                  <strong>
                    Rs {(totalSpend / 1000).toFixed(2)}k
                  </strong>
                  <small>100% AUDITED</small>
                </div>
              </div>

            </div>

            {/* CATEGORY LEGEND */}

            <div className="category-list">

              {categoryData.map((item) => (
                <div className="category-item" key={item.name}>

                  <div className="category-name">
                    <span
                      className="category-dot"
                      style={{ background: item.color }}
                    ></span>

                    <strong>{item.name}</strong>
                  </div>

                  <div className="category-amount">
                    <strong>Rs {item.amount}</strong>
                    <span>{item.percent}%</span>
                  </div>

                </div>
              ))}

            </div>

          </div>

          <div className="category-footer">

            <span>
              <Info size={12} />
              Split model: 50% fixed equity, 50% consumption
            </span>

            <button onClick={handleReallocate}>
              Re-allocate
            </button>

          </div>

        </div>

        {/* MONTHLY SPENDING CHART */}

        <div className="analytics-panel monthly-panel">

          <div className="panel-heading monthly-heading">

            <div>
              <h2>Monthly Utility & Maintenance Spend</h2>
              <p>Summer HVAC cooling peak vs autumn stabilization</p>
            </div>

            <div className="chart-legend">
              <span className="six-month-badge">6-Month Trend</span>
              <span><i className="actual-dot"></i> Actuals</span>
              <span><i className="target-dot"></i> Target Baseline</span>
            </div>

          </div>

          {/* CHART */}

          <div className="chart-area">

            <div className="chart-y-labels">
              <span>2,400</span>
              <span>2,000</span>
              <span>1,600</span>
              <span>1,200</span>
            </div>

            <div className="chart-plot">

              <div className="chart-grid-line line-one"></div>
              <div className="chart-grid-line line-two"></div>
              <div className="chart-grid-line line-three"></div>
              <div className="chart-grid-line line-four"></div>

              <div className="target-line"></div>

              <div className="peak-tooltip">
                <span></span>
                Jul Peak: Rs 2,150.00 (Dual ACs)
              </div>

              <div className="current-tooltip">
                Oct: Rs 1,845.50
              </div>

              <svg
                className="spending-svg"
                viewBox="0 0 600 250"
                preserveAspectRatio="none"
              >

                <defs>
                  <linearGradient
                    id="spendingFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#00877b"
                      stopOpacity=".20"
                    />
                    <stop
                      offset="100%"
                      stopColor="#00877b"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="M 10 155 L 122 145 L 234 48 L 346 57 L 458 120 L 570 101 L 570 230 L 10 230 Z"
                  fill="url(#spendingFill)"
                />

                <path
                  d="M 10 155 L 122 145 L 234 48 L 346 57 L 458 120 L 570 101"
                  fill="none"
                  stroke="#007c72"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />

                {monthlyData.map((item, index) => {
                  const points = [
                    [10, 155],
                    [122, 145],
                    [234, 48],
                    [346, 57],
                    [458, 120],
                    [570, 101]
                  ];

                  return (
                    <circle
                      key={item.month}
                      cx={points[index][0]}
                      cy={points[index][1]}
                      r="5"
                      fill={index === 2 ? "#a65a00" : "#007c72"}
                      stroke="#ffffff"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}

              </svg>

              <div className="chart-x-labels">
                {monthlyData.map((item, index) => (
                  <span
                    key={item.month}
                    className={index === 2 || index === 5 ? "highlight-month" : ""}
                  >
                    {item.month}
                    {index === 2 && <small>(Peak)</small>}
                    {index === 5 && <small>(Current)</small>}
                  </span>
                ))}
              </div>

            </div>

          </div>

          {/* CHART INSIGHT */}

          <div className="chart-insight">
            <Zap size={13} />

            <div>
              <p>
                Summer HVAC cooling contributed <strong>38.4%</strong> of
                Q3 expense surplus.
              </p>

              <button onClick={() => alert("Detailed slab breakdown pending.")}>
                Detailed Slab Breakdown →
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* ANALYTICS FOOTER */}

      <footer className="analytics-footer">
        <span>
          <ChartNoAxesCombined size={13} />
          Room 402 Financial Intelligence
        </span>

        <span>
          <CircleDollarSign size={13} />
          Currency: PKR
        </span>

        <span>
          <BadgeCheck size={13} />
          Ledger Analytics
        </span>
      </footer>

    </div>
  );
}
