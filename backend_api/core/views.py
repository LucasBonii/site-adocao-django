from rest_framework import viewsets, serializers, permissions, status
from .models import Usuario, Ong, Animal, Candidatura, TutorAnimal
from .serializers import UsuarioSerializer, OngSerializer, AnimalSerializer, CandidaturaSerializer, TutorAnimalSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
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
    permission_classes = [IsAuthenticated, IsOng]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsOng()]
        return [IsAuthenticated()]

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
            return Animal.objects.filter(status='disponivel')
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
            return [IsTutor()] 
        elif self.action in ['aprovar', 'rejeitar']:
            return [IsOngDonaDoAnimal()] 
        return [IsAuthenticated()]

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

        return Candidatura.objects.none()

    def perform_create(self, serializer):
        serializer.save(adotante=self.request.user)

    @action(detail=True, methods=['patch'], url_path='aprovar')
    def aprovar(self, request, pk=None):
        candidatura = self.get_object()

        if candidatura.status != 'pendente':
            return Response({'detail': 'Candidatura já processada.'}, status=400)

        candidatura.status = 'aprovada'
        candidatura.save()

        animal_adotado = candidatura.animal
        animal_adotado.status = 'indisponivel'
        animal_adotado.save()

        TutorAnimal.objects.create(
            tutor=candidatura.adotante,
            animal=candidatura.animal,
            data_inicio_responsabilidade=timezone.now(),
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
    permission_classes = [IsAuthenticated, IsTutor] 


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    user = request.user

    data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'tipo': user.tipo,
    }

    if user.tipo == 'ong':
        ong = Ong.objects.filter(usuario=user).first()
        if ong:
            data['ong'] = OngSerializer(ong).data
        else:
            data['ong'] = None
    return Response(data)


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
        'tutor_animal_id': ta.id,
        'especie': ta.animal.especie,
        'porte': ta.animal.porte,
        'sexo': ta.animal.sexo,
        'idade': ta.animal.idade,
        'descricao': ta.animal.descricao,
        'data_inicio_responsabilidade': ta.data_inicio_responsabilidade,
        'tutor_id': ta.tutor.id,
    } for ta in tutor_animais]

    return Response(data)