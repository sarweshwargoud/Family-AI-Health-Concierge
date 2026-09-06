from typing import Dict, Any, List
from datetime import datetime

class TimelineAgent:
    """
    Synthesizes discrete medical reports, diagnoses, and clinic visits
    into a unified chronological timeline for family health tracking.
    """
    def synthesize_event_from_report(self, report: Dict[str, Any], member_id: str) -> Dict[str, Any]:
        date_val = report.get("date") or datetime.utcnow().strftime("%Y-%m-%d")
        year_val = date_val.split("-")[0] if "-" in date_val else datetime.utcnow().strftime("%Y")
        title = report.get("title", "Clinical Document")
        category = report.get("category", "Report")
        hospital = report.get("hospital", "Medical Center")
        doctor = report.get("doctor", "Physician")

        icon_map = {
            "Blood Test": "activity",
            "Prescription": "pill",
            "MRI Scan": "file-text",
            "X-Ray": "file-text",
            "Surgery": "alert-circle",
            "Consultation": "user-check"
        }

        icon = icon_map.get(category, "file-text")
        description = f"Uploaded document: {category} from {hospital} under {doctor}."

        return {
            "id": f"t_{int(datetime.utcnow().timestamp() * 1000)}",
            "memberId": member_id,
            "date": date_val,
            "year": year_val,
            "title": title,
            "type": "report",
            "description": description,
            "icon": icon
        }

timeline_agent = TimelineAgent()
