from rest_framework import serializers
from .models import Usuario, Ong, Animal, Candidatura, TutorAnimal
from django.contrib.auth import get_user_model

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = '__all__'

class OngSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ong
        fields = '__all__'

class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = '__all__'

class CandidaturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidatura
        fields = '__all__'

class TutorAnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorAnimal
        fields = '__all__'