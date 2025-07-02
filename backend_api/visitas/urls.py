from django.urls import path
from .views import VisitaAPIView

urlpatterns = [
    path('visitas/', VisitaAPIView.as_view()),
]