from django.contrib import admin
from django.urls import path, include
from api.views import envoyer_email,generer_rapport_pdf,generate_pdf_clients,generate_payment_pdf,dashboard_stats, top_recettes,generate_quittance


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('envoyer_email/', envoyer_email, name='envoyer_email'),
    path('pdf/', generate_pdf_clients),
    path('pdfP/', generate_payment_pdf),
    path('dashboard/', dashboard_stats),
    path('top_recettes/', top_recettes, name='top_recettes'),
    path('quittance/<int:paiement_id>/', generate_quittance, name='generate_quittance'),
    path('rapport-financier-pdf/', generer_rapport_pdf, name='rapport_financier_pdf'), 
]