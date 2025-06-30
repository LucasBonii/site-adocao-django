from django.contrib import admin

# Register your models here.
from .models import  Ong, Animal, TutorAnimal, Usuario, Candidatura

admin.site.register(Ong)
admin.site.register(Animal)
admin.site.register(TutorAnimal)
admin.site.register(Usuario)
admin.site.register(Candidatura)