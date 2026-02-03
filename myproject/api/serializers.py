from rest_framework import serializers
from .models import Client, Recette, Paiement, Rapport, DossierDeRecouvrement


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class RecetteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recette
        fields = '__all__'

class PaiementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paiement
        fields = '__all__'

class RapportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rapport
        fields = '__all__'

class DossierDeRecouvrementSerializer(serializers.ModelSerializer):
    class Meta:
        model = DossierDeRecouvrement
        fields = '__all__'

