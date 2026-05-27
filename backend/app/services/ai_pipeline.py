import cv2
import numpy as np
import random
import math
from typing import Dict, Any, List, Tuple
from ..models.complaint import IssueCategory

class AIPipelineService:
    @staticmethod
    def classify_issue(image_url: str) -> Dict[str, Any]:
        """
        Simulates YOLOv8 and CLIP inference over an uploaded image.
        Returns detected category, confidence bounding box details, and an estimated severity.
        """
        # Determine a deterministic or random category based on keywords in URL
        url_lower = image_url.lower()
        
        detected_class = IssueCategory.POTHOLE
        confidence = round(random.uniform(0.85, 0.98), 2)
        
        if "garbage" in url_lower or "trash" in url_lower:
            detected_class = IssueCategory.GARBAGE_DUMPING
        elif "water" in url_lower or "flood" in url_lower:
            detected_class = IssueCategory.WATER_STAGNATION
        elif "light" in url_lower or "dark" in url_lower:
            detected_class = IssueCategory.BROKEN_STREETLIGHT
        elif "drain" in url_lower or "sewage" in url_lower:
            detected_class = IssueCategory.DRAINAGE_BLOCKAGE
        elif "road" in url_lower or "crack" in url_lower:
            detected_class = IssueCategory.DAMAGED_ROAD
        elif "dump" in url_lower:
            detected_class = IssueCategory.ILLEGAL_DUMPING
        elif "toilet" in url_lower or "sanitation" in url_lower:
            detected_class = IssueCategory.PUBLIC_SANITATION
        else:
            # Random choice if no keyword
            detected_class = random.choice(list(IssueCategory))

        # Simulate severity math (bounding box ratio to total canvas)
        bbox_width = random.randint(120, 480)
        bbox_height = random.randint(100, 360)
        canvas_area = 1920 * 1080
        bbox_area = bbox_width * bbox_height
        
        severity_ratio = bbox_area / canvas_area
        # Math: severity = min(10, round(severity_ratio * 40 + confidence * 4))
        severity = min(10, max(1, round(severity_ratio * 120 + confidence * 3)))

        # Determine emergency triggers (e.g. sewage/drain blockage on a main road, or deep potholes)
        is_emergency = False
        if detected_class in [IssueCategory.DRAINAGE_BLOCKAGE, IssueCategory.WATER_STAGNATION] and severity >= 7:
            is_emergency = True
        elif detected_class == IssueCategory.POTHOLE and severity >= 8:
            is_emergency = True

        return {
            "category": detected_class,
            "confidence": confidence,
            "severity_score": severity,
            "is_emergency": is_emergency,
            "bounding_box": {
                "x": random.randint(100, 500),
                "y": random.randint(100, 400),
                "width": bbox_width,
                "height": bbox_height
            },
            "threat_analysis": "Presents direct hazard to motorists" if is_emergency else "Requires municipal remediation"
        }

    @staticmethod
    def detect_duplicate(
        lat: float, 
        lng: float, 
        category: IssueCategory, 
        existing_complaints: List[Dict[str, Any]],
        threshold_meters: float = 30.0
    ) -> Tuple[bool, int, float]:
        """
        Simulates geospatial overlap check and CLIP embedding cosine similarity.
        Returns: (is_duplicate, parent_complaint_id, similarity_score)
        """
        def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
            R = 6371000  # Radius of Earth in meters
            phi_1 = math.radians(lat1)
            phi_2 = math.radians(lat2)
            delta_phi = math.radians(lat2 - lat1)
            delta_lambda = math.radians(lon2 - lon1)
            
            a = math.sin(delta_phi/2.0)**2 + \
                math.cos(phi_1) * math.cos(phi_2) * math.sin(delta_lambda/2.0)**2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            return R * c

        for comp in existing_complaints:
            # Geospatial filter
            distance = haversine_distance(lat, lng, comp["latitude"], comp["longitude"])
            if distance <= threshold_meters and comp["category"] == category:
                # Inside range with matching category: simulate CLIP feature vector matching
                # Bounding similarity between 0.72 and 0.95
                similarity = round(0.72 + (0.23 * (1.0 - (distance / threshold_meters))), 2)
                if similarity >= 0.80:
                    return True, comp["id"], similarity
                    
        return False, -1, 0.0

    @staticmethod
    def route_department(category: IssueCategory) -> str:
        """
        Determines routing using category lookup table.
        """
        routing_map = {
            IssueCategory.POTHOLE: "Roads & Highways Department",
            IssueCategory.DAMAGED_ROAD: "Roads & Highways Department",
            IssueCategory.GARBAGE_DUMPING: "Sanitation & Solid Waste Department",
            IssueCategory.ILLEGAL_DUMPING: "Sanitation & Solid Waste Department",
            IssueCategory.PUBLIC_SANITATION: "Sanitation & Solid Waste Department",
            IssueCategory.BROKEN_STREETLIGHT: "Electricity & Public Lighting Department",
            IssueCategory.WATER_STAGNATION: "Storm Water & Drainage Board",
            IssueCategory.DRAINAGE_BLOCKAGE: "Storm Water & Drainage Board"
        }
        return routing_map.get(category, "General Municipal Administration")

    @staticmethod
    def verify_resolution(before_img: str, after_img: str) -> Dict[str, Any]:
        """
        Simulates OpenCV Homography, alignment, and Structural Similarity (SSIM) matching
        to verify that the civic defect has been successfully repaired in the "after" image.
        """
        # Simulate computing matching features
        features_detected = random.randint(150, 400)
        homography_success = True
        
        # High SSIM (>0.70) indicates the cameras match view angles/locations
        ssim_score = round(random.uniform(0.72, 0.94), 2)
        
        # YOLO coverage inside original defect bounding box should drop to ~0
        defect_residual_confidence = round(random.uniform(0.01, 0.12), 2)
        
        resolved = ssim_score >= 0.75 and defect_residual_confidence <= 0.15
        
        return {
            "verified": resolved,
            "ssim_similarity": ssim_score,
            "defect_residual_confidence": defect_residual_confidence,
            "feature_alignment_points": features_detected,
            "homography_matrix_stable": homography_success,
            "ai_comments": "Quality check PASSED. Defect fully corrected." if resolved else "Quality check FAILED. Residual defect visible."
        }
