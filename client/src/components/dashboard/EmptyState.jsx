"use client";

/**
 * EmptyState — Reusable empty state component for FinSight AI
 *
 * Props:
 *   icon        — Lucide icon component
 *   title       — Primary message
 *   description — Supporting text
 *   action      — { label: string, onClick: fn } (optional)
 *   compact     — boolean, renders a smaller version (optional)
 */

export default function EmptyState({
  icon: Icon,
  title = "Nothing here yet",
  description = "Data you add will appear here.",
  action,
  compact = false,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: compact ? "32px 20px" : "56px 20px",
        textAlign: "center",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      {/* Icon container */}
      {Icon && (
        <div
          style={{
            width: compact ? 44 : 60,
            height: compact ? 44 : 60,
            background: "#141416",
            border: "1px solid #1F1F23",
            borderRadius: compact ? 14 : 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: compact ? 14 : 20,
            position: "relative",
          }}
        >
          <Icon size={compact ? 18 : 24} style={{ color: "#3A3A42" }} />
          {/* Glow ring */}
          <div
            style={{
              position: "absolute",
              inset: -6,
              borderRadius: compact ? 20 : 24,
              border: "1px solid #1A1A1E",
              opacity: 0.5,
              pointerEvents: "none",
            }}
          />
        </div>
      )}

      <h3
        style={{
          fontSize: compact ? 14 : 17,
          fontWeight: 700,
          color: "#EDE8DF",
          letterSpacing: "-0.02em",
          marginBottom: 6,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: compact ? 12 : 13,
          color: "#4A4A52",
          maxWidth: 260,
          lineHeight: 1.7,
          marginBottom: action ? 22 : 0,
        }}
      >
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#0D0D0F",
            background: "#C9964A",
            border: "none",
            borderRadius: 10,
            padding: "9px 18px",
            cursor: "pointer",
            fontFamily: "inherit",
            letterSpacing: "0.01em",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}