import "./Button.css";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  type = "button",
  onClick,
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        btn
        btn-${variant}
        btn-${size}
        ${fullWidth ? "btn-full" : ""}
      `}
    >
      {loading ? (
        <>
          <span className="btn-spinner"></span>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}