"use client";

import {
  Sparkles,
  TrendingUp,
  ShieldAlert,
  BrainCircuit,
  ChevronRight,
} from "lucide-react";

export default function AIInsightsPanel({
  aiData,
  aiLoading,
  onOpenFIA,
}) {
  if (aiLoading) {
    return (
      <div className="ai-snapshot ai-skeleton">
        <div className="sk-line sk-line-sm" />
        <div className="sk-line sk-line-lg" />
        <div className="sk-grid">
          <div className="sk-card" />
          <div className="sk-card" />
          <div className="sk-card" />
        </div>
      </div>
    );
  }

  if (!aiData) {
    return null;
  }

  const anomalyCount =
    aiData.anomalies?.length || 0;

  const burnRateStatus =
    aiData.burn_rate?.status ===
    "risk"
      ? "Risk"
      : "Stable";

  const smartAlert =
    aiData.smart_alerts?.[0];

  return (
    <>
      <style jsx>{`
        .ai-snapshot {
          position: relative;
          overflow: hidden;
          border-radius: 30px;
          border: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(135deg, rgba(8,17,31,0.98) 0%, rgba(20,29,50,0.98) 100%);
          padding: 28px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.18);
          font-family: "Inter", sans-serif;
        }

        .ai-glow {
          position: absolute;
          width: 260px;
          height: 260px;
          border-radius: 999px;
          filter: blur(60px);
          opacity: 0.18;
          pointer-events: none;
        }

        .ai-glow-left {
          top: -120px;
          left: -80px;
          background: #F6C96A;
        }

        .ai-glow-right {
          bottom: -120px;
          right: -80px;
          background: #57C7FF;
        }

        .ai-header {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .ai-title-wrap {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ai-icon {
          width: 62px;
          height: 62px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(246,201,106,0.2), rgba(87,199,255,0.22));
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(14px);
        }

        .ai-label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: rgba(255,227,157,0.86);
          margin-bottom: 6px;
        }

        .ai-heading {
          margin: 0;
          font-size: 42px;
          line-height: 1;
          font-weight: 900;
          color: white;
          letter-spacing: -0.06em;
        }

        .ai-sub {
          margin-top: 8px;
          color: rgba(255,255,255,0.55);
          font-size: 14px;
          line-height: 1.7;
          max-width: 540px;
        }

        .ai-button {
          flex-shrink: 0;
          height: 54px;
          padding: 0 22px;
          border-radius: 18px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 700;
          color: #07111F;
          background: linear-gradient(135deg, #F6C96A, #57C7FF);
          box-shadow: 0 12px 30px rgba(87,199,255,0.22);
          transition: transform 0.2s ease;
        }

        .ai-button:hover {
          transform: translateY(-2px);
        }

        .ai-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
          gap: 16px;
          margin-bottom: 18px;
        }

        .ai-card {
          border-radius: 22px;
          padding: 18px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
        }

        .ai-card-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }

        .ai-card-value {
          font-size: 30px;
          font-weight: 900;
          letter-spacing: -0.05em;
          color: white;
          margin-bottom: 8px;
        }

        .ai-green {
          color: #FFE39D;
        }

        .ai-blue {
          color: #9CDEFF;
        }

        .ai-red {
          color: #FCA5A5;
        }

        .ai-card-text {
          font-size: 13px;
          line-height: 1.7;
          color: rgba(255,255,255,0.52);
        }

        .ai-alert {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border-radius: 22px;
          padding: 18px 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .ai-alert-left {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .ai-alert-badge {
          min-width: 74px;
          height: 34px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          background: rgba(246,201,106,0.16);
          color: #FFE39D;
        }

        .ai-alert-title {
          font-size: 15px;
          font-weight: 800;
          color: white;
          margin-bottom: 4px;
        }

        .ai-alert-text {
          font-size: 13px;
          line-height: 1.7;
          color: rgba(255,255,255,0.62);
        }

        .ai-skeleton {
          min-height: 320px;
        }

        .sk-line {
          border-radius: 10px;
          background: rgba(255,255,255,0.08);
          animation: pulse 1.8s infinite;
        }

        .sk-line-sm {
          width: 180px;
          height: 12px;
          margin-bottom: 12px;
        }

        .sk-line-lg {
          width: 280px;
          height: 38px;
          margin-bottom: 24px;
        }

        .sk-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 14px;
        }

        .sk-card {
          height: 120px;
          border-radius: 22px;
          background: rgba(255,255,255,0.06);
          animation: pulse 1.8s infinite;
        }

        @keyframes pulse {
          0%,100% {
            opacity: 0.4;
          }

          50% {
            opacity: 0.75;
          }
        }

        @media (max-width: 768px) {
          .ai-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .ai-heading {
            font-size: 34px;
          }

          .ai-button {
            width: 100%;
            justify-content: center;
          }

          .ai-alert {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <section className="ai-snapshot">
        <div className="ai-glow ai-glow-left" />
        <div className="ai-glow ai-glow-right" />

        <div className="ai-header">
          <div>
            <div className="ai-title-wrap">
              <div className="ai-icon">
                <Sparkles
                  size={30}
                  color="#FFE39D"
                />
              </div>

              <div>
                <div className="ai-label">
                  AI Financial Copilot
                </div>

                <h2 className="ai-heading">
                  FIA
                </h2>
              </div>
            </div>

            <div className="ai-sub">
              Realtime financial intelligence powered by your transaction activity and spending behavior.
            </div>
          </div>

          <button
            onClick={onOpenFIA}
            className="ai-button"
          >
            Open Workspace
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="ai-grid">
          <div className="ai-card">
            <div className="ai-card-label">
              <TrendingUp
                size={13}
                color="#FFE39D"
              />
              Forecast
            </div>

            <div className="ai-card-value ai-green">
              Rs.{" "}
              {
                Number(
                  aiData.prediction || 0
                ).toLocaleString()
              }
            </div>

            <div className="ai-card-text">
              AI projected monthly spending estimate.
            </div>
          </div>

          <div className="ai-card">
            <div className="ai-card-label">
              <ShieldAlert
                size={13}
                color="#9CDEFF"
              />
              Burn Rate
            </div>

            <div className="ai-card-value ai-blue">
              {burnRateStatus}
            </div>

            <div className="ai-card-text">
              {
                aiData.burn_rate
                  ?.projected_spending
                  ? `Projected spend Rs. ${Number(
                      aiData.burn_rate.projected_spending
                    ).toLocaleString()}`
                  : "Waiting for more financial activity."
              }
            </div>
          </div>

          <div className="ai-card">
            <div className="ai-card-label">
              <BrainCircuit
                size={13}
                color="#FCA5A5"
              />
              Alerts
            </div>

            <div className="ai-card-value ai-red">
              {anomalyCount}
            </div>

            <div className="ai-card-text">
              {
                anomalyCount > 0
                  ? "Potential unusual transactions detected."
                  : "No major anomalies detected."
              }
            </div>
          </div>
        </div>

        <div className="ai-alert">
          <div className="ai-alert-left">
            <div className="ai-alert-badge">
              {
                smartAlert?.type ===
                "critical"
                  ? "Critical"
                  : smartAlert?.type ===
                    "warning"
                  ? "Warning"
                  : "Healthy"
              }
            </div>

            <div>
              <div className="ai-alert-title">
                {
                  smartAlert?.title ||
                  "Financial Activity Stable"
                }
              </div>

              <div className="ai-alert-text">
                {
                  smartAlert?.message ||
                  "No major financial risks detected currently."
                }
              </div>
            </div>
          </div>

          <ChevronRight
            size={18}
            color="rgba(255,255,255,0.35)"
          />
        </div>
      </section>
    </>
  );
}
