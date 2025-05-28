import "./style.css";
import p5 from "p5";

// Get the sketch name from the URL path.
const SKETCH = window.location.pathname.slice(1);

if (SKETCH) {
    import(`./sketches/${SKETCH}/index.ts`)
        .then((module) => {
            document.title = `sketch: ${SKETCH}`;
            new p5(module.default, document.getElementById("sketch")!);
        })
        .catch(() => {
            document.body.innerHTML = `<h1>Sketch "${SKETCH}" not found.</h1>`;
        });
} else {
    document.body.innerHTML = `<h1>Please add a route to load a sketch.</h1>`;
}
