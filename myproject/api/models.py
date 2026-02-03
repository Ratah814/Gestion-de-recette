from django.db import models
from django.utils import timezone


         
class Recette(models.Model):

    nom_recette= models.CharField(max_length=50)
    montant= models.DecimalField(max_digits=12, decimal_places=2)
    date= models.DateField()
    etat= models.CharField(max_length=50)
    
    def valider_recette(self):
        if self.etat != 'validée':
            self.etat = 'validée'
            self.save()
            return "Recette validée avec succès !!"
        return "Recette déjà validée !!"
    
    def __str__(self):
        return self.nom_recette
    
class Client(models.Model):

    nom= models.CharField(max_length=50)
    adresse= models.CharField(max_length=100)
    telephone= models.CharField(max_length=20)
    recette = models.ForeignKey(Recette, on_delete=models.CASCADE, related_name='clients_rec', null=True)

    
    def payerTaxe(self, montant):
        try:
            montant = float(montant)
            if montant > 0:
                return f"Le client {self.nom} a payé {montant} comme taxe"
        except ValueError:
            return "Le montant entré est invalide pour le paiement de taxe !!"

    def __str__(self):
        return self.nom

class Paiement(models.Model):
   
    client= models.ForeignKey(Client, on_delete=models.CASCADE, related_name='paiement_cli')
    recette= models.ForeignKey(Recette, on_delete=models.CASCADE, related_name='paiement_rec')
    montant_a_payer= models.CharField(max_length=20)
    date_paiement= models.DateTimeField(null=True)
    
    def enregistrer_paiement(self):
        if self.date_paiement is None:
            self.date_paiement= timezone.now()
            self.save()
            return "Paiement enregistréavec succès !!"
        return "Paiement déjà enregistrer !!"
    
    def generer_quittance(self):
        return f"Quittance pour paiement {self.num_paiement}: Montant payé - {self.montant_a_payer}"
    
        
        
    
    def __str__(self):
        return self.montant_a_payer
    
class Rapport(models.Model):
  
    type_rapport= models.CharField(max_length=50)
    date_rapport= models.DateField()
    
    def transferer_fond(self, montant, destination):
        if montant >0:
            return f"Transfert de {montant} vers {destination}, effectué !"
        return "Montant invalide !"
    
class DossierDeRecouvrement(models.Model):
    
     client= models.ForeignKey(Client, on_delete=models.CASCADE, related_name='recouvrement_cli')
     statut= models.CharField(max_length=50)
     
     def mettre_a_jour(self, nouveau_statut):
         self.statut= nouveau_statut
         self.save()
         return f"Dossier {self.id_recouvrement} mis à jour !!"
     
     def engager_action_legale(self):
         return f"Action légale engager pour le dossier {self.id_recouvrement} !"
     
     def __str__(self):
         return f"Dossier  - Client {self.client.nom}"
