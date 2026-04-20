import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Secret keyboard shortcut: Ctrl+Shift+A (or Cmd+Shift+A on Mac)
 * Opens the back-office from anywhere in the app.
 */
export const useAdminShortcut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isModifier = event.ctrlKey || event.metaKey;
      if (isModifier && event.shiftKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        navigate("/back-office");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate]);
};
