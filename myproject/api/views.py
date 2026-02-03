from django.http import HttpResponse
from rest_framework import (viewsets, status)
from .models import Client, Recette, Paiement, Rapport, DossierDeRecouvrement
from .serializers import (ClientSerializer, RecetteSerializer, PaiementSerializer, RapportSerializer, DossierDeRecouvrementSerializer)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.mail import send_mail, EmailMessage
from django.db.models import Sum, Count
from django.db.models.functions import TruncDay
from django.http import FileResponse, JsonResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.units import inch
from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import A4
from django.conf import settings



class ClientViewset(viewsets.ModelViewSet):
     queryset = Client.objects.all()
     serializer_class = ClientSerializer

class RecetteViewset(viewsets.ModelViewSet):
     queryset = Recette.objects.all()
     serializer_class = RecetteSerializer

class PaiementViewset(viewsets.ModelViewSet):
     queryset = Paiement.objects.all()
     serializer_class = PaiementSerializer

class RapportViewset(viewsets.ModelViewSet):
     queryset = Rapport.objects.all()
     serializer_class = RapportSerializer

class DossierDeRecouvrementViewsset(viewsets.ModelViewSet):
     queryset = DossierDeRecouvrement.objects.all()
     serializer_class = DossierDeRecouvrementSerializer



@api_view(["POST"])
def envoyer_email(request):
    try:
        send_mail(
            'Objet de l\'email',
            'Voici le message.',
            settings.DEFAULT_FROM_EMAIL,
            ['destinataire@example.com'],
            # fail_silently=False  # À supprimer ou à remplacer
        )
        return Response({"status": "Email envoyé!"})
    except Exception as e:
        return Response({"status": "Erreur lors de l'envoi de l'email", "error": str(e)}, status=500)



def generate_pdf(request):
    # Créer un objet BytesIO pour stocker le PDF
    buffer = BytesIO()
    
    # Créer le PDF avec ReportLab
    p = canvas.Canvas(buffer, pagesize=letter)
    
    # Ajouter du contenu au PDF
    p.setFont("Helvetica", 16)
    p.drawString(100, 750, "Mon Document PDF")
    
    p.setFont("Helvetica", 12)
    p.drawString(100, 700, "Ceci est un exemple de génération de PDF avec Django.")
    p.drawString(100, 680, "Vous pouvez ajouter du texte, des images et plus encore.")
    
    # Fermer le PDF
    p.showPage()
    p.save()
    
    # Positionner le curseur au début du fichier
    buffer.seek(0)
    
    # Renvoyer le PDF comme réponse
    return FileResponse(buffer, as_attachment=True, filename='document.pdf')


