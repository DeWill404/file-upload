from operator import is_
from sqlalchemy import (
    TIMESTAMP,
    Boolean,
    Column,
    Enum,
    ForeignKey,
    Integer,
    Float,
    String,
    text,
)
from sqlalchemy.orm import relationship

from ..model.shared_enum import FileAccessEnum, FileUploadEnum
from ..core.database import Base


class User(Base):
    __tablename__ = "User"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(50), nullable=False)
    email = Column(String(50), nullable=False, unique=True)
    password = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))

    files = relationship("File", back_populates="creator", cascade="all, delete-orphan")
    files_access = relationship(
        "FileAccessList", back_populates="user", cascade="all, delete-orphan"
    )


class File(Base):
    __tablename__ = "File"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(256), nullable=False)
    size = Column(Float, nullable=False)
    url = Column(String(256), nullable=True)
    creator_id = Column(
        Integer, ForeignKey("User.id", ondelete="CASCADE"), nullable=False
    )
    is_public = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))

    creator = relationship("User", back_populates="files")
    file_status = relationship(
        "FileUploadStatus", back_populates="file", cascade="all, delete-orphan"
    )
    file_access_list = relationship(
        "FileAccessList", back_populates="file", cascade="all, delete-orphan"
    )


class FileUploadStatus(Base):
    __tablename__ = "FileUploadStatus"

    id = Column(Integer, primary_key=True, nullable=False)
    file_id = Column(Integer, ForeignKey("File.id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum(FileUploadEnum), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))

    file = relationship("File", back_populates="file_status")


class FileAccessList(Base):
    __tablename__ = "FileAccessList"

    id = Column(Integer, primary_key=True, nullable=False)
    file_id = Column(Integer, ForeignKey("File.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("User.id", ondelete="CASCADE"), nullable=False)
    access_type = Column(Enum(FileAccessEnum), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))

    file = relationship("File", back_populates="file_access_list")
    user = relationship("User", back_populates="files_access")
