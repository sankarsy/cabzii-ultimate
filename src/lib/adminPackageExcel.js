import * as XLSX from "xlsx";
import {
  CAB_PACKAGE_FIELDS,
  DRIVER_PACKAGE_FIELDS,
  cabFormFromItem,
  cabFormToPayload,
  driverFormFromItem,
  driverFormToPayload,
  emptyCabForm,
  emptyDriverForm,
  emptyTourPackageForm,
  tourPackageFormFromItem,
  tourPackageFormToPayload
} from "./adminCatalogConfig";

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function str(v) {
  if (v == null) return "";
  return String(v).trim();
}

function pkgPrefixFields(prefix, fields) {
  return fields.flatMap(({ key }) => [
    `${prefix}_${key}_originalPrice`,
    `${prefix}_${key}_price`,
    `${prefix}_${key}_discountPercentage`,
    `${prefix}_${key}_extraKmRate`,
    `${prefix}_${key}_extraHourRate`
  ]);
}

const CAB_BASE_COLUMNS = [
  "id",
  "title",
  "vehicleModel",
  "vendor",
  "type",
  "seats",
  "bags",
  "city",
  "location",
  "price",
  "hourlyRate",
  "dayRate",
  "extraHourRate",
  "originalPrice",
  "discountPercentage",
  "rating",
  "status",
  "slug",
  "productCode",
  "brandName",
  "image",
  "features",
  "seoTitle",
  "seoDescription"
];

const DRIVER_BASE_COLUMNS = [
  "id",
  "name",
  "vendor",
  "type",
  "experience",
  "trips",
  "city",
  "location",
  "pricingHourly",
  "pricingDay",
  "pricingExtraHour",
  "discountPercentage",
  "rating",
  "status",
  "slug",
  "image",
  "languages",
  "supportedVehicles",
  "seoTitle",
  "seoDescription"
];

const PACKAGE_BASE_COLUMNS = [
  "id",
  "name",
  "vendor",
  "category",
  "duration",
  "price",
  "originalPrice",
  "discountPercentage",
  "hourlyRate",
  "dayRate",
  "extraHourRate",
  "city",
  "location",
  "state",
  "destination",
  "days",
  "nights",
  "status",
  "slug",
  "image",
  "tags",
  "description",
  "seoTitle",
  "seoDescription"
];

export const EXCEL_SHEETS = {
  cabs: "Cabs",
  drivers: "Drivers",
  packages: "HolidayPackages"
};

function writePkgColumns(row, prefix, fields, packages) {
  for (const { key } of fields) {
    const pkg = packages?.[key] || {};
    row[`${prefix}_${key}_originalPrice`] = num(pkg.originalPrice);
    row[`${prefix}_${key}_price`] = num(pkg.price);
    row[`${prefix}_${key}_discountPercentage`] = num(pkg.discountPercentage);
    row[`${prefix}_${key}_extraKmRate`] = num(pkg.extraKmRate);
    row[`${prefix}_${key}_extraHourRate`] = num(pkg.extraHourRate);
  }
}

function readPkgColumns(row, prefix, fields, targetPackages) {
  for (const { key } of fields) {
    targetPackages[key] = {
      originalPrice: num(row[`${prefix}_${key}_originalPrice`]),
      price: num(row[`${prefix}_${key}_price`]),
      discountPercentage: num(row[`${prefix}_${key}_discountPercentage`]),
      extraKmRate: num(row[`${prefix}_${key}_extraKmRate`]),
      extraHourRate: num(row[`${prefix}_${key}_extraHourRate`])
    };
  }
}

export function cabItemToRow(item) {
  const form = cabFormFromItem(item);
  const row = { id: str(item._id || item.id) };
  for (const col of CAB_BASE_COLUMNS.filter((c) => c !== "id")) {
    if (col === "features") {
      row.features = Array.isArray(item.features) ? item.features.join(", ") : str(form.features);
    } else {
      row[col] = form[col] ?? item[col] ?? "";
    }
  }
  writePkgColumns(row, "pkg", CAB_PACKAGE_FIELDS, form.farePackages);
  return row;
}

export function driverItemToRow(item) {
  const form = driverFormFromItem(item);
  const row = { id: str(item._id || item.id) };
  for (const col of DRIVER_BASE_COLUMNS.filter((c) => c !== "id")) {
    if (col === "languages") {
      row.languages = Array.isArray(item.languages) ? item.languages.join(", ") : str(form.languages);
    } else if (col === "supportedVehicles") {
      row.supportedVehicles = Array.isArray(item.supportedVehicles)
        ? item.supportedVehicles.join(", ")
        : str(form.supportedVehicles);
    } else {
      row[col] = form[col] ?? item[col] ?? "";
    }
  }
  writePkgColumns(row, "pkg", DRIVER_PACKAGE_FIELDS, form.farePackages);
  return row;
}

