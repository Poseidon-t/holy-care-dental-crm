import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

const CLINIC_NAME = 'Holy Care Dental & Orthodontics Clinic';
const CLINIC_DOCTOR = 'Dr. Pinky Vijay MDS';
const CLINIC_REG = 'A-34195';
const CLINIC_PHONE = '+91 79772 57779';

const MEDICAL_CONDITIONS = [
  { key: 'jaundice', label: 'Jaundice' },
  { key: 'high_blood_pressure', label: 'High Blood Pressure' },
  { key: 'heart_diseases', label: 'Heart Diseases' },
  { key: 'bleeding_disorders', label: 'Bleeding Disorders' },
  { key: 'hemophilia', label: 'Hemophilia' },
  { key: 'allergy', label: 'Allergy' },
  { key: 'anemia', label: 'Anemia' },
  { key: 'fits', label: 'Fits' },
  { key: 'asthma_rs_disorders', label: 'Asthma / RS Disorders' },
  { key: 'thyroid', label: 'Thyroid' },
  { key: 'diabetes', label: 'Diabetes' },
  { key: 'kidney_diseases', label: 'Kidney Diseases' },
  { key: 'pregnancy_lactating', label: 'Pregnancy / Lactating' },
];

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function yesNo(val: number | unknown) {
  return val ? 'Yes' : 'No';
}

function styleHeader(ws: XLSX.WorkSheet, range: XLSX.Range, bgColor: string, fontColor = 'FFFFFF') {
  for (let C = range.s.c; C <= range.e.c; C++) {
    for (let R = range.s.r; R <= range.e.r; R++) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellRef]) ws[cellRef] = { t: 's', v: '' };
      ws[cellRef].s = {
        font: { bold: true, color: { rgb: fontColor }, name: 'Calibri', sz: 11 },
        fill: { fgColor: { rgb: bgColor }, patternType: 'solid' },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        border: {
          top: { style: 'thin', color: { rgb: 'CCCCCC' } },
          bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
          left: { style: 'thin', color: { rgb: 'CCCCCC' } },
          right: { style: 'thin', color: { rgb: 'CCCCCC' } },
        },
      };
    }
  }
}

function styleDataRow(ws: XLSX.WorkSheet, row: number, colCount: number, isAlt: boolean) {
  const bg = isAlt ? 'F0F7F6' : 'FFFFFF';
  for (let C = 0; C < colCount; C++) {
    const cellRef = XLSX.utils.encode_cell({ r: row, c: C });
    if (!ws[cellRef]) ws[cellRef] = { t: 's', v: '' };
    if (!ws[cellRef].s) ws[cellRef].s = {};
    ws[cellRef].s = {
      ...ws[cellRef].s,
      font: { name: 'Calibri', sz: 10, color: { rgb: '1A1A1A' } },
      fill: { fgColor: { rgb: bg }, patternType: 'solid' },
      alignment: { vertical: 'center', wrapText: false },
      border: {
        bottom: { style: 'hair', color: { rgb: 'DDDDDD' } },
        right: { style: 'hair', color: { rgb: 'DDDDDD' } },
      },
    };
  }
}

// ─── Sheet 1: Patient Summary ───
function buildPatientSheet(patients: Record<string, unknown>[]) {
  const HEADER_ROW = 3; // 0-indexed: rows 0-2 = clinic info, row 3 = headers

  // Clinic info rows
  const clinicInfo = [
    [CLINIC_NAME],
    [`${CLINIC_DOCTOR}  |  Reg. No: ${CLINIC_REG}  |  Ph: ${CLINIC_PHONE}`],
    [`Patient Report — Generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`],
    [], // spacer
  ];

  const headers = [
    'OP No.', 'Name', 'Age', 'Sex', 'Phone', 'Occupation', 'Address',
    'Chief Complaint', 'Previous Dental History', 'Diagnosis', 'Treatment Plan',
    'Doctor Approved', 'Submission', 'Registration Date',
  ];

  const rows = patients.map((p) => [
    `OP-${String(p.op_number).padStart(3, '0')}`,
    p.name,
    p.age,
    p.sex,
    p.phone,
    p.occupation || '',
    p.address || '',
    p.chief_complaint || '',
    p.previous_dental_history || '',
    p.diagnosis || '',
    p.treatment_plan || '',
    p.dentist_signature ? 'Yes' : 'No',
    String(p.submission_method).charAt(0).toUpperCase() + String(p.submission_method).slice(1),
    formatDate(String(p.created_at)),
  ]);

  const wsData = [...clinicInfo, headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Column widths
  ws['!cols'] = [
    { wch: 10 }, { wch: 24 }, { wch: 6 }, { wch: 8 }, { wch: 14 },
    { wch: 16 }, { wch: 32 }, { wch: 28 }, { wch: 28 }, { wch: 24 },
    { wch: 24 }, { wch: 14 }, { wch: 12 }, { wch: 18 },
  ];

  // Row heights
  ws['!rows'] = [
    { hpt: 22 }, { hpt: 16 }, { hpt: 14 }, { hpt: 6 }, { hpt: 20 },
  ];

  const totalCols = headers.length;

  // Clinic title style
  if (ws['A1']) ws['A1'].s = {
    font: { bold: true, sz: 14, color: { rgb: '1B5E4B' }, name: 'Calibri' },
    alignment: { horizontal: 'left', vertical: 'center' },
  };
  if (ws['A2']) ws['A2'].s = {
    font: { sz: 10, color: { rgb: '4A7A6E' }, name: 'Calibri' },
    alignment: { horizontal: 'left' },
  };
  if (ws['A3']) ws['A3'].s = {
    font: { sz: 10, italic: true, color: { rgb: '888888' }, name: 'Calibri' },
    alignment: { horizontal: 'left' },
  };

  // Merge clinic title across all columns
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: totalCols - 1 } },
  ];

  // Header row styling (teal)
  styleHeader(ws, { s: { r: HEADER_ROW, c: 0 }, e: { r: HEADER_ROW, c: totalCols - 1 } }, '1B5E4B');

  // Data rows
  rows.forEach((_, i) => {
    styleDataRow(ws, HEADER_ROW + 1 + i, totalCols, i % 2 === 1);
  });

  // Freeze header row
  ws['!freeze'] = { xSplit: 0, ySplit: HEADER_ROW + 1 };

  return ws;
}

