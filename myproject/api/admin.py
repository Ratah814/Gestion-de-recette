from django.contrib import admin
from .models import Recette, Paiement, Rapport, DossierDeRecouvrement, Client


admin.site.register(Recette)
admin.site.register(Paiement)
admin.site.register(Rapport)
admin.site.register(DossierDeRecouvrement)
admin.site.register(Client)