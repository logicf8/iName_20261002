/*
stats	Betydelse
1	Samma namn, beskrivning & material
2	Samma material
3	Endast laminat/faner
4	Endast kompositmaterial
5	Blandning av enkla + komposit
*/
import Article from "../../shared/models/article.js";
import { addDisplayTxt } from "./displayTxtHelpers.js";

/* -------------------------------------------------------------------------- */
/* HEADER                                                                      */
/* -------------------------------------------------------------------------- */

export function makeHeaderTxt(sP, cfg) {
    const info = sP.cmInfoFlag?.[cfg.infoKey];

    if (!info || !info.firstCustomArticle) return;

    if (info.stats === 1) {
        const art = info.firstCustomArticle;
        let txt = info.count === 1
            ? cfg.header.singular
            : cfg.header.plural;

        txt += cfg.header.buildSingleTxt(art);

        addWithPriceLimit(
            sP.displayTxts,
            txt,
            art.color,
            cfg.priceByColor,
            "info"
        );
    } else {
        addDisplayTxt(sP.displayTxts, {
            text: cfg.header.plural,
            level: "info"
        });
    }
}
/* -------------------------------------------------------------------------- */
/* PER ARTIKEL                                                                 */
/* -------------------------------------------------------------------------- */

export function DtByArt(sP, header, cfg) {
    const info = sP.cmInfoFlag?.[cfg.infoKey];

    header.returnArticles().forEach(article => {

        // Specialfall: stödbeslag
        if (article.artNr === "702.746.28") {
            addDisplayTxt(sP.displayTxts, {
                text: "Stöd för bänkskiva i tomt hörn",
                level: "warning",
                message: "Antagande"
            });
            return;
        }

        // -----------------------------------
        // OPERATION
        // -----------------------------------
        if (article.group3 === "Operation") {

            // 🔥 NY: Hantera skarvar (HACKBOL)
            const isJointArticle =
                article.name === "HACKBOL" &&
                (article.artNr === "906.027.42" || article.artNr === "706.027.43");

            if (isJointArticle) {
                const qty = article.quantity;

                const jointTxt =
                    qty === 1
                        ? "Förstärkt skarv"
                        : "Förstärkta skarvar";

                addDisplayTxt(sP.displayTxts, {
                    text: jointTxt,
                    level: "info"
                });

                return;
            }

            let dTxt = article.description;
            let thisLevel = "info";

            // Lägg till färg beroende på stats
            if (cfg.infoKey === "wtInfo") {
                if (sP.cmInfoFlag.wtInfo?.stats > 1) {
                    dTxt += ` - ${article.color}`;
                }
            } else if (cfg.infoKey === "wpInfo") {
                if (sP.cmInfoFlag.wpInfo?.stats > 1) {
                    dTxt += ` - ${article.color}`;
                }
            }

            const warningArticles = [
                "103.453.08",
                "006.077.63",
                "103.455.77",
                "103.475.62",
            ];

            if (warningArticles.includes(article.artNr)) {
                thisLevel = "warning";

                const isStone = ["EXHULT", "YTTERVÄGGA"].includes(article.name);
                const stats = sP.cmInfoFlag?.[cfg.infoKey].stats;

                if (
                    (!isStone && stats <= 3) ||
                    (isStone && stats <= 2)
                ) {
                    applyUndergluedFallback(sP.cmInfoFlag);

                    const totalOperations =
                        sP.cmInfoFlag.sinks +
                        sP.cmInfoFlag.hobs;

                    const cmFlag = buildCmFlag({
                        sinks: sP.cmInfoFlag.sinks,
                        hobs: sP.cmInfoFlag.hobs
                    });

                    if (article.quantity === totalOperations && cmFlag.length > 0) {
                        dTxt = formatOperationText(
                            isStone ? "Ursågat för" : "Förfräst för",
                            cmFlag
                        );
                    }
                }
            }

            addDisplayTxt(sP.displayTxts, {
                text: dTxt,
                level: thisLevel
            });

            return;
        }

        // -----------------------------------
        // EJ OPERATION
        // -----------------------------------
        if (
            article.group1 === "Färdiglängd" &&
            sP.cmInfoFlag.wtInfo.stats !== 0
        ) {
            addDisplayTxt(sP.displayTxts, {
                text: `(${article.group1} - ${article.name} ${article.description} ${article.width} cm, ${article.color})`,
                level: "info"
            });
        } else {
            makeCustomMadeTxt(sP, article, info, cfg);
        }
    });
}

function buildCmFlag({ sinks, hobs }) {
    const cmFlag = [];

    if (sinks > 0) {
        cmFlag.push(sinks === 1 ? "diskho" : `${sinks} diskhoar`);
    }

    if (hobs > 0) {
        cmFlag.push(hobs === 1 ? "häll" : `${hobs} hällar`);
    }

    return cmFlag;
}

function formatOperationText(prefix, cmFlag) {
    if (cmFlag.length === 1) {
        return `${prefix} ${cmFlag[0]}`;
    }

    if (cmFlag.length === 2) {
        return `${prefix} ${cmFlag[0]} och ${cmFlag[1]}`;
    }

    const last = cmFlag.pop();
    return `${prefix} ${cmFlag.join(", ")} och ${last}`;
}

function applyUndergluedFallback(cmInfoFlag) {
    const undergluedCount = cmInfoFlag.wtInfo?.underglued?.length ?? 0;

    if (undergluedCount > 0) {
        cmInfoFlag.sinks -= undergluedCount;
    }
}

/* -------------------------------------------------------------------------- */
/* CUSTOM MADE TEXT                                                            */
/* -------------------------------------------------------------------------- */

function makeCustomMadeTxt(sP, art, info, cfg) {
    const status = info?.stats ?? 0;

    if (!info?.firstCustomArticle) { return; }

    switch (status) {
        case 1: {
            let dim = cfg.getDimension(art)
                .replace(`${cfg.label} -`, `${cfg.label}:`);
 
            addDimensionOnly(sP.displayTxts, dim);
            break;
        }

        case 2:
        case 3:
        case 4:
        case 5: {
            let baseTxt =
                `${cfg.getDimension(art)} - ${art.name} ${art.description}, ${art.color}`;

            baseTxt = baseTxt.replace(
                new RegExp(`^${cfg.label}\\s*-`),
                `${cfg.label}:`
            );

            addWithPriceLimit(
                sP.displayTxts,
                baseTxt,
                art.color,
                cfg.priceByColor,
                "warning"
            );
            break;
        }

        default: {
            let dim = cfg.getDimension(art)
                .replace(`${cfg.label} -`, `${cfg.label}:`);
 
                addDimensionOnly(sP.displayTxts, dim);
        }
    }
}

/* -------------------------------------------------------------------------- */
/* HJÄLPFUNKTIONER                                                            */
/* -------------------------------------------------------------------------- */

function addWithPriceLimit(arr, baseText, color, priceByColor, level = "info") {
    if (!baseText) return;

    let text = baseText.trim();
    if (text.endsWith(".")) text = text.slice(0, -1);

    let priceText = priceByColor
        ? priceByColor(color)
        : "";

        if (text.toLowerCase().includes("bakkantslist")) {
        priceText = " Pris per löpmeter";
    }
    const fullText = text + "." + priceText;

    addDisplayTxt(arr, {
        text: fullText.length <= 100 ? fullText : text,
        level: level
    });
}

function addDimensionOnly(arr, txt) {
    if (!txt) return;

    addDisplayTxt(arr, {
        text: txt,
        level: "warning",
        message: "Angivnet mått är ett antagande och behöver ev. justeras."
    });
}
