from rest_framework import serializers
from .models import Usuario, Ong, Animal, Candidatura, TutorAnimal

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'password', 'tipo']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return Usuario.objects.create_user(**validated_data)


class OngSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='usuario.email', read_only=True)
    usuario = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Ong
        fields = '__all__'

class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = '__all__'
        read_only_fields = ['ong']

class CandidaturaSerializer(serializers.ModelSerializer):
    animal = serializers.PrimaryKeyRelatedField(queryset=Animal.objects.all(), write_only=True)
    animal_info = serializers.SerializerMethodField(read_only=True)
    adotante = serializers.SerializerMethodField()
    class Meta:
        model = Candidatura
        fields = ['id', 'animal', 'justificativa', 'status', 'data_candidatura', 'adotante', 'animal_info']
        read_only_fields = ['status', 'data_candidatura']

    def get_animal_info(self, obj):
        return {
            'id': obj.animal.id,
            'nome': obj.animal.nome
        }

    def get_adotante(self, obj):
        return {
            'id': obj.adotante.id,
            'username': obj.adotante.username
        }

class TutorAnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorAnimal
        fields = '__all__'