from fastapi.encoders import jsonable_encoder
from sqlalchemy import func, select, update
from sqlalchemy.orm import Session

from ...utils.api_response import APIResponse
from ...model.shared_enum import FileAccessEnum, FileUploadEnum
from ...model.db_model import File, FileAccessList, FileUploadStatus
from ...model.user_model import UserTokenModel
from ...model.file_model import (
    CreateFileModel,
    FileAccessModel,
    UpdateFileStatusModel,
    FileListingResponseModel,
    FileDetailsModel,
    FileUploadModel,
)


def create_file_file_status(
    fileModel: CreateFileModel, userModel: UserTokenModel, db: Session
):
    name = fileModel.name
    size = fileModel.size
    creator_id = userModel.user_id

    file = File(name=name, size=size, creator_id=creator_id)
    db.add(file)
    db.flush()

    file_status = FileUploadStatus(file_id=file.id, status=FileUploadEnum.STARTED)
    db.add(file_status)

    file_access = FileAccessList(
        file_id=file.id, user_id=creator_id, access_type=FileAccessEnum.OWENED
    )
    db.add(file_access)
    db.commit()
    db.flush()

    return APIResponse(200, data={"file_id": file.id}).send()


def update_file_upload_satus(updateStatusModel: UpdateFileStatusModel, db: Session):
    file_id = updateStatusModel.file_id
    file_status = updateStatusModel.status
    file_url = updateStatusModel.url

    fileStatusModel = db.execute(
        select(FileUploadStatus).where(FileUploadStatus.file_id == file_id)
    ).scalar_one_or_none()
    if fileStatusModel:
        fileStatusModel.status = file_status
    else:
        fileStatusModel = FileUploadStatus(file_id=file_id, status=file_status)
        db.add(fileStatusModel)

    if file_url:
        file = db.execute(select(File).where(File.id == file_id)).scalar_one_or_none()
        if file:
            file.url = file_url

    db.commit()
    db.flush()
    return APIResponse(200, msg="Status updated successfully").send()


def list_files(
    userModel: UserTokenModel, db: Session, page: int, size: int, loadUploadData: bool
) -> FileListingResponseModel:
    file_details = []
    file_uploads = []
    if loadUploadData:
        files = (
            db.execute(
                select(File)
                .where(
                    File.creator_id == userModel.user_id,
                    File.file_status.any(
                        FileUploadStatus.status != FileUploadEnum.CANCELED
                    ),
                )
                .order_by(File.created_at.desc())
            )
            .scalars()
            .all()
        )
        file_count = len(files)
    else:
        file_count = db.execute(
            select(func.count())
            .select_from(File)
            .where(
                File.creator_id == userModel.user_id,
                File.file_status.any(
                    FileUploadStatus.status != FileUploadEnum.CANCELED
                ),
            )
        ).scalar()
        files = (
            db.execute(
                select(File)
                .where(
                    File.creator_id == userModel.user_id,
                    File.file_status.any(
                        FileUploadStatus.status != FileUploadEnum.CANCELED
                    ),
                )
                .offset(page * size)
                .limit(size)
                .order_by(File.created_at.desc())
            )
            .scalars()
            .all()
        )

    for file in files:
        file_status = db.execute(
            select(FileUploadStatus).where(FileUploadStatus.file_id == file.id)
        ).scalar_one_or_none()
        file_access = (
            db.execute(select(FileAccessList).where(FileAccessList.file_id == file.id))
            .scalars()
            .all()
        )
        shared_with = [
            access.user_id
            for access in file_access
            if access.access_type != FileAccessEnum.OWENED
        ]

        file_details.append(
            FileDetailsModel(
                id=file.id,
                name=file.name,
                size=file.size,
                owner_name=userModel.name,
                upload_status=file_status.status if file_status else None,
                access=FileAccessModel(
                    is_public=file.is_public, shared_with=shared_with, url=file.url
                ),
                created_on=file.created_at,
                updated_on=file.updated_at,
                is_deleted=file.is_deleted,
            )
        )

        if (
            file_status.status != FileUploadEnum.COMPLETED
            and file_status.status != FileUploadEnum.CANCELED
        ):
            file_uploads.append(
                FileUploadModel(
                    file_id=file.id,
                    progress=0.0,
                    status=file_status.status,
                    url=file.url,
                )
            )

    return APIResponse(
        res_code=200,
        data=jsonable_encoder(
            FileListingResponseModel(
                data=file_details, uploadData=file_uploads, count=file_count
            )
        ),
    ).send()
