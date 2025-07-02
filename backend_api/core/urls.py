from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, OngViewSet, AnimalViewSet, CandidaturaViewSet, TutorAnimalViewSet

from .views import me_view, meus_animais_adotados

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'ongs', OngViewSet)
router.register(r'animais', AnimalViewSet)
router.register(r'candidaturas', CandidaturaViewSet)
router.register(r'tutores-animais', TutorAnimalViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('me/', me_view),
    path('meus-animais-adotados/', meus_animais_adotados),
]
