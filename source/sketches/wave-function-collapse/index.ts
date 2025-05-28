import p5 from "p5";
import Wave from "./wave";

export default function sketch(p: p5): void {
    const wave = new Wave(64);

    p.setup = () => {
        p.createCanvas(600, 600);
    };

    p.draw = () => {
        p.background("black");

        const status = wave.step(100);

        // If generation is complete or has error, stop looping.
        if (status !== "running") {
            if (status === "error") p.background("red");
            p.noLoop();
        }

        wave.draw(p);
    };
}