// ─── Sheet 2: Medical History ───
function buildMedicalSheet(patients: Record<string, unknown>[]) {
  const HEADER_ROW = 0;

  const headers = [
    'OP No.', 'Name',
    ...MEDICAL_CONDITIONS.map(c => c.label),
  ];

  const rows = patients.map((p) => [
    `OP-${String(p.op_number).padStart(3, '0')}`,
    p.name,
    ...MEDICAL_CONDITIONS.map(c => yesNo(p[c.key])),
  ]);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  ws['!cols'] = [
    { wch: 10 }, { wch: 24 },
    ...MEDICAL_CONDITIONS.map(() => ({ wch: 18 })),
  ];

  ws['!rows'] = [{ hpt: 36 }];

  const totalCols = headers.length;

  // Header row (deep teal)
  styleHeader(ws, { s: { r: HEADER_ROW, c: 0 }, e: { r: HEADER_ROW, c: totalCols - 1 } }, '1B5E4B');

  rows.forEach((row, i) => {
    styleDataRow(ws, HEADER_ROW + 1 + i, totalCols, i % 2 === 1);
    // Highlight "Yes" cells in medical conditions in red
    for (let c = 2; c < totalCols; c++) {
      const cellRef = XLSX.utils.encode_cell({ r: HEADER_ROW + 1 + i, c });
      if (ws[cellRef] && ws[cellRef].v === 'Yes') {
        ws[cellRef].s = {
          ...ws[cellRef].s,
          font: { bold: true, color: { rgb: 'C0392B' }, name: 'Calibri', sz: 10 },
          fill: { fgColor: { rgb: 'FDEDEC' }, patternType: 'solid' },
        };
      }
    }
  });

  ws['!freeze'] = { xSplit: 2, ySplit: 1 };

  return ws;
}

// ─── Sheet 3: Treatments ───
function buildTreatmentsSheet(treatments: Record<string, unknown>[], patientMap: Map<number, Record<string, unknown>>) {
  const HEADER_ROW = 0;

  const headers = ['OP No.', 'Patient Name', 'Date', 'Description', 'Amount (₹)'];

  const rows = treatments.map((t) => {
    const patient = patientMap.get(Number(t.patient_id));
    return [
      patient ? `OP-${String(patient.op_number).padStart(3, '0')}` : '',
      patient ? patient.name : '',
      formatDate(String(t.appointment_date)),
      t.description,
      Number(t.amount),
    ];
  });

  // Total row
  const totalRow = ['', '', '', 'TOTAL', `=SUM(E2:E${rows.length + 1})`];

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows, totalRow]);

  ws['!cols'] = [
    { wch: 10 }, { wch: 24 }, { wch: 14 }, { wch: 40 }, { wch: 14 },
  ];

  ws['!rows'] = [{ hpt: 20 }];

  const totalCols = headers.length;

  styleHeader(ws, { s: { r: HEADER_ROW, c: 0 }, e: { r: HEADER_ROW, c: totalCols - 1 } }, '1B5E4B');

  rows.forEach((_, i) => {
    styleDataRow(ws, HEADER_ROW + 1 + i, totalCols, i % 2 === 1);
    // Format amount column as number
    const amountCell = XLSX.utils.encode_cell({ r: HEADER_ROW + 1 + i, c: 4 });
    if (ws[amountCell]) ws[amountCell].z = '#,##0.00';
  });

  // Total row style
  const totalRowIdx = rows.length + 1;
  for (let c = 0; c < totalCols; c++) {
    const cellRef = XLSX.utils.encode_cell({ r: totalRowIdx, c });
    if (!ws[cellRef]) ws[cellRef] = { t: 's', v: '' };
    ws[cellRef].s = {
      font: { bold: true, color: { rgb: '1B5E4B' }, name: 'Calibri', sz: 11 },
      fill: { fgColor: { rgb: 'E8F5F1' }, patternType: 'solid' },
      border: { top: { style: 'medium', color: { rgb: '1B5E4B' } } },
    };
  }
  const totalAmountCell = XLSX.utils.encode_cell({ r: totalRowIdx, c: 4 });
  if (ws[totalAmountCell]) ws[totalAmountCell].z = '#,##0.00';

  ws['!freeze'] = { xSplit: 0, ySplit: 1 };

  return ws;
}