export function packageItemToRow(item) {
  const form = tourPackageFormFromItem(item);
  const row = { id: str(item._id || item.id) };
  for (const col of PACKAGE_BASE_COLUMNS.filter((c) => c !== "id")) {
    if (col === "tags") {
      row.tags = Array.isArray(item.tags) ? item.tags.join(", ") : str(form.tags);
    } else {
      row[col] = form[col] ?? item[col] ?? "";
    }
  }
  return row;
}

function cabColumns() {
  return [...CAB_BASE_COLUMNS, ...pkgPrefixFields("pkg", CAB_PACKAGE_FIELDS)];
}

function driverColumns() {
  return [...DRIVER_BASE_COLUMNS, ...pkgPrefixFields("pkg", DRIVER_PACKAGE_FIELDS)];
}

function packageColumns() {
  return PACKAGE_BASE_COLUMNS;
}

function rowsToSheet(rows, columns) {
  const normalized = rows.map((row) => {
    const out = {};
    for (const col of columns) {
      out[col] = row[col] ?? "";
    }
    return out;
  });
  return XLSX.utils.json_to_sheet(normalized, { header: columns });
}

export function downloadExcelWorkbook(filename, sheets) {
  const wb = XLSX.utils.book_new();
  for (const { name, rows, columns } of sheets) {
    XLSX.utils.book_append_sheet(wb, rowsToSheet(rows, columns), name.slice(0, 31));
  }
  XLSX.writeFile(wb, filename);
}

export function downloadTabExcel(tabKey, items) {
  const stamp = new Date().toISOString().slice(0, 10);
  if (tabKey === "cabs") {
    downloadExcelWorkbook(`cabzii-cabs-${stamp}.xlsx`, [
      { name: EXCEL_SHEETS.cabs, rows: items.map(cabItemToRow), columns: cabColumns() }
    ]);
    return;
  }
  if (tabKey === "drivers") {
    downloadExcelWorkbook(`cabzii-drivers-${stamp}.xlsx`, [
      { name: EXCEL_SHEETS.drivers, rows: items.map(driverItemToRow), columns: driverColumns() }
    ]);
    return;
  }
  if (tabKey === "packages") {
    downloadExcelWorkbook(`cabzii-holiday-packages-${stamp}.xlsx`, [
      { name: EXCEL_SHEETS.packages, rows: items.map(packageItemToRow), columns: packageColumns() }
    ]);
  }
}

export function downloadAllPackagesExcel({ cabs = [], drivers = [], packages = [] }) {
  const stamp = new Date().toISOString().slice(0, 10);
  downloadExcelWorkbook(`cabzii-all-packages-${stamp}.xlsx`, [
    { name: EXCEL_SHEETS.cabs, rows: cabs.map(cabItemToRow), columns: cabColumns() },
    { name: EXCEL_SHEETS.drivers, rows: drivers.map(driverItemToRow), columns: driverColumns() },
    { name: EXCEL_SHEETS.packages, rows: packages.map(packageItemToRow), columns: packageColumns() }
  ]);
}

function sheetToRows(sheet) {
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: "array" });
        resolve({
          cabs: sheetToRows(wb.Sheets[EXCEL_SHEETS.cabs]),
          drivers: sheetToRows(wb.Sheets[EXCEL_SHEETS.drivers]),
          packages: sheetToRows(wb.Sheets[EXCEL_SHEETS.packages]),
          singleSheet: wb.SheetNames.length === 1 ? sheetToRows(wb.Sheets[wb.SheetNames[0]]) : [],
          sheetNames: wb.SheetNames
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsArrayBuffer(file);
  });
}

export function rowToCabPayload(row) {
  const form = emptyCabForm();
  form.title = str(row.title);
  form.vehicleModel = str(row.vehicleModel);
  form.vendor = str(row.vendor);
  form.type = str(row.type) || "Sedan";
  form.seats = num(row.seats) || 4;
  form.bags = num(row.bags) || 2;
  form.city = str(row.city);
  form.location = str(row.location);
  form.price = num(row.price);
  form.hourlyRate = num(row.hourlyRate);
  form.dayRate = num(row.dayRate);
  form.extraHourRate = num(row.extraHourRate);
  form.originalPrice = num(row.originalPrice);
  form.discountPercentage = num(row.discountPercentage);
  form.rating = row.rating !== "" && row.rating != null ? str(row.rating) : "";
  form.status = str(row.status).toLowerCase() === "inactive" ? "inactive" : "active";
  form.slug = str(row.slug);
  form.productCode = str(row.productCode);
  form.brandName = str(row.brandName);
  form.image = str(row.image);
  form.features = str(row.features);
  form.seoTitle = str(row.seoTitle);
  form.seoDescription = str(row.seoDescription);
  readPkgColumns(row, "pkg", CAB_PACKAGE_FIELDS, form.farePackages);
  return cabFormToPayload(form);
}

