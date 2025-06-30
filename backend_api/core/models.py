from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    TIPO_USUARIO = (
        ('admin', 'Admin'),
        ('ong', 'ONG'),
        ('tutor', 'Tutor')
    )
    tipo = models.CharField(max_length=10, choices=TIPO_USUARIO)
    telefone = models.CharField(max_length=20)
    cidade = models.CharField(max_length=100)
    estado = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.username} - {self.tipo}'

class Ong(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    cnpj = models.CharField(max_length=20)
    descricao = models.TextField()

    def __str__(self):
        return self.descricao

class Animal(models.Model):
    nome = models.CharField(max_length=100)
    especie = models.CharField(max_length=50)
    porte = models.CharField(max_length=50)
    sexo = models.CharField(max_length=10)
    idade = models.IntegerField()
    descricao = models.TextField()
    status = models.CharField(max_length=50)
    ong = models.ForeignKey(Ong, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.nome} - {self.especie} - {self.ong} || {self.status}'

class Candidatura(models.Model):
    adotante = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE)
    data_candidatura = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=50)
    justificativa = models.TextField()

class TutorAnimal(models.Model):
    tutor = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE)
    data_inicio_responsabilidade = models.DateField()
    observacoes = models.TextField()

    def __str__(self):
        return f'{self.animal} - {self.tutor}'
