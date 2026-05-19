import { Link } from "react-router-dom";
import Button from "./ui/Button.jsx";
import Logo from "../assets/images/LOGO.svg";

export default function Navbar() {
    return (
        <nav className="w-100" style={{ backgroundColor: "#313158", height: "72px" }}>
            <div className="d-flex justify-content-between align-items-center px-4 h-100">

                <Link to="/" className="d-flex align-items-center">
                    <img src={Logo} alt="Wish Facebook Logo" style={{ height: "50px" }} />
                </Link>

                <div className="d-flex align-items-center gap-3">
                    <Button
                        icon="bi bi-plus-circle"
                        onClick={() => console.log("New post")}
                        variant="icon-outline"
                        size="fs-2"
                    />

                    <Button
                        icon="bi bi-bell"
                        onClick={() => console.log("Notifications")}
                        variant="icon-outline"
                        size="fs-2"
                    />

                    <Button
                        to="/profile"
                        icon="bi bi-person-circle"
                        variant="icon-outline"
                        size="fs-2"
                    />
                </div>

            </div>
        </nav>
    );
}