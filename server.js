import fs from "node:fs/promises";
import compression from "compression";
import express from "express";
import session from "express-session";
import multer from "multer";
import path from "node:path";
// import { motMelee } from "./src/motMelee.js";

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
    const compression = (await import("compression")).default;
    const sirv = (await import("sirv")).default;
    app.use(compression());
    app.use(base, sirv("./dist/client", { extensions: [] }));
}

// Configuration de multer pour stocker les fichiers uploadés
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

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

// app.use(
//     "/uploads",
//     express.static(
//         path.resolve(path.dirname(new URL(import.meta.url).pathname), "uploads")
//     )
// );

// app.post("/upload", upload.single("image"), async (req, res) => {
//     if (!req.file) {
//         return res.status(400).send("Aucun fichier sélectionné.");
//     }

//     const fileUrl = `/uploads/${req.file.filename}`;

//     try {
//         const motMeleeInstance = new motMelee();
//         motMeleeInstance.setFilePath(path.resolve(req.file.path));

//         try {
//             // const { grid, words, letters } = await motMeleeInstance.solveAuto();
//             const { grid } = await motMeleeInstance.getGrid();

//             res.status(200).send({
//                 message: "Image importée avec succès",
//                 fileUrl: fileUrl,
//                 file: req.file,
//                 grid: grid,
//             });
//         } catch (error) {
//             console.error("Erreur lors de la résolution de la grille:", error);

//             res.status(500).json({
//                 error: "Erreur lors de la résolution de la grille",
//             });
//         }
//     } catch (error) {
//         console.error("Erreur lors de l'analyse de l'image:", error);
//         res.status(500).json({ error: "Erreur lors de l'analyse de l'image" });
//     }
// });

// app.post("/resolve", async (req, res) => {
//     try {
//         const motMeleeInstance = new motMelee();

//         const { wordsResult, letters } = await motMeleeInstance.solve(
//             req.body.grid,
//             req.body.words
//         );

//         res.status(200).send({
//             wordsResult: wordsResult,
//             letters: letters,
//         });
//     } catch (error) {
//         console.error("Erreur lors de la résolution de la grille:", error);

//         res.status(500).json({
//             error: "Erreur lors de la résolution de la grille",
//         });
//     }
// });

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
