import { Router, Response } from "express";
import { reports } from "../data/reports";
import { authMiddleware, AuthenticatedRequest } from "../middleware/authMiddleware";
import type { ReportCategory, ReportStatus } from "../types/report.types";

const router = Router();

type CreateReportBody = {
  lat?: number;
  lng?: number;
  text?: string;
  category?: ReportCategory;
};

type UpdateStatusBody = {
  status?: ReportStatus;
};

router.get("/reports", (_req, res: Response) => {
  return res.json(reports);
});

router.post(
  "/reports",
  authMiddleware,
  (req: AuthenticatedRequest, res: Response) => {
    const { lat, lng, text, category } = req.body as CreateReportBody;

    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      !text ||
      !category
    ) {
      return res.status(400).json({
        message: "lat, lng, text och category krävs.",
      });
    }

    if (!req.user?.username) {
      return res.status(401).json({
        message: "Ingen användare hittades i token.",
      });
    }

    const newReport = {
      id: Date.now(),
      lat,
      lng,
      text: text.trim(),
      category,
      createdBy: req.user.username,
      createdAt: new Date().toISOString(),
      status: "öppen" as const,
    };

    reports.unshift(newReport);

    return res.status(201).json(newReport);
  }
);

router.patch(
  "/reports/:id/status",
  authMiddleware,
  (req: AuthenticatedRequest, res: Response) => {
    const reportId = Number(req.params.id);
    const { status } = req.body as UpdateStatusBody;

    if (!status || !["öppen", "åtgärdad"].includes(status)) {
      return res.status(400).json({
        message: "Status måste vara 'öppen' eller 'åtgärdad'.",
      });
    }

    const report = reports.find((item) => item.id === reportId);

    if (!report) {
      return res.status(404).json({
        message: "Rapporten hittades inte.",
      });
    }

    if (report.createdBy !== req.user?.username) {
      return res.status(403).json({
        message: "Du får bara ändra status på dina egna rapporter.",
      });
    }

    report.status = status;

    return res.json(report);
  }
);

export default router;