export const helpMessages = {
    familyTypes: 
      "Här kontrolleras vilka frontfamiljer* som påträffas varpå en unik lista presenteras.\n" +
      "* Frontfamilj = alla artiklar som tillhör t.ex. Axstad grön\n\n" +
      "🚦 Övergripande resultat för artikellistan\n" +
      "Funktionen returnerar en status som visar om innehållet, i normalfallet, är korrekt eller behöver åtgärdas:\n" + 
      "⬛ Nej\n" + 
      "→ Inga relevanta artiklar hittades\n" +
      "🟩 Godkänt\n" + 
      "→ Endast en typ av produktfamilj och färg används\n" + 
      "eller\n" + 
      "→ Två familjer där en är FÖRBÄTTRA, men båda har samma färg\n" + 
      "🟧 Godkänt med undantag (kan medföra fel täcksida därav orange)\n" + 
      "→ Färg svart godkänt om FÖRBÄTTRA matt yta antracit\n" +
      "🟥 Ej godkänt\n" + 
      "→ Alla andra kombinationer (t.ex. flera olika färger)\n\n" +
      "Via 🔍 kan man utläsa vilka nummer i artikellistan som tillhör en viss frontfamilj och färg.",
    cabColors: 
      "Här kontrolleras vilka stommfärger som påträffas varpå en unik lista presenteras.\n\n" +
      "🚦 Övergripande resultat för artikellistan\n" +
      "Funktionen returnerar en status som visar om innehållet, i normalfallet, är korrekt eller behöver åtgärdas:\n" + 
      "⬛ Nej\n" +
      "→ Inga relevanta artiklar hittades\n" +
      "🟩 Godkänt\n" +
      "→ Alla stommar har samma färg\n" +
      "🟥 Ej godkänt\n" +
      "→ Blandade färger används\n\n" +
      "Via 🔍 kan man utläsa vilka nummer/stommar i artikellistan som har en viss färg.\n",
    drawerColors:
      "Här kontrolleras vilka färger på lådor som påträffas varpå en unik lista presenteras.\n\n" +
      "🚦 Övergripande resultat för artikellistan\n" +
      "Funktionen returnerar en status som visar om innehållet, i normalfallet, är korrekt eller behöver åtgärdas:\n" +
      "⬛ Nej\n" +
      "→ Inga relevanta artiklar hittades\n" +
      "🟩 Godkänt\n" +
      "→ Alla lådor/utdrag har samma färg\n" +
      "🟥 Ej godkänt\n" +
      "→ Olika färger används\n\n" +
      "Via 🔍 kan man utläsa vilka nummer/stommar i artikellistan som har en viss färg. Antal anges ej.\n",
    glassCompare:
      "Här kontrolleras glassidors antal, djup och höjd i förhållande till de lådor som finns och kan ha glassidor.\n\n" +
      "🚦 Övergripande resultat för artikellistan. Funktionen returnerar en status som visar om innehållet, i normalfallet, är korrekt eller behöver åtgärdas:\n" +
      "⬛ Nej → Inga lådor som kan ha glassidor har hittats\n" +
      "🟩 Godkänt\n" +
      "→ Alla lådor har glassidor i rätt djup och höjd.\n" +
      "🟢 Godkänt med undantag: (Det finns lådor som kan ha glassidor).\n" +
      "→ 🟢 Nej = Hela ordern saknar glassidor (Ok om valet är medvetet)\n" +
      "→ 🟢 Alla höga = Alla höga lådor har glassidor men 0 st medel (Ok om valet är medvetet)\n" +
      "🟧 Svagt godkänd\n" +
      "→ Det finns glassidor till en eller flera lådor men inte till alla.\n" +
      "  → Visas även som '🟠 Nej' på radnivå om glassidor helt saknas på just den stommen).\n" +
      "🟥 Ej godkänt\n" +
      "→ Glassidor finns i fel djup eller antal.\n\n" +
      "Via 🔍 kan man utläsa vilken nummer/stomme i artikellistan som har eller saknar glassidor\n" +
      "Statusraden visar total status per stomme.\n" +
      "Rader under visar vad som saknas.",
    pushAndOpen:
      "Här kontrolleras förekomst av tryck & öppna till KNIVSHULT-lådor samt om dessa är korrekt emot lådornas djup och antal.\n" +
      "🚦 Övergripande resultat för artikellistan. Funktionen returnerar en status som visar om innehållet, i normalfallet, är korrekt eller behöver åtgärdas:\n" +
      "⬛ Nej → Inga KNIVSHULT-lådor finns i någon stomme.\n" +
      "🟩 Godkänd\n" +
      "→ Alla lådor har Tryck & öppna\n" +
      "→ Antal Tryck & öppna matchar antal lådor\n" +
      "→ Rätt Tryck & öppna är kopplade till rätt djup (37 eller 45/60)\n" +
      "🟢 Godkänd med undantag\n" +
      "→ Nej = Lådor finns men saknar helt Tryck & öppna\n" +
      "→ Antal = Yttre lådfronter. Det finns lika många tryck & öppna som yttre lådfronter\n" +
      "🟧 En eller flera\n" +
      "→ Minst en låda har Tryck & öppna, men inte alla\n" +
      "  → Visas även som '🟠 Nej' på radnivå om tryck och öppna helt saknas på just den stommen).\n" +
      "🟥 Ej godkänt\n" +
      "   🟥 ⚠️ Fel djup/antal ⚠️\n" +
      "   → Tryck & öppna finns utan motsvarande låda\n" +
      "   → Antal Tryck & öppna överstiger antal lådor\n" +
      "   → Fel Tryck & öppna är kopplade till fel djup\n" +
      "Via 🔍 kan man se exakt vilka stommar som har avvikelser samt vilka artiklar som används.\n" +
      "Status per stomme ges som: 🟩 = korrekt, 🟧 = delvis, 🟢 = saknas, 🟥 = fel",
    shelfColor:
      "Här kontrolleras förekomst, typ och färg på hyllplan i stommar samt om dessa är rimliga utifrån val av dörrar.\n\n" +
      "🚦 Övergripande resultat för artikellistan. Funktionen returnerar en status som visar om innehållet, i normalfallet, är korrekt eller behöver åtgärdas:\n" +
      "⬛ Nej → Inga väggskåp som behöver hyllplan finns. Artikellistan saknar gångjärn.\n" +
      "🟩 Godkänt\n" +
      "→ Hyllplan finns där de förväntas\n" +
      "→ Rätt typ av hyllplan används i förhållande till dörrar\n" +
      "→ En färg eller kombination av en färg och glashyllplan.\n" +
      "🟥 Ej godkänt\n" +
      "   🟥 ⚠️ Hyllplan saknas ⚠️\n" +
      "   → Stomme med dörrar/gångjärn saknar hyllplan trots att de krävs\n" +
      "   🟥 ⚠️ Fel typ ⚠️\n" +
      "   → Ex. glashyllplan utan vitrindörrar eller vanliga hyllplan bakom vitrindörr.\n\n" +
      "Via 🔍 kan man se exakt vilka stommar som har avvikelser samt vilka färger som används.\n" + 
      "Status ges som: ✅ = korrekt, ❌ = fel",
    outerDimensions:
      "Här kontrolleras att stommens yttre mått (bredd och höjd) stämmer överens med de artiklar som bygger upp det yttre måttet\n" +
      "🚦 Övergripande resultat för artikellistan. Funktionen visar om kombinationerna, i normalfallet, är korrekt uppbyggda eller innehåller avvikelser:\n" +
      "⬛ Nej → Inga stommar hittades.\n" +
      "🟩 Godkänd\n" +
      "→ Artiklarna bygger upp korrekt totalhöjd\n" +
      "→ Artiklarna matchar stommens bredd\n" +
      "→ Specialregler för hörnskåp och vitrindörrar är uppfyllda\n" +
      "🟥 Ej godkänt\n" +
      "   🟥 ⚠️ Fel bredd ⚠️\n" +
      "   → Artiklar passar inte stommens bredd\n" +
      "   → Fel antal fronter i förhållande till bredd\n" +
      "   🟥 ⚠️ Fel höjd ⚠️\n" +
      "   → Summerad höjd av artiklar stämmer inte med stommens höjd\n" +
      "   → Specialregler (t.ex. lådfronter eller vitrindörrar) kan ge avvikelse\n" +
      "Via 🔍 kan man se exakt vilka stommar som har avvikelser samt vilka artiklar som ingår i beräkningen.\n" +
      "Status per stomme ges som: ✅ = korrekt, ❌ = fel",
    innerDimensions:
      "Här kontrolleras artiklar som påverkar stommens innerhöjd samt om dessa får plats utifrån bredd, höjd och djup.\n" +
      "🚦 Övergripande resultat för artikellistan. Funktionen returnerar en status som visar om innehållet, i normalfallet, är korrekt eller behöver åtgärdas:\n" +
      "⬛ Nej → Inga relevanta artiklar finns i artikellistan.\n" +
      "🟩 Godkänd\n" +
      "→ Alla artiklar matchar stommens bredd\n" +
      "→ Total höjd understiger eller motsvarar stommens höjd\n" +
      "→ Inga artiklar överskrider stommens djup\n" +
      "🟧 Godkänd med anmärkning\n" +
      "→ En eller flera lådor är grundare än stommen (kan vara korrekt men bör kontrolleras)\n" +
      "🟥 Ej godkänt\n" +
      "   🟥 ⚠️ Fel bredd ⚠️\n" +
      "   → Artikelns bredd matchar inte stommen\n" +
      "   🟥 ⚠️ Fel höjd ⚠️\n" +
      "   → Artiklarnas totala höjd överstiger stommens höjd\n" +
      "   🟥 ⚠️ Fel djup ⚠️\n" +
      "   → Artikel är djupare än stommen\n" +
      "Via 🔍 kan man se exakt vilka stommar som har avvikelser samt vilka artiklar som används.\n",
    benchLight:
      "Här kontrolleras förekomst, typ och färg på bänkbelysning i väggskåp samt om dessa är korrekt har rätt bredd.\n\n" +
      "🚦 Övergripande resultat för artikellistan. Funktionen returnerar en status som visar om innehållet, i normalfallet, är korrekt eller behöver åtgärdas:\n" +
      "⬛ Nej → Inga väggskåp finns.\n" +
      "🟩 Godkänt\n" +
      "→ Alla väggskåp har bänkbelysning\n" +
      "→ Rätt bredd i förhållande till skåpet\n" +
      "→ Rätt antal (1 st per skåp, eller 2 st för hörnskåp 68 cm)\n" +
      "→ Samma typ och färg används\n" +
      "🟢 Godkänt med undantag → Nej = Vitrindörrar finns men inga spottar\n" +
      "🟥 Ej godkänt\n" +
      "   🟥 ⚠️ Saknas ⚠️\n" +
      "   → Ett eller flera väggskåp saknar belysning\n" +
      "   🟥 ⚠️ Fel bredd ⚠️\n" +
      "   → Belysningens bredd matchar inte skåpets bredd\n" +
      "   🟥 ⚠️ Fel antal ⚠️\n" +
      "   → Fel antal belysningsartiklar i skåpet\n" +
      "   🟥 Blandad belysning\n" +
      "   → Olika typer eller färger av belysning används\n\n" +
      "Via 🔍 kan man se exakt vilka väggskåp som har avvikelser samt vilka artiklar som används.\n" +
      "Status ges som: ✅ = korrekt, ❌ = saknas, ⚠️ = Fel bredd eller antal",
    spotLight:
      "Här kontrolleras förekomst av spottar i väggskåp samt vilka färger dessa har, om dessa sitter bakom vitrindörrar samt om antal är rimliga utifrån skåpens bredd.\n" +
      "🚦 Övergripande resultat för artikellistan. Funktionen returnerar en status som visar om innehållet, i normalfallet, är korrekt eller behöver åtgärdas:\n" +
      "⬛ Nej → Inga väggskåp med vitrindörrar finns och inga spottar förekommer.\n" +
      "🟩 Godkänt\n" +
      "→ Alla relevanta väggskåp har spottar\n" +
      "→ Spottarna sitter bakom vitrindörrar\n" +
      "→ Antal spottar är korrekt utifrån skåpsbredd\n" +
      "→ Alla spottar är av samma typ och färg\n" +
      "🟢 Godkänt med undantag → Nej = Vitrindörrar finns men inga spottar är valda.\n" +
      "🟥 Ej godkänt\n" +
      "   🟥 ⚠️ Saknas ⚠️" +
      "   → Ett eller flera väggskåp saknar spottar trots att andra har det\n" +
      "   🟥 ⚠️ Ej vitrindörr ⚠️" +
      "   → Spottar finns bakom vanlig dörr\n" +
      "   🟥 ⚠️ Fel antal ⚠️" +
      "   → Antalet spottar stämmer inte överens med skåpets bredd\n" +
      "Via 🔍 kan man se exakt vilka väggskåp som har avvikelser samt vilka artiklar som används.\n" + 
      "Status per väggskåp ges som: ✅ = korrekt, ❌ = fel, ⚠️ = avvikelse",
    drawerLights:
      "Här kontrolleras förekomst av lådbelysning i stommar samt om dessa stämmer med respektive låda utifrån bredd och antal.\n" +
      "🚦 Övergripande resultat för artikellistan. Funktionen returnerar en status som visar om innehållet, i normalfallet, är korrekt eller behöver åtgärdas:\n" +
      "⬛ Nej → Inga lådor finns i artikellistan.\n" +
      "🟩 Godkänd\n" +
      "→ Alla lådor har lådbelysning\n" +
      "→ Antal belysningar matchar antal lådor\n" +
      "→ Rätt belysning till rätt lådbredd\n" +
      "🟢 Godkänd med undantag\n" +
      "→ Nej = Lådor finns men saknar helt belysning\n" +
      "🟧 En eller flera\n" +
      "→ Minst en låda har belysning, men inte alla\n" +
      "  → Visas även som '🟠 Nej' på radnivå om lådbelysning helt saknas på just den stommen).\n" +
      "🟥 Ej godkänt\n" +
      "   🟥 ⚠️ Fel bredd/antal ⚠️\n" +
      "   → Belysning finns utan motsvarande låda\n" +
      "   → Antal belysningar överstiger antal lådor\n" +
      "   → Fel belysning är kopplad till fel lådbredd\n" +
      "Via 🔍 kan man se exakt vilka stommar som har avvikelser samt vilka artiklar som används.\n" +
      "Status per stomme ges som: 🟩 = korrekt, 🟧 = delvis, 🟢 = saknas, 🟥 = fel",
    hingeCompare:
      "Här kontrolleras om antal gångjärn matchar behovet baserat på dörr(ar).\n" +
      "🚦 Övergripande resultat för artikellistan\n" +
      "Funktionen returnerar en status som visar om innehållet, i normalfallet, är korrekt eller behöver åtgärdas:\n" +    
      "🟩 Godkänt\n" +
      "→ Antalet gångjärn matchar behovet\n" +
      " 🟩 ⚠️ Extra gångjärn ⚠️\n" +
      "   → 2 eller flera kombinationer har ett överskott och kan ev. dela på en påse (2 st).\n" + 
      "     Vid flera typer av gångjärn i samma stomme så avgörs inte vilket som ger överskott.\n" +
      "🟥 Ej godkänt\n" +
      "→ Gångjärn saknas. En eller flera stommar har färre gångjärn än vad dess dörrar kräver\n" +
      "Via 🔍 kan man utläsa vilket stommar som har dörrar och gångjärn.\n" +
      "En av följande statusar anges\n" +
      "✅ = korrekt antal\n❌ = för få\n✅ ✚ ❗ = för många\n\n" +
      "Diff +/- = 1 anger att ett gångjärn är extra. (En påse innehåller 2 gångjärn).\n" + 
      "Väggskåp 675 får automatiskt en påse 45° då detta ingår med stommen. Horrisontella gångjärn matchas först emot lådfront.",
    drawerFrontsMatch:
      "Här kontrolleras att alla lådor, inre fronter och yttre fronter matchar varandra i bredd, höjd och antal.\n" +
      "Vi tar även hänsyn till specialfall som diskho, ugn, hällfläkt och andra artiklar som påverkar vilka fronter som faktiskt ska finnas.\n" +
      "🚦 Övergripande resultat för artikellistan.\n" + "Funktionen returnerar en status som visar om innehållet, i normalfallet, är korrekt eller behöver åtgärdas:\n" +
      "⬛ Nej → Inga lådor eller lådfronter har hittats i ordern.\n" +
      "🟩 Godkänt\n" +
      "→ Alla lådor har matchande inre eller yttre fronter i rätt storlek och antal.\n" +
      "→ Eventuella avvikelser kan förklaras av godkända orsaker (t.ex. ho, ugn eller hällfläkt).\n" +
      "🟥 Ej godkänt\n" +
      "→ En eller flera lådor saknar fronter eller har fel typ av front (fel bredd/höjd).\n" +
      "→ Det finnas för många fronter som inte kan kopplas till någon låda eller orsak.\n" +
      "Via 🔍 kan man se exakt vilken stomme som har avvikelsen. Statusraden visar total status per stomme.\n" +
      "✅ = Alla lådfronter kan härledas. ❌ = En eller flera lådfronter kan inte härledas. 🟥 ⚠️ Fel antal ⚠️ = Det finns fler lådfronter än lådor.\n" +
      "🟥 ⚠️ Fel lådfront ⚠️ = Det finns en eller flera lådfronter med fel bredd eller höjd\n" + 
      "Raderna under visar hur lådor och fronter matchas samt vilka korrigeringar som gjorts.",
    unusualDrawerCombos:
      "Här analyseras lådkombinationer i stommar för att identifiera ovanliga eller potentiellt felaktiga uppsättningar av lådor.\n" +
      "För att en kontroll ska utföras så krävs det att den totala höjden för yttre lådfronter är 20-80 cm samt att kombinationen ej innehåller 153° gångjärn.\n" +
      "🚦 Resultat\n" +
      "Funktionen returnerar en status som visar om innehållet troligtvis är korrekt eller behöver åtgärdas:\n" +
      "⬛ Nej\n" +
      "→ Inga lådor har hittats i artikellistan.\n" +
      "🟩 Godkänd\n" +
      "→ Kombinationen matchar inte en otillåten uppsättning\n" +
      "→ Godkända kombination påverkas av specialfall så som hällskydd, häll med fläkt eller diskho\n" +
      "🟥 Ej godkänd\n" +
      "→ Artikellistan innehåller en eller flera stommmar där kombinationen av lådstorlekar är ovanlig\n" +
      "Via 🔍 kan man se exakt vilken stomme som har avvikelsen. Statusraden visar total status per stomme.\n" +
        "✅ = Kombinationen har inga uppenbara fel\n" +
        "❌ = ovanlig kombination\n" +
        "🚫 Ingen kontroll = uppfyller ej regler för kontroll.",
    variousControll:
        "Här kontrolleras:\n" +
        "• Att handtag har borrmall\n" +
        "• Att max en kyl och en frys används\n" +
        "• Att fläkt har tillhörande rör\n" +
        "• Att rätt kompletterande artiklar finns",
};