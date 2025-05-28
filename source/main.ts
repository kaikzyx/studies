import "./style.css";
import p5 from "p5";

const app = document.getElementById("app")!;

function load(): void {
    // Clear the app.
    app.innerHTML = "";

    // Get the sketch name from the hash (#).
    const sketch = window.location.hash.slice(1);

    if (!sketch) {
        document.title = "sketch not selected.";
        app.innerHTML = "<h1>Please add a route to load a sketch.</h1>";
        return;
    }

    import(`./sketches/${sketch}/index.ts`)
        .then((module) => {
            document.title = `sketch: ${sketch}`;
            new p5(module.default, app);
        })
        .catch(() => {
            document.title = "sketch not found.";
            app.innerHTML = `<h1>Sketch "${sketch}" not found.</h1>`;
        });
}

load();

// Reload when hash changes.
window.addEventListener("hashchange", load);
