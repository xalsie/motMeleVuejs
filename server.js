import fs from "node:fs/promises";
import compression from "compression";
import express from "express";
import session from "express-session";

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

// Cached production assets
const templateHtml = isProduction
    ? await fs.readFile("./dist/client/index.html", "utf-8")
    : "";
const ssrManifest = isProduction
    ? await fs.readFile("./dist/client/.vite/ssr-manifest.json", "utf-8")
    : undefined;

// Create http server
const app = express();

// Add Vite or respective production middlewares
let vite;
if (!isProduction) {
    const { createServer } = await import("vite");
    vite = await createServer({
        server: { middlewareMode: true },
        appType: "custom",
        base,
    });
    app.use(vite.middlewares);
} else {
    // const compression = (await import("compression")).default;
    const sirv = (await import("sirv")).default;
    // app.use(compression());
    app.use(base, sirv("./dist/client", { extensions: [] }));
}

const shouldCompress = (req, res) => {
    if (req.headers["x-no-compression"]) {
        return false;
    }
    return compression.filter(req, res);
};

app.use(express.static("public"));
app.use(
    session({
        secret: "001/011100110110010101100011011100100110010101110100",
        resave: true,
        saveUninitialized: true,
    })
);
app.use(
    compression({
        // Compress all HTTP responses
        filter: shouldCompress,
        threshold: 0,
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve HTML
app.use("*", async (req, res) => {
    try {
        const url = req.originalUrl.replace(base, "");

        let template;
        let render;
        if (!isProduction) {
            // Always read fresh template in development
            template = await fs.readFile("./index.html", "utf-8");
            template = await vite.transformIndexHtml(url, template);
            render = (await vite.ssrLoadModule("/src/entry-server.js")).render;
        } else {
            template = templateHtml;
            render = (await import("./dist/server/entry-server.js")).render;
        }

        const rendered = await render(url, ssrManifest);

        const html = template
            .replace(`<!--app-head-->`, rendered.head ?? "")
            .replace(`<!--app-html-->`, rendered.html ?? "");

        res.status(200).set({ "Content-Type": "text/html" }).send(html);
    } catch (e) {
        vite?.ssrFixStacktrace(e);
        console.log(e.stack);
        res.status(500).end(e.stack);
    }
});

// Start http server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
