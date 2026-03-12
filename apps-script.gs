// ══════════════════════════════════════════════════════════
//  CENSO DE CLIENTES — Google Apps Script
//  Pegar este código en script.google.com y publicar como Web App
// ══════════════════════════════════════════════════════════

// ID del Google Sheets donde se guardarán los datos
// (lo encuentras en la URL del Sheets: .../spreadsheets/d/ESTE_ID/edit)
const SHEET_ID = '1hCbnFHpVIsdfozcLrBH2Oje-6IDRsZhdDex8-skHc8Q';

// Nombre de la pestaña donde se guardarán las respuestas
const SHEET_NAME = 'Respuestas';

// ──────────────────────────────────────────────────────────
//  ENCABEZADOS DE COLUMNAS
//  (se crean automáticamente la primera vez)
// ──────────────────────────────────────────────────────────
const HEADERS = [
  'Timestamp',
  'Encuestador',
  'Razón Social',
  'Es Sucursal',
  'Nombre Sucursal',
  'Nombre Cliente (Registrado)',
  'RIF',
  'Tipo Cliente',
  'Distribuidor',
  'Canal',
  'Sub-Canal',
  'Estado',
  'Ciudad',
  'GPS Coordenadas',
  'Estado Envío'
];

// ──────────────────────────────────────────────────────────
//  RECIBIR POST DESDE LA APP
// ──────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Crear pestaña si no existe
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
      // Formato de encabezados
      const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setBackground('#0A1628');
      headerRange.setFontColor('#2DD4BF');
      headerRange.setFontWeight('bold');
      headerRange.setFontSize(11);
      sheet.setFrozenRows(1);
    }

    // Agregar fila con los datos
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.encuestador || '',
      data.razon_social || '',
      data.es_sucursal || 'No',
      data.nombre_sucursal || '',
      data.nombre_cliente || '',
      data.rif || '',
      data.tipo_cliente || '',
      data.distribuidor || '',
      data.canal || '',
      data.sub_canal || '',
      data.estado || '',
      data.ciudad || '',
      data.gps || '',
      'Enviado'
    ]);

    // Auto-ajustar columnas
    sheet.autoResizeColumns(1, HEADERS.length);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', message: 'Datos guardados correctamente' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ──────────────────────────────────────────────────────────
//  RESPONDER GET (prueba de que el script funciona)
// ──────────────────────────────────────────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Censo de Clientes API activa' }))
    .setMimeType(ContentService.MimeType.JSON);
}