// ─── Sheet 4: Summary ───
function buildSummarySheet(
  patients: Record<string, unknown>[],
  treatments: Record<string, unknown>[]
) {
  const approved = patients.filter(p => p.dentist_signature).length;
  const pending = patients.length - approved;
  const totalBilling = treatments.reduce((s, t) => s + Number(t.amount), 0);
  const maleCount = patients.filter(p => p.sex === 'Male').length;
  const femaleCount = patients.filter(p => p.sex === 'Female').length;
  const tabletCount = patients.filter(p => p.submission_method === 'tablet').length;
  const remoteCount = patients.filter(p => p.submission_method === 'remote').length;

  const data = [
    [CLINIC_NAME],
    [`${CLINIC_DOCTOR}  |  Reg. No: ${CLINIC_REG}`],
    [],
    ['SUMMARY REPORT'],
    [],
    ['Metric', 'Value'],
    ['Total Patients', patients.length],
    ['Doctor Approved', approved],
    ['Awaiting Approval', pending],
    [],
    ['Male Patients', maleCount],
    ['Female Patients', femaleCount],
    [],
    ['Registered via Tablet', tabletCount],
    ['Registered via QR / Remote', remoteCount],
    [],
    ['Total Treatment Records', treatments.length],
    ['Total Billing (₹)', totalBilling],
    [],
    ['Report Generated', new Date().toLocaleString('en-IN')],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);

  ws['!cols'] = [{ wch: 30 }, { wch: 20 }];

  // Title
  if (ws['A1']) ws['A1'].s = { font: { bold: true, sz: 14, color: { rgb: '1B5E4B' }, name: 'Calibri' } };
  if (ws['A2']) ws['A2'].s = { font: { sz: 10, color: { rgb: '4A7A6E' }, name: 'Calibri' } };
  if (ws['A4']) ws['A4'].s = { font: { bold: true, sz: 13, color: { rgb: '1B5E4B' }, name: 'Calibri' } };

  // Header row for metrics table
  styleHeader(ws, { s: { r: 5, c: 0 }, e: { r: 5, c: 1 } }, '1B5E4B');

  // Value rows
  const valueRows = [6, 7, 8, 10, 11, 13, 14, 16, 17, 19];
  valueRows.forEach((r, i) => {
    styleDataRow(ws, r, 2, i % 2 === 1);
    const valCell = XLSX.utils.encode_cell({ r, c: 1 });
    if (ws[valCell] && typeof ws[valCell].v === 'number') {
      ws[valCell].s = {
        ...ws[valCell].s,
        font: { bold: true, name: 'Calibri', sz: 11 },
        alignment: { horizontal: 'right' },
      };
    }
  });

  // Highlight total billing
  const billingCell = XLSX.utils.encode_cell({ r: 17, c: 1 });
  if (ws[billingCell]) {
    ws[billingCell].z = '₹#,##0.00';
    ws[billingCell].s = {
      font: { bold: true, color: { rgb: '1B5E4B' }, sz: 12, name: 'Calibri' },
      fill: { fgColor: { rgb: 'E8F5F1' }, patternType: 'solid' },
      alignment: { horizontal: 'right' },
    };
  }

  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } },
  ];

  return ws;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const patients = await query<Record<string, unknown>>(
      'SELECT * FROM patients ORDER BY op_number ASC',
      []
    );

    const treatments = await query<Record<string, unknown>>(
      'SELECT * FROM treatments ORDER BY patient_id ASC, appointment_date ASC',
      []
    );

    const patientMap = new Map(patients.map(p => [Number(p.id), p]));

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, buildSummarySheet(patients, treatments), 'Summary');
    XLSX.utils.book_append_sheet(wb, buildPatientSheet(patients), 'Patients');
    XLSX.utils.book_append_sheet(wb, buildMedicalSheet(patients), 'Medical History');
    XLSX.utils.book_append_sheet(wb, buildTreatmentsSheet(treatments, patientMap), 'Treatments');

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx', cellStyles: true });

    const date = new Date().toISOString().slice(0, 10);
    const filename = `holycare-patients-${date}.xlsx`;

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