def generate_pdf_clients(request):
    # Créer le buffer pour le PDF
    buffer = BytesIO()
    
    # Créer le document avec des marges personnalisées
    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(letter),
        rightMargin=50,
        leftMargin=50,
        topMargin=50,
        bottomMargin=50
    )
    
    # Préparer les éléments du PDF
    elements = []
    
    # Styles
    styles = getSampleStyleSheet()
    header_style = ParagraphStyle(
        'HeaderStyle',
        parent=styles['Heading1'],
        fontSize=16,
        textColor=colors.HexColor('#1B4F72'),
        spaceAfter=30,
        alignment=1,
    )
    
    sub_header_style = ParagraphStyle(
        'SubHeaderStyle',
        parent=styles['Normal'],
        fontSize=12,
        textColor=colors.HexColor('#2E86C1'),
        alignment=1,
        spaceAfter=20,
    )

    # En-tête
    header_text = """
    <para alignment="center">
    COMMUNE URBAINE DE FIANARANTSOA<br/>
    ------------------<br/>
    Service de Gestion des Clients
    </para>
    """
    elements.append(Paragraph(header_text, header_style))
    
    # Date
    date_text = f"Généré le : {datetime.now().strftime('%d/%m/%Y à %H:%M')}"
    elements.append(Paragraph(date_text, sub_header_style))
    elements.append(Spacer(1, 20))
    
    # Titre du tableau
    title = "LISTE DES CLIENTS ET LEURS SECTEURS"
    elements.append(Paragraph(title, header_style))
    elements.append(Spacer(1, 20))
    
    # Données du tableau
    clients = Client.objects.all()
    data = [['Nom Client', 'Adresse', 'Téléphone', 'Secteur']]
    
    for client in clients:
        data.append([
            client.nom,
            client.adresse,
            client.telephone,
            client.recette
        ])
    
    # Création et style du tableau
    table = Table(data, colWidths=[2.5*inch, 3*inch, 1.5*inch, 2*inch])
    table.setStyle(TableStyle([
        # En-tête du tableau
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1B4F72')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        
        # Corps du tableau
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('TOPPADDING', (0, 1), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#D4E6F1')),
        
        # Lignes alternées
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#EBF5FB')]),
    ]))
    
    elements.append(table)
    
    # Pied de page
    footer_style = ParagraphStyle(
        'FooterStyle',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.gray,
        alignment=1,
        spaceBefore=30,
    )
    footer_text = "Commune Urbaine de Fianarantsoa - Service de Gestion des Clients"
    elements.append(Spacer(1, 20))
    elements.append(Paragraph(footer_text, footer_style))
    
    # Construire le PDF
    doc.build(elements)
    
    # Préparer le fichier pour l'envoi
    buffer.seek(0)
    response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="liste_clients_fianarantsoa.pdf"'
    return response
def generate_payment_pdf(request):
    buffer = BytesIO()
    
    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(letter),
        rightMargin=50,
        leftMargin=50,
        topMargin=50,
        bottomMargin=50
    )
    
    elements = []
    styles = getSampleStyleSheet()
    
    # Styles personnalisés
    header_style = ParagraphStyle(
        'HeaderStyle',
        parent=styles['Heading1'],
        fontSize=16,
        textColor=colors.HexColor('#1B4F72'),
        spaceAfter=30,
        alignment=1,
    )
    
    sub_header_style = ParagraphStyle(
        'SubHeaderStyle',
        parent=styles['Normal'],
        fontSize=12,
        textColor=colors.HexColor('#2E86C1'),
        alignment=1,
        spaceAfter=20,
    )

    # En-tête
    header_text = """
    <para alignment="center">
    COMMUNE URBAINE DE FIANARANTSOA<br/>
    ------------------<br/>
    Service de Gestion des Paiements
    </para>
    """
    elements.append(Paragraph(header_text, header_style))
    
    # Date du rapport
    date_text = f"Généré le : {datetime.now().strftime('%d/%m/%Y à %H:%M')}"
    elements.append(Paragraph(date_text, sub_header_style))
    elements.append(Spacer(1, 20))
    
    # Titre
    title = "ÉTAT DES PAIEMENTS PAR CLIENT ET RECETTE"
    elements.append(Paragraph(title, header_style))
    elements.append(Spacer(1, 20))
    
    # Récupérer tous les paiements
    paiements = Paiement.objects.all().order_by('client__nom', '-date_paiement')
    
    # Préparer les données du tableau
    data = [['Client', 'Recette', 'Montant à payer', 'Date de paiement', 'État']]
    
    for paiement in paiements:
        # Formatage de la date de paiement
        date_paiement = (paiement.date_paiement.strftime('%d/%m/%Y %H:%M') 
                        if paiement.date_paiement 
                        else 'Non payé')
        
        # État du paiement
        etat = 'Payé' if paiement.date_paiement else 'En attente'
        
        data.append([
            paiement.client.nom,
            paiement.recette.nom_recette,
            f"{paiement.montant_a_payer} Ar",
            date_paiement,
            etat
        ])
    
    # Création du tableau avec largeurs de colonnes personnalisées
    table = Table(data, colWidths=[2*inch, 2*inch, 1.5*inch, 2*inch, 1.5*inch])
    
    # Style du tableau
    table.setStyle(TableStyle([
        # En-tête
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1B4F72')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        
        # Corps du tableau
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('TOPPADDING', (0, 1), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#D4E6F1')),
        
        # Lignes alternées
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#EBF5FB')]),
    ]))
    
    elements.append(table)
    
    # Résumé des paiements
    elements.append(Spacer(1, 30))
    
    # Statistiques
    total_paiements = sum(float(p.montant_a_payer) for p in paiements)
    paiements_effectues = len([p for p in paiements if p.date_paiement])
    paiements_en_attente = len([p for p in paiements if not p.date_paiement])
    
    stats_style = ParagraphStyle(
        'StatsStyle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#2E86C1'),
        spaceBefore=10,
    )
    
    stats = [
        f"Total des paiements: {total_paiements:,.2f} Ar",
        f"Nombre de paiements effectués: {paiements_effectues}",
        f"Nombre de paiements en attente: {paiements_en_attente}"
    ]
    
    for stat in stats:
        elements.append(Paragraph(stat, stats_style))
    
    # Pied de page
    footer_style = ParagraphStyle(
        'FooterStyle',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.gray,
        alignment=1,
        spaceBefore=30,
    )
    footer_text = "Commune Urbaine de Fianarantsoa - Service de Gestion des Paiements"
    elements.append(Spacer(1, 20))
    elements.append(Paragraph(footer_text, footer_style))
    
    # Générer le PDF
    doc.build(elements)
    buffer.seek(0)
    
    return FileResponse(buffer, as_attachment=True, filename='etat_paiements.pdf')

