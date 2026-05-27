import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Table, Enum
from sqlalchemy.orm import relationship, declarative_base
import enum

Base = declarative_base()

class IssueCategory(str, enum.Enum):
    POTHOLE = "pothole"
    WATER_STAGNATION = "water_stagnation"
    GARBAGE_DUMPING = "garbage_dumping"
    BROKEN_STREETLIGHT = "broken_streetlight"
    DRAINAGE_BLOCKAGE = "drainage_blockage"
    DAMAGED_ROAD = "damaged_road"
    ILLEGAL_DUMPING = "illegal_dumping"
    PUBLIC_SANITATION = "public_sanitation"

class ResolutionStatus(str, enum.Enum):
    REPORTED = "reported"
    UNDER_REVIEW = "under_review"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"

class User(Base):
    __tablename__ = "users"

    id = Column(String(255), primary_key=True)  # Firebase UID
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    avatar_url = Column(Text, nullable=True)
    reputation_points = Column(Integer, default=100)
    is_verified_citizen = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    complaints = relationship("Complaint", back_populates="reporter")
    supports = relationship("MeTooSupport", back_populates="user")

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(Enum(IssueCategory), nullable=False)
    reported_by = Column(String(255), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(Text, nullable=True)
    landmarks = Column(String(255), nullable=True)
    before_image_url = Column(Text, nullable=False)
    after_image_url = Column(Text, nullable=True)
    severity_score = Column(Integer, default=1)  # 1-10 calculated by YOLO / votes
    priority_score = Column(Integer, default=0)  # AI ranked priority queue
    status = Column(Enum(ResolutionStatus), default=ResolutionStatus.REPORTED)
    is_duplicate = Column(Boolean, default=False)
    parent_complaint_id = Column(Integer, ForeignKey("complaints.id", ondelete="SET NULL"), nullable=True)
    is_emergency = Column(Boolean, default=False)
    assigned_department = Column(String(100), nullable=True)
    assigned_worker_id = Column(String(100), nullable=True)
    reported_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    reporter = relationship("User", back_populates="complaints")
    supports = relationship("MeTooSupport", back_populates="complaint", cascade="all, delete-orphan")
    status_updates = relationship("StatusUpdate", back_populates="complaint", cascade="all, delete-orphan")

class MeTooSupport(Base):
    __tablename__ = "me_too_supports"

    id = Column(Integer, primary_key=True, autoincrement=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(255), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    complaint = relationship("Complaint", back_populates="supports")
    user = relationship("User", back_populates="supports")

class StatusUpdate(Base):
    __tablename__ = "status_updates"

    id = Column(Integer, primary_key=True, autoincrement=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False)
    officer_name = Column(String(255), nullable=False)
    comment = Column(Text, nullable=False)
    progress_image_url = Column(Text, nullable=True)
    eta = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    complaint = relationship("Complaint", back_populates="status_updates")
