// C:\PRIVAT\MinaProgram\iName reStructured\core\3_validators\presenters\common\cabinetRows.js

export function cabinetInfoRow(headers) {
  return {
    color: "Stomme",
    numbers: headers.map(h =>
      `${h.type}\n${h.width}×${h.depth}×${h.height} cm`
    )
  };
}