from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()  # Ajouter les parenthèses pour créer une instance de DefaultRouter
router.register(r'clients', views.ClientViewset, basename='clients')
router.register(r'recettes', views.RecetteViewset, basename='recettes')
router.register(r'paiements', views.PaiementViewset, basename='paiements')
router.register(r'rapports', views.RapportViewset, basename='rapports')
router.register(r'dossierDeRecouvrements', views.DossierDeRecouvrementViewsset, basename='dossierDeRecouvrements')

urlpatterns = [
    path('api/', include(router.urls)),
]
