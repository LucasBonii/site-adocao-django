from rest_framework.permissions import BasePermission

class IsOng(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.tipo == 'ong'

class IsTutor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.tipo == 'tutor'

class IsOngDonaDoAnimal(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Aqui obj é uma candidatura
        return request.user.is_authenticated and request.user.tipo == 'ong' and obj.animal.ong.usuario == request.user
