from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient
from datetime import date
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class VisitaAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Lista todas as visitas registradas no MongoDB",
        responses={200: 'Lista de visitas'}
    )

    def get(self, request):
        try:
            client = MongoClient("mongodb://localhost:27017/")
            db = client["adocao_nosql"]
            visitas = list(db.visitas.find({}, {"_id": 0}))  # não mostrar o _id
            return Response(visitas)
        except Exception as e:
            return Response({"erro": str(e)}, status=500)
        

    @swagger_auto_schema(
        operation_description="Registra uma nova visita",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["tutor_nome", "animal_nome"],
            properties={
                'tutor_nome': openapi.Schema(type=openapi.TYPE_STRING, description='Nome do tutor'),
                'animal_nome': openapi.Schema(type=openapi.TYPE_STRING, description='Nome do animal'),
                'observacoes': openapi.Schema(type=openapi.TYPE_STRING, description='Observações (opcional)'),
            },
        ),
        responses={201: 'Visita registrada'})

    def post(self, request):
        data = {
            "tutor_nome": request.data.get("tutor_nome"),
            "animal_nome": request.data.get("animal_nome"),
            "observacoes": request.data.get("observacoes", ""),
            "data": date.today().isoformat(),
        }
        try:
            client = MongoClient("mongodb://localhost:27017/")
            db = client["adocao_nosql"]
            db.visitas.insert_one(data)
            return Response({"mensagem": "Visita registrada com sucesso!"}, status=201)
        except Exception as e:
            return Response({"erro": str(e)}, status=500)
