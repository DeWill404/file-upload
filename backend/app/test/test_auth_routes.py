import random
import string
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import get_db
from sqlalchemy.orm import Session

client = TestClient(app)


@pytest.fixture
def db_session():
    db = next(get_db())
    yield db
    db.close()


def generate_random_email(domain="example.com"):
    username_length = 8
    username = "".join(
        random.choices(string.ascii_lowercase + string.digits, k=username_length)
    )
    return f"{username}@{domain}"


# Example usage
random_email = "test." + generate_random_email()


def test_signup_user(db_session: Session):
    response = client.post(
        "/auth/signup",
        json={
            "name": "testuser",
            "email": random_email,
            "password": "password123",
        },
    )
    print(response.json())
    assert response.status_code == 200
    assert response.json()["message"] == "Signup Successful"
    assert "token" in response.json()["data"]


def test_login_user(db_session: Session):
    response = client.post(
        "/auth/login", json={"email": random_email, "password": "password123"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Login Successful"
    assert "token" in response.json()["data"]
