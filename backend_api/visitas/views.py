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

    def get(self, request):
        user = request.user
        if user.tipo not in ['ong', 'admin']:
            raise PermissionDenied("Apenas ONGs ou administradores podem acessar esta rota.")

        try:
            visitas_collection = self._get_mongo_collection()

            if user.tipo == 'ong':
                visitas = list(visitas_collection.find(
                    {"ong_id": str(user.id)}, {"_id": 0}
                ))
            else:  # admin
                visitas = list(visitas_collection.find({}, {"_id": 0}))

            return Response(visitas)
        except Exception as e:
            return Response({"erro": str(e)}, status=500)

    def post(self, request):
        user = request.user
        if user.tipo != 'ong':
            raise PermissionDenied("Apenas ONGs podem registrar visitas.")

        data_enviada = request.data.get("data")
        data_visita = data_enviada if data_enviada else date.today().isoformat()

        data = {
            "tutor_nome": request.data.get("tutor_nome"),
            "animal_nome": request.data.get("animal_nome"),
            "observacoes": request.data.get("observacoes", ""),
            "data": data_visita,
            "ong_id": str(user.id),
            "ong_email": user.email,
        }

        try:
            self._get_mongo_collection().insert_one(data)
            return Response({"mensagem": "Visita registrada com sucesso!"}, status=201)
        except Exception as e:
            return Response({"erro": str(e)}, status=500)


    def delete(self, request):
        user = request.user
        if user.tipo not in ['ong', 'admin']:
            raise PermissionDenied("Apenas ONGs ou administradores podem deletar visitas.")

        tutor_nome = request.data.get("tutor_nome")
        animal_nome = request.data.get("animal_nome")
        data_visita = request.data.get("data")

        if not tutor_nome or not animal_nome or not data_visita:
            return Response({"erro": "Dados incompletos."}, status=400)

        query = {
            "tutor_nome": tutor_nome,
            "animal_nome": animal_nome,
            "data": data_visita
        }

        if user.tipo == 'ong':
            query["ong_id"] = str(user.id)

        result = self._get_mongo_collection().delete_one(query)

        if result.deleted_count == 0:
            return Response({"erro": "Visita não encontrada."}, status=404)

        return Response({"mensagem": "Visita deletada com sucesso."}, status=200)

    def put(self, request):
        user = request.user
        if user.tipo != 'ong':
            raise PermissionDenied("Apenas ONGs podem editar visitas.")

        tutor_nome_antigo = request.data.get("tutor_nome_antigo")
        animal_nome_antigo = request.data.get("animal_nome_antigo")
        data_antiga = request.data.get("data_antiga")

        if not tutor_nome_antigo or not animal_nome_antigo or not data_antiga:
            return Response({"erro": "Campos de identificação ausentes."}, status=400)

        filtro = {
            "tutor_nome": tutor_nome_antigo,
            "animal_nome": animal_nome_antigo,
            "data": data_antiga,
            "ong_id": str(user.id)
        }

        
        novos_dados = {
            "tutor_nome": request.data.get("tutor_nome"),
            "animal_nome": request.data.get("animal_nome"),
            "observacoes": request.data.get("observacoes", ""),
            "data": request.data.get("data"),  
            "ong_id": str(user.id),
            "ong_email": user.email,
        }

        result = self._get_mongo_collection().update_one(filtro, {"$set": novos_dados})

        if result.matched_count == 0:
            return Response({"erro": "Visita não encontrada."}, status=404)

        return Response({"mensagem": "Visita atualizada com sucesso."}, status=200)
