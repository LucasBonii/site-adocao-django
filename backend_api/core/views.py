from rest_framework import viewsets, serializers, permissions, status
from .models import Usuario, Ong, Animal, Candidatura, TutorAnimal
from .serializers import UsuarioSerializer, OngSerializer, AnimalSerializer, CandidaturaSerializer, TutorAnimalSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from rest_framework.exceptions import ValidationError, PermissionDenied
from .permissions import IsOng, IsTutor, IsOngDonaDoAnimal
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

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsOng]
        else:
            permission_classes = [IsAuthenticated]
        return [p() for p in permission_classes]
    
    def get_queryset(self):
        user = self.request.user
        if user.tipo == 'admin':
            return Animal.objects.all()
        elif user.tipo == 'ong':
            try:
                ong = Ong.objects.get(usuario=user)
                return Animal.objects.filter(ong=ong)
            except Ong.DoesNotExist:
                return Animal.objects.none()
        elif user.tipo == 'tutor':
            return Animal.objects.filter(status='Disponível')
        return Animal.objects.none()

    def perform_create(self, serializer):
        try:
            ong = Ong.objects.get(usuario=self.request.user)
            serializer.save(ong=ong)
        except Ong.DoesNotExist:
            raise serializers.ValidationError("Usuário não está vinculado a uma ONG.")


class CandidaturaViewSet(viewsets.ModelViewSet):
    queryset = Candidatura.objects.all()
    serializer_class = CandidaturaSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsTutor]
        elif self.action in ['aprovar', 'rejeitar']:
            permission_classes = [IsOngDonaDoAnimal]
        else:
            permission_classes = [IsAuthenticated]
        return [p() for p in permission_classes]

    def get_queryset(self):
        user = self.request.user

        if getattr(self, 'swagger_fake_view', False):
            return Candidatura.objects.none()

        if user.tipo == 'tutor':
            return Candidatura.objects.filter(adotante=user)

        elif user.tipo == 'ong':
            return Candidatura.objects.filter(animal__ong__usuario=user)
        
        elif user.tipo == 'admin':
            return Candidatura.objects.all()
        
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
            data_inicio_responsabilidade=timezone.now(),  
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def meus_animais_adotados(request):
    user = request.user
    if user.tipo == 'admin':
        tutor_animais = TutorAnimal.objects.all()
    else:
        tutor_animais = TutorAnimal.objects.filter(tutor=user)

    data = [{
        'id': ta.animal.id,
        'nome': ta.animal.nome,
        'especie': ta.animal.especie,
        'porte': ta.animal.porte,
        'sexo': ta.animal.sexo,
        'idade': ta.animal.idade,
        'descricao': ta.animal.descricao,
        'data_inicio_responsabilidade': ta.data_inicio_responsabilidade,
        'tutor_id': ta.tutor.id,
        'observacoes': ta.observacoes,
    } for ta in tutor_animais]

    return Response(data)