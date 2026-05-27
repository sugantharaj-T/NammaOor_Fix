import os
import random
import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, desc, func
from sqlalchemy.orm import sessionmaker, Session

from .models.complaint import Base, User, Complaint, MeTooSupport, StatusUpdate, IssueCategory, ResolutionStatus
from .services.ai_pipeline import AIPipelineService

# Define SQLite database configuration in workspace
DATABASE_URL = "sqlite:///./civiclens.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CivicLens AI / NammaFix Backend",
    description="AI-powered civic issue reporting and routing API ecosystem.",
    version="1.0.0"
)

# Enable CORS for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get db session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Schemas for validation
class UserCreateSchema(BaseModel):
    uid: str
    name: str
    email: str
    avatar_url: Optional[str] = None

class ComplaintCreateSchema(BaseModel):
    title: str = Field(..., example="Deep Pothole at Gandhipuram Junction")
    description: str = Field(..., example="A heavy pothole near the bus stand causing severe vehicle delays.")
    image_url: str = Field(..., example="https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80")
    latitude: float = Field(..., example=11.0180)
    longitude: float = Field(..., example=76.9640)
    address: Optional[str] = "Gandhipuram, Coimbatore, Tamil Nadu"
    landmarks: Optional[str] = "Near Bus Depot"
    reported_by: str = Field(..., example="citizen_123")

class StatusUpdateSchema(BaseModel):
    officer_name: str
    comment: str
    progress_image_url: Optional[str] = None
    eta_days: Optional[int] = None
    new_status: ResolutionStatus

class VerificationSchema(BaseModel):
    after_image_url: str

