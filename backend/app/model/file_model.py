from datetime import datetime
from typing import List
from pydantic import BaseModel

from ..model.shared_enum import FileUploadEnum


class CreateFileModel(BaseModel):
    name: str
    size: float


class UpdateFileStatusModel(BaseModel):
    file_id: int
    status: FileUploadEnum
    url: str | None = None


class FileAccessModel(BaseModel):
    is_public: bool
    shared_with: List[int]
    url: str | None = None


class FileUploadModel(BaseModel):
    file_id: int
    progress: float
    status: FileUploadEnum
    url: str | None = None


class FileDetailsModel(BaseModel):
    id: int
    name: str
    size: float
    owner_name: str
    upload_status: FileUploadEnum
    access: FileAccessModel
    created_on: datetime
    updated_on: datetime
    is_deleted: bool


class FileListingResponseModel(BaseModel):
    data: List[FileDetailsModel]
    uploadData: List[FileUploadModel]
    count: int
