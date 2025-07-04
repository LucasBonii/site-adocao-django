from rest_framework.permissions import BasePermission

class IsOng(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.tipo == 'ong' or request.user.tipo == 'admin')

class IsTutor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.tipo == 'tutor' or request.user.tipo == 'admin')

class IsOngDonaDoAnimal(BasePermission):
    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_authenticated and
            (request.user.tipo == 'ong' or request.user.tipo == 'admin') and
            obj.animal.ong.usuario == request.user
        )
