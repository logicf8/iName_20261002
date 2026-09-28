import { createValidationEntry } from '../helper/validationResultFactory.js';
import { helpMessages } from './helper/helpMessages.js'; 
import { prepareHeaders } from './common/prepareHeaders.js';

export function variousControllTxt(sP, result) {

  const rows = [
    {
      label: "Borrmall?\n- Om handtag finns",
      status: result.handle.status,
      col1: result.handle.col1,
      col2: result.handle.col2
    },
    {
      label: "Diffusionsspärr?\n- Om ugn i bänkskåp samt behov",
      status: result.diff.status,
      col1: result.diff.col1,
      col2: result.diff.col2
    },
    {
      label: "Fläktrör?\n- Om fläkt finns",
      status: result.fan.status,
      col1: result.fan.col1,
      col2: result.fan.col2
    },
    {
      label: "Kyl/frys ej dubblett?\n- Max en fullstor kyl & frys",
      status: result.fridge.status,
      col1: result.fridge.col1,
      col2: result.fridge.col2
    },
    {
      label: "Ventilationsgaller?\n- Ett per kyl/frys.",
      status: result.vent.status,
      col1: result.vent.col1,
      col2: result.vent.col2
    },
    {
      label: "Ventilerad sockel?\n- En per integrerad kyl/frys.",
      status: result.sockel.status,
      col1: result.sockel.col1,
      col2: result.sockel.col2
    },
    {
      label: "Golvskydd?\n- Ett per fristående vitvara",
      status: result.floor.status,
      col1: result.floor.col1,
      col2: result.floor.col2
    },
    {
      label: "Våglig?\n- Om diskmaskin och lådfronter",
      status: result.dishwasherDrawer.status,
      col1: result.dishwasherDrawer.col1,
      col2: result.dishwasherDrawer.col2
    },
    {
      label: "Hällskydd?\n- Om häll i bänkskåp och ingen ugn",
      status: result.hob.status,
      col1: result.hob.col1,
      col2: result.hob.col2
    },
    {
      label: "Hyllplansskydd och tätningssats?\n- Ett hpl.skydd & tät.sats per skåp",
      status: result.sink.status,
      col1: result.sink.col1,
      col2: result.sink.col2
    },
    {
      label: "Vattenlås & lock?\n- Beroende av antal hoar",
      status: result.sink2.status,
      col1: result.sink2.col1,
      col2: result.sink2.col2
    },
    {
      label: "Inbyggnads- stomme?\n- Krävs för vitvara/ho",
      status: result.builtIn.status,
      col1: result.builtIn.col1,
      col2: result.builtIn.col2
    }
  ];

 console.log("checkTxts:", sP.checkTxts);
 console.log("various:", result);

  //Sortering: ❌ → ✅ → -
  const statusOrder = {
    "❌": 0,
    "✅": 1,
    "-": 2
  };

  const sortedRows = [...rows].sort(
    (a, b) =>
      (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99)
  );

  createValidationEntry(sP.checkTxts, {
    title: "Övriga kontroller",
    text: result.dynamicText,
    level: "info",
    simpleTable: true,
    
    headers: [
      "Kontroll",
      "Status",
      "Hittad artikel",
      "Tillgodoser artikel"
    ],
    rows: sortedRows,
    pic: "blandat.png",
    message:
      helpMessages.variousControll
  });
}