export function rowToDriverPayload(row) {
  const form = emptyDriverForm();
  form.name = str(row.name);
  form.vendor = str(row.vendor);
  form.type = str(row.type) || "local";
  form.experience = str(row.experience) || "0 Years";
  form.trips = num(row.trips);
  form.city = str(row.city);
  form.location = str(row.location);
  form.pricingHourly = num(row.pricingHourly);
  form.pricingDay = num(row.pricingDay);
  form.pricingExtraHour = num(row.pricingExtraHour);
  form.discountPercentage = num(row.discountPercentage);
  form.rating = row.rating !== "" && row.rating != null ? str(row.rating) : "4.5";
  form.status = str(row.status).toLowerCase() === "inactive" ? "inactive" : "active";
  form.slug = str(row.slug);
  form.image = str(row.image);
  form.languages = str(row.languages);
  form.supportedVehicles = str(row.supportedVehicles);
  form.seoTitle = str(row.seoTitle);
  form.seoDescription = str(row.seoDescription);
  readPkgColumns(row, "pkg", DRIVER_PACKAGE_FIELDS, form.farePackages);
  return driverFormToPayload(form);
}

export function rowToPackagePayload(row) {
  const form = emptyTourPackageForm();
  form.name = str(row.name);
  form.vendor = str(row.vendor);
  form.category = str(row.category) || "pilgrimage";
  form.duration = str(row.duration);
  form.price = num(row.price);
  form.originalPrice = num(row.originalPrice);
  form.discountPercentage = num(row.discountPercentage);
  form.hourlyRate = num(row.hourlyRate);
  form.dayRate = num(row.dayRate);
  form.extraHourRate = num(row.extraHourRate);
  form.city = str(row.city);
  form.location = str(row.location);
  form.state = str(row.state);
  form.destination = str(row.destination);
  form.days = num(row.days);
  form.nights = num(row.nights);
  form.status = str(row.status).toLowerCase() === "inactive" ? "inactive" : "active";
  form.slug = str(row.slug);
  form.image = str(row.image);
  form.tags = str(row.tags);
  form.description = str(row.description);
  form.seoTitle = str(row.seoTitle);
  form.seoDescription = str(row.seoDescription);
  return tourPackageFormToPayload(form);
}

function isEmptyRow(row) {
  const values = Object.values(row || {}).filter((v) => str(v) !== "");
  return values.length === 0;
}

export async function importPackageRows({ tabKey, rows, apiBase, authHeaders, onProgress }) {
  const list = (rows || []).filter((r) => !isEmptyRow(r));
  let imported = 0;
  let updated = 0;
  const errors = [];

  const rowToPayload =
    tabKey === "cabs" ? rowToCabPayload : tabKey === "drivers" ? rowToDriverPayload : rowToPackagePayload;

  for (let i = 0; i < list.length; i += 1) {
    const row = list[i];
    const rowNum = i + 2;
    try {
      const payload = rowToPayload(row);
      const id = str(row.id);
      const method = id ? "PUT" : "POST";
      const url = id ? `${apiBase}/${id}` : apiBase;

      if (tabKey === "cabs" && !payload.title) throw new Error("title is required");
      if (tabKey === "drivers" && !payload.name) throw new Error("name is required");
      if (tabKey === "packages" && !payload.name) throw new Error("name is required");

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
      }
      if (id) updated += 1;
      else imported += 1;
    } catch (err) {
      errors.push({ row: rowNum, message: err.message || String(err) });
    }
    if (onProgress) onProgress({ done: i + 1, total: list.length, imported, updated, errors: errors.length });
  }

  return { imported, updated, errors, total: list.length };
}

export async function importAllPackagesFromWorkbook({ parsed, authHeaders, onProgress }) {
  const jobs = [
    { tabKey: "cabs", rows: parsed.cabs?.length ? parsed.cabs : [], base: "/api/cabs" },
    { tabKey: "drivers", rows: parsed.drivers?.length ? parsed.drivers : [], base: "/api/drivers" },
    { tabKey: "packages", rows: parsed.packages?.length ? parsed.packages : [], base: "/api/packages" }
  ];

  if (parsed.singleSheet?.length && parsed.sheetNames?.length === 1) {
    return { imported: 0, updated: 0, errors: [{ row: 0, message: "Use Cabzii export file with Cabs, Drivers and HolidayPackages sheets, or upload from the matching tab." }], total: 0 };
  }

  let imported = 0;
  let updated = 0;
  const errors = [];
  let total = 0;

  for (const job of jobs) {
    if (!job.rows.length) continue;
    const result = await importPackageRows({
      tabKey: job.tabKey,
      rows: job.rows,
      apiBase: job.base,
      authHeaders,
      onProgress
    });
    imported += result.imported;
    updated += result.updated;
    errors.push(...result.errors.map((e) => ({ ...e, sheet: job.tabKey })));
    total += result.total;
  }

  return { imported, updated, errors, total };
}
