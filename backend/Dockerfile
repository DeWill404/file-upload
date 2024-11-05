FROM python:3.12.4

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --upgrade pip
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt  


COPY ./app /code/app

EXPOSE 80

CMD ["fastapi", "dev", "app/main.py", "--host", "0.0.0.0", "--port", "80"]