@api_view(['GET'])
def dashboard_stats(request):
    total_recette_data = Recette.objects.aggregate(Sum('montant'))
    print("Réultat aggregate:", total_recette_data)
    
    total_recette = total_recette_data
    nombre_clients = Client.objects.count()
    paiements_reussis = Paiement.objects.count()
    total_fonds_payes_data = Paiement.objects.aggregate(Sum('montant_a_payer'))
    print("Fonds payés:", total_fonds_payes_data)
    
    total_fonds_payes =total_fonds_payes_data 
    
    return Response({
        "total_recette": total_recette['montant__sum'],
        "nombre_clients": nombre_clients,      
        "paiements_reussis": paiements_reussis,
        "total_fonds_payes": total_fonds_payes['montant_a_payer__sum']
    })

@api_view(['GET'])
def top_recettes(request):
    recettes = (
        Paiement.objects.values('recette__nom_recette')  # Vérifie que "nom_recette" existe bien !
        .annotate(nombre_paiements=Count('id'))  # ✅ Définit le bon champ
        .order_by("-nombre_paiements")[:5]  # ✅ Trie correctement
    )
    
    # Convertir la liste en JSON
    data = [
        {
            "nom_recette": entry["recette__nom_recette"],
            "nombre_paiements": entry["nombre_paiements"],  # ✅ Utilise la bonne clé
        }
        for entry in recettes
    ]
    
    return Response(data)
 
@api_view(['GET'])
def generate_quittance(request, paiement_id):
    # Récupérer le paiement
    try:
        paiement = Paiement.objects.get(id=paiement_id)
    except Paiement.DoesNotExist:
        return HttpResponse("Paiement introuvable", status=404)

    client = Client.objects.get(id=paiement.client.id)
    recette = Recette.objects.get(id=paiement.recette.id)

    # Créer le buffer
    buffer = BytesIO()
    
    # Créer le document PDF
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=50,
        leftMargin=50,
        topMargin=50,
        bottomMargin=50
    )
    
    # Styles
    styles = getSampleStyleSheet()
    header_style = ParagraphStyle(
        'HeaderStyle',
        parent=styles['Heading1'],
        fontSize=16,
        textColor=colors.HexColor('#1B4F72'),
        spaceAfter=20,
        alignment=1,
    )
    
    sub_header_style = ParagraphStyle(
        'SubHeaderStyle',
        parent=styles['Normal'],
        fontSize=12,
        textColor=colors.HexColor('#2E86C1'),
        alignment=1,
        spaceAfter=20,
    )

    normal_style = styles['Normal']
    
    # Contenu du PDF
    elements = []

    # En-tête
    header_text = """
    <para alignment="center">
    COMMUNE URBAINE DE FIANARANTSOA<br/>
    ------------------<br/>
    QUITTANCE DE PAIEMENT
    </para>
    """
    elements.append(Paragraph(header_text, header_style))
    
    # Date de génération
    date_text = f"Généré le : {datetime.now().strftime('%d/%m/%Y à %H:%M')}"
    elements.append(Paragraph(date_text, sub_header_style))
    elements.append(Spacer(1, 20))

    # Détails du paiement
    data = [
        ["Client :", client.nom],
        ["Recette :", recette.nom_recette],
        ["Montant payé :", f"{paiement.montant_a_payer} MGA"],
        ["Date de paiement :", paiement.date_paiement.strftime('%d/%m/%Y') if paiement.date_paiement else "Non renseignée"],
    ]
    
    table = Table(data, colWidths=[150, 300])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1B4F72')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('TOPPADDING', (0, 1), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#D4E6F1')),
    ]))
    
    elements.append(table)
    
    # Pied de page
    footer_style = ParagraphStyle(
        'FooterStyle',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.gray,
        alignment=1,
        spaceBefore=30,
    )
    footer_text = "Commune Urbaine de Fianarantsoa - Service de Gestion des Paiements"
    elements.append(Spacer(1, 20))
    elements.append(Paragraph(footer_text, footer_style))
    
    # Générer le PDF
    doc.build(elements)
    
    # Préparer la réponse HTTP
    buffer.seek(0)
    response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="quittance_{paiement.id}.pdf"'
    return response

