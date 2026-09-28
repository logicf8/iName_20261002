import { isArticleNumber } from "../utils/headerPatternIdentifiers.js";

/**
 * Bygger test-arrayen från råtext
 * Endast artikelnummer – inget annat behandlas
 */
export function buildArticleTestArrayFromFile(lines) {
 
    return lines
        .map(l => l.trim())
        .filter(l => isArticleNumber(l))
        .map(artNr => ({
            artNr,
            status: "PENDING", // PENDING | FOUND | MISSING
            header: null,
            originalTxt: null
        }));
}

/**
 * Test-runner (singleton-liknande)
 */
class ArticleSequenceTest {
    constructor(testArray) {
        this.testArray = testArray;
        this.pointer = 0;
    }

    /**
     * Körs varje gång en artikel skapas
     */
    matchCreatedArticle(createdArtNr, currentHeader) {
        while (this.pointer < this.testArray.length) {
            const expected = this.testArray[this.pointer];

            // Rätt artikel
            if (expected.artNr === createdArtNr) {
                expected.status = "FOUND";
                expected.header = currentHeader?.constructor?.name ?? "UnknownHeader";
                expected.originalTxt = currentHeader?.originalTxt ?? "";
                this.pointer++;
                return;
            }

            // Fel → markera saknad och gå vidare
            expected.status = "MISSING";
            expected.header = currentHeader?.constructor?.name ?? "UnknownHeader";
            expected.originalTxt = currentHeader?.originalTxt ?? "";
            this.pointer++;
        }
    }

    /**
     * Körs när hela filen är färdigprocessad
     */
    finalize() {
        // Alla kvarvarande = saknas
        for (let i = this.pointer; i < this.testArray.length; i++) {
            this.testArray[i].status = "MISSING";
        }

        return this.generateReport();
    }

    generateReport() {
        const missing = this.testArray.filter(t => t.status === "MISSING");

        if (missing.length === 0) {
            return {
                ok: true,
                message: "✅ Alla artikelnummer hittades i korrekt sekvens."
            };
        }

        return {
            ok: false,
            message: `❌ ${missing.length} artikelnummer saknas.`,
            missing: missing.map(m => ({
                artNr: m.artNr,
                header: m.header,
                originalTxt: m.originalTxt
            }))
        };
    }
}

// Singleton-export
let activeTest = null;

export function initArticleSequenceTest(testArray) {
    activeTest = new ArticleSequenceTest(testArray);
}

export function testCreatedArticle(artNr, currentHeader) {
    if (!activeTest) return;
    activeTest.matchCreatedArticle(artNr, currentHeader);
}

export function finalizeArticleSequenceTest() {
    if (!activeTest) return null;
    return activeTest.finalize();
}