# Seed mock database with realistic civic complaints in Chennai / Bangalore
def seed_mock_data(db: Session):
    if db.query(User).count() > 0:
        return
        
    print("Seeding database with startup-level mock records...")
    
    # 1. Create Mock Citizens and Officers
    mock_users = [
        User(id="citizen_1", name="Sugantharaj T", email="suganth@civiclens.ai", avatar_url="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop", reputation_points=320, is_verified_citizen=True),
        User(id="citizen_2", name="Kavin Kumar", email="kavin@nammafix.in", avatar_url="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop", reputation_points=180, is_verified_citizen=True),
        User(id="citizen_3", name="Priya Sharma", email="priya@outlook.com", avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", reputation_points=95, is_verified_citizen=False),
        User(id="officer_1", name="Dr. A. Rajesh, IAS", email="commissioner@coimbatorecorp.gov.in", avatar_url="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop", reputation_points=500, is_verified_citizen=True)
    ]
    
    for u in mock_users:
        db.add(u)
    db.commit()

    # 2. Add realistic active complaints in Chennai
    mock_complaints = [
        Complaint(
            title="Sewer Overlap & Drainage Blockage",
            description="Sewage water overflow is flooding the main road street corners, causing immense bad odor and breeding mosquitoes.",
            category=IssueCategory.DRAINAGE_BLOCKAGE,
            reported_by="citizen_1",
            latitude=11.0180,
            longitude=76.9640,
            address="Cross Cut Road, Gandhipuram, Coimbatore, Tamil Nadu 641012",
            landmarks="Opposite Joyalukkas Jewellers",
            before_image_url="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
            severity_score=8,
            priority_score=135, # high score (severe, dense traffic)
            status=ResolutionStatus.IN_PROGRESS,
            is_emergency=True,
            assigned_department="Storm Water & Drainage Board",
            assigned_worker_id="Worker-Drain-Kovai-04"
        ),
        Complaint(
            title="Massive Pothole Crater on Gandhipuram Flyover",
            description="Extremely deep pothole that can easily throw off 2-wheeler riders during night time. Highly hazardous.",
            category=IssueCategory.POTHOLE,
            reported_by="citizen_2",
            latitude=11.0168,
            longitude=76.9558,
            address="Avinashi Road, Gandhipuram, Coimbatore, Tamil Nadu 641012",
            landmarks="Near Gandhipuram Flyover",
            before_image_url="https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80",
            severity_score=9,
            priority_score=185,
            status=ResolutionStatus.REPORTED,
            is_emergency=True,
            assigned_department="Roads & Highways Department"
        ),
        Complaint(
            title="Illegal Garbage Dumping Yard",
            description="Unauthorized plastic and organic waste heaps piled up over the walking lane. Stinks horribly.",
            category=IssueCategory.GARBAGE_DUMPING,
            reported_by="citizen_3",
            latitude=11.0264,
            longitude=77.0012,
            address="Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004",
            landmarks="Next to Nilgiris Supermarket",
            before_image_url="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80",
            severity_score=6,
            priority_score=72,
            status=ResolutionStatus.REPORTED,
            is_emergency=False,
            assigned_department="Sanitation & Solid Waste Department"
        ),
        Complaint(
            title="Broken Streetlights Near School",
            description="Entire stretch of streetlights are inactive since 3 days, making the road pitch black and unsafe for children.",
            category=IssueCategory.BROKEN_STREETLIGHT,
            reported_by="citizen_1",
            latitude=11.0115,
            longitude=76.9460,
            address="DB Road, RS Puram, Coimbatore, Tamil Nadu 641002",
            landmarks="Opposite RS Puram Secondary School",
            before_image_url="https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=600&q=80",
            severity_score=5,
            priority_score=45,
            status=ResolutionStatus.RESOLVED,
            is_emergency=False,
            assigned_department="Electricity & Public Lighting Department",
            after_image_url="https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=600&q=80"
        )
    ]
    
    for c in mock_complaints:
        db.add(c)
    db.commit()

    # 3. Add a few "Me Too" supports and updates
    db.add(MeTooSupport(complaint_id=1, user_id="citizen_2"))
    db.add(MeTooSupport(complaint_id=1, user_id="citizen_3"))
    db.add(MeTooSupport(complaint_id=2, user_id="citizen_1"))
    
    db.add(StatusUpdate(
        complaint_id=1,
        officer_name="K. Balakrishnan, Assistant Engineer",
        comment="Site inspected. Drainage pump dispatch request sent. Cleansing will start tomorrow early morning.",
        eta=datetime.datetime.utcnow() + datetime.timedelta(days=1)
    ))
    db.commit()
    print("Mock database seeding completed!")

# WebSocket connection manager for live dashboard notifications
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                # Handle dead/broken websockets
                pass

manager = ConnectionManager()

# --- API ENDPOINTS ---

# 1. Root / Health Check
@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": "CivicLens AI Framework Backend",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

# 2. Setup mock DB trigger
@app.post("/api/system/seed")
def trigger_seed(db: Session = Depends(get_db)):
    seed_mock_data(db)
    return {"message": "Database populated with mock Indian civic data."}

# 3. Authenticate / Create User
@app.post("/api/auth/register")
def register_user(user_data: UserCreateSchema, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_data.uid).first()
    if db_user:
        return db_user
    
    new_user = User(
        id=user_data.uid,
        name=user_data.name,
        email=user_data.email,
        avatar_url=user_data.avatar_url
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Get specific profile stats
@app.get("/api/users/{uid}")
def get_user_profile(uid: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Calculate counts
    submitted = db.query(Complaint).filter(Complaint.reported_by == uid).count()
    solved = db.query(Complaint).filter(Complaint.reported_by == uid, Complaint.status == ResolutionStatus.RESOLVED).count()
    
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "avatar_url": user.avatar_url,
        "reputation_points": user.reputation_points,
        "is_verified_citizen": user.is_verified_citizen,
        "stats": {
            "submitted_count": submitted,
            "solved_count": solved,
            "community_impact": submitted * 10 + solved * 50
        }
    }

# 4. Post New Complaint (With AI YOLO inference, Duplicate checks and Department Router)
@app.post("/api/complaints")
async def create_complaint(data: ComplaintCreateSchema, db: Session = Depends(get_db)):
    # Trigger AI classification and severity check
    ai_result = AIPipelineService.classify_issue(data.image_url)
    
    # Check for Duplicate Issues in the neighborhood (30m radius)
    existing_list = []
    active_issues = db.query(Complaint).filter(Complaint.status != ResolutionStatus.RESOLVED).all()
    for active in active_issues:
        existing_list.append({
            "id": active.id,
            "category": active.category,
            "latitude": active.latitude,
            "longitude": active.longitude
        })
        
    is_dup, parent_id, similarity = AIPipelineService.detect_duplicate(
        data.latitude, data.longitude, ai_result["category"], existing_list
    )
    
    # Route Department based on AI logic
    assigned_dept = AIPipelineService.route_department(ai_result["category"])
    
    # Compile priority score math: severity * 15 + emergency_bonus (50)
    priority = ai_result["severity_score"] * 12
    if ai_result["is_emergency"]:
        priority += 50
        
    new_complaint = Complaint(
        title=data.title,
        description=data.description,
        category=ai_result["category"],
        reported_by=data.reported_by,
        latitude=data.latitude,
        longitude=data.longitude,
        address=data.address,
        landmarks=data.landmarks,
        before_image_url=data.image_url,
        severity_score=ai_result["severity_score"],
        priority_score=priority,
        status=ResolutionStatus.REPORTED,
        is_duplicate=is_dup,
        parent_complaint_id=parent_id if is_dup else None,
        is_emergency=ai_result["is_emergency"],
        assigned_department=assigned_dept
    )
    
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)
    
    # Trigger reputation score increment for reporter
    user = db.query(User).filter(User.id == data.reported_by).first()
    if user:
        user.reputation_points += 15
        db.commit()
        
    # Broadcast event real-time over WebSocket to the Gov dashboard
    ws_event = {
        "event": "new_complaint",
        "complaint_id": new_complaint.id,
        "title": new_complaint.title,
        "category": new_complaint.category,
        "severity": new_complaint.severity_score,
        "priority_score": new_complaint.priority_score,
        "is_emergency": new_complaint.is_emergency,
        "is_duplicate": is_dup,
        "parent_id": parent_id if is_dup else None,
        "assigned_department": assigned_dept
    }
    await manager.broadcast(ws_event)
    
    return {
        "complaint": new_complaint,
        "ai_analysis": {
            "detected_category": ai_result["category"],
            "confidence": ai_result["confidence"],
            "detected_severity": ai_result["severity_score"],
            "is_emergency": ai_result["is_emergency"],
            "auto_routed_department": assigned_dept,
            "duplicate_found": is_dup,
            "parent_id": parent_id if is_dup else None
        }
    }

# 5. List Complaints Feed (Filters: category, status, emergency, user-specific)
@app.get("/api/complaints")
def list_complaints(
    category: Optional[IssueCategory] = None,
    status: Optional[ResolutionStatus] = None,
    emergency: Optional[bool] = None,
    user_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Complaint)
    
    if category:
        query = query.filter(Complaint.category == category)
    if status:
        query = query.filter(Complaint.status == status)
    if emergency is not None:
        query = query.filter(Complaint.is_emergency == emergency)
    if user_id:
        query = query.filter(Complaint.reported_by == user_id)
        
    # Sort issues: Emergency first, then priority score descending, then date
    complaints = query.order_index = query.order_by(
        desc(Complaint.is_emergency),
        desc(Complaint.priority_score),
        desc(Complaint.reported_at)
    ).all()
    
    # Calculate me-too supports length for each complaint
    results = []
    for c in complaints:
        votes = db.query(MeTooSupport).filter(MeTooSupport.complaint_id == c.id).count()
        results.append({
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "category": c.category,
            "latitude": c.latitude,
            "longitude": c.longitude,
            "address": c.address,
            "landmarks": c.landmarks,
            "before_image_url": c.before_image_url,
            "after_image_url": c.after_image_url,
            "severity_score": c.severity_score,
            "priority_score": c.priority_score,
            "status": c.status,
            "is_duplicate": c.is_duplicate,
            "parent_complaint_id": c.parent_complaint_id,
            "is_emergency": c.is_emergency,
            "assigned_department": c.assigned_department,
            "assigned_worker_id": c.assigned_worker_id,
            "reported_at": c.reported_at,
            "updated_at": c.updated_at,
            "votes_count": votes
        })
        
    return results

# 6. Vote / Me Too Support for Pothole/Garbage
@app.post("/api/complaints/{complaint_id}/support")
async def support_complaint(complaint_id: int, user_id: str, db: Session = Depends(get_db)):
    # Check if already voted
    existing = db.query(MeTooSupport).filter(
        MeTooSupport.complaint_id == complaint_id,
        MeTooSupport.user_id == user_id
    ).first()
    
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    if existing:
        # Withdraw vote
        db.delete(existing)
        # Reduce priority score
        complaint.priority_score = max(0, complaint.priority_score - 10)
        db.commit()
        
        # Broadcast vote update
        await manager.broadcast({"event": "vote_updated", "complaint_id": complaint_id, "delta": -1})
        return {"supported": False, "votes_count": db.query(MeTooSupport).filter(MeTooSupport.complaint_id == complaint_id).count()}
        
    # Create new support
    support = MeTooSupport(complaint_id=complaint_id, user_id=user_id)
    db.add(support)
    
    # Up priority score: each citizen vote adds +10 priority ranking weight!
    complaint.priority_score += 10
    db.commit()
    
    # Broadcast vote update
    await manager.broadcast({"event": "vote_updated", "complaint_id": complaint_id, "delta": 1})
    return {"supported": True, "votes_count": db.query(MeTooSupport).filter(MeTooSupport.complaint_id == complaint_id).count()}

# 7. Get single complaint details with updates timeline
@app.get("/api/complaints/{complaint_id}")
def get_complaint_detail(complaint_id: int, db: Session = Depends(get_db)):
    comp = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    updates = db.query(StatusUpdate).filter(StatusUpdate.complaint_id == complaint_id).order_by(desc(StatusUpdate.created_at)).all()
    votes = db.query(MeTooSupport).filter(MeTooSupport.complaint_id == complaint_id).count()
    
    return {
        "complaint": comp,
        "votes_count": votes,
        "timeline": updates
    }

# 8. Government Dashboard: Assign worker & status transitions
@app.patch("/api/complaints/{complaint_id}/assign")
async def assign_worker(complaint_id: int, worker_id: str, department: str, db: Session = Depends(get_db)):
    comp = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    comp.assigned_worker_id = worker_id
    comp.assigned_department = department
    comp.status = ResolutionStatus.ASSIGNED
    db.commit()
    
    # Create timeline log
    log = StatusUpdate(
        complaint_id=complaint_id,
        officer_name="Municipal Administrator Dispatcher",
        comment=f"Complaint assigned to Department: {department}. Assigned Field Representative ID: {worker_id}.",
        eta=datetime.datetime.utcnow() + datetime.timedelta(days=3)
    )
    db.add(log)
    db.commit()
    
    # Broadcast update
    await manager.broadcast({"event": "status_changed", "complaint_id": complaint_id, "status": "assigned"})
    return comp

# 9. Government Dashboard: Post officer comments / status updates
@app.post("/api/complaints/{complaint_id}/updates")
async def add_officer_update(complaint_id: int, update: StatusUpdateSchema, db: Session = Depends(get_db)):
    comp = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    comp.status = update.new_status
    
    eta_val = None
    if update.eta_days:
        eta_val = datetime.datetime.utcnow() + datetime.timedelta(days=update.eta_days)
        
    log = StatusUpdate(
        complaint_id=complaint_id,
        officer_name=update.officer_name,
        comment=update.comment,
        progress_image_url=update.progress_image_url,
        eta=eta_val
    )
    db.add(log)
    db.commit()
    
    # Broadcast update
    await manager.broadcast({"event": "status_changed", "complaint_id": complaint_id, "status": update.new_status})
    return log

# 10. AI before/after proof verification endpoint
@app.post("/api/complaints/{complaint_id}/verify-resolution")
async def verify_proof_resolution(complaint_id: int, payload: VerificationSchema, db: Session = Depends(get_db)):
    comp = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    # Compute OpenCV alignment Homography / SSIM checks
    cv_result = AIPipelineService.verify_resolution(comp.before_image_url, payload.after_image_url)
    
    if cv_result["verified"]:
        comp.status = ResolutionStatus.RESOLVED
        comp.after_image_url = payload.after_image_url
        comp.updated_at = datetime.datetime.utcnow()
        db.commit()
        
        # Add success history log
        log = StatusUpdate(
            complaint_id=complaint_id,
            officer_name="AI Automated Verifier Engine",
            comment=f"Resolution VERIFIED via CV SSIM and Homography. SSIM Score: {cv_result['ssim_similarity']}. Bounding Box Defect cleared.",
            progress_image_url=payload.after_image_url
        )
        db.add(log)
        
        # Award reputation boost to citizen for filing an actual verified issue!
        reporter = db.query(User).filter(User.id == comp.reported_by).first()
        if reporter:
            reporter.reputation_points += 50 # massive points for resolved report!
            
        db.commit()
        
        # Broadcast resolved event
        await manager.broadcast({"event": "resolved", "complaint_id": complaint_id, "after_image": payload.after_image_url})
    
    return {
        "status": "success",
        "result": cv_result
    }

# 11. Gov Dashboard: Overall Analytics & Zonal summaries
@app.get("/api/dashboard/analytics")
def get_dashboard_analytics(db: Session = Depends(get_db)):
    total = db.query(Complaint).count()
    solved = db.query(Complaint).filter(Complaint.status == ResolutionStatus.RESOLVED).count()
    under_review = db.query(Complaint).filter(Complaint.status == ResolutionStatus.UNDER_REVIEW).count()
    assigned = db.query(Complaint).filter(Complaint.status == ResolutionStatus.ASSIGNED).count()
    in_progress = db.query(Complaint).filter(Complaint.status == ResolutionStatus.IN_PROGRESS).count()
    reported = db.query(Complaint).filter(Complaint.status == ResolutionStatus.REPORTED).count()
    emergencies = db.query(Complaint).filter(Complaint.is_emergency == True, Complaint.status != ResolutionStatus.RESOLVED).count()
    
    # Calculate response efficiency by department
    depts = ["Roads & Highways Department", "Sanitation & Solid Waste Department", "Electricity & Public Lighting Department", "Storm Water & Drainage Board"]
    dept_efficiency = {}
    for d in depts:
        d_total = db.query(Complaint).filter(Complaint.assigned_department == d).count()
        d_solved = db.query(Complaint).filter(Complaint.assigned_department == d, Complaint.status == ResolutionStatus.RESOLVED).count()
        rate = round((d_solved / d_total * 100), 1) if d_total > 0 else 100.0
        dept_efficiency[d] = {
            "total": d_total,
            "solved": d_solved,
            "efficiency_rate": rate
        }
        
    # AI Zonal Summary text generation
    zones = ["Coimbatore Central", "RS Puram Zone", "Peelamedu Corridor", "Gandhipuram Flood Zone"]
    summary_logs = f"AI Daily Summary: Detected {total} complaints across Coimbatore today. " \
                   f"{emergencies} hazardous situations flagged for rapid dispatch. " \
                   f"Garbage and drainage blockages are clustering heavy near the Gandhipuram corridor."
                   
    return {
        "counts": {
            "total": total,
            "solved": solved,
            "under_review": under_review,
            "assigned": assigned,
            "in_progress": in_progress,
            "reported": reported,
            "emergencies": emergencies
        },
        "department_efficiency": dept_efficiency,
        "ai_daily_summary": summary_logs
    }

# --- WEBSOCKET CHANNEL ---
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Maintain connection alive, receive clients signals if any
            data = await websocket.receive_text()
            # Respond back to confirm link
            await websocket.send_json({"pong": True})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
