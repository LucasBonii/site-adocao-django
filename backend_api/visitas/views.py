from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient
from datetime import date
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied



class VisitaAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def _get_mongo_collection(self):
        client = MongoClient("mongodb://localhost:27017/")
        db = client["adocao_nosql"]
        return db.visitas

    @swagger_auto_schema(
        operation_description="Lista visitas registradas no MongoDB pela ONG logada",
        responses={200: 'Lista de visitas'}
    )
    def get(self, request):
        user = request.user
        if user.tipo != 'ong':
            raise PermissionDenied("Apenas ONGs podem acessar esta rota.")

        try:
            visitas_collection = self._get_mongo_collection()
            visitas = list(visitas_collection.find(
                {"ong_id": str(user.id)}, {"_id": 0}
            ))
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
        responses={201: 'Visita registrada'}
    )
    def post(self, request):
        user = request.user
        if user.tipo != 'ong':
            raise PermissionDenied("Apenas ONGs podem registrar visitas.")

        data = {
            "tutor_nome": request.data.get("tutor_nome"),
            "animal_nome": request.data.get("animal_nome"),
            "observacoes": request.data.get("observacoes", ""),
            "data": date.today().isoformat(),
            "ong_id": str(user.id),  
            "ong_email": user.email,  
        }

        try:
            visitas_collection = self._get_mongo_collection()
            visitas_collection.insert_one(data)
            return Response({"mensagem": "Visita registrada com sucesso!"}, status=201)
        except Exception as e:
            return Response({"erro": str(e)}, status=500)