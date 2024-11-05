import email
from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ...api.file_upload.helper import (
    create_file_file_status,
    update_file_upload_satus,
    list_files,
)
from ...core.authentication import get_current_user
from ...utils.api_response import APIResponse
from ...model.user_model import UserTokenModel
from ...model.file_model import (
    CreateFileModel,
    UpdateFileStatusModel,
    FileListingResponseModel,
)
from ...core.database import get_db

router = APIRouter(prefix="/files")


@router.post("/create")
def create_file(
    fileModel: CreateFileModel,
    user: UserTokenModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_file_file_status(fileModel, user, db)


@router.put("/update-status")
def update_file_status(
    fileStatusModel: UpdateFileStatusModel,
    user: UserTokenModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return update_file_upload_satus(fileStatusModel, db)


@router.get("/list", response_model=FileListingResponseModel)
def get_files(
    user: UserTokenModel = Depends(get_current_user),
    db: Session = Depends(get_db),
    page: int = Query(1),
    size: int = Query(10),
    loadUploadData: bool = Query(False),
):
    return list_files(user, db, page, size, loadUploadData)
