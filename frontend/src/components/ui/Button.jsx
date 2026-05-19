import { Link } from "react-router-dom";

export default function Button({
    children,
    icon = null,
    to = null,
    onClick = null,
    type = "button",
    variant = "primary",
    size = "",
    className = "",
    disabled = false,
    ...props
}) {
    const baseClass = "btn d-inline-flex align-items-center justify-content-center";

    const variants = {
        primary: "btn-custom-primary",
        success: "btn-custom-primary",
        outline: "btn-custom-outline",
        danger: "btn-custom-danger",
        "icon-primary": "p-0 border-0 btn-icon-primary",
        "icon-outline": "p-0 border-0 btn-icon-outline"
    };

    const selectedVariant = variants[variant] || variants.primary;
    const combinedClasses = `${baseClass} ${selectedVariant} ${size} ${className}`;

    const content = (
        <>
            {icon && <i className={icon} aria-hidden="true"></i>}
            {/* Se houver texto (children), damos uma margem à esquerda se houver um ícone antes */}
            {children && <span className={icon ? "ms-2" : ""}>{children}</span>}
        </>
    );

    if (to) {
        return (
            <Link to={to} className={combinedClasses} {...props}>
                {content}
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={combinedClasses}
            {...props}
        >
            {content}
        </button>
    );
}