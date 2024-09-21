FROM python:3.8-slim

WORKDIR /api

ADD . /api

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["python", "./app.py"]