from rest_framework import viewsets, serializers, permissions, status
from .models import Usuario, Ong, Animal, Candidatura, TutorAnimal
from .serializers import UsuarioSerializer, OngSerializer, AnimalSerializer, CandidaturaSerializer, TutorAnimalSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.utils import timezone


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [permissions.IsAuthenticated()]

class OngViewSet(viewsets.ModelViewSet):
    queryset = Ong.objects.all()
    serializer_class = OngSerializer
    permission_classes = [IsAuthenticated]

class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        try:
            ong = Ong.objects.get(usuario=self.request.user)
            serializer.save(ong=ong)
        except Ong.DoesNotExist:
            raise serializers.ValidationError("Usuário não está vinculado a uma ONG.")


class CandidaturaViewSet(viewsets.ModelViewSet):
    queryset = Candidatura.objects.all()
    serializer_class = CandidaturaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if getattr(self, 'swagger_fake_view', False):
            return Candidatura.objects.none()

        if user.tipo == 'tutor':
            return Candidatura.objects.filter(adotante=user)

        elif user.tipo == 'ong':
            return Candidatura.objects.filter(animal__ong__usuario=user)

        return Candidatura.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(adotante=self.request.user)


    @action(detail=True, methods=['patch'], url_path='aprovar')
    def aprovar(self, request, pk=None):
        candidatura = self.get_object()

        if candidatura.status != 'pendente':
            return Response({'detail': 'Candidatura já processada.'}, status=400)

        candidatura.status = 'aprovada'
        candidatura.save()

        TutorAnimal.objects.create(
            tutor=candidatura.adotante,
            animal=candidatura.animal,
            data_inicio_responsabilidade=timezone.now(),  # ou datetime.date.today()
            observacoes=''
        )

        return Response({'detail': 'Candidatura aprovada com sucesso.'})
    
    @action(detail=True, methods=['patch'], url_path='rejeitar')
    def rejeitar(self, request, pk=None):
        candidatura = self.get_object()

        if candidatura.status != 'pendente':
            return Response({'detail': 'Candidatura já processada.'}, status=400)

        candidatura.status = 'rejeitada'
        candidatura.save()

        return Response({'detail': 'Candidatura rejeitada com sucesso.'})

class TutorAnimalViewSet(viewsets.ModelViewSet):
    queryset = TutorAnimal.objects.all()
    serializer_class = TutorAnimalSerializer
    permission_classes = [IsAuthenticated]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'tipo': user.tipo,
        'email': user.email,
    })