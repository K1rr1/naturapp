import fs from "node:fs";
import path from "node:path";
import type { MockUser } from "./users";
import { defaultUsers } from "./users";
import type { Report, ReportStatus } from "../types/report.types";
import { defaultReports } from "./reports";

const dataDir = path.resolve(__dirname, "../../data");
const usersFile = path.join(dataDir, "users.json");
const reportsFile = path.join(dataDir, "reports.json");

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function ensureFile<T>(filePath: string, defaultValue: T) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), "utf-8");
  }
}

function readJsonFile<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function writeJsonFile<T>(filePath: string, data: T) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function ensureStoreFiles() {
  ensureDataDir();
  ensureFile(usersFile, defaultUsers);
  ensureFile(reportsFile, defaultReports);
}

ensureStoreFiles();

export function getUsers(): MockUser[] {
  return readJsonFile<MockUser[]>(usersFile);
}

export function findUserByUsername(username: string): MockUser | undefined {
  return getUsers().find((user) => user.username === username);
}

export function addUser(user: MockUser): void {
  const users = getUsers();
  users.push(user);
  writeJsonFile(usersFile, users);
}

export function getReports(): Report[] {
  return readJsonFile<Report[]>(reportsFile);
}

export function addReport(report: Report): void {
  const reports = getReports();
  reports.unshift(report);
  writeJsonFile(reportsFile, reports);
}

export function updateReportStatus(
  reportId: number,
  status: ReportStatus
): Report | undefined {
  const reports = getReports();
  const report = reports.find((item) => item.id === reportId);

  if (!report) return undefined;

  report.status = status;
  writeJsonFile(reportsFile, reports);
  return report;
}
