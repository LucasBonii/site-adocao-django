from rest_framework import viewsets
from .models import Usuario, Ong, Animal, Candidatura, TutorAnimal
from .serializers import UsuarioSerializer, OngSerializer, AnimalSerializer, CandidaturaSerializer, TutorAnimalSerializer
from rest_framework.permissions import IsAuthenticated

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

class OngViewSet(viewsets.ModelViewSet):
    queryset = Ong.objects.all()
    serializer_class = OngSerializer
    permission_classes = [IsAuthenticated]

class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [IsAuthenticated]

class CandidaturaViewSet(viewsets.ModelViewSet):
    queryset = Candidatura.objects.all()
    serializer_class = CandidaturaSerializer
    permission_classes = [IsAuthenticated]

class TutorAnimalViewSet(viewsets.ModelViewSet):
    queryset = TutorAnimal.objects.all()
    serializer_class = TutorAnimalSerializer
    permission_classes = [IsAuthenticated]
