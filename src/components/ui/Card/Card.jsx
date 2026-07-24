import "./Card.css";

export default function Card({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  hover = false,
  bordered = true,
  shadow = "md",
  padding = "md",
  className = "",
}) {
  return (
    <div
      className={[
        "card",
        `card-shadow-${shadow}`,
        `card-padding-${padding}`,
        hover ? "card-hover" : "",
        bordered ? "card-bordered" : "",
        className,
      ].join(" ")}
    >
      {(title || subtitle || headerAction) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>

          {headerAction && (
            <div className="card-header-action">
              {headerAction}
            </div>
          )}
        </div>
      )}

      <div className="card-body">
        {children}
      </div>

      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
}