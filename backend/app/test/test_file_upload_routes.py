import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import get_db
from sqlalchemy.orm import Session

from ..model.shared_enum import FileUploadEnum

from ..core.authentication import create_access_token


client = TestClient(app)


@pytest.fixture
def db_session():
    db = next(get_db())
    yield db
    db.close()


@pytest.fixture
def user_token():
    return create_access_token(
        {"sub": "test@example.com", "user_id": "2", "name": "name"}
    )


def test_create_file(db_session: Session, user_token: str):
    response = client.post(
        "/files/create",
        json={"name": "testfile", "size": 1234},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 200
    assert "file_id" in response.json()["data"]


def test_update_file_status(db_session: Session, user_token: str):
    response = client.put(
        "/files/update-status",
        json={
            "file_id": 1,
            "status": FileUploadEnum.COMPLETED.value,
            "url": "http://example.com/file",
        },
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 200


def test_list_files(db_session: Session, user_token: str):
    response = client.get(
        "/files/list",
        headers={"Authorization": f"Bearer {user_token}"},
        params={"page": 1, "size": 10, "loadUploadData": False},
    )
    assert response.status_code == 200
    assert "data" in response.json()