def parse_date(date_str):
    """Fonction pour analyser une chaîne de date et la convertir en objet datetime"""
    return datetime.strptime(date_str, '%Y-%m-%d')


def generer_rapport_pdf(request):
    date_debut = request.GET.get('date_debut')
    date_fin = request.GET.get('date_fin')

    if not date_debut or not date_fin:
        return HttpResponse("Veuillez fournir les deux dates", status=400)

    # Parse des dates
    date_debut = parse_date(date_debut)
    date_fin = parse_date(date_fin)

    # Récupérer les données des recettes et paiements
    recettes = Recette.objects.filter(date__range=[date_debut, date_fin])
    paiements = Paiement.objects.filter(date_paiement__range=[date_debut, date_fin])

    total_recettes = recettes.aggregate(Sum('montant'))['montant__sum'] or 0
    total_paiements = paiements.aggregate(Sum('montant_a_payer'))['montant_a_payer__sum'] or 0

    # Création de la réponse PDF
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="rapport_financier_{date_debut}_{date_fin}.pdf"'

    # Configuration du canvas pour générer le PDF
    p = canvas.Canvas(response, pagesize=letter)
    width, height = letter

    # Style d'en-tête
    styles = getSampleStyleSheet()
    header_style = styles['Title']
    sub_header_style = styles['Normal']

    # 1. Ajouter l'en-tête personnalisé
    header_text = """
    <para alignment="center">
    COMMUNE URBAINE DE FIANARANTSOA<br/>
    ------------------<br/>
    QUITTANCE DE PAIEMENT
    </para>
    """
    p.setFont("Helvetica", 12)
    p.drawString(200, height - 50, "COMMUNE URBAINE DE FIANARANTSOA")
    p.drawString(200, height - 70, "------------------")
    p.drawString(200, height - 90, "QUITTANCE DE PAIEMENT")

    # 2. Ajouter la date de génération
    p.setFont("Helvetica", 10)
    date_text = f"Généré le : {datetime.now().strftime('%d/%m/%Y à %H:%M')}"
    p.drawString(100, height - 130, date_text)

    # 3. Ajouter les détails financiers
    p.setFont("Helvetica-Bold", 12)
    p.drawString(100, height - 150, f"Période: {date_debut} - {date_fin}")
    p.drawString(100, height - 170, f"Total Recettes: {total_recettes} MGA")
    p.drawString(100, height - 190, f"Total Paiements: {total_paiements} MGA")

    # 4. Ajouter les détails des recettes
    p.setFont("Helvetica-Bold", 12)
    p.drawString(100, height - 220, "Détails des Recettes:")

    y = height - 240
    p.setFont("Helvetica", 10)
    for recette in recettes:
        p.drawString(100, y, f"{recette.date} - {recette.nom_recette} : {recette.montant} MGA")
        y -= 15

    # 5. Ajouter les détails des paiements
    p.setFont("Helvetica-Bold", 12)
    y -= 30
    p.drawString(100, y, "Détails des Paiements:")

    y -= 20
    p.setFont("Helvetica", 10)
    for paiement in paiements:
        p.drawString(100, y, f"{paiement.date_paiement} - Client {paiement.client.nom} : {paiement.montant_a_payer} MGA")
        y -= 15

    # Génération du PDF
    p.showPage()
    p.save()

    